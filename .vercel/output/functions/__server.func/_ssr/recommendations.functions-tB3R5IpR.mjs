import { c as createServerRpc } from "./createServerRpc-0AUf3IhG.mjs";
import { b as createServerFn } from "./server-BLOOEPZP.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BVm8xUae.mjs";
import { c as callUserAiChat } from "./user-ai-C_P4MEwi.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
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
const getRecommendedCourses_createServerFn_handler = createServerRpc({
  id: "a7c24171bf57ffee1da0697bb684003a49aeebe73f78cd1b93f8840650b57cbb",
  name: "getRecommendedCourses",
  filename: "src/lib/recommendations.functions.ts"
}, (opts) => getRecommendedCourses.__executeServer(opts));
const getRecommendedCourses = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getRecommendedCourses_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const [enrollRes, allCoursesRes] = await Promise.all([supabase.from("enrollments").select("course_id, progress_pct, status, last_activity_at, courses:course_id(category, level)").eq("user_id", userId), supabase.from("courses").select("id, slug, title, category, level, cover_url, instructor, price_inr, published").eq("published", true).limit(200)]);
  const enrolled = enrollRes.data ?? [];
  const enrolledIds = new Set(enrolled.map((e) => e.course_id));
  const all = (allCoursesRes.data ?? []).filter((c) => !enrolledIds.has(c.id));
  const categoryScore = /* @__PURE__ */ new Map();
  const levelScore = /* @__PURE__ */ new Map();
  for (const e of enrolled) {
    const cat = e.courses?.category;
    const lvl = e.courses?.level;
    const w = 1 + Number(e.progress_pct ?? 0) / 100;
    if (cat) categoryScore.set(cat, (categoryScore.get(cat) ?? 0) + w);
    if (lvl) levelScore.set(lvl, (levelScore.get(lvl) ?? 0) + w);
  }
  const ranked = all.map((c) => {
    const cScore = categoryScore.get(c.category) ?? 0;
    const lScore = levelScore.get(c.level) ?? 0;
    const novelty = enrolled.length === 0 ? 0.5 : 0;
    const score = cScore * 2 + lScore + novelty;
    let reason = "Popular pick for new learners";
    if (cScore > 0 && lScore > 0) reason = `Matches your interest in ${c.category} at ${c.level} level`;
    else if (cScore > 0) reason = `Continues your ${c.category} journey`;
    else if (lScore > 0) reason = `Suits your ${c.level} pace`;
    return {
      ...c,
      score,
      reason
    };
  }).sort((a, b) => b.score - a.score).slice(0, 6);
  let summary = enrolled.length ? `Based on ${enrolled.length} enrollment${enrolled.length === 1 ? "" : "s"}, here are courses to deepen your skills.` : "Hand-picked courses to get you started.";
  try {
    if (ranked.length) {
      const ctx = enrolled.map((e) => `- ${e.courses?.category ?? "?"} / ${e.courses?.level ?? "?"} (${e.progress_pct}%)`).slice(0, 6).join("\n");
      const top = ranked.map((r) => `- ${r.title} [${r.category}/${r.level}]`).join("\n");
      const res = await callUserAiChat({
        messages: [{
          role: "system",
          content: "You write a single-sentence, friendly, specific recommendation summary (max 22 words). No emojis, no preamble."
        }, {
          role: "user",
          content: `Learner activity:
${ctx || "(no prior activity)"}

Top matches:
${top}

Write one sentence.`
        }],
        temperature: 0.6
      });
      if (res.ok) {
        const j = await res.json();
        const text = j?.choices?.[0]?.message?.content?.trim();
        if (text) summary = text;
      }
    }
  } catch {
  }
  return {
    items: ranked,
    summary
  };
});
export {
  getRecommendedCourses_createServerFn_handler
};
