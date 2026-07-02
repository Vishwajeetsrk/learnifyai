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
      plan_interval_type: p.interval?.startsWith("month") ? "MONTH" : "YEAR",
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
  .validator((d: { planId: string }) => z.object({ planId: z.string() }).parse(d))
  .handler(async ({ data }) => {
    return { cashfree_plan_id: await doSyncPlan(data.planId) };
  });

export const createSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { planId: string; couponCode?: string }) =>
    z.object({ planId: z.string(), couponCode: z.string().optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const uid = context.userId!;

    const { data: existing } = await supabaseAdmin
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

      const { error: insErr } = await supabaseAdmin.from("user_subscriptions").insert({
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
      await supabaseAdmin.from("subscription_events").insert({
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
    let appliedCoupon: string | null = null;

    // Auto-apply student discount for verified students
    if (!data.couponCode) {
      const { data: profileCheck } = await supabaseAdmin
        .from("profiles")
        .select("student_verified")
        .eq("id", uid)
        .single();
      if (profileCheck?.student_verified) {
        data.couponCode = "STUDENT25";
      }
    }

    if (data.couponCode) {
      const { data: coupon } = await supabaseAdmin
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
          appliedCoupon = data.couponCode.toUpperCase();
          // Increment usage
          await supabaseAdmin
            .from("coupon_codes")
            .update({ used_count: coupon.used_count + 1 })
            .eq("id", coupon.id);
        }
      }
    }

    const { data: profile } = await supabaseAdmin
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
    if (p.interval?.startsWith("month")) periodEnd.setMonth(periodEnd.getMonth() + 1);
    else periodEnd.setFullYear(periodEnd.getFullYear() + 1);

    const { error: insErr } = await supabaseAdmin.from("user_subscriptions").insert({
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
  .validator((d: Record<string, never>) => z.object({}).parse(d))
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: sub } = await supabaseAdmin
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

    await supabaseAdmin
      .from("user_subscriptions")
      .update({ status: "cancelled", cancelled_at: new Date().toISOString(), will_renew: false })
      .eq("id", sub.id);

    await supabaseAdmin.from("subscription_events").insert({
      subscription_id: sub.id,
      user_id: context.userId,
      event_type: "SUBSCRIPTION_CANCELLED",
      payload: { plan_id: sub.plan_id },
    });

    return { ok: true };
  });

export const resumeSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: Record<string, never>) => z.object({}).parse(d))
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: sub } = await supabaseAdmin
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

    await supabaseAdmin
      .from("user_subscriptions")
      .update({
        status: "active",
        will_renew: true,
        cancelled_at: null,
        current_period_start: new Date().toISOString(),
        current_period_end: periodEnd.toISOString(),
      })
      .eq("id", sub.id);

    await supabaseAdmin.from("subscription_events").insert({
      subscription_id: sub.id,
      user_id: context.userId,
      event_type: "SUBSCRIPTION_RESUMED",
      payload: { plan_id: sub.plan_id },
    });

    return { ok: true };
  });

