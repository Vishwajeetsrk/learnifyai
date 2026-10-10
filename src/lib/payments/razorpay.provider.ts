/**
 * Learnify AI — Razorpay Payment Provider (PRIMARY)
 * 
 * Direct REST API implementation using native fetch and standard Basic Auth.
 * Zero external npm package dependencies.
 */

import crypto from "node:crypto";
import type {
  PaymentProvider,
  CreateOrderParams,
  CreateOrderResult,
  CreateSubscriptionParams,
  CreateSubscriptionResult,
  VerifySignatureParams,
  CancelSubscriptionParams,
  CancelSubscriptionResult,
  RefundParams,
  RefundResult,
} from "./provider.interface";

export class RazorpayProvider implements PaymentProvider {
  readonly name = "razorpay" as const;

  private getKeyId(): string {
    const key = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
    if (!key) throw new Error("Razorpay Key ID is not configured on the server.");
    return key;
  }

  private getKeySecret(): string {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) throw new Error("Razorpay Key Secret is not configured on the server.");
    return secret;
  }

  private getAuthHeader(): string {
    return `Basic ${Buffer.from(`${this.getKeyId()}:${this.getKeySecret()}`).toString("base64")}`;
  }

  async createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
    const amountInPaise = Math.round(params.amountInr * 100);

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: this.getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: params.currency || "INR",
        receipt: params.receiptId || `rcpt_${Date.now()}_${params.userId.slice(0, 6)}`,
        notes: {
          userId: params.userId,
          customerEmail: params.customerEmail || "",
          ...(params.notes || {}),
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Razorpay order creation failed: ${err}`);
    }

    const order = await res.json();

    return {
      provider: "razorpay",
      orderId: order.id,
      amountInr: params.amountInr,
      currency: params.currency || "INR",
      keyId: this.getKeyId(),
      notes: order.notes,
    };
  }

  async createSubscription(params: CreateSubscriptionParams): Promise<CreateSubscriptionResult> {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Fetch plan from DB to check for stored razorpay_plan_id and yearly equivalent
    const { data: dbPlan } = await (supabaseAdmin as any)
      .from("pricing_plans")
      .select("id, name, razorpay_plan_id, razorpay_yearly_plan_id, price_inr, yearly_price")
      .eq("id", params.planId)
      .maybeSingle();

    const isYearly = params.interval === "year";
    const basePrice = isYearly ? (dbPlan?.yearly_price ?? (dbPlan?.price_inr * 10)) : (dbPlan?.price_inr ?? 0);
    let rzpPlanId = isYearly ? dbPlan?.razorpay_yearly_plan_id : dbPlan?.razorpay_plan_id;
    const amountInPaise = Math.round(params.amountInr * 100);

    // If no Razorpay plan exists or discounted amount differs from base plan, create plan
    if (!rzpPlanId || (dbPlan && basePrice !== params.amountInr)) {
      const cleanPlanName = `Learnify ${params.planName.trim().slice(0, 30)} - ₹${params.amountInr}/${isYearly ? "yr" : "mo"}`;
      const planRes = await fetch("https://api.razorpay.com/v1/plans", {
        method: "POST",
        headers: {
          Authorization: this.getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          period: isYearly ? "yearly" : "monthly",
          interval: 1,
          item: {
            name: cleanPlanName,
            amount: amountInPaise,
            currency: "INR",
            description: `Learnify AI ${params.planName} Subscription`,
          },
          notes: { planId: params.planId },
        }),
      });

      if (!planRes.ok) {
        const err = await planRes.text();
        throw new Error(`Razorpay plan creation failed: ${err}`);
      }

      const createdPlan = await planRes.json();
      rzpPlanId = createdPlan.id;

      // Cache plan ID on DB if standard price
      if (dbPlan && basePrice === params.amountInr) {
        await (supabaseAdmin as any)
          .from("pricing_plans")
          .update({ [isYearly ? "razorpay_yearly_plan_id" : "razorpay_plan_id"]: rzpPlanId })
          .eq("id", params.planId);
      }
    }

    // Create the native recurring subscription
    const subRes = await fetch("https://api.razorpay.com/v1/subscriptions", {
      method: "POST",
      headers: {
        Authorization: this.getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan_id: rzpPlanId,
        total_count: params.interval === "year" ? 10 : 120, // 10 years recurring
        customer_notify: 1, // Razorpay notifies student before renewal
        notes: {
          userId: params.userId,
          planId: params.planId,
          couponCode: params.couponCode || "",
          billingCycle: params.interval === "year" ? "yearly" : "monthly",
        },
      }),
    });

    if (!subRes.ok) {
      const err = await subRes.text();
      throw new Error(`Razorpay subscription creation failed: ${err}`);
    }

    const subscription = await subRes.json();

    return {
      provider: "razorpay",
      subscriptionId: subscription.id,
      planId: params.planId,
      amountInr: params.amountInr,
      keyId: this.getKeyId(),
      shortUrl: subscription.short_url,
    };
  }

  async verifyPaymentSignature(params: VerifySignatureParams): Promise<boolean> {
    const secret = this.getKeySecret();
    const { orderId, paymentId, signature, subscriptionId } = params;

    if (!signature) return false;

    try {
      // 1. Subscription Payment Signature Verification
      if (subscriptionId && paymentId) {
        const generated = crypto
          .createHmac("sha256", secret)
          .update(`${paymentId}|${subscriptionId}`)
          .digest("hex");
        return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(generated));
      }

      // 2. Standard Order Payment Signature Verification
      if (orderId && paymentId) {
        const generated = crypto
          .createHmac("sha256", secret)
          .update(`${orderId}|${paymentId}`)
          .digest("hex");
        return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(generated));
      }

      return false;
    } catch {
      return false;
    }
  }

  async cancelSubscription(params: CancelSubscriptionParams): Promise<CancelSubscriptionResult> {
    const res = await fetch(
      `https://api.razorpay.com/v1/subscriptions/${params.subscriptionId}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: this.getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cancel_at_cycle_end: params.cancelAtPeriodEnd ? 1 : 0,
        }),
      },
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Razorpay subscription cancellation failed: ${err}`);
    }

    const sub = await res.json();

    return {
      success: true,
      status: sub.status,
      message: "Subscription cancellation scheduled",
    };
  }

  async processRefund(params: RefundParams): Promise<RefundResult> {
    const bodyObj: any = {
      notes: {
        reason: params.reason || "Admin approved refund",
      },
    };
    if (params.amountInr) {
      bodyObj.amount = Math.round(params.amountInr * 100);
    }

    const res = await fetch(
      `https://api.razorpay.com/v1/payments/${params.paymentId}/refund`,
      {
        method: "POST",
        headers: {
          Authorization: this.getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyObj),
      },
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Razorpay refund failed: ${err}`);
    }

    const refund = await res.json();

    return {
      success: true,
      refundId: refund.id,
      amountInr: (refund.amount || 0) / 100,
      status: refund.status === "processed" ? "processed" : "pending",
    };
  }
}
