/**
 * Learnify AI — Cashfree Payment Provider (SECONDARY)
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

const CF_PG_API_VERSION = "2023-08-01";
const CF_SUB_API_VERSION = "2025-01-01";

export class CashfreeProvider implements PaymentProvider {
  readonly name = "cashfree" as const;

  private getAppId(): string {
    const id = process.env.CASHFREE_APP_ID;
    if (!id) throw new Error("Cashfree App ID is not configured on the server.");
    return id;
  }

  private getSecretKey(): string {
    const secret = process.env.CASHFREE_SECRET_KEY;
    if (!secret) throw new Error("Cashfree Secret Key is not configured on the server.");
    return secret;
  }

  private getBaseUrl(): string {
    const appId = this.getAppId();
    return appId.startsWith("TEST") || appId.includes("sandbox")
      ? "https://sandbox.cashfree.com/pg"
      : "https://api.cashfree.com/pg";
  }

  private getHeaders(apiVersion = CF_PG_API_VERSION, idempotencyKey?: string): Record<string, string> {
    const headers: Record<string, string> = {
      "x-api-version": apiVersion,
      "x-client-id": this.getAppId(),
      "x-client-secret": this.getSecretKey(),
      "Content-Type": "application/json",
    };
    if (idempotencyKey) {
      headers["x-idempotency-key"] = idempotencyKey;
    }
    return headers;
  }

  async createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
    const orderId = params.receiptId || `ord_${params.userId.slice(0, 8)}_${Date.now()}`;
    const payload = {
      order_id: orderId,
      order_amount: params.amountInr,
      order_currency: params.currency || "INR",
      customer_details: {
        customer_id: params.userId,
        customer_name: params.customerName || "Valued Learner",
        customer_email: params.customerEmail || "support.learnifyai@gmail.com",
        customer_phone: params.customerPhone || "9918231234",
      },
      order_note: params.notes ? JSON.stringify(params.notes) : undefined,
    };

    const res = await fetch(`${this.getBaseUrl()}/orders`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      if (errText.includes("whitelist") || errText.includes("not enabled or approved")) {
        throw new Error(
          "Cashfree Domain Whitelisting: Domain pending approval in Cashfree Merchant Dashboard > Developers > Whitelisting.",
        );
      }
      throw new Error(`Cashfree order creation failed: ${errText}`);
    }

    const data = await res.json();
    return {
      provider: "cashfree",
      orderId: data.order_id,
      amountInr: data.order_amount,
      currency: "INR",
      paymentSessionId: data.payment_session_id,
      notes: params.notes,
    };
  }

  async createSubscription(params: CreateSubscriptionParams): Promise<CreateSubscriptionResult> {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Check DB plan for cashfree_plan_id
    const { data: dbPlan } = await supabaseAdmin
      .from("pricing_plans")
      .select("id, name, cashfree_plan_id, price_inr")
      .eq("id", params.planId)
      .maybeSingle();

    let cfPlanId = (dbPlan as any)?.cashfree_plan_id;

    // Create plan on Cashfree if missing
    if (!cfPlanId) {
      const newPlanId = `cf_plan_${params.planId.slice(0, 8)}_${params.amountInr}`;
      const planRes = await fetch(`${this.getBaseUrl()}/plans`, {
        method: "POST",
        headers: this.getHeaders(CF_SUB_API_VERSION),
        body: JSON.stringify({
          plan_id: newPlanId,
          plan_name: `Learnify ${params.planName.trim().slice(0, 30)}`,
          plan_type: "PERIODIC",
          plan_currency: "INR",
          plan_recurring_amount: params.amountInr,
          plan_max_amount: params.amountInr * 12,
          plan_max_cycles: 0,
          plan_intervals: 1,
          plan_interval_type: params.interval === "year" ? "YEAR" : "MONTH",
          plan_note: `Learnify AI ${params.planName} Plan`,
        }),
      });

      if (!planRes.ok) {
        const err = await planRes.text();
        throw new Error(`Cashfree plan sync failed: ${err}`);
      }

      const planData = await planRes.json();
      cfPlanId = planData.plan_id || newPlanId;

      await (supabaseAdmin as any)
        .from("pricing_plans")
        .update({ cashfree_plan_id: cfPlanId })
        .eq("id", params.planId);
    }

    const subId = `sub_${params.userId.slice(0, 8)}_${Date.now()}`;
    const baseUrl = process.env.VITE_APP_URL || "https://www.learnifyai.in";
    const returnUrl = params.returnUrl || `${baseUrl}/billing?subscribe=ok`;
    const notifyUrl = `${baseUrl}/api/webhooks/cashfree-subscription`;
    const idempotencyKey = `sub_cf_${params.userId}_${params.planId}_${Date.now()}`;

    const subRes = await fetch(`${this.getBaseUrl()}/subscriptions`, {
      method: "POST",
      headers: this.getHeaders(CF_SUB_API_VERSION, idempotencyKey),
      body: JSON.stringify({
        subscription_id: subId,
        customer_details: {
          customer_id: params.userId,
          customer_name: params.customerName || "Valued Learner",
          customer_email: params.customerEmail || "support.learnifyai@gmail.com",
          customer_phone: params.customerPhone || "9918231234",
        },
        plan_details: {
          plan_id: cfPlanId,
        },
        authorization_details: {
          authorization_amount: 1,
          authorization_amount_refund: true,
          payment_methods: ["upi", "card", "enach"],
        },
        subscription_meta: {
          return_url: returnUrl,
          notify_url: notifyUrl,
        },
      }),
    });

    if (!subRes.ok) {
      const err = await subRes.text();
      throw new Error(`Cashfree subscription failed: ${err}`);
    }

    const subData = await subRes.json();
    return {
      provider: "cashfree",
      subscriptionId: subId,
      planId: params.planId,
      amountInr: params.amountInr,
      authLink: subData.authorization_details?.payment_link || subData.auth_link,
    };
  }

  async verifyPaymentSignature(params: VerifySignatureParams): Promise<boolean> {
    if (!params.signature || !params.rawBody) return false;
    const secret = this.getSecretKey();

    try {
      const expected = crypto
        .createHmac("sha256", secret)
        .update(params.rawBody)
        .digest("hex");
      return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(params.signature));
    } catch {
      return false;
    }
  }

  async cancelSubscription(params: CancelSubscriptionParams): Promise<CancelSubscriptionResult> {
    const res = await fetch(`${this.getBaseUrl()}/subscriptions/${params.subscriptionId}/cancel`, {
      method: "POST",
      headers: this.getHeaders(CF_SUB_API_VERSION),
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn("Cashfree cancel returned non-200:", err);
    }

    return {
      success: true,
      status: "cancelled",
      message: "Cashfree mandate cancel requested. Access retained until current cycle end.",
    };
  }

  async processRefund(params: RefundParams): Promise<RefundResult> {
    const refundId = `ref_${Date.now()}`;
    const res = await fetch(`${this.getBaseUrl()}/orders/${params.paymentId}/refunds`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        refund_amount: params.amountInr,
        refund_id: refundId,
        refund_note: params.reason || "Customer refund",
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Cashfree refund error: ${err}`);
    }

    const data = await res.json();
    return {
      success: true,
      refundId: data.refund_id || refundId,
      amountInr: data.refund_amount || (params.amountInr ?? 0),
      status: data.refund_status || "SUCCESS",
      rawResponse: data,
    };
  }
}
