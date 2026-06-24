import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Check,
  RotateCcw,
  HelpCircle,
  Target,
  Lightbulb,
  Rocket,
  Star,
  Award,
  Users,
  GraduationCap,
  Shield,
  Compass,
  Zap,
  Eye,
  MousePointerClick,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { completeOnboardingStep, getOnboardingProgress } from "@/lib/onboarding.functions";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

type TourPlacement = "top" | "bottom" | "left" | "right";

interface TourStep {
  id: string;
  target: string;
  title: string;
  content: string;
  placement?: TourPlacement;
  icon?: LucideIcon;
  action?: "click" | "scroll" | "type" | "hover";
  highlightPadding?: number;
  disableBackdrop?: boolean;
  role?: "student" | "creator" | "admin";
  mandatory?: boolean;
  skippable?: boolean;
}

interface Tour {
  id: string;
  name: string;
  description: string;
  steps: TourStep[];
  role?: "student" | "creator" | "admin";
  category: "onboarding" | "features" | "advanced" | "role";
}

interface Hotspot {
  id: string;
  target: string;
  title: string;
  content: string;
  icon?: LucideIcon;
  color?: string;
  role?: "student" | "creator" | "admin";
  dismissed?: boolean;
}

interface Tooltip {
  id: string;
  target: string;
  content: string;
  placement?: TourPlacement;
  icon?: LucideIcon;
  dismissable?: boolean;
}

interface TourContextValue {
  isActive: boolean;
  currentTour: Tour | null;
  currentStepIndex: number;
  completedTours: string[];
  startTour: (tour: Tour) => void;
  stopTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipStep: () => void;
  completeTour: () => void;
  isTourCompleted: (tourId: string) => boolean;
  showHotspot: (hotspot: Hotspot) => void;
  hideHotspot: () => void;
  showTooltip: (tooltip: Tooltip) => void;
  hideTooltip: () => void;
  activeHotspot: Hotspot | null;
  activeTooltip: Tooltip | null;
  dismissHotspot: (id: string) => void;
  getProgress: () => number;
}

// ═══════════════════════════════════════════════════════════════
// TOUR DEFINITIONS — Role-specific tours
// ═══════════════════════════════════════════════════════════════

// eslint-disable-next-line react-refresh/only-export-components
export const STUDENT_TOUR: Tour = {
  id: "student-onboarding",
  name: "Welcome to Learnify",
  description: "Your learning journey starts here",
  role: "student",
  category: "onboarding",
  steps: [
    {
      id: "dashboard",
      target: '[data-tour="nav-dashboard"]',
      title: "Your Dashboard",
      content:
        "This is your command center. Track progress, view courses, and see achievements — all in one place.",
      icon: Target,
      placement: "right",
    },
    {
      id: "courses",
      target: '[data-tour="nav-courses"]',
      title: "Browse Courses",
      content:
        "Explore hundreds of courses across programming, AI, design, and more. Each course has interactive exercises and AI tutoring.",
      icon: GraduationCap,
      placement: "right",
    },
    {
      id: "ai-chat",
      target: '[data-tour="nav-ai"]',
      title: "AI Assistant",
      content:
        "Get instant help from our AI tutor. Ask questions, get code explanations, or brainstorm ideas — available 24/7.",
      icon: Sparkles,
      placement: "right",
    },
    {
      id: "leaderboard",
      target: '[data-tour="nav-leaderboard"]',
      title: "Leaderboard",
      content:
        "Compete with other learners! Earn XP for completing courses, exercises, and daily challenges.",
      icon: Award,
      placement: "right",
    },
    {
      id: "community",
      target: '[data-tour="nav-community"]',
      title: "Community",
      content:
        "Connect with other learners, share projects, and get feedback. Learning is better together!",
      icon: Users,
      placement: "right",
    },
    {
      id: "profile",
      target: '[data-tour="user-menu"]',
      title: "Your Profile",
      content:
        "Customize your profile, set your avatar, add social links, and track your learning streak.",
      icon: Star,
      placement: "bottom",
    },
  ],
};

