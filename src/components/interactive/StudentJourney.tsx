"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  UserPlus,
  GraduationCap,
  FileText,
  CheckCheck,
  Mic,
  Briefcase,
  Trophy,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  Star,
  Clock,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface JourneyStep {
  step: number;
  label: string;
  tagline: string;
  headline: string;
  description: string;
  duration: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  gradient: string;
  bgGlow: string;
  benefits: string[];
  ctaText: string;
  ctaRoute: string;
  mockupType: "signup" | "courses" | "resume" | "ats" | "interview" | "internship" | "hired";
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    step: 1,
    label: "Join Free",
    tagline: "Instant Onboarding",
    headline: "Create Your Account In 60 Seconds",
    description:
      "Start with zero commitments. Define your dream role, assess your baseline skills with AI diagnostics, and get an automated custom roadmap.",
    duration: "1 Min",
    icon: UserPlus,
    accentColor: "#3B82F6",
    gradient: "from-blue-600 via-indigo-600 to-blue-700",
    bgGlow: "rgba(59, 130, 246, 0.15)",
    benefits: [
      "Zero credit card required — free forever tier",
      "AI skill gap diagnosis & diagnostic quiz",
      "Personalized learning track configured automatically",
    ],
    ctaText: "Join Free Now",
    ctaRoute: "/signup",
    mockupType: "signup",
  },
  {
    step: 2,
    label: "Complete Courses",
    tagline: "24/7 AI-Guided Learning",
    headline: "Master Real AI & Software Engineering",
    description:
      "Learn at your own pace with a 1-on-1 AI Tutor. Ask unlimited questions, debug code in real time, build hands-on projects, and pass assessments.",
    duration: "Self-Paced",
    icon: GraduationCap,
    accentColor: "#8B5CF6",
    gradient: "from-purple-600 via-violet-600 to-indigo-700",
    bgGlow: "rgba(139, 92, 246, 0.15)",
    benefits: [
      "1-on-1 24/7 AI Tutor explains code line-by-line",
      "Hands-on interactive coding labs & project reviews",
      "Accredited certificates issued upon 100% completion",
    ],
    ctaText: "Explore Courses",
    ctaRoute: "/courses",
    mockupType: "courses",
  },
  {
    step: 3,
    label: "Build Resume",
    tagline: "ATS-Optimized Formatting",
    headline: "Craft Recruiter-Ready Resumes",
    description:
      "Generate modern, high-impact resumes tailored to current tech hiring criteria. AI injects high-impact action verbs, quantifies achievements, and formats layouts.",
    duration: "5 Mins",
    icon: FileText,
    accentColor: "#06B6D4",
    gradient: "from-cyan-600 via-blue-600 to-teal-700",
    bgGlow: "rgba(6, 182, 212, 0.15)",
    benefits: [
      "AI bullet generator with quantifiable metrics",
      "10+ recruiter-tested modern & minimal templates",
      "Instant 300 DPI PDF download & shareable link",
    ],
    ctaText: "Build Resume",
    ctaRoute: "/resume-builder",
    mockupType: "resume",
  },
  {
    step: 4,
    label: "Pass ATS",
    tagline: "Screening Firewall Beat",
    headline: "Score 90+ On Recruiter ATS Scanners",
    description:
      "Scan your resume against real applicant tracking systems (Workday, Taleo, Greenhouse). Identify missing keywords, fix formatting flaws, and boost callbacks.",
    duration: "Instant",
    icon: CheckCheck,
    accentColor: "#10B981",
    gradient: "from-emerald-600 via-teal-600 to-green-700",
    bgGlow: "rgba(16, 185, 129, 0.15)",
    benefits: [
      "Real-time ATS score benchmarked to job descriptions",
      "Deep keyword & required competency match breakdown",
      "Actionable recommendations to reach the 90%+ tier",
    ],
    ctaText: "Check ATS Score",
    ctaRoute: "/ats-checker",
    mockupType: "ats",
  },
  {
    step: 5,
    label: "Practice Interviews",
    tagline: "Realistic AI Simulation",
    headline: "Simulate Technical & HR Interviews",
    description:
      "Practice high-stakes mock interviews with AI voice mentors like Priya Kapoor. Receive instant feedback on technical accuracy, STAR responses, and speaking cadence.",
    duration: "15 Mins",
    icon: Mic,
    accentColor: "#F59E0B",
    gradient: "from-amber-600 via-orange-600 to-red-600",
    bgGlow: "rgba(245, 158, 11, 0.15)",
    benefits: [
      "Realistic voice simulation with technical architect AI",
      "Immediate scorecards on communication & problem-solving",
      "Comprehensive answer suggestions for weak points",
    ],
    ctaText: "Practice Interview",
    ctaRoute: "/interview",
    mockupType: "interview",
  },
  {
    step: 6,
    label: "Get Internship",
    tagline: "Verified Hiring Pipeline",
    headline: "Land Production Tech Internships",
    description:
      "Apply directly to vetted startup and enterprise internships. Stand out from thousands of applicants with verified Learnify certificates and proven skills.",
    duration: "1-3 Months",
    icon: Briefcase,
    accentColor: "#EC4899",
    gradient: "from-pink-600 via-rose-600 to-purple-700",
    bgGlow: "rgba(236, 72, 153, 0.15)",
    benefits: [
      "Curated hiring partner roles with fast-tracked screening",
      "Verified digital portfolio directly visible to employers",
      "Real production code & team experience for your CV",
    ],
    ctaText: "Find Internships",
    ctaRoute: "/internships",
    mockupType: "internship",
  },
  {
    step: 7,
    label: "Get Hired",
    tagline: "Career Transformation",
    headline: "Sign Your Dream Full-Time Tech Offer",
    description:
      "Step into high-paying AI, full-stack, or cloud roles. You have verified skills, ATS-beating resumes, interview mastery, and accredited credentials.",
    duration: "Placed!",
    icon: Trophy,
    accentColor: "#EAB308",
    gradient: "from-yellow-500 via-amber-600 to-orange-600",
    bgGlow: "rgba(234, 179, 8, 0.2)",
    benefits: [
      "3.5x average career transition acceleration",
      "₹8.5L – ₹28L+ target compensation packages",
      "Lifetime access to Learnify alumni and career network",
    ],
    ctaText: "Start Your Career",
    ctaRoute: "/signup",
    mockupType: "hired",
  },
];

