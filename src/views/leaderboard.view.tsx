import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Trophy,
  Flame,
  Star,
  Medal,
  Crown,
  TrendingUp,
  Loader2,
  Users,
  Gift,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { getLeaderboard, getUserRank, xpToLevel, levelToRank } from "@/lib/gamification.functions";
import { myPendingPrizes, claimPrize } from "@/lib/leaderboard-prizes.functions";
import { toast } from "sonner";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<"weekly" | "all">("weekly");
  const { t } = useTranslation();

  const fetchLb = useServerFn(getLeaderboard);
  const fetchRank = useServerFn(getUserRank);
  const fetchPrizes = useServerFn(myPendingPrizes);
  const doClaim = useServerFn(claimPrize);

  const lb = useQuery({
    queryKey: ["leaderboard", period],
    queryFn: () => fetchLb({ data: { period } }),
  });

  const myRank = useQuery({
    enabled: !!user,
    queryKey: ["my-rank", user?.id],
    queryFn: () => fetchRank({ data: { userId: user!.id } }),
  });

  const prizes = useQuery({
    enabled: !!user,
    queryKey: ["my-pending-prizes", user?.id],
    queryFn: () => fetchPrizes().catch(() => []),
  });

  const [claiming, setClaiming] = useState<string | null>(null);

  const handleClaim = async (claimId: string) => {
    setClaiming(claimId);
    try {
      const r = await doClaim({ data: { claimId } });
      toast.success(`Prize claimed! ${r.details ? `— ${r.details}` : ""}`);
      prizes.refetch();
      myRank.refetch();
      lb.refetch();
    } catch (e: any) {
      toast.error(e?.message ?? "Claim failed");
    } finally {
      setClaiming(null);
    }
  };

  useEffect(() => {
    if (prizes.data && prizes.data.length > 0 && window.location.search.includes("claim=1")) {
      setTimeout(() => {
        document.querySelector('[data-prize-banner]')?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, [prizes.data]);

  const topUsers = lb.data ?? [];
  const my = myRank.data;

  const initials = (name: string | null) =>
    (name ?? "?")
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const RankBadge = ({ rank }: { rank: number }) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400 drop-shadow-sm" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-300" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="font-bold text-muted-foreground w-5 text-center text-sm">{rank}</span>;
  };

  const RankBadgeSmall = ({ name }: { name: string }) => {
    const colors: Record<string, string> = {
      Bronze: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
      Silver: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      Gold: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
      Platinum: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
      Diamond: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    };
    return (
      <span
        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colors[name] ?? colors.Bronze}`}
      >
        {name}
      </span>
    );
  };

  return (
    <div className="px-4 md:px-10 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 grid place-items-center shadow-lg">
          <Trophy className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">
            {t("leaderboard.title")}
          </h1>
          <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-0.5">
            <TrendingUp className="h-3.5 w-3.5" /> {t("leaderboard.subtitle")}
          </p>
        </div>
      </div>

      {/* Current user rank card */}
      {my && (
        <div className="rounded-2xl border bg-gradient-to-r from-primary/[0.04] to-primary/[0.02] p-5 mb-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-background shadow-md shrink-0">
                {my.avatar_url ? <AvatarImage src={my.avatar_url} /> : null}
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white font-bold text-lg text-sm sm:text-lg">
                  {my.full_name
                    ? my.full_name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "#"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                  <Link
                    to="/u/$id"
                    params={{ id: user?.id ?? "" }}
                    className="font-semibold text-xs sm:text-sm hover:underline truncate max-w-[140px] sm:max-w-none"
                  >
                    #{my.rank} · {my.full_name ?? "Your Rank"}
                  </Link>
                  <RankBadgeSmall name={my.rankName} />
                  <Badge variant="outline" className="text-[10px]">
                    Lv.{my.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" /> {my.xp.toLocaleString()} XP
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-orange-500" /> {my.streak} day streak
                  </span>
                  <span>of {my.total} users</span>
                </div>
                {/* Level progress bar */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 max-w-40 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${my.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {my.currentLevelXp.toLocaleString()} / {my.levelTotal.toLocaleString()} XP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prize claims banner */}
      {prizes.data && prizes.data.length > 0 && (
        <div
          data-prize-banner
          className="rounded-2xl border-2 border-amber-300/60 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 p-4 mb-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <Gift className="h-5 w-5 text-amber-500" />
            <h3 className="font-display font-bold text-sm sm:text-base">
              Your Leaderboard Prize{prizes.data.length > 1 ? "s" : ""}
            </h3>
            <Badge className="bg-amber-500 text-white text-[10px]">
              {prizes.data.length} available
            </Badge>
          </div>
          <div className="flex flex-col gap-2">
            {prizes.data.map((p: any) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-white/70 dark:bg-card/70 border p-3 flex-wrap"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0">{p.prize_icon || "🎖️"}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">
                      {p.prize_name}{" "}
                      <span className="text-[10px] font-normal text-muted-foreground">
                        · {p.period === "weekly" ? "Weekly" : "All-Time"} · #{p.rank}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground line-clamp-1">
                      {p.item_value || p.item_type}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleClaim(p.id)}
                  disabled={claiming === p.id}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs gap-1 shrink-0"
                >
                  {claiming === p.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  Claim Prize
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Period tabs */}
      <div className="flex gap-1 mb-3 bg-muted/50 rounded-xl p-1 w-fit border">
        <Button
          variant={period === "weekly" ? "default" : "ghost"}
          size="sm"
          onClick={() => setPeriod("weekly")}
          className="rounded-lg text-xs gap-1 px-2 sm:px-3"
        >
          <Flame className="h-3 w-3.5 sm:h-3.5" />{" "}
          <span className="hidden xs:inline">{t("leaderboard.weekly")}</span>
          <span className="xs:hidden">7d</span>
        </Button>
        <Button
          variant={period === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => setPeriod("all")}
          className="rounded-lg text-xs gap-1 px-2 sm:px-3"
        >
          <Trophy className="h-3 w-3.5 sm:h-3.5" /> {t("leaderboard.allTime")}
        </Button>
      </div>

      {/* Podium */}
      {topUsers.length >= 3 && (
        <div className="flex items-end justify-center gap-3 mb-8">
          {[0, 1, 2].map((i) => {
            const u = topUsers[i];
            if (!u) return null;
            const level = xpToLevel(u.xp);
            const rankInfo = levelToRank(level);
            const heights = ["h-36", "h-28", "h-24"];
            const badges = ["", "bg-yellow-400", "bg-slate-300", "bg-amber-600"];
            return (
              <div key={u.id} className="flex flex-col items-center gap-2 w-20 sm:w-28">
                <div className="relative">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-background shadow-md ring-2 ring-primary/20">
                    {u.avatar_url && <AvatarImage src={u.avatar_url} />}
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {initials(u.full_name ?? null)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full grid place-items-center text-[10px] font-bold text-white shadow ${badges[i + 1]}`}
                  >
                    {i + 1}
                  </div>
                </div>
                <Link
                  to="/u/$id"
                  params={{ id: u.id }}
                  className="text-xs font-medium text-center leading-tight line-clamp-1 hover:underline"
                >
                  {u.full_name}
                </Link>
                <RankBadgeSmall name={rankInfo.name} />
                <div
                  className={`w-full rounded-t-xl border border-b-0 bg-card flex items-center justify-center ${heights[i]}`}
                >
                  <div className="text-center">
                    <div className="font-bold text-xs">
                      {(period === "weekly" ? (u.weekly_xp ?? 0) : u.xp).toLocaleString()}
                    </div>
                    <div className="text-[9px] text-muted-foreground">XP</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List */}
      <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
        {lb.isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto" />
          </div>
        ) : topUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-3">
              {period === "weekly" ? t("leaderboard.noActivity") : t("leaderboard.noUsers")}
            </p>
            {period === "weekly" && (
              <Button variant="outline" size="sm" className="text-xs" asChild>
                <Link to="/courses">{t("leaderboard.browseCourses")}</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {topUsers.map((u, i) => {
              const level = xpToLevel(u.xp);
              const rankInfo = levelToRank(level);
              const isMe = u.id === user?.id;
              return (
                <div
                  key={u.id}
                  className={`flex items-center justify-between p-3.5 sm:px-5 transition-colors ${isMe ? "bg-primary/[0.03]" : "hover:bg-muted/30"}`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-7 flex justify-center shrink-0">
                      <RankBadge rank={i + 1} />
                    </div>
                    <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border-2 border-background shadow-sm shrink-0">
                      {u.avatar_url && <AvatarImage src={u.avatar_url} />}
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {initials(u.full_name ?? null)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Link
                          to="/u/$id"
                          params={{ id: u.id }}
                          className={`text-sm font-medium truncate hover:underline ${isMe ? "text-primary" : "hover:text-foreground"}`}
                        >
                          {u.full_name}
                        </Link>
                        <RankBadgeSmall name={rankInfo.name} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                    <div className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Flame className="h-3 w-3 text-orange-400" /> {u.current_streak ?? 0}d
                    </div>
                    <div className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground">
                      Lv.{level}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5 text-yellow-500 font-semibold text-xs sm:text-sm min-w-[60px] sm:min-w-[70px] justify-end">
                      <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="currentColor" />
                      {period === "weekly" ? (
                        <span>
                          {u.weekly_xp?.toLocaleString() ?? 0}
                          <span className="text-[9px] sm:text-[10px] font-normal text-muted-foreground ml-0.5">
                            XP
                          </span>
                        </span>
                      ) : (
                        <span>
                          {u.xp.toLocaleString()}
                          <span className="text-[9px] sm:text-[10px] font-normal text-muted-foreground ml-0.5">
                            XP
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 text-center text-[11px] text-muted-foreground">
        <p>{t("leaderboard.earnXP")}</p>
      </div>
    </div>
  );
}
