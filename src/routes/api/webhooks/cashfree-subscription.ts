import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  sendSubscriptionActivatedEmail,
  sendPaymentSuccessEmail,
  sendPaymentFailedEmail,
  sendSubscriptionCancelledEmail,
} from "@/lib/subscription-email.functions";

export const Route = createFileRoute("/api/webhooks/cashfree-subscription")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const requestId = request.headers.get("x-request-id") || `wh_${Date.now()}`;
        try {
          const body = await request.text();
          const sig = request.headers.get("x-webhook-signature") || "";
          const secretKey = process.env.CASHFREE_SECRET_KEY;

          // Signature verification
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
            if (sig !== expected) {
              console.warn("Cashfree subscription webhook: invalid signature", { requestId });
            }
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
          const orderAmount = event.data?.order?.order_amount;

          // Idempotency check
          const idempotencyKey = `wh_${eventType}_${subscriptionId || ""}_${orderId || ""}_${event.data?.subscription?.recurring_cycle?.current_cycle || ""}`;
          const { data: existingLog } = await sb
            .from("payment_logs")
            .select("id")
            .eq("idempotency_key", idempotencyKey)
            .maybeSingle();

          if (existingLog) {
            console.log("Duplicate webhook, skipping", { requestId, idempotencyKey });
            return new Response("OK", { status: 200 });
          }

          // Log the event
          await sb.from("payment_logs").insert({
            user_id: null,
            event_type: eventType,
            cashfree_event_id: event.event_id || null,
            request_payload: event,
            status: "received",
            idempotency_key: idempotencyKey,
          });

          // ── SUBSCRIPTION_CREATED ──
          if (eventType === "SUBSCRIPTION_CREATED") {
            if (subscriptionId) {
              const { data: sub } = await sb
                .from("user_subscriptions")
                .select("id, plan_id, user_id")
                .eq("cashfree_subscription_id", subscriptionId)
                .maybeSingle();

              if (sub) {
                await sb.from("user_subscriptions").update({ status: "pending" }).eq("id", sub.id);

                await sb.from("subscription_events").insert({
                  subscription_id: sub.id,
                  user_id: sub.user_id,
                  event_type: eventType,
                  payload: { subscription_id: subscriptionId },
                });
              }
            }
          }

          // ── SUBSCRIPTION_ACTIVATED / AUTHORIZATION_SUCCESS ──
          if (
            eventType === "SUBSCRIPTION_ACTIVATED" ||
            eventType === "SUBSCRIPTION_AUTHORIZATION_SUCCESS"
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
                    ai_credits_reset_at: periodEnd.toISOString(),
                  })
                  .eq("id", sub.id);

                // Assign credits
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

                // Generate invoice
                await generateInvoice(sb, sub, plan, orderAmount);

                await sb.from("subscription_events").insert({
                  subscription_id: sub.id,
                  user_id: sub.user_id,
                  event_type: eventType,
                  payload: { order_id: orderId, amount: orderAmount },
                });

                // Send activation email
                const { data: planInfo } = await sb
                  .from("pricing_plans")
                  .select("name, price_inr")
                  .eq("id", sub.plan_id)
                  .single();
                sendSubscriptionActivatedEmail(
                  sub.user_id,
                  (planInfo as any)?.name || "Pro",
                  orderAmount || (planInfo as any)?.price_inr || 0,
                ).catch((e) => console.error("Failed to send activation email:", e));

                // Update payment log user_id
                await sb
                  .from("payment_logs")
                  .update({ user_id: sub.user_id, subscription_id: sub.id, status: "processed" })
                  .eq("idempotency_key", idempotencyKey);
              }
            }
          }

          // ── PAYMENT SUCCESS / CHARGE SUCCESS ──
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

                // Reset credits
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

                // Generate invoice
                await generateInvoice(sb, sub, plan, orderAmount);

                await sb.from("subscription_events").insert({
                  subscription_id: sub.id,
                  user_id: sub.user_id,
                  event_type: eventType,
                  payload: { amount: orderAmount, order_id: orderId },
                });

                // Send payment success email
                const { data: planInfo } = await sb
                  .from("pricing_plans")
                  .select("name")
                  .eq("id", sub.plan_id)
                  .single();
                sendPaymentSuccessEmail(
                  sub.user_id,
                  (planInfo as any)?.name || "Pro",
                  orderAmount || 0,
                  periodEnd.toLocaleDateString(),
                ).catch((e) => console.error("Failed to send payment email:", e));

                await sb
                  .from("payment_logs")
                  .update({ user_id: sub.user_id, subscription_id: sub.id, status: "processed" })
                  .eq("idempotency_key", idempotencyKey);
              }
            }
          }

          // ── PAYMENT FAILED ──
          if (
            eventType === "SUBSCRIPTION_PAYMENT_FAILED" ||
            eventType === "SUBSCRIPTION_CHARGE_FAILED"
          ) {
            if (subscriptionId) {
              const { data: sub } = await sb
                .from("user_subscriptions")
                .select("id, plan_id, user_id, current_period_end")
                .eq("cashfree_subscription_id", subscriptionId)
                .maybeSingle();

              if (sub) {
                // Check grace period
                const { data: plan } = await sb
                  .from("pricing_plans")
                  .select("grace_period_days")
                  .eq("id", sub.plan_id)
                  .single();
                const graceDays = (plan as any)?.grace_period_days || 3;
                const periodEnd = new Date(sub.current_period_end || Date.now());
                const graceEnd = new Date(periodEnd.getTime() + graceDays * 86400000);

                if (new Date() > graceEnd) {
                  // Grace period expired — downgrade
                  await sb
                    .from("user_subscriptions")
                    .update({ status: "expired", will_renew: false })
                    .eq("id", sub.id);
                } else {
                  // Still in grace period
                  await sb
                    .from("user_subscriptions")
                    .update({ status: "past_due" })
                    .eq("id", sub.id);
                }

                await sb.from("subscription_events").insert({
                  subscription_id: sub.id,
                  user_id: sub.user_id,
                  event_type: eventType,
                  payload: { order_id: orderId, grace_period_end: graceEnd.toISOString() },
                });

                await sb
                  .from("payment_logs")
                  .update({ user_id: sub.user_id, subscription_id: sub.id, status: "failed" })
                  .eq("idempotency_key", idempotencyKey);

                // Send payment failed email
                const { data: planInfo } = await sb
                  .from("pricing_plans")
                  .select("name")
                  .eq("id", sub.plan_id)
                  .single();
                sendPaymentFailedEmail(sub.user_id, (planInfo as any)?.name || "Pro").catch((e) =>
                  console.error("Failed to send payment failed email:", e),
                );
              }
            }
          }

          // ── SUBSCRIPTION_CANCELLED ──
          if (eventType === "SUBSCRIPTION_CANCELLED") {
            if (subscriptionId) {
              const { data: sub } = await sb
                .from("user_subscriptions")
                .select("id, user_id")
                .eq("cashfree_subscription_id", subscriptionId)
                .maybeSingle();

              if (sub) {
                await sb
                  .from("user_subscriptions")
                  .update({
                    status: "cancelled",
                    will_renew: false,
                    cancelled_at: new Date().toISOString(),
                  })
                  .eq("id", sub.id);

                await sb.from("subscription_events").insert({
                  subscription_id: sub.id,
                  user_id: sub.user_id,
                  event_type: eventType,
                  payload: { subscription_id: subscriptionId },
                });

                // Send cancellation email
                const { data: subWithPlan } = await sb
                  .from("user_subscriptions")
                  .select("plan:pricing_plans(name)")
                  .eq("id", sub.id)
                  .single();
                sendSubscriptionCancelledEmail(
                  sub.user_id,
                  (subWithPlan?.plan as any)?.name || "Pro",
                ).catch((e) => console.error("Failed to send cancellation email:", e));
              }
            }
          }

          // ── SUBSCRIPTION_EXPIRED ──
          if (eventType === "SUBSCRIPTION_EXPIRED") {
            if (subscriptionId) {
              const { data: sub } = await sb
                .from("user_subscriptions")
                .select("id, user_id")
                .eq("cashfree_subscription_id", subscriptionId)
                .maybeSingle();

              if (sub) {
                await sb
                  .from("user_subscriptions")
                  .update({ status: "expired", will_renew: false })
                  .eq("id", sub.id);

                // Downgrade credits to starter
                await sb.from("ai_credits").upsert(
                  {
                    user_id: sub.user_id,
                    credits_remaining: 500,
                    credits_used: 0,
                    updated_at: new Date().toISOString(),
                  },
                  { onConflict: "user_id" },
                );

                await sb.from("subscription_events").insert({
                  subscription_id: sub.id,
                  user_id: sub.user_id,
                  event_type: eventType,
                  payload: { subscription_id: subscriptionId },
                });
              }
            }
          }

          // ── SUBSCRIPTION_PAUSED ──
          if (eventType === "SUBSCRIPTION_PAUSED") {
            if (subscriptionId) {
              await sb
                .from("user_subscriptions")
                .update({ status: "paused" })
                .eq("cashfree_subscription_id", subscriptionId);
            }
          }

          // ── REFUND ──
          if (eventType === "REFUND_PROCESSED" || eventType === "PAYMENT_REFUND") {
            if (orderId) {
              await sb.from("payment_logs").insert({
                event_type: eventType,
                cashfree_event_id: event.event_id || null,
                request_payload: event,
                status: "processed",
                idempotency_key: `refund_${orderId}_${Date.now()}`,
              });
            }
          }

          return new Response("OK", { status: 200 });
        } catch (err) {
          console.error("Cashfree subscription webhook error:", err, { requestId });
          // Still return 200 to prevent Cashfree retries for processing errors
          return new Response("OK", { status: 200 });
        }
      },
    },
  },
});

