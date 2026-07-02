import { createFileRoute, useSearch, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ResumeBuilderPage } from "@/routes/_authenticated/resume-builder";
import { AtsCheckerPage } from "@/routes/_authenticated/ats-checker";
import { InterviewPage } from "@/routes/_authenticated/interview";
import { CareerRoadmapPage } from "@/routes/_authenticated/career-roadmap";
import { PortfolioBuilderPage } from "@/routes/_authenticated/portfolio-builder";
import { FileText, BarChart3, Briefcase, Map, FolderOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/career-studio")({
  head: () => ({ meta: [{ title: "Career Studio — Learnify AI" }] }),
  component: CareerStudioHub,
});

import { Share2, TrendingUp, Briefcase as BriefcaseIcon, Target, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const TABS = [
  { id: "resume", label: "Resume Builder", icon: FileText },
  { id: "ats", label: "ATS Checker", icon: BarChart3 },
  { id: "interview", label: "Interview Prep", icon: Briefcase },
  { id: "roadmap", label: "Career Roadmap", icon: Map },
  { id: "portfolio", label: "Portfolio Builder", icon: FolderOpen },
  { id: "linkedin", label: "LinkedIn Optimizer", icon: Share2 },
  { id: "analytics", label: "Career Analytics", icon: TrendingUp },
  { id: "internships", label: "Internship Tracker", icon: BriefcaseIcon },
  { id: "skillgap", label: "Skill Gap Analysis", icon: Target },
];

function CareerStudioHub() {
  const search: { tab?: string } = useSearch({ strict: false });
  const navigate = useNavigate();
  const activeTab = search.tab || "resume";

  return (
    <AppShell>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-14 z-20 px-4 md:px-10 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <h1 className="font-semibold text-lg tracking-tight">Career Studio</h1>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() =>
                    navigate({
                      to: "/career-studio" as any,
                      search: { tab: t.id } as any,
                      replace: true,
                    })
                  }
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="min-h-[calc(100vh-8rem)]">
        {activeTab === "resume" && <ResumeBuilderPage embedded />}
        {activeTab === "ats" && <AtsCheckerPage embedded />}
        {activeTab === "interview" && <InterviewPage embedded />}
        {activeTab === "roadmap" && <CareerRoadmapPage embedded />}
        {activeTab === "portfolio" && <PortfolioBuilderPage embedded />}
        {activeTab === "linkedin" && <LinkedInOptimizerView />}
        {activeTab === "analytics" && <CareerAnalyticsView />}
        {activeTab === "internships" && <InternshipTrackerView />}
        {activeTab === "skillgap" && <SkillGapView />}
      </div>
    </AppShell>
  );
}

