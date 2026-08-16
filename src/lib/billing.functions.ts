import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function generateInvoiceNumber(): string {
  const now = new Date();
  const yyyymm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const rand = String(Math.floor(Math.random() * 100000)).padStart(5, "0");
  return `INV-${yyyymm}-${rand}`;
}

export const getBillingOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [
      { data: paidInvoices },
      { data: mrrData },
      { count: activeSubs },
      { data: monthlyInvoices },
      { data: paymentLogs },
      { data: refunds },
      { data: creditData },
    ] = await Promise.all([
      supabaseAdmin.from("invoices").select("total_inr").eq("status", "paid"),
      supabaseAdmin
        .from("user_subscriptions")
        .select("pricing_plans!inner(price_inr)")
        .eq("status", "active"),
      supabaseAdmin
        .from("user_subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
      supabaseAdmin
        .from("invoices")
        .select("total_inr, count")
        .eq("status", "paid")
        .gte("created_at", startOfMonth),
      supabaseAdmin.from("payment_logs").select("status"),
      supabaseAdmin.from("billing_refunds").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("ai_credits").select("credits_remaining, credits_used"),
    ]);

    const totalRevenue = (paidInvoices || []).reduce(
      (sum: number, inv: any) => sum + Number(inv.total_inr || 0),
      0,
    );

    const mrr = (mrrData || []).reduce(
      (sum: number, s: any) => sum + Number(s.pricing_plans?.price_inr || 0),
      0,
    );

    const monthlyTotal = (monthlyInvoices || []).reduce(
      (sum: number, inv: any) => sum + Number(inv.total_inr || 0),
      0,
    );
    const monthlyCount = (monthlyInvoices || []).length;

    const totalPayments = (paymentLogs || []).length;
    const successfulPayments = (paymentLogs || []).filter(
      (l: any) => l.status === "success" || l.status === "paid",
    ).length;
    const paymentSuccessRate =
      totalPayments > 0 ? Math.round((successfulPayments / totalPayments) * 100) : 0;

    const totalRefunds = (refunds || []).length;
    const totalCreditsRemaining = (creditData || []).reduce(
      (sum: number, c: any) => sum + Number(c.credits_remaining || 0),
      0,
    );
    const totalCreditsUsed = (creditData || []).reduce(
      (sum: number, c: any) => sum + Number(c.credits_used || 0),
      0,
    );

    return {
      total_revenue: totalRevenue,
      mrr,
      arr: mrr * 12,
      active_subscribers: activeSubs || 0,
      invoices_this_month_count: monthlyCount,
      invoices_this_month_total: monthlyTotal,
      payment_success_rate: paymentSuccessRate,
      refund_count: totalRefunds,
      credits_remaining: totalCreditsRemaining,
      credits_used: totalCreditsUsed,
    };
  });

export const getInvoicesList = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(
    (d: {
      status?: string;
      date_from?: string;
      date_to?: string;
      search?: string;
      page?: number;
      per_page?: number;
    }) =>
      z
        .object({
          status: z.string().optional(),
          date_from: z.string().optional(),
          date_to: z.string().optional(),
          search: z.string().optional(),
          page: z.number().optional().default(1),
          per_page: z.number().optional().default(50),
        })
        .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let query = supabaseAdmin
      .from("invoices")
      .select("*, user:profiles!user_id(full_name, email)")
      .order("created_at", { ascending: false });

    if (data.status) query = query.eq("status", data.status);
    if (data.date_from) query = query.gte("created_at", data.date_from);
    if (data.date_to) query = query.lte("created_at", data.date_to);
    if (data.search) {
      query = query.or(`invoice_number.ilike.%${data.search}%,user_id.ilike.%${data.search}%`);
    }

    const from = (data.page - 1) * data.per_page;
    const to = from + data.per_page - 1;
    query = query.range(from, to);

    const { data: invoices, count } = await query;
    return { invoices: invoices || [], total: count || 0 };
  });

export const getBillingSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.from("billing_settings").select("*");
    const map: Record<string, string> = {};
    if (data) {
      for (const row of data) {
        // value is JSONB — flatten nested objects into dot-notation keys
        if (row.value && typeof row.value === "object") {
          for (const [k, v] of Object.entries(row.value)) {
            map[k] = typeof v === "string" ? v : JSON.stringify(v);
          }
        }
      }
    }
    return map;
  });

