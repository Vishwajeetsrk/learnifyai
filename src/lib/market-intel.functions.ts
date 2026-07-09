import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { executeCode } from "./playground.functions";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "web_search",
      description: "Search the web for current job market data, salary benchmarks, hiring trends, company layoffs, skill demand, and industry reports.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "The search query" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "execute_code",
      description: "Execute code to analyze market data, compute statistics, or generate visualizations. Supports python, javascript, typescript, and more.",
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
];

const MARKET_INTEL_SYSTEM = `You are a Market Intelligence Analyst AI specializing in the tech industry. You provide data-driven insights about job markets, salary trends, skill demand, company hiring patterns, and industry shifts.

## Your Expertise
1. **Salary Benchmarks**: Provide current salary ranges by role, experience level, location (India-focused but also global), and company type (FAANG, startup, product-based, service-based).
2. **Skill Demand Analysis**: Identify which technical skills are rising/falling in demand, which certifications add value, and which technology stacks are most sought after.
3. **Job Market Trends**: Analyze hiring volumes, remote vs. on-site trends, fresher vs. experienced hiring, and which sectors are growing or contracting.
4. **Company Intelligence**: Track company hiring freezes, layoffs, expansion plans, and culture insights from employee reviews.
5. **Geographic Analysis**: Compare opportunities across Indian tech hubs (Bengaluru, Hyderabad, Pune, NCR, Chennai, Mumbai) and international markets.
6. **Emerging Tech**: Monitor breakthrough technologies (Agentic AI, Quantum, Web3, etc.) and their impact on job creation.

## Data Sources & Methodology
- Use the web_search tool to look up current data from Naukri, LinkedIn, Glassdoor, AmbitionBox, Indeed, and tech news sources.
- When providing salary data, always specify the source and date range.
- Differentiate between India (₹ LPA) and global ($ USD) figures when applicable.
- Use execute_code to analyze trends programmatically when helpful.

## Guidelines
- Always cite your sources when possible. Mark estimates clearly as "estimates based on available data."
- Distinguish between "fresher" (0-2 yrs), "mid-level" (3-5 yrs), "senior" (6-10 yrs), and "leadership" (10+ yrs) when providing data.
- Highlight regional variations — what's true for Bengaluru may not hold for Pune or NCR.
- Be objective and data-driven. If data is limited, say so rather than inventing numbers.
- Keep a professional, analytical tone.`;

const MessageSchema = z.object({
  content: z.string().min(1).max(50000),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })),
  marketContext: z.string().max(2000).optional(),
});

const FALLBACK_MODELS = [
  "openai/gpt-4o-mini",
  "meta-llama/llama-3.3-70b-instruct:free",
  "deepseek/deepseek-chat-v3.1:free",
  "mistralai/mistral-small-3.2-24b-instruct:free",
];

const AI_PROVIDERS = [
  {
    name: "Groq",
    url: GROQ_URL,
    getKey: () => process.env.GROQ_API_KEY,
    models: ["llama-3.3-70b-versatile", "llama-3.1-70b-versatile"],
    extraHeaders: {} as Record<string, string>,
  },
  {
    name: "Gemini",
    url: GEMINI_URL,
    getKey: () => process.env.GEMINI_API_KEY,
    models: ["gemini-2.5-flash"],
    extraHeaders: {} as Record<string, string>,
  },
  {
    name: "OpenRouter",
    url: OPENROUTER_URL,
    getKey: () => process.env.OPENROUTER_API_KEY,
    models: [...FALLBACK_MODELS],
    extraHeaders: { "HTTP-Referer": "https://learnifyaitool.vercel.app" } as Record<string, string>,
  },
];

async function callAI(messages: any[], systemPrompt: string) {
  const errors: string[] = [];
  for (const provider of AI_PROVIDERS) {
    const apiKey = provider.getKey();
    if (!apiKey?.trim()) continue;
    for (const model of provider.models) {
      try {
        const res = await fetch(provider.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            ...provider.extraHeaders,
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "system", content: systemPrompt }, ...messages.slice(-20)],
            tools: TOOLS,
            tool_choice: "auto",
            max_tokens: 4096,
          }),
        });
        if (res.ok) return res.json();
        const text = await res.text().catch(() => "Unknown");
        if (res.status === 401 || res.status === 403) {
          errors.push(`${provider.name}/${model}: auth failed (${res.status})`);
          break;
        }
        errors.push(`${provider.name}/${model}: ${res.status} ${text.slice(0, 100)}`);
      } catch (e: any) {
        errors.push(`${provider.name}/${model}: ${e?.message}`);
      }
    }
  }
  throw new Error(`All AI providers failed: ${errors.join(" | ")}`);
}

async function executeTool(name: string, args: any) {
  if (name === "execute_code") {
    try {
      const result = await executeCode({
        data: {
          language: args.language || "python",
          code: args.code || "",
          stdin: args.stdin || "",
        },
      });
      if (!result.success) {
        return JSON.stringify({ error: result.error || "Execution failed" });
      }
      return JSON.stringify({
        stdout: result.stdout || "",
        stderr: result.stderr || "",
        code: result.code ?? -1,
        provider: result.provider,
      });
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
        title: r.title,
        snippet: r.snippet,
        link: r.link,
      }));
      return JSON.stringify(results.length ? results : { message: "No results" });
    } catch (err: any) {
      return JSON.stringify({ error: err?.message ?? "Search failed" });
    }
  }
  return JSON.stringify({ error: `Unknown tool: ${name}` });
}

export const marketIntelChat = createServerFn({ method: "POST" })
  .validator((data: unknown) => MessageSchema.parse(data))
  .handler(async ({ data }) => {
    const messages: any[] = [
      ...(data.history ?? []).map((m: any) => ({ role: m.role, content: m.content })),
      {
        role: "user",
        content: data.marketContext
          ? `User Context: ${data.marketContext}\n\nQuery: ${data.content}`
          : data.content,
      },
    ];

    const steps: {
      type: string;
      thought?: string;
      name?: string;
      arguments?: any;
      result?: string;
    }[] = [];
    let rounds = 0;

    while (rounds < 5) {
      rounds++;
      const json = await callAI(messages, MARKET_INTEL_SYSTEM);
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
