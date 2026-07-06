import { createFileRoute, useSearch, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ResumeBuilderPage } from "@/routes/_authenticated/resume-builder";
import { AtsCheckerPage } from "@/routes/_authenticated/ats-checker";
import { InterviewPage } from "@/routes/_authenticated/interview";
import { CareerRoadmapPage } from "@/routes/_authenticated/career-roadmap";
import { PortfolioBuilderPage } from "@/routes/_authenticated/portfolio-builder";
import { FileText, BarChart3, Briefcase, Map, FolderOpen, Sparkles, Share2, TrendingUp, Briefcase as BriefcaseIcon, Target, CheckCircle2, Plus, Trash2, Compass, BookOpen, Brain, Star, Heart, Globe, DollarSign, ArrowRight, Zap, Award, Lightbulb, Search, PenLine, MessageSquare, Target as TargetIcon, ChevronDown, ChevronUp, ExternalLink, Pencil, Check, X, Calendar, Building, GraduationCap, Landmark, Layers, Shield, Database, MonitorPlay, AlertCircle, Info, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagnificationDock } from "@/components/ui/MagnificationDock";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { SkillBadge } from "@/components/SkillBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/career-studio")({
  head: () => ({ meta: [{ title: "Career Studio — Learnify AI" }] }),
  component: CareerStudioHub,
});

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
  { id: "ikigai", label: "Career Finder", icon: Compass },
  { id: "guides", label: "Skill Roadmaps", icon: BookOpen },
];

function CareerStudioHub() {
  const search: { tab?: string } = useSearch({ strict: false });
  const navigate = useNavigate();
  const activeTab = search.tab || "resume";

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const dockItems = TABS.map((t) => ({
    icon: <t.icon className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />,
    label: t.label,
    isActive: activeTab === t.id,
    onClick: () => {
      navigate({ to: "/career-studio" as any, search: { tab: t.id } as any, replace: true });
    }
  }));

  const dockProps = isMobile
    ? { panelHeight: 48, baseItemSize: 32, magnification: 42, distance: 80 }
    : { panelHeight: 64, baseItemSize: 48, magnification: 72, distance: 150 };

  return (
    <AppShell>
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-4 md:px-10 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
              <img src="/mockup/images/learnify-logo.png" alt="Learnify AI" className="h-7 w-7 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-xl text-white tracking-tight">Career Studio</h1>
                <Badge className="bg-white/20 text-white border-white/30 text-[10px] px-2 py-0">
                  <Sparkles className="h-3 w-3 mr-1 text-yellow-300" /> 11 Tools
                </Badge>
              </div>
              <p className="text-xs text-blue-200 font-medium">AI-powered career development suite</p>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-[calc(100vh-8rem)] pb-28">
        {activeTab === "resume" && <ResumeBuilderPage embedded />}
        {activeTab === "ats" && <AtsCheckerPage embedded />}
        {activeTab === "interview" && <InterviewPage embedded />}
        {activeTab === "roadmap" && <CareerRoadmapPage embedded />}
        {activeTab === "portfolio" && <PortfolioBuilderPage embedded />}
        {activeTab === "linkedin" && <LinkedInOptimizerView />}
        {activeTab === "analytics" && <CareerAnalyticsView />}
        {activeTab === "internships" && <InternshipTrackerView />}
        {activeTab === "skillgap" && <SkillGapView />}
        {activeTab === "ikigai" && <CareerFinderView />}
        {activeTab === "guides" && <GuidesDocsView />}
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[95%]">
        <MagnificationDock items={dockItems} {...dockProps} />
      </div>
    </AppShell>
  );
}

function ScoreRing({ score, label, max = 100, size = 64 }: { score: number; label: string; max?: number; size?: number }) {
  const pct = (score / max) * 100;
  const color = pct >= 70 ? "#10b981" : pct >= 40 ? "#f59e0b" : "#ef4444";
  const r = (size / 2) - 6;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f5f5f4" strokeWidth="5" />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c} style={{ transition: "stroke-dashoffset 1s ease" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-extrabold text-stone-800">{score}<span className="text-[9px] text-stone-400">/{max}</span></span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest text-center">{label}</span>
    </div>
  );
}

