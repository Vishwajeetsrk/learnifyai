import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Brain,
  HelpCircle,
  Briefcase,
  BellRing,
  BookOpenCheck,
  Layers,
  Loader2,
  Sparkles,
  ChevronRight,
  RotateCw,
  Check,
  X,
  History,
  Trash2,
  Eye,
  GitFork,
  Save,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { format } from "date-fns";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { runAiTool } from "@/lib/ai-tools.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/ai-tools")({
  head: () => ({ meta: [{ title: "AI Tools — Learnify AI" }] }),
  component: AIToolsPage,
});

type ToolId = "quiz" | "doubt" | "career" | "reminder" | "synth" | "flashcards";

const TOOLS: {
  id: ToolId;
  title: string;
  tagline: string;
  icon: typeof Brain;
  gradient: string;
}[] = [
  {
    id: "quiz",
    title: "Quiz Generator",
    tagline: "Custom MCQs with instant grading.",
    icon: Brain,
    gradient: "from-indigo-500/15 to-fuchsia-500/10",
  },
  {
    id: "doubt",
    title: "Doubt Solver",
    tagline: "Mentor-grade answers with code & pitfalls.",
    icon: HelpCircle,
    gradient: "from-amber-500/15 to-rose-500/10",
  },
  {
    id: "career",
    title: "Career Coach",
    tagline: "12-week roadmap, salaries, portfolio plan.",
    icon: Briefcase,
    gradient: "from-emerald-500/15 to-cyan-500/10",
  },
  {
    id: "reminder",
    title: "Smart Reminders",
    tagline: "Schedule study reminders with email + inbox.",
    icon: BellRing,
    gradient: "from-sky-500/15 to-violet-500/10",
  },
  {
    id: "synth",
    title: "Lesson Synthesizer",
    tagline: "Notes → TL;DR, glossary, practice Qs.",
    icon: BookOpenCheck,
    gradient: "from-rose-500/15 to-orange-500/10",
  },
  {
    id: "flashcards",
    title: "Auto Flashcards",
    tagline: "Active-recall cards on any topic.",
    icon: Layers,
    gradient: "from-teal-500/15 to-lime-500/10",
  },
];

