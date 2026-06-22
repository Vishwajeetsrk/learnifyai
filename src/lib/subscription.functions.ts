import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const CF_API_VERSION = "2025-01-01";

function getCashfreeApi() {
  const appId = process.env.CASHFREE_APP_ID || "";
  return appId.startsWith("TEST") || appId.includes("sandbox")
    ? "https://sandbox.cashfree.com/pg"
    : "https://api.cashfree.com/pg";
}

function getCreds() {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  if (!appId || !secretKey) throw new Error("Cashfree credentials not configured");
  return { appId, secretKey };
}

function cfHeaders(appId: string, secretKey: string, idempotencyKey?: string) {
  const headers: Record<string, string> = {
    "x-api-version": CF_API_VERSION,
    "x-client-id": appId,
    "x-client-secret": secretKey,
    "Content-Type": "application/json",
  };
  if (idempotencyKey) {
    headers["x-idempotency-key"] = idempotencyKey;
  }
  return headers;
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
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

  const res = await fetch(`${getCashfreeApi()}/plans`, {
    method: "POST",
    headers: cfHeaders(appId, secretKey),
    body: JSON.stringify({
      plan_id: cfPlanId,
      plan_name: p.name,
      plan_type: "PERIODIC",
      plan_currency: "INR",
      plan_recurring_amount: p.price_inr,
      plan_max_amount: p.price_inr * 12,
      plan_max_cycles: 0,
      plan_intervals: 1,
      plan_interval_type: p.interval === "month" ? "MONTH" : "YEAR",
      plan_note: p.description || "",
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
  .inputValidator((d: { planId: string; couponCode?: string }) =>
    z.object({ planId: z.string(), couponCode: z.string().optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const uid = context.userId!;

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

    // Free plan — no Cashfree interaction needed
    if (!p.interval || p.price_inr <= 0) {
      const periodEnd = new Date();
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);

      const { error: insErr } = await (supabaseAdmin as any).from("user_subscriptions").insert({
        user_id: uid,
        plan_id: data.planId,
        status: "active",
        current_period_start: new Date().toISOString(),
        current_period_end: periodEnd.toISOString(),
        will_renew: true,
        ai_credits_reset_at: periodEnd.toISOString(),
      });
      if (insErr) throw new Error(insErr.message);

      // Assign free credits
      if (p.ai_credits_monthly) {
        await supabaseAdmin.from("ai_credits").upsert(
          {
            user_id: uid,
            credits_remaining: p.ai_credits_monthly,
            credits_used: 0,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );
      }

      // Log event
      await (supabaseAdmin as any).from("subscription_events").insert({
        subscription_id: null,
        user_id: uid,
        event_type: "FREE_PLAN_ACTIVATED",
        payload: { plan_id: data.planId, plan_name: p.name },
      });

      return { auth_link: null, subscription_id: null, free: true };
    }

    // Paid plan — sync to Cashfree if needed
    if (!p.cashfree_plan_id) {
      p.cashfree_plan_id = await doSyncPlan(data.planId);
    }

    // Apply coupon discount if provided
    let finalAmount = p.price_inr;
    if (data.couponCode) {
      const { data: coupon } = await (supabaseAdmin as any)
        .from("coupon_codes")
        .select("*")
        .eq("code", data.couponCode.toUpperCase())
        .eq("active", true)
        .maybeSingle();

      if (coupon) {
        const now = new Date().toISOString();
        if (
          (!coupon.valid_from || coupon.valid_from <= now) &&
          (!coupon.valid_until || coupon.valid_until >= now) &&
          (!coupon.max_uses || coupon.used_count < coupon.max_uses) &&
          (!coupon.applicable_plan_ids || coupon.applicable_plan_ids.includes(data.planId))
        ) {
          if (coupon.discount_percent) {
            finalAmount = Math.round(p.price_inr * (1 - coupon.discount_percent / 100));
          } else if (coupon.discount_amount_inr) {
            finalAmount = Math.max(1, p.price_inr - coupon.discount_amount_inr);
          }
          // Increment usage
          await (supabaseAdmin as any)
            .from("coupon_codes")
            .update({ used_count: coupon.used_count + 1 })
            .eq("id", coupon.id);
        }
      }
    }

    const { data: profile } = await (supabaseAdmin as any)
      .from("profiles")
      .select("full_name, email")
      .eq("id", uid)
      .single();
    const realName = profile?.full_name || uid.slice(0, 8);
    const realEmail = profile?.email || `${uid.slice(0, 8)}@learnify.app`;

    const { appId, secretKey } = getCreds();
    const subId = `sub_${uid.slice(0, 8)}_${Date.now()}`;
    const baseUrl = process.env.VITE_APP_URL || "https://learnifyaitool.vercel.app";
    const returnUrl = `${baseUrl}/pricing?subscribe=ok`;
    const notifyUrl = `${baseUrl}/api/webhooks/cashfree-subscription`;
    const idempotencyKey = `sub_create_${uid}_${data.planId}_${Date.now()}`;

    const res = await fetch(`${getCashfreeApi()}/subscriptions`, {
      method: "POST",
      headers: cfHeaders(appId, secretKey, idempotencyKey),
      body: JSON.stringify({
        subscription_id: subId,
        customer_details: {
          customer_id: uid,
          customer_name: realName,
          customer_email: realEmail,
          customer_phone: "9999999999",
        },
        plan_details: {
          plan_id: p.cashfree_plan_id,
        },
        authorization_details: {
          authorization_amount: 1,
          authorization_amount_refund: true,
          payment_methods: ["enach", "pnach", "upi", "card"],
        },
        subscription_meta: {
          return_url: returnUrl,
          notification_channel: ["EMAIL"],
        },
        subscription_expiry_time: new Date(Date.now() + 86400000).toISOString(),
        subscription_first_charge_time: new Date(Date.now() + 86400000).toISOString(),
        subscription_note: `${p.name} plan - Rs${finalAmount}/${p.interval}`,
      }),
    });

    let sub: any;

    if (!res.ok) {
      const err = await res.text();
      if (err.includes("plan_not_found") || err.toLowerCase().includes("plan does not exist")) {
        console.log(`Plan ${p.cashfree_plan_id} not found on Cashfree. Re-syncing plan...`);
        // Reset local cached plan ID
        await supabaseAdmin
          .from("pricing_plans")
          .update({ cashfree_plan_id: null } as any)
          .eq("id", data.planId);

        // Try to re-sync plan to Cashfree
        const newCfPlanId = await doSyncPlan(data.planId);

        // Retry subscription creation
        const retryRes = await fetch(`${getCashfreeApi()}/subscriptions`, {
          method: "POST",
          headers: cfHeaders(appId, secretKey, idempotencyKey + "_retry"),
          body: JSON.stringify({
            subscription_id: subId,
            customer_details: {
              customer_id: uid,
              customer_name: realName,
              customer_email: realEmail,
              customer_phone: "9999999999",
            },
            plan_details: {
              plan_id: newCfPlanId,
            },
            authorization_details: {
              authorization_amount: 1,
              authorization_amount_refund: true,
              payment_methods: ["enach", "pnach", "upi", "card"],
            },
            subscription_meta: {
              return_url: returnUrl,
              notification_channel: ["EMAIL"],
            },
            subscription_expiry_time: new Date(Date.now() + 86400000).toISOString(),
            subscription_first_charge_time: new Date(Date.now() + 86400000).toISOString(),
            subscription_note: `${p.name} plan - Rs${finalAmount}/${p.interval}`,
          }),
        });

        if (!retryRes.ok) {
          const retryErr = await retryRes.text();
          throw new Error(`Cashfree subscription creation failed after plan sync: ${retryErr}`);
        }
        sub = await retryRes.json();
      } else {
        throw new Error(`Cashfree subscription creation failed: ${err}`);
      }
    } else {
      sub = await res.json();
    }

    const periodEnd = new Date();
    if (p.interval === "month") periodEnd.setMonth(periodEnd.getMonth() + 1);
    else periodEnd.setFullYear(periodEnd.getFullYear() + 1);

    const { error: insErr } = await (supabaseAdmin as any).from("user_subscriptions").insert({
      user_id: uid,
      plan_id: data.planId,
      cashfree_subscription_id: sub.subscription_id || subId,
      cashfree_order_id: sub.cf_subscription_id || null,
      status: "pending",
      current_period_start: new Date().toISOString(),
      current_period_end: periodEnd.toISOString(),
      ai_credits_reset_at: new Date(Date.now() + 30 * 86400000).toISOString(),
    });
    if (insErr) throw new Error(insErr.message);

    return {
      auth_link: sub.subscription_session_id
        ? `https://www.cashfree.com/checkout/post/subscription?subscription_session_id=${sub.subscription_session_id}`
        : (sub as any).auth_link,
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

    if (sub.cashfree_subscription_id) {
      const { appId, secretKey } = getCreds();
      const idempotencyKey = `sub_cancel_${sub.id}_${Date.now()}`;
      await fetch(`${getCashfreeApi()}/subscriptions/${sub.cashfree_subscription_id}/manage`, {
        method: "POST",
        headers: cfHeaders(appId, secretKey, idempotencyKey),
        body: JSON.stringify({
          subscription_id: sub.cashfree_subscription_id,
          action: "CANCEL",
        }),
      }).catch(() => {});
    }

    await (supabaseAdmin as any)
      .from("user_subscriptions")
      .update({ status: "cancelled", cancelled_at: new Date().toISOString(), will_renew: false })
      .eq("id", sub.id);

    await (supabaseAdmin as any).from("subscription_events").insert({
      subscription_id: sub.id,
      user_id: context.userId,
      event_type: "SUBSCRIPTION_CANCELLED",
      payload: { plan_id: sub.plan_id },
    });

    return { ok: true };
  });

export const resumeSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: Record<string, never>) => z.object({}).parse(d))
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: sub } = await (supabaseAdmin as any)
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", context.userId)
      .in("status", ["cancelled", "paused"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!sub) throw new Error("No cancellable subscription found");

    if (sub.cashfree_subscription_id) {
      const { appId, secretKey } = getCreds();
      const idempotencyKey = `sub_resume_${sub.id}_${Date.now()}`;
      const res = await fetch(
        `${getCashfreeApi()}/subscriptions/${sub.cashfree_subscription_id}/manage`,
        {
          method: "POST",
          headers: cfHeaders(appId, secretKey, idempotencyKey),
          body: JSON.stringify({
            subscription_id: sub.cashfree_subscription_id,
            action: "RESUME",
          }),
        },
      );

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to resume subscription: ${err}`);
      }
    }

    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    await (supabaseAdmin as any)
      .from("user_subscriptions")
      .update({
        status: "active",
        will_renew: true,
        cancelled_at: null,
        current_period_start: new Date().toISOString(),
        current_period_end: periodEnd.toISOString(),
      })
      .eq("id", sub.id);

    await (supabaseAdmin as any).from("subscription_events").insert({
      subscription_id: sub.id,
      user_id: context.userId,
      event_type: "SUBSCRIPTION_RESUMED",
      payload: { plan_id: sub.plan_id },
    });

    return { ok: true };
  });

export const upgradeDowngrade = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { newPlanId: string }) => z.object({ newPlanId: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const uid = context.userId!;

    const { data: currentSub } = await (supabaseAdmin as any)
      .from("user_subscriptions")
      .select("*, plan:pricing_plans(*)")
      .eq("user_id", uid)
      .eq("status", "active")
      .maybeSingle();
    if (!currentSub) throw new Error("No active subscription to change");

    const { data: newPlan } = await supabaseAdmin
      .from("pricing_plans")
      .select("*")
      .eq("id", data.newPlanId)
      .single();
    if (!newPlan) throw new Error("Target plan not found");

    const oldPlan = currentSub.plan as any;
    const isNewPaid = newPlan.interval && (newPlan.price_inr || 0) > 0;
    const isDowngrade = (newPlan.price_inr || 0) < (oldPlan.price_inr || 0);

    // If upgrading to paid plan, create new Cashfree subscription
    if (isNewPaid && !newPlan.cashfree_plan_id) {
      await doSyncPlan(data.newPlanId);
      const { data: refreshed } = await supabaseAdmin
        .from("pricing_plans")
        .select("cashfree_plan_id")
        .eq("id", data.newPlanId)
        .single();
      (newPlan as any).cashfree_plan_id = (refreshed as any)?.cashfree_plan_id;
    }

    // For upgrade: cancel old, create new
    if (currentSub.cashfree_subscription_id) {
      const { appId, secretKey } = getCreds();
      await fetch(
        `${getCashfreeApi()}/subscriptions/${currentSub.cashfree_subscription_id}/manage`,
        {
          method: "POST",
          headers: cfHeaders(appId, secretKey),
          body: JSON.stringify({
            subscription_id: currentSub.cashfree_subscription_id,
            action: "CANCEL",
          }),
        },
      ).catch(() => {});
    }

    await (supabaseAdmin as any)
      .from("user_subscriptions")
      .update({ status: "cancelled", will_renew: false })
      .eq("id", currentSub.id);

    // If new plan is free, activate immediately
    if (!isNewPaid) {
      const periodEnd = new Date();
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);

      await (supabaseAdmin as any).from("user_subscriptions").insert({
        user_id: uid,
        plan_id: data.newPlanId,
        status: "active",
        current_period_start: new Date().toISOString(),
        current_period_end: periodEnd.toISOString(),
        will_renew: true,
        ai_credits_reset_at: periodEnd.toISOString(),
      });

      if (newPlan.ai_credits_monthly) {
        await supabaseAdmin.from("ai_credits").upsert(
          {
            user_id: uid,
            credits_remaining: newPlan.ai_credits_monthly,
            credits_used: 0,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );
      }

      await (supabaseAdmin as any).from("subscription_events").insert({
        subscription_id: null,
        user_id: uid,
        event_type: "PLAN_CHANGED",
        payload: { old_plan_id: currentSub.plan_id, new_plan_id: data.newPlanId, type: "downgrade_to_free" },
      });

      return { auth_link: null, free: true };
    }

    // For paid plan, redirect to Cashfree checkout
    return await createSubscription({
      data: { planId: data.newPlanId },
      context: { userId: uid },
    } as any);
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

export const getUserInvoices = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await (supabaseAdmin as any)
      .from("invoices")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(50);
    return data || [];
  });

export const getSubscriptionHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await (supabaseAdmin as any)
      .from("user_subscriptions")
      .select("*, plan:pricing_plans(name, price_inr, interval)")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(20);
    return data || [];
  });

export const savePlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => z.object({ plan: z.any() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const plan = data.plan;
    if (plan.id) {
      const { error } = await supabaseAdmin.from("pricing_plans").update(plan).eq("id", plan.id);
      if (error) throw new Error(error.message);
    } else {
      const { id: pid, ...rest } = plan;
      const { error } = await supabaseAdmin.from("pricing_plans").insert(rest);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deletePlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => z.object({ planId: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("pricing_plans").delete().eq("id", data.planId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getAdminSubscriptionAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: plans } = await (supabaseAdmin as any)
      .from("subscription_analytics")
      .select("*");

    const { data: recentSubs } = await (supabaseAdmin as any)
      .from("user_subscriptions")
      .select("*, plan:pricing_plans(name, price_inr), profiles:user_id(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(20);

    const { data: recentPayments } = await (supabaseAdmin as any)
      .from("payment_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    const totalMrr = (plans || []).reduce((sum: number, p: any) => sum + (p.mrr || 0), 0);
    const totalArr = totalMrr * 12;
    const totalSubscribers = (plans || []).reduce(
      (sum: number, p: any) => sum + (p.active_subscribers || 0),
      0,
    );

    // Fetch last 30 days of paid invoices for revenue chart
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: dailyInvoices } = await (supabaseAdmin as any)
      .from("invoices")
      .select("total_inr, created_at")
      .eq("status", "paid")
      .gte("created_at", thirtyDaysAgo);

    // Fetch last 30 days of subscriptions for growth chart
    const { data: dailySubs } = await supabaseAdmin
      .from("user_subscriptions")
      .select("created_at, status")
      .gte("created_at", thirtyDaysAgo);

    // Group by day
    const revenueMap: Record<string, number> = {};
    const subMap: Record<string, number> = {};

    // Initialize map keys for last 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      revenueMap[dateStr] = 0;
      subMap[dateStr] = 0;
    }

    if (dailyInvoices) {
      for (const inv of dailyInvoices) {
        const dateStr = new Date(inv.created_at).toISOString().split("T")[0];
        if (revenueMap[dateStr] !== undefined) {
          revenueMap[dateStr] += Number(inv.total_inr || 0);
        }
      }
    }

    if (dailySubs) {
      for (const s of dailySubs) {
        const dateStr = new Date(s.created_at).toISOString().split("T")[0];
        if (subMap[dateStr] !== undefined) {
          subMap[dateStr] += 1;
        }
      }
    }

    const revenueHistory = Object.entries(revenueMap).map(([date, revenue]) => ({
      date: new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      revenue,
    }));

    const subscriberHistory = Object.entries(subMap).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      count,
    }));

    return {
      plans: plans || [],
      recentSubscriptions: recentSubs || [],
      recentPayments: recentPayments || [],
      mrr: totalMrr,
      arr: totalArr,
      totalSubscribers,
      revenueHistory,
      subscriberHistory,
    };
  });

