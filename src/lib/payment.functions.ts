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
    z
      .object({
        amountInr: z.number(),
        method: z.string(),
        cashfree_order_id: z.string(),
      })
      .parse(d),
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

    throw new Error(
      "Payment not confirmed by Cashfree. Order status: " + (orderData.order_status || "unknown"),
    );
  });

export const processCashfreePayout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { amountInr: number; method: string; destination: string }) =>
    z.object({ amountInr: z.number(), method: z.string(), destination: z.string() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    if (!context.userId) throw new Error("Unauthorized");

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    if (!appId || !secretKey) throw new Error("Cashfree credentials not configured");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Check wallet balance
    const { data: txs } = await supabaseAdmin
      .from("wallet_transactions")
      .select("amount_inr, type, status")
      .eq("user_id", context.userId);
    const completed = (txs ?? []).filter((t) => t.status === "completed");
    const balance = completed.reduce(
      (s, t) => s + (t.type === "credit" ? Number(t.amount_inr) : -Number(t.amount_inr)),
      0,
    );
    if (data.amountInr > balance) throw new Error("Insufficient wallet balance");

    // Debit wallet immediately
    const { error: txErr } = await supabaseAdmin.from("wallet_transactions").insert({
      user_id: context.userId,
      amount_inr: data.amountInr,
      type: "debit",
      status: "completed",
      description: `Withdrawal via Cashfree · ${data.method}`,
    });
    if (txErr) throw new Error(txErr.message);

    // Create withdrawal request record
    const { error: wdErr } = await supabaseAdmin.from("creator_withdrawals").insert({
      user_id: context.userId,
      amount_inr: data.amountInr,
      method: data.method,
      destination: { details: data.destination },
      status: "pending",
    });
    if (wdErr) throw new Error(wdErr.message);

    // Initiate Cashfree Payouts transfer
    const transferId = `wtd_${context.userId.slice(0, 8)}_${Date.now()}`;
    const payoutRes = await fetch("https://api.cashfree.com/payouts/transfers", {
      method: "POST",
      headers: {
        "x-api-version": "2024-01-01",
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transfer_id: transferId,
        transfer_amount: data.amountInr,
        transfer_currency: "INR",
        transfer_mode: data.method === "upi" ? "upi" : "banktransfer",
        transfer_details: {
          ...(data.method === "upi" ? { upi: { upi_id: data.destination } } : {}),
        },
      }),
    });

    if (!payoutRes.ok) {
      const errText = await payoutRes.text();
      console.error("Cashfree payout failed:", errText);
      return {
        success: true,
        pending: true,
        note: "Withdrawal recorded. Payout will be processed manually.",
      };
    }

    await supabaseAdmin
      .from("creator_withdrawals")
      .update({
        status: "paid",
        processed_at: new Date().toISOString(),
        processed_by: context.userId,
      })
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(1);

    return { success: true };
  });
