import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useServerFn } from "@tanstack/react-start";
import { exportProjectZip } from "@/lib/project-export.functions";
import { triggerZipDownload } from "@/lib/project-export-download";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Search,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  X,
  Sparkles,
  ArrowLeft,
  LayoutGrid,
  Maximize2,
  Filter,
  Zap,
  Video,
  Box,
  Gem,
  Moon,
  Minus,
  Lock,
  ClipboardCopy,
  CheckCheck,
  GraduationCap,
  Eye,
  Download,
  Loader2,
  ShoppingBag,
  Sun,
  Code2,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Input } from "@/components/ui/input";
import projectsData from "@/data/projects.json";
import { ShaderShowcase, ShaderButtons } from "@/components/shaders";
import "@/components/shaders/threeui.css";

export const Route = createFileRoute("/projects")({
  loader: () => projectsData as Project[],
  head: () => ({
    meta: [
      { title: "Design Projects Showcase — Learnify AI" },
      {
        name: "description",
        content: `Explore ${projectsData.length} interactive website design templates, micro-sites, and UX prototypes built with next-generation aesthetics.`,
      },
    ],
  }),
  component: ProjectsPage,
});

type Project = {
  id: string;
  name: string;
  title: string;
  description: string;
  path: string;
  thumbnail?: string;
  category?: string;
  tech?: string[];
  tags?: string[];
  price?: number;
  course_modules?: any[];
  [key: string]: any;
};

type ViewportType = "desktop" | "tablet" | "mobile";

// Category filter definitions — using Lucide SVG icons
const FILTER_CATEGORIES: { label: string; key: string; icon?: React.ElementType }[] = [
  { label: "All", key: "all", icon: LayoutGrid },
  { label: "WebGL Shaders", key: "shaders", icon: Sparkles },
  { label: "GSAP", key: "gsap", icon: Zap },
  { label: "Video", key: "video", icon: Video },
  { label: "3D", key: "3d", icon: Box },
  { label: "Glass", key: "glass", icon: Gem },
  { label: "Dark Mode", key: "dark", icon: Moon },
  { label: "Minimal", key: "minimal", icon: Minus },
  { label: "Forms", key: "forms", icon: Lock },
];

// Smart gradient palettes based on project themes (10 options)
const GRADIENT_PALETTES = [
  "from-violet-950 via-indigo-900 to-blue-950",
  "from-slate-900 via-emerald-950 to-teal-900",
  "from-zinc-950 via-rose-950 to-pink-900",
  "from-slate-950 via-amber-950 to-orange-900",
  "from-sky-950 via-blue-950 to-indigo-900",
  "from-purple-950 via-violet-900 to-indigo-950",
  "from-stone-950 via-gray-900 to-slate-800",
  "from-green-950 via-emerald-900 to-teal-950",
  "from-red-950 via-rose-900 to-pink-950",
  "from-blue-950 via-cyan-950 to-teal-900",
];

const ACCENT_COLORS = [
  "from-violet-400 to-blue-400",
  "from-emerald-400 to-teal-400",
  "from-rose-400 to-pink-400",
  "from-amber-400 to-orange-400",
  "from-sky-400 to-blue-400",
  "from-purple-400 to-violet-400",
  "from-slate-300 to-gray-400",
  "from-green-400 to-emerald-400",
  "from-red-400 to-rose-400",
  "from-cyan-400 to-blue-400",
];

