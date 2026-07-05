import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Input } from "@/components/ui/input";
import projectsData from "@/data/projects.json";


export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Design Projects Showcase — Learnify AI" },
      {
        name: "description",
        content:
          "Explore 47 interactive website design templates, micro-sites, and UX prototypes built with next-generation aesthetics.",
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
};

type ViewportType = "desktop" | "tablet" | "mobile";

// Category filter definitions — using Lucide SVG icons
const FILTER_CATEGORIES: { label: string; key: string; icon?: React.ElementType }[] = [
  { label: "All", key: "all", icon: LayoutGrid },
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
  const desc = typeof descInput === "string" ? descInput : (descInput?.description || descInput?.title || "");
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
    case "gsap": return lower.includes("gsap");
    case "video": return lower.includes("video") || lower.includes("loop");
    case "3d": return lower.includes("3d") || lower.includes("spline");
    case "glass": return lower.includes("glass") || lower.includes("liquid");
    case "dark": return lower.includes("dark") || lower.includes("black");
    case "minimal": return lower.includes("minimal") || lower.includes("clean");
    case "forms": return lower.includes("form") || lower.includes("sign");
    default: return true;
  }
}

function ProjectCard({
  p,
  onClick,
}: {
  p: Project;
  onClick: () => void;
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
      { rootMargin: "300px" }
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
      <div className={`aspect-video bg-gradient-to-br ${bg} relative overflow-hidden flex-shrink-0`}>
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
            className={`absolute inset-0 transition-opacity duration-700 ${
              iframeLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <iframe
              src={p.path}
              title={p.name}
              className="border-0 pointer-events-none select-none"
              style={{
                width: "200%",
                height: "200%",
                transform: "scale(0.5)",
                transformOrigin: "top left",
              }}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups"
              onLoad={() => { iframeLoadedRef.current = true; setIframeLoaded(true); setIframeError(false); }}
            />
          </div>
        )}

        {/* Fallback when iframe cannot load (X-Frame-Options deny, etc.) */}
        {isVisible && iframeError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/70 to-black/90">
            <div className="flex flex-col items-center gap-2 text-center px-4">
              <Lock className="h-6 w-6 text-amber-400" />
              <span className="text-xs text-white/80">Preview blocked by site</span>
              <button
                onClick={(e) => { e.stopPropagation(); window.open(p.path, "_blank"); }}
                className="flex items-center gap-1 text-[10px] font-semibold text-white bg-primary/80 hover:bg-primary px-3 py-1.5 rounded-lg transition-all"
              >
                <ExternalLink className="h-3 w-3" /> Open in new tab
              </button>
            </div>
          </div>
        )}

        {/* Hover overlay — Click for Modal Sandbox or Copy Prompt */}
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-between p-4 z-20">
          <div className="flex items-center gap-2">
            <button
              onClick={onClick}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 px-3.5 py-2 rounded-xl shadow-lg transition-all hover:scale-105"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              Live Preview
            </button>
            <button
              onClick={handleLaunchDirect}
              className="flex items-center gap-1.5 text-xs font-semibold text-foreground bg-secondary/90 hover:bg-secondary px-3.5 py-2 rounded-xl transition-all border border-white/20 hover:scale-105"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Direct
            </button>
          </div>

          <button
            onClick={handleCopyPrompt}
            title="Copy prompt for AI tools"
            className="flex items-center gap-1 text-[11px] font-medium text-white bg-black/60 hover:bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 transition-all hover:scale-105"
          >
            {copied ? <CheckCheck className="h-3.5 w-3.5 text-emerald-400" /> : <ClipboardCopy className="h-3.5 w-3.5" />}
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
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-1" />
        </div>
      </div>
    </motion.div>
  );
}

function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewport, setViewport] = useState<ViewportType>("desktop");
  const [filter, setFilter] = useState("all");

  // Escape key closes modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedProject(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filteredProjects = useMemo(() => {
    return (projectsData as Project[]).filter((p) => {
      const query = search.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(query) ||
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query);
      return matchesSearch && matchesFilter(p, filter);
    });
  }, [search, filter]);

  const getViewportWidth = () => {
    switch (viewport) {
      case "mobile": return "375px";
      case "tablet": return "768px";
      default: return "100%";
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
              Next-Gen Website{" "}
              <span className="text-gradient">Design Portfolio</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto"
            >
              Interact with our collection of{" "}
              <span className="text-foreground font-semibold">{projectsData.length}</span>{" "}
              highly polished design templates, 3D prototypes, landing pages, and cinematic micro-sites.
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
          </div>
        </section>

        {/* ── Filter Chips ─────────────────────────────────────── */}
        <section className="sticky top-[60px] z-30 bg-background/90 backdrop-blur-md border-b border-border/60 py-3 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2 pb-0.5">
            <div className="flex items-center gap-1.5 mr-1 text-muted-foreground shrink-0">
              <Filter className="h-4 w-4" />
              <span className="text-xs font-semibold">
                ({filteredProjects.length})
              </span>
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

        {/* ── Projects Grid ─────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-6">
            <LayoutGrid className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              All Interactive Designs
              <span className="ml-2 text-sm text-muted-foreground font-normal">({filteredProjects.length})</span>
            </h2>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((p) => (
                <ProjectCard key={p.id} p={p} onClick={() => setSelectedProject(p)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-dashed border-border rounded-3xl bg-card/30">
              <LayoutGrid className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold text-foreground">No projects found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try searching for "GSAP", "3D", or{" "}
                <button
                  onClick={() => { setSearch(""); setFilter("all"); }}
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
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedProject(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="bg-background border-0 md:border md:border-border rounded-none md:rounded-3xl shadow-2xl w-full h-full md:h-[92vh] max-w-7xl flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors shrink-0"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <div className="min-w-0">
                    <h3 className="font-display text-sm font-semibold text-foreground leading-none truncate">
                      {selectedProject.name}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block truncate max-w-xs">
                      {selectedProject.title}
                    </p>
                  </div>
                </div>

                {/* Viewport toggles */}
                <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border">
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

                {/* Right controls */}
                <div className="flex items-center gap-1.5">
                  <a
                    href={selectedProject.path}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-transparent hover:bg-accent px-3 py-1.5 rounded-lg transition-all border border-border"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Fullscreen
                  </a>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Iframe Sandbox */}
              <div className="flex-1 bg-muted/20 p-3 sm:p-4 flex items-center justify-center overflow-hidden">
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
                      <span className="text-primary/80">learnify.ai</span>
                      <span>{selectedProject.path}</span>
                    </div>
                  </div>

                  <iframe
                    src={selectedProject.path}
                    title={selectedProject.name}
                    className="w-full flex-1 bg-white border-0"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-downloads"
                    onLoad={(e) => { (e.target as HTMLIFrameElement).style.display = "block"; }}
                    onError={() => { /* fallback handles timeout */ }}
                  />
                  <div id="modal-iframe-fallback" className="hidden flex-col items-center justify-center w-full h-full bg-muted/30">
                    <Lock className="h-8 w-8 text-amber-400 mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">Preview blocked by the site</p>
                    <a href={selectedProject.path} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-2 rounded-xl transition-all">
                      <ExternalLink className="h-4 w-4" /> Open in new tab
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <SiteFooter />
    </div>
  );
}