export const updateBillingSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { key: string; value: string }) =>
    z.object({ key: z.string(), value: z.string() }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Map flat keys back to their parent JSONB group
    const keyGroupMap: Record<string, string> = {
      company_name: "branding",
      legal_name: "branding",
      company_logo_url: "branding",
      logo_url: "branding",
      brand_color: "branding",
      primary_color: "branding",
      secondary_color: "branding",
      success_color: "branding",
      warning_color: "branding",
      danger_color: "branding",
      gst_enabled: "tax",
      gstin: "tax",
      cgst_rate: "tax",
      sgst_rate: "tax",
      igst_rate: "tax",
      enable_tds: "tax",
      tds_enabled: "tax",
      tds_rate: "tax",
      hsn_code: "tax",
      sac_code: "tax",
      invoice_prefix: "invoice",
      prefix: "invoice",
      invoice_footer: "invoice",
      footer: "invoice",
      invoice_terms: "invoice",
      terms: "invoice",
      invoice_currency: "invoice",
      currency: "invoice",
      show_qr: "invoice",
      watermark: "invoice",
      support_email: "support",
      support_phone: "support",
      support_address: "support",
      email: "support",
      phone: "support",
      address: "support",
      environment: "cashfree",
      connected_merchant: "cashfree",
      last_sync: "cashfree",
      webhook_url: "cashfree",
    };

    const group = keyGroupMap[data.key] || "branding";

    // Fetch existing group value
    const { data: existing } = await supabaseAdmin
      .from("billing_settings")
      .select("value")
      .eq("key", group)
      .maybeSingle();

    const existingValue =
      existing?.value && typeof existing.value === "object" ? existing.value : {};
    const newValue = { ...existingValue, [data.key]: data.value };

    const { error } = await supabaseAdmin
      .from("billing_settings")
      .upsert({ key: group, value: newValue, updated_at: new Date().toISOString() })
      .eq("key", group);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const createManualInvoice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (d: {
      user_id: string;
      total_inr: number;
      description?: string;
      line_items?: any;
      due_date?: string;
      send_email?: boolean;
    }) =>
      z
        .object({
          user_id: z.string(),
          total_inr: z.number().positive(),
          description: z.string().optional(),
          line_items: z.any().optional(),
          due_date: z.string().optional(),
          send_email: z.boolean().optional(),
        })
        .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const invoiceNumber = generateInvoiceNumber();
    const { error } = await supabaseAdmin.from("invoices").insert({
      user_id: data.user_id,
      invoice_number: invoiceNumber,
      amount_inr: data.total_inr,
      total_inr: data.total_inr,
      notes: data.description || null,
      line_items: data.line_items || null,
      due_date: data.due_date || null,
      status: "pending",
      created_at: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);

    // Send invoice created email (non-blocking) — only when requested
    if (data.send_email) {
      import("@/lib/billing-email.functions").then((m) =>
        m
          .sendInvoiceCreatedEmail(
            data.user_id,
            invoiceNumber,
            data.total_inr,
            data.due_date || "Upon receipt",
          )
          .catch((e) => console.error("Failed to send invoice email:", e)),
      );
    }

    return { invoice_number: invoiceNumber, ok: true };
  });

const InvoiceStatus = z.enum(["pending", "paid", "failed", "refunded", "void"]);

