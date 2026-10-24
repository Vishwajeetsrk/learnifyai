import { useState } from "react";
import { Calendar, CheckSquare, Square, Bookmark, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StudyPlanArtifact } from "./types";
import { toast } from "sonner";

interface InteractiveStudyPlanCardProps {
  plan: StudyPlanArtifact;
}

export function InteractiveStudyPlanCard({ plan }: InteractiveStudyPlanCardProps) {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);

  const totalTasks = plan.days.reduce((acc, d) => acc + d.tasks.length, 0);

  const toggleTask = (taskKey: string) => {
    const next = new Set(completedTasks);
    if (next.has(taskKey)) {
      next.delete(taskKey);
    } else {
      next.add(taskKey);
    }
    setCompletedTasks(next);
  };

  const handleSave = () => {
    setSaved(true);
    toast.success("Study plan saved to your Learnify AI dashboard!");
  };

  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks.size / totalTasks) * 100) : 0;

  return (
    <div className="my-4 rounded-2xl border border-border/80 bg-gradient-to-b from-card to-card/50 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Personalized Learning Schedule
            </span>
            <h4 className="text-sm font-semibold text-foreground">{plan.title}</h4>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={saved}
          className="h-7 text-xs rounded-lg border-border/60"
        >
          {saved ? <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-500" /> : <Bookmark className="h-3.5 w-3.5 mr-1" />}
          {saved ? "Plan Saved" : "Save Plan"}
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 rounded-xl bg-muted/40 p-3 border border-border/40">
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <span className="text-muted-foreground">Your Roadmap Progress</span>
          <span className="text-foreground font-semibold">
            {completedTasks.size} / {totalTasks} Tasks Completed ({progressPercent}%)
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-border/40">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Day by Day Breakdown */}
      <div className="space-y-3">
        {plan.days.map((dayItem, dIdx) => (
          <div
            key={dIdx}
            className="rounded-xl border border-border/60 bg-background/60 p-3.5 transition-all hover:border-border"
          >
            <div className="text-xs font-semibold text-primary mb-1.5">
              Day {dayItem.day}: {dayItem.topic}
            </div>

            <div className="space-y-1.5 pl-1">
              {dayItem.tasks.map((task, tIdx) => {
                const key = `${dIdx}-${tIdx}`;
                const isDone = completedTasks.has(key);

                return (
                  <button
                    key={tIdx}
                    onClick={() => toggleTask(key)}
                    className="flex items-start gap-2.5 text-left text-xs text-foreground/90 hover:text-foreground cursor-pointer w-full group py-0.5"
                  >
                    <span className="mt-0.5 shrink-0 text-muted-foreground group-hover:text-primary">
                      {isDone ? (
                        <CheckSquare className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Square className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <span className={cn(isDone && "line-through opacity-60")}>{task}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