function hashProject(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getProjectTheme(p: Project) {
  const h = hashProject(p.id) % GRADIENT_PALETTES.length;
  return { bg: GRADIENT_PALETTES[h], accent: ACCENT_COLORS[h] };
}

function getTags(descInput: string | Project): string[] {
  const desc =
    typeof descInput === "string" ? descInput : descInput?.description || descInput?.title || "";
  const tags: string[] = [];
  const lower = (desc || "").toLowerCase();
  if (lower.includes("gsap")) tags.push("GSAP");
  if (lower.includes("3d") || lower.includes("spline")) tags.push("3D");
  if (lower.includes("video") || lower.includes("loop")) tags.push("Video");
  if (lower.includes("glass") || lower.includes("liquid")) tags.push("Glass");
  if (lower.includes("dark") || lower.includes("black")) tags.push("Dark");
  if (lower.includes("minimal") || lower.includes("clean")) tags.push("Minimal");
  if (lower.includes("form") || lower.includes("sign")) tags.push("Forms");
  if (tags.length === 0) tags.push("Creative");
  return tags.slice(0, 3);
}

function matchesFilter(p: Project, filterKey: string): boolean {
  if (filterKey === "all") return true;
  const lower = (p.description || "").toLowerCase();
  switch (filterKey) {
    case "shaders":
      return (
        lower.includes("shader") ||
        lower.includes("three") ||
        lower.includes("glsl") ||
        lower.includes("webgl")
      );
    case "gsap":
      return lower.includes("gsap");
    case "video":
      return lower.includes("video") || lower.includes("loop");
    case "3d":
      return lower.includes("3d") || lower.includes("spline");
    case "glass":
      return lower.includes("glass") || lower.includes("liquid");
    case "dark":
      return lower.includes("dark") || lower.includes("black");
    case "minimal":
      return lower.includes("minimal") || lower.includes("clean");
    case "forms":
      return lower.includes("form") || lower.includes("sign");
    default:
      return true;
  }
}

function ProjectCard({
  p,
  onClick,
  hasCareerPro,
  onDownloadZip,
  isDownloadingZip = false,
}: {
  p: Project;
  onClick: () => void;
  hasCareerPro: boolean;
  onDownloadZip?: (projectId: string, projectName: string) => void;
  isDownloadingZip?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const iframeLoadedRef = useRef(false);

  useEffect(() => {
    if (!isVisible) return;
    iframeLoadedRef.current = false;
    const timer = setTimeout(() => {
      if (!iframeLoadedRef.current) setIframeError(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, [isVisible]);

  const hash = hashProject(p.id);
  const bg = GRADIENT_PALETTES[hash % GRADIENT_PALETTES.length];
  const tags = getTags(p.description);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prompt = `Create a modern, responsive website inspired by ${p.title}.\nDescription: ${p.description}\nKey Tech & Tags: ${tags.join(", ")}\nFeatures: Dark mode, glassmorphic UI, smooth scroll animations, hero section, responsive grid layout, clean typography.`;
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleLaunchDirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(p.path, "_blank");
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      key={p.id}
      onClick={onClick}
      className="group rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col relative"
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      {/* Thumbnail Live Preview Card Cover */}
      <div
        className={`aspect-video bg-gradient-to-br ${bg} relative overflow-hidden flex-shrink-0`}
      >
        {/* Loading shimmer placeholder */}
        {!iframeLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/60 to-black/90">
            <div className="w-full h-full animate-pulse bg-gradient-to-br from-white/5 to-white/10" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 z-10">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-[11px] font-medium text-white/80">{p.name}</span>
            </div>
          </div>
        )}

        {/* Lazy-mounted Live Iframe Cover */}
        {isVisible && !iframeError && (
          <div
            className={`absolute inset-0 overflow-hidden transition-opacity duration-700 ${
              iframeLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Security validation: only allow http, https, or relative paths */}
            {p.path && !p.path.toLowerCase().startsWith("javascript:") && (
              <iframe
                src={p.path}
                title={p.name}
                scrolling="no"
                className="border-0 pointer-events-none select-none overflow-hidden"
                style={{
                  width: "200%",
                  height: "200%",
                  transform: "scale(0.5)",
                  transformOrigin: "top left",
                  overflow: "hidden",
                }}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-popups"
                onLoad={() => {
                  iframeLoadedRef.current = true;
                  setIframeLoaded(true);
                  setIframeError(false);
                }}
              />
            )}
          </div>
        )}

        {/* Polished Fallback when iframe cannot load (X-Frame-Options deny, CSP, etc.) */}
        {isVisible && iframeError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-zinc-950/90 via-zinc-900/80 to-zinc-950/90 text-center select-none backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2.5 max-w-[260px]">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
                <Globe className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-foreground tracking-tight block">
                  Preview Unavailable
                </span>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  This interactive site prevents embedded iframes.
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(p.path, "_blank", "noopener,noreferrer");
                }}
                className="mt-1 flex items-center gap-1.5 text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 px-3.5 py-1.5 rounded-xl shadow-sm transition hover:scale-105 cursor-pointer"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Open in new tab
              </button>
            </div>
          </div>
        )}

        {/* Mobile tap button to show overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            const el = document.getElementById(`overlay-${p.id}`);
            if (el) {
              const isOpen = el.classList.contains("opacity-100");
              el.classList.toggle("opacity-100", !isOpen);
              el.classList.toggle("opacity-0", isOpen);
            }
          }}
          className="md:hidden absolute top-2 left-2 z-30 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-lg border border-white/20 hover:bg-black/80 transition-all flex items-center gap-1"
          aria-label="Show template options"
        >
          <Eye className="h-3 w-3" />
          Options
        </button>

        {/* Hover overlay — Hidden on mobile by default, tap eye button to show; hover on desktop */}
        <div
          className={`absolute inset-0 bg-black/75 backdrop-blur-sm transition-all duration-300 flex flex-col md:flex-row items-center justify-center md:justify-between gap-3 p-4 z-20 mobile-overlay ${isVisible ? "opacity-0 md:opacity-0 md:group-hover:opacity-100" : "opacity-0"}`}
          id={`overlay-${p.id}`}
        >
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={onClick}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 px-3.5 py-2 rounded-xl shadow-lg transition-all hover:scale-105 w-full sm:w-auto justify-center"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              View Live Template
            </button>
            {hasCareerPro ? (
              <>
                <Link
                  to="/course/$projectId"
                  params={{ projectId: p.id }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-xs font-semibold text-foreground bg-secondary/90 hover:bg-secondary px-3.5 py-2 rounded-xl transition-all border border-white/20 hover:scale-105 w-full sm:w-auto justify-center"
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  Start Building Now
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadZip?.(p.id, p.name || p.title);
                  }}
                  disabled={isDownloadingZip}
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 px-3 py-2 rounded-xl transition-all hover:scale-105 w-full sm:w-auto justify-center cursor-pointer"
                  title="Export ZIP Source Code (Career Pro)"
                >
                  {isDownloadingZip ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  ZIP
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/pricing"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary-foreground bg-primary/90 hover:bg-primary px-3.5 py-2 rounded-xl transition-all border border-white/20 hover:scale-105 shadow-glow w-full sm:w-auto justify-center"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Career Pro
                </Link>
                <Link
                  to="/pricing"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 px-2.5 py-2 rounded-xl transition-all hover:scale-105 w-full sm:w-auto justify-center"
                  title="Upgrade to Career Pro to export source code ZIP"
                >
                  <Download className="h-3.5 w-3.5" />
                  ZIP (Pro)
                </Link>
              </>
            )}
          </div>

          <button
            onClick={handleCopyPrompt}
            title="Copy prompt for AI tools"
            className="flex items-center gap-1 text-[11px] font-medium text-white bg-black/60 hover:bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 transition-all hover:scale-105 w-full sm:w-auto justify-center"
          >
            {copied ? (
              <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <ClipboardCopy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied!" : "Copy Prompt"}
          </button>
        </div>
      </div>

      {/* Card Content Footer */}
      <div className="flex flex-col flex-1 p-4 gap-3 bg-card">
        <div className="space-y-1">
          <h3 className="font-display font-semibold text-sm leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {p.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {p.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-border/60">
          <div className="flex gap-1 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium border border-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-1">
            {hasCareerPro && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadZip?.(p.id, p.name || p.title);
                }}
                disabled={isDownloadingZip}
                title="Download Source Code (ZIP)"
                className="p-1 rounded text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer"
              >
                {isDownloadingZip ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-500" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
                )}
              </button>
            )}
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const getProjectCodeSnippet = (p: Project): string => {
  if (p.id === "macos-portfolio") {
    return `// ==========================================
// Learnify AI — Clean macOS Ventura & Big Sur Desktop
// Stack: Vanilla JS + CSS3 + Canvas + 105 Big Sur Icons
// ==========================================

import React, { useState, useEffect } from 'react';

export default function MacOSDesktop() {
  const [activeWindow, setActiveWindow] = useState<string | null>('finder');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [dockBounce, setDockBounce] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 1000);
    return () => clearInterval(timer);
  }, []);

  const openApp = (appId: string) => {
    setDockBounce(appId);
    setTimeout(() => {
      setActiveWindow(appId);
      setDockBounce(null);
    }, 400);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-cover bg-center select-none" style={{ backgroundImage: "url('/preset-sites/macos-portfolio/assets/wallpaper.jpg')" }}>
      {/* Top Menu Bar with Glassmorphism */}
      <header className="h-7 w-full bg-black/40 backdrop-blur-2xl text-white text-xs flex items-center justify-between px-4 z-50 border-b border-white/10">
        <div className="flex items-center gap-4">
          <span className="font-bold text-sm cursor-pointer hover:opacity-80"></span>
          <span className="font-semibold">Finder</span>
          <span className="text-white/70 hover:text-white cursor-pointer hidden sm:inline">File</span>
          <span className="text-white/70 hover:text-white cursor-pointer hidden sm:inline">Edit</span>
          <span className="text-white/70 hover:text-white cursor-pointer hidden sm:inline">View</span>
          <span className="text-white/70 hover:text-white cursor-pointer hidden sm:inline">Go</span>
          <span className="text-white/70 hover:text-white cursor-pointer hidden sm:inline">Window</span>
          <span className="text-white/70 hover:text-white cursor-pointer hidden sm:inline">Help</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span>{currentTime}</span>
        </div>
      </header>

      {/* Floating Active Window */}
      {activeWindow && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[720px] h-[460px] bg-[#1e1e1e]/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/15 flex flex-col z-40 overflow-hidden">
          <div className="h-9 bg-[#2d2d2d]/80 border-b border-white/10 flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
              <button onClick={() => setActiveWindow(null)} className="w-3 h-3 rounded-full bg-[#ff5f56] hover:opacity-80" />
              <button className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:opacity-80" />
              <button className="w-3 h-3 rounded-full bg-[#27c93f] hover:opacity-80" />
            </div>
            <span className="text-xs font-medium text-white/80 capitalize">{activeWindow}</span>
            <div className="w-12" />
          </div>
          <div className="flex-1 p-6 text-white text-sm font-sans overflow-auto">
            <h2 className="text-xl font-bold mb-2">Welcome to macOS Portfolio</h2>
            <p className="text-white/70">Interactive macOS replica featuring parallax Dock magnification, genuine window management, and 105 Apple Big Sur icons.</p>
          </div>
        </div>
      )}

      {/* Parallax Dock with Magnification */}
      <footer className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/20 flex items-end gap-2 shadow-2xl z-50">
        {['finder', 'terminal', 'safari', 'code', 'settings'].map((app) => (
          <button
            key={app}
            onClick={() => openApp(app)}
            className="w-12 h-12 rounded-xl transition-all duration-200 hover:scale-125 hover:-translate-y-2 flex items-center justify-center bg-white/10 border border-white/20 text-white shadow-md"
          >
            <span className="text-xs capitalize">{app[0]}</span>
          </button>
        ))}
      </footer>
    </div>
  );
}
`;
  }

  if (p.id === "productized-agency") {
    return `// ==========================================
// Learnify AI — Aceternity Productized Agency Template
// Stack: Next.js 15 + React 19 + Tailwind CSS + Framer Motion
// ==========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProductizedAgencyHero() {
  const [activePlan, setActivePlan] = useState<'standard' | 'pro'>('pro');

  return (
    <section className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

      {/* Hero Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium text-purple-300 mb-8"
      >
        ✨ Productized Design & Dev Agency for SaaS Founders
      </motion.div>

      {/* Hero Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-7xl font-bold tracking-tight text-center max-w-4xl bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent"
      >
        High-impact design & code subscriptions for fast-growing startups.
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-base md:text-xl text-zinc-400 text-center max-w-2xl leading-relaxed"
      >
        One flat monthly fee. Pause or cancel anytime. Get top 1% design & full-stack development delivered in days.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-10 flex flex-col sm:flex-row items-center gap-4"
      >
        <a
          href="#pricing"
          className="px-8 py-3.5 rounded-xl font-semibold text-black bg-white hover:bg-zinc-200 transition-all shadow-xl hover:scale-105 flex items-center gap-2 text-sm"
        >
          View Subscription Plans →
        </a>
        <a
          href="#work"
          className="px-8 py-3.5 rounded-xl font-semibold text-white bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-all text-sm"
        >
          Explore Recent Work
        </a>
      </motion.div>
    </section>
  );
}
`;
  }

  return `// ==========================================
// Learnify AI — ${p.title}
// Tech: ${(p.tech || []).join(", ") || "React, Tailwind CSS, TypeScript"}
// ==========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ${p.name.replace(/[^a-zA-Z0-9]/g, "") || "TemplateComponent"}() {
  const [active, setActive] = useState(false);

  return (
    <div className="relative min-h-[500px] w-full rounded-2xl bg-card border border-border p-8 flex flex-col items-center justify-center text-center overflow-hidden">
      <motion.div
        animate={{ scale: active ? 1.05 : 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-xl space-y-4"
      >
        <span className="text-xs uppercase tracking-wider font-mono text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          ${p.category || "Interactive UI"}
        </span>
        <h2 className="text-3xl font-bold font-display tracking-tight text-foreground">
          ${p.title}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          ${p.description}
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setActive(!active)}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md"
          >
            {active ? "Active State" : "Interact"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
`;
};

function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewport, setViewport] = useState<ViewportType>("desktop");
  const [filter, setFilter] = useState("all");
  const [modalTab, setModalTab] = useState<"preview" | "code" | "shop">("preview");
  const [templateMode, setTemplateMode] = useState<"dark" | "light">("dark");
  const [copiedModalCode, setCopiedModalCode] = useState(false);
  const modalIframeRef = useRef<HTMLIFrameElement | null>(null);

  const openProjectModal = (p: Project) => {
    setSelectedProject(p);
    setModalTab("preview");
    setTemplateMode("dark");
  };

  const toggleTemplateMode = () => {
    const next = templateMode === "dark" ? "light" : "dark";
    setTemplateMode(next);
    toast.info(`Switched template to ${next} mode`);
    if (modalIframeRef.current?.contentWindow) {
      modalIframeRef.current.contentWindow.postMessage({ type: "SET_THEME_MODE", mode: next }, "*");
    }
  };

  const handleCopyModalCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedModalCode(true);
      toast.success("Source code snippet copied!");
      setTimeout(() => setCopiedModalCode(false), 2000);
    });
  };

  const { data: dbProjects = (projectsData as Project[]) } = useQuery({
    queryKey: ["design-projects-public"],
    initialData: projectsData as Project[],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("design_projects")
          .select("*")
          .order("created_at", { ascending: false });
        if (error || !data || data.length === 0) return projectsData as Project[];
        return data as Project[];
      } catch {
        return projectsData as Project[];
      }
    },
  });

  const { user, isAdmin } = useAuth();

  const currentSub = useQuery({
    enabled: !!user,
    queryKey: ["my-subscription", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_subscriptions")
        .select("*, plan:pricing_plans(*)")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .maybeSingle();
      return data || null;
    },
  });
  const activePlanName = currentSub.data?.plan?.name?.toLowerCase() || "free";
  const hasCareerPro =
    isAdmin || activePlanName === "career pro" || activePlanName === "enterprise";

  const navigate = useNavigate();
  const exportZipFn = useServerFn(exportProjectZip);
  const [downloadingZipId, setDownloadingZipId] = useState<string | null>(null);

  const handleDownloadZip = async (projectId: string, projectName: string) => {
    if (!user) {
      toast.info("Please sign in to export project source code");
      navigate({ to: "/login" });
      return;
    }
    if (!hasCareerPro) {
      toast.info("Source Code ZIP download is an exclusive Career Pro feature");
      navigate({ to: "/pricing" });
      return;
    }

    setDownloadingZipId(projectId);
    toast.loading(`Packaging ${projectName || projectId} source code...`, { id: "export-zip" });
    try {
      const res = await exportZipFn({ data: { projectId } });
      if (res && res.success && res.base64) {
        toast.dismiss("export-zip");
        triggerZipDownload(res.base64, res.filename || `${projectId}-template.zip`);
      } else {
        toast.dismiss("export-zip");
        if (res?.needsUpgrade) {
          toast.error("Upgrade to Career Pro to download source code ZIP archives.");
          navigate({ to: "/pricing" });
        } else {
          toast.error(res?.error || "Failed to package project ZIP");
        }
      }
    } catch (err: any) {
      toast.dismiss("export-zip");
      toast.error(err?.message || "Failed to download project ZIP");
    } finally {
      setDownloadingZipId(null);
    }
  };

  // Escape key closes modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filteredProjects = useMemo(() => {
    return dbProjects.filter((p) => {
      const query = search.toLowerCase();
      const name = p.name || p.title || "";
      const matchesSearch =
        name.toLowerCase().includes(query) ||
        (p.title || "").toLowerCase().includes(query) ||
        (p.description || "").toLowerCase().includes(query);
      return matchesSearch && matchesFilter(p, filter);
    });
  }, [search, filter, dbProjects]);

  const getViewportWidth = () => {
    switch (viewport) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      default:
        return "100%";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-hero py-16 sm:py-24 px-4 sm:px-6 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-glow opacity-25 pointer-events-none" />
          <div className="relative max-w-3xl mx-auto space-y-5">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-background/60 backdrop-blur text-xs font-medium text-muted-foreground hover:border-primary/50 transition cursor-default"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
              Platform Design Showcase
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tighter leading-tight"
            >
              Next-Gen Website <span className="text-gradient">Design Portfolio</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto"
            >
              Interact with our collection of{" "}
              <span className="text-foreground font-semibold">{projectsData.length}</span> highly
              polished design templates, 3D prototypes, landing pages, and cinematic micro-sites.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="max-w-lg mx-auto relative pt-2"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-[45%] h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects (e.g. Nike, GSAP, 3D, glass)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 h-12 bg-background/80 border-border rounded-xl text-sm shadow-card focus-visible:ring-primary/40"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </motion.div>

            {/* Quick Search Suggestion Chips */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="pt-4 flex flex-wrap items-center justify-center gap-2"
            >
              <span className="text-xs text-muted-foreground font-medium mr-1">Trending:</span>
              {[
                { label: "Porsche Carrera Cup", query: "porsche" },
                { label: "Nike Next-Gen", query: "nike" },
                { label: "GSAP 3", query: "gsap" },
                { label: "3D Spline", query: "3d" },
                { label: "WebGL Shaders", query: "shader" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setSearch(item.query)}
                  className="px-2.5 py-1 rounded-full text-xs bg-muted/60 hover:bg-primary/10 hover:text-primary border border-border/60 hover:border-primary/30 transition-all cursor-pointer font-medium"
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Filter Chips ─────────────────────────────────────── */}
        <section className="sticky top-[60px] z-30 bg-background/90 backdrop-blur-md border-b border-border/60 py-3 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2 pb-0.5">
            <div className="flex items-center gap-1.5 mr-1 text-muted-foreground shrink-0">
              <Filter className="h-4 w-4" />
              <span className="text-xs font-semibold">({filteredProjects.length})</span>
            </div>
            {FILTER_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => setFilter(cat.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border inline-flex items-center gap-1.5 ${
                    filter === cat.key
                      ? "bg-primary text-primary-foreground border-primary shadow-glow"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── ThreeUI Shader Lab Section ──────────────────────── */}
        {filter === "shaders" && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
            <ShaderShowcase />
          </section>
        )}

        {/* ── Projects Grid ─────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-6">
            <LayoutGrid className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              All Interactive Designs
              <span className="ml-2 text-sm text-muted-foreground font-normal">
                ({filteredProjects.length})
              </span>
            </h2>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((p) => (
                <ProjectCard
                  key={p.id}
                  p={p}
                  onClick={() => openProjectModal(p)}
                  hasCareerPro={hasCareerPro}
                  onDownloadZip={handleDownloadZip}
                  isDownloadingZip={downloadingZipId === p.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-dashed border-border rounded-3xl bg-card/30">
              <LayoutGrid className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold text-foreground">No projects found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try searching for "GSAP", "3D", or{" "}
                <button
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="text-primary underline underline-offset-2"
                >
                  clear filters
                </button>
              </p>
            </div>
          )}
        </section>
      </main>

      {/* ── Preview Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/75 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedProject(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="bg-background border-0 md:border md:border-border rounded-none md:rounded-3xl shadow-2xl w-full h-full md:h-[92vh] max-w-7xl flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="h-16 bg-card border-b border-border flex items-center justify-between px-3 sm:px-5 shrink-0 gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors shrink-0"
                    title="Close"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-sm font-bold text-foreground leading-none truncate">
                        {selectedProject.name}
                      </h3>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 hidden sm:inline">
                        ₹{selectedProject.price || 99}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 hidden md:block truncate max-w-xs">
                      {selectedProject.title}
                    </p>
                  </div>
                </div>

                {/* Interactive Navigation Tabs: Preview, Code, Mode, Shop */}
                <div className="flex items-center gap-1 bg-muted/80 p-1 rounded-xl border border-border shrink-0">
                  <button
                    onClick={() => setModalTab("preview")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      modalTab === "preview"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => setModalTab("code")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      modalTab === "code"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Code2 className="h-3.5 w-3.5" />
                    <span>Code</span>
                  </button>

                  <button
                    onClick={toggleTemplateMode}
                    title="Toggle Preview Light/Dark Mode"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all cursor-pointer"
                  >
                    {templateMode === "dark" ? (
                      <Moon className="h-3.5 w-3.5 text-indigo-400" />
                    ) : (
                      <Sun className="h-3.5 w-3.5 text-amber-400" />
                    )}
                    <span className="hidden sm:inline capitalize">{templateMode}</span>
                  </button>

                  <button
                    onClick={() => setModalTab("shop")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      modalTab === "shop"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <ShoppingBag className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Shop</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300">
                      ₹{selectedProject.price || 99}
                    </span>
                  </button>
                </div>

                {/* Right controls: Viewport toggles + Pop Top full preview + Action buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {modalTab === "preview" && (
                    <div className="hidden lg:flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border">
                      {(["desktop", "tablet", "mobile"] as const).map((v) => {
                        const Icon = v === "mobile" ? Smartphone : v === "tablet" ? Tablet : Monitor;
                        return (
                          <button
                            key={v}
                            onClick={() => setViewport(v)}
                            title={`${v.charAt(0).toUpperCase() + v.slice(1)} View`}
                            className={`p-1.5 rounded-md transition-all ${
                              viewport === v
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Pop Top Full Preview button */}
                  <a
                    href={selectedProject.path}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground bg-accent/80 hover:bg-accent px-3 py-1.5 rounded-lg transition-all border border-border h-8"
                    title="Open Fullscreen in New Tab [Pop Top]"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-primary" />
                    <span className="hidden sm:inline">Full Preview</span>
                    <span className="text-[10px] text-muted-foreground font-mono">[Pop Top]</span>
                  </a>

                  {hasCareerPro ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadZip(selectedProject.id, selectedProject.name)}
                        disabled={downloadingZipId === selectedProject.id}
                        className="hidden xl:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 h-8 cursor-pointer"
                        title="Download complete template ZIP (Career Pro)"
                      >
                        {downloadingZipId === selectedProject.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Download className="h-3.5 w-3.5" />
                        )}
                        Export ZIP
                      </Button>
                      <Link
                        to="/course/$projectId"
                        params={{ projectId: selectedProject.id }}
                        className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg transition-all border border-primary h-8"
                      >
                        <GraduationCap className="h-3.5 w-3.5" />
                        Course
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={() => setModalTab("shop")}
                      className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-primary-foreground bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-3 py-1.5 rounded-lg transition-all shadow-md h-8 cursor-pointer"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      Buy ₹{selectedProject.price || 99}
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Tab 1: Preview Frame */}
              {modalTab === "preview" && (
                <div className="flex-1 bg-muted/20 p-2 sm:p-4 flex items-center justify-center overflow-hidden">
                  <div
                    style={{
                      width: getViewportWidth(),
                      transition: "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    className="h-full rounded-2xl border border-border shadow-card bg-black overflow-hidden relative flex flex-col"
                  >
                    {/* Browser chrome */}
                    <div className="h-8 bg-card border-b border-border px-3 flex items-center gap-2 shrink-0 select-none">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
                      </div>
                      <div className="bg-muted rounded px-4 py-0.5 flex-1 flex items-center justify-center gap-1.5 text-muted-foreground font-mono text-[10px]">
                        <Globe className="h-2.5 w-2.5 text-primary" />
                        <span className="text-primary/80">learnifyai.in</span>
                        <span>{selectedProject.path}</span>
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded bg-muted/80">
                        {templateMode.toUpperCase()}
                      </div>
                    </div>

                    <iframe
                      ref={modalIframeRef}
                      src={selectedProject.path}
                      title={selectedProject.name}
                      style={{
                        filter: templateMode === "light" ? "invert(0.92) hue-rotate(180deg)" : "none",
                        transition: "filter 0.3s ease",
                      }}
                      className="w-full flex-1 bg-white border-0"
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-downloads"
                      onLoad={(e) => {
                        (e.target as HTMLIFrameElement).style.display = "block";
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Code Inspector */}
              {modalTab === "code" && (
                <div className="flex-1 p-4 sm:p-6 bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-mono text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-xs">Component:</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-semibold">
                        {selectedProject.id}.tsx
                      </span>
                      <div className="hidden sm:flex items-center gap-1.5 ml-2">
                        {(selectedProject.tech || []).map((t: string) => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyModalCode(getProjectCodeSnippet(selectedProject))}
                      className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 h-7 text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedModalCode ? (
                        <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <ClipboardCopy className="h-3.5 w-3.5" />
                      )}
                      {copiedModalCode ? "Copied" : "Copy Code"}
                    </Button>
                  </div>
                  <div className="flex-1 overflow-auto mt-3 rounded-xl bg-slate-900/60 p-4 border border-slate-800/80 leading-relaxed font-mono">
                    <pre className="text-slate-300 whitespace-pre">
                      {getProjectCodeSnippet(selectedProject)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Tab 3: Shop & Instant Purchase Screen */}
              {modalTab === "shop" && (
                <div className="flex-1 p-4 sm:p-8 bg-card flex flex-col overflow-y-auto">
                  <div className="max-w-4xl mx-auto w-full py-4">
                    <div className="text-center mb-8">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-3">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Commercial Production Template
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                        Unlock {selectedProject.name}
                      </h2>
                      <p className="text-muted-foreground text-sm mt-2 max-w-lg mx-auto">
                        Get immediate access to full clean source code, commercial licensing, components, and exportable ZIP.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                      {/* Left: Template Preview Card */}
                      <div className="rounded-2xl border border-border bg-muted/30 p-5 flex flex-col justify-between">
                        <div>
                          <div className="relative aspect-video rounded-xl overflow-hidden border border-border mb-4 bg-black">
                            <img
                              src={selectedProject.thumbnail}
                              alt={selectedProject.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-emerald-400 border border-white/10">
                              Instant ZIP Download
                            </div>
                          </div>
                          <h4 className="font-display font-semibold text-foreground text-base">
                            {selectedProject.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                            {selectedProject.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs text-muted-foreground">
                          <span>Category: <strong className="text-foreground capitalize">{selectedProject.category}</strong></span>
                          <span>License: <strong className="text-emerald-500">Commercial</strong></span>
                        </div>
                      </div>

                      {/* Right: Checkout & Benefits Card */}
                      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 flex flex-col justify-between relative shadow-lg">
                        <div>
                          <div className="flex items-baseline gap-3 mb-4">
                            <span className="text-4xl font-extrabold text-foreground font-display">
                              ₹{selectedProject.price || 99}
                            </span>
                            <span className="text-muted-foreground line-through text-base">
                              ₹2,999
                            </span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                              97% OFF Today
                            </span>
                          </div>

                          <div className="space-y-3 mb-6">
                            {[
                              "Complete Clean Source Code (ZIP Export)",
                              "Commercial Use License for unlimited client projects",
                              "100% Responsive (Mobile, Tablet & Desktop)",
                              "Clean Tailwind CSS + React 19 + Framer Motion / GSAP",
                              "105+ Big Sur Icons / High-Res Design Assets",
                              "Lifetime Updates & Free Bug Fixes",
                            ].map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2.5 text-xs text-foreground/90">
                                <CheckCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-border/80">
                          {hasCareerPro ? (
                            <Button
                              onClick={() => handleDownloadZip(selectedProject.id, selectedProject.name)}
                              disabled={downloadingZipId === selectedProject.id}
                              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl shadow-lg cursor-pointer"
                            >
                              {downloadingZipId === selectedProject.id ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              ) : (
                                <Download className="w-4 h-4 mr-2" />
                              )}
                              Included in Career Pro — Instant Download ZIP
                            </Button>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  if (!user) {
                                    toast.info("Please login to purchase this template");
                                    navigate({ to: "/login" });
                                  } else {
                                    handleDownloadZip(selectedProject.id, selectedProject.name);
                                  }
                                }}
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer text-sm"
                              >
                                <ShoppingBag className="w-4 h-4" />
                                Buy Template Now — ₹{selectedProject.price || 99}
                              </button>
                              <Link
                                to="/pricing"
                                className="w-full text-center block text-xs text-primary hover:underline font-medium"
                              >
                                Or get all 49 templates with Career Pro (₹999/mo) →
                              </Link>
                            </>
                          )}
                          <p className="text-[11px] text-center text-muted-foreground">
                            Instant delivery • Secure payment via Cashfree • 100% Money-back guarantee
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <SiteFooter />
    </div>
  );
}
