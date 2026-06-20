import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/webhooks/cashfree-subscription")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.text();
          const sig = request.headers.get("x-webhook-signature") || "";
          const secretKey = process.env.CASHFREE_SECRET_KEY;

          if (secretKey) {
            const encoder = new TextEncoder();
            const key = await crypto.subtle.importKey(
              "raw",
              encoder.encode(secretKey),
              { name: "HMAC", hash: "SHA-256" },
              false,
              ["verify"],
            );
            const expected = Array.from(
              new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(body))),
            )
              .map((b) => b.toString(16).padStart(2, "0"))
              .join("");
            if (sig !== expected) console.warn("Cashfree subscription webhook: invalid signature");
          }

          let event: any;
          try {
            event = JSON.parse(body);
          } catch {
            event = { type: body };
          }

          const sb = supabaseAdmin as any;

          const eventType = event.type || event.event_type || "";
          const subscriptionId = event.data?.subscription?.subscription_id || event.subscription_id;
          const orderId = event.data?.order?.order_id || event.order_id;

          if (
            eventType === "SUBSCRIPTION_PAYMENT_SUCCESS" ||
            eventType === "SUBSCRIPTION_CHARGE_SUCCESS"
          ) {
            if (subscriptionId) {
              const { data: sub } = await sb
                .from("user_subscriptions")
                .select("id, plan_id, user_id")
                .eq("cashfree_subscription_id", subscriptionId)
                .maybeSingle();

              if (sub) {
                const periodEnd = new Date();
                periodEnd.setDate(periodEnd.getDate() + 30);

                await sb
                  .from("user_subscriptions")
                  .update({
                    status: "active",
                    current_period_start: new Date().toISOString(),
                    current_period_end: periodEnd.toISOString(),
                    cashfree_order_id: orderId || sub.cashfree_order_id,
                    ai_credits_reset_at: periodEnd.toISOString(),
                  })
                  .eq("id", sub.id);

                const { data: plan } = await sb
                  .from("pricing_plans")
                  .select("ai_credits_monthly")
                  .eq("id", sub.plan_id)
                  .single();
                if (plan?.ai_credits_monthly && sub.user_id) {
                  await sb.from("ai_credits").upsert(
                    {
                      user_id: sub.user_id,
                      credits_remaining: plan.ai_credits_monthly,
                      credits_used: 0,
                      updated_at: new Date().toISOString(),
                    },
                    { onConflict: "user_id" },
                  );
                }

                await sb.from("subscription_events").insert({
                  subscription_id: sub.id,
                  user_id: sub.user_id,
                  event_type: eventType,
                  payload: { amount: event.data?.order?.order_amount, order_id: orderId },
                });
              }
            }
          }

          if (eventType === "SUBSCRIPTION_CANCELLED" || eventType === "SUBSCRIPTION_EXPIRED") {
            if (subscriptionId) {
              await sb
                .from("user_subscriptions")
                .update({
                  status: eventType === "SUBSCRIPTION_CANCELLED" ? "cancelled" : "expired",
                  will_renew: false,
                })
                .eq("cashfree_subscription_id", subscriptionId);
            }
          }

          return new Response("OK", { status: 200 });
        } catch (err) {
          console.error("Cashfree subscription webhook error:", err);
          return new Response("OK", { status: 200 });
        }
      },
    },
  },
});
