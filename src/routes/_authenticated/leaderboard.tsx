import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query";
import { Flame, Star, Trophy, Medal } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getLeaderboard } from "@/lib/gamification.functions";

export const Route = createFileRoute("/_authenticated/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard — Learnify AI" }] }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const { data: topUsers, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => await getLeaderboard(),
  });

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <div>
            <h1 className="text-3xl font-display font-bold">Leaderboard</h1>
            <p className="text-muted-foreground text-sm">Top learners sorted by total XP.</p>
          </div>
        </div>

        <div className="bg-card border rounded-2xl overflow-hidden shadow-card">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading ranks...</div>
          ) : (topUsers || []).length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No users yet.</div>
          ) : (
            <div className="divide-y">
              {topUsers?.map((u, i) => {
                const initials = (u.full_name || "User")
                  .split(" ")
                  .map((s) => s[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase();

                let RankIcon = null;
                if (i === 0) RankIcon = <Medal className="h-5 w-5 text-yellow-400" />;
                else if (i === 1) RankIcon = <Medal className="h-5 w-5 text-gray-300" />;
                else if (i === 2) RankIcon = <Medal className="h-5 w-5 text-amber-600" />;
                else RankIcon = <span className="font-bold text-muted-foreground w-5 text-center">{i + 1}</span>;

                return (
                  <div key={u.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-6 flex justify-center">{RankIcon}</div>
                      <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                        {u.avatar_url && <AvatarImage src={u.avatar_url} />}
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium text-sm">{u.full_name || "Anonymous Learner"}</div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <div className="flex items-center gap-1.5 text-orange-500 w-16">
                        <Flame className="h-4 w-4" /> {u.current_streak ?? 0}
                      </div>
                      <div className="flex items-center gap-1.5 text-yellow-500 w-20 justify-end">
                        <Star className="h-4 w-4" fill="currentColor" /> {u.xp ?? 0} XP
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
