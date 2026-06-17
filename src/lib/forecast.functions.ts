import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { callUserAiChat } from "@/lib/user-ai";

type Point = { date: string; enrollments: number };
type CategoryForecast = {
  category: string;
  last7: number;
  next7Forecast: number;
  trendPct: number;
  workload: "Low" | "Moderate" | "High" | "Surging";
};
export type DemandForecast = {
  totalLast30: number;
  totalLast7: number;
  next7Forecast: number;
  series: Point[];
  byCategory: CategoryForecast[];
  insight: string;
};

function bucketDay(d: Date) {
  return d.toISOString().slice(0, 10);
}

export const getDemandForecast = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DemandForecast> => {
    const { supabase } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Use admin client so this works regardless of caller's RLS (admin gate is enforced UI-side)
    // We still validate auth via middleware. For role check, look up via has_role.
    const uid = context.userId;
    let isAdmin = false;
    if (uid) {
      const { data: roles } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", uid);
      const roleSet = new Set((roles ?? []).map((r: any) => r.role));
      isAdmin = roleSet.has("admin") || roleSet.has("super_admin");
    }
    if (!isAdmin) throw new Error("Admin only");

    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: enrolls } = await supabaseAdmin
      .from("enrollments")
      .select("course_id, enrolled_at, courses:course_id(category)")
      .gte("enrolled_at", since)
      .limit(5000);

    const rows = (enrolls ?? []) as any[];

    // Daily series for last 30 days
    const days: Point[] = [];
    const counts = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const k = bucketDay(d);
      counts.set(k, 0);
      days.push({ date: k, enrollments: 0 });
    }
    for (const r of rows) {
      const k = bucketDay(new Date(r.enrolled_at));
      if (counts.has(k)) counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    for (const p of days) p.enrollments = counts.get(p.date) ?? 0;

    const totalLast30 = days.reduce((s, d) => s + d.enrollments, 0);
    const last7 = days.slice(-7).reduce((s, d) => s + d.enrollments, 0);
    const prev7 = days.slice(-14, -7).reduce((s, d) => s + d.enrollments, 0);

    // Simple linear regression on last 14 days → forecast next 7
    const series = days.slice(-14).map((d, i) => ({ x: i, y: d.enrollments }));
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

    // Per-category breakdown
    const byCat = new Map<string, { last7: number; prev7: number }>();
    const cutoff7 = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const cutoff14 = Date.now() - 14 * 24 * 60 * 60 * 1000;
    for (const r of rows) {
      const cat = (r.courses?.category ?? "Uncategorized") as string;
      const t = new Date(r.enrolled_at).getTime();
      const e = byCat.get(cat) ?? { last7: 0, prev7: 0 };
      if (t >= cutoff7) e.last7 += 1;
      else if (t >= cutoff14) e.prev7 += 1;
      byCat.set(cat, e);
    }
    const byCategory: CategoryForecast[] = Array.from(byCat.entries())
      .map(([category, v]) => {
        const trendPct =
          v.prev7 === 0
            ? v.last7 > 0
              ? 100
              : 0
            : Math.round(((v.last7 - v.prev7) / v.prev7) * 100);
        const fc = Math.max(0, Math.round(v.last7 + (v.last7 - v.prev7)));
        let workload: CategoryForecast["workload"] = "Low";
        if (fc >= 50 || trendPct >= 100) workload = "Surging";
        else if (fc >= 20 || trendPct >= 30) workload = "High";
        else if (fc >= 5) workload = "Moderate";
        return { category, last7: v.last7, next7Forecast: fc, trendPct, workload };
      })
      .sort((a, b) => b.next7Forecast - a.next7Forecast)
      .slice(0, 8);

    const trendPct =
      prev7 === 0 ? (last7 > 0 ? 100 : 0) : Math.round(((last7 - prev7) / prev7) * 100);
    let insight = `Next 7 days: ~${next7Forecast} enrollments expected (${trendPct >= 0 ? "+" : ""}${trendPct}% vs prior week).`;
    const surging = byCategory.filter((c) => c.workload === "Surging" || c.workload === "High");
    if (surging.length) {
      insight += ` Plan staffing for ${surging.map((c) => c.category).join(", ")}.`;
    }

    // Best-effort AI rewrite using configured user AI APIs
    try {
      const top = byCategory
        .slice(0, 5)
        .map((c) => `${c.category}: forecast ${c.next7Forecast} (trend ${c.trendPct}%)`)
        .join("; ");
      const res = await callUserAiChat({
        messages: [
          {
            role: "system",
            content:
              "You are an analytics co-pilot. Reply with ONE crisp sentence (max 28 words) summarizing course demand and one staffing or content recommendation. No emojis.",
          },
          {
            role: "user",
            content: `Last 7d: ${last7} (prev ${prev7}). Forecast next 7d: ${next7Forecast}. Categories: ${top}.`,
          },
        ],
        temperature: 0.5,
      });
      if (res.ok) {
        const j: any = await res.json();
        const text = j?.choices?.[0]?.message?.content?.trim();
        if (text) insight = text;
      }
    } catch {}

    return {
      totalLast30,
      totalLast7: last7,
      next7Forecast,
      series: days,
      byCategory,
      insight,
    };
  });