export const updateInvoice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (d: {
      id: string;
      status?: string;
      total_inr?: number;
      tax_inr?: number;
      subtotal_inr?: number;
      discount_inr?: number;
      notes?: string | null;
      terms?: string | null;
      due_date?: string | null;
      line_items?: any;
      payment_method?: string | null;
      cashfree_order_id?: string | null;
      gstin?: string | null;
    }) =>
      z
        .object({
          id: z.string().uuid(),
          status: InvoiceStatus.optional(),
          total_inr: z.number().nonnegative().optional(),
          tax_inr: z.number().nonnegative().optional(),
          subtotal_inr: z.number().nonnegative().optional(),
          discount_inr: z.number().nonnegative().optional(),
          notes: z.string().nullable().optional(),
          terms: z.string().nullable().optional(),
          due_date: z.string().nullable().optional(),
          line_items: z.any().optional(),
          payment_method: z.string().nullable().optional(),
          cashfree_order_id: z.string().nullable().optional(),
          gstin: z.string().nullable().optional(),
        })
        .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Ensure only admins/super_admins can edit invoices
    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context!.userId);
    const userRoles = (roles ?? []).map((r: any) => r.role);
    if (!userRoles.includes("super_admin") && !userRoles.includes("admin")) {
      throw new Error("Forbidden: Admin role required");
    }

    const update: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (data.status) update.status = data.status;
    if (data.total_inr !== undefined) {
      update.total_inr = data.total_inr;
      update.amount_inr = data.total_inr;
    }
    if (data.tax_inr !== undefined) update.tax_inr = data.tax_inr;
    if (data.subtotal_inr !== undefined) update.subtotal_inr = data.subtotal_inr;
    if (data.discount_inr !== undefined) update.discount_inr = data.discount_inr;
    if (data.notes !== undefined) update.notes = data.notes;
    if (data.terms !== undefined) update.terms = data.terms;
    if (data.due_date !== undefined) update.due_date = data.due_date;
    if (data.line_items !== undefined) update.line_items = data.line_items;
    if (data.payment_method !== undefined) update.payment_method = data.payment_method;
    if (data.cashfree_order_id !== undefined) update.cashfree_order_id = data.cashfree_order_id;
    if (data.gstin !== undefined) update.gstin = data.gstin;

    const { data: existing } = await supabaseAdmin
      .from("invoices")
      .select("id")
      .eq("id", data.id)
      .single();
    if (!existing) throw new Error("Invoice not found");

    const { error } = await (supabaseAdmin as any)
      .from("invoices")
      .update(update)
      .eq("id", data.id);
    if (error) throw new Error(error.message);

    // Audit log
    try {
      await (supabaseAdmin as any).from("billing_audit_logs").insert({
        user_id: context!.userId,
        action: "invoice_updated",
        entity_type: "invoice",
        entity_id: data.id,
        metadata: { fields: Object.keys(update).filter((k) => k !== "updated_at") },
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error("Failed to write billing audit log:", e);
    }

    return { ok: true };
  });

export const getPaymentLogs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: { page?: number; per_page?: number }) =>
    z
      .object({
        page: z.number().optional().default(1),
        per_page: z.number().optional().default(50),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const from = (data.page - 1) * data.per_page;
    const to = from + data.per_page - 1;
    const { data: logs, count } = await supabaseAdmin
      .from("payment_logs")
      .select("*, user:profiles!user_id(full_name, email, mobile)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);
    return { logs: logs || [], total: count || 0 };
  });

export const getRefunds = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: { page?: number; per_page?: number }) =>
    z
      .object({
        page: z.number().optional().default(1),
        per_page: z.number().optional().default(50),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const from = (data.page - 1) * data.per_page;
    const to = from + data.per_page - 1;
    const { data: refunds, count } = await supabaseAdmin
      .from("billing_refunds")
      .select("*, invoice:invoices!invoice_id(*), user:profiles!user_id(full_name, email)")
      .order("created_at", { ascending: false })
      .range(from, to);
    return { refunds: refunds || [], total: count || 0 };
  });

