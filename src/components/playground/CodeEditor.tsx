import { useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { Loader2, Expand, Shrink } from "lucide-react";

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  height?: string;
  fontSize?: number;
  readOnly?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export function CodeEditor({
  language,
  value,
  onChange,
  height = "100%",
  fontSize = 13,
  readOnly,
  onKeyDown,
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMount = useCallback((editor: any) => {
    editorRef.current = editor;
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  }, []);

  const monacoLang =
    {
      csharp: "csharp",
      cpp: "cpp",
      typescript: "typescript",
      javascript: "javascript",
      python: "python",
      java: "java",
      go: "go",
      rust: "rust",
      ruby: "ruby",
      php: "php",
      swift: "swift",
      kotlin: "kotlin",
      scala: "scala",
      dart: "dart",
      elixir: "elixir",
      haskell: "haskell",
      lua: "lua",
      r: "r",
      perl: "perl",
      bash: "shell",
      powershell: "powershell",
      sql: "sql",
      zig: "zig",
      julia: "julia",
      nim: "nim",
      groovy: "groovy",
      html: "html",
      css: "css",
      xml: "xml",
      json: "json",
      markdown: "markdown",
      yaml: "yaml",
    }[language] || language;

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden group"
      onKeyDown={onKeyDown}
    >
      <Editor
        height={height}
        language={monacoLang}
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        onMount={handleMount}
        loading={
          <div className="h-full grid place-items-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        }
        options={{
          fontSize,
          minimap: { enabled: fontSize >= 12 },
          lineNumbers: "on",
          tabSize: 2,
          automaticLayout: true,
          padding: { top: 8 },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          readOnly: readOnly ?? false,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          formatOnPaste: true,
          cursorBlinking: "smooth",
          smoothScrolling: true,
          bracketPairColorization: { enabled: true },
          renderLineHighlight: "all",
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontLigatures: true,
        }}
      />
      <button
        onClick={toggleFullscreen}
        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white/70 hover:bg-black/70 hover:text-white opacity-0 group-hover:opacity-100 transition text-xs z-10"
        title={document.fullscreenElement ? "Exit fullscreen" : "Fullscreen"}
      >
        {document.fullscreenElement ? (
          <Shrink className="h-3.5 w-3.5" />
        ) : (
          <Expand className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
