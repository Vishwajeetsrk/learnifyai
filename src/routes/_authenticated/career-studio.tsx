import { createFileRoute, useSearch, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import React from "react";

const ResumeBuilderPage = React.lazy(() =>
  import("@/components/career-studio/ResumeBuilderPage").then((m) => ({ default: m.ResumeBuilderPage })),
);
const AtsCheckerPage = React.lazy(() =>
  import("@/components/career-studio/AtsCheckerPage").then((m) => ({ default: m.AtsCheckerPage })),
);
const InterviewPage = React.lazy(() =>
  import("@/components/career-studio/InterviewPage").then((m) => ({ default: m.InterviewPage })),
);
const CareerRoadmapPage = React.lazy(() =>
  import("@/components/career-studio/CareerRoadmapPage").then((m) => ({ default: m.CareerRoadmapPage })),
);
const PortfolioBuilderPage = React.lazy(() =>
  import("@/components/career-studio/PortfolioBuilderPage").then((m) => ({ default: m.PortfolioBuilderPage })),
);
const AgentHub = React.lazy(() =>
  import("@/components/agents/AgentHub").then((m) => ({ default: m.AgentHub })),
);
import {
  FileText,
  BarChart3,
  Briefcase,
  Map,
  FolderOpen,
  Sparkles,
  Share2,
  TrendingUp,
  Briefcase as BriefcaseIcon,
  Target,
  CheckCircle2,
  Plus,
  Trash2,
  Compass,
  BookOpen,
  Brain,
  Star,
  Heart,
  Globe,
  DollarSign,
  ArrowRight,
  Zap,
  Award,
  Lightbulb,
  Search,
  PenLine,
  MessageSquare,
  Target as TargetIcon,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Pencil,
  Check,
  X,
  Calendar,
  Building,
  GraduationCap,
  Landmark,
  Layers,
  Shield,
  Database,
  MonitorPlay,
  AlertCircle,
  Info,
  Rocket,
  Upload,
  ImagePlus,
  Camera,
  ScanLine,
  ListChecks,
  Trophy,
  UserCheck,
  Linkedin,
  Github,
  Twitter,
  Download,
  Hash,
  Palette,
  Smartphone,
  Wifi,
  Cloud,
  Code2,
  Figma,
  Users,
  Lock,
  Cpu,
  Network,
  Loader2,
  Eye,
  Kanban,
  LayoutGrid,
  List,
  Copy,
  FileSpreadsheet,
  Filter,
  ArrowUpRight,
  SlidersHorizontal,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MagnificationDock } from "@/components/ui/MagnificationDock";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { SkillBadge } from "@/components/SkillBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

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
  { id: "agents", label: "AI Agents", icon: Sparkles },
];

function CareerStudioHub() {
  const search: { tab?: string } = useSearch({ strict: false });
  const navigate = useNavigate();
  const activeTab = search.tab || "resume";
  const [menuOpen, setMenuOpen] = useState(false);

  const activeTabInfo = TABS.find((t) => t.id === activeTab) || TABS[0];
  const ActiveIcon = activeTabInfo.icon;

  return (
    <AppShell>
      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-4 md:px-8 py-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.07),transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
          {/* Current tool indicator */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
              <ActiveIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight">Career Studio</h1>
              <p className="text-[11px] text-blue-200 font-medium">{activeTabInfo.label}</p>
            </div>
          </div>

          {/* Single unified menu button — same on all screen sizes */}
          <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogTrigger asChild>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/20 transition-colors backdrop-blur-sm"
                aria-label="Open Career Studio menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="hidden sm:inline">All Tools</span>
              </button>
            </DialogTrigger>
            <DialogContent className="w-[94%] max-w-md rounded-2xl p-5 bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl">
              <DialogHeader className="pb-3 border-b border-border/50">
                <DialogTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Career Studio — 12 AI Tools
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-2.5 py-3 max-h-[70vh] overflow-y-auto">
                {TABS.map((t) => {
                  const isActive = activeTab === t.id;
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        navigate({
                          to: "/career-studio" as any,
                          search: { tab: t.id } as any,
                          replace: true,
                        });
                        setMenuOpen(false);
                      }}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all active:scale-95",
                        isActive
                          ? "bg-primary/10 border-primary text-primary shadow-sm"
                          : "bg-muted/30 border-border/60 hover:bg-muted/60 text-foreground",
                      )}
                    >
                      <div
                        className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center",
                          isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] text-center font-semibold leading-tight">
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ── Content (Lazy Suspense Loaded) ── */}
      <div className="min-h-[calc(100dvh-8rem)] pb-10">
        <React.Suspense
          fallback={
            <div className="p-16 text-center text-sm font-bold text-muted-foreground flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              <span>Loading Studio Module...</span>
            </div>
          }
        >
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
          {activeTab === "agents" && <AgentHub />}
        </React.Suspense>
      </div>
    </AppShell>
  );
}

function ScoreRing({
  score,
  label,
  max = 100,
  size = 64,
}: {
  score: number;
  label: string;
  max?: number;
  size?: number;
}) {
  const pct = (score / max) * 100;
  const color = pct >= 70 ? "#10b981" : pct >= 40 ? "#f59e0b" : "#ef4444";
  const r = size / 2 - 6;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f5f5f4" strokeWidth="5" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c - (pct / 100) * c}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-extrabold text-stone-800">
            {score}
            <span className="text-[9px] text-stone-400">/{max}</span>
          </span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest text-center">
        {label}
      </span>
    </div>
  );
}

