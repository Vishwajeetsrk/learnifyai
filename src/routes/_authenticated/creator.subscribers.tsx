import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CreatorGate } from "@/components/CreatorGate";
import { CreatorTabs } from "@/components/CreatorTabs";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/creator/subscribers")({
  head: () => ({ meta: [{ title: "Subscribers — Learnify AI" }] }),
  component: () => (
    <CreatorGate>
      <SubscribersPage />
    </CreatorGate>
  ),
});

function SubscribersPage() {
  const { user } = useAuth();
  const q = useQuery({
    enabled: !!user,
    queryKey: ["my-subscribers", user?.id],
    queryFn: async () => {
      const { data: subs, error } = await supabase
        .from("creator_subscriptions")
        .select("subscriber_id, created_at")
        .eq("creator_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const ids = (subs ?? []).map((s) => s.subscriber_id);
      if (!ids.length) return [];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url")
        .in("id", ids);
      const map = new Map((profiles ?? []).map((p) => [p.id, p]));
      return (subs ?? []).map((s) => ({
        ...s,
        profile: map.get(s.subscriber_id),
      }));
    },
  });

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-4xl">
        <CreatorTabs />
        <div className="flex items-center gap-3 mt-6">
          <Users className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-display font-semibold">Subscribers</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          People following your work — they'll be notified about new lessons.
        </p>

        <Card className="mt-6 p-0 overflow-hidden">
          {q.isLoading ? (
            <div className="py-16 grid place-items-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : !q.data?.length ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No subscribers yet. Share your{" "}
              <Link to="/creators/$id" params={{ id: user!.id }} className="text-primary underline">
                creator page
              </Link>
              .
            </div>
          ) : (
            <ul className="divide-y">
              {q.data.map((s) => (
                <li key={s.subscriber_id} className="flex items-center gap-3 p-4">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={s.profile?.avatar_url ?? undefined} />
                    <AvatarFallback>
                      {(s.profile?.full_name ?? s.profile?.email ?? "?").slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">
                      {s.profile?.full_name ?? "Anonymous"}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {s.profile?.email}
                    </div>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {new Date(s.created_at).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
