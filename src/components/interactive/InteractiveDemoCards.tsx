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
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

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
              <p className="font-semibold text-xs text-pink-700 dark:text-pink-300">
                AI Interviewer
              </p>
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
    description:
      "Generate a complete portfolio plan with structure, content, and design recommendations.",
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
              <p className="font-semibold text-xs text-violet-700 dark:text-violet-300">
                Portfolio Preview
              </p>
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

/* ───────────────── Interactive Guest Simulations ───────────────── */
function InteractiveAiTutorDemo() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content: "Hi! I'm your Learnify AI Tutor. Ask me any coding or tech question!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = (q: string) => {
    if (!q.trim() || loading) return;
    setMessages((p) => [...p, { role: "user", content: q }]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      let response = "That's a great question! Here's a brief explanation: ";
      if (q.toLowerCase().includes("recursion")) {
        response +=
          "Recursion is a process in which a function calls itself directly or indirectly. A classic example is computing factorials:\n\n```python\ndef factorial(n):\n    if n <= 1: return 1 # Base case\n    return n * factorial(n - 1)\n```";
      } else if (q.toLowerCase().includes("closure")) {
        response +=
          "A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment). In JavaScript, closures are created every time a function is created, at function creation time.";
      } else if (q.toLowerCase().includes("transformer")) {
        response +=
          "Transformers process sequential data in parallel using a mechanism called self-attention. This allows models like GPT-4 or Gemini to learn the context and relationships between words regardless of distance.";
      } else {
        response += `To study "${q}" effectively, focus on the fundamental concepts first, then build hands-on projects, and test your knowledge with quizzes.`;
      }
      setMessages((p) => [...p, { role: "assistant", content: response }]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-xl border bg-background p-3.5 space-y-3 max-h-[220px] overflow-y-auto scrollbar-thin">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-2 text-left",
              m.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "rounded-2xl p-3 text-xs max-w-[85%] leading-relaxed shadow-sm",
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground",
              )}
            >
              {m.content.split("\n").map((line, li) => (
                <p
                  key={li}
                  className={cn(
                    line.startsWith("def") || line.startsWith("    ")
                      ? "font-mono bg-black/10 dark:bg-black/35 p-1.5 rounded mt-1 text-[11px]"
                      : "",
                  )}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 justify-start">
            <div className="bg-muted text-muted-foreground rounded-2xl px-3 py-2 text-xs animate-pulse">
              AI Tutor is thinking...
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {["Explain Recursion", "What is a Closure?", "What is a Transformer?"].map((tag) => (
          <button
            key={tag}
            onClick={() => ask(tag)}
            className="text-[10px] bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1 rounded-full font-medium transition cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          onKeyDown={(e) => e.key === "Enter" && ask(input)}
          className="flex-1 rounded-xl border bg-background px-3 py-1.5 text-xs focus-visible:outline-primary"
        />
        <Button size="sm" onClick={() => ask(input)} className="rounded-xl cursor-pointer">
          Send
        </Button>
      </div>
    </div>
  );
}

function InteractiveResumeDemo() {
  const [name, setName] = useState("Jane Doe");
  const [title, setTitle] = useState("Software Engineer");
  const [skills, setSkills] = useState("React, Node.js, TypeScript");
  const [res, setRes] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    if (!name || !title || !skills) return toast.error("Please fill in all fields");
    setLoading(true);
    setTimeout(() => {
      const score = Math.floor(Math.random() * 15) + 81;
      setRes({
        score,
        bullets: [
          `Optimized high-performance web applications using ${skills.split(",")[0] || "React"}`,
          "Improved system responsiveness by 25% with cleaner state architecture",
          "Automated deployment workflows reducing build errors",
        ],
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-3">
      {!res ? (
        <div className="space-y-2 bg-background p-3.5 rounded-xl border text-left">
          <p className="text-xs font-semibold">Mini Resume Builder</p>
          <div className="grid grid-cols-2 gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="rounded-lg border bg-card px-2.5 py-1 text-xs"
            />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Job Title"
              className="rounded-lg border bg-card px-2.5 py-1 text-xs"
            />
          </div>
          <input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Skills (comma separated)"
            className="w-full rounded-lg border bg-card px-2.5 py-1 text-xs"
          />
          <Button
            size="sm"
            onClick={generate}
            disabled={loading}
            className="w-full rounded-xl cursor-pointer"
          >
            {loading ? "Generating..." : "Generate AI Resume Details"}
          </Button>
        </div>
      ) : (
        <div className="bg-background p-3.5 rounded-xl border space-y-3 text-left">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-xs text-foreground">{name}</p>
              <p className="text-[10px] text-muted-foreground">{title}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-muted-foreground">ATS Score: </span>
              <span className="text-xs font-bold text-emerald-500">{res.score}/100</span>
            </div>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-dashed">
            {res.bullets.map((b: string, i: number) => (
              <p key={i} className="text-xs text-foreground/80 flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                {b}
              </p>
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setRes(null)}
            className="w-full rounded-xl cursor-pointer"
          >
            Create Another
          </Button>
        </div>
      )}
    </div>
  );
}

function InteractiveAtsDemo() {
  const [job, setJob] = useState("Frontend Engineer");
  const [skillsText, setSkillsText] = useState("JavaScript, HTML, CSS");
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const check = () => {
    if (!job || !skillsText) return;
    setLoading(true);
    setTimeout(() => {
      const skills = skillsText.toLowerCase();
      let score = 55;
      const suggestions = [];
      const missing = [];

      if (skills.includes("react") || skills.includes("nextjs") || skills.includes("typescript")) {
        score += 25;
      } else {
        missing.push("React", "TypeScript");
        suggestions.push("Add modern SPA frameworks like React to stand out.");
      }

      if (skills.includes("tailwindcss") || skills.includes("css")) {
        score += 15;
      } else {
        missing.push("Tailwind CSS");
      }

      setResult({
        score,
        missing,
        suggestions: [
          ...suggestions,
          "Use STAR method in experience bullets.",
          "Format phone number in international format.",
        ],
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-3">
      {!result ? (
        <div className="space-y-2 bg-background p-3.5 rounded-xl border text-left">
          <p className="text-xs font-semibold">Test ATS Match</p>
          <input
            value={job}
            onChange={(e) => setJob(e.target.value)}
            placeholder="Target Job Title (e.g. Frontend Engineer)"
            className="w-full rounded-lg border bg-card px-2.5 py-1 text-xs"
          />
          <textarea
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
            placeholder="Paste your resume skills list here..."
            rows={2}
            className="w-full rounded-lg border bg-card px-2.5 py-1 text-xs"
          />
          <Button
            size="sm"
            onClick={check}
            disabled={loading}
            className="w-full rounded-xl cursor-pointer"
          >
            {loading ? "Analyzing..." : "Check Match Score"}
          </Button>
        </div>
      ) : (
        <div className="bg-background p-3.5 rounded-xl border space-y-3 text-left">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold">Match for {job}</span>
            <span
              className={cn(
                "text-xs font-bold px-2 py-0.5 rounded-full",
                result.score >= 70
                  ? "bg-emerald-500/15 text-emerald-500"
                  : "bg-amber-500/15 text-amber-500",
              )}
            >
              {result.score}% Match
            </span>
          </div>
          <div className="space-y-2 border-t pt-2.5">
            {result.missing.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                  Missing Keywords
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {result.missing.map((m: string) => (
                    <span
                      key={m}
                      className="text-[9px] bg-red-500/10 text-red-600 px-1.5 py-0.5 rounded font-medium"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Suggestions
              </p>
              <ul className="text-xs space-y-1 list-disc list-inside text-foreground/85 mt-1">
                {result.suggestions.map((s: string, i: number) => (
                  <li key={i} className="leading-snug">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setResult(null)}
            className="w-full rounded-xl cursor-pointer"
          >
            Check Another
          </Button>
        </div>
      )}
    </div>
  );
}

function InteractiveInterviewDemo() {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const QUESTIONS = [
    "What is your experience with state management in React?",
    "How do you handle asynchronous operations in JavaScript?",
    "What is the difference between SQL and NoSQL databases?",
  ];

  const submit = () => {
    if (!ans.trim()) return;
    setLoading(true);
    setTimeout(() => {
      let score = "Good structure!";
      if (ans.length < 25) {
        score = "Try expanding your answer with real-world examples (STAR method).";
      } else {
        score = "Strong technical explanation! Good use of industry terminology.";
      }
      setFeedback(score);
      setLoading(false);
    }, 1200);
  };

  const next = () => {
    setFeedback(null);
    setAns("");
    setStep((s) => (s + 1) % QUESTIONS.length);
  };

  return (
    <div className="space-y-3 bg-background p-3.5 rounded-xl border text-left">
      <div className="flex items-center gap-2 mb-2">
        <Mic className="w-4 h-4 text-pink-500 animate-pulse" />
        <span className="text-xs font-semibold">Voice Interview Simulator</span>
      </div>

      <div className="rounded-lg bg-pink-500/5 p-3 border border-pink-500/10">
        <p className="text-xs font-medium italic text-foreground">"{QUESTIONS[step]}"</p>
      </div>

      {!feedback ? (
        <div className="space-y-2">
          <textarea
            value={ans}
            onChange={(e) => setAns(e.target.value)}
            placeholder="Type your answer here to simulate speaking..."
            rows={2}
            className="w-full rounded-lg border bg-card px-2.5 py-1 text-xs"
          />
          <Button
            size="sm"
            onClick={submit}
            disabled={loading || !ans.trim()}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-xl cursor-pointer"
          >
            {loading ? "Analyzing Speech..." : "Submit Answer"}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10 text-xs text-foreground/85">
            <span className="font-semibold block text-emerald-600 mb-0.5">AI Feedback:</span>
            {feedback}
          </div>
          <Button size="sm" onClick={next} className="w-full rounded-xl cursor-pointer">
            Next Question
          </Button>
        </div>
      )}
    </div>
  );
}

function InteractiveRoadmapDemo() {
  const [role, setRole] = useState("Full Stack Developer");
  const [roadmap, setRoadmap] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    if (!role) return;
    setLoading(true);
    setTimeout(() => {
      const items = [];
      if (role.toLowerCase().includes("front")) {
        items.push(
          "Phase 1: Advanced HTML & Modern CSS Grid/Flexbox",
          "Phase 2: React State, Routing, & Hooks",
          "Phase 3: State Management (Zustand, Redux Toolkit)",
          "Phase 4: Client Side Testing (Vitest, Playwright)",
        );
      } else if (role.toLowerCase().includes("back")) {
        items.push(
          "Phase 1: Node.js Core API & Express framework",
          "Phase 2: Relational Databases (PostgreSQL) & SQL Tuning",
          "Phase 3: Caching layers (Redis) & Message Queues (RabbitMQ)",
          "Phase 4: Containerization with Docker & CI/CD deployment",
        );
      } else {
        items.push(
          "Phase 1: React Frontend Foundations",
          "Phase 2: Node.js & REST API Backend design",
          "Phase 3: Database Integrations & ORMs (Prisma)",
          "Phase 4: Full Deployment & Cloud VPS Management",
        );
      }
      setRoadmap(items);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-3">
      {!roadmap ? (
        <div className="space-y-2 bg-background p-3.5 rounded-xl border text-left">
          <p className="text-xs font-semibold">Generate learning roadmap</p>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Target Role (e.g. React Developer)"
            className="w-full rounded-lg border bg-card px-2.5 py-1 text-xs"
          />
          <Button
            size="sm"
            onClick={generate}
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl cursor-pointer"
          >
            {loading ? "Generating path..." : "Generate AI Learning Path"}
          </Button>
        </div>
      ) : (
        <div className="bg-background p-3.5 rounded-xl border space-y-3 text-left">
          <p className="text-xs font-bold text-foreground">{role} Learning Path</p>
          <div className="space-y-2.5">
            {roadmap.map((r: string, i: number) => (
              <div key={i} className="flex gap-2 items-start text-xs">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold grid place-items-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-foreground/80 leading-snug">{r}</span>
              </div>
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setRoadmap(null)}
            className="w-full rounded-xl cursor-pointer"
          >
            Create Another Path
          </Button>
        </div>
      )}
    </div>
  );
}

function InteractiveCertDemo() {
  const [name, setName] = useState("Alex Rivera");
  const [topic, setTopic] = useState("Full Stack Development");
  const [style, setStyle] = useState("navy");
  const [generated, setGenerated] = useState(false);

  const getStyleClass = () => {
    switch (style) {
      case "purple":
        return "from-purple-950 to-indigo-900 border-purple-400/50";
      case "green":
        return "from-emerald-950 to-teal-900 border-emerald-400/50";
      default:
        return "from-blue-950 to-slate-950 border-amber-400/50";
    }
  };

  return (
    <div className="space-y-3">
      {!generated ? (
        <div className="space-y-2 bg-background p-3.5 rounded-xl border text-left">
          <p className="text-xs font-semibold">Visual Certificate Creator</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Student Name"
            className="w-full rounded-lg border bg-card px-2.5 py-1 text-xs"
          />
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic (e.g. React Developer)"
            className="w-full rounded-lg border bg-card px-2.5 py-1 text-xs"
          />
          <div className="flex gap-2">
            {[
              { id: "navy", label: "Navy Gold" },
              { id: "purple", label: "Royal Purple" },
              { id: "green", label: "Forest Green" },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStyle(st.id)}
                className={cn(
                  "flex-1 text-[10px] border px-2 py-1 rounded cursor-pointer transition",
                  style === st.id
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-card text-muted-foreground",
                )}
              >
                {st.label}
              </button>
            ))}
          </div>
          <Button
            size="sm"
            onClick={() => setGenerated(true)}
            className="w-full rounded-xl cursor-pointer"
          >
            Generate Certificate
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div
            className={cn(
              "border-4 rounded-xl p-5 text-center text-white bg-gradient-to-br shadow-md relative overflow-hidden text-left",
              getStyleClass(),
            )}
          >
            <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full border border-white/10 flex items-center justify-center rotate-12 pointer-events-none">
              <Award className="w-8 h-8 text-white/15" />
            </div>

            <p className="text-[9px] font-semibold text-amber-400 uppercase tracking-widest text-center">
              Certificate of Completion
            </p>
            <h4 className="text-sm font-bold mt-2 font-serif text-center">{name}</h4>
            <p className="text-[9px] text-white/60 mt-1 text-center">
              has successfully completed all requirements for
            </p>
            <p className="text-xs font-semibold text-white mt-1 text-center">{topic}</p>
            <div className="mt-4 pt-2 border-t border-white/10 flex justify-between items-center text-[7px] text-white/40">
              <span>Date: {new Date().toLocaleDateString()}</span>
              <span>ID: LFY-{Math.floor(Math.random() * 100000)}</span>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setGenerated(false)}
            className="w-full rounded-xl cursor-pointer"
          >
            Create Another Certificate
          </Button>
        </div>
      )}
    </div>
  );
}

function InteractivePortfolioDemo() {
  const [tech, setTech] = useState("React, Node.js, CSS");
  const [style, setStyle] = useState("Minimal dark");
  const [plan, setPlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    if (!tech) return;
    setLoading(true);
    setTimeout(() => {
      setPlan({
        sections: [
          "Hero section: Tagline emphasizing " + tech.split(",")[0],
          "Projects grid: Highlights 3 projects using " + tech,
          "About Me: Story explaining experience in these fields",
          "Contact form: direct Web email link",
        ],
        advice:
          "Deploy to Vercel or Netlify. Add a dynamic theme toggle to showcase design skills.",
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-3">
      {!plan ? (
        <div className="space-y-2 bg-background p-3.5 rounded-xl border text-left">
          <p className="text-xs font-semibold">Portfolio Blueprint Planner</p>
          <input
            value={tech}
            onChange={(e) => setTech(e.target.value)}
            placeholder="Tech Stack (e.g. React, Node.js)"
            className="w-full rounded-lg border bg-card px-2.5 py-1 text-xs"
          />
          <input
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="Design Vibe (e.g. Minimal dark)"
            className="w-full rounded-lg border bg-card px-2.5 py-1 text-xs"
          />
          <Button
            size="sm"
            onClick={generate}
            disabled={loading}
            className="w-full rounded-xl cursor-pointer"
          >
            {loading ? "Structuring portfolio..." : "Create Blueprint Plan"}
          </Button>
        </div>
      ) : (
        <div className="bg-background p-3.5 rounded-xl border space-y-3 text-left">
          <p className="text-xs font-bold text-foreground">Suggested Layout ({style})</p>
          <div className="space-y-1.5">
            {plan.sections.map((sec: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-xs text-foreground/75">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{sec}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground italic border-t pt-2">{plan.advice}</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPlan(null)}
            className="w-full rounded-xl cursor-pointer"
          >
            Plan Another
          </Button>
        </div>
      )}
    </div>
  );
}

interface InteractiveDemoCardsProps {
  className?: string;
}

export function InteractiveDemoCards({ className }: InteractiveDemoCardsProps) {
  const { user } = useAuth();
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
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm leading-relaxed">
          {user
            ? "Explore our most powerful AI tools. Launch them directly in your workspace or click to preview their capabilities."
            : "Experience our most powerful AI tools before creating an account. No signup. No credit card. No commitment. Just click and explore."}
        </p>
      </div>

      {/* Trust row */}
      <motion.div
        className="flex overflow-x-auto scrollbar-none justify-start sm:justify-center gap-5 sm:gap-6 mb-10 px-2 pb-2"
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
          <div
            key={item.label}
            className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0"
          >
            <item.icon className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium whitespace-nowrap">{item.label}</span>
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
                {/* Preview button - always visible on mobile, hover on desktop */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer opacity-80 hover:opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100"
                    style={{ background: demo.color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(isOpen ? null : demo.id);
                    }}
                  >
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div
                className="p-5 md:cursor-auto cursor-pointer"
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setOpen(isOpen ? null : demo.id);
                  }
                }}
              >
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
                    <div
                      key={b}
                      className="flex items-center gap-1.5 text-[11px] text-foreground/70"
                    >
                      <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                      {b}
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-2">
                  {demo.route && user ? (
                    <Button
                      asChild
                      size="sm"
                      className="h-8 text-xs rounded-lg font-semibold cursor-pointer"
                    >
                      <Link to={demo.route}>
                        <Eye className="w-3 h-3 mr-1" />
                        {demo.cta}
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="h-8 text-xs rounded-lg font-semibold cursor-pointer"
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

                  {demo.route && user ? (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs rounded-lg cursor-pointer"
                    >
                      <Link to={demo.route}>
                        <Play className="w-3 h-3 mr-1" />
                        {demo.secondary}
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs rounded-lg cursor-pointer"
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
                    <div className="p-5 bg-muted/20 space-y-4">
                      {demo.id === "ai-tutor" && <InteractiveAiTutorDemo />}
                      {demo.id === "resume" && <InteractiveResumeDemo />}
                      {demo.id === "ats" && <InteractiveAtsDemo />}
                      {demo.id === "mock-interview" && <InteractiveInterviewDemo />}
                      {demo.id === "roadmap" && <InteractiveRoadmapDemo />}
                      {demo.id === "certificate" && <InteractiveCertDemo />}
                      {demo.id === "portfolio" && <InteractivePortfolioDemo />}

                      {!user && demo.route && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-primary/5 border border-primary/20 mt-3">
                          <p className="text-[11px] text-muted-foreground text-center sm:text-left">
                            This is a live interactive simulation. Sign up for free to access the
                            full tool.
                          </p>
                          <Link to="/signup" className="w-full sm:w-auto shrink-0">
                            <Button
                              size="sm"
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-sm"
                            >
                              Start Free Now
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
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
        className="mt-8 rounded-2xl border bg-card p-4 sm:p-5 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] via-transparent to-primary/[0.02]" />
        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <AnimatePresence mode="wait">
            <motion.div
              key={activityIdx}
              className="flex items-center gap-2 text-xs sm:text-sm text-center sm:text-left"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <currentActivity.icon className="w-4 h-4 text-primary shrink-0" />
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
              document.getElementById("interactive-demo")?.scrollIntoView({ behavior: "smooth" });
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
          <span>30-Day Guarantee</span>
        </div>
      </motion.div>
    </section>
  );
}
