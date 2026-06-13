import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

/* ---------------- Checkout: wallet → enrollment ---------------- */

export const COUPONS: Record<string, { type: "percent" | "flat"; value: number; label: string }> = {
  WELCOME10: { type: "percent", value: 10, label: "10% off" },
  LEARN20: { type: "percent", value: 20, label: "20% off" },
  STUDENT25: { type: "percent", value: 25, label: "25% student discount" },
  FLAT100: { type: "flat", value: 100, label: "₹100 off" },
  FLAT500: { type: "flat", value: 500, label: "₹500 off" },
};

function computeDiscount(
  subtotal: number,
  code?: string | null,
): { discount: number; coupon: string | null } {
  if (!code) return { discount: 0, coupon: null };
  const c = COUPONS[code.trim().toUpperCase()];
  if (!c) return { discount: 0, coupon: null };
  const raw = c.type === "percent" ? Math.floor((subtotal * c.value) / 100) : c.value;
  return { discount: Math.min(raw, subtotal), coupon: code.trim().toUpperCase() };
}

export const checkoutCart = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ coupon: z.string().max(32).optional().nullable() }).parse(d ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: cart, error: cErr } = await supabase
      .from("cart_items")
      .select("course_id, courses:course_id (id, title, price_inr, slug, created_by)")
      .eq("user_id", userId);
    if (cErr) throw new Error(cErr.message);
    if (!cart || cart.length === 0) throw new Error("Cart is empty");

    // Filter out already-enrolled
    const courseIds = cart.map((c: any) => c.course_id);
    const { data: existing } = await supabase
      .from("enrollments")
      .select("course_id")
      .eq("user_id", userId)
      .in("course_id", courseIds);
    const enrolledSet = new Set((existing ?? []).map((e: any) => e.course_id));

    const items = cart.filter((c: any) => !enrolledSet.has(c.course_id));
    if (items.length === 0) {
      // clear cart, no charge
      await supabase.from("cart_items").delete().eq("user_id", userId).in("course_id", courseIds);
      return { ok: true, enrolled: 0, total: 0, slugs: [] as string[] };
    }

    const subtotal = items.reduce((s: number, c: any) => s + Number(c.courses?.price_inr ?? 0), 0);
    const { discount, coupon } = computeDiscount(subtotal, data.coupon);
    const total = Math.max(0, subtotal - discount);

    // Compute balance
    const { data: txs, error: tErr } = await supabase
      .from("wallet_transactions")
      .select("amount_inr, type, status")
      .eq("user_id", userId);
    if (tErr) throw new Error(tErr.message);
    const balance = (txs ?? [])
      .filter((t) => t.status === "completed")
      .reduce(
        (s, t) => s + (t.type === "credit" ? Number(t.amount_inr) : -Number(t.amount_inr)),
        0,
      );

    if (total > balance) {
      throw new Error(
        `Insufficient wallet balance. Need ₹${total}, have ₹${balance}. Please top up.`,
      );
    }

    // Debit (only if total > 0)
    if (total > 0) {
      const desc = `Course purchase: ${items.map((c: any) => c.courses?.title).join(", ")}${coupon ? ` (coupon ${coupon} -₹${discount})` : ""}`;
      const { error: dErr } = await supabase.from("wallet_transactions").insert({
        user_id: userId,
        amount_inr: total,
        type: "debit",
        status: "completed",
        description: desc,
      });
      if (dErr) throw new Error(dErr.message);
    }

    // Create enrollments
    const rows = items.map((c: any) => ({
      user_id: userId,
      course_id: c.course_id,
      status: "active",
      progress_pct: 0,
    }));
    const { error: eErr } = await supabase.from("enrollments").insert(rows);
    if (eErr) throw new Error(eErr.message);

    // Credit creator earnings after a successful paid enrollment.
    const earningRows: Array<{
      user_id: string;
      amount_inr: number;
      type: string;
      status: string;
      description: string;
    }> = [];
    for (const c of items) {
      const creatorId = c.courses?.created_by as string | null | undefined;
      const price = Number(c.courses?.price_inr ?? 0);
      const net =
        subtotal > 0
          ? Math.max(0, Math.round((price - (discount * price) / subtotal) * 100) / 100)
          : 0;
      if (!creatorId || creatorId === userId || net <= 0) continue;
      earningRows.push({
        user_id: creatorId,
        amount_inr: net,
        type: "credit",
        status: "completed",
        description: `Creator earning: ${c.courses?.title ?? "Course sale"}`,
      });
    }
    if (earningRows.length) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error: earnErr } = await supabaseAdmin
        .from("wallet_transactions")
        .insert(earningRows);
      if (earnErr) throw new Error(earnErr.message);
    }

    // Clear cart
    await supabase.from("cart_items").delete().eq("user_id", userId).in("course_id", courseIds);

    return {
      ok: true,
      enrolled: items.length,
      subtotal,
      discount,
      coupon,
      total,
      slugs: items.map((c: any) => c.courses?.slug).filter(Boolean) as string[],
    };
  });

/* ---------------- Enroll free course directly ---------------- */
export const enrollFree = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ courseId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: course, error } = await supabase
      .from("courses")
      .select("id, price_inr")
      .eq("id", data.courseId)
      .single();
    if (error) throw new Error(error.message);
    if (Number(course.price_inr) > 0) throw new Error("This is a paid course — add it to cart.");
    const { error: e2 } = await supabase
      .from("enrollments")
      .upsert(
        { user_id: userId, course_id: data.courseId, status: "active", progress_pct: 0 },
        { onConflict: "user_id,course_id" },
      );
    if (e2) throw new Error(e2.message);
    return { ok: true };
  });

export const markCourseStarted = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ courseId: z.string().uuid(), lessonId: z.string().uuid().optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: enrollment, error } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", data.courseId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!enrollment) throw new Error("Enroll in this course to start learning.");

    await supabase
      .from("enrollments")
      .update({ status: "active", last_activity_at: new Date().toISOString() })
      .eq("id", enrollment.id);

    if (data.lessonId) {
      const { error: pErr } = await supabase.from("lesson_progress").upsert(
        {
          user_id: userId,
          course_id: data.courseId,
          lesson_id: data.lessonId,
          watched_seconds: 1,
        },
        { onConflict: "user_id,lesson_id" },
      );
      if (pErr) throw new Error(pErr.message);
    }

    return { ok: true };
  });

/* ---------------- Update progress + auto-complete on cert ---------------- */
export const recomputeProgress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ courseId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const [{ count: total }, { count: done }, { data: cert }] = await Promise.all([
      supabase
        .from("lessons")
        .select("*", { count: "exact", head: true })
        .eq("course_id", data.courseId),
      supabase
        .from("lesson_progress")
        .select("*", { count: "exact", head: true })
        .eq("course_id", data.courseId)
        .eq("user_id", userId)
        .eq("completed", true),
      supabase
        .from("certificates")
        .select("id")
        .eq("course_id", data.courseId)
        .eq("user_id", userId)
        .maybeSingle(),
    ]);
    const pct = total && total > 0 ? Math.round(((done ?? 0) / total) * 100) : 0;
    const completed = !!cert;
    await supabase
      .from("enrollments")
      .update({
        progress_pct: pct,
        status: completed ? "completed" : "active",
        completed_at: completed ? new Date().toISOString() : null,
        last_activity_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("course_id", data.courseId);
    return { pct, completed };
  });