// eslint-disable-next-line react-refresh/only-export-components
export const CREATOR_TOUR: Tour = {
  id: "creator-onboarding",
  name: "Creator Toolkit",
  description: "Everything you need to create and sell courses",
  role: "creator",
  category: "role",
  steps: [
    {
      id: "creator-dashboard",
      target: '[data-tour="nav-dashboard"]',
      title: "Creator Dashboard",
      content: "View your earnings, subscriber count, and course performance at a glance.",
      icon: Target,
      placement: "right",
    },
    {
      id: "courses-manage",
      target: '[data-tour="nav-courses"]',
      title: "Manage Courses",
      content:
        "Create, edit, and publish courses. Add lessons, exercises, and track student progress.",
      icon: GraduationCap,
      placement: "right",
    },
    {
      id: "coaching",
      target: '[data-tour="nav-coaching"]',
      title: "Coaching Hub",
      content: "Offer 1-on-1 coaching sessions, create learning roadmaps, and manage your cohorts.",
      icon: Compass,
      placement: "right",
    },
    {
      id: "earnings",
      target: '[data-tour="nav-wallet"]',
      title: "Earnings & Wallet",
      content: "Track your earnings, request withdrawals, and manage your payout settings.",
      icon: Zap,
      placement: "right",
    },
    {
      id: "subscribers",
      target: '[data-tour="nav-inbox"]',
      title: "Subscriber Inbox",
      content: "Communicate with your subscribers, answer questions, and build your community.",
      icon: Users,
      placement: "right",
    },
  ],
};

// eslint-disable-next-line react-refresh/only-export-components
export const ADMIN_TOUR: Tour = {
  id: "admin-onboarding",
  name: "Admin Command Center",
  description: "Manage the entire platform",
  role: "admin",
  category: "role",
  steps: [
    {
      id: "admin-overview",
      target: '[data-tour="nav-admin"]',
      title: "Admin Dashboard",
      content:
        "Platform-wide analytics, user management, and system health — all at your fingertips.",
      icon: Shield,
      placement: "right",
    },
    {
      id: "content-manager",
      target: '[data-tour="nav-admin"]',
      title: "Content Manager",
      content:
        "Manage events, jobs, pricing, FAQs, pages, roadmaps, coupons, and feature visibility.",
      icon: Eye,
      placement: "right",
    },
    {
      id: "wcms",
      target: '[data-tour="nav-admin"]',
      title: "WCMS Pages",
      content:
        "Build pages with drag-drop blocks, manage media, and edit navigation menus — no coding required.",
      icon: Rocket,
      placement: "right",
    },
    {
      id: "features",
      target: '[data-tour="nav-admin"]',
      title: "Feature Flags",
      content: "Toggle features on/off, enable maintenance mode, and manage role-based access.",
      icon: Zap,
      placement: "right",
    },
  ],
};

// eslint-disable-next-line react-refresh/only-export-components
export const FEATURES_TOUR: Tour = {
  id: "features-tour",
  name: "Platform Features",
  description: "Discover what you can do",
  category: "features",
  steps: [
    {
      id: "playground",
      target: '[data-tour="nav-courses"]',
      title: "Code Playground",
      content:
        "Write and run code directly in your browser. Supports JavaScript, Python, React, and more.",
      icon: Rocket,
      placement: "right",
    },
    {
      id: "ai-tools",
      target: '[data-tour="nav-ai-tools"]',
      title: "AI Tools",
      content:
        "AI-powered thumbnail generation, code review, interview prep, and learning path creation.",
      icon: Sparkles,
      placement: "right",
    },
    {
      id: "certificates",
      target: '[data-tour="nav-certificates"]',
      title: "Certificates",
      content:
        "Earn verified certificates upon course completion. Share them on LinkedIn or your portfolio.",
      icon: Award,
      placement: "right",
    },
    {
      id: "achievements",
      target: '[data-tour="nav-achievements"]',
      title: "Achievements & Badges",
      content: "Collect badges for milestones, daily streaks, and special accomplishments.",
      icon: Star,
      placement: "right",
    },
  ],
};

// eslint-disable-next-line react-refresh/only-export-components
export const ALL_TOURS: Tour[] = [STUDENT_TOUR, CREATOR_TOUR, ADMIN_TOUR, FEATURES_TOUR];

// ═══════════════════════════════════════════════════════════════
// TOUR CONTEXT
// ═══════════════════════════════════════════════════════════════

const TourContext = createContext<TourContextValue | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within TourProvider");
  return ctx;
}

// ═══════════════════════════════════════════════════════════════
// TOUR PROVIDER
// ═══════════════════════════════════════════════════════════════

