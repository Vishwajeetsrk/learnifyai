import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const AGENT_MODEL = process.env.AGENT_MODEL || "openai/gpt-4o-mini";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "execute_code",
      description: "Execute code in a sandbox and return stdout, stderr, and exit code. Supports python, javascript, typescript, cpp, c, java, go, rust, ruby, php, bash, sql.",
      parameters: {
        type: "object",
        properties: {
          language: { type: "string", description: "Programming language" },
          code: { type: "string", description: "Source code to execute" },
          stdin: { type: "string", description: "Optional stdin input" },
        },
        required: ["language", "code"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "web_search",
      description: "Search the web for current information. Returns up to 5 results with title, snippet, and link.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "The search query" },
        },
        required: ["query"],
      },
    },
  },
];

const AGENT_SYSTEM = `You are a senior coding mentor AI. Your job is to help students learn by writing, running, fixing, and explaining code.

## Core behavior
- When a student asks a coding question, ALWAYS write and run the code yourself. Don't just explain — show the code working.
- If code fails, analyze the error, fix it, and re-run. Iterate until it works.
- When asked to solve a problem, write the solution, run it, show the output, and explain what it does.
- When asked to fix code, analyze the error, write the corrected version, run to verify, and explain what was wrong.
- When asked to explain a concept, use the web_search tool if it helps, then write example code and run it.

## Rules
- Always wrap code in proper language blocks when explaining.
- Show the output of every code execution.
- Be concise but thorough — students need to understand both what and why.
- If you need current info (APIs, docs, errors), use web_search.`;

const MessageSchema = z.object({
  content: z.string().min(1).max(50000),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })),
  lessonContext: z.string().max(4000).optional(),
});

async function callOpenRouter(messages: any[]) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured");

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://learnifyai.vercel.app",
    },
    body: JSON.stringify({
      model: AGENT_MODEL,
      messages: [
        { role: "system", content: AGENT_SYSTEM },
        ...messages.slice(-20),
      ],
      tools: TOOLS,
      tool_choice: "auto",
      max_tokens: 2048,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown");
    throw new Error(`OpenRouter error (${res.status}): ${text}`);
  }

  return res.json();
}

async function executeTool(name: string, args: any) {
  if (name === "execute_code") {
    try {
      const piston = process.env.PISTON_URL || "https://emkc.org/api/v2/piston";
      const apiRes = await fetch(`${piston}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: args.language || "python",
          version: "*",
          files: [{ name: "code", content: args.code || "" }],
          stdin: args.stdin || "",
          compile_timeout: 10000,
          run_timeout: 5000,
        }),
      });
      if (!apiRes.ok) {
        const text = await apiRes.text().catch(() => "Unknown error");
        return JSON.stringify({ error: `API error (${apiRes.status}): ${text}` });
      }
      const json = await apiRes.json();
      const run = json.run || {};
      return JSON.stringify({ stdout: run.stdout || "", stderr: run.stderr || "", code: run.code ?? -1 });
    } catch (err: any) {
      return JSON.stringify({ error: err?.message ?? "Execution failed" });
    }
  }

  if (name === "web_search") {
    try {
      const key = process.env.SEARCHAPI_API_KEY;
      const url = key
        ? `https://www.searchapi.io/api/v1/search?engine=google&q=${encodeURIComponent(args.query)}&api_key=${key}`
        : `https://serpapi.com/search.json?q=${encodeURIComponent(args.query)}&api_key=${process.env.SERPAPI_API_KEY || ""}`;
      const apiRes = await fetch(url);
      if (!apiRes.ok) return JSON.stringify({ message: "Search unavailable" });
      const json = await apiRes.json();
      const results = (json.organic_results || []).slice(0, 5).map((r: any) => ({
        title: r.title, snippet: r.snippet, link: r.link,
      }));
      return JSON.stringify(results.length ? results : { message: "No results" });
    } catch (err: any) {
      return JSON.stringify({ error: err?.message ?? "Search failed" });
    }
  }

  return JSON.stringify({ error: `Unknown tool: ${name}` });
}

export const agentChat = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => MessageSchema.parse(data))
  .handler(async ({ data }) => {
    const messages: any[] = [
      ...(data.history ?? []).map((m: any) => ({ role: m.role, content: m.content })),
      { role: "user", content: data.lessonContext ? `Lesson context: ${data.lessonContext}\n\n${data.content}` : data.content },
    ];

    const steps: { type: string; thought?: string; name?: string; arguments?: any; result?: string }[] = [];
    let rounds = 0;

    while (rounds < 5) {
      rounds++;
      const json = await callOpenRouter(messages);
      const choice = json.choices?.[0];
      if (!choice) throw new Error("No response from model");

      const msg = choice.message;

      if (!msg.tool_calls?.length) {
        steps.push({ type: "result", thought: msg.content || "" });
        return { role: "assistant" as const, content: msg.content || "", steps };
      }

      messages.push(msg);
      for (const tc of msg.tool_calls) {
        try {
          const args = JSON.parse(tc.function.arguments);
          const result = await executeTool(tc.function.name, args);
          steps.push({ type: "tool_call", name: tc.function.name, arguments: args, result });
          messages.push({ role: "tool" as const, tool_call_id: tc.id, content: result });
        } catch (err: any) {
          const errMsg = JSON.stringify({ error: err?.message });
          steps.push({ type: "tool_call", name: tc.function.name, arguments: {}, result: errMsg });
          messages.push({ role: "tool" as const, tool_call_id: tc.id, content: errMsg });
        }
      }
    }

    return {
      role: "assistant" as const,
      content: "I've reached the maximum number of tool calls. Here's what I found so far.",
      steps,
    };
  });
