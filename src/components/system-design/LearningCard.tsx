import { useState } from "react";
import { ChevronDown, ChevronUp, Play, BookOpen, Code, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Section, ArchitectureDiagram } from "./types";
import { ArchitectureVisualizer } from "./ArchitectureVisualizer";

interface LearningCardProps {
  section: Section;
  isOpen: boolean;
  onToggle: () => void;
}

export function LearningCard({ section, isOpen, onToggle }: LearningCardProps) {
  const typeIcon = {
    text: <BookOpen className="h-4 w-4" />,
    visual: <Play className="h-4 w-4" />,
    code: <Code className="h-4 w-4" />,
    story: <Edit3 className="h-4 w-4" />,
    comparison: <Edit3 className="h-4 w-4" />,
    simulation: <Play className="h-4 w-4" />,
  };

  const typeColors: Record<string, string> = {
    text: "border-blue-500/30 bg-blue-500/5",
    visual: "border-purple-500/30 bg-purple-500/5",
    code: "border-green-500/30 bg-green-500/5",
    story: "border-amber-500/30 bg-amber-500/5",
    comparison: "border-rose-500/30 bg-rose-500/5",
    simulation: "border-cyan-500/30 bg-cyan-500/5",
  };

  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-300",
        typeColors[section.type] || "border-border bg-card",
        isOpen ? "shadow-lg" : "shadow-sm hover:shadow-md",
      )}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-muted-foreground">{typeIcon[section.type]}</span>
        <span className="flex-1 font-medium text-sm">{section.title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-4 animate-in slide-in-from-top-1 duration-200 border-t border-border/40 pt-3">
          <p className="text-sm text-foreground leading-relaxed font-medium whitespace-pre-line">
            {section.content}
          </p>

          {section.visual && (
            <div className="rounded-xl border border-border/60 bg-background/80 p-3 shadow-inner">
              <ArchitectureVisualizer diagram={section.visual} compact />
            </div>
          )}

          {section.story && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-2.5">
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                The Story
              </p>
              <p className="text-sm text-foreground italic font-medium leading-relaxed">
                {section.story.analogy}
              </p>
              <div className="h-px bg-amber-500/20" />
              <p className="text-xs text-foreground/90">
                <span className="font-bold text-amber-600 dark:text-amber-400">Context:</span>{" "}
                {section.story.context}
              </p>
              <p className="text-xs text-foreground/90">
                <span className="font-bold text-amber-600 dark:text-amber-400">Lesson:</span>{" "}
                {(section.story as any).takeaway || section.story.transition}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
