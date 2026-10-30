import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

/* ── Auth helpers ─────────────────────────────────────────────── */

async function isAdminUser(userId: string): Promise<boolean> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const list = ((roles ?? []) as Array<{ role: string }>).map((r) => r.role);
  return list.includes("admin") || list.includes("super_admin");
}

/** Mutating / scoped fns may only act on the caller's own record, unless admin. */
async function assertSelfOrAdmin(
  context: { userId?: string },
  targetUserId: string,
): Promise<void> {
  if (!context.userId) throw new Error("Unauthorized");
  if (context.userId !== targetUserId && !(await isAdminUser(context.userId))) {
    throw new Error("Forbidden: cannot act for another user");
  }
}

async function requireAdmin(context: { userId?: string }): Promise<void> {
  if (!context.userId) throw new Error("Unauthorized");
  if (!(await isAdminUser(context.userId))) {
    throw new Error("Forbidden: Admin role required");
  }
}

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
  .middleware([requireSupabaseAuth])
  .validator((input: { userId: string; amount: number; source?: string }) =>
    z
      .object({
        userId: z.string().uuid(),
        amount: z.number().positive(),
        source: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertSelfOrAdmin(context, data.userId);
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

    const todayStr = now.toISOString().slice(0, 10);
    if (profile.last_active_at) {
      const lastDateStr = new Date(profile.last_active_at).toISOString().slice(0, 10);
      const todayMs = new Date(`${todayStr}T00:00:00.000Z`).getTime();
      const lastMs = new Date(`${lastDateStr}T00:00:00.000Z`).getTime();
      const diffDays = Math.round((todayMs - lastMs) / 86400000);

      if (diffDays === 1) {
        currentStreak += 1;
      } else if (diffDays > 1) {
        currentStreak = 1;
      } else if (diffDays === 0) {
        currentStreak = Math.max(1, currentStreak);
      }
    } else {
      currentStreak = 1;
    }

    if (currentStreak > highestStreak) highestStreak = currentStreak;

    const newXp = (profile.xp ?? 0) + data.amount;

    const [profResult, logResult] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .update({
          xp: newXp,
          current_streak: currentStreak,
          highest_streak: highestStreak,
          last_active_at: now.toISOString(),
        })
        .eq("id", data.userId),

      supabaseAdmin.from("xp_log").insert({
        user_id: data.userId,
        amount: data.amount,
        source: data.source ?? "lesson",
      }),
    ]);

    if (logResult?.error) {
      console.error("[awardXP] xp_log insert failed:", logResult.error);
    }
    if (profResult?.error) {
      console.error("[awardXP] profile update failed:", profResult.error);
    }

    const { data: allBadges } = await supabaseAdmin
      .from("badges")
      .select("id, xp_required, streak_required, category");

    if (allBadges && allBadges.length > 0) {
      const { data: earnedBadges } = await supabaseAdmin
        .from("user_badges")
        .select("badge_id")
        .eq("user_id", data.userId);

      const earnedIds = new Set((earnedBadges || []).map((b: any) => b.badge_id));
      const toAward = (allBadges as any[]).filter((b: any) => {
        if (earnedIds.has(b.id)) return false;
        if (b.category === "xp" && b.xp_required !== null && newXp >= b.xp_required) return true;
        if (
          b.category === "streak" &&
          b.streak_required !== null &&
          currentStreak >= b.streak_required
        )
          return true;
        return false;
      });
      if (toAward.length > 0) {
        await supabaseAdmin
          .from("user_badges")
          .insert(toAward.map((b: any) => ({ user_id: data.userId, badge_id: b.id })));
      }
    }

    return { success: true, xp: newXp, streak: currentStreak, level: xpToLevel(newXp) };
  });

/* ── Deduct XP ─────────────────────────────────────────────────── */

