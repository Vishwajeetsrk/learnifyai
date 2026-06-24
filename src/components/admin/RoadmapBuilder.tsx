import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Compass,
  Sparkles,
  Clock,
  Tag,
  Copy,
  ChevronDown,
  ChevronRight,
  Check,
  Save,
  X,
  BookOpen,
  Target,
  Zap,
  Award,
  Calendar,
  ArrowRight,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  wcmsListRoadmaps,
  wcmsSaveRoadmap,
  wcmsDeleteRoadmap,
  wcmsDuplicateRoadmap,
  wcmsGenerateAiRoadmap,
} from "@/lib/wcms.functions";

type RoadmapPhase = {
  id: string;
  title: string;
  description: string;
  skills: string[];
  estimated_hours: number;
  resources: { title: string; url: string; type: string }[];
  milestones: { title: string; completed: boolean }[];
};

type Roadmap = {
  id: string;
  creator_id: string;
  learner_id: string | null;
  title: string;
  description: string | null;
  skill_level: string;
  estimated_hours: number;
  status: string;
  source: string;
  ai_prompt: string | null;
  phases: RoadmapPhase[];
  tags: string[];
  is_template: boolean;
  published_at: string | null;
  created_at: string;
};

const SKILL_LEVELS = ["beginner", "intermediate", "advanced", "expert"];
const SKILL_SUGGESTIONS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "SQL",
  "Git",
  "HTML/CSS",
  "API Design",
  "Testing",
  "DevOps",
  "Cloud",
  "AI/ML",
  "System Design",
  "Data Structures",
  "Algorithms",
  "Docker",
  "Linux",
];

const generateId = () => crypto.randomUUID().slice(0, 8);

function createEmptyPhase(): RoadmapPhase {
  return {
    id: generateId(),
    title: "",
    description: "",
    skills: [],
    estimated_hours: 5,
    resources: [],
    milestones: [],
  };
}

