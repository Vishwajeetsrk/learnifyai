import { useState } from "react";
import { GitBranch, ArrowDown, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DiagramArtifact } from "./types";

interface InteractiveDiagramCardProps {
  diagram: DiagramArtifact;
  onFollowUp?: (query: string) => void;
}

export function InteractiveDiagramCard({ diagram, onFollowUp }: InteractiveDiagramCardProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "my-4 rounded-2xl border border-border/80 bg-gradient-to-b from-card via-card/70 to-card/40 p-4 sm:p-5 shadow-sm transition-all",
        isExpanded && "fixed inset-4 z-50 overflow-y-auto bg-background/95 backdrop-blur-md p-6 max-w-4xl mx-auto shadow-2xl border-primary/40",
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <GitBranch className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Visual Architecture & Flow
            </h4>
            <h3 className="text-sm font-semibold text-foreground">{diagram.title}</h3>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
          aria-label={isExpanded ? "Minimize diagram" : "Expand diagram"}
        >
          {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      <div className="relative space-y-2 py-2">
        {diagram.nodes.map((node, idx) => {
          const isSelected = selectedNodeId === node.id;
          const isLast = idx === diagram.nodes.length - 1;

          return (
            <div key={node.id || idx} className="relative flex flex-col items-center">
              <div
                onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                className={cn(
                  "w-full rounded-xl border p-3 sm:p-4 transition-all duration-200 cursor-pointer text-left relative",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary/30"
                    : "border-border/60 bg-muted/20 hover:border-border hover:bg-muted/40",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-foreground flex items-center gap-2">
                        <span>{node.label}</span>
                        {node.badge && (
                          <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            {node.badge}
                          </span>
                        )}
                      </div>
                      {node.sub && (
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {node.sub}
                        </p>
                      )}
                    </div>
                  </div>

                  {onFollowUp && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFollowUp(`Explain this step in detail: ${node.label}`);
                      }}
                      className="h-7 px-2 text-[11px] text-muted-foreground hover:text-primary shrink-0"
                    >
                      <span>Deep Dive</span>
                      <ChevronRight className="h-3 w-3 ml-0.5" />
                    </Button>
                  )}
                </div>
              </div>

              {!isLast && (
                <div className="my-1 flex items-center justify-center text-muted-foreground/60">
                  <ArrowDown className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Click any node to focus • Deep Dive for granular technical breakdown</span>
        {onFollowUp && (
          <button
            onClick={() => onFollowUp(`Generate an ASCII code diagram comparing this to real-world software.`)}
            className="text-primary hover:underline font-medium"
          >
            Request comparison diagram →
          </button>
        )}
      </div>
    </div>
  );
}
