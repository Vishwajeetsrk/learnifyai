import { useState, useMemo } from "react";
import { BookOpen, Trophy, BarChart3, Target, TrendingUp, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { TOPICS } from "./content";

const PROGRESS_KEY = "sdacademy_progress";

interface TopicProgress {
  completed: boolean;
  quizScore: number;
  lastAccessed: number;
}

export function getProgress(): Record<string, TopicProgress> {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<string, TopicProgress>) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function markTopicCompleted(topicId: string, quizScore: number) {
  const p = getProgress();
  p[topicId] = { completed: true, quizScore, lastAccessed: Date.now() };
  saveProgress(p);
}

export function markTopicAccessed(topicId: string) {
  const p = getProgress();
  if (!p[topicId]) p[topicId] = { completed: false, quizScore: 0, lastAccessed: Date.now() };
  else p[topicId].lastAccessed = Date.now();
  saveProgress(p);
}

export function useLearningProgress() {
  const [progress, setProgress] = useState<Record<string, TopicProgress>>(getProgress);

  const stats = useMemo(() => {
    const total = TOPICS.length;
    const completed = Object.values(progress).filter((p) => p.completed).length;
    const inProgress = Object.values(progress).filter((p) => !p.completed).length;
    const unlocked =
      TOPICS.reduce((max, t, i) => {
        if (i === 0 || progress[TOPICS[i - 1].id]?.completed) return i;
        return max;
      }, 0) + 1;
    const avgScore = Object.values(progress)
      .filter((p) => p.completed)
      .reduce((s, p) => s + p.quizScore, 0);
    const avg = completed > 0 ? Math.round(avgScore / completed) : 0;
    return { total, completed, inProgress, unlocked, avgScore: avg };
  }, [progress]);

  const refresh = () => setProgress(getProgress());

  return { progress, stats, refresh, markTopicCompleted, markTopicAccessed };
}

export function LearningProgress() {
  const { stats } = useLearningProgress();
  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold">Your Progress</span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {stats.completed}/{stats.total} topics
        </span>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatCard
          icon={<Trophy className="h-3 w-3" />}
          label="Completed"
          value={String(stats.completed)}
          color="text-green-500"
        />
        <StatCard
          icon={<BookOpen className="h-3 w-3" />}
          label="In Progress"
          value={String(stats.inProgress)}
          color="text-yellow-500"
        />
        <StatCard
          icon={<TrendingUp className="h-3 w-3" />}
          label="Avg Score"
          value={`${stats.avgScore}%`}
          color="text-blue-500"
        />
        <StatCard
          icon={<Target className="h-3 w-3" />}
          label="Mastery"
          value={pct >= 80 ? "Advanced" : pct >= 40 ? "Intermediate" : "Beginner"}
          color="text-purple-500"
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
      <span className={color}>{icon}</span>
      <div>
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className={cn("text-xs font-semibold", color)}>{value}</p>
      </div>
    </div>
  );
}
