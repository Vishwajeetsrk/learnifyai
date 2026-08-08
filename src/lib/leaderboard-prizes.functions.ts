import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function loadAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function assertAdminRole(supabaseAdmin: any, userId: string) {
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["super_admin", "admin"]);
  if (!data || data.length === 0) throw new Error("Admin only");
}

export const adminListPrizes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabaseAdmin = await loadAdmin();
    await assertAdminRole(supabaseAdmin, context.userId!);
    const { data, error } = await (supabaseAdmin as any)
      .from("leaderboard_prizes")
      .select("*")
      .order("period")
      .order("rank");
    if (error) throw new Error(error.message);
    return (data ?? []) as any[];
  });

export const adminSavePrize = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        period: z.enum(["weekly", "all"]),
        rank: z.number().int().min(1).max(3),
        name: z.string().min(1),
        description: z.string().default(""),
        icon: z.string().default("🎖️"),
        item_type: z.enum(["xp", "badge", "avatar_frame", "premium_resume", "ai_credits", "discount", "store_item", "custom"]),
        item_value: z.string().default(""),
        enabled: z.boolean().default(true),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await loadAdmin();
    await assertAdminRole(supabaseAdmin, context.userId!);
    const row = {
      period: data.period,
      rank: data.rank,
      name: data.name,
      description: data.description,
      icon: data.icon,
      item_type: data.item_type,
      item_value: data.item_value,
      enabled: data.enabled,
      updated_at: new Date().toISOString(),
    };
    if (data.id) {
      const { error } = await (supabaseAdmin as any)
        .from("leaderboard_prizes")
        .update(row)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: inserted, error } = await (supabaseAdmin as any)
      .from("leaderboard_prizes")
      .insert(row)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: (inserted as any)?.id };
  });

export const adminListClaims = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabaseAdmin = await loadAdmin();
    await assertAdminRole(supabaseAdmin, context.userId!);
    const { data, error } = await (supabaseAdmin as any)
      .from("prize_claims")
      .select("*, profiles(full_name, email, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return (data ?? []) as any[];
  });

export const adminSetClaimStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["pending", "claimed", "expired", "revoked"]),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await loadAdmin();
    await assertAdminRole(supabaseAdmin, context.userId!);
    const { error } = await (supabaseAdmin as any)
      .from("prize_claims")
      .update({
        status: data.status,
        claimed_at: data.status === "claimed" ? new Date().toISOString() : null,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const myPendingPrizes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabaseAdmin = await loadAdmin();
    const { data, error } = await (supabaseAdmin as any)
      .from("prize_claims")
      .select("*")
      .eq("user_id", context.userId!)
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as any[];
  });

export const claimPrize = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ claimId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await loadAdmin();

    const { data: claim, error: claimError } = await (supabaseAdmin as any)
      .from("prize_claims")
      .select("*")
      .eq("id", data.claimId)
      .eq("user_id", context.userId!)
      .single();
    if (claimError || !claim) throw new Error("Prize claim not found");
    if ((claim as any).status !== "pending") throw new Error("Prize already claimed or expired");

    const { data: prizeRow } = (claim as any).prize_id
      ? await (supabaseAdmin as any).from("leaderboard_prizes").select("*").eq("id", (claim as any).prize_id).maybeSingle()
      : { data: null };

    // Apply the prize by item_type. Free digital rewards only.
    if ((claim as any).item_type === "xp") {
      const amount = parseInt((claim as any).item_value || "0", 10) || 0;
      if (amount > 0) {
        const { data: profile } = await (supabaseAdmin as any)
          .from("profiles")
          .select("xp, current_streak, highest_streak, last_active_at")
          .eq("id", context.userId!)
          .maybeSingle();
        const xp = ((profile as any)?.xp ?? 0) + amount;
        const { error } = await (supabaseAdmin as any)
          .from("profiles")
          .update({ xp })
          .eq("id", context.userId!);
        if (error) throw new Error(error.message);
        const { error: logErr } = await (supabaseAdmin as any).from("xp_log").insert({
          user_id: context.userId!,
          amount,
          source: "prize",
          metadata: { prize: (claim as any).prize_name, claim_id: (claim as any).id },
        });
        if (logErr) throw new Error(logErr.message);
      }
    } else if ((claim as any).item_type === "badge" || (claim as any).item_type === "avatar_frame") {
      // Grant via user_badges (badge) or avatar frame via profile flag.
      if ((claim as any).item_type === "badge" && (claim as any).item_value) {
        const { error } = await (supabaseAdmin as any).from("user_badges").insert({
          user_id: context.userId!,
          badge_id: (claim as any).item_value,
        });
        if (error) {
          console.warn("badge insert:", error.message);
        }
      } else {
        const { error } = await (supabaseAdmin as any)
          .from("profiles")
          .update({ prize_avatar_frame: (claim as any).item_value || (claim as any).prize_icon })
          .eq("id", context.userId!);
        if (error) console.warn("frame update:", error.message);
      }
    } else if ((claim as any).item_type === "ai_credits") {
      const amount = parseInt((claim as any).item_value || "0", 10) || 0;
      const { data: bal } = await (supabaseAdmin as any)
        .from("ai_credits")
        .select("credits_remaining")
        .eq("user_id", context.userId!)
        .maybeSingle();
      const remaining = ((bal as any)?.credits_remaining ?? 0) + amount;
      const { error } = await (supabaseAdmin as any)
        .from("ai_credits")
        .upsert({
          user_id: context.userId!,
          credits_remaining: remaining,
          credits_used: (bal as any)?.credits_used ?? 0,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", context.userId!);
      if (error) console.warn("credits update:", error.message);
    } else if ((claim as any).item_type === "premium_resume") {
      const { error } = await (supabaseAdmin as any).from("profiles").update({
        resume_premium_until: new Date(Date.now() + 365 * 86400_000).toISOString(),
      }).eq("id", context.userId!);
      if (error) console.warn("resume update:", error.message);
    }

    const { error: updateErr } = await (supabaseAdmin as any)
      .from("prize_claims")
      .update({ status: "claimed", claimed_at: new Date().toISOString() })
      .eq("id", (claim as any).id);
    if (updateErr) throw new Error(updateErr.message);

    return {
      success: true,
      applied: (claim as any).item_type,
      prize: (claim as any).prize_name,
      details: (prizeRow as any)?.description ?? (claim as any).item_value,
    };
  });
