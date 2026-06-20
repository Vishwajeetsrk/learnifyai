import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Award, Loader2, Trophy, Medal, TrendingUp, Code2, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/playground/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard — Learnify AI" }] }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const { user } = useAuth();

  const { data: entries, isLoading } = useQuery({
    queryKey: ["playground-leaderboard"],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("playground_leaderboard")
        .select(
          "user_id, total_points, challenges_solved, easy_solved, medium_solved, hard_solved, total_runs, updated_at",
        )
        .order("total_points", { ascending: false })
        .limit(100);
      const userIds = (data ?? []).map((r: any) => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);
      const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));
      return (data ?? []).map((r: any, idx: number) => ({
        ...r,
        rank: idx + 1,
        profile: profileMap.get(r.user_id) || null,
      }));
    },
  });

  const medalEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="h-6 w-6 text-amber-500" />
          <div>
            <h1 className="font-display text-2xl font-semibold">Leaderboard</h1>
            <p className="text-sm text-muted-foreground">
              Top coders ranked by challenges solved and points earned.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 grid place-items-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : !entries?.length ? (
          <div className="rounded-2xl border bg-card p-12 text-center text-muted-foreground">
            <Trophy className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No entries yet</p>
            <p className="text-sm mt-1">
              Solve challenges to earn points and appear on the leaderboard.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-muted/30 text-[10px] font-medium text-muted-foreground uppercase tracking-wider border-b">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5">User</div>
              <div className="col-span-2 text-right">Points</div>
              <div className="col-span-2 text-right">Solved</div>
              <div className="col-span-2 text-right">Runs</div>
            </div>
            <div className="divide-y">
              {entries.map((entry: any) => {
                const isMe = user?.id === entry.user_id;
                const medal = medalEmoji(entry.rank);
                return (
                  <div
                    key={entry.user_id}
                    className={cn(
                      "grid grid-cols-12 gap-2 px-4 py-3 text-sm items-center",
                      isMe ? "bg-primary/5" : "hover:bg-accent/30",
                    )}
                  >
                    <div className="col-span-1 text-center font-bold text-xs">
                      {medal || <span className="text-muted-foreground">{entry.rank}</span>}
                    </div>
                    <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                      <Avatar className="h-7 w-7 border shrink-0">
                        <AvatarImage src={entry.profile?.avatar_url} />
                        <AvatarFallback className="text-[10px]">
                          {entry.profile?.full_name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className={cn("truncate", isMe && "font-semibold text-primary")}>
                        {entry.profile?.full_name || "Anonymous"}
                        {isMe && " (You)"}
                      </span>
                    </div>
                    <div className="col-span-2 text-right font-semibold">{entry.total_points}</div>
                    <div className="col-span-2 text-right text-muted-foreground text-xs">
                      <span className="text-green-500">{entry.easy_solved}E</span>{" "}
                      <span className="text-amber-500">{entry.medium_solved}M</span>{" "}
                      <span className="text-red-500">{entry.hard_solved}H</span>
                    </div>
                    <div className="col-span-2 text-right text-xs text-muted-foreground">
                      {entry.total_runs}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
