import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const Input = z.object({
  lessonId: z.string().uuid(),
  courseId: z.string().uuid(),
  lessonTitle: z.string().min(1).max(500),
  lessonContent: z.string().min(1).max(10000),
  level: z.enum(["beginner", "intermediate", "expert", "analogy"]),
});

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  beginner: "Explain like I'm 12 years old. Use simple words, short sentences, and relatable everyday examples. No jargon without immediate explanation.",
  intermediate: "Explain like I understand the basics but need deeper insight. Use technical terms but explain why they matter. Connect concepts to real-world applications.",
  expert: "Explain like I'm a senior engineer. Use precise technical language, mention trade-offs, edge cases, and implementation details. Include system design considerations.",
  analogy: "Explain using a powerful analogy or metaphor. Map every technical concept to a familiar real-world scenario. Make it memorable and intuitive.",
};

export const explainLike = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const { callUserAiChat } = await import("./user-ai");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const cached = await supabaseAdmin
      .from("explanations_cache")
      .select("content")
      .eq("lesson_id", data.lessonId)
      .eq("level", data.level)
      .maybeSingle();

    if (cached.data) {
      return { content: cached.data.content, cached: true };
    }

    const levelDesc = LEVEL_DESCRIPTIONS[data.level];
    const prompt = `${levelDesc}\n\nLesson Title: \"${data.lessonTitle}\"\n\nContent to explain:\n${data.lessonContent.slice(0, 8000)}\n\n---\nProvide a clear, engaging explanation. Use markdown with:\n- A short hook (1-2 sentences)\n- The core explanation broken into digestible sections\n- A concise summary at the end\n${data.level === "analogy" ? "- Map each technical element to its analog counterpart" : ""}`;

    const res = await callUserAiChat({
      messages: [
        { role: "system", content: `You are an expert educator who adapts explanations to the learner's level. Current level: ${data.level}.` },
        { role: "user", content: prompt },
      ],
    });

    if (!res.ok) throw new Error(`AI provider error (${res.status})`);

    const json = await res.json();
    const content: string = json.choices?.[0]?.message?.content ?? "";

    await supabaseAdmin.from("explanations_cache").upsert({
      lesson_id: data.lessonId,
      level: data.level,
      content,
    });

    return { content, cached: false };
  });
