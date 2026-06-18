import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const CASHFREE_API = "https://api.cashfree.com/pg";
const CASHFREE_API_VERSION = "2023-08-01";

export const createCashfreeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { amountInr: number; email?: string }) =>
    z.object({ amountInr: z.number(), email: z.string().optional() }).parse(d),
  )
  .handler(async ({ data: { amountInr, email }, context }) => {
    if (!context.userId) throw new Error("Unauthorized");

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;

    if (!appId || !secretKey) {
      throw new Error("Cashfree credentials not configured on the server.");
    }

    const orderId = `ord_${context.userId}_${Date.now()}`;

    const res = await fetch(`${CASHFREE_API}/orders`, {
      method: "POST",
      headers: {
        "x-api-version": CASHFREE_API_VERSION,
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: amountInr,
        order_currency: "INR",
        customer_details: {
          customer_id: context.userId,
          customer_email: email || `${context.userId.slice(0, 8)}@learnify.app`,
          customer_phone: "9999999999",
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Cashfree order failed: ${err}`);
    }

    const data = await res.json();
    return {
      payment_session_id: data.payment_session_id,
      order_id: data.order_id,
      order_amount: data.order_amount,
    };
  });

export const verifyCashfreePayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { amountInr: number; method: string; cashfree_order_id: string }) =>
    z.object({
      amountInr: z.number(),
      method: z.string(),
      cashfree_order_id: z.string(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    if (!context.userId) throw new Error("Unauthorized");

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    if (!appId || !secretKey) throw new Error("Cashfree credentials missing");

    const res = await fetch(`${CASHFREE_API}/orders/${data.cashfree_order_id}`, {
      method: "GET",
      headers: {
        "x-api-version": CASHFREE_API_VERSION,
        "x-client-id": appId,
        "x-client-secret": secretKey,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Cashfree verification failed: ${err}`);
    }

    const orderData = await res.json();

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existingTx } = await supabaseAdmin
      .from("wallet_transactions")
      .select("id")
      .eq("description", `Top-up via ${data.method} (Cashfree: ${data.cashfree_order_id})`)
      .maybeSingle();

    if (orderData.order_status === "PAID") {
      if (existingTx) return { success: true, already_processed: true };
      const { error } = await supabaseAdmin.from("wallet_transactions").insert({
        user_id: context.userId,
        amount_inr: data.amountInr,
        type: "credit",
        status: "completed",
        description: `Top-up via ${data.method} (Cashfree: ${data.cashfree_order_id})`,
      });
      if (error) throw new Error(error.message);
      return { success: true };
    }

    if (existingTx) return { success: true, already_processed: true };
    const { error } = await supabaseAdmin.from("wallet_transactions").insert({
      user_id: context.userId,
      amount_inr: data.amountInr,
      type: "credit",
      status: "pending",
      description: `Top-up via ${data.method} (Cashfree: ${data.cashfree_order_id})`,
    });
    if (error) throw new Error(error.message);
    return { success: true, pending: true };
  });
