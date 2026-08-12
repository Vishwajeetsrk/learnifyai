import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Brain, Lightbulb, Network, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConceptGraph } from "./ConceptGraph";
import { ExplainLikeI12 } from "./ExplainLikeI12";
import { toast } from "sonner";

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
  const [regenerating, setRegenerating] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: graphData,
    isLoading: graphLoading,
    isError: graphError,
    error: graphErrorObj,
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
    retry: false,
  });

  const handleRegenerate = async () => {
    if (regenerating) return;
    setRegenerating(true);
    try {
      // Deleting the cached row first means the refetch below returns a
      // freshly generated map instead of the cached one.
      const { regenerateConceptGraph } = await import("@/lib/concept-graph.functions");
      await regenerateConceptGraph({
        data: { lessonId, courseId, lessonTitle, lessonContent },
      });
      await refetchGraph();
      toast.success("Concept map regenerated");
    } catch (e: any) {
      toast.error(e?.message || "Failed to regenerate concept map");
      queryClient.invalidateQueries({ queryKey: ["concept-graph", lessonId] });
    } finally {
      setRegenerating(false);
    }
  };

  const TABS = [
    { id: "concepts" as const, label: "Concept Map", icon: Network },
    { id: "explain" as const, label: "Explain Like I'm...", icon: Lightbulb },
  ];

  return (
    <div className="space-y-4 rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary grid place-items-center border border-primary/20">
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Interactive Visual Learning
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Explore dynamic concept graphs, architecture flows & simplified explanations
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 bg-muted/40 p-1.5 rounded-xl border border-border/50">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all flex-1 justify-center cursor-pointer",
                active
                  ? "bg-background text-primary shadow-sm border border-primary/20 font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {tab === "concepts" && (
        <ConceptGraph
          nodes={graphData?.nodes || []}
          edges={graphData?.edges || []}
          loading={graphLoading}
          regenerating={regenerating}
          error={graphError ? (graphErrorObj as any)?.message || "Failed to generate concept map" : null}
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