function AIToolsPage() {
  const [open, setOpen] = useState<ToolId | null>(null);

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 max-w-7xl">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-medium flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> AI Suite
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-display font-semibold tracking-tight">
              AI Tools
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Six purpose-built tools — outputs auto-saved to history.
            </p>
          </div>
        </div>

        <Tabs defaultValue="tools" className="mt-6">
          <TabsList>
            <TabsTrigger value="tools">
              <Sparkles className="h-3.5 w-3.5" /> Tools
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-3.5 w-3.5" /> History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {TOOLS.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setOpen(t.id)}
                    className={cn(
                      "group text-left rounded-2xl border bg-card p-4 sm:p-5 shadow-card hover:shadow-lg hover:-translate-y-0.5 transition-all",
                      "bg-gradient-to-br",
                      t.gradient,
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display font-semibold leading-snug">{t.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{t.tagline}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
                    </div>
                  </button>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="history" className="pt-4">
            <HistoryPanel />
          </TabsContent>
        </Tabs>
      </div>

      {open && <ToolDialog tool={open} onClose={() => setOpen(null)} />}
    </AppShell>
  );
}

/* ---------------- History ---------------- */
function HistoryPanel() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("all");
  const [viewing, setViewing] = useState<any | null>(null);
  const [forking, setForking] = useState<any | null>(null);

  const q = useQuery({
    enabled: !!user,
    queryKey: ["ai-history", user?.id, filter],
    queryFn: async () => {
      let query = supabase
        .from("ai_outputs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (filter !== "all") query = query.eq("tool", filter);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });

  const del = async (id: string) => {
    await supabase.from("ai_outputs").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["ai-history"] });
    toast.success("Deleted");
  };

  const forkable = (tool: string) => ["quiz", "flashcards", "synth"].includes(tool);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tools</SelectItem>
            <SelectItem value="quiz">Quizzes</SelectItem>
            <SelectItem value="flashcards">Flashcards</SelectItem>
            <SelectItem value="reminder">Reminders</SelectItem>
            <SelectItem value="doubt">Doubts</SelectItem>
            <SelectItem value="career">Career</SelectItem>
            <SelectItem value="synth">Syntheses</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {q.isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-auto my-12" />
      ) : (q.data ?? []).length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          No history yet — run a tool to start saving.
        </p>
      ) : (
        <div className="grid gap-2">
          {(q.data ?? []).map((row) => (
            <div
              key={row.id}
              className="border rounded-lg p-3 sm:p-4 flex items-center gap-2 flex-wrap"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {row.tool}
                  </Badge>
                  <span className="text-sm font-medium truncate">{row.title}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {format(new Date(row.created_at), "dd MMM yyyy · HH:mm")}
                </p>
              </div>
              {forkable(row.tool) && (
                <Button size="sm" variant="outline" onClick={() => setForking(row)}>
                  <GitFork className="h-3.5 w-3.5" /> Fork
                </Button>
              )}
              <Button size="icon" variant="ghost" onClick={() => setViewing(row)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => del(row.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewing?.title}</DialogTitle>
            <DialogDescription className="capitalize">
              {viewing?.tool} ·{" "}
              {viewing && format(new Date(viewing.created_at), "dd MMM yyyy · HH:mm")}
            </DialogDescription>
          </DialogHeader>
          {viewing && <HistoryView row={viewing} />}
        </DialogContent>
      </Dialog>

      {forking && (
        <ForkDialog
          row={forking}
          onClose={() => setForking(null)}
          onDone={() => {
            setForking(null);
            qc.invalidateQueries({ queryKey: ["ai-history"] });
          }}
        />
      )}
    </div>
  );
}

function HistoryView({ row }: { row: any }) {
  const out = row.payload?.output;
  if (!out) return <p className="text-sm text-muted-foreground">No content.</p>;
  if (out.kind === "markdown") return <MarkdownBlock>{out.content}</MarkdownBlock>;
  try {
    const parsed = JSON.parse(out.json);
    return (
      <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
        {JSON.stringify(parsed, null, 2)}
      </pre>
    );
  } catch {
    return <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">{out.json}</pre>;
  }
}

/* ---------- Fork to course ---------- */
function ForkDialog({
  row,
  onClose,
  onDone,
}: {
  row: any;
  onClose: () => void;
  onDone: () => void;
}) {
  const { user } = useAuth();
  const [courseId, setCourseId] = useState<string>("");
  const [title, setTitle] = useState<string>(row.title);
  const [editedJson, setEditedJson] = useState<string>(() => {
    const out = row.payload?.output;
    if (out?.kind === "json") {
      try {
        return JSON.stringify(JSON.parse(out.json), null, 2);
      } catch {
        return out.json;
      }
    }
    return out?.content ?? "";
  });
  const [pushAsMcq, setPushAsMcq] = useState(false);
  const [saving, setSaving] = useState(false);

  const cq = useQuery({
    enabled: !!user,
    queryKey: ["courses-for-fork"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("id, title").order("title");
      return data ?? [];
    },
  });

  const save = async () => {
    if (!user) return;
    if (!courseId) return toast.error("Pick a course");
    setSaving(true);
    try {
      let newPayload = row.payload;
      try {
        const parsed = JSON.parse(editedJson);
        newPayload = { ...row.payload, output: { kind: "json", json: JSON.stringify(parsed) } };
      } catch {
        if (row.payload?.output?.kind === "markdown") {
          newPayload = { ...row.payload, output: { kind: "markdown", content: editedJson } };
        } else {
          throw new Error("Invalid JSON — fix and try again");
        }
      }
      const { error } = await supabase.from("ai_outputs").insert({
        user_id: user.id,
        course_id: courseId,
        tool: row.tool,
        title: title || `Fork · ${row.title}`,
        payload: newPayload,
      });
      if (error) throw error;

      if (pushAsMcq && row.tool === "quiz") {
        const parsed = JSON.parse(editedJson);
        const arr = parsed.questions ?? [];
        const { count } = await supabase
          .from("mcq_questions")
          .select("*", { count: "exact", head: true })
          .eq("course_id", courseId);
        const start = count ?? 0;
        const rows = arr.map((qq: any, i: number) => ({
          course_id: courseId,
          question: String(qq.question),
          options: qq.options,
          answer: Number(qq.answer),
          explanation: qq.explanation ?? null,
          order_index: start + i,
        }));
        if (rows.length) {
          const { error: mErr } = await supabase.from("mcq_questions").insert(rows);
          if (mErr) throw mErr;
        }
      }
      toast.success("Forked & saved");
      onDone();
    } catch (e: any) {
      toast.error(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitFork className="h-5 w-5" /> Fork to course
          </DialogTitle>
          <DialogDescription>
            Duplicate this {row.tool} and attach to a course. Edit before saving.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-2">
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Pick course" />
              </SelectTrigger>
              <SelectContent>
                {(cq.data ?? []).map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="New title"
            />
          </div>
          <Textarea
            rows={12}
            value={editedJson}
            onChange={(e) => setEditedJson(e.target.value)}
            className="font-mono text-xs"
          />
          {row.tool === "quiz" && (
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={pushAsMcq}
                onChange={(e) => setPushAsMcq(e.target.checked)}
              />
              Also push as MCQ questions to the course's final test
            </label>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{" "}
            Save fork
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Dialog wrapper ---------------- */
function ToolDialog({ tool, onClose }: { tool: ToolId; onClose: () => void }) {
  const meta = TOOLS.find((t) => t.id === tool)!;
  const Icon = meta.icon;
  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" /> {meta.title}
          </DialogTitle>
          <DialogDescription>{meta.tagline}</DialogDescription>
        </DialogHeader>

        {tool === "quiz" && <QuizTool />}
        {tool === "doubt" && <DoubtTool />}
        {tool === "career" && <CareerTool />}
        {tool === "reminder" && <ReminderTool />}
        {tool === "synth" && <SynthTool />}
        {tool === "flashcards" && <FlashcardsTool />}

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function useTool() {
  const fn = useServerFn(runAiTool);
  const [loading, setLoading] = useState(false);
  const run = async <T,>(input: any, pick: (r: any) => T): Promise<T | null> => {
    setLoading(true);
    try {
      return pick(await fn({ data: input }));
    } catch (e: any) {
      toast.error(e?.message ?? "AI request failed");
      return null;
    } finally {
      setLoading(false);
    }
  };
  return { loading, run };
}

function MarkdownBlock({ children }: { children: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-muted prose-pre:text-foreground prose-code:before:hidden prose-code:after:hidden">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

/* ---------------- Quiz ---------------- */
type QuizQ = { question: string; options: string[]; answer: number; explanation: string };

function QuizTool() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [questions, setQuestions] = useState<QuizQ[] | null>(null);
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const { loading, run } = useTool();

  const generate = async () => {
    if (!topic.trim()) return toast.error("Enter a topic");
    setSubmitted(false);
    setPicks({});
    const res = await run<{ questions: QuizQ[] }>(
      { action: "quiz", topic, count, difficulty },
      (r) => JSON.parse(r.json),
    );
    if (res?.questions) setQuestions(res.questions);
  };

  const score = questions
    ? questions.reduce((s, q, i) => s + (picks[i] === q.answer ? 1 : 0), 0)
    : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_140px] gap-2">
        <Input
          placeholder="Topic, e.g. JavaScript closures"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <Input
          type="number"
          min={1}
          max={20}
          value={count}
          onChange={(e) => setCount(Number(e.target.value) || 5)}
        />
        <Select value={difficulty} onValueChange={(v) => setDifficulty(v as any)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={generate} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}{" "}
        Generate quiz
      </Button>
      {questions && (
        <div className="space-y-4">
          {submitted && (
            <div className="rounded-lg border bg-primary/5 p-3 text-sm flex items-center justify-between">
              <span>
                Score:{" "}
                <b>
                  {score}/{questions.length}
                </b>
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setPicks({});
                  setSubmitted(false);
                }}
              >
                <RotateCw className="h-3.5 w-3.5" /> Retry
              </Button>
            </div>
          )}
          {questions.map((q, i) => (
            <div key={i} className="rounded-lg border p-4 space-y-2">
              <div className="text-sm font-medium">
                {i + 1}. {q.question}
              </div>
              <div className="grid gap-1.5">
                {q.options.map((opt, idx) => {
                  const isPicked = picks[i] === idx;
                  const isCorrect = q.answer === idx;
                  return (
                    <button
                      key={idx}
                      disabled={submitted}
                      onClick={() => setPicks((p) => ({ ...p, [i]: idx }))}
                      className={cn(
                        "text-left text-sm rounded-md border px-3 py-2 flex items-center gap-2 transition",
                        !submitted && isPicked && "border-primary bg-primary/5",
                        submitted && isCorrect && "border-emerald-500/60 bg-emerald-500/10",
                        submitted && isPicked && !isCorrect && "border-rose-500/60 bg-rose-500/10",
                      )}
                    >
                      <span className="text-xs text-muted-foreground w-5">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span className="flex-1">{opt}</span>
                      {submitted && isCorrect && <Check className="h-4 w-4 text-emerald-500" />}
                      {submitted && isPicked && !isCorrect && (
                        <X className="h-4 w-4 text-rose-500" />
                      )}
                    </button>
                  );
                })}
              </div>
              {submitted && <p className="text-xs text-muted-foreground pt-1">{q.explanation}</p>}
            </div>
          ))}
          {!submitted && (
            <Button
              onClick={() => setSubmitted(true)}
              disabled={Object.keys(picks).length < questions.length}
            >
              Submit quiz
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- Doubt ---------------- */
function DoubtTool() {
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const { loading, run } = useTool();
  const solve = async () => {
    if (!question.trim()) return toast.error("Enter your doubt");
    const res = await run<string>(
      { action: "doubt", subject: subject || undefined, question },
      (r) => r.content,
    );
    if (res) setAnswer(res);
  };
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2">
        <Input
          placeholder="Subject (optional)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <Textarea
          rows={3}
          placeholder="Your question, error, or concept…"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      <Button onClick={solve} disabled={loading}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <HelpCircle className="h-4 w-4" />
        )}{" "}
        Clear my doubt
      </Button>
      {answer && (
        <div className="border rounded-lg p-4">
          <MarkdownBlock>{answer}</MarkdownBlock>
        </div>
      )}
    </div>
  );
}

/* ---------------- Career ---------------- */
function CareerTool() {
  const [goal, setGoal] = useState("");
  const [years, setYears] = useState(0);
  const [background, setBackground] = useState("");
  const [out, setOut] = useState("");
  const { loading, run } = useTool();
  const go = async () => {
    if (!goal.trim()) return toast.error("Enter a target role / goal");
    const res = await run<string>(
      { action: "career", goal, years, background: background || undefined },
      (r) => r.content,
    );
    if (res) setOut(res);
  };
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-2">
        <Input
          placeholder="Target role, e.g. Senior Full-Stack Engineer"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <Input
          type="number"
          min={0}
          max={40}
          value={years}
          onChange={(e) => setYears(Number(e.target.value) || 0)}
          placeholder="Years exp"
        />
      </div>
      <Textarea
        rows={3}
        placeholder="Your background, stack, what you've built (optional)"
        value={background}
        onChange={(e) => setBackground(e.target.value)}
      />
      <Button onClick={go} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Briefcase className="h-4 w-4" />}{" "}
        Build my plan
      </Button>
      {out && (
        <div className="border rounded-lg p-4">
          <MarkdownBlock>{out}</MarkdownBlock>
        </div>
      )}
    </div>
  );
}

/* ---------------- Smart Reminders (scheduled) ---------------- */
function ReminderTool() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(() =>
    new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
  );
  const [frequency, setFrequency] = useState<"once" | "daily" | "weekly" | "hourly">("once");
  const [topic, setTopic] = useState("");
  const [saving, setSaving] = useState(false);
  const { loading, run } = useTool();

  const aiDraft = async () => {
    if (!topic.trim()) return toast.error("Enter what you want to be reminded about");
    const res = await run<{ title: string; body: string; suggested_time: string }>(
      { action: "reminder", task: topic, when: date, goal: undefined },
      (r) => JSON.parse(r.json),
    );
    if (res) {
      setTitle(res.title);
      setBody(res.body);
    }
  };

  const save = async () => {
    if (!user) return;
    if (!title.trim()) return toast.error("Title required");
    setSaving(true);
    const { error } = await supabase.from("scheduled_reminders").insert({
      user_id: user.id,
      title: title.trim(),
      body: body.trim() || null,
      frequency,
      next_run_at: new Date(date).toISOString(),
      active: true,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Reminder scheduled — visible in Inbox");
    setTitle("");
    setBody("");
    setTopic("");
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <Input
          placeholder="Topic to draft (optional) — e.g. Finish React Hooks lesson"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <Button variant="outline" onClick={aiDraft} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}{" "}
          AI draft
        </Button>
      </div>
      <Input
        placeholder="Reminder title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        rows={3}
        placeholder="Reminder body / notes"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-muted-foreground">Date & time</label>
          <Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Frequency</label>
          <Select value={frequency} onValueChange={(v) => setFrequency(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="once">Once</SelectItem>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={save} disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <BellRing className="h-4 w-4" />}{" "}
        Schedule reminder
      </Button>
      <p className="text-[11px] text-muted-foreground">
        Reminders fire every minute via background scheduler — you'll get an inbox notification and
        an email.
      </p>
    </div>
  );
}

/* ---------------- Synth ---------------- */
function SynthTool() {
  const [notes, setNotes] = useState("");
  const [out, setOut] = useState("");
  const { loading, run } = useTool();
  const go = async () => {
    if (notes.trim().length < 10) return toast.error("Paste more notes (min 10 chars)");
    const res = await run<string>({ action: "synth", notes }, (r) => r.content);
    if (res) setOut(res);
  };
  return (
    <div className="space-y-3">
      <Textarea
        rows={8}
        placeholder="Paste lesson notes, transcript, or article…"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <Button onClick={go} disabled={loading}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <BookOpenCheck className="h-4 w-4" />
        )}{" "}
        Synthesize
      </Button>
      {out && (
        <div className="border rounded-lg p-4">
          <MarkdownBlock>{out}</MarkdownBlock>
        </div>
      )}
    </div>
  );
}

/* ---------------- Flashcards ---------------- */
type Card = { front: string; back: string };

function FlashcardsTool() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(10);
  const [cards, setCards] = useState<Card[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const { loading, run } = useTool();
  const generate = async () => {
    if (!topic.trim()) return toast.error("Enter a topic");
    setIdx(0);
    setFlipped(false);
    const res = await run<{ cards: Card[] }>({ action: "flashcards", topic, count }, (r) =>
      JSON.parse(r.json),
    );
    if (res?.cards) setCards(res.cards);
  };
  const current = cards?.[idx];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-2">
        <Input
          placeholder="Topic, e.g. SQL joins"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <Input
          type="number"
          min={3}
          max={30}
          value={count}
          onChange={(e) => setCount(Number(e.target.value) || 10)}
        />
      </div>
      <Button onClick={generate} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Layers className="h-4 w-4" />}{" "}
        Generate flashcards
      </Button>
      {current && (
        <div className="space-y-3">
          <div className="text-xs text-muted-foreground">
            Card {idx + 1} / {cards!.length}
          </div>
          <button
            onClick={() => setFlipped((f) => !f)}
            className="w-full min-h-[180px] rounded-2xl border bg-card p-6 flex items-center justify-center text-center hover:bg-accent transition"
          >
            <div className="space-y-2">
              <Badge variant="outline" className="text-[10px]">
                {flipped ? "Back" : "Front"} · click to flip
              </Badge>
              <p className="text-base font-medium">{flipped ? current.back : current.front}</p>
            </div>
          </button>
          <div className="flex justify-between gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIdx((i) => Math.max(0, i - 1));
                setFlipped(false);
              }}
              disabled={idx === 0}
            >
              Previous
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIdx((i) => Math.min(cards!.length - 1, i + 1));
                setFlipped(false);
              }}
              disabled={idx >= cards!.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
