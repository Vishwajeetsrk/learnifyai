import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo, lazy, Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { AIPanel } from "@/components/playground/AIPanel";
import { AIAssistantPanel } from "@/components/playground/AIAssistantPanel";
import { APITesterPanel } from "@/components/playground/APITesterPanel";
import { executeCode } from "@/lib/playground/execution";
import {
  deleteProject,
  getProject,
  getProjectFiles,
  updateProject,
  bulkSyncFiles,
} from "@/lib/playground/projects";
import { useServerFn } from "@tanstack/react-start";
import { useQuery as useRQ, useQueryClient } from "@tanstack/react-query";
import {
  Trash2,
  PanelRightOpen,
  PanelRightClose,
  Folders,
  Pencil,
  Check,
  X,
  Loader2,
  Brain,
  Globe,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";

// Lazy load heavy IDE components (Sandpack ~2MB + Monaco ~10MB)
const WebIDE = lazy(() => import("@/components/playground/WebIDE").then((m) => ({ default: m.WebIDE })));
const StandardIDE = lazy(() => import("@/components/playground/StandardIDE").then((m) => ({ default: m.StandardIDE })));

const searchSchema = z.object({ project: z.string().optional() });

export const Route = createFileRoute("/_authenticated/playground/editor")({
  validateSearch: (s: Record<string, unknown>) => searchSchema.parse(s),
  head: () => ({ meta: [{ title: "Code Editor — Learnify AI" }] }),
  component: PlaygroundEditor,
});

const WEB_TEMPLATES = ["html-css-js", "react", "node"];

function PlaygroundEditor() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { project: projectId } = Route.useSearch();

  // Project State
  const [projectTitle, setProjectTitle] = useState("");
  const [template, setTemplate] = useState("blank");
  const [language, setLanguage] = useState("javascript");
  const [projectIsPublic, setProjectIsPublic] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");

  // File State
  const [files, setFiles] = useState<any[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  // UI State
  const [activePanel, setActivePanel] = useState<"ai" | "assistant" | "api" | null>("ai");
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<{ stdout: string; stderr: string; code: number } | null>(
    null,
  );
  const [timeMs, setTimeMs] = useState<number | undefined>();
  const [updatingVisibility, setUpdatingVisibility] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const execFn = useServerFn(executeCode);
  const deleteFn = useServerFn(deleteProject);
  const getProjectFn = useServerFn(getProject);
  const getProjectFilesFn = useServerFn(getProjectFiles);
  const updateProjectFn = useServerFn(updateProject);
  const bulkSyncFn = useServerFn(bulkSyncFiles);

  const { data: project } = useRQ({
    enabled: !!projectId,
    queryKey: ["playground-project", projectId],
    queryFn: async () => getProjectFn({ data: { id: projectId! } }),
  });

  const { data: fetchedFiles } = useRQ({
    enabled: !!projectId,
    queryKey: ["playground-project-files", projectId],
    queryFn: async () => getProjectFilesFn({ data: { projectId: projectId! } }),
  });

  useEffect(() => {
    if (project) {
      setProjectTitle(project.title ?? "Untitled");
      setLanguage(project.language ?? "javascript");
      setTemplate(project.template ?? "blank");
      setProjectIsPublic(project.is_public ?? false);
    }
  }, [project]);

  useEffect(() => {
    if (fetchedFiles && fetchedFiles.length > 0) {
      setFiles(fetchedFiles);
      if (!activeFileId) setActiveFileId(fetchedFiles[0].id);
    }
  }, [fetchedFiles]);

  const isWebProject = WEB_TEMPLATES.includes(template);

  // WebIDE specific
  const webFiles = useMemo(() => {
    const obj: Record<string, { code: string }> = {};
    for (const f of files) {
      const fullPath = (f.path === "/" ? "" : f.path) + "/" + f.name;
      obj[fullPath] = { code: f.content || "" };
    }
    return obj;
  }, [files]);

  const handleWebSave = async (flatFiles: Record<string, string>) => {
    if (!projectId) return;
    setSaving(true);
    try {
      await bulkSyncFn({ data: { projectId, files: flatFiles } });
      qc.invalidateQueries({ queryKey: ["playground-project-files", projectId] });
      toast.success("Project saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  // StandardIDE specific
  const runStandard = async (code: string) => {
    setRunning(true);
    setOutput(null);
    setTimeMs(undefined);
    try {
      const res = await execFn({ data: { language, code, stdin: "" } });
      if (res.success) {
        setOutput({ stdout: res.stdout, stderr: res.stderr, code: res.code });
        setTimeMs(res.time_ms);
      } else {
        setOutput({ stdout: "", stderr: (res as any).error ?? "Execution failed", code: 1 });
      }
    } catch (err: any) {
      setOutput({ stdout: "", stderr: err?.message ?? "Execution failed", code: 1 });
    } finally {
      setRunning(false);
    }
  };

  const handleStandardSave = async () => {
    if (!projectId) return;
    setSaving(true);
    try {
      const obj: Record<string, string> = {};
      for (const f of files) {
        const fullPath = (f.path === "/" ? "" : f.path) + "/" + f.name;
        obj[fullPath] = f.content || "";
      }
      await bulkSyncFn({ data: { projectId, files: obj } });
      qc.invalidateQueries({ queryKey: ["playground-project-files", projectId] });
      toast.success("Project saved");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateFile = (id: string, content: string) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, content } : f)));
  };

  const handleAddFile = () => {
    const name = prompt("File name (e.g. script.js):");
    if (!name) return;
    const newFile = {
      id: Math.random().toString(),
      name,
      path: "/",
      content: "",
      language: "javascript",
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);
  };

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (activeFileId === id) setActiveFileId(files[0]?.id || null);
  };

  // Common Header Actions
  const togglePublicVisibility = async () => {
    if (!projectId) return;
    setUpdatingVisibility(true);
    try {
      await updateProjectFn({ data: { id: projectId, is_public: !projectIsPublic } });
      setProjectIsPublic(!projectIsPublic);
      toast.success(projectIsPublic ? "Project is now private" : "Project is now public");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdatingVisibility(false);
    }
  };

  const confirmRename = async () => {
    const trimmed = titleInput.trim();
    if (!trimmed) {
      setEditingTitle(false);
      return;
    }
    setProjectTitle(trimmed);
    setEditingTitle(false);
    if (projectId) {
      try {
        await updateProjectFn({ data: { id: projectId, title: trimmed } });
        toast.success("Project renamed");
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  const startRename = () => {
    setTitleInput(projectTitle);
    setEditingTitle(true);
    setTimeout(() => titleRef.current?.select(), 50);
  };

  const handleDeleteProject = async () => {
    if (!projectId) return;
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteFn({ data: { id: projectId } });
      toast.success("Project deleted");
      navigate({ to: "/playground/projects", replace: true });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <AppShell>
      <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-background">
        {/* Universal Header */}
        <div className="flex items-center gap-2 px-4 py-2 border-b bg-card shrink-0 flex-wrap">
          <Link
            to="/playground/projects"
            className="text-muted-foreground hover:text-foreground shrink-0"
            title="Back to Projects"
          >
            <Folders className="h-4 w-4" />
          </Link>
          <div className="h-4 w-[1px] bg-border mx-1" />

          {editingTitle ? (
            <div className="flex items-center gap-1">
              <input
                ref={titleRef}
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmRename();
                  if (e.key === "Escape") setEditingTitle(false);
                }}
                className="h-7 w-40 sm:w-56 bg-muted border rounded px-2 text-xs font-medium outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={confirmRename}
                className="p-1 rounded hover:bg-accent text-emerald-500"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setEditingTitle(false)}
                className="p-1 rounded hover:bg-accent text-muted-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={startRename}
              className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition group"
            >
              {projectTitle || "Untitled"}
              <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}

          {projectId && (
            <button
              onClick={togglePublicVisibility}
              disabled={updatingVisibility}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all shrink-0 ml-2",
                projectIsPublic
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-muted text-muted-foreground border-border",
              )}
            >
              {updatingVisibility ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : projectIsPublic ? (
                "🌐 Public"
              ) : (
                "🔒 Private"
              )}
            </button>
          )}

          <div className="flex-1 min-w-[4px]" />

          <div className="flex items-center gap-1">
            <button
              onClick={() => setActivePanel(activePanel === "ai" ? null : "ai")}
              className={cn(
                "p-1.5 rounded-md transition",
                activePanel === "ai"
                  ? "bg-accent text-foreground"
                  : "hover:bg-accent text-muted-foreground hover:text-foreground",
              )}
              title="AI Code Assistant"
            >
              <Sparkles className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActivePanel(activePanel === "assistant" ? null : "assistant")}
              className={cn(
                "p-1.5 rounded-md transition",
                activePanel === "assistant"
                  ? "bg-accent text-foreground"
                  : "hover:bg-accent text-muted-foreground hover:text-foreground",
              )}
              title="AI Chat Assistant"
            >
              <Brain className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActivePanel(activePanel === "api" ? null : "api")}
              className={cn(
                "p-1.5 rounded-md transition",
                activePanel === "api"
                  ? "bg-accent text-foreground"
                  : "hover:bg-accent text-muted-foreground hover:text-foreground",
              )}
              title="API Tester"
            >
              <Globe className="h-4 w-4" />
            </button>
            {projectId && (
              <button
                onClick={handleDeleteProject}
                className="p-1.5 rounded-md hover:bg-accent text-destructive hover:text-destructive transition ml-1"
                title="Delete project"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* IDE & AI Pane Layout */}
        <div className="flex-1 flex overflow-hidden flex-col lg:flex-row relative">
          <div className="flex-1 overflow-hidden relative">
            {!projectId ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Loading project...
              </div>
            ) : (
              <Suspense
                fallback={
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                }
              >
                {isWebProject ? (
                  <WebIDE
                    files={webFiles}
                    template={
                      template === "html-css-js"
                        ? "vanilla"
                        : (template as "react" | "node" | "vanilla")
                    }
                    onSave={handleWebSave}
                    saving={saving}
                  />
                ) : (
                  <StandardIDE
                    files={files}
                    activeFileId={activeFileId}
                    setActiveFileId={setActiveFileId}
                    onAddFile={handleAddFile}
                    onDeleteFile={handleDeleteFile}
                    onUpdateFile={handleUpdateFile}
                    language={language}
                    setLanguage={setLanguage}
                    run={runStandard}
                    running={running}
                    output={output}
                    timeMs={timeMs}
                    saving={saving}
                    onSaveProject={handleStandardSave}
                  />
                )}
              </Suspense>
            )}
          </div>

          {activePanel && (
            <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l bg-card shrink-0 flex flex-col z-10">
              {activePanel === "ai" && (
                <AIPanel
                  code={
                    files.find((f) => f.id === activeFileId)?.content ||
                    Object.values(webFiles)[0]?.code ||
                    ""
                  }
                  language={language}
                  onCodeResult={(c) => {
                    if (isWebProject) {
                      toast.info("AI suggested code. Please copy/paste manually into WebIDE.");
                    } else if (activeFileId) {
                      handleUpdateFile(activeFileId, c);
                    }
                  }}
                />
              )}
              {activePanel === "assistant" && (
                <AIAssistantPanel
                  code={
                    files.find((f) => f.id === activeFileId)?.content ||
                    Object.values(webFiles)[0]?.code ||
                    ""
                  }
                  language={language}
                  onApplyFix={(c) => {
                    if (isWebProject) {
                      toast.info("AI suggested code. Please copy/paste manually into WebIDE.");
                    } else if (activeFileId) {
                      handleUpdateFile(activeFileId, c);
                    }
                  }}
                />
              )}
              {activePanel === "api" && <APITesterPanel />}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
