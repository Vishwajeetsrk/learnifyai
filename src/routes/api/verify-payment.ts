import { createFileRoute } from "@tanstack/react-router";
import { getAuthenticatedUser } from "@/lib/auth-helpers.server";
import { createHmac } from "node:crypto";

export const Route = createFileRoute("/api/verify-payment")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // 1. Parse request body
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

        // 2. Validate missing fields
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

        // 3. Verify signature
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

        // 4. Optionally credit user's wallet if they are authenticated and amount is provided
        const user = await getAuthenticatedUser(request);
        if (user && amount_inr) {
          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            const { error: dbError } = await supabaseAdmin.from("wallet_transactions").insert({
              user_id: user.id,
              amount_inr: Number(amount_inr),
              type: "credit",
              status: "completed",
              description: `Top-up via Razorpay (Order: ${razorpay_order_id}, Payment: ${razorpay_payment_id})`,
            });

            if (dbError) {
              console.error("[verify-payment] Failed to save wallet transaction:", dbError);
            }
          } catch (dbErr) {
            console.error("[verify-payment] Database operation error:", dbErr);
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
