import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  MessageSquare,
  GraduationCap,
  Bell,
  Zap,
  BookOpen,
  Check,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StaggerGroup, StaggerItem } from "@/components/Reveal";

const aiTools = [
  {
    id: "quiz",
    icon: Sparkles,
    label: "Quiz Generator",
    desc: "Turn any topic into a 10-question MCQ set.",
  },
  {
    id: "doubt",
    icon: MessageSquare,
    label: "Doubt Solver",
    desc: "Ask any question, get a worked-out answer.",
  },
  {
    id: "career",
    icon: GraduationCap,
    label: "Career Coach",
    desc: "Roadmaps tailored to your goals.",
  },
  {
    id: "reminders",
    icon: Bell,
    label: "Smart Reminders",
    desc: "Spaced repetition that actually fits your week.",
  },
  {
    id: "synthesizer",
    icon: Zap,
    label: "Lesson Synthesizer",
    desc: "Compress hours of video into 5-minute briefs.",
  },
  {
    id: "flashcards",
    icon: BookOpen,
    label: "Auto Flashcards",
    desc: "Generate decks straight from your notes.",
  },
];

export function AiToolsShowcase() {
  const [selectedTool, setSelectedTool] = useState("quiz");
  const [demoStep, setDemoStep] = useState<"idle" | "loading" | "done">("idle");
  const [demoText, setDemoText] = useState("");
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const handleSimulate = () => {
    setDemoStep("loading");
    setTimeout(() => {
      setDemoStep("done");
    }, 1200);
  };

  // Trigger with default demo content if nothing typed
  const triggerDemo = (defaultText: string) => {
    if (!demoText.trim()) setDemoText(defaultText);
    handleSimulate();
  };

  const renderInteractiveDemo = () => {
    switch (selectedTool) {
      case "quiz":
        return (
          <div className="flex flex-col h-full justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-sm text-foreground">
                  Interactive Quiz Generator
                </h3>
              </div>

              {demoStep === "idle" && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Simulate generating a quiz on any topic. Try entering a topic below!
                  </p>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      TOPIC
                    </label>
                    <Input
                      required
                      value={demoText}
                      onChange={(e) => setDemoText(e.target.value)}
                      placeholder="e.g., React Hooks, Photosynthesis, Cryptography"
                      className="bg-muted/50 h-9 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && demoText.trim()) {
                          handleSimulate();
                        }
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => triggerDemo("React Hooks")}
                  >
                    Generate Quiz
                  </Button>
                </div>
              )}

              {demoStep === "loading" && (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs font-medium text-foreground">
                    Analyzing topic and drafting MCQs...
                  </p>
                </div>
              )}

              {demoStep === "done" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-muted/40 p-2.5 rounded-lg text-[11px]">
                    <span className="font-semibold text-foreground truncate max-w-[200px]">
                      Topic: {demoText || "React Hooks"}
                    </span>
                    <span className="text-primary font-medium">3 Questions</span>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-foreground leading-relaxed">
                      Q: Which of the following is a rule of React Hooks?
                    </p>
                    <div className="grid gap-2">
                      {[
                        "Hooks can only be called from inside Class components",
                        "Hooks can be called conditionally inside if statements",
                        "Hooks must only be called at the top level of React functions",
                        "Hooks can be called inside regular Javascript functions",
                      ].map((opt, i) => {
                        const isCorrect = i === 2;
                        const isSelected = selectedAnswers[0] === i;
                        const hasSelected = selectedAnswers[0] !== undefined;
                        let btnStyle = "border-border hover:bg-muted/40 text-foreground";
                        if (hasSelected) {
                          if (isCorrect)
                            btnStyle =
                              "bg-emerald-500/10 border-emerald-500/50 text-emerald-700 dark:text-emerald-400 font-medium";
                          else if (isSelected)
                            btnStyle =
                              "bg-destructive/10 border-destructive-300/30 text-destructive-700 dark:text-red-400";
                          else btnStyle = "opacity-50 text-muted-foreground";
                        }
                        return (
                          <button
                            key={i}
                            disabled={hasSelected}
                            onClick={() => setSelectedAnswers({ ...selectedAnswers, 0: i })}
                            className={`w-full text-left p-2.5 text-[11px] rounded-lg border transition-all ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {demoStep === "done" && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  setDemoStep("idle");
                  setSelectedAnswers({});
                }}
              >
                Create Another Quiz
              </Button>
            )}
          </div>
        );
      case "doubt":
        return (
          <div className="flex flex-col h-full justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-sm text-foreground">
                  Real-Time Doubt Solver
                </h3>
              </div>

              {demoStep === "idle" && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Ask any question about your course and get an instant structured answer with
                    code or examples.
                  </p>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      YOUR QUESTION
                    </label>
                    <Input
                      required
                      value={demoText}
                      onChange={(e) => setDemoText(e.target.value)}
                      placeholder="e.g., Explain closure in JS, Why is the sky blue?"
                      className="bg-muted/50 h-9 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && demoText.trim()) {
                          handleSimulate();
                        }
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => triggerDemo("How does CSS Flexbox work?")}
                  >
                    Solve Doubt
                  </Button>
                </div>
              )}

              {demoStep === "loading" && (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs font-medium text-foreground">
                    Searching course material and drafting answer...
                  </p>
                </div>
              )}

              {demoStep === "done" && (
                <div className="space-y-4">
                  <div className="bg-muted/40 p-2.5 rounded-lg border text-[11px] font-mono text-foreground flex gap-2">
                    <span className="font-semibold text-primary">Q:</span>
                    <span className="truncate">{demoText || "How does CSS Flexbox work?"}</span>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-3.5 text-xs leading-relaxed space-y-2 text-foreground">
                    <div className="flex items-center gap-1.5 font-semibold text-primary mb-1">
                      <Sparkles className="h-3.5 w-3.5" /> AI DOUBT SOLVER
                    </div>
                    <p>
                      Flexbox is a 1D layout model. It aligns items inside a container along either
                      a **horizontal row** or a **vertical column**.
                    </p>
                    <div className="bg-black/5 dark:bg-black/30 p-2 rounded font-mono text-[10px] text-muted-foreground border">
                      .container &#123; display: flex; justify-content: center; align-items: center;
                      &#125;
                    </div>
                  </div>
                </div>
              )}
            </div>

            {demoStep === "done" && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => setDemoStep("idle")}
              >
                Ask Another Doubt
              </Button>
            )}
          </div>
        );
      case "career":
        return (
          <div className="flex flex-col h-full justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-sm text-foreground">
                  AI Career Coach
                </h3>
              </div>

              {demoStep === "idle" && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Map out a personalized learning path to your dream job or skill goal.
                  </p>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      DREAM ROLE / SKILL GOAL
                    </label>
                    <Input
                      required
                      value={demoText}
                      onChange={(e) => setDemoText(e.target.value)}
                      placeholder="e.g., Full-Stack Web Developer, Machine Learning Engineer"
                      className="bg-muted/50 h-9 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && demoText.trim()) {
                          handleSimulate();
                        }
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => triggerDemo("Full-Stack Developer")}
                  >
                    Generate Roadmap
                  </Button>
                </div>
              )}

              {demoStep === "loading" && (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs font-medium text-foreground">
                    Synthesizing market demands and skill graph...
                  </p>
                </div>
              )}

              {demoStep === "done" && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wider text-muted-foreground">
                    Roadmap: {demoText || "Full-Stack Dev"}
                  </p>
                  <div className="relative border-l border-primary/30 pl-4 ml-2 space-y-4 py-2">
                    {[
                      {
                        step: "Phase 1: Core Fundamentals",
                        skills: "HTML, CSS, JS, Git, Terminal",
                      },
                      {
                        step: "Phase 2: Frontend Mastery",
                        skills: "React 19, Tailwind CSS, TanStack Router",
                      },
                      {
                        step: "Phase 3: Backend & Systems",
                        skills: "SQL, Postgres, Node.js, Cloudflare Workers",
                      },
                    ].map((phase, idx) => (
                      <div key={idx} className="relative text-xs">
                        <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-primary" />
                        <h4 className="font-semibold text-foreground">{phase.step}</h4>
                        <p className="text-muted-foreground mt-0.5">{phase.skills}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {demoStep === "done" && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => setDemoStep("idle")}
              >
                Generate New Roadmap
              </Button>
            )}
          </div>
        );
      case "reminders":
        return (
          <div className="flex flex-col h-full justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-sm text-foreground">
                  Spaced Repetition Reminders
                </h3>
              </div>

              {demoStep === "idle" && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Add a topic to your daily learning loop. The AI calculates optimal review
                    intervals (1, 3, 7, 14 days) to prevent forgetting.
                  </p>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      TOPIC TO RETAIN
                    </label>
                    <Input
                      required
                      value={demoText}
                      onChange={(e) => setDemoText(e.target.value)}
                      placeholder="e.g., HTTP Status Codes, SQL Join logic"
                      className="bg-muted/50 h-9 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && demoText.trim()) {
                          handleSimulate();
                        }
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => triggerDemo("SQL Joins")}
                  >
                    Schedule Spaced Reviews
                  </Button>
                </div>
              )}

              {demoStep === "loading" && (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs font-medium text-foreground">
                    Configuring review schedule in database...
                  </p>
                </div>
              )}

              {demoStep === "done" && (
                <div className="space-y-4">
                  <div className="p-2.5 bg-muted/40 border rounded-lg text-xs text-foreground font-medium flex justify-between">
                    <span>Topic: {demoText || "SQL Joins"}</span>
                    <span className="text-emerald-500 font-semibold flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Active
                    </span>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-xs space-y-3">
                    <p className="font-semibold text-foreground flex items-center gap-1.5 text-primary">
                      <Bell className="h-3.5 w-3.5" /> UPCOMING ALERTS
                    </p>
                    <div className="space-y-1.5 text-[11px] text-foreground">
                      <div className="flex justify-between border-b border-border pb-1">
                        <span>Review 1 (Day 1)</span>
                        <span className="font-medium text-muted-foreground">Tomorrow</span>
                      </div>
                      <div className="flex justify-between border-b border-border pb-1">
                        <span>Review 2 (Day 3)</span>
                        <span className="font-medium text-muted-foreground">3 days from now</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Review 3 (Day 7)</span>
                        <span className="font-medium text-muted-foreground">7 days from now</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {demoStep === "done" && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => setDemoStep("idle")}
              >
                Create New Reminder
              </Button>
            )}
          </div>
        );
      case "synthesizer":
        return (
          <div className="flex flex-col h-full justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-sm text-foreground">
                  Lesson Synthesizer
                </h3>
              </div>

              {demoStep === "idle" && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Paste any YouTube educational video URL. The AI extracts the transcript and
                    generates structured summaries.
                  </p>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      YOUTUBE VIDEO LINK
                    </label>
                    <Input
                      required
                      value={demoText}
                      onChange={(e) => setDemoText(e.target.value)}
                      placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      className="bg-muted/50 h-9 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && demoText.trim()) {
                          handleSimulate();
                        }
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => triggerDemo("https://youtube.com/watch?v=dQw4w9WgXcQ")}
                  >
                    Synthesize Video
                  </Button>
                </div>
              )}

              {demoStep === "loading" && (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs font-medium text-foreground">
                    Downloading captions and summarizing content...
                  </p>
                </div>
              )}

              {demoStep === "done" && (
                <div className="space-y-4">
                  <div className="bg-muted/40 p-2.5 rounded-lg border text-xs text-foreground font-semibold flex items-center justify-between">
                    <span className="truncate max-w-[200px]">
                      Source: {demoText || "React 19 Deep Dive"}
                    </span>
                    <Badge variant="secondary" className="text-[9px]">
                      12 min video
                    </Badge>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-3.5 text-xs leading-relaxed space-y-2 text-foreground">
                    <div className="flex items-center gap-1.5 font-semibold text-primary mb-1">
                      <Zap className="h-3.5 w-3.5" /> 5-MINUTE BRIEF
                    </div>
                    <p className="font-semibold text-foreground">Key Takeaways:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-1 text-[11px]">
                      <li>**Server Components** render on the server, saving bundle size.</li>
                      <li>**Actions API** simplifies state management for forms.</li>
                      <li>**Ref Forwarding** is obsolete; `ref` is now a standard prop.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {demoStep === "done" && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => setDemoStep("idle")}
              >
                Synthesize Another Video
              </Button>
            )}
          </div>
        );
      case "flashcards": {
        const flashcards = [
          {
            q: "What is a Closure in JavaScript?",
            a: "A closure is the combination of a function bundled together with references to its surrounding state (lexical environment).",
          },
          {
            q: "What is the difference between RLS and standard SQL rules?",
            a: "Row Level Security (RLS) restricts database queries on a per-user basis, whereas standard rules apply globally to tables.",
          },
          {
            q: "What does TanStack Query manage?",
            a: "It manages asynchronous state, caching, background refetching, and synchronization in React apps.",
          },
        ];
        return (
          <div className="flex flex-col h-full justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-sm text-foreground">
                  Auto Flashcards
                </h3>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Test your recall with AI-generated flashcards from your note briefs. Click the
                  card to flip it!
                </p>

                {/* FLIP CARD */}
                <div
                  onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                  style={{ perspective: "1000px" }}
                  className="relative h-40 w-full cursor-pointer group"
                >
                  <div
                    style={{
                      transformStyle: "preserve-3d",
                      transition: "transform 0.5s",
                      transform: flashcardFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                    className="relative w-full h-full"
                  >
                    {/* Front */}
                    <div
                      style={{ backfaceVisibility: "hidden" }}
                      className="absolute inset-0 bg-card border rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm hover:border-primary/50 transition"
                    >
                      <Badge variant="outline" className="mb-2 text-[9px]">
                        QUESTION
                      </Badge>
                      <p className="text-xs font-semibold text-foreground text-center leading-relaxed">
                        {flashcards[flashcardIndex].q}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-3 opacity-0 group-hover:opacity-100 transition">
                        Click card to flip
                      </p>
                    </div>

                    {/* Back */}
                    <div
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                      className="absolute inset-0 bg-primary/5 border border-primary/20 rounded-2xl p-5 flex flex-col items-center justify-center shadow-inner"
                    >
                      <Badge className="mb-2 text-[9px] bg-primary">ANSWER</Badge>
                      <p className="text-xs text-foreground text-center leading-relaxed">
                        {flashcards[flashcardIndex].a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setFlashcardFlipped(!flashcardFlipped)}
              >
                Flip Card
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs"
                onClick={() => {
                  setFlashcardIndex((flashcardIndex + 1) % flashcards.length);
                  setFlashcardFlipped(false);
                }}
              >
                Next Card
              </Button>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div
      className="rounded-3xl p-8 md:p-12 relative overflow-hidden"
      style={{ background: "var(--gradient-brand)" }}
    >
      <motion.div
        className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-2xl text-primary-foreground mb-10">
        <p className="text-sm font-medium opacity-80 mb-3">AI Toolkit</p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-white">
          Every action, supercharged by AI.
        </h2>
        <p className="mt-4 opacity-85 text-lg text-white/90">
          A growing suite of one-click utilities, available inside every course. Click any tool
          below to simulate it live.
        </p>
      </div>

      {/* TWO COLUMN INTERACTIVE INTERFACE */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* TOOL SELECTOR */}
        <StaggerGroup className="lg:col-span-5 grid grid-cols-1 gap-2.5" stagger={0.05}>
          {aiTools.map((t) => (
            <StaggerItem key={t.id}>
              <button
                onClick={() => {
                  setSelectedTool(t.id);
                  setDemoStep("idle");
                  setDemoText("");
                  setFlashcardFlipped(false);
                  setFlashcardIndex(0);
                  setSelectedAnswers({});
                }}
                className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedTool === t.id
                    ? "bg-background text-foreground border-transparent shadow-lg scale-[1.01]"
                    : "bg-white/10 border-white/10 text-primary-foreground hover:bg-white/15"
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg shrink-0 ${selectedTool === t.id ? "bg-primary/10 text-primary" : "bg-white/10 text-white"}`}
                >
                  <t.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm leading-none">{t.label}</h4>
                  <p
                    className={`text-xs mt-1.5 leading-relaxed ${selectedTool === t.id ? "text-muted-foreground" : "opacity-80"}`}
                  >
                    {t.desc}
                  </p>
                </div>
              </button>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* INTERACTIVE DEMO CONTAINER */}
        <div className="lg:col-span-7 bg-background/95 border border-border shadow-2xl rounded-2xl p-6 min-h-[360px] flex flex-col justify-between transition-all duration-300">
          {renderInteractiveDemo()}
        </div>
      </div>
    </div>
  );
}
