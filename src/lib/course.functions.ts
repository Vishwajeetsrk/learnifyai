import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

/* ---------------- Checkout: wallet → enrollment ---------------- */

export type CouponDef = {
  type: "percent" | "flat";
  value: number;
  label: string;
  active?: boolean;
};

// Fallback hardcoded coupons used only when DB fetch fails
const FALLBACK_COUPONS: Record<string, CouponDef> = {
  WELCOME10: { type: "percent", value: 10, label: "10% off" },
  LEARN20: { type: "percent", value: 20, label: "20% off" },
  STUDENT25: { type: "percent", value: 25, label: "25% student discount" },
};

async function loadCoupons(supabase: any): Promise<Record<string, CouponDef>> {
  try {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "coupons")
      .maybeSingle();
    if (data?.value) {
      const parsed = JSON.parse(data.value as string) as Array<CouponDef & { code: string }>;
      const map: Record<string, CouponDef> = {};
      for (const c of parsed) {
        if (c.active !== false)
          map[c.code.toUpperCase()] = { type: c.type, value: c.value, label: c.label };
      }
      return Object.keys(map).length > 0 ? map : FALLBACK_COUPONS;
    }
  } catch {
    /* fallback */
  }
  return FALLBACK_COUPONS;
}

/** Server fn to fetch active coupons for the cart page */
export const getActiveCoupons = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return loadCoupons(supabaseAdmin);
});

function computeDiscount(
  subtotal: number,
  coupons: Record<string, CouponDef>,
  code?: string | null,
): { discount: number; coupon: string | null } {
  if (!code) return { discount: 0, coupon: null };
  const c = coupons[code.trim().toUpperCase()];
  if (!c) return { discount: 0, coupon: null };
  const raw = c.type === "percent" ? Math.floor((subtotal * c.value) / 100) : c.value;
  return { discount: Math.min(raw, subtotal), coupon: code.trim().toUpperCase() };
}

export const checkoutCart = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        coupon: z.string().max(32).optional().nullable(),
        skipWallet: z.boolean().optional(),
      })
      .parse(d ?? {}),
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

    const allCoupons = await loadCoupons(supabase);
    const subtotal = items.reduce((s: number, c: any) => s + Number(c.courses?.price_inr ?? 0), 0);
    const { discount, coupon } = computeDiscount(subtotal, allCoupons, data.coupon);
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

    if (!data.skipWallet) {
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
    }

    // Check plan course limit before enrolling
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await checkCourseLimit(supabaseAdmin, userId);

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
      const { error: earnErr } = await supabaseAdmin
        .from("wallet_transactions")
        .insert(earningRows);
      if (earnErr) throw new Error(earnErr.message);
    }

    // Clear cart
    await supabase.from("cart_items").delete().eq("user_id", userId).in("course_id", courseIds);

    // Send enrollment confirmation emails (fire-and-forget)
    const enrolledCourses = items.map((c: any) => ({
      title: c.courses?.title || "Course",
      slug: c.courses?.slug as string | undefined,
    }));
    sendEnrollmentEmails(userId, enrolledCourses);

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

async function getActivePlanLimit(supabaseAdmin: any, userId: string): Promise<number> {
  const { data: sub } = await supabaseAdmin
    .from("user_subscriptions")
    .select("plan:pricing_plans(max_courses)")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();
  if (!sub?.plan?.max_courses) return -1;
  return Number(sub.plan.max_courses);
}

async function isAdminUser(supabaseAdmin: any, userId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["super_admin", "admin"]);
  return !!data?.length;
}

async function checkCourseLimit(supabaseAdmin: any, userId: string): Promise<void> {
  if (await isAdminUser(supabaseAdmin, userId)) return;
  const maxCourses = await getActivePlanLimit(supabaseAdmin, userId);
  if (maxCourses < 0) return;
  const { count } = await supabaseAdmin
    .from("enrollments")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  if (count != null && count >= maxCourses) {
    throw new Error(
      `Your plan allows up to ${maxCourses} courses. Upgrade to Pro for unlimited access.`,
    );
  }
}

/* ---------------- Enroll free course directly ---------------- */
export const enrollFree = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ courseId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: course, error } = await supabase
      .from("courses")
      .select("id, price_inr")
      .eq("id", data.courseId)
      .single();
    if (error) throw new Error(error.message);
    if (Number(course.price_inr) > 0) throw new Error("This is a paid course — add it to cart.");
    await checkCourseLimit(supabaseAdmin, userId);
    const { error: e2 } = await supabase
      .from("enrollments")
      .upsert(
        { user_id: userId, course_id: data.courseId, status: "active", progress_pct: 0 },
        { onConflict: "user_id,course_id" },
      );
    if (e2) throw new Error(e2.message);

    // Send enrollment confirmation email (fire-and-forget)
    const { data: courseInfo } = await supabase
      .from("courses")
      .select("title, slug")
      .eq("id", data.courseId)
      .maybeSingle();
    if (courseInfo) sendEnrollmentEmails(userId, [{ title: courseInfo.title, slug: courseInfo.slug }]);

    return { ok: true };
  });

