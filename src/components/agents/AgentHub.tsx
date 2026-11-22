import { useState } from "react";
import { Briefcase, BookOpen, TrendingUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { CareerCoachChat } from "./CareerCoachChat";
import { LearningAssistantChat } from "./LearningAssistantChat";
import { MarketIntelChat } from "./MarketIntelChat";

const AGENTS = [
  {
    id: "career-coach",
    label: "Career Coach",
    icon: Briefcase,
    color: "text-[#347A3D] dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-800",
    activeBg: "bg-[#347A3D]",
    activeText: "text-white",
    description: "Resume reviews, interview prep, career transitions & salary negotiation.",
    component: CareerCoachChat,
  },
  {
    id: "learning-assistant",
    label: "Learning Assistant",
    icon: BookOpen,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-800",
    activeBg: "bg-[#245F30]",
    activeText: "text-white",
    description: "Personalized study plans, concept explanations, practice & code review.",
    component: LearningAssistantChat,
  },
  {
    id: "market-intel",
    label: "Market Intelligence",
    icon: TrendingUp,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-950/40",
    border: "border-teal-200 dark:border-teal-800",
    activeBg: "bg-teal-700",
    activeText: "text-white",
    description: "Salary benchmarks, skill demand, hiring trends & company intelligence.",
    component: MarketIntelChat,
  },
];

export function AgentHub() {
  const [activeAgent, setActiveAgent] = useState("career-coach");
  const current = AGENTS.find((a) => a.id === activeAgent)!;
  const ActiveComponent = current.component;

  return (
    <div className="flex flex-col h-[calc(100dvh-11rem)] min-h-[500px]">
      <div className="px-4 sm:px-6 lg:px-8 pt-3 pb-2 border-b bg-muted/20">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-2 px-2 snap-x snap-mandatory scrollbar-none flex-1">
            {AGENTS.map((agent) => {
              const isActive = activeAgent === agent.id;
              const Icon = agent.icon;
              return (
                <button
                  key={agent.id}
                  onClick={() => setActiveAgent(agent.id)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold snap-start shrink-0 transition-all cursor-pointer",
                    isActive
                      ? `${agent.activeBg} ${agent.activeText} border-transparent shadow-sm`
                      : `${agent.bg} ${agent.color} border-border/60 hover:shadow-2xs`,
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{agent.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground truncate">{current.description}</p>
      </div>

      <div className="flex-1 overflow-hidden min-h-0">
        <ActiveComponent />
      </div>
    </div>
  );
}
