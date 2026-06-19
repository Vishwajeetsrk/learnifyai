import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, useRef } from "react";
import { AppShell } from "@/components/AppShell";
import { CodeEditor } from "@/components/playground/CodeEditor";
import { OutputConsole, EmptyOutput } from "@/components/playground/OutputConsole";
import { LanguageSelector } from "@/components/playground/LanguageSelector";
import { AIPanel } from "@/components/playground/AIPanel";
import { executeCode } from "@/lib/playground/execution";
import { useServerFn } from "@tanstack/react-start";
import { Play, Save, Download, Trash2, PanelRightOpen, PanelRightClose, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/playground/editor")({
  head: () => ({ meta: [{ title: "Code Editor — Learnify AI" }] }),
  component: PlaygroundEditor,
});

const DEFAULTS: Record<string, string> = {
  javascript: 'console.log("Hello, Learnify! 🚀");',
  typescript: 'const msg: string = "Hello, TypeScript!";\nconsole.log(msg);',
  python: 'print("Hello, Python!")',
  java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java!");\n  }\n}',
  cpp: '#include <iostream>\nint main() {\n  std::cout << "Hello, C++!" << std::endl;\n  return 0;\n}',
  c: '#include <stdio.h>\nint main() {\n  printf("Hello, C!\\n");\n  return 0;\n}',
  go: 'package main\nimport "fmt"\nfunc main() {\n  fmt.Println("Hello, Go!")\n}',
  rust: 'fn main() {\n  println!("Hello, Rust!");\n}',
  ruby: 'puts "Hello, Ruby!"',
  php: '<?php\necho "Hello, PHP!";',
  csharp: 'using System;\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello, C#!");\n  }\n}',
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
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULTS.javascript);
  const [stdin, setStdin] = useState("");
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<{ stdout: string; stderr: string; code: number } | null>(null);
  const [timeMs, setTimeMs] = useState<number | undefined>();
  const [showAi, setShowAi] = useState(true);
  const [fontSize, setFontSize] = useState(13);
  const execFn = useServerFn(executeCode);

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
        setOutput({ stdout: "", stderr: res.error, code: 1 });
      }
    } catch (err: any) {
      setOutput({ stdout: "", stderr: err?.message ?? "Execution failed", code: 1 });
    } finally {
      setRunning(false);
    }
  }, [language, code, stdin, execFn]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run(); }
  }, [run]);

  const changeLanguage = (newLang: string) => {
    if (code === DEFAULTS[language]) {
      setCode(DEFAULTS[newLang] ?? "");
    }
    setLanguage(newLang);
    setOutput(null);
  };

  const clearOutput = () => setOutput(null);

  const downloadCode = () => {
    const extMap: Record<string, string> = { javascript: "js", typescript: "ts", python: "py", cpp: "cpp", csharp: "cs", bash: "sh", ruby: "rb", rust: "rs", kotlin: "kt", dart: "dart", scala: "scala", elixir: "exs", haskell: "hs", lua: "lua", perl: "pl", r: "r", zig: "zig", julia: "jl", nim: "nim", groovy: "groovy", powershell: "ps1", php: "php", sql: "sql", go: "go", java: "java", swift: "swift" };
    const ext = extMap[language] || "txt";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `code.${ext}`; a.click();
    URL.revokeObjectURL(url);
  };

  const applyAiCode = (newCode: string) => {
    setCode(newCode);
  };

  return (
    <AppShell>
      <div className="h-[calc(100vh-3.5rem)] flex flex-col">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b bg-card shrink-0">
          <LanguageSelector value={language} onChange={changeLanguage} />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Font:</span>
            <select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="bg-transparent border rounded px-1 py-0.5 text-[10px]">
              {[10, 11, 12, 13, 14, 16, 18, 20].map((s) => <option key={s} value={s}>{s}px</option>)}
            </select>
          </div>
          <div className="flex-1" />
          <span className="hidden md:inline text-[10px] text-muted-foreground">Ctrl+Enter to run</span>
          <Button size="sm" variant="outline" onClick={downloadCode} title="Download code"><Download className="h-3.5 w-3.5" /></Button>
          <Button size="sm" variant="outline" onClick={() => setShowAi(!showAi)} title="Toggle AI panel">
            {showAi ? <PanelRightClose className="h-3.5 w-3.5" /> : <PanelRightOpen className="h-3.5 w-3.5" />}
          </Button>
          <Button size="sm" onClick={run} disabled={running}>
            {running ? <span className="animate-pulse">Running...</span> : <><Play className="h-3.5 w-3.5 mr-1" /> Run</>}
          </Button>
        </div>

        {/* Editor + Output + AI */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col min-w-0">
            {/* Editor */}
            <div className="flex-1 min-h-0 border-b" onKeyDown={handleKeyDown}>
              <CodeEditor language={language} value={code} onChange={setCode} fontSize={fontSize} />
            </div>
            {/* StdIn */}
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
            {/* Output */}
            <div className="h-48 shrink-0">
              {output ? (
                <OutputConsole stdout={output.stdout} stderr={output.stderr} exitCode={output.code} executionTimeMs={timeMs} isRunning={running} onClear={clearOutput} />
              ) : (
                <EmptyOutput isRunning={running} onRun={run} />
              )}
            </div>
          </div>
          {/* AI Panel */}
          {showAi && (
            <div className="w-72 shrink-0 hidden lg:block">
              <AIPanel code={code} language={language} onCodeResult={applyAiCode} />
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
