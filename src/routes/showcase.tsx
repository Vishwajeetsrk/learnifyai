import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Code2,
  Globe,
  Database,
  Wrench,
  Beaker,
  GraduationCap,
  Sparkles,
  Brain,
  BookOpen,
  Users,
  Trophy,
  Wallet,
  MessageSquare,
  PlayCircle,
  Bot,
  Terminal,
  Shield,
  Check,
  Zap,
  ArrowRight,
  FileCode,
  PanelBottom,
  Search,
  Cpu,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/showcase")({
  head: () => ({
    meta: [
      { title: "Showcase — Learnify AI" },
      {
        name: "description",
        content:
          "Explore all the tools, features, and capabilities of Learnify AI — the next-gen AI-powered LMS.",
      },
    ],
  }),
  component: ShowcasePage,
});

const FEATURES = [
  {
    category: "🎮 Playground & Code Tools",
    items: [
      {
        icon: Code2,
        title: "Multi-Language Code Editor",
        desc: "Monaco editor with 17 languages — Python, JS, TS, Java, C++, Go, Rust, and more. Syntax highlighting, themes, font controls.",
      },
      {
        icon: Terminal,
        title: "Multi-Executor Code Runner",
        desc: "Auto-fallback chain: Judge0 CE → Wandbox → Piston. JS/TS run locally via Node.js VM for instant results. stdout/stderr output with exit codes.",
      },
      {
        icon: Globe,
        title: "Web Sandbox (HTML/CSS/JS)",
        desc: "Split-pane editor with live iframe preview. Real-time updates as you type. Mobile/desktop viewport toggle.",
      },
      {
        icon: Database,
        title: "Database Playground (SQLite)",
        desc: "In-browser SQLite via sql.js WASM. Run queries, create/alter tables with visual Schema Builder. Persists to localStorage.",
      },
      {
        icon: Wrench,
        title: "18+ Dev Tools",
        desc: "Image compressor, Base64, JWT decoder, UUID, SHA hash, password generator, color converter, regex tester, diff checker, and more — all client-side, zero data leakage.",
      },
      {
        icon: Beaker,
        title: "API Tester",
        desc: "Postman-style HTTP request tester with methods (GET/POST/PUT/DELETE), custom headers, body editor, response viewer, history, and code snippet generator (cURL, Python, JS fetch).",
      },
      {
        icon: PanelBottom,
        title: "AI Debug Panel",
        desc: "8 modes: Diagnose, Explain, Fix Errors, Optimize, Convert, Tests, Docs, Generate. Apply fixes directly to the editor with one click. Powered by OpenRouter with 4 fallback models.",
      },
      {
        icon: GraduationCap,
        title: "AI Exercise Grader",
        desc: "Generate coding exercises from any lesson, write your solution, and click 'Check Exercise' for instant AI grading — score (0-100), pass/fail, suggestions, and actionable hints.",
      },
      {
        icon: FileCode,
        title: "React Sandbox",
        desc: "Sandpack-powered React playground with multi-file support, live preview, and dependency management (React 18).",
      },
      {
        icon: Cpu,
        title: "DSA Challenges & Interview Mode",
        desc: "7 pre-seeded problems (Two Sum, FizzBuzz, Valid Parentheses, etc.) with difficulty/category filtering. Timed coding assessments with adjustable duration.",
      },
    ],
  },
  {
    category: "🤖 AI & Learning Tools",
    items: [
      {
        icon: Brain,
        title: "AI Tutor (Learnify AI Chat)",
        desc: "Context-aware conversational AI that explains concepts on the fly. Powered by OpenRouter with Gemini and Groq fallback.",
      },
      {
        icon: Bot,
        title: "AI Agent",
        desc: "Intelligent assistant with code execution (Judge0/Wandbox), web search, and multi-turn memory. Inline in course player.",
      },
      {
        icon: Sparkles,
        title: "AI Summary Generator",
        desc: "Generate structured lesson summaries with key takeaways, core concepts, real-world applications, and quick recaps.",
      },
      {
        icon: BookOpen,
        title: "Smart Notes & Flashcards",
        desc: "Auto-generated flashcards render as interactive flip cards directly in your inbox. AI-powered lesson notes.",
      },
      {
        icon: PlayCircle,
        title: "AI Exercise Generator",
        desc: "Design practical coding exercises from any lesson with starter code, expected output, bonus challenges, and solution hints.",
      },
    ],
  },
  {
    category: "📚 Learning & Courses",
    items: [
      {
        icon: PlayCircle,
        title: "Interactive Course Player",
        desc: "Rich media support, markdown notes, video playback with auto-quality selection. Listen button reads notes aloud via Web Speech API (TTS).",
      },
      {
        icon: Wallet,
        title: "Wallet & Integrated Payments",
        desc: "Cashfree-powered wallet with UPI/card/netbanking top-ups, course purchases, creator payouts, and downloadable invoices.",
      },
      {
        icon: Trophy,
        title: "Leaderboard & Achievements",
        desc: "XP-based leaderboard with weekly/all-time tabs, podium display, rank badges, level system (Bronze→Diamond), and 20+ achievements.",
      },
      {
        icon: Users,
        title: "Community Feed",
        desc: "Share updates, create polls, post announcements. Rich text editor with colors, fonts, emoji picker. Comment with avatars, live poll voting.",
      },
      {
        icon: Shield,
        title: "Verifiable Certificates",
        desc: "WYSIWYG drag-and-drop certificate designer with 10 theme presets, QR code integration, and public verification.",
      },
      {
        icon: BookOpen,
        title: "Cohort Manager",
        desc: "Live cohorts with countdown timers, WhatsApp/Meet links, member management, and group chat. Transform async courses into high-ticket cohorts.",
      },
    ],
  },
  {
    category: "🚀 Creator & Admin",
    items: [
      {
        icon: Wrench,
        title: "Creator Studio",
        desc: "Upload courses, manage lessons with video validation, add assignments/projects, create MCQs with automatic grading (70% pass threshold).",
      },
      {
        icon: MessageSquare,
        title: "Coaching Hub",
        desc: "5-tab production: Scheduling (Google Meet/Zoom), Messaging (real-time Supabase), Client Roadmaps, Outcomes Analytics, Cohorts.",
      },
      {
        icon: Trophy,
        title: "AI Auto-Complete Course",
        desc: "One-click fills missing videos (YouTube search filtered to Education), pulls transcripts & summarizes, generates 8 MCQs, 2 assignments + 1 project.",
      },
      {
        icon: Bot,
        title: "AI Thumbnail Generator",
        desc: "7-tier fallback (Gemini → Stability AI → OpenRouter → Hugging Face → Pollinations → Fal AI → local SVG) — always produces a thumbnail.",
      },
      {
        icon: Search,
        title: "Content Manager",
        desc: "Manage events, jobs, pricing plans, site settings, certificate templates, FAQs, legal pages, coupons, roadmap, and community groups.",
      },
      {
        icon: Zap,
        title: "Missing Video Detector",
        desc: "Automated detection of lessons with empty/invalid video URLs and courses with zero lessons — table view with direct Studio links.",
      },
    ],
  },
];

function ShowcasePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/60">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-60"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 70%)",
            }}
          />
          <div className="container mx-auto px-6 py-20 md:py-28 max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 backdrop-blur px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground mb-6">
              Everything in one platform
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">
              Explore the <span className="text-gradient">complete</span> Learnify AI experience
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
              From a full coding IDE with multi-executor code running to AI-powered tutoring,
              in-browser databases, API testing, and 18+ developer tools — all inside your course
              player.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 shadow-glow"
              >
                <Link to="/signup">Start free</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/pricing" search={{ subscribe: undefined }}>
                  View pricing
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Feature Categories */}
        {FEATURES.map((section, si) => (
          <section key={si} className="border-b border-border/40 py-16 md:py-20">
            <div className="container mx-auto px-6 max-w-6xl">
              <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-2">
                {section.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {section.items.map((feature, fi) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={fi}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: fi * 0.05 }}
                      className="group rounded-xl border border-border/60 bg-card/50 p-5 hover:bg-card hover:shadow-md hover:border-primary/20 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-primary/10 p-2.5 shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {feature.desc}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        ))}

        {/* Playground Statistics */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-4">
              Numbers that speak
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
              {[
                { label: "Programming Languages", value: "17" },
                { label: "Execution Providers", value: "3" },
                { label: "Dev Tools", value: "18+" },
                { label: "AI Action Modes", value: "8" },
              ].map((stat, i) => (
                <div key={i} className="rounded-xl border border-border/60 bg-card/30 p-6">
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 pb-16">
          <div className="rounded-3xl border border-border bg-card p-12 md:p-16 text-center shadow-card">
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl mx-auto">
              Ready to experience it all?
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
              Start free. No credit card required. All tools included.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 shadow-glow"
              >
                <Link to="/signup">Create free account</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/pricing" search={{ subscribe: undefined }}>
                  Compare plans
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
