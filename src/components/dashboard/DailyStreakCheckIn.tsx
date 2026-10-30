import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import {
  Flame,
  CheckCircle2,
  Sparkles,
  Trophy,
  Zap,
  Calendar,
  Lock,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { claimDailyStreak, getDailyStreakStatus } from "@/lib/gamification.functions";

export interface DailyStreakCheckInProps {
  currentStreak: number;
  highestStreak?: number;
  xp?: number;
  onCheckInSuccess?: (newStreak: number, newXp: number) => void;
  className?: string;
  variant?: "card" | "banner" | "compact";
}

// Days of the week labels
const DAYS_OF_WEEK = ["M", "T", "W", "T", "F", "S", "S"];

// Native Web Audio chime for celebratory feedback
function playChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "triangle";

    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
    osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.25); // G5

    osc2.frequency.setValueAtTime(261.63, now); // C4
    osc2.frequency.exponentialRampToValueAtTime(392.0, now + 0.2); // G4

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.6);
    osc2.stop(now + 0.6);
  } catch {
    // Audio context may be restricted by autoplay policy
  }
}

export function DailyStreakCheckIn({
  currentStreak = 1,
  highestStreak = 1,
  xp = 0,
  onCheckInSuccess,
  className = "",
  variant = "card",
}: DailyStreakCheckInProps) {
  const [hasCheckedIn, setHasCheckedIn] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(currentStreak);
  const [localXp, setLocalXp] = useState<number>(xp);
  const [flamePulsing, setFlamePulsing] = useState<boolean>(false);

  const claimStreakFn = useServerFn(claimDailyStreak);
  const getStatusFn = useServerFn(getDailyStreakStatus);

  const todayKey = useMemo(() => {
    return `learnify_checkin_${new Date().toISOString().slice(0, 10)}`;
  }, []);

  // Determine current day of week index (0 = Monday, 6 = Sunday)
  const todayDayIndex = useMemo(() => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1; // Convert to Mon-Sun (0-6)
  }, []);

  useEffect(() => {
    setStreakCount(currentStreak);
  }, [currentStreak]);

  useEffect(() => {
    setLocalXp(xp);
  }, [xp]);

  useEffect(() => {
    const claimedToday = localStorage.getItem(todayKey) === "true";
    if (claimedToday) {
      setHasCheckedIn(true);
    }

    // Server-verified check-in status (syncs across devices and incognito tabs)
    const tz =
      typeof Intl !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : "UTC";

    getStatusFn({ data: { timezone: tz } })
      .then((status) => {
        if (status?.hasCheckedInToday) {
          setHasCheckedIn(true);
          localStorage.setItem(todayKey, "true");
        }
        if (typeof status?.currentStreak === "number") {
          setStreakCount(status.currentStreak);
        }
        if (typeof status?.xp === "number") {
          setLocalXp(status.xp);
        }
      })
      .catch(() => {
        // Fallback gracefully to local state
      });
  }, [getStatusFn, todayKey]);

  const handleClaim = useCallback(async () => {
    if (hasCheckedIn || isSubmitting) return;

    setIsSubmitting(true);
    setFlamePulsing(true);
    playChime();

    try {
      const tz =
        typeof Intl !== "undefined"
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : "UTC";

      const res = await claimStreakFn({ data: { timezone: tz } });

      if (res && res.success) {
        // Dynamic fire & confetti burst
        confetti({
          particleCount: 85,
          spread: 80,
          origin: { y: 0.65 },
          colors: ["#F97316", "#EF4444", "#FBBF24", "#6366F1", "#10B981"],
        });

        localStorage.setItem(todayKey, "true");
        setHasCheckedIn(true);
        setStreakCount(res.streak);
        setLocalXp(res.xp);

        if (res.alreadyClaimed) {
          toast.info("Streak already active for today! Come back tomorrow.");
        } else if (res.isMilestone) {
          toast.success(`🎉 Milestone Reached: ${res.streak}-Day Streak!`, {
            description: `+${res.awardedXp} XP awarded (including +${res.milestoneBonus} milestone bonus)!`,
          });
        } else {
          toast.success(`🔥 Day ${res.streak} Streak Maintained!`, {
            description: `+${res.awardedXp} XP awarded. Come back tomorrow to continue your streak!`,
          });
        }

        onCheckInSuccess?.(res.streak, res.xp);
      } else {
        toast.error("Could not record check-in. Please try again.");
      }
    } catch {
      toast.error("Could not record check-in. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFlamePulsing(false), 1200);
    }
  }, [hasCheckedIn, isSubmitting, claimStreakFn, todayKey, onCheckInSuccess]);

  // Next streak milestone calculation (e.g. 7 days, 14 days, 30 days)
  const nextMilestone = useMemo(() => {
    if (streakCount < 7) return 7;
    if (streakCount < 14) return 14;
    if (streakCount < 30) return 30;
    if (streakCount < 60) return 60;
    if (streakCount < 100) return 100;
    return streakCount + 7;
  }, [streakCount]);

  const milestoneProgress = Math.min(100, Math.round((streakCount / nextMilestone) * 100));

  // Compact Variant (for topbar or slim widgets)
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center justify-between p-3 rounded-2xl border bg-card/80 backdrop-blur-md shadow-sm transition",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-orange-500/20 via-red-500/15 to-amber-500/10 border border-orange-500/30 flex items-center justify-center">
            <Flame
              className={cn(
                "h-5 w-5 text-orange-500 fill-orange-500 transition-transform duration-300",
                flamePulsing ? "scale-125 text-amber-400" : "animate-pulse"
              )}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-foreground">{streakCount} Day Streak</span>
              {hasCheckedIn && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {hasCheckedIn ? "Checked in today (+10 XP)" : "Check in to keep streak"}
            </p>
          </div>
        </div>

        <Button
          size="sm"
          disabled={hasCheckedIn || isSubmitting}
          onClick={handleClaim}
          className={cn(
            "h-8 text-xs font-semibold rounded-xl transition",
            hasCheckedIn
              ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/20 cursor-default"
              : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm active:scale-95 cursor-pointer"
          )}
        >
          {hasCheckedIn ? "Maintained" : "Check In"}
        </Button>
      </div>
    );
  }

  // Full Interactive Card Variant (Primary for Dashboard)
  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/95 to-background shadow-card p-5 sm:p-6 transition-all duration-300",
        className
      )}
    >
      {/* Dynamic ambient fire glow in background */}
      <div
        className={cn(
          "pointer-events-none absolute -top-16 -right-16 h-52 w-52 rounded-full transition-opacity duration-700 blur-3xl",
          hasCheckedIn
            ? "bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent opacity-70"
            : "bg-gradient-to-br from-orange-500/20 via-red-500/15 to-transparent opacity-80"
        )}
      />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Header: Title & Status Badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-base text-foreground tracking-tight">
              Daily Streak Check-In
            </h3>
          </div>

          {hasCheckedIn ? (
            <Badge className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[11px] font-semibold py-0.5 px-2.5">
              <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-500" />
              Completed Today
            </Badge>
          ) : (
            <Badge className="bg-orange-500/15 text-orange-500 border border-orange-500/30 text-[11px] font-semibold py-0.5 px-2.5 animate-pulse">
              <Sparkles className="h-3 w-3 mr-1 text-orange-400" />
              +10 XP Ready
            </Badge>
          )}
        </div>

        {/* ── Centerpiece: Interactive Flame Reactor & Days Ring ── */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-muted/20 border border-border/60">
          {/* Animated Living Flame Orb */}
          <button
            type="button"
            onClick={!hasCheckedIn ? handleClaim : undefined}
            disabled={hasCheckedIn || isSubmitting}
            title={hasCheckedIn ? "Streak locked for today!" : "Click to check in now"}
            className={cn(
              "group relative shrink-0 w-24 h-24 rounded-2xl flex flex-col items-center justify-center p-2 transition-all duration-300 shadow-md",
              hasCheckedIn
                ? "bg-gradient-to-b from-emerald-500/15 via-emerald-500/5 to-transparent border border-emerald-500/30 cursor-default"
                : "bg-gradient-to-b from-orange-500/20 via-red-500/10 to-amber-500/5 border border-orange-500/40 cursor-pointer hover:scale-105 active:scale-95 hover:shadow-orange-500/20"
            )}
          >
            {/* Pulsing Aura Rings */}
            <span
              className={cn(
                "absolute inset-0 rounded-2xl transition-opacity",
                hasCheckedIn
                  ? "bg-emerald-500/10 opacity-50"
                  : "bg-orange-500/15 group-hover:opacity-100 opacity-60 animate-pulse"
              )}
            />

            {/* Flame Icon with Dynamic Multi-layer SVG */}
            <div className="relative z-10 flex flex-col items-center">
              <Flame
                className={cn(
                  "h-10 w-10 transition-all duration-300 drop-shadow-md",
                  hasCheckedIn
                    ? "text-emerald-500 fill-emerald-500/80 scale-100"
                    : "text-orange-500 fill-orange-500 group-hover:scale-110 group-hover:text-amber-400",
                  flamePulsing && "scale-125 text-amber-300 fill-amber-400"
                )}
              />
              <span className="font-display font-extrabold text-xs mt-1 text-foreground">
                {streakCount} {streakCount === 1 ? "Day" : "Days"}
              </span>
            </div>
          </button>

          {/* Interactive 7-Day Week Calendar */}
          <div className="flex-1 w-full space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                <span>This Week's Track</span>
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                {hasCheckedIn ? "Streak Active" : "Check-in required"}
              </span>
            </div>

            {/* 7 Days of the Week Bubbles */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {DAYS_OF_WEEK.map((dayLabel, idx) => {
                const isPast = idx < todayDayIndex;
                const isToday = idx === todayDayIndex;
                const isFuture = idx > todayDayIndex;

                // Accurate check: A past day of this week was maintained only if within the active streak
                const daysAgo = todayDayIndex - idx;
                const isMarkedDone =
                  (isToday && hasCheckedIn) ||
                  (isPast && daysAgo <= (hasCheckedIn ? streakCount - 1 : streakCount));

                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-1"
                    title={`${dayLabel} — ${isToday ? "Today" : isPast ? "Completed" : "Upcoming"}`}
                  >
                    <div
                      className={cn(
                        "w-full aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-200 border",
                        isMarkedDone
                          ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/40 shadow-sm"
                          : isToday
                            ? "bg-orange-500/20 text-orange-500 border-orange-500/60 ring-2 ring-orange-500/30 animate-pulse"
                            : "bg-muted/40 text-muted-foreground/50 border-border/40"
                      )}
                    >
                      {isMarkedDone ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      ) : isToday ? (
                        <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
                      ) : (
                        <span className="text-[11px] opacity-40 font-mono">·</span>
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-mono",
                        isToday ? "font-bold text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
              <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
              <span>Next Reward: {nextMilestone}-Day Milestone (+50 Bonus XP)</span>
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">
              {streakCount}/{nextMilestone} Days
            </span>
          </div>

          <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden p-0.5 border border-border/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 transition-all duration-700"
              style={{ width: `${milestoneProgress}%` }}
            />
          </div>
        </div>

        {/* Action Button & Best Streak Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50">
          <Button
            onClick={handleClaim}
            disabled={hasCheckedIn || isSubmitting}
            size="sm"
            className={cn(
              "rounded-xl font-semibold px-4 h-9 text-xs transition-all duration-300 shadow-sm",
              hasCheckedIn
                ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/20 cursor-default"
                : "bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/20 active:scale-95 cursor-pointer"
            )}
          >
            {hasCheckedIn ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
                Streak Maintained Today
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5 mr-1.5 fill-current" />
                Claim Daily Check-In (+10 XP)
              </>
            )}
          </Button>

          {highestStreak > 1 && (
            <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
              <Trophy className="h-3.5 w-3.5 text-amber-500" />
              <span>Best: {highestStreak} Days</span>
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
