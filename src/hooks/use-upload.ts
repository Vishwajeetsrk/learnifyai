import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ValidatedFile, FileValidationConfig, ValidationError } from "@/lib/upload-validation";
import { validateFiles } from "@/lib/upload-validation";

export { formatFileSize, formatSpeed, formatETA } from "@/lib/upload-validation";

export type UploadStatus =
  | "pending"
  | "uploading"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export interface UploadItem {
  id: string;
  file: File;
  sanitized_name: string;
  category: string;
  preview_url?: string;
  dimensions?: { width: number; height: number };
  duration?: number;
  status: UploadStatus;
  progress: number; // 0-100
  speed: number; // bytes per second
  uploaded_bytes: number;
  total_bytes: number;
  eta: number; // seconds remaining
  error?: string;
  url?: string; // final uploaded URL
  bucket: string;
  path: string;
  retries: number;
  max_retries: number;
  controller: AbortController;
}

interface UseUploadOptions {
  bucket: string;
  pathPrefix?: string;
  config: FileValidationConfig;
  upsert?: boolean;
  onUploadComplete?: (item: UploadItem) => void;
  onAllComplete?: (items: UploadItem[]) => void;
  onError?: (item: UploadItem, error: string) => void;
}

interface UseUploadReturn {
  items: UploadItem[];
  isUploading: boolean;
  addFiles: (files: File[]) => Promise<void>;
  removeItem: (id: string) => void;
  retryItem: (id: string) => void;
  cancelItem: (id: string) => void;
  cancelAll: () => void;
  clearCompleted: () => void;
  errors: ValidationError[];
  clearErrors: () => void;
  totalProgress: number; // overall 0-100
}

