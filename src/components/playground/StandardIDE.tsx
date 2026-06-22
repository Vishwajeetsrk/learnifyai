import { useState, useCallback } from "react";
import { CodeEditor } from "./CodeEditor";
import { OutputConsole, EmptyOutput } from "./OutputConsole";
import { LanguageSelector } from "./LanguageSelector";
import { Button } from "@/components/ui/button";
import {
  FileCode,
  Plus,
  Trash2,
  Play,
  Loader2,
  Save,
  ZoomIn,
  ZoomOut,
  X,
  MoreHorizontal,
  Copy,
  FolderOpen,
  Terminal,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import * as ResizablePrimitive from "react-resizable-panels";

interface File {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
}

export function StandardIDE({
  files,
  activeFileId,
  setActiveFileId,
  onAddFile,
  onDeleteFile,
  onUpdateFile,
  language,
  setLanguage,
  run,
  running,
  output,
  timeMs,
  saving,
  onSaveProject,
}: {
  files: File[];
  activeFileId: string | null;
  setActiveFileId: (id: string) => void;
  onAddFile: () => void;
  onDeleteFile: (id: string) => void;
  onUpdateFile: (id: string, content: string) => void;
  language: string;
  setLanguage: (l: string) => void;
  run: (code: string) => void;
  running: boolean;
  output: { stdout: string; stderr: string; code: number } | null;
  timeMs?: number;
  saving: boolean;
  onSaveProject: () => void;
}) {
  const [fontSize, setFontSize] = useState(14);
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    fileId: string;
    x: number;
    y: number;
  } | null>(null);
  const [outputTab, setOutputTab] = useState<"output" | "terminal">("output");

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  // Open file in tab
  const openInTab = useCallback(
    (fileId: string) => {
      setActiveFileId(fileId);
      setOpenTabs((prev) => {
        if (prev.includes(fileId)) return prev;
        return [...prev, fileId];
      });
    },
    [setActiveFileId],
  );

  // Close tab
  const closeTab = useCallback(
    (fileId: string) => {
      setOpenTabs((prev) => {
        const next = prev.filter((id) => id !== fileId);
        // If closing active file, switch to adjacent tab
        if (fileId === activeFileId && next.length > 0) {
          const closedIndex = prev.indexOf(fileId);
          const newIndex = Math.min(closedIndex, next.length - 1);
          setActiveFileId(next[newIndex]);
        }
        return next;
      });
    },
    [activeFileId, setActiveFileId],
  );

  // Context menu for file operations
  const handleContextMenu = useCallback((e: React.MouseEvent, fileId: string) => {
    e.preventDefault();
    setContextMenu({ fileId, x: e.clientX, y: e.clientY });
  }, []);

  // Close context menu
  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Handle duplicate file
  const handleDuplicateFile = useCallback(
    (fileId: string) => {
      const file = files.find((f) => f.id === fileId);
      if (file) {
        const newFile: File = {
          id: Math.random().toString(),
          name: `copy_${file.name}`,
          path: file.path,
          content: file.content,
          language: file.language,
        };
        onAddFile();
        // We'd need to modify the parent to support this properly
      }
      closeContextMenu();
    },
    [files, onAddFile, closeContextMenu],
  );

  // Get file icon based on extension
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
        return <Code2 className="h-4 w-4 text-yellow-500" />;
      case "html":
      case "htm":
        return <FileCode className="h-4 w-4 text-orange-500" />;
      case "css":
      case "scss":
      case "less":
        return <FileCode className="h-4 w-4 text-blue-500" />;
      case "json":
        return <FileCode className="h-4 w-4 text-green-500" />;
      case "md":
      case "txt":
        return <FileCode className="h-4 w-4 text-gray-500" />;
      default:
        return <FileCode className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Run all files (concatenated)
  const runAll = useCallback(() => {
    const allCode = files.map((f) => f.content || "").join("\n");
    run(allCode);
  }, [files, run]);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b bg-card">
        <Button onClick={onSaveProject} disabled={saving} size="sm" variant="outline">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save
        </Button>

        <Button onClick={onAddFile} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          New File
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        <LanguageSelector value={language} onChange={setLanguage} />

        <div className="flex items-center border rounded-md mx-2 bg-muted/30">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 rounded-none rounded-l-md hover:bg-accent"
            onClick={() => setFontSize(Math.max(10, fontSize - 1))}
            title="Zoom Out (Ctrl+-)"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs font-mono px-2 min-w-[40px] text-center select-none">
            {fontSize}px
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 rounded-none rounded-r-md hover:bg-accent"
            onClick={() => setFontSize(Math.min(30, fontSize + 1))}
            title="Zoom In (Ctrl+Plus)"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1" />

        <Button
          onClick={() => (activeFile ? run(activeFile.content || "") : runAll())}
          disabled={running || !activeFile}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          title="Run (Ctrl+Enter)"
        >
          {running ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Play className="h-4 w-4 mr-1" />
          )}
          Run
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <ResizablePrimitive.Group orientation="horizontal">
          {/* File Explorer */}
          <ResizablePrimitive.Panel defaultSize={15} minSize={10} maxSize={30}>
            <div className="h-full border-r bg-card flex flex-col">
              <div className="flex items-center justify-between p-2 border-b">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  Explorer
                </span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onAddFile}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {files.map((f) => (
                  <div
                    key={f.id}
                    className={cn(
                      "flex items-center justify-between group px-2 py-1.5 rounded-md cursor-pointer text-sm transition-colors",
                      activeFileId === f.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted text-muted-foreground",
                    )}
                    onClick={() => openInTab(f.id)}
                    onContextMenu={(e) => handleContextMenu(e, f.id)}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {getFileIcon(f.name)}
                      <span className="truncate">{f.name}</span>
                    </div>
                    {files.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteFile(f.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ResizablePrimitive.Panel>
          <ResizablePrimitive.Separator className="w-1 bg-border hover:bg-primary transition-colors cursor-col-resize" />

          {/* Editor with Tabs */}
          <ResizablePrimitive.Panel defaultSize={55} minSize={30}>
            <div className="h-full flex flex-col">
              {/* File Tabs */}
              {openTabs.length > 0 && (
                <div className="flex items-center border-b bg-card overflow-x-auto">
                  {openTabs.map((fileId) => {
                    const file = files.find((f) => f.id === fileId);
                    if (!file) return null;
                    return (
                      <div
                        key={fileId}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 border-r cursor-pointer text-sm min-w-[120px] max-w-[200px] group",
                          activeFileId === fileId
                            ? "bg-background text-foreground font-medium"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted",
                        )}
                        onClick={() => setActiveFileId(fileId)}
                        onContextMenu={(e) => handleContextMenu(e, fileId)}
                      >
                        {getFileIcon(file.name)}
                        <span className="truncate flex-1">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 opacity-0 group-hover:opacity-100 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            closeTab(fileId);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Editor */}
              <div className="flex-1 relative">
                {activeFile ? (
                  <CodeEditor
                    language={language}
                    value={activeFile.content || ""}
                    onChange={(val) => onUpdateFile(activeFile.id, val)}
                    fontSize={fontSize}
                  />
                ) : (
                  <div className="h-full grid place-items-center text-muted-foreground text-sm">
                    <div className="text-center">
                      <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No file selected</p>
                      <p className="text-xs mt-2">Create a new file or select one from the explorer</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ResizablePrimitive.Panel>
          <ResizablePrimitive.Separator className="w-1 bg-border hover:bg-primary transition-colors cursor-col-resize" />

          {/* Output / Terminal */}
          <ResizablePrimitive.Panel defaultSize={30} minSize={20}>
            <div className="h-full flex flex-col bg-[#1e1e1e]">
              <div className="flex items-center px-4 py-2 bg-[#2d2d2d] border-b border-zinc-700/50">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 px-3 text-xs font-semibold rounded-none border-b-2 -mb-[1px]",
                    outputTab === "output"
                      ? "text-zinc-200 border-emerald-500"
                      : "text-zinc-400 border-transparent hover:text-zinc-300",
                  )}
                  onClick={() => setOutputTab("output")}
                >
                  Output
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 px-3 text-xs font-semibold rounded-none border-b-2 -mb-[1px]",
                    outputTab === "terminal"
                      ? "text-zinc-200 border-emerald-500"
                      : "text-zinc-400 border-transparent hover:text-zinc-300",
                  )}
                  onClick={() => setOutputTab("terminal")}
                >
                  <Terminal className="h-3 w-3 mr-1" />
                  Terminal
                </Button>
                <div className="flex-1" />
                {output && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-zinc-400 hover:text-zinc-200"
                    onClick={() => navigator.clipboard.writeText(output.stdout + output.stderr)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                {output ? (
                  <OutputConsole
                    stdout={output.stdout}
                    stderr={output.stderr}
                    exitCode={output.code}
                    executionTimeMs={timeMs}
                    isRunning={running}
                    onClear={() => {}}
                  />
                ) : (
                  <EmptyOutput isRunning={running} onRun={() => activeFile ? run(activeFile.content || "") : runAll()} />
                )}
              </div>
            </div>
          </ResizablePrimitive.Panel>
        </ResizablePrimitive.Group>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-50" onClick={closeContextMenu} />
          <div
            className="fixed z-50 bg-popover border rounded-md shadow-lg py-1 min-w-[160px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              className="w-full px-3 py-1.5 text-sm text-left hover:bg-accent flex items-center gap-2"
              onClick={() => {
                openInTab(contextMenu.fileId);
                closeContextMenu();
              }}
            >
              <FolderOpen className="h-4 w-4" />
              Open in Tab
            </button>
            <button
              className="w-full px-3 py-1.5 text-sm text-left hover:bg-accent flex items-center gap-2"
              onClick={() => handleDuplicateFile(contextMenu.fileId)}
            >
              <Copy className="h-4 w-4" />
              Duplicate
            </button>
            <div className="h-px bg-border my-1" />
            <button
              className="w-full px-3 py-1.5 text-sm text-left hover:bg-destructive/10 text-destructive flex items-center gap-2"
              onClick={() => {
                onDeleteFile(contextMenu.fileId);
                closeContextMenu();
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
