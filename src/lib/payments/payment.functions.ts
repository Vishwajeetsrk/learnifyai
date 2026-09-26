import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getPaymentProvider, executeAtomicPaymentActivation } from "./gateway-factory";
import { CANONICAL_PLANS } from "../canonical-config";
import { sendSubscriptionCancelledEmail, sendPaymentFailedEmail } from "../subscription-email.functions";

export const initiateCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        planId: z.string(),
        provider: z.enum(["razorpay", "cashfree"]).default("razorpay"),
        couponCode: z.string().optional(),
        billingCycle: z.enum(["monthly", "yearly"]).default("monthly"),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = context.userId;

    // 1. Fetch Plan Details
    const { data: dbPlan } = await (supabaseAdmin as any)
      .from("pricing_plans")
      .select("*")
      .eq("id", data.planId)
      .maybeSingle();

    const planName = dbPlan?.name || data.planId;
    const isEnterprise =
      planName.toLowerCase() === "enterprise" ||
      dbPlan?.is_custom_pricing ||
      dbPlan?.price_label?.toLowerCase() === "custom";

    if (isEnterprise) {
      return {
        isEnterprise: true,
        redirectUrl: "/contact?inquiry=enterprise",
      };
    }

    const priceInr = Number(dbPlan?.price_inr ?? 0);

    // 2. Free Plan: Immediate Free Activation (Invariant 9: 100 credits/mo)
    if (priceInr <= 0) {
      const periodEnd = new Date();
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);

      await (supabaseAdmin as any).from("user_subscriptions").upsert(
        {
          user_id: userId,
          plan_id: data.planId,
          status: "active",
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd.toISOString(),
          will_renew: false,
          ai_credits_reset_at: periodEnd.toISOString(),
        },
        { onConflict: "user_id" },
      );

      // Free user receives exactly 100 AI credits
      await (supabaseAdmin as any).from("ai_credits").upsert(
        {
          user_id: userId,
          credits_remaining: 100,
          credits_used: 0,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

      return {
        free: true,
        activated: true,
        message: "Free plan activated successfully with 100 AI credits.",
      };
    }

    // 3. User details for checkout
    const { data: profile } = await (supabaseAdmin as any)
      .from("profiles")
      .select("id, email, full_name, phone, phone_number")
      .eq("id", userId)
      .single();

    const customerEmail = profile?.email || "support.learnifyai@gmail.com";
    const customerName = profile?.full_name || "Valued Learner";
    const customerPhone = profile?.phone || profile?.phone_number || "9999999999";

    // 4. Calculate Final Amount (Check for student verification discount)
    let finalAmount = priceInr;
    let appliedCoupon = data.couponCode?.toUpperCase();

    const { data: studentCheck } = await (supabaseAdmin as any)
      .from("profiles")
      .select("student_verified")
      .eq("id", userId)
      .maybeSingle();

    if (studentCheck?.student_verified && !appliedCoupon) {
      appliedCoupon = "STUDENT20";
      finalAmount = Math.max(1, Math.round(priceInr * 0.8)); // 20% academic discount
    }

    // 5. Select Provider & Create Order (Razorpay primary, Cashfree secondary)
    const provider = getPaymentProvider(data.provider);
    const orderRef = `ord_${userId.slice(0, 8)}_${Date.now()}`;

    const orderResult = await provider.createOrder({
      userId,
      amountInr: finalAmount,
      currency: "INR",
      receiptId: orderRef,
      notes: {
        userId,
        planId: data.planId,
        billingCycle: data.billingCycle,
        couponCode: appliedCoupon || "",
      },
      customerName,
      customerEmail,
      customerPhone,
    });

    // 6. Record Pending Subscription (INVARIANT 19 & 20: Payment Pending, never Active before verified)
    const periodEnd = new Date();
    if (data.billingCycle === "yearly") {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    const subscriptionData: any = {
      user_id: userId,
      plan_id: data.planId,
      status: "pending",
      current_period_start: new Date().toISOString(),
      current_period_end: periodEnd.toISOString(),
      will_renew: true,
      ai_credits_reset_at: periodEnd.toISOString(),
    };

    if (data.provider === "razorpay") {
      subscriptionData.razorpay_order_id = orderResult.orderId;
    } else {
      subscriptionData.cashfree_order_id = orderResult.orderId;
    }

    await (supabaseAdmin as any).from("user_subscriptions").upsert(subscriptionData, {
      onConflict: "user_id",
    });

    return {
      free: false,
      provider: data.provider,
      orderId: orderResult.orderId,
      amount: finalAmount,
      currency: "INR",
      keyId: data.provider === "razorpay" ? (process.env.RAZORPAY_KEY_ID || "") : undefined,
      paymentSessionId: orderResult.paymentSessionId,
      checkoutUrl: orderResult.checkoutUrl,
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone,
      },
      notes: {
        planName,
        planId: data.planId,
      },
    };
  });

