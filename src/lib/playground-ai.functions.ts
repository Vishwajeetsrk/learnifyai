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

const FALLBACK_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "deepseek/deepseek-chat-v3.1:free",
  "mistralai/mistral-small-3.2-24b-instruct:free",
  "qwen/qwen-2.5-72b-instruct:free",
];

function buildProvider(key: string) {
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

async function hasEndpoints(model: string, key: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://openrouter.ai/api/v1/models/${encodeURIComponent(model)}/endpoints`,
      { headers: { Authorization: `Bearer ${key}` } },
    );
    if (!res.ok) return false;
    const body = (await res.json()) as { data?: { endpoints?: unknown[] } };
    return Array.isArray(body?.data?.endpoints) && body.data!.endpoints!.length > 0;
  } catch {
    return true;
  }
}

export const playgroundAiDebug = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.OPENROUTER_API_KEY?.trim();
    if (!key) {
      throw new Error("AI is not configured. Add OPENROUTER_API_KEY to the server .env.");
    }

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

    const provider = buildProvider(key);

    for (const model of FALLBACK_MODELS) {
      const available = await hasEndpoints(model, key);
      if (!available) continue;
      try {
        const { text } = await generateText({ model: provider(model), messages });
        return { reply: text, model };
      } catch {
        continue;
      }
    }

    throw new Error("OpenRouter has no working free model right now. Try again in a moment.");
  });
