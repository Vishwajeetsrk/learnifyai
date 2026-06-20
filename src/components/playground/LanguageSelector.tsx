import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

interface LangItem {
  id: string;
  label: string;
  color: string;
}

const LANGUAGES: LangItem[] = [
  { id: "javascript", label: "JavaScript", color: "#F7DF1E" },
  { id: "typescript", label: "TypeScript", color: "#3178C6" },
  { id: "python", label: "Python", color: "#3776AB" },
  { id: "java", label: "Java", color: "#007396" },
  { id: "cpp", label: "C++", color: "#00599C" },
  { id: "c", label: "C", color: "#A8B9CC" },
  { id: "csharp", label: "C#", color: "#239120" },
  { id: "go", label: "Go", color: "#00ADD8" },
  { id: "rust", label: "Rust", color: "#000000" },
  { id: "php", label: "PHP", color: "#777BB4" },
  { id: "ruby", label: "Ruby", color: "#CC342D" },
  { id: "swift", label: "Swift", color: "#F05138" },
  { id: "kotlin", label: "Kotlin", color: "#7F52FF" },
  { id: "scala", label: "Scala", color: "#DC322F" },
  { id: "dart", label: "Dart", color: "#0175C2" },
  { id: "elixir", label: "Elixir", color: "#4B275F" },
  { id: "haskell", label: "Haskell", color: "#5D4F85" },
  { id: "lua", label: "Lua", color: "#2C2D72" },
  { id: "r", label: "R", color: "#276DC3" },
  { id: "perl", label: "Perl", color: "#39457E" },
  { id: "bash", label: "Bash", color: "#4EAA25" },
  { id: "powershell", label: "PowerShell", color: "#5391FE" },
  { id: "sql", label: "SQL", color: "#4479A1" },
  { id: "zig", label: "Zig", color: "#F7A41D" },
  { id: "julia", label: "Julia", color: "#9558B2" },
  { id: "nim", label: "Nim", color: "#FFE953" },
  { id: "groovy", label: "Groovy", color: "#4298B8" },
  { id: "html", label: "HTML", color: "#E34F26" },
  { id: "css", label: "CSS", color: "#1572B6" },
];

const LOGO_URL = (id: string) => {
  const map: Record<string, string> = {
    javascript: "https://cdn.simpleicons.org/javascript/F7DF1E",
    typescript: "https://cdn.simpleicons.org/typescript/3178C6",
    python: "https://cdn.simpleicons.org/python/3776AB",
    java: "https://cdn.simpleicons.org/java/007396",
    cpp: "https://cdn.simpleicons.org/cplusplus/00599C",
    c: "https://cdn.simpleicons.org/c/A8B9CC",
    csharp: "https://cdn.simpleicons.org/csharp/239120",
    go: "https://cdn.simpleicons.org/go/00ADD8",
    rust: "https://cdn.simpleicons.org/rust/000000",
    php: "https://cdn.simpleicons.org/php/777BB4",
    ruby: "https://cdn.simpleicons.org/ruby/CC342D",
    swift: "https://cdn.simpleicons.org/swift/F05138",
    kotlin: "https://cdn.simpleicons.org/kotlin/7F52FF",
    scala: "https://cdn.simpleicons.org/scala/DC322F",
    dart: "https://cdn.simpleicons.org/dart/0175C2",
    elixir: "https://cdn.simpleicons.org/elixir/4B275F",
    haskell: "https://cdn.simpleicons.org/haskell/5D4F85",
    lua: "https://cdn.simpleicons.org/lua/2C2D72",
    r: "https://cdn.simpleicons.org/r/276DC3",
    perl: "https://cdn.simpleicons.org/perl/39457E",
    bash: "https://cdn.simpleicons.org/gnubash/4EAA25",
    powershell: "https://cdn.simpleicons.org/powershell/5391FE",
    sql: "https://cdn.simpleicons.org/sqlite/003B57",
    zig: "https://cdn.simpleicons.org/zig/F7A41D",
    julia: "https://cdn.simpleicons.org/julia/9558B2",
    nim: "https://cdn.simpleicons.org/nim/FFE953",
    groovy: "https://cdn.simpleicons.org/apachegroovy/4298B8",
    html: "https://cdn.simpleicons.org/html5/E34F26",
    css: "https://cdn.simpleicons.org/css3/1572B6",
  };
  return map[id];
};

interface LanguageSelectorProps {
  value: string;
  onChange: (lang: string) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const active = LANGUAGES.find((l) => l.id === value) ?? LANGUAGES[0];
  const filtered = LANGUAGES.filter((l) => l.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 h-8 text-xs rounded-lg border bg-card px-2 hover:bg-accent"
      >
        <img
          src={LOGO_URL(active.id)}
          alt=""
          className="w-4 h-4 shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <span className="hidden sm:inline">{active.label}</span>
        <span className="sm:hidden">{active.id}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-20 w-56 max-h-72 rounded-lg border bg-popover shadow-lg overflow-hidden">
            <div className="p-2 border-b">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted">
                <Search className="h-3 w-3 text-muted-foreground shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search languages..."
                  className="bg-transparent text-xs outline-none w-full placeholder:text-muted-foreground"
                  autoFocus
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-56">
              {filtered.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    onChange(l.id);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left transition ${value === l.id ? "bg-primary/10 text-primary" : "hover:bg-accent"}`}
                >
                  <img
                    src={LOGO_URL(l.id)}
                    alt=""
                    className="w-4 h-4 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  {l.label}
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="px-3 py-4 text-xs text-muted-foreground text-center">
                  No languages found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
