import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

function pistonUrl(): string {
  return process.env.PISTON_URL || "https://emkc.org/api/v2/piston";
}

const PistonRequestSchema = z.object({
  language: z.string().min(1).max(50),
  code: z.string().min(1).max(500_000),
  stdin: z.string().max(100_000).default(""),
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

const PISTON_DEAD_MSG = "Public Piston API is now whitelist-only since Feb 2026. " +
  "For JS/TS, the playground uses local Node.js execution. " +
  "For other languages, set the PISTON_URL env var to your self-hosted Piston instance " +
  "(https://github.com/engineer-man/piston).";

export const executeCode = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => PistonRequestSchema.parse(data))
  .handler(async ({ data }) => {
    const version = LANGUAGE_VERSIONS[data.language];
    if (!version) {
      return { success: false as const, error: `Unsupported language: ${data.language}` };
    }

    // For JS/TS, try local Node.js VM execution first
    if (data.language === "javascript" || data.language === "typescript") {
      const jsCode = data.language === "typescript" ? transpileTs(data.code) : data.code;
      const local = tryRunWithJavascript(jsCode, data.stdin);
      return { success: true as const, ...local, signal: null };
    }

    try {
      const base = pistonUrl();
      const isDefaultApi = base.includes("emkc.org");
      const res = await fetch(`${base}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: data.language,
          version,
          files: [{ name: "code", content: data.code }],
          stdin: data.stdin,
          compile_timeout: 10000,
          run_timeout: 5000,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "Unknown error");
        const is401 = res.status === 401;
        const isWhitelistError = text.includes("whitelist");
        if (isDefaultApi && (is401 || isWhitelistError)) {
          return {
            success: false as const,
            error: PISTON_DEAD_MSG,
          };
        }
        return { success: false as const, error: `Piston API error (${res.status}): ${text}` };
      }

      const json = await res.json();
      const run = json.run || {};
      return {
        success: true as const,
        stdout: run.stdout ?? "",
        stderr: run.stderr ?? "",
        code: run.code ?? -1,
        signal: run.signal ?? null,
      };
    } catch (err: any) {
      return { success: false as const, error: err?.message ?? "Failed to execute code" };
    }
  });

function transpileTs(code: string): string {
  try {
    const ts = require("typescript");
    const result = ts.transpileModule(code, {
      target: ts.ScriptTarget.ES2020,
      noEmit: true,
      removeComments: true,
    });
    return result?.outputText ?? code;
  } catch {
    return code;
  }
}