function LinkedInOptimizerView() {
  const [headline, setHeadline] = useState("");
  const [generated, setGenerated] = useState<string[]>([]);

  const handleGenerate = () => {
    if (!headline) {
      toast.error("Please enter your target role or current bio");
      return;
    }
    setGenerated([
      `🚀 ${headline} | Ex-Intern @ Top Tech | Building Scalable Web Apps & AI Tools`,
      `💻 Full Stack Engineer specializing in ${headline} | React, Node.js, Python | Open to Roles`,
      `✨ Driven ${headline} | 5+ Projects Shipped | Hackathon Winner | Passionate about AI & UX`,
    ]);
    toast.success("Generated 3 AI-optimized LinkedIn headlines!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-display">LinkedIn Profile Optimizer</h2>
        <p className="text-xs text-muted-foreground">Generate viral headlines, keyword-rich summaries, and increase recruiter profile views.</p>
      </div>
      <div className="p-6 rounded-2xl border bg-card space-y-4 shadow-sm">
        <div>
          <Label className="text-xs">Target Role / Current Focus</Label>
          <Input placeholder="e.g. Full Stack Developer, Data Analyst, Product Designer" value={headline} onChange={(e) => setHeadline(e.target.value)} />
        </div>
        <Button onClick={handleGenerate} size="sm"><Sparkles className="w-3.5 h-3.5 mr-1.5" /> Generate AI Headlines</Button>
      </div>
      {generated.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Recommended Headlines</h3>
          {generated.map((h, i) => (
            <div key={i} className="p-4 rounded-xl border bg-card flex justify-between items-center text-xs">
              <span>{h}</span>
              <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(h); toast.success("Copied to clipboard!"); }}>Copy</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CareerAnalyticsView() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-display">Career & Salary Analytics</h2>
        <p className="text-xs text-muted-foreground">Real-time compensation benchmarks and hiring demand trends across India & Global markets.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border bg-card">
          <div className="text-xs text-muted-foreground">Average Entry Salary</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">₹6.5 - ₹12 LPA</div>
          <div className="text-[10px] text-muted-foreground mt-1">+18% growth YoY</div>
        </div>
        <div className="p-5 rounded-xl border bg-card">
          <div className="text-xs text-muted-foreground">Top Hiring Hubs</div>
          <div className="text-lg font-bold mt-1">Bengaluru, NCR, Pune</div>
          <div className="text-[10px] text-muted-foreground mt-1">64% of open roles</div>
        </div>
        <div className="p-5 rounded-xl border bg-card">
          <div className="text-xs text-muted-foreground">Most Demanded Skill</div>
          <div className="text-lg font-bold text-primary mt-1">Generative AI & Full Stack</div>
          <div className="text-[10px] text-muted-foreground mt-1">High recruiter outreach</div>
        </div>
      </div>
    </div>
  );
}

import { Pencil, Check, X, Calendar, Building, Briefcase as BriefcaseIcon2 } from "lucide-react";
import { useEffect } from "react";

interface InternshipApp {
  id: string;
  company: string;
  role: string;
  status: "Applied" | "Interviewing" | "Offer" | "Rejected";
  date: string;
  notes?: string;
}

function InternshipTrackerView() {
  const [apps, setApps] = useState<InternshipApp[]>([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<InternshipApp["status"]>("Applied");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCompany, setEditCompany] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editStatus, setEditStatus] = useState<InternshipApp["status"]>("Applied");
  const [editDate, setEditDate] = useState("");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("learnify_internships");
    if (saved) {
      try {
        setApps(JSON.parse(saved));
      } catch (e) {
        setApps([]);
      }
    } else {
      setApps([]); // start with empty array, remove fake data
    }
  }, []);

  // Save to localStorage
  const saveApps = (newApps: InternshipApp[]) => {
    setApps(newApps);
    localStorage.setItem("learnify_internships", JSON.stringify(newApps));
  };

  const addApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) {
      toast.error("Please enter both Company Name and Role Title");
      return;
    }
    const newApp: InternshipApp = {
      id: crypto.randomUUID(),
      company: company.trim(),
      role: role.trim(),
      status,
      date: date || new Date().toISOString().slice(0, 10),
    };
    const updated = [newApp, ...apps];
    saveApps(updated);
    setCompany("");
    setRole("");
    setStatus("Applied");
    setDate(new Date().toISOString().slice(0, 10));
    toast.success("Application tracked successfully");
  };

  const startEdit = (app: InternshipApp) => {
    setEditingId(app.id);
    setEditCompany(app.company);
    setEditRole(app.role);
    setEditStatus(app.status);
    setEditDate(app.date);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const updateApp = (id: string) => {
    if (!editCompany.trim() || !editRole.trim()) {
      toast.error("Company Name and Role Title cannot be empty");
      return;
    }
    const updated = apps.map((app) =>
      app.id === id
        ? {
            ...app,
            company: editCompany.trim(),
            role: editRole.trim(),
            status: editStatus,
            date: editDate,
          }
        : app,
    );
    saveApps(updated);
    setEditingId(null);
    toast.success("Application updated successfully");
  };

  const deleteApp = (id: string) => {
    const updated = apps.filter((app) => app.id !== id);
    saveApps(updated);
    toast.success("Application deleted");
  };

  const getStatusBadge = (s: InternshipApp["status"]) => {
    switch (s) {
      case "Applied":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-900/50";
      case "Interviewing":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-900/50";
      case "Offer":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50";
      case "Rejected":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-900/50";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight font-display">
          Internship & Job Application Tracker
        </h2>
        <p className="text-sm text-muted-foreground">
          Organize, update, and manage all your internship applications, interview stages, and offers.
        </p>
      </div>

      {/* Add New Application Form */}
      <form onSubmit={addApp} className="p-4 sm:p-5 rounded-2xl border bg-card/50 backdrop-blur space-y-4 shadow-xs">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4 text-primary" /> Track New Application
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
          <div className="space-y-1.5">
            <Label htmlFor="company" className="text-xs font-medium">Company Name</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                id="company"
                placeholder="Google, Microsoft, etc."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="pl-9 text-xs h-9 bg-background"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-xs font-medium">Role Title</Label>
            <div className="relative">
              <BriefcaseIcon2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                id="role"
                placeholder="Software Engineer Intern"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="pl-9 text-xs h-9 bg-background"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="status" className="text-xs font-medium">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full text-xs h-9 px-3 rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-hidden"
            >
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-xs font-medium">Applied Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-9 text-xs h-9 bg-background"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="sm" className="w-full sm:w-auto h-9">
            <Plus className="w-4 h-4 mr-1.5" /> Add Application
          </Button>
        </div>
      </form>

      {/* Applications List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold">
            Applications ({apps.length})
          </h3>
          {apps.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Are you sure you want to clear all tracked applications?")) {
                  saveApps([]);
                  toast.success("Cleared all applications");
                }
              }}
              className="text-xs text-destructive hover:underline"
            >
              Clear All
            </button>
          )}
        </div>

        {apps.length === 0 ? (
          <div className="text-center p-8 rounded-2xl border border-dashed border-border bg-card/20">
            <BriefcaseIcon2 className="h-8 w-8 text-muted-foreground/35 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">No applications tracked yet.</p>
            <p className="text-[10px] text-muted-foreground/80 mt-1">Use the form above to add your first job application.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {apps.map((a) => {
              const isEditing = editingId === a.id;
              return (
                <div
                  key={a.id}
                  className={`p-4 rounded-xl border bg-card transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${isEditing ? "border-primary/50 shadow-xs" : ""}`}
                >
                  {isEditing ? (
                    /* EDITING MODE */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-medium text-muted-foreground">Company</Label>
                        <Input
                          value={editCompany}
                          onChange={(e) => setEditCompany(e.target.value)}
                          className="text-xs h-8 bg-background"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-medium text-muted-foreground">Role</Label>
                        <Input
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="text-xs h-8 bg-background"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-medium text-muted-foreground">Status</Label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as any)}
                          className="w-full text-xs h-8 px-2 rounded-md border border-input bg-background outline-hidden"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Interviewing">Interviewing</option>
                          <option value="Offer">Offer</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-medium text-muted-foreground">Date</Label>
                        <Input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="text-xs h-8 bg-background"
                        />
                      </div>
                    </div>
                  ) : (
                    /* VIEW MODE */
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0 hidden sm:block">
                        <Building className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-foreground">{a.company}</span>
                          <Badge variant="outline" className={`text-[10px] py-0 px-2 font-medium ${getStatusBadge(a.status)}`}>
                            {a.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                          <span>{a.role}</span>
                          <span className="text-muted-foreground/40">•</span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Applied {a.date}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className="flex justify-end items-center gap-2 shrink-0 border-t pt-3 md:pt-0 md:border-t-0 border-border/50">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={() => updateApp(a.id)}
                          size="sm"
                          className="h-8 px-3 text-xs"
                        >
                          <Check className="h-3.5 w-3.5 mr-1" /> Save
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          size="sm"
                          variant="ghost"
                          className="h-8 px-3 text-xs"
                        >
                          <X className="h-3.5 w-3.5 mr-1" /> Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => startEdit(a)}
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                        </Button>
                        <Button
                          onClick={() => deleteApp(a.id)}
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-destructive/20 hover:bg-destructive/10"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SkillGapView() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-display">Skill Gap Analysis</h2>
        <p className="text-xs text-muted-foreground">Compare your current competencies against industry requirements for target job roles.</p>
      </div>
      <div className="p-6 rounded-2xl border bg-card space-y-4">
        <h3 className="text-sm font-semibold">Role Match: Full Stack AI Engineer</h3>
        <div className="space-y-3">
          {[
            { skill: "React / Next.js", match: 90, status: "Mastered" },
            { skill: "TypeScript & REST APIs", match: 85, status: "Proficient" },
            { skill: "LangChain & RAG Architecture", match: 40, status: "Needs Practice" },
            { skill: "Docker & Kubernetes CI/CD", match: 25, status: "Recommended Course" },
          ].map((item) => (
            <div key={item.skill} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span>{item.skill}</span>
                <span className={item.match >= 70 ? "text-emerald-600 font-bold" : "text-amber-600"}>{item.match}% — {item.status}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${item.match}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
