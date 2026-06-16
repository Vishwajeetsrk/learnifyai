import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import Razorpay from "razorpay";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { amountInr: number }) => z.object({ amountInr: z.number() }).parse(d))
  .handler(async ({ data: { amountInr }, context }) => {
    if (!context.userId) throw new Error("Unauthorized");

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      throw new Error("RazorPay credentials not configured on the server.");
    }

    const instance = new Razorpay({ key_id, key_secret });

    const order = await instance.orders.create({
      amount: Math.round(amountInr * 100), // RazorPay expects amount in paise
      currency: "INR",
      receipt: `receipt_${context.userId}_${Date.now()}`.slice(0, 40),
    });

    return order;
  });

export const verifyWalletTopup = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { amountInr: number; method: string; razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => 
    z.object({
      amountInr: z.number(),
      method: z.string(),
      razorpay_payment_id: z.string(),
      razorpay_order_id: z.string(),
      razorpay_signature: z.string(),
    }).parse(d)
  )
  .handler(async ({ data, context }) => {
    if (!context.userId) throw new Error("Unauthorized");
    
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) throw new Error("RazorPay credentials missing");

    const crypto = await import("crypto");
    const body = data.razorpay_order_id + "|" + data.razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", key_secret).update(body).digest("hex");
    
    if (expectedSignature !== data.razorpay_signature) {
      throw new Error("Invalid payment signature. Verification failed.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    // Idempotency check
    const { data: existingTx } = await supabaseAdmin
      .from("wallet_transactions")
      .select("id")
      .eq("description", `Top-up via ${data.method} (Razorpay: ${data.razorpay_payment_id})`)
      .maybeSingle();

    if (existingTx) return { success: true, already_processed: true };

    const { error } = await supabaseAdmin.from("wallet_transactions").insert({
      user_id: context.userId,
      amount_inr: data.amountInr,
      type: "credit",
      status: "completed",
      description: `Top-up via ${data.method} (Razorpay: ${data.razorpay_payment_id})`,
    });
    
    if (error) throw new Error(error.message);
    return { success: true };
  });