export const deductXP = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { userId: string; amount: number; item?: string }) =>
    z
      .object({
        userId: z.string().uuid(),
        amount: z.number().positive(),
        item: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertSelfOrAdmin(context, data.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("xp")
      .eq("id", data.userId)
      .maybeSingle();

    if (!profile || (profile.xp ?? 0) < data.amount) {
      throw new Error("Insufficient XP balance");
    }

    const newXp = (profile.xp ?? 0) - data.amount;

    await Promise.all([
      supabaseAdmin.from("profiles").update({ xp: newXp }).eq("id", data.userId),

      supabaseAdmin.from("xp_log").insert({
        user_id: data.userId,
        amount: -data.amount,
        source: `store_purchase:${data.item ?? "item"}`,
      }),
    ]);

    return { success: true, xp: newXp };
  });

/* ── Daily Streak Check-In ─────────────────────────────────────── */

export const claimDailyStreak = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input?: { clientDate?: string; timezone?: string }) =>
    z
      .object({
        clientDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        timezone: z.string().optional(),
      })
      .optional()
      .parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId!;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("xp, current_streak, highest_streak, last_active_at")
      .eq("id", userId)
      .maybeSingle();

    if (!profile) {
      await supabaseAdmin
        .from("profiles")
        .insert({ id: userId, xp: 0, current_streak: 0, highest_streak: 0 });
      profile = { xp: 0, current_streak: 0, highest_streak: 0, last_active_at: null };
    }

    const now = new Date();
    let todayStr: string;
    try {
      if (data?.timezone) {
        todayStr = new Intl.DateTimeFormat("en-CA", {
          timeZone: data.timezone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(now);
      } else if (data?.clientDate) {
        todayStr = data.clientDate;
      } else {
        todayStr = now.toISOString().slice(0, 10);
      }
    } catch {
      todayStr = now.toISOString().slice(0, 10);
    }

    // Check if user already claimed check-in today
    const startOfToday = new Date(`${todayStr}T00:00:00.000Z`);
    const endOfToday = new Date(`${todayStr}T23:59:59.999Z`);

    const { data: existingLogs } = await supabaseAdmin
      .from("xp_log")
      .select("id, amount, created_at")
      .eq("user_id", userId)
      .eq("source", "daily_checkin")
      .gte("created_at", startOfToday.toISOString())
      .lte("created_at", endOfToday.toISOString())
      .limit(1);

    if (existingLogs && existingLogs.length > 0) {
      return {
        success: true,
        alreadyClaimed: true,
        streak: profile.current_streak ?? 1,
        highestStreak: profile.highest_streak ?? 1,
        xp: profile.xp ?? 0,
        awardedXp: 0,
        isMilestone: false,
        milestoneBonus: 0,
      };
    }

    // Check last check-in date
    const { data: lastCheckinLog } = await supabaseAdmin
      .from("xp_log")
      .select("created_at")
      .eq("user_id", userId)
      .eq("source", "daily_checkin")
      .lt("created_at", startOfToday.toISOString())
      .order("created_at", { ascending: false })
      .limit(1);

    let currentStreak = profile.current_streak ?? 0;
    let highestStreak = profile.highest_streak ?? 0;

    let lastDateStr: string | null = null;
    if (lastCheckinLog && lastCheckinLog.length > 0) {
      lastDateStr = new Date(lastCheckinLog[0].created_at).toISOString().slice(0, 10);
    } else if (profile.last_active_at) {
      lastDateStr = new Date(profile.last_active_at).toISOString().slice(0, 10);
    }

    if (lastDateStr) {
      const todayMs = new Date(`${todayStr}T00:00:00.000Z`).getTime();
      const lastMs = new Date(`${lastDateStr}T00:00:00.000Z`).getTime();
      const dayDiff = Math.round((todayMs - lastMs) / 86400000);

      if (dayDiff === 1) {
        currentStreak += 1;
      } else if (dayDiff > 1) {
        currentStreak = 1;
      } else if (dayDiff === 0) {
        currentStreak = Math.max(1, currentStreak);
      }
    } else {
      currentStreak = 1;
    }

    if (currentStreak > highestStreak) {
      highestStreak = currentStreak;
    }

    let awardedXp = 10;
    let isMilestone = false;
    let milestoneBonus = 0;

    if (currentStreak === 7) {
      milestoneBonus = 50;
      isMilestone = true;
    } else if (currentStreak === 14) {
      milestoneBonus = 100;
      isMilestone = true;
    } else if (currentStreak === 30) {
      milestoneBonus = 250;
      isMilestone = true;
    } else if (currentStreak === 100) {
      milestoneBonus = 1000;
      isMilestone = true;
    }

    awardedXp += milestoneBonus;
    const newXp = (profile.xp ?? 0) + awardedXp;

    await Promise.all([
      supabaseAdmin
        .from("profiles")
        .update({
          xp: newXp,
          current_streak: currentStreak,
          highest_streak: highestStreak,
          last_active_at: now.toISOString(),
        })
        .eq("id", userId),

      supabaseAdmin.from("xp_log").insert({
        user_id: userId,
        amount: awardedXp,
        source: "daily_checkin",
      }),

      supabaseAdmin.from("onboarding_daily_usage").upsert(
        {
          user_id: userId,
          usage_date: todayStr,
          actions_count: 1,
          features_used: ["daily_streak_checkin"],
          xp_earned: awardedXp,
          notes: `Daily Check-In: Day ${currentStreak}`,
        },
        { onConflict: "user_id,usage_date" },
      ),
    ]);

    // Check & award badges
    const { data: allBadges } = await supabaseAdmin
      .from("badges")
      .select("id, xp_required, streak_required, category");

    if (allBadges && allBadges.length > 0) {
      const { data: earnedBadges } = await supabaseAdmin
        .from("user_badges")
        .select("badge_id")
        .eq("user_id", userId);

      const earnedIds = new Set((earnedBadges || []).map((b: any) => b.badge_id));
      const toAward = (allBadges as any[]).filter((b: any) => {
        if (earnedIds.has(b.id)) return false;
        if (b.category === "xp" && b.xp_required !== null && newXp >= b.xp_required) return true;
        if (
          b.category === "streak" &&
          b.streak_required !== null &&
          currentStreak >= b.streak_required
        )
          return true;
        return false;
      });

      if (toAward.length > 0) {
        await supabaseAdmin
          .from("user_badges")
          .insert(toAward.map((b: any) => ({ user_id: userId, badge_id: b.id })));
      }
    }

    return {
      success: true,
      alreadyClaimed: false,
      streak: currentStreak,
      highestStreak,
      xp: newXp,
      awardedXp,
      isMilestone,
      milestoneBonus,
    };
  });

