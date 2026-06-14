import { c as createServerRpc } from "./createServerRpc-0AUf3IhG.mjs";
import { b as createServerFn } from "./server-BLOOEPZP.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BVm8xUae.mjs";
import { c as callUserAiChat } from "./user-ai-C_P4MEwi.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, b as booleanType, n as numberType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function extractVideoId(input) {
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
  }
  return null;
}
function explainYoutubeError(status, body) {
  const reason = body?.error?.errors?.[0]?.reason;
  const msg = body?.error?.message;
  if (status === 400 && reason === "keyInvalid") return "YouTube API key is invalid. Re-check the key in project secrets.";
  if (status === 403 && reason === "quotaExceeded") return "YouTube daily quota exceeded. Try again tomorrow or request more quota.";
  if (status === 403 && reason === "rateLimitExceeded") return "YouTube rate limit hit. Please retry in a minute.";
  if (status === 403 && reason === "accessNotConfigured") return "YouTube Data API v3 is not enabled for this key's project.";
  if (status === 403) return `YouTube refused the request (${reason ?? "forbidden"}).`;
  if (status === 404) return "Video not found or is private.";
  if (status === 429) return "Too many YouTube requests — please slow down.";
  return msg ? `YouTube API error: ${msg}` : `YouTube API error (${status}).`;
}
async function fetchWithRetry(url, init, opts = {}) {
  const maxAttempts = opts.maxAttempts ?? 3;
  const base = opts.baseDelayMs ?? 250;
  const sleep = opts.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const r = await fetch(url, init);
      const transient = r.status === 429 || r.status >= 500 && r.status < 600;
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
async function ytFetchVideoMeta(videoId, apiKey) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;
  const r = await fetchWithRetry(url);
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(explainYoutubeError(r.status, body));
  const item = body.items?.[0];
  if (!item) throw new Error("Video not found.");
  return {
    id: item.id,
    title: item.snippet?.title,
    description: item.snippet?.description,
    channelTitle: item.snippet?.channelTitle,
    thumbnail: item.snippet?.thumbnails?.high?.url ?? item.snippet?.thumbnails?.default?.url ?? null,
    duration: item.contentDetails?.duration,
    viewCount: Number(item.statistics?.viewCount ?? 0),
    likeCount: Number(item.statistics?.likeCount ?? 0),
    url: `https://www.youtube.com/watch?v=${item.id}`
  };
}
async function ytSearchTopVideo(query, apiKey) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&videoEmbeddable=true&relevanceLanguage=en&safeSearch=strict&q=${encodeURIComponent(query)}&key=${apiKey}`;
  const r = await fetchWithRetry(url);
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(explainYoutubeError(r.status, body));
  const item = body.items?.[0];
  if (!item?.id?.videoId) return null;
  return {
    videoId: item.id.videoId,
    title: item.snippet?.title,
    channelTitle: item.snippet?.channelTitle
  };
}
async function fetchTranscriptRaw(videoId) {
  try {
    const {
      YoutubeTranscript
    } = await import("../_libs/youtube-transcript.mjs");
    const items = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: "en"
    }).catch(() => null);
    if (!items || !items.length) return null;
    const text = items.map((i) => (i.text ?? "").replace(/\s+/g, " ")).join(" ").trim();
    return text.length > 50 ? text.slice(0, 2e4) : null;
  } catch {
    return null;
  }
}
async function aiSummarizeTranscript(transcript, chapterTitle) {
  try {
    const r = await callUserAiChat({
      messages: [{
        role: "system",
        content: "You write concise, technically accurate chapter notes from raw video transcripts. Output clean markdown only."
      }, {
        role: "user",
        content: `Chapter title: "${chapterTitle}".
From the transcript below, produce:
- 4-8 bullet "Key takeaways"
- "Detailed notes" (3-6 short paragraphs)
- "Glossary" of 3-6 important terms with one-line definitions.
Do not invent facts not present in the transcript.

