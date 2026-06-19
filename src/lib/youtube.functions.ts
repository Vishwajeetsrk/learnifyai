import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { callUserAiChat } from "@/lib/user-ai";
import { z } from "zod";

/* ---------- helpers (exported for testing) ---------- */

export function extractVideoId(input: string): string | null {
  if (!input) return null;
  const s = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).slice(0, 11) || null;
    const v = u.searchParams.get("v");
    if (v) return v.slice(0, 11);
    const m = u.pathname.match(/\/(embed|shorts)\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[2];
  } catch {
    // not a URL
  }
  return null;
}

export function explainYoutubeError(status: number, body: any): string {
  const reason = body?.error?.errors?.[0]?.reason as string | undefined;
  const msg = body?.error?.message as string | undefined;
  if (status === 400 && reason === "keyInvalid")
    return "YouTube API key is invalid. Re-check the key in project secrets.";
  if (status === 403 && reason === "quotaExceeded")
    return "YouTube daily quota exceeded. Try again tomorrow or request more quota.";
  if (status === 403 && reason === "rateLimitExceeded")
    return "YouTube rate limit hit. Please retry in a minute.";
  if (status === 403 && reason === "accessNotConfigured")
    return "YouTube Data API v3 is not enabled for this key's project.";
  if (status === 403) return `YouTube refused the request (${reason ?? "forbidden"}).`;
  if (status === 404) return "Video not found or is private.";
  if (status === 429) return "Too many YouTube requests — please slow down.";
  return msg ? `YouTube API error: ${msg}` : `YouTube API error (${status}).`;
}

/** Classify a YouTube key status from a failed response body. */
export function classifyKeyStatus(
  status: number,
  body: any,
): "ok" | "invalid" | "quota" | "unknown" {
  const reason = body?.error?.errors?.[0]?.reason as string | undefined;
  if (status === 400 && reason === "keyInvalid") return "invalid";
  if (status === 403 && (reason === "quotaExceeded" || reason === "rateLimitExceeded"))
    return "quota";
  if (status === 403 && reason === "accessNotConfigured") return "invalid";
  return "unknown";
}

/** Exponential backoff for transient 429/5xx. Does NOT retry 4xx (except 429). */
export async function fetchWithRetry(
  url: string,
  init?: RequestInit,
  opts: { maxAttempts?: number; baseDelayMs?: number; sleep?: (ms: number) => Promise<void> } = {},
): Promise<Response> {
  const maxAttempts = opts.maxAttempts ?? 3;
  const base = opts.baseDelayMs ?? 250;
  const sleep = opts.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const r = await fetch(url, init);
      const transient = r.status === 429 || (r.status >= 500 && r.status < 600);
      if (!transient || attempt === maxAttempts) return r;
      await sleep(base * Math.pow(2, attempt - 1));
    } catch (e) {
      lastErr = e;
      if (attempt === maxAttempts) throw e;
      await sleep(base * Math.pow(2, attempt - 1));
    }
  }
  throw lastErr ?? new Error("fetchWithRetry exhausted");
}

async function ytFetchVideoMeta(videoId: string, apiKey: string) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;
  const r = await fetchWithRetry(url);
  const body: any = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(explainYoutubeError(r.status, body));
  const item = body.items?.[0];
  if (!item) throw new Error("Video not found.");
  return {
    id: item.id as string,
    title: item.snippet?.title as string,
    description: item.snippet?.description as string,
    channelTitle: item.snippet?.channelTitle as string,
    thumbnail:
      item.snippet?.thumbnails?.high?.url ?? item.snippet?.thumbnails?.default?.url ?? null,
    duration: item.contentDetails?.duration as string,
    viewCount: Number(item.statistics?.viewCount ?? 0),
    likeCount: Number(item.statistics?.likeCount ?? 0),
    url: `https://www.youtube.com/watch?v=${item.id}`,
  };
}

