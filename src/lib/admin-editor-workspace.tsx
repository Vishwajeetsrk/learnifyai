import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

export type AutosaveStatus =
  | "idle"
  | "editing"
  | "saving"
  | "saved"
  | "error"
  | "offline";

export interface StoredDraft<T = Record<string, any>> {
  module: string;
  recordId: string;
  title: string;
  data: T;
  version: number;
  updatedAt: number;
  serverSyncedAt?: number | null;
}

const STORAGE_PREFIX = "learnify_admin_draft:";
const ACTIVE_DRAFTS_INDEX_KEY = "learnify_admin_active_drafts_v1";

// ─── Lightweight IndexedDB Helper with LocalStorage Fallback ──────────────────

const DB_NAME = "learnify_admin_workspace";
const DB_VERSION = 1;
const STORE_NAME = "content_drafts";

function openDraftsDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "key" });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function idbGetDraft<T = any>(key: string): Promise<StoredDraft<T> | null> {
  // Try IndexedDB first
  try {
    const db = await openDraftsDB();
    if (db) {
      const res = await new Promise<any>((resolve) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result?.value || null);
        req.onerror = () => resolve(null);
      });
      if (res) return res as StoredDraft<T>;
    }
  } catch {
    // fallback to localStorage
  }

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw) return JSON.parse(raw) as StoredDraft<T>;
  } catch {
    // ignore
  }
  return null;
}

export async function idbSaveDraft<T = any>(
  key: string,
  draft: StoredDraft<T>
): Promise<void> {
  // Always update localStorage for synchronous fast lookup & cross-tab sync
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(draft));
    updateActiveDraftsIndex(draft as any);
  } catch (err: any) {
    // If quota exceeded in localStorage, IndexedDB will still persist it
    console.warn("localStorage quota exceeded, saving to IndexedDB only", err);
  }

  // Also persist in IndexedDB for large documents
  try {
    const db = await openDraftsDB();
    if (db) {
      await new Promise<void>((resolve) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.put({ key, value: draft });
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    }
  } catch {
    // ignore
  }
}