export function TourProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const completeStepFn = useServerFn(completeOnboardingStep);
  const getProgressFn = useServerFn(getOnboardingProgress);

  const [isActive, setIsActive] = useState(false);
  const [currentTour, setCurrentTour] = useState<Tour | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedTours, setCompletedTours] = useState<string[]>([]);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<Tooltip | null>(null);
  const [dismissedHotspots, setDismissedHotspots] = useState<Set<string>>(new Set());

  // Load completed tours from DB
  /* eslint-disable react-hooks/exhaustive-deps -- getProgressFn is a stable server fn */
  useEffect(() => {
    if (!user) return;
    getProgressFn()
      .then((progress) => {
        if (progress?.completed_steps?.includes("product_tour")) {
          setCompletedTours((prev) => [...new Set([...prev, "student-onboarding"])]);
        }
      })
      .catch(() => {});
  }, [user]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const getProgress = useCallback(() => {
    if (!currentTour) return 0;
    return Math.round(((currentStepIndex + 1) / currentTour.steps.length) * 100);
  }, [currentTour, currentStepIndex]);

  const startTour = useCallback((tour: Tour) => {
    setCurrentTour(tour);
    setCurrentStepIndex(0);
    setIsActive(true);
    setActiveHotspot(null);
    setActiveTooltip(null);
  }, []);

  const stopTour = useCallback(() => {
    setIsActive(false);
    setCurrentTour(null);
    setCurrentStepIndex(0);
  }, []);

  const nextStep = useCallback(() => {
    if (!currentTour) return;
    if (currentStepIndex < currentTour.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      completeTour();
    }
  }, [currentTour, currentStepIndex]); // eslint-disable-line react-hooks/exhaustive-deps -- completeTour is stable

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const skipStep = useCallback(() => {
    if (!currentTour) return;
    const step = currentTour.steps[currentStepIndex];
    if (step.skippable !== false) {
      nextStep();
    }
  }, [currentTour, currentStepIndex, nextStep]);

  const completeTour = useCallback(async () => {
    if (!currentTour) return;
    setCompletedTours((prev) => [...new Set([...prev, currentTour.id])]);
    try {
      await completeStepFn({ data: { step: "product_tour" } });
      qc.invalidateQueries({ queryKey: ["onboarding-progress"] });
    } catch {
      // Non-blocking — tour completion is saved locally regardless
    }
    toast.success(`${currentTour.name} completed!`);
    stopTour();
  }, [currentTour, completeStepFn, qc, stopTour]);

  const isTourCompleted = useCallback(
    (tourId: string) => completedTours.includes(tourId),
    [completedTours],
  );

  const showHotspot = useCallback(
    (hotspot: Hotspot) => {
      if (dismissedHotspots.has(hotspot.id)) return;
      setActiveHotspot(hotspot);
      setActiveTooltip(null);
    },
    [dismissedHotspots],
  );

  const hideHotspot = useCallback(() => {
    setActiveHotspot(null);
  }, []);

  const showTooltip = useCallback((tooltip: Tooltip) => {
    setActiveTooltip(tooltip);
    setActiveHotspot(null);
  }, []);

  const hideTooltip = useCallback(() => {
    setActiveTooltip(null);
  }, []);

  const dismissHotspot = useCallback((id: string) => {
    setDismissedHotspots((prev) => new Set([...prev, id]));
    setActiveHotspot(null);
  }, []);

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentTour,
        currentStepIndex,
        completedTours,
        startTour,
        stopTour,
        nextStep,
        prevStep,
        skipStep,
        completeTour,
        isTourCompleted,
        showHotspot,
        hideHotspot,
        showTooltip,
        hideTooltip,
        activeHotspot,
        activeTooltip,
        dismissHotspot,
        getProgress,
      }}
    >
      {children}
      {isActive && currentTour && <TourOverlay />}
      {activeHotspot && <HotspotPopup hotspot={activeHotspot} />}
      {activeTooltip && <TooltipPopup tooltip={activeTooltip} />}
    </TourContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════
// TOUR OVERLAY — Step-by-step with spotlight
// ═══════════════════════════════════════════════════════════════