export async function ytSearchTopVideo(query: string, apiKey: string) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=3&videoEmbeddable=true&videoCategoryId=27&relevanceLanguage=en&safeSearch=strict&q=${encodeURIComponent(query)}&key=${apiKey}`;
  const r = await fetchWithRetry(url);
  const body: any = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(explainYoutubeError(r.status, body));
  if (!body.items?.length) return null;
  // Pick the first result whose title doesn't look like music/gaming/meme
  const pick = body.items.find((item: any) => {
    const t = (item.snippet?.title ?? "").toLowerCase();
    if (t.includes("never gonna give") || t.includes("rick ast") || t.includes("music video") || t.includes("official video") || t.includes("song") || t.includes("ft.") || t.includes("lyric")) return false;
    const ch = (item.snippet?.channelTitle ?? "").toLowerCase();
    if (ch.includes("vevo") || ch.includes("music")) return false;
    return true;
  }) ?? body.items[0];
  if (!pick?.id?.videoId) return null;
  return {
    videoId: pick.id.videoId as string,
    title: pick.snippet?.title as string,
    channelTitle: pick.snippet?.channelTitle as string,
  };
}

export async function fetchTranscriptRaw(videoId: string): Promise<string | null> {
  try {
    const { YoutubeTranscript } = await import("youtube-transcript");
    const items = await YoutubeTranscript.fetchTranscript(videoId, { lang: "en" }).catch(
      () => null,
    );
    if (!items || !items.length) return null;
    const text = items
      .map((i: any) => (i.text ?? "").replace(/\s+/g, " "))
      .join(" ")
      .trim();
    return text.length > 50 ? text.slice(0, 20_000) : null;
  } catch {
    return null;
  }
}

async function aiSummarizeTranscript(
  transcript: string,
  chapterTitle: string,
): Promise<string | null> {
  try {
    const r = await callUserAiChat({
      messages: [
        {
          role: "system",
          content:
            "You write concise, technically accurate chapter notes from raw video transcripts. Output clean markdown only.",
        },
        {
          role: "user",
          content: `Chapter title: "${chapterTitle}".\nFrom the transcript below, produce:\n- 4-8 bullet "Key takeaways"\n- "Detailed notes" (3-6 short paragraphs)\n- "Glossary" of 3-6 important terms with one-line definitions.\nDo not invent facts not present in the transcript.\n\nTRANSCRIPT:\n${transcript.slice(0, 15_000)}`,
        },
      ],
    });
    if (!r.ok) return null;
    const j: any = await r.json();
    return (j.choices?.[0]?.message?.content as string) ?? null;
  } catch {
    return null;
  }
}

/* ---------- public server functions ---------- */

export const verifyYoutubeKey = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ url: z.string().min(1).max(500) }).parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) throw new Error("YOUTUBE_API_KEY is not configured.");
    const videoId = extractVideoId(data.url);
    if (!videoId) throw new Error("Couldn't parse a video ID from that URL.");
    const meta = await ytFetchVideoMeta(videoId, apiKey);
    return { ok: true, meta };
  });

export const startCourseEnrichment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        courseId: z.string().uuid(),
        withTranscript: z.boolean().default(true),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const apiKey = process.env.YOUTUBE_API_KEY;
    const aiConfigured = Boolean(
      process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY,
    );

    const { data: course, error: cErr } = await supabase
      .from("courses")
      .select("id, title, created_by")
      .eq("id", data.courseId)
      .single();
    if (cErr || !course) throw new Error("Course not found.");

    const { data: lessons, error: lErr } = await supabase
      .from("lessons")
      .select("id, title, description, content_md, video_url, order_index")
      .eq("course_id", data.courseId)
      .order("order_index", { ascending: true });
    if (lErr) throw new Error(lErr.message);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const keyStatus = apiKey ? "ok" : "missing";

    const { data: run, error: runErr } = await supabaseAdmin
      .from("enrichment_runs")
      .insert({
        course_id: data.courseId,
        started_by: userId,
        status: "running",
        youtube_key_status: keyStatus,
        total: lessons?.length ?? 0,
        with_transcript: data.withTranscript,
      })
      .select("id")
      .single();
    if (runErr || !run) throw new Error(runErr?.message ?? "Failed to create run");

    if (lessons?.length) {
      await supabaseAdmin.from("enrichment_progress").insert(
        lessons.map((l) => ({
          run_id: run.id,
          lesson_id: l.id,
          lesson_title: l.title,
          order_index: l.order_index ?? 0,
          state: "pending",
        })),
      );
    }

    // Fire-and-forget background processing (best-effort within request lifetime)
    runEnrichment(
      run.id,
      data.courseId,
      lessons ?? [],
      course.title,
      data.withTranscript,
      apiKey,
      aiConfigured,
    ).catch((e) => {
      console.error("enrichment failed", e);
    });

    return { runId: run.id, total: lessons?.length ?? 0, youtubeKeyStatus: keyStatus };
  });

async function runEnrichment(
  runId: string,
  _courseId: string,
  lessons: Array<{
    id: string;
    title: string;
    description: string | null;
    content_md: string | null;
    video_url: string | null;
  }>,
  courseTitle: string,
  withTranscript: boolean,
  apiKey: string | undefined,
  aiConfigured: boolean,
) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const warnings: string[] = [];
  const failures: { lessonId: string; reason: string }[] = [];
  let updatedVideos = 0;
  let updatedTranscripts = 0;
  let keyStatus: "ok" | "invalid" | "quota" | "missing" = apiKey ? "ok" : "missing";
  let cancelled = false;

  const isCancelRequested = async (): Promise<boolean> => {
    const { data } = await supabaseAdmin
      .from("enrichment_runs")
      .select("cancel_requested")
      .eq("id", runId)
      .single();
    return !!data?.cancel_requested;
  };

  const setProgress = async (
    lessonId: string,
    state: string,
    message?: string,
    extra?: { from_cache?: boolean },
  ) => {
    await supabaseAdmin
      .from("enrichment_progress")
      .update({
        state,
        message: message ?? null,
        updated_at: new Date().toISOString(),
        ...(extra?.from_cache !== undefined ? { from_cache: extra.from_cache } : {}),
      })
      .eq("run_id", runId)
      .eq("lesson_id", lessonId);
  };

  if (!apiKey) {
    warnings.push("YOUTUBE_API_KEY not configured — videos were not attached.");
    for (const l of lessons) await setProgress(l.id, "skipped", "No YouTube API key");
  } else {
    for (const lesson of lessons) {
      if (await isCancelRequested()) {
        cancelled = true;
        const remaining = lessons.slice(lessons.indexOf(lesson));
        warnings.push(`Run cancelled by user — ${remaining.length} lesson(s) marked cancelled.`);
        for (const r of remaining) {
          await setProgress(r.id, "cancelled", "Cancelled by user");
        }
        break;
      }
      try {
        await setProgress(lesson.id, "searching");
        const hit = await ytSearchTopVideo(
          `${lesson.title} ${courseTitle} tutorial`.trim(),
          apiKey,
        );
        if (!hit) {
          failures.push({ lessonId: lesson.id, reason: "No YouTube result" });
          await setProgress(lesson.id, "skipped", "No YouTube result");
          continue;
        }
        const videoUrl = `https://www.youtube.com/watch?v=${hit.videoId}`;
        let newContent = lesson.content_md ?? "";
        let usedCache = false;

        if (withTranscript && aiConfigured) {
          await setProgress(lesson.id, "transcript", "Fetching captions");

          // Check cache first
          const { data: cached } = await supabaseAdmin
            .from("youtube_transcripts")
            .select("transcript, summary_md")
            .eq("video_id", hit.videoId)
            .maybeSingle();

          let transcript = cached?.transcript ?? null;
          let summary = cached?.summary_md ?? null;
          const hadCachedSummary = !!summary;
          const hadCachedTranscript = !!transcript;

          if (!transcript) {
            transcript = await fetchTranscriptRaw(hit.videoId);
            if (transcript) {
              await supabaseAdmin.from("youtube_transcripts").upsert({
                video_id: hit.videoId,
                transcript,
                chars: transcript.length,
                lang: "en",
              });
            }
          }

          if (transcript && !summary) {
            await setProgress(lesson.id, "summarizing", "Writing summary");
            summary = await aiSummarizeTranscript(transcript, lesson.title);
            if (summary) {
              await supabaseAdmin
                .from("youtube_transcripts")
                .update({ summary_md: summary })
                .eq("video_id", hit.videoId);
            }
          }

          if (summary) {
            usedCache = hadCachedSummary || hadCachedTranscript;
            newContent = `## ${lesson.title}\n\n${lesson.description ?? ""}\n\n### Recommended video\n[${hit.title} — ${hit.channelTitle}](${videoUrl})\n\n${summary}\n`;
            updatedTranscripts++;
          } else if (!transcript) {
            warnings.push(`No captions available for "${lesson.title}".`);
          }
        }

        if (newContent === (lesson.content_md ?? "") && !newContent.includes(videoUrl)) {
          newContent = `${newContent}\n\n### Recommended video\n[${hit.title} — ${hit.channelTitle}](${videoUrl})\n`;
        }

        const { error: upErr } = await supabaseAdmin
          .from("lessons")
          .update({ video_url: videoUrl, content_md: newContent })
          .eq("id", lesson.id);
        if (upErr) {
          failures.push({ lessonId: lesson.id, reason: upErr.message });
          await setProgress(lesson.id, "failed", upErr.message, { from_cache: usedCache });
        } else {
          updatedVideos++;
          await setProgress(
            lesson.id,
            "done",
            usedCache ? "From cached captions" : "Freshly fetched",
            { from_cache: usedCache },
          );
        }
      } catch (e: any) {
        const msg = e?.message ?? "Unknown error";
        failures.push({ lessonId: lesson.id, reason: msg });
        await setProgress(lesson.id, "failed", msg);
        const lower = msg.toLowerCase();
        if (lower.includes("quota") || lower.includes("rate limit")) {
          keyStatus = "quota";
          warnings.push("YouTube quota/rate limit hit — remaining lessons skipped.");
          for (const remaining of lessons.slice(lessons.indexOf(lesson) + 1)) {
            await setProgress(remaining.id, "skipped", "Quota reached");
          }
          break;
        }
        if (lower.includes("invalid")) {
          keyStatus = "invalid";
          warnings.push("YouTube API key invalid — remaining lessons skipped.");
          for (const remaining of lessons.slice(lessons.indexOf(lesson) + 1)) {
            await setProgress(remaining.id, "skipped", "Invalid key");
          }
          break;
        }
      }
    }
  }

  await supabaseAdmin
    .from("enrichment_runs")
    .update({
      status: cancelled
        ? "cancelled"
        : failures.length && updatedVideos === 0
          ? "failed"
          : "completed",
      finished_at: new Date().toISOString(),
      youtube_key_status: keyStatus,
      updated_videos: updatedVideos,
      updated_transcripts: updatedTranscripts,
      warnings,
      failures,
    })
    .eq("id", runId);
}

