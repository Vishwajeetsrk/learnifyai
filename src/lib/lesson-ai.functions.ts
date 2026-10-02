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

const SYSTEM = `You are Learnify AI — a senior technical mentor. Provide direct, short answers. Use concise bullet points for the best presentation. Respond in clean, professional markdown (H2/H3 headings, fenced code blocks). Be extremely concise. Avoid long paragraphs, fluff, or filler text. CRITICAL: Do NOT use any emojis under any circumstances.`;

function buildPrompt(
  d: z.infer<typeof Input>,
  ragContext?: string,
  transcript?: string,
) {
  const ctx = `Course: ${d.courseTitle}\nLesson: ${d.lessonTitle}${d.lessonDescription ? `\nLesson notes: ${d.lessonDescription}` : ""}${transcript ? `\nVideo transcript (what is actually said in the lesson video):\n${transcript}` : ""}`;

  let basePrompt = "";
  if (d.action === "summary") {
    basePrompt = `${ctx}\n\nProduce a structured lesson summary in this exact section order (use brief bullet points under each heading, keep the whole summary tight):\n## Key Takeaways (3-5 short bullets with the most important points)\n## Introduction (2-3 bullets: what this lesson covers and its learning objectives — start with the topic, e.g. "Introduction to UI & UX Design")\n## Core Concepts Explained (one short bullet per core concept, explained in plain language)\n## Real-World Applications (2-3 bullets: where these skills show up in real projects or jobs)\n## Quick Recap (1-2 short lines summarizing the entire lesson)`;
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
        .select("id, course_id, video_url")
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

    // Remembered transcript: the video's spoken content so AI truly understands the lesson
    let transcript = "";
    try {
      const { data: saved } = await (supabase.from("lesson_transcripts" as any) as any)
        .select("transcript_text")
        .eq("lesson_id", data.lessonId)
        .maybeSingle();
      transcript = ((saved as any)?.transcript_text as string) ?? "";
      if (!transcript) {
        const videoUrl = ((lesson as any)?.video_url as string) ?? "";
        const { extractYouTubeVideoId } = await import("./course-player");
        const ytId = extractYouTubeVideoId(videoUrl);
        if (ytId) {
          const { data: cached } = await supabase
            .from("youtube_transcripts")
            .select("transcript")
            .eq("video_id", ytId)
            .maybeSingle();
          transcript = ((cached as any)?.transcript as string) ?? "";
        }
      }
    } catch (e) {
      console.error("Failed to fetch lesson transcript in lesson-ai:", e);
    }
    if (transcript.length > 8000) transcript = transcript.slice(0, 8000);

    // Remembered summary: instant answer when this lesson was already summarized
    if (data.action === "summary") {
      try {
        const { data: saved } = await (supabase.from("lesson_transcripts" as any) as any)
          .select("summary_md")
          .eq("lesson_id", data.lessonId)
          .maybeSingle();
        const cachedSummary = ((saved as any)?.summary_md as string) ?? "";
        if (cachedSummary) return { content: cachedSummary, cached: true };
      } catch (e) {
        console.error("Failed to read cached summary in lesson-ai:", e);
      }
    }

    const temperature = data.action === "summary" ? 0.3 : 0.5;
    const res = await callUserAiChat({
      task: data.action,
      temperature,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: buildPrompt(data, ragContext, transcript) },
      ],
    });

    if (res.status === 429) throw new Error("Rate limit reached. Try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please top up your workspace.");
    if (!res.ok) throw new Error(`AI provider error (${res.status})`);

    const json = await res.json();
    const content: string = json.choices?.[0]?.message?.content ?? "";

    // Save the summary so the next learner (and this one) gets it instantly
    if (data.action === "summary" && content) {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await (supabaseAdmin.from("lesson_transcripts" as any) as any).upsert(
          {
            lesson_id: data.lessonId,
            course_id: data.courseId,
            summary_md: content,
            summary_updated_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "lesson_id" },
        );
      } catch (e) {
        console.error("Failed to cache summary in lesson-ai:", e);
      }
    }

    return { content, cached: false };
  });
