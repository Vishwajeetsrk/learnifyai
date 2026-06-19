import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const RunCodeSchema = z.object({
  language: z.string().min(1).max(50),
  code: z.string().min(1).max(500_000),
  stdin: z.string().max(100_000).default(""),
  projectId: z.string().uuid().optional(),
});

const LANGUAGE_VERSIONS: Record<string, string> = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  python2: "2.7.18",
  cpp: "10.2.0",
  c: "10.2.0",
  java: "15.0.2",
  go: "1.16.2",
  rust: "1.68.2",
  ruby: "3.0.1",
  php: "8.2.3",
  swift: "5.3.3",
  kotlin: "1.8.20",
  scala: "3.2.2",
  dart: "2.19.6",
  elixir: "1.14.3",
  haskell: "9.0.1",
  lua: "5.4.4",
  perl: "5.36.0",
  r: "4.2.3",
  bash: "5.2.15",
  powershell: "7.3.4",
  sql: "3.42.0",
  csharp: "6.12.0",
  fsharp: "7.0.200",
  zig: "0.10.1",
  ocaml: "4.14.0",
  clojure: "1.11.1",
  erlang: "25.2.2",
  elm: "0.19.1",
  julia: "1.8.5",
  d: "2.100.0",
  fortran: "11.3.0",
  lisp: "2.1.2",
  cobol: "3.1.2",
  prolog: "8.4.2",
  racket: "8.7.0",
  nim: "1.6.8",
  groovy: "4.0.9",
  matlab: "R2020a",
  assembly: "2.14.1",
  vlang: "0.3.2",
};

export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_VERSIONS).sort();

const PISTON_DEAD_MSG = "Public Piston API is now whitelist-only since Feb 2026. " +
  "For JS/TS, the playground uses local Node.js execution. " +
  "For other languages, set the PISTON_URL env var to your self-hosted Piston instance " +
  "(https://github.com/engineer-man/piston).";

function tryRunWithJavascript(code: string, stdin: string) {
  try {
    const vm = require("node:vm");
    let __stdout = "";
    let __stderr = "";
    const sandbox: Record<string, any> = {
      console: {
        log: (...args: any[]) => { __stdout += args.map((a: any) => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ") + "\n"; },
        error: (...args: any[]) => { __stderr += args.map((a: any) => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ") + "\n"; },
        warn: (...args: any[]) => { __stdout += args.map((a: any) => String(a)).join(" ") + "\n"; },
      },
      __stdin: stdin,
      JSON, Math, Date, RegExp, Error, Array, Object, String, Number, Boolean, Map, Set, WeakMap, WeakSet, Promise,
      parseInt, parseFloat, isNaN, isFinite, decodeURI, encodeURI, decodeURIComponent, encodeURIComponent,
      Infinity, NaN, undefined, setTimeout, clearTimeout, setInterval, clearInterval,
    };
    const wrapped = `"use strict";\n${code}`;
    const script = new vm.Script(wrapped, { timeout: 5000 });
    script.runInNewContext(sandbox, { timeout: 5000 });
    return { stdout: __stdout, stderr: __stderr, code: 0 };
  } catch (err: any) {
    return { stdout: "", stderr: err?.message ?? "Execution failed", code: 1 };
  }
}

function transpileTs(code: string): string {
  try {
    const ts = require("typescript");
    const result = ts.transpileModule(code, {
      target: ts.ScriptTarget.ES2020,
      noEmit: true,
      removeComments: true,
    });
    return result?.outputText ?? code;
  } catch { return code; }
}

export const executeCode = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => RunCodeSchema.parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const version = LANGUAGE_VERSIONS[data.language];
    if (!version) return { success: false as const, error: `Unsupported language: ${data.language}` };

    const startTime = Date.now();
    let stdout = "", stderr = "", exitCode = -1, status = "success";

    try {
      if (data.language === "javascript" || data.language === "typescript") {
        const jsCode = data.language === "typescript" ? transpileTs(data.code) : data.code;
        const local = tryRunWithJavascript(jsCode, data.stdin);
        stdout = local.stdout; stderr = local.stderr; exitCode = local.code;
      } else {
        const pistonUrl = process.env.PISTON_URL || "https://emkc.org/api/v2/piston";
        const res = await fetch(`${pistonUrl}/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: data.language, version,
            files: [{ name: "code", content: data.code }],
            stdin: data.stdin,
            compile_timeout: 10000,
            run_timeout: 5000,
          }),
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "Unknown error");
          const isDead = res.status === 401 || text.includes("whitelist");
          if (pistonUrl.includes("emkc.org") && isDead) {
            return { success: false as const, error: PISTON_DEAD_MSG };
          }
          throw new Error(`Piston error (${res.status}): ${text}`);
        }
        const json = await res.json();
        const run = json.run || {};
        stdout = run.stdout ?? ""; stderr = run.stderr ?? ""; exitCode = run.code ?? -1;
      }
    } catch (err: any) {
      stderr = err?.message ?? "Execution failed";
      exitCode = 1;
      status = "error";
    }

    const elapsed = Date.now() - startTime;

    // Save run history
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
        // Build test harness
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