export default function RoadmapBuilder({ user, isCreator }: { user: any; isCreator: boolean }) {
  const qc = useQueryClient();
  const listRoadmapsFn = useServerFn(wcmsListRoadmaps);
  const saveRoadmapFn = useServerFn(wcmsSaveRoadmap);
  const deleteRoadmapFn = useServerFn(wcmsDeleteRoadmap);
  const duplicateRoadmapFn = useServerFn(wcmsDuplicateRoadmap);
  const generateAiRoadmapFn = useServerFn(wcmsGenerateAiRoadmap);

  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [editing, setEditing] = useState<Roadmap | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"creator" | "learner">("creator");
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());

  const { data: rawRoadmaps = [], isLoading } = useQuery({
    queryKey: ["coaching-roadmaps", user?.id],
    queryFn: async () => {
      const result = await listRoadmapsFn({ data: {} });
      return result as Roadmap[];
    },
    enabled: !!user,
  });

  useEffect(() => {
    setRoadmaps(rawRoadmaps);
  }, [rawRoadmaps]);

  const togglePhaseExpand = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) next.delete(phaseId);
      else next.add(phaseId);
      return next;
    });
  };

  // ───────── AI Generate Roadmap ─────────
  const generateAiRoadmap = async () => {
    if (!aiPrompt.trim()) return toast.error("Enter a topic or goal");
    setAiGenerating(true);
    try {
      const parsed = await generateAiRoadmapFn({ data: { prompt: aiPrompt } });

      const newRoadmap: Roadmap = {
        id: "",
        creator_id: user.id,
        learner_id: null,
        title: parsed.title ?? aiPrompt,
        description: parsed.description ?? "",
        skill_level: parsed.skill_level ?? "beginner",
        estimated_hours: parsed.estimated_hours ?? 20,
        status: "draft",
        source: "ai",
        ai_prompt: aiPrompt,
        phases: (parsed.phases ?? []).map((p: any) => ({
          id: generateId(),
          title: p.title ?? "",
          description: p.description ?? "",
          skills: p.skills ?? [],
          estimated_hours: p.estimated_hours ?? 5,
          resources: p.resources ?? [],
          milestones: (p.milestones ?? []).map((m: any) => ({
            title: m.title ?? "",
            completed: false,
          })),
        })),
        tags: parsed.tags ?? [],
        is_template: false,
        published_at: null,
        created_at: new Date().toISOString(),
      };

      setEditing(newRoadmap);
      setOpen(true);
      setAiDialogOpen(false);
      setAiPrompt("");
      toast.success("AI roadmap generated! Review and save.");
    } catch (e: any) {
      toast.error(e?.message || "AI generation failed");
    }
    setAiGenerating(false);
  };

  // ───────── CRUD ─────────
  const newManualRoadmap = () => {
    setEditing({
      id: "",
      creator_id: user.id,
      learner_id: null,
      title: "",
      description: "",
      skill_level: "beginner",
      estimated_hours: 10,
      status: "draft",
      source: "manual",
      ai_prompt: null,
      phases: [createEmptyPhase()],
      tags: [],
      is_template: false,
      published_at: null,
      created_at: new Date().toISOString(),
    });
    setOpen(true);
  };

  const saveRoadmap = async () => {
    if (!editing) return;
    if (!editing.title) return toast.error("Title required");
    try {
      await saveRoadmapFn({
        data: {
          id: editing.id || undefined,
          learner_id: editing.learner_id,
          title: editing.title,
          description: editing.description,
          skill_level: editing.skill_level,
          estimated_hours: editing.estimated_hours,
          status: editing.status,
          source: editing.source,
          ai_prompt: editing.ai_prompt,
          phases: editing.phases,
          tags: editing.tags,
          is_template: editing.is_template,
          published_at: editing.published_at,
        },
      });
      toast.success(editing.id ? "Roadmap updated" : "Roadmap created");
      setOpen(false);
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["coaching-roadmaps"] });
    } catch (e: any) {
      toast.error(e?.message || "Save failed");
    }
  };

  const removeRoadmap = async () => {
    if (!deleteId) return;
    try {
      await deleteRoadmapFn({ data: { id: deleteId } });
      toast.success("Deleted");
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    }
    setDeleteId(null);
    qc.invalidateQueries({ queryKey: ["coaching-roadmaps"] });
  };

  const duplicateRoadmap = async (id: string) => {
    try {
      await duplicateRoadmapFn({ data: { id } });
      toast.success("Duplicated");
      qc.invalidateQueries({ queryKey: ["coaching-roadmaps"] });
    } catch (e: any) {
      toast.error(e?.message || "Duplicate failed");
    }
  };

  const totalHours = (phases: RoadmapPhase[]) =>
    phases.reduce((sum, p) => sum + (p.estimated_hours || 0), 0);
  const completedMilestones = (phases: RoadmapPhase[]) =>
    phases.reduce((sum, p) => sum + p.milestones.filter((m) => m.completed).length, 0);
  const totalMilestones = (phases: RoadmapPhase[]) =>
    phases.reduce((sum, p) => sum + p.milestones.length, 0);

  const statusColors: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    completed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    archived: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold font-display flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" /> Learning Roadmaps
          </h2>
          <p className="text-sm text-muted-foreground">
            Create AI-powered or manual learning roadmaps with phases, skills, and milestones.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setAiDialogOpen(true)}>
            <Sparkles className="h-4 w-4 mr-2" /> AI Generate
          </Button>
          <Button onClick={newManualRoadmap}>
            <Plus className="h-4 w-4 mr-2" /> Manual
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : roadmaps.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-xl text-muted-foreground">
          <Compass className="h-10 w-10 mx-auto mb-3 opacity-20" />
          <p className="text-lg font-medium mb-1">No roadmaps yet</p>
          <p className="text-sm mb-4">Create your first roadmap manually or let AI generate one.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setAiDialogOpen(true)}>
              <Sparkles className="h-4 w-4 mr-2" /> AI Generate
            </Button>
            <Button onClick={newManualRoadmap}>
              <Plus className="h-4 w-4 mr-2" /> Create Manually
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {roadmaps.map((rm) => (
            <div
              key={rm.id}
              className="rounded-xl border bg-card p-5 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  {rm.source === "ai" ? (
                    <Sparkles className="h-6 w-6 text-primary" />
                  ) : (
                    <BookOpen className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-lg">{rm.title}</h3>
                    <Badge className={statusColors[rm.status] ?? "bg-muted"}>{rm.status}</Badge>
                    {rm.source === "ai" && (
                      <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                        <Sparkles className="h-3 w-3 mr-1" /> AI
                      </Badge>
                    )}
                    {rm.is_template && <Badge variant="outline">Template</Badge>}
                  </div>
                  {rm.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {rm.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" /> {rm.phases.length} phases
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {totalHours(rm.phases)}h total
                    </span>
                    <span className="flex items-center gap-1">
                      <Check className="h-3 w-3" /> {completedMilestones(rm.phases)}/
                      {totalMilestones(rm.phases)} milestones
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3" /> {rm.skill_level}
                    </span>
                  </div>
                  {rm.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {rm.tags.map((t) => (
                        <Badge key={t} variant="secondary" className="text-[10px]">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditing(rm);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => duplicateRoadmap(rm.id)}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteId(rm.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Phase Preview */}
              {rm.phases.length > 0 && (
                <div className="mt-4 space-y-2">
                  {rm.phases.map((phase, pi) => {
                    const expanded = expandedPhases.has(`${rm.id}-${phase.id}`);
                    const phaseDone = phase.milestones.filter((m) => m.completed).length;
                    const phaseTotal = phase.milestones.length;
                    return (
                      <div key={phase.id} className="border rounded-lg overflow-hidden">
                        <button
                          className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/30 transition-colors"
                          onClick={() => togglePhaseExpand(`${rm.id}-${phase.id}`)}
                        >
                          {expanded ? (
                            <ChevronDown className="h-4 w-4 shrink-0" />
                          ) : (
                            <ChevronRight className="h-4 w-4 shrink-0" />
                          )}
                          <span className="text-sm font-medium">
                            Phase {pi + 1}: {phase.title}
                          </span>
                          <span className="text-xs text-muted-foreground ml-auto flex gap-3">
                            <span>{phase.skills.length} skills</span>
                            <span>{phase.estimated_hours}h</span>
                            {phaseTotal > 0 && (
                              <span>
                                {phaseDone}/{phaseTotal}
                              </span>
                            )}
                          </span>
                        </button>
                        {expanded && (
                          <div className="px-4 pb-3 space-y-2 border-t">
                            {phase.description && (
                              <p className="text-sm text-muted-foreground mt-2">
                                {phase.description}
                              </p>
                            )}
                            {phase.skills.length > 0 && (
                              <div className="flex gap-1 flex-wrap mt-2">
                                {phase.skills.map((s) => (
                                  <Badge key={s} variant="outline" className="text-[10px]">
                                    {s}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {phase.milestones.length > 0 && (
                              <div className="space-y-1 mt-2">
                                {phase.milestones.map((m, mi) => (
                                  <div key={mi} className="flex items-center gap-2 text-sm">
                                    <div
                                      className={`h-4 w-4 rounded-full border flex items-center justify-center ${m.completed ? "bg-emerald-500 border-emerald-500" : "border-muted-foreground"}`}
                                    >
                                      {m.completed && <Check className="h-2.5 w-2.5 text-white" />}
                                    </div>
                                    <span
                                      className={
                                        m.completed ? "line-through text-muted-foreground" : ""
                                      }
                                    >
                                      {m.title}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* AI Generate Dialog */}
      <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> AI Roadmap Generator
            </DialogTitle>
            <DialogDescription>
              Describe what you want to learn and AI will create a structured roadmap.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Topic or Goal</Label>
              <Textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Full-stack web development with React and Node.js, or Machine Learning fundamentals..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Quick suggestions</Label>
              <div className="flex flex-wrap gap-1">
                {[
                  "React Developer",
                  "Python for AI",
                  "DevOps Engineer",
                  "Full-Stack JavaScript",
                  "Data Structures & Algorithms",
                  "Cloud Architecture",
                ].map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant="outline"
                    className="text-xs h-6"
                    onClick={() => setAiPrompt(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAiDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={generateAiRoadmap} disabled={aiGenerating}>
              {aiGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {aiGenerating ? "Generating..." : "Generate Roadmap"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Roadmap Editor Dialog */}
      {editing && (
        <RoadmapEditor
          roadmap={editing}
          onSave={saveRoadmap}
          onChange={setEditing}
          onClose={() => {
            setEditing(null);
            setOpen(false);
          }}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Roadmap?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={removeRoadmap}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Roadmap Editor (full form with phases, skills, milestones)
// ═══════════════════════════════════════════════════════════════

function RoadmapEditor({
  roadmap,
  onSave,
  onChange,
  onClose,
}: {
  roadmap: Roadmap;
  onSave: () => void;
  onChange: (rm: Roadmap) => void;
  onClose: () => void;
}) {
  const addPhase = () => {
    onChange({
      ...roadmap,
      phases: [...roadmap.phases, createEmptyPhase()],
    });
  };

  const updatePhase = (phaseId: string, updates: Partial<RoadmapPhase>) => {
    onChange({
      ...roadmap,
      phases: roadmap.phases.map((p) => (p.id === phaseId ? { ...p, ...updates } : p)),
    });
  };

  const removePhase = (phaseId: string) => {
    onChange({
      ...roadmap,
      phases: roadmap.phases.filter((p) => p.id !== phaseId),
    });
  };

  const addMilestone = (phaseId: string) => {
    const phase = roadmap.phases.find((p) => p.id === phaseId);
    if (!phase) return;
    updatePhase(phaseId, {
      milestones: [...phase.milestones, { title: "", completed: false }],
    });
  };

  const updateMilestone = (phaseId: string, idx: number, title: string) => {
    const phase = roadmap.phases.find((p) => p.id === phaseId);
    if (!phase) return;
    const milestones = [...phase.milestones];
    milestones[idx] = { ...milestones[idx], title };
    updatePhase(phaseId, { milestones });
  };

  const removeMilestone = (phaseId: string, idx: number) => {
    const phase = roadmap.phases.find((p) => p.id === phaseId);
    if (!phase) return;
    updatePhase(phaseId, { milestones: phase.milestones.filter((_, i) => i !== idx) });
  };

  const addSkill = (phaseId: string, skill: string) => {
    const phase = roadmap.phases.find((p) => p.id === phaseId);
    if (!phase || !skill.trim()) return;
    if (phase.skills.includes(skill.trim())) return;
    updatePhase(phaseId, { skills: [...phase.skills, skill.trim()] });
  };

  const removeSkill = (phaseId: string, skill: string) => {
    const phase = roadmap.phases.find((p) => p.id === phaseId);
    if (!phase) return;
    updatePhase(phaseId, { skills: phase.skills.filter((s) => s !== skill) });
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{roadmap.id ? "Edit Roadmap" : "New Roadmap"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Title</Label>
              <Input
                value={roadmap.title}
                onChange={(e) => onChange({ ...roadmap, title: e.target.value })}
                placeholder="Roadmap title"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Description</Label>
              <Textarea
                value={roadmap.description ?? ""}
                onChange={(e) => onChange({ ...roadmap, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Skill Level</Label>
              <Select
                value={roadmap.skill_level}
                onValueChange={(v) => onChange({ ...roadmap, skill_level: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SKILL_LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estimated Hours</Label>
              <Input
                type="number"
                value={roadmap.estimated_hours}
                onChange={(e) => onChange({ ...roadmap, estimated_hours: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={roadmap.status}
                onValueChange={(v) => onChange({ ...roadmap, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input
                value={roadmap.tags.join(", ")}
                onChange={(e) =>
                  onChange({
                    ...roadmap,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="react, javascript, web"
              />
            </div>
            <div className="flex items-center gap-3 col-span-2">
              <Switch
                checked={roadmap.is_template}
                onCheckedChange={(v) => onChange({ ...roadmap, is_template: v })}
              />
              <Label>Save as reusable template</Label>
            </div>
          </div>

          {/* Phases */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Phases ({roadmap.phases.length})</Label>
              <Button size="sm" variant="outline" onClick={addPhase}>
                <Plus className="h-3 w-3 mr-1" /> Add Phase
              </Button>
            </div>
            {roadmap.phases.map((phase, pi) => (
              <div key={phase.id} className="border rounded-xl p-4 space-y-3 bg-muted/20">
                <div className="flex items-center gap-2">
                  <Badge className="shrink-0">Phase {pi + 1}</Badge>
                  <Input
                    value={phase.title}
                    onChange={(e) => updatePhase(phase.id, { title: e.target.value })}
                    placeholder="Phase title"
                    className="font-medium"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removePhase(phase.id)}
                    className="text-destructive hover:text-destructive shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  value={phase.description}
                  onChange={(e) => updatePhase(phase.id, { description: e.target.value })}
                  placeholder="What this phase covers..."
                  rows={2}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Estimated Hours</Label>
                    <Input
                      type="number"
                      value={phase.estimated_hours}
                      onChange={(e) =>
                        updatePhase(phase.id, { estimated_hours: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Skills</Label>
                    <div className="flex flex-wrap gap-1">
                      {phase.skills.map((s) => (
                        <Badge key={s} variant="outline" className="text-[10px] gap-1">
                          {s}
                          <X
                            className="h-2.5 w-2.5 cursor-pointer"
                            onClick={() => removeSkill(phase.id, s)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-1 flex-wrap mt-1">
                      {SKILL_SUGGESTIONS.filter((s) => !phase.skills.includes(s))
                        .slice(0, 6)
                        .map((s) => (
                          <Button
                            key={s}
                            size="sm"
                            variant="ghost"
                            className="text-[10px] h-5 px-1.5"
                            onClick={() => addSkill(phase.id, s)}
                          >
                            + {s}
                          </Button>
                        ))}
                    </div>
                  </div>
                </div>
                {/* Milestones */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Milestones</Label>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs"
                      onClick={() => addMilestone(phase.id)}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>
                  {phase.milestones.map((m, mi) => (
                    <div key={mi} className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border border-muted-foreground shrink-0" />
                      <Input
                        value={m.title}
                        onChange={(e) => updateMilestone(phase.id, mi, e.target.value)}
                        placeholder="Milestone"
                        className="text-sm h-8"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-destructive"
                        onClick={() => removeMilestone(phase.id, mi)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            <Save className="h-4 w-4 mr-2" /> Save Roadmap
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
