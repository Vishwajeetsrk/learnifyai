import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Award, Lock, Loader2, Medal, Sparkles, BookOpen, Flame, Brain, Code2, RefreshCw, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { getUserAchievements, getUserRank, awardXP } from "@/lib/gamification.functions";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const qc = useQueryClient();
  const fetchAchievements = useServerFn(getUserAchievements);
  const fetchRank = useServerFn(getUserRank);
  const fetchAwardXP = useServerFn(awardXP);

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

  const handleAwardXP = async (amount: number) => {
    if (!user) return;
    try {
      const res = await fetchAwardXP({ data: { userId: user.id, amount, source: "simulation" } });
      if (res.success) {
        toast.success(`Successfully awarded ${amount} XP!`);
        qc.invalidateQueries({ queryKey: ["user-rank", user.id] });
        qc.invalidateQueries({ queryKey: ["achievements", user.id] });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to award XP");
    }
  };

  const handleIncrementStreak = async () => {
    if (!user) return;
    try {
      // 1. Get current profile
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("current_streak, highest_streak")
        .eq("id", user.id)
        .single();
      if (profileErr || !profile) throw profileErr || new Error("Profile not found");

      const newStreak = (profile.current_streak ?? 0) + 1;
      const newHighest = Math.max(profile.highest_streak ?? 0, newStreak);

      // 2. Update profile
      const { error: updateErr } = await supabase
        .from("profiles")
        .update({
          current_streak: newStreak,
          highest_streak: newHighest,
          last_active_at: new Date().toISOString()
        })
        .eq("id", user.id);
      if (updateErr) throw updateErr;

      // 3. Check for streak badges
      const { data: dbBadges } = await supabase
        .from("badges")
        .select("id, streak_required")
        .eq("category", "streak")
        .not("streak_required", "is", null);

      if (dbBadges && dbBadges.length > 0) {
        const { data: earnedBadges } = await supabase
          .from("user_badges")
          .select("badge_id")
          .eq("user_id", user.id);

        const earnedIds = new Set((earnedBadges || []).map((b: any) => b.badge_id));
        const toAward = dbBadges.filter((b) => !earnedIds.has(b.id) && newStreak >= (b.streak_required ?? 0));

        if (toAward.length > 0) {
          const { error: insertErr } = await supabase
            .from("user_badges")
            .insert(toAward.map((b) => ({ user_id: user.id, badge_id: b.id })));
          if (insertErr) {
            console.error("Failed to insert badges:", insertErr);
          } else {
            toast.success(`Earned ${toAward.length} new streak badge(s)!`);
          }
        }
      }

      toast.success(`Streak advanced to ${newStreak} days!`);
      qc.invalidateQueries({ queryKey: ["user-rank", user.id] });
      qc.invalidateQueries({ queryKey: ["achievements", user.id] });
    } catch (err: any) {
      toast.error(err.message || "Failed to advance streak");
    }
  };

  const handleResetStats = async () => {
    if (!user) return;
    try {
      const { error: profileErr } = await supabase
        .from("profiles")
        .update({
          xp: 0,
          current_streak: 0,
          highest_streak: 0,
          last_active_at: null
        })
        .eq("id", user.id);
      if (profileErr) throw profileErr;

      const { error: badgesErr } = await supabase
        .from("user_badges")
        .delete()
        .eq("user_id", user.id);
      if (badgesErr) throw badgesErr;

      const { error: xpErr } = await supabase
        .from("xp_log")
        .delete()
        .eq("user_id", user.id);
      if (xpErr) throw xpErr;

      toast.success("Gamification stats and badges reset successfully!");
      qc.invalidateQueries({ queryKey: ["user-rank", user.id] });
      qc.invalidateQueries({ queryKey: ["achievements", user.id] });
    } catch (err: any) {
      toast.error(err.message || "Failed to reset stats");
    }
  };

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
        {rank && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-card rounded-2xl border p-4 shadow-sm flex flex-col justify-center">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Rank League</span>
              <span className={cn("text-lg font-bold mt-1", rank.rankColor)}>{rank.rankName}</span>
            </div>
            <div className="bg-card rounded-2xl border p-4 shadow-sm flex flex-col justify-center">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Level</span>
              <span className="text-lg font-bold mt-1 text-indigo-500">Lv. {rank.level}</span>
            </div>
            <div className="bg-card rounded-2xl border p-4 shadow-sm flex flex-col justify-center">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total XP</span>
              <span className="text-lg font-bold mt-1 text-amber-500">{rank.xp.toLocaleString()} XP</span>
            </div>
            <div className="bg-card rounded-2xl border p-4 shadow-sm flex flex-col justify-center">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Daily Streak</span>
              <span className="text-lg font-bold mt-1 text-orange-500">
                🔥 {rank.streak} {rank.streak === 1 ? "day streak" : "days streak"}
              </span>
            </div>
          </div>
        )}

        {/* Gamification Sandbox Panel */}
        <div className="mt-6 rounded-2xl border bg-card/60 backdrop-blur-sm p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
              <div>
                <h3 className="font-semibold text-sm">Gamification Sandbox</h3>
                <p className="text-xs text-muted-foreground">Simulate XP progression and streaks to test badge awards</p>
              </div>
            </div>
            <button
              onClick={handleResetStats}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium bg-background hover:bg-muted text-destructive hover:text-destructive-foreground transition-all"
            >
              <RefreshCw className="h-3 w-3" />
              Reset Stats
            </button>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => handleAwardXP(50)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 shadow-sm transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              Award 50 XP
            </button>
            <button
              onClick={() => handleAwardXP(200)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 shadow-sm transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              Award 200 XP
            </button>
            <button
              onClick={handleIncrementStreak}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border bg-background hover:bg-muted text-xs font-medium shadow-sm transition-all text-orange-600 dark:text-orange-400"
            >
              <Flame className="h-3.5 w-3.5 fill-current" />
              Advance Streak (+1 Day)
            </button>
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
              const catBadges = badges.filter((b) => (b as any).category === cat.key);
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