export const getDailyStreakStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input?: { clientDate?: string; timezone?: string }) =>
    z
      .object({
        clientDate: z.string().optional(),
        timezone: z.string().optional(),
      })
      .optional()
      .parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId!;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const now = new Date();
    let todayStr: string;
    try {
      if (data?.timezone) {
        todayStr = new Intl.DateTimeFormat("en-CA", {
          timeZone: data.timezone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(now);
      } else if (data?.clientDate) {
        todayStr = data.clientDate;
      } else {
        todayStr = now.toISOString().slice(0, 10);
      }
    } catch {
      todayStr = now.toISOString().slice(0, 10);
    }

    const startOfToday = new Date(`${todayStr}T00:00:00.000Z`);
    const endOfToday = new Date(`${todayStr}T23:59:59.999Z`);

    const [profileRes, checkinRes] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("xp, current_streak, highest_streak, last_active_at")
        .eq("id", userId)
        .maybeSingle(),
      supabaseAdmin
        .from("xp_log")
        .select("id, amount, created_at")
        .eq("user_id", userId)
        .eq("source", "daily_checkin")
        .gte("created_at", startOfToday.toISOString())
        .lte("created_at", endOfToday.toISOString())
        .limit(1),
    ]);

    const profile = profileRes.data;
    const hasCheckedInToday = Boolean(checkinRes.data && checkinRes.data.length > 0);

    return {
      hasCheckedInToday,
      currentStreak: profile?.current_streak ?? 1,
      highestStreak: profile?.highest_streak ?? 1,
      xp: profile?.xp ?? 0,
      todayStr,
    };
  });

/* ── Leaderboard (weekly or all-time) ──────────────────────────── */

