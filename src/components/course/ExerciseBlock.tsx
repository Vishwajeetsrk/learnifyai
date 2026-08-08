/**
 * ExerciseBlock — in-lesson coding exercise player.
 * Loads the lesson's curated exercise, runs code (Piston), grades with AI,
 * and awards one-time XP on the first passing attempt.
 */
import { useCallback, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  AlertTriangle,
  CheckCircle2,
  Dumbbell,
  Eye,
  EyeOff,
  GraduationCap,
  Lightbulb,
  Loader2,
  Play,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { executeCode } from "@/lib/playground.functions";
import { gradeExercise } from "@/lib/exercise-grader.functions";
import {
  getLessonExercise,
  getExerciseSolve,
  recordExerciseSolve,
} from "@/lib/exercises.functions";
import { LanguageIcon, PLAYGROUND_LANGS, monacoLang } from "@/lib/playground-config";

type Exercise = {
  id: string;
  lesson_id: string;
  language: string;
  instructions: string;
  starter_code: string;
  solution_code: string;
  hint: string | null;
  passing_grade: number;
  xp_reward: number;
};

type Solve = { id: string; score: number | null; passed: boolean; solved_at: string };

type GradeResult = {
  score: number;
  passed: boolean;
  summary: string;
  correctness: string;
  suggestions: string[];
  hints: string[];
};

export function ExerciseBlock({ lessonId }: { lessonId: string }) {
  const $getExercise = useServerFn(getLessonExercise);
  const $getSolve = useServerFn(getExerciseSolve);
  const $recordSolve = useServerFn(recordExerciseSolve);
  const execFn = useServerFn(executeCode);
  const gradeFn = useServerFn(gradeExercise);

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [solve, setSolve] = useState<Solve | null>(null);
  const [code, setCode] = useState("");
  const [running, setRunning] = useState(false);
  const [grading, setGrading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [output, setOutput] = useState<{ stdout: string; stderr: string; code: number } | null>(
    null,
  );
  const [outputTab, setOutputTab] = useState<"stdout" | "stderr">("stdout");
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const langLabel =
    PLAYGROUND_LANGS.find((l) => l.id === exercise?.language)?.label ??
    exercise?.language ??
    "Code";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ex = await $getExercise({ data: { lessonId } });
        if (cancelled || !ex) return;
        setExercise(ex);
        setCode(ex.starter_code || "");
        const s = await $getSolve({ data: { exerciseId: ex.id } });
        if (!cancelled) setSolve(s);
      } catch (err: any) {
        if (!cancelled) console.error("[ExerciseBlock]", err?.message ?? err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lessonId, $getExercise, $getSolve]);

  if (!exercise) return null;

  const run = async () => {
    setRunning(true);
    setOutput(null);
    try {
      const res = await execFn({ data: { language: exercise.language, code, stdin: "" } });
      if (res.success) setOutput({ stdout: res.stdout, stderr: res.stderr, code: res.code });
      else setOutput({ stdout: "", stderr: res.error, code: 1 });
    } catch (err: any) {
      setOutput({ stdout: "", stderr: err?.message ?? "Execution failed", code: 1 });
    } finally {
      setRunning(false);
    }
  };

  const checkExercise = async () => {
    if (!code.trim()) {
      toast.error("Write some code first.");
      return;
    }
    setGrading(true);
    setGradeResult(null);
    try {
      const exercisePrompt = `${exercise.instructions}\n\n--- Starter code ---\n${exercise.starter_code}`;
      const res = await gradeFn({
        data: {
          language: exercise.language,
          code,
          stdout: output?.stdout ?? "",
          stderr: output?.stderr ?? "",
          exitCode: output?.code ?? null,
          exercise: exercisePrompt,
        },
      });
      setGradeResult(res);
      if (res.passed && !solve?.passed) {
        setSaving(true);
        try {
          const r = await $recordSolve({
            data: { exerciseId: exercise.id, score: res.score, passed: true },
          });
          setSolve({ id: "local", score: res.score, passed: true, solved_at: new Date().toISOString() });
          if (r.xpAwarded > 0) {
            toast.success(`Exercise solved! +${r.xpAwarded} XP`);
          } else {
            toast.success("Exercise solved!");
          }
        } catch (err: any) {
          toast.error(err?.message ?? "Could not record your solve");
        } finally {
          setSaving(false);
        }
      } else if (res.passed) {
        toast.success("Exercise passed!");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Grading failed");
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b bg-muted/30">
        <Dumbbell className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold">Coding Exercise</h4>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <LanguageIcon id={exercise.language} className="w-3.5 h-3.5" />
          {langLabel}
        </div>
        <div className="flex-1" />
        {solve?.passed ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-500">
            <CheckCircle2 className="h-3.5 w-3.5" /> Solved
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-500">
            <Zap className="h-3 w-3" /> +{exercise.xp_reward} XP
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
          {exercise.instructions}
        </div>

        <div className="rounded-lg border overflow-hidden">
          <Editor
            height="240px"
            language={monacoLang(exercise.language)}
            theme="vs-dark"
            value={code}
            onChange={(v) => setCode(v ?? "")}
            options={{
              fontSize: 12,
              minimap: { enabled: false },
              lineNumbers: "on",
              tabSize: 2,
              automaticLayout: true,
              padding: { top: 6 },
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={run} disabled={running}>
            {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            Run
          </Button>
          <Button size="sm" variant="secondary" onClick={checkExercise} disabled={grading || saving}>
            {grading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <GraduationCap className="h-3.5 w-3.5" />
            )}
            Check with AI
          </Button>
          <div className="flex-1" />
          {exercise.hint && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowHint(!showHint)}
              className="text-xs"
            >
              {showHint ? <EyeOff className="h-3.5 w-3.5" /> : <Lightbulb className="h-3.5 w-3.5" />}
              {showHint ? "Hide hint" : "Hint"}
            </Button>
          )}
          {exercise.solution_code && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSolution(!showSolution)}
              className="text-xs"
            >
              {showSolution ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showSolution ? "Hide solution" : "Solution"}
            </Button>
          )}
        </div>

        {output && (
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="flex border-b text-[10px]">
              <button
                onClick={() => setOutputTab("stdout")}
                className={`px-3 py-1.5 ${outputTab === "stdout" ? "bg-background font-semibold border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                stdout {output.stdout ? `(${output.stdout.length}B)` : ""}
              </button>
              <button
                onClick={() => setOutputTab("stderr")}
                className={`px-3 py-1.5 ${outputTab === "stderr" ? "bg-background font-semibold border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                stderr {output.stderr ? `(${output.stderr.length}B)` : ""}
              </button>
              <div className="flex-1" />
              <span
                className={`px-3 py-1.5 font-medium ${output.code === 0 ? "text-green-500" : "text-destructive"}`}
              >
                Exit {output.code}
              </span>
            </div>
            <div className="p-3 font-mono text-xs whitespace-pre-wrap overflow-auto max-h-48">
              {outputTab === "stdout"
                ? output.stdout || <span className="text-muted-foreground italic">No output</span>
                : output.stderr || <span className="text-muted-foreground italic">No errors</span>}
            </div>
          </div>
        )}

        {gradeResult && (
          <div className="rounded-lg border p-3 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`font-semibold ${gradeResult.passed ? "text-green-500" : "text-amber-500"}`}
              >
                {gradeResult.passed ? "Passed" : "Needs Work"} · Score: {gradeResult.score}/100
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${gradeResult.passed ? "bg-green-500" : "bg-amber-500"}`}
                  style={{ width: `${gradeResult.score}%` }}
                />
              </div>
            </div>
            <p className="text-muted-foreground">{gradeResult.summary}</p>
            <p className="text-foreground/80">{gradeResult.correctness}</p>
            {gradeResult.suggestions.length > 0 && (
              <div>
                <p className="font-medium text-foreground mt-1">Suggestions:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
                  {gradeResult.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {gradeResult.hints.length > 0 && (
              <div>
                <p className="font-medium text-foreground mt-1">Hints:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
                  {gradeResult.hints.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}
            <button
              onClick={() => setGradeResult(null)}
              className="text-[10px] text-muted-foreground hover:text-foreground"
            >
              Dismiss
            </button>
          </div>
        )}

        {showHint && exercise.hint && (
          <div className="flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs">
            <Lightbulb className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-500" />
            <p className="text-foreground/80 whitespace-pre-wrap">{exercise.hint}</p>
          </div>
        )}

        {showSolution && exercise.solution_code && (
          <div className="rounded-lg border p-3 space-y-1.5">
            <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <AlertTriangle className="h-3 w-3" /> Reference solution — try it yourself first!
            </p>
            <pre className="font-mono text-xs text-foreground/90 whitespace-pre-wrap overflow-auto max-h-64">
              {exercise.solution_code}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
