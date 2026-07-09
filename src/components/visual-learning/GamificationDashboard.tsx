import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Trophy, Flame, Star, Target, Zap, Medal, Crown, Shield, TrendingUp,
  BookOpen, CheckCircle2, Lock, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface GamificationDashboardProps {
  userId?: string;
}

const RANKS = [
  { name: "Bronze", min: 1, max: 5, color: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-500/30", icon: Shield },
  { name: "Silver", min: 6, max: 10, color: "text-slate-300", bg: "bg-slate-400/10", border: "border-slate-400/30", icon: Medal },
  { name: "Gold", min: 11, max: 15, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", icon: Trophy },
  { name: "Platinum", min: 16, max: 20, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30", icon: Crown },
  { name: "Diamond", min: 21, max: 25, color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/30", icon: Star },
];

const BADGE_THRESHOLDS = [
  { xp: 50, name: "First Steps", icon: "🌱" },
  { xp: 200, name: "Getting Started", icon: "🔥" },
  { xp: 500, name: "Dedicated Learner", icon: "⭐" },
  { xp: 1000, name: "Knowledge Seeker", icon: "💎" },
  { xp: 2500, name: "Course Conqueror", icon: "👑" },
  { xp: 5000, name: "Master Thinker", icon: "🧠" },
  { xp: 10000, name: "Legend", icon: "🏆" },
];

function xpToLevel(xp: number): number {
  return Math.min(Math.floor(Math.sqrt(xp / 100)) + 1, 25);
}

function xpForLevel(level: number): number {
  return (level - 1) * (level - 1) * 100;
}

function xpInCurrentLevel(xp: number): number {
  const lvl = xpToLevel(xp);
  return xp - xpForLevel(lvl);
}

function xpToNextLevel(xp: number): number {
  const lvl = xpToLevel(xp);
  return xpForLevel(lvl + 1) - xp;
}

export function GamificationDashboard({ userId }: GamificationDashboardProps) {
  const uid = userId || "";
  const { data: profile } = useQuery({
    queryKey: ["gamification-profile", uid],
    queryFn: async () => {
      const { data: p } = await supabase
        .from("profiles")
        .select("xp, current_streak, highest_streak, last_active_at")
        .eq("id", uid)
        .single();
      return p || { xp: 0, current_streak: 0, highest_streak: 0, last_active_at: null };
    },
    enabled: !!uid,
  });

  const { data: badges } = useQuery({
    queryKey: ["gamification-badges", uid],
    queryFn: async () => {
      const { data: b } = await supabase
        .from("user_badges")
        .select("badge_id, earned_at, badges(name, xp_required)")
        .eq("user_id", uid) as any;
      return (b as any[]) || [];
    },
    enabled: !!uid,
  });

  const earnedBadgeIds = useMemo(() => new Set((badges || []).map((b: any) => b.badge_id)), [badges]);
  const xp = profile?.xp ?? 0;
  const level = xpToLevel(xp);
  const rank = RANKS.find((r) => level >= r.min && level <= r.max) || RANKS[0];
  const progressPct = level >= 25 ? 100 : (xpInCurrentLevel(xp) / (xpInCurrentLevel(xp) + xpToNextLevel(xp))) * 100;
  const RankIcon = rank.icon;

  return (
    <div className="space-y-4">
      {/* Rank Card */}
      <div className={cn("relative rounded-xl border p-5 overflow-hidden", rank.border, rank.bg)}>
        <div className="flex items-start justify-between">
          <div>
            <div className={cn("text-xs font-semibold uppercase tracking-wider", rank.color)}>
              {rank.name} Rank
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">
              Level {level}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {xp.toLocaleString()} total XP
            </div>
          </div>
          <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center", rank.bg, rank.border, "border")}>
            <RankIcon className={cn("h-7 w-7", rank.color)} />
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Level {level}</span>
            <span>Level {level + 1}</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(progressPct, 100)}%`,
                background: `linear-gradient(90deg, ${rank.color.replace("text-", "")}, ${rank.color.replace("text-", "")}88)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <StatBox icon={Flame} label="Current Streak" value={`${profile?.current_streak ?? 0} days`} color="text-orange-500" />
        <StatBox icon={TrendingUp} label="Best Streak" value={`${profile?.highest_streak ?? 0} days`} color="text-blue-500" />
        <StatBox icon={Star} label="Level" value={String(level)} color="text-yellow-500" />
        <StatBox icon={Trophy} label="Badges" value={`${earnedBadgeIds.size}`} color="text-purple-500" />
      </div>

      {/* XP Sources Table */}
      <div className="rounded-xl border border-border/50 bg-card/30 p-4">
        <h4 className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-yellow-500" />
          XP Sources
        </h4>
        <div className="space-y-2">
          <XpSourceRow action="Complete a lesson" xp="+25" />
          <XpSourceRow action="Pass a quiz" xp="+50" />
          <XpSourceRow action="Daily login streak" xp="+10/day" />
          <XpSourceRow action="Course completion" xp="+250" />
          <XpSourceRow action="Generate concept map" xp="+15" />
          <XpSourceRow action="Use AI Explain feature" xp="+10" />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="rounded-xl border border-border/50 bg-card/30 p-4">
        <h4 className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
          <Medal className="h-3.5 w-3.5 text-amber-500" />
          Badges {badges && badges.length > 0 ? `(${earnedBadgeIds.size} earned)` : ""}
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {BADGE_THRESHOLDS.map((badge) => {
            const earned = earnedBadgeIds.has(badge.name) || xp >= badge.xp;
            return (
              <div
                key={badge.name}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                  earned ? "bg-primary/10 border border-primary/20" : "bg-muted/30 border border-transparent opacity-50",
                )}
              >
                <span className="text-xl">{badge.icon}</span>
                <span className={cn("text-[9px] font-semibold text-center leading-tight", earned ? "text-foreground" : "text-muted-foreground")}>
                  {badge.name}
                </span>
                <span className="text-[8px] text-muted-foreground">{badge.xp.toLocaleString()} XP</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streak Heatmap */}
      <div className="rounded-xl border border-border/50 bg-card/30 p-4">
        <h4 className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
          <Flame className="h-3.5 w-3.5 text-orange-500" />
          Activity
        </h4>
        <LearningHeatmap />
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/30">
      <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center bg-muted/30", color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className={cn("text-sm font-bold", color)}>{value}</p>
      </div>
    </div>
  );
}

function XpSourceRow({ action, xp }: { action: string; xp: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0">
      <span className="text-xs text-muted-foreground">{action}</span>
      <span className="text-xs font-semibold text-green-500">+{xp}</span>
    </div>
  );
}

const DAYS = 49; // 7 weeks

function LearningHeatmap() {
  const today = new Date();
  const days = useMemo(() => {
    return Array.from({ length: DAYS }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (DAYS - 1 - i));
      return { date: d, day: d.getDate(), weekday: d.getDay() };
    });
  }, []);

  return (
    <div className="flex gap-[2px] overflow-x-auto pb-1">
      {days.map((d, i) => {
        const intensity = Math.random() > 0.7 ? Math.floor(Math.random() * 4) : 0;
        return (
          <div
            key={i}
            className="w-3 h-3 rounded-sm shrink-0"
            style={{
              background: intensity === 0 ? "#1a1a2e"
                : intensity === 1 ? "#312e81"
                : intensity === 2 ? "#4338ca"
                : intensity === 3 ? "#6366f1"
                : "#818cf8",
            }}
            title={`${d.date.toLocaleDateString()}`}
          />
        );
      })}
    </div>
  );
}
