import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { createInterview } from "@/lib/playground/challenges";
import { Zap, Loader2, Clock, Award, ChevronRight, Timer, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/playground/interview")({
  head: () => ({ meta: [{ title: "Interview Mode — Learnify AI" }] }),
  component: InterviewPage,
});

function InterviewPage() {
  const { user } = useAuth();
  const createFn = useServerFn(createInterview);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [minutes, setMinutes] = useState(30);
  const [creating, setCreating] = useState(false);

  const { data: interviews } = useQuery({
    enabled: !!user,
    queryKey: ["playground-interviews"],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("playground_interviews")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
  });

  const startInterview = async () => {
    if (!title.trim()) return toast.error("Enter a title for your interview");
    setCreating(true);
    try {
      const result = await createFn({
        data: { title: title.trim(), difficulty: difficulty as any, durationMinutes: minutes },
      });
      toast.success("Interview started!");
      setTitle("");
      window.open(`/playground/editor?interview=${result.interview.id}`, "_blank");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="h-6 w-6 text-primary" />
          <div>
            <h1 className="font-display text-2xl font-semibold">Interview Mode</h1>
            <p className="text-sm text-muted-foreground">
              Timed coding assessments with test cases and scoring.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold mb-4">Start New Assessment</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Frontend Coding Round"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["easy", "medium", "hard"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-xs border capitalize transition",
                      difficulty === d
                        ? "bg-primary text-primary-foreground border-primary"
                        : "hover:bg-accent",
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Duration (minutes)
                </label>
                <div className="flex gap-2 mt-1">
                  {[15, 30, 45, 60, 90].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMinutes(m)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs border transition",
                        minutes === m
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:bg-accent",
                      )}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={startInterview} disabled={creating} className="w-full">
                {creating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Start Assessment
              </Button>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold mb-4">Past Assessments</h2>
            {!interviews?.length ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Timer className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p>No assessments yet.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {interviews.map((i: any) => (
                  <div
                    key={i.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 text-sm"
                  >
                    <div>
                      <div className="font-medium">{i.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <Badge className="text-[10px] capitalize">{i.difficulty}</Badge>
                        <span>
                          {i.answered}/{i.total_questions} answered
                        </span>
                        {i.score !== null && <span>Score: {i.score}%</span>}
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        "text-[10px]",
                        i.status === "completed"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-amber-500/10 text-amber-500",
                      )}
                    >
                      {i.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