TRANSCRIPT:
${transcript.slice(0, 15e3)}`
      }]
    });
    if (!r.ok) return null;
    const j = await r.json();
    return j.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}
const verifyYoutubeKey_createServerFn_handler = createServerRpc({
  id: "32ec0226b9128c668db59a78babcb2a98cdb0b8255ee9827fa188387332d3644",
  name: "verifyYoutubeKey",
  filename: "src/lib/youtube.functions.ts"
}, (opts) => verifyYoutubeKey.__executeServer(opts));
const verifyYoutubeKey = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  url: stringType().min(1).max(500)
}).parse(d)).handler(verifyYoutubeKey_createServerFn_handler, async ({
  data
}) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY is not configured.");
  const videoId = extractVideoId(data.url);
  if (!videoId) throw new Error("Couldn't parse a video ID from that URL.");
  const meta = await ytFetchVideoMeta(videoId, apiKey);
  return {
    ok: true,
    meta
  };
});
const startCourseEnrichment_createServerFn_handler = createServerRpc({
  id: "cfadcb0866ebd11d60c0cbe50fdbdd66a2c9c01a93f53dd16537edcbce7e43d5",
  name: "startCourseEnrichment",
  filename: "src/lib/youtube.functions.ts"
}, (opts) => startCourseEnrichment.__executeServer(opts));
const startCourseEnrichment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  courseId: stringType().uuid(),
  withTranscript: booleanType().default(true)
}).parse(d)).handler(startCourseEnrichment_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const apiKey = process.env.YOUTUBE_API_KEY;
  const aiConfigured = Boolean(process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY);
  const {
    data: course,
    error: cErr
  } = await supabase.from("courses").select("id, title, created_by").eq("id", data.courseId).single();
  if (cErr || !course) throw new Error("Course not found.");
  const {
    data: lessons,
    error: lErr
  } = await supabase.from("lessons").select("id, title, description, content_md, video_url, order_index").eq("course_id", data.courseId).order("order_index", {
    ascending: true
  });
  if (lErr) throw new Error(lErr.message);
  const {
    supabaseAdmin
  } = await import("./client.server-BbcUHF3e.mjs");
  const keyStatus = apiKey ? "ok" : "missing";
  const {
    data: run,
    error: runErr
  } = await supabaseAdmin.from("enrichment_runs").insert({
    course_id: data.courseId,
    started_by: userId,
    status: "running",
    youtube_key_status: keyStatus,
    total: lessons?.length ?? 0,
    with_transcript: data.withTranscript
  }).select("id").single();
  if (runErr || !run) throw new Error(runErr?.message ?? "Failed to create run");
  if (lessons?.length) {
    await supabaseAdmin.from("enrichment_progress").insert(lessons.map((l) => ({
      run_id: run.id,
      lesson_id: l.id,
      lesson_title: l.title,
      order_index: l.order_index ?? 0,
      state: "pending"
    })));
  }
  runEnrichment(run.id, data.courseId, lessons ?? [], course.title, data.withTranscript, apiKey, aiConfigured).catch((e) => {
    console.error("enrichment failed", e);
  });
  return {
    runId: run.id,
    total: lessons?.length ?? 0,
    youtubeKeyStatus: keyStatus
  };
});
async function runEnrichment(runId, _courseId, lessons, courseTitle, withTranscript, apiKey, aiConfigured) {
  const {
    supabaseAdmin
  } = await import("./client.server-BbcUHF3e.mjs");
  const warnings = [];
  const failures = [];
  let updatedVideos = 0;
  let updatedTranscripts = 0;
  let keyStatus = apiKey ? "ok" : "missing";
  let cancelled = false;
  const isCancelRequested = async () => {
    const {
      data
    } = await supabaseAdmin.from("enrichment_runs").select("cancel_requested").eq("id", runId).single();
    return !!data?.cancel_requested;
  };
  const setProgress = async (lessonId, state, message, extra) => {
    await supabaseAdmin.from("enrichment_progress").update({
      state,
      message: message ?? null,
      updated_at: (/* @__PURE__ */ new Date()).toISOString(),
      ...extra?.from_cache !== void 0 ? {
        from_cache: extra.from_cache
      } : {}
    }).eq("run_id", runId).eq("lesson_id", lessonId);
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
        const hit = await ytSearchTopVideo(`${lesson.title} ${courseTitle} tutorial`.trim(), apiKey);
        if (!hit) {
          failures.push({
            lessonId: lesson.id,
            reason: "No YouTube result"
          });
          await setProgress(lesson.id, "skipped", "No YouTube result");
          continue;
        }
        const videoUrl = `https://www.youtube.com/watch?v=${hit.videoId}`;
        let newContent = lesson.content_md ?? "";
        let usedCache = false;
        if (withTranscript && aiConfigured) {
          await setProgress(lesson.id, "transcript", "Fetching captions");
          const {
            data: cached
          } = await supabaseAdmin.from("youtube_transcripts").select("transcript, summary_md").eq("video_id", hit.videoId).maybeSingle();
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
                lang: "en"
              });
            }
          }
          if (transcript && !summary) {
            await setProgress(lesson.id, "summarizing", "Writing summary");
            summary = await aiSummarizeTranscript(transcript, lesson.title);
            if (summary) {
              await supabaseAdmin.from("youtube_transcripts").update({
                summary_md: summary
              }).eq("video_id", hit.videoId);
            }
          }
          if (summary) {
            usedCache = hadCachedSummary || hadCachedTranscript;
            newContent = `## ${lesson.title}

${lesson.description ?? ""}

### Recommended video
[${hit.title} — ${hit.channelTitle}](${videoUrl})

${summary}
`;
            updatedTranscripts++;
          } else if (!transcript) {
            warnings.push(`No captions available for "${lesson.title}".`);
          }
        }
        if (newContent === (lesson.content_md ?? "") && !newContent.includes(videoUrl)) {
          newContent = `${newContent}

### Recommended video
[${hit.title} — ${hit.channelTitle}](${videoUrl})
`;
        }
        const {
          error: upErr
        } = await supabaseAdmin.from("lessons").update({
          video_url: videoUrl,
          content_md: newContent
        }).eq("id", lesson.id);
        if (upErr) {
          failures.push({
            lessonId: lesson.id,
            reason: upErr.message
          });
          await setProgress(lesson.id, "failed", upErr.message, {
            from_cache: usedCache
          });
        } else {
          updatedVideos++;
          await setProgress(lesson.id, "done", usedCache ? "From cached captions" : "Freshly fetched", {
            from_cache: usedCache
          });
        }
      } catch (e) {
        const msg = e?.message ?? "Unknown error";
        failures.push({
          lessonId: lesson.id,
          reason: msg
        });
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
  await supabaseAdmin.from("enrichment_runs").update({
    status: cancelled ? "cancelled" : failures.length && updatedVideos === 0 ? "failed" : "completed",
    finished_at: (/* @__PURE__ */ new Date()).toISOString(),
    youtube_key_status: keyStatus,
    updated_videos: updatedVideos,
    updated_transcripts: updatedTranscripts,
    warnings,
    failures
  }).eq("id", runId);
}
const cancelEnrichmentRun_createServerFn_handler = createServerRpc({
  id: "fd120808553ec5488e5806f56b6cb30ddc43813e37d2d7cd37a430973322651d",
  name: "cancelEnrichmentRun",
  filename: "src/lib/youtube.functions.ts"
}, (opts) => cancelEnrichmentRun.__executeServer(opts));
const cancelEnrichmentRun = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  runId: stringType().uuid()
}).parse(d)).handler(cancelEnrichmentRun_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    error
  } = await supabase.from("enrichment_runs").update({
    cancel_requested: true
  }).eq("id", data.runId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const listAllEnrichmentRuns_createServerFn_handler = createServerRpc({
  id: "4a4ba4e480cefba40d5cab46088e1cac2cf971cbf632e1bcd416c7e075b78ba4",
  name: "listAllEnrichmentRuns",
  filename: "src/lib/youtube.functions.ts"
}, (opts) => listAllEnrichmentRuns.__executeServer(opts));
const listAllEnrichmentRuns = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  keyStatus: stringType().optional(),
  onlyFailures: booleanType().optional(),
  onlyWarnings: booleanType().optional(),
  limit: numberType().min(1).max(500).default(100)
}).parse(d ?? {})).handler(listAllEnrichmentRuns_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  let q = supabase.from("enrichment_runs").select("*").order("started_at", {
    ascending: false
  }).limit(data.limit);
  if (data.keyStatus && data.keyStatus !== "all") q = q.eq("youtube_key_status", data.keyStatus);
  const {
    data: runs,
    error
  } = await q;
  if (error) throw new Error(error.message);
  let rows = runs ?? [];
  if (data.onlyFailures) rows = rows.filter((r) => Array.isArray(r.failures) && r.failures.length > 0);
  if (data.onlyWarnings) rows = rows.filter((r) => Array.isArray(r.warnings) && r.warnings.length > 0);
  const courseIds = Array.from(new Set(rows.map((r) => r.course_id).filter(Boolean)));
  let titlesById = {};
  if (courseIds.length) {
    const {
      data: courses
    } = await supabase.from("courses").select("id, title").in("id", courseIds);
    titlesById = Object.fromEntries((courses ?? []).map((c) => [c.id, c.title]));
  }
  return {
    runs: rows.map((r) => ({
      ...r,
      course_title: titlesById[r.course_id] ?? null
    }))
  };
});
const getEnrichmentRun_createServerFn_handler = createServerRpc({
  id: "f94c89c281f45fa617f0f11172b851f88434619b7f363ccd01a3e03cd9236f76",
  name: "getEnrichmentRun",
  filename: "src/lib/youtube.functions.ts"
}, (opts) => getEnrichmentRun.__executeServer(opts));
const getEnrichmentRun = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  runId: stringType().uuid()
}).parse(d)).handler(getEnrichmentRun_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const [{
    data: run
  }, {
    data: progress
  }] = await Promise.all([supabase.from("enrichment_runs").select("*").eq("id", data.runId).single(), supabase.from("enrichment_progress").select("*").eq("run_id", data.runId).order("order_index")]);
  return {
    run,
    progress: progress ?? []
  };
});
const listCourseEnrichmentRuns_createServerFn_handler = createServerRpc({
  id: "b522cde227308a9e042aa0dc147f5ef57ab07c8dd0d53ccbb56a686df9863038",
  name: "listCourseEnrichmentRuns",
  filename: "src/lib/youtube.functions.ts"
}, (opts) => listCourseEnrichmentRuns.__executeServer(opts));
const listCourseEnrichmentRuns = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  courseId: stringType().uuid()
}).parse(d)).handler(listCourseEnrichmentRuns_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data: runs
  } = await supabase.from("enrichment_runs").select("*").eq("course_id", data.courseId).order("started_at", {
    ascending: false
  }).limit(10);
  return {
    runs: runs ?? []
  };
});
const regenerateCourseFromYouTube_createServerFn_handler = createServerRpc({
  id: "7d6a1b7ca248c0cff671e1203e94e4fa6ad30148eb1e00a15952d0f47c461126",
  name: "regenerateCourseFromYouTube",
  filename: "src/lib/youtube.functions.ts"
}, (opts) => regenerateCourseFromYouTube.__executeServer(opts));
const regenerateCourseFromYouTube = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  courseId: stringType().uuid(),
  withTranscript: booleanType().default(true)
}).parse(d)).handler(regenerateCourseFromYouTube_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY is not configured.");
  const {
    data: course,
    error: cErr
  } = await supabase.from("courses").select("id, title").eq("id", data.courseId).single();
  if (cErr || !course) throw new Error("Course not found.");
  return {
    ok: true,
    ranBy: userId,
    courseId: data.courseId,
    courseTitle: course.title
  };
});
export {
  cancelEnrichmentRun_createServerFn_handler,
  getEnrichmentRun_createServerFn_handler,
  listAllEnrichmentRuns_createServerFn_handler,
  listCourseEnrichmentRuns_createServerFn_handler,
  regenerateCourseFromYouTube_createServerFn_handler,
  startCourseEnrichment_createServerFn_handler,
  verifyYoutubeKey_createServerFn_handler
};
