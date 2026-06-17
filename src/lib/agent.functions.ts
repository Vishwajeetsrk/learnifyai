import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const AGENT_MODEL = "openai/gpt-4o-mini";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "execute_code",
      description: "Execute code in a sandboxed environment and return the output. Supports Python, JavaScript, TypeScript, C++, Java, Go, Rust, and more.",
      parameters: {
        type: "object",
        properties: {
          language: { type: "string", description: "Programming language (e.g. python, javascript, typescript, cpp, java, go, rust, ruby, php, bash)" },
          code: { type: "string", description: "The source code to execute" },
          stdin: { type: "string", description: "Optional stdin input for the program" },
        },
        required: ["language", "code"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "web_search",
      description: "Search the web for up-to-date information. Returns a summary of results.",
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

const AGENT_SYSTEM = `You are a helpful AI assistant with access to tools. You can execute code and search the web to answer questions.

When asked to write or run code, use the execute_code tool. When asked about current events or information you're not sure about, use the web_search tool.

Be concise and clear in your responses. If you use a tool, explain what you found.`;

const MessageSchema = z.object({
  content: z.string().min(1).max(50000),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })),
});

async function callOpenRouter(messages: any[], toolResults?: any[]) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured");

  let msgs = [
    { role: "system", content: AGENT_SYSTEM },
    ...messages.slice(-20),
  ];

  if (toolResults) {
    msgs = [...msgs, ...toolResults];
  }

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://learnifyai.vercel.app",
    },
    body: JSON.stringify({
      model: AGENT_MODEL,
      messages: msgs,
      tools: TOOLS,
      tool_choice: "auto",
      max_tokens: 4096,
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
      const res = await fetch(`${piston}/execute`, {
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
      const json = await res.json();
      const run = json.run || {};
      return JSON.stringify({ stdout: run.stdout, stderr: run.stderr, code: run.code });
    } catch (err: any) {
      return JSON.stringify({ error: err?.message ?? "Execution failed" });
    }
  }

  if (name === "web_search") {
    try {
      const searchRes = await fetch(
        `https://www.searchapi.io/api/v1/search?engine=google&q=${encodeURIComponent(args.query)}&api_key=${process.env.SEARCHAPI_API_KEY || ""}`,
      );
      if (!searchRes.ok) {
        const fallback = await fetch(
          `https://serpapi.com/search.json?q=${encodeURIComponent(args.query)}&api_key=${process.env.SERPAPI_API_KEY || ""}`,
        );
        if (fallback.ok) {
          const fjson = await fallback.json();
          const results = (fjson.organic_results || []).slice(0, 5).map((r: any) => ({ title: r.title, snippet: r.snippet, link: r.link }));
          return JSON.stringify(results.length ? results : { message: "No results found" });
        }
        return JSON.stringify({ message: "Search API not available" });
      }
      const json = await searchRes.json();
      const results = (json.organic_results || []).slice(0, 5).map((r: any) => ({ title: r.title, snippet: r.snippet, link: r.link }));
      return JSON.stringify(results.length ? results : { message: "No results found" });
    } catch (err: any) {
      return JSON.stringify({ error: err?.message ?? "Search failed" });
    }
  }

  return JSON.stringify({ error: `Unknown tool: ${name}` });
}

export const agentChat = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => MessageSchema.parse(data))
  .handler(async ({ data }) => {
    const messages = [
      ...(data.history ?? []).map((m: any) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user" as const, content: data.content },
    ];

    let rounds = 0;
    const maxRounds = 5;

    while (rounds < maxRounds) {
      rounds++;
      const json = await callOpenRouter(messages);
      const choice = json.choices?.[0];
      if (!choice) throw new Error("No response from model");

      const msg = choice.message;

      if (!msg.tool_calls?.length) {
        return { role: "assistant" as const, content: msg.content || "" };
      }

      messages.push(msg);
      const toolResults: any[] = [];

      for (const tc of msg.tool_calls) {
        try {
          const args = JSON.parse(tc.function.arguments);
          const result = await executeTool(tc.function.name, args);
          toolResults.push({
            role: "tool" as const,
            tool_call_id: tc.id,
            content: result,
          });
        } catch (err: any) {
          toolResults.push({
            role: "tool" as const,
            tool_call_id: tc.id,
            content: JSON.stringify({ error: err?.message ?? "Tool execution error" }),
          });
        }
      }

      messages.push(...toolResults);
    }

    return { role: "assistant" as const, content: "I've reached the maximum number of tool calls. Let me summarize what I've found." };
  });
