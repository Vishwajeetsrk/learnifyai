import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const sendCommunityMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        content: z.string().min(1).max(2000),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: msg, error } = await (supabase as any)
      .from("community_messages")
      .insert({ user_id: userId, content: data.content })
      .select("id, created_at")
      .single();
    if (error) throw new Error(error.message);
    return { id: msg.id, created_at: msg.created_at };
  });
