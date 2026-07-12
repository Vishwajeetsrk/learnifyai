import { useState, useEffect, useMemo } from "react";
import { X, Sparkles, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { usePublicSection } from "@/hooks/use-wcms-public";

const DISMISSED_KEY = "learnify_promo_banner_dismissed";

interface PromoBannerContent {
  enabled?: boolean;
  headline?: string;
  discount?: string;
  subtitle?: string;
  cta?: string;
  ctaLink?: string;
  timerEndDate?: string;
  bgGradient?: string;
  dismissible?: boolean;
}

const DEFAULT_CONTENT: PromoBannerContent = {
  enabled: true,
  headline: "Launch Offer",
  discount: "20% Off",
  subtitle: "Limited Time",
  cta: "Claim Now",
  ctaLink: "/pricing?coupon=LAUNCH20",
  timerEndDate: "",
  bgGradient: "from-blue-600 via-indigo-600 to-purple-700",
  dismissible: true,
};

interface LaunchOfferBannerProps {
  className?: string;
}

export function LaunchOfferBanner({ className }: LaunchOfferBannerProps) {
  const { data: cms } = usePublicSection("promo-banner");
  const content: PromoBannerContent = cms?.content
    ? { ...DEFAULT_CONTENT, ...(cms.content as PromoBannerContent) }
    : DEFAULT_CONTENT;

  const [dismissed, setDismissed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(DISMISSED_KEY) === "true";
    }
    return false;
  });
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetStr = content.timerEndDate;
    let target: Date | null = null;
    if (targetStr) {
      target = new Date(targetStr);
      if (isNaN(target.getTime())) target = null;
    }
    if (!target) {
      target = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    const tick = () => {
      const diff = target!.getTime() - Date.now();
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
  }, [content.timerEndDate]);

  const navigate = useNavigate();

  if (!content.enabled) return null;
  if (content.dismissible && dismissed) return null;

  const parsedLink = useMemo(() => {
    const raw = content.ctaLink || "/signup";
    try {
      const url = new URL(raw, window.location.origin);
      const params: Record<string, string> = {};
      url.searchParams.forEach((v, k) => {
        params[k] = v;
      });
      return { to: url.pathname, search: params };
    } catch {
      return { to: raw, search: {} };
    }
  }, [content.ctaLink]);

  return (
    <div
      className={cn(
        "relative bg-gradient-to-r text-white overflow-hidden",
        content.bgGradient || "from-blue-600 via-indigo-600 to-purple-700",
        className,
      )}
    >
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white blur-3xl" />
      </div>
      <div className="relative px-4 py-2.5 flex items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm flex-wrap">
        <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          {content.headline}
        </span>
        <span className="inline-flex items-center gap-1">
          <Percent className="w-3.5 h-3.5 text-yellow-300" />
          <span className="font-semibold">{content.discount}</span>
          {content.subtitle && (
            <span className="hidden sm:inline text-white/70">— {content.subtitle}</span>
          )}
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
          size="sm"
          className="h-7 text-[10px] sm:text-xs px-3 rounded-full bg-white text-indigo-700 hover:bg-white/90 font-bold shadow-sm"
          onClick={() => navigate({ to: parsedLink.to, search: parsedLink.search })}
        >
          {content.cta}
        </Button>
        {content.dismissible && (
          <button
            onClick={() => {
              setDismissed(true);
              localStorage.setItem(DISMISSED_KEY, "true");
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