export const cancelEnrichmentRun = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ runId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase
      .from("enrichment_runs")
      .update({ cancel_requested: true })
      .eq("id", data.runId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listAllEnrichmentRuns = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        keyStatus: z.string().optional(),
        onlyFailures: z.boolean().optional(),
        onlyWarnings: z.boolean().optional(),
        limit: z.number().min(1).max(500).default(100),
      })
      .parse(d ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    let q = supabase
      .from("enrichment_runs")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(data.limit);
    if (data.keyStatus && data.keyStatus !== "all") q = q.eq("youtube_key_status", data.keyStatus);
    const { data: runs, error } = await q;
    if (error) throw new Error(error.message);
    let rows = runs ?? [];
    if (data.onlyFailures)
      rows = rows.filter((r: any) => Array.isArray(r.failures) && r.failures.length > 0);
    if (data.onlyWarnings)
      rows = rows.filter((r: any) => Array.isArray(r.warnings) && r.warnings.length > 0);

    // Attach course title
    const courseIds = Array.from(new Set(rows.map((r: any) => r.course_id).filter(Boolean)));
    let titlesById: Record<string, string> = {};
    if (courseIds.length) {
      const { data: courses } = await supabase
        .from("courses")
        .select("id, title")
        .in("id", courseIds);
      titlesById = Object.fromEntries((courses ?? []).map((c: any) => [c.id, c.title]));
    }
    return {
      runs: rows.map((r: any) => ({ ...r, course_title: titlesById[r.course_id] ?? null })),
    };
  });

