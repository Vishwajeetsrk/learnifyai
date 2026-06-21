import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/u/@$username")({
  head: () => ({
    meta: [
      { title: `Profile — Learnify AI` },
      { name: "description", content: `Public profile on Learnify AI.` },
    ],
  }),
  beforeLoad: async ({ params }) => {
    const username = params.username;
    if (!username) throw new Error("Username not provided");

    // Look up user by username in profiles table
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id")
      .ilike("full_name", username)
      .maybeSingle();

    if (error || !profile) {
      // Try looking up by email prefix as fallback
      const { data: emailProfile } = await supabase
        .from("profiles")
        .select("id")
        .ilike("email", `${username}%`)
        .maybeSingle();

      if (!emailProfile) {
        throw new Error("User not found");
      }

      throw redirect({
        to: "/u/$id",
        params: { id: emailProfile.id },
      });
    }

    throw redirect({
      to: "/u/$id",
      params: { id: profile.id },
    });
  },
  component: UsernameRedirect,
});

function UsernameRedirect() {
  // This component should never render — beforeLoad always redirects
  return null;
}
