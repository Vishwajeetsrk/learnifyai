import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, CheckCircle2, Sparkles, Trophy, Calendar, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export interface DailyStreakCheckInProps {
  currentStreak: number;
  highestStreak?: number;
  xp?: number;
  onCheckInSuccess?: (newStreak: number, newXp: number) => void;
  className?: string;
  variant?: "card" | "banner" | "compact";
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

  const todayKey = `learnify_checkin_${new Date().toISOString().slice(0, 10)}`;

  useEffect(() => {
    setStreakCount(currentStreak);
  }, [currentStreak]);

  useEffect(() => {
    setLocalXp(xp);
  }, [xp]);

  useEffect(() => {
    // Check if user already claimed today
    const claimedToday = localStorage.getItem(todayKey) === "true";
    setHasCheckedIn(claimedToday);
  }, [todayKey]);

  const handleClaim = () => {
    if (hasCheckedIn || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Trigger festive fire/streak confetti
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#ff9800", "#f44336", "#ffb258", "#6366f1"],
      });

      const updatedStreak = streakCount + (hasCheckedIn ? 0 : 1);
      const updatedXp = localXp + 10;

      localStorage.setItem(todayKey, "true");
      setHasCheckedIn(true);
      setStreakCount(updatedStreak);
      setLocalXp(updatedXp);

      toast.success(`🔥 ${updatedStreak} Day Streak Maintained! +10 XP awarded!`, {
        description: "Keep showing up daily to unlock leaderboard badges.",
      });

      if (onCheckInSuccess) {
        onCheckInSuccess(updatedStreak, updatedXp);
      }
    } catch {
      toast.error("Could not record check-in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compact Variant (e.g. for sidebars or header dropdowns)
  if (variant === "compact") {
    return (
      <div className={`flex items-center justify-between p-3 rounded-2xl border bg-card/60 backdrop-blur-sm ${className}`}>
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <img
              src="/illustrations/Check-In_Stream.svg"
              alt="Daily Streak Check-In"
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-foreground">{streakCount} Day Streak</span>
              {hasCheckedIn && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {hasCheckedIn ? "Checked in today (+10 XP)" : "Check in to keep your streak"}
            </p>
          </div>
        </div>

        <Button
          size="sm"
          disabled={hasCheckedIn || isSubmitting}
          onClick={handleClaim}
          className={`h-8 text-xs font-semibold rounded-xl ${
            hasCheckedIn
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
              : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm"
          }`}
        >
          {hasCheckedIn ? "Maintained" : "Check In"}
        </Button>
      </div>
    );
  }

  // Full Card Variant (Default for dashboard)
  return (
    <Card
      className={`relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card/90 to-background shadow-card p-6 ${className}`}
    >
      {/* Decorative fire glow in background */}
      <div className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-gradient-to-br from-orange-500/15 via-red-500/10 to-transparent blur-3xl" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
        {/* Animated SVG Stream Asset */}
        <div className="relative shrink-0 w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center rounded-2xl bg-gradient-to-b from-orange-500/10 to-red-500/5 border border-orange-500/20 p-2 shadow-inner">
          <img
            src="/illustrations/Check-In_Stream.svg"
            alt="Check-In Stream Animation"
            className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-300 hover:scale-105"
            loading="eager"
          />
          <Badge
            variant="outline"
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-card border-orange-500/40 text-orange-500 text-[10px] font-bold px-2 py-0.5 shadow-sm whitespace-nowrap"
          >
            🔥 {streakCount} Days
          </Badge>
        </div>

        {/* Content & Action */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="font-display font-bold text-lg text-foreground">
              Daily Streak Check-In
            </h3>
            {hasCheckedIn ? (
              <Badge className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[10px]">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Completed Today
              </Badge>
            ) : (
              <Badge className="bg-orange-500/15 text-orange-500 border border-orange-500/30 text-[10px] animate-pulse">
                <Sparkles className="h-3 w-3 mr-1" />
                +10 XP Available
              </Badge>
            )}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
            {hasCheckedIn
              ? `You've locked in your Day ${streakCount} streak! Come back tomorrow to continue your momentum toward the Top 10 Leaderboard.`
              : "Check in today to maintain your learning streak, boost your XP rank, and keep your flame alive."}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <Button
              onClick={handleClaim}
              disabled={hasCheckedIn || isSubmitting}
              className={`rounded-xl font-medium px-5 h-9 text-xs transition-all duration-300 ${
                hasCheckedIn
                  ? "bg-muted text-muted-foreground cursor-default hover:bg-muted"
                  : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md hover:shadow-orange-500/25 active:scale-95"
              }`}
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
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Trophy className="h-3 w-3 text-amber-500" />
                Best: {highestStreak} Days
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