export const getLeaderboard = createServerFn({ method: "GET" })
  .validator((input: { period?: "weekly" | "all"; role?: "student" | "creator" | "admin" }) =>
    z
      .object({
        period: z.enum(["weekly", "all"]).optional(),
        role: z.enum(["student", "creator", "admin"]).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let filteredUserIds: string[] | null = null;
    if (data.role) {
      const { data: roles } = await supabaseAdmin
        .from("user_roles")
        .select("user_id")
        .eq("role", data.role);
      filteredUserIds = (roles ?? []).map((r: any) => r.user_id);
      if (filteredUserIds && filteredUserIds.length === 0) return [];
    }

    if (data.period === "weekly") {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const { data: logs } = await supabaseAdmin
        .from("xp_log")
        .select("user_id, amount")
        .gt("amount", 0)
        .gte("created_at", weekStart.toISOString());

      const map = new Map<string, number>();
      for (const l of (logs as any[]) ?? [])
        map.set(l.user_id, (map.get(l.user_id) ?? 0) + l.amount);

      if (map.size === 0) return [];

      let sortedEntries = [...map.entries()].sort((a, b) => b[1] - a[1]);
      if (filteredUserIds) {
        sortedEntries = sortedEntries.filter(([id]) => filteredUserIds!.includes(id));
      }
      if (sortedEntries.length === 0) return [];

      const top50 = sortedEntries.slice(0, 50);
      const topUserIds = top50.map(([id]) => id);

      const { data: profiles } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name, avatar_url, xp, current_streak")
        .in("id", topUserIds);

      const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

      return top50.map(([id, weekly]) => {
        const p = profileMap.get(id);
        return {
          id,
          full_name: p?.full_name ?? "Learner",
          avatar_url: p?.avatar_url ?? null,
          xp: p?.xp ?? 0,
          weekly_xp: weekly,
          current_streak: p?.current_streak ?? 0,
        };
      });
    }

    let query = supabaseAdmin
      .from("profiles")
      .select("id, full_name, avatar_url, xp, current_streak")
      .not("xp", "is", null)
      .gt("xp", 0)
      .order("xp", { ascending: false })
      .order("id", { ascending: true })
      .limit(50);

    if (filteredUserIds) query = query.in("id", filteredUserIds);

    const { data: allTime } = await query;

    return (allTime ?? []).map((p) => ({
      ...p,
      full_name: p.full_name ?? "Learner",
      weekly_xp: 0,
    }));
  });

/* ── Achievements / Badges ─────────────────────────────────────── */

export const getUserAchievements = createServerFn({ method: "GET" })
  .validator((input: { userId: string }) => z.object({ userId: z.string().uuid() }).parse(input))
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
  .validator((input: { courseId: string; limit?: number }) =>
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

/* ── XP Store Purchases ────────────────────────────────────────── */

export const recordPurchase = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { userId: string; perkId: string; perkName: string; cost: number }) =>
    z
      .object({
        userId: z.string().uuid(),
        perkId: z.string(),
        perkName: z.string(),
        cost: z.number().positive(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertSelfOrAdmin(context, data.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await (supabaseAdmin as any).from("xp_purchases").insert({
      user_id: data.userId,
      perk_id: data.perkId,
      perk_name: data.perkName,
      cost: data.cost,
      status: "active",
    });

    if (error) {
      console.error("[recordPurchase] insert failed:", error);
      if (error.message?.includes("does not exist")) {
        throw new Error(
          "XP Store table missing — ask admin to run `node scripts/sync-migrations.cjs`",
        );
      }
      throw new Error("Failed to record purchase");
    }

    return { success: true };
  });

export const purchaseWithWallet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { userId: string; perkId: string; perkName: string; costInr: number }) =>
    z
      .object({
        userId: z.string().uuid(),
        perkId: z.string(),
        perkName: z.string(),
        costInr: z.number().positive(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertSelfOrAdmin(context, data.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Fetch wallet transactions to compute balance
    const { data: txs, error: tErr } = await supabaseAdmin
      .from("wallet_transactions")
      .select("amount_inr, type, status")
      .eq("user_id", data.userId);
    if (tErr) throw new Error(tErr.message);

    const balance = (txs ?? [])
      .filter((t) => t.status === "completed")
      .reduce(
        (s, t) => s + (t.type === "credit" ? Number(t.amount_inr) : -Number(t.amount_inr)),
        0,
      );

    if (data.costInr > balance) {
      throw new Error(
        `Insufficient wallet balance. Need ₹${data.costInr}, have ₹${balance}. Please top up.`,
      );
    }

    // 2. Insert debit transaction
    const { error: dErr } = await supabaseAdmin.from("wallet_transactions").insert({
      user_id: data.userId,
      amount_inr: data.costInr,
      type: "debit",
      status: "completed",
      description: `Purchase: ${data.perkName}`,
    });
    if (dErr) throw new Error(dErr.message);

    // 3. Record purchase in xp_purchases
    const { error: pErr } = await (supabaseAdmin as any).from("xp_purchases").insert({
      user_id: data.userId,
      perk_id: data.perkId,
      perk_name: data.perkName,
      cost: 0,
      status: "active",
    });
    if (pErr) throw new Error(pErr.message);

    return { success: true };
  });

export const getUserPurchases = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: { userId: string }) => z.object({ userId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertSelfOrAdmin(context, data.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: purchases, error } = await (supabaseAdmin as any)
      .from("xp_purchases")
      .select("*")
      .eq("user_id", data.userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getUserPurchases] failed:", error);
      return [];
    }

    return purchases.map((p: any) => ({
      id: p.id,
      perkId: p.perk_id,
      perkName: p.perk_name,
      cost: p.cost,
      status: p.status,
      purchasedAt: p.created_at,
    }));
  });

export const getAllPurchases = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: { page?: number; limit?: number } | undefined) =>
    z.object({ page: z.number().optional(), limit: z.number().optional() }).parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const page = data.page ?? 1;
    const limit = data.limit ?? 50;
    const offset = (page - 1) * limit;

    const {
      data: purchases,
      error,
      count,
    } = await (supabaseAdmin as any)
      .from("xp_purchases")
      .select("*, profiles!inner(full_name, email, avatar_url)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("[getAllPurchases] failed:", error);
      return { purchases: [], total: 0 };
    }

    return {
      purchases: (purchases ?? []).map((p: any) => ({
        id: p.id,
        userId: p.user_id,
        perkId: p.perk_id,
        perkName: p.perk_name,
        cost: p.cost,
        status: p.status,
        purchasedAt: p.created_at,
        user: p.profiles
          ? {
              fullName: p.profiles.full_name,
              email: p.profiles.email,
              avatarUrl: p.profiles.avatar_url,
            }
          : null,
      })),
      total: count ?? 0,
    };
  });

