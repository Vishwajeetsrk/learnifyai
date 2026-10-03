/**
 * Subscription Renewal Dunning Cron
 *
 * Runs daily. Sends reminder emails to subscribers whose plan renews in ≤3 days.
 * Also sends a "renewal failed — grace period" email to halted subscriptions.
 *
 * Trigger: Vercel Cron or manual GET with Bearer token.
 */

import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyCronRequest } from "@/lib/cron-auth";

export const Route = createFileRoute("/api/cron/renewal-dunning")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = verifyCronRequest(request);
        if (denied) return denied;

        const now = new Date();
        const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
        const in1Day = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString();

        let reminded3 = 0;
        let reminded1 = 0;
        let graceNotified = 0;

        try {
          // ── 1. 3-day renewal reminder ────────────────────────────────────
          const { data: due3 } = await (supabaseAdmin as any)
            .from("user_subscriptions")
            .select(
              "user_id, current_period_end, pricing_plans!inner(name, price_inr), profiles!inner(email, full_name)",
            )
            .eq("status", "active")
            .eq("will_renew", true)
            .lte("current_period_end", in3Days)
            .gt("current_period_end", in1Day)
            .is("renewal_3day_notified_at", null)
            .limit(200);

          for (const row of due3 ?? []) {
            try {
              const { sendSubscriptionRenewalReminderEmail } = await import(
                "@/lib/subscription-email.functions"
              );
              await sendSubscriptionRenewalReminderEmail(
                row.user_id,
                row.pricing_plans?.name ?? "Pro",
                Number(row.pricing_plans?.price_inr ?? 0),
                new Date(row.current_period_end).toLocaleDateString("en-IN"),
                3,
              );
              await (supabaseAdmin as any)
                .from("user_subscriptions")
                .update({ renewal_3day_notified_at: now.toISOString() })
                .eq("user_id", row.user_id);
              reminded3++;
            } catch (e) {
              console.error("[Dunning] 3-day reminder failed for", row.user_id, e);
            }
          }

          // ── 2. 1-day renewal reminder ────────────────────────────────────
          const { data: due1 } = await (supabaseAdmin as any)
            .from("user_subscriptions")
            .select(
              "user_id, current_period_end, pricing_plans!inner(name, price_inr), profiles!inner(email, full_name)",
            )
            .eq("status", "active")
            .eq("will_renew", true)
            .lte("current_period_end", in1Day)
            .gt("current_period_end", now.toISOString())
            .is("renewal_1day_notified_at", null)
            .limit(200);

          for (const row of due1 ?? []) {
            try {
              const { sendSubscriptionRenewalReminderEmail } = await import(
                "@/lib/subscription-email.functions"
              );
              await sendSubscriptionRenewalReminderEmail(
                row.user_id,
                row.pricing_plans?.name ?? "Pro",
                Number(row.pricing_plans?.price_inr ?? 0),
                new Date(row.current_period_end).toLocaleDateString("en-IN"),
                1,
              );
              await (supabaseAdmin as any)
                .from("user_subscriptions")
                .update({ renewal_1day_notified_at: now.toISOString() })
                .eq("user_id", row.user_id);
              reminded1++;
            } catch (e) {
              console.error("[Dunning] 1-day reminder failed for", row.user_id, e);
            }
          }

          // ── 3. Grace period notification for renewal_failed ──────────────
          const { data: failed } = await (supabaseAdmin as any)
            .from("user_subscriptions")
            .select("user_id, current_period_end, pricing_plans!inner(name)")
            .eq("status", "renewal_failed")
            .is("grace_notified_at", null)
            .limit(200);

          for (const row of failed ?? []) {
            try {
              const { sendPaymentFailedEmail } = await import(
                "@/lib/subscription-email.functions"
              );
              await sendPaymentFailedEmail(row.user_id, row.pricing_plans?.name ?? "Pro");
              await (supabaseAdmin as any)
                .from("user_subscriptions")
                .update({ grace_notified_at: now.toISOString() })
                .eq("user_id", row.user_id);
              graceNotified++;
            } catch (e) {
              console.error("[Dunning] Grace notification failed for", row.user_id, e);
            }
          }

          return new Response(
            JSON.stringify({
              success: true,
              timestamp: now.toISOString(),
              reminded_3_day: reminded3,
              reminded_1_day: reminded1,
              grace_notified: graceNotified,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        } catch (err: any) {
          console.error("[Dunning Cron] Fatal error:", err);
          return new Response(
            JSON.stringify({ success: false, error: err?.message || "Unknown error" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