export const verifyClientPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        provider: z.enum(["razorpay", "cashfree"]),
        orderId: z.string(),
        paymentId: z.string(),
        signature: z.string(),
        planId: z.string(),
        billingCycle: z.enum(["monthly", "yearly"]).default("monthly"),
        amountInr: z.number(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const provider = getPaymentProvider(data.provider);

    // 1. Strict Server-Side Signature Verification (Invariant 16)
    const isValidSignature = await provider.verifyPaymentSignature({
      orderId: data.orderId,
      paymentId: data.paymentId,
      signature: data.signature,
    });

    if (!isValidSignature) {
      console.warn("[Payment Verification] Invalid signature rejected", data);
      throw new Error("Payment signature verification failed. Untrusted response.");
    }

    // 2. Atomic Activation
    const activation = await executeAtomicPaymentActivation({
      userId: context.userId,
      planId: data.planId,
      billingCycle: data.billingCycle,
      provider: data.provider,
      orderId: data.orderId,
      paymentId: data.paymentId,
      amountInr: data.amountInr,
      rawStatus: "success",
      currency: "INR",
      idempotencyKey: `client_verify_${data.provider}_${data.paymentId}`,
    });

    return activation;
  });

export const cancelUserSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: Record<string, never>) => z.object({}).parse(d))
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = context.userId;

    const { data: sub } = await (supabaseAdmin as any)
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    if (!sub) {
      throw new Error("No active subscription found to cancel.");
    }

    // Call provider cancel API if external subscription exists
    if (sub.razorpay_subscription_id) {
      const rzp = getPaymentProvider("razorpay");
      await rzp.cancelSubscription(sub.razorpay_subscription_id).catch((err) =>
        console.warn("[Cancel] Razorpay cancel notice:", err),
      );
    } else if (sub.cashfree_subscription_id) {
      const cf = getPaymentProvider("cashfree");
      await cf.cancelSubscription(sub.cashfree_subscription_id).catch((err) =>
        console.warn("[Cancel] Cashfree cancel notice:", err),
      );
    }

    // INVARIANT 3 & REQUIREMENT 23: Do not instantly revoke access.
    // User retains access until current_period_end.
    const accessUntil = sub.current_period_end || new Date().toISOString();

    await (supabaseAdmin as any)
      .from("user_subscriptions")
      .update({
        status: "cancellation_scheduled",
        will_renew: false,
        cancelled_at: new Date().toISOString(),
        cancellation_requested_at: new Date().toISOString(),
      })
      .eq("id", sub.id);

    // Send cancellation notice email
    sendSubscriptionCancelledEmail(
      userId,
      new Date(accessUntil).toLocaleDateString("en-IN"),
    ).catch((err) => console.error("Failed to send cancellation email:", err));

    return {
      success: true,
      message: `Your subscription is scheduled for cancellation. You will retain full access until ${new Date(accessUntil).toLocaleDateString("en-IN")}.`,
      accessUntil,
    };
  });

export const resumeUserSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: Record<string, never>) => z.object({}).parse(d))
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = context.userId;

    const { data: sub } = await (supabaseAdmin as any)
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .in("status", ["cancellation_scheduled", "cancelled", "paused"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!sub) {
      throw new Error("No recoverable subscription found.");
    }

    const now = new Date();
    const periodEnd = sub.current_period_end ? new Date(sub.current_period_end) : null;

    if (periodEnd && now > periodEnd) {
      throw new Error("This subscription has already expired. Please choose a plan to subscribe again.");
    }

    await (supabaseAdmin as any)
      .from("user_subscriptions")
      .update({
        status: "active",
        will_renew: true,
        cancelled_at: null,
      })
      .eq("id", sub.id);

    return {
      success: true,
      message: "Subscription successfully resumed. Auto-renewal has been re-enabled.",
    };
  });

export const requestRefund = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        paymentId: z.string().optional(),
        orderId: z.string().optional(),
        amountInr: z.number().positive(),
        reasonCategory: z.enum([
          "duplicate_payment",
          "unauthorized_transaction",
          "technical_failure",
          "technical_issue",
          "accidental_charge",
          "billing_error",
          "service_not_delivered",
          "service_dissatisfaction",
          "other",
        ]),
        userNotes: z.string().min(10, "Please provide at least 10 characters explaining your request."),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = context.userId;

    const { data: inserted, error } = await (supabaseAdmin as any)
      .from("billing_refunds")
      .insert({
        user_id: userId,
        amount_inr: data.amountInr,
        reason: `[${data.reasonCategory}] ${data.userNotes}`,
        status: "pending",
        metadata: {
          payment_id: data.paymentId || null,
          order_id: data.orderId || null,
          reason_category: data.reasonCategory,
          user_notes: data.userNotes,
        },
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("[Refund Request Error]", error);
      throw new Error("Failed to submit refund request. Please contact support.learnifyai@gmail.com.");
    }

    return {
      success: true,
      requestId: inserted?.id,
      message: "Your refund request has been received and will be reviewed by our admin team within 2-3 business days.",
    };
  });
