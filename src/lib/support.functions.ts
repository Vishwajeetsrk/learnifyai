import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const SUPPORT_PAYMENT_PAGE_URL = "https://pages.razorpay.com/learnifyaisupport";

export const getContributionSummary = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("contributions")
    .select("amount_inr, anonymous, donor_name, created_at, status")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) {
    console.error("[support] contribution summary error:", error);
    return { count: 0, total_inr: 0, recent: [] };
  }
  const completed = (data ?? []).filter((c: any) => c.status === "completed");
  return {
    count: completed.length,
    total_inr: completed.reduce((s: number, c: any) => s + (c.amount_inr || 0), 0),
    recent: completed.slice(0, 5).map((c: any) => ({
      amount_inr: c.amount_inr,
      name: c.anonymous || !c.donor_name ? null : c.donor_name,
      created_at: c.created_at,
    })),
  };
});

const isAdmin = (context: any) =>
  (context.user?.app_metadata?.roles ?? []).includes("admin") ||
  (context.user?.app_metadata?.roles ?? []).includes("super_admin") ||
  (context.user?.role ?? "").includes("admin");

export const getContributionsAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (d: { status?: string }) => z.object({ status: z.string().optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    if (!isAdmin(context)) throw new Error("Admins only");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("contributions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (data.status) q = q.eq("status", data.status);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

export const addContributionAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (d: {
      amountInr: number;
      donorName?: string;
      donorEmail?: string;
      anonymous?: boolean;
      reference?: string;
      status?: string;
    }) =>
      z
        .object({
          amountInr: z.number().positive(),
          donorName: z.string().optional(),
          donorEmail: z.string().optional(),
          anonymous: z.boolean().optional(),
          reference: z.string().optional(),
          status: z.string().optional(),
        })
        .parse(d),
  )
  .handler(async ({ data, context }) => {
    if (!isAdmin(context)) throw new Error("Admins only");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("contributions")
      .insert({
        amount_inr: Math.round(data.amountInr),
        donor_name: data.donorName?.trim() || null,
        donor_email: data.donorEmail?.trim() || null,
        anonymous: !!data.anonymous,
        reference: data.reference?.trim() || null,
        source: data.reference ? "razorpay_payment_page" : "manual",
        status: data.status === "failed" ? "failed" : data.status === "pending" ? "pending" : "completed",
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { row };
  });

export const updateContributionStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { id: string; status: string }) =>
    z.object({ id: z.string(), status: z.enum(["pending", "completed", "failed"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    if (!isAdmin(context)) throw new Error("Admins only");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("contributions")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
