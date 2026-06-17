import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { callUserAiChat } from "@/lib/user-ai";
import { z } from "zod";

const Input = z.object({
  topic: z.string().min(2).max(300),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]).default("Beginner"),
  audience: z.string().max(300).optional(),
  modules: z.number().int().min(2).max(8).default(4),
  category: z.string().max(100).default("General"),
});

const SYS = `You are Learnify AI — a senior curriculum designer. Design rigorous, hands-on courses with real-world examples and projects. Be specific, technical, and modern (2025-2026 best practices). Never include filler.`;

function schemaHint(n: number) {
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

export const generateFullCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const prompt = `Build a complete ${data.level} course on "${data.topic}".
Target audience: ${data.audience || "self-taught learners"}.
Category: ${data.category}.
Exactly ${data.modules} modules. Each module has 3-5 chapters with a real-world example and optional code snippet, one practical project with clear deliverables, and 1-2 small assignments.
End with 8-12 MCQ final-test questions covering the whole course.
Respond ONLY with valid minified JSON matching this schema (no prose, no markdown, no code fences):
${schemaHint(data.modules)}`;

    const res = await callUserAiChat(
      {
        messages: [
          { role: "system", content: SYS },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      },
      "pro",
    );
    if (res.status === 429) throw new Error("Rate limit — try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted.");
    if (!res.ok) throw new Error(`AI provider error (${res.status})`);

    const payload = await res.json();
    const content: string = payload.choices?.[0]?.message?.content ?? "";
    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("AI returned invalid JSON");
      parsed = JSON.parse(m[0]);
    }

    // Enrich chapters with real YouTube videos (best-effort; non-fatal)
    const ytKey = process.env.YOUTUBE_API_KEY;
    const ytWarnings: string[] = [];
    let quotaBlocked = false;
    if (ytKey && Array.isArray(parsed.modules)) {
      const foundVideoIds: string[] = [];
      const chMap = new Map<string, any>();

      outer: for (const mod of parsed.modules) {
        for (const ch of mod.chapters ?? []) {
          if (quotaBlocked) break outer;
          // Prioritize Hindi/English and filter by educational category to prevent songs
          const q = (ch.youtube_query || `${ch.title} ${data.topic} tutorial`).trim() + " in Hindi or English";
          try {
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=27&maxResults=1&videoEmbeddable=true&safeSearch=strict&q=${encodeURIComponent(q)}&key=${ytKey}`;
            const r = await fetch(url);
            const j: any = await r.json().catch(() => ({}));
            if (!r.ok) {
              const reason = j?.error?.errors?.[0]?.reason as string | undefined;
              if (
                r.status === 403 &&
                (reason === "quotaExceeded" || reason === "rateLimitExceeded")
              ) {
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
              foundVideoIds.push(vid);
              chMap.set(vid, ch);
              ch.video_url = `https://www.youtube.com/watch?v=${vid}`;
              ch.video_title = item.snippet?.title ?? null;
              ch.video_channel = item.snippet?.channelTitle ?? null;
              ch.video_channel_id = item.snippet?.channelId ?? null;
            }
          } catch {
            // ignore individual chapter failures
          }
        }
      }

      // Batch fetch exact duration
      if (foundVideoIds.length > 0) {
        try {
          const vUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${foundVideoIds.join(",")}&key=${ytKey}`;
          const vr = await fetch(vUrl);
          if (vr.ok) {
            const vj: any = await vr.json();
            for (const item of vj.items ?? []) {
              const ch = chMap.get(item.id);
              if (ch && item.contentDetails?.duration) {
                const match = item.contentDetails.duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
                if (match) {
                  const h = parseInt(match[1]) || 0;
                  const m = parseInt(match[2]) || 0;
                  const s = parseInt(match[3]) || 0;
                  ch.duration_minutes = Math.max(1, Math.ceil(h * 60 + m + s / 60));
                }
              }
            }
          }
        } catch {
          // ignore duration fetch failures
        }
      }
    } else if (!ytKey) {
      ytWarnings.push("YOUTUBE_API_KEY not configured — videos were not attached.");
    }

    return { course: parsed, youtube_warnings: ytWarnings };
  });

/* ----- Materialize: insert course + modules + lessons + assignments + mcqs ----- */
const Materialize = z.object({
  blueprint: z.any(),
  price_inr: z.number().min(0).default(0),
  instructor: z.string().max(120).default("Learnify AI"),
  published: z.boolean().default(false),
});

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

export const materializeCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => Materialize.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const bp = data.blueprint;
    const baseSlug = slugify(bp.title || "new-course");
    const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;

    const totalMins = (bp.modules ?? []).reduce(
      (s: number, m: any) =>
        s + (m.chapters ?? []).reduce((cs: number, c: any) => cs + (c.duration_minutes || 10), 0),
      0,
    );

    const { data: course, error: cErr } = await supabase
      .from("courses")
      .insert({
        slug,
        title: String(bp.title).slice(0, 120),
        description: String(bp.description ?? "").slice(0, 1000),
        category: bp.category || "General",
        level: bp.level || "Beginner",
        price_inr: data.price_inr,
        instructor: data.instructor,
        duration_minutes: totalMins,
        published: data.published,
        created_by: userId,
      })
      .select("id, slug")
      .single();
    if (cErr) throw new Error(cErr.message);

    let lessonOrder = 0;
    let assignOrder = 0;
    const lessonRows: any[] = [];
    const assignmentRows: any[] = [];

    for (let mi = 0; mi < (bp.modules ?? []).length; mi++) {
      const m = bp.modules[mi];
      const { data: mod, error: mErr } = await supabase
        .from("course_modules")
        .insert({
          course_id: course.id,
          title: String(m.title).slice(0, 200),
          description: String(m.description ?? "").slice(0, 600),
          order_index: mi,
        })
        .select("id")
        .single();
      if (mErr) throw new Error(mErr.message);

      for (const ch of m.chapters ?? []) {
        const md = `## ${ch.title}\n\n${ch.summary}\n\n### Real-world example\n${ch.real_world_example}\n${
          ch.code_snippet ? `\n\`\`\`\n${ch.code_snippet}\n\`\`\`\n` : ""
        }${ch.video_url ? `\n### Recommended video\n[${ch.video_title ?? "Watch on YouTube"}${ch.video_channel ? ` — ${ch.video_channel}` : ""}](${ch.video_url})\n` : ""}`;
        lessonRows.push({
          course_id: course.id,
          module_id: mod.id,
          title: String(ch.title).slice(0, 200),
          description: String(ch.summary ?? "").slice(0, 500),
          content_md: md,
          video_url: ch.video_url ?? null,
          video_channel_id: ch.video_channel_id ?? null,
          duration_minutes: ch.duration_minutes || 10,
          order_index: lessonOrder++,
          is_preview: lessonOrder === 1,
        });
      }

      if (m.project) {
        assignmentRows.push({
          course_id: course.id,
          title: `Project: ${String(m.project.title).slice(0, 180)}`,
          prompt: String(m.project.prompt ?? "").slice(0, 4000),
          starter_code: m.project.starter_code ?? null,
          order_index: assignOrder++,
        });
      }
      for (const a of m.assignments ?? []) {
        assignmentRows.push({
          course_id: course.id,
          title: String(a.title).slice(0, 180),
          prompt: String(a.prompt ?? "").slice(0, 4000),
          order_index: assignOrder++,
        });
      }
    }
    if (lessonRows.length) {
      const { error } = await supabase.from("lessons").insert(lessonRows);
      if (error) throw new Error(error.message);
    }
    if (assignmentRows.length) {
      const { error } = await supabase.from("course_assignments").insert(assignmentRows);
      if (error) throw new Error(error.message);
    }
    if (Array.isArray(bp.mcqs) && bp.mcqs.length) {
      const mcqRows = bp.mcqs.slice(0, 30).map((q: any, i: number) => ({
        course_id: course.id,
        question: String(q.question).slice(0, 1000),
        options: q.options,
        answer: Number(q.answer),
        explanation: q.explanation ?? null,
        order_index: i,
      }));
      const { error } = await supabase.from("mcq_questions").insert(mcqRows);
      if (error) throw new Error(error.message);
    }
    return { ok: true, slug: course.slug, course_id: course.id };
  });
