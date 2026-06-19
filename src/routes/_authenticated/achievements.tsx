import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Award, Lock, Loader2, Medal, Sparkles, BookOpen, Flame, Brain, Code2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { getUserAchievements } from "@/lib/gamification.functions";

export const Route = createFileRoute("/_authenticated/achievements")({
  head: () => ({ meta: [{ title: "Achievements — Learnify AI" }] }),
  component: AchievementsPage,
});

const CATEGORIES = [
  { key: "xp", label: "XP Milestones", icon: Sparkles, color: "from-yellow-400 to-orange-500" },
  { key: "course", label: "Course Badges", icon: BookOpen, color: "from-blue-500 to-cyan-500" },
  { key: "streak", label: "Streak Mastery", icon: Flame, color: "from-red-500 to-rose-500" },
  { key: "test", label: "Test Champion", icon: Brain, color: "from-purple-500 to-violet-500" },
  {
    key: "challenge",
    label: "Challenge Solver",
    icon: Code2,
    color: "from-emerald-500 to-teal-500",
  },
];

function AchievementsPage() {
  const { user } = useAuth();
  const fetchAchievements = useServerFn(getUserAchievements);

  const { data: badges, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["achievements", user?.id],
    queryFn: () => fetchAchievements({ data: { userId: user!.id } }),
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
                  className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-primary transition-all"
                  style={{ width: `${Math.round((earnedCount / totalCount) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="mt-12 text-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto" />
          </div>
        ) : !badges || badges.length === 0 ? (
          <div className="mt-12 rounded-2xl border bg-card p-12 text-center">
            <Award className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="font-medium">No badges yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Complete courses, lessons, and challenges to earn badges.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            {CATEGORIES.map((cat) => {
              const catBadges = badges.filter((b) => b.category === cat.key);
              if (catBadges.length === 0) return null;
              const Icon = cat.icon;
              return (
                <section key={cat.key}>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div
                      className={`h-8 w-8 rounded-lg bg-gradient-to-br ${cat.color} grid place-items-center shadow-sm`}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="font-display font-semibold text-lg">{cat.label}</h2>
                    <span className="text-xs text-muted-foreground">
                      {catBadges.filter((b) => b.earned).length}/{catBadges.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {catBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className={`rounded-xl border p-4 text-center transition-all ${
                          badge.earned
                            ? "bg-card shadow-sm hover:shadow-md hover:-translate-y-0.5"
                            : "bg-muted/30 opacity-50"
                        }`}
                      >
                        <div
                          className={`h-12 w-12 rounded-full mx-auto grid place-items-center ${
                            badge.earned ? `bg-gradient-to-br ${cat.color} shadow-sm` : "bg-muted"
                          }`}
                        >
                          {badge.earned ? (
                            <Icon className="h-5 w-5 text-white" />
                          ) : (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <p className="mt-2 text-xs font-semibold leading-tight">{badge.name}</p>
                        {badge.earned && badge.earned_at && (
                          <p className="text-[9px] text-muted-foreground mt-1">
                            {new Date(badge.earned_at).toLocaleDateString()}
                          </p>
                        )}
                        {!badge.earned && badge.xp_required > 0 && (
                          <p className="text-[9px] text-muted-foreground mt-1">
                            {badge.xp_required} XP
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
