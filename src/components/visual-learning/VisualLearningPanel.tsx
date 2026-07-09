import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Brain, Lightbulb, Network, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConceptGraph } from "./ConceptGraph";
import { ExplainLikeI12 } from "./ExplainLikeI12";

interface VisualLearningPanelProps {
  lessonId: string;
  courseId: string;
  lessonTitle: string;
  lessonContent: string;
  defaultTab?: "concepts" | "explain";
}

export function VisualLearningPanel({
  lessonId,
  courseId,
  lessonTitle,
  lessonContent,
  defaultTab = "concepts",
}: VisualLearningPanelProps) {
  const [tab, setTab] = useState<"concepts" | "explain">(defaultTab);
  const queryClient = useQueryClient();

  const {
    data: graphData,
    isLoading: graphLoading,
    refetch: refetchGraph,
  } = useQuery({
    queryKey: ["concept-graph", lessonId],
    queryFn: async () => {
      const { generateConceptGraph } = await import("@/lib/concept-graph.functions");
      const res = await generateConceptGraph({
        data: { lessonId, courseId, lessonTitle, lessonContent },
      });
      return res as any;
    },
    enabled: tab === "concepts",
    staleTime: 1000 * 60 * 60,
  });

  const handleRegenerate = async () => {
    queryClient.invalidateQueries({ queryKey: ["concept-graph", lessonId] });
    refetchGraph();
  };

  const TABS = [
    { id: "concepts" as const, label: "Concept Map", icon: Network },
    { id: "explain" as const, label: "Explain Like I'm...", icon: Lightbulb },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 border-b border-border/50 pb-2">
        <Brain className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Visual Learning
        </span>
      </div>

      <div className="flex gap-1 bg-muted/30 p-1 rounded-lg">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all flex-1 justify-center",
                active
                  ? "bg-background text-foreground shadow-sm border border-border/50"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "concepts" && (
        <ConceptGraph
          nodes={graphData?.nodes || []}
          edges={graphData?.edges || []}
          loading={graphLoading}
          onRegenerate={handleRegenerate}
        />
      )}

      {tab === "explain" && (
        <ExplainLikeI12
          lessonId={lessonId}
          courseId={courseId}
          lessonTitle={lessonTitle}
          lessonContent={lessonContent}
        />
      )}
    </div>
  );
}
