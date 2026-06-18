import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function verifyCashfreeWebhook(
  rawBody: string,
  signature: string | null,
): Promise<boolean> {
  if (!signature) return false;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  if (!secretKey) return false;
  const expected = createHmac("sha256", secretKey).update(rawBody, "utf8").digest("base64");
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export const Route = createFileRoute("/api/webhooks/cashfree")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = await request.clone().text();
        const signature = request.headers.get("x-webhook-signature");

        if (!(await verifyCashfreeWebhook(rawBody, signature))) {
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: any;
        try {
          payload = JSON.parse(rawBody);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const eventType = payload.type;
        const order = payload.data?.order;
        const payment = payload.data?.payment;

        if (!order || eventType !== "ORDER_PAID") {
          return new Response(JSON.stringify({ received: true }), {
            headers: { "Content-Type": "application/json" },
          });
        }

        const orderId = order.order_id;
        const customerId = order.customer_details?.customer_id;
        const amount = order.order_amount;
        const paymentMethod = payment?.payment_group ?? payment?.payment_method ?? "unknown";
        const cfPaymentId = String(payment?.cf_payment_id ?? "");

        if (!customerId || !orderId || !amount) {
          return new Response("Missing order data", { status: 400 });
        }

        const userId = customerId;

        const description = `Top-up via ${paymentMethod} (Cashfree: ${orderId})`;

        const { data: existingTx } = await supabaseAdmin
          .from("wallet_transactions")
          .select("id")
          .eq("description", description)
          .maybeSingle();

        if (existingTx) {
          return new Response(JSON.stringify({ received: true, already_processed: true }), {
            headers: { "Content-Type": "application/json" },
          });
        }

        const { error } = await supabaseAdmin.from("wallet_transactions").insert({
          user_id: userId,
          amount_inr: amount,
          type: "credit",
          status: "completed",
          description,
        });

        if (error) {
          console.error("[Cashfree webhook] insert error:", error);
          return new Response(JSON.stringify({ error: "Failed to process payment" }), {
            status: 500,
          });
        }

        return new Response(JSON.stringify({ received: true }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
