import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const RESERVED_USERNAMES = new Set([
  "admin",
  "api",
  "support",
  "auth",
  "settings",
  "billing",
  "coaching",
  "checkout",
  "dashboard",
  "courses",
  "career-studio",
  "privacy",
  "terms",
  "docs",
  "login",
  "signup",
  "u",
  "wallet",
  "cart",
  "explore",
  "community",
  "projects",
  "showcase",
  "blog",
  "events",
  "certificates",
  "tutor",
  "creators",
  "pricing",
]);

export const Route = createFileRoute("/u/@$username")({
  head: () => ({
    meta: [
      { title: `Profile — Learnify AI` },
      { name: "description", content: `Public profile on Learnify AI.` },
    ],
  }),
  beforeLoad: async ({ params }) => {
    const rawUsername = params.username?.trim();
    if (!rawUsername) throw new Error("Username not provided");

    const cleanUsername = rawUsername.toLowerCase();

    // Guard against reserved system routes
    if (RESERVED_USERNAMES.has(cleanUsername)) {
      throw redirect({
        to: `/${cleanUsername}` as any,
      });
    }

    // 1. Look up by exact/case-insensitive username column
    const { data: byUsername } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", cleanUsername)
      .maybeSingle();

    if (byUsername?.id) {
      throw redirect({
        to: "/u/$id",
        params: { id: byUsername.id },
      });
    }

    // 2. Look up user by full_name in profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .ilike("full_name", rawUsername)
      .maybeSingle();

    if (profile?.id) {
      throw redirect({
        to: "/u/$id",
        params: { id: profile.id },
      });
    }

    // 3. Fallback: look up by email prefix
    const { data: emailProfile } = await supabase
      .from("profiles")
      .select("id")
      .ilike("email", `${cleanUsername}%`)
      .maybeSingle();

    if (emailProfile?.id) {
      throw redirect({
        to: "/u/$id",
        params: { id: emailProfile.id },
      });
    }

    throw new Error("User not found");
  },
  component: UsernameRedirect,
});

function UsernameRedirect() {
  // This component should never render — beforeLoad always redirects
  return null;
}
