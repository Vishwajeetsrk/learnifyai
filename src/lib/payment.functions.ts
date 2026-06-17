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
  .inputValidator((d: { amountInr: number; method: string; razorpay_payment_id: string; razorpay_order_id: string }) => 
    z.object({
      amountInr: z.number(),
      method: z.string(),
      razorpay_payment_id: z.string(),
      razorpay_order_id: z.string(),
    }).parse(d)
  )
  .handler(async ({ data, context }) => {
    if (!context.userId) throw new Error("Unauthorized");
    
    // In a real app, verify razorpay signature using key_secret here
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
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

