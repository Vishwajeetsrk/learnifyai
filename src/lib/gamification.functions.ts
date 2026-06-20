import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/* ── Level / Rank helpers ───────────────────────────────────────── */

const RANKS = [
  {
    name: "Bronze",
    min: 1,
    max: 5,
    color: "text-amber-700",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    name: "Silver",
    min: 6,
    max: 10,
    color: "text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-800/40",
  },
  {
    name: "Gold",
    min: 11,
    max: 15,
    color: "text-yellow-500",
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  {
    name: "Platinum",
    min: 16,
    max: 20,
    color: "text-cyan-400",
    bg: "bg-cyan-100 dark:bg-cyan-900/30",
  },
  { name: "Diamond", min: 21, max: 25, color: "text-sky-500", bg: "bg-sky-100 dark:bg-sky-900/30" },
];

export function xpToLevel(xp: number): number {
  return Math.min(Math.floor(Math.sqrt(xp / 100)) + 1, 25);
}

export function levelToRank(level: number) {
  for (const r of RANKS) {
    if (level >= r.min && level <= r.max) return r;
  }
  return RANKS[0];
}

export function xpToNextLevel(xp: number): number {
  const lvl = xpToLevel(xp);
  return lvl * lvl * 100 - xp;
}

export function xpInCurrentLevel(xp: number): number {
  const lvl = xpToLevel(xp);
  const current = (lvl - 1) * (lvl - 1) * 100;
  return xp - current;
}

export function xpForLevel(level: number): number {
  return (level - 1) * (level - 1) * 100;
}

/* ── Award XP ──────────────────────────────────────────────────── */

export const awardXP = createServerFn({ method: "POST" })
  .inputValidator((input: { userId: string; amount: number; source?: string }) =>
    z
      .object({
        userId: z.string().uuid(),
        amount: z.number().positive(),
        source: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("xp, current_streak, highest_streak, last_active_at")
      .eq("id", data.userId)
      .maybeSingle();

    if (!profile) {
      await supabaseAdmin
        .from("profiles")
        .insert({ id: data.userId, xp: 0, current_streak: 0, highest_streak: 0 });
      profile = { xp: 0, current_streak: 0, highest_streak: 0, last_active_at: null };
    }

    const now = new Date();
    let currentStreak = profile.current_streak ?? 0;
    let highestStreak = profile.highest_streak ?? 0;

    if (profile.last_active_at) {
      const last = new Date(profile.last_active_at);
      const diffDays = Math.floor((now.getTime() - last.getTime()) / 86400000);
      if (diffDays === 1) currentStreak += 1;
      else if (diffDays > 1) currentStreak = 1;
    } else {
      currentStreak = 1;
    }

    if (currentStreak > highestStreak) highestStreak = currentStreak;

    const newXp = (profile.xp ?? 0) + data.amount;

    await Promise.all([
      supabaseAdmin
        .from("profiles")
        .update({
          xp: newXp,
          current_streak: currentStreak,
          highest_streak: highestStreak,
          last_active_at: now.toISOString(),
        })
        .eq("id", data.userId),

      (supabaseAdmin as any).from("xp_log").insert({
        user_id: data.userId,
        amount: data.amount,
        source: data.source ?? "lesson",
      }),
    ]);

    const { data: allBadges } = await (supabaseAdmin as any)
      .from("badges")
      .select("id, xp_required, streak_required, category");

    if (allBadges && allBadges.length > 0) {
      const { data: earnedBadges } = await supabaseAdmin
        .from("user_badges")
        .select("badge_id")
        .eq("user_id", data.userId);

      const earnedIds = new Set((earnedBadges || []).map((b) => b.badge_id));
      const toAward = allBadges.filter((b) => {
        if (earnedIds.has(b.id)) return false;
        if (b.category === "xp" && b.xp_required !== null && newXp >= b.xp_required) return true;
        if (b.category === "streak" && b.streak_required !== null && currentStreak >= b.streak_required) return true;
        return false;
      });
      if (toAward.length > 0) {
        await supabaseAdmin
          .from("user_badges")
          .insert(toAward.map((b) => ({ user_id: data.userId, badge_id: b.id })));
      }
    }

    return { success: true, xp: newXp, streak: currentStreak, level: xpToLevel(newXp) };
  });

/* ── Leaderboard (weekly or all-time) ──────────────────────────── */

export const getLeaderboard = createServerFn({ method: "GET" })
  .inputValidator((input: { period?: "weekly" | "all" }) =>
    z.object({ period: z.enum(["weekly", "all"]).optional() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (data.period === "weekly") {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const { data: logs } = await (supabaseAdmin as any)
        .from("xp_log")
        .select("user_id, amount")
        .gte("created_at", weekStart.toISOString());

      const map = new Map<string, number>();
      for (const l of (logs as any[]) ?? []) map.set(l.user_id, (map.get(l.user_id) ?? 0) + l.amount);

      if (map.size === 0) return [];

      const userIds = [...map.keys()];
      const { data: profiles } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name, avatar_url, xp, current_streak")
        .in("id", userIds);

      const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

      return [...map.entries()]
        .map(([id, weekly]) => {
          const p = profileMap.get(id);
          return {
            id,
            full_name: p?.full_name ?? "Anonymous",
            avatar_url: p?.avatar_url,
            xp: p?.xp ?? 0,
            weekly_xp: weekly,
            current_streak: p?.current_streak ?? 0,
          };
        })
        .sort((a, b) => b.weekly_xp - a.weekly_xp || a.id.localeCompare(b.id))
        .slice(0, 50);
    }

    const { data: allTime } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, avatar_url, xp, current_streak")
      .not("xp", "is", null)
      .order("xp", { ascending: false })
      .order("id", { ascending: true })
      .limit(50);

    return (allTime ?? []).map((p) => ({ ...p, weekly_xp: 0 }));
  });

/* ── Achievements / Badges ─────────────────────────────────────── */

export const getUserAchievements = createServerFn({ method: "GET" })
  .inputValidator((input: { userId: string }) =>
    z.object({ userId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [badgesRes, earnedRes] = await Promise.all([
      supabaseAdmin.from("badges").select("*").order("xp_required", { ascending: true }),
      supabaseAdmin.from("user_badges").select("badge_id, earned_at").eq("user_id", data.userId),
    ]);

    const earned = new Map((earnedRes.data ?? []).map((b) => [b.badge_id, b.earned_at]));

    const badges = (badgesRes.data ?? []).map((b) => ({
      ...b,
      earned: earned.has(b.id),
      earned_at: earned.get(b.id) ?? null,
    }));

    return badges;
  });

export const getCourseLearners = createServerFn({ method: "GET" })
  .inputValidator((input: { courseId: string; limit?: number }) =>
    z.object({ courseId: z.string().uuid(), limit: z.number().optional() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { count } = await supabaseAdmin
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .eq("course_id", data.courseId);

    const { data: recent } = await supabaseAdmin
      .from("enrollments")
      .select("user_id, profiles!inner(avatar_url, full_name)")
      .eq("course_id", data.courseId)
      .order("enrolled_at", { ascending: false })
      .limit(data.limit ?? 3);

    type EnrollWithProfile = {
      user_id: string;
      profiles: { avatar_url: string | null; full_name: string | null } | null;
    };
    return {
      total: count ?? 0,
      learners: ((recent ?? []) as unknown as EnrollWithProfile[]).map((e) => ({
        user_id: e.user_id,
        avatar_url: e.profiles?.avatar_url ?? null,
        full_name: e.profiles?.full_name ?? null,
      })),
    };
  });

/* ── Current user rank ─────────────────────────────────────────── */

export const getUserRank = createServerFn({ method: "GET" })
  .inputValidator((input: { userId: string }) =>
    z.object({ userId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [allRes, profileRes] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, xp").not("xp", "is", null).order("xp", { ascending: false }).order("id", { ascending: true }),
      supabaseAdmin
        .from("profiles")
        .select("xp, current_streak, highest_streak, avatar_url, full_name")
        .eq("id", data.userId)
        .maybeSingle(),
    ]);

    const rank = (allRes.data ?? []).findIndex((p) => p.id === data.userId) + 1;
    const total = (allRes.data ?? []).length;
    const profile = profileRes.data;

    if (!profile) return null;

    const level = xpToLevel(profile.xp);
    const rankInfo = levelToRank(level);
    const nextLevelXp = xpToNextLevel(profile.xp);
    const currentLevelXp = xpInCurrentLevel(profile.xp);
    const levelTotal = xpForLevel(level + 1) - xpForLevel(level);

    return {
      xp: profile.xp,
      rank: rank > 0 ? rank : total,
      total,
      level,
      rankName: rankInfo.name,
      rankColor: rankInfo.color,
      rankBg: rankInfo.bg,
      streak: profile.current_streak,
      highestStreak: profile.highest_streak,
      avatar_url: profile.avatar_url,
      full_name: profile.full_name,
      nextLevelXp,
      currentLevelXp,
      levelTotal,
      progress: levelTotal > 0 ? Math.round((currentLevelXp / levelTotal) * 100) : 0,
    };
  });
