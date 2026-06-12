import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { callUserAiChat } from "@/lib/user-ai";

type RecCourse = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  level: string | null;
  cover_url: string | null;
  instructor: string | null;
  reason: string;
  score: number;
};

/**
 * Recommend the next best courses for the signed-in learner.
 * Heuristic ranking from behavior (categories enrolled, completion rate, recency)
 * then optionally re-ranked / re-explained with the configured AI APIs.
 */
export const getRecommendedCourses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ items: RecCourse[]; summary: string }> => {
    const { supabase, userId } = context;

    const [enrollRes, allCoursesRes] = await Promise.all([
      supabase
        .from("enrollments")
        .select(
          "course_id, progress_pct, status, last_activity_at, courses:course_id(category, level)",
        )
        .eq("user_id", userId),
      supabase
        .from("courses")
        .select("id, slug, title, category, level, cover_url, instructor, price_inr, published")
        .eq("published", true)
        .limit(200),
    ]);

    const enrolled = enrollRes.data ?? [];
    const enrolledIds = new Set(enrolled.map((e: any) => e.course_id));
    const all = (allCoursesRes.data ?? []).filter((c: any) => !enrolledIds.has(c.id));

    // Build interest signal
    const categoryScore = new Map<string, number>();
    const levelScore = new Map<string, number>();
    for (const e of enrolled as any[]) {
      const cat = e.courses?.category;
      const lvl = e.courses?.level;
      const w = 1 + Number(e.progress_pct ?? 0) / 100; // engaged > started
      if (cat) categoryScore.set(cat, (categoryScore.get(cat) ?? 0) + w);
      if (lvl) levelScore.set(lvl, (levelScore.get(lvl) ?? 0) + w);
    }

    const ranked = all
      .map((c: any) => {
        const cScore = categoryScore.get(c.category) ?? 0;
        const lScore = levelScore.get(c.level) ?? 0;
        const novelty = enrolled.length === 0 ? 0.5 : 0;
        const score = cScore * 2 + lScore + novelty;
        let reason = "Popular pick for new learners";
        if (cScore > 0 && lScore > 0)
          reason = `Matches your interest in ${c.category} at ${c.level} level`;
        else if (cScore > 0) reason = `Continues your ${c.category} journey`;
        else if (lScore > 0) reason = `Suits your ${c.level} pace`;
        return { ...c, score, reason } as RecCourse & { price_inr?: number };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    // Soft AI summary (best-effort; never block on it)
    let summary = enrolled.length
      ? `Based on ${enrolled.length} enrollment${enrolled.length === 1 ? "" : "s"}, here are courses to deepen your skills.`
      : "Hand-picked courses to get you started.";

    try {
      if (ranked.length) {
        const ctx = (enrolled as any[])
          .map(
            (e) =>
              `- ${e.courses?.category ?? "?"} / ${e.courses?.level ?? "?"} (${e.progress_pct}%)`,
          )
          .slice(0, 6)
          .join("\n");
        const top = ranked.map((r) => `- ${r.title} [${r.category}/${r.level}]`).join("\n");
        const res = await callUserAiChat({
          messages: [
            {
              role: "system",
              content:
                "You write a single-sentence, friendly, specific recommendation summary (max 22 words). No emojis, no preamble.",
            },
            {
              role: "user",
              content: `Learner activity:\n${ctx || "(no prior activity)"}\n\nTop matches:\n${top}\n\nWrite one sentence.`,
            },
          ],
          temperature: 0.6,
        });
        if (res.ok) {
          const j: any = await res.json();
          const text = j?.choices?.[0]?.message?.content?.trim();
          if (text) summary = text;
        }
      }
    } catch {
      /* keep heuristic summary */
    }

    return { items: ranked, summary };
  });