function LinkedInOptimizerView() {
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [generated, setGenerated] = useState<string[]>([]);
  const [optimizedBio, setOptimizedBio] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<"headlines" | "bio" | null>(null);

  const handleGenerate = () => {
    if (!headline) { toast.error("Please enter your target role"); return; }
    setGenerated([
      `${headline} | Ex-Intern @ Top Tech | Building Scalable Web Apps & AI Tools`,
      `Full Stack Engineer specializing in ${headline} | React, Node.js, Python | Open to Roles`,
      `Driven ${headline} | 5+ Projects Shipped | Hackathon Winner | Passionate about AI & UX`,
    ]);
    setScore(Math.floor(45 + Math.random() * 40));
    toast.success("Analysis complete!");
  };

  const handleOptimizeBio = () => {
    if (!bio.trim()) { toast.error("Paste your current bio first"); return; }
    setOptimizedBio(
      `Passionate ${headline || "professional"} with hands-on experience building impactful digital solutions. ` +
      `Skilled in modern tech stacks, product thinking, and cross-functional collaboration. ` +
      `Proven track record of shipping 5+ production-grade projects and contributing to open-source communities. ` +
      `Looking for opportunities where I can drive innovation and deliver measurable business outcomes.`
    );
    setActiveSection("bio");
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100"><Share2 className="h-6 w-6 text-blue-600" /></div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">LinkedIn Profile Optimizer</h2>
          <p className="text-sm text-muted-foreground">Generate headlines, optimize bio, and boost recruiter visibility.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 rounded-2xl border space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <PenLine className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-bold">Headline Generator</h3>
          </div>
          <Input placeholder="e.g. Full Stack Developer, Data Analyst" value={headline} onChange={(e) => setHeadline(e.target.value)} className="text-sm" />
          <Button onClick={handleGenerate} size="sm" className="w-full"><Sparkles className="w-4 h-4 mr-1.5" /> Generate Headlines</Button>
          {score !== null && (
            <div className="flex justify-center pt-2"><ScoreRing score={score} label="Profile Score" size={64} /></div>
          )}
          {generated.length > 0 && (
            <div className="space-y-2 pt-2 border-t">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Recommended Headlines</p>
              {generated.map((h, i) => (
                <div key={i} className="p-3 rounded-xl border bg-card flex justify-between items-center text-xs gap-2">
                  <span className="flex-1">{h}</span>
                  <Button size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => { navigator.clipboard.writeText(h); toast.success("Copied!"); }}>Copy</Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 rounded-2xl border space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-emerald-600" />
            <h3 className="text-sm font-bold">Bio Optimizer</h3>
          </div>
          <Textarea placeholder="Paste your current LinkedIn bio..." value={bio} onChange={(e) => setBio(e.target.value)} className="text-sm min-h-[100px]" />
          <Button onClick={handleOptimizeBio} size="sm" variant="secondary" className="w-full"><Sparkles className="w-4 h-4 mr-1.5" /> Optimize Bio</Button>
          {optimizedBio && (
            <div className="p-4 bg-stone-50 rounded-xl border space-y-2">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Optimized Bio</p>
              <p className="text-xs text-stone-700 leading-relaxed">{optimizedBio}</p>
              <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => { navigator.clipboard.writeText(optimizedBio); toast.success("Copied!"); }}>Copy</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function CareerAnalyticsView() {
  const [chartType, setChartType] = useState<"salary" | "demand">("salary");

  const salaryData = [
    { role: "Frontend Dev", entry: "3.5", mid: "8", senior: "15" },
    { role: "Backend Dev", entry: "4", mid: "10", senior: "20" },
    { role: "Full Stack", entry: "5", mid: "12", senior: "22" },
    { role: "Data Scientist", entry: "6", mid: "15", senior: "28" },
    { role: "DevOps Eng", entry: "5.5", mid: "13", senior: "25" },
    { role: "AI/ML Eng", entry: "8", mid: "18", senior: "35" },
    { role: "UI/UX Designer", entry: "3.5", mid: "9", senior: "18" },
    { role: "Product Manager", entry: "6", mid: "15", senior: "30" },
  ];

  const demandData = [
    { skill: "Generative AI", demand: 94, growth: 185 },
    { skill: "Agentic AI", demand: 88, growth: 210 },
    { skill: "Full Stack", demand: 85, growth: 45 },
    { skill: "DevOps/K8s", demand: 78, growth: 62 },
    { skill: "Data Eng", demand: 76, growth: 55 },
    { skill: "Cybersec", demand: 72, growth: 70 },
    { skill: "Cloud Arch", demand: 70, growth: 48 },
    { skill: "Mobile Dev", demand: 65, growth: 30 },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-violet-50 rounded-2xl border border-violet-100"><TrendingUp className="h-6 w-6 text-violet-600" /></div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Career & Salary Analytics</h2>
          <p className="text-sm text-muted-foreground">Real-time compensation benchmarks and hiring demand across India.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Avg Entry Salary", value: "₹5.5 - ₹12 LPA", sub: "+22% growth YoY", color: "text-emerald-600" },
          { label: "Top Hiring Hubs", value: "Bengaluru, NCR, Pune", sub: "64% of open roles", color: "text-blue-600" },
          { label: "Most Demanded Skill", value: "Generative AI", sub: "210% YoY growth", color: "text-primary" },
        ].map((item, i) => (
          <Card key={i} className="p-5 rounded-xl border shadow-sm">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.label}</p>
            <p className={`text-xl font-bold mt-1 ${item.color}`}>{item.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{item.sub}</p>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-muted/20">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-bold">Salary Benchmarks (₹ LPA)</h3>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setChartType("salary")} className={`px-3 py-1 text-[10px] rounded-md font-medium ${chartType === "salary" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>Salary</button>
            <button onClick={() => setChartType("demand")} className={`px-3 py-1 text-[10px] rounded-md font-medium ${chartType === "demand" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>Demand</button>
          </div>
        </div>
        <div className="p-4 space-y-2">
          {(chartType === "salary" ? salaryData : demandData).map((item: any, i: number) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium">{chartType === "salary" ? item.role : item.skill}</span>
                <span className="font-bold text-blue-600">
                  {chartType === "salary" ? `₹${item.entry}L - ₹${item.senior}L` : `${item.demand}% demand`}
                </span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden flex gap-0.5">
                {chartType === "salary" ? (
                  <>
                    <div className="h-full bg-blue-400 rounded-l-full" style={{ width: `${(Number(item.entry) / 35) * 100}%` }} />
                    <div className="h-full bg-blue-500" style={{ width: `${((Number(item.mid) - Number(item.entry)) / 35) * 100}%` }} />
                    <div className="h-full bg-blue-600 rounded-r-full" style={{ width: `${((Number(item.senior) - Number(item.mid)) / 35) * 100}%` }} />
                  </>
                ) : (
                  <div className="h-full bg-gradient-to-r from-violet-400 to-violet-600 rounded-full" style={{ width: `${item.demand}%` }} />
                )}
              </div>
              {chartType === "salary" && (
                <div className="flex gap-3 text-[9px] text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-400" /> Entry</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-500" /> Mid</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-600" /> Senior</span>
                </div>
              )}
              {chartType === "demand" && (
                <div className="text-[9px] text-muted-foreground">Growth: <span className="text-emerald-600 font-bold">+{item.growth}%</span> YoY</div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

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

  useEffect(() => {
    const saved = localStorage.getItem("learnify_internships");
    if (saved) { try { setApps(JSON.parse(saved)); } catch { setApps([]); } }
  }, []);

  const saveApps = (newApps: InternshipApp[]) => {
    setApps(newApps);
    localStorage.setItem("learnify_internships", JSON.stringify(newApps));
  };

  const addApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) { toast.error("Enter company and role"); return; }
    const newApp: InternshipApp = { id: crypto.randomUUID(), company: company.trim(), role: role.trim(), status, date: date || new Date().toISOString().slice(0, 10) };
    saveApps([newApp, ...apps]);
    setCompany(""); setRole(""); setStatus("Applied"); setDate(new Date().toISOString().slice(0, 10));
    toast.success("Application tracked!");
  };

  const countByStatus = (s: string) => apps.filter((a) => a.status === s).length;
  const pipelineData = [
    { label: "Applied", count: countByStatus("Applied"), color: "bg-blue-500" },
    { label: "Interviewing", count: countByStatus("Interviewing"), color: "bg-amber-500" },
    { label: "Offer", count: countByStatus("Offer"), color: "bg-emerald-500" },
    { label: "Rejected", count: countByStatus("Rejected"), color: "bg-rose-500" },
  ];

  const startEdit = (app: InternshipApp) => {
    setEditingId(app.id); setEditCompany(app.company); setEditRole(app.role); setEditStatus(app.status); setEditDate(app.date);
  };

  const updateApp = (id: string) => {
    if (!editCompany.trim() || !editRole.trim()) { toast.error("Fields cannot be empty"); return; }
    saveApps(apps.map((a) => a.id === id ? { ...a, company: editCompany.trim(), role: editRole.trim(), status: editStatus, date: editDate } : a));
    setEditingId(null); toast.success("Updated!");
  };

  const deleteApp = (id: string) => { saveApps(apps.filter((a) => a.id !== id)); toast.success("Deleted"); };

  const getStatusBadge = (s: InternshipApp["status"]) => {
    switch (s) {
      case "Applied": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Interviewing": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "Offer": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "Rejected": return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300";
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100"><BriefcaseIcon className="h-6 w-6 text-amber-600" /></div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Internship & Job Tracker</h2>
          <p className="text-sm text-muted-foreground">Track your applications, manage interview stages, and land offers.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {pipelineData.map((item) => (
          <Card key={item.label} className="p-4 rounded-xl border shadow-sm text-center">
            <div className={`w-2 h-2 rounded-full mx-auto mb-2 ${item.color}`} />
            <p className="text-2xl font-bold">{item.count}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.label}</p>
          </Card>
        ))}
      </div>

      <form onSubmit={addApp} className="p-5 rounded-2xl border bg-card/50 backdrop-blur space-y-4 shadow-sm">
        <h3 className="text-sm font-bold flex items-center gap-2"><Plus className="h-4 w-4 text-primary" /> Track New Application</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Company</Label>
            <Input placeholder="Google, Microsoft" value={company} onChange={(e) => setCompany(e.target.value)} className="text-sm h-9" required />
          </div>
          <div>
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Role</Label>
            <Input placeholder="SWE Intern" value={role} onChange={(e) => setRole(e.target.value)} className="text-sm h-9" required />
          </div>
          <div>
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</Label>
            <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full text-sm h-9 px-3 rounded-md border border-input bg-background">
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="text-sm h-9" />
          </div>
        </div>
        <Button type="submit" size="sm" className="w-full sm:w-auto"><Plus className="w-4 h-4 mr-1.5" /> Add Application</Button>
      </form>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">Applications ({apps.length})</h3>
          {apps.length > 0 && (
            <button onClick={() => { if (confirm("Clear all?")) { saveApps([]); toast.success("Cleared"); } }} className="text-xs text-destructive hover:underline">Clear All</button>
          )}
        </div>
        {apps.length === 0 ? (
          <div className="text-center p-10 rounded-2xl border border-dashed">
            <BriefcaseIcon className="h-8 w-8 text-muted-foreground/35 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">No applications tracked yet.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {apps.map((a) => {
              const isEditing = editingId === a.id;
              return (
                <div key={a.id} className={`p-4 rounded-xl border bg-card transition-all ${isEditing ? "border-primary/50" : ""}`}>
                  {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <Input value={editCompany} onChange={(e) => setEditCompany(e.target.value)} className="text-sm h-9" />
                      <Input value={editRole} onChange={(e) => setEditRole(e.target.value)} className="text-sm h-9" />
                      <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as any)} className="text-sm h-9 px-3 rounded-md border border-input bg-background">
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <Input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="text-sm h-9" />
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0 hidden sm:block"><Building className="h-4 w-4" /></div>
                      <div className="min-w-0 space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm">{a.company}</span>
                          <Badge variant="outline" className={`text-[10px] py-0 px-2 font-medium ${getStatusBadge(a.status)}`}>{a.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                          <span>{a.role}</span>
                          <span className="text-muted-foreground/40">•</span>
                          <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {a.date}</span>
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-border/50">
                    {isEditing ? (
                      <>
                        <Button onClick={() => updateApp(a.id)} size="sm" className="h-8 px-3 text-xs"><Check className="h-3.5 w-3.5 mr-1" /> Save</Button>
                        <Button onClick={() => setEditingId(null)} size="sm" variant="ghost" className="h-8 px-3 text-xs"><X className="h-3.5 w-3.5 mr-1" /> Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => startEdit(a)} size="sm" variant="outline" className="h-8 w-8 p-0"><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button onClick={() => deleteApp(a.id)} size="sm" variant="outline" className="h-8 w-8 p-0 border-destructive/20"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
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
  const skills = [
    { skill: "React / Next.js", match: 90, status: "Mastered", color: "bg-emerald-500" },
    { skill: "TypeScript & REST APIs", match: 85, status: "Proficient", color: "bg-blue-500" },
    { skill: "LangChain & RAG", match: 40, status: "Needs Practice", color: "bg-amber-500" },
    { skill: "Docker & Kubernetes", match: 25, status: "Recommended", color: "bg-rose-500" },
    { skill: "System Design", match: 55, status: "Developing", color: "bg-violet-500" },
    { skill: "Python / ML Basics", match: 60, status: "Building", color: "bg-indigo-500" },
  ];

  const overall = Math.round(skills.reduce((a, s) => a + s.match, 0) / skills.length);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100"><Target className="h-6 w-6 text-rose-600" /></div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Skill Gap Analysis</h2>
          <p className="text-sm text-muted-foreground">Compare your skills against industry requirements for your target role.</p>
        </div>
      </div>

      <Card className="p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl"><TargetIcon className="h-5 w-5 text-blue-600" /></div>
            <div>
              <h3 className="font-bold text-sm">Role Match: Full Stack AI Engineer</h3>
              <p className="text-[10px] text-muted-foreground">Overall readiness score</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ScoreRing score={overall} label="Readiness" size={56} />
          </div>
        </div>

        <div className="space-y-4">
          {skills.map((item) => (
            <div key={item.skill} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium">{item.skill}</span>
                <span className={`font-bold ${item.match >= 70 ? "text-emerald-600" : item.match >= 50 ? "text-amber-600" : "text-rose-600"}`}>
                  {item.match}% — {item.status}
                </span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${item.color}`} style={{ width: `${item.match}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 rounded-2xl border shadow-sm">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-amber-500" /> Recommended Learning Path</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { course: "LangChain & RAG Masterclass", provider: "DeepLearning.AI", duration: "4 weeks" },
            { course: "Docker + Kubernetes Bootcamp", provider: "Udemy", duration: "6 weeks" },
            { course: "System Design Interview Prep", provider: "Grokking Coding", duration: "8 weeks" },
            { course: "Advanced TypeScript Patterns", provider: "Frontend Masters", duration: "3 weeks" },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl border bg-card/50 hover:bg-card transition-colors">
              <p className="font-bold text-sm">{item.course}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{item.provider} • {item.duration}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

const RefreshCw = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

function CareerFinderView() {
  const steps = [
    { id: "passions", title: "What You Love", icon: Heart, color: "bg-rose-50 text-rose-600 border-rose-100", placeholder: "e.g. Design, coding, writing...", desc: "Things that energize you" },
    { id: "skills", title: "What You're Good At", icon: Star, color: "bg-emerald-50 text-emerald-600 border-emerald-100", placeholder: "e.g. Leadership, problem solving...", desc: "Your natural talents" },
    { id: "market", title: "What The World Needs", icon: Globe, color: "bg-indigo-50 text-indigo-600 border-indigo-100", placeholder: "e.g. Health tech, education...", desc: "Problems you want to solve" },
    { id: "income", title: "Your Future Goals", icon: DollarSign, color: "bg-amber-50 text-amber-600 border-amber-100", placeholder: "e.g. Remote role, financial security...", desc: "Career expectations" },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [passions, setPassions] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [market, setMarket] = useState<string[]>([]);
  const [income, setIncome] = useState("");
  const [tempInput, setTempInput] = useState("");
  const [result, setResult] = useState(false);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleAddItem = () => {
    if (!tempInput.trim()) return;
    const arr = [passions, skills, market];
    const setters = [setPassions, setSkills, setMarket];
    if (currentStep < 3) {
      setters[currentStep]([...arr[currentStep], tempInput.trim()]);
      setTempInput("");
    }
  };

  const handleRemoveItem = (index: number) => {
    const arr = [passions, skills, market];
    const setters = [setPassions, setSkills, setMarket];
    if (currentStep < 3) {
      setters[currentStep](arr[currentStep].filter((_, i) => i !== index));
    }
  };

  const handleNext = () => {
    if (currentStep === 3) { setResult(true); return; }
    setCurrentStep((s) => s + 1);
  };

  if (result) {
    const roles = [
      { title: "AI Product Manager", match: "92%", reason: "Combines your tech skills with strategic thinking and market needs" },
      { title: "Full Stack Developer", match: "88%", reason: "Strong alignment with your coding passion and problem-solving skills" },
      { title: "Tech Consultant", match: "85%", reason: "Matches your communication skills and desire for high-impact work" },
    ];
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100"><Compass className="h-6 w-6 text-emerald-600" /></div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Your Career Path</h2>
            <p className="text-sm text-muted-foreground">Based on your Ikigai analysis</p>
          </div>
        </div>

        <Card className="p-8 rounded-2xl border shadow-sm bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg"><Rocket className="h-5 w-5" /></div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Top Match</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">{roles[0].title}</h3>
          <p className="text-blue-200 text-sm mb-4">{roles[0].reason}</p>
          <div className="flex gap-4 pt-4 border-t border-white/20">
            <div><span className="text-[10px] font-bold uppercase opacity-60">Match</span><p className="text-xl font-bold">{roles[0].match}</p></div>
            <div><span className="text-[10px] font-bold uppercase opacity-60">Market</span><p className="text-xl font-bold">High</p></div>
            <div><span className="text-[10px] font-bold uppercase opacity-60">Salary</span><p className="text-xl font-bold">₹15-30L</p></div>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="text-sm font-bold">Alternative Roles</h3>
          {roles.slice(1).map((r, i) => (
            <Card key={i} className="p-4 rounded-xl border shadow-sm flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.reason}</p>
              </div>
              <Badge variant="secondary" className="text-xs">{r.match} match</Badge>
            </Card>
          ))}
        </div>

        <Card className="p-6 rounded-2xl border shadow-sm">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-blue-600" /> Next Steps</h3>
          <div className="space-y-3">
            {[
              "Build a portfolio showcasing 3 full-stack projects",
              "Complete a certification in AI/ML fundamentals",
              "Network with industry professionals on LinkedIn",
              "Apply to 5 target companies with tailored resumes",
            ].map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 text-sm font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                <p className="text-sm pt-1.5">{step}</p>
              </div>
            ))}
          </div>
        </Card>

        <Button onClick={() => { setResult(false); setCurrentStep(0); }} variant="outline" className="w-full"><RefreshCw className="h-4 w-4 mr-2" /> Start Again</Button>
      </div>
    );
  }

  const stepId = steps[currentStep].id;
  const currentItems = stepId === "income" ? null : [passions, skills, market][currentStep];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-teal-50 rounded-2xl border border-teal-100"><Compass className="h-6 w-6 text-teal-600" /></div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Career Finder (Ikigai)</h2>
          <p className="text-sm text-muted-foreground">Discover your purpose — the intersection of passion, skill, market need, and income.</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <Card className="p-8 rounded-2xl border shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b">
          <div className={`p-4 ${steps[currentStep].color} rounded-2xl border`}>
            {React.createElement(steps[currentStep].icon, { className: "w-6 h-6" })}
          </div>
          <div>
            <h3 className="text-xl font-bold">{steps[currentStep].title}</h3>
            <p className="text-sm text-muted-foreground">{steps[currentStep].desc}</p>
          </div>
        </div>

        {stepId === "income" ? (
          <Textarea value={income} onChange={(e) => setIncome(e.target.value)} placeholder={steps[currentStep].placeholder} className="min-h-[120px]" />
        ) : (
          <div className="space-y-4">
            <div className="flex gap-3">
              <Input value={tempInput} onChange={(e) => setTempInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddItem()} placeholder={steps[currentStep].placeholder} className="text-sm" />
              <Button onClick={handleAddItem} variant="secondary" className="shrink-0">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(currentItems as string[])?.map((item, i) => (
                <span key={i} className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-xl text-sm font-medium">
                  {item}
                  <button onClick={() => handleRemoveItem(i)} className="hover:text-destructive">×</button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6 border-t">
          <Button onClick={() => setCurrentStep((s) => s - 1)} disabled={currentStep === 0} variant="ghost" size="sm">
            Previous
          </Button>
          <Button onClick={handleNext} size="sm" disabled={stepId !== "income" ? (currentItems as string[])?.length === 0 : !income.trim()}>
            {currentStep === 3 ? "Show My Path" : "Continue"} <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

const DETAILED_ROADMAPS: Record<string, {
  targetRole: string;
  level: string;
  summary: string;
  timeline: string;
  salary: string;
  prerequisites: string[];
  phases: Array<{
    phaseTitle: string;
    duration: string;
    skills: string[];
    description: string;
    milestones: string[];
  }>;
  projects: Array<{ title: string; tech: string[]; desc: string }>;
}> = {
  "Generative AI": {
    targetRole: "Generative AI Engineer",
    level: "2026 Core Demand",
    summary: "Master LLM APIs, Prompt Engineering, Retrieval-Augmented Generation (RAG), Vector Databases, and Fine-tuning models for production.",
    timeline: "2-3 Months",
    salary: "₹8L - ₹25L / yr",
    prerequisites: ["Python", "API Basics", "Git"],
    phases: [
      {
        phaseTitle: "Phase 1: Python Core & LLM API Fundamentals",
        duration: "Weeks 1-3",
        skills: ["Python", "OpenAI", "Prompt Engineering", "JSON"],
        description: "Learn Python async programming, HTTP clients, OpenAI & Anthropic API integration, structured outputs, and prompt formatting techniques.",
        milestones: ["Build a CLI AI Assistant", "Implement Structured JSON Data Extraction from Unstructured Text"]
      },
      {
        phaseTitle: "Phase 2: RAG & Vector Search Architecture",
        duration: "Weeks 4-7",
        skills: ["LangChain", "Vector DBs", "Pinecone", "Python", "OpenAI"],
        description: "Master document chunking, embeddings, vector database similarity search, hybrid search, and context augmentation.",
        milestones: ["Build a Full RAG Knowledge Base for PDF Search", "Implement Conversational Memory & Context Truncation"]
      },
      {
        phaseTitle: "Phase 3: Production LLM Evaluation & Guardrails",
        duration: "Weeks 8-12",
        skills: ["FastAPI", "Python", "Docker", "Vercel", "OpenAI"],
        description: "Deploy AI microservices with FastAPI, implement rate limiting, hallucination guardrails, response caching, and evaluation metrics.",
        milestones: ["Deploy Production AI Microservice to Cloud", "Benchmark RAG Accuracy & Latency"]
      }
    ],
    projects: [
      { title: "Enterprise Knowledge Base RAG", tech: ["Python", "LangChain", "OpenAI", "Pinecone", "FastAPI"], desc: "Full RAG system querying thousands of company documents with citation links." },
      { title: "AI Code Review Assistant", tech: ["Python", "OpenAI", "GitHub API", "Docker"], desc: "Automated PR reviewer analyzing code quality, security vulnerabilities, and unit test coverage." }
    ]
  },
  "Agentic AI": {
    targetRole: "Agentic AI Developer",
    level: "Cutting Edge",
    summary: "Build stateful, multi-agent autonomous workflows using LangGraph, Tool Calling, ReAct Agent loops, and human-in-the-loop validation.",
    timeline: "3-4 Months",
    salary: "₹12L - ₹35L+ / yr",
    prerequisites: ["Python", "TypeScript", "LangChain"],
    phases: [
      {
        phaseTitle: "Phase 1: Agentic Patterns & Tool Calling",
        duration: "Weeks 1-4",
        skills: ["Python", "TypeScript", "LangChain", "OpenAI"],
        description: "Understand ReAct architecture, function calling, tool execution loops, error recovery, and structured planning.",
        milestones: ["Build a Web Research Agent with Google & Tavily Tools", "Implement Automatic Tool Error Retries"]
      },
      {
        phaseTitle: "Phase 2: Stateful Multi-Agent Orchestration",
        duration: "Weeks 5-9",
        skills: ["LangChain", "Python", "TypeScript", "FastAPI"],
        description: "Orchestrate multi-agent teams (Coder, Tester, Reviewer) using state graphs, conditional routing, and persistent memory.",
        milestones: ["Create an Autonomous Software Engineering Agent Team", "Implement Human-in-the-Loop Approval Nodes"]
      },
      {
        phaseTitle: "Phase 3: Production Deployment & Agent Observability",
        duration: "Weeks 10-14",
        skills: ["Python", "Docker", "FastAPI", "PostgreSQL", "Redis"],
        description: "Monitor agent execution traces, cost optimization, rate limits, and asynchronous background worker queues.",
        milestones: ["Deploy Multi-Agent Pipeline to Production Kubernetes / Cloud", "Trace Agent Steps with Observability Tools"]
      }
    ],
    projects: [
      { title: "Autonomous Market Research Agent", tech: ["Python", "LangChain", "Tavily", "FastAPI"], desc: "Scrapes competitor websites, generates market intelligence reports, and emails summaries." },
      { title: "AI Customer Support Squad", tech: ["TypeScript", "LangChain", "Node.js", "Supabase"], desc: "Multi-agent squad handling ticket classification, DB lookup, resolution, and escalation." }
    ]
  },
  "UI/UX Design": {
    targetRole: "UI/UX & Product Designer",
    level: "Creative Focus",
    summary: "Master user research, wireframing, interactive prototyping in Figma, design systems, accessibility (WCAG), and developer handoff.",
    timeline: "3-4 Months",
    salary: "₹4L - ₹20L / yr",
    prerequisites: ["Design Fundamentals", "Figma Basics"],
    phases: [
      {
        phaseTitle: "Phase 1: UX Research & Information Architecture",
        duration: "Weeks 1-4",
        skills: ["Figma", "UI/UX", "User Research", "Wireframing"],
        description: "Conduct user interviews, map user journeys, create personas, sitemaps, and low-fidelity wireframes.",
        milestones: ["Complete UX Case Study for a Mobile App", "Build User Flow & Wireframe Specs"]
      },
      {
        phaseTitle: "Phase 2: UI Mastery & Design Systems",
        duration: "Weeks 5-9",
        skills: ["Figma", "UI/UX", "Tailwind CSS", "Canva"],
        description: "Master typography, color theory, spacing tokens, auto-layout, component variants, and full design system creation.",
        milestones: ["Create Complete Mobile & Desktop Design System", "Design High-Fidelity Responsive Prototypes"]
      },
      {
        phaseTitle: "Phase 3: Interactive Micro-Animations & Developer Handoff",
        duration: "Weeks 10-14",
        skills: ["Figma", "UI/UX", "Tailwind CSS"],
        description: "Add smooth component micro-interactions, smart-animate prototypes, prepare design tokens, and conduct dev handoff.",
        milestones: ["Build Fully Interactive Clickable Prototype", "Export Token Documentation for Engineering Team"]
      }
    ],
    projects: [
      { title: "Fintech Mobile App Redesign", tech: ["Figma", "UI/UX", "Design Systems"], desc: "End-to-end design case study from user research to interactive high-fidelity Figma prototype." },
      { title: "SaaS Dashboard Design System", tech: ["Figma", "UI/UX", "Tailwind CSS"], desc: "Comprehensive component library with dark/light mode tokens, typography specs, and accessibility guidelines." }
    ]
  },
  "Full-Stack (Next.js)": {
    targetRole: "Full-Stack Software Engineer",
    level: "High Demand",
    summary: "Build modern, high-performance web applications using React 19, Next.js App Router, TypeScript, Tailwind CSS, PostgreSQL, and Server Components.",
    timeline: "4-6 Months",
    salary: "₹3L - ₹15L / yr",
    prerequisites: ["HTML/CSS", "JavaScript Basics"],
    phases: [
      {
        phaseTitle: "Phase 1: Modern JavaScript & TypeScript Mastery",
        duration: "Weeks 1-4",
        skills: ["JavaScript", "TypeScript", "HTML5", "CSS3"],
        description: "Master ES2026 async/await, closures, promises, DOM manipulation, and strong static typing with TypeScript interfaces.",
        milestones: ["Build TypeScript Data Processing Utility", "Master Async Promises & Fetch APIs"]
      },
      {
        phaseTitle: "Phase 2: React 19 & Next.js App Router",
        duration: "Weeks 5-12",
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
        description: "Learn Server Components, Server Actions, Client State, Routing, Layouts, Forms, and Tailwind CSS responsive styling.",
        milestones: ["Build Full-Featured Next.js E-Commerce Catalog", "Implement Dynamic Server Component Data Fetching"]
      },
      {
        phaseTitle: "Phase 3: Database, Auth & Backend Integration",
        duration: "Weeks 13-18",
        skills: ["Node.js", "PostgreSQL", "Supabase", "Express", "Vercel"],
        description: "Connect PostgreSQL databases, design relational schemas, implement Supabase OAuth authentication, and deploy to Vercel.",
        milestones: ["Build Full-Stack SaaS Application with Payments & Auth", "Deploy Live Next.js Web App with CI/CD Pipeline"]
      }
    ],
    projects: [
      { title: "AI-Powered Course Creator Platform", tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Supabase"], desc: "Full-stack LMS platform with course builder, quiz engine, video streaming, and certificates." },
      { title: "Real-Time Collaborative Workspace", tech: ["React", "Node.js", "TypeScript", "PostgreSQL", "Tailwind CSS"], desc: "Notion-style workspace with real-time editing, drag-and-drop, and team permissions." }
    ]
  },
  "Cloud & DevSecOps": {
    targetRole: "DevOps & Cloud Engineer",
    level: "Infrastructure Focus",
    summary: "Master cloud infrastructure on AWS, containerization with Docker, Kubernetes orchestration, CI/CD automation, and Terraform IaC.",
    timeline: "6-8 Months",
    salary: "₹6L - ₹22L / yr",
    prerequisites: ["Linux Basics", "Networking Fundamentals"],
    phases: [
      {
        phaseTitle: "Phase 1: Linux Administration & Shell Scripting",
        duration: "Weeks 1-6",
        skills: ["Linux", "Bash", "Git", "Command Line"],
        description: "Master Linux terminal navigation, file permissions, process management, systemd services, SSH, and Bash scripting.",
        milestones: ["Automate System Health Check Script", "Configure Linux Nginx Reverse Proxy with SSL"]
      },
      {
        phaseTitle: "Phase 2: Docker Containerization & CI/CD",
        duration: "Weeks 7-14",
        skills: ["Docker", "Git", "GitHub", "Linux"],
        description: "Build multi-stage Dockerfiles, Docker Compose stacks, GitHub Actions workflows, and automated testing pipelines.",
        milestones: ["Dockerize Microservice Stack with Postgres & Redis", "Set up Automated GitHub Actions CI/CD Pipeline"]
      },
      {
        phaseTitle: "Phase 3: Cloud AWS & Infrastructure as Code (IaC)",
        duration: "Weeks 15-24",
        skills: ["AWS", "Kubernetes", "Terraform", "Linux"],
        description: "Provision AWS EC2, S3, RDS, IAM, VPC using Terraform scripts. Deploy production applications to Amazon EKS (Kubernetes).",
        milestones: ["Provision AWS Multi-Tier Cloud Infrastructure via Terraform", "Deploy Scalable Kubernetes Cluster with Auto-Scaling"]
      }
    ],
    projects: [
      { title: "Zero-Downtime AWS Kubernetes Deployment", tech: ["AWS", "Kubernetes", "Docker", "Terraform", "GitHub"], desc: "Complete Terraform infrastructure code deploying an EKS cluster with zero-downtime rolling updates." },
      { title: "Automated DevSecOps Pipeline", tech: ["Docker", "Git", "Linux", "AWS"], desc: "CI/CD security pipeline scanning vulnerabilities, running automated tests, and deploying to AWS." }
    ]
  },
  "Data Intelligence": {
    targetRole: "Data Scientist & Analytics Engineer",
    level: "Enterprise",
    summary: "Master Python data analysis, SQL queries, Data Cleaning, Data Visualization, Machine Learning algorithms, and Predictive Analytics.",
    timeline: "5-7 Months",
    salary: "₹5L - ₹18L / yr",
    prerequisites: ["Python Basics", "Math & Statistics"],
    phases: [
      {
        phaseTitle: "Phase 1: Advanced SQL & Python Data Analysis",
        duration: "Weeks 1-6",
        skills: ["Python", "SQL", "Pandas", "NumPy"],
        description: "Master complex SQL window functions, joins, CTEs, DataFrames in Pandas, NumPy array operations, and data cleaning.",
        milestones: ["Perform EDA (Exploratory Data Analysis) on 100k+ Record Dataset", "Write Complex SQL Data Warehouse Queries"]
      },
      {
        phaseTitle: "Phase 2: Data Visualization & Business Dashboards",
        duration: "Weeks 7-12",
        skills: ["Python", "Pandas", "NumPy", "SQL"],
        description: "Build interactive visual reports, chart dashboards, key performance metrics, and automated executive summary reports.",
        milestones: ["Build Interactive Business Analytics Dashboard", "Create Executive Data Storytelling Presentation"]
      },
      {
        phaseTitle: "Phase 3: Machine Learning & Predictive Modeling",
        duration: "Weeks 13-20",
        skills: ["Python", "TensorFlow", "Pandas", "NumPy"],
        description: "Train classification, regression, and clustering models using Scikit-Learn and TensorFlow to solve real business problems.",
        milestones: ["Train Customer Churn Prediction Model", "Deploy ML Inference API for Real-time Predictions"]
      }
    ],
    projects: [
      { title: "E-Commerce Customer Behavior & Churn Predictor", tech: ["Python", "Pandas", "TensorFlow", "SQL", "NumPy"], desc: "Exploratory data analysis and ML model predicting customer retention and lifetime value." },
      { title: "Automated Financial Intelligence Dashboard", tech: ["Python", "SQL", "Pandas", "NumPy"], desc: "Pipeline parsing financial transactions, calculating metrics, and rendering interactive dashboards." }
    ]
  }
};

function GuidesDocsView() {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const skillGuides = [
    { title: "Generative AI", icon: Sparkles, color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400", level: "2026 Core", duration: "2-3 months", skills: ["Prompt Engineering", "Generative AI", "Python", "OpenAI", "LangChain"], salary: "₹8L - ₹25L" },
    { title: "Agentic AI", icon: Brain, color: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400", level: "Cutting Edge", duration: "3-4 months", skills: ["Agentic AI", "Python", "TypeScript", "LangChain", "FastAPI"], salary: "₹12L - ₹35L+" },
    { title: "UI/UX Design", icon: Layers, color: "bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400", level: "Creative Focus", duration: "3-4 months", skills: ["Figma", "UI/UX", "Tailwind CSS", "Canva"], salary: "₹4L - ₹20L" },
    { title: "Full-Stack (Next.js)", icon: Globe, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400", level: "High Demand", duration: "4-6 months", skills: ["TypeScript", "Next.js", "React", "Tailwind CSS", "Node.js", "PostgreSQL"], salary: "₹3L - ₹15L" },
    { title: "Cloud & DevSecOps", icon: Shield, color: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400", level: "Infrastructure", duration: "6-8 months", skills: ["AWS", "Docker", "Kubernetes", "Linux", "Terraform", "Git"], salary: "₹6L - ₹22L" },
    { title: "Data Intelligence", icon: Database, color: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400", level: "Enterprise", duration: "5-7 months", skills: ["Python", "Pandas", "SQL", "NumPy", "TensorFlow"], salary: "₹5L - ₹18L" },
  ];

  const activeRoadmap = selectedKey ? DETAILED_ROADMAPS[selectedKey] : null;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-card rounded-2xl border shadow-sm"><BookOpen className="h-6 w-6 text-primary" /></div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Skill Roadmaps & Guides</h2>
          <p className="text-sm text-muted-foreground">Click any card to view the full 2026 industry roadmap breakdown & tech stack.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skillGuides.map((guide, i) => (
          <Card
            key={i}
            onClick={() => setSelectedKey(guide.title)}
            className="rounded-2xl border shadow-sm p-6 space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${guide.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {React.createElement(guide.icon as any, { className: "w-5 h-5" })}
              </div>
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{guide.level}</p>
                <h3 className="font-bold text-base group-hover:text-primary transition-colors">{guide.title}</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-muted/60 rounded-lg text-center">
                <p className="text-[8px] font-bold text-muted-foreground uppercase">Timeline</p>
                <p className="text-xs font-bold">{guide.duration}</p>
              </div>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-center">
                <p className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Salary</p>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{guide.salary}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {guide.skills.map((s) => (
                <SkillBadge key={s} skill={s} variant="secondary" size="sm" />
              ))}
            </div>
            <div className="pt-2 text-xs font-bold text-primary flex items-center justify-end gap-1 group-hover:translate-x-1 transition-transform">
              View Full Roadmap <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Card>
        ))}
      </div>

      {activeRoadmap && (
        <Dialog open={!!selectedKey} onOpenChange={(v) => !v && setSelectedKey(null)}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-6 bg-card border-border rounded-2xl shadow-2xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary/30 text-[10px]">
                  {activeRoadmap.level}
                </Badge>
                <span className="text-xs font-semibold text-muted-foreground">2026 Industry Spec</span>
              </div>
              <DialogTitle className="text-2xl font-bold font-display mt-1">
                {activeRoadmap.targetRole} Roadmap
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 pt-3">
              <p className="text-sm text-muted-foreground leading-relaxed">{activeRoadmap.summary}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-muted/50 rounded-xl border">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Estimated Time</span>
                  <p className="font-bold text-sm text-foreground mt-0.5">{activeRoadmap.timeline}</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-500/20">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Market Salary</span>
                  <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">{activeRoadmap.salary}</p>
                </div>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-500/20 col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">Prerequisites</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activeRoadmap.prerequisites.map((p) => (
                      <span key={p} className="text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-base flex items-center gap-2 border-b pb-2">
                  <Map className="h-4 w-4 text-primary" /> Phase-by-Phase Learning Path
                </h4>
                <div className="space-y-4">
                  {activeRoadmap.phases.map((phase, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-muted/40 border space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h5 className="font-bold text-sm text-foreground flex items-center gap-2">
                          <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          {phase.phaseTitle}
                        </h5>
                        <Badge variant="secondary" className="text-[10px] w-fit">
                          {phase.duration}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{phase.description}</p>
                      
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Required Tech Stack</span>
                        <div className="flex flex-wrap gap-1.5">
                          {phase.skills.map((skill) => (
                            <SkillBadge key={skill} skill={skill} variant="default" size="sm" />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-border/60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Phase Milestones</span>
                        <ul className="space-y-1">
                          {phase.milestones.map((m, mIdx) => (
                            <li key={mIdx} className="text-xs text-foreground flex items-start gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {activeRoadmap.projects.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-base flex items-center gap-2 border-b pb-2">
                    <FolderOpen className="h-4 w-4 text-primary" /> Key Portfolio Projects
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {activeRoadmap.projects.map((proj, pIdx) => (
                      <div key={pIdx} className="p-3.5 rounded-xl border bg-card space-y-2">
                        <h5 className="font-bold text-xs text-foreground">{proj.title}</h5>
                        <p className="text-[11px] text-muted-foreground">{proj.desc}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.tech.map((t) => (
                            <SkillBadge key={t} skill={t} variant="outline" size="sm" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t flex items-center justify-between gap-3">
                <Button variant="outline" onClick={() => setSelectedKey(null)} className="text-xs">
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setSelectedKey(null);
                    navigate({
                      to: "/career-studio" as any,
                      search: { tab: "roadmap" } as any,
                      replace: true,
                    });
                  }}
                  className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Generate Custom AI Plan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}


