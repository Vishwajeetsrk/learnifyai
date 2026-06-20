import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { LangKey, ProviderKey } from "./executors";

const RunSchema = z.object({
  language: z.string().min(1).max(50),
  code: z.string().min(1).max(500_000),
  stdin: z.string().max(100_000).default(""),
});

// ---- JS/TS local VM execution (fast, no network) ----
function tryRunWithJavascript(code: string, stdin: string) {
  try {
    const vm = require("node:vm");
    let __stdout = "";
    let __stderr = "";
    const sandbox = {
      console: {
        log: (...args: any[]) => { __stdout += args.map((a: any) => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ") + "\n"; },
        error: (...args: any[]) => { __stderr += args.map((a: any) => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ") + "\n"; },
        warn: (...args: any[]) => { __stdout += args.map((a: any) => String(a)).join(" ") + "\n"; },
      },
      __stdin: stdin,
      JSON, Math, Date, RegExp, Error, Array, Object, String, Number, Boolean, Map, Set, WeakMap, WeakSet, Promise, parseInt, parseFloat, isNaN, isFinite, decodeURI, encodeURI, decodeURIComponent, encodeURIComponent, Infinity, NaN, undefined,
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
      target: ts.ScriptTarget.ES2020, noEmit: true, removeComments: true,
    });
    return result?.outputText ?? code;
  } catch { return code; }
}

// ---- Multi-provider runners (Judge0, Wandbox, Piston) ----

interface RunResult {
  stdout: string; stderr: string; code: number | null; signal: string | null; provider: string;
}

const PISTON_URL = process.env.PISTON_URL || "https://emkc.org/api/v2/piston";
const JUDGE0_URL = process.env.JUDGE0_URL || "https://ce.judge0.com";

const PISTON_DEAD = "Public Piston is whitelist-only since Feb 2026. For non-JS/TS languages, Judge0 or Wandbox are used as fallback.";

async function runJudge0(lang: string, source: string, stdin: string): Promise<RunResult> {
  const spec = (await import("./executors")).LANGUAGES[lang as LangKey]?.judge0;
  if (!spec) throw new Error(`Judge0: no config for ${lang}`);
  const res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language_id: spec.id, source_code: source, stdin: stdin || undefined }),
  });
  const text = await res.text();
  let data: any = {};
  try { data = JSON.parse(text); } catch { /* ignore */ }
  if (!res.ok) throw new Error(`Judge0 ${res.status}: ${data?.error || text.slice(0, 200)}`);
  return {
    stdout: data.stdout ?? "", stderr: (data.compile_output ?? "") + (data.stderr ?? ""),
    code: data.exit_code ?? null, signal: data.signal ?? null, provider: "judge0",
  };
}

async function runWandbox(lang: string, source: string, stdin: string): Promise<RunResult> {
  const spec = (await import("./executors")).LANGUAGES[lang as LangKey]?.wandbox;
  if (!spec) throw new Error(`Wandbox: no config for ${lang}`);
  const res = await fetch("https://wandbox.org/api/compile.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: source, compiler: spec.compiler, stdin }),
  });
  if (!res.ok) throw new Error(`Wandbox ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const stderr = [data.compiler_error, data.program_error].filter(Boolean).join("\n");
  return {
    stdout: data.program_output ?? "", stderr,
    code: data.status != null ? Number(data.status) : null, signal: data.signal ?? null, provider: "wandbox",
  };
}

async function runPiston(lang: string, source: string, stdin: string): Promise<RunResult> {
  const spec = (await import("./executors")).LANGUAGES[lang as LangKey]?.piston;
  if (!spec) throw new Error(`Piston: no config for ${lang}`);
  if (PISTON_URL.includes("emkc.org")) throw new Error(PISTON_DEAD);
  const res = await fetch(`${PISTON_URL}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language: spec.language, version: spec.version, stdin, files: [{ name: spec.filename, content: source }] }),
  });
  const text = await res.text();
  let data: any = {};
  try { data = JSON.parse(text); } catch { /* ignore */ }
  if (!res.ok) throw new Error(`Piston ${res.status}: ${data?.message || text.slice(0, 200)}`);
  const run = data.run ?? {};
  const compile = data.compile ?? {};
  return {
    stdout: (compile.stdout ?? "") + (run.stdout ?? ""), stderr: (compile.stderr ?? "") + (run.stderr ?? ""),
    code: run.code ?? compile.code ?? null, signal: run.signal ?? null, provider: "piston",
  };
}

export const executeCode = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => RunSchema.parse(d))
  .handler(async ({ data }) => {
    // JS/TS: local VM (fastest)
    if (data.language === "javascript" || data.language === "typescript") {
      const jsCode = data.language === "typescript" ? transpileTs(data.code) : data.code;
      const local = tryRunWithJavascript(jsCode, data.stdin);
      return { success: true as const, ...local, signal: null, provider: "local" };
    }

    // Try Judge0 -> Wandbox -> Piston fallback chain
    const order: (() => Promise<RunResult>)[] = [
      () => runJudge0(data.language, data.code, data.stdin),
      () => runWandbox(data.language, data.code, data.stdin),
    ];
    if (!PISTON_URL.includes("emkc.org")) {
      order.push(() => runPiston(data.language, data.code, data.stdin));
    }

    for (let i = 0; i < order.length; i++) {
      try {
        const result = await order[i]();
        return {
          success: true as const, stdout: result.stdout, stderr: result.stderr,
          code: result.code ?? 1, signal: result.signal, provider: result.provider,
        };
      } catch (err: any) {
        const isLast = i === order.length - 1;
        if (isLast) {
          return {
            success: false as const,
            error: `All executors failed: ${err?.message ?? "Unknown error"}. The public Piston API is whitelist-only — set PISTON_URL to a self-hosted instance, or Judge0 should work for most languages.`,
          };
        }
      }
    }

    return { success: false as const, error: "No executor available." };
  });
