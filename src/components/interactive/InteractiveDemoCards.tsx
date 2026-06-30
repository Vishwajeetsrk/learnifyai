import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  FileText,
  BarChart3,
  Mic,
  Map,
  Award,
  X,
  Play,
  Eye,
  ChevronRight,
  Star,
  GraduationCap,
  Briefcase,
  Trophy,
  Check,
  Zap,
  TrendingUp,
  Rocket,
  Quote,
  ArrowRight,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";

type DemoCard = {
  id: string;
  icon: any;
  title: string;
  headline: string;
  description: string;
  color: string;
  gradient: string;
  badge: { label: string; color: string };
  time: string;
  route?: string;
  benefits: string[];
  cta: string;
  secondary: string;
  preview: React.ReactNode;
};

const DEMOS: DemoCard[] = [
  {
    id: "ai-tutor",
    icon: Sparkles,
    title: "AI Tutor",
    headline: "Your Personal AI Teacher",
    description: "Get instant explanations, notes, quizzes and study help 24/7.",
    color: "#2563EB",
    gradient: "from-blue-500/10 to-blue-600/5",
    badge: { label: "Most Used Feature", color: "#2563EB" },
    time: "30 Seconds",
    route: "/ai" as const,
    benefits: [
      "Ask Questions",
      "Explain Concepts",
      "Generate Notes",
      "Create Quiz",
      "Summarize Topics",
      "Exam Preparation",
    ],
    cta: "Try AI Tutor",
    secondary: "Watch Demo",
    preview: (
      <div className="space-y-3 text-sm">
        <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 p-4 border border-blue-200 dark:border-blue-800/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">AI Tutor</span>
          </div>
          <div className="space-y-2">
            <div className="rounded-lg bg-white dark:bg-blue-950/40 p-3 shadow-sm border border-blue-100 dark:border-blue-800/30">
              <p className="text-xs text-foreground/80">Explain how transformers work in NLP</p>
            </div>
            <div className="rounded-lg bg-blue-500/10 p-3 ml-4 border border-blue-200/50">
              <p className="text-xs text-foreground/80 leading-relaxed">
                Transformers use self-attention to process sequential data in parallel. Key
                components: multi-head attention, positional encoding, and feed-forward layers.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] text-blue-600 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-full">
                Generate Notes
              </span>
              <span className="text-[10px] text-blue-600 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-full">
                Create Quiz
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "resume",
    icon: FileText,
    title: "Resume Builder",
    headline: "Build ATS-Friendly Resumes In Minutes",
    description: "Generate professional resumes optimized for recruiters and ATS systems.",
    color: "#6366F1",
    gradient: "from-indigo-500/10 to-indigo-600/5",
    badge: { label: "Job Seeker Favorite", color: "#6366F1" },
    time: "1 Minute",
    route: "/resume-builder" as const,
    benefits: [
      "AI Resume Generator",
      "ATS Optimization",
      "Multiple Templates",
      "PDF Export",
      "Modern Designs",
    ],
    cta: "Build Resume",
    secondary: "Preview Template",
    preview: (
      <div className="space-y-3 text-sm">
        <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/30 p-4 border border-indigo-200 dark:border-indigo-800/50">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-xs text-indigo-700 dark:text-indigo-300">
              Resume Score
            </p>
            <span className="text-lg font-bold text-emerald-500">92/100</span>
          </div>
          <div className="w-full h-2 rounded-full bg-indigo-200 dark:bg-indigo-800 overflow-hidden">
            <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" />
          </div>
          <div className="mt-3 space-y-1.5">
            {["Strong summary section", "ATS keywords detected", "Experience formatted well"].map(
              (item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-foreground/70">
                  <Check className="w-3 h-3 text-emerald-500" />
                  {item}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "ats",
    icon: BarChart3,
    title: "ATS Checker",
    headline: "Find Out Why Recruiters Reject Resumes",
    description: "Analyze your resume and receive actionable improvement suggestions.",
    color: "#F59E0B",
    gradient: "from-amber-500/10 to-amber-600/5",
    badge: { label: "Career Essential", color: "#F59E0B" },
    time: "45 Seconds",
    route: "/ats-checker" as const,
    benefits: [
      "ATS Score",
      "Keyword Analysis",
      "Missing Skills Detection",
      "Improvement Suggestions",
    ],
    cta: "Check ATS Score",
    secondary: "View Sample Report",
    preview: (
      <div className="space-y-3 text-sm">
        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 p-4 border border-amber-200 dark:border-amber-800/50">
          <p className="font-semibold text-xs text-amber-700 dark:text-amber-300 mb-3">
            ATS Compatibility
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: "Format", score: "A+", color: "text-emerald-500" },
              { label: "Keywords", score: "B", color: "text-amber-500" },
              { label: "Readability", score: "A", color: "text-emerald-500" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-lg bg-white dark:bg-amber-950/40 p-2 border border-amber-100 dark:border-amber-800/30"
              >
                <div className={`text-lg font-bold ${s.color}`}>{s.score}</div>
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-foreground/60 space-y-1">
            <p>→ Add 3 more industry keywords</p>
            <p>→ Use standard section order</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "mock-interview",
    icon: Mic,
    title: "Mock Interview",
    headline: "Practice Before The Real Interview",
    description: "Train with an AI interviewer and receive detailed feedback.",
    color: "#EC4899",
    gradient: "from-pink-500/10 to-pink-600/5",
    badge: { label: "Placement Booster", color: "#EC4899" },
    time: "2 Minutes",
    route: "/playground/interview" as const,
    benefits: [
      "AI Interviewer",
      "Voice Simulation",
      "Technical Questions",
      "HR Questions",
      "Instant Feedback",
    ],
    cta: "Start Interview",
    secondary: "Watch Demo",
    preview: (
      <div className="space-y-3 text-sm">
        <div className="rounded-xl bg-pink-50 dark:bg-pink-950/30 p-4 border border-pink-200 dark:border-pink-800/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-xs text-pink-700 dark:text-pink-300">AI Interviewer</p>
              <p className="text-[10px] text-muted-foreground">Question 3 of 5</p>
            </div>
          </div>
          <div className="rounded-lg bg-white dark:bg-pink-950/40 p-3 border border-pink-100 dark:border-pink-800/30">
            <p className="text-xs text-foreground/80">
              "Tell me about a time you solved a complex problem."
            </p>
          </div>
          <div className="mt-2 flex gap-2">
            <div className="flex-1 rounded-lg border border-pink-200 dark:border-pink-800/50 p-2 text-[10px] text-muted-foreground">
              Record answer...
            </div>
            <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
              <Play className="w-4 h-4 text-white ml-0.5" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "roadmap",
    icon: Map,
    title: "Career Roadmap",
    headline: "Know Exactly What To Learn Next",
    description: "Personalized learning paths based on your career goals.",
    color: "#10B981",
    gradient: "from-emerald-500/10 to-emerald-600/5",
    badge: { label: "AI Powered", color: "#10B981" },
    time: "30 Seconds",
    route: "/career-roadmap" as const,
    benefits: [
      "Skill Gap Analysis",
      "Career Planning",
      "Milestones",
      "Project Recommendations",
      "Certification Path",
    ],
    cta: "Generate Roadmap",
    secondary: "View Example",
    preview: (
      <div className="space-y-3 text-sm">
        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-4 border border-emerald-200 dark:border-emerald-800/50">
          <p className="font-semibold text-xs text-emerald-700 dark:text-emerald-300 mb-3">
            Frontend Developer Path
          </p>
          <div className="space-y-2">
            {[
              { step: "HTML/CSS", done: true },
              { step: "JavaScript", done: true },
              { step: "React", done: false, current: true },
              { step: "System Design", done: false },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    s.done && "bg-emerald-500",
                    (s as any).current && "bg-emerald-500 ring-2 ring-emerald-500/30 animate-pulse",
                    !s.done && !(s as any).current && "bg-muted-foreground/30",
                  )}
                />
                <span
                  className={cn(
                    "text-xs",
                    s.done && "text-emerald-600 dark:text-emerald-400 line-through opacity-60",
                    (s as any).current && "font-medium text-foreground",
                    !s.done && !(s as any).current && "text-muted-foreground",
                  )}
                >
                  {s.step}
                </span>
                {(s as any).current && (
                  <span className="text-[10px] text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded-full">
                    In progress
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "certificate",
    icon: Award,
    title: "Certificate Generator",
    headline: "Earn Shareable Verified Certificates",
    description: "Generate professional certificates shareable on LinkedIn and resumes.",
    color: "#7c3aed",
    gradient: "from-purple-500/10 to-purple-600/5",
    badge: { label: "Verified Credentials", color: "#7c3aed" },
    time: "20 Seconds",
    route: "/certificates" as const,
    benefits: [
      "Instant Certificates",
      "QR Verification",
      "LinkedIn Sharing",
      "Custom Templates",
      "Lifetime Access",
    ],
    cta: "View Certificate",
    secondary: "Verify Certificate",
    preview: (
      <div className="space-y-3 text-sm">
        <div className="rounded-xl bg-purple-50 dark:bg-purple-950/30 p-3 border border-purple-200 dark:border-purple-800/50">
          <img
            src="/certificate%201.png"
            alt="Certificate preview"
            className="w-full rounded-lg object-contain shadow-sm"
          />
        </div>
      </div>
    ),
  },
  {
    id: "portfolio",
    icon: FolderOpen,
    title: "Portfolio Builder",
    headline: "Build Your Professional Portfolio",
    description: "Generate a complete portfolio plan with structure, content, and design recommendations.",
    color: "#8B5CF6",
    gradient: "from-violet-500/10 to-violet-600/5",
    badge: { label: "Career Essential", color: "#8B5CF6" },
    time: "1 Minute",
    route: "/portfolio-builder" as const,
    benefits: [
      "Portfolio Structure",
      "Content Templates",
      "Design Recommendations",
      "Technical Stack Advice",
      "SEO Optimization Tips",
    ],
    cta: "Build Portfolio",
    secondary: "View Example",
    preview: (
      <div className="space-y-3 text-sm">
        <div className="rounded-xl bg-violet-50 dark:bg-violet-950/30 p-4 border border-violet-200 dark:border-violet-800/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center">
              <FolderOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-xs text-violet-700 dark:text-violet-300">Portfolio Preview</p>
              <p className="text-[10px] text-muted-foreground">Developer Style</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="rounded-lg bg-white dark:bg-violet-950/40 p-2 border border-violet-100 dark:border-violet-800/30 flex items-center gap-2">
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-xs text-foreground/70">Hero section with tagline</span>
            </div>
            <div className="rounded-lg bg-white dark:bg-violet-950/40 p-2 border border-violet-100 dark:border-violet-800/30 flex items-center gap-2">
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-xs text-foreground/70">Skills grid with proficiency</span>
            </div>
            <div className="rounded-lg bg-white dark:bg-violet-950/40 p-2 border border-violet-100 dark:border-violet-800/30 flex items-center gap-2">
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-xs text-foreground/70">Project showcase layout</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

const ACTIVITIES = [
  { icon: GraduationCap, name: "Rahul", action: "just generated a resume" },
  { icon: Award, name: "Priya", action: "earned a certificate" },
  { icon: BarChart3, name: "Amit", action: "improved ATS score by 27%" },
  { icon: Mic, name: "Sneha", action: "completed a mock interview" },
  { icon: FileText, name: "Arjun", action: "built a new resume" },
  { icon: Sparkles, name: "Neha", action: "used AI Tutor for 2 hours" },
  { icon: Trophy, name: "Vikram", action: "earned a career certificate" },
  { icon: BarChart3, name: "Divya", action: "improved ATS score by 35%" },
];

interface InteractiveDemoCardsProps {
  className?: string;
}

export function InteractiveDemoCards({ className }: InteractiveDemoCardsProps) {
  const [open, setOpen] = useState<string | null>(null);
  const [activityIdx, setActivityIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivityIdx((p) => (p + 1) % ACTIVITIES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const currentActivity = ACTIVITIES[activityIdx];

  return (
    <section className={cn("w-full mx-auto", className)}>
      {/* Section header */}
      <motion.div
        className="text-center mb-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground mb-4">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Interactive Product Experience
        </div>
      </motion.div>

      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">See Learnify AI In Action</h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">
          Experience our most powerful AI tools before creating an account. No signup. No credit
          card. No commitment. Just click and explore.
        </p>
      </div>

      {/* Trust row */}
      <motion.div
        className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {[
          { icon: GraduationCap, label: "10,000+ Learners" },
          { icon: Star, label: "4.9 Rating" },
          { icon: Award, label: "25,000+ Certificates" },
          { icon: Briefcase, label: "Career Focused" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <item.icon className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Demo cards grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {DEMOS.map((demo, i) => {
          const isOpen = open === demo.id;
          const Icon = demo.icon;
          return (
            <motion.div
              key={demo.id}
              layout
              className="rounded-2xl border bg-card overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
            >
              {/* Screenshot area */}
              <div
                className={cn(
                  "relative aspect-video bg-gradient-to-br flex items-center justify-center overflow-hidden",
                  demo.gradient,
                )}
              >
                {demo.id === "certificate" ? (
                  <img
                    src="/certificate%200.png"
                    alt="Certificate"
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                    style={{ background: `${demo.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: demo.color }} />
                  </div>
                )}
                <div
                  className="absolute top-2 right-2 text-[9px] font-medium px-2 py-0.5 rounded-full text-white shadow-sm"
                  style={{ background: demo.color }}
                >
                  {demo.time}
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center">
                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                      style={{ background: demo.color }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpen(isOpen ? null : demo.id);
                      }}
                    >
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-sm">{demo.title}</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{demo.headline}</p>
                  </div>
                  <span
                    className="text-[9px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{
                      background: `${demo.badge.color}10`,
                      color: demo.badge.color,
                      border: `1px solid ${demo.badge.color}20`,
                    }}
                  >
                    {demo.badge.label}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  {demo.description}
                </p>

                {/* Benefits */}
                <div className="space-y-1 mb-4">
                  {demo.benefits.map((b) => (
                    <div key={b} className="flex items-center gap-1.5 text-[11px] text-foreground/70">
                      <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                      {b}
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-2">
                  {demo.route ? (
                    <Button asChild size="sm" className="h-8 text-xs rounded-lg font-semibold">
                      <Link to={demo.route}>
                        <Eye className="w-3 h-3 mr-1" />
                        {demo.cta}
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="h-8 text-xs rounded-lg font-semibold"
                      style={
                        isOpen
                          ? { background: demo.color, color: "#fff", border: "none" }
                          : undefined
                      }
                      variant={isOpen ? "default" : "default"}
                      onClick={() => setOpen(isOpen ? null : demo.id)}
                    >
                      {isOpen ? (
                        <>
                          <X className="w-3 h-3 mr-1" />
                          Close
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3 mr-1" />
                          {demo.cta}
                        </>
                      )}
                    </Button>
                  )}
                  {demo.route ? (
                    <Button asChild variant="ghost" size="sm" className="h-8 text-xs rounded-lg">
                      <Link to={demo.route}>
                        <Play className="w-3 h-3 mr-1" />
                        {demo.secondary}
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs rounded-lg"
                      onClick={() => setOpen(isOpen ? null : demo.id)}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      {demo.secondary}
                    </Button>
                  )}
                </div>
              </div>

              {/* Preview panel */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden border-t"
                  >
                    <div className="p-5 bg-muted/20">{demo.preview}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Bonus Feature Strip */}
      <motion.div
        className="mt-10 rounded-2xl border bg-card/50 p-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-center text-sm font-semibold text-muted-foreground mb-5">
          Why Students Love Learnify
        </p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          {[
            { icon: Sparkles, label: "Learn Faster" },
            { icon: TrendingUp, label: "Improve Scores" },
            { icon: Briefcase, label: "Get Job Ready" },
            { icon: Award, label: "Earn Certificates" },
            { icon: Rocket, label: "Launch Career" },
          ].map((item) => (
            <motion.div
              key={item.label}
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Live Activity Section */}
      <motion.div
        className="mt-8 rounded-2xl border bg-card p-5 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] via-transparent to-primary/[0.02]" />
        <div className="relative flex items-center justify-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <AnimatePresence mode="wait">
            <motion.div
              key={activityIdx}
              className="flex items-center gap-2 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <currentActivity.icon className="w-4 h-4 text-primary" />
              <span>
                <strong>{currentActivity.name}</strong> {currentActivity.action}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Final CTA */}
      <motion.div
        className="mt-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2">
          Try Every Feature Free
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          Experience the full power of Learnify AI before upgrading.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="h-12 px-8 text-base font-semibold rounded-xl shadow-lg shadow-primary/25"
          >
            <Link to="/signup">
              Start Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base font-semibold rounded-xl"
            onClick={() => {
              document
                .getElementById("interactive-demo")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Play className="w-5 h-5 mr-2" />
            Try Interactive Demo
          </Button>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-4 text-[11px] text-muted-foreground">
          <span>No Credit Card Required</span>
          <span className="text-muted-foreground/30">·</span>
          <span>Cancel Anytime</span>
          <span className="text-muted-foreground/30">·</span>
          <span>Instant Access</span>
          <span className="text-muted-foreground/30">·</span>
          <span>7-Day Guarantee</span>
        </div>
      </motion.div>
    </section>
  );
}
