import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Map,
  Loader2,
  Sparkles,
  Download,
  Check,
  ChevronRight,
  Target,
  BookOpen,
  FolderGit2,
  Milestone,
  ExternalLink,
  Circle,
  AlertCircle,
  Clock,
  TrendingUp,
  Code,
  BarChart3,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { generateCareerRoadmap } from "@/lib/resume.functions";
import { SkillBadge } from "@/components/SkillBadge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export const Route = createFileRoute("/_authenticated/career-roadmap")({
  head: () => ({ meta: [{ title: "Career Roadmap — Learnify AI" }] }),
  component: CareerRoadmapPage,
});

const TIMELINES = [
  { value: "3 months", label: "3 Months (Intensive)" },
  { value: "6 months", label: "6 Months (Balanced)" },
  { value: "12 months", label: "12 Months (Standard)" },
  { value: "24 months", label: "24 Months (Part-time)" },
];

const STYLES = [
  { value: "self-paced", label: "Self-Paced" },
  { value: "structured", label: "Structured" },
  { value: "mentor-led", label: "Mentor-Led" },
];

const PHASE_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#06b6d4",
];

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  };
  return (
    <Badge variant="outline" className={`${styles[priority] || ""} text-[10px] uppercase font-semibold`}>
      {priority}
    </Badge>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const styles: Record<string, string> = {
    beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    advanced: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  };
  return (
    <Badge variant="outline" className={`${styles[difficulty] || ""} text-[10px]`}>
      {difficulty}
    </Badge>
  );
}

interface RoadmapData {
  title: string;
  summary: string;
  timeline_months: number;
  current_skills: string[];
  target_skills: string[];
  skill_gap: Array<{
    skill: string;
    priority: string;
    why: string;
  }>;
  phases: Array<{
    title: string;
    subtitle: string;
    color: string;
    description: string;
    skills: Array<{ name: string; topics: string[] }>;
    courses: Array<{
      title: string;
      provider: string;
      url: string;
      is_free: boolean;
      duration: string;
    }>;
    projects: Array<{
      title: string;
      description: string;
      tech_stack: string[];
      difficulty: string;
    }>;
    milestones: string[];
  }>;
  monthly_milestones: Array<{
    month: number;
    goal: string;
    deliverable: string;
  }>;
  interview_prep: {
    topics: string[];
    platforms: string[];
    questions: string[];
  };
}

