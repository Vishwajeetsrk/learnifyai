import { c as createServerRpc } from "./createServerRpc-0AUf3IhG.mjs";
import { b as createServerFn } from "./server-BLOOEPZP.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BVm8xUae.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const COUPONS = {
  WELCOME10: {
    type: "percent",
    value: 10,
    label: "10% off"
  },
  LEARN20: {
    type: "percent",
    value: 20,
    label: "20% off"
  },
  STUDENT25: {
    type: "percent",
    value: 25,
    label: "25% student discount"
  },
  FLAT100: {
    type: "flat",
    value: 100,
    label: "₹100 off"
  },
  FLAT500: {
    type: "flat",
    value: 500,
    label: "₹500 off"
  }
};
function computeDiscount(subtotal, code) {
  if (!code) return {
    discount: 0,
    coupon: null
  };
  const c = COUPONS[code.trim().toUpperCase()];
  if (!c) return {
    discount: 0,
    coupon: null
  };
  const raw = c.type === "percent" ? Math.floor(subtotal * c.value / 100) : c.value;
  return {
    discount: Math.min(raw, subtotal),
    coupon: code.trim().toUpperCase()
  };
}
const checkoutCart_createServerFn_handler = createServerRpc({
  id: "f966471f0f8d772914e7079bb4c6bdb7b3bdc0b3bbf083e774838addc510cd74",
  name: "checkoutCart",
  filename: "src/lib/course.functions.ts"
}, (opts) => checkoutCart.__executeServer(opts));
const checkoutCart = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  coupon: stringType().max(32).optional().nullable()
}).parse(d ?? {})).handler(checkoutCart_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: cart,
    error: cErr
  } = await supabase.from("cart_items").select("course_id, courses:course_id (id, title, price_inr, slug, created_by)").eq("user_id", userId);
  if (cErr) throw new Error(cErr.message);
  if (!cart || cart.length === 0) throw new Error("Cart is empty");
  const courseIds = cart.map((c) => c.course_id);
  const {
    data: existing
  } = await supabase.from("enrollments").select("course_id").eq("user_id", userId).in("course_id", courseIds);
  const enrolledSet = new Set((existing ?? []).map((e) => e.course_id));
  const items = cart.filter((c) => !enrolledSet.has(c.course_id));
  if (items.length === 0) {
    await supabase.from("cart_items").delete().eq("user_id", userId).in("course_id", courseIds);
    return {
      ok: true,
      enrolled: 0,
      total: 0,
      slugs: []
    };
  }
  const subtotal = items.reduce((s, c) => s + Number(c.courses?.price_inr ?? 0), 0);
  const {
    discount,
    coupon
  } = computeDiscount(subtotal, data.coupon);
  const total = Math.max(0, subtotal - discount);
  const {
    data: txs,
    error: tErr
  } = await supabase.from("wallet_transactions").select("amount_inr, type, status").eq("user_id", userId);
  if (tErr) throw new Error(tErr.message);
  const balance = (txs ?? []).filter((t) => t.status === "completed").reduce((s, t) => s + (t.type === "credit" ? Number(t.amount_inr) : -Number(t.amount_inr)), 0);
  if (total > balance) {
    throw new Error(`Insufficient wallet balance. Need ₹${total}, have ₹${balance}. Please top up.`);
  }
  if (total > 0) {
    const desc = `Course purchase: ${items.map((c) => c.courses?.title).join(", ")}${coupon ? ` (coupon ${coupon} -₹${discount})` : ""}`;
    const {
      error: dErr
    } = await supabase.from("wallet_transactions").insert({
      user_id: userId,
      amount_inr: total,
      type: "debit",
      status: "completed",
      description: desc
    });
    if (dErr) throw new Error(dErr.message);
  }
  const rows = items.map((c) => ({
    user_id: userId,
    course_id: c.course_id,
    status: "active",
    progress_pct: 0
  }));
  const {
    error: eErr
  } = await supabase.from("enrollments").insert(rows);
  if (eErr) throw new Error(eErr.message);
  const earningRows = [];
  for (const c of items) {
    const creatorId = c.courses?.created_by;
    const price = Number(c.courses?.price_inr ?? 0);
    const net = subtotal > 0 ? Math.max(0, Math.round((price - discount * price / subtotal) * 100) / 100) : 0;
    if (!creatorId || creatorId === userId || net <= 0) continue;
    earningRows.push({
      user_id: creatorId,
      amount_inr: net,
      type: "credit",
      status: "completed",
      description: `Creator earning: ${c.courses?.title ?? "Course sale"}`
    });
  }
  if (earningRows.length) {
    const {
      supabaseAdmin
    } = await import("./client.server-BbcUHF3e.mjs");
    const {
      error: earnErr
    } = await supabaseAdmin.from("wallet_transactions").insert(earningRows);
    if (earnErr) throw new Error(earnErr.message);
  }
  await supabase.from("cart_items").delete().eq("user_id", userId).in("course_id", courseIds);
  return {
    ok: true,
    enrolled: items.length,
    subtotal,
    discount,
    coupon,
    total,
    slugs: items.map((c) => c.courses?.slug).filter(Boolean)
  };
});
const enrollFree_createServerFn_handler = createServerRpc({
  id: "38660a908ea62c5e5e1ea56cc139ed8843b00f8bfacf37baf697ab9dfdbb38fd",
  name: "enrollFree",
  filename: "src/lib/course.functions.ts"
}, (opts) => enrollFree.__executeServer(opts));
const enrollFree = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  courseId: stringType().uuid()
}).parse(d)).handler(enrollFree_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: course,
    error
  } = await supabase.from("courses").select("id, price_inr").eq("id", data.courseId).single();
  if (error) throw new Error(error.message);
  if (Number(course.price_inr) > 0) throw new Error("This is a paid course — add it to cart.");
  const {
    error: e2
  } = await supabase.from("enrollments").upsert({
    user_id: userId,
    course_id: data.courseId,
    status: "active",
    progress_pct: 0
  }, {
    onConflict: "user_id,course_id"
  });
  if (e2) throw new Error(e2.message);
  return {
    ok: true
  };
});
const markCourseStarted_createServerFn_handler = createServerRpc({
  id: "0cc2f971d05de3145f43353722b8178a645ace556cc25413698d1b3f614b3af3",
  name: "markCourseStarted",
  filename: "src/lib/course.functions.ts"
}, (opts) => markCourseStarted.__executeServer(opts));
const markCourseStarted = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  courseId: stringType().uuid(),
  lessonId: stringType().uuid().optional()
}).parse(d)).handler(markCourseStarted_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: enrollment,
    error
  } = await supabase.from("enrollments").select("id").eq("user_id", userId).eq("course_id", data.courseId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!enrollment) throw new Error("Enroll in this course to start learning.");
  await supabase.from("enrollments").update({
    status: "active",
    last_activity_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", enrollment.id);
  if (data.lessonId) {
    const {
      error: pErr
    } = await supabase.from("lesson_progress").upsert({
      user_id: userId,
      course_id: data.courseId,
      lesson_id: data.lessonId,
      watched_seconds: 1
    }, {
      onConflict: "user_id,lesson_id"
    });
    if (pErr) throw new Error(pErr.message);
  }
  return {
    ok: true
  };
});
const recomputeProgress_createServerFn_handler = createServerRpc({
  id: "e97ccf3588dd1866bb25f9a7b8f8279c126f7c27de88a0113e7ef54960811555",
  name: "recomputeProgress",
  filename: "src/lib/course.functions.ts"
}, (opts) => recomputeProgress.__executeServer(opts));
const recomputeProgress = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  courseId: stringType().uuid()
}).parse(d)).handler(recomputeProgress_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const [{
    count: total
  }, {
    count: done
  }, {
    data: cert
  }] = await Promise.all([supabase.from("lessons").select("*", {
    count: "exact",
    head: true
  }).eq("course_id", data.courseId), supabase.from("lesson_progress").select("*", {
    count: "exact",
    head: true
  }).eq("course_id", data.courseId).eq("user_id", userId).eq("completed", true), supabase.from("certificates").select("id").eq("course_id", data.courseId).eq("user_id", userId).maybeSingle()]);
  const pct = total && total > 0 ? Math.round((done ?? 0) / total * 100) : 0;
  const completed = !!cert;
  await supabase.from("enrollments").update({
    progress_pct: pct,
    status: completed ? "completed" : "active",
    completed_at: completed ? (/* @__PURE__ */ new Date()).toISOString() : null,
    last_activity_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("user_id", userId).eq("course_id", data.courseId);
  return {
    pct,
    completed
  };
});
export {
  checkoutCart_createServerFn_handler,
  enrollFree_createServerFn_handler,
  markCourseStarted_createServerFn_handler,
  recomputeProgress_createServerFn_handler
};
