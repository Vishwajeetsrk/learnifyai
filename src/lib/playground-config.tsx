import { useState } from "react";

// ---------- Shared playground / exercise configuration ----------

export const LANG_LOGOS: Record<string, string> = {
  python: "https://cdn.simpleicons.org/python/3776AB",
  javascript: "https://cdn.simpleicons.org/javascript/F7DF1E",
  typescript: "https://cdn.simpleicons.org/typescript/3178C6",
  cpp: "https://cdn.simpleicons.org/cplusplus/00599C",
  c: "https://cdn.simpleicons.org/c/A8B9CC",
  java: "https://cdn.simpleicons.org/java/007396",
  go: "https://cdn.simpleicons.org/go/00ADD8",
  rust: "https://cdn.simpleicons.org/rust/000000",
  ruby: "https://cdn.simpleicons.org/ruby/CC342D",
  php: "https://cdn.simpleicons.org/php/777BB4",
  bash: "https://cdn.simpleicons.org/gnubash/4EAA25",
  sql: "https://cdn.simpleicons.org/sqlite/003B57",
  swift: "https://cdn.simpleicons.org/swift/F05138",
  kotlin: "https://cdn.simpleicons.org/kotlin/7F52FF",
  scala: "https://cdn.simpleicons.org/scala/DC322F",
  dart: "https://cdn.simpleicons.org/dart/0175C2",
  elixir: "https://cdn.simpleicons.org/elixir/4B275F",
  haskell: "https://cdn.simpleicons.org/haskell/5D4F85",
  lua: "https://cdn.simpleicons.org/lua/2C2D72",
  perl: "https://cdn.simpleicons.org/perl/39457E",
  r: "https://cdn.simpleicons.org/r/276DC3",
  csharp: "https://cdn.simpleicons.org/csharp/239120",
  zig: "https://cdn.simpleicons.org/zig/F7A41D",
  julia: "https://cdn.simpleicons.org/julia/9558B2",
  lisp: "https://cdn.simpleicons.org/lisp/3F0000",
  nim: "https://cdn.simpleicons.org/nim/FFE953",
  groovy: "https://cdn.simpleicons.org/apachegroovy/4298B8",
  powershell: "https://cdn.simpleicons.org/powershell/5391FE",
  html5: "https://cdn.simpleicons.org/html5/E34F26",
  css3: "https://cdn.simpleicons.org/css3/1572B6",
};

export const LANG_COLORS: Record<string, string> = {
  python: "#3776AB",
  javascript: "#F7DF1E",
  typescript: "#3178C6",
  cpp: "#00599C",
  c: "#A8B9CC",
  java: "#007396",
  go: "#00ADD8",
  rust: "#000000",
  ruby: "#CC342D",
  php: "#777BB4",
  bash: "#4EAA25",
  sql: "#003B57",
  swift: "#F05138",
  kotlin: "#7F52FF",
  scala: "#DC322F",
  dart: "#0175C2",
  elixir: "#4B275F",
  haskell: "#5D4F85",
  lua: "#2C2D72",
  perl: "#39457E",
  r: "#276DC3",
  csharp: "#239120",
  zig: "#F7A41D",
  julia: "#9558B2",
  lisp: "#3F0000",
  nim: "#FFE953",
  groovy: "#4298B8",
  powershell: "#5391FE",
  html5: "#E34F26",
  css3: "#1572B6",
};

export function LanguageIcon({ id, className }: { id: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const url = LANG_LOGOS[id];
  if (failed || !url) {
    const color = LANG_COLORS[id] || "#666";
    return (
      <span
        className={`w-5 h-5 rounded grid place-items-center text-[8px] font-bold text-white shrink-0 ${className ?? ""}`}
        style={{ background: color }}
      >
        {id.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return (
    <img
      src={url}
      alt={id}
      className={`w-5 h-5 shrink-0 ${className ?? ""}`}
      onError={() => setFailed(true)}
    />
  );
}

export const PLAYGROUND_LANGS = [
  { id: "python", label: "Python", color: "#3776AB" },
  { id: "javascript", label: "JavaScript", color: "#F7DF1E" },
  { id: "typescript", label: "TypeScript", color: "#3178C6" },
  { id: "cpp", label: "C++", color: "#00599C" },
  { id: "c", label: "C", color: "#A8B9CC" },
  { id: "java", label: "Java", color: "#007396" },
  { id: "go", label: "Go", color: "#00ADD8" },
  { id: "rust", label: "Rust", color: "#000000" },
  { id: "ruby", label: "Ruby", color: "#CC342D" },
  { id: "php", label: "PHP", color: "#777BB4" },
  { id: "swift", label: "Swift", color: "#F05138" },
  { id: "kotlin", label: "Kotlin", color: "#7F52FF" },
  { id: "dart", label: "Dart", color: "#0175C2" },
  { id: "scala", label: "Scala", color: "#DC322F" },
  { id: "elixir", label: "Elixir", color: "#4B275F" },
  { id: "haskell", label: "Haskell", color: "#5D4F85" },
  { id: "lua", label: "Lua", color: "#2C2D72" },
  { id: "r", label: "R", color: "#276DC3" },
  { id: "csharp", label: "C#", color: "#239120" },
  { id: "zig", label: "Zig", color: "#F7A41D" },
  { id: "julia", label: "Julia", color: "#9558B2" },
  { id: "nim", label: "Nim", color: "#FFE953" },
  { id: "perl", label: "Perl", color: "#39457E" },
  { id: "groovy", label: "Groovy", color: "#4298B8" },
  { id: "bash", label: "Bash", color: "#4EAA25" },
  { id: "powershell", label: "PowerShell", color: "#5391FE" },
  { id: "sql", label: "SQL", color: "#4479A1" },
];

export const PLAYGROUND_DEFAULTS: Record<string, string> = {
  python: 'print("Hello, world!")',
  javascript: 'console.log("Hello, world!");',
  typescript: 'const msg: string = "Hello, world!";\nconsole.log(msg);',
  cpp: '#include <iostream>\n\nint main() {\n  std::cout << "Hello, world!" << std::endl;\n  return 0;\n}',
  c: '#include <stdio.h>\n\nint main() {\n  printf("Hello, world!\\n");\n  return 0;\n}',
  java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, world!");\n  }\n}',
  go: 'package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, world!")\n}',
  rust: 'fn main() {\n  println!("Hello, world!");\n}',
  ruby: 'puts "Hello, world!"',
  php: '<?php\necho "Hello, world!";',
  bash: '#!/bin/bash\necho "Hello, world!"',
  sql: "SELECT 'Hello, world!' AS greeting;",
};

/** Map playground language ids to Monaco language ids. */
export function monacoLang(id: string): string {
  if (id === "cpp") return "cpp";
  if (id === "c") return "c";
  if (id === "csharp") return "csharp";
  return id;
}
