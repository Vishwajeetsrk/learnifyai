import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Code2, Globe, Box, BookOpen, Award, BarChart3, Sparkles, ArrowRight, Play, FileCode, Zap, Github } from "lucide-react";

export const Route = createFileRoute("/_authenticated/playground")({
  head: () => ({ meta: [{ title: "Playground — Learnify AI" }] }),
  component: PlaygroundHub,
});

function PlaygroundHub() {
  const features = [
    { to: "/playground/editor", label: "Code Editor", desc: "Multi-language editor with Monaco, run code in 30+ languages.", icon: Code2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { to: "/playground/web", label: "Web Playground", desc: "Live HTML/CSS/JS preview with real-time rendering.", icon: Globe, color: "text-orange-500", bg: "bg-orange-500/10" },
    { to: "/playground/react", label: "React Sandbox", desc: "Build and preview React components live with Sandpack.", icon: Box, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { to: "/playground/projects", label: "Projects", desc: "Save, manage, and organize your coding projects.", icon: FileCode, color: "text-purple-500", bg: "bg-purple-500/10" },
    { to: "/playground/challenges", label: "Challenges", desc: "Solve DSA problems, earn points, climb the leaderboard.", icon: Award, color: "text-amber-500", bg: "bg-amber-500/10" },
    { to: "/playground/interview", label: "Interview Mode", desc: "Timed coding rounds with test cases and scoring.", icon: Zap, color: "text-red-500", bg: "bg-red-500/10" },
    { to: "/playground/leaderboard", label: "Leaderboard", desc: "See top coders, track your rank and progress.", icon: BarChart3, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-medium mb-1">
              <Code2 className="h-3.5 w-3.5" /> Learnify Playground
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight">Code. Create. Compete.</h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-xl">
              Write and run code in 30+ languages, build web pages, solve challenges, and ace coding interviews.
            </p>
          </div>
          <Link to="/playground/editor">
            <span className="hidden sm:inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition">
              <Play className="h-4 w-4" /> Start Coding
            </span>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <Link key={f.to} to={f.to} className="group rounded-xl border bg-card p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className={`w-10 h-10 rounded-lg ${f.bg} grid place-items-center mb-3`}>
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <h3 className="font-semibold text-sm group-hover:text-primary transition">{f.label}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>

        {/* Quick start */}
        <div className="mt-10 rounded-xl border bg-card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Quick Start</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-muted/30 space-y-1">
              <div className="font-medium">1. Choose a language</div>
              <p className="text-xs text-muted-foreground">JavaScript, Python, TypeScript, Java, Go, Rust, and 25+ more.</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 space-y-1">
              <div className="font-medium">2. Write code</div>
              <p className="text-xs text-muted-foreground">Monaco editor with syntax highlighting, autocomplete, and themes.</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 space-y-1">
              <div className="font-medium">3. Run & debug</div>
              <p className="text-xs text-muted-foreground">Press Ctrl+Enter to execute. View stdout, stderr, and exit codes.</p>
            </div>
          </div>
        </div>

        {/* Languages strip */}
        <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Languages:</span>
          {["JavaScript", "TypeScript", "Python", "Java", "C++", "C", "C#", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "SQL", "Bash"].map((l) => (
            <span key={l} className="px-2 py-1 rounded-md bg-muted border">{l}</span>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
