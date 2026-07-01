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

const SYSTEM = `You are Learnify AI — a senior technical mentor. Provide direct, short answers. Use concise bullet points for the best presentation. Respond in clean, professional markdown (H2/H3 headings, fenced code blocks). Be extremely concise. Avoid long paragraphs, fluff, or filler text.`;

function buildPrompt(d: z.infer<typeof Input>, ragContext?: string) {
  const ctx = `Course: ${d.courseTitle}\nLesson: ${d.lessonTitle}${d.lessonDescription ? `\nLesson notes: ${d.lessonDescription}` : ""}`;

  let basePrompt = "";
  if (d.action === "summary") {
    basePrompt = `${ctx}\n\nProduce a short, structured lesson summary with these sections (use brief bullet points):\n## Key Takeaways (3-5 short bullets)\n## Core Concepts Explained (briefly)\n## Real-World Applications\n## Quick Recap (1 short line)`;
  } else if (d.action === "exercise") {
    basePrompt = `${ctx}\n\nDesign a short, practical exercise. Keep it brief and use bullet points:\n## Objective\n## Prerequisites\n## Step-by-Step Instructions (short bullets)\n## Starter Code\n## Expected Output\n## Bonus Challenges\n## Solution Hints`;
  } else {
    basePrompt = `${ctx}\n\nLearner's doubt: """${d.question ?? ""}"""\n\nClear the doubt directly and concisely using bullet points:\n## Direct Answer (1-2 short sentences)\n## Why This Happens (bullet points)\n## Worked Example\n## Common Mistakes to Avoid (bullet points)\n## Further Reading`;
  }

  if (ragContext) {
    basePrompt = `COURSE CONTENT & CONTEXT:\nUse the following extracted materials from the course to guide your answer and ensure accuracy based on the actual course contents.\n\n${ragContext}\n\n---\n\n${basePrompt}`;
  }

  return basePrompt;
}

export const lessonAiHelper = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => Input.parse(d))
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

    let ragContext = "";
    if (data.action === "doubt" && data.question) {
      try {
        const { searchCourseContext } = await import("./rag.functions");
        const matches = await searchCourseContext({
          data: { courseId: data.courseId, query: data.question, limit: 3 },
          context,
        } as any);
        if (matches && matches.length > 0) {
          ragContext = matches.map((m: any) => m.content).join("\n\n---\n\n");
        }
      } catch (e) {
        console.error("Failed to fetch RAG context in lesson-ai:", e);
      }
    }

    const res = await callUserAiChat({
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: buildPrompt(data, ragContext) },
      ],
    });

    if (res.status === 429) throw new Error("Rate limit reached. Try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please top up your workspace.");
    if (!res.ok) throw new Error(`AI provider error (${res.status})`);

    const json = await res.json();
    const content: string = json.choices?.[0]?.message?.content ?? "";
    return { content };
  });