export async function idbDeleteDraft(key: string): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
    removeFromActiveDraftsIndex(key);
  } catch {
    // ignore
  }

  try {
    const db = await openDraftsDB();
    if (db) {
      await new Promise<void>((resolve) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.delete(key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    }
  } catch {
    // ignore
  }
}

function updateActiveDraftsIndex(draft: StoredDraft) {
  try {
    const raw = localStorage.getItem(ACTIVE_DRAFTS_INDEX_KEY);
    const list: Array<{ key: string; module: string; recordId: string; title: string; updatedAt: number }> =
      raw ? JSON.parse(raw) : [];
    const key = `${draft.module}:${draft.recordId}`;
    const filtered = list.filter((i) => i.key !== key);
    filtered.unshift({
      key,
      module: draft.module,
      recordId: draft.recordId,
      title: draft.title || `${draft.module} draft`,
      updatedAt: draft.updatedAt,
    });
    // Keep max 25 recent drafts in index
    localStorage.setItem(ACTIVE_DRAFTS_INDEX_KEY, JSON.stringify(filtered.slice(0, 25)));
  } catch {
    // ignore
  }
}

function removeFromActiveDraftsIndex(key: string) {
  try {
    const raw = localStorage.getItem(ACTIVE_DRAFTS_INDEX_KEY);
    if (!raw) return;
    const list: any[] = JSON.parse(raw);
    const filtered = list.filter((i) => i.key !== key);
    localStorage.setItem(ACTIVE_DRAFTS_INDEX_KEY, JSON.stringify(filtered));
  } catch {
    // ignore
  }
}

export function listAllActiveDrafts(): Array<{
  key: string;
  module: string;
  recordId: string;
  title: string;
  updatedAt: number;
}> {
  try {
    const raw = localStorage.getItem(ACTIVE_DRAFTS_INDEX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ─── React Hook: useAdminDraft ────────────────────────────────────────────────

export interface UseAdminDraftOptions<T> {
  module: string;
  recordId: string | "new";
  subrecordId?: string | null;
  initialData: T;
  getTitle?: (data: T) => string;
  onServerSave?: (data: T) => Promise<any>;
  autoSaveServerInterval?: number; // default 2000ms
  enabled?: boolean;
}

export function useAdminDraft<T extends Record<string, any>>({
  module,
  recordId,
  subrecordId,
  initialData,
  getTitle,
  onServerSave,
  autoSaveServerInterval = 2000,
  enabled = true,
}: UseAdminDraftOptions<T>) {
  const editorKey = subrecordId
    ? `${module}:${subrecordId}:${recordId || "new"}`
    : `${module}:${recordId || "new"}`;

  const [formData, setFormData] = useState<T>(initialData);
  const [isDirty, setIsDirty] = useState(false);
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );
  const [recoverableDraft, setRecoverableDraft] = useState<StoredDraft<T> | null>(null);

  const formDataRef = useRef<T>(formData);
  formDataRef.current = formData;

  const versionRef = useRef<number>(1);
  const localSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const serverSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingServerRef = useRef(false);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Trigger a server flush if dirty
      if (isDirty && onServerSave) {
        triggerServerSave();
      }
    };
    const handleOffline = () => {
      setIsOffline(true);
      setStatus("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isDirty, onServerSave]);

  // Synchronize when editorKey changes (e.g. switching between different items or new)
  const prevKeyRef = useRef(editorKey);
  useEffect(() => {
    if (prevKeyRef.current !== editorKey) {
      prevKeyRef.current = editorKey;
      setFormData(initialData);
      setIsDirty(false);
      setStatus("idle");
      setRecoverableDraft(null);
    }
  }, [editorKey, initialData]);

  // Load existing draft on mount or key change
  useEffect(() => {
    if (!enabled) return;

    let isMounted = true;
    async function checkExistingDraft() {
      const existing = await idbGetDraft<T>(editorKey);
      if (!isMounted || !existing) return;

      // Check if existing draft has content different from initialData
      const hasMeaningfulContent = Object.keys(existing.data || {}).some((k) => {
        const val = (existing.data as any)[k];
        return val !== undefined && val !== "" && val !== null;
      });

      if (hasMeaningfulContent) {
        // If initialData is empty or the draft is newer than 1 minute ago, offer/auto-restore
        const isDraftNewer = existing.updatedAt > Date.now() - 7 * 24 * 60 * 60 * 1000;
        if (isDraftNewer) {
          setRecoverableDraft(existing);
        }
      }
    }

    checkExistingDraft();

    return () => {
      isMounted = false;
    };
  }, [editorKey, enabled]);

  // Prompt before unload when unsaved changes exist
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "You have unsaved changes in your editor. Leave anyway?";
      return e.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  // Keyboard shortcut Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveDraftNow();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Save to LocalStorage / IndexedDB
  const persistLocally = useCallback(
    (currentData: T) => {
      versionRef.current += 1;
      const title = getTitle
        ? getTitle(currentData)
        : (currentData as any).title || `${module} draft`;

      const draft: StoredDraft<T> = {
        module,
        recordId,
        title,
        data: currentData,
        version: versionRef.current,
        updatedAt: Date.now(),
      };

      idbSaveDraft(editorKey, draft);
      setLastSavedAt(draft.updatedAt);
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setStatus("offline");
      }
    },
    [editorKey, getTitle, module, recordId]
  );

  // Server Save trigger
  const triggerServerSave = useCallback(async () => {
    if (!onServerSave || isSavingServerRef.current) return;
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setStatus("offline");
      return;
    }

    try {
      isSavingServerRef.current = true;
      setStatus("saving");
      await onServerSave(formDataRef.current);
      setStatus("saved");
      setLastSavedAt(Date.now());
      setIsDirty(false);
    } catch (err: any) {
      console.warn("Autosave to server failed (saved locally):", err);
      setStatus("error");
    } finally {
      isSavingServerRef.current = false;
    }
  }, [onServerSave]);

  // Update a single field
  const updateField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setFormData((prev) => {
        const next = { ...prev, [field]: value };
        setIsDirty(true);
        setStatus("editing");

        // Debounced local save (300ms)
        if (localSaveTimerRef.current) clearTimeout(localSaveTimerRef.current);
        localSaveTimerRef.current = setTimeout(() => {
          persistLocally(next);
        }, 300);

        // Debounced server save
        if (onServerSave) {
          if (serverSaveTimerRef.current) clearTimeout(serverSaveTimerRef.current);
          serverSaveTimerRef.current = setTimeout(() => {
            triggerServerSave();
          }, autoSaveServerInterval);
        }

        return next;
      });
    },
    [autoSaveServerInterval, onServerSave, persistLocally, triggerServerSave]
  );

  // Update multiple fields
  const updateAll = useCallback(
    (updates: Partial<T>) => {
      setFormData((prev) => {
        const next = { ...prev, ...updates };
        setIsDirty(true);
        setStatus("editing");

        if (localSaveTimerRef.current) clearTimeout(localSaveTimerRef.current);
        localSaveTimerRef.current = setTimeout(() => {
          persistLocally(next);
        }, 300);

        if (onServerSave) {
          if (serverSaveTimerRef.current) clearTimeout(serverSaveTimerRef.current);
          serverSaveTimerRef.current = setTimeout(() => {
            triggerServerSave();
          }, autoSaveServerInterval);
        }

        return next;
      });
    },
    [autoSaveServerInterval, onServerSave, persistLocally, triggerServerSave]
  );

  // Manual save immediately
  const saveDraftNow = useCallback(async () => {
    if (localSaveTimerRef.current) clearTimeout(localSaveTimerRef.current);
    if (serverSaveTimerRef.current) clearTimeout(serverSaveTimerRef.current);

    persistLocally(formDataRef.current);

    if (onServerSave && (!navigator || navigator.onLine)) {
      await triggerServerSave();
      toast.success("Draft saved");
    } else {
      setStatus(typeof navigator !== "undefined" && !navigator.onLine ? "offline" : "saved");
      toast.success("Draft saved locally");
    }
  }, [onServerSave, persistLocally, triggerServerSave]);

  // Restore recovered draft
  const restoreDraft = useCallback(() => {
    if (recoverableDraft?.data) {
      setFormData(recoverableDraft.data);
      setIsDirty(true);
      setStatus("saved");
      setLastSavedAt(recoverableDraft.updatedAt);
      setRecoverableDraft(null);
      toast.success("Draft restored from previous session!");
    }
  }, [recoverableDraft]);

  // Discard recovered draft
  const discardRecoverableDraft = useCallback(() => {
    idbDeleteDraft(editorKey);
    setRecoverableDraft(null);
    toast.info("Previous draft discarded");
  }, [editorKey]);

  // Clear draft after full publish
  const clearDraft = useCallback(() => {
    idbDeleteDraft(editorKey);
    setIsDirty(false);
    setStatus("idle");
  }, [editorKey]);

  return {
    formData,
    setFormData,
    updateField,
    updateAll,
    isDirty,
    status,
    lastSavedAt,
    isOffline,
    saveDraftNow,
    clearDraft,
    restoreDraft,
    discardRecoverableDraft,
    hasRecoverableDraft: !!recoverableDraft,
    recoverableDraft,
    recoverableDraftDate: recoverableDraft?.updatedAt
      ? new Date(recoverableDraft.updatedAt).toLocaleString()
      : null,
  };
}

