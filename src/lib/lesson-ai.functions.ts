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

    // Stale-summary loop: hash of (notes + video_url + transcript). Any lesson edit
    // changes the hash, so learners always get a fresh summary after content updates.
    const { createHash } = await import("node:crypto");
    const sourceSnapshot = `${data.lessonDescription ?? ""}\n${((lesson as any)?.video_url as string) ?? ""}\n${transcript}`;
    const contentHash = createHash("sha256").update(sourceSnapshot).digest("hex").slice(0, 32);

    // Remembered summary: instant answer when this exact content was already summarized
    if (data.action === "summary") {
      try {
        const { data: saved } = await (supabase.from("lesson_transcripts" as any) as any)
          .select("summary_md, content_hash")
          .eq("lesson_id", data.lessonId)
          .maybeSingle();
        const cachedSummary = ((saved as any)?.summary_md as string) ?? "";
        const cachedHash = ((saved as any)?.content_hash as string) ?? "";
        if (cachedSummary && cachedHash === contentHash)
          return { content: cachedSummary, cached: true };
      } catch (e) {
        console.error("Failed to read cached summary in lesson-ai:", e);
      }
    }

    const temperature = data.action === "summary" ? 0.3 : 0.5;
    // Route by task: summaries → fastest engine, doubts (long RAG context) → Gemini.
    const preferredModel =
      data.action === "summary"
        ? "groq/llama-3.3-70b-versatile"
        : data.action === "doubt"
          ? "gemini/gemini-2.0-flash"
          : undefined;
    const userPrompt = buildPrompt(data, ragContext, transcript);
    const res = await callUserAiChat({
      task: data.action,
      temperature,
      ...(preferredModel ? { model: preferredModel } : {}),
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userPrompt },
      ],
    });

    if (res.status === 429) throw new Error("Rate limit reached. Try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please top up your workspace.");
    if (!res.ok) throw new Error(`AI provider error (${res.status})`);

    const json = await res.json();
    const content: string = json.choices?.[0]?.message?.content ?? "";

    // Metering: log token usage for admin analytics (log-only, no credit debit here).
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const promptChars = SYSTEM.length + userPrompt.length;
      const promptTokens = Math.ceil(promptChars / 4);
      const completionTokens = Math.ceil(content.length / 4);
      await supabaseAdmin.from("ai_usage").insert({
        user_id: userId,
        model: `lesson-ai:${data.action}`,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: promptTokens + completionTokens,
        conversation_id: null,
      });
    } catch (e) {
      console.error("Failed to log lesson-ai usage:", e);
    }

    // Save the summary (+ content hash) so repeats are instant and edits re-trigger
    if (data.action === "summary" && content) {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await (supabaseAdmin.from("lesson_transcripts" as any) as any).upsert(
          {
            lesson_id: data.lessonId,
            course_id: data.courseId,
            summary_md: content,
            content_hash: contentHash,
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

const QuizInput = z.object({
  lessonId: z.string().uuid(),
  courseId: z.string().uuid(),
  count: z.number().min(1).max(5).optional().default(3),
});

export interface LessonQuizItem {
  id: string;
  time: number;
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

/**
 * Mid-video quiz checkpoints, generated from the remembered transcript (or
 * lesson notes as fallback) and cached in lesson_transcripts.quiz.
 * Times spread across the lesson duration so the player can pause and quiz.
 */
export const getLessonQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => QuizInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: lesson } = await supabase
      .from("lessons")
      .select("id, course_id, title, video_url, duration_minutes, description, content_md")
      .eq("id", data.lessonId)
      .eq("course_id", data.courseId)
      .maybeSingle();
    if (!lesson) throw new Error("Lesson not found for this course.");

    try {
      const { data: saved } = await (supabase.from("lesson_transcripts" as any) as any)
        .select("quiz")
        .eq("lesson_id", data.lessonId)
        .maybeSingle();
      const cachedQuiz = ((saved as any)?.quiz as LessonQuizItem[]) ?? [];
      if (Array.isArray(cachedQuiz) && cachedQuiz.length > 0) return { quiz: cachedQuiz, cached: true };
    } catch (e) {
      console.error("Failed to read cached quiz:", e);
    }

    let source = "";
    try {
      const { data: saved } = await (supabase.from("lesson_transcripts" as any) as any)
        .select("transcript_text")
        .eq("lesson_id", data.lessonId)
        .maybeSingle();
      source = (((saved as any)?.transcript_text as string) ?? "").slice(0, 8000);
    } catch (e) {
      console.error("Failed to read transcript for quiz:", e);
    }
    if (!source) {
      const notes = ((lesson as any)?.content_md || (lesson as any)?.description || "") as string;
      source = String(notes).slice(0, 8000);
    }
    if (!source) return { quiz: [], cached: false };

    const minutes =
      (lesson as any)?.duration_minutes && (lesson as any).duration_minutes > 0
        ? (lesson as any).duration_minutes
        : 10;
    const totalSec = Math.round(minutes * 60);
    const count = Math.min(data.count ?? 3, 5);
    const slots = Array.from({ length: count }, (_, i) =>
      Math.round((totalSec * (i + 1)) / (count + 1)),
    );

    const { callUserAiChat } = await import("./user-ai");
    const res = await callUserAiChat({
      task: "quiz",
      temperature: 0.4,
      max_tokens: 1500,
      messages: [
        {
          role: "system",
          content:
            "You write short video-checkpoint quizzes. Output ONLY a JSON array, no markdown fences, no commentary. Each item: {\"question\": string (1 line), \"options\": [exactly 4 short strings], \"answer\": 0-3 index of the correct option, \"explanation\": string (1 line)}. Questions must be answerable from the lesson content below. Keep language simple.",
        },
        {
          role: "user",
          content: `Lesson: ${(lesson as any)?.title ?? ""}\n\nCONTENT:\n${source}\n\nWrite ${count} checkpoint questions as a JSON array.`,
        },
      ],
    });
    if (!res.ok) throw new Error(`AI provider error (${res.status})`);
    const json = await res.json();
    let raw: string = json.choices?.[0]?.message?.content ?? "";
    raw = raw
      .trim()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();
    let items: any[] = [];
    try {
      items = JSON.parse(raw);
    } catch {
      const m = raw.match(/\[[\s\S]*\]/);
      if (m) items = JSON.parse(m[0]);
    }
    const quiz: LessonQuizItem[] = (Array.isArray(items) ? items : [])
      .slice(0, count)
      .map((q: any, i: number) => ({
        id: `q${i + 1}`,
        time: slots[i] ?? Math.round(totalSec / 2),
        question: String(q?.question ?? "").slice(0, 300),
        options: (Array.isArray(q?.options) ? q.options : []).slice(0, 4).map((o: any) => String(o).slice(0, 160)),
        answer: Math.min(3, Math.max(0, Number(q?.answer ?? 0) || 0)),
        explanation: String(q?.explanation ?? "").slice(0, 300),
      }))
      .filter((q) => q.question && q.options.length === 4);

    if (quiz.length > 0) {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await (supabaseAdmin.from("lesson_transcripts" as any) as any)
          .update({ quiz, updated_at: new Date().toISOString() })
          .eq("lesson_id", data.lessonId);
      } catch (e) {
        console.error("Failed to cache quiz:", e);
      }
    }

    // Metering (log-only)
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("ai_usage").insert({
        user_id: userId,
        model: "lesson-ai:quiz",
        prompt_tokens: Math.ceil((source.length + 500) / 4),
        completion_tokens: 400,
        total_tokens: Math.ceil((source.length + 500) / 4) + 400,
        conversation_id: null,
      });
    } catch (e) {
      console.error("Failed to log quiz usage:", e);
    }

    return { quiz, cached: false };
  });
