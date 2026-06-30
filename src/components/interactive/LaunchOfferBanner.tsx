import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

const TARGET_DATE_KEY = "learnify_launch_offer_date";

interface LaunchOfferBannerProps {
  className?: string;
}

export function LaunchOfferBanner({ className }: LaunchOfferBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    let stored = localStorage.getItem(TARGET_DATE_KEY);
    let date: Date;
    if (stored) {
      date = new Date(stored);
      if (isNaN(date.getTime())) {
        date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        localStorage.setItem(TARGET_DATE_KEY, date.toISOString());
      }
    } else {
      date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      localStorage.setItem(TARGET_DATE_KEY, date.toISOString());
    }
    setTargetDate(date);
  }, []);

  useEffect(() => {
    if (!targetDate) return;
    const tick = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (dismissed) return null;

  return (
    <motion.div
      className={cn(
        "relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden",
        className,
      )}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
    >
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white blur-3xl" />
      </div>
      <div className="relative px-4 py-2.5 flex items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm flex-wrap">
        <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          Launch Offer
        </span>
        <span className="inline-flex items-center gap-1">
          <Percent className="w-3.5 h-3.5 text-yellow-300" />
          <span className="font-semibold">20% Off</span>
          <span className="hidden sm:inline text-white/70">— Limited Time</span>
        </span>
        <span className="hidden sm:inline text-white/40">|</span>
        <span className="inline-flex items-center gap-2 font-mono">
          <span className="inline-flex items-center gap-1">
            <span className="bg-white/15 rounded px-1.5 py-0.5 font-bold tabular-nums">
              {String(timeLeft.days).padStart(2, "0")}
            </span>
            <span className="text-white/60 text-[10px]">d</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="bg-white/15 rounded px-1.5 py-0.5 font-bold tabular-nums">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-white/60 text-[10px]">h</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="bg-white/15 rounded px-1.5 py-0.5 font-bold tabular-nums">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-white/60 text-[10px]">m</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="bg-white/15 rounded px-1.5 py-0.5 font-bold tabular-nums">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="text-white/60 text-[10px]">s</span>
          </span>
        </span>
        <Button
          asChild
          size="sm"
          className="h-7 text-[10px] sm:text-xs px-3 rounded-full bg-white text-indigo-700 hover:bg-white/90 font-bold shadow-sm"
        >
          <Link to="/signup">Claim Now</Link>
        </Button>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