// ─── Visual UI Components: AutosaveStatusBadge ────────────────────────────────

export function AutosaveStatusBadge({
  status,
  lastSavedAt,
  isDirty,
  onRetry,
  className = "",
}: {
  status: AutosaveStatus;
  lastSavedAt?: number | null;
  isDirty?: boolean;
  onRetry?: () => void;
  className?: string;
}) {
  const timeStr = lastSavedAt
    ? Math.round((Date.now() - lastSavedAt) / 1000) < 10
      ? "just now"
      : new Date(lastSavedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${className} ${
        status === "saving"
          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse"
          : status === "offline"
          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          : status === "error"
          ? "bg-red-500/10 text-red-400 border border-red-500/20"
          : isDirty
          ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "saving"
            ? "bg-indigo-400 animate-ping"
            : status === "offline"
            ? "bg-amber-400"
            : status === "error"
            ? "bg-red-400"
            : isDirty
            ? "bg-amber-400"
            : "bg-emerald-400"
        }`}
      />
      <span>
        {status === "saving"
          ? "Autosaving..."
          : status === "offline"
          ? "Offline — draft saved locally"
          : status === "error"
          ? "Save failed"
          : isDirty
          ? "Unsaved changes"
          : timeStr
          ? `Saved ${timeStr}`
          : "Draft saved"}
      </span>
      {status === "error" && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="ml-1 underline hover:text-red-300 cursor-pointer"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// ─── Visual UI Components: DraftRecoveryBanner ────────────────────────────────

export function DraftRecoveryBanner({
  date,
  hasRecoverableDraft,
  recoverableDraftDate,
  onRestore,
  onDiscard,
  currentData,
  draftData,
  moduleName,
}: {
  date?: string;
  hasRecoverableDraft?: boolean;
  recoverableDraftDate?: string | null;
  onRestore: () => void;
  onDiscard: () => void;
  currentData?: Record<string, any>;
  draftData?: Record<string, any>;
  moduleName?: string;
}) {
  const [showDiff, setShowDiff] = useState(false);
  const displayDate = date || recoverableDraftDate;
  if (hasRecoverableDraft === false || !displayDate) return null;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 mb-4 animate-in fade-in duration-200">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-300">Recovered Draft:</span>
          <span>An autosaved draft from {displayDate} was found.</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {draftData && (
            <button
              type="button"
              onClick={() => setShowDiff(true)}
              className="px-2.5 py-1 rounded-md bg-muted/60 hover:bg-muted text-foreground font-medium transition cursor-pointer border border-border/40"
            >
              Review Diff
            </button>
          )}
          <button
            type="button"
            onClick={onRestore}
            className="px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 transition cursor-pointer"
          >
            Restore Draft
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="px-2.5 py-1 rounded-md text-muted-foreground hover:text-foreground transition cursor-pointer"
          >
            Discard
          </button>
        </div>
      </div>

      {draftData && (
        <DraftDiffDialogWrapper
          open={showDiff}
          onOpenChange={setShowDiff}
          moduleName={moduleName}
          currentData={currentData || {}}
          draftData={draftData}
          draftUpdatedAt={displayDate}
          onRestoreAll={onRestore}
          onDiscardDraft={onDiscard}
        />
      )}
    </>
  );
}

// Lazy load dialog to keep editor bundle lightweight
function DraftDiffDialogWrapper(props: any) {
  const [Component, setComponent] = useState<any>(null);

  useEffect(() => {
    if (props.open && !Component) {
      import("@/components/admin/DraftDiffDialog").then((mod) => {
        setComponent(() => mod.DraftDiffDialog);
      });
    }
  }, [props.open, Component]);

  if (!props.open || !Component) return null;
  return <Component {...props} />;
}
