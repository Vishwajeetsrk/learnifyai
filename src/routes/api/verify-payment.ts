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

          // Process 'order.paid' event
          if (payload.event === "order.paid") {
            const orderObj = payload.payload?.order?.entity;
            const paymentObj = payload.payload?.payment?.entity;

            if (orderObj && paymentObj) {
              const orderId = orderObj.id;
              const paymentId = paymentObj.id;
              const amountInr = Number(orderObj.amount) / 100;
              const userId = orderObj.notes?.userId;

              if (userId) {
                try {
                  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
                  
                  // Check if this transaction has already been recorded to prevent double crediting
                  const description = `Top-up via Razorpay Webhook (Order: ${orderId}, Payment: ${paymentId})`;
                  const { data: existingTx } = await supabaseAdmin
                    .from("wallet_transactions")
                    .select("id")
                    .eq("description", description)
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
                      console.log(`[verify-payment webhook] Successfully credited ₹${amountInr} to user ${userId}`);
                    }
                  }
                } catch (dbErr) {
                  console.error("[verify-payment webhook] Database error:", dbErr);
                }
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

        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount_inr } = body;

        // Validate missing fields
        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
          return new Response(
            JSON.stringify({
              error: "Missing required fields: razorpay_payment_id, razorpay_order_id, and razorpay_signature are required.",
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        // Verify checkout signature
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
          console.error("Razorpay secret key is not configured.");
          return new Response(
            JSON.stringify({ error: "Razorpay credentials are not configured on the server." }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        const expectedSignature = createHmac("sha256", secret)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest("hex");

        if (expectedSignature !== razorpay_signature) {
          return new Response(
            JSON.stringify({ error: "Payment verification failed. Signature mismatch." }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        // Credit user's wallet (idempotency check using client details)
        const user = await getAuthenticatedUser(request);
        if (user && amount_inr) {
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
