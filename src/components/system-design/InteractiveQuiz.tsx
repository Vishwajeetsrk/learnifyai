import { useState, useMemo } from "react";
import { Check, X, ArrowRight, RefreshCw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "./types";
import { cn } from "@/lib/utils";

interface InteractiveQuizProps {
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

export function InteractiveQuiz({ questions, onComplete }: InteractiveQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const current = questions[currentIndex];
  const selectedIndex = answers[current?.id] ?? -1;
  const hasAnswered = current?.id in answers;
  const isCorrect = hasAnswered && selectedIndex === current?.correctIndex;

  const score = useMemo(
    () => questions.filter((q) => answers[q.id] === q.correctIndex).length,
    [answers, questions]
  );

  const handleSelect = (index: number) => {
    if (hasAnswered) return;
    setAnswers((a) => ({ ...a, [current.id]: index }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setShowResults(true);
      onComplete?.(score, questions.length);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setShowResults(false);
    setShowExplanation(false);
  };

  if (showResults) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Check className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Quiz Complete!</h3>
          <p className="text-sm text-muted-foreground">
            You scored {score} out of {questions.length}
          </p>
        </div>
        <div className="relative h-2 bg-muted rounded-full overflow-hidden max-w-xs mx-auto">
          <div
            className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {pct >= 80 ? "Excellent! You have a strong understanding." :
           pct >= 60 ? "Good job! Review the topics you missed." :
           "Keep studying! Try reviewing the material again."}
        </p>
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRestart}>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-4 space-y-4">
        {/* Progress */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className={cn(
            "text-[10px] px-1.5 py-0.5 rounded font-medium",
            current.difficulty === "easy" && "bg-green-500/10 text-green-500",
            current.difficulty === "medium" && "bg-yellow-500/10 text-yellow-500",
            current.difficulty === "hard" && "bg-red-500/10 text-red-500",
          )}>
            {current.difficulty}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-muted rounded-full">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <p className="text-sm font-medium leading-relaxed">{current.question}</p>

        {/* Options */}
        <div className="space-y-1.5">
          {current.options.map((option, i) => {
            const isSelected = i === selectedIndex;
            const isOptionCorrect = i === current.correctIndex;

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={hasAnswered}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-lg text-xs border transition-all",
                  !hasAnswered && "border-border hover:border-primary/50 hover:bg-muted/50",
                  hasAnswered && isSelected && isCorrect && "border-green-500 bg-green-500/10 text-green-500",
                  hasAnswered && isSelected && !isCorrect && "border-red-500 bg-red-500/10 text-red-500",
                  hasAnswered && !isSelected && isOptionCorrect && "border-green-500/50 bg-green-500/5 text-green-400",
                  hasAnswered && !isSelected && !isOptionCorrect && "border-border opacity-60"
                )}
                aria-label={`Option ${i + 1}: ${option}`}
              >
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0",
                    !hasAnswered && "border border-border text-muted-foreground",
                    hasAnswered && isSelected && isCorrect && "bg-green-500 text-white",
                    hasAnswered && isSelected && !isCorrect && "bg-red-500 text-white",
                    hasAnswered && !isSelected && isOptionCorrect && "bg-green-500/20 text-green-500 border border-green-500/50",
                    hasAnswered && !isSelected && !isOptionCorrect && "border border-border text-muted-foreground/50"
                  )}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {hasAnswered && isSelected && isCorrect && <Check className="h-3.5 w-3.5 text-green-500" />}
                  {hasAnswered && isSelected && !isCorrect && <X className="h-3.5 w-3.5 text-red-500" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={cn(
            "p-3 rounded-lg border text-xs space-y-1 animate-in slide-in-from-top-2 duration-200",
            isCorrect ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"
          )}>
            <p className={cn("font-medium", isCorrect ? "text-green-500" : "text-red-500")}>
              {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
            </p>
            <p className="text-muted-foreground">{current.explanation}</p>
          </div>
        )}

        {/* Next button */}
        {hasAnswered && (
          <Button
            className="w-full"
            size="sm"
            onClick={handleNext}
          >
            {currentIndex < questions.length - 1 ? (
              <>Next <ChevronRight className="h-3.5 w-3.5 ml-1" /></>
            ) : (
              "See Results"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
