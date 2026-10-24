import { useState } from "react";
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuizArtifact } from "./types";
import { toast } from "sonner";

interface InteractiveQuizCardProps {
  quiz: QuizArtifact;
  onFollowUp?: (query: string) => void;
}

export function InteractiveQuizCard({ quiz, onFollowUp }: InteractiveQuizCardProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSelect = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedIdx(idx);
    setHasSubmitted(true);
    if (idx === quiz.answerIndex) {
      toast.success("Correct answer! +10 XP added to your learning streak.");
    } else {
      toast.info("Good attempt! Review the explanation below to master this concept.");
    }
  };

  const resetQuiz = () => {
    setSelectedIdx(null);
    setHasSubmitted(false);
  };

  const isCorrect = selectedIdx === quiz.answerIndex;

  return (
    <div className="my-4 rounded-2xl border border-border/80 bg-gradient-to-b from-card to-card/50 p-4 sm:p-5 shadow-sm transition-all hover:border-primary/30">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
            <HelpCircle className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {quiz.topic ? `${quiz.topic} — Check Your Mastery` : "Concept Check"}
          </span>
        </div>
        {hasSubmitted && (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
              isCorrect
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
            )}
          >
            {isCorrect ? (
              <>
                <Award className="h-3 w-3" />
                Correct (+10 XP)
              </>
            ) : (
              "Review & Learn"
            )}
          </span>
        )}
      </div>

      <h4 className="text-sm sm:text-base font-medium text-foreground mb-4 leading-relaxed">
        {quiz.question}
      </h4>

      <div className="space-y-2 mb-4">
        {quiz.options.map((option, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isThisSelected = selectedIdx === idx;
          const isThisAnswer = idx === quiz.answerIndex;

          let optionStyle =
            "border-border/60 hover:border-primary/50 hover:bg-muted/40 text-foreground";
          if (hasSubmitted) {
            if (isThisAnswer) {
              optionStyle =
                "border-emerald-500/50 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 font-medium";
            } else if (isThisSelected && !isCorrect) {
              optionStyle =
                "border-destructive/50 bg-destructive/10 text-destructive-foreground dark:text-red-200";
            } else {
              optionStyle = "border-border/40 opacity-50";
            }
          }

          return (
            <button
              key={idx}
              disabled={hasSubmitted}
              onClick={() => handleSelect(idx)}
              className={cn(
                "w-full text-left flex items-start gap-3 rounded-xl border p-3 text-xs sm:text-sm transition-all duration-150 cursor-pointer disabled:cursor-default",
                optionStyle,
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold",
                  hasSubmitted && isThisAnswer
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : hasSubmitted && isThisSelected && !isCorrect
                      ? "border-destructive bg-destructive text-white"
                      : "border-border bg-background text-muted-foreground",
                )}
              >
                {hasSubmitted && isThisAnswer ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : hasSubmitted && isThisSelected && !isCorrect ? (
                  <XCircle className="h-3.5 w-3.5" />
                ) : (
                  letter
                )}
              </span>
              <span className="flex-1 pt-0.5 leading-snug">{option}</span>
            </button>
          );
        })}
      </div>

      {hasSubmitted && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-foreground/90 space-y-2">
          <div className="font-semibold text-primary flex items-center justify-between">
            <span>Why this is correct:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetQuiz}
              className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Try Again
            </Button>
          </div>
          <p className="leading-relaxed">{quiz.explanation}</p>

          {onFollowUp && (
            <div className="pt-1 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFollowUp(`Give me another question on this topic: ${quiz.question}`)}
                className="h-7 text-xs rounded-lg border-primary/30"
              >
                Test me with another question
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
