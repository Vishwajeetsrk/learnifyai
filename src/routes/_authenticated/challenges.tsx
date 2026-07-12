import { createFileRoute, Link, useSearch, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Code2,
  Trophy,
  Flame,
  Clock,
  CheckCircle2,
  Lock,
  Loader2,
  Filter,
  ArrowRight,
  Star,
  Zap,
  Brain,
  Layers,
  FileJson,
  Snail,
  Database,
  Kanban,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getChallenges } from "@/lib/playground/challenges";
import { ChallengesSkeleton } from "@/components/Skeletons";

export const Route = createFileRoute("/_authenticated/challenges")({
  head: () => ({ meta: [{ title: "Coding Challenges — Learnify AI" }] }),
  component: () => <ChallengesPage />,
});

const DIFFICULTY_FILTERS = [
  { id: "all", label: "All", color: "bg-muted text-muted-foreground" },
  { id: "easy", label: "Easy", color: "bg-emerald-500/10 text-emerald-500" },
  { id: "medium", label: "Medium", color: "bg-yellow-500/10 text-yellow-500" },
  { id: "hard", label: "Hard", color: "bg-red-500/10 text-red-500" },
];

const CATEGORY_FILTERS = [
  { id: "all", label: "All" },
  { id: "algorithms", label: "Algorithms" },
  { id: "data-structures", label: "Data Structures" },
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "sql", label: "SQL" },
  { id: "system-design", label: "System Design" },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  hard: "bg-red-500/10 text-red-500 border-red-500/20",
};

function CategoryIcon({ category }: { category: string }) {
  const cls = "h-4 w-4";
  switch (category) {
    case "algorithms":
      return <Brain className={cls} />;
    case "data-structures":
      return <Layers className={cls} />;
    case "javascript":
      return <FileJson className={cls} />;
    case "python":
      return <Snail className={cls} />;
    case "sql":
      return <Database className={cls} />;
    case "system-design":
      return <Kanban className={cls} />;
    default:
      return <Code2 className={cls} />;
  }
}

export function ChallengesPage({ embedded = false }: { embedded?: boolean }) {
  const fetchChallenges = useServerFn(getChallenges);
  const search = useSearch({ strict: false }) as Record<string, string>;
  const navigate = useNavigate();
  const difficulty = (search.difficulty as string) || "all";
  const category = (search.category as string) || "all";

  const setDifficulty = (d: string) => {
    navigate({
      search: { ...search, difficulty: d === "all" ? undefined : d } as any,
      replace: true,
    });
  };
  const setCategory = (c: string) => {
    navigate({
      search: { ...search, category: c === "all" ? undefined : c } as any,
      replace: true,
    });
  };

  const challenges = useQuery({
    queryKey: ["challenges-list", difficulty, category],
    queryFn: () =>
      fetchChallenges({
        data: {
          difficulty: difficulty === "all" ? undefined : difficulty,
          category: category === "all" ? undefined : category,
        },
      }),
  });

  const data = challenges.data ?? [];

  // Date-based daily challenge rotation (same challenge all day, rotates at midnight)
  const dailyChallenge = (() => {
    if (data.length === 0) return null;
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const idx = seed % data.length;
    return data[idx];
  })();

  const mainContent = (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 grid place-items-center shadow-lg">
            <Code2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Coding Challenges</h1>
            <p className="text-muted-foreground text-sm">
              Daily coding challenges to sharpen your skills
            </p>
          </div>
        </div>
        <Link to="/playground/leaderboard">
          <Button variant="outline" size="sm">
            <Trophy className="h-4 w-4 mr-1.5" /> Leaderboard
          </Button>
        </Link>
      </div>

      {/* Daily Challenge Banner */}
      {dailyChallenge && (
        <div className="rounded-2xl border bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-500">Daily Challenge</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">{dailyChallenge.title}</h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
            <Badge
              variant="outline"
              className={cn("text-xs", DIFFICULTY_COLORS[dailyChallenge.difficulty])}
            >
              {dailyChallenge.difficulty}
            </Badge>
            <span>{dailyChallenge.category}</span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3" /> {dailyChallenge.points} pts
            </span>
          </div>
          <Link to="/playground/editor" search={{ challenge: dailyChallenge.slug } as any}>
            <Button size="sm">
              Solve Now <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-2 font-medium">Difficulty</p>
          <div className="flex gap-1">
            {DIFFICULTY_FILTERS.map((d) => (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id)}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-lg border transition-colors",
                  difficulty === d.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40",
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-2 font-medium">Category</p>
          <div className="flex flex-wrap gap-1">
            {CATEGORY_FILTERS.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-lg border transition-colors",
                  category === c.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Challenges List */}
      {challenges.isLoading ? (
        <ChallengesSkeleton />
      ) : data.length === 0 ? (
        <div className="text-center py-20">
          <Code2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground mb-2">No challenges available yet</p>
          <p className="text-sm text-muted-foreground/60">Start solving to earn points</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {data.map((challenge: any) => {
            const isSolved = challenge.is_solved;
            return (
              <div
                key={challenge.id}
                className={cn(
                  "rounded-xl border bg-card p-3 sm:p-4 flex items-center justify-between hover:shadow-md transition-all gap-2",
                  isSolved && "border-emerald-500/20 bg-emerald-500/[0.02]",
                )}
              >
                <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 text-primary">
                    <CategoryIcon category={challenge.category} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-xs sm:text-sm truncate">
                        {challenge.title}
                      </h3>
                      {isSolved && (
                        <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 flex-wrap">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] sm:text-[10px]",
                          DIFFICULTY_COLORS[challenge.difficulty],
                        )}
                      >
                        {challenge.difficulty}
                      </Badge>
                      <span className="text-[10px] sm:text-xs text-muted-foreground hidden xs:inline">
                        {challenge.category}
                      </span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-0.5">
                        <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> {challenge.points}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  to="/playground/editor"
                  search={{ challenge: challenge.slug } as any}
                  className="shrink-0"
                >
                  <Button
                    variant={isSolved ? "ghost" : "default"}
                    size="sm"
                    className="h-8 sm:h-9 text-xs px-2 sm:px-3"
                  >
                    {isSolved ? "Review" : "Solve"}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (embedded) return mainContent;
  return <AppShell>{mainContent}</AppShell>;
}
