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
      name: "execute_code",
      description:
        "Execute code in a sandbox and return stdout, stderr, and exit code. Supports python, javascript, typescript, cpp, c, java, go, rust, ruby, php, bash, sql.",
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
      description:
        "Search the web for current information about companies, job postings, salaries, interview experiences, and career trends. Returns up to 5 results with title, snippet, and link.",
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

const CAREER_COACH_SYSTEM = `You are a Senior Career Coach AI with 15+ years of experience in tech career development, resume optimization, interview preparation, and job search strategy.

## Your Expertise
1. **Resume & LinkedIn Review**: Critique resumes, suggest ATS-friendly formatting, optimize LinkedIn profiles for recruiter visibility.
2. **Interview Preparation**: Provide company-specific interview tips (FAANG, startups), behavioral frameworks (STAR), system design prep strategies, and coding interview practice advice.
3. **Career Strategy**: Help with career transitions (e.g. from service-based to product-based, from IC to manager), salary negotiation tactics, and promotion strategies.
4. **Job Search**: Guide on networking, cold outreach, recruiter communication, offer evaluation, and decision-making.
5. **Skill Development**: Recommend which skills to learn next based on market trends, current role, and target role.

## Guidelines
- Use the web_search tool to look up current company reviews, interview experiences, salary benchmarks, and job market data.
- Use the execute_code tool to help users practice coding problems or analyze skill gaps programmatically.
- Be brutally honest but constructive — don't sugarcoat weaknesses, always pair criticism with actionable advice.
- Structure responses with clear sections and bullet points for readability.
- Keep answers concise and focused on the user's specific situation.`;

const MessageSchema = z.object({
  content: z.string().min(1).max(50000),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })),
  userProfile: z.string().max(2000).optional(),
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

import { validateAIPrompt } from "./ai-firewall";

export const careerCoachChat = createServerFn({ method: "POST" })
  .validator((data: unknown) => MessageSchema.parse(data))
  .handler(async ({ data }) => {
    const safety = validateAIPrompt(data.content);
    if (!safety.safe) {
      throw new Error(safety.reason || "Safety policy violation: Request rejected by AI Firewall.");
    }

    const messages: any[] = [
      ...(data.history ?? []).map((m: any) => ({ role: m.role, content: m.content })),
      {
        role: "user",
        content: data.userProfile
          ? `User Profile: ${data.userProfile}\n\nQuestion: ${data.content}`
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
      const json = await callAI(messages, CAREER_COACH_SYSTEM);
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