export const upgradeDowngrade = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { newPlanId: string }) => z.object({ newPlanId: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const uid = context.userId!;

    const { data: currentSub } = await supabaseAdmin
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

    await supabaseAdmin
      .from("user_subscriptions")
      .update({ status: "cancelled", will_renew: false })
      .eq("id", currentSub.id);

    // If new plan is free, activate immediately
    if (!isNewPaid) {
      const periodEnd = new Date();
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);

      await supabaseAdmin.from("user_subscriptions").insert({
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

      await supabaseAdmin.from("subscription_events").insert({
        subscription_id: null,
        user_id: uid,
        event_type: "PLAN_CHANGED",
        payload: {
          old_plan_id: currentSub.plan_id,
          new_plan_id: data.newPlanId,
          type: "downgrade_to_free",
        },
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
    const { data } = await supabaseAdmin
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
    const { data } = await supabaseAdmin
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
    const { data } = await supabaseAdmin
      .from("user_subscriptions")
      .select("*, plan:pricing_plans(name, price_inr, interval)")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(20);
    return data || [];
  });

export const savePlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: any) => z.object({ plan: z.any() }).parse(d))
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
  .validator((d: any) => z.object({ planId: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("pricing_plans").delete().eq("id", data.planId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export type AnalyticsFilters = {
  dateRange: "today" | "yesterday" | "7d" | "30d" | "90d" | "180d" | "year" | "custom";
  startDate?: string;
  endDate?: string;
  reportType:
    | "revenue"
    | "subscriptions"
    | "invoices"
    | "payments"
    | "refunds"
    | "credits"
    | "ai-usage"
    | "certificates"
    | "courses"
    | "interviews"
    | "resume"
    | "ats"
    | "all";
};

function getDateRangeFilter(dateRange: string, startDate?: string, endDate?: string) {
  const now = new Date();
  let from: Date | null = null;
  let to: Date | null = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  switch (dateRange) {
    case "today":
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "yesterday":
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      to = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
      break;
    case "7d":
      from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      from = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "180d":
      from = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
      break;
    case "year":
      from = new Date(now.getFullYear(), 0, 1);
      break;
    case "custom":
      if (startDate) from = new Date(startDate);
      if (endDate) to = new Date(endDate + "T23:59:59");
      break;
    default:
      from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  }

  return {
    from: from ? from.toISOString() : null,
    to: to ? to.toISOString() : null,
    days: from ? Math.ceil((to!.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) : 30,
  };
}

export const getAdminSubscriptionAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: AnalyticsFilters) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const range = getDateRangeFilter(data.dateRange, data.startDate, data.endDate);
    const fromIso = range.from;
    const toIso = range.to;
    const days = range.days;

    // Fetch all KPIs from real DB tables with date filters
    const baseSubQuery = supabaseAdmin.from("user_subscriptions").select("*", { count: "exact", head: true });
    const dateFilteredSubQuery = fromIso
      ? baseSubQuery.gte("created_at", fromIso).lte("created_at", toIso)
      : baseSubQuery;

    const [
      { data: mrrResult },
      { count: activeSubs },
      { count: totalUsers },
      { data: plans },
      { data: recentSubs },
      { data: recentPayments },
      { data: recentInvoices },
      { data: cancelledSubs },
      { data: expiredSubs },
      { data: trialSubs },
    ] = await Promise.all([
      supabaseAdmin
        .from("user_subscriptions")
        .select("pricing_plans!inner(price_inr)", { count: "exact", head: false })
        .eq("status", "active"),
      supabaseAdmin
        .from("user_subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
      supabaseAdmin
        .from("profiles")
        .select("*", { count: "exact", head: true }),
      supabaseAdmin
        .from("pricing_plans")
        .select("id, name, price_inr, interval, cashfree_plan_id"),
      supabaseAdmin
        .from("user_subscriptions")
        .select("*, plan:pricing_plans(name, price_inr), profiles:user_id(full_name, email)")
        .order("created_at", { ascending: false })
        .limit(50),
      supabaseAdmin
        .from("payment_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50),
      supabaseAdmin
        .from("invoices")
        .select("*")
        .eq("status", "paid")
        .order("created_at", { ascending: false })
        .limit(50),
      supabaseAdmin
        .from("user_subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "cancelled"),
      supabaseAdmin
        .from("user_subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "expired"),
      supabaseAdmin
        .from("user_subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "trial"),
    ]);

    const totalMrr = (mrrResult || []).reduce((sum: number, s: any) => sum + Number(s.pricing_plans?.price_inr || 0), 0);
    const totalArr = totalMrr * 12;
    const activeSubCount = activeSubs || 0;
    const cancelledCount = cancelledSubs?.length || 0;
    const expiredCount = expiredSubs?.length || 0;
    const trialCount = trialSubs?.length || 0;
    const totalUserCount = totalUsers || 1;
    const conversionRate = totalUserCount > 0 ? Math.round((activeSubCount / totalUserCount) * 100) : 0;
    const churnRate = activeSubCount > 0 ? Math.round((cancelledCount / activeSubCount) * 100) : 0;
    const arpu = activeSubCount > 0 ? Math.round(totalMrr / activeSubCount) : 0;

    // Build plan breakdown from pricing_plans + user_subscriptions counts
    const planIds = (plans || []).map((p: any) => p.id);
    const planBreakdown = await Promise.all(
      planIds.map(async (id: string) => {
        const { count: active } = await supabaseAdmin
          .from("user_subscriptions")
          .select("*", { count: "exact", head: true })
          .eq("plan_id", id)
          .eq("status", "active");
        const { count: cancelled } = await supabaseAdmin
          .from("user_subscriptions")
          .select("*", { count: "exact", head: true })
          .eq("plan_id", id)
          .eq("status", "cancelled");
        const { count: expired } = await supabaseAdmin
          .from("user_subscriptions")
          .select("*", { count: "exact", head: true })
          .eq("plan_id", id)
          .eq("status", "expired");
        const plan = (plans || []).find((p: any) => p.id === id);
        return {
          plan_id: id,
          plan_name: plan?.name || "Unknown",
          price_inr: plan?.price_inr || 0,
          active_subscribers: active || 0,
          cancelled_count: cancelled || 0,
          expired_count: expired || 0,
          mrr: (active || 0) * (plan?.price_inr || 0),
        };
      }),
    );

    // Revenue history from invoices (uses date range)
    const chartFrom = fromIso || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: dailyInvoices } = await supabaseAdmin
      .from("invoices")
      .select("total_inr, created_at")
      .eq("status", "paid")
      .gte("created_at", chartFrom)
      .lte("created_at", toIso || new Date().toISOString())
      .order("created_at", { ascending: true });

    const revenueMap: Record<string, number> = {};
    const numDays = Math.min(Math.max(days, 1), 365);
    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      revenueMap[d.toISOString().split("T")[0]] = 0;
    }
    if (dailyInvoices) {
      for (const inv of dailyInvoices) {
        const dateStr = new Date(inv.created_at).toISOString().split("T")[0];
        if (revenueMap[dateStr] !== undefined) revenueMap[dateStr] += Number(inv.total_inr || 0);
      }
    }
    const revenueHistory = Object.entries(revenueMap).map(([date, revenue]) => ({
      date: new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      revenue,
    }));

    // Subscriber growth from user_subscriptions (uses date range)
    const { data: dailySubs } = await supabaseAdmin
      .from("user_subscriptions")
      .select("created_at")
      .gte("created_at", chartFrom)
      .lte("created_at", toIso || new Date().toISOString())
      .order("created_at", { ascending: true });

    const subMap: Record<string, number> = {};
    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      subMap[d.toISOString().split("T")[0]] = 0;
    }
    if (dailySubs) {
      for (const s of dailySubs) {
        const dateStr = new Date(s.created_at).toISOString().split("T")[0];
        if (subMap[dateStr] !== undefined) subMap[dateStr] += 1;
      }
    }
    const subscriberHistory = Object.entries(subMap).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      count,
    }));

    return {
      plans: planBreakdown,
      recentSubscriptions: recentSubs || [],
      recentPayments: recentPayments || [],
      recentInvoices: recentInvoices || [],
      mrr: totalMrr,
      arr: totalArr,
      totalSubscribers: activeSubCount,
      newSubscribers: subscriberHistory.reduce((s, d) => s + d.count, 0),
      cancelledCount,
      expiredCount,
      trialCount,
      totalUsers: totalUserCount,
      conversionRate,
      churnRate,
      arpu,
      revenueHistory,
      subscriberHistory,
    };
  });

// ─── Admin Subscription Management ───────────────────────────

export const adminUpdateSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: {
    subscriptionId: string;
    action: "activate" | "cancel" | "pause" | "extend";
    extendDays?: number;
  }) =>
    z.object({
      subscriptionId: z.string().uuid(),
      action: z.enum(["activate", "cancel", "pause", "extend"]),
      extendDays: z.number().min(1).max(365).optional(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: sub, error: fetchErr } = await supabaseAdmin
      .from("user_subscriptions")
      .select("*")
      .eq("id", data.subscriptionId)
      .single();
    if (fetchErr || !sub) throw new Error("Subscription not found");

    const now = new Date().toISOString();
    let updatePayload: any = { updated_at: now };

    switch (data.action) {
      case "activate":
        updatePayload.status = "active";
        updatePayload.current_period_start = now;
        if (!sub.current_period_end || new Date(sub.current_period_end) < new Date()) {
          const periodEnd = new Date();
          periodEnd.setMonth(periodEnd.getMonth() + 1);
          updatePayload.current_period_end = periodEnd.toISOString();
        }
        break;
      case "cancel":
        updatePayload.status = "cancelled";
        updatePayload.will_renew = false;
        break;
      case "pause":
        updatePayload.status = "paused";
        break;
      case "extend":
        if (!data.extendDays) throw new Error("extendDays required");
        const currentEnd = sub.current_period_end ? new Date(sub.current_period_end) : new Date();
        currentEnd.setDate(currentEnd.getDate() + data.extendDays);
        updatePayload.current_period_end = currentEnd.toISOString();
        updatePayload.status = "active";
        break;
    }

    const { error } = await supabaseAdmin
      .from("user_subscriptions")
      .update(updatePayload)
      .eq("id", data.subscriptionId);
    if (error) throw new Error(error.message);

    // Log the event
    await supabaseAdmin.from("subscription_events").insert({
      subscription_id: data.subscriptionId,
      user_id: sub.user_id,
      event_type: `ADMIN_${data.action.toUpperCase()}`,
      payload: { action: data.action, extendDays: data.extendDays, admin_note: "Admin action" },
    });

    return { ok: true };
  });

