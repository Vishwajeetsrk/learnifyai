import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Award, Zap, Brain, Code2, CheckCircle, Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/playground/challenges")({
  head: () => ({ meta: [{ title: "Challenges — Learnify AI" }] }),
  component: ChallengesPage,
});

const DIFFICULTIES = ["all", "easy", "medium", "hard"] as const;
const CATEGORIES = ["all", "algorithms", "data-structures", "javascript", "python"];

function ChallengesPage() {
  const { user } = useAuth();
  const [difficulty, setDifficulty] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");

  const { data: challenges, isLoading } = useQuery({
    queryKey: ["playground-challenges", difficulty, category],
    queryFn: async () => {
      let query = (supabase as any)
        .from("playground_challenges")
        .select("id, title, slug, difficulty, category, language, points, hints, created_at")
        .eq("is_published", true);
      if (difficulty !== "all") query = query.eq("difficulty", difficulty);
      if (category !== "all") query = query.eq("category", category);
      const { data } = await query.order("points");
      return data ?? [];
    },
  });

  const { data: submissions } = useQuery({
    enabled: !!user,
    queryKey: ["playground-submissions-summary"],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("playground_submissions")
        .select("challenge_id, passed")
        .eq("user_id", user!.id);
      const solved = new Set((data ?? []).filter((s: any) => s.passed).map((s: any) => s.challenge_id));
      return solved;
    },
  });

  const diffColor = (d: string) => {
    switch (d) {
      case "easy": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "medium": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "hard": return "text-red-500 bg-red-500/10 border-red-500/20";
      default: return "";
    }
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <Award className="h-6 w-6 text-primary" />
          <div>
            <h1 className="font-display text-2xl font-semibold">Coding Challenges</h1>
            <p className="text-sm text-muted-foreground">Solve problems, earn points, and sharpen your skills.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-6 mb-6">
          <span className="text-xs text-muted-foreground font-medium mr-1">Difficulty:</span>
          {DIFFICULTIES.map((d) => (
            <button key={d} onClick={() => setDifficulty(d)} className={cn("px-3 py-1 rounded-full text-xs border transition capitalize", difficulty === d ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent")}>{d}</button>
          ))}
          <span className="text-xs text-muted-foreground font-medium ml-3 mr-1">Category:</span>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={cn("px-3 py-1 rounded-full text-xs border transition capitalize", category === c ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent")}>{c.replace("-", " ")}</button>
          ))}
        </div>

        {isLoading ? (
          <div className="py-20 grid place-items-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : !challenges?.length ? (
          <div className="rounded-2xl border bg-card p-12 text-center text-muted-foreground">
            <Code2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No challenges match your filters.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {challenges.map((c: any) => {
              const solved = submissions?.has(c.id);
              return (
                <Link key={c.id} to="/playground/editor" search={{ challenge: c.slug } as any} className="flex items-center gap-4 rounded-xl border bg-card p-4 hover:shadow-md transition group">
                  <div className={cn("w-10 h-10 rounded-lg grid place-items-center shrink-0", solved ? "bg-green-500/10" : "bg-muted")}>
                    {solved ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Code2 className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm group-hover:text-primary truncate">{c.title}</h3>
                      {solved && <Badge className="text-[10px] bg-green-500/10 text-green-500 border-green-500/20">Solved</Badge>}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                      <span className="capitalize">{c.category}</span>
                      {c.language && <span className="capitalize">{c.language}</span>}
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {c.points} pts</span>
                    </div>
                  </div>
                  <Badge className={cn("text-[10px] capitalize", diffColor(c.difficulty))}>{c.difficulty}</Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
