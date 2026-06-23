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
