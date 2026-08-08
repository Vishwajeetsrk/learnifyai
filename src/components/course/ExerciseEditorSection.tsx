/**
 * ExerciseEditorSection — form to create/edit/delete a lesson's coding exercise.
 * Used by both the admin course system and the creator course builder.
 */
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Dumbbell, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LanguageIcon, PLAYGROUND_LANGS } from "@/lib/playground-config";
import {
  deleteLessonExercise,
  getLessonExercise,
  saveLessonExercise,
} from "@/lib/exercises.functions";

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

export function ExerciseEditorSection({ lessonId }: { lessonId: string }) {
  const $get = useServerFn(getLessonExercise);
  const $save = useServerFn(saveLessonExercise);
  const $delete = useServerFn(deleteLessonExercise);

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);

  const [language, setLanguage] = useState("python");
  const [instructions, setInstructions] = useState("");
  const [starterCode, setStarterCode] = useState("");
  const [solutionCode, setSolutionCode] = useState("");
  const [hint, setHint] = useState("");
  const [passingGrade, setPassingGrade] = useState(70);
  const [xpReward, setXpReward] = useState(10);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const ex = await $get({ data: { lessonId } });
        if (cancelled) return;
        setExercise(ex);
        if (ex) {
          setLanguage(ex.language);
          setInstructions(ex.instructions);
          setStarterCode(ex.starter_code);
          setSolutionCode(ex.solution_code);
          setHint(ex.hint ?? "");
          setPassingGrade(ex.passing_grade);
          setXpReward(ex.xp_reward);
        }
      } catch (err: any) {
        if (!cancelled) console.error("[ExerciseEditorSection]", err?.message ?? err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lessonId, $get]);

  const handleSave = useCallback(async () => {
    if (!instructions.trim()) {
      toast.error("Instructions are required");
      return;
    }
    setSaving(true);
    try {
      const saved = await $save({
        data: {
          lessonId,
          language,
          instructions: instructions.trim(),
          starterCode,
          solutionCode,
          hint: hint.trim() || null,
          passingGrade,
          xpReward,
        },
      });
      setExercise(saved);
      toast.success("Exercise saved");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save exercise");
    } finally {
      setSaving(false);
    }
  }, [lessonId, language, instructions, starterCode, solutionCode, hint, passingGrade, xpReward, $save]);

  const handleDelete = useCallback(async () => {
    setDeleting(true);
    try {
      await $delete({ data: { lessonId } });
      setExercise(null);
      toast.success("Exercise deleted");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to delete exercise");
    } finally {
      setDeleting(false);
    }
  }, [lessonId, $delete]);

  if (loading) {
    return (
      <div className="rounded-xl border border-dashed p-4 text-xs text-muted-foreground">
        Loading exercise…
      </div>
    );
  }

  if (!exercise && !creating) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 p-4">
        <Button variant="outline" size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-3.5 w-3.5" /> Add Coding Exercise
        </Button>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Learners get a runnable challenge with AI grading and one-time XP on first pass.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Dumbbell className="h-4 w-4 text-primary" />
        <h5 className="text-sm font-semibold">Coding Exercise</h5>
        <div className="flex-1" />
        {exercise && (
          <Button variant="ghost" size="sm" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            Delete
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-[11px]">Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {PLAYGROUND_LANGS.map((l) => (
                <SelectItem key={l.id} value={l.id} className="text-xs">
                  <span className="flex items-center gap-2">
                    <LanguageIcon id={l.id} className="w-4 h-4" /> {l.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px]">Passing grade (%)</Label>
          <Input
            type="number"
            min={1}
            max={100}
            value={passingGrade}
            onChange={(e) => setPassingGrade(Number(e.target.value))}
            className="h-9 text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px]">XP reward</Label>
          <Input
            type="number"
            min={0}
            max={500}
            value={xpReward}
            onChange={(e) => setXpReward(Number(e.target.value))}
            className="h-9 text-xs"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[11px]">Instructions</Label>
        <Textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="What should the learner build? Be specific about expected behavior and output."
          rows={4}
          className="text-xs"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-[11px]">Starter code</Label>
        <Textarea
          value={starterCode}
          onChange={(e) => setStarterCode(e.target.value)}
          placeholder="// Code the learner starts with"
          rows={5}
          className="text-xs font-mono"
          spellCheck={false}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-[11px]">Solution code (reveal after attempts)</Label>
        <Textarea
          value={solutionCode}
          onChange={(e) => setSolutionCode(e.target.value)}
          placeholder="// Reference solution"
          rows={5}
          className="text-xs font-mono"
          spellCheck={false}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-[11px]">Hint (optional)</Label>
        <Textarea
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder="A nudge learners can open when stuck"
          rows={2}
          className="text-xs"
        />
      </div>

      <Button size="sm" onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
        {exercise ? "Save Changes" : "Create Exercise"}
      </Button>
    </div>
  );
}
