import React from "react";
import {
  Sparkles,
  Target,
  BookOpen,
  Briefcase,
  FileText,
  Video,
  Share2,
  Compass,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
  Users,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CareerOsOverviewProps {
  userName?: string;
  onSelectTab: (tabId: string) => void;
  targetRole?: string;
  readinessScore?: number;
  atsScore?: number;
}

export function CareerOsOverview({
  userName = "Engineer",
  onSelectTab,
  targetRole = "Full Stack AI Engineer",
  readinessScore = 78,
  atsScore = 88,
}: CareerOsOverviewProps) {
  const OS_PILLARS = [
    {
      id: "agents",
      title: "AI Career Copilot",
      tagline: "10 Specialized FAANG Mentors",
      description: "Direct conversational guidance, architecture reviews, interview drills, and real-time tool calling.",
      icon: Sparkles,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      badge: "10 Mentors Ready",
      actionText: "Chat with Mentors",
    },
    {
      id: "skillgap",
      title: "Skill Gap Analysis",
      tagline: "Role Competency Matrix",
      description: "Compare your current verified skills against industry benchmarks and target role requirements.",
      icon: Target,
      color: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-500/10",
      border: "border-teal-500/20",
      badge: `${readinessScore}% Readiness`,
      actionText: "Review Gaps",
    },
    {
      id: "guides",
      title: "Skill Roadmaps",
      tagline: "2026 Tech Curricula",
      description: "Structured step-by-step learning roadmaps for AI, Cloud, DevOps, Distributed Systems & Frontend.",
      icon: BookOpen,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      badge: "8 Curricula",
      actionText: "Explore Roadmaps",
    },
    {
      id: "job-board",
      title: "Live Jobs & Internships",
      tagline: "Direct Sourced Roles",
      description: "Hand-curated opportunities from top startups and global tech teams with 1-click verified apply.",
      icon: Briefcase,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      badge: "24 Matched Roles",
      actionText: "Find Roles",
    },
    {
      id: "resume",
      title: "ATS Resume Builder",
      tagline: "DreamSync Pro Studio",
      description: "Executive and tech resume templates with real-time ATS scoring, keyword matching & instant PDF export.",
      icon: FileText,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      badge: `ATS Score: ${atsScore}%`,
      actionText: "Edit Resume",
    },
    {
      id: "interview",
      title: "Mock Interview Studio",
      tagline: "Realistic AI Simulations",
      description: "Interactive mock interviews with speech recognition, avatar responses, and STAR scoring breakdown.",
      icon: Video,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      badge: "Speech AI Enabled",
      actionText: "Start Practice",
    },
    {
      id: "linkedin",
      title: "LinkedIn Optimizer",
      tagline: "Profile & Post Generator",
      description: "Craft high-converting headlines, recruiter-ready bios, and viral engineering breakdown posts.",
      icon: Share2,
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      badge: "AI Viral Posts",
      actionText: "Optimize Profile",
    },
    {
      id: "coaching",
      title: "1:1 Executive Coaching",
      tagline: "Staff & Principal Engineers",
      description: "Book dedicated video sessions with industry leaders for architecture audits and offer negotiation.",
      icon: Compass,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      badge: "Verified Staff Leads",
      actionText: "Book Session",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pt-2 pb-12">
      {/* ── 1. Hero Next Primary Action Card ── */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(52,122,61,0.2),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Career OS · Next Primary Action</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold tracking-tight text-white">
              Accelerate your journey to {targetRole}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your profile is <strong className="text-emerald-400">{readinessScore}% ready</strong> for target roles. Practice a system design mock interview or address your top 3 skill gaps to unlock interview readiness.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Button
              onClick={() => onSelectTab("interview")}
              className="h-11 sm:h-12 px-6 rounded-2xl bg-gradient-to-r from-[#245F30] to-[#347A3D] hover:from-[#174422] hover:to-[#245F30] text-white font-bold text-sm shadow-lg shadow-emerald-950/40 cursor-pointer flex items-center justify-center gap-2"
            >
              <Video className="w-4 h-4" />
              <span>Start Practice Interview</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => onSelectTab("agents")}
              className="h-11 sm:h-12 px-5 rounded-2xl border-white/20 hover:bg-white/10 text-white font-semibold text-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Ask AI Mentor</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ── 2. Metric Overview Strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => onSelectTab("skillgap")}
          className="p-4 rounded-2xl border border-border/80 bg-card hover:border-[#347A3D]/40 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Skill Readiness
            </span>
            <Target className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground mt-2">
            {readinessScore}%
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> 14/18 skills verified
          </p>
        </div>

        <div
          onClick={() => onSelectTab("resume")}
          className="p-4 rounded-2xl border border-border/80 bg-card hover:border-[#347A3D]/40 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              ATS Resume
            </span>
            <FileText className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground mt-2">
            {atsScore}/100
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-indigo-500" /> High parsing score
          </p>
        </div>

        <div
          onClick={() => onSelectTab("agents")}
          className="p-4 rounded-2xl border border-border/80 bg-card hover:border-[#347A3D]/40 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Active Mentors
            </span>
            <Sparkles className="w-4 h-4 text-[#347A3D] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground mt-2">
            10 Roles
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#347A3D]" /> Real-time tool execution
          </p>
        </div>

        <div
          onClick={() => onSelectTab("job-board")}
          className="p-4 rounded-2xl border border-border/80 bg-card hover:border-[#347A3D]/40 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Matched Jobs
            </span>
            <Briefcase className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground mt-2">
            24 Open
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-amber-500" /> Updated today
          </p>
        </div>
      </div>

      {/* ── 3. Career OS Core Pillars Grid ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-display font-bold text-foreground">
              Career OS Subsystems
            </h3>
            <p className="text-xs text-muted-foreground">
              Select any pillar below to launch the dedicated studio module.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {OS_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card
                key={pillar.id}
                onClick={() => onSelectTab(pillar.id)}
                className="p-5 rounded-2xl border border-border/80 bg-card hover:border-[#347A3D]/50 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className={cn("p-2.5 rounded-xl border flex items-center justify-center shrink-0", pillar.bg, pillar.border, pillar.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className={cn("text-[10px] font-semibold py-0.5 px-2", pillar.border, pillar.color)}>
                      {pillar.badge}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                      {pillar.title}
                    </h4>
                    <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
                      {pillar.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-border/50 flex items-center justify-between text-xs font-bold text-primary">
                  <span>{pillar.actionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