export const markCourseStarted = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
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
  .validator((d: unknown) => z.object({ courseId: z.string().uuid() }).parse(d))
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

/* ---------------- Suggest course category ---------------- */
export const suggestCourseCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        title: z.string().max(300),
        description: z.string().max(2000).optional(),
      })
      .parse(d ?? {}),
  )
  .handler(async ({ data }) => {
    const { callUserAiChat } = await import("@/lib/user-ai");

    const SYSTEM = `You are a curriculum categorizer. Analyze the course title and description, then suggest a single, most fitting category name.
If possible, match or adapt to one of these standard categories:
- Development
- Design
- Marketing
- AI & Data
- Business
- Personal Growth

If none fit perfectly, suggest a custom 1-3 word capitalized category (e.g. "Finance", "Cybersecurity"). Respond with ONLY the category name. No explanations, no punctuation, no surrounding text.`;

    const prompt = `Course Title: "${data.title}"\nDescription: "${data.description ?? ""}"`;

    try {
      const res = await callUserAiChat({
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
      });

      if (!res.ok) throw new Error(`AI suggestion failed with status ${res.status}`);
      const json = await res.json();
      const text = (json.choices?.[0]?.message?.content ?? "").trim();
      const category = text.replace(/^["']|["']$/g, "").trim();
      return { category: category || "Development" };
    } catch (err: any) {
      console.error("suggestCourseCategory error:", err);
      return { category: "Development" };
    }
  });

/* ---------------- Enrollment email (fire-and-forget) ---------------- */

async function sendEnrollmentEmails(
  userId: string,
  courses: Array<{ title: string; slug?: string }>,
) {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile } = await (supabaseAdmin as any)
      .from("profiles")
      .select("email, full_name")
      .eq("id", userId)
      .maybeSingle();
    if (!profile?.email) return;

    const { data: tpl } = await (supabaseAdmin as any)
      .from("email_templates")
      .select("subject, html_body")
      .eq("id", "course_enrolled")
      .maybeSingle();

    const name = profile.full_name || "Learner";
    const courseList = courses
      .map(
        (c) =>
          `<li style="padding:6px 0;color:#334155"><strong>${escapeHtml(c.title)}</strong>${c.slug ? ` — <a href="${process.env.VITE_APP_URL || "https://learnifyaitool.vercel.app"}/courses/${c.slug}" style="color:#4f46e5">View Course</a>` : ""}</li>`,
      )
      .join("");

    let subject: string;
    let html: string;

    if (tpl) {
      const render = (s: string, vars: Record<string, string>) =>
        Object.entries(vars).reduce((out, [k, v]) => out.replace(new RegExp(`{{${k}}}`, "g"), v), s);
      subject = render(tpl.subject, { name, course_title: courses[0]?.title || "Course" });
      html = render(tpl.html_body, {
        name,
        course_title: courses[0]?.title || "Course",
        course_url: `${process.env.VITE_APP_URL || "https://learnifyaitool.vercel.app"}/courses/${courses[0]?.slug || ""}`,
      });
    } else {
      subject = `You're enrolled! ${courses.length > 1 ? `${courses.length} courses` : courses[0]?.title}`;
      html = `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f4f5fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a"><table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5fb;padding:32px 12px"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:18px;overflow:hidden"><tr><td style="background:linear-gradient(135deg,#0f1b3d,#1e3a8a,#4f46e5);padding:32px;text-align:center"><div style="color:#fde68a;font-size:11px;letter-spacing:.35em;text-transform:uppercase;font-weight:700">Learnify AI</div></td></tr><tr><td style="padding:36px 32px"><h1 style="margin:0 0 12px;font-size:24px;color:#0f172a">You're enrolled! 🎉</h1><p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.6">Hi ${escapeHtml(name)}, you've been enrolled in:</p><ul style="list-style:none;padding:0;margin:0 0 24px">${courseList}</ul><div style="text-align:center;margin-top:28px"><a href="${process.env.VITE_APP_URL || "https://learnifyaitool.vercel.app"}/dashboard" style="display:inline-block;background:#4f46e5;color:#fff;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px">Go to Dashboard</a></div></td></tr><tr><td style="padding:20px 32px;text-align:center;color:#94a3b8;font-size:12px;border-top:1px solid #f1f5f9">© ${new Date().getFullYear()} Learnify AI</td></tr></table></td></tr></table></body></html>`;
    }

    // Fire-and-forget — don't block enrollment on email
    const { default: nodemailer } = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: process.env.GMAIL_EMAIL, pass: process.env.GMAIL_APP_PASSWORD },
    });
    await transporter.sendMail({
      from: `"Learnify AI" <${process.env.GMAIL_EMAIL}>`,
      to: profile.email,
      subject,
      html,
    });
  } catch (err) {
    console.error("[EnrollmentEmail] Failed (non-blocking):", err);
  }
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
