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
function bucketDay(d) {
  return d.toISOString().slice(0, 10);
}
const getDemandForecast_createServerFn_handler = createServerRpc({
  id: "7b5e03bcc1a55c5b8bb598a5c6532a41d70167cde51cd5e8e78b48542eed3214",
  name: "getDemandForecast",
  filename: "src/lib/forecast.functions.ts"
}, (opts) => getDemandForecast.__executeServer(opts));
const getDemandForecast = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getDemandForecast_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase
  } = context;
  const {
    supabaseAdmin
  } = await import("./client.server-BbcUHF3e.mjs");
  const {
    data: caller
  } = await supabase.auth.getUser();
  const uid = caller.user?.id;
  let isAdmin = false;
  if (uid) {
    const r = await supabaseAdmin.rpc("has_role", {
      _user_id: uid,
      _role: "admin"
    });
    isAdmin = !!r.data;
    if (!isAdmin) {
      const sr = await supabaseAdmin.rpc("has_role", {
        _user_id: uid,
        _role: "super_admin"
      });
      isAdmin = !!sr.data;
    }
  }
  if (!isAdmin) throw new Error("Admin only");
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3).toISOString();
  const {
    data: enrolls
  } = await supabaseAdmin.from("enrollments").select("course_id, created_at, courses:course_id(category)").gte("created_at", since).limit(5e3);
  const rows = enrolls ?? [];
  const days = [];
  const counts = /* @__PURE__ */ new Map();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1e3);
    const k = bucketDay(d);
    counts.set(k, 0);
    days.push({
      date: k,
      enrollments: 0
    });
  }
  for (const r of rows) {
    const k = bucketDay(new Date(r.created_at));
    if (counts.has(k)) counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  for (const p of days) p.enrollments = counts.get(p.date) ?? 0;
  const totalLast30 = days.reduce((s, d) => s + d.enrollments, 0);
  const last7 = days.slice(-7).reduce((s, d) => s + d.enrollments, 0);
  const prev7 = days.slice(-14, -7).reduce((s, d) => s + d.enrollments, 0);
  const series = days.slice(-14).map((d, i) => ({
    x: i,
    y: d.enrollments
  }));
  const n = series.length;
  const sumX = series.reduce((s, p) => s + p.x, 0);
  const sumY = series.reduce((s, p) => s + p.y, 0);
  const sumXY = series.reduce((s, p) => s + p.x * p.y, 0);
  const sumXX = series.reduce((s, p) => s + p.x * p.x, 0);
  const denom = n * sumXX - sumX * sumX || 1;
  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  let next7Forecast = 0;
  for (let i = n; i < n + 7; i++) next7Forecast += Math.max(0, slope * i + intercept);
  next7Forecast = Math.round(next7Forecast);
  const byCat = /* @__PURE__ */ new Map();
  const cutoff7 = Date.now() - 7 * 24 * 60 * 60 * 1e3;
  const cutoff14 = Date.now() - 14 * 24 * 60 * 60 * 1e3;
  for (const r of rows) {
    const cat = r.courses?.category ?? "Uncategorized";
    const t = new Date(r.created_at).getTime();
    const e = byCat.get(cat) ?? {
      last7: 0,
      prev7: 0
    };
    if (t >= cutoff7) e.last7 += 1;
    else if (t >= cutoff14) e.prev7 += 1;
    byCat.set(cat, e);
  }
  const byCategory = Array.from(byCat.entries()).map(([category, v]) => {
    const trendPct2 = v.prev7 === 0 ? v.last7 > 0 ? 100 : 0 : Math.round((v.last7 - v.prev7) / v.prev7 * 100);
    const fc = Math.max(0, Math.round(v.last7 + (v.last7 - v.prev7)));
    let workload = "Low";
    if (fc >= 50 || trendPct2 >= 100) workload = "Surging";
    else if (fc >= 20 || trendPct2 >= 30) workload = "High";
    else if (fc >= 5) workload = "Moderate";
    return {
      category,
      last7: v.last7,
      next7Forecast: fc,
      trendPct: trendPct2,
      workload
    };
  }).sort((a, b) => b.next7Forecast - a.next7Forecast).slice(0, 8);
  const trendPct = prev7 === 0 ? last7 > 0 ? 100 : 0 : Math.round((last7 - prev7) / prev7 * 100);
  let insight = `Next 7 days: ~${next7Forecast} enrollments expected (${trendPct >= 0 ? "+" : ""}${trendPct}% vs prior week).`;
  const surging = byCategory.filter((c) => c.workload === "Surging" || c.workload === "High");
  if (surging.length) {
    insight += ` Plan staffing for ${surging.map((c) => c.category).join(", ")}.`;
  }
  try {
    const top = byCategory.slice(0, 5).map((c) => `${c.category}: forecast ${c.next7Forecast} (trend ${c.trendPct}%)`).join("; ");
    const res = await callUserAiChat({
      messages: [{
        role: "system",
        content: "You are an analytics co-pilot. Reply with ONE crisp sentence (max 28 words) summarizing course demand and one staffing or content recommendation. No emojis."
      }, {
        role: "user",
        content: `Last 7d: ${last7} (prev ${prev7}). Forecast next 7d: ${next7Forecast}. Categories: ${top}.`
      }],
      temperature: 0.5
    });
    if (res.ok) {
      const j = await res.json();
      const text = j?.choices?.[0]?.message?.content?.trim();
      if (text) insight = text;
    }
  } catch {
  }
  return {
    totalLast30,
    totalLast7: last7,
    next7Forecast,
    series: days,
    byCategory,
    insight
  };
});
export {
  getDemandForecast_createServerFn_handler
};
