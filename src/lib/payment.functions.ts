import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const CASHFREE_API_VERSION = "2023-08-01";
function getCashfreeApi() {
  const appId = process.env.CASHFREE_APP_ID || "";
  return appId.startsWith("TEST") || appId.includes("sandbox")
    ? "https://sandbox.cashfree.com/pg"
    : "https://api.cashfree.com/pg";
}

async function checkWalletTopupPermission(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const userRoles = (roles ?? []).map((r: any) => r.role);
  const allowed = ["creator", "coach", "admin", "super_admin"];
  const hasPermission = userRoles.some((r: any) => allowed.includes(r));
  if (!hasPermission) {
    throw new Error("Only creators, coaches, and admins can top up their wallet.");
  }
}

export const createCashfreeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { amountInr: number; email?: string }) =>
    z.object({ amountInr: z.number(), email: z.string().optional() }).parse(d),
  )
  .handler(async ({ data: { amountInr, email }, context }) => {
    if (!context.userId) throw new Error("Unauthorized");
    await checkWalletTopupPermission(context.userId);

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;

    if (!appId || !secretKey) {
      throw new Error("Cashfree credentials not configured on the server.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("phone, full_name, email")
      .eq("id", context.userId)
      .maybeSingle();
    const customerPhone = (profile as any)?.phone || "9918231234";
    const customerName = (profile as any)?.full_name || "Vishwajeet Kumar";
    const customerEmail = email || (profile as any)?.email || "vishwajeetsrk@gmail.com";

    const orderId = `ord_${context.userId}_${Date.now()}`;

    const res = await fetch(`${getCashfreeApi()}/orders`, {
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
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      if (errText.includes("not enabled or approved") || errText.includes("whitelist")) {
        throw new Error(
          "Cashfree Domain Whitelisting Required: Domain 'https://www.learnifyai.in/' is pending approval. Please whitelist it in Cashfree Merchant Dashboard > Developers > Whitelisting.",
        );
      }
      throw new Error(`Cashfree order failed: ${errText}`);
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
  .validator((d: { amountInr: number; method: string; cashfree_order_id: string }) =>
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
    await checkWalletTopupPermission(context.userId);

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    if (!appId || !secretKey) throw new Error("Cashfree credentials missing");

    const res = await fetch(`${getCashfreeApi()}/orders/${data.cashfree_order_id}`, {
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

    // STRICT SECURITY CHECK 1: Ensure order customer_id matches current authenticated user ID
    const cashfreeCustomerId = orderData.customer_details?.customer_id;
    if (!cashfreeCustomerId || cashfreeCustomerId !== context.userId) {
      throw new Error("Security Error: Cashfree order customer ID mismatch.");
    }

    // STRICT SECURITY CHECK 2: Ensure order amount matches requested verification amount
    if (Math.abs(Number(orderData.order_amount) - Number(data.amountInr)) > 0.01) {
      throw new Error("Security Error: Cashfree order amount mismatch.");
    }

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
  .validator((d: { amountInr: number; method: string; destination: string }) =>
    z.object({ amountInr: z.number(), method: z.string(), destination: z.string() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    if (!context.userId) throw new Error("Unauthorized");

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

    // Check minimum payout threshold
    if (data.amountInr < 500) throw new Error("Minimum withdrawal amount is ₹500");

    // Debit wallet immediately
    const { error: txErr } = await supabaseAdmin.from("wallet_transactions").insert({
      user_id: context.userId,
      amount_inr: data.amountInr,
      type: "debit",
      status: "completed",
      description: `Withdrawal queued · ${data.method}`,
    });
    if (txErr) throw new Error(txErr.message);

    // Queue withdrawal for weekly batch processing
    const { error: wdErr } = await (supabaseAdmin as any).from("creator_withdrawals").insert({
      user_id: context.userId,
      amount_inr: data.amountInr,
      method: data.method,
      destination: { details: data.destination },
      status: "pending",
      is_batched: true,
    });
    if (wdErr) throw new Error(wdErr.message);

    return {
      success: true,
      pending: true,
      note: "Withdrawal queued for weekly batch processing. Funds arrive within 5–7 business days.",
    };
  });

export const processPendingPayouts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    if (!appId || !secretKey) throw new Error("Cashfree credentials not configured");

    // Fetch all pending batched withdrawals
    const { data: pending } = await (supabaseAdmin as any)
      .from("creator_withdrawals")
      .select("*")
      .eq("status", "pending")
      .eq("is_batched", true)
      .order("created_at", { ascending: true });

    if (!pending || pending.length === 0) return { processed: 0, note: "No pending payouts." };

    let processed = 0;
    let failed = 0;

    for (const wd of pending) {
      const dest = wd.destination as any;
      const transferId = `wtd_${wd.user_id.slice(0, 8)}_${Date.now()}_${processed}`;

      try {
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
            transfer_amount: wd.amount_inr,
            transfer_currency: "INR",
            transfer_mode: wd.method === "upi" ? "upi" : "banktransfer",
            transfer_details: {
              ...(wd.method === "upi"
                ? { upi: { upi_id: dest?.details } }
                : (() => {
                    const parts = (dest?.details || "").split(" · ");
                    const name = parts[0] || "Recipient";
                    const account_number = parts[1] || "";
                    const ifsc = parts[2] || "";
                    return {
                      bank_account: {
                        account_number,
                        ifsc,
                        name,
                      },
                    };
                  })()),
            },
          }),
        });

        if (!payoutRes.ok) {
          const errText = await payoutRes.text();
          console.error(`Cashfree payout failed for ${wd.id}:`, errText);
          failed++;
          continue;
        }

        await supabaseAdmin
          .from("creator_withdrawals")
          .update({
            status: "paid",
            processed_at: new Date().toISOString(),
            processed_by: context.userId,
          })
          .eq("id", wd.id);

        processed++;
      } catch (e) {
        console.error(`Payout error for ${wd.id}:`, e);
        failed++;
      }
    }

    return {
      processed,
      failed,
      note: `Batch processed: ${processed} paid, ${failed} failed.`,
    };
  });
