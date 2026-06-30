import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FolderOpen, Loader2, Sparkles, Download, Check, ChevronRight, Upload, ImagePlus, Github, ExternalLink, AlertCircle } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { generatePortfolio, extractResumeFields } from "@/lib/resume.functions";
import { ResumeFileUpload } from "@/components/ResumeFileUpload";

export const Route = createFileRoute("/_authenticated/portfolio-builder")({
  head: () => ({ meta: [{ title: "Portfolio Builder — Learnify AI" }] }),
  component: PortfolioBuilderPage,
});

const STYLES = [
  { value: "developer", label: "Developer" },
  { value: "designer", label: "Designer" },
  { value: "minimal", label: "Minimal" },
  { value: "creative", label: "Creative" },
];

type ProjectEntry = {
  name: string;
  description: string;
  techStack: string;
  githubUrl: string;
};

function PortfolioBuilderPage() {
  const generateFn = useServerFn(generatePortfolio);
  const extractFn = useServerFn(extractResumeFields);
  const [tab, setTab] = useState("form");
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: "",
    tagline: "",
    bio: "",
    skills: "",
    projects: "",
    socialLinks: "",
    experience: "",
    education: "",
    style: "developer",
  });

  const [projects, setProjects] = useState<ProjectEntry[]>([]);

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleFileExtracted = async (text: string) => {
    setExtracting(true);
    try {
      const fields = await extractFn({ data: { rawText: text } });
      setForm((f) => ({
        ...f,
        fullName: fields.fullName || f.fullName,
        bio: fields.summary || fields.bio || f.bio,
        tagline: fields.targetRole ? `${fields.targetRole}` : f.tagline,
        socialLinks: fields.linkedin
          ? [...new Set([`https://${fields.linkedin.replace(/^https?:\/\//, '')}`, ...f.socialLinks.split('\n').filter(Boolean)])].join('\n')
          : f.socialLinks,
        skills: fields.skills || f.skills,
        experience: fields.experience || f.experience,
        education: fields.education || f.education,
        projects: fields.projects || f.projects,
      }));

      if (fields.projects) {
        const projectLines = fields.projects.split('\n');
        const parsedProjects: ProjectEntry[] = projectLines.map((line: string) => {
          const match = line.match(/([^()]+)\(([^)]+)\):?\s*(.*)/);
          if (match) {
            return {
              name: match[1].trim(),
              githubUrl: match[2].trim(),
              description: match[3]?.trim() || "",
              techStack: ""
            };
          }
          return { name: line.trim(), description: "", techStack: "", githubUrl: "" };
        }).filter((p: ProjectEntry) => p.name);
        setProjects(parsedProjects);
      }

      toast.success("Profile auto-filled from uploaded resume!");
    } catch (err: any) {
      toast.error(err.message || "Failed to parse resume");
    } finally {
      setExtracting(false);
    }
  };

  const addProject = () => {
    setProjects((p) => [...p, { name: "", description: "", techStack: "", githubUrl: "" }]);
  };

  const updateProject = (idx: number, field: keyof ProjectEntry, value: string) => {
    setProjects((p) => p.map((proj, i) => (i === idx ? { ...proj, [field]: value } : proj)));
  };

  const removeProject = (idx: number) => {
    setProjects((p) => p.filter((_, i) => i !== idx));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please select an image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image too large. Max 5MB.");
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    toast.success("Photo uploaded!");
  };

  const projectsText = projects
    .filter((p) => p.name)
    .map(
      (p) =>
        `${p.name}${p.githubUrl ? ` (${p.githubUrl})` : ""}: ${p.description} [${p.techStack}]`,
    )
    .join("\n");

  const fullProjectsValue = [form.projects, projectsText].filter(Boolean).join("\n");

  const handleGenerate = async () => {
    if (!form.fullName.trim()) return toast.error("Enter your full name");
    if (!form.skills.trim()) return toast.error("Enter your skills");

    const portfolioForm = { ...form, projects: fullProjectsValue };
    setLoading(true);
    try {
      const res = await generateFn({ data: portfolioForm });
      setResult(res.content);
      setTab("preview");
      toast.success("Portfolio plan generated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate portfolio");
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
    a.download = `${form.fullName.replace(/\s+/g, "_")}_Portfolio.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Portfolio plan downloaded!");
  };

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 max-w-7xl">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-medium flex items-center gap-1.5">
              <FolderOpen className="h-3.5 w-3.5" /> Career Tools
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-display font-semibold tracking-tight">
              Portfolio Builder
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Generate a professional portfolio plan with structure, content, and design recommendations.
            </p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="mt-2">
          <TabsList>
            <TabsTrigger value="form">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Build Portfolio
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!result}>
              <FolderOpen className="h-3.5 w-3.5 mr-1.5" /> Plan
            </TabsTrigger>
            <TabsTrigger value="live" disabled={!form.fullName}>
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Live Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="pt-4 space-y-6 max-w-3xl">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Upload className="h-4 w-4 text-primary" />
                Upload resume to auto-fill (optional)
                {extracting && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                )}
              </div>
              <ResumeFileUpload onTextExtracted={handleFileExtracted} />
              {extracting && (
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Extracting info from your resume...
                </div>
              )}
            </div>

            {/* Photo upload */}
            <Card>
              <CardContent className="p-4 sm:p-5 space-y-3">
                <Label>Profile Photo</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 rounded-full border-2 border-border">
                    {photoPreview ? (
                      <AvatarImage src={photoPreview} alt="Profile" />
                    ) : (
                      <AvatarFallback className="text-lg bg-muted">
                        {form.fullName ? form.fullName.charAt(0).toUpperCase() : "?"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <Button variant="outline" size="sm" onClick={() => photoInputRef.current?.click()}>
                      <ImagePlus className="h-4 w-4 mr-1.5" />
                      {photoPreview ? "Change Photo" : "Upload Photo"}
                    </Button>
                    <p className="text-[10px] text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    placeholder="Jane Doe"
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input
                    placeholder="Full-Stack Developer | UI/UX Enthusiast"
                    value={form.tagline}
                    onChange={(e) => update("tagline", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bio / About Me</Label>
                <Textarea
                  rows={3}
                  placeholder="Tell visitors about yourself, your passion, and what you do"
                  value={form.bio}
                  onChange={(e) => update("bio", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Skills *</Label>
                <Textarea
                  rows={3}
                  placeholder="List all technical skills, frameworks, tools, and soft skills"
                  value={form.skills}
                  onChange={(e) => update("skills", e.target.value)}
                />
              </div>

              {/* Projects with GitHub links */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Projects</Label>
                  <Button variant="outline" size="sm" onClick={addProject}>
                    <Github className="h-3.5 w-3.5 mr-1.5" /> Add Project
                  </Button>
                </div>
                {projects.map((proj, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-3 sm:p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">Project {idx + 1}</span>
                        <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive" onClick={() => removeProject(idx)}>Remove</Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Input
                          placeholder="Project name"
                          value={proj.name}
                          onChange={(e) => updateProject(idx, "name", e.target.value)}
                        />
                        <Input
                          placeholder="GitHub URL"
                          value={proj.githubUrl}
                          onChange={(e) => updateProject(idx, "githubUrl", e.target.value)}
                        />
                      </div>
                      <Textarea
                        rows={2}
                        placeholder="Brief description"
                        value={proj.description}
                        onChange={(e) => updateProject(idx, "description", e.target.value)}
                      />
                      <Input
                        placeholder="Tech stack (e.g. React, Node.js, PostgreSQL)"
                        value={proj.techStack}
                        onChange={(e) => updateProject(idx, "techStack", e.target.value)}
                      />
                    </CardContent>
                  </Card>
                ))}
                <Textarea
                  rows={3}
                  placeholder="Or paste projects as free text: name, description, tech stack, links..."
                  value={form.projects}
                  onChange={(e) => update("projects", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Social Links</Label>
                  <Textarea
                    rows={2}
                    placeholder="GitHub, LinkedIn, Twitter, Dribbble URLs..."
                    value={form.socialLinks}
                    onChange={(e) => update("socialLinks", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Work Experience</Label>
                  <Textarea
                    rows={2}
                    placeholder="Company, role, duration, key achievements"
                    value={form.experience}
                    onChange={(e) => update("experience", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Education</Label>
                  <Input
                    placeholder="Degree, University, Year"
                    value={form.education}
                    onChange={(e) => update("education", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Portfolio Style</Label>
                  <Select
                    value={form.style}
                    onValueChange={(v) => update("style", v)}
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
              {loading ? "Generating..." : "Generate Portfolio Plan"}
            </Button>
          </TabsContent>

          <TabsContent value="preview" className="pt-4">
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

          <TabsContent value="live" className="pt-4">
            <div className="max-w-4xl mx-auto border rounded-2xl overflow-hidden shadow-lg">
              <div className="h-10 bg-muted border-b flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-muted-foreground ml-2 font-mono">portfolio-preview</span>
              </div>
              <div className="bg-gradient-to-br from-background to-muted/30 p-6 sm:p-10">
                {/* Hero */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
                  <Avatar className="h-24 w-24 rounded-full ring-4 ring-primary/20">
                    {photoPreview ? (
                      <AvatarImage src={photoPreview} alt={form.fullName} />
                    ) : (
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {form.fullName?.charAt(0)?.toUpperCase() || "?"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold">{form.fullName || "Your Name"}</h2>
                    <p className="text-muted-foreground">{form.tagline || "Your Tagline"}</p>
                    {form.bio && (
                      <p className="text-sm text-muted-foreground/80 mt-2 max-w-lg">{form.bio}</p>
                    )}
                    {form.socialLinks && (
                      <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
                        {form.socialLinks.split("\n").filter(Boolean).slice(0, 3).map((link, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] gap-1">
                            <ExternalLink className="h-3 w-3" />
                            {link.replace(/https?:\/\//, "").split("/")[0]}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills */}
                {form.skills && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {form.skills.split(",").map((s, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {s.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {projects.filter((p) => p.name).length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Projects</h3>
                    <div className="grid gap-3">
                      {projects.filter((p) => p.name).map((p, i) => (
                        <Card key={i}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-semibold">{p.name}</h4>
                                {p.description && <p className="text-sm text-muted-foreground mt-1">{p.description}</p>}
                                {p.techStack && (
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    {p.techStack.split(",").map((t) => (
                                      <Badge key={t.trim()} variant="outline" className="text-[10px]">{t.trim()}</Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {p.githubUrl && (
                                <a href={p.githubUrl} target="_blank" rel="noopener noreferrer">
                                  <Github className="h-5 w-5 text-muted-foreground hover:text-foreground transition" />
                                </a>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {form.experience && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Experience</h3>
                    <p className="text-sm whitespace-pre-wrap">{form.experience}</p>
                  </div>
                )}

                {/* Education */}
                {form.education && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Education</h3>
                    <p className="text-sm">{form.education}</p>
                  </div>
                )}

                {!form.fullName && (
                  <div className="text-center py-12 text-muted-foreground">
                    <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Fill in the form and generate a plan to see your live preview.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
