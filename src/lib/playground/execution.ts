import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const RunCodeSchema = z.object({
  language: z.string().min(1).max(50),
  code: z.string().min(1).max(500_000),
  stdin: z.string().max(100_000).default(""),
  projectId: z.string().uuid().optional(),
});

const WANDBOX_API = "https://wandbox.org/api";

const LANGUAGE_COMPILER: Record<string, string> = {
  javascript: "nodejs-20.17.0",
  typescript: "typescript-5.6.2",
  python: "cpython-head",
  java: "openjdk-jdk-22+36",
  cpp: "gcc-head",
  c: "gcc-head-c",
  csharp: "mono-6.12.0.199",
  go: "go-1.23.2",
  rust: "rust-1.82.0",
  php: "php-8.3.12",
  ruby: "ruby-4.0.2",
  swift: "swift-6.0.1",
  scala: "scala-3.5.1",
  haskell: "ghc-9.10.1",
  lua: "lua-5.4.7",
  perl: "perl-5.42.0",
  bash: "bash",
  sql: "sqlite-3.46.1",
  julia: "julia-1.10.5",
  nim: "nim-2.2.10",
  groovy: "groovy-4.0.23",
  elixir: "elixir-1.17.3",
  r: "r-4.4.1",
  zig: "zig-head",
  ocaml: "ocaml-5.2.0",
  erlang: "erlang-27.1",
  d: "dmd-2.109.1",
  kotlin: "kotlin-2.0.21",
  dart: "dart-3.5.3",
};

export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_COMPILER).sort();

function pickCompiler(language: string): string {
  return LANGUAGE_COMPILER[language] || language;
}

export const executeCode = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => RunCodeSchema.parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const compiler = pickCompiler(data.language);

    const startTime = Date.now();
    let stdout = "", stderr = "", exitCode = -1, status = "success";

    try {
      const res = await fetch(`${WANDBOX_API}/compile.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          compiler,
          code: data.code,
          stdin: data.stdin,
          save: false,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "Unknown error");
        throw new Error(`Wandbox error (${res.status}): ${text.slice(0, 500)}`);
      }

      const json = await res.json();
      stdout = json.output ?? "";
      stderr = json.compiler_error ?? json.signal ?? "";
      exitCode = json.status !== "0" ? 1 : 0;
      if (!stdout && !stderr) {
        stdout = json.program_message ?? "";
      }
    } catch (err: any) {
      stderr = err?.message ?? "Execution failed";
      exitCode = 1;
      status = "error";
    }

    const elapsed = Date.now() - startTime;

    try {
      await supabase.from("playground_runs").insert({
        user_id: userId,
        project_id: data.projectId || null,
        language: data.language,
        code: data.code.slice(0, 10000),
        stdin: data.stdin,
        stdout: stdout.slice(0, 50000),
        stderr: stderr.slice(0, 50000),
        exit_code: exitCode,
        execution_time_ms: elapsed,
        status,
      });
    } catch { /* non-fatal */ }

    return { success: true as const, stdout, stderr, code: exitCode, time_ms: elapsed };
  });

export const getRunHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("playground_runs")
      .select("id, language, exit_code, execution_time_ms, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const executeTestCases = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({
    language: z.string(),
    code: z.string(),
    testCases: z.array(z.object({
      input: z.any(),
      expected: z.any(),
    })),
  }).parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const results: { passed: boolean; input: any; expected: any; actual: any; error?: string }[] = [];
    for (const tc of data.testCases) {
      try {
        const args = Object.values(tc.input as Record<string, any>).map((v) => JSON.stringify(v)).join(", ");
        const testCode = `${data.code}\n\nconsole.log(JSON.stringify(main(${args})));`;
        const res = await executeCode({ data: { language: data.language, code: testCode, stdin: "" }, context: null as any });
        if (!res.success) {
          results.push({ passed: false, input: tc.input, expected: tc.expected, actual: null, error: res.error });
        } else {
          const actual = JSON.parse((res as any).stdout?.trim() || "null");
          const passed = JSON.stringify(actual) === JSON.stringify(tc.expected);
          results.push({ passed, input: tc.input, expected: tc.expected, actual });
        }
      } catch (err: any) {
        results.push({ passed: false, input: tc.input, expected: tc.expected, actual: null, error: err.message });
      }
    }
    return { results, passed: results.every((r) => r.passed), total: results.length, passedCount: results.filter((r) => r.passed).length };
  });
