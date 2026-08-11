import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  language: z.string().min(1).max(50),
  code: z.string().min(1).max(20000),
  stdout: z.string().max(20000).optional().default(""),
  stderr: z.string().max(20000).optional().default(""),
  exitCode: z.number().nullable().optional().default(null),
  exercise: z.string().min(1).max(5000),
});

const SYSTEM = `You are a senior code reviewer grading a student's programming exercise.
Evaluate the student's solution against the exercise requirements and provide structured feedback.

Return valid JSON only (no markdown fences) with this exact shape:
{
  "score": <0-100>,
  "passed": <true|false>,
  "summary": "<1-2 sentence overall assessment>",
  "correctness": "<what works and what doesn't relative to requirements>",
  "suggestions": ["<specific improvement 1>", "<specific improvement 2>"],
  "hints": ["<hint 1 to help student fix issues>"]
}

Be encouraging but honest. Score < 70 means the exercise needs more work.`;

function buildUserPrompt(data: z.infer<typeof Input>) {
  return `EXERCISE:
${data.exercise}

STUDENT'S SOLUTION (${data.language}):
\`\`\`${data.language}
${data.code}
\`\`\`

OUTPUT (stdout):
${data.stdout || "(empty)"}

ERRORS (stderr):
${data.stderr || "(none)"}

Exit code: ${data.exitCode ?? "n/a"}

Grade this submission. Return only JSON.`;
}

interface ProviderConfig {
  name: string;
  keyEnv: string;
  url: string;
  model: string;
  headers?: Record<string, string>;
}

const PROVIDERS: ProviderConfig[] = [
  {
    name: "Groq",
    keyEnv: "GROQ_API_KEY",
    url: "https://api.groq.com/openai/v1/chat/completions",
    model: "llama-3.3-70b-versatile",
  },
  {
    name: "Gemini",
    keyEnv: "GEMINI_API_KEY",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    model: "gemini-2.5-flash",
  },
  {
    name: "OpenRouter",
    keyEnv: "OPENROUTER_API_KEY",
    url: "https://openrouter.ai/api/v1/chat/completions",
    model: "google/gemini-2.5-flash",
    headers: {
      "HTTP-Referer": "https://learnify.ai",
      "X-Title": "Learnify AI Exercise Grader",
    },
  },
];

export const gradeExercise = createServerFn({ method: "POST" })
  .validator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const system = SYSTEM;
    const user = buildUserPrompt(data);
    const failures: string[] = [];

    for (const provider of PROVIDERS) {
      const apiKey = process.env[provider.keyEnv]?.trim();
      if (!apiKey) continue;

      try {
        const res = await fetch(provider.url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            ...provider.headers,
          },
          body: JSON.stringify({
            model: provider.model,
            messages: [
              { role: "system", content: system },
              { role: "user", content: user },
            ],
          }),
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          failures.push(`${provider.name} ${res.status}: ${text.slice(0, 120)}`);
          continue;
        }

        const json = await res.json();
        const content: string = json.choices?.[0]?.message?.content ?? "";
        const cleaned = content.replace(/```json\s*|```\s*/g, "").trim();
        const parsed = JSON.parse(cleaned);

        return {
          score: parsed.score ?? 0,
          passed: parsed.passed ?? false,
          summary: parsed.summary ?? "",
          correctness: parsed.correctness ?? "",
          suggestions: parsed.suggestions ?? [],
          hints: parsed.hints ?? [],
          model: provider.model,
        };
      } catch (err: any) {
        failures.push(`${provider.name}: ${err?.message || "unknown"}`);
        continue;
      }
    }

    console.error("[exercise-grader] all providers failed:", failures.join(" | "));
    throw new Error("AI grading unavailable right now. Try again in a moment.");
  });
