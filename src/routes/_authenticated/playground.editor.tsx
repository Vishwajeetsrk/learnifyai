import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useCallback, useRef, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { CodeEditor } from "@/components/playground/CodeEditor";
import { OutputConsole, EmptyOutput } from "@/components/playground/OutputConsole";
import { LanguageSelector } from "@/components/playground/LanguageSelector";
import { AIPanel } from "@/components/playground/AIPanel";
import { executeCode } from "@/lib/playground/execution";
import {
  saveEditorCode,
  deleteProject,
  getProject,
  getProjectFiles,
  updateProject,
} from "@/lib/playground/projects";
import { useServerFn } from "@tanstack/react-start";
import { useQuery as useRQ, useQueryClient } from "@tanstack/react-query";
import {
  Play,
  Save,
  Download,
  Trash2,
  PanelRightOpen,
  PanelRightClose,
  Folders,
  Pencil,
  Check,
  X,
  Globe,
  Clock,
  History,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";

const searchSchema = z.object({ project: z.string().optional() });

export const Route = createFileRoute("/_authenticated/playground/editor")({
  validateSearch: (s: Record<string, unknown>) => searchSchema.parse(s),
  head: () => ({ meta: [{ title: "Code Editor — Learnify AI" }] }),
  component: PlaygroundEditor,
});

const DEFAULTS: Record<string, string> = {
  javascript: 'console.log("Hello, Learnify! 🚀");',
  typescript: 'const msg: string = "Hello, TypeScript!";\nconsole.log(msg);',
  python: 'print("Hello, Python!")',
  java: 'class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java!");\n  }\n}',
  cpp: '#include <iostream>\nint main() {\n  std::cout << "Hello, C++!" << std::endl;\n  return 0;\n}',
  c: '#include <stdio.h>\nint main() {\n  printf("Hello, C!\\n");\n  return 0;\n}',
  go: 'package main\nimport "fmt"\nfunc main() {\n  fmt.Println("Hello, Go!")\n}',
  rust: 'fn main() {\n  println!("Hello, Rust!");\n}',
  ruby: 'puts "Hello, Ruby!"',
  php: '<?php\necho "Hello, PHP!";',
  csharp:
    'using System;\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello, C#!");\n  }\n}',
  swift: 'print("Hello, Swift!")',
  kotlin: 'fun main() {\n  println("Hello, Kotlin!")\n}',
  bash: '#!/bin/bash\necho "Hello, Bash!"',
  sql: "SELECT 'Hello, SQL!' AS greeting;",
  dart: 'void main() {\n  print("Hello, Dart!");\n}',
  scala: 'object Main extends App {\n  println("Hello, Scala!")\n}',
  r: 'cat("Hello, R!\\n")',
  perl: '#!/usr/bin/perl\nprint "Hello, Perl!\\n";',
  haskell: 'main = putStrLn "Hello, Haskell!"',
  lua: 'print("Hello, Lua!")',
  elixir: 'IO.puts("Hello, Elixir!")',
  zig: 'const std = @import("std");\npub fn main() !void {\n  std.debug.print("Hello, Zig!\\n", .{});\n}',
  julia: 'println("Hello, Julia!")',
  nim: 'echo "Hello, Nim!"',
  groovy: 'println "Hello, Groovy!"',
  powershell: 'Write-Host "Hello, PowerShell!"',
};

function PlaygroundEditor() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { project: projectId } = Route.useSearch();
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULTS.javascript);
  const [stdin, setStdin] = useState("");
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<{ stdout: string; stderr: string; code: number } | null>(
    null,
  );
  const [timeMs, setTimeMs] = useState<number | undefined>();
  const [showAi, setShowAi] = useState(true);
  const [fontSize, setFontSize] = useState(13);
  const [projectTitle, setProjectTitle] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectIsPublic, setProjectIsPublic] = useState(false);
  const [updatingVisibility, setUpdatingVisibility] = useState(false);
  const execFn = useServerFn(executeCode);
  const saveFn = useServerFn(saveEditorCode);
  const deleteFn = useServerFn(deleteProject);
  const getProjectFn = useServerFn(getProject);
  const getProjectFilesFn = useServerFn(getProjectFiles);
  const updateProjectFn = useServerFn(updateProject);
  const titleRef = useRef<HTMLInputElement>(null);

  const { data: project } = useRQ({
    enabled: !!projectId,
    queryKey: ["playground-project", projectId],
    queryFn: async () => {
      const p = await getProjectFn({ data: { id: projectId! } });
      return p;
    },
  });

  const { data: files } = useRQ({
    enabled: !!projectId,
    queryKey: ["playground-project-files", projectId],
    queryFn: async () => {
      const f = await getProjectFilesFn({ data: { projectId: projectId! } });
      return f;
    },
  });

  useEffect(() => {
    if (project) {
      setProjectTitle(project.title ?? "Untitled");
      setLanguage(project.language ?? "javascript");
      setProjectIsPublic(project.is_public ?? false);
    }
  }, [project]);

  useEffect(() => {
    if (files?.length) {
      setCode(files[0].content ?? "");
    }
  }, [files]);

  const run = useCallback(async () => {
    setRunning(true);
    setOutput(null);
    setTimeMs(undefined);
    try {
      const res = await execFn({ data: { language, code, stdin } });
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
  }, [language, code, stdin, execFn]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        run();
      }
    },
    [run],
  );

  const changeLanguage = (newLang: string) => {
    if (!projectId && code === DEFAULTS[language]) {
      setCode(DEFAULTS[newLang] ?? "");
    }
    setLanguage(newLang);
    setOutput(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await saveFn({
        data: {
          projectId: projectId || undefined,
          title: projectTitle || "Untitled Project",
          code,
          language,
        },
      });
      if (res.created && res.projectId) {
        navigate({ to: "/playground/editor", search: { project: res.projectId }, replace: true });
      }
      if (!projectTitle) setProjectTitle("Untitled Project");
      setIsDirty(false);
      toast.success("Project saved");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!projectId) return;
    try {
      await deleteFn({ data: { id: projectId } });
      toast.success("Project deleted");
      setShowDeleteConfirm(false);
      navigate({ to: "/playground/editor", search: {}, replace: true });
      setProjectTitle("");
      setCode(DEFAULTS.javascript);
      setLanguage("javascript");
      setOutput(null);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const startRename = () => {
    setTitleInput(projectTitle);
    setEditingTitle(true);
    setTimeout(() => titleRef.current?.select(), 50);
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
      setSaving(true);
      try {
        await saveFn({ data: { projectId, title: trimmed, code, language } });
        setIsDirty(false);
        toast.success("Renamed");
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setSaving(false);
      }
    }
  };

  const clearOutput = () => setOutput(null);

  const togglePublicVisibility = async () => {
    if (!projectId) return;
    setUpdatingVisibility(true);
    try {
      const nextPublic = !projectIsPublic;
      await updateProjectFn({ data: { id: projectId, is_public: nextPublic } });
      setProjectIsPublic(nextPublic);
      qc.invalidateQueries({ queryKey: ["playground-project", projectId] });
      qc.invalidateQueries({ queryKey: ["playground-projects"] });
      toast.success(nextPublic ? "Project is now public! It will appear on your profile." : "Project is now private.");
    } catch (err: any) {
      toast.error(err.message || "Failed to update project visibility");
    } finally {
      setUpdatingVisibility(false);
    }
  };

  const downloadCode = () => {
    const extMap: Record<string, string> = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      cpp: "cpp",
      csharp: "cs",
      bash: "sh",
      ruby: "rb",
      rust: "rs",
      kotlin: "kt",
      dart: "dart",
      scala: "scala",
      elixir: "exs",
      haskell: "hs",
      lua: "lua",
      perl: "pl",
      r: "r",
      zig: "zig",
      julia: "jl",
      nim: "nim",
      groovy: "groovy",
      powershell: "ps1",
      php: "php",
      sql: "sql",
      go: "go",
      java: "java",
      swift: "swift",
    };
    const ext = extMap[language] || "txt";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const applyAiCode = (newCode: string) => {
    setCode(newCode);
    setIsDirty(true);
  };

  return (
    <AppShell>
      <div className="h-[calc(100vh-3.5rem)] flex flex-col">
        {/* Top bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 border-b bg-card shrink-0 flex-wrap">
          <Link to="/playground" className="text-muted-foreground hover:text-foreground shrink-0">
            <Folders className="h-4 w-4" />
          </Link>
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
                autoFocus
              />
              <button
                onClick={confirmRename}
                className="p-1 rounded hover:bg-accent text-green-500"
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
              className="flex items-center gap-1.5 text-sm font-medium max-w-[120px] sm:max-w-[200px] truncate hover:text-primary transition"
            >
              {projectTitle || "Untitled"}
              <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
            </button>
          )}
          {isDirty && (
            <span className="text-[10px] text-amber-400 font-medium shrink-0">● Unsaved</span>
          )}
          {projectId && (
            <button
              onClick={togglePublicVisibility}
              disabled={updatingVisibility}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all shrink-0 hover:scale-105",
                projectIsPublic
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                  : "bg-muted text-muted-foreground border-border hover:bg-accent"
              )}
              title="Click to toggle public/private visibility"
            >
              {updatingVisibility ? (
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              ) : projectIsPublic ? (
                <>🌐 Public</>
              ) : (
                <>🔒 Private</>
              )}
            </button>
          )}
          <LanguageSelector value={language} onChange={changeLanguage} />
          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <span>Font:</span>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="bg-transparent border rounded px-1 py-0.5 text-[10px]"
            >
              {[10, 11, 12, 13, 14, 16, 18, 20].map((s) => (
                <option key={s} value={s}>
                  {s}px
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[4px]" />
          <div className="flex items-center gap-1">
            <Link
              to="/playground/web"
              className="hidden sm:inline-flex p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition"
              title="Web Playground"
            >
              <Globe className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={downloadCode}
              className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition"
              title="Download code"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setShowAi(!showAi)}
              className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition"
              title="AI Assistant"
            >
              {showAi ? (
                <PanelRightClose className="h-3.5 w-3.5" />
              ) : (
                <PanelRightOpen className="h-3.5 w-3.5" />
              )}
            </button>
            {projectId && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 rounded-lg hover:bg-accent text-destructive hover:text-destructive transition"
                title="Delete project"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
            <Button
              size="sm"
              variant="secondary"
              onClick={handleSave}
              disabled={saving}
              className="h-7 text-xs px-2"
            >
              {saving ? <Clock className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
              <span className="hidden sm:inline ml-1">Save</span>
            </Button>
            <Button size="sm" onClick={run} disabled={running} className="h-7 text-xs px-2">
              {running ? (
                <span className="animate-pulse text-[10px]">Run</span>
              ) : (
                <>
                  <Play className="h-3 w-3" />
                  <span className="hidden sm:inline ml-1">Run</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Editor + Output + AI */}
        <div className="flex-1 flex overflow-hidden flex-col lg:flex-row">
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 min-h-0 border-b" onKeyDown={handleKeyDown}>
              <CodeEditor
                language={language}
                value={code}
                onChange={(v) => {
                  setCode(v);
                  setIsDirty(true);
                }}
                fontSize={fontSize}
              />
            </div>
            <div className="flex gap-2 px-3 py-1.5 bg-[#1e1e1e] border-b border-[#333]">
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="stdin input..."
                className="flex-1 bg-transparent border border-[#333] rounded px-2 py-1 text-xs font-mono text-[#d4d4d4] resize-none placeholder:text-[#555] focus:outline-none focus:border-blue-500"
                rows={1}
                spellCheck={false}
              />
            </div>
            <div className="h-36 sm:h-48 shrink-0">
              {output ? (
                <OutputConsole
                  stdout={output.stdout}
                  stderr={output.stderr}
                  exitCode={output.code}
                  executionTimeMs={timeMs}
                  isRunning={running}
                  onClear={clearOutput}
                />
              ) : (
                <EmptyOutput isRunning={running} onRun={run} />
              )}
            </div>
          </div>
          {showAi && (
            <div className="w-full lg:w-72 shrink-0 lg:max-h-full border-t lg:border-t-0 lg:border-l">
              <AIPanel code={code} language={language} onCodeResult={applyAiCode} />
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4">
          <div className="bg-card border rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-semibold text-lg">Delete Project</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Are you sure? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <Button size="sm" variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
