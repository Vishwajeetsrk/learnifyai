import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { z } from "zod";

const Input = z.object({
  language: z.string().min(1).max(50),
  code: z.string().min(1).max(20000),
  stdout: z.string().max(20000).optional().default(""),
  stderr: z.string().max(20000).optional().default(""),
  exitCode: z.number().nullable().optional().default(null),
  question: z.string().max(2000).optional().default(""),
});

const GROQ_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];
const GEMINI_MODELS = ["gemini-2.5-flash"];
const OPENROUTER_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "deepseek/deepseek-chat-v3.1:free",
  "mistralai/mistral-small-3.2-24b-instruct:free",
  "qwen/qwen-2.5-72b-instruct:free",
];

function buildOpenRouterProvider(key: string) {
  return createOpenAICompatible({
    name: "openrouter",
    baseURL: "https://openrouter.ai/api/v1",
    headers: {
      Authorization: `Bearer ${key}`,
      "HTTP-Referer": "https://learnifyaitool.vercel.app",
      "X-Title": "Learnify AI Playground",
    },
  });
}

function buildGroqProvider(key: string) {
  return createOpenAICompatible({
    name: "groq",
    baseURL: "https://api.groq.com/openai/v1",
    headers: { Authorization: `Bearer ${key}` },
  });
}

function buildGeminiProvider(key: string) {
  return createOpenAICompatible({
    name: "gemini",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    headers: { Authorization: `Bearer ${key}` },
  });
}

export const playgroundAiDebug = createServerFn({ method: "POST" })
  .validator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const groqKey = process.env.GROQ_API_KEY?.trim();
    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const openrouterKey = process.env.OPENROUTER_API_KEY?.trim();

    const system = `You are a concise senior engineer helping a developer debug code in Learnify's Playground.
- Identify the root cause from the code, stderr, and exit code.
- Suggest a minimal fix. Always include the COMPLETE corrected program in ONE fenced code block tagged with the language (e.g. \`\`\`python).
- After the code block, add 1-3 short bullet points explaining what changed and why.
- If the code already runs cleanly, suggest one improvement and still include the full updated program.
- Keep prose under 200 words. Use markdown.`;

    const ctx = [`Language: ${data.language}`, `Exit code: ${data.exitCode ?? "n/a"}`].join(" · ");

    const user = `${ctx}

CODE:
\`\`\`${data.language}
${data.code}
\`\`\`

STDOUT:
\`\`\`
${data.stdout || "(empty)"}
\`\`\`

STDERR:
\`\`\`
${data.stderr || "(empty)"}
\`\`\`

${data.question || "Diagnose any issue and return the full fixed program."}`;

    const messages = [
      { role: "system" as const, content: system },
      { role: "user" as const, content: user },
    ];

    const errors: string[] = [];

    // 1. Try Groq (fastest)
    if (groqKey) {
      const provider = buildGroqProvider(groqKey);
      for (const model of GROQ_MODELS) {
        try {
          const { text } = await generateText({ model: provider(model), messages });
          return { reply: text, model: `groq/${model}` };
        } catch (e: any) {
          errors.push(`groq/${model}: ${e?.message || "failed"}`);
          if (e?.statusCode === 401 || e?.statusCode === 403) break;
        }
      }
    }

    // 2. Try Gemini
    if (geminiKey) {
      const provider = buildGeminiProvider(geminiKey);
      for (const model of GEMINI_MODELS) {
        try {
          const { text } = await generateText({ model: provider(model), messages });
          return { reply: text, model: `gemini/${model}` };
        } catch (e: any) {
          errors.push(`gemini/${model}: ${e?.message || "failed"}`);
          if (e?.statusCode === 401 || e?.statusCode === 403) break;
        }
      }
    }

    // 3. Try OpenRouter (last resort)
    if (openrouterKey) {
      const provider = buildOpenRouterProvider(openrouterKey);
      for (const model of OPENROUTER_MODELS) {
        try {
          const { text } = await generateText({ model: provider(model), messages });
          return { reply: text, model: `openrouter/${model}` };
        } catch (e: any) {
          errors.push(`openrouter/${model}: ${e?.message || "failed"}`);
        }
      }
    }

    throw new Error(
      `All AI providers failed. ${errors.length > 0 ? errors.slice(0, 3).join("; ") : "No API keys configured."}`,
    );
  });
