import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const CF_API = "https://api.cashfree.com/subscription";
const CF_API_VERSION = "2024-01-01";

function getCreds() {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  if (!appId || !secretKey) throw new Error("Cashfree credentials not configured");
  return { appId, secretKey };
}

function cfHeaders(appId: string, secretKey: string) {
  return {
    "x-api-version": CF_API_VERSION,
    "x-client-id": appId,
    "x-client-secret": secretKey,
    "Content-Type": "application/json",
  };
}

async function doSyncPlan(planId: string): Promise<string> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: plan } = await supabaseAdmin
    .from("pricing_plans")
    .select("*")
    .eq("id", planId)
    .single();
  const p = plan as any;
  if (!p) throw new Error("Plan not found");
  if (!p.interval || !p.price_inr || p.price_inr <= 0)
    throw new Error("Plan has no interval or price");

  const { appId, secretKey } = getCreds();
  const cfPlanId = `plan_${p.id.slice(0, 8)}`;

  const res = await fetch(`${CF_API}/plans`, {
    method: "POST",
    headers: cfHeaders(appId, secretKey),
    body: JSON.stringify({
      plan_id: cfPlanId,
      plan_name: p.name,
      plan_type: "PERIODIC",
      plan_currency: "INR",
      plan_amount: p.price_inr,
      plan_interval: {
        interval_type: p.interval === "month" ? "MONTHLY" : "YEARLY",
        interval_count: 1,
      },
      plan_note: p.description || "",
      plan_max_amount: p.price_inr * 12,
      plan_max_cycles: 0,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Cashfree plan creation failed: ${err}`);
  }

  const cf = await res.json();
  const cashfreePlanId = cf.plan_id || cfPlanId;
  await supabaseAdmin
    .from("pricing_plans")
    .update({ cashfree_plan_id: cashfreePlanId } as any)
    .eq("id", planId);

  return cashfreePlanId;
}

export const syncPlanToCashfree = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { planId: string }) => z.object({ planId: z.string() }).parse(d))
  .handler(async ({ data }) => {
    return { cashfree_plan_id: await doSyncPlan(data.planId) };
  });

export const createSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { planId: string }) => z.object({ planId: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const uid = context.userId!;

    // Check active subscription
    const { data: existing } = await (supabaseAdmin as any)
      .from("user_subscriptions")
      .select("id, status, plan_id")
      .eq("user_id", uid)
      .eq("status", "active")
      .maybeSingle();
    if (existing) throw new Error("You already have an active subscription");

    const { data: plan } = await supabaseAdmin
      .from("pricing_plans")
      .select("*")
      .eq("id", data.planId)
      .single();
    const p = plan as any;
    if (!p) throw new Error("Plan not found");

    // Auto-sync plan to Cashfree if not already synced
    if (!p.cashfree_plan_id) {
      p.cashfree_plan_id = await doSyncPlan(data.planId);
    }

    const { appId, secretKey } = getCreds();
    const subId = `sub_${uid.slice(0, 8)}_${Date.now()}`;
    const baseUrl = process.env.VITE_APP_URL || "https://learnifyaitool.vercel.app";
    const returnUrl = `${baseUrl}/pricing?subscribe=ok`;
    const notifyUrl = `${baseUrl}/api/webhooks/cashfree-subscription`;

    const res = await fetch(`${CF_API}/subscriptions`, {
      method: "POST",
      headers: cfHeaders(appId, secretKey),
      body: JSON.stringify({
        subscription_id: subId,
        plan_id: p.cashfree_plan_id,
        customer_details: {
          customer_id: uid,
          customer_email: `${uid.slice(0, 8)}@learnify.app`,
          customer_phone: "9999999999",
        },
        subscription_meta: {
          return_url: returnUrl,
          notify_url: notifyUrl,
        },
        subscription_expiry_time: new Date(Date.now() + 86400000).toISOString(),
        subscription_first_charge: 0,
        subscription_charge_linked: 1,
        subscription_note: `${p.name} plan - Rs${p.price_inr}/${p.interval}`,
        subscription_payment_method: "any",
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Cashfree subscription creation failed: ${err}`);
    }

    const sub = await res.json();

    const periodEnd = new Date();
    if (p.interval === "month") periodEnd.setMonth(periodEnd.getMonth() + 1);
    else periodEnd.setFullYear(periodEnd.getFullYear() + 1);

    const { error: insErr } = await (supabaseAdmin as any)
      .from("user_subscriptions")
      .insert({
        user_id: uid,
        plan_id: data.planId,
        cashfree_subscription_id: sub.subscription_id || subId,
        cashfree_order_id: sub.order_id || null,
        status: "active",
        current_period_end: periodEnd.toISOString(),
        ai_credits_reset_at: new Date(Date.now() + 30 * 86400000).toISOString(),
      });
    if (insErr) throw new Error(insErr.message);

    return {
      auth_link: sub.subscription_auth_link || sub.auth_link,
      subscription_id: sub.subscription_id || subId,
    };
  });

export const cancelSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: Record<string, never>) => z.object({}).parse(d))
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: sub } = await (supabaseAdmin as any)
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", context.userId)
      .eq("status", "active")
      .single();
    if (!sub) throw new Error("No active subscription found");

    const { appId, secretKey } = getCreds();

    if (sub.cashfree_subscription_id) {
      await fetch(`${CF_API}/subscriptions/${sub.cashfree_subscription_id}/cancel`, {
        method: "POST",
        headers: cfHeaders(appId, secretKey),
        body: JSON.stringify({ cancellation_reason: "User requested cancellation" }),
      }).catch(() => {});
    }

    await (supabaseAdmin as any)
      .from("user_subscriptions")
      .update({ status: "cancelled", cancelled_at: new Date().toISOString(), will_renew: false })
      .eq("id", sub.id);

    return { ok: true };
  });

export const getUserSubscription = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await (supabaseAdmin as any)
      .from("user_subscriptions")
      .select("*, plan:pricing_plans(*)")
      .eq("user_id", context.userId)
      .eq("status", "active")
      .single();
    return data || null;
  });
