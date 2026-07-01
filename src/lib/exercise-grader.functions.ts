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
  exercise: z.string().min(1).max(5000),
});

const FALLBACK_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "deepseek/deepseek-chat-v3.1:free",
  "mistralai/mistral-small-3.2-24b-instruct:free",
];

function buildProvider(key: string) {
  return createOpenAICompatible({
    name: "openrouter",
    baseURL: "https://openrouter.ai/api/v1",
    headers: {
      Authorization: `Bearer ${key}`,
      "HTTP-Referer": "https://learnify.ai",
      "X-Title": "Learnify AI Exercise Grader",
    },
  });
}

export const gradeExercise = createServerFn({ method: "POST" })
  .validator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.OPENROUTER_API_KEY?.trim();
    if (!key) {
      throw new Error("AI grading is not configured. Add OPENROUTER_API_KEY to .env.");
    }

    const system = `You are a senior code reviewer grading a student's programming exercise.
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

    const user = `EXERCISE:
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

    const provider = buildProvider(key);

    for (const model of FALLBACK_MODELS) {
      try {
        const { text } = await generateText({
          model: provider(model),
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        });
        const cleaned = text.replace(/```json\s*|```\s*/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return {
          score: parsed.score ?? 0,
          passed: parsed.passed ?? false,
          summary: parsed.summary ?? "",
          correctness: parsed.correctness ?? "",
          suggestions: parsed.suggestions ?? [],
          hints: parsed.hints ?? [],
          model,
        };
      } catch {
        continue;
      }
    }

    throw new Error("AI grading unavailable right now. Try again in a moment.");
  });