export const processRefund = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { invoice_id: string; amount_inr: number; reason?: string }) =>
    z
      .object({
        invoice_id: z.string(),
        amount_inr: z.number().positive(),
        reason: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Fetch invoice to validate refund policy
    const { data: invoice } = await supabaseAdmin
      .from("invoices")
      .select("user_id, invoice_number, created_at, line_items")
      .eq("id", data.invoice_id)
      .single();
    if (!invoice) throw new Error("Invoice not found");

    // Auto-approve refund policy checks
    const createdAt = new Date(invoice.created_at);
    const daysSincePurchase = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSincePurchase > 30) {
      // Outside 30-day window — manual review required
      const { error: refundErr } = await supabaseAdmin.from("billing_refunds").insert({
        invoice_id: data.invoice_id,
        amount_inr: data.amount_inr,
        reason: data.reason || null,
        status: "pending",
        user_id: context!.userId!,
        created_at: new Date().toISOString(),
      });
      if (refundErr) throw new Error(refundErr.message);
      return {
        ok: true,
        status: "pending",
        note: "Refund outside 30-day window. Submitted for manual review.",
      };
    }

    // Check subscription AI credits consumed (if line_items reference subscription)
    const { data: sub } = await supabaseAdmin
      .from("user_subscriptions")
      .select("ai_credits_used")
      .eq("user_id", invoice.user_id)
      .maybeSingle();
    const creditsUsed = Number((sub as any)?.ai_credits_used ?? 0);
    if (creditsUsed > 500) {
      // Too many AI credits consumed
      const { error: refundErr } = await supabaseAdmin.from("billing_refunds").insert({
        invoice_id: data.invoice_id,
        amount_inr: data.amount_inr,
        reason: data.reason || null,
        status: "pending",
        user_id: context!.userId!,
        created_at: new Date().toISOString(),
      });
      if (refundErr) throw new Error(refundErr.message);
      return {
        ok: true,
        status: "pending",
        note: "More than 500 AI credits consumed. Submitted for manual review.",
      };
    }

    // Check course enrollment progress (<30%) if line_items reference courses
    const lineItems: any[] = (invoice.line_items as any[]) || [];
    for (const item of lineItems) {
      if (item.type === "course") {
        const { data: enrollment } = await supabaseAdmin
          .from("enrollments")
          .select("progress_pct")
          .eq("user_id", invoice.user_id)
          .eq("course_id", item.course_id)
          .maybeSingle();
        if (enrollment && Number(enrollment.progress_pct) >= 30) {
          const { error: refundErr } = await supabaseAdmin.from("billing_refunds").insert({
            invoice_id: data.invoice_id,
            amount_inr: data.amount_inr,
            reason: data.reason || null,
            status: "pending",
            user_id: context!.userId!,
            created_at: new Date().toISOString(),
          });
          if (refundErr) throw new Error(refundErr.message);
          return {
            ok: true,
            status: "pending",
            note: "Course progress exceeds 30%. Submitted for manual review.",
          };
        }
      }
    }

    // Auto-approve: within 7 days, under 500 AI credits, under 30% course progress
    const { error: refundErr } = await supabaseAdmin.from("billing_refunds").insert({
      invoice_id: data.invoice_id,
      amount_inr: data.amount_inr,
      reason: data.reason || null,
      status: "completed",
      user_id: context!.userId!,
      created_at: new Date().toISOString(),
    });
    if (refundErr) throw new Error(refundErr.message);

    const { error: invErr } = await supabaseAdmin
      .from("invoices")
      .update({ status: "refunded" })
      .eq("id", data.invoice_id);
    if (invErr) throw new Error(invErr.message);

    // 1. Credit the refunded amount back to the student's wallet
    const { error: wErr } = await supabaseAdmin.from("wallet_transactions").insert({
      user_id: invoice.user_id,
      amount_inr: data.amount_inr,
      type: "credit",
      status: "completed",
      description: `Refund for invoice ${invoice.invoice_number} (Auto-approved)`,
    });
    if (wErr) throw new Error(wErr.message);

    // 2. Delete enrollments & reverse creator earnings
    for (const item of lineItems) {
      if (item.type === "course") {
        // Delete enrollment
        await supabaseAdmin
          .from("enrollments")
          .delete()
          .eq("user_id", invoice.user_id)
          .eq("course_id", item.course_id);

        // Fetch course details
        const { data: course } = await supabaseAdmin
          .from("courses")
          .select("created_by, title")
          .eq("id", item.course_id)
          .maybeSingle();

        if (course && course.created_by) {
          // Look up creator's credit transaction for this course
          const { data: creatorTx } = await supabaseAdmin
            .from("wallet_transactions")
            .select("amount_inr, description")
            .eq("user_id", course.created_by)
            .eq("type", "credit")
            .eq("status", "completed")
            .like("description", `%Creator earning%${course.title}%`)
            .maybeSingle();

          if (creatorTx) {
            const amount = Number(creatorTx.amount_inr);
            const isOldFormat = creatorTx.description?.includes("(75%)");
            if (isOldFormat) {
              await supabaseAdmin.from("wallet_transactions").insert({
                user_id: course.created_by,
                amount_inr: amount,
                type: "debit",
                status: "completed",
                description: `Refund reversal (75%): ${course.title}`,
              });
            } else {
              const commission = Math.round(amount * 0.25 * 100) / 100;
              await supabaseAdmin.from("wallet_transactions").insert({
                user_id: course.created_by,
                amount_inr: amount,
                type: "debit",
                status: "completed",
                description: `Refund reversal (100%): ${course.title}`,
              });
              await supabaseAdmin.from("wallet_transactions").insert({
                user_id: course.created_by,
                amount_inr: commission,
                type: "credit",
                status: "completed",
                description: `Platform commission refund (25%): ${course.title}`,
              });
            }
          }
        }
      }
    }

    // Send refund processed email (non-blocking)
    import("@/lib/billing-email.functions").then((m) =>
      m
        .sendRefundProcessedEmail(
          invoice.user_id,
          invoice.invoice_number,
          data.amount_inr,
          data.reason,
        )
        .catch((e) => console.error("Failed to send refund email:", e)),
    );

    return { ok: true, status: "completed", note: "Refund auto-approved." };
  });

export const getCashfreeStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const appId = process.env.CASHFREE_APP_ID || "";
    const environment =
      appId.startsWith("TEST") || appId.includes("sandbox") ? "sandbox" : "production";
    return {
      connected: !!process.env.CASHFREE_APP_ID && !!process.env.CASHFREE_SECRET_KEY,
      merchant: appId,
      environment,
      last_sync: new Date().toISOString(),
    };
  });

