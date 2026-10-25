"use client";

import React, { useState } from "react";
import {
  Brain,
  Palette,
  Type,
  Grid,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  Play,
  Copy,
  Check,
  Eye,
  Sliders,
  Compass,
  Cpu,
  Monitor,
  Smartphone,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DesignThinkingStudioProps {
  courseTitle?: string;
  lessonTitle?: string;
  onOpenIde?: (starterCode: string, language?: string) => void;
  className?: string;
}

export function DesignThinkingStudio({
  courseTitle = "UI & UX Design Masterclass",
  lessonTitle = "Visual Hierarchy, Auto Layout & Design Rules",
  onOpenIde,
  className,
}: DesignThinkingStudioProps) {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"graph" | "thinking" | "colors" | "typography" | "grid">("graph");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyToken = (val: string, name: string) => {
    navigator.clipboard.writeText(val);
    setCopiedToken(name);
    toast.success(`Copied ${name} (${val}) to clipboard`);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  // ─── Design Thinking 5-Stage Data ──────────────────────────────────────
  const stages = [
    {
      id: "empathize",
      number: "01",
      title: "Empathize",
      tagline: "Understand User Pain Points",
      color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
      accent: "#38bdf8",
      description:
        "Conduct user interviews, field studies, and empathy mapping. Step into the user's shoes to uncover hidden friction points rather than assuming needs.",
      deliverables: ["User Personas", "Empathy Maps", "Journey Maps"],
      keyMetric: "82% of product rework is prevented by early qualitative user research.",
      proTip: "Never ask users 'What do you want?'. Ask 'Show me how you currently solve this problem.'",
    },
    {
      id: "define",
      number: "02",
      title: "Define",
      tagline: "Frame the Core Problem Statement",
      color: "from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30",
      accent: "#6366f1",
      description:
        "Synthesize raw findings into an actionable 'How Might We' (HMW) statement. Align stakeholder goals with genuine user friction points.",
      deliverables: ["Problem Statements", "HMW Questions", "Value Propositions"],
      keyMetric: "Clearly scoped problem statements cut design development cycles by 40%.",
      proTip: "A great problem statement is user-centered, broad enough for creative freedom, yet narrow enough to be solvable.",
    },
    {
      id: "ideate",
      number: "03",
      title: "Ideate",
      tagline: "Brainstorm Divergent Solutions",
      color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
      accent: "#a855f7",
      description:
        "Generate wide-ranging creative options through Crazy 8s, visual storyboards, and structural wireflow sketches. Prioritize quantity before filtering quality.",
      deliverables: ["Crazy Eights", "Information Architecture", "Low-Fi Wireframes"],
      keyMetric: "Teams that test at least 5 distinct wireframe concepts build 3x higher retention apps.",
      proTip: "Defer judgment in initial ideation rounds; wild ideas often spark breakthrough usable features.",
    },
    {
      id: "prototype",
      number: "04",
      title: "Prototype",
      tagline: "Build Interactive Mockups & Systems",
      color: "from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30",
      accent: "#f43f5e",
      description:
        "Translate chosen sketches into component-driven prototypes using Auto Layout, interactive variants, and production tokens (CSS variables).",
      deliverables: ["Clickable Figma Prototypes", "Component Design System", "Interactive Sandbox"],
      keyMetric: "Interactive prototypes reveal 85% of navigation bottlenecks before writing a single line of backend code.",
      proTip: "Build prototypes with realistic copy and real data — lorem ipsum masks critical layout overflow bugs.",
    },
    {
      id: "test",
      number: "05",
      title: "Test",
      tagline: "Validate & Iterate with Real Users",
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
      accent: "#10b981",
      description:
        "Run moderated usability tests, measure task completion time, and track System Usability Scale (SUS) scores. Iterate rapidly on feedback loops.",
      deliverables: ["Usability Audit Reports", "Heatmap Analysis", "Actionable Iteration Backlog"],
      keyMetric: "Testing with just 5 real target users uncovers over 80% of critical usability flaws (Nielsen Norman Group).",
      proTip: "Watch what users DO, not what they SAY. Non-verbal hesitation reveals confusing UI faster than surveys.",
    },
  ];

  // ─── Color Harmony 60-30-10 System Data ────────────────────────────────
  const colorRuleTokens = [
    {
      role: "60% Dominant (Canvas & Surfaces)",
      hex: "#080C15",
      rgb: "rgb(8, 12, 21)",
      name: "Midnight Slate Canvas",
      usage: "Page backgrounds, full-viewport canvases, deep container panels. Provides optimal contrast while minimizing eye strain.",
      wcag: "AAA (18.4:1 against Pure White text)",
      badge: "60% DOMINANT",
      badgeColor: "bg-slate-800 text-slate-300 border-slate-700",
    },
    {
      role: "30% Structural (Cards, Borders & Inputs)",
      hex: "#1E293B",
      rgb: "rgb(30, 41, 59)",
      name: "Deep Slate Structural Layer",
      usage: "Component cards, dialog surfaces, sidebar navigation, form inputs, and dividers. Defines spatial layout hierarchy.",
      wcag: "AA (9.6:1 against Pure White text)",
      badge: "30% STRUCTURAL",
      badgeColor: "bg-indigo-950/80 text-indigo-300 border-indigo-800/60",
    },
    {
      role: "10% Accent (Focal CTAs & Micro-interactions)",
      hex: "#38BDF8",
      rgb: "rgb(56, 189, 248)",
      name: "Electric Sky Accent",
      usage: "Primary action buttons, active navigation indicators, key status badges, and progress meters. Guides the user's eye.",
      wcag: "AAA (11.2:1 against Dark Canvas)",
      badge: "10% ACCENT CTA",
      badgeColor: "bg-sky-500/20 text-sky-300 border-sky-400/40",
    },
  ];

  // ─── Typography Scale Data ─────────────────────────────────────────────
  const typeTokens = [
    {
      name: "Display Hero (H1)",
      font: "Space Grotesk",
      weight: "700 Bold",
      size: "2.25rem (36px)",
      leading: "1.15",
      sample: "AI-Native Learning Operating System",
      role: "Primary page headers, course hero super-titles. Weight-driven impact.",
    },
    {
      name: "Section Heading (H2)",
      font: "Space Grotesk",
      weight: "600 SemiBold",
      size: "1.5rem (24px)",
      leading: "1.25",
      sample: "Visual Hierarchy & Layout Principles",
      role: "Major content modules, card group titles, modal headlines.",
    },
    {
      name: "Subheading / Card Title (H3)",
      font: "Space Grotesk",
      weight: "600 SemiBold",
      size: "1.125rem (18px)",
      leading: "1.35",
      sample: "Component Architecture & Design Tokens",
      role: "Bento box headers, feature cards, tab labels.",
    },
    {
      name: "Body Text (Regular)",
      font: "DM Sans",
      weight: "400 Regular",
      size: "0.875rem (14px)",
      leading: "1.6",
      sample: "Consistent spatial scales and accessible contrast ratios guarantee effortless legibility across all screen sizes.",
      role: "Course notes, lecture transcripts, documentation guides.",
    },
    {
      name: "Caption & Micro-copy",
      font: "DM Sans",
      weight: "500 Medium",
      size: "0.75rem (12px)",
      leading: "1.4",
      sample: "Updated 2 mins ago · Verified by Learnify Curriculum Board",
      role: "Timestamps, metadata tags, badge labels, helper tips.",
    },
  ];

  const starterCssCode = `/* Learnify AI Design System Tokens */
:root {
  /* ── 60-30-10 Color Scheme ── */
  --color-canvas-dominant: #080C15; /* 60% */
  --color-surface-structural: #1E293B; /* 30% */
  --color-accent-cta: #38BDF8; /* 10% */
  --color-accent-hover: #0284C7;

  /* ── Typography Scale ── */
  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'DM Sans', sans-serif;

  /* ── 8pt Spatial Rhythm ── */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --radius-card: 16px;
}

.hero-card {
  background: var(--color-surface-structural);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-card);
  padding: var(--space-3);
  font-family: var(--font-body);
}

.hero-cta {
  background: var(--color-accent-cta);
  color: #080C15;
  font-weight: 700;
  border-radius: 9999px;
  padding: 10px var(--space-3);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.hero-cta:hover {
  transform: translateY(-2px) scale(1.02);
}`;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-gradient-to-b from-card via-card/90 to-background shadow-xl overflow-hidden my-6",
        className,
      )}
    >
      {/* ─── Top Studio Banner & Hook ──────────────────────────────────────── */}
      <div className="relative px-6 py-6 bg-gradient-to-r from-indigo-950/60 via-slate-900/90 to-sky-950/60 border-b border-border/70 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-sky-500/10 text-sky-400 border-sky-500/30 font-display font-semibold text-[11px] px-2.5 py-0.5 tracking-wider uppercase"
              >
                <Sparkles className="h-3 w-3 mr-1 text-sky-400" /> Learnify Design Thinking Studio
              </Badge>
              <Badge
                variant="outline"
                className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-[11px] px-2"
              >
                Interactive Architecture
              </Badge>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground tracking-tight">
              {lessonTitle}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-semibold">The 2026 Industry Hook:</strong> 87% of digital products fail retention audits not because of engineering bugs, but due to chaotic visual hierarchy and arbitrary spacing. Master the systematic Design Thinking lifecycle, color mathematics, and spatial rhythm below.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenIde && (
              <Button
                onClick={() => onOpenIde(starterCssCode, "css")}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Practice in IDE</span>
              </Button>
            )}
          </div>
        </div>

        {/* ─── Studio Sub-Navigation ───────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 pt-4 mt-3 border-t border-white/5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("graph")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer",
              activeTab === "graph"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5",
            )}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Interactive Workflow Graph</span>
          </button>

          <button
            onClick={() => setActiveTab("thinking")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer",
              activeTab === "thinking"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5",
            )}
          >
            <Brain className="h-3.5 w-3.5" />
            <span>5-Stage Design Thinking</span>
          </button>

          <button
            onClick={() => setActiveTab("colors")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer",
              activeTab === "colors"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5",
            )}
          >
            <Palette className="h-3.5 w-3.5" />
            <span>60-30-10 Color System</span>
          </button>

          <button
            onClick={() => setActiveTab("typography")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer",
              activeTab === "typography"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5",
            )}
          >
            <Type className="h-3.5 w-3.5" />
            <span>Typography Scale</span>
          </button>

          <button
            onClick={() => setActiveTab("grid")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer",
              activeTab === "grid"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5",
            )}
          >
            <Grid className="h-3.5 w-3.5" />
            <span>8pt Grid & Box Model</span>
          </button>
        </div>
      </div>

      {/* ─── TAB 1: INTERACTIVE WORKFLOW GRAPH (DRAW THE GRAPHS) ─────────── */}
      {activeTab === "graph" && (
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-display font-bold text-base text-foreground">
                End-to-End Product Architecture & Design Pipeline
              </h4>
              <p className="text-xs text-muted-foreground">
                Hover or click any node in the architecture to view inputs, validation gates, and deliverables.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" /> Live Pulse Flow
            </div>
          </div>

          {/* SVG Diagram Canvas */}
          <div className="relative rounded-2xl border border-border/80 bg-zinc-950/70 p-6 overflow-x-auto shadow-inner">
            <svg
              className="w-full min-w-[760px] h-48"
              viewBox="0 0 800 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="gradient-flow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connecting Curved Lines */}
              <path
                d="M 120 90 C 180 90, 200 90, 260 90"
                stroke="url(#gradient-flow)"
                strokeWidth="3"
                strokeDasharray="6 4"
                className="animate-[dash_10s_linear_infinite]"
              />
              <path
                d="M 360 90 C 420 90, 440 90, 500 90"
                stroke="url(#gradient-flow)"
                strokeWidth="3"
                strokeDasharray="6 4"
              />
              <path
                d="M 600 90 C 660 90, 680 90, 720 90"
                stroke="url(#gradient-flow)"
                strokeWidth="3"
              />

              {/* Node 1: Empathy & Research */}
              <g transform="translate(40, 50)" className="cursor-pointer group">
                <rect
                  width="110"
                  height="80"
                  rx="14"
                  fill="#0F172A"
                  stroke="#38BDF8"
                  strokeWidth="2"
                  filter="url(#glow-effect)"
                  className="transition-transform group-hover:scale-105"
                />
                <circle cx="55" cy="24" r="12" fill="rgba(56,189,248,0.2)" />
                <text x="55" y="28" fill="#38BDF8" fontSize="12" fontWeight="bold" textAnchor="middle">1</text>
                <text x="55" y="52" fill="#F8FAFC" fontSize="11" fontWeight="bold" textAnchor="middle">Empathy</text>
                <text x="55" y="66" fill="#94A3B8" fontSize="9" textAnchor="middle">User Studies</text>
              </g>

              {/* Node 2: Wireframe & System */}
              <g transform="translate(240, 50)" className="cursor-pointer group">
                <rect
                  width="130"
                  height="80"
                  rx="14"
                  fill="#0F172A"
                  stroke="#6366F1"
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-105"
                />
                <circle cx="65" cy="24" r="12" fill="rgba(99,102,241,0.2)" />
                <text x="65" y="28" fill="#818CF8" fontSize="12" fontWeight="bold" textAnchor="middle">2</text>
                <text x="65" y="52" fill="#F8FAFC" fontSize="11" fontWeight="bold" textAnchor="middle">Wireframing</text>
                <text x="65" y="66" fill="#94A3B8" fontSize="9" textAnchor="middle">Auto Layout &amp; Grids</text>
              </g>

              {/* Node 3: Design Tokens */}
              <g transform="translate(470, 50)" className="cursor-pointer group">
                <rect
                  width="140"
                  height="80"
                  rx="14"
                  fill="#0F172A"
                  stroke="#A855F7"
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-105"
                />
                <circle cx="70" cy="24" r="12" fill="rgba(168,85,247,0.2)" />
                <text x="70" y="28" fill="#C084FC" fontSize="12" fontWeight="bold" textAnchor="middle">3</text>
                <text x="70" y="52" fill="#F8FAFC" fontSize="11" fontWeight="bold" textAnchor="middle">Design Tokens</text>
                <text x="70" y="66" fill="#94A3B8" fontSize="9" textAnchor="middle">60-30-10 &amp; Typography</text>
              </g>

              {/* Node 4: Shipped Production */}
              <g transform="translate(680, 50)" className="cursor-pointer group">
                <rect
                  width="110"
                  height="80"
                  rx="14"
                  fill="#0F172A"
                  stroke="#10B981"
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-105"
                />
                <circle cx="55" cy="24" r="12" fill="rgba(16,185,129,0.2)" />
                <text x="55" y="28" fill="#34D399" fontSize="12" fontWeight="bold" textAnchor="middle">4</text>
                <text x="55" y="52" fill="#F8FAFC" fontSize="11" fontWeight="bold" textAnchor="middle">Ship &amp; Test</text>
                <text x="55" y="66" fill="#94A3B8" fontSize="9" textAnchor="middle">Usability Feedback</text>
              </g>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-1">
              <span className="font-bold text-blue-400 block font-display">Phase 1: Research</span>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Discover unarticulated user needs and map critical friction points into quantified pain scores.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-1">
              <span className="font-bold text-indigo-400 block font-display">Phase 2: Structural Wireframes</span>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Establish responsive container hierarchies with strict 8pt padding before selecting visual styles.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-purple-500/20 bg-purple-500/5 space-y-1">
              <span className="font-bold text-purple-400 block font-display">Phase 3: Design Tokens</span>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Implement semantic CSS variables for themeable light/dark modes and automated WCAG AAA validation.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
              <span className="font-bold text-emerald-400 block font-display">Phase 4: Validation</span>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Test interactive prototypes with real target users to measure task completion rate and drop-off.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: 5-STAGE DESIGN THINKING ───────────────────────────────── */}
      {activeTab === "thinking" && (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {stages.map((stage, idx) => (
              <button
                key={stage.id}
                onClick={() => setActiveStage(idx)}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden",
                  activeStage === idx
                    ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary/40"
                    : "border-border/60 bg-muted/20 hover:border-border hover:bg-muted/40",
                )}
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold text-muted-foreground mb-1">
                  <span>{stage.number}</span>
                  {activeStage === idx && (
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  )}
                </div>
                <div className="font-display font-bold text-sm text-foreground">{stage.title}</div>
                <div className="text-[10px] text-muted-foreground truncate mt-0.5">{stage.tagline}</div>
              </button>
            ))}
          </div>

          {/* Active Stage Detailed Card */}
          <div className="p-6 rounded-2xl border border-border/80 bg-muted/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-bold text-primary">
                  {stages[activeStage].number}
                </span>
                <div>
                  <h4 className="text-lg font-bold font-display text-foreground">
                    Stage {activeStage + 1}: {stages[activeStage].title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {stages[activeStage].tagline}
                  </p>
                </div>
              </div>

              <Badge
                variant="outline"
                className="self-start sm:self-auto text-xs py-1 px-3 border-primary/30 bg-primary/5 text-primary"
              >
                Core Deliverable Phase
              </Badge>
            </div>

            <p className="text-sm text-foreground/90 leading-relaxed">
              {stages[activeStage].description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-xl border border-border/60 bg-card space-y-1.5">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block font-display">
                  Key Deliverables
                </span>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {stages[activeStage].deliverables.map((item, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl border border-border/60 bg-card space-y-1.5">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block font-display">
                  Quantified Metric
                </span>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {stages[activeStage].keyMetric}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-border/60 bg-card space-y-1.5">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block font-display">
                  Studio Pro-Tip
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  &ldquo;{stages[activeStage].proTip}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: 60-30-10 COLOR HARMONY SYSTEM ────────────────────────── */}
      {activeTab === "colors" && (
        <div className="p-6 space-y-6">
          <div className="space-y-1">
            <h4 className="font-display font-bold text-base text-foreground">
              The 60-30-10 Rule of UI Color Distribution
            </h4>
            <p className="text-xs text-muted-foreground">
              Never use equal proportions of color. A balanced digital product allocates 60% dominant canvas, 30% structural surfaces, and 10% high-intent focal accents.
            </p>
          </div>

          {/* Visual Proportion Bar */}
          <div className="space-y-1.5">
            <div className="h-8 rounded-xl overflow-hidden flex border border-border/70 shadow-sm">
              <div
                style={{ width: "60%", backgroundColor: "#080C15" }}
                className="h-full flex items-center justify-center text-[11px] font-bold text-white/90 border-r border-white/10"
              >
                60% Canvas Dominant
              </div>
              <div
                style={{ width: "30%", backgroundColor: "#1E293B" }}
                className="h-full flex items-center justify-center text-[11px] font-bold text-white/90 border-r border-white/10"
              >
                30% Structural
              </div>
              <div
                style={{ width: "10%", backgroundColor: "#38BDF8" }}
                className="h-full flex items-center justify-center text-[10px] font-bold text-slate-950"
              >
                10% CTA
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono px-1">
              <span>0%</span>
              <span>60%</span>
              <span>90%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {colorRuleTokens.map((token, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-border/80 bg-card space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={cn("text-[10px] font-bold", token.badgeColor)}>
                    {token.badge}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToken(token.hex, token.name)}
                    className="h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {copiedToken === token.name ? (
                      <Check className="h-3 w-3 text-emerald-400 mr-1" />
                    ) : (
                      <Copy className="h-3 w-3 mr-1" />
                    )}
                    <span>{token.hex}</span>
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: token.hex }}
                    className="w-12 h-12 rounded-xl border border-white/20 shadow-md shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-foreground truncate">{token.name}</div>
                    <div className="font-mono text-[11px] text-muted-foreground">{token.rgb}</div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {token.usage}
                </p>

                <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Accessibility Rating:</span>
                  <span className="font-semibold text-emerald-400">{token.wcag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 4: TYPOGRAPHY HIERARCHY SCALE ────────────────────────────── */}
      {activeTab === "typography" && (
        <div className="p-6 space-y-6">
          <div className="space-y-1">
            <h4 className="font-display font-bold text-base text-foreground">
              Dual-Font Typography Hierarchy
            </h4>
            <p className="text-xs text-muted-foreground">
              Learnify uses <strong className="text-foreground">Space Grotesk</strong> for structural headings and <strong className="text-foreground">DM Sans</strong> for body reading. Hierarchy is established by weight contrast, not just font size.
            </p>
          </div>

          <div className="divide-y divide-border/60 rounded-2xl border border-border/80 bg-card overflow-hidden">
            {typeTokens.map((type, idx) => (
              <div key={idx} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">{type.name}</span>
                    <Badge variant="outline" className="text-[10px] py-0 border-border text-muted-foreground">
                      {type.font} · {type.weight}
                    </Badge>
                  </div>
                  <div
                    style={{
                      fontFamily: type.font.includes("Space") ? "'Space Grotesk', sans-serif" : "'DM Sans', sans-serif",
                    }}
                    className={cn(
                      "text-foreground",
                      idx === 0 && "text-xl sm:text-2xl font-bold tracking-tight",
                      idx === 1 && "text-lg sm:text-xl font-bold",
                      idx === 2 && "text-base font-semibold",
                      idx === 3 && "text-sm text-foreground/90",
                      idx === 4 && "text-xs text-muted-foreground font-medium",
                    )}
                  >
                    {type.sample}
                  </div>
                  <p className="text-xs text-muted-foreground">{type.role}</p>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-1 text-[11px] font-mono text-muted-foreground shrink-0 border-t md:border-t-0 pt-2 md:pt-0">
                  <span>Size: {type.size}</span>
                  <span>Leading: {type.leading}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 5: 8PT GRID & BOX MODEL ─────────────────────────────────── */}
      {activeTab === "grid" && (
        <div className="p-6 space-y-6">
          <div className="space-y-1">
            <h4 className="font-display font-bold text-base text-foreground">
              The 8pt Grid Rhythm & Spatial Box Model
            </h4>
            <p className="text-xs text-muted-foreground">
              All margins, paddings, and button heights follow strict multiples of 8 (8px, 16px, 24px, 32px, 48px, 64px). This eliminates visual guessing and guarantees pixel-sharp alignment.
            </p>
          </div>

          {/* Interactive Visual Box Model Demonstration */}
          <div className="p-6 rounded-2xl border border-dashed border-sky-500/40 bg-sky-950/20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-full max-w-md p-4 rounded-xl border border-indigo-500/40 bg-indigo-950/30 space-y-3">
              <span className="text-[11px] font-mono text-indigo-400 font-bold block">
                MARGIN (16px / 24px)
              </span>

              <div className="p-4 rounded-xl border border-sky-400/50 bg-sky-900/40 space-y-2">
                <span className="text-[11px] font-mono text-sky-300 font-bold block">
                  BORDER (1px solid rgba(255,255,255,0.08))
                </span>

                <div className="p-5 rounded-lg bg-slate-900 border border-white/10 space-y-2">
                  <span className="text-[11px] font-mono text-emerald-400 font-bold block">
                    PADDING: 16px (2rem)
                  </span>
                  <div className="p-3 rounded bg-slate-800 text-xs font-semibold text-white">
                    CONTENT AREA (Flexible Width · Auto Height)
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              <div className="px-3 py-1.5 rounded-lg bg-card border border-border/60">
                <strong>Unit 1:</strong> 8px (Micro gaps)
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-card border border-border/60">
                <strong>Unit 2:</strong> 16px (Card padding)
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-card border border-border/60">
                <strong>Unit 3:</strong> 24px (Section spacing)
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-card border border-border/60">
                <strong>Unit 4:</strong> 32px (Layout gutters)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