async function generateInvoice(
  sb: any,
  sub: { id: string; plan_id: string; user_id: string },
  plan: { ai_credits_monthly: number } | null,
  amount?: number,
) {
  try {
    const { data: planData } = await sb
      .from("pricing_plans")
      .select("name, price_inr, interval")
      .eq("id", sub.plan_id)
      .single();

    if (!planData) return;

    const now = new Date();
    const monthStr = now.toISOString().slice(0, 7).replace("-", "");
    const seq = Math.floor(Math.random() * 9000) + 1000;
    const invoiceNumber = `INV-${monthStr}-${seq}`;

    const lineItems = [
      {
        description: `${planData.name} Plan — ${planData.interval === "month" ? "Monthly" : "Yearly"}`,
        amount: amount || planData.price_inr || 0,
      },
    ];

    await sb.from("invoices").insert({
      user_id: sub.user_id,
      subscription_id: sub.id,
      invoice_number: invoiceNumber,
      amount_inr: amount || planData.price_inr || 0,
      tax_inr: 0,
      total_inr: amount || planData.price_inr || 0,
      status: "paid",
      payment_method: "subscription",
      period_start: now.toISOString(),
      period_end: new Date(now.getTime() + 30 * 86400000).toISOString(),
      line_items: lineItems,
      paid_at: now.toISOString(),
    });
  } catch (err) {
    console.error("Failed to generate invoice:", err);
  }
}
