import { useState } from "react";
import { Terminal, Copy, Check, Trash2, Loader2 } from "lucide-react";

interface OutputConsoleProps {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs?: number;
  isRunning: boolean;
  onClear: () => void;
}

export function OutputConsole({
  stdout,
  stderr,
  exitCode,
  executionTimeMs,
  isRunning,
  onClear,
}: OutputConsoleProps) {
  const [tab, setTab] = useState<"stdout" | "stderr">("stdout");
  const [copied, setCopied] = useState(false);

  const copyOutput = async () => {
    const text = tab === "stdout" ? stdout : stderr;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasStdout = stdout.length > 0;
  const hasStderr = stderr.length > 0;
  const activeContent = tab === "stdout" ? stdout : stderr;

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs rounded-lg overflow-hidden border border-[#333]">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#252526] border-b border-[#333] text-[11px] shrink-0">
        <Terminal className="h-3 w-3" />
        <span className="font-medium text-[#ccc]">Output</span>
        <div className="flex-1" />
        {executionTimeMs !== undefined && (
          <span className="text-[10px] text-[#888]">{executionTimeMs}ms</span>
        )}
        {isRunning && <Loader2 className="h-3 w-3 animate-spin text-blue-400" />}
        <button
          onClick={copyOutput}
          className="p-0.5 rounded hover:bg-[#333] text-[#888] hover:text-[#ccc] transition"
          title="Copy"
        >
          {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
        </button>
        <button
          onClick={onClear}
          className="p-0.5 rounded hover:bg-[#333] text-[#888] hover:text-[#ccc] transition"
          title="Clear"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
      <div className="flex border-b border-[#333] text-[11px]">
        <button
          onClick={() => setTab("stdout")}
          className={`px-3 py-1 transition ${tab === "stdout" ? "bg-[#1e1e1e] text-white border-b-2 border-blue-500" : "text-[#888] hover:text-[#ccc]"}`}
        >
          stdout{" "}
          {hasStdout && <span className="text-[10px] text-[#888] ml-1">({stdout.length}B)</span>}
        </button>
        <button
          onClick={() => setTab("stderr")}
          className={`px-3 py-1 transition ${tab === "stderr" ? "bg-[#1e1e1e] text-white border-b-2 border-blue-500" : "text-[#888] hover:text-[#ccc]"}`}
        >
          stderr{" "}
          {hasStderr && <span className="text-[10px] text-[#888] ml-1">({stderr.length}B)</span>}
        </button>
        <div className="flex-1" />
        <span
          className={`px-3 py-1 text-[10px] font-medium ${exitCode === 0 ? "text-green-400" : "text-red-400"}`}
        >
          Exit: {exitCode}
        </span>
      </div>
      <div className="flex-1 overflow-auto p-3 whitespace-pre-wrap leading-relaxed">
        {!hasStdout && !hasStderr && !isRunning ? (
          <span className="text-[#555] italic">Run your code to see output here</span>
        ) : activeContent ? (
          <span className={tab === "stderr" ? "text-red-400" : ""}>{activeContent}</span>
        ) : (
          <span className="text-[#555] italic">
            No {tab === "stdout" ? "stdout" : "stderr"} output
          </span>
        )}
        {isRunning && <span className="text-blue-400 animate-pulse ml-1">Running...</span>}
      </div>
    </div>
  );
}

export function EmptyOutput({ isRunning, onRun }: { isRunning: boolean; onRun: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#1e1e1e] text-[#555] rounded-lg border border-[#333] p-8">
      <Terminal className="h-10 w-10 mb-3 opacity-30" />
      <p className="text-sm font-medium mb-1">Ready to Execute</p>
      <p className="text-xs text-center max-w-xs">
        Press{" "}
        <kbd className="px-1.5 py-0.5 rounded border border-[#444] bg-[#252526] font-mono text-[10px]">
          Run
        </kbd>{" "}
        or{" "}
        <kbd className="px-1.5 py-0.5 rounded border border-[#444] bg-[#252526] font-mono text-[10px]">
          Ctrl+Enter
        </kbd>{" "}
        to execute your code
      </p>
      {isRunning && (
        <div className="mt-4 flex items-center gap-2 text-blue-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="animate-pulse">Executing...</span>
        </div>
      )}
    </div>
  );
}
