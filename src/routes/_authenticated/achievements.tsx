import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Award, Loader2, Medal, Flame } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { getUserAchievements, getUserRank } from "@/lib/gamification.functions";
import { cn } from "@/lib/utils";
import { AchievementGallery } from "@/components/AchievementGallery";
import { AnimatedRankCrown } from "@/components/RankSystem";
import { AchievementsSkeleton } from "@/components/Skeletons";

export const Route = createFileRoute("/_authenticated/achievements")({
  head: () => ({ meta: [{ title: "Achievements — Learnify AI" }] }),
  component: AchievementsPage,
});

function AchievementsPage() {
  const { user } = useAuth();
  const fetchAchievements = useServerFn(getUserAchievements);
  const fetchRank = useServerFn(getUserRank);

  const { data: badges, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["achievements", user?.id],
    queryFn: () => fetchAchievements({ data: { userId: user!.id } }),
  });

  const { data: rank } = useQuery({
    enabled: !!user,
    queryKey: ["user-rank", user?.id],
    queryFn: () => fetchRank({ data: { userId: user!.id } }),
  });

  const earnedCount = badges?.filter((b) => b.earned).length ?? 0;
  const totalCount = badges?.length ?? 0;

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 grid place-items-center shadow-lg">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Achievements</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Badges earned through learning milestones
            </p>
          </div>
        </div>

        {/* Gamification Stats */}
        {rank ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-card rounded-2xl border p-4 shadow-sm flex flex-col justify-center items-center text-center row-span-2 sm:row-span-1">
              <AnimatedRankCrown rankName={rank.rankName} className="mb-2 scale-75 md:scale-100" />
              <span className={cn("text-lg font-bold mt-1", rank.rankColor)}>{rank.rankName}</span>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
                Rank League
              </span>
            </div>
            <div className="bg-card rounded-2xl border p-4 shadow-sm flex flex-col justify-center">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Level
              </span>
              <span className="text-2xl font-bold mt-1 text-indigo-500">Lv. {rank.level}</span>
            </div>
            <div className="bg-card rounded-2xl border p-4 shadow-sm flex flex-col justify-center">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Total XP
              </span>
              <span className="text-2xl font-bold mt-1 text-amber-500">
                {rank.xp.toLocaleString()} XP
              </span>
            </div>
            <div className="bg-card rounded-2xl border p-4 shadow-sm flex flex-col justify-center">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Daily Streak
              </span>
              <span className="text-2xl font-bold mt-1 text-orange-500 flex items-center gap-1">
                <Flame className="h-5 w-5 fill-current" /> {rank.streak}
              </span>
            </div>
          </div>
        ) : isLoading ? (
          <div className="mt-6">
            <AchievementsSkeleton />
          </div>
        ) : null}

        {/* Stats bar */}
        <div className="mt-6 rounded-2xl border bg-card p-4 flex items-center gap-4 shadow-sm">
          <Medal className="h-5 w-5 text-primary shrink-0" />
          <span className="text-sm">
            <span className="font-bold text-lg">{earnedCount}</span> / {totalCount} badges earned
          </span>
          {totalCount > 0 && (
            <div className="flex-1 max-w-40">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-primary transition-all duration-1000"
                  style={{ width: `${Math.round((earnedCount / totalCount) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border bg-card p-4 shadow-sm flex flex-col items-center gap-2"
              >
                <div className="h-14 w-14 rounded-full bg-muted animate-pulse" />
                <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                <div className="h-3 w-12 rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        ) : !badges || badges.length === 0 ? (
          <div className="mt-12 rounded-2xl border bg-card p-12 text-center">
            <Award className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="font-medium text-lg">No badges yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Complete courses, lessons, and challenges to earn badges.
            </p>
          </div>
        ) : (
          <AchievementGallery badges={badges} />
        )}
      </div>
    </AppShell>
  );
}
