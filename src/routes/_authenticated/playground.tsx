import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { Loader2, Play, RotateCcw, Copy, Check, ChevronDown } from "lucide-react";
import Editor from "@monaco-editor/react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { executeCode, SUPPORTED_LANGUAGES } from "@/lib/playground.functions";

export const Route = createFileRoute("/_authenticated/playground")({
  head: () => ({ meta: [{ title: "Playground — Learnify AI" }] }),
  component: PlaygroundPage,
});

const DEFAULT_CODE: Record<string, string> = {
  javascript: `// JavaScript Playground\nconsole.log("Hello, world!");`,
  typescript: `// TypeScript Playground\nconst message: string = "Hello, world!";\nconsole.log(message);`,
  python: `# Python Playground\nprint("Hello, world!")`,
  cpp: `#include <iostream>\n\nint main() {\n  std::cout << "Hello, world!" << std::endl;\n  return 0;\n}`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, world!");\n  }\n}`,
  rust: `fn main() {\n  println!("Hello, world!");\n}`,
  go: `package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, world!")\n}`,
  ruby: `# Ruby Playground\nputs "Hello, world!"`,
  php: `<?php\necho "Hello, world!";`,
  csharp: `using System;\n\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello, world!");\n  }\n}`,
  sql: `-- SQL Playground\nSELECT 'Hello, world!' AS greeting;`,
  bash: `#!/bin/bash\necho "Hello, world!"`,
};

function PlaygroundPage() {
  const [lang, setLang] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [stdin, setStdin] = useState("");
  const [running, setRunning] = useState(false);
  const [stdout, setStdout] = useState<string | null>(null);
  const [stderr, setStderr] = useState<string | null>(null);
  const [exitCode, setExitCode] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const handleLangChange = useCallback((l: string) => {
    setLang(l);
    setCode(DEFAULT_CODE[l] ?? `// ${l}\n`);
    setStdout(null);
    setStderr(null);
    setExitCode(null);
    setLangOpen(false);
  }, []);

  const handleRun = useCallback(async () => {
    setRunning(true);
    setStdout(null);
    setStderr(null);
    setExitCode(null);
    try {
      const res = await executeCode({ data: { language: lang, code, stdin } });
      if (res.success) {
        setStdout(res.stdout);
        setStderr(res.stderr);
        setExitCode(res.code);
      } else {
        setStderr(res.error);
        setExitCode(1);
      }
    } catch (err: any) {
      setStderr(err?.message ?? "Execution failed");
      setExitCode(1);
    } finally {
      setRunning(false);
    }
  }, [lang, code, stdin]);

  const handleReset = useCallback(() => {
    setCode(DEFAULT_CODE[lang] ?? "");
    setStdout(null);
    setStderr(null);
    setExitCode(null);
    setStdin("");
  }, [lang]);

  const handleCopyOutput = useCallback(() => {
    const text = stdout || stderr || "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [stdout, stderr]);

  const langDisplay = SUPPORTED_LANGUAGES.find((l) => l === lang) ?? lang;

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex items-center gap-2 border-b px-4 py-2 shrink-0">
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border bg-card hover:bg-accent"
            >
              {langDisplay} <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                <div className="absolute top-full left-0 mt-1 z-20 w-44 max-h-64 overflow-y-auto rounded-lg border bg-popover shadow-lg">
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l}
                      onClick={() => handleLangChange(l)}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-sm transition",
                        l === lang
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-accent text-popover-foreground",
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex-1" />

          <Button size="sm" variant="outline" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" onClick={handleRun} disabled={running}>
            {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            Run
          </Button>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0">
          <div className="border-r min-h-0 overflow-hidden">
            <Editor
              height="100%"
              language={lang === "csharp" ? "csharp" : lang === "cpp" ? "cpp" : lang}
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v ?? "")}
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                tabSize: 2,
                automaticLayout: true,
                padding: { top: 8 },
              }}
            />
          </div>

          <div className="flex flex-col min-h-0">
            <div className="flex items-center gap-2 px-4 py-1.5 border-b shrink-0">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Output</span>
              <div className="flex-1" />
              {(stdout || stderr) && (
                <button onClick={handleCopyOutput} className="p-1 text-muted-foreground hover:text-foreground">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              )}
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                {stdout && <div className="text-foreground">{stdout}</div>}
                {stderr && <div className="text-destructive">{stderr}</div>}
                {exitCode !== null && (
                  <div className={cn("mt-2 text-[11px]", exitCode === 0 ? "text-green-500" : "text-destructive")}>
                    Exit code: {exitCode}
                  </div>
                )}
                {!stdout && !stderr && !running && (
                  <span className="text-muted-foreground">Press Run to execute your code</span>
                )}
                {running && <span className="text-muted-foreground animate-pulse">Running...</span>}
              </div>
            </ScrollArea>

            <div className="border-t">
              <div className="px-4 py-1.5 border-b">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Stdin</span>
              </div>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Input for your program (stdin)..."
                className="w-full font-mono text-xs p-3 resize-none border-0 bg-background focus:outline-none"
                rows={3}
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
