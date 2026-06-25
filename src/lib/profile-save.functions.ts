import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const saveProfileField = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        field: z.string(),
        value: z.any().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId!;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await (supabaseAdmin as any)
      .from("profiles")
      .update({ [data.field]: data.value })
      .eq("id", userId);

    if (error) throw new Error(error.message);
    return { success: true };
  });

export const assignDefaultRole = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ userId: z.string(), role: z.enum(["student", "creator", "admin"]) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any)
      .from("user_roles")
      .insert({ user_id: data.userId, role: data.role });
    if (error && !error.message?.includes("duplicate")) throw new Error(error.message);
    return { success: true };
  });
