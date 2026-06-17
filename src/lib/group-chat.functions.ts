import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const sendGroupMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        cohortId: z.string().uuid(),
        content: z.string().min(1).max(2000),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: membership } = await supabase
      .from("cohort_members")
      .select("id")
      .eq("cohort_id", data.cohortId)
      .eq("user_id", userId)
      .maybeSingle();
    if (!membership) throw new Error("Not a member of this cohort");

    const { data: msg, error } = await supabase
      .from("group_messages")
      .insert({ cohort_id: data.cohortId, sender_id: userId, content: data.content })
      .select("id, created_at")
      .single();
    if (error) throw new Error(error.message);
    return { id: msg.id, created_at: msg.created_at };
  });
