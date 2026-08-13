import { createFileRoute } from "@tanstack/react-router";
import { getAuthenticatedUser } from "@/lib/auth-helpers.server";

export const Route = createFileRoute("/api/create-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // 1. Authenticate user
        const user = await getAuthenticatedUser(request);
        if (!user) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        // 2. Parse request body
        let body: any;
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { amount, currency = "INR", receipt } = body;

        // 3. Validate amount (minimum 100 paise / ₹1)
        const paiseAmount = Number(amount);
        if (isNaN(paiseAmount) || paiseAmount < 100) {
          return new Response(
            JSON.stringify({ error: "Invalid amount. Minimum amount is 100 paise (₹1)." }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        // 4. Initialize Razorpay and create order
        try {
          const Razorpay = (await import("razorpay")).default;
          
          const keyId = process.env.RAZORPAY_KEY_ID;
          const keySecret = process.env.RAZORPAY_KEY_SECRET;

          if (!keyId || !keySecret) {
            console.error("Razorpay API credentials are not configured.");
            return new Response(
              JSON.stringify({ error: "Razorpay credentials are not configured on the server." }),
              {
                status: 500,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
          });

          const generatedReceipt = receipt || `rcpt_${user.id.slice(-8)}_${Date.now()}`;

          const order = await razorpay.orders.create({
            amount: paiseAmount,
            currency,
            receipt: generatedReceipt,
          });

          return new Response(
            JSON.stringify({
              order_id: order.id,
              amount: order.amount,
              currency: order.currency,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (err: any) {
          console.error("Razorpay API order creation error:", err);
          return new Response(
            JSON.stringify({ error: err.message || "Failed to create order via Razorpay API." }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});
