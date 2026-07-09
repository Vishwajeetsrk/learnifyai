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
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-200 dark:border-blue-800",
    activeBg: "bg-blue-600",
    activeText: "text-white",
    description: "Resume reviews, interview prep, career transitions & salary negotiation.",
    component: CareerCoachChat,
  },
  {
    id: "learning-assistant",
    label: "Learning Assistant",
    icon: BookOpen,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-800",
    activeBg: "bg-emerald-600",
    activeText: "text-white",
    description: "Personalized study plans, concept explanations, practice & code review.",
    component: LearningAssistantChat,
  },
  {
    id: "market-intel",
    label: "Market Intelligence",
    icon: TrendingUp,
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    border: "border-violet-200 dark:border-violet-800",
    activeBg: "bg-violet-600",
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
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-gradient-to-br from-blue-600 via-emerald-600 to-violet-600 rounded-xl shadow-sm">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">AI Agent Skills</h2>
            <p className="text-xs text-muted-foreground">Specialized AI agents for career, learning & market insights</p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 -mx-2 px-2 snap-x snap-mandatory scrollbar-none">
          {AGENTS.map((agent) => {
            const isActive = activeAgent === agent.id;
            const Icon = agent.icon;
            return (
              <button
                key={agent.id}
                onClick={() => setActiveAgent(agent.id)}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-semibold snap-start shrink-0 transition-all",
                  isActive
                    ? `${agent.activeBg} ${agent.activeText} border-transparent shadow-md`
                    : `${agent.bg} ${agent.color} border hover:shadow-sm`
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{agent.label}</span>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-muted-foreground pb-3 border-b">{current.description}</p>
      </div>

      <div className="flex-1 overflow-hidden">
        <ActiveComponent />
      </div>
    </div>
  );
}