function CareerRoadmapPage() {
  const generateFn = useServerFn(generateCareerRoadmap);
  const [tab, setTab] = useState("form");
  const [loading, setLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [rawContent, setRawContent] = useState<string | null>(null);

  const [form, setForm] = useState({
    currentRole: "",
    targetRole: "",
    skills: "",
    experience: "",
    education: "",
    timeline: "12 months",
    learningStyle: "self-paced",
  });

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleGenerate = async () => {
    if (!form.targetRole.trim()) return toast.error("Enter your target role");
    if (!form.skills.trim()) return toast.error("Enter your current skills");

    setLoading(true);
    try {
      const res = await generateFn({ data: form });
      if (res.roadmap) {
        setRoadmapData(res.roadmap);
        setRawContent(null);
        setTab("roadmap");
        toast.success("Career roadmap generated!");
      } else {
        setRawContent(res.rawContent || "No content returned");
        setRoadmapData(null);
        setTab("roadmap");
        toast.warning("Generated roadmap in markdown format");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!roadmapData && !rawContent) return;
    if (roadmapData) {
      const blob = new Blob([JSON.stringify(roadmapData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Career_Roadmap_${form.targetRole.replace(/\s+/g, "_")}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (rawContent) {
      const blob = new Blob([rawContent], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Career_Roadmap_${form.targetRole.replace(/\s+/g, "_")}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
    toast.success("Roadmap downloaded!");
  };

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 max-w-7xl">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-medium flex items-center gap-1.5">
              <Map className="h-3.5 w-3.5" /> Career Tools
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-display font-semibold tracking-tight">
              Career Roadmap
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Personalized learning paths based on your career goals and current skills.
            </p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="mt-2">
          <TabsList>
            <TabsTrigger value="form">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Your Profile
            </TabsTrigger>
            <TabsTrigger value="roadmap" disabled={!roadmapData && !rawContent}>
              <Map className="h-3.5 w-3.5 mr-1.5" /> Your Roadmap
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="pt-4 space-y-6 max-w-2xl">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Current Role</Label>
                  <Input
                    placeholder="e.g. Junior Developer"
                    value={form.currentRole}
                    onChange={(e) => update("currentRole", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Target Role *</Label>
                  <Input
                    placeholder="e.g. Senior Full-Stack Engineer"
                    value={form.targetRole}
                    onChange={(e) => update("targetRole", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Current Skills *</Label>
                <Textarea
                  rows={3}
                  placeholder="List your current technical and soft skills..."
                  value={form.skills}
                  onChange={(e) => update("skills", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Work Experience</Label>
                <Textarea
                  rows={3}
                  placeholder="Briefly describe your professional experience"
                  value={form.experience}
                  onChange={(e) => update("experience", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Education</Label>
                <Input
                  placeholder="e.g. B.Tech Computer Science, 2022"
                  value={form.education}
                  onChange={(e) => update("education", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Timeline</Label>
                  <Select
                    value={form.timeline}
                    onValueChange={(v) => update("timeline", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMELINES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Learning Style</Label>
                  <Select
                    value={form.learningStyle}
                    onValueChange={(v) => update("learningStyle", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STYLES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {loading ? "Generating..." : "Generate Roadmap"}
            </Button>
          </TabsContent>

          <TabsContent value="roadmap" className="pt-4">
            {(roadmapData || rawContent) && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <Button onClick={handleDownload} size="sm">
                    <Download className="h-4 w-4 mr-1.5" /> Download
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        roadmapData ? JSON.stringify(roadmapData, null, 2) : rawContent || ""
                      );
                      toast.success("Copied!");
                    }}
                    size="sm"
                  >
                    <Check className="h-4 w-4 mr-1.5" /> Copy
                  </Button>
                  <Button variant="ghost" onClick={() => setTab("form")} size="sm">
                    <ChevronRight className="h-4 w-4 mr-1.5" /> Edit & Regenerate
                  </Button>
                </div>

                {roadmapData ? (
                  <StructuredRoadmap data={roadmapData} />
                ) : (
                  <div className="border rounded-xl p-6 bg-card text-sm whitespace-pre-wrap">
                    {rawContent}
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

function StructuredRoadmap({ data }: { data: RoadmapData }) {
  const gapChartData = data.skill_gap.map((s) => ({
    name: s.skill.length > 12 ? s.skill.slice(0, 12) + "…" : s.skill,
    priority: s.priority === "high" ? 3 : s.priority === "medium" ? 2 : 1,
    fill: s.priority === "high" ? "#ef4444" : s.priority === "medium" ? "#f59e0b" : "#10b981",
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-bold tracking-tight">{data.title}</h2>
        <p className="text-muted-foreground mt-1">{data.summary}</p>
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {data.timeline_months} months
          </span>
          <span className="flex items-center gap-1.5">
            <Target className="h-4 w-4" />
            {data.target_skills.length} target skills
          </span>
          <span className="flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4" />
            {data.skill_gap.length} gaps identified
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" /> Current Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {data.current_skills.map((s) => (
                <SkillBadge key={s} skill={s} variant="secondary" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" /> Target Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {data.target_skills.map((s) => (
                <SkillBadge key={s} skill={s} variant="default" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {data.skill_gap.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-amber-500" /> Skill Gap Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {gapChartData.length > 0 && (
              <ResponsiveContainer width="100%" height={Math.max(150, gapChartData.length * 36)}>
                <BarChart data={gapChartData} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <XAxis type="number" domain={[0, 3]} hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(v: number) =>
                      v === 3 ? "High" : v === 2 ? "Medium" : "Low"
                    }
                  />
                  <Bar dataKey="priority" radius={[0, 4, 4, 0]}>
                    {gapChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
            <div className="space-y-2">
              {data.skill_gap.map((gap) => (
                <div
                  key={gap.skill}
                  className="flex items-start gap-3 p-2 rounded-lg bg-muted/50 text-sm"
                >
                  <SkillBadge skill={gap.skill} size="md" />
                  <PriorityBadge priority={gap.priority} />
                  <span className="text-muted-foreground">{gap.why}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" /> Learning Phases
        </h3>
        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-[2px] bg-border" />
          <div className="space-y-8">
            {data.phases.map((phase, i) => {
              const color = phase.color || PHASE_COLORS[i % PHASE_COLORS.length];
              return (
                <div key={i} className="relative flex gap-4">
                  <div
                    className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 -mt-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <h4 className="text-lg font-semibold">{phase.title}</h4>
                      <span className="text-xs text-muted-foreground">{phase.subtitle}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{phase.description}</p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {phase.skills.length > 0 && (
                        <div className="rounded-lg border p-3 space-y-2 bg-card">
                          <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                            <Code className="h-3.5 w-3.5" /> Skills
                          </h5>
                          {phase.skills.map((s) => (
                            <div key={s.name}>
                              <SkillBadge skill={s.name} size="md" />
                              {s.topics.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {s.topics.map((t) => (
                                    <span
                                      key={t}
                                      className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {phase.courses.length > 0 && (
                        <div className="rounded-lg border p-3 space-y-2 bg-card">
                          <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5" /> Courses
                          </h5>
                          {phase.courses.map((c, j) => (
                            <div key={j} className="text-sm">
                              <div className="flex items-center gap-2">
                                {c.url ? (
                                  <a
                                    href={c.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium hover:underline flex items-center gap-1"
                                  >
                                    {c.title}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                ) : (
                                  <span className="font-medium">{c.title}</span>
                                )}
                                {c.is_free && (
                                  <Badge variant="outline" className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                    Free
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {c.provider} · {c.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {phase.projects.length > 0 && (
                        <div className="rounded-lg border p-3 space-y-2 bg-card">
                          <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                            <FolderGit2 className="h-3.5 w-3.5" /> Projects
                          </h5>
                          {phase.projects.map((p, j) => (
                            <div key={j} className="text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{p.title}</span>
                                <DifficultyBadge difficulty={p.difficulty} />
                              </div>
                              <p className="text-xs text-muted-foreground">{p.description}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {p.tech_stack.map((t) => (
                                  <SkillBadge key={t} skill={t} variant="outline" size="sm" />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {phase.milestones.length > 0 && (
                        <div className="rounded-lg border p-3 space-y-2 bg-card">
                          <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                            <Milestone className="h-3.5 w-3.5" /> Milestones
                          </h5>
                          <ul className="space-y-1">
                            {phase.milestones.map((m, j) => (
                              <li key={j} className="text-sm flex items-start gap-2">
                                <Circle className="h-2 w-2 mt-1.5 shrink-0" style={{ fill: color }} />
                                {m}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {data.monthly_milestones.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Milestone className="h-4 w-4 text-purple-500" /> Monthly Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {data.monthly_milestones.map((m) => (
                <div
                  key={m.month}
                  className="p-2.5 rounded-lg border bg-card text-sm"
                >
                  <div className="font-semibold text-primary">Month {m.month}</div>
                  <div className="font-medium mt-0.5">{m.goal}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Deliverable: {m.deliverable}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.interview_prep && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-rose-500" /> Interview Preparation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.interview_prep.topics.length > 0 && (
              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  Key Topics
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {data.interview_prep.topics.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {data.interview_prep.platforms.length > 0 && (
              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  Practice Platforms
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {data.interview_prep.platforms.map((p) => (
                    <Badge key={p} variant="outline" className="text-xs">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {data.interview_prep.questions.length > 0 && (
              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  Common Questions
                </h5>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {data.interview_prep.questions.map((q, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary font-mono text-xs mt-0.5">{i + 1}.</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