export const getAuditLogs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: { page?: number; per_page?: number }) =>
    z
      .object({
        page: z.number().optional().default(1),
        per_page: z.number().optional().default(50),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const from = (data.page - 1) * data.per_page;
    const to = from + data.per_page - 1;
    const { data: logs, count } = await supabaseAdmin
      .from("billing_audit_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);
    return { logs: logs || [], total: count || 0 };
  });

export const createBillingExport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { type: string; date_from?: string; date_to?: string; format?: string }) =>
    z
      .object({
        type: z.string(),
        date_from: z.string().optional(),
        date_to: z.string().optional(),
        format: z.string().optional().default("csv"),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("billing_exports").insert({
      user_id: context!.userId,
      export_type: data.type,
      date_from: data.date_from || null,
      date_to: data.date_to || null,
      format: data.format,
      status: "pending",
      created_at: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getSubscriptionBillingData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: { user_id?: string }) => z.object({ user_id: z.string().optional() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const uid = data.user_id;

    const { data: subscriptions } = await supabaseAdmin
      .from("user_subscriptions")
      .select("*, plan:pricing_plans(*)")
      .order("created_at", { ascending: false })
      .limit(50);

    const { data: invoices } = await supabaseAdmin
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    const { data: payments } = await supabaseAdmin
      .from("payment_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    return {
      subscriptions: subscriptions || [],
      invoices: invoices || [],
      payments: payments || [],
    };
  });

export const exportBillingData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: { type: string; format: string; date_from?: string; date_to?: string }) =>
    z
      .object({
        type: z.string(),
        format: z.string(),
        date_from: z.string().optional(),
        date_to: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let query: any;

    switch (data.type) {
      case "invoices":
        query = supabaseAdmin.from("invoices").select("*, user:profiles!user_id(full_name, email)");
        break;
      case "payments":
        query = supabaseAdmin
          .from("payment_logs")
          .select("*, user:profiles!user_id(full_name, email, mobile)");
        break;
      case "subscriptions":
        query = supabaseAdmin
          .from("user_subscriptions")
          .select(
            "*, plan:pricing_plans(name, price_inr, interval), user:profiles!user_id(full_name, email)",
          );
        break;
      case "refunds":
        query = supabaseAdmin
          .from("billing_refunds")
          .select(
            "*, invoice:invoices!invoice_id(invoice_number), user:profiles!user_id(full_name, email)",
          );
        break;
      default:
        query = supabaseAdmin.from("invoices").select("*, user:profiles!user_id(full_name, email)");
    }

    if (data.date_from) query = query.gte("created_at", data.date_from);
    if (data.date_to) query = query.lte("created_at", data.date_to);
    query = query.order("created_at", { ascending: false }).limit(5000);

    const { data: rows } = await query;
    return { rows: rows || [], type: data.type, format: data.format };
  });

// ─── Coupon Management ───────────────────────────────────────

export const getCoupons = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("coupon_codes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const saveCoupon = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (d: {
      id?: string;
      code: string;
      description?: string;
      discount_percent?: number;
      discount_amount_inr?: number;
      max_uses?: number;
      applicable_plan_ids?: string[];
      valid_from?: string;
      valid_until?: string;
      active?: boolean;
    }) =>
      z
        .object({
          id: z.string().uuid().optional(),
          code: z.string().min(1).max(50),
          description: z.string().optional(),
          discount_percent: z.number().min(1).max(100).optional(),
          discount_amount_inr: z.number().min(0).optional(),
          max_uses: z.number().min(1).optional(),
          applicable_plan_ids: z.array(z.string()).optional(),
          valid_from: z.string().optional(),
          valid_until: z.string().optional(),
          active: z.boolean().optional(),
        })
        .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload: any = {
      code: data.code.toUpperCase(),
      description: data.description ?? null,
      discount_percent: data.discount_percent ?? null,
      discount_amount_inr: data.discount_amount_inr ?? null,
      max_uses: data.max_uses ?? null,
      applicable_plan_ids: data.applicable_plan_ids ?? null,
      valid_from: data.valid_from ?? new Date().toISOString(),
      valid_until: data.valid_until ?? null,
      active: data.active ?? true,
    };

    if (data.id) {
      const { error } = await supabaseAdmin.from("coupon_codes").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("coupon_codes").insert(payload);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteCoupon = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("coupon_codes").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
