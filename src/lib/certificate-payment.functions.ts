import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;
const CERT_PRICE_INR = 49;

// ─── Create a ₹49 Razorpay order for a certificate ───────────────────────────
export const createCertificateOrder = createServerFn({ method: "POST" })
  .validator(z.object({ data: z.object({ courseId: z.string().uuid() }) }))
  .handler(async ({ data: { data } }) => {
    const { courseId } = data;

    // Verify auth
    const authHeader = (globalThis as any).__requestHeaders__?.get?.("authorization") || "";
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authErr || !user) throw new Error("Unauthorized");

    // Check if already paid
    const { data: existing } = await supabase
      .from("certificate_payments")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .eq("status", "paid")
      .maybeSingle();
    if (existing) return { already_paid: true };

    // Check active subscription — Pro/Career Pro users don't need to pay
    const { data: sub } = await supabase
      .from("user_subscriptions")
      .select("*, plan:pricing_plans(name)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();
    const planName = (sub as any)?.plan?.name?.toLowerCase() || "free";
    if (planName !== "free") return { subscription_included: true };

    // Create Razorpay order via API
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
    const receipt = `cert_${user.id.slice(0, 8)}_${courseId.slice(0, 8)}`;
    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: CERT_PRICE_INR * 100, // paise
        currency: "INR",
        receipt,
        notes: { user_id: user.id, course_id: courseId, type: "certificate" },
      }),
    });
    if (!rzpRes.ok) {
      const err = await rzpRes.text();
      throw new Error(`Razorpay order creation failed: ${err}`);
    }
    const order = await rzpRes.json();

    // Upsert pending payment record
    await supabase.from("certificate_payments").upsert(
      {
        user_id: user.id,
        course_id: courseId,
        amount_inr: CERT_PRICE_INR,
        razorpay_order_id: order.id,
        status: "pending",
      },
      { onConflict: "user_id,course_id", ignoreDuplicates: false },
    );

    return {
      order_id: order.id,
      key_id: RAZORPAY_KEY_ID,
      amount_inr: CERT_PRICE_INR,
    };
  });

// ─── Verify Razorpay payment and unlock certificate ───────────────────────────
export const verifyCertificatePayment = createServerFn({ method: "POST" })
  .validator(
    z.object({
      data: z.object({
        courseId: z.string().uuid(),
        razorpay_order_id: z.string(),
        razorpay_payment_id: z.string(),
        razorpay_signature: z.string(),
      }),
    }),
  )
  .handler(async ({ data: { data } }) => {
    const { courseId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

    // Verify HMAC signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");
    if (expected !== razorpay_signature) throw new Error("Invalid payment signature");

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Auth
    const authHeader = (globalThis as any).__requestHeaders__?.get?.("authorization") || "";
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authErr || !user) throw new Error("Unauthorized");

    // Update payment record to paid
    const { error: updateErr } = await supabase
      .from("certificate_payments")
      .update({
        status: "paid",
        razorpay_payment_id,
        razorpay_signature,
      })
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .eq("razorpay_order_id", razorpay_order_id);
    if (updateErr) throw new Error(updateErr.message);

    return { success: true };
  });

// ─── Check if user has paid for a certificate (or has subscription) ───────────
export const checkCertificateAccess = createServerFn({ method: "POST" })
  .validator(z.object({ data: z.object({ courseIds: z.array(z.string().uuid()) }) }))
  .handler(async ({ data: { data } }) => {
    const { courseIds } = data;
    if (!courseIds.length) return { paidCourseIds: [], hasSubscription: false };

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const authHeader = (globalThis as any).__requestHeaders__?.get?.("authorization") || "";
    const {
      data: { user },
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (!user) return { paidCourseIds: [], hasSubscription: false };

    // Check subscription
    const { data: sub } = await supabase
      .from("user_subscriptions")
      .select("*, plan:pricing_plans(name)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();
    const planName = (sub as any)?.plan?.name?.toLowerCase() || "free";
    const hasSubscription = planName !== "free";

    if (hasSubscription) return { paidCourseIds: courseIds, hasSubscription: true };

    // Check paid certificates
    const { data: payments } = await supabase
      .from("certificate_payments")
      .select("course_id")
      .eq("user_id", user.id)
      .eq("status", "paid")
      .in("course_id", courseIds);

    return {
      paidCourseIds: (payments ?? []).map((p: any) => p.course_id),
      hasSubscription: false,
    };
  });