export function StudentJourney() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const activeStep = JOURNEY_STEPS[activeIdx];
  const StepIcon = activeStep.icon;

  // Auto-play timeline loop (Remotion style 4.5s step cadence)
  useEffect(() => {
    if (!isPlaying) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const stepDuration = 4500;
    const intervalTick = 50;
    let elapsed = 0;

    progressIntervalRef.current = setInterval(() => {
      elapsed += intervalTick;
      const pct = Math.min((elapsed / stepDuration) * 100, 100);
      setProgress(pct);

      if (elapsed >= stepDuration) {
        elapsed = 0;
        setProgress(0);
        setActiveIdx((prev) => (prev + 1) % JOURNEY_STEPS.length);
      }
    }, intervalTick);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, activeIdx]);

  const selectStep = (index: number) => {
    setActiveIdx(index);
    setProgress(0);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const prevStep = () => {
    setActiveIdx((prev) => (prev === 0 ? JOURNEY_STEPS.length - 1 : prev - 1));
    setProgress(0);
  };

  const nextStep = () => {
    setActiveIdx((prev) => (prev + 1) % JOURNEY_STEPS.length);
    setProgress(0);
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 py-14 sm:py-20 max-w-6xl">
      {/* Header */}
      <motion.div
        className="text-center mb-8 sm:mb-12"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-3">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Complete 7-Stage Career Engine</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          Your Journey To Getting Hired
        </h2>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          From zero experience to career ready — all in one unified, AI-accelerated platform.
        </p>

        {/* Remotion-Style Playback Control Strip */}
        <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-card border shadow-sm text-xs text-muted-foreground">
          <button
            onClick={togglePlay}
            className="flex items-center gap-1.5 font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
            title={isPlaying ? "Pause Timeline Auto-play" : "Play Timeline Auto-play"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-primary text-primary" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-primary text-primary" />
            )}
            <span>{isPlaying ? "Auto-playing" : "Paused"}</span>
          </button>
          <span className="text-border">|</span>
          <span className="font-mono text-[11px] font-semibold text-foreground">
            STAGE 0{activeStep.step} / 07
          </span>
          <span className="text-border">|</span>
          <div className="w-16 sm:w-24 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Stepper Navigation: Mobile-First Scrollable Tabs & Desktop Horizontal Line */}
      <div className="relative mb-8">
        {/* Desktop Connecting Beam */}
        <div className="hidden md:block absolute top-6 left-8 right-8 h-1 bg-border/60 -z-0">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 transition-all duration-500 ease-out"
            style={{ width: `${(activeIdx / (JOURNEY_STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps container */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none px-1 md:justify-between md:overflow-visible">
          {JOURNEY_STEPS.map((s, idx) => {
            const IconComp = s.icon;
            const isActive = idx === activeIdx;
            const isCompleted = idx < activeIdx;

            return (
              <button
                key={s.step}
                onClick={() => selectStep(idx)}
                className={cn(
                  "shrink-0 group flex flex-col md:items-center text-left md:text-center transition-all duration-300 relative z-10 cursor-pointer focus:outline-none",
                  "rounded-xl md:rounded-none p-2 sm:p-2.5 md:p-0",
                  isActive
                    ? "bg-card border-2 shadow-md md:bg-transparent md:border-none md:shadow-none"
                    : "bg-muted/40 hover:bg-muted/70 md:bg-transparent",
                )}
                style={isActive ? { borderColor: `${s.accentColor}80` } : undefined}
              >
                {/* Numbered circular node */}
                <div
                  className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-xl md:rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-md",
                    isActive
                      ? "text-white scale-110 ring-4"
                      : isCompleted
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-card border border-border text-muted-foreground group-hover:border-primary/40",
                  )}
                  style={
                    isActive
                      ? {
                          background: `linear-gradient(135deg, ${s.accentColor}, #4F46E5)`,
                          boxShadow: `0 0 0 4px ${s.accentColor}30`,
                        }
                      : undefined
                  }
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-primary stroke-[3]" />
                  ) : (
                    <span>{s.step}</span>
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-1.5 md:mt-2.5">
                  <div
                    className={cn(
                      "text-xs font-semibold whitespace-nowrap transition-colors",
                      isActive
                        ? "text-foreground font-bold"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {s.label}
                  </div>
                  <div className="hidden md:block text-[10px] text-muted-foreground/75 font-mono">
                    {s.duration}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Showcase Card: Mobile First & Dynamic Remotion-Inspired Visualizer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep.step}
          className="relative rounded-3xl border-2 bg-card/95 backdrop-blur-xl overflow-hidden shadow-2xl transition-all duration-500"
          style={{ borderColor: `${activeStep.accentColor}40` }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
        >
          {/* Subtle Ambient Glow */}
          <div
            className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-40"
            style={{ background: activeStep.accentColor }}
          />
          <div
            className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ background: activeStep.accentColor }}
          />

          <div className="p-6 sm:p-8 md:p-10 relative z-10 grid md:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="md:col-span-7 space-y-4 sm:space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1.5"
                  style={{ background: activeStep.accentColor }}
                >
                  <StepIcon className="w-3.5 h-3.5" />
                  <span>STEP 0{activeStep.step}</span>
                </span>
                <Badge variant="outline" className="text-xs font-medium gap-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  {activeStep.duration}
                </Badge>
                <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
                  &bull; {activeStep.tagline}
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {activeStep.headline}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {activeStep.description}
                </p>
              </div>

              {/* What You Achieve List */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Key Milestones Unlocked:
                </div>
                {activeStep.benefits.map((benefit, i) => (
                  <motion.div
                    key={benefit}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/85"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${activeStep.accentColor}20` }}
                    >
                      <Check
                        className="w-2.5 h-2.5 stroke-[3]"
                        style={{ color: activeStep.accentColor }}
                      />
                    </div>
                    <span>{benefit}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTAs and Stepper Controls */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-xl font-bold shadow-lg text-white hover:opacity-95 transition-opacity cursor-pointer px-6"
                  style={{
                    background: `linear-gradient(135deg, ${activeStep.accentColor}, #4338CA)`,
                  }}
                >
                  <Link to={activeStep.ctaRoute}>
                    <span>{activeStep.ctaText}</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </Button>

                {/* Prev / Next controls for quick mobile or desktop thumb tapping */}
                <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={prevStep}
                    className="rounded-xl h-10 w-10 cursor-pointer"
                    title="Previous Step"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={nextStep}
                    className="rounded-xl h-10 w-10 cursor-pointer"
                    title="Next Step"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Stage Simulator (Remotion Aesthetic) */}
            <div className="md:col-span-5">
              <div className="relative rounded-2xl border bg-slate-950 p-5 text-white shadow-inner overflow-hidden min-h-[260px] flex flex-col justify-between">
                {/* Header bar of visualizer */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <span className="text-[10px] font-mono text-white/50 ml-2">
                      LEARNIFY_ENGINE_STAGE_0{activeStep.step}.tsx
                    </span>
                  </div>
                  <div className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                    LIVE PREVIEW
                  </div>
                </div>

                {/* Step specific interactive preview mock */}
                <div className="my-auto py-4">
                  {activeStep.mockupType === "signup" && (
                    <div className="space-y-2 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
                        <UserPlus className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-bold text-white">Learner Account Ready</div>
                      <div className="text-[10px] text-white/60">
                        Target Role: Full-Stack AI Engineer
                      </div>
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-medium border border-emerald-500/30">
                        <Check className="w-3 h-3" /> Diagnostic Test Passed
                      </div>
                    </div>
                  )}

                  {activeStep.mockupType === "courses" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>Autonomous Agents Masterclass</span>
                        <span className="text-purple-400">100% Complete</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 w-full" />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-white/60">
                        <span>AI Code Tutor: Active</span>
                        <span className="text-emerald-400 font-medium">All Quizzes Verified</span>
                      </div>
                    </div>
                  )}

                  {activeStep.mockupType === "resume" && (
                    <div className="space-y-2 bg-white/5 p-3 rounded-xl border border-white/10">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">Rahul Sharma — AI Engineer</span>
                        <span className="text-[9px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded font-mono">
                          ATS READY
                        </span>
                      </div>
                      <p className="text-[10px] text-white/70 italic">
                        &quot;Engineered multi-agent LLM workflow reducing query latency by 42%...&quot;
                      </p>
                      <div className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-mono">
                        <Check className="w-3 h-3" /> 300 DPI Export Configured
                      </div>
                    </div>
                  )}

                  {activeStep.mockupType === "ats" && (
                    <div className="text-center space-y-2">
                      <div className="inline-block relative">
                        <div className="text-3xl font-black text-emerald-400">96 / 100</div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-white/70">
                          Workday & Taleo Rating
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-left mt-2">
                        <div className="bg-white/5 p-2 rounded border border-white/10">
                          <span className="text-white/50 block">Keywords</span>
                          <span className="text-emerald-400 font-bold">18 / 18 matched</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded border border-white/10">
                          <span className="text-white/50 block">Formatting</span>
                          <span className="text-emerald-400 font-bold">Clean 0 Errors</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep.mockupType === "interview" && (
                    <div className="space-y-2.5 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
                        <Mic className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                        <span>Priya Kapoor &bull; Ex-Google Architect</span>
                      </div>
                      <p className="text-[11px] text-white/80">
                        &quot;Your explanation of vector embeddings and cosine similarity was exemplary.&quot;
                      </p>
                      <div className="text-[10px] text-emerald-400 font-semibold">
                        STAR Method Score: 94%
                      </div>
                    </div>
                  )}

                  {activeStep.mockupType === "internship" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">AI Platform Intern</span>
                        <span className="text-pink-400 font-semibold">₹35,000 / mo</span>
                      </div>
                      <p className="text-[10px] text-white/60">
                        NexGen AI Labs &bull; Remote &bull; Fast-Track Application
                      </p>
                      <div className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        <Check className="w-2.5 h-2.5" /> Direct Interview Scheduled
                      </div>
                    </div>
                  )}

                  {activeStep.mockupType === "hired" && (
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center mx-auto text-yellow-400">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-bold text-white">Full-Time Offer Accepted</div>
                      <div className="text-xs text-amber-300 font-semibold">
                        Package: ₹14.5 LPA &bull; Senior AI Associate
                      </div>
                      <div className="text-[9px] text-white/50">
                        Verified Credentials Attested On-Chain
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer bar of visualizer */}
                <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[9px] text-white/50 font-mono">
                  <span>Learnify AI Placement Network</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
