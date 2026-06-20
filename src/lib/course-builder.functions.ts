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
          const q =
            (ch.youtube_query || `${ch.title} ${data.topic} tutorial`).trim() +
            " in Hindi or English";
          try {
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=27&maxResults=3&videoEmbeddable=true&safeSearch=strict&q=${encodeURIComponent(q)}&key=${ytKey}`;
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
            // Filter out music/meme videos from results
            const pick =
              (j.items ?? []).find((item: any) => {
                const t = (item.snippet?.title ?? "").toLowerCase();
                if (
                  t.includes("never gonna give") ||
                  t.includes("rick ast") ||
                  t.includes("music video") ||
                  t.includes("official video") ||
                  t.includes("song") ||
                  t.includes("ft.") ||
                  t.includes("lyric")
                )
                  return false;
                const ch = (item.snippet?.channelTitle ?? "").toLowerCase();
                if (ch.includes("vevo") || ch.includes("music")) return false;
                return true;
              }) ?? j.items?.[0];
            const vid = pick?.id?.videoId;
            if (vid) {
              foundVideoIds.push(vid);
              chMap.set(vid, ch);
              ch.video_url = `https://www.youtube.com/watch?v=${vid}`;
              ch.video_title = pick?.snippet?.title ?? null;
              ch.video_channel = pick?.snippet?.channelTitle ?? null;
              ch.video_channel_id = pick?.snippet?.channelId ?? null;
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

/* ----- Auto-Complete: fill missing videos, content, MCQs, assignments, projects ----- */

const AutoCompleteSchema = z.object({ courseId: z.string().uuid() });

export const autoCompleteCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => AutoCompleteSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin ?? supabase;

    const apiKey = process.env.YOUTUBE_API_KEY;
    const aiConfigured = Boolean(
      process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY,
    );
    if (!aiConfigured)
      throw new Error("No AI provider configured (Gemini, Groq, or OpenRouter key required).");

    // 1. Fetch course
    const { data: course, error: cErr } = await db
      .from("courses")
      .select("id, title, description, category, level, cover_url")
      .eq("id", data.courseId)
      .single();
    if (cErr || !course) throw new Error("Course not found.");

    // 2. Fetch existing lessons, MCQs, assignments
    const [{ data: lessons }, { data: mcqCount }, { data: assignCount }] = await Promise.all([
      supabase
        .from("lessons")
        .select("id, title, description, content_md, video_url, order_index")
        .eq("course_id", data.courseId)
        .order("order_index"),
      supabase
        .from("mcq_questions")
        .select("id", { count: "exact", head: true })
        .eq("course_id", data.courseId),
      supabase
        .from("course_assignments")
        .select("id", { count: "exact", head: true })
        .eq("course_id", data.courseId),
    ]);

    const stats = {
      videosAdded: 0,
      transcriptsAdded: 0,
      mcqsAdded: 0,
      assignmentsAdded: 0,
      projectsAdded: 0,
      thumbnailGenerated: false,
      warnings: [] as string[],
    };

    // 3. Enrichment: videos + transcripts + summaries
    if (lessons?.length) {
      const { ytSearchTopVideo, fetchTranscriptRaw } = await import("./youtube.functions");
      for (const lesson of lessons) {
        try {
          if (!apiKey) {
            stats.warnings.push("YOUTUBE_API_KEY not set — skipping video search.");
            break;
          }
          const hit = await ytSearchTopVideo(
            `${lesson.title} ${(course as any).title} tutorial`.trim(),
            apiKey,
          );
          if (!hit) {
            stats.warnings.push(`No YouTube result for "${lesson.title}".`);
            continue;
          }
          const videoUrl = `https://www.youtube.com/watch?v=${hit.videoId}`;
          let newContent = lesson.content_md ?? "";
          let transcript = "";

          // Only fetch transcript if content is minimal (no lesson content yet)
          const needsContent = !lesson.content_md || lesson.content_md.length < 100;
          if (needsContent) {
            transcript = (await fetchTranscriptRaw(hit.videoId)) ?? "";
            if (transcript && transcript.length > 50) {
              const summary = await callUserAiChat({
                messages: [
                  {
                    role: "system",
                    content:
                      "You write concise, technically accurate chapter notes from raw video transcripts. Output clean markdown only.",
                  },
                  {
                    role: "user",
                    content: `Chapter title: "${lesson.title}".\nFrom the transcript below, produce:\n- 4-8 bullet "Key takeaways"\n- "Detailed notes" (3-6 short paragraphs)\n- "Glossary" of 3-6 important terms with one-line definitions.\nDo not invent facts not present in the transcript.\n\nTRANSCRIPT:\n${transcript.slice(0, 15_000)}`,
                  },
                ],
              });
              if (summary.ok) {
                const j: any = await summary.json();
                const summaryMd = (j.choices?.[0]?.message?.content as string) ?? "";
                if (summaryMd) {
                  newContent = `## ${lesson.title}\n\n${lesson.description ?? ""}\n\n### Recommended video\n[${hit.title} — ${hit.channelTitle}](${videoUrl})\n\n${summaryMd}\n`;
                  stats.transcriptsAdded++;
                }
              }
            }
          }

          if (!newContent.includes(videoUrl)) {
            newContent = `${newContent}\n\n### Recommended video\n[${hit.title} — ${hit.channelTitle}](${videoUrl})\n`;
          }

          await supabaseAdmin
            .from("lessons")
            .update({ video_url: videoUrl, content_md: newContent })
            .eq("id", lesson.id);
          stats.videosAdded++;
        } catch (e: any) {
          stats.warnings.push(`${lesson.title}: ${e?.message ?? "error"}`);
        }
      }
    }

    // 4. Generate MCQs if none exist
    if (!mcqCount || mcqCount.length < 5) {
      try {
        const res = await callUserAiChat({
          messages: [
            {
              role: "system",
              content:
                "You are a senior technical educator. Generate high-quality multiple-choice questions.",
            },
            {
              role: "user",
              content: `Generate 8 multiple-choice quiz questions for a "${(course as any).level}" course on "${(course as any).title}": "${(course as any).description}". Each question must have exactly 4 distinct options, one correct answer (0-indexed), and a short explanation. Respond with ONLY valid minified JSON matching this schema: {"questions":[{"question":string,"options":[string,string,string,string],"answer":0|1|2|3,"explanation":string}]}`,
            },
          ],
          response_format: { type: "json_object" },
        });
        if (res.ok) {
          const j: any = await res.json();
          const raw = j.choices?.[0]?.message?.content ?? "{}";
          const parsed = JSON.parse(raw);
          const rows = (parsed.questions ?? []).slice(0, 30).map((q: any, i: number) => ({
            course_id: data.courseId,
            question: String(q.question).slice(0, 1000),
            options: q.options,
            answer: Number(q.answer),
            explanation: q.explanation ?? null,
            order_index: i,
          }));
          if (rows.length) {
            await supabaseAdmin.from("mcq_questions").insert(rows);
            stats.mcqsAdded = rows.length;
          }
        }
      } catch (e: any) {
        stats.warnings.push(`MCQ generation: ${e?.message ?? "error"}`);
      }
    }

    // 5. Generate assignments if none exist
    if (!assignCount || assignCount.length < 2) {
      try {
        const res = await callUserAiChat({
          messages: [
            {
              role: "system",
              content:
                "You are a senior technical educator creating practical, hands-on assignments.",
            },
            {
              role: "user",
              content: `Create 2 practical assignments and 1 mini-project for a "${(course as any).level}" course on "${(course as any).title}": "${(course as any).description}". Each assignment needs a title and a detailed prompt (3-6 sentences with deliverables). The project should have a title, a detailed prompt, and optional starter code. Respond with ONLY valid minified JSON matching this schema: {"assignments":[{"title":string,"prompt":string}],"project":{"title":string,"prompt":string}}`,
            },
          ],
          response_format: { type: "json_object" },
        });
        if (res.ok) {
          const j: any = await res.json();
          const raw = j.choices?.[0]?.message?.content ?? "{}";
          const parsed = JSON.parse(raw);
          let orderIndex = 0;
          const rows: any[] = [];
          if (parsed.project?.title) {
            rows.push({
              course_id: data.courseId,
              title: `Project: ${String(parsed.project.title).slice(0, 180)}`,
              prompt: String(parsed.project.prompt ?? "").slice(0, 4000),
              order_index: orderIndex++,
            });
            stats.projectsAdded++;
          }
          for (const a of parsed.assignments ?? []) {
            rows.push({
              course_id: data.courseId,
              title: String(a.title).slice(0, 180),
              prompt: String(a.prompt ?? "").slice(0, 4000),
              order_index: orderIndex++,
            });
            stats.assignmentsAdded++;
          }
          if (rows.length) {
            await supabaseAdmin.from("course_assignments").insert(rows);
          }
        }
      } catch (e: any) {
        stats.warnings.push(`Assignment generation: ${e?.message ?? "error"}`);
      }
    }

    // 6. Generate thumbnail if none exists
    if (!(course as any).cover_url) {
      try {
        const { generateCourseThumbnail, buildThumbnailPrompt } =
          await import("./thumbnail.functions");
        const c = course as any;
        const prompt = buildThumbnailPrompt({
          title: c.title,
          category: c.category,
          description: c.description,
          style: "modern",
          colors: "deep indigo to blue gradient",
          customNotes: "",
          lessonHint: (lessons ?? [])
            .slice(0, 3)
            .map((l: any) => l.title)
            .join(", "),
        });
        const { dataUrl } = await generateCourseThumbnail({ data: { prompt, size: "1536x1024" } });
        await supabaseAdmin.from("courses").update({ cover_url: dataUrl }).eq("id", data.courseId);
        stats.thumbnailGenerated = true;
      } catch (e: any) {
        stats.warnings.push(`Thumbnail generation: ${e?.message ?? "error"}`);
      }
    }

    return {
      ok: true,
      courseTitle: (course as any).title,
      stats,
    };
  });

export const generateLessonNotes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        title: z.string().min(1).max(300),
        courseTitle: z.string().min(1).max(300),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const prompt = `Write a detailed, structured, educational note/description (max 500 characters) for a lesson titled "${data.title}" inside a course named "${data.courseTitle}". Explain the core concept, key takeaways, and a quick summary. Output clean, concise text (markdown allowed but short).`;
    const res = await callUserAiChat({
      messages: [
        { role: "system", content: "You are an expert curriculum assistant." },
        { role: "user", content: prompt },
      ],
    });
    if (!res.ok) throw new Error("AI failed to generate notes");
    const j: any = await res.json();
    const content = j.choices?.[0]?.message?.content ?? "";
    return { notes: content };
  });
