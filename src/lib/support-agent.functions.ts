import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { executeCode } from "./playground.functions";

const AGENT_MODEL = process.env.AGENT_MODEL || "openai/gpt-4o-mini";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const FALLBACK_MODELS = [
  "openai/gpt-4o-mini",
  "meta-llama/llama-3.3-70b-instruct:free",
  "deepseek/deepseek-chat-v3.1:free",
  "mistralai/mistral-small-3.2-24b-instruct:free",
];

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
        "Search the web for current information. Returns up to 5 results with title, snippet, and link.",
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

const SUPPORT_SYSTEM = `You are the Learnify AI Global Support Assistant. Your job is to help users, creators, and admins navigate the website and use all features.

## Website Map & Features
1. Dashboard (/dashboard): Stats, enrolled courses, learning progress, certificates earned, test attempts, recommended courses, events & jobs, community cohorts, and pricing plans.
2. Marketplace / Courses (/courses): Browse and search public courses, view categories, filter by price (free/paid).
3. Course Player (/courses/:slug): Watch video lessons, mark completed, view lesson notes, generate AI summaries, ask doubt, generate practice exercises, and use the interactive multi-mode Playground (Code, Web HTML/CSS/JS, SQLite Database, API Tester).
4. AI Tutor Chat (/ai): Multi-model chat page (Gemini, Groq, OpenRouter) supporting Vision (image uploads) and conversation history.
5. AI Tools (/ai-tools): Quick generation tools (quiz, flashcards, study briefs) and their history.
6. Community Feed (/community-feed): Social feed to create posts, view comments, like, and interact with other learners.
7. Coaching Hub (/coaching): Find/book coaching sessions, schedule slots (for creators), and chat.
8. Leaderboard (/leaderboard) & Achievements (/achievements): Track weekly/all-time XP, streaks, badges earned.
9. Wallet (/wallet): Purchase AI credits (balance, top-up).
10. Inbox (/inbox): Messages from coaches/creators.
11. Creator Studio (/studio): Build courses, add/edit lessons, manage quizzes (MCQ tests), assignments, projects, view submissions, and use the AI Course Builder or AI auto-complete.
12. Admin Panel (/admin): Admin dashboard, verify wallet top-ups, certificate templates, and view system statistics.

## Support Guidelines
- Help users navigate the site. Recommend links using markdown formatting (e.g. [Dashboard](/dashboard)).
- For creators, explain how to add lessons, quizzes, and verify student submissions.
- For students, help them with coding, explain how to run code in the playground, or clear concepts.
- Use the execute_code tool to run and verify code for users.
- Use the web_search tool if they ask about external topics or documentation.
- Maintain a helpful, friendly, and expert persona.`;

const SupportMessageSchema = z.object({
  content: z.string().min(1).max(50000),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })),
  userContext: z.string().max(2000).optional(),
  currentPath: z.string().max(500).optional(),
});

async function callOpenRouter(messages: any[]) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured");

  const models = [AGENT_MODEL, ...FALLBACK_MODELS.filter((m) => m !== AGENT_MODEL)];
  let lastError: unknown;

  for (const model of models) {
    try {
      const res = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://learnifyaitool.vercel.app",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: SUPPORT_SYSTEM }, ...messages.slice(-20)],
          tools: TOOLS,
          tool_choice: "auto",
          max_tokens: 2048,
        }),
      });

      if (res.ok) return res.json();

      const text = await res.text().catch(() => "Unknown");
      lastError = new Error(`OpenRouter error (${res.status}) on ${model}: ${text}`);
    } catch (e) {
      lastError = e;
    }
  }

  throw lastError ?? new Error("All models failed");
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

export const supportChat = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => SupportMessageSchema.parse(data))
  .handler(async ({ data }) => {
    const messages: any[] = [
      ...(data.history ?? []).map((m: any) => ({ role: m.role, content: m.content })),
      {
        role: "user",
        content: `[User Context: ${data.userContext || "None"}][Current Path: ${data.currentPath || "/"}]. Question: ${data.content}`,
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
