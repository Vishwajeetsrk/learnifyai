import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

// Records contributions paid via the Razorpay Payment Page
// (pages.razorpay.com/learnifyaisupport). Same HMAC webhook secret as the
// subscription webhook. Ignored unless the payment carries contribution notes.
export const Route = createFileRoute("/api/webhooks/razorpay-contribution")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = await request.text();

        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!webhookSecret) {
          console.error("[rzp-contribution] RAZORPAY_WEBHOOK_SECRET not set");
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
          console.warn("[rzp-contribution] Invalid webhook signature");
          return new Response(JSON.stringify({ error: "Invalid signature" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

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
        const payment = payload.payload?.payment?.entity;
        const notes: any = payment?.notes || {};
        if (!payment) {
          return new Response(JSON.stringify({ received: true, event }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Only handle payments that declare a contribution source
        if (event !== "payment.captured" || notes.source !== "contribution") {
          return new Response(JSON.stringify({ received: true, ignored: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const reference = notes.reference || payment.id || null;
        const amountInr = Math.round(Number(payment.amount || 0) / 100);
        if (amountInr <= 0) {
          return new Response(JSON.stringify({ received: true, ignored: "no amount" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const existing = reference
            ? await supabaseAdmin
                .from("contributions")
                .select("id")
                .eq("reference", reference)
                .maybeSingle()
            : { data: null };

          if (existing?.data) {
            await supabaseAdmin
              .from("contributions")
              .update({ status: "completed", amount_inr: amountInr })
              .eq("id", existing.data.id);
          } else {
            await supabaseAdmin.from("contributions").insert({
              amount_inr: amountInr,
              status: "completed",
              reference,
              source: "razorpay_payment_page",
              donor_name: notes.donor_name || null,
              donor_email: notes.donor_email || null,
              anonymous: notes.anonymous === "true",
            });
          }
          console.log(`[rzp-contribution] Recorded ₹${amountInr} contribution (${reference})`);
        } catch (e: any) {
          console.error("[rzp-contribution] Failed to record contribution:", e?.message);
        }

        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
