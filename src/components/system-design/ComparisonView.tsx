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
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-3 border-b border-border">
        <h4 className="text-xs font-semibold">{comparison.title}</h4>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
        {comparison.items.map((item) => (
          <div key={item.name} className="p-3 text-center">
            <p className="text-xs font-medium">{item.name}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {(["pros", "cons", "useCases"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-2 text-[10px] font-medium uppercase tracking-wider transition",
              activeTab === tab
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab === "pros" ? "✅ Pros" : tab === "cons" ? "❌ Cons" : "🎯 Use Cases"}
          </button>
        ))}
      </div>

      {/* Content columns */}
      <div className="grid grid-cols-2 divide-x divide-border">
        {comparison.items.map((item) => (
          <div key={item.name} className="p-3 space-y-2">
            {item[activeTab].map((text: string, i: number) => (
              <div
                key={i}
                className="flex items-start gap-1.5 text-[10px] text-muted-foreground leading-relaxed"
              >
                <span
                  className={cn(
                    "mt-0.5 shrink-0",
                    activeTab === "pros" && "text-green-500",
                    activeTab === "cons" && "text-red-500",
                    activeTab === "useCases" && "text-blue-500",
                  )}
                >
                  {activeTab === "pros" ? "✓" : activeTab === "cons" ? "✗" : "→"}
                </span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