function LinkedInOptimizerView() {
  const { user } = useAuth();

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState(false);
  const [bannerBg, setBannerBg] = useState(
    "linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#312e81 100%)",
  );
  const [name, setName] = useState("Vishwajeet Kumar");
  const [pronouns, setPronouns] = useState("He/Him");
  const [headline, setHeadline] = useState("Full Stack AI Engineer | Building Learnify AI | React, Supabase & OpenRouter");
  const [location, setLocation] = useState("Bengaluru, Karnataka, India");
  const [about, setAbout] = useState(
    "Passionate Full Stack AI Engineer crafting high-performance, intelligent web applications. Specialized in React 19, TypeScript, Supabase, Tailwind CSS, and LLM integrations."
  );
  const [featuredItems, setFeaturedItems] = useState<{ title: string; url: string }[]>([
    { title: "Learnify AI Platform", url: "https://www.learnifyai.in" },
    { title: "Full-Stack AI Project Showcase", url: "https://github.com/Vishwajeetsrk/learnifyai" },
  ]);
  const [skills, setSkills] = useState<string[]>([
    "React.js",
    "TypeScript",
    "Python",
    "Node.js",
    "Supabase",
    "Tailwind CSS",
    "OpenAI / OpenRouter API",
    "PostgreSQL",
  ]);
  const [skillInput, setSkillInput] = useState("");
  const [experiences, setExperiences] = useState<
    { company: string; role: string; period: string; desc: string }[]
  >([
    {
      company: "Learnify AI",
      role: "Lead Full Stack & AI Engineer",
      period: "Jan 2024 – Present",
      desc: "Architected end-to-end AI learning platform serving 10,000+ students. Integrated Supabase RLS, OpenRouter LLM tools, Cashfree billing, and ATS resume studio.",
    },
  ]);
  const [projects, setProjects] = useState<{ name: string; url: string; desc: string }[]>([
    {
      name: "DreamSync Career Studio",
      url: "https://learnifyaitool.vercel.app/career-studio",
      desc: "AI-powered suite featuring ATS checker, real-time 3D voice interactor, resume builder, and skill gap matrix.",
    },
  ]);
  const [education, setEducation] = useState<
    { institution: string; degree: string; year: string }[]
  >([
    { institution: "St. Aloysius Institute", degree: "B.Tech Computer Science", year: "2020 – 2024" },
  ]);
  const [activeSection, setActiveSection] = useState<"edit" | "preview" | "posts">("edit");
  const [generatedHeadlines, setGeneratedHeadlines] = useState<string[]>([]);
  const [optimizedAbout, setOptimizedAbout] = useState("");
  const [aboutStyle, setAboutStyle] = useState<"story" | "recruiter" | "executive" | "creative">("story");
  const [generatedPosts, setGeneratedPosts] = useState<string[]>([]);
  const [generating, setGenerating] = useState<string | null>(null);

  const photoRef = useRef<HTMLInputElement>(null);

  // Auto-fetch profile photo from Supabase or user metadata if missing
  useEffect(() => {
    if (!user) return;
    const metaPhoto = user.user_metadata?.avatar_url as string | undefined;
    if (metaPhoto && !profilePhoto) {
      setProfilePhoto(metaPhoto);
      setPhotoError(false);
    }
    let cancelled = false;
    void (async () => {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", user.id)
          .maybeSingle();
        if (!cancelled && data?.avatar_url && !profilePhoto) {
          setProfilePhoto(data.avatar_url);
          setPhotoError(false);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Persistence: Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("learnify_linkedin_profile_v2");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.name) setName(data.name);
        if (data.pronouns) setPronouns(data.pronouns);
        if (data.headline) setHeadline(data.headline);
        if (data.location) setLocation(data.location);
        if (data.about) setAbout(data.about);
        if (data.skills) setSkills(data.skills);
        if (data.experiences) setExperiences(data.experiences);
        if (data.projects) setProjects(data.projects);
        if (data.education) setEducation(data.education);
        if (data.featuredItems) setFeaturedItems(data.featuredItems);
        if (data.profilePhoto) {
          setProfilePhoto(data.profilePhoto);
          setPhotoError(false);
        }
        if (data.bannerBg) setBannerBg(data.bannerBg);
      } catch {
        // ignore fallback
      }
    } else if (user) {
      const uName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Your Name";
      setName(uName);
    }
  }, [user]);

  // Auto save to LocalStorage
  const saveToStorage = useCallback(() => {
    const payload = {
      name,
      pronouns,
      headline,
      location,
      about,
      skills,
      experiences,
      projects,
      education,
      featuredItems,
      profilePhoto,
      bannerBg,
    };
    localStorage.setItem("learnify_linkedin_profile_v2", JSON.stringify(payload));
  }, [name, pronouns, headline, location, about, skills, experiences, projects, education, featuredItems, profilePhoto, bannerBg]);

  useEffect(() => {
    saveToStorage();
  }, [saveToStorage]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfilePhoto(ev.target?.result as string);
      setPhotoError(false);
      toast.success("Profile photo uploaded!");
    };
    reader.readAsDataURL(file);
  };

  const handleAutoFillAccount = () => {
    const uName = user?.user_metadata?.full_name || "Vishwajeet Kumar";
    setName(uName);
    setLocation("Bengaluru, India");
    setHeadline("Full Stack AI Engineer | React 19, Supabase & LLM Architect | Learnify AI");
    setSkills(["React", "TypeScript", "Python", "Supabase", "Tailwind CSS", "Node.js", "Generative AI", "REST APIs"]);
    setAbout("Full-stack engineer dedicated to building scalable web platforms and AI-driven creator tools. Experienced in React, Next.js, Supabase RLS, and LLM integrations.");
    toast.success("Profile auto-filled from account!");
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s) return;
    if (skills.includes(s)) {
      toast.error("Skill already added");
      return;
    }
    setSkills([...skills, s]);
    setSkillInput("");
  };
  const removeSkill = (idx: number) => setSkills(skills.filter((_, i) => i !== idx));
  const addExp = () =>
    setExperiences([...experiences, { company: "", role: "", period: "", desc: "" }]);
  const removeExp = (i: number) => setExperiences(experiences.filter((_, idx) => idx !== i));
  const updateExp = (i: number, k: keyof (typeof experiences)[0], v: string) =>
    setExperiences(experiences.map((e, idx) => (idx === i ? { ...e, [k]: v } : e)));
  const addProject = () => setProjects([...projects, { name: "", url: "", desc: "" }]);
  const removeProject = (i: number) => setProjects(projects.filter((_, idx) => idx !== i));
  const updateProject = (i: number, k: keyof (typeof projects)[0], v: string) =>
    setProjects(projects.map((p, idx) => (idx === i ? { ...p, [k]: v } : p)));
  const addEdu = () => setEducation([...education, { institution: "", degree: "", year: "" }]);
  const removeEdu = (i: number) => setEducation(education.filter((_, idx) => idx !== i));
  const updateEdu = (i: number, k: keyof (typeof education)[0], v: string) =>
    setEducation(education.map((e, idx) => (idx === i ? { ...e, [k]: v } : e)));
  const addFeatured = () => setFeaturedItems([...featuredItems, { title: "", url: "" }]);
  const removeFeatured = (i: number) =>
    setFeaturedItems(featuredItems.filter((_, idx) => idx !== i));
  const updateFeatured = (i: number, k: keyof (typeof featuredItems)[0], v: string) =>
    setFeaturedItems(featuredItems.map((f, idx) => (idx === i ? { ...f, [k]: v } : f)));

  const handleGenerateHeadlines = () => {
    setGenerating("headlines");
    setTimeout(() => {
      const role = experiences[0]?.role || "Full Stack AI Engineer";
      const company = experiences[0]?.company || "Learnify AI";
      const top3 = skills.slice(0, 3).join(", ") || "React, TypeScript, Python";
      setGeneratedHeadlines([
        `${role} @ ${company} | ${top3} | Open to Lead Tech Roles`,
        `Building the Future of EdTech with AI | ${top3} Specialist | ${name}`,
        `Full-Stack & Generative AI Engineer | ${skills.slice(0, 4).join(" · ") || "React · Supabase · Python · LLMs"}`,
        `${role} | Scalable Microservices & Modern Web Systems | Ex-${company}`,
        `Software Architect | ${skills[0] || "AI System Design"} Specialist | Helping developers build 10x faster`,
      ]);
      setGenerating(null);
      toast.success("5 tailored high-converting headlines generated!");
    }, 600);
  };

  const handleOptimizeAbout = () => {
    setGenerating("about");
    setTimeout(() => {
      const role = experiences[0]?.role || "Full Stack AI Engineer";
      const company = experiences[0]?.company || "Learnify AI";
      const skillList = skills.slice(0, 6).join(", ") || "React, TypeScript, Python, Supabase, Tailwind CSS, LLM APIs";
      const proj = projects
        .filter((p) => p.name)
        .map((p) => p.name)
        .join(", ");

      if (aboutStyle === "story") {
        setOptimizedAbout(
          `🚀 Hi there! I'm ${name}, a ${role}${company ? ` at ${company}` : ""} with a passion for transforming complex ideas into intuitive, production-grade applications.\n\n` +
            `My engineering journey centers on building fast, reliable, and user-first systems using ${skillList}.\n\n` +
            (about.trim() ? `💡 What drives me:\n${about.trim()}\n\n` : "") +
            (proj ? `🛠️ Featured Work:\n${proj}\n\n` : "") +
            `🎯 Core Technical Stack:\n${skills.map((s) => `• ${s}`).join("\n") || "• React 19 & TypeScript\n• Supabase RLS & PostgreSQL\n• OpenRouter & LLM Workflows"}\n\n` +
            `📫 Let's connect! I'm always open to discussing web architecture, AI innovations, and engineering opportunities.`
        );
      } else if (aboutStyle === "recruiter") {
        setOptimizedAbout(
          `📌 SUMMARY:\nResults-driven ${role} with proven experience in building scalable web architectures and AI tools.\n\n` +
            `✨ CORE COMPETENCIES:\n${skills.map((s) => `[x] ${s}`).join("\n") || "[x] Full-Stack Engineering\n[x] System Design\n[x] LLM API Integration"}\n\n` +
            `💼 EXPERIENCE HIGHLIGHTS:\n` +
            (experiences.filter((e) => e.company).map((e) => `• ${e.role} @ ${e.company} (${e.period}): ${e.desc || "Delivered high-impact solutions"}`).join("\n") || "• Built and scaled modern web applications") +
            `\n\n🎓 EDUCATION:\n${education[0]?.degree || "B.Tech Computer Science"} — ${education[0]?.institution || "Institute of Technology"}\n\n` +
            `📩 Open to Senior Software Engineer, Full Stack, and AI Engineering roles.`
        );
      } else if (aboutStyle === "executive") {
        setOptimizedAbout(
          `As a ${role}, I bridge technical execution with strategic vision to deliver products that drive user engagement and business growth.\n\n` +
            `Over my career, I've led full-stack engineering efforts specializing in ${skillList}. My focus is on high-throughput database design, maintainable component architectures, and seamless AI integrations.\n\n` +
            `Key Strengths:\n` +
            `• End-to-End Product Architecture\n` +
            `• Performance & Optimization\n` +
            `• Cross-functional Collaboration & AI Workflow Automation\n\n` +
            `Open to strategic technology advisory, staff engineering, and tech lead opportunities.`
        );
      } else {
        setOptimizedAbout(
          `⚡ Building software that matters.\n\n` +
            `I'm ${name} — a ${role} obsessed with modern UX, clean architecture, and practical AI integrations.\n\n` +
            `Current Focus:\n${skills.slice(0, 4).map((s) => `🔥 ${s}`).join("\n")}\n\n` +
            (proj ? `Recently Built: ${proj}\n\n` : "") +
            `If you love shipping clean code, exploring cutting-edge AI tools, or collaborating on ambitious products, let's talk!`
        );
      }
      setGenerating(null);
      toast.success(`About section optimized in ${aboutStyle} style!`);
    }, 600);
  };

  const handleGeneratePosts = () => {
    setGenerating("posts");
    setTimeout(() => {
      const role = experiences[0]?.role || "Full Stack AI Engineer";
      const company = experiences[0]?.company || "Learnify AI";
      const top4 = skills.slice(0, 4).join(", ") || "React, TypeScript, Python, Supabase";
      const proj = projects.filter((p) => p.name)[0]?.name || "DreamSync Career Studio";
      const tags = skills
        .slice(0, 5)
        .map((s) => `#${s.replace(/[\s./]/g, "")}`)
        .join(" ");

      setGeneratedPosts([
        `🎉 Major Milestone Announcement!\n\nBuilding as a ${role} at ${company} has taught me that the best code is code that solves real human problems.\n\nKey technologies powering our stack:\n` +
          skills.slice(0, 5).map((s) => `✅ ${s}`).join("\n") +
          `\n\nBiggest lesson learned? Iterate fast, listen to user feedback, and never compromise on DX (Developer Experience).\n\nWhat tools are you building with this week? Drop them below! 👇\n\n${tags} #BuildInPublic #SoftwareEngineering #TechGrowth`,

        `💡 Technical Insight: Why ${skills[0] || "React"} + ${skills[1] || "Supabase"} is my default stack for 2026.\n\n` +
          `When building production products like ${proj}, speed-to-market and security are paramount.\n\n` +
          `Here is why this combination works so well:\n` +
          `1️⃣ Real-Time Synchronization without complex WebSockets\n` +
          `2️⃣ Row Level Security (RLS) keeping data safe by default\n` +
          `3️⃣ Type-safe Server Functions reducing runtime bugs\n\n` +
          `Are you using relational databases or NoSQL for your latest AI tools? Let's discuss!\n\n${tags} #WebDevelopment #SystemDesign`,

        `🤖 Reality Check: What people think being a ${role} is like vs reality.\n\n` +
          `Expectation: Sitting in a coffee shop writing flawless AI algorithms all day ☕\n` +
          `Reality: Spending 3 hours debugging CORS headers, 2 hours tuning prompt templates, and 10 minutes writing the actual feature code 🛠️\n\n` +
          `And yet... I wouldn't trade this for anything. The feeling when your build passes cleanly is unmatched.\n\nWho else relates? 😂\n\n${tags} #DeveloperLife #TechHumor #CodeLife`,

        `🚀 Product Update: Just launched ${proj}!\n\n` +
          `We built this to solve real career challenges for developers — featuring automated ATS resume checking, mock interview simulations, and skill gap matrices.\n\n` +
          `Built with: ${top4}.\n\n` +
          `Check it out and let me know your thoughts! Feedbacks and pull requests are always welcome.\n\n${tags} #OpenSource #ProductLaunch #TechCommunity`,
      ]);
      setGenerating(null);
      setActiveSection("posts");
      toast.success("4 tailored viral LinkedIn posts generated!");
    }, 700);
  };

  const handleCopyAllPosts = () => {
    if (!generatedPosts.length) return toast.error("No posts to copy");
    const fullText = generatedPosts.map((p, i) => `--- POST #${i + 1} ---\n${p}\n\n`).join("");
    navigator.clipboard.writeText(fullText);
    toast.success("All 4 posts copied to clipboard!");
  };

  const handleDownloadPostsTxt = () => {
    if (!generatedPosts.length) return toast.error("No posts to download");
    const fullText = generatedPosts.map((p, i) => `==================== POST #${i + 1} ====================\n\n${p}\n\n`).join("");
    const blob = new Blob([fullText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LinkedIn_AI_Posts_${name.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded posts (.txt)!");
  };

  const inp =
    "w-full text-sm px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition";
  const BANNER_PRESETS = [
    "linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#312e81 100%)",
    "linear-gradient(135deg,#064e3b 0%,#047857 100%)",
    "linear-gradient(135deg,#831843 0%,#be185d 100%)",
    "linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%)",
    "linear-gradient(135deg,#422006 0%,#c2410c 100%)",
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap border-b pb-4"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md">
            <Linkedin className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">LinkedIn Profile Optimizer & Post Generator</h2>
            <p className="text-sm text-muted-foreground">
              Build every profile section, auto-generate AI headlines & viral posts — inspect in live preview.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleAutoFillAccount}
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-muted/60 hover:bg-muted text-foreground border border-border transition flex items-center gap-1.5 cursor-pointer"
          >
            <UserCheck className="h-3.5 w-3.5 text-blue-600" /> Auto-Fill Account Profile
          </button>
          <div className="h-4 w-[1px] bg-border mx-1 hidden sm:block" />
          {(["edit", "preview", "posts"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all border cursor-pointer",
                activeSection === s
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-muted/40 border-border text-muted-foreground hover:bg-muted",
              )}
            >
              {s === "edit" ? "Edit Profile" : s === "preview" ? "Live Preview" : "AI Posts"}
            </button>
          ))}
        </div>
      </motion.div>

      {/* EDIT PANEL */}
      {activeSection === "edit" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-5">
            {/* Photo + Banner Card */}
            <Card className="rounded-2xl border shadow-sm overflow-hidden">
              <div className="h-24 w-full relative" style={{ background: bannerBg }}>
                <div className="absolute top-2 right-2 flex gap-1.5">
                  {BANNER_PRESETS.map((bg, i) => (
                    <button
                      key={i}
                      onClick={() => setBannerBg(bg)}
                      className={cn(
                        "w-5 h-5 rounded-full border-2 shadow transition hover:scale-110 cursor-pointer",
                        bannerBg === bg ? "border-white" : "border-white/30",
                      )}
                      style={{ background: bg }}
                      title="Change banner color"
                    />
                  ))}
                </div>
              </div>
              <div className="px-5 pb-5 pt-3 -mt-10 flex items-end gap-4">
                <div className="relative shrink-0">
                  {profilePhoto && !photoError ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      onError={() => setPhotoError(true)}
                      className="h-20 w-20 rounded-full border-4 border-card bg-slate-900 object-cover shadow-xl"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full border-4 border-card bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white flex items-center justify-center font-black text-2xl shadow-xl">
                      {name?.trim() ? name.trim().charAt(0).toUpperCase() : "V"}
                    </div>
                  )}
                  <button
                    onClick={() => photoRef.current?.click()}
                    className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:scale-110 transition cursor-pointer"
                    title="Upload photo"
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                  <input
                    ref={photoRef}
                    id="li-photo"
                    name="li-photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
                <div className="flex-1 space-y-2 min-w-0 pt-8">
                  <input
                    id="li-name"
                    name="li-name"
                    className={inp}
                    placeholder="Full Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      id="li-pronouns"
                      name="li-pronouns"
                      className={inp}
                      placeholder="Pronouns (He/Him)"
                      value={pronouns}
                      onChange={(e) => setPronouns(e.target.value)}
                    />
                    <input
                      id="li-location"
                      name="li-location"
                      className={inp}
                      placeholder="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Headline Section */}
            <Card className="p-4 rounded-2xl border shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PenLine className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-bold">Headline</h3>
                </div>
                <button
                  onClick={handleGenerateHeadlines}
                  disabled={generating === "headlines"}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {generating === "headlines" ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}{" "}
                  AI Generate
                </button>
              </div>
              <input
                id="li-headline"
                name="li-headline"
                className={inp}
                placeholder="e.g. AI Engineer | Full Stack Developer | Founder @ Learnify AI"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
              {generatedHeadlines.length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Suggested Headlines (Click Use to Apply)
                  </p>
                  {generatedHeadlines.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2.5 rounded-xl border bg-muted/30 hover:border-primary/40 transition text-xs"
                    >
                      <span className="flex-1 font-medium text-foreground">{h}</span>
                      <button
                        onClick={() => {
                          setHeadline(h);
                          navigator.clipboard.writeText(h);
                          toast.success("Applied to profile!");
                        }}
                        className="shrink-0 px-2.5 py-1 bg-primary text-primary-foreground rounded-md text-[10px] font-bold hover:opacity-90 transition cursor-pointer"
                      >
                        Use
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* About Section */}
            <Card className="p-4 rounded-2xl border shadow-sm space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-emerald-600" />
                  <h3 className="text-sm font-bold">About / Summary</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 bg-muted p-0.5 rounded-lg">
                    {(["story", "recruiter", "executive", "creative"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setAboutStyle(s)}
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold capitalize transition cursor-pointer",
                          aboutStyle === s
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleOptimizeAbout}
                    disabled={generating === "about"}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {generating === "about" ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}{" "}
                    Optimize
                  </button>
                </div>
              </div>
              <textarea
                id="li-about"
                name="li-about"
                className={`${inp} min-h-[110px] resize-none`}
                placeholder="Write your LinkedIn About / Summary..."
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
              {optimizedAbout && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                      Optimized Preview ({aboutStyle} style)
                    </p>
                    <button
                      onClick={() => {
                        setAbout(optimizedAbout);
                        setOptimizedAbout("");
                        toast.success("Applied to your About section!");
                      }}
                      className="text-xs font-bold px-2.5 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition cursor-pointer"
                    >
                      Apply to Profile
                    </button>
                  </div>
                  <p className="text-xs leading-relaxed whitespace-pre-line max-h-44 overflow-y-auto font-sans">
                    {optimizedAbout}
                  </p>
                </div>
              )}
            </Card>

            {/* Skills */}
            <Card className="p-4 rounded-2xl border shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-600" />
                <h3 className="text-sm font-bold">Skills & Endorsements ({skills.length})</h3>
              </div>
              <div className="flex gap-2">
                <input
                  id="li-skill"
                  name="li-skill"
                  className={`${inp} flex-1`}
                  placeholder="Add a skill (e.g. React, Python, SQL)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition shrink-0 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300/40 text-xs font-bold"
                    >
                      {s}
                      <button
                        onClick={() => removeSkill(i)}
                        className="hover:text-rose-500 transition ml-0.5 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Featured Section */}
            <Card className="p-4 rounded-2xl border shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-violet-600" />
                  <h3 className="text-sm font-bold">Featured Links & Posts</h3>
                </div>
                <button
                  onClick={addFeatured}
                  className="text-xs font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Item
                </button>
              </div>
              {featuredItems.map((f, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto] gap-2 items-start">
                  <div className="space-y-1.5">
                    <input
                      id={`li-feat-t-${i}`}
                      name={`li-feat-t-${i}`}
                      className={inp}
                      placeholder="Title (e.g. Learnify AI)"
                      value={f.title}
                      onChange={(e) => updateFeatured(i, "title", e.target.value)}
                    />
                    <input
                      id={`li-feat-u-${i}`}
                      name={`li-feat-u-${i}`}
                      className={inp}
                      placeholder="URL (https://...)"
                      value={f.url}
                      onChange={(e) => updateFeatured(i, "url", e.target.value)}
                    />
                  </div>
                  {featuredItems.length > 1 && (
                    <button
                      onClick={() => removeFeatured(i)}
                      className="mt-2 text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </Card>

            {/* Experience */}
            <Card className="p-4 rounded-2xl border shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BriefcaseIcon className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-bold">Work Experience</h3>
                </div>
                <button
                  onClick={addExp}
                  className="text-xs font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Experience
                </button>
              </div>
              {experiences.map((exp, i) => (
                <div key={i} className="rounded-xl border p-3 space-y-2 bg-muted/20 relative">
                  {experiences.length > 1 && (
                    <button
                      onClick={() => removeExp(i)}
                      className="absolute top-2 right-2 text-rose-500 hover:text-rose-600 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      id={`li-exp-c-${i}`}
                      name={`li-exp-c-${i}`}
                      className={inp}
                      placeholder="Company *"
                      value={exp.company}
                      onChange={(e) => updateExp(i, "company", e.target.value)}
                    />
                    <input
                      id={`li-exp-r-${i}`}
                      name={`li-exp-r-${i}`}
                      className={inp}
                      placeholder="Role / Title *"
                      value={exp.role}
                      onChange={(e) => updateExp(i, "role", e.target.value)}
                    />
                  </div>
                  <input
                    id={`li-exp-p-${i}`}
                    name={`li-exp-p-${i}`}
                    className={inp}
                    placeholder="Period (e.g. Jan 2024 – Present)"
                    value={exp.period}
                    onChange={(e) => updateExp(i, "period", e.target.value)}
                  />
                  <textarea
                    id={`li-exp-d-${i}`}
                    name={`li-exp-d-${i}`}
                    className={`${inp} min-h-[64px] resize-none`}
                    placeholder="Key achievements, impact, tools used..."
                    value={exp.desc}
                    onChange={(e) => updateExp(i, "desc", e.target.value)}
                  />
                </div>
              ))}
            </Card>

            {/* Projects */}
            <Card className="p-4 rounded-2xl border shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-emerald-600" />
                  <h3 className="text-sm font-bold">Key Projects</h3>
                </div>
                <button
                  onClick={addProject}
                  className="text-xs font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Project
                </button>
              </div>
              {projects.map((p, i) => (
                <div key={i} className="rounded-xl border p-3 space-y-2 bg-muted/20 relative">
                  {projects.length > 1 && (
                    <button
                      onClick={() => removeProject(i)}
                      className="absolute top-2 right-2 text-rose-500 hover:text-rose-600 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      id={`li-proj-n-${i}`}
                      name={`li-proj-n-${i}`}
                      className={inp}
                      placeholder="Project Name"
                      value={p.name}
                      onChange={(e) => updateProject(i, "name", e.target.value)}
                    />
                    <input
                      id={`li-proj-u-${i}`}
                      name={`li-proj-u-${i}`}
                      className={inp}
                      placeholder="URL (optional)"
                      value={p.url}
                      onChange={(e) => updateProject(i, "url", e.target.value)}
                    />
                  </div>
                  <textarea
                    id={`li-proj-d-${i}`}
                    name={`li-proj-d-${i}`}
                    className={`${inp} min-h-[56px] resize-none`}
                    placeholder="What did you build? Stack? Impact?"
                    value={p.desc}
                    onChange={(e) => updateProject(i, "desc", e.target.value)}
                  />
                </div>
              ))}
            </Card>

            {/* Education */}
            <Card className="p-4 rounded-2xl border shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-indigo-600" />
                  <h3 className="text-sm font-bold">Education</h3>
                </div>
                <button
                  onClick={addEdu}
                  className="text-xs font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Education
                </button>
              </div>
              {education.map((edu, i) => (
                <div key={i} className="rounded-xl border p-3 space-y-2 bg-muted/20 relative">
                  {education.length > 1 && (
                    <button
                      onClick={() => removeEdu(i)}
                      className="absolute top-2 right-2 text-rose-500 hover:text-rose-600 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <input
                    id={`li-edu-i-${i}`}
                    name={`li-edu-i-${i}`}
                    className={inp}
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => updateEdu(i, "institution", e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      id={`li-edu-d-${i}`}
                      name={`li-edu-d-${i}`}
                      className={inp}
                      placeholder="Degree / Course"
                      value={edu.degree}
                      onChange={(e) => updateEdu(i, "degree", e.target.value)}
                    />
                    <input
                      id={`li-edu-y-${i}`}
                      name={`li-edu-y-${i}`}
                      className={inp}
                      placeholder="Year (e.g. 2020-2024)"
                      value={edu.year}
                      onChange={(e) => updateEdu(i, "year", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </Card>

            {/* Generate Posts CTA */}
            <button
              onClick={handleGeneratePosts}
              disabled={generating === "posts"}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition shadow-lg shadow-blue-500/20 disabled:opacity-60 cursor-pointer"
            >
              {generating === "posts" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generate 4 Viral LinkedIn Posts from My Profile
            </button>
          </div>
        </div>
      )}

      {/* LIVE PREVIEW */}
      {activeSection === "preview" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          {/* Simulated LinkedIn Card */}
          <div className="rounded-2xl border shadow-xl overflow-hidden bg-card">
            {/* Banner */}
            <div className="h-40 w-full relative" style={{ background: bannerBg }}>
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/40 text-white text-[11px] font-bold backdrop-blur-md flex items-center gap-1.5">
                <Globe className="h-3 w-3" /> Public Profile Preview
              </div>
            </div>

            {/* Header info */}
            <div className="px-6 pb-6 -mt-14">
              <div className="flex items-end justify-between flex-wrap gap-4">
                <div className="flex items-end gap-4">
                  <div className="relative group shrink-0">
                    {profilePhoto && !photoError ? (
                      <img
                        src={profilePhoto}
                        alt={name}
                        onError={() => setPhotoError(true)}
                        className="h-28 w-28 rounded-full border-4 border-card bg-slate-900 object-cover shadow-2xl transition group-hover:brightness-90"
                      />
                    ) : (
                      <div className="h-28 w-28 rounded-full border-4 border-card bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white flex items-center justify-center font-black text-4xl shadow-2xl">
                        {name?.trim() ? name.trim().charAt(0).toUpperCase() : "V"}
                      </div>
                    )}
                    <button
                      onClick={() => photoRef.current?.click()}
                      className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition cursor-pointer"
                      title="Upload photo"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="pb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-2xl text-foreground">{name || "Your Name"}</h3>
                      <CheckCircle2 className="h-5 w-5 text-blue-500 fill-blue-500/20 shrink-0" />
                      {pronouns && (
                        <span className="text-xs text-muted-foreground font-semibold px-2 py-0.5 rounded-full bg-muted">
                          ({pronouns})
                        </span>
                      )}
                    </div>
                    {headline && (
                      <p className="text-sm font-semibold mt-1 max-w-xl text-foreground/90 leading-snug">
                        {headline}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground font-medium flex-wrap">
                      {location && (
                        <span className="flex items-center gap-1">
                          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                          {location}
                        </span>
                      )}
                      <span className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer">
                        500+ connections
                      </span>
                      <span
                        onClick={() => toast.info(`Contact info: ${name} · ${location}`)}
                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                      >
                        Contact info
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pb-1 flex-wrap">
                  <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-sm cursor-pointer">
                    Open to Work
                  </Badge>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-sm">
                    Message
                  </Button>
                  <Button size="sm" variant="outline" className="font-bold text-xs rounded-full">
                    More Options
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* About Card */}
          {about && (
            <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-3">
              <h4 className="font-extrabold text-base flex items-center gap-2">
                <MessageSquare className="h-4.5 w-4.5 text-emerald-600" /> About
              </h4>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line font-sans">
                {about}
              </p>
            </div>
          )}

          {/* Featured Card */}
          {featuredItems.some((f) => f.title) && (
            <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
              <h4 className="font-extrabold text-base flex items-center gap-2">
                <Star className="h-4.5 w-4.5 text-violet-500" /> Featured Work
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {featuredItems
                  .filter((f) => f.title)
                  .map((f, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border bg-muted/30 flex items-center gap-3 hover:border-primary/40 transition group"
                    >
                      <div className="p-2.5 bg-violet-500/10 text-violet-600 rounded-lg shrink-0">
                        <ExternalLink className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate group-hover:text-primary transition">{f.title}</p>
                        {f.url && <p className="text-xs text-blue-600 truncate mt-0.5">{f.url}</p>}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Experience Card */}
          {experiences.some((e) => e.company) && (
            <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-5">
              <h4 className="font-extrabold text-base flex items-center gap-2">
                <BriefcaseIcon className="h-4.5 w-4.5 text-blue-600" /> Experience
              </h4>
              <div className="space-y-4">
                {experiences
                  .filter((e) => e.company)
                  .map((exp, i) => (
                    <div key={i} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                      <div className="h-11 w-11 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                        <Building className="h-5.5 w-5.5" />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <p className="font-bold text-base text-foreground">{exp.role}</p>
                        <p className="text-xs text-muted-foreground font-semibold">
                          {exp.company}
                          {exp.period ? ` · ${exp.period}` : ""}
                        </p>
                        {exp.desc && (
                          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed whitespace-pre-line">
                            {exp.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Projects Card */}
          {projects.some((p) => p.name) && (
            <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
              <h4 className="font-extrabold text-base flex items-center gap-2">
                <Code2 className="h-4.5 w-4.5 text-emerald-600" /> Projects
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {projects
                  .filter((p) => p.name)
                  .map((p, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border bg-muted/30 space-y-2 hover:border-primary/40 transition"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm text-foreground">{p.name}</p>
                        {p.url && (
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      {p.desc && (
                        <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Skills Card */}
          {skills.length > 0 && (
            <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
              <h4 className="font-extrabold text-base flex items-center gap-2">
                <Zap className="h-4.5 w-4.5 text-amber-500" /> Skills & Endorsements
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-full border bg-muted/50 text-foreground text-xs font-bold flex items-center gap-1.5"
                  >
                    <Check className="h-3 w-3 text-emerald-500" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education Card */}
          {education.some((e) => e.institution) && (
            <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
              <h4 className="font-extrabold text-base flex items-center gap-2">
                <GraduationCap className="h-4.5 w-4.5 text-indigo-600" /> Education
              </h4>
              {education
                .filter((e) => e.institution)
                .map((edu, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{edu.institution}</p>
                      <p className="text-xs text-muted-foreground font-semibold">
                        {edu.degree}
                        {edu.year ? ` · ${edu.year}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </motion.div>
      )}

      {/* AI POSTS */}
      {activeSection === "posts" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-between flex-wrap gap-3 border-b pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <h3 className="font-extrabold text-lg">AI-Generated LinkedIn Posts ({generatedPosts.length})</h3>
            </div>
            <div className="flex items-center gap-2">
              {generatedPosts.length > 0 && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyAllPosts}
                    className="text-xs font-bold gap-1.5"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy All Posts
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownloadPostsTxt}
                    className="text-xs font-bold gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" /> Download (.txt)
                  </Button>
                </>
              )}
              <button
                onClick={handleGeneratePosts}
                disabled={generating === "posts"}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {generating === "posts" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}{" "}
                Regenerate
              </button>
            </div>
          </div>

          {generatedPosts.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed space-y-4 bg-card/40">
              <Sparkles className="h-10 w-10 text-muted-foreground/30 mx-auto" />
              <p className="text-sm font-bold text-foreground">No generated posts yet</p>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Fill in your profile in the Edit tab and click Generate to produce 4 high-converting LinkedIn posts!
              </p>
              <button
                onClick={handleGeneratePosts}
                className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition cursor-pointer shadow-md"
              >
                Generate Posts Now
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {generatedPosts.map((post, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border bg-card p-5 space-y-3 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-500/10 px-2.5 py-0.5 rounded-md">
                        {i === 0 ? "🎉 Milestone" : i === 1 ? "💡 Tech Insight" : i === 2 ? "🤖 Dev Reality" : "🚀 Product Launch"}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(post);
                          toast.success(`Post #${i + 1} copied!`);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 bg-muted hover:bg-primary/10 hover:text-primary rounded-full text-xs font-bold transition cursor-pointer"
                      >
                        <Copy className="h-3 w-3" /> Copy
                      </button>
                    </div>
                    <pre className="text-xs text-foreground font-sans whitespace-pre-line leading-relaxed max-h-64 overflow-y-auto pr-1">
                      {post}
                    </pre>
                  </div>
                  <div className="pt-2 border-t text-[10px] text-muted-foreground flex justify-between items-center">
                    <span>Ready for LinkedIn</span>
                    <span className="font-semibold">{post.length} chars</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function CareerAnalyticsView() {
  const { user } = useAuth();
  const [chartType, setChartType] = useState<"salary" | "demand">("salary");
  const [selectedRole, setSelectedRole] = useState<string>("AI/ML Eng");
  const [locationFilter, setLocationFilter] = useState<string>("India");

  const { data: userCourseCategories } = useQuery({
    queryKey: ["user-analytics-cats", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("enrollments")
        .select("courses:course_id(category)")
        .eq("user_id", user.id);
      return [
        ...new Set((data || []).map((r: any) => r.courses?.category).filter(Boolean)),
      ] as string[];
    },
    enabled: !!user,
  });

  const salaryData = [
    {
      role: "AI/ML Eng",
      entry: "8",
      mid: "18",
      senior: "35",
      match: userCourseCategories?.some((c) => /ai|ml|llm|gen/i.test(c)) ? 96 : 88,
      companies: ["Google DeepMind", "OpenAI", "Microsoft", "Zomato", "Swiggy AI"],
      skills: ["PyTorch", "LLM APIs", "Python", "Vector DBs", "RAG Pipeline"],
      growth: "+185%",
      desc: "Architecting generative AI models, vector search indexing, and LLM application pipelines.",
    },
    {
      role: "Full Stack",
      entry: "5",
      mid: "12",
      senior: "22",
      match: userCourseCategories?.some((c) => /full|web|mern/i.test(c)) ? 95 : 75,
      companies: ["Razorpay", "Flipkart", "Postman", "Atlassian", "PhonePe"],
      skills: ["React 19", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
      growth: "+45%",
      desc: "Building end-to-end user interfaces, backend APIs, and real-time database applications.",
    },
    {
      role: "Backend Dev",
      entry: "4",
      mid: "10",
      senior: "20",
      match: userCourseCategories?.some((c) => /back|api|node/i.test(c)) ? 90 : 65,
      companies: ["Uber India", "CRED", "Paytm", "Swiggy", "JPMorgan"],
      skills: ["Go / Python", "Node.js", "Microservices", "Redis", "Kafka"],
      growth: "+50%",
      desc: "Designing high-throughput API gateways, database schemas, and message queues.",
    },
    {
      role: "Frontend Dev",
      entry: "3.5",
      mid: "8",
      senior: "15",
      match: userCourseCategories?.some((c) => /front|ui|react/i.test(c)) ? 92 : 70,
      companies: ["Swiggy", "Unacademy", "Zepto", "Cars24", "InMobi"],
      skills: ["React", "TypeScript", "Tailwind CSS", "Figma", "Web Performance"],
      growth: "+35%",
      desc: "Designing responsive, accessible, pixel-perfect user interfaces with micro-animations.",
    },
    {
      role: "Data Scientist",
      entry: "6",
      mid: "15",
      senior: "28",
      match: userCourseCategories?.some((c) => /data|ml|ai/i.test(c)) ? 88 : 60,
      companies: ["Fractal Analytics", "Tiger Analytics", "Mu Sigma", "Amazon", "Walmart Labs"],
      skills: ["Python", "SQL", "Pandas", "Scikit-Learn", "Tableau / PowerBI"],
      growth: "+65%",
      desc: "Extracting actionable business insights, predictive modeling, and statistical analysis.",
    },
    {
      role: "DevOps Eng",
      entry: "5.5",
      mid: "13",
      senior: "25",
      match: userCourseCategories?.some((c) => /devops|cloud|aws/i.test(c)) ? 87 : 55,
      companies: ["AWS India", "Red Hat", "NVIDIA", "Dell Technologies", "Oracle"],
      skills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD Pipelines"],
      growth: "+62%",
      desc: "Managing cloud infrastructure, container orchestration, automated deployments, and security monitoring.",
    },
    {
      role: "UI/UX Designer",
      entry: "3.5",
      mid: "9",
      senior: "18",
      match: userCourseCategories?.some((c) => /ui|ux|design|figma/i.test(c)) ? 91 : 58,
      companies: ["Licious", "CRED", "MakeMyTrip", "OYO", "Freecharge"],
      skills: ["Figma", "User Research", "Wireframing", "Design Systems", "Prototyping"],
      growth: "+40%",
      desc: "Creating high-fidelity design prototypes, user journey flows, and cohesive brand design systems.",
    },
    {
      role: "Product Manager",
      entry: "6",
      mid: "15",
      senior: "30",
      match: userCourseCategories?.some((c) => /product|manage|pm/i.test(c)) ? 85 : 62,
      companies: ["Paytm", "MakeMyTrip", "Freshworks", "Ola", "BrowserStack"],
      skills: ["Product Roadmap", "User Stories", "A/B Testing", "Agile / Scrum", "Data Analytics"],
      growth: "+55%",
      desc: "Leading cross-functional engineering teams, feature prioritization, and product vision.",
    },
  ];

  const demandData = [
    { skill: "Generative AI", demand: 94, growth: 185 },
    { skill: "Agentic AI & MCP", demand: 88, growth: 210 },
    { skill: "Full Stack (React+Node)", demand: 85, growth: 45 },
    { skill: "DevOps & Kubernetes", demand: 78, growth: 62 },
    { skill: "Data Engineering", demand: 76, growth: 55 },
    { skill: "Cybersecurity", demand: 72, growth: 70 },
    { skill: "Cloud Architecture", demand: 70, growth: 48 },
    { skill: "Mobile App Dev", demand: 65, growth: 30 },
  ];

  const bestFit = [...salaryData].sort((a, b) => b.match - a.match)[0];
  const activeRoleData = salaryData.find((r) => r.role === selectedRole) || salaryData[0];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap border-b pb-4"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-violet-600 text-white rounded-2xl shadow-md">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Career & Salary Analytics</h2>
            <p className="text-sm text-muted-foreground">
              Personalized market benchmarks & hiring demands based on your courses & interests.
            </p>
          </div>
        </div>

        {/* Location Filter Controls */}
        <div className="flex items-center gap-2">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="text-xs font-bold h-9 px-3 rounded-xl border border-input bg-card shadow-sm cursor-pointer"
          >
            <option value="India">📍 India (Pan India)</option>
            <option value="Bengaluru">📍 Bengaluru / NCR</option>
            <option value="Hyderabad">📍 Hyderabad / Pune</option>
            <option value="Remote">🌐 Remote / Global</option>
          </select>
        </div>
      </motion.div>

      {/* Personalized Best-Fit Role Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-cyan-500/15 border border-emerald-500/30 flex items-center justify-between gap-4 flex-wrap shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-md">
            <Trophy className="h-5.5 w-5.5" />
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Personalized Career Recommendation
            </div>
            <div className="text-base sm:text-lg font-extrabold text-foreground mt-0.5">
              Your Top Match:{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                {bestFit?.role}
              </span>{" "}
              — {bestFit?.match}% match based on your learning trajectory
            </div>
          </div>
        </div>
        <button
          onClick={() => setSelectedRole(bestFit.role)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md cursor-pointer transition"
        >
          View Role Insights
        </button>
      </motion.div>

      {/* 3 Metric Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            label: "Avg Entry Salary",
            value: `₹${activeRoleData.entry}L - ₹${activeRoleData.senior}L LPA`,
            sub: `${activeRoleData.growth} demand growth YoY`,
            color: "text-emerald-600 dark:text-emerald-400",
            icon: DollarSign,
          },
          {
            label: "Top Hiring Hubs",
            value: "Bengaluru, NCR, Pune, Hyderabad",
            sub: "68% of active job openings",
            color: "text-blue-600 dark:text-blue-400",
            icon: Map,
          },
          {
            label: "Most Demanded Skill",
            value: activeRoleData.skills[0] || "Generative AI",
            sub: "210% YoY skill surge",
            color: "text-violet-600 dark:text-violet-400",
            icon: Zap,
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-5 rounded-xl border shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
                  {item.label}
                </p>
              </div>
              <p className={`text-lg sm:text-xl font-extrabold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-muted-foreground font-semibold mt-1">{item.sub}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Interactive Selected Role Detail Card */}
      <Card className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-foreground">{activeRoleData.role} Breakdown</h3>
              <Badge className="bg-blue-600 text-white font-bold text-xs">
                {activeRoleData.match}% Match
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{activeRoleData.desc}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-bold">Select Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="text-xs font-bold h-9 px-3 rounded-xl border border-input bg-background shadow-sm cursor-pointer"
            >
              {salaryData.map((r) => (
                <option key={r.role} value={r.role}>
                  {r.role} ({r.match}%)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2 bg-muted/20 p-4 rounded-xl border">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
              Core Required Skills
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {activeRoleData.skills.map((s, i) => (
                <Badge key={i} variant="secondary" className="text-xs font-bold gap-1">
                  <Check className="h-3 w-3 text-emerald-500" /> {s}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2 bg-muted/20 p-4 rounded-xl border">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
              Top Hiring Companies in India
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {activeRoleData.companies.map((c, i) => (
                <Badge key={i} variant="outline" className="text-xs font-semibold">
                  <Building className="h-3 w-3 mr-1 text-blue-500" /> {c}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Salary & Demand Benchmarks Bar Chart */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b bg-muted/20 gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-bold">Salary Benchmarks (₹ LPA) & Market Demand</h3>
          </div>
          <div className="flex gap-1 bg-muted rounded-lg p-0.5">
            <button
              onClick={() => setChartType("salary")}
              className={`px-3.5 py-1 text-[11px] rounded-md font-bold transition cursor-pointer ${chartType === "salary" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-background text-muted-foreground"}`}
            >
              Salary Ranges
            </button>
            <button
              onClick={() => setChartType("demand")}
              className={`px-3.5 py-1 text-[11px] rounded-md font-bold transition cursor-pointer ${chartType === "demand" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-background text-muted-foreground"}`}
            >
              Skill Growth (%)
            </button>
          </div>
        </div>
        <div className="p-5 space-y-3">
          {(chartType === "salary" ? salaryData : demandData).map((item: any, i: number) => {
            const isSelected = item.role === selectedRole;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => item.role && setSelectedRole(item.role)}
                className={cn(
                  "p-3 rounded-xl border transition-all cursor-pointer space-y-1.5",
                  isSelected
                    ? "bg-primary/10 border-primary shadow-xs ring-1 ring-primary/20"
                    : "hover:bg-muted/30 border-border/70 bg-card",
                )}
              >
                <div className="flex justify-between text-xs items-center">
                  <span className="font-bold text-foreground flex items-center gap-2">
                    {item.skill || item.role}
                    {item.match && item.match >= 90 && (
                      <Badge className="text-[9px] px-1.5 py-0 bg-emerald-500/10 text-emerald-600 border-emerald-200 font-extrabold">
                        Top Fit
                      </Badge>
                    )}
                  </span>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400">
                    {chartType === "salary"
                      ? `₹${item.entry}L - ₹${item.senior}L LPA`
                      : `${item.demand}% Demand`}
                  </span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden flex gap-0.5">
                  {chartType === "salary" ? (
                    <>
                      <div
                        className="h-full bg-blue-400 rounded-l-full transition-all"
                        style={{ width: `${(Number(item.entry) / 35) * 100}%` }}
                        title={`Entry: ₹${item.entry}L`}
                      />
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${((Number(item.mid) - Number(item.entry)) / 35) * 100}%` }}
                        title={`Mid: ₹${item.mid}L`}
                      />
                      <div
                        className="h-full bg-blue-600 rounded-r-full transition-all"
                        style={{ width: `${((Number(item.senior) - Number(item.mid)) / 35) * 100}%` }}
                        title={`Senior: ₹${item.senior}L`}
                      />
                    </>
                  ) : (
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full transition-all"
                      style={{ width: `${item.demand}%` }}
                    />
                  )}
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  {chartType === "salary" ? (
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1 font-semibold">
                        <span className="w-2 h-2 rounded-sm bg-blue-400" /> Entry (₹{item.entry}L)
                      </span>
                      <span className="flex items-center gap-1 font-semibold">
                        <span className="w-2 h-2 rounded-sm bg-blue-500" /> Mid (₹{item.mid}L)
                      </span>
                      <span className="flex items-center gap-1 font-semibold">
                        <span className="w-2 h-2 rounded-sm bg-blue-600" /> Senior (₹{item.senior}L)
                      </span>
                    </div>
                  ) : (
                    <span>
                      YoY Growth Surge: <span className="text-emerald-600 font-extrabold">+{item.growth}%</span>
                    </span>
                  )}
                  {item.match && <span className="font-bold text-primary">{item.match}% Skill Match</span>}
                </div>
              </motion.div>
            );
          })}
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
  salary?: string;
  location?: string;
  notes?: string;
}

function InternshipTrackerView() {
  const [apps, setApps] = useState<InternshipApp[]>([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<InternshipApp["status"]>("Applied");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCompany, setEditCompany] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editSalary, setEditSalary] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState<InternshipApp["status"]>("Applied");
  const [editDate, setEditDate] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("learnify_internships_v2");
    if (saved) {
      try {
        setApps(JSON.parse(saved));
      } catch {
        setApps([]);
      }
    } else {
      const defaultApps: InternshipApp[] = [
        {
          id: "1",
          company: "Google",
          role: "SWE Intern",
          status: "Interviewing",
          date: "2026-07-15",
          salary: "₹1,20,000 / mo",
          location: "Bengaluru",
          notes: "Round 2 Technical Interview scheduled for next Monday.",
        },
        {
          id: "2",
          company: "Microsoft",
          role: "Full Stack Engineer Intern",
          status: "Offer",
          date: "2026-07-01",
          salary: "₹1,00,000 / mo",
          location: "Hyderabad",
          notes: "Received offer letter! Accepting before July 31.",
        },
        {
          id: "3",
          company: "Razorpay",
          role: "Frontend Developer",
          status: "Applied",
          date: "2026-07-28",
          salary: "₹15 LPA",
          location: "Remote",
          notes: "Applied via referral link.",
        },
      ];
      setApps(defaultApps);
      localStorage.setItem("learnify_internships_v2", JSON.stringify(defaultApps));
    }
  }, []);

  const saveApps = (newApps: InternshipApp[]) => {
    setApps(newApps);
    localStorage.setItem("learnify_internships_v2", JSON.stringify(newApps));
  };

  const handleLoadSampleData = () => {
    const samples: InternshipApp[] = [
      {
        id: crypto.randomUUID(),
        company: "Google India",
        role: "Software Engineering Intern",
        status: "Interviewing",
        date: "2026-07-20",
        salary: "₹1,20,000 / mo",
        location: "Bengaluru",
        notes: "Passed Resume Screen & DSA Assessment.",
      },
      {
        id: crypto.randomUUID(),
        company: "Microsoft",
        role: "AI / ML Developer",
        status: "Offer",
        date: "2026-07-05",
        salary: "₹18 LPA",
        location: "Hyderabad",
        notes: "Offer Letter Received! Valid till Aug 15.",
      },
      {
        id: crypto.randomUUID(),
        company: "Swiggy",
        role: "Full Stack AI Developer",
        status: "Applied",
        date: "2026-07-29",
        salary: "₹16 LPA",
        location: "Remote",
        notes: "Applied via Learnify AI Job Board.",
      },
      {
        id: crypto.randomUUID(),
        company: "Atlassian",
        role: "Frontend Engineer Intern",
        status: "Rejected",
        date: "2026-06-18",
        salary: "₹80,000 / mo",
        location: "Bengaluru",
        notes: "Will re-apply next hiring cycle.",
      },
    ];
    saveApps(samples);
    toast.success("Loaded 4 realistic sample applications!");
  };

  const addApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) {
      toast.error("Enter company and role");
      return;
    }
    const newApp: InternshipApp = {
      id: crypto.randomUUID(),
      company: company.trim(),
      role: role.trim(),
      status,
      date: date || new Date().toISOString().slice(0, 10),
      salary: salary.trim() || undefined,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
    };
    saveApps([newApp, ...apps]);
    setCompany("");
    setRole("");
    setSalary("");
    setLocation("");
    setNotes("");
    setStatus("Applied");
    setDate(new Date().toISOString().slice(0, 10));
    toast.success("Application tracked successfully!");
  };

  const handleUpdateStatus = (id: string, newStatus: InternshipApp["status"]) => {
    saveApps(apps.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    toast.success(`Moved to ${newStatus}!`);
  };

  const handleExportCSV = () => {
    if (!apps.length) return toast.error("No applications to export");
    const headers = "Company,Role,Status,Date,Salary/Stipend,Location,Notes\n";
    const rows = apps
      .map(
        (a) =>
          `"${a.company}","${a.role}","${a.status}","${a.date}","${a.salary || ""}","${a.location || ""}","${(a.notes || "").replace(/"/g, '""')}"`,
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Job_Applications_Tracker_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported CSV spreadsheet!");
  };

  const countByStatus = (s: string) => apps.filter((a) => a.status === s).length;
  const pipelineData = [
    { label: "Applied", count: countByStatus("Applied"), color: "bg-blue-500", border: "border-blue-500/30" },
    { label: "Interviewing", count: countByStatus("Interviewing"), color: "bg-amber-500", border: "border-amber-500/30" },
    { label: "Offer", count: countByStatus("Offer"), color: "bg-emerald-500", border: "border-emerald-500/30" },
    { label: "Rejected", count: countByStatus("Rejected"), color: "bg-rose-500", border: "border-rose-500/30" },
  ];

  const filteredApps = apps.filter((a) => {
    const matchesSearch =
      a.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.location && a.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === "All" || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const startEdit = (app: InternshipApp) => {
    setEditingId(app.id);
    setEditCompany(app.company);
    setEditRole(app.role);
    setEditStatus(app.status);
    setEditDate(app.date);
    setEditSalary(app.salary || "");
    setEditLocation(app.location || "");
    setEditNotes(app.notes || "");
  };

  const updateApp = (id: string) => {
    if (!editCompany.trim() || !editRole.trim()) {
      toast.error("Company and role cannot be empty");
      return;
    }
    saveApps(
      apps.map((a) =>
        a.id === id
          ? {
              ...a,
              company: editCompany.trim(),
              role: editRole.trim(),
              status: editStatus,
              date: editDate,
              salary: editSalary.trim() || undefined,
              location: editLocation.trim() || undefined,
              notes: editNotes.trim() || undefined,
            }
          : a,
      ),
    );
    setEditingId(null);
    toast.success("Updated application!");
  };

  const deleteApp = (id: string) => {
    saveApps(apps.filter((a) => a.id !== id));
    toast.success("Application deleted");
  };

  const getStatusBadgeClass = (s: InternshipApp["status"]) => {
    switch (s) {
      case "Applied":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "Interviewing":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "Offer":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "Rejected":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap border-b pb-4"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-600 text-white rounded-2xl shadow-md">
            <BriefcaseIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Internship & Job Application Tracker</h2>
            <p className="text-sm text-muted-foreground">
              Track job pipeline, drag/switch application stages, log interview notes & export reports.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={handleLoadSampleData}
            className="text-xs font-bold gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Sample Data
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCSV}
            className="text-xs font-bold gap-1.5"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" /> Export CSV
          </Button>
          <div className="flex items-center gap-0.5 bg-muted p-1 rounded-xl border">
            <button
              onClick={() => setViewMode("kanban")}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer",
                viewMode === "kanban" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground",
              )}
            >
              <Kanban className="h-3.5 w-3.5" /> Kanban Board
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer",
                viewMode === "list" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground",
              )}
            >
              <List className="h-3.5 w-3.5" /> List View
            </button>
          </div>
        </div>
      </motion.div>

      {/* Metric Pipeline Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {pipelineData.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            onClick={() => setFilterStatus(filterStatus === item.label ? "All" : item.label)}
            className={cn(
              "cursor-pointer transition-all",
              filterStatus === item.label ? "ring-2 ring-primary" : "",
            )}
          >
            <Card className="p-4 rounded-xl border shadow-sm text-center hover:shadow-md transition">
              <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-2 ${item.color}`} />
              <p className="text-2xl font-black text-foreground">{item.count}</p>
              <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mt-0.5">
                {item.label}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add New Application Form */}
      <form
        onSubmit={addApp}
        className="p-5 rounded-2xl border bg-card/60 backdrop-blur space-y-4 shadow-sm"
      >
        <h3 className="text-sm font-bold flex items-center gap-2 text-foreground">
          <Plus className="h-4 w-4 text-primary" /> Track New Internship / Job Application
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <Label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
              Company *
            </Label>
            <Input
              placeholder="e.g. Google, Swiggy, Razorpay"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="text-sm h-9 mt-1"
              required
            />
          </div>
          <div>
            <Label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
              Role / Position *
            </Label>
            <Input
              placeholder="e.g. Full Stack AI Intern"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="text-sm h-9 mt-1"
              required
            />
          </div>
          <div>
            <Label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
              Salary / Stipend
            </Label>
            <Input
              placeholder="e.g. ₹50,000/mo or ₹15 LPA"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="text-sm h-9 mt-1"
            />
          </div>
          <div>
            <Label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
              Location
            </Label>
            <Input
              placeholder="e.g. Remote / Bengaluru"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="text-sm h-9 mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-1">
          <div>
            <Label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
              Stage / Status
            </Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full text-sm h-9 px-3 rounded-md border border-input bg-background mt-1 cursor-pointer font-semibold"
            >
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <Label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
              Date Applied
            </Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-sm h-9 mt-1"
            />
          </div>
          <Button type="submit" size="sm" className="h-9 font-bold bg-primary hover:bg-primary/90 text-white">
            <Plus className="w-4 h-4 mr-1.5" /> Add Application
          </Button>
        </div>
      </form>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-muted/20 p-3 rounded-2xl border">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by company or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-background"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["All", "Applied", "Interviewing", "Offer", "Rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap border",
                filterStatus === st
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "bg-background text-muted-foreground border-border hover:bg-muted",
              )}
            >
              {st} {st !== "All" && `(${countByStatus(st)})`}
            </button>
          ))}
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(["Applied", "Interviewing", "Offer", "Rejected"] as const).map((stage) => {
            const stageApps = filteredApps.filter((a) => a.status === stage);
            const stageColors: Record<string, string> = {
              Applied: "border-t-blue-500",
              Interviewing: "border-t-amber-500",
              Offer: "border-t-emerald-500",
              Rejected: "border-t-rose-500",
            };
            return (
              <div key={stage} className={cn("rounded-2xl border bg-muted/20 p-3 space-y-3 border-t-4", stageColors[stage])}>
                <div className="flex items-center justify-between px-1">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-foreground flex items-center gap-2">
                    {stage}
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-bold">
                      {stageApps.length}
                    </Badge>
                  </h4>
                </div>

                <div className="space-y-3 min-h-[160px]">
                  {stageApps.length === 0 ? (
                    <div className="text-center py-8 border border-dashed rounded-xl text-xs text-muted-foreground">
                      No applications
                    </div>
                  ) : (
                    stageApps.map((a) => (
                      <Card key={a.id} className="p-3.5 rounded-xl border bg-card shadow-xs space-y-2 hover:shadow-md transition">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <h5 className="font-extrabold text-sm text-foreground">{a.company}</h5>
                            <p className="text-xs text-muted-foreground font-semibold">{a.role}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEdit(a)}
                              className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => deleteApp(a.id)}
                              className="text-muted-foreground hover:text-rose-500 p-1 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {a.salary && (
                          <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                            💰 {a.salary}
                          </div>
                        )}

                        {a.location && (
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Globe className="h-3 w-3" /> {a.location}
                          </div>
                        )}

                        {a.notes && (
                          <p className="text-[11px] text-muted-foreground/90 bg-muted/40 p-2 rounded-lg leading-snug line-clamp-2">
                            {a.notes}
                          </p>
                        )}

                        {/* Quick Stage Move buttons */}
                        <div className="pt-2 border-t flex items-center justify-between gap-1 text-[10px]">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {a.date}
                          </span>
                          <div className="flex items-center gap-1">
                            {stage !== "Offer" && (
                              <button
                                onClick={() => handleUpdateStatus(a.id, "Offer")}
                                className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold hover:bg-emerald-500/20 cursor-pointer"
                                title="Move to Offer"
                              >
                                → Offer
                              </button>
                            )}
                            {stage === "Applied" && (
                              <button
                                onClick={() => handleUpdateStatus(a.id, "Interviewing")}
                                className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 font-bold hover:bg-amber-500/20 cursor-pointer"
                                title="Move to Interviewing"
                              >
                                → Interview
                              </button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE LIST VIEW */}
      {viewMode === "list" && (
        <div className="space-y-3">
          {filteredApps.length === 0 ? (
            <div className="text-center p-12 rounded-2xl border border-dashed space-y-2 bg-card">
              <BriefcaseIcon className="h-10 w-10 text-muted-foreground/35 mx-auto mb-2" />
              <p className="text-sm font-bold text-foreground">No applications found</p>
              <p className="text-xs text-muted-foreground">Add a new application above or click Load Sample Data.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredApps.map((a) => {
                const isEditing = editingId === a.id;
                return (
                  <Card
                    key={a.id}
                    className={cn(
                      "p-4 rounded-xl border bg-card transition-all space-y-3",
                      isEditing ? "border-primary ring-1 ring-primary/30" : "",
                    )}
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <Input
                            value={editCompany}
                            onChange={(e) => setEditCompany(e.target.value)}
                            placeholder="Company"
                            className="text-sm h-9"
                          />
                          <Input
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            placeholder="Role"
                            className="text-sm h-9"
                          />
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as any)}
                            className="text-sm h-9 px-3 rounded-md border border-input bg-background"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                          <Input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="text-sm h-9"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Input
                            value={editSalary}
                            onChange={(e) => setEditSalary(e.target.value)}
                            placeholder="Salary / Stipend"
                            className="text-sm h-9"
                          />
                          <Input
                            value={editLocation}
                            onChange={(e) => setEditLocation(e.target.value)}
                            placeholder="Location"
                            className="text-sm h-9"
                          />
                        </div>
                        <Input
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Interview notes..."
                          className="text-sm h-9"
                        />
                      </div>
                    ) : (
                      <div className="flex items-start justify-between flex-wrap gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0 hidden sm:block">
                            <Building className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-base text-foreground">{a.company}</span>
                              <Badge
                                variant="outline"
                                className={cn("text-xs py-0.5 px-2.5 font-bold border", getStatusBadgeClass(a.status))}
                              >
                                {a.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap font-medium">
                              <span>{a.role}</span>
                              {a.salary && <span className="text-emerald-600 dark:text-emerald-400 font-bold">• {a.salary}</span>}
                              {a.location && <span>• 📍 {a.location}</span>}
                              <span>• <Calendar className="h-3 w-3 inline mr-1" />{a.date}</span>
                            </p>
                            {a.notes && (
                              <p className="text-xs text-muted-foreground/90 bg-muted/30 p-2 rounded-lg mt-1 font-sans">
                                💬 {a.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Move stage actions */}
                        <div className="flex items-center gap-1.5">
                          <select
                            value={a.status}
                            onChange={(e) => handleUpdateStatus(a.id, e.target.value as any)}
                            className="text-xs font-bold h-8 px-2 rounded-lg border border-input bg-muted/40 cursor-pointer"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                      {isEditing ? (
                        <>
                          <Button
                            onClick={() => updateApp(a.id)}
                            size="sm"
                            className="h-8 px-3 text-xs font-bold"
                          >
                            <Check className="h-3.5 w-3.5 mr-1" /> Save
                          </Button>
                          <Button
                            onClick={() => setEditingId(null)}
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
                            className="h-8 w-8 p-0 cursor-pointer"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            onClick={() => deleteApp(a.id)}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 border-destructive/20 hover:bg-destructive/10 text-destructive cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SkillGapView() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("Full Stack AI Engineer");
  const [compareRoles, setCompareRoles] = useState<string[]>(["Full Stack AI Engineer", "Frontend Developer", "Backend Developer"]);
  const [viewMode, setViewMode] = useState<"single" | "compare">("single");

  // Custom role state
  const [showCustomRoleModal, setShowCustomRoleModal] = useState(false);
  const [customRoleName, setCustomRoleName] = useState("");
  const [customSkillName, setCustomSkillName] = useState("");
  const [customSkillWeight, setCustomSkillWeight] = useState("15");

  // Mastered skills state (persisted)
  const [masteredSkills, setMasteredSkills] = useState<string[]>(() => {
    const saved = localStorage.getItem("learnify_skill_gap_mastered_v2");
    return saved ? JSON.parse(saved) : ["React", "TypeScript", "Tailwind CSS", "Python"];
  });

  // Custom roles dictionary (persisted)
  const [customRoleDict, setCustomRoleDict] = useState<Record<string, Array<{ skill: string; weight: number; desc: string }>>>(() => {
    const saved = localStorage.getItem("learnify_skill_gap_custom_roles_v2");
    return saved ? JSON.parse(saved) : {};
  });

  const BASE_ROLE_REQUIREMENTS: Record<
    string,
    Array<{ skill: string; weight: number; desc: string }>
  > = {
    "Full Stack AI Engineer": [
      { skill: "React", weight: 20, desc: "Frontend component architecture & state" },
      { skill: "Next.js", weight: 20, desc: "Server Components & App Router" },
      { skill: "TypeScript", weight: 15, desc: "Type safety & async APIs" },
      { skill: "Python", weight: 15, desc: "Backend AI script & API logic" },
      { skill: "OpenAI", weight: 15, desc: "LLM APIs & Prompt Engineering" },
      { skill: "PostgreSQL", weight: 15, desc: "Relational database schema & queries" },
    ],
    "Frontend Developer": [
      { skill: "React", weight: 25, desc: "Hooks, Fiber & Component Lifecycle" },
      { skill: "TypeScript", weight: 25, desc: "Interfaces, Generics & Strict Typing" },
      { skill: "Tailwind CSS", weight: 20, desc: "Utility-first responsive design" },
      { skill: "Next.js", weight: 15, desc: "SSR, SSG & Routing" },
      { skill: "Figma", weight: 15, desc: "UI design translation & handoff" },
    ],
    "Backend Developer": [
      { skill: "Node.js", weight: 25, desc: "REST APIs, Express, async patterns" },
      { skill: "Python", weight: 20, desc: "FastAPI, Django, scripting" },
      { skill: "PostgreSQL", weight: 20, desc: "Schema design, queries, indexing" },
      { skill: "Redis", weight: 15, desc: "Caching, pub/sub, sessions" },
      { skill: "Docker", weight: 20, desc: "Containerization & deployment" },
    ],
    "DevOps Engineer": [
      { skill: "Docker", weight: 25, desc: "Containerization & multi-stage builds" },
      { skill: "Kubernetes", weight: 20, desc: "Cluster orchestration & pods" },
      { skill: "AWS", weight: 20, desc: "EC2, S3, RDS & Cloud VPC" },
      { skill: "Linux", weight: 18, desc: "Bash scripting & system admin" },
      { skill: "Terraform", weight: 17, desc: "Infrastructure as Code" },
    ],
    "Data Scientist": [
      { skill: "Python", weight: 30, desc: "NumPy, Pandas, Data Wrangling" },
      { skill: "Machine Learning", weight: 25, desc: "Scikit-learn, Regression, Classification" },
      { skill: "SQL", weight: 20, desc: "Complex queries, window functions" },
      { skill: "Deep Learning", weight: 15, desc: "PyTorch / TensorFlow neural nets" },
      { skill: "Data Viz", weight: 10, desc: "Matplotlib, Seaborn, Tableau" },
    ],
    ...customRoleDict,
  };

  useEffect(() => {
    localStorage.setItem("learnify_skill_gap_mastered_v2", JSON.stringify(masteredSkills));
  }, [masteredSkills]);

  useEffect(() => {
    localStorage.setItem("learnify_skill_gap_custom_roles_v2", JSON.stringify(customRoleDict));
  }, [customRoleDict]);

  const toggleSkill = (skill: string) => {
    setMasteredSkills((prev) => {
      const isMastered = prev.includes(skill);
      const next = isMastered ? prev.filter((s) => s !== skill) : [...prev, skill];
      toast.success(isMastered ? `Unmarked ${skill}` : `Marked ${skill} as Mastered! 🎉`);
      return next;
    });
  };

  const calculateRoleScore = (roleName: string) => {
    const reqs = BASE_ROLE_REQUIREMENTS[roleName] || [];
    if (!reqs.length) return 0;
    const matched = reqs
      .filter((r) => masteredSkills.includes(r.skill))
      .reduce((acc, r) => acc + r.weight, 0);
    return Math.min(Math.round(matched), 100);
  };

  const currentReqs = BASE_ROLE_REQUIREMENTS[selectedRole] || BASE_ROLE_REQUIREMENTS["Full Stack AI Engineer"];

  const selectAll = () => setMasteredSkills(Array.from(new Set([...masteredSkills, ...currentReqs.map((r) => r.skill)])));
  const clearAllForRole = () => setMasteredSkills(masteredSkills.filter((s) => !currentReqs.some((r) => r.skill === s)));

  const overallScore = calculateRoleScore(selectedRole);

  const handleAddCustomRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRoleName.trim()) return toast.error("Enter a target role title");
    if (!customSkillName.trim()) return toast.error("Enter at least one required skill");

    const newRoleObj = [
      {
        skill: customSkillName.trim(),
        weight: Number(customSkillWeight) || 20,
        desc: `Custom skill for ${customRoleName.trim()}`,
      },
    ];

    setCustomRoleDict((prev) => ({
      ...prev,
      [customRoleName.trim()]: newRoleObj,
    }));

    setSelectedRole(customRoleName.trim());
    setCustomRoleName("");
    setCustomSkillName("");
    setShowCustomRoleModal(false);
    toast.success(`Created custom target role: ${customRoleName.trim()}!`);
  };

  const handleAddCustomSkillToRole = () => {
    if (!customSkillName.trim()) return toast.error("Enter skill name");
    const newSkillObj = {
      skill: customSkillName.trim(),
      weight: Number(customSkillWeight) || 15,
      desc: `Required competency for ${selectedRole}`,
    };

    setCustomRoleDict((prev) => {
      const existing = prev[selectedRole] || BASE_ROLE_REQUIREMENTS[selectedRole] || [];
      return {
        ...prev,
        [selectedRole]: [...existing, newSkillObj],
      };
    });

    setCustomSkillName("");
    toast.success(`Added ${customSkillName.trim()} to ${selectedRole}!`);
  };

  const toggleCompareRole = (role: string) => {
    if (compareRoles.includes(role)) {
      if (compareRoles.length <= 1) return toast.error("Select at least 1 role to compare");
      setCompareRoles(compareRoles.filter((r) => r !== role));
    } else {
      if (compareRoles.length >= 4) return toast.error("Max 4 roles in comparison grid");
      setCompareRoles([...compareRoles, role]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-600 text-white rounded-2xl shadow-md">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Skill Gap & Multi-Role Readiness Analysis</h2>
            <p className="text-sm text-muted-foreground">
              Select target role, compare multiple roles side-by-side, toggle skill mastery & bridge course gaps.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View mode toggle */}
          <div className="flex items-center gap-0.5 bg-muted p-1 rounded-xl border">
            <button
              onClick={() => setViewMode("single")}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer",
                viewMode === "single" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground",
              )}
            >
              Single Role
            </button>
            <button
              onClick={() => setViewMode("compare")}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1",
                viewMode === "compare" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground",
              )}
            >
              <ArrowLeftRight className="h-3.5 w-3.5" /> Compare Multiple Roles
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => setShowCustomRoleModal(true)}
            className="text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Custom Role
          </Button>
        </div>
      </motion.div>

      {/* SINGLE ROLE VIEW MODE */}
      {viewMode === "single" && (
        <Card className="p-4 sm:p-6 rounded-2xl border shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-xl">
                <TargetIcon className="h-5.5 w-5.5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-black text-lg text-foreground">{selectedRole} Readiness</h3>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="text-xs font-bold h-8 px-2.5 rounded-lg border border-input bg-background cursor-pointer"
                  >
                    {Object.keys(BASE_ROLE_REQUIREMENTS).map((role) => (
                      <option key={role} value={role}>
                        {role} ({calculateRoleScore(role)}%)
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-muted-foreground font-semibold mt-1">
                  {currentReqs.filter((r) => masteredSkills.includes(r.skill)).length}/{currentReqs.length} skills mastered
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAll}
                className="text-xs h-8 font-bold gap-1"
              >
                <Check className="h-3.5 w-3.5 text-emerald-500" /> Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllForRole}
                className="text-xs h-8 font-bold gap-1"
              >
                <X className="h-3.5 w-3.5 text-rose-500" /> Clear Role
              </Button>
              <div className="px-4 py-2 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl text-center">
                <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                  {overallScore}/100
                </div>
                <div className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider">
                  Readiness Score
                </div>
              </div>
            </div>
          </div>

          {/* Inline Custom Skill Adding Bar */}
          <div className="p-3 bg-muted/20 rounded-xl border flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Plus className="h-3.5 w-3.5 text-rose-500" /> Add Skill to {selectedRole}:
            </span>
            <input
              placeholder="e.g. GraphQL, Docker, PyTorch"
              value={customSkillName}
              onChange={(e) => setCustomSkillName(e.target.value)}
              className="text-xs h-8 px-3 rounded-lg border border-input bg-background flex-1 min-w-[180px]"
            />
            <select
              value={customSkillWeight}
              onChange={(e) => setCustomSkillWeight(e.target.value)}
              className="text-xs h-8 px-2 rounded-lg border border-input bg-background font-semibold"
            >
              <option value="10">10% Weight</option>
              <option value="15">15% Weight</option>
              <option value="20">20% Weight</option>
              <option value="25">25% Weight</option>
            </select>
            <Button size="sm" onClick={handleAddCustomSkillToRole} className="h-8 text-xs font-bold bg-primary text-white">
              Add Skill
            </Button>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex justify-between">
              <span>Required Skills (Click card to toggle mastery)</span>
              <span>{masteredSkills.length} Total Mastered</span>
            </h4>
            <div className="grid gap-3">
              {currentReqs.map((item, idx) => {
                const isMastered = masteredSkills.includes(item.skill);
                return (
                  <motion.div
                    key={item.skill}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => toggleSkill(item.skill)}
                    className={cn(
                      "p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all shadow-xs",
                      isMastered
                        ? "bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-500/20"
                        : "bg-card hover:bg-muted/40 border-border",
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <SkillBadge
                        skill={item.skill}
                        size="md"
                        variant={isMastered ? "default" : "outline"}
                      />
                      <div>
                        <p className="text-sm font-bold text-foreground">{item.skill}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[280px] sm:max-w-[420px]">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!isMastered && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate({ to: "/courses" });
                            toast.info(`Searching courses for ${item.skill}...`);
                          }}
                          className="px-2.5 py-1 text-[10px] font-bold bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition cursor-pointer"
                        >
                          Learn Course →
                        </button>
                      )}
                      <Badge
                        variant={isMastered ? "default" : "outline"}
                        className={cn(
                          "text-xs font-bold px-3 py-1",
                          isMastered
                            ? "bg-emerald-500 text-white"
                            : "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10",
                        )}
                      >
                        {isMastered ? "Mastered" : `Gap (+${item.weight}%)`}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* MULTI-ROLE SIDE-BY-SIDE COMPARISON MODE */}
      {viewMode === "compare" && (
        <div className="space-y-6">
          <Card className="p-4 rounded-2xl border bg-card space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4 text-rose-500" /> Select Roles to Compare Side-by-Side
              </h3>
              <span className="text-xs text-muted-foreground font-semibold">
                Showing {compareRoles.length} Roles
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(BASE_ROLE_REQUIREMENTS).map((role) => {
                const isSelected = compareRoles.includes(role);
                const score = calculateRoleScore(role);
                return (
                  <button
                    key={role}
                    onClick={() => toggleCompareRole(role)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-xs font-bold transition border cursor-pointer flex items-center gap-1.5",
                      isSelected
                        ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                        : "bg-muted/40 border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {isSelected ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                    {role} ({score}%)
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {compareRoles.map((roleName) => {
              const reqs = BASE_ROLE_REQUIREMENTS[roleName] || [];
              const score = calculateRoleScore(roleName);
              const masteredCount = reqs.filter((r) => masteredSkills.includes(r.skill)).length;
              return (
                <Card key={roleName} className="p-5 rounded-2xl border bg-card shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <h4 className="font-extrabold text-base text-foreground">{roleName}</h4>
                        <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                          {masteredCount}/{reqs.length} Skills Mastered
                        </p>
                      </div>
                      <div className="text-center px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                        <div className="text-lg font-black text-indigo-600 dark:text-indigo-400">{score}%</div>
                        <div className="text-[8px] font-extrabold text-muted-foreground uppercase">Readiness</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                        Skill Matrix & Gaps
                      </span>
                      <div className="space-y-2">
                        {reqs.map((item) => {
                          const isMastered = masteredSkills.includes(item.skill);
                          return (
                            <div
                              key={item.skill}
                              onClick={() => toggleSkill(item.skill)}
                              className={cn(
                                "p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition",
                                isMastered
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                                  : "bg-muted/30 border-border text-foreground hover:bg-muted",
                              )}
                            >
                              <span className="font-bold flex items-center gap-1.5">
                                {isMastered ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                ) : (
                                  <X className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                                )}
                                {item.skill}
                              </span>
                              <span className="text-[10px] font-bold opacity-80">
                                {isMastered ? "Mastered" : `Gap +${item.weight}%`}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedRole(roleName);
                      setViewMode("single");
                    }}
                    className="w-full py-2 rounded-xl bg-muted hover:bg-primary hover:text-white text-foreground text-xs font-bold transition cursor-pointer text-center"
                  >
                    Focus & Build {roleName} →
                  </button>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Role Dialog Modal */}
      {showCustomRoleModal && (
        <Dialog open={showCustomRoleModal} onOpenChange={setShowCustomRoleModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Target className="h-5 w-5 text-rose-600" /> Create Custom Target Role
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCustomRole} className="space-y-4 pt-2">
              <div>
                <Label className="text-xs font-bold">Role Title *</Label>
                <Input
                  placeholder="e.g. Cloud Solutions Architect, Blockchain Dev"
                  value={customRoleName}
                  onChange={(e) => setCustomRoleName(e.target.value)}
                  className="mt-1 text-sm"
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-bold">Initial Required Skill *</Label>
                <Input
                  placeholder="e.g. AWS VPC, Solidity, Kubernetes"
                  value={customSkillName}
                  onChange={(e) => setCustomSkillName(e.target.value)}
                  className="mt-1 text-sm"
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-bold">Skill Weight (%)</Label>
                <select
                  value={customSkillWeight}
                  onChange={(e) => setCustomSkillWeight(e.target.value)}
                  className="w-full text-sm h-9 px-3 rounded-md border border-input bg-background mt-1"
                >
                  <option value="15">15% Weight</option>
                  <option value="20">20% Weight</option>
                  <option value="25">25% Weight</option>
                  <option value="30">30% Weight</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="ghost" onClick={() => setShowCustomRoleModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-bold">
                  Create Role
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

const RefreshCw = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

function CareerFinderView() {
  const steps = [
    {
      id: "passions",
      title: "What You Love",
      icon: Heart,
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/40",
      placeholder: "e.g. Design, coding, writing, AI tools...",
      desc: "Things that energize & inspire you",
    },
    {
      id: "skills",
      title: "What You're Good At",
      icon: Star,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40",
      placeholder: "e.g. Leadership, problem solving, React, Python...",
      desc: "Your key strengths & learned skills",
    },
    {
      id: "market",
      title: "What The World Needs",
      icon: Globe,
      color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/40",
      placeholder: "e.g. Health tech, education, sustainable AI...",
      desc: "High-impact problems you want to solve",
    },
    {
      id: "income",
      title: "Your Future Goals",
      icon: DollarSign,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/40",
      placeholder: "e.g. Remote role, ₹20+ LPA, startup founder...",
      desc: "Career & financial expectations",
    },
  ];

  // Persisted state
  const [currentStep, setCurrentStep] = useState<number>(() => {
    const saved = localStorage.getItem("learnify_ikigai_step_v2");
    return saved ? Number(saved) : 0;
  });

  const [passions, setPassions] = useState<string[]>(() => {
    const saved = localStorage.getItem("learnify_ikigai_passions_v2");
    return saved ? JSON.parse(saved) : ["Coding", "AI Tools"];
  });

  const [skills, setSkills] = useState<string[]>(() => {
    const saved = localStorage.getItem("learnify_ikigai_skills_v2");
    return saved ? JSON.parse(saved) : ["React", "Problem Solving"];
  });

  const [market, setMarket] = useState<string[]>(() => {
    const saved = localStorage.getItem("learnify_ikigai_market_v2");
    return saved ? JSON.parse(saved) : ["EdTech", "Full-Stack Web Apps"];
  });

  const [income, setIncome] = useState<string>(() => {
    return localStorage.getItem("learnify_ikigai_income_v2") || "";
  });

  const [result, setResult] = useState<boolean>(() => {
    return localStorage.getItem("learnify_ikigai_result_v2") === "true";
  });

  const [tempInput, setTempInput] = useState("");

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem("learnify_ikigai_step_v2", String(currentStep));
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem("learnify_ikigai_passions_v2", JSON.stringify(passions));
  }, [passions]);

  useEffect(() => {
    localStorage.setItem("learnify_ikigai_skills_v2", JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem("learnify_ikigai_market_v2", JSON.stringify(market));
  }, [market]);

  useEffect(() => {
    localStorage.setItem("learnify_ikigai_income_v2", income);
  }, [income]);

  useEffect(() => {
    localStorage.setItem("learnify_ikigai_result_v2", String(result));
  }, [result]);

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
    if (currentStep === 3) {
      setResult(true);
      toast.success("Generated your personalized Ikigai career path!");
      return;
    }
    setCurrentStep((s) => s + 1);
  };

  const handleReset = () => {
    setResult(false);
    setCurrentStep(0);
    setPassions([]);
    setSkills([]);
    setMarket([]);
    setIncome("");
    setTempInput("");
    localStorage.removeItem("learnify_ikigai_step_v2");
    localStorage.removeItem("learnify_ikigai_passions_v2");
    localStorage.removeItem("learnify_ikigai_skills_v2");
    localStorage.removeItem("learnify_ikigai_market_v2");
    localStorage.removeItem("learnify_ikigai_income_v2");
    localStorage.removeItem("learnify_ikigai_result_v2");
    toast.info("Reset Ikigai wizard");
  };

  if (result) {
    const roles = [
      {
        title: "AI Product Manager / Full Stack AI Architect",
        match: "94%",
        reason: `Combines your passion for ${passions.slice(0, 2).join(", ") || "tech"} with core skills in ${skills.slice(0, 2).join(", ") || "development"} and high-demand market needs in ${market.slice(0, 2).join(", ") || "EdTech"}.`,
      },
      {
        title: "Senior Full Stack AI Developer",
        match: "89%",
        reason: `Strong technical alignment with ${skills.join(", ") || "React & Node"}, solving real-world challenges in ${market[0] || "web apps"}.`,
      },
      {
        title: "Technical Founder & Solutions Engineer",
        match: "86%",
        reason: `Directly matches your income expectations (${income || "High growth"}) and creative drive.`,
      },
    ];
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Your Ikigai Career Path Results</h2>
              <p className="text-sm text-muted-foreground">Persisted analysis based on your passions & skills</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300 font-bold text-xs gap-1">
              <Check className="h-3 w-3" /> Auto-Saved
            </Badge>
            <Button size="sm" variant="outline" onClick={handleReset} className="text-xs font-bold gap-1">
              <RefreshCw className="h-3.5 w-3.5 text-rose-500" /> Start Over
            </Button>
          </div>
        </div>

        <Card className="p-8 rounded-2xl border shadow-md bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Rocket className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-100">
              #1 Recommended Ikigai Path
            </span>
          </div>
          <h3 className="text-2xl font-black">{roles[0].title}</h3>
          <p className="text-indigo-100 text-sm leading-relaxed">{roles[0].reason}</p>
          <div className="flex gap-6 pt-4 border-t border-white/20 flex-wrap">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-200">Match Score</span>
              <p className="text-2xl font-black">{roles[0].match}</p>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-200">Market Need</span>
              <p className="text-2xl font-black">Very High</p>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-200">Salary Band</span>
              <p className="text-2xl font-black">₹18-35 LPA</p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">Alternative Ikigai Paths</h3>
          {roles.slice(1).map((r, i) => (
            <Card
              key={i}
              className="p-5 rounded-xl border shadow-xs flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-bold text-base text-foreground">{r.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{r.reason}</p>
              </div>
              <Badge variant="secondary" className="text-xs font-bold shrink-0 bg-primary/10 text-primary">
                {r.match} Match
              </Badge>
            </Card>
          ))}
        </div>

        <Card className="p-6 rounded-2xl border shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" /> Action Roadmap to Achieve Your Ikigai
          </h3>
          <div className="space-y-3">
            {[
              `Build 2 showcase projects focused on ${passions[0] || "Full Stack AI"} and ${market[0] || "EdTech"}`,
              `Master remaining high-weight skills: ${skills.join(", ") || "React, TypeScript, Python"}`,
              "Optimize your LinkedIn profile and post twice weekly on your build journey",
              "Connect directly with hiring managers & founders on Learnify Community",
            ].map((step, i) => (
              <div key={i} className="flex gap-4 items-center p-2 rounded-xl bg-muted/20 border">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <p className="text-xs font-semibold text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  const stepId = steps[currentStep].id;
  const currentItems = stepId === "income" ? null : [passions, skills, market][currentStep];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-teal-600 text-white rounded-2xl shadow-md">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Career Finder (Ikigai)</h2>
            <p className="text-sm text-muted-foreground">
              Discover your purpose — intersection of passion, skill, market need, and goals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300 font-bold text-xs gap-1">
            <Check className="h-3 w-3" /> Auto-Saved
          </Badge>
          <Button size="sm" variant="ghost" onClick={handleReset} className="text-xs text-muted-foreground">
            Reset
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
          <span>Step {currentStep + 1} of 4: {steps[currentStep].title}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden p-0.5 border">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Card className="p-6 sm:p-8 rounded-2xl border shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b">
          <div className={`p-3.5 ${steps[currentStep].color} rounded-2xl border`}>
            {React.createElement(steps[currentStep].icon, { className: "w-6 h-6" })}
          </div>
          <div>
            <h3 className="text-xl font-bold">{steps[currentStep].title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-semibold">{steps[currentStep].desc}</p>
          </div>
        </div>

        {stepId === "income" ? (
          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground">Your Target Income / Work Style</Label>
            <Textarea
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder={steps[currentStep].placeholder}
              className="min-h-[120px] text-sm"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-3">
              <Input
                value={tempInput}
                onChange={(e) => setTempInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                placeholder={steps[currentStep].placeholder}
                className="text-sm h-10"
              />
              <Button onClick={handleAddItem} className="shrink-0 h-10 font-bold bg-primary text-white">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[48px] p-3 rounded-xl bg-muted/20 border">
              {(currentItems as string[])?.length === 0 ? (
                <span className="text-xs text-muted-foreground italic">No items added yet. Type above and click Add or press Enter.</span>
              ) : (
                (currentItems as string[])?.map((item, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 bg-card border shadow-xs rounded-xl text-xs font-bold text-foreground"
                  >
                    {item}
                    <button onClick={() => handleRemoveItem(i)} className="hover:text-rose-500 cursor-pointer p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            onClick={() => setCurrentStep((s) => s - 1)}
            disabled={currentStep === 0}
            variant="outline"
            size="sm"
            className="text-xs font-bold"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            size="sm"
            className="text-xs font-bold bg-primary text-white"
            disabled={
              stepId !== "income" ? (currentItems as string[])?.length === 0 : !income.trim()
            }
          >
            {currentStep === 3 ? "Show My Path" : "Continue"} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

const DETAILED_ROADMAPS: Record<
  string,
  {
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
  }
> = {
  "Generative AI": {
    targetRole: "Generative AI Engineer",
    level: "2026 Core Demand",
    summary:
      "Master LLM APIs, Prompt Engineering, Retrieval-Augmented Generation (RAG), Vector Databases, and Fine-tuning models for production.",
    timeline: "2-3 Months",
    salary: "₹8L - ₹25L / yr",
    prerequisites: ["Python", "API Basics", "Git"],
    phases: [
      {
        phaseTitle: "Phase 1: Python Core & LLM API Fundamentals",
        duration: "Weeks 1-3",
        skills: ["Python", "OpenAI", "Prompt Engineering", "JSON"],
        description:
          "Learn Python async programming, HTTP clients, OpenAI & Anthropic API integration, structured outputs, and prompt formatting techniques.",
        milestones: [
          "Build a CLI AI Assistant",
          "Implement Structured JSON Data Extraction from Unstructured Text",
        ],
      },
      {
        phaseTitle: "Phase 2: RAG & Vector Search Architecture",
        duration: "Weeks 4-7",
        skills: ["LangChain", "Vector DBs", "Pinecone", "Python", "OpenAI"],
        description:
          "Master document chunking, embeddings, vector database similarity search, hybrid search, and context augmentation.",
        milestones: [
          "Build a Full RAG Knowledge Base for PDF Search",
          "Implement Conversational Memory & Context Truncation",
        ],
      },
      {
        phaseTitle: "Phase 3: Production LLM Evaluation & Guardrails",
        duration: "Weeks 8-12",
        skills: ["FastAPI", "Python", "Docker", "Vercel", "OpenAI"],
        description:
          "Deploy AI microservices with FastAPI, implement rate limiting, hallucination guardrails, response caching, and evaluation metrics.",
        milestones: [
          "Deploy Production AI Microservice to Cloud",
          "Benchmark RAG Accuracy & Latency",
        ],
      },
    ],
    projects: [
      {
        title: "Enterprise Knowledge Base RAG",
        tech: ["Python", "LangChain", "OpenAI", "Pinecone", "FastAPI"],
        desc: "Full RAG system querying thousands of company documents with citation links.",
      },
      {
        title: "AI Code Review Assistant",
        tech: ["Python", "OpenAI", "GitHub API", "Docker"],
        desc: "Automated PR reviewer analyzing code quality, security vulnerabilities, and unit test coverage.",
      },
    ],
  },
  "Agentic AI": {
    targetRole: "Agentic AI Developer",
    level: "Cutting Edge",
    summary:
      "Build stateful, multi-agent autonomous workflows using LangGraph, Tool Calling, ReAct Agent loops, and human-in-the-loop validation.",
    timeline: "3-4 Months",
    salary: "₹12L - ₹35L+ / yr",
    prerequisites: ["Python", "TypeScript", "LangChain"],
    phases: [
      {
        phaseTitle: "Phase 1: Agentic Patterns & Tool Calling",
        duration: "Weeks 1-4",
        skills: ["Python", "TypeScript", "LangChain", "OpenAI"],
        description:
          "Understand ReAct architecture, function calling, tool execution loops, error recovery, and structured planning.",
        milestones: [
          "Build a Web Research Agent with Google & Tavily Tools",
          "Implement Automatic Tool Error Retries",
        ],
      },
      {
        phaseTitle: "Phase 2: Stateful Multi-Agent Orchestration",
        duration: "Weeks 5-9",
        skills: ["LangChain", "Python", "TypeScript", "FastAPI"],
        description:
          "Orchestrate multi-agent teams (Coder, Tester, Reviewer) using state graphs, conditional routing, and persistent memory.",
        milestones: [
          "Create an Autonomous Software Engineering Agent Team",
          "Implement Human-in-the-Loop Approval Nodes",
        ],
      },
      {
        phaseTitle: "Phase 3: Production Deployment & Agent Observability",
        duration: "Weeks 10-14",
        skills: ["Python", "Docker", "FastAPI", "PostgreSQL", "Redis"],
        description:
          "Monitor agent execution traces, cost optimization, rate limits, and asynchronous background worker queues.",
        milestones: [
          "Deploy Multi-Agent Pipeline to Production Kubernetes / Cloud",
          "Trace Agent Steps with Observability Tools",
        ],
      },
    ],
    projects: [
      {
        title: "Autonomous Market Research Agent",
        tech: ["Python", "LangChain", "Tavily", "FastAPI"],
        desc: "Scrapes competitor websites, generates market intelligence reports, and emails summaries.",
      },
      {
        title: "AI Customer Support Squad",
        tech: ["TypeScript", "LangChain", "Node.js", "Supabase"],
        desc: "Multi-agent squad handling ticket classification, DB lookup, resolution, and escalation.",
      },
    ],
  },
  "UI/UX Design": {
    targetRole: "UI/UX & Product Designer",
    level: "Creative Focus",
    summary:
      "Master user research, wireframing, interactive prototyping in Figma, design systems, accessibility (WCAG), and developer handoff.",
    timeline: "3-4 Months",
    salary: "₹4L - ₹20L / yr",
    prerequisites: ["Design Fundamentals", "Figma Basics"],
    phases: [
      {
        phaseTitle: "Phase 1: UX Research & Information Architecture",
        duration: "Weeks 1-4",
        skills: ["Figma", "UI/UX", "User Research", "Wireframing"],
        description:
          "Conduct user interviews, map user journeys, create personas, sitemaps, and low-fidelity wireframes.",
        milestones: [
          "Complete UX Case Study for a Mobile App",
          "Build User Flow & Wireframe Specs",
        ],
      },
      {
        phaseTitle: "Phase 2: UI Mastery & Design Systems",
        duration: "Weeks 5-9",
        skills: ["Figma", "UI/UX", "Tailwind CSS", "Canva"],
        description:
          "Master typography, color theory, spacing tokens, auto-layout, component variants, and full design system creation.",
        milestones: [
          "Create Complete Mobile & Desktop Design System",
          "Design High-Fidelity Responsive Prototypes",
        ],
      },
      {
        phaseTitle: "Phase 3: Interactive Micro-Animations & Developer Handoff",
        duration: "Weeks 10-14",
        skills: ["Figma", "UI/UX", "Tailwind CSS"],
        description:
          "Add smooth component micro-interactions, smart-animate prototypes, prepare design tokens, and conduct dev handoff.",
        milestones: [
          "Build Fully Interactive Clickable Prototype",
          "Export Token Documentation for Engineering Team",
        ],
      },
    ],
    projects: [
      {
        title: "Fintech Mobile App Redesign",
        tech: ["Figma", "UI/UX", "Design Systems"],
        desc: "End-to-end design case study from user research to interactive high-fidelity Figma prototype.",
      },
      {
        title: "SaaS Dashboard Design System",
        tech: ["Figma", "UI/UX", "Tailwind CSS"],
        desc: "Comprehensive component library with dark/light mode tokens, typography specs, and accessibility guidelines.",
      },
    ],
  },
  "Full-Stack (Next.js)": {
    targetRole: "Full-Stack Software Engineer",
    level: "High Demand",
    summary:
      "Build modern, high-performance web applications using React 19, Next.js App Router, TypeScript, Tailwind CSS, PostgreSQL, and Server Components.",
    timeline: "4-6 Months",
    salary: "₹3L - ₹15L / yr",
    prerequisites: ["HTML/CSS", "JavaScript Basics"],
    phases: [
      {
        phaseTitle: "Phase 1: Modern JavaScript & TypeScript Mastery",
        duration: "Weeks 1-4",
        skills: ["JavaScript", "TypeScript", "HTML5", "CSS3"],
        description:
          "Master ES2026 async/await, closures, promises, DOM manipulation, and strong static typing with TypeScript interfaces.",
        milestones: [
          "Build TypeScript Data Processing Utility",
          "Master Async Promises & Fetch APIs",
        ],
      },
      {
        phaseTitle: "Phase 2: React 19 & Next.js App Router",
        duration: "Weeks 5-12",
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
        description:
          "Learn Server Components, Server Actions, Client State, Routing, Layouts, Forms, and Tailwind CSS responsive styling.",
        milestones: [
          "Build Full-Featured Next.js E-Commerce Catalog",
          "Implement Dynamic Server Component Data Fetching",
        ],
      },
      {
        phaseTitle: "Phase 3: Database, Auth & Backend Integration",
        duration: "Weeks 13-18",
        skills: ["Node.js", "PostgreSQL", "Supabase", "Express", "Vercel"],
        description:
          "Connect PostgreSQL databases, design relational schemas, implement Supabase OAuth authentication, and deploy to Vercel.",
        milestones: [
          "Build Full-Stack SaaS Application with Payments & Auth",
          "Deploy Live Next.js Web App with CI/CD Pipeline",
        ],
      },
    ],
    projects: [
      {
        title: "AI-Powered Course Creator Platform",
        tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Supabase"],
        desc: "Full-stack LMS platform with course builder, quiz engine, video streaming, and certificates.",
      },
      {
        title: "Real-Time Collaborative Workspace",
        tech: ["React", "Node.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
        desc: "Notion-style workspace with real-time editing, drag-and-drop, and team permissions.",
      },
    ],
  },
  "Cloud & DevSecOps": {
    targetRole: "DevOps & Cloud Engineer",
    level: "Infrastructure Focus",
    summary:
      "Master cloud infrastructure on AWS, containerization with Docker, Kubernetes orchestration, CI/CD automation, and Terraform IaC.",
    timeline: "6-8 Months",
    salary: "₹6L - ₹22L / yr",
    prerequisites: ["Linux Basics", "Networking Fundamentals"],
    phases: [
      {
        phaseTitle: "Phase 1: Linux Administration & Shell Scripting",
        duration: "Weeks 1-6",
        skills: ["Linux", "Bash", "Git", "Command Line"],
        description:
          "Master Linux terminal navigation, file permissions, process management, systemd services, SSH, and Bash scripting.",
        milestones: [
          "Automate System Health Check Script",
          "Configure Linux Nginx Reverse Proxy with SSL",
        ],
      },
      {
        phaseTitle: "Phase 2: Docker Containerization & CI/CD",
        duration: "Weeks 7-14",
        skills: ["Docker", "Git", "GitHub", "Linux"],
        description:
          "Build multi-stage Dockerfiles, Docker Compose stacks, GitHub Actions workflows, and automated testing pipelines.",
        milestones: [
          "Dockerize Microservice Stack with Postgres & Redis",
          "Set up Automated GitHub Actions CI/CD Pipeline",
        ],
      },
      {
        phaseTitle: "Phase 3: Cloud AWS & Infrastructure as Code (IaC)",
        duration: "Weeks 15-24",
        skills: ["AWS", "Kubernetes", "Terraform", "Linux"],
        description:
          "Provision AWS EC2, S3, RDS, IAM, VPC using Terraform scripts. Deploy production applications to Amazon EKS (Kubernetes).",
        milestones: [
          "Provision AWS Multi-Tier Cloud Infrastructure via Terraform",
          "Deploy Scalable Kubernetes Cluster with Auto-Scaling",
        ],
      },
    ],
    projects: [
      {
        title: "Zero-Downtime AWS Kubernetes Deployment",
        tech: ["AWS", "Kubernetes", "Docker", "Terraform", "GitHub"],
        desc: "Complete Terraform infrastructure code deploying an EKS cluster with zero-downtime rolling updates.",
      },
      {
        title: "Automated DevSecOps Pipeline",
        tech: ["Docker", "Git", "Linux", "AWS"],
        desc: "CI/CD security pipeline scanning vulnerabilities, running automated tests, and deploying to AWS.",
      },
    ],
  },
  "Mobile Development": {
    targetRole: "Mobile App Developer",
    level: "High Growth",
    summary:
      "Build cross-platform mobile applications with React Native, Firebase backend, push notifications, and app store deployment.",
    timeline: "4-6 Months",
    salary: "₹4L - ₹18L / yr",
    prerequisites: ["JavaScript", "React Basics"],
    phases: [
      {
        phaseTitle: "Phase 1: React Native Fundamentals",
        duration: "Weeks 1-4",
        skills: ["React Native", "TypeScript", "JavaScript"],
        description:
          "Master RN components, navigation, state management, and platform-specific APIs for iOS and Android.",
        milestones: [
          "Build a Multi-Screen Navigation App",
          "Implement State Management with Zustand",
        ],
      },
      {
        phaseTitle: "Phase 2: Firebase & Backend Integration",
        duration: "Weeks 5-10",
        skills: ["Firebase", "Node.js", "TypeScript"],
        description:
          "Integrate Firebase Auth, Firestore, Cloud Storage, and push notification services with backend APIs.",
        milestones: [
          "Build Real-Time Chat App with Firebase",
          "Implement Push Notifications & In-App Alerts",
        ],
      },
      {
        phaseTitle: "Phase 3: App Store Deployment & Polish",
        duration: "Weeks 11-16",
        skills: ["React Native", "Firebase", "Swift"],
        description:
          "Optimize performance, add animations, write unit tests, and deploy to Apple App Store and Google Play Store.",
        milestones: [
          "Publish App to App Store & Play Store",
          "Achieve 4.5+ Star Rating with Crash-Free Sessions",
        ],
      },
    ],
    projects: [
      {
        title: "Food Delivery Mobile App",
        tech: ["React Native", "TypeScript", "Firebase"],
        desc: "Full-featured food ordering app with real-time tracking, push notifications, and payment gateway.",
      },
      {
        title: "Fitness Tracker with Social Features",
        tech: ["React Native", "Node.js", "Firebase"],
        desc: "Cross-platform fitness app with workout logging, leaderboards, and friend challenges.",
      },
    ],
  },
  Cybersecurity: {
    targetRole: "Cybersecurity Analyst",
    level: "Critical Demand",
    summary:
      "Master network security, ethical hacking, cloud security, compliance frameworks, and incident response for enterprise environments.",
    timeline: "6-8 Months",
    salary: "₹6L - ₹25L / yr",
    prerequisites: ["Linux Basics", "Networking Fundamentals"],
    phases: [
      {
        phaseTitle: "Phase 1: Network Security & Ethical Hacking",
        duration: "Weeks 1-6",
        skills: ["Network", "Linux", "Python", "Security"],
        description:
          "Learn TCP/IP, firewalls, IDS/IPS, Wireshark analysis, penetration testing, and vulnerability scanning with industry tools.",
        milestones: [
          "Complete CEH-Style Vulnerability Assessment Lab",
          "Write Custom Network Scanning Scripts in Python",
        ],
      },
      {
        phaseTitle: "Phase 2: Cloud Security & IAM",
        duration: "Weeks 7-14",
        skills: ["Cloud", "Linux", "Python", "AWS"],
        description:
          "Master AWS IAM, S3 bucket policies, Security Groups, GuardDuty, CloudTrail, and Kubernetes pod security policies.",
        milestones: [
          "Audit AWS Infrastructure Against CIS Benchmarks",
          "Implement Zero-Trust Architecture for Cloud Apps",
        ],
      },
      {
        phaseTitle: "Phase 3: Compliance SOC2 & Incident Response",
        duration: "Weeks 15-24",
        skills: ["Compliance", "Cloud", "Linux"],
        description:
          "Learn SOC2, ISO 27001, GDPR frameworks, incident response playbooks, disaster recovery, and business continuity planning.",
        milestones: [
          "Build Complete Incident Response Playbook",
          "Conduct Tabletop Ransomware Simulation Exercise",
        ],
      },
    ],
    projects: [
      {
        title: "Enterprise Security Audit Toolkit",
        tech: ["Python", "Linux", "AWS", "Compliance"],
        desc: "Automated security auditing tool that scans cloud infrastructure, identifies misconfigurations, and generates compliance reports.",
      },
      {
        title: "Real-Time Threat Detection Dashboard",
        tech: ["Python", "Linux", "Network"],
        desc: "SIEM-style dashboard aggregating logs, network traffic, and alerts with automated incident triage workflows.",
      },
    ],
  },
  "Product Management": {
    targetRole: "Product Manager",
    level: "Strategic",
    summary:
      "Master product strategy, user research, roadmap planning, data-driven decision making, stakeholder management, and agile execution.",
    timeline: "3-5 Months",
    salary: "₹8L - ₹30L / yr",
    prerequisites: ["Business Acumen", "Tech Fundamentals"],
    phases: [
      {
        phaseTitle: "Phase 1: Product Strategy & User Research",
        duration: "Weeks 1-4",
        skills: ["Strategy", "UX Design", "Analytics", "Leadership"],
        description:
          "Learn market analysis, competitive research, user interviews, persona creation, and product vision documentation.",
        milestones: [
          "Conduct 10+ User Interviews & Synthesize Insights",
          "Write Complete Product Requirement Document (PRD)",
        ],
      },
      {
        phaseTitle: "Phase 2: Roadmap Planning & Agile Execution",
        duration: "Weeks 5-10",
        skills: ["Strategy", "Analytics", "Leadership", "Tech"],
        description:
          "Master roadmap prioritization, OKR setting, sprint planning, stakeholder communication, and cross-functional team leadership.",
        milestones: [
          "Build & Present 6-Month Product Roadmap",
          "Lead Agile Sprint Retrospective as Acting PM",
        ],
      },
      {
        phaseTitle: "Phase 3: Data-Driven Decisions & Launch",
        duration: "Weeks 11-14",
        skills: ["Analytics", "Strategy", "Tech", "Leadership"],
        description:
          "Analyze A/B tests, cohort metrics, churn analysis, pricing strategy, and go-to-market launch planning.",
        milestones: [
          "Design & Analyze A/B Experiment with Statistical Significance",
          "Execute Full Product Launch with GTM Strategy",
        ],
      },
    ],
    projects: [
      {
        title: "SaaS Product Go-To-Market Plan",
        tech: ["Strategy", "Analytics", "Leadership"],
        desc: "Complete GTM strategy including target segments, pricing tiers, competitive positioning, and launch timeline.",
      },
      {
        title: "Product Analytics & Growth Dashboard",
        tech: ["Analytics", "Strategy", "Tech"],
        desc: "Data-driven dashboard tracking activation, retention, referral, revenue, and actionable growth recommendations.",
      },
    ],
  },
  "Data Intelligence": {
    targetRole: "Data Scientist & Analytics Engineer",
    level: "Enterprise",
    summary:
      "Master Python data analysis, SQL queries, Data Cleaning, Data Visualization, Machine Learning algorithms, and Predictive Analytics.",
    timeline: "5-7 Months",
    salary: "₹5L - ₹18L / yr",
    prerequisites: ["Python Basics", "Math & Statistics"],
    phases: [
      {
        phaseTitle: "Phase 1: Advanced SQL & Python Data Analysis",
        duration: "Weeks 1-6",
        skills: ["Python", "SQL", "Pandas", "NumPy"],
        description:
          "Master complex SQL window functions, joins, CTEs, DataFrames in Pandas, NumPy array operations, and data cleaning.",
        milestones: [
          "Perform EDA (Exploratory Data Analysis) on 100k+ Record Dataset",
          "Write Complex SQL Data Warehouse Queries",
        ],
      },
      {
        phaseTitle: "Phase 2: Data Visualization & Business Dashboards",
        duration: "Weeks 7-12",
        skills: ["Python", "Pandas", "NumPy", "SQL"],
        description:
          "Build interactive visual reports, chart dashboards, key performance metrics, and automated executive summary reports.",
        milestones: [
          "Build Interactive Business Analytics Dashboard",
          "Create Executive Data Storytelling Presentation",
        ],
      },
      {
        phaseTitle: "Phase 3: Machine Learning & Predictive Modeling",
        duration: "Weeks 13-20",
        skills: ["Python", "TensorFlow", "Pandas", "NumPy"],
        description:
          "Train classification, regression, and clustering models using Scikit-Learn and TensorFlow to solve real business problems.",
        milestones: [
          "Train Customer Churn Prediction Model",
          "Deploy ML Inference API for Real-time Predictions",
        ],
      },
    ],
    projects: [
      {
        title: "E-Commerce Customer Behavior & Churn Predictor",
        tech: ["Python", "Pandas", "TensorFlow", "SQL", "NumPy"],
        desc: "Exploratory data analysis and ML model predicting customer retention and lifetime value.",
      },
      {
        title: "Automated Financial Intelligence Dashboard",
        tech: ["Python", "SQL", "Pandas", "NumPy"],
        desc: "Pipeline parsing financial transactions, calculating metrics, and rendering interactive dashboards.",
      },
    ],
  },
};

function GuidesDocsView() {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const skillGuides = [
    {
      title: "Generative AI",
      category: "AI & ML",
      icon: Sparkles,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
      level: "2026 Core",
      duration: "2-3 months",
      skills: ["Prompt Engineering", "Generative AI", "Python", "OpenAI", "LangChain"],
      salary: "₹8L - ₹25L",
    },
    {
      title: "Agentic AI",
      category: "AI & ML",
      icon: Brain,
      color: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
      level: "Cutting Edge",
      duration: "3-4 months",
      skills: ["Agentic AI", "Python", "TypeScript", "LangChain", "FastAPI"],
      salary: "₹12L - ₹35L+",
    },
    {
      title: "UI/UX Design",
      category: "Design",
      icon: Palette,
      color: "bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400",
      level: "Creative Focus",
      duration: "3-4 months",
      skills: ["Figma", "UI/UX", "Tailwind CSS", "Canva"],
      salary: "₹4L - ₹20L",
    },
    {
      title: "Full-Stack (Next.js)",
      category: "Web Dev",
      icon: Globe,
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
      level: "High Demand",
      duration: "4-6 months",
      skills: ["TypeScript", "Next.js", "React", "Tailwind CSS", "Node.js", "PostgreSQL"],
      salary: "₹3L - ₹15L",
    },
    {
      title: "Cloud & DevSecOps",
      category: "Cloud & DevOps",
      icon: Shield,
      color: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
      level: "Infrastructure",
      duration: "6-8 months",
      skills: ["AWS", "Docker", "Kubernetes", "Linux", "Terraform", "Git"],
      salary: "₹6L - ₹22L",
    },
    {
      title: "Data Intelligence",
      category: "AI & ML",
      icon: Database,
      color: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
      level: "Enterprise",
      duration: "5-7 months",
      skills: ["Python", "Pandas", "SQL", "NumPy", "TensorFlow"],
      salary: "₹5L - ₹18L",
    },
    {
      title: "Mobile Development",
      category: "Web Dev",
      icon: Smartphone,
      color: "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
      level: "High Growth",
      duration: "4-6 months",
      skills: ["React Native", "TypeScript", "Firebase", "Node.js", "Swift"],
      salary: "₹4L - ₹18L",
    },
    {
      title: "Cybersecurity",
      category: "Security",
      icon: Lock,
      color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400",
      level: "Critical Demand",
      duration: "6-8 months",
      skills: ["Network", "Linux", "Python", "Cloud", "Compliance"],
      salary: "₹6L - ₹25L",
    },
    {
      title: "Product Management",
      category: "Strategy",
      icon: Users,
      color: "bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400",
      level: "Strategic",
      duration: "3-5 months",
      skills: ["Strategy", "Analytics", "UX Design", "Tech", "Leadership"],
      salary: "₹8L - ₹30L",
    },
  ];

  const filteredGuides =
    categoryFilter === "All"
      ? skillGuides
      : skillGuides.filter((g) => g.category === categoryFilter);

  const activeRoadmap = selectedKey ? DETAILED_ROADMAPS[selectedKey] : null;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-card rounded-2xl border shadow-sm">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Skill Roadmaps & Industry Guides</h2>
            <p className="text-sm text-muted-foreground">
              Click any card to view the full 2026 industry roadmap breakdown, tech stack & milestones.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
          {["All", "AI & ML", "Web Dev", "Cloud & DevOps", "Design", "Security", "Strategy"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer border whitespace-nowrap",
                categoryFilter === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-muted/30 text-muted-foreground border-border hover:bg-muted",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGuides.map((guide, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card
              onClick={() => setSelectedKey(guide.title)}
              className="rounded-2xl border shadow-sm p-6 space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${guide.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  {React.createElement(guide.icon as any, { className: "w-5 h-5" })}
                </div>
                <div>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                    {guide.level}
                  </p>
                  <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                    {guide.title}
                  </h3>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-muted/60 rounded-lg text-center">
                  <p className="text-[8px] font-bold text-muted-foreground uppercase">Timeline</p>
                  <p className="text-xs font-bold">{guide.duration}</p>
                </div>
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-center">
                  <p className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    Salary
                  </p>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {guide.salary}
                  </p>
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
          </motion.div>
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
                <span className="text-xs font-semibold text-muted-foreground">
                  2026 Industry Spec
                </span>
              </div>
              <DialogTitle className="text-2xl font-bold font-display mt-1">
                {activeRoadmap.targetRole} Roadmap
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 pt-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {activeRoadmap.summary}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-muted/50 rounded-xl border">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    Estimated Time
                  </span>
                  <p className="font-bold text-sm text-foreground mt-0.5">
                    {activeRoadmap.timeline}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-500/20">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                    Market Salary
                  </span>
                  <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {activeRoadmap.salary}
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-500/20 col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                    Prerequisites
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activeRoadmap.prerequisites.map((p) => (
                      <span
                        key={p}
                        className="text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded"
                      >
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
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Required Tech Stack
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {phase.skills.map((skill) => (
                            <SkillBadge key={skill} skill={skill} variant="default" size="sm" />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-border/60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Phase Milestones
                        </span>
                        <ul className="space-y-1">
                          {phase.milestones.map((m, mIdx) => (
                            <li
                              key={mIdx}
                              className="text-xs text-foreground flex items-start gap-2"
                            >
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

              <div className="pt-4 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedKey(null)}
                    className="text-xs"
                  >
                    Close
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-xs gap-1.5"
                    onClick={() => {
                      try {
                        const existing = JSON.parse(
                          localStorage.getItem("learnify_saved_roadmaps") || "[]",
                        );
                        if (!existing.includes(selectedKey)) {
                          localStorage.setItem(
                            "learnify_saved_roadmaps",
                            JSON.stringify([...existing, selectedKey]),
                          );
                          toast.success(`"${selectedKey}" saved to your profile!`);
                        } else {
                          toast.info("Already saved");
                        }
                      } catch {
                        toast.error("Could not save");
                      }
                    }}
                  >
                    <BookOpen className="h-3.5 w-3.5" /> Save to Profile
                  </Button>
                </div>
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
