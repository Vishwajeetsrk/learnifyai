import { useState } from "react";
import { Check, X, Info, ChevronRight } from "lucide-react";
import type { Comparison } from "./types";
import { cn } from "@/lib/utils";

interface ComparisonViewProps {
  comparison: Comparison;
}

export function ComparisonView({ comparison }: ComparisonViewProps) {
  const [activeTab, setActiveTab] = useState<"pros" | "cons" | "useCases">("pros");

  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm">
      <div className="p-3.5 bg-muted/30 border-b border-border/60">
        <h4 className="text-xs sm:text-sm font-bold text-foreground">{comparison.title}</h4>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-2 divide-x divide-border/60 border-b border-border/60 bg-muted/20">
        {comparison.items.map((item) => (
          <div key={item.name} className="p-3 text-center">
            <p className="text-xs sm:text-sm font-bold text-foreground">{item.name}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/60 bg-card">
        {(["pros", "cons", "useCases"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
              activeTab === tab
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
            )}
          >
            {tab === "pros" ? "✅ Pros" : tab === "cons" ? "❌ Cons" : "🎯 Use Cases"}
          </button>
        ))}
      </div>

      {/* Content columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
        {comparison.items.map((item) => (
          <div key={item.name} className="p-3.5 space-y-2.5">
            {item[activeTab].map((text: string, i: number) => (
              <div
                key={i}
                className="flex items-start gap-2 text-xs text-foreground leading-relaxed font-medium"
              >
                <span
                  className={cn(
                    "mt-0.5 shrink-0 h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-extrabold",
                    activeTab === "pros" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                    activeTab === "cons" && "bg-rose-500/15 text-rose-600 dark:text-rose-400",
                    activeTab === "useCases" && "bg-sky-500/15 text-sky-600 dark:text-sky-400",
                  )}
                >
                  {activeTab === "pros" ? "✓" : activeTab === "cons" ? "✗" : "→"}
                </span>
                <span className="flex-1">{text}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