/* ── Current user rank ─────────────────────────────────────────── */

export const getUserRank = createServerFn({ method: "GET" })
  .validator((input: { userId: string }) => z.object({ userId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("xp, current_streak, highest_streak, avatar_url, full_name")
      .eq("id", data.userId)
      .maybeSingle();

    if (!profile) return null;

    const userXp = profile.xp ?? 0;

    // Fast indexed count of users with strictly higher XP
    const [{ count: higherCount }, { count: totalCount }] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .gt("xp", userXp),
      supabaseAdmin
        .from("profiles")
        .select("id", { count: "exact", head: true }),
    ]);

    const rank = (higherCount ?? 0) + 1;
    const total = Math.max(totalCount ?? 1, rank);

    const level = xpToLevel(userXp);
    const rankInfo = levelToRank(level);
    const nextLevelXp = xpToNextLevel(userXp);
    const currentLevelXp = xpInCurrentLevel(userXp);
    const levelTotal = xpForLevel(level + 1) - xpForLevel(level);

    return {
      xp: userXp,
      rank,
      total,
      level,
      rankName: rankInfo.name,
      rankColor: rankInfo.color,
      rankBg: rankInfo.bg,
      streak: profile.current_streak ?? 1,
      highestStreak: profile.highest_streak ?? 1,
      avatar_url: profile.avatar_url,
      full_name: profile.full_name ?? "Learner",
      nextLevelXp,
      currentLevelXp,
      levelTotal,
      progress: levelTotal > 0 ? Math.round((currentLevelXp / levelTotal) * 100) : 0,
    };
  });
