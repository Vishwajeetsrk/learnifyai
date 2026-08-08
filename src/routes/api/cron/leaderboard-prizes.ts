// Weekly leaderboard prizes: every Sunday, compute the week's top-3 XP earners,
// create prize claims, and email each winner a claim link.
// Triggered by Vercel cron "0 18 * * 0" (weekly, Sunday).

export default defineEventHandler(async (event) => {
  const secret = process.env.CRON_SECRET;
  const auth = getHeader(event, "authorization")?.replace(/^Bearer\s+/i, "");
  if (secret && auth !== secret) {
    setResponseStatus(event, 401);
    return { ok: false, error: "Unauthorized" };
  }

  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );

  try {
    // Week window (Sunday-start, same as getLeaderboard)
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const periodKey = weekStart.toISOString().slice(0, 10); // e.g. 2026-08-09
    const lastWeekStart = new Date(weekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    // Top 3 of the week
    const { data: logs, error: logErr } = await supabaseAdmin
      .from("xp_log")
      .select("user_id, amount")
      .gte("created_at", lastWeekStart.toISOString())
      .lt("created_at", weekStart.toISOString());
    if (logErr) throw new Error(logErr.message);

    const sums = new Map<string, number>();
    for (const l of logs ?? []) {
      sums.set(l.user_id, (sums.get(l.user_id) ?? 0) + (l.amount > 0 ? l.amount : 0));
    }
    const top3 = [...sums.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);

    const { data: prizes } = await supabaseAdmin
      .from("leaderboard_prizes")
      .select("*")
      .eq("period", "weekly")
      .eq("enabled", true);

    const prizeMap = new Map<number, any>((prizes ?? []).map((p) => [p.rank, p]));

    let created = 0;
    for (let i = 0; i < top3.length; i++) {
      const [userId, xp] = top3[i];
      const rank = i + 1;
      const prize = prizeMap.get(rank);
      if (!prize) continue;

      const { data: claim, error: dupErr } = await supabaseAdmin
        .from("prize_claims")
        .select("id")
        .eq("user_id", userId)
        .eq("period", "weekly")
        .eq("period_key", periodKey)
        .maybeSingle();
      if (dupErr) throw new Error(dupErr.message);
      if (claim) continue;

      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("full_name, email")
        .eq("id", userId)
        .maybeSingle();
      if (!profile?.email) continue;

      const { error: insertErr } = await supabaseAdmin.from("prize_claims").insert({
        user_id: userId,
        period: "weekly",
        period_key: periodKey,
        rank,
        prize_id: prize.id,
        prize_name: prize.name,
        prize_icon: prize.icon,
        item_type: prize.item_type,
        item_value: prize.item_value,
        status: "pending",
      });
      if (insertErr) throw new Error(insertErr.message);
      created++;

      // Email the winner
      try {
        const origin = (process.env.APP_URL || "https://www.learnifyai.in").replace(/\/$/, "");
        const claimUrl = `${origin}/leaderboard?claim=${userId}&period=${periodKey}`;
        const periodLabel = "this week";
        const { data: tpl } = await supabaseAdmin
          .from("email_templates")
          .select("subject, html_body")
          .eq("id", "leaderboard_winner")
          .maybeSingle();
        if (tpl) {
          const subject = (tpl.subject || "")
            .replace(/\{\{first_name\}\}/g, profile.full_name?.split(" ")[0] || "Champion")
            .replace(/\{\{period\}\}/g, "weekly")
            .replace(/\{\{period_label\}\}/g, periodLabel)
            .replace(/\{\{rank\}\}/g, String(rank))
            .replace(/\{\{icon\}\}/g, prize.icon || "🏆")
            .replace(/\{\{prize_name\}\}/g, prize.name)
            .replace(/\{\{description\}\}/g, prize.description || "")
            .replace(/\{\{claim_url\}\}/g, claimUrl);
          const html = (tpl.html_body || "")
            .replace(/\{\{first_name\}\}/g, escapeHtml(profile.full_name?.split(" ")[0] || "Champion"))
            .replace(/\{\{period\}\}/g, "weekly")
            .replace(/\{\{period_label\}\}/g, periodLabel)
            .replace(/\{\{rank\}\}/g, String(rank))
            .replace(/\{\{icon\}\}/g, prize.icon || "🏆")
            .replace(/\{\{prize_name\}\}/g, escapeHtml(prize.name))
            .replace(/\{\{description\}\}/g, escapeHtml(prize.description || ""))
            .replace(/\{\{claim_url\}\}/g, claimUrl);
          const { sendEmail } = await import("../../lib/welcome-email.functions");
          await sendEmail({ to: profile.email, subject, html });
        }
      } catch (e: any) {
        console.warn(`[PRIZE EMAIL] failed for ${userId}:`, e?.message);
      }
    }

    return { ok: true, created, periodKey, winners: top3.map((t) => t[0]) };
  } catch (e: any) {
    console.error("[PRIZE CRON]", e);
    setResponseStatus(event, 500);
    return { ok: false, error: e?.message ?? "Failed" };
  }
});

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
