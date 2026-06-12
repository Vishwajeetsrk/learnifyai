import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { callUserAiChat } from "@/lib/user-ai";
import { z } from "zod";

const Input = z.object({
  action: z.enum(["summary", "exercise", "doubt"]),
  courseId: z.string().uuid(),
  lessonId: z.string().uuid(),
  courseTitle: z.string().min(1).max(300),
  lessonTitle: z.string().min(1).max(300),
  lessonDescription: z.string().max(4000).optional(),
  question: z.string().max(4000).optional(),
});

const SYSTEM = `You are Learnify AI — a senior technical mentor. Respond in clean, professional markdown (H2/H3 headings, numbered steps, fenced code blocks with language tags, bullet lists where useful). No emoji spam, no filler. Be concrete and production-grade.`;

function buildPrompt(d: z.infer<typeof Input>) {
  const ctx = `Course: ${d.courseTitle}\nLesson: ${d.lessonTitle}${d.lessonDescription ? `\nLesson notes: ${d.lessonDescription}` : ""}`;
  if (d.action === "summary") {
    return `${ctx}\n\nProduce a structured lesson summary with these sections:\n## Key Takeaways (5-7 bullets)\n## Core Concepts Explained\n## Real-World Applications\n## Quick Recap (3 lines)`;
  }
  if (d.action === "exercise") {
    return `${ctx}\n\nDesign a practical, hands-on exercise the learner can build right now. Include:\n## Objective\n## Prerequisites\n## Step-by-Step Instructions (numbered)\n## Starter Code (fenced code block)\n## Expected Output\n## Bonus Challenges (2-3 stretch goals)\n## Solution Hints (collapsible thinking, not full solution)`;
  }
  return `${ctx}\n\nLearner's doubt: """${d.question ?? ""}"""\n\nClear the doubt with:\n## Direct Answer\n## Why This Happens / How It Works\n## Worked Example (with code if applicable)\n## Common Mistakes to Avoid\n## Further Reading (real, current resources)`;
}

export const lessonAiHelper = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const [
      { data: lesson },
      { data: enrollment },
      { data: progress },
      { data: cert },
      superAdmin,
      admin,
    ] = await Promise.all([
      supabase
        .from("lessons")
        .select("id, course_id")
        .eq("id", data.lessonId)
        .eq("course_id", data.courseId)
        .maybeSingle(),
      supabase
        .from("enrollments")
        .select("status, progress_pct")
        .eq("user_id", userId)
        .eq("course_id", data.courseId)
        .maybeSingle(),
      supabase
        .from("lesson_progress")
        .select("id")
        .eq("user_id", userId)
        .eq("course_id", data.courseId)
        .limit(1)
        .maybeSingle(),
      supabase
        .from("certificates")
        .select("id")
        .eq("user_id", userId)
        .eq("course_id", data.courseId)
        .maybeSingle(),
      supabase.rpc("has_role", { _user_id: userId, _role: "super_admin" }),
      supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
    ]);

    if (!lesson) throw new Error("Lesson not found for this course.");
    const enrollmentRow = enrollment as {
      status?: string | null;
      progress_pct?: number | null;
    } | null;
    const enrollmentStatus = enrollmentRow?.status ?? null;
    const enrollmentProgress = enrollmentRow?.progress_pct ?? 0;
    const hasAccess = Boolean(
      superAdmin.data ||
      admin.data ||
      !!enrollmentRow ||
      enrollmentStatus === "completed" ||
      enrollmentProgress > 0 ||
      progress ||
      cert,
    );
    if (!hasAccess)
      throw new Error(
        "Full course access is required to use AI hints, suggestions, solving help, and summaries.",
      );

    const res = await callUserAiChat({
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: buildPrompt(data) },
      ],
    });

    if (res.status === 429) throw new Error("Rate limit reached. Try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please top up your workspace.");
    if (!res.ok) throw new Error(`AI provider error (${res.status})`);

    const json = await res.json();
    const content: string = json.choices?.[0]?.message?.content ?? "";
    return { content };
  });
