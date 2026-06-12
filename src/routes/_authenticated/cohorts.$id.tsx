import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Calendar, ExternalLink, Loader2, Users, Video } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/cohorts/$id")({
  head: () => ({ meta: [{ title: "Cohort — Learnify AI" }] }),
  component: CohortDetail,
});

function CohortDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const cohortQuery = useQuery({
    queryKey: ["cohort", id],
    queryFn: async () => {
      const { data: c, error } = await supabase
        .from("cohorts")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      if (!c) return null;
      const [{ data: members }, { data: creator }] = await Promise.all([
        supabase.from("cohort_members").select("user_id, role, joined_at").eq("cohort_id", id),
        supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .eq("id", c.creator_id)
          .maybeSingle(),
      ]);
      const memberIds = (members ?? []).map((m) => m.user_id);
      let memberProfiles: any[] = [];
      if (memberIds.length) {
        const { data } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .in("id", memberIds);
        memberProfiles = data ?? [];
      }
      return { cohort: c, members: members ?? [], memberProfiles, creator };
    },
  });

  const data = cohortQuery.data;
  const isMember = !!data?.members.find((m) => m.user_id === user?.id);
  const isHost = data?.cohort.creator_id === user?.id;

  async function join() {
    if (!user) return navigate({ to: "/login" });
    const { error } = await supabase
      .from("cohort_members")
      .insert({ cohort_id: id, user_id: user.id });
    if (error) return toast.error(error.message);
    toast.success("Joined cohort");
    qc.invalidateQueries({ queryKey: ["cohort", id] });
  }
  async function leave() {
    if (!user) return;
    const { error } = await supabase
      .from("cohort_members")
      .delete()
      .eq("cohort_id", id)
      .eq("user_id", user.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["cohort", id] });
  }

  if (cohortQuery.isLoading)
    return (
      <AppShell>
        <div className="py-20 grid place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  if (!data)
    return (
      <AppShell>
        <div className="py-20 text-center text-sm text-muted-foreground">Cohort not found.</div>
      </AppShell>
    );

  const c = data.cohort;
  const memberCount = data.members.length;
  const isFull = memberCount >= c.capacity;

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-6 max-w-4xl">
        <Link
          to="/cohorts"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All cohorts
        </Link>

        <div className="mt-6 rounded-3xl border bg-card p-6 sm:p-8 shadow-card">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <Badge variant="secondary" className="text-[10px] mb-2 capitalize">
                {c.kind.replace("_", " ")}
              </Badge>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
                {c.title}
              </h1>
              {data.creator && (
                <Link
                  to="/u/$id"
                  params={{ id: data.creator.id }}
                  className="inline-flex items-center gap-2 mt-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  Hosted by {data.creator.full_name ?? "Creator"}
                </Link>
              )}
            </div>
            <Badge variant={c.status === "live" ? "default" : "outline"} className="capitalize">
              {c.status}
            </Badge>
          </div>

          {c.description && (
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{c.description}</p>
          )}

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Starts
              </div>
              <div className="font-medium mt-1">
                {format(new Date(c.starts_at), "dd MMM, HH:mm")}
              </div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" /> Members
              </div>
              <div className="font-medium mt-1">
                {memberCount}/{c.capacity}
              </div>
            </div>
            {c.meeting_url && (isMember || isHost) && (
              <a
                href={c.meeting_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border p-3 hover:bg-accent flex flex-col"
              >
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Video className="h-3 w-3" /> Meeting
                </div>
                <div className="font-medium mt-1 flex items-center gap-1 truncate">
                  Join call <ExternalLink className="h-3 w-3" />
                </div>
              </a>
            )}
          </div>

          <div className="mt-6 flex gap-2">
            {!isHost &&
              (isMember ? (
                <Button variant="outline" onClick={leave}>
                  Leave cohort
                </Button>
              ) : (
                <Button onClick={join} disabled={isFull}>
                  {isFull ? "Full" : "Join cohort"}
                </Button>
              ))}
            {isHost && <Badge variant="default">You're the host</Badge>}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border bg-card p-6 shadow-card">
          <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
            <Users className="h-4 w-4" /> Members ({memberCount})
          </h2>
          {memberCount === 0 ? (
            <p className="text-sm text-muted-foreground">No members yet. Be the first to join!</p>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {data.memberProfiles.map((p) => {
                const initials = (p.full_name ?? "U")
                  .split(" ")
                  .map((s: string) => s[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();
                return (
                  <li key={p.id}>
                    <Link
                      to="/u/$id"
                      params={{ id: p.id }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm truncate">{p.full_name ?? "Learner"}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}