function TourOverlay() {
  const { currentTour, currentStepIndex, nextStep, prevStep, skipStep, stopTour, getProgress } =
    useTour();

  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const step = currentTour?.steps[currentStepIndex];
  const totalSteps = currentTour?.steps.length ?? 0;
  const progress = getProgress();
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Find target element and position tooltip
  useEffect(() => {
    if (!step) return;
    let retries = 0;
    const MAX_RETRIES = 5;

    const findTarget = () => {
      const el = document.querySelector(step.target);
      if (el) {
        const rect = el.getBoundingClientRect();
        setHighlightRect(rect);

        // Scroll element into view
        el.scrollIntoView({ behavior: "smooth", block: "center" });

        // Position tooltip
        const placement = step.placement ?? "bottom";
        const gap = 16;
        let x = 0,
          y = 0;

        switch (placement) {
          case "top":
            x = rect.left + rect.width / 2;
            y = rect.top - gap;
            break;
          case "bottom":
            x = rect.left + rect.width / 2;
            y = rect.bottom + gap;
            break;
          case "left":
            x = rect.left - gap;
            y = rect.top + rect.height / 2;
            break;
          case "right":
            x = rect.right + gap;
            y = rect.top + rect.height / 2;
            break;
        }
        setTooltipPos({ x, y });
      } else {
        retries++;
        if (retries >= MAX_RETRIES) {
          // Target doesn't exist on this page — auto-skip to next step
          nextStep();
          return;
        }
        setTimeout(findTarget, 200);
      }
    };

    findTarget();
  }, [step, currentStepIndex, nextStep]);

  if (!step || !currentTour) return null;

  const Icon = step.icon ?? Sparkles;
  const placement = step.placement ?? "bottom";

  return createPortal(
    <div className="fixed inset-0 z-[9999]" onClick={(e) => e.stopPropagation()}>
      {/* Backdrop */}
      {!step.disableBackdrop && <div className="absolute inset-0 bg-black/50 transition-opacity" />}

      {/* Spotlight cutout */}
      {highlightRect && !step.disableBackdrop && (
        <div
          className="absolute rounded-xl border-2 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] transition-all duration-300 pointer-events-none"
          style={{
            top: highlightRect.top - (step.highlightPadding ?? 8),
            left: highlightRect.left - (step.highlightPadding ?? 8),
            width: highlightRect.width + (step.highlightPadding ?? 8) * 2,
            height: highlightRect.height + (step.highlightPadding ?? 8) * 2,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={cn(
          "absolute z-[10000] w-[calc(100vw-2rem)] max-w-[340px] bg-card border rounded-2xl shadow-2xl p-4 sm:p-5 animate-in fade-in-0 zoom-in-95",
          placement === "top" && "bottom-auto",
          placement === "bottom" && "top-auto",
          placement === "left" && "right-auto",
          placement === "right" && "left-auto",
        )}
        style={{
          top: Math.max(
            16,
            Math.min(
              placement === "bottom"
                ? tooltipPos.y + 12
                : placement === "top"
                  ? tooltipPos.y - 320
                  : tooltipPos.y - 100,
              window.innerHeight - 340,
            ),
          ),
          left: Math.max(
            16,
            Math.min(
              placement === "right"
                ? tooltipPos.x + 12
                : placement === "left"
                  ? tooltipPos.x - 356
                  : tooltipPos.x - 170,
              window.innerWidth - 356,
            ),
          ),
        }}
      >
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold uppercase text-primary tracking-wider">
              Step {currentStepIndex + 1} of {totalSteps}
            </span>
            <span className="text-[10px] text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* Step content */}
        <div className="flex items-start gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{step.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{step.content}</p>
          </div>
        </div>

        {/* Action hint */}
        {step.action && (
          <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-muted/50 text-xs text-muted-foreground">
            {step.action === "click" && <MousePointerClick className="h-3.5 w-3.5" />}
            {step.action === "hover" && <Eye className="h-3.5 w-3.5" />}
            {step.action === "scroll" && <ChevronRight className="h-3.5 w-3.5" />}
            {step.action === "type" && <HelpCircle className="h-3.5 w-3.5" />}
            <span>
              {step.action === "click" && "Click the highlighted element to continue"}
              {step.action === "hover" && "Hover over the highlighted element"}
              {step.action === "scroll" && "Scroll to explore this section"}
              {step.action === "type" && "Try typing in the highlighted field"}
            </span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 sm:gap-2">
            {currentStepIndex > 0 && (
              <Button variant="ghost" size="sm" onClick={prevStep} className="text-xs sm:text-sm">
                <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Back
              </Button>
            )}
            {step.skippable !== false && (
              <Button
                variant="ghost"
                size="sm"
                onClick={skipStep}
                className="text-muted-foreground text-xs sm:text-sm"
              >
                Skip
              </Button>
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={stopTour}
              title="End tour"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" onClick={nextStep} className="text-xs sm:text-sm">
              {currentStepIndex === totalSteps - 1 ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1" /> Finish
                </>
              ) : (
                <>
                  Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-1 sm:gap-1.5 mt-3 sm:mt-4">
          {currentTour.steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 sm:h-1.5 rounded-full transition-all",
                i === currentStepIndex
                  ? "w-4 sm:w-6 bg-primary"
                  : i < currentStepIndex
                    ? "w-1 sm:w-1.5 bg-primary/50"
                    : "w-1.5 bg-muted",
              )}
            />
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ═══════════════════════════════════════════════════════════════
// HOTSPOT POPUP — Interactive hotspots
// ═══════════════════════════════════════════════════════════════

function HotspotPopup({ hotspot }: { hotspot: Hotspot }) {
  const { dismissHotspot } = useTour();
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const el = document.querySelector(hotspot.target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setRect(el.getBoundingClientRect());
    }
  }, [hotspot.target]);

  if (!rect) return null;

  const Icon = hotspot.icon ?? Lightbulb;

  return createPortal(
    <div className="fixed inset-0 z-[9998]">
      {/* Pulsing hotspot indicator */}
      <div className="absolute animate-ping" style={{ top: rect.top - 8, left: rect.left - 8 }}>
        <div
          className="h-6 w-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: hotspot.color ?? "#6366f1" }}
        >
          <div className="h-2 w-2 rounded-full bg-white" />
        </div>
      </div>

      {/* Hotspot card */}
      <div
        className="absolute z-[9999] w-[280px] bg-card border rounded-xl shadow-xl p-4 animate-in fade-in-0 zoom-in-95"
        style={{ top: rect.bottom + 12, left: rect.left - 40 }}
      >
        <div className="flex items-start gap-3">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: (hotspot.color ?? "#6366f1") + "20" }}
          >
            <Icon className="h-4 w-4" style={{ color: hotspot.color ?? "#6366f1" }} />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-sm">{hotspot.title}</h4>
            <p className="text-xs text-muted-foreground mt-1">{hotspot.content}</p>
          </div>
        </div>
        <div className="flex justify-end mt-3">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 text-xs"
            onClick={() => dismissHotspot(hotspot.id)}
          >
            Got it
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ═══════════════════════════════════════════════════════════════
// TOOLTIP POPUP — Simple contextual tooltips
// ═══════════════════════════════════════════════════════════════

function TooltipPopup({ tooltip }: { tooltip: Tooltip }) {
  const { hideTooltip } = useTour();
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const el = document.querySelector(tooltip.target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setRect(el.getBoundingClientRect());
    }
  }, [tooltip.target]);

  if (!rect) return null;

  const placement = tooltip.placement ?? "bottom";
  const Icon = tooltip.icon ?? HelpCircle;

  return createPortal(
    <div className="fixed inset-0 z-[9998]" onClick={hideTooltip}>
      <div
        className="absolute z-[9999] w-[260px] bg-card border rounded-xl shadow-xl p-3 animate-in fade-in-0 zoom-in-95"
        style={{
          top: Math.max(
            16,
            Math.min(
              placement === "bottom"
                ? rect.bottom + 8
                : placement === "top"
                  ? rect.top - 120
                  : rect.top,
              window.innerHeight - 120,
            ),
          ),
          left: Math.max(16, Math.min(rect.left - 30, window.innerWidth - 276)),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-2">
          <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed flex-1">{tooltip.content}</p>
          {tooltip.dismissable !== false && (
            <button onClick={hideTooltip} className="text-muted-foreground hover:text-foreground">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ═══════════════════════════════════════════════════════════════
// TOUR TRIGGER BUTTON — Floating button to start tours
// ═══════════════════════════════════════════════════════════════

export function TourTrigger() {
  const { isActive, startTour, completedTours, isTourCompleted } = useTour();
  const [open, setOpen] = useState(false);
  const { isCreator, isAdmin } = useAuth();
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";

  if (isActive) return null;
  if (pathname === "/onboarding" || pathname.endsWith("/onboarding")) return null;

  const availableTours = ALL_TOURS.filter((t) => {
    if (t.role === "admin" && !isAdmin) return false;
    if (t.role === "creator" && !isCreator && !isAdmin) return false;
    return !isTourCompleted(t.id);
  });

  return (
    <div className="fixed bottom-6 right-6 z-[9990]">
      {open && (
        <div className="absolute bottom-16 right-0 w-[280px] bg-card border rounded-xl shadow-2xl p-4 mb-2 animate-in fade-in-0 slide-in-from-bottom-2">
          <h3 className="font-semibold text-sm mb-3">Available Tours</h3>
          <div className="space-y-2">
            {ALL_TOURS.map((tour) => {
              const completed = isTourCompleted(tour.id);
              const available = availableTours.includes(tour);
              return (
                <button
                  key={tour.id}
                  className={cn(
                    "w-full text-left p-2.5 rounded-lg border transition-colors text-sm",
                    completed
                      ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600"
                      : available
                        ? "hover:bg-muted/50 cursor-pointer"
                        : "opacity-50 cursor-not-allowed",
                  )}
                  onClick={() => {
                    if (available) {
                      startTour(tour);
                      setOpen(false);
                    }
                  }}
                  disabled={!available}
                >
                  <div className="flex items-center gap-2">
                    {completed ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Rocket className="h-3.5 w-3.5" />
                    )}
                    <span className="font-medium">{tour.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 ml-5">{tour.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
      <Button
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        onClick={() => setOpen(!open)}
      >
        <HelpCircle className="h-5 w-5" />
      </Button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HOTSPOT WRAPPER — Attach hotspots to elements
// ═══════════════════════════════════════════════════════════════

export function Hotspot({
  id,
  target,
  title,
  content,
  icon,
  color,
  role,
  children,
}: {
  id: string;
  target: string;
  title: string;
  content: string;
  icon?: LucideIcon;
  color?: string;
  role?: "student" | "creator" | "admin";
  children: ReactNode;
}) {
  const { showHotspot } = useTour();
  const { isCreator, isAdmin } = useAuth();
  const shown = useRef(false);

  useEffect(() => {
    if (shown.current) return;
    if (role === "admin" && !isAdmin) return;
    if (role === "creator" && !isCreator && !isAdmin) return;

    const timer = setTimeout(() => {
      shown.current = true;
      showHotspot({ id, target, title, content, icon, color, role });
    }, 2000);

    return () => clearTimeout(timer);
  }, [id, target, title, content, icon, color, role, isAdmin, isCreator, showHotspot]);

  return <>{children}</>;
}

// ═══════════════════════════════════════════════════════════════
// TOUR CHECKLIST — Shows all tours and completion status
// ═══════════════════════════════════════════════════════════════

export function TourChecklist() {
  const { startTour, isTourCompleted } = useTour();
  const { isCreator, isAdmin } = useAuth();

  const tours = ALL_TOURS.filter((t) => {
    if (t.role === "admin" && !isAdmin) return false;
    if (t.role === "creator" && !isCreator && !isAdmin) return false;
    return true;
  });

  const completedCount = tours.filter((t) => isTourCompleted(t.id)).length;

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5 space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm sm:text-base">Platform Tours</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {completedCount}/{tours.length} completed
          </p>
        </div>
        <Badge
          variant={completedCount === tours.length ? "default" : "secondary"}
          className="text-[10px] sm:text-xs"
        >
          {completedCount === tours.length
            ? "All Done!"
            : `${tours.length - completedCount} remaining`}
        </Badge>
      </div>
      <Progress value={(completedCount / tours.length) * 100} className="h-1.5 sm:h-2" />
      <div className="space-y-2">
        {tours.map((tour) => {
          const completed = isTourCompleted(tour.id);
          return (
            <div
              key={tour.id}
              className={cn(
                "flex items-center justify-between p-2.5 sm:p-3 rounded-lg border transition-colors gap-2",
                completed ? "bg-emerald-500/5 border-emerald-500/20" : "hover:bg-muted/30",
              )}
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div
                  className={cn(
                    "h-7 w-7 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center shrink-0",
                    completed ? "bg-emerald-500/10" : "bg-muted",
                  )}
                >
                  {completed ? (
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
                  ) : (
                    <Rocket className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-medium truncate">{tour.name}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    {tour.description}
                  </div>
                </div>
              </div>
              {!completed && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startTour(tour)}
                  className="text-xs shrink-0"
                >
                  Start
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
