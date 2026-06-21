import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const adminListFeatureFlags = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    // Only verify auth here, we don't strictly assert admin for viewing them
    // unless we want to. Let's assert admin just in case.
    const { data: userRoles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const roles = (userRoles ?? []).map((r) => r.role);
    if (!roles.includes("admin") && !roles.includes("super_admin")) throw new Error("Unauthorized");

    const { data, error } = await supabaseAdmin
      .from("feature_flags" as any)
      .select("*")
      .order("key");
    if (error) throw error;
    return data;
  });

export const adminUpdateFeatureFlag = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => d as { id: string; updates: any })
  .handler(async ({ data: { id, updates }, context }) => {
    const { data: userRoles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const roles = (userRoles ?? []).map((r) => r.role);
    if (!roles.includes("admin") && !roles.includes("super_admin")) throw new Error("Unauthorized");

    const { error } = await supabaseAdmin
      .from("feature_flags" as any)
      .update(updates)
      .eq("id", id);

    if (error) throw error;
    return true;
  });
