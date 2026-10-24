import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ArcTabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

interface ArcMotionTabsProps {
  tabs: ArcTabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ArcMotionTabs({
  tabs,
  activeTab,
  onChange,
  className,
  size = "md",
}: ArcMotionTabsProps) {
  const shouldReduceMotion = useReducedMotion();

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs h-7",
    md: "px-3.5 py-1.5 text-xs h-9",
    lg: "px-4 py-2 text-sm h-11",
  };

  return (
    <div
      role="tablist"
      className={cn(
        "relative flex items-center gap-1 p-1 rounded-2xl bg-muted/40 border border-border/70 backdrop-blur-md overflow-x-auto scrollbar-none",
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative z-10 flex items-center justify-center gap-2 rounded-xl font-medium transition-colors cursor-pointer select-none whitespace-nowrap shrink-0",
              sizeClasses[size],
              isActive
                ? "text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge}

            {isActive && (
              <motion.div
                layoutId="arc-active-pill"
                transition={
                  shouldReduceMotion
                    ? { duration: 0.1 }
                    : { type: "spring", stiffness: 450, damping: 30 }
                }
                className="absolute inset-0 z-[-1] rounded-xl bg-primary shadow-xs"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
