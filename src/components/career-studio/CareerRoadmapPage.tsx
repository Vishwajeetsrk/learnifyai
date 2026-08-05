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
  Bookmark,
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
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { DEVELOPER_ROADMAPS } from "@/lib/developer-roadmaps";

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

const PHASE_COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#06b6d4"];

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  };
  return (
    <Badge
      variant="outline"
      className={`${styles[priority] || ""} text-[10px] uppercase font-semibold`}
    >
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

export function CareerRoadmapPage({ embedded = false }: { embedded?: boolean }) {
  const generateFn = useServerFn(generateCareerRoadmap);
  const [tab, setTab] = useState("form");
  const [loading, setLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [rawContent, setRawContent] = useState<string | null>(null);
  const [savedRoadmaps, setSavedRoadmaps] = useState<
    Array<{ id: string; role: string; date: string; data: RoadmapData }>
  >(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("saved_career_roadmaps");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [form, setForm] = useState(() => {
    let initialSkills = "React, TypeScript, Python, SQL, Supabase, Tailwind CSS, REST APIs, Git";
    if (typeof window !== "undefined") {
      try {
        const savedResume = localStorage.getItem("resume_builder_form");
        if (savedResume) {
          const parsed = JSON.parse(savedResume);
          if (parsed.skills) initialSkills = parsed.skills;
        }
      } catch {}
    }
    return {
      currentRole: "AI Software Engineer / Developer",
      targetRole: "Senior Full-Stack Engineer & AI Architect",
      skills: initialSkills,
      experience: "Full Stack Development & Data Reconciliation at Rootbridge",
      education: "B.Tech / BCA in Computer Science",
      timeline: "12 months",
      learningStyle: "self-paced",
    };
  });

  const [activeSkills, setActiveSkills] = useState<string[]>(() => {
    return form.skills.split(/[,|]/).map((s) => s.trim()).filter(Boolean);
  });

  const toggleSkill = (skill: string) => {
    setActiveSkills((prev) => {
      const exists = prev.includes(skill);
      const next = exists ? prev.filter((s) => s !== skill) : [...prev, skill];
      setForm((f) => ({ ...f, skills: next.join(", ") }));
      return next;
    });
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSaveRoadmap = () => {
    if (!roadmapData) return;
    const newEntry = {
      id: `rm-${Date.now()}`,
      role: roadmapData.title || form.targetRole || "Career Roadmap",
      date: new Date().toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      data: roadmapData,
    };
    const updated = [newEntry, ...savedRoadmaps.filter((r) => r.role !== newEntry.role)];
    setSavedRoadmaps(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("saved_career_roadmaps", JSON.stringify(updated));
    }
    toast.success("Roadmap saved to your profile!");
  };

  const handleLoadSaved = (saved: {
    id: string;
    role: string;
    date: string;
    data: RoadmapData;
  }) => {
    setRoadmapData(saved.data);
    setRawContent(null);
    setTab("roadmap");
    toast.info(`Loaded saved roadmap: ${saved.role}`);
  };

  const handleGenerate = async () => {
    if (!form.targetRole.trim()) return toast.error("Enter your target role");
    if (!form.skills.trim()) return toast.error("Enter your current skills");

    loadingTrue();
  };

  const loadingTrue = async () => {
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

  const mainContent = (
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
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="form">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Your Profile
          </TabsTrigger>
          <TabsTrigger value="catalog">
            <BookOpen className="h-3.5 w-3.5 mr-1.5 text-blue-500" /> 91 Developer Roadmaps
          </TabsTrigger>
          <TabsTrigger value="gap">
            <Target className="h-3.5 w-3.5 mr-1.5 text-indigo-500" /> Skill Gap Analysis
          </TabsTrigger>
          <TabsTrigger value="roadmap" disabled={!roadmapData && !rawContent}>
            <Map className="h-3.5 w-3.5 mr-1.5" /> Your Roadmap
          </TabsTrigger>
          {savedRoadmaps.length > 0 && (
            <TabsTrigger value="saved">
              <Bookmark className="h-3.5 w-3.5 mr-1.5 text-amber-500" /> Saved (
              {savedRoadmaps.length})
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="catalog" className="pt-4 space-y-6">
          <DeveloperRoadmapsCatalog onSelectTrack={(name) => {
            setForm((f) => ({ ...f, targetRole: name }));
            setTab("form");
            toast.success(`Target role set to ${name}! Click Generate Roadmap.`);
          }} />
        </TabsContent>

        <TabsContent value="gap" className="pt-4 space-y-6 max-w-4xl">
          <Card className="p-6 rounded-2xl border shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3 border-b pb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">Interactive Skill Gap Matrix</h3>
                <p className="text-xs text-muted-foreground">
                  Select target role, toggle skills — matched to your courses & interests.
                </p>
              </div>
              <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-black">
                {Math.round((activeSkills.length / 12) * 100)}% Role Readiness
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Your Skills (Click to Toggle / Add to Profile)
              </Label>
              <div className="flex flex-wrap gap-2">
                {[
                  "React",
                  "TypeScript",
                  "Python",
                  "Node.js",
                  "SQL",
                  "PostgreSQL",
                  "Supabase",
                  "AWS",
                  "Docker",
                  "REST APIs",
                  "Microservices",
                  "System Design",
                  "CI/CD",
                  "Git",
                  "Salesforce CRM",
                  "Generative AI",
                  "Tailwind CSS",
                  "GraphQL",
                  "Redis",
                ].map((skill) => {
                  const has = activeSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        has
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          : "bg-muted text-muted-foreground hover:bg-muted/80 border border-transparent"
                      }`}
                    >
                      {has ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3 w-3" />}
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Recommended Learnify AI Courses to Bridge Missing Gaps
              </Label>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { name: "Full Stack AI Engineer", cat: "AI & Development", match: "98%" },
                  { name: "Data Science & ML Bootcamp", cat: "Data & Analytics", match: "95%" },
                  { name: "System Design Mastery", cat: "Architecture", match: "91%" },
                  { name: "DSA & Competitive Programming", cat: "Core CS", match: "88%" },
                  { name: "React + Next.js Pro", cat: "Frontend", match: "85%" },
                  { name: "Cloud & DevOps with AWS", cat: "Infrastructure", match: "82%" },
                ].map((c) => (
                  <div key={c.name} className="p-3.5 rounded-xl border bg-card space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-500">{c.cat} · {c.match} Match</span>
                      <p className="text-xs font-bold text-foreground mt-0.5">{c.name}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full h-7 text-[11px] font-bold text-primary hover:bg-primary/5 cursor-pointer"
                      onClick={() => toast.success(`Enrolled in ${c.name}!`)}
                    >
                      + Enroll Course
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

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
                <Select value={form.timeline} onValueChange={(v) => update("timeline", v)}>
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
                <Button
                  onClick={handleSaveRoadmap}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  <Bookmark className="h-4 w-4 mr-1.5" /> Save to Profile
                </Button>
                <Button onClick={handleDownload} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1.5" /> Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      roadmapData ? JSON.stringify(roadmapData, null, 2) : rawContent || "",
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
        <TabsContent value="saved" className="pt-4">
          <div className="space-y-4 max-w-3xl">
            <h3 className="text-lg font-bold">Saved Roadmaps</h3>
            <div className="grid gap-3">
              {savedRoadmaps.map((item) => (
                <Card
                  key={item.id}
                  className="p-4 flex items-center justify-between border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div>
                    <h4 className="font-bold text-base">{item.role}</h4>
                    <p className="text-xs text-muted-foreground">
                      Saved on {item.date} • {item.data.phases?.length || 0} Phases
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleLoadSaved(item)}
                      size="sm"
                      className="text-xs font-bold"
                    >
                      View Roadmap
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const filtered = savedRoadmaps.filter((r) => r.id !== item.id);
                        setSavedRoadmaps(filtered);
                        localStorage.setItem("saved_career_roadmaps", JSON.stringify(filtered));
                        toast.success("Removed saved roadmap");
                      }}
                      className="text-xs text-destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  if (embedded) return mainContent;
  return <AppShell>{mainContent}</AppShell>;
}

function StructuredRoadmap({ data }: { data: RoadmapData }) {
  const safeSkillGap = data.skill_gap || [];
  const safeCurrentSkills = data.current_skills || [];
  const safeTargetSkills = data.target_skills || [];
  const safePhases = data.phases || [];
  const safeMonthlyMilestones = data.monthly_milestones || [];

  const gapChartData = safeSkillGap.map((s) => ({
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
            {safeTargetSkills.length} target skills
          </span>
          <span className="flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4" />
            {safeSkillGap.length} gaps identified
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
              {safeCurrentSkills.map((s) => (
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
              {safeTargetSkills.map((s) => (
                <SkillBadge key={s} skill={s} variant="default" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {safeSkillGap.length > 0 && (
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
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(v: number) => (v === 3 ? "High" : v === 2 ? "Medium" : "Low")}
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
              {safeSkillGap.map((gap) => (
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
            {safePhases.map((phase, i) => {
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
                      {(phase.skills || []).length > 0 && (
                        <div className="rounded-lg border p-3 space-y-2 bg-card">
                          <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                            <Code className="h-3.5 w-3.5" /> Skills
                          </h5>
                          {(phase.skills || []).map((s) => (
                            <div key={s.name} className="space-y-1">
                              <SkillBadge skill={s.name} size="md" variant="default" />
                              {(s.topics || []).length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1 pl-1">
                                  {(s.topics || []).map((t) => (
                                    <SkillBadge key={t} skill={t} variant="outline" size="sm" />
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {(phase.courses || []).length > 0 && (
                        <div className="rounded-lg border p-3 space-y-2 bg-card">
                          <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5" /> Courses
                          </h5>
                          {(phase.courses || []).map((c, j) => (
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
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                  >
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

                      {(phase.projects || []).length > 0 && (
                        <div className="rounded-lg border p-3 space-y-2 bg-card">
                          <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                            <FolderGit2 className="h-3.5 w-3.5" /> Projects
                          </h5>
                          {(phase.projects || []).map((p, j) => (
                            <div key={j} className="text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{p.title}</span>
                                <DifficultyBadge difficulty={p.difficulty} />
                              </div>
                              <p className="text-xs text-muted-foreground">{p.description}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {(p.tech_stack || []).map((t) => (
                                  <SkillBadge key={t} skill={t} variant="outline" size="sm" />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {(phase.milestones || []).length > 0 && (
                        <div className="rounded-lg border p-3 space-y-2 bg-card">
                          <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                            <Milestone className="h-3.5 w-3.5" /> Milestones
                          </h5>
                          <ul className="space-y-1">
                            {(phase.milestones || []).map((m, j) => (
                              <li key={j} className="text-sm flex items-start gap-2">
                                <Circle
                                  className="h-2 w-2 mt-1.5 shrink-0"
                                  style={{ fill: color }}
                                />
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

      {safeMonthlyMilestones.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Milestone className="h-4 w-4 text-purple-500" /> Monthly Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {safeMonthlyMilestones.map((m) => (
                <div key={m.month} className="p-2.5 rounded-lg border bg-card text-sm">
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
            {(data.interview_prep.topics || []).length > 0 && (
              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  Key Topics
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {(data.interview_prep.topics || []).map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {(data.interview_prep.platforms || []).length > 0 && (
              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  Practice Platforms
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {(data.interview_prep.platforms || []).map((p) => (
                    <Badge key={p} variant="outline" className="text-xs">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {(data.interview_prep.questions || []).length > 0 && (
              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  Common Questions
                </h5>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {(data.interview_prep.questions || []).map((q, i) => (
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

function DeveloperRoadmapsCatalog({ onSelectTrack }: { onSelectTrack: (name: string) => void }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(DEVELOPER_ROADMAPS.map((r) => r.category))).sort()];

  const filtered = DEVELOPER_ROADMAPS.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || r.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            91 Curated Developer Roadmaps (roadmap.sh)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Step-by-step technical learning paths across AI, Web, Systems, DevOps, Security & CS.
          </p>
        </div>
        <div className="relative min-w-[260px]">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 91 roadmaps…"
            className="pl-9 text-xs"
          />
          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Roadmaps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className="group relative flex flex-col justify-between p-4 rounded-xl border transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-[10px] font-mono">
                  {item.moduleCount} modules
                </Badge>
                {item.featured && (
                  <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px]">
                    ★ Popular
                  </Badge>
                )}
              </div>
              <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                {item.name}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t flex items-center justify-between">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                {item.category}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onSelectTrack(item.name)}
                className="text-xs text-primary hover:text-primary hover:bg-primary/10 h-7 px-2"
              >
                Set Target Role →
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No roadmaps match your search.
        </div>
      )}
    </div>
  );
}
