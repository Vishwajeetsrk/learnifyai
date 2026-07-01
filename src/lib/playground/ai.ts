import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const AI_ACTIONS: Record<string, string> = {
  explain:
    "Explain the following code in detail, line by line. Include what each part does and why it works that way.",
  fix: "Find and fix bugs in the following code. Explain what was wrong and how you fixed it. Return ONLY the fixed code.",
  optimize:
    "Optimize the following code for better performance, readability, and best practices. Explain the changes made. Return ONLY the optimized code.",
  comment:
    "Add detailed comments to the following code explaining each section. Return the code with comments added.",
  convert:
    "Convert the following code from one language to another. Preserve the exact same logic and functionality.",
  unittest:
    "Write comprehensive unit tests for the following code. Include edge cases, happy paths, and error cases.",
  complete:
    "Complete the following code. Infer the developer's intent from context and fill in missing parts.",
};

const AISchema = z.object({
  action: z.enum(["explain", "fix", "optimize", "comment", "convert", "unittest", "complete"]),
  code: z.string().min(1).max(50000),
  language: z.string().optional(),
  targetLanguage: z.string().optional(),
  context: z.string().max(4000).optional(),
});

export const aiCodeAssistant = createServerFn({ method: "POST" })
  .validator((data: unknown) => AISchema.parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data }) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured");

    const prompt = AI_ACTIONS[data.action] || AI_ACTIONS.explain;
    let systemPrompt = `You are an expert programming mentor. Your job is to help developers understand and improve their code.`;

    let userPrompt = `${prompt}\n\nLanguage: ${data.language || "unknown"}\n\nCode:\n\`\`\`\n${data.code}\n\`\`\``;

    if (data.targetLanguage) {
      userPrompt += `\n\nConvert to: ${data.targetLanguage}`;
    }
    if (data.context) {
      userPrompt += `\n\nAdditional context: ${data.context}`;
    }

    if (["fix", "optimize", "convert", "comment"].includes(data.action)) {
      userPrompt += `\n\nIMPORTANT: Return ONLY the ${data.action === "convert" ? "converted" : data.action === "comment" ? "commented" : "resulting"} code wrapped in a code block. No explanations before or after.`;
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://learnifyai.vercel.app",
      },
      body: JSON.stringify({
        model: process.env.AGENT_MODEL || "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 4096,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "Unknown");
      throw new Error(`OpenRouter error (${res.status}): ${text}`);
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content || "";
    return { content };
  });
