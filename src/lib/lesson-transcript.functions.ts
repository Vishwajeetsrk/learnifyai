import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { extractYouTubeVideoId } from "@/lib/course-player";
import { z } from "zod";

const Input = z.object({
  videoId: z.string().regex(/^[a-zA-Z0-9_-]{11}$/),
});

export type TimedCue = { start: number; end: number; text: string };

const FullInput = z.object({
  lessonId: z.string().uuid(),
  courseId: z.string().uuid(),
  videoUrl: z.string().min(1).max(2000),
});

const MAX_MP4_BYTES = 24 * 1024 * 1024;

async function saveLessonTranscript(
  lessonId: string,
  courseId: string,
  source: "youtube" | "mp4" | "upload",
  text: string,
  cues: TimedCue[],
  lang = "en",
) {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await (supabaseAdmin.from("lesson_transcripts" as any) as any).upsert(
      {
        lesson_id: lessonId,
        course_id: courseId,
        source,
        transcript_text: text,
        segments: cues,
        chars: text.length,
        lang,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "lesson_id" },
    );
  } catch (e) {
    console.warn("[lesson-transcript] lesson_transcripts save failed:", e);
  }
}

async function transcribeMp4(
  videoUrl: string,
  groqKey: string,
): Promise<{ cues: TimedCue[]; text: string; language: string } | null> {
  // Size gate first so huge files never get fully downloaded
  try {
    const head = await fetch(videoUrl, {
      method: "HEAD",
      signal: AbortSignal.timeout(15000),
    });
    const len = Number(head.headers.get("content-length") || 0);
    if (len > MAX_MP4_BYTES) return null;
  } catch {
    /* HEAD unsupported — fall through to capped download */
  }

  const dl = await fetch(videoUrl, { signal: AbortSignal.timeout(90000) });
  if (!dl.ok) return null;
  const buf = new Uint8Array(await dl.arrayBuffer());
  if (buf.length === 0 || buf.length > 25 * 1024 * 1024) return null;

  const form = new FormData();
  form.append("file", new Blob([buf], { type: "video/mp4" }), "lesson.mp4");
  form.append("model", "whisper-large-v3-turbo");
  form.append("response_format", "verbose_json");
  form.append("timestamp_granularities[]", "segment");

  const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${groqKey}` },
    body: form,
    signal: AbortSignal.timeout(180000),
  });
  if (!res.ok) {
    console.warn("[lesson-transcript] Whisper failed:", res.status);
    return null;
  }
  const json: any = await res.json();
  const segs = Array.isArray(json?.segments) ? json.segments : [];
  const cues: TimedCue[] = segs
    .map((s: any) => ({
      start: Number(s.start ?? 0),
      end: Number(s.end ?? 0),
      text: String(s.text ?? "").trim(),
    }))
    .filter((c: TimedCue) => c.text.length > 0 && c.end > c.start);
  const text = (json?.text as string)?.trim() || cues.map((c) => c.text).join(" ");
  if (!text) return null;
  const language = typeof json?.language === "string" && json.language ? json.language : "en";
  return { cues, text, language };
}

/**
 * Unified lesson transcript for the player + AI features.
 * YouTube → cached captions. MP4 → Groq Whisper transcription (≤24MB), then cached.
 * Everything is saved to lesson_transcripts ("remember") for instant reuse.
 */
export const getLessonTranscriptFull = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => FullInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Verify the lesson belongs to this course
    const { data: lesson } = await supabase
      .from("lessons")
      .select("id, course_id, video_url")
      .eq("id", data.lessonId)
      .eq("course_id", data.courseId)
      .maybeSingle();
    if (!lesson) throw new Error("Lesson not found for this course.");

    const empty = { text: "", cues: [], source: "none", status: "unavailable", cached: false };

    // 1. Remembered transcript (fast path)
    try {
      const { data: saved } = await (supabaseAdmin.from("lesson_transcripts" as any) as any)
        .select("transcript_text, segments, source")
        .eq("lesson_id", data.lessonId)
        .maybeSingle();
      if (saved?.transcript_text) {
        return {
          text: saved.transcript_text as string,
          cues: (Array.isArray(saved.segments) ? saved.segments : []) as TimedCue[],
          source: (saved.source as string) ?? "youtube",
          status: "ok",
          cached: true,
        };
      }
    } catch (e) {
      console.warn("[getLessonTranscriptFull] cache read failed:", e);
    }

    const videoUrl = (data.videoUrl || (lesson as any)?.video_url || "").trim();
    if (!videoUrl) return empty;

    // 2. YouTube path (real timed segments — no estimated timings)
    const ytId = extractYouTubeVideoId(videoUrl);
    if (ytId) {
      let text = "";
      let cues: TimedCue[] = [];
      let lang = "en";
      try {
        const { data: cached } = await supabaseAdmin
          .from("youtube_transcripts")
          .select("transcript")
          .eq("video_id", ytId)
          .maybeSingle();
        text = (cached?.transcript as string) ?? "";
      } catch (e) {
        console.warn("[getLessonTranscriptFull] YT cache read failed:", e);
      }
      if (!text) {
        const { fetchTranscriptTimed } = await import("./youtube.functions");
        const timed = await fetchTranscriptTimed(ytId);
        if (timed) {
          text = timed.text;
          cues = timed.cues;
          lang = timed.lang;
          try {
            await supabaseAdmin.from("youtube_transcripts").upsert({
              video_id: ytId,
              transcript: text,
              chars: text.length,
              lang,
            });
          } catch (e) {
            console.warn("[getLessonTranscriptFull] YT cache write failed:", e);
          }
        }
      }
      if (!text) return empty;
      await saveLessonTranscript(data.lessonId, data.courseId, "youtube", text, cues, lang);
      return { text, cues, source: "youtube", status: "ok", cached: false };
    }

    // 3. MP4 / direct-file path via Whisper
    const groqKey = process.env.GROQ_API_KEY?.trim();
    if (!groqKey) return { ...empty, status: "no-key" as const };
    let result: { cues: TimedCue[]; text: string; language: string } | null = null;
    try {
      result = await transcribeMp4(videoUrl, groqKey);
    } catch (e) {
      console.warn("[getLessonTranscriptFull] MP4 transcription failed:", e);
    }
    if (!result) return { ...empty, status: "unavailable" as const };
    await saveLessonTranscript(
      data.lessonId,
      data.courseId,
      "mp4",
      result.text,
      result.cues,
      result.language,
    );
    return {
      text: result.text,
      cues: result.cues,
      source: "mp4",
      status: "ok",
      cached: false,
      lang: result.language,
    };
  });

const TranslateInput = z.object({
  lessonId: z.string().uuid(),
  courseId: z.string().uuid(),
  targetLang: z.enum(["hi", "es", "fr", "de", "ta", "te", "kn", "mr", "bn"]),
});

const LANG_NAMES: Record<string, string> = {
  hi: "Hindi",
  es: "Spanish",
  fr: "French",
  de: "German",
  ta: "Tamil",
  te: "Telugu",
  kn: "Kannada",
  mr: "Marathi",
  bn: "Bengali",
  en: "English",
};

async function translateBatch(lines: string[], targetName: string): Promise<string[]> {
  const { callUserAiChat } = await import("./user-ai");
  const numbered = lines.map((l, i) => `${i + 1}. ${l}`).join("\n");
  const res = await callUserAiChat({
    task: "general",
    temperature: 0.2,
    max_tokens: 2500,
    messages: [
      {
        role: "system",
        content: `You translate lesson captions into ${targetName}. Rules: translate ONLY, never add/remove/reorder lines, never explain, keep technical terms and code identifiers in English, keep the "N. " numbering exactly. Output only the numbered translated lines, nothing else.`,
      },
      { role: "user", content: numbered },
    ],
  });
  if (!res.ok) throw new Error(`AI provider error (${res.status})`);
  const json = await res.json();
  const content: string = json.choices?.[0]?.message?.content ?? "";
  const out = content
    .split("\n")
    .map((l: string) => l.replace(/^\s*\d+[.)]\s*/, "").trim())
    .filter(Boolean);
  return out.length === lines.length ? out : [];
}

/**
 * Real caption translation (replaces the old fabricated client-side dicts).
 * Translated cues keep original timings and are cached in
 * lesson_transcripts.translations[targetLang] for instant reuse.
 */
export const translateLessonTranscript = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => TranslateInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: lesson } = await supabase
      .from("lessons")
      .select("id, course_id")
      .eq("id", data.lessonId)
      .eq("course_id", data.courseId)
      .maybeSingle();
    if (!lesson) throw new Error("Lesson not found for this course.");

    const { data: row } = await (supabaseAdmin.from("lesson_transcripts" as any) as any)
      .select("transcript_text, segments, lang, translations")
      .eq("lesson_id", data.lessonId)
      .maybeSingle();

    const saved = (row ?? {}) as {
      transcript_text?: string;
      segments?: TimedCue[];
      lang?: string;
      translations?: Record<string, { text: string; segments: TimedCue[]; updated_at?: string }>;
    };
    const cached = saved.translations?.[data.targetLang];
    if (cached?.text) {
      return { text: cached.text, segments: cached.segments ?? [], cached: true };
    }

    const sourceText = (saved.transcript_text ?? "").trim();
    if (!sourceText) return { text: "", segments: [], cached: false, status: "no-transcript" };
    if ((saved.lang ?? "en") === data.targetLang) {
      return { text: sourceText, segments: saved.segments ?? [], cached: false };
    }

    const targetName = LANG_NAMES[data.targetLang] ?? data.targetLang;
    const segments: TimedCue[] = Array.isArray(saved.segments) ? saved.segments : [];
    let translatedSegments: TimedCue[] = [];
    let translatedText = "";

    if (segments.length > 0) {
      // Translate in numbered batches so every cue keeps its original timing
      const BATCH = 40;
      const out: string[] = [];
      for (let i = 0; i < segments.length; i += BATCH) {
        const slice = segments.slice(i, i + BATCH);
        const tr = await translateBatch(
          slice.map((s) => s.text),
          targetName,
        );
        if (tr.length !== slice.length) throw new Error("Translation batch mismatch — try again.");
        out.push(...tr);
      }
      translatedSegments = segments.map((s, i) => ({ ...s, text: out[i] }));
      translatedText = out.join(" ");
    } else {
      // Legacy plain-text rows: chunk by sentences, translate, join
      const sentences = sourceText
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);
      const chunks: string[] = [];
      let cur = "";
      for (const s of sentences) {
        if ((cur + " " + s).length > 2500 && cur) {
          chunks.push(cur.trim());
          cur = s;
        } else {
          cur = cur ? `${cur} ${s}` : s;
        }
      }
      if (cur.trim()) chunks.push(cur.trim());
      const out: string[] = [];
      for (const chunk of chunks) {
        const tr = await translateBatch([chunk], targetName);
        if (tr.length !== 1) throw new Error("Translation failed — try again.");
        out.push(...tr);
      }
      translatedText = out.join(" ");
    }

    if (!translatedText) throw new Error("Translation failed — try again.");

    try {
      const next = { ...(saved.translations ?? {}) };
      next[data.targetLang] = {
        text: translatedText,
        segments: translatedSegments,
        updated_at: new Date().toISOString(),
      };
      await (supabaseAdmin.from("lesson_transcripts" as any) as any)
        .update({ translations: next, updated_at: new Date().toISOString() })
        .eq("lesson_id", data.lessonId);
    } catch (e) {
      console.warn("[translateLessonTranscript] cache write failed:", e);
    }

    return { text: translatedText, segments: translatedSegments, cached: false };
  });

export const getLessonTranscript = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    try {
      const { data: cached } = await supabaseAdmin
        .from("youtube_transcripts")
        .select("transcript")
        .eq("video_id", data.videoId)
        .maybeSingle();
      if (cached?.transcript) return { transcript: cached.transcript as string };
    } catch (e) {
      console.warn("[getLessonTranscript] cache read failed:", e);
    }

    const { fetchTranscriptRaw } = await import("./youtube.functions");
    const transcript = await fetchTranscriptRaw(data.videoId);
    if (!transcript) return { transcript: "" };

    try {
      await supabaseAdmin.from("youtube_transcripts").upsert({
        video_id: data.videoId,
        transcript,
        chars: transcript.length,
        lang: "en",
      });
    } catch (e) {
      console.warn("[getLessonTranscript] cache write failed:", e);
    }

    return { transcript };
  });
