import { createFileRoute } from "@tanstack/react-router";
import { getAuthenticatedUser } from "@/lib/auth-helpers.server";
import { createHmac } from "node:crypto";

export const Route = createFileRoute("/api/verify-payment")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // 1. Detect if it's a Razorpay Webhook request
        const webhookSignature = request.headers.get("x-razorpay-signature");

        if (webhookSignature) {
          const rawBody = await request.clone().text();
          const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

          if (!webhookSecret) {
            console.error("[verify-payment webhook] Razorpay webhook secret or key secret is not configured.");
            return new Response(
              JSON.stringify({ error: "Razorpay credentials are not configured on the server." }),
              {
                status: 500,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          const expectedSignature = createHmac("sha256", webhookSecret)
            .update(rawBody, "utf8")
            .digest("hex");

          // Secure timing safe comparison
          let isValid = false;
          try {
            const { timingSafeEqual } = await import("node:crypto");
            isValid = timingSafeEqual(Buffer.from(webhookSignature), Buffer.from(expectedSignature));
          } catch {
            isValid = expectedSignature === webhookSignature;
          }

          if (!isValid) {
            console.error("[verify-payment webhook] Invalid webhook signature.");
            return new Response(JSON.stringify({ error: "Invalid webhook signature" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Parse webhook body
          let payload: any;
          try {
            payload = JSON.parse(rawBody);
          } catch {
            // Return 200 to acknowledge receipt of malformed body
            return new Response(JSON.stringify({ received: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Process 'order.paid' or 'payment.captured' events
          if (payload.event === "order.paid" || payload.event === "payment.captured") {
            const orderObj = payload.payload?.order?.entity;
            const paymentObj = payload.payload?.payment?.entity;

            let orderId = orderObj?.id;
            let paymentId = paymentObj?.id;
            let amountInr = 0;
            let userId = orderObj?.notes?.userId || paymentObj?.notes?.userId;
            const notes = orderObj?.notes || paymentObj?.notes || {};

            if (payload.event === "order.paid" && orderObj && paymentObj) {
              orderId = orderObj.id;
              paymentId = paymentObj.id;
              amountInr = Number(orderObj.amount) / 100;
            } else if (payload.event === "payment.captured" && paymentObj) {
              orderId = paymentObj.order_id || orderId;
              paymentId = paymentObj.id;
              amountInr = Number(paymentObj.amount) / 100;
            }

            const isSubscription = notes.action === "subscribe";
            const planId = notes.planId;

            if (userId && isSubscription && planId && orderId) {
              try {
                const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
                
                // Check if already active
                const { data: activeSub } = await supabaseAdmin
                  .from("user_subscriptions")
                  .select("id")
                  .eq("user_id", userId)
                  .eq("status", "active")
                  .maybeSingle();

                if (!activeSub) {
                  const { data: plan } = await supabaseAdmin
                    .from("pricing_plans")
                    .select("*")
                    .eq("id", planId)
                    .single();
                  const p = plan as any;
                  if (p) {
                    const periodEnd = new Date();
                    if (p.interval === "year") {
                      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
                    } else {
                      periodEnd.setMonth(periodEnd.getMonth() + 1);
                    }

                    const { error: insErr } = await supabaseAdmin.from("user_subscriptions").insert({
                      user_id: userId,
                      plan_id: planId,
                      status: "active",
                      current_period_start: new Date().toISOString(),
                      current_period_end: periodEnd.toISOString(),
                      will_renew: true,
                      ai_credits_reset_at: periodEnd.toISOString(),
                      cashfree_order_id: orderId,
                    });

                    if (insErr) {
                      console.error("[verify-payment webhook subscription] Insert error:", insErr);
                    } else {
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
                        event_type: "SUBSCRIPTION_ACTIVATED_RAZORPAY_WEBHOOK",
                        payload: { plan_id: planId, plan_name: p.name, order_id: orderId },
                      });
                      console.log(`[verify-payment webhook subscription] Activated plan ${planId} for user ${userId} via ${payload.event}`);
                    }
                  }
                }
              } catch (dbErr) {
                console.error("[verify-payment webhook subscription] DB error:", dbErr);
              }
            } else if (userId && amountInr > 0 && paymentId && orderId) {
              try {
                const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
                
                // Check if this transaction has already been recorded to prevent double crediting
                const description = `Top-up via Razorpay Webhook (Order: ${orderId}, Payment: ${paymentId})`;
                const clientDescription = `Top-up via Razorpay (Order: ${orderId}, Payment: ${paymentId})`;
                
                const { data: existingTx } = await supabaseAdmin
                  .from("wallet_transactions")
                  .select("id")
                  .or(`description.eq."${description}",description.eq."${clientDescription}"`)
                  .maybeSingle();

                if (!existingTx) {
                  const { error: dbError } = await supabaseAdmin.from("wallet_transactions").insert({
                    user_id: userId,
                    amount_inr: amountInr,
                    type: "credit",
                    status: "completed",
                    description,
                  });

                  if (dbError) {
                    console.error("[verify-payment webhook] Failed to save transaction:", dbError);
                  } else {
                    console.log(`[verify-payment webhook] Successfully credited ₹${amountInr} to user ${userId} via ${payload.event}`);
                  }
                }
              } catch (dbErr) {
                console.error("[verify-payment webhook] Database error:", dbErr);
              }
            }
          }

          return new Response(JSON.stringify({ received: true, event: payload.event }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        // 2. Fall back to client-side modal checkout payment verification
        let body: any;
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const {
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_subscription_id,
          razorpay_signature,
          amount_inr,
        } = body;

        // Either order_id (one-time) OR subscription_id (recurring) must be present
        if (!razorpay_payment_id || !razorpay_signature || (!razorpay_order_id && !razorpay_subscription_id)) {
          return new Response(
            JSON.stringify({
              error: "Missing required fields: razorpay_payment_id + razorpay_signature + (razorpay_order_id or razorpay_subscription_id).",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        // Verify checkout signature
        // Order-based:        HMAC(order_id|payment_id)
        // Subscription-based: HMAC(payment_id|subscription_id)  ← per Razorpay docs
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
          console.error("Razorpay secret key is not configured.");
          return new Response(
            JSON.stringify({ error: "Razorpay credentials are not configured on the server." }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }

        const sigPayload = razorpay_subscription_id
          ? `${razorpay_payment_id}|${razorpay_subscription_id}`
          : `${razorpay_order_id}|${razorpay_payment_id}`;

        const expectedSignature = createHmac("sha256", secret)
          .update(sigPayload)
          .digest("hex");

        if (expectedSignature !== razorpay_signature) {
          return new Response(
            JSON.stringify({ error: "Payment verification failed. Signature mismatch." }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        // Check order details to differentiate between wallet top-ups and subscriptions
        let isSubscription = false;
        let planId = "";
        let notes: any = {};

        try {
          const Razorpay = (await import("razorpay")).default;
          const keyId = process.env.RAZORPAY_KEY_ID;
          const keySecret = process.env.RAZORPAY_KEY_SECRET;

          if (keyId && keySecret) {
            const razorpay = new Razorpay({
              key_id: keyId,
              key_secret: keySecret,
            });
            const orderDetails = await razorpay.orders.fetch(razorpay_order_id);
            notes = orderDetails.notes || {};
            if (notes.action === "subscribe") {
              isSubscription = true;
              planId = notes.planId;
            }
          }
        } catch (err) {
          console.error("[verify-payment] Error fetching order notes from Razorpay:", err);
        }

        const user = await getAuthenticatedUser(request);
        
        // Handle subscription activation
        if (user && isSubscription && planId) {
          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            
            // 1. Fetch pricing plan details
            const { data: plan } = await supabaseAdmin
              .from("pricing_plans")
              .select("*")
              .eq("id", planId)
              .single();
              
            const p = plan as any;
            if (p) {
              const periodEnd = new Date();
              if (p.interval === "year") {
                periodEnd.setFullYear(periodEnd.getFullYear() + 1);
              } else {
                periodEnd.setMonth(periodEnd.getMonth() + 1);
              }
              
              // 2. Insert or update user subscription
              const { data: activeSub } = await supabaseAdmin
                .from("user_subscriptions")
                .select("id")
                .eq("user_id", user.id)
                .eq("status", "active")
                .maybeSingle();

              if (!activeSub) {
                const { error: insErr } = await supabaseAdmin.from("user_subscriptions").insert({
                  user_id: user.id,
                  plan_id: planId,
                  status: "active",
                  current_period_start: new Date().toISOString(),
                  current_period_end: periodEnd.toISOString(),
                  will_renew: true,
                  ai_credits_reset_at: periodEnd.toISOString(),
                  cashfree_order_id: razorpay_order_id,
                });

                if (insErr) {
                  console.error("[verify-payment client subscription] Insert error:", insErr);
                } else {
                  // 3. Assign monthly AI credits
                  if (p.ai_credits_monthly) {
                    await supabaseAdmin.from("ai_credits").upsert(
                      {
                        user_id: user.id,
                        credits_remaining: p.ai_credits_monthly,
                        credits_used: 0,
                        updated_at: new Date().toISOString(),
                      },
                      { onConflict: "user_id" },
                    );
                  }
                  
                  // 4. Log event
                  await supabaseAdmin.from("subscription_events").insert({
                    subscription_id: null,
                    user_id: user.id,
                    event_type: "SUBSCRIPTION_ACTIVATED_RAZORPAY",
                    payload: { plan_id: planId, plan_name: p.name, order_id: razorpay_order_id },
                  });
                }
              }
            }
          } catch (dbErr) {
            console.error("[verify-payment client subscription] DB error:", dbErr);
          }
        }
        // Handle standard wallet top-ups
        else if (user && amount_inr) {
          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            const description = `Top-up via Razorpay (Order: ${razorpay_order_id}, Payment: ${razorpay_payment_id})`;
            
            // Check if webhook already credited it
            const webhookDescription = `Top-up via Razorpay Webhook (Order: ${razorpay_order_id}, Payment: ${razorpay_payment_id})`;
            
            const { data: existingTx } = await supabaseAdmin
              .from("wallet_transactions")
              .select("id")
              .or(`description.eq."${description}",description.eq."${webhookDescription}"`)
              .maybeSingle();

            if (!existingTx) {
              const { error: dbError } = await supabaseAdmin.from("wallet_transactions").insert({
                user_id: user.id,
                amount_inr: Number(amount_inr),
                type: "credit",
                status: "completed",
                description,
              });

              if (dbError) {
                console.error("[verify-payment client] Failed to save wallet transaction:", dbError);
              }
            }
          } catch (dbErr) {
            console.error("[verify-payment client] Database operation error:", dbErr);
          }
        }

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