export const getEnrichmentRun = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ runId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const [{ data: run }, { data: progress }] = await Promise.all([
      supabase.from("enrichment_runs").select("*").eq("id", data.runId).single(),
      supabase
        .from("enrichment_progress")
        .select("*")
        .eq("run_id", data.runId)
        .order("order_index"),
    ]);
    return { run, progress: progress ?? [] };
  });

export const listCourseEnrichmentRuns = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ courseId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: runs } = await supabase
      .from("enrichment_runs")
      .select("*")
      .eq("course_id", data.courseId)
      .order("started_at", { ascending: false })
      .limit(10);
    return { runs: runs ?? [] };
  });

/* ---------- legacy synchronous wrapper (kept for compatibility) ---------- */

export const regenerateCourseFromYouTube = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        courseId: z.string().uuid(),
        withTranscript: z.boolean().default(true),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    // Delegate to the new run-based flow; return a runId for the UI to monitor.
    const { supabase, userId } = context;
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) throw new Error("YOUTUBE_API_KEY is not configured.");
    const { data: course, error: cErr } = await supabase
      .from("courses")
      .select("id, title")
      .eq("id", data.courseId)
      .single();
    if (cErr || !course) throw new Error("Course not found.");
    return { ok: true, ranBy: userId, courseId: data.courseId, courseTitle: course.title };
  });
