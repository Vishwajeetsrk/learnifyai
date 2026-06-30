import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Map, Loader2, Sparkles, Download, Check, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
import { toast } from "sonner";
import { generateCareerRoadmap } from "@/lib/resume.functions";

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

function CareerRoadmapPage() {
  const generateFn = useServerFn(generateCareerRoadmap);
  const [tab, setTab] = useState("form");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

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
      setResult(res.content);
      setTab("roadmap");
      toast.success("Career roadmap generated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Career_Roadmap_${form.targetRole.replace(/\s+/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
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
            <TabsTrigger value="roadmap" disabled={!result}>
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
            {result && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Button onClick={handleDownload} size="sm">
                    <Download className="h-4 w-4 mr-1.5" /> Download
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(result);
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
                <div className="border rounded-xl p-6 bg-card prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {result}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
