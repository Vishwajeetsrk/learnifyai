export type LangKey =
  | "python"
  | "javascript"
  | "typescript"
  | "java"
  | "c"
  | "cpp"
  | "csharp"
  | "php"
  | "go"
  | "rust"
  | "ruby"
  | "bash"
  | "kotlin"
  | "swift"
  | "dart"
  | "scala"
  | "sql";

export type ProviderKey = "judge0" | "piston" | "wandbox";

interface LangSpec {
  label: string;
  monaco: string;
  judge0?: { id: number };
  wandbox?: { compiler: string };
  piston?: { language: string; version: string; filename: string };
  starter: string;
  runnable?: boolean;
}

export const LANGUAGES: Record<LangKey, LangSpec> = {
  python: {
    label: "Python",
    monaco: "python",
    judge0: { id: 71 },
    wandbox: { compiler: "cpython-3.14.0" },
    piston: { language: "python", version: "3.10.0", filename: "main.py" },
    starter: `print("Hello from Python")`,
  },
  javascript: {
    label: "JavaScript",
    monaco: "javascript",
    judge0: { id: 63 },
    wandbox: { compiler: "nodejs-20.17.0" },
    piston: { language: "javascript", version: "18.15.0", filename: "main.js" },
    starter: `console.log("Hello from JavaScript");`,
  },
  typescript: {
    label: "TypeScript",
    monaco: "typescript",
    judge0: { id: 74 },
    wandbox: { compiler: "typescript-5.6.2" },
    piston: { language: "typescript", version: "5.0.3", filename: "main.ts" },
    starter: `const msg: string = "Hello from TypeScript";\nconsole.log(msg);`,
  },
  java: {
    label: "Java",
    monaco: "java",
    judge0: { id: 62 },
    wandbox: { compiler: "openjdk-jdk-22+36" },
    piston: { language: "java", version: "15.0.2", filename: "Main.java" },
    starter: `class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello from Java");\n  }\n}`,
  },
  c: {
    label: "C",
    monaco: "c",
    judge0: { id: 50 },
    wandbox: { compiler: "gcc-13.2.0-c" },
    piston: { language: "c", version: "10.2.0", filename: "main.c" },
    starter: `#include <stdio.h>\nint main(){ printf("Hello from C\\n"); return 0; }`,
  },
  cpp: {
    label: "C++",
    monaco: "cpp",
    judge0: { id: 54 },
    wandbox: { compiler: "gcc-13.2.0" },
    piston: { language: "c++", version: "10.2.0", filename: "main.cpp" },
    starter: `#include <iostream>\nint main(){ std::cout << "Hello from C++" << std::endl; return 0; }`,
  },
  csharp: {
    label: "C#",
    monaco: "csharp",
    judge0: { id: 51 },
    wandbox: { compiler: "mono-6.12.0.199" },
    piston: { language: "csharp", version: "6.12.0", filename: "Main.cs" },
    starter: `using System;\nclass Program { static void Main(){ Console.WriteLine("Hello from C#"); } }`,
  },
  php: {
    label: "PHP",
    monaco: "php",
    judge0: { id: 68 },
    wandbox: { compiler: "php-8.3.12" },
    piston: { language: "php", version: "8.2.3", filename: "main.php" },
    starter: `<?php\necho "Hello from PHP\\n";`,
  },
  go: {
    label: "Go",
    monaco: "go",
    judge0: { id: 60 },
    wandbox: { compiler: "go-1.23.2" },
    piston: { language: "go", version: "1.16.2", filename: "main.go" },
    starter: `package main\nimport "fmt"\nfunc main(){ fmt.Println("Hello from Go") }`,
  },
  rust: {
    label: "Rust",
    monaco: "rust",
    judge0: { id: 73 },
    wandbox: { compiler: "rust-1.82.0" },
    piston: { language: "rust", version: "1.68.2", filename: "main.rs" },
    starter: `fn main(){ println!("Hello from Rust"); }`,
  },
  ruby: {
    label: "Ruby",
    monaco: "ruby",
    judge0: { id: 72 },
    wandbox: { compiler: "ruby-3.4.9" },
    starter: `puts "Hello from Ruby"`,
  },
  bash: {
    label: "Bash",
    monaco: "shell",
    judge0: { id: 46 },
    wandbox: { compiler: "bash" },
    starter: `echo "Hello from Bash"`,
  },
  kotlin: {
    label: "Kotlin",
    monaco: "kotlin",
    judge0: { id: 78 },
    piston: { language: "kotlin", version: "1.8.20", filename: "main.kt" },
    starter: `fun main() {\n  println("Hello from Kotlin")\n}`,
  },
  swift: {
    label: "Swift",
    monaco: "swift",
    wandbox: { compiler: "swift-5.10.1" },
    piston: { language: "swift", version: "5.3.3", filename: "main.swift" },
    starter: `let name = "Swift"\nprint("Hello from \\(name)")`,
  },
  scala: {
    label: "Scala",
    monaco: "scala",
    wandbox: { compiler: "scala-3.5.0" },
    piston: { language: "scala", version: "3.2.2", filename: "Main.scala" },
    starter: `@main def hello() = println("Hello from Scala")`,
  },
  dart: {
    label: "Dart",
    monaco: "dart",
    piston: { language: "dart", version: "2.19.6", filename: "main.dart" },
    starter: `void main() {\n  print('Hello from Dart');\n}`,
  },
  sql: {
    label: "SQL",
    monaco: "sql",
    wandbox: { compiler: "sqlite-3.46.1" },
    piston: { language: "sqlite3", version: "3.36.0", filename: "main.sql" },
    starter: `SELECT 'Hello from SQL' AS greeting;`,
  },
};

export const PLAYGROUND_LANGS = Object.entries(LANGUAGES).map(([id, spec]) => ({
  id,
  label: spec.label,
  color: "#666",
}));

export const PLAYGROUND_DEFAULTS: Record<string, string> = {};
for (const [key, spec] of Object.entries(LANGUAGES)) {
  PLAYGROUND_DEFAULTS[key] = spec.starter;
}

export const PROVIDERS: Record<ProviderKey, { label: string; description: string }> = {
  judge0: { label: "Judge0 CE", description: "Public Judge0 CE runner" },
  piston: { label: "Piston", description: "Engineer-Man Piston runner" },
  wandbox: { label: "Wandbox", description: "Free public Wandbox compiler" },
};
