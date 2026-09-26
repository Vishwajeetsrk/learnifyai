import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { executeAtomicPaymentActivation } from "@/lib/payments/gateway-factory";
import {
  sendPaymentFailedEmail,
  sendSubscriptionCancelledEmail,
} from "@/lib/subscription-email.functions";

function verifyRazorpaySignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
  if (!webhookSecret) {
    console.error("[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET or RAZORPAY_KEY_SECRET is not configured");
    return false;
  }

  try {
    const expected = createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
    return timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"));
  } catch (err) {
    console.error("[Razorpay Webhook] Error comparing signatures:", err);
    return false;
  }
}

export const Route = createFileRoute("/api/webhooks/razorpay")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(
          JSON.stringify({ status: "ok", endpoint: "razorpay", message: "Webhook endpoint active" }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      },
      HEAD: async () => {
        return new Response(null, { status: 200 });
      },
      POST: async ({ request }) => {
        const rawBody = await request.clone().text();
        const signature = request.headers.get("x-razorpay-signature");

        // 1. Strict signature verification
        if (!verifyRazorpaySignature(rawBody, signature)) {
          console.warn("[Razorpay Webhook] Signature verification failed or missing signature.");
          return new Response(JSON.stringify({ error: "Invalid signature" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        let event: any;
        try {
          event = JSON.parse(rawBody);
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const eventType: string = event.event || "";
        const payload = event.payload || {};
        const paymentEntity = payload.payment?.entity;
        const orderEntity = payload.order?.entity;
        const subscriptionEntity = payload.subscription?.entity;

        const eventId = event.id || `rzp_${Date.now()}`;
        const idempotencyKey = `wh_rzp_${eventType}_${eventId}`;

        console.log(`[Razorpay Webhook] Received ${eventType} [${eventId}]`);

        // Check if event already processed
        const { data: existingLog } = await (supabaseAdmin as any)
          .from("payment_logs")
          .select("id, status")
          .eq("idempotency_key", idempotencyKey)
          .maybeSingle();

        if (existingLog && existingLog.status === "processed") {
          return new Response(JSON.stringify({ received: true, already_processed: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          // ── PAYMENT CAPTURED / ORDER PAID ──
          if (eventType === "payment.captured" || eventType === "order.paid") {
            const notes = paymentEntity?.notes || orderEntity?.notes || {};
            let userId = notes.userId || notes.user_id;
            let planId = notes.planId || notes.plan_id;
            const billingCycle = notes.billingCycle || notes.billing_cycle || "monthly";

            const orderId = paymentEntity?.order_id || orderEntity?.id;
            const paymentId = paymentEntity?.id;
            const amountInr = (paymentEntity?.amount || orderEntity?.amount || 0) / 100;

            // If userId or planId missing in notes, look up pending record in user_subscriptions
            if (!userId || !planId) {
              const { data: pendingSub } = await (supabaseAdmin as any)
                .from("user_subscriptions")
                .select("user_id, plan_id")
                .or(`razorpay_order_id.eq.${orderId},razorpay_payment_id.eq.${paymentId}`)
                .maybeSingle();

              if (pendingSub) {
                userId = userId || pendingSub.user_id;
                planId = planId || pendingSub.plan_id;
              }
            }

            if (userId && planId) {
              await executeAtomicPaymentActivation({
                userId,
                planId,
                billingCycle,
                provider: "razorpay",
                orderId,
                paymentId,
                amountInr,
                rawStatus: paymentEntity?.status || "captured",
                currency: paymentEntity?.currency || "INR",
                metadata: { notes, eventType },
                rawEventPayload: event,
                idempotencyKey,
              });
            } else {
              console.warn("[Razorpay Webhook] Missing userId or planId for payment:", {
                orderId,
                paymentId,
                notes,
              });
            }
          }

          // ── SUBSCRIPTION CHARGED / ACTIVATED ──
          else if (
            eventType === "subscription.charged" ||
            eventType === "subscription.activated" ||
            eventType === "subscription.authenticated"
          ) {
            const subId = subscriptionEntity?.id;
            const notes = subscriptionEntity?.notes || {};
            let userId = notes.userId || notes.user_id;
            let planId = notes.planId || notes.plan_id;
            const billingCycle = notes.billingCycle || notes.billing_cycle || "monthly";
            const amountInr = (paymentEntity?.amount || 0) / 100;

            if (!userId || !planId) {
              const { data: existingSub } = await (supabaseAdmin as any)
                .from("user_subscriptions")
                .select("user_id, plan_id")
                .eq("razorpay_subscription_id", subId)
                .maybeSingle();

              if (existingSub) {
                userId = userId || existingSub.user_id;
                planId = planId || existingSub.plan_id;
              }
            }

            if (userId && planId) {
              await executeAtomicPaymentActivation({
                userId,
                planId,
                billingCycle,
                provider: "razorpay",
                subscriptionId: subId,
                paymentId: paymentEntity?.id,
                orderId: paymentEntity?.order_id,
                amountInr: amountInr || (planId.includes("career") ? 499 : 199),
                rawStatus: subscriptionEntity?.status || "active",
                currency: "INR",
                metadata: { notes, eventType },
                rawEventPayload: event,
                idempotencyKey,
              });
            }
          }

          // ── SUBSCRIPTION CANCELLED ──
          else if (eventType === "subscription.cancelled") {
            const subId = subscriptionEntity?.id;
            if (subId) {
              const { data: sub } = await (supabaseAdmin as any)
                .from("user_subscriptions")
                .select("id, user_id, current_period_end")
                .eq("razorpay_subscription_id", subId)
                .maybeSingle();

              if (sub) {
                // INVARIANT 3: Preserve access until current period end date
                await (supabaseAdmin as any)
                  .from("user_subscriptions")
                  .update({
                    status: "cancellation_scheduled",
                    auto_renew: false,
                    cancellation_requested_at: new Date().toISOString(),
                  })
                  .eq("id", sub.id);

                if (sub.user_id) {
                  sendSubscriptionCancelledEmail(
                    sub.user_id,
                    new Date(sub.current_period_end).toLocaleDateString("en-IN"),
                  ).catch((err) => console.error("Failed to send cancellation email:", err));
                }
              }
            }
          }

          // ── PAYMENT FAILED ──
          else if (eventType === "payment.failed") {
            const notes = paymentEntity?.notes || {};
            const userId = notes.userId || notes.user_id;
            const amountInr = (paymentEntity?.amount || 0) / 100;
            const errorDesc = paymentEntity?.error_description || "Payment failed";

            // INVARIANT 1 & 21: Never activate entitlement on failure. Record log and notify.
            if (userId) {
              await (supabaseAdmin as any).from("payment_logs").insert({
                user_id: userId,
                event_type: "PAYMENT_FAILED",
                status: "failed",
                amount: amountInr,
                idempotency_key: idempotencyKey,
                request_payload: {
                  provider: "razorpay",
                  payment_id: paymentEntity?.id,
                  order_id: paymentEntity?.order_id,
                  error: errorDesc,
                },
              });

              sendPaymentFailedEmail(
                userId,
                "Pro",
              ).catch((err) => console.error("Failed to send payment failed email:", err));
            }
          }

          // ── SUBSCRIPTION HALTED (RENEWAL FAILURE) ──
          else if (eventType === "subscription.halted") {
            const subId = subscriptionEntity?.id;
            if (subId) {
              // INVARIANT 4 & 22: Do not instantly drop access. Mark as renewal_failed with grace period.
              const { data: sub } = await (supabaseAdmin as any)
                .from("user_subscriptions")
                .select("id, user_id, current_period_end")
                .eq("razorpay_subscription_id", subId)
                .maybeSingle();

              if (sub) {
                await (supabaseAdmin as any)
                  .from("user_subscriptions")
                  .update({
                    status: "renewal_failed",
                    // Keep existing period end so user retains access during grace period
                  })
                  .eq("id", sub.id);

                if (sub.user_id) {
                  sendPaymentFailedEmail(
                    sub.user_id,
                    "Pro",
                  ).catch((err) => console.error("Failed to send renewal failure email:", err));
                }
              }
            }
          }

          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("[Razorpay Webhook] Processing error:", error);
          return new Response(JSON.stringify({ error: error?.message || "Webhook processing failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
