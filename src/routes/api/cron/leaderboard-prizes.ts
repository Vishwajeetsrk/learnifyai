import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

function resolveOrigin(): string {
  return (process.env.APP_URL || "https://www.learnifyai.in").replace(
    /[^a-zA-Z0-9:/.\-_]/g,
    "",
  );
}

export const Route = createFileRoute("/api/cron/leaderboard-prizes")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const authHeader = request.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const now = new Date();
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          weekStart.setHours(0, 0, 0, 0);
          const periodKey = weekStart.toISOString().slice(0, 10);
          const lastWeekStart = new Date(weekStart);
          lastWeekStart.setDate(lastWeekStart.getDate() - 7);

          const { data: logs, error: logErr } = await (supabaseAdmin as any)
            .from("xp_log")
            .select("user_id, amount")
            .gte("created_at", lastWeekStart.toISOString())
            .lt("created_at", weekStart.toISOString());
          if (logErr) throw new Error(logErr.message);

          const sums = new Map<string, number>();
          for (const l of logs ?? []) {
            const amt = typeof l.amount === "number" ? l.amount : parseInt(l.amount ?? "0", 10) || 0;
            if (amt > 0) sums.set(l.user_id, (sums.get(l.user_id) ?? 0) + amt);
          }
          const top3 = [...sums.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);

          const { data: prizes } = await (supabaseAdmin as any)
            .from("leaderboard_prizes")
            .select("*")
            .eq("period", "weekly")
            .eq("enabled", true);
          const prizeMap = new Map<number, any>((prizes ?? []).map((p: any) => [p.rank, p]));

          let created = 0;
          const winners: string[] = [];

          for (let i = 0; i < top3.length; i++) {
            const [userId, xp] = top3[i];
            const rank = i + 1;
            const prize = prizeMap.get(rank);
            if (!prize) continue;

            const { data: existing } = await (supabaseAdmin as any)
              .from("prize_claims")
              .select("id")
              .eq("user_id", userId)
              .eq("period", "weekly")
              .eq("period_key", periodKey)
              .maybeSingle();
            if (existing) continue;

            const { data: profile } = await (supabaseAdmin as any)
              .from("profiles")
              .select("full_name, email")
              .eq("id", userId)
              .maybeSingle();
            if (!profile?.email) continue;

            const { error: insertErr } = await (supabaseAdmin as any)
              .from("prize_claims")
              .insert({
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
            winners.push(userId);

            try {
              const origin = resolveOrigin();
              const claimUrl = `${origin}/leaderboard?claim=1`;
              const firstName = (profile.full_name ?? "Champion").split(" ")[0];
              const { data: tpl } = await (supabaseAdmin as any)
                .from("email_templates")
                .select("subject, html_body")
                .eq("id", "leaderboard_winner")
                .maybeSingle();
              if (tpl) {
                const fill = (s: string) =>
                  s
                    .replace(/\{\{first_name\}\}/g, firstName)
                    .replace(/\{\{period\}\}/g, "weekly")
                    .replace(/\{\{period_label\}\}/g, "this week")
                    .replace(/\{\{rank\}\}/g, String(rank))
                    .replace(/\{\{icon\}\}/g, prize.icon || "🏆")
                    .replace(/\{\{prize_name\}\}/g, escapeHtml(prize.name))
                    .replace(/\{\{description\}\}/g, escapeHtml(prize.description || ""))
                    .replace(/\{\{claim_url\}\}/g, claimUrl);
                const { sendEmail } = await import("@/lib/welcome-email.functions");
                await sendEmail({
                  to: profile.email,
                  subject: fill(tpl.subject || `You made the Top 3 ${firstName}! 🏆`),
                  html: fill(tpl.html_body || ""),
                });
              }
            } catch (e: any) {
              console.warn(`[PRIZE EMAIL] failed for ${userId}:`, e?.message);
            }
          }

          return new Response(
            JSON.stringify({ success: true, created, periodKey, winners, topXp: top3.map((t) => t[1]) }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        } catch (err: any) {
          console.error("leaderboard-prizes exception:", err);
          return new Response(
            JSON.stringify({ success: false, error: err?.message || "Unknown error" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
