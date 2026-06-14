import { c as createServerRpc } from "./createServerRpc-0AUf3IhG.mjs";
import { b as createServerFn } from "./server-BLOOEPZP.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BVm8xUae.mjs";
import { c as callUserAiChat } from "./user-ai-C_P4MEwi.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, n as numberType, e as enumType, b as booleanType, c as anyType } from "../_libs/zod.mjs";
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
const Input = objectType({
  topic: stringType().min(2).max(300),
  level: enumType(["Beginner", "Intermediate", "Advanced"]).default("Beginner"),
  audience: stringType().max(300).optional(),
  modules: numberType().int().min(2).max(8).default(4),
  category: stringType().max(100).default("General")
});
const SYS = `You are Learnify AI — a senior curriculum designer. Design rigorous, hands-on courses with real-world examples and projects. Be specific, technical, and modern (2025-2026 best practices). Never include filler.`;
function schemaHint(n) {
  return `{
  "title": string (max 80),
  "description": string (max 400),
  "category": string,
  "level": "Beginner"|"Intermediate"|"Advanced",
  "modules": [ // exactly ${n} modules
    {
      "title": string,
      "description": string,
      "chapters": [ // 3-5 chapters
        {
          "title": string,
          "summary": string (2-4 sentences),
          "real_world_example": string (1 short paragraph),
          "code_snippet": string|null (short, optional),
          "youtube_query": string (3-7 words, specific search query to find a high-quality tutorial video on YouTube for this chapter)
        }
      ],
      "project": { "title": string, "prompt": string (3-6 sentences with deliverables), "starter_code": string|null },
      "assignments": [ { "title": string, "prompt": string } ] // 1-2 assignments
    }
  ],
  "mcqs": [ // 8-12 final-test questions
    { "question": string, "options": [string,string,string,string], "answer": 0|1|2|3, "explanation": string }
  ]
}`;
}
const generateFullCourse_createServerFn_handler = createServerRpc({
  id: "0fe497f84feaa9c26289e06c5d010fd10007bd792c5b4f317356ad7ef5df9201",
  name: "generateFullCourse",
  filename: "src/lib/course-builder.functions.ts"
}, (opts) => generateFullCourse.__executeServer(opts));
const generateFullCourse = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => Input.parse(d)).handler(generateFullCourse_createServerFn_handler, async ({
  data
}) => {
  const prompt = `Build a complete ${data.level} course on "${data.topic}".
Target audience: ${data.audience || "self-taught learners"}.
Category: ${data.category}.
Exactly ${data.modules} modules. Each module has 3-5 chapters with a real-world example and optional code snippet, one practical project with clear deliverables, and 1-2 small assignments.
End with 8-12 MCQ final-test questions covering the whole course.
Respond ONLY with valid minified JSON matching this schema (no prose, no markdown, no code fences):
${schemaHint(data.modules)}`;
  const res = await callUserAiChat({
    messages: [{
      role: "system",
      content: SYS
    }, {
      role: "user",
      content: prompt
    }],
    response_format: {
      type: "json_object"
    }
  }, "pro");
  if (res.status === 429) throw new Error("Rate limit — try again shortly.");
  if (res.status === 402) throw new Error("AI credits exhausted.");
  if (!res.ok) throw new Error(`AI provider error (${res.status})`);
  const payload = await res.json();
  const content = payload.choices?.[0]?.message?.content ?? "";
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    const m = content.match(/\{[\s\S]*\}/);
    if (!m) throw new Error("AI returned invalid JSON");
    parsed = JSON.parse(m[0]);
  }
  const ytKey = process.env.YOUTUBE_API_KEY;
  const ytWarnings = [];
  let quotaBlocked = false;
  if (ytKey && Array.isArray(parsed.modules)) {
    outer: for (const mod of parsed.modules) {
      for (const ch of mod.chapters ?? []) {
        if (quotaBlocked) break outer;
        const q = (ch.youtube_query || `${ch.title} ${data.topic} tutorial`).trim();
        try {
          const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&videoEmbeddable=true&relevanceLanguage=en&safeSearch=strict&q=${encodeURIComponent(q)}&key=${ytKey}`;
          const r = await fetch(url);
          const j = await r.json().catch(() => ({}));
          if (!r.ok) {
            const reason = j?.error?.errors?.[0]?.reason;
            if (r.status === 403 && (reason === "quotaExceeded" || reason === "rateLimitExceeded")) {
              ytWarnings.push("YouTube quota/rate limit reached — remaining chapters skipped.");
              quotaBlocked = true;
              break outer;
            }
            if (r.status === 400 && reason === "keyInvalid") {
              ytWarnings.push("YouTube API key is invalid — videos not attached.");
              quotaBlocked = true;
              break outer;
            }
            continue;
          }
          const item = j.items?.[0];
          const vid = item?.id?.videoId;
          if (vid) {
            ch.video_url = `https://www.youtube.com/watch?v=${vid}`;
            ch.video_title = item.snippet?.title ?? null;
            ch.video_channel = item.snippet?.channelTitle ?? null;
          }
        } catch {
        }
      }
    }
  } else if (!ytKey) {
    ytWarnings.push("YOUTUBE_API_KEY not configured — videos were not attached.");
  }
  return {
    course: parsed,
    youtube_warnings: ytWarnings
  };
});
const Materialize = objectType({
  blueprint: anyType(),
  price_inr: numberType().min(0).default(0),
  instructor: stringType().max(120).default("Learnify AI"),
  published: booleanType().default(false)
});
const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
const materializeCourse_createServerFn_handler = createServerRpc({
  id: "53f06c97cbe7e94e3c1ce694ee7711927e617b2e4f4daa837d1aed57029f5e43",
  name: "materializeCourse",
  filename: "src/lib/course-builder.functions.ts"
}, (opts) => materializeCourse.__executeServer(opts));
const materializeCourse = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => Materialize.parse(d)).handler(materializeCourse_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const bp = data.blueprint;
  const baseSlug = slugify(bp.title || "new-course");
  const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
  const totalMins = (bp.modules ?? []).reduce((s, m) => s + (m.chapters?.length ?? 0) * 10, 0);
  const {
    data: course,
    error: cErr
  } = await supabase.from("courses").insert({
    slug,
    title: String(bp.title).slice(0, 120),
    description: String(bp.description ?? "").slice(0, 1e3),
    category: bp.category || "General",
    level: bp.level || "Beginner",
    price_inr: data.price_inr,
    instructor: data.instructor,
    duration_minutes: totalMins,
    published: data.published,
    created_by: userId
  }).select("id, slug").single();
  if (cErr) throw new Error(cErr.message);
  let lessonOrder = 0;
  let assignOrder = 0;
  const lessonRows = [];
  const assignmentRows = [];
  for (let mi = 0; mi < (bp.modules ?? []).length; mi++) {
    const m = bp.modules[mi];
    const {
      data: mod,
      error: mErr
    } = await supabase.from("course_modules").insert({
      course_id: course.id,
      title: String(m.title).slice(0, 200),
      description: String(m.description ?? "").slice(0, 600),
      order_index: mi
    }).select("id").single();
    if (mErr) throw new Error(mErr.message);
    for (const ch of m.chapters ?? []) {
      const md = `## ${ch.title}

${ch.summary}

### Real-world example
${ch.real_world_example}
${ch.code_snippet ? `
\`\`\`
${ch.code_snippet}
\`\`\`
` : ""}${ch.video_url ? `
### Recommended video
[${ch.video_title ?? "Watch on YouTube"}${ch.video_channel ? ` — ${ch.video_channel}` : ""}](${ch.video_url})
` : ""}`;
      lessonRows.push({
        course_id: course.id,
        module_id: mod.id,
        title: String(ch.title).slice(0, 200),
        description: String(ch.summary ?? "").slice(0, 500),
        content_md: md,
        video_url: ch.video_url ?? null,
        duration_minutes: 10,
        order_index: lessonOrder++,
        is_preview: lessonOrder === 1
      });
    }
    if (m.project) {
      assignmentRows.push({
        course_id: course.id,
        title: `Project: ${String(m.project.title).slice(0, 180)}`,
        prompt: String(m.project.prompt ?? "").slice(0, 4e3),
        starter_code: m.project.starter_code ?? null,
        order_index: assignOrder++
      });
    }
    for (const a of m.assignments ?? []) {
      assignmentRows.push({
        course_id: course.id,
        title: String(a.title).slice(0, 180),
        prompt: String(a.prompt ?? "").slice(0, 4e3),
        order_index: assignOrder++
      });
    }
  }
  if (lessonRows.length) {
    const {
      error
    } = await supabase.from("lessons").insert(lessonRows);
    if (error) throw new Error(error.message);
  }
  if (assignmentRows.length) {
    const {
      error
    } = await supabase.from("course_assignments").insert(assignmentRows);
    if (error) throw new Error(error.message);
  }
  if (Array.isArray(bp.mcqs) && bp.mcqs.length) {
    const mcqRows = bp.mcqs.slice(0, 30).map((q, i) => ({
      course_id: course.id,
      question: String(q.question).slice(0, 1e3),
      options: q.options,
      answer: Number(q.answer),
      explanation: q.explanation ?? null,
      order_index: i
    }));
    const {
      error
    } = await supabase.from("mcq_questions").insert(mcqRows);
    if (error) throw new Error(error.message);
  }
  return {
    ok: true,
    slug: course.slug,
    course_id: course.id
  };
});
export {
  generateFullCourse_createServerFn_handler,
  materializeCourse_createServerFn_handler
};
