import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Loader2, Sparkles, Download, Check, ChevronRight, Upload } from "lucide-react";
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
import { generateResume, extractResumeFields } from "@/lib/resume.functions";
import { ResumeFileUpload } from "@/components/ResumeFileUpload";

export const Route = createFileRoute("/_authenticated/resume-builder")({
  head: () => ({ meta: [{ title: "Resume Builder — Learnify AI" }] }),
  component: ResumeBuilderPage,
});

const TEMPLATES = [
  { value: "modern", label: "Modern" },
  { value: "classic", label: "Classic" },
  { value: "minimal", label: "Minimal" },
  { value: "executive", label: "Executive" },
];

function ResumeBuilderPage() {
  const generateFn = useServerFn(generateResume);
  const extractFn = useServerFn(extractResumeFields);
  const [tab, setTab] = useState("form");
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
    certifications: "",
    projects: "",
    targetRole: "",
    template: "modern",
  });

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleFileExtracted = async (text: string) => {
    setExtracting(true);
    try {
      const fields = await extractFn({ data: { rawText: text } });
      setForm((f) => ({
        ...f,
        fullName: fields.fullName || f.fullName,
        email: fields.email || f.email,
        phone: fields.phone || f.phone,
        linkedin: fields.linkedin || f.linkedin,
        summary: fields.summary || f.summary,
        experience: fields.experience || f.experience,
        education: fields.education || f.education,
        skills: fields.skills || f.skills,
        certifications: fields.certifications || f.certifications,
        projects: fields.projects || f.projects,
      }));
      toast.success("Fields auto-filled from uploaded resume!");
    } catch (err: any) {
      toast.error(err.message || "Failed to parse resume");
    } finally {
      setExtracting(false);
    }
  };

  const handleGenerate = async () => {
    if (!form.fullName.trim()) return toast.error("Enter your full name");
    if (!form.email.trim()) return toast.error("Enter your email");
    if (!form.targetRole.trim()) return toast.error("Enter your target role");
    if (!form.skills.trim()) return toast.error("Enter your skills");
    if (!form.experience.trim()) return toast.error("Enter your experience");

    setLoading(true);
    try {
      const res = await generateFn({ data: form });
      setResult(res.content);
      setTab("preview");
      toast.success("Resume generated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate resume");
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
    a.download = `${form.fullName.replace(/\s+/g, "_")}_Resume.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Resume downloaded!");
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard!");
  };

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 max-w-7xl">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-medium flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" /> Career Tools
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-display font-semibold tracking-tight">
              Resume Builder
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Generate ATS-optimized professional resumes with AI.
            </p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="mt-2">
          <TabsList>
            <TabsTrigger value="form">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Build Resume
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!result}>
              <FileText className="h-3.5 w-3.5 mr-1.5" /> Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="pt-4 space-y-6">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Upload className="h-4 w-4 text-primary" />
                Upload existing resume to auto-fill the form
              </div>
              <ResumeFileUpload onTextExtracted={handleFileExtracted} />
              {extracting && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Extracting information from your resume...
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    placeholder="John Doe"
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      placeholder="+1 555-0123"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn URL</Label>
                  <Input
                    placeholder="https://linkedin.com/in/johndoe"
                    value={form.linkedin}
                    onChange={(e) => update("linkedin", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Target Role *</Label>
                  <Input
                    placeholder="Senior Frontend Engineer"
                    value={form.targetRole}
                    onChange={(e) => update("targetRole", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Professional Summary</Label>
                  <Textarea
                    rows={3}
                    placeholder="Brief professional summary (optional)"
                    value={form.summary}
                    onChange={(e) => update("summary", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Skills *</Label>
                  <Textarea
                    rows={3}
                    placeholder="JavaScript, React, Node.js, TypeScript, AWS, Python, SQL..."
                    value={form.skills}
                    onChange={(e) => update("skills", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Work Experience *</Label>
                  <Textarea
                    rows={4}
                    placeholder="Company, role, dates, and key achievements with metrics..."
                    value={form.experience}
                    onChange={(e) => update("experience", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Education</Label>
                  <Textarea
                    rows={2}
                    placeholder="Degree, university, year — one per line"
                    value={form.education}
                    onChange={(e) => update("education", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Certifications</Label>
                    <Textarea
                      rows={2}
                      placeholder="AWS Certified, Google Cloud..."
                      value={form.certifications}
                      onChange={(e) => update("certifications", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Projects</Label>
                    <Textarea
                      rows={2}
                      placeholder="Key projects with tech stacks"
                      value={form.projects}
                      onChange={(e) => update("projects", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Template Style</Label>
                  <Select
                    value={form.template}
                    onValueChange={(v) => update("template", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TEMPLATES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
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
              {loading ? "Generating..." : "Generate Resume"}
            </Button>
          </TabsContent>

          <TabsContent value="preview" className="pt-4">
            {result && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Button onClick={handleDownload} size="sm">
                    <Download className="h-4 w-4 mr-1.5" /> Download .md
                  </Button>
                  <Button variant="outline" onClick={copyToClipboard} size="sm">
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
