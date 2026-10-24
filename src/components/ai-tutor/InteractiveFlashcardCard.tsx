import { useState } from "react";
import { Layers, Rotate3d, ChevronLeft, ChevronRight, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FlashcardsArtifact } from "./types";
import { toast } from "sonner";

interface InteractiveFlashcardCardProps {
  flashcards: FlashcardsArtifact;
}

export function InteractiveFlashcardCard({ flashcards }: InteractiveFlashcardCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastered, setMastered] = useState<Set<number>>(new Set());

  if (!flashcards || flashcards.length === 0) return null;

  const current = flashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const markMastered = () => {
    const nextSet = new Set(mastered);
    nextSet.add(currentIndex);
    setMastered(nextSet);
    toast.success("Card marked as mastered!");
    handleNext();
  };

  return (
    <div className="my-4 rounded-2xl border border-border/80 bg-gradient-to-b from-card to-card/50 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <Layers className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Recall Flashcards
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span>
            {currentIndex + 1} of {flashcards.length}
          </span>
          <span className="text-emerald-500 font-semibold">
            ({mastered.size} Mastered)
          </span>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative min-h-[170px] sm:min-h-[190px] w-full rounded-2xl border border-primary/20 bg-background/80 p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:border-primary/40 shadow-sm"
      >
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span className="font-semibold text-primary uppercase tracking-wider">
            {isFlipped ? "Answer / Explanation" : "Prompt / Term"}
          </span>
          <span className="flex items-center gap-1 text-[11px] hover:text-foreground">
            <Rotate3d className="h-3.5 w-3.5" />
            Click to Flip
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center py-2 text-center">
          <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
            {isFlipped ? current.back : current.front}
          </p>
        </div>

        {current.hint && !isFlipped && (
          <p className="text-xs text-muted-foreground/80 italic text-center">
            Hint: {current.hint}
          </p>
        )}
      </div>

      {/* Navigation & Mastery Controls */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={flashcards.length <= 1}
            className="h-8 px-2.5 rounded-xl border-border/70"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={flashcards.length <= 1}
            className="h-8 px-2.5 rounded-xl border-border/70"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFlipped(!isFlipped)}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Flip
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={markMastered}
            className={cn(
              "h-8 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white",
              mastered.has(currentIndex) && "opacity-75",
            )}
          >
            <Check className="h-3.5 w-3.5 mr-1" />
            {mastered.has(currentIndex) ? "Mastered" : "Mark Mastered"}
          </Button>
        </div>
      </div>
    </div>
  );
}
