import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Server-side function to award XP and evaluate Streaks / Badges.
 */
export const awardXP = createServerFn({ method: "POST" })
  .inputValidator((input: { userId: string; amount: number }) =>
    z.object({ userId: z.string().uuid(), amount: z.number().positive() }).parse(input)
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Get current profile
    let { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("xp, current_streak, highest_streak, last_active_at")
      .eq("id", data.userId)
      .maybeSingle();

    if (!profile) {
      await supabaseAdmin.from("profiles").insert({ id: data.userId, xp: 0, current_streak: 0, highest_streak: 0 });
      profile = { xp: 0, current_streak: 0, highest_streak: 0, last_active_at: null };
    }

    const now = new Date();
    let currentStreak = profile.current_streak ?? 0;
    let highestStreak = profile.highest_streak ?? 0;

    if (profile.last_active_at) {
      const lastActive = new Date(profile.last_active_at);
      const isYesterday =
        now.getFullYear() === lastActive.getFullYear() &&
        now.getMonth() === lastActive.getMonth() &&
        now.getDate() - lastActive.getDate() === 1;

      const isToday =
        now.getFullYear() === lastActive.getFullYear() &&
        now.getMonth() === lastActive.getMonth() &&
        now.getDate() === lastActive.getDate();

      if (isYesterday) {
        currentStreak += 1;
      } else if (!isToday) {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    if (currentStreak > highestStreak) highestStreak = currentStreak;

    const newXp = (profile.xp ?? 0) + data.amount;

    // 2. Update Profile
    await supabaseAdmin
      .from("profiles")
      .update({
        xp: newXp,
        current_streak: currentStreak,
        highest_streak: highestStreak,
        last_active_at: now.toISOString(),
      })
      .eq("id", data.userId);

    // 3. Evaluate Badges
    const { data: allBadges } = await supabaseAdmin
      .from("badges")
      .select("id, xp_required")
      .lte("xp_required", newXp);

    if (allBadges && allBadges.length > 0) {
      const { data: earnedBadges } = await supabaseAdmin
        .from("user_badges")
        .select("badge_id")
        .eq("user_id", data.userId);

      const earnedIds = new Set((earnedBadges || []).map((b) => b.badge_id));
      const badgesToAward = allBadges.filter((b) => !earnedIds.has(b.id));

      if (badgesToAward.length > 0) {
        await supabaseAdmin.from("user_badges").insert(
          badgesToAward.map((b) => ({
            user_id: data.userId,
            badge_id: b.id,
          }))
        );
      }
    }

    return { success: true, xp: newXp, streak: currentStreak };
  });

/**
 * Server-side function to get Leaderboard.
 */
export const getLeaderboard = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, avatar_url, xp, current_streak")
    .order("xp", { ascending: false })
    .limit(50);
  return data ?? [];
});
