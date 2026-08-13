import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

export const Route = createFileRoute("/api/webhooks/razorpay-subscription")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = await request.text();

        // ── 1. Verify Razorpay webhook signature ───────────────────────────
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!webhookSecret) {
          console.error("[rzp-sub-webhook] RAZORPAY_WEBHOOK_SECRET not set");
          return new Response(JSON.stringify({ error: "Webhook secret not configured" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        const incomingSig = request.headers.get("x-razorpay-signature") || "";
        const expectedSig = createHmac("sha256", webhookSecret).update(rawBody).digest("hex");

        const sigBuffer = Buffer.from(incomingSig, "hex");
        const expBuffer = Buffer.from(expectedSig, "hex");

        if (sigBuffer.length !== expBuffer.length || !timingSafeEqual(sigBuffer, expBuffer)) {
          console.warn("[rzp-sub-webhook] Invalid webhook signature");
          return new Response(JSON.stringify({ error: "Invalid signature" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        // ── 2. Parse event payload ─────────────────────────────────────────
        let payload: any;
        try {
          payload = JSON.parse(rawBody);
        } catch {
          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        const event: string = payload.event || "";
        const subEntity = payload.payload?.subscription?.entity;
        const paymentEntity = payload.payload?.payment?.entity;

        console.log(`[rzp-sub-webhook] Received event: ${event}`);

        // ── 3. Route by event type ─────────────────────────────────────────
        if (!subEntity) {
          return new Response(JSON.stringify({ received: true, event }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const rzpSubId: string = subEntity.id;
        const notes: any = subEntity.notes || {};
        const userId: string = notes.userId || "";
        const planId: string = notes.planId || "";

        if (!rzpSubId) {
          return new Response(JSON.stringify({ received: true, event }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          switch (event) {
            // ── subscription.activated ─────────────────────────────────────
            // Fires when customer completes auth and first payment is deducted
            case "subscription.activated": {
              if (!userId || !planId) break;

              const { data: plan } = await supabaseAdmin
                .from("pricing_plans")
                .select("*")
                .eq("id", planId)
                .single();
              const p = plan as any;
              if (!p) break;

              const periodEnd = new Date();
              if (p.interval?.startsWith("month")) {
                periodEnd.setMonth(periodEnd.getMonth() + 1);
              } else {
                periodEnd.setFullYear(periodEnd.getFullYear() + 1);
              }

              const { error: updErr } = await supabaseAdmin
                .from("user_subscriptions")
                .update({
                  status: "active",
                  current_period_start: new Date().toISOString(),
                  current_period_end: periodEnd.toISOString(),
                  will_renew: true,
                  ai_credits_reset_at: periodEnd.toISOString(),
                } as any)
                .eq("razorpay_subscription_id" as any, rzpSubId);

              if (updErr) {
                console.error("[rzp-sub-webhook] Failed to activate subscription:", updErr);
              } else {
                // Grant AI credits
                if (p.ai_credits_monthly) {
                  await supabaseAdmin.from("ai_credits").upsert(
                    {
                      user_id: userId,
                      credits_remaining: p.ai_credits_monthly,
                      credits_used: 0,
                      updated_at: new Date().toISOString(),
                    },
                    { onConflict: "user_id" },
                  );
                }

                await supabaseAdmin.from("subscription_events").insert({
                  subscription_id: null,
                  user_id: userId,
                  event_type: "SUBSCRIPTION_ACTIVATED",
                  payload: { razorpay_subscription_id: rzpSubId, plan_id: planId },
                });

                console.log(`[rzp-sub-webhook] Activated subscription ${rzpSubId} for user ${userId}`);
              }
              break;
            }

            // ── subscription.charged ───────────────────────────────────────
            // Fires on every successful recurring charge
            case "subscription.charged": {
              if (!userId || !planId) break;

              const amountInr = paymentEntity ? Number(paymentEntity.amount) / 100 : 0;

              const { data: plan } = await supabaseAdmin
                .from("pricing_plans")
                .select("*")
                .eq("id", planId)
                .single();
              const p = plan as any;

              const periodEnd = new Date();
              if (p?.interval?.startsWith("month")) {
                periodEnd.setMonth(periodEnd.getMonth() + 1);
              } else {
                periodEnd.setFullYear(periodEnd.getFullYear() + 1);
              }

              // Extend period and refresh credits
              await supabaseAdmin
                .from("user_subscriptions")
                .update({
                  status: "active",
                  current_period_end: periodEnd.toISOString(),
                  ai_credits_reset_at: periodEnd.toISOString(),
                  will_renew: true,
                } as any)
                .eq("razorpay_subscription_id" as any, rzpSubId);

              if (p?.ai_credits_monthly) {
                await supabaseAdmin.from("ai_credits").upsert(
                  {
                    user_id: userId,
                    credits_remaining: p.ai_credits_monthly,
                    credits_used: 0,
                    updated_at: new Date().toISOString(),
                  },
                  { onConflict: "user_id" },
                );
              }

              await supabaseAdmin.from("subscription_events").insert({
                subscription_id: null,
                user_id: userId,
                event_type: "SUBSCRIPTION_RENEWED",
                payload: {
                  razorpay_subscription_id: rzpSubId,
                  plan_id: planId,
                  amount_inr: amountInr,
                  payment_id: paymentEntity?.id,
                },
              });

              console.log(`[rzp-sub-webhook] Renewal charged ₹${amountInr} for sub ${rzpSubId}`);
              break;
            }

            // ── subscription.pending ───────────────────────────────────────
            // Payment failed — Razorpay will auto-retry T+1, T+2, T+3 days
            case "subscription.pending": {
              await supabaseAdmin
                .from("user_subscriptions")
                .update({ status: "past_due" } as any)
                .eq("razorpay_subscription_id" as any, rzpSubId);

              await supabaseAdmin.from("subscription_events").insert({
                subscription_id: null,
                user_id: userId || null,
                event_type: "SUBSCRIPTION_PAYMENT_FAILED",
                payload: {
                  razorpay_subscription_id: rzpSubId,
                  note: "Auto-retry scheduled by Razorpay for T+1, T+2, T+3 days",
                },
              });

              console.log(`[rzp-sub-webhook] Subscription payment pending (retrying): ${rzpSubId}`);
              break;
            }

            // ── subscription.halted ────────────────────────────────────────
            // Payment failed after all retries — subscription paused
            case "subscription.halted": {
              await supabaseAdmin
                .from("user_subscriptions")
                .update({ status: "past_due" } as any)
                .eq("razorpay_subscription_id" as any, rzpSubId);

              await supabaseAdmin.from("subscription_events").insert({
                subscription_id: null,
                user_id: userId || null,
                event_type: "SUBSCRIPTION_HALTED",
                payload: {
                  razorpay_subscription_id: rzpSubId,
                  note: "All retries exhausted. Customer must update payment method.",
                },
              });

              console.log(`[rzp-sub-webhook] Subscription halted: ${rzpSubId}`);
              break;
            }

            // ── subscription.cancelled ─────────────────────────────────────
            case "subscription.cancelled": {
              await supabaseAdmin
                .from("user_subscriptions")
                .update({ status: "cancelled", will_renew: false } as any)
                .eq("razorpay_subscription_id" as any, rzpSubId);

              await supabaseAdmin.from("subscription_events").insert({
                subscription_id: null,
                user_id: userId || null,
                event_type: "SUBSCRIPTION_CANCELLED",
                payload: { razorpay_subscription_id: rzpSubId },
              });

              console.log(`[rzp-sub-webhook] Subscription cancelled: ${rzpSubId}`);
              break;
            }

            // ── subscription.completed ─────────────────────────────────────
            case "subscription.completed": {
              await supabaseAdmin
                .from("user_subscriptions")
                .update({ status: "expired", will_renew: false } as any)
                .eq("razorpay_subscription_id" as any, rzpSubId);

              await supabaseAdmin.from("subscription_events").insert({
                subscription_id: null,
                user_id: userId || null,
                event_type: "SUBSCRIPTION_COMPLETED",
                payload: { razorpay_subscription_id: rzpSubId },
              });

              console.log(`[rzp-sub-webhook] Subscription completed: ${rzpSubId}`);
              break;
            }

            // ── subscription.paused ────────────────────────────────────────
            case "subscription.paused": {
              await supabaseAdmin
                .from("user_subscriptions")
                .update({ status: "paused" } as any)
                .eq("razorpay_subscription_id" as any, rzpSubId);
              break;
            }

            // ── subscription.resumed ───────────────────────────────────────
            case "subscription.resumed": {
              await supabaseAdmin
                .from("user_subscriptions")
                .update({ status: "active" } as any)
                .eq("razorpay_subscription_id" as any, rzpSubId);
              break;
            }

            default:
              console.log(`[rzp-sub-webhook] Unhandled event: ${event}`);
          }
        } catch (err) {
          console.error(`[rzp-sub-webhook] Error handling ${event}:`, err);
        }

        return new Response(JSON.stringify({ received: true, event }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
