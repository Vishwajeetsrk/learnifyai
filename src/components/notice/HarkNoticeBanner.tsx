import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  ArrowRight,
  ShieldAlert,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface NoticeItem {
  id: string;
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "achievement" | "alert";
  actionLabel?: string;
  actionUrl?: string;
  persistentKey?: string; // If provided, dismissal persists in localStorage
  onAction?: () => void;
}

interface HarkNoticeBannerProps {
  notice?: NoticeItem;
  className?: string;
}

const TYPE_CONFIG = {
  info: {
    bg: "bg-indigo-950/40 border-indigo-500/30 text-indigo-200",
    badgeBg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    icon: Bell,
    iconColor: "text-indigo-400",
  },
  success: {
    bg: "bg-emerald-950/40 border-emerald-500/30 text-emerald-200",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    icon: CheckCircle2,
    iconColor: "text-emerald-400",
  },
  warning: {
    bg: "bg-amber-950/40 border-amber-500/30 text-amber-200",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    icon: AlertCircle,
    iconColor: "text-amber-400",
  },
  achievement: {
    bg: "bg-purple-950/40 border-purple-500/30 text-purple-200",
    badgeBg: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    icon: Flame,
    iconColor: "text-purple-400",
  },
  alert: {
    bg: "bg-rose-950/40 border-rose-500/30 text-rose-200",
    badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    icon: ShieldAlert,
    iconColor: "text-rose-400",
  },
};

export function HarkNoticeBanner({ notice, className = "" }: HarkNoticeBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Default notice if none passed
  const currentNotice: NoticeItem = notice || {
    id: "hark_live_oct2026",
    title: "Learnify AI 4.0 Live",
    message: "Interactive AI Tutor, Live Code Sandbox, and Tamper-Proof Guilloche Certificates are now active.",
    type: "info",
    actionLabel: "Explore Features",
    actionUrl: "/features",
    persistentKey: "learnify_notice_oct2026_seen",
  };

  useEffect(() => {
    if (currentNotice.persistentKey) {
      const isDismissed = localStorage.getItem(currentNotice.persistentKey);
      if (isDismissed === "true") {
        setIsVisible(false);
        return;
      }
    }
    setIsVisible(true);
  }, [currentNotice.persistentKey]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (currentNotice.persistentKey) {
      localStorage.setItem(currentNotice.persistentKey, "true");
    }
  };

  const config = TYPE_CONFIG[currentNotice.type || "info"];
  const IconComponent = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0, y: -10 }}
          animate={{ height: "auto", opacity: 1, y: 0 }}
          exit={{ height: 0, opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={`overflow-hidden border-b ${config.bg} backdrop-blur-md relative z-40 ${className}`}
          role="alert"
          aria-live="polite"
        >
          <div className="container mx-auto px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`p-1.5 rounded-lg border ${config.badgeBg} shrink-0`}>
                <IconComponent className={`h-4 w-4 ${config.iconColor}`} />
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground tracking-tight">
                  {currentNotice.title}
                </span>
                <span className="hidden sm:inline text-muted-foreground/60">·</span>
                <span className="text-muted-foreground line-clamp-1">
                  {currentNotice.message}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              {currentNotice.actionLabel && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs font-medium px-2.5 hover:bg-white/10 text-foreground"
                >
                  <a
                    href={currentNotice.actionUrl || "#"}
                    onClick={currentNotice.onAction}
                    className="inline-flex items-center gap-1.5"
                  >
                    <span>{currentNotice.actionLabel}</span>
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-white/10"
                aria-label="Dismiss notice"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
