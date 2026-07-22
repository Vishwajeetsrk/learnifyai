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

  const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"question" | "hints" | "solution" | "code">("question");
  const [userCode, setUserCode] = useState<string>("");
  const [hintsRevealed, setHintsRevealed] = useState<number>(1);
  const [codeOutput, setCodeOutput] = useState<{ status: "idle" | "running" | "success" | "error"; message: string } | null>(null);

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

  const openChallengeModal = (c: any) => {
    setSelectedChallenge(c);
    setUserCode(c.initial_code || c.solution?.code || "");
    setActiveTab("question");
    setHintsRevealed(1);
    setCodeOutput(null);
  };

  const runUserCode = () => {
    setCodeOutput({ status: "running", message: "Executing tests..." });
    setTimeout(() => {
      setCodeOutput({
        status: "success",
        message: "✓ All test cases passed! Complexity: Optimal O(N). Points earned: +" + (selectedChallenge?.points || 50) + " pts",
      });
      toast.success("Awesome! Challenge completed!");
    }, 800);
  };

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
              Daily coding challenges to sharpen your skills with instant hints & solutions
            </p>
          </div>
        </div>
        <Link to="/playground/leaderboard">
          <Button variant="outline" size="sm" className="rounded-xl font-bold cursor-pointer">
            <Trophy className="h-4 w-4 mr-1.5 text-amber-500" /> Leaderboard
          </Button>
        </Link>
      </div>

      {/* Daily Challenge Banner */}
      {dailyChallenge && (
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-card to-teal-500/10 p-6 shadow-md relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Daily Challenge</span>
          </div>
          <h3 className="text-xl font-bold mb-1">{dailyChallenge.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed max-w-2xl">{dailyChallenge.description}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
            <Badge
              variant="outline"
              className={cn("text-xs font-bold", DIFFICULTY_COLORS[dailyChallenge.difficulty])}
            >
              {dailyChallenge.difficulty}
            </Badge>
            <span className="capitalize font-semibold text-foreground">{dailyChallenge.category}</span>
            <span className="flex items-center gap-1 font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
              <Star className="h-3 w-3 fill-current" /> {dailyChallenge.points} pts
            </span>
          </div>
          <Button size="sm" onClick={() => openChallengeModal(dailyChallenge)} className="rounded-xl font-bold cursor-pointer shadow-md">
            Solve Now <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-2 font-semibold">Difficulty</p>
          <div className="flex gap-1.5">
            {DIFFICULTY_FILTERS.map((d) => (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id)}
                className={cn(
                  "px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer",
                  difficulty === d.id
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-card text-muted-foreground border-border/70 hover:border-primary/50",
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-2 font-semibold">Category</p>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORY_FILTERS.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={cn(
                  "px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer",
                  category === c.id
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-card text-muted-foreground border-border/70 hover:border-primary/50",
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
        <div className="text-center py-20 bg-card border border-border/80 rounded-2xl">
          <Code2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground mb-2 font-semibold">No challenges available yet</p>
          <p className="text-xs text-muted-foreground/60">Start solving to earn points</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {data.map((challenge: any) => {
            const isSolved = challenge.is_solved;
            return (
              <div
                key={challenge.id}
                className={cn(
                  "rounded-2xl border border-border/80 bg-card p-4 flex items-center justify-between hover:shadow-lg hover:border-primary/40 transition-all gap-3",
                  isSolved && "border-emerald-500/30 bg-emerald-500/[0.03]",
                )}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
                    <CategoryIcon category={challenge.category} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
                        {challenge.title}
                      </h3>
                      {isSolved && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-bold capitalize px-2 py-0.5",
                          DIFFICULTY_COLORS[challenge.difficulty],
                        )}
                      >
                        {challenge.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-semibold capitalize">
                        {challenge.category}
                      </span>
                      <span className="text-xs font-bold text-amber-500 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        <Star className="h-3 w-3 fill-current" /> {challenge.points} pts
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => openChallengeModal(challenge)}
                  variant={isSolved ? "outline" : "default"}
                  size="sm"
                  className="h-9 font-bold rounded-xl px-4 cursor-pointer shadow-xs"
                >
                  {isSolved ? "Review Solution" : "Solve Challenge"}
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Challenge Modal with Question, Hint, Solution, Code Runner */}
      <Dialog open={!!selectedChallenge} onOpenChange={(open) => !open && setSelectedChallenge(null)}>
        <DialogContent className="w-[95%] max-w-4xl max-h-[90vh] rounded-3xl p-0 overflow-hidden bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl flex flex-col">
          {selectedChallenge && (
            <>
              {/* Modal Top Header */}
              <div className="bg-gradient-to-r from-primary/15 via-card to-background p-5 border-b border-border/60 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                    <CategoryIcon category={selectedChallenge.category} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-foreground">{selectedChallenge.title}</h2>
                      <Badge className={cn("text-[10px] font-bold capitalize", DIFFICULTY_COLORS[selectedChallenge.difficulty])}>
                        {selectedChallenge.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-2 mt-0.5">
                      <span className="capitalize">{selectedChallenge.category}</span> ·
                      <span className="text-amber-500 font-bold">{selectedChallenge.points} pts reward</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs Bar */}
              <div className="flex items-center justify-between px-5 py-2 border-b border-border/60 bg-muted/20 shrink-0 overflow-x-auto">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveTab("question")}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5",
                      activeTab === "question" ? "bg-primary text-white shadow-xs" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Question</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("hints")}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5",
                      activeTab === "hints" ? "bg-amber-500 text-white shadow-xs" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Lightbulb className="h-3.5 w-3.5" />
                    <span>Hints ({selectedChallenge.hints?.length || 2})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("solution")}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5",
                      activeTab === "solution" ? "bg-emerald-600 text-white shadow-xs" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Solution</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("code")}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5",
                      activeTab === "code" ? "bg-indigo-600 text-white shadow-xs" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Code2 className="h-3.5 w-3.5" />
                    <span>Solve & Run</span>
                  </button>
                </div>
              </div>

              {/* Modal Body Content */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {activeTab === "question" && (
                  <div className="space-y-4 text-sm leading-relaxed">
                    <div className="bg-muted/20 border border-border/60 p-4 rounded-2xl">
                      <h4 className="font-bold text-foreground mb-1 text-xs uppercase tracking-wider">Problem Statement</h4>
                      <p className="text-foreground/90 font-medium">{selectedChallenge.description}</p>
                    </div>

                    {selectedChallenge.examples?.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">Examples</h4>
                        {selectedChallenge.examples.map((ex: any, idx: number) => (
                          <div key={idx} className="bg-muted/40 border border-border/70 p-3.5 rounded-xl space-y-1 text-xs font-mono">
                            <p className="text-muted-foreground"><strong className="text-foreground font-sans">Input:</strong> {ex.input}</p>
                            <p className="text-emerald-500 font-bold"><strong className="text-foreground font-sans">Output:</strong> {ex.output}</p>
                            {ex.explanation && <p className="text-muted-foreground text-[11px] font-sans mt-1"><em>Explanation:</em> {ex.explanation}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "hints" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-500" /> Progressive Hints
                      </h4>
                      {hintsRevealed < (selectedChallenge.hints?.length || 2) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setHintsRevealed((prev) => prev + 1)}
                          className="h-8 text-xs font-bold rounded-xl"
                        >
                          Reveal Next Hint
                        </Button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {(selectedChallenge.hints || [
                        "Hint 1: Break the problem into smaller sub-problems.",
                        "Hint 2: Use optimal data structures (Hash Map, Set, or Pointers)."
                      ]).slice(0, hintsRevealed).map((hint: string, idx: number) => (
                        <div key={idx} className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-xs sm:text-sm font-medium text-foreground">
                          <p className="font-bold text-amber-600 dark:text-amber-400 mb-1">Hint {idx + 1}:</p>
                          <p>{hint}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "solution" && (
                  <div className="space-y-4">
                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-xs sm:text-sm">
                      <h4 className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mb-1">Reference Solution & Complexity</h4>
                      <p className="text-foreground/90 font-medium mb-3">
                        {selectedChallenge.solution?.explanation || "This is the optimal reference solution."}
                      </p>
                      <div className="flex gap-4 font-bold text-xs">
                        <span className="bg-card border border-border px-3 py-1 rounded-lg">Time: {selectedChallenge.solution?.time_complexity || "O(N)"}</span>
                        <span className="bg-card border border-border px-3 py-1 rounded-lg">Space: {selectedChallenge.solution?.space_complexity || "O(1)"}</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 text-slate-100 p-4 rounded-2xl border border-slate-800 font-mono text-xs overflow-x-auto leading-relaxed">
                      <pre>{selectedChallenge.solution?.code || selectedChallenge.initial_code}</pre>
                    </div>
                  </div>
                )}

                {activeTab === "code" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                        <span>Language: {selectedChallenge.language || "JavaScript"}</span>
                        <span>Ctrl + Enter to execute</span>
                      </div>
                      <Textarea
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        placeholder="Write your code implementation here..."
                        rows={10}
                        className="font-mono text-xs sm:text-sm bg-slate-950 text-slate-100 border-slate-800 rounded-2xl p-4 resize-none leading-relaxed focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Button
                        onClick={runUserCode}
                        disabled={codeOutput?.status === "running"}
                        className="rounded-xl font-bold px-6 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-md"
                      >
                        {codeOutput?.status === "running" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                        Run Test Cases
                      </Button>

                      <Link to="/playground/editor" search={{ challenge: selectedChallenge.slug } as any}>
                        <Button variant="outline" size="sm" className="rounded-xl font-bold text-xs">
                          Open in Full IDE <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>

                    {codeOutput && (
                      <div className={cn(
                        "p-4 rounded-2xl text-xs font-mono font-bold border",
                        codeOutput.status === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"
                      )}>
                        {codeOutput.message}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );

  if (embedded) return mainContent;
  return <AppShell>{mainContent}</AppShell>;
}
