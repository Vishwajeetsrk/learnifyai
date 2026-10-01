import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyCronRequest } from "@/lib/cron-auth";

// Monthly AI credit quota for users without a plan lookup (matches chat.ts lazy default).
const FALLBACK_MONTHLY_QUOTA = 100;

interface DueSubscription {
  user_id: string;
  pricing_plans: { ai_credits_monthly: number | null } | null;
}

export const Route = createFileRoute("/api/cron/check-subscriptions")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = verifyCronRequest(request);
        if (denied) return denied;

        try {
          const { data, error } = await (supabaseAdmin as any).rpc("check_expired_subscriptions");

          if (error) {
            console.error("Cron check-subscriptions error:", error);
            return new Response(JSON.stringify({ success: false, error: error.message }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Monthly AI credit reset: refill quotas for subscriptions whose
          // ai_credits_reset_at has passed. Free-tier users without a
          // subscription row are intentionally left untouched (product policy).
          let creditsReset = 0;
          try {
            const nowIso = new Date().toISOString();
            const { data: due } = await supabaseAdmin
              .from("user_subscriptions")
              .select("user_id, pricing_plans!inner(ai_credits_monthly)")
              .lte("ai_credits_reset_at", nowIso)
              .in("status", ["active", "past_due"])
              .limit(500);
            const rows = (due ?? []) as unknown as DueSubscription[];
            for (const row of rows) {
              const quota = row.pricing_plans?.ai_credits_monthly ?? FALLBACK_MONTHLY_QUOTA;
              const nextReset = new Date();
              nextReset.setMonth(nextReset.getMonth() + 1);
              const nextResetIso = nextReset.toISOString();
              const { error: subErr } = await supabaseAdmin
                .from("user_subscriptions")
                .update({
                  ai_credits_used_this_month: 0,
                  ai_credits_reset_at: nextResetIso,
                })
                .eq("user_id", row.user_id);
              if (subErr) continue;
              const { error: credErr } = await (supabaseAdmin as any).from("ai_credits").upsert(
                { user_id: row.user_id, credits_remaining: quota },
                { onConflict: "user_id" },
              );
              if (!credErr) creditsReset += 1;
            }
          } catch (resetErr) {
            console.error("Cron credit-reset error:", resetErr);
          }

          return new Response(
            JSON.stringify({
              success: true,
              timestamp: new Date().toISOString(),
              creditsReset,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        } catch (err: any) {
          console.error("Cron check-subscriptions exception:", err);
          return new Response(
            JSON.stringify({ success: false, error: err?.message || "Unknown error" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
