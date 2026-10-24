import { useEffect, useState } from "react";
import { Sparkles, Brain, BookOpen, Layers, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityStatusIndicatorProps {
  className?: string;
}

const STEPS = [
  { label: "Understanding your question", icon: Brain },
  { label: "Planning lesson & key concepts", icon: BookOpen },
  { label: "Creating interactive visuals & examples", icon: Layers },
  { label: "Finalizing response & practice", icon: Sparkles },
];

export function ActivityStatusIndicator({ className }: ActivityStatusIndicatorProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  const CurrentIcon = STEPS[currentStepIndex].icon;

  return (
    <div
      className={cn(
        "rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent p-3.5 backdrop-blur-sm transition-all duration-300",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <CurrentIcon className="h-4 w-4 animate-pulse" />
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-foreground tracking-tight">
              {STEPS[currentStepIndex].label}
            </span>
            <span className="text-muted-foreground text-[11px]">
              Step {currentStepIndex + 1} of {STEPS.length}
            </span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
            <div
              className="h-full bg-gradient-to-r from-primary to-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
