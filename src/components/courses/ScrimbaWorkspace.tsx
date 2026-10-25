import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { useServerFn } from "@tanstack/react-start";
import { executeCode } from "@/lib/playground.functions";
import { toast } from "sonner";
import {
  Code2,
  Play,
  RotateCcw,
  Undo2,
  FileCode,
  FileText,
  FileJson,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Globe,
  Terminal,
  Maximize2,
  Minimize2,
  RefreshCw,
  ExternalLink,
  Laptop,
  Smartphone,
  Tablet,
  CheckCircle2,
  Layers,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ScrimbaWorkspaceProps {
  courseTitle?: string;
  lessonTitle?: string;
  injectedCode?: string;
  injectedLang?: string;
  activeVideoTime?: number;
  onCodeChange?: (code: string) => void;
  onForkChange?: (isForked: boolean) => void;
}

interface VirtualFile {
  name: string;
  path: string;
  type: "file" | "dir";
  language: "html" | "css" | "javascript" | "json" | "python" | "java";
  content: string;
  isOpen?: boolean;
}

const DEFAULT_WEB_FILES: Record<string, string> = {
  "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Learnify AI Sandbox</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="card">
    <div class="badge">LIVE SCRIMBA SANDBOX</div>
    <h1>Interactive Practice Ready!</h1>
    <p id="desc">Edit code here in real-time. Notice the "Back to Teacher" button whenever you diverge from the lecture.</p>
    <div class="actions">
      <button id="btn" class="primary-btn">Test Interactive Action</button>
    </div>
    <div id="status" class="status-box">Status: Ready for your edits</div>
  </div>
  <script src="index.js"></script>
</body>
</html>`,
  "styles.css": `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #090D16;
  color: #F8FAFC;
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 24px;
}

.card {
  background: #111827;
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: 16px;
  padding: 32px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.badge {
  display: inline-block;
  background: rgba(99, 102, 241, 0.15);
  color: #818CF8;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 4px 10px;
  border-radius: 20px;
  margin-bottom: 16px;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

h1 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #FFFFFF 0%, #A5B4FC 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  color: #94A3B8;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 24px;
}

.primary-btn {
  background: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
}

.primary-btn:active {
  transform: translateY(0);
}

.status-box {
  margin-top: 20px;
  padding: 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  color: #38BDF8;
  font-family: monospace;
  font-size: 12px;
}`,
  "index.js": `console.log("Learnify Scrimba Virtual Runner initialized.");

const btn = document.getElementById("btn");
const status = document.getElementById("status");
const desc = document.getElementById("desc");

let clickCount = 0;

btn?.addEventListener("click", () => {
  clickCount++;
  console.log(\`Interactive button clicked \${clickCount} time(s)\`);
  if (status) {
    status.innerText = \`Button clicked \${clickCount} time(s) at \${new Date().toLocaleTimeString()}\`;
    status.style.color = clickCount % 2 === 0 ? "#34D399" : "#F472B6";
  }
});`,
  "package.json": `{
  "name": "learnify-scrimba-sandbox",
  "version": "1.0.0",
  "description": "Interactive in-browser Scrimba coding environment",
  "scripts": {
    "start": "serve ."
  },
  "dependencies": {}
}`,
};

export function ScrimbaWorkspace({
  courseTitle = "Interactive Code Masterclass",
  lessonTitle = "Live Practice Session",
  injectedCode,
  injectedLang = "html",
  activeVideoTime = 0,
  onCodeChange,
  onForkChange,
}: ScrimbaWorkspaceProps) {
  const isWebMode = useMemo(() => {
    const l = injectedLang.toLowerCase();
    return ["html", "css", "javascript", "web", "html5", "css3"].includes(l);
  }, [injectedLang]);

  // Virtual files state
  const [files, setFiles] = useState<Record<string, string>>(() => {
    if (injectedCode && isWebMode) {
      return {
        ...DEFAULT_WEB_FILES,
        "index.html": injectedCode,
      };
    }
    return DEFAULT_WEB_FILES;
  });

  const [activeFileName, setActiveFileName] = useState<string>("index.html");
  const [isForked, setIsForked] = useState<boolean>(false);
  const [forkTimestamp, setForkTimestamp] = useState<number>(0);
  const [teacherSnapshot, setTeacherSnapshot] = useState<Record<string, string>>(DEFAULT_WEB_FILES);
  const [consoleLogs, setConsoleLogs] = useState<{ id: string; type: "log" | "warn" | "error"; text: string; time: string }[]>([]);
  const [bottomTab, setBottomTab] = useState<"runner" | "console">("runner");
  const [deviceViewport, setDeviceViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewKey, setPreviewKey] = useState<number>(0);

  // Non-web backend execution state
  const [singleCode, setSingleCode] = useState<string>(injectedCode || "print('Hello from Learnify AI!')");
  const [backendOutput, setBackendOutput] = useState<{ stdout: string; stderr: string; code: number } | null>(null);
  const [backendRunning, setBackendRunning] = useState<boolean>(false);
  const execFn = useServerFn(executeCode);

  // Update when injectedCode changes from lecture
  useEffect(() => {
    if (injectedCode) {
      if (isWebMode) {
        setFiles((prev) => {
          const next = { ...prev, "index.html": injectedCode };
          setTeacherSnapshot(next);
          return next;
        });
      } else {
        setSingleCode(injectedCode);
      }
    }
  }, [injectedCode, isWebMode]);

  // Synchronize student edits: detect fork & auto-pause lecture
  const handleEditorChange = useCallback((value: string | undefined) => {
    const nextVal = value ?? "";
    if (isWebMode) {
      setFiles((prev) => ({ ...prev, [activeFileName]: nextVal }));
      onCodeChange?.(nextVal);
    } else {
      setSingleCode(nextVal);
      onCodeChange?.(nextVal);
    }

    if (!isForked) {
      setIsForked(true);
      setForkTimestamp(activeVideoTime || 0);
      onForkChange?.(true);

      // Dispatch event to pause video player
      window.dispatchEvent(new CustomEvent("learnify:pause-video"));
      toast.info("Lecture paused for hands-on practice. Click 'Back to Teacher' when done!");
    }
  }, [activeFileName, isForked, activeVideoTime, isWebMode, onCodeChange, onForkChange]);

  // "Back to Teacher" restore action
  const handleBackToTeacher = useCallback(() => {
    if (isWebMode) {
      setFiles(teacherSnapshot);
    } else if (injectedCode) {
      setSingleCode(injectedCode);
    }
    setIsForked(false);
    onForkChange?.(false);

    // Dispatch event to resume video playback
    window.dispatchEvent(new CustomEvent("learnify:resume-video"));
    toast.success("Restored to teacher's checkpoint! Lecture resumed.");
  }, [teacherSnapshot, injectedCode, isWebMode, onForkChange]);

  // Run backend code (Python, Java, etc.)
  const handleRunBackend = useCallback(async () => {
    setBackendRunning(true);
    setBackendOutput(null);
    try {
      const res = await execFn({
        data: {
          language: injectedLang.toLowerCase() || "python",
          code: singleCode,
          stdin: "",
        },
      });
      if (res.success) {
        setBackendOutput({ stdout: res.stdout, stderr: res.stderr, code: res.code });
      } else {
        setBackendOutput({ stdout: "", stderr: res.error, code: 1 });
      }
    } catch (err: any) {
      setBackendOutput({ stdout: "", stderr: err?.message || "Execution error", code: 1 });
    } finally {
      setBackendRunning(false);
    }
  }, [singleCode, injectedLang, execFn]);

  // Build live srcDoc for virtual browser
  const bundledSrcDoc = useMemo(() => {
    const html = files["index.html"] || "";
    const css = files["styles.css"] || "";
    const js = files["index.js"] || "";

    // Intercept console.log and errors to show in bottom tray
    const consoleInterceptor = `
      <script>
        (function() {
          const sendLog = (type, args) => {
            try {
              window.parent.postMessage({
                source: "learnify-sandbox",
                type: type,
                text: Array.from(args).map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(" "),
                time: new Date().toLocaleTimeString()
              }, "*");
            } catch(e) {}
          };
          const origLog = console.log;
          const origWarn = console.warn;
          const origError = console.error;
          console.log = function() { origLog.apply(console, arguments); sendLog("log", arguments); };
          console.warn = function() { origWarn.apply(console, arguments); sendLog("warn", arguments); };
          console.error = function() { origError.apply(console, arguments); sendLog("error", arguments); };
          window.onerror = function(msg, url, line) {
            sendLog("error", ["Uncaught Error at line " + line + ": " + msg]);
          };
        })();
      <\/script>
    `;

    // Inject styles and scripts into HTML
    let rendered = html;
    if (css) {
      rendered = rendered.replace("</head>", `<style>${css}</style></head>`);
      if (!rendered.includes("<style>")) rendered = `<style>${css}</style>` + rendered;
    }
    if (js) {
      rendered = rendered.replace("</body>", `${consoleInterceptor}<script>${js}<\/script></body>`);
      if (!rendered.includes("<script>")) rendered = rendered + `${consoleInterceptor}<script>${js}<\/script>`;
    }

    return rendered;
  }, [files]);

  // Listen to messages from sandbox iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.source === "learnify-sandbox") {
        setConsoleLogs((prev) => [
          ...prev.slice(-49),
          {
            id: Math.random().toString(36).substring(7),
            type: e.data.type,
            text: e.data.text,
            time: e.data.time,
          },
        ]);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith(".html")) return <FileCode className="h-3.5 w-3.5 text-orange-400" />;
    if (name.endsWith(".css")) return <FileText className="h-3.5 w-3.5 text-blue-400" />;
    if (name.endsWith(".js")) return <FileCode className="h-3.5 w-3.5 text-yellow-400" />;
    if (name.endsWith(".json")) return <FileJson className="h-3.5 w-3.5 text-emerald-400" />;
    return <FileCode className="h-3.5 w-3.5 text-muted-foreground" />;
  };

  return (
    <div className="flex flex-col rounded-2xl border border-border/80 bg-card shadow-xl overflow-hidden min-h-[580px]">
      {/* ── Top Bar: Scrimba Status & "Back to Teacher" Control ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-muted/40 border-b border-border/70 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <Badge
            variant="outline"
            className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-xs font-semibold py-1 px-2.5"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1 text-indigo-400 animate-pulse" />
            Scrimba Interactive Sandbox
          </Badge>

          {isForked ? (
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span className="text-xs font-medium text-amber-400">
                You Forked the Code (Video Paused)
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-sm"></span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Synced with Teacher ({formatTime(activeVideoTime)})
              </span>
            </div>
          )}
        </div>

        {/* ── Prominent "BACK TO TEACHER" Button ── */}
        <div className="flex items-center gap-2">
          {isForked ? (
            <Button
              onClick={handleBackToTeacher}
              size="sm"
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md border-0 gap-1.5 transition-all transform hover:scale-105 active:scale-95 animate-in fade-in"
            >
              <Undo2 className="h-3.5 w-3.5" />
              BACK TO TEACHER ({formatTime(forkTimestamp)})
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsForked(true);
                setForkTimestamp(activeVideoTime);
                window.dispatchEvent(new CustomEvent("learnify:pause-video"));
                toast.info("Lecture paused. Start typing in the editor to test your code!");
              }}
              className="text-xs gap-1.5 h-8 cursor-pointer"
            >
              <Code2 className="h-3.5 w-3.5" />
              Pause & Practice
            </Button>
          )}

          {!isWebMode && (
            <Button
              size="sm"
              onClick={handleRunBackend}
              disabled={backendRunning}
              className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {backendRunning ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
              Run Code
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPreviewKey((k) => k + 1)}
            title="Reload Preview"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Main Workspace Body: File Sidebar + Monaco Editor + Live Browser ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 divide-y lg:divide-y-0 lg:divide-x divide-border/60 bg-background/50">
        {/* ── Left Column: Files Tree (like Scrimba in GIF) ── */}
        {isWebMode && (
          <div className="lg:col-span-2 p-3 bg-muted/10 flex flex-col justify-between text-xs font-mono">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40 text-[11px] font-bold text-muted-foreground tracking-wider uppercase">
                <span>FILES</span>
                <span className="text-[10px] lowercase text-primary font-sans font-semibold">sandbox</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground px-1 py-1 font-semibold text-[11px]">
                  <FolderOpen className="h-3.5 w-3.5 text-indigo-400" />
                  <span>workspace</span>
                </div>
                <div className="pl-3 space-y-0.5">
                  {Object.keys(files).map((fName) => (
                    <button
                      key={fName}
                      onClick={() => setActiveFileName(fName)}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition",
                        activeFileName === fName
                          ? "bg-primary/15 text-primary font-bold shadow-sm"
                          : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                      )}
                    >
                      {getFileIcon(fName)}
                      <span className="truncate">{fName}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 space-y-1 font-sans">
              <p>💡 Tip: Click any line to pause & experiment.</p>
            </div>
          </div>
        )}

        {/* ── Center Column: Monaco Code Editor ── */}
        <div className={cn(isWebMode ? "lg:col-span-5" : "lg:col-span-7", "flex flex-col bg-[#1e1e1e]")}>
          {/* Editor Tab Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-b border-[#333] text-xs">
            <div className="flex items-center gap-2">
              <span className="text-white font-mono text-[11px] font-semibold flex items-center gap-1.5">
                {isWebMode ? getFileIcon(activeFileName) : <Code2 className="h-3.5 w-3.5 text-primary" />}
                {isWebMode ? activeFileName : `${injectedLang.toUpperCase()} Sandbox`}
              </span>
              {isForked && (
                <Badge variant="outline" className="text-[9px] border-amber-500/40 text-amber-400 py-0 px-1.5">
                  modified
                </Badge>
              )}
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">UTF-8</span>
          </div>

          <div className="flex-1 min-h-[360px] relative">
            <Editor
              height="100%"
              language={
                isWebMode
                  ? activeFileName.endsWith(".html")
                    ? "html"
                    : activeFileName.endsWith(".css")
                      ? "css"
                      : activeFileName.endsWith(".json")
                        ? "json"
                        : "javascript"
                  : injectedLang.toLowerCase() || "python"
              }
              theme="vs-dark"
              value={isWebMode ? files[activeFileName] || "" : singleCode}
              onChange={handleEditorChange}
              options={{
                fontSize: 12,
                minimap: { enabled: false },
                lineNumbers: "on",
                tabSize: 2,
                automaticLayout: true,
                padding: { top: 8 },
                scrollBeyondLastLine: false,
                fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
              }}
            />
          </div>
        </div>

        {/* ── Right Column: Live Virtual Browser / Runner ── */}
        <div className={cn(isWebMode ? "lg:col-span-5" : "lg:col-span-5", "flex flex-col bg-background min-h-[360px]")}>
          {isWebMode ? (
            <>
              {/* Virtual Browser Chrome Bar (Matching GIF ':8080/') */}
              <div className="flex items-center justify-between gap-2 px-3 py-2 bg-muted/30 border-b border-border/60 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/80"></span>
                </div>

                {/* Address Bar */}
                <div className="flex-1 max-w-[220px] bg-background border border-border/80 rounded-md px-2.5 py-1 text-[11px] font-mono text-muted-foreground flex items-center gap-1.5 truncate">
                  <Globe className="h-3 w-3 text-emerald-500 shrink-0" />
                  <span className="truncate">localhost:8080 /</span>
                </div>

                {/* Device Viewport Selector */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setDeviceViewport("desktop")}
                    className={cn(
                      "p-1 rounded hover:bg-muted text-muted-foreground",
                      deviceViewport === "desktop" && "text-primary bg-primary/10"
                    )}
                    title="Desktop View"
                  >
                    <Laptop className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeviceViewport("mobile")}
                    className={cn(
                      "p-1 rounded hover:bg-muted text-muted-foreground",
                      deviceViewport === "mobile" && "text-primary bg-primary/10"
                    )}
                    title="Mobile View"
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Live Preview Iframe */}
              <div className="flex-1 bg-white relative flex justify-center items-center overflow-auto">
                <iframe
                  key={previewKey}
                  title="Live Scrimba Sandbox Preview"
                  sandbox="allow-scripts allow-modals"
                  srcDoc={bundledSrcDoc}
                  className={cn(
                    "h-full border-0 transition-all duration-300",
                    deviceViewport === "desktop" ? "w-full" : "w-[375px] shadow-2xl border-x border-zinc-200"
                  )}
                />
              </div>
            </>
          ) : (
            /* Backend execution output console */
            <div className="flex-1 flex flex-col bg-[#12141a] text-zinc-100 p-4 font-mono text-xs overflow-auto">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-primary" />
                  Execution Output
                </span>
                {backendOutput && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px]",
                      backendOutput.code === 0
                        ? "text-emerald-400 border-emerald-500/30"
                        : "text-red-400 border-red-500/30"
                    )}
                  >
                    Exit code: {backendOutput.code}
                  </Badge>
                )}
              </div>

              <div className="flex-1 overflow-auto whitespace-pre-wrap">
                {backendRunning ? (
                  <div className="flex items-center gap-2 text-zinc-400 py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>Executing code in cloud sandbox...</span>
                  </div>
                ) : backendOutput ? (
                  backendOutput.stdout || backendOutput.stderr ? (
                    <>
                      {backendOutput.stdout && <div className="text-zinc-200">{backendOutput.stdout}</div>}
                      {backendOutput.stderr && <div className="text-red-400 mt-2">{backendOutput.stderr}</div>}
                    </>
                  ) : (
                    <span className="text-zinc-500 italic">Program finished with empty output.</span>
                  )
                ) : (
                  <span className="text-zinc-500 italic">Click "Run Code" above to execute and view output.</span>
                )}
              </div>
            </div>
          )}

          {/* ── Bottom Tray (Runner / Console matching GIF) ── */}
          {isWebMode && (
            <div className="border-t border-border/70 bg-card/95">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/50 text-[11px]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setBottomTab("runner")}
                    className={cn(
                      "font-semibold transition flex items-center gap-1",
                      bottomTab === "runner" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Layers className="h-3 w-3" /> Runner
                  </button>
                  <button
                    onClick={() => setBottomTab("console")}
                    className={cn(
                      "font-semibold transition flex items-center gap-1",
                      bottomTab === "console" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Terminal className="h-3 w-3" /> Console {consoleLogs.length > 0 && `(${consoleLogs.length})`}
                  </button>
                </div>
                {consoleLogs.length > 0 && (
                  <button
                    onClick={() => setConsoleLogs([])}
                    className="text-[10px] text-muted-foreground hover:text-foreground"
                  >
                    Clear logs
                  </button>
                )}
              </div>

              <div className="p-2.5 max-h-28 overflow-y-auto font-mono text-[11px] bg-background/80">
                {bottomTab === "runner" ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>In-memory sandbox server running live. Keystroke updates sync instantaneously.</span>
                  </div>
                ) : consoleLogs.length === 0 ? (
                  <div className="text-muted-foreground italic">No console messages recorded.</div>
                ) : (
                  <div className="space-y-1">
                    {consoleLogs.map((log) => (
                      <div
                        key={log.id}
                        className={cn(
                          "flex items-start gap-2",
                          log.type === "error"
                            ? "text-destructive"
                            : log.type === "warn"
                              ? "text-amber-500"
                              : "text-foreground"
                        )}
                      >
                        <span className="text-[10px] text-muted-foreground shrink-0">{log.time}</span>
                        <span className="break-all">{log.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