export function useUpload(options: UseUploadOptions): UseUploadReturn {
  const {
    bucket,
    pathPrefix = "",
    config,
    upsert = false,
    onUploadComplete,
    onAllComplete,
    onError,
  } = options;

  const [items, setItems] = useState<UploadItem[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const itemsRef = useRef<Map<string, UploadItem>>(new Map());
  const uploadQueueRef = useRef<string[]>([]);
  const processingRef = useRef(false);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => {
        if (item.preview_url) URL.revokeObjectURL(item.preview_url);
      });
    };
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<UploadItem>) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, ...updates };
        itemsRef.current.set(id, updated);
        return updated;
      }),
    );
  }, []);

  const processQueue = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;

    while (uploadQueueRef.current.length > 0) {
      const itemId = uploadQueueRef.current.shift()!;
      const item = itemsRef.current.get(itemId);
      if (!item || item.status !== "pending") continue;

      await uploadFile(item);
    }

    processingRef.current = false;

    // Check if all done
    const allItems = Array.from(itemsRef.current.values());
    const allDone = allItems.every(
      (i) => i.status === "completed" || i.status === "failed" || i.status === "cancelled",
    );
    if (allDone && allItems.length > 0) {
      onAllComplete?.(allItems);
    }
  }, [onAllComplete]);

  const uploadFile = useCallback(
    async (item: UploadItem) => {
      updateItem(item.id, { status: "uploading", progress: 0 });

      const controller = item.controller;
      const startTime = Date.now();
      let lastLoaded = 0;
      let lastTime = startTime;

      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        // Build storage path
        const ext = item.file.name.split(".").pop() || "bin";
        const timestamp = Date.now();
        const fileName = `${timestamp}.${ext}`;
        const filePath = pathPrefix
          ? `${pathPrefix}/${user.id}/${fileName}`
          : `${user.id}/${fileName}`;

        // Get Supabase config for raw XHR upload (needed for progress events)
        const supabaseUrl =
          import.meta.env.VITE_SUPABASE_URL ??
          import.meta.env.NEXT_PUBLIC_SUPABASE_URL ??
          process.env.SUPABASE_URL ??
          process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey =
          import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
          import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
          process.env.SUPABASE_PUBLISHABLE_KEY ??
          process.env.SUPABASE_ANON_KEY ??
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        // Upload with progress tracking via XMLHttpRequest for progress events
        const url = await new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const now = Date.now();
              const elapsed = (now - startTime) / 1000;
              const speed = elapsed > 0 ? e.loaded / elapsed : 0;
              const eta = speed > 0 ? (e.total - e.loaded) / speed : 0;
              const progress = Math.round((e.loaded / e.total) * 100);

              const timeDiff = (now - lastTime) / 1000;
              if (timeDiff > 0.1) {
                const instantSpeed = (e.loaded - lastLoaded) / timeDiff;
                lastLoaded = e.loaded;
                lastTime = now;
                updateItem(item.id, {
                  progress,
                  speed: instantSpeed,
                  uploaded_bytes: e.loaded,
                  total_bytes: e.total,
                  eta: instantSpeed > 0 ? (e.total - e.loaded) / instantSpeed : 0,
                });
              } else {
                updateItem(item.id, {
                  progress,
                  speed,
                  uploaded_bytes: e.loaded,
                  total_bytes: e.total,
                  eta,
                });
              }
            }
          });

          xhr.addEventListener("load", async () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
                resolve(urlData.publicUrl);
              } catch (e) {
                reject(e);
              }
            } else {
              let msg = `Upload failed (${xhr.status})`;
              try {
                const body = JSON.parse(xhr.responseText);
                msg = body.message || msg;
              } catch {}
              reject(new Error(msg));
            }
          });

          xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
          xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));
          xhr.addEventListener("timeout", () => reject(new Error("Upload timed out")));

          xhr.open("POST", `${supabaseUrl}/storage/v1/object/${bucket}/${filePath}`);
          xhr.setRequestHeader("Authorization", `Bearer ${supabaseKey}`);
          xhr.setRequestHeader("x-upsert", upsert ? "true" : "false");
          xhr.timeout = 30 * 60 * 1000; // 30 min timeout

          const formData = new FormData();
          formData.append("file", item.file, item.sanitized_name);
          xhr.send(formData);
        });

        updateItem(item.id, {
          status: "completed",
          progress: 100,
          url,
          speed: 0,
          eta: 0,
        });

        onUploadComplete?.({ ...itemsRef.current.get(item.id)! });
      } catch (err: any) {
        const message = err?.message || "Upload failed";

        // Auto-retry on network errors (up to max_retries)
        if (
          item.retries < item.max_retries &&
          (message.includes("Network") || message.includes("timed out") || message.includes("5"))
        ) {
          updateItem(item.id, {
            retries: item.retries + 1,
            status: "pending",
            progress: 0,
            speed: 0,
            eta: 0,
            uploaded_bytes: 0,
          });
          uploadQueueRef.current.push(item.id);
          processingRef.current = false;
          processQueue();
          return;
        }

        updateItem(item.id, {
          status: "failed",
          error: message,
          speed: 0,
          eta: 0,
        });
        onError?.({ ...itemsRef.current.get(item.id)! }, message);
      }
    },
    [bucket, pathPrefix, upsert, updateItem, onUploadComplete, onError, processQueue],
  );

  const addFiles = useCallback(
    async (files: File[]) => {
      const { valid, errors: validationErrors } = await validateFiles(
        files,
        config,
        itemsRef.current.size,
      );

      if (validationErrors.length > 0) {
        setErrors((prev) => [...prev, ...validationErrors]);
        validationErrors.forEach((err: ValidationError) => {
          toast.error(`${err.file.name}: ${err.message}`);
        });
      }

      if (valid.length === 0) return;

      const newItems: UploadItem[] = valid.map((v: ValidatedFile) => ({
        id: v.id,
        file: v.file,
        sanitized_name: v.sanitized_name,
        category: v.category,
        preview_url: v.preview_url,
        dimensions: v.dimensions,
        duration: v.duration,
        status: "pending" as UploadStatus,
        progress: 0,
        speed: 0,
        uploaded_bytes: 0,
        total_bytes: v.file.size,
        eta: 0,
        bucket,
        path: "",
        retries: 0,
        max_retries: 3,
        controller: new AbortController(),
      }));

      newItems.forEach((item) => {
        itemsRef.current.set(item.id, item);
        uploadQueueRef.current.push(item.id);
      });

      setItems((prev) => [...prev, ...newItems]);

      // Start processing
      processQueue();
    },
    [config, bucket, processQueue],
  );

  const removeItem = useCallback((id: string) => {
    const item = itemsRef.current.get(id);
    if (item) {
      item.controller.abort();
      if (item.preview_url) URL.revokeObjectURL(item.preview_url);
      itemsRef.current.delete(id);
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const retryItem = useCallback(
    (id: string) => {
      const item = itemsRef.current.get(id);
      if (!item || item.status !== "failed") return;

      updateItem(id, {
        status: "pending",
        progress: 0,
        speed: 0,
        uploaded_bytes: 0,
        eta: 0,
        error: undefined,
        retries: 0,
        controller: new AbortController(),
      });

      uploadQueueRef.current.push(id);
      processQueue();
    },
    [updateItem, processQueue],
  );

  const cancelItem = useCallback(
    (id: string) => {
      const item = itemsRef.current.get(id);
      if (item) {
        item.controller.abort();
        updateItem(id, { status: "cancelled", speed: 0, eta: 0 });
      }
    },
    [updateItem],
  );

  const cancelAll = useCallback(() => {
    itemsRef.current.forEach((item) => {
      if (item.status === "uploading" || item.status === "pending") {
        item.controller.abort();
        updateItem(item.id, { status: "cancelled", speed: 0, eta: 0 });
      }
    });
    uploadQueueRef.current = [];
  }, [updateItem]);

  const clearCompleted = useCallback(() => {
    itemsRef.current.forEach((item) => {
      if (item.status === "completed" && item.preview_url) {
        URL.revokeObjectURL(item.preview_url);
      }
      if (item.status === "completed") {
        itemsRef.current.delete(item.id);
      }
    });
    setItems((prev) => prev.filter((i) => i.status !== "completed"));
  }, []);

  const clearErrors = useCallback(() => setErrors([]), []);

  const isUploading = items.some((i) => i.status === "uploading" || i.status === "pending");

  const totalProgress =
    items.length > 0 ? Math.round(items.reduce((sum, i) => sum + i.progress, 0) / items.length) : 0;

  return {
    items,
    isUploading,
    addFiles,
    removeItem,
    retryItem,
    cancelItem,
    cancelAll,
    clearCompleted,
    errors,
    clearErrors,
    totalProgress,
  };
}
