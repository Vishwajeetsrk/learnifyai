import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Documentation & Platform Guides — Learnify AI" },
      { name: "description", content: "Complete user documentation, student guides, feature walk-throughs, and creator/coach rules." },
    ],
  }),
  component: DocsPage,
});

// ─── SVG Icon components ─────────────────────────────────────────────────────
const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-emerald-500 shrink-0">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const GradCapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);
const UserCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" />
  </svg>
);
const CoachIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /><path d="M12 6v6l4 2" />
  </svg>
);
const CpuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
  </svg>
);
const SparkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
  </svg>
);
const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);
const TerminalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);
const BotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M12 11V6" /><circle cx="12" cy="4" r="2" />
    <line x1="8" y1="15" x2="8" y2="15" strokeWidth="3" /><line x1="16" y1="15" x2="16" y2="15" strokeWidth="3" />
  </svg>
);
const AwardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const CameraIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
  </svg>
);
const WrenchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);
const RocketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);
const WalletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12V22H4V12" /><path d="M22 7H2v5h20V7z" /><path d="M12 22V7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);
const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="18" width="12" height="4" rx="1" />
    <path d="M6 9c0 3.3 2.7 6 6 6s6-2.7 6-6" />
  </svg>
);
const LayersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "students", label: "Student Guide", icon: <GradCapIcon /> },
  { id: "playground", label: "Playground & Tools", icon: <CodeIcon /> },
  { id: "ai", label: "AI & Learning", icon: <BotIcon /> },
  { id: "creators", label: "Creator Guide", icon: <UserCheckIcon /> },
  { id: "coaches", label: "Coach Guide", icon: <CoachIcon /> },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  description,
  points,
  accentClass = "text-primary",
  bgClass = "from-primary/5 to-primary/10",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  points?: string[];
  accentClass?: string;
  bgClass?: string;
}) {
  return (
    <div className={cn("p-6 rounded-2xl border bg-gradient-to-br shadow-sm", bgClass)}>
      <div className={cn("w-9 h-9 mb-3 [&>svg]:w-full [&>svg]:h-full", accentClass)}>{icon}</div>
      <h3 className="text-base font-semibold mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{description}</p>
      {points && (
        <ul className="space-y-1.5">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-2 text-xs text-muted-foreground">
              <CheckIcon /> {p}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center px-6 py-4 rounded-xl border bg-card shadow-sm">
      <span className="text-2xl font-bold text-primary">{value}</span>
      <span className="text-xs text-muted-foreground mt-0.5 text-center">{label}</span>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function DocsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("students");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="bg-gradient-to-b from-primary/10 via-background to-background border-b py-16 md:py-20">
          <div className="container mx-auto px-6 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <span className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full"><BookIcon /></span>
              Official Knowledge Base
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Learnify AI Documentation
            </h1>
            <p className="mt-4 text-muted-foreground text-base md:text-lg">
              Everything you need to master AI tutoring, career tools, course publishing, and coach sessions.
            </p>

            <div className="relative max-w-xl mx-auto mt-8">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground [&>svg]:w-full [&>svg]:h-full">
                <SearchIcon />
              </span>
              <Input
                placeholder="Search guides, AI credits, creator rules, certificates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 bg-card shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="container mx-auto px-4 md:px-6 py-10 max-w-5xl">
          {/* Tab bar */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-8 border-b scrollbar-none">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px",
                  activeTab === t.id
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                <span className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* STUDENT GUIDE */}
          {activeTab === "students" && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-5">
                <FeatureCard
                  icon={<SparkIcon />}
                  title="AI Tutor & Credits System"
                  description="Learnify AI provides context-aware AI tutoring for all courses. Free tier accounts receive 500 free AI credits every month. Pro tier accounts receive 10,000 AI credits/mo."
                  points={[
                    "1 AI Tutor Question = 5 Credits",
                    "1 Resume Generation = 50 Credits",
                    "1 Mock Interview Session = 100 Credits",
                  ]}
                  accentClass="text-indigo-500"
                  bgClass="from-indigo-500/5 to-indigo-500/10"
                />
                <FeatureCard
                  icon={<ShieldIcon />}
                  title="Certificate Verification"
                  description="Upon completing course requirements and scoring ≥ 70% in assessments, a cryptographic QR-coded certificate is issued."
                  points={[
                    "Shareable URL with public verification page",
                    "1-Click 'Add to LinkedIn Profile' button",
                    "Tamper-proof QR code on every certificate",
                  ]}
                  accentClass="text-emerald-600"
                  bgClass="from-emerald-500/5 to-emerald-500/10"
                />
                <FeatureCard
                  icon={<TrophyIcon />}
                  title="Leaderboard & Achievements"
                  description="XP-based leaderboard with weekly/all-time tabs, podium display, rank badges, level system (Bronze→Diamond), and 20+ achievements."
                  points={[
                    "Earn XP from lessons, challenges & community posts",
                    "Weekly rank resets for fresh competition",
                    "20+ achievement badges to unlock",
                  ]}
                  accentClass="text-amber-500"
                  bgClass="from-amber-500/5 to-amber-500/10"
                />
                <FeatureCard
                  icon={<WalletIcon />}
                  title="Wallet & Payments"
                  description="Cashfree-powered wallet with UPI/card/netbanking top-ups, course purchases, creator payouts, and downloadable invoices."
                  points={[
                    "UPI, Card, Net Banking & EMI support",
                    "Download GST-compliant invoices as PDF",
                    "Wallet balance for instant course purchases",
                  ]}
                  accentClass="text-violet-500"
                  bgClass="from-violet-500/5 to-violet-500/10"
                />
              </div>

              {/* Stats */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Numbers that speak</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatPill value="17" label="Programming Languages" />
                  <StatPill value="3" label="Execution Providers" />
                  <StatPill value="18+" label="Dev Tools" />
                  <StatPill value="8" label="AI Action Modes" />
                </div>
              </div>

              <div className="rounded-2xl border bg-gradient-to-r from-primary/10 to-primary/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Ready to experience it all?</h3>
                  <p className="text-sm text-muted-foreground">Start free. No credit card required.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button asChild>
                    <Link to="/signup">Create free account</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/pricing" search={{ subscribe: undefined } as any}>Compare plans</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* PLAYGROUND & CODE TOOLS */}
          {activeTab === "playground" && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-5">
                <FeatureCard
                  icon={<CodeIcon />}
                  title="Multi-Language Code Editor"
                  description="Monaco editor with 17 languages — Python, JS, TS, Java, C++, Go, Rust, and more. Syntax highlighting, themes, font controls."
                  accentClass="text-blue-500"
                  bgClass="from-blue-500/5 to-blue-500/10"
                />
                <FeatureCard
                  icon={<TerminalIcon />}
                  title="Multi-Executor Code Runner"
                  description="Auto-fallback chain: Judge0 CE → Wandbox → Piston. JS/TS run locally via Node.js VM for instant results. stdout/stderr output with exit codes."
                  accentClass="text-slate-600"
                  bgClass="from-slate-500/5 to-slate-500/10"
                />
                <FeatureCard
                  icon={<EyeIcon />}
                  title="Web Sandbox (HTML/CSS/JS)"
                  description="Split-pane editor with live iframe preview. Real-time updates as you type. Mobile/desktop viewport toggle."
                  accentClass="text-orange-500"
                  bgClass="from-orange-500/5 to-orange-500/10"
                />
                <FeatureCard
                  icon={<LayersIcon />}
                  title="Database Playground (SQLite)"
                  description="In-browser SQLite via sql.js WASM. Run queries, create/alter tables with visual Schema Builder. Persists to localStorage."
                  accentClass="text-teal-500"
                  bgClass="from-teal-500/5 to-teal-500/10"
                />
                <FeatureCard
                  icon={<WrenchIcon />}
                  title="18+ Dev Tools"
                  description="Image compressor, Base64, JWT decoder, UUID, SHA hash, password generator, color converter, regex tester, diff checker — all client-side, zero data leakage."
                  accentClass="text-pink-500"
                  bgClass="from-pink-500/5 to-pink-500/10"
                />
                <FeatureCard
                  icon={<CpuIcon />}
                  title="API Tester"
                  description="Postman-style HTTP request tester with methods (GET/POST/PUT/DELETE), custom headers, body editor, response viewer, history, and code snippet generator."
                  accentClass="text-indigo-500"
                  bgClass="from-indigo-500/5 to-indigo-500/10"
                />
                <FeatureCard
                  icon={<BotIcon />}
                  title="AI Debug Panel"
                  description="8 modes: Diagnose, Explain, Fix Errors, Optimize, Convert, Tests, Docs, Generate. Apply fixes directly to the editor with one click."
                  accentClass="text-violet-500"
                  bgClass="from-violet-500/5 to-violet-500/10"
                />
                <FeatureCard
                  icon={<SparkIcon />}
                  title="DSA Challenges & Interview Mode"
                  description="7 pre-seeded problems (Two Sum, FizzBuzz, Valid Parentheses, etc.) with difficulty/category filtering. Timed coding assessments with adjustable duration."
                  accentClass="text-amber-500"
                  bgClass="from-amber-500/5 to-amber-500/10"
                />
              </div>
            </div>
          )}

          {/* AI & LEARNING TOOLS */}
          {activeTab === "ai" && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-5">
                <FeatureCard
                  icon={<BotIcon />}
                  title="AI Tutor (Learnify AI Chat)"
                  description="Context-aware conversational AI that explains concepts on the fly. Powered by OpenRouter with Gemini and Groq fallback."
                  accentClass="text-indigo-500"
                  bgClass="from-indigo-500/5 to-indigo-500/10"
                />
                <FeatureCard
                  icon={<SparkIcon />}
                  title="AI Agent"
                  description="Intelligent assistant with code execution (Judge0/Wandbox), web search, and multi-turn memory. Inline in course player."
                  accentClass="text-violet-500"
                  bgClass="from-violet-500/5 to-violet-500/10"
                />
                <FeatureCard
                  icon={<LayersIcon />}
                  title="AI Summary Generator"
                  description="Generate structured lesson summaries with key takeaways, core concepts, real-world applications, and quick recaps."
                  accentClass="text-blue-500"
                  bgClass="from-blue-500/5 to-blue-500/10"
                />
                <FeatureCard
                  icon={<BookIcon />}
                  title="Smart Notes & Flashcards"
                  description="Auto-generated flashcards render as interactive flip cards directly in your inbox. AI-powered lesson notes."
                  accentClass="text-emerald-500"
                  bgClass="from-emerald-500/5 to-emerald-500/10"
                />
                <FeatureCard
                  icon={<AwardIcon />}
                  title="AI Exercise Generator"
                  description="Design practical coding exercises from any lesson with starter code, expected output, bonus challenges, and solution hints."
                  accentClass="text-orange-500"
                  bgClass="from-orange-500/5 to-orange-500/10"
                />
                <FeatureCard
                  icon={<UsersIcon />}
                  title="Community Feed"
                  description="Share updates, create polls, post announcements. Rich text editor with colors, fonts, emoji picker. Comment with avatars, live poll voting."
                  accentClass="text-pink-500"
                  bgClass="from-pink-500/5 to-pink-500/10"
                />
              </div>
            </div>
          )}

          {/* CREATORS */}
          {activeTab === "creators" && (
            <div className="space-y-8">
              <div className="p-6 rounded-2xl border bg-gradient-to-br from-purple-500/5 to-indigo-500/10 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 text-purple-600 [&>svg]:w-full [&>svg]:h-full"><UserCheckIcon /></span>
                  <h2 className="text-xl font-bold">Creator Tiers & 80/20 Revenue Split</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Learnify AI empowers instructors, software developers, and industry experts to host free or paid courses with automated Cashfree payouts.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl border bg-card/70 space-y-2">
                    <div className="font-bold text-sm text-primary flex items-center gap-2">
                      <span className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full"><RocketIcon /></span>
                      Free Creator Tier
                    </div>
                    <ul className="text-xs space-y-1.5 text-muted-foreground">
                      {["Publish up to 1 free or paid course", "70% Revenue payout share", "Standard community listing"].map((p) => (
                        <li key={p} className="flex items-center gap-2"><CheckIcon /> {p}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-5 rounded-xl border bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-500/30 space-y-2">
                    <div className="font-bold text-sm text-purple-600 flex items-center gap-2">
                      <span className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full"><AwardIcon /></span>
                      Paid / Verified Creator Tier
                    </div>
                    <ul className="text-xs space-y-1.5 text-muted-foreground">
                      {["Unlimited paid courses & cohorts", "80% Revenue payout share", "Verified Creator Badge & Featured Placement"].map((p) => (
                        <li key={p} className="flex items-center gap-2"><CheckIcon /> {p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <FeatureCard
                  icon={<CameraIcon />}
                  title="Creator Studio"
                  description="Upload courses, manage lessons with video validation, add assignments/projects, create MCQs with automatic grading (70% pass threshold)."
                  accentClass="text-purple-600"
                  bgClass="from-purple-500/5 to-purple-500/10"
                />
                <FeatureCard
                  icon={<BotIcon />}
                  title="AI Auto-Complete Course"
                  description="One-click fills missing videos (YouTube search filtered to Education), pulls transcripts & summarises, generates 8 MCQs, 2 assignments + 1 project."
                  accentClass="text-indigo-500"
                  bgClass="from-indigo-500/5 to-indigo-500/10"
                />
                <FeatureCard
                  icon={<SparkIcon />}
                  title="AI Thumbnail Generator"
                  description="7-tier fallback (Gemini → Stability AI → OpenRouter → Hugging Face → Pollinations → Fal AI → local SVG) — always produces a thumbnail."
                  accentClass="text-orange-500"
                  bgClass="from-orange-500/5 to-orange-500/10"
                />
                <FeatureCard
                  icon={<CalendarIcon />}
                  title="Cohort Manager"
                  description="Live cohorts with countdown timers, WhatsApp/Meet links, member management, and group chat. Transform async courses into high-ticket cohorts."
                  accentClass="text-teal-500"
                  bgClass="from-teal-500/5 to-teal-500/10"
                />
              </div>

              <div className="flex justify-center">
                <Button asChild>
                  <Link to="/apply-creator">
                    Apply to be a Creator <span className="ml-1 w-4 h-4 [&>svg]:w-full [&>svg]:h-full inline-block align-middle"><ArrowRightIcon /></span>
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* COACHES */}
          {activeTab === "coaches" && (
            <div className="space-y-8">
              <div className="p-6 rounded-2xl border bg-gradient-to-br from-emerald-500/5 to-teal-500/10 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 text-emerald-600 [&>svg]:w-full [&>svg]:h-full"><CoachIcon /></span>
                  <h2 className="text-xl font-bold">1-on-1 Coaching & Mentorship Program</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Coaches can set their own availability and pricing for 1-on-1 resume feedback, mock interviews, and career roadmaps.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl border bg-card/70 space-y-2">
                    <div className="font-bold text-sm text-primary flex items-center gap-2">
                      <span className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full"><RocketIcon /></span>
                      Free Coach Tier
                    </div>
                    <ul className="text-xs space-y-1.5 text-muted-foreground">
                      {["Offer free 15-min discovery sessions", "Community profile page"].map((p) => (
                        <li key={p} className="flex items-center gap-2"><CheckIcon /> {p}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-5 rounded-xl border bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30 space-y-2">
                    <div className="font-bold text-sm text-emerald-600 flex items-center gap-2">
                      <span className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full"><AwardIcon /></span>
                      Paid / Verified Coach Tier
                    </div>
                    <ul className="text-xs space-y-1.5 text-muted-foreground">
                      {["Custom session rates (e.g. ₹999/hr)", "80% direct payout split via Cashfree", "Priority booking calendar integration"].map((p) => (
                        <li key={p} className="flex items-center gap-2"><CheckIcon /> {p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <FeatureCard
                  icon={<CalendarIcon />}
                  title="Scheduling"
                  description="Set availability via Google Meet or Zoom integrations. Students can book slots directly from your coaching profile."
                  accentClass="text-blue-500"
                  bgClass="from-blue-500/5 to-blue-500/10"
                />
                <FeatureCard
                  icon={<UsersIcon />}
                  title="Real-time Messaging"
                  description="Live Supabase-powered messaging channel between coach and student. No third-party messaging app needed."
                  accentClass="text-indigo-500"
                  bgClass="from-indigo-500/5 to-indigo-500/10"
                />
                <FeatureCard
                  icon={<LayersIcon />}
                  title="Client Roadmaps"
                  description="Build and share custom learning roadmaps with each client. Track milestone completion and skill progress."
                  accentClass="text-teal-500"
                  bgClass="from-teal-500/5 to-teal-500/10"
                />
                <FeatureCard
                  icon={<TrophyIcon />}
                  title="Outcomes Analytics"
                  description="See aggregated student outcomes, completion rates, and session ratings for your coaching practice."
                  accentClass="text-amber-500"
                  bgClass="from-amber-500/5 to-amber-500/10"
                />
              </div>

              <div className="flex justify-center">
                <Button asChild>
                  <Link to="/apply-coach">
                    Apply to be a Coach <span className="ml-1 w-4 h-4 [&>svg]:w-full [&>svg]:h-full inline-block align-middle"><ArrowRightIcon /></span>
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
