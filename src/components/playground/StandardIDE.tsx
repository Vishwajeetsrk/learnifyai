import { useState } from "react";
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
  SaveAll,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

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
  files: any[];
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
  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b bg-card">
        <Button onClick={onSaveProject} disabled={saving} size="sm">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Project
        </Button>
        <LanguageSelector language={language} setLanguage={setLanguage} />

        <div className="flex items-center border rounded-md mx-2 bg-muted/30 ml-auto">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 rounded-none rounded-l-md hover:bg-accent"
            onClick={() => setFontSize(Math.max(10, fontSize - 1))}
            title="Zoom Out"
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
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <Button
          onClick={() => run(activeFile?.content || "")}
          disabled={running || !activeFile}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
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
        <PanelGroup direction="horizontal">
          {/* File Explorer */}
          <Panel defaultSize={15} minSize={10} maxSize={30}>
            <div className="h-full border-r bg-card flex flex-col">
              <div className="flex items-center justify-between p-2 border-b">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
                    onClick={() => setActiveFileId(f.id)}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileCode className="h-4 w-4 shrink-0 opacity-70" />
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
          </Panel>
          <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors cursor-col-resize" />

          {/* Editor */}
          <Panel defaultSize={55} minSize={30}>
            <div className="h-full relative">
              {activeFile ? (
                <CodeEditor
                  language={language}
                  value={activeFile.content || ""}
                  onChange={(val) => onUpdateFile(activeFile.id, val)}
                  fontSize={fontSize}
                />
              ) : (
                <div className="h-full grid place-items-center text-muted-foreground text-sm">
                  No file selected.
                </div>
              )}
            </div>
          </Panel>
          <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors cursor-col-resize" />

          {/* Output / Terminal */}
          <Panel defaultSize={30} minSize={20}>
            <div className="h-full flex flex-col bg-[#1e1e1e]">
              <div className="flex items-center px-4 py-2 bg-[#2d2d2d] text-xs font-semibold text-zinc-300 uppercase tracking-wider shrink-0 border-b border-zinc-700/50">
                Terminal Output
              </div>
              <div className="flex-1 overflow-hidden">
                {output ? <OutputConsole output={output} timeMs={timeMs} /> : <EmptyOutput />}
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
