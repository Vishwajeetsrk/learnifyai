import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Code2,
  Layout,
  Maximize2,
  Monitor,
  Box,
  BookOpen,
  Flame,
  Star,
  CheckCircle2,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import confetti from "canvas-confetti";
import projectsData from "@/data/projects.json";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/studio/$projectId")({
  component: StudioClassroomPage,
});

function StudioClassroomPage() {
  const { projectId } = Route.useParams();
  const { data: dbProject, isLoading } = useQuery({
    queryKey: ["design-project", projectId],
    queryFn: async () => {
      try {
        // 1. Check design_projects
        const { data: dp } = await supabase
          .from("design_projects")
          .select("*")
          .eq("id", projectId)
          .maybeSingle();
        if (dp) return dp;

        // 2. Check courses by ID
        const { data: courseData } = await supabase
          .from("courses")
          .select("*")
          .eq("id", projectId)
          .maybeSingle();
        if (courseData) {
          return {
            id: courseData.id,
            title: courseData.title,
            description: courseData.description || "Interactive AI Course Workspace",
            category: courseData.category || "Full-Stack Development",
            course_modules: [],
            architecture_nodes: [],
          };
        }

        // 3. Check courses by slug
        const { data: courseBySlug } = await supabase
          .from("courses")
          .select("*")
          .eq("slug", projectId)
          .maybeSingle();
        if (courseBySlug) {
          return {
            id: courseBySlug.id,
            title: courseBySlug.title,
            description: courseBySlug.description || "Interactive AI Course Workspace",
            category: courseBySlug.category || "Full-Stack Development",
            course_modules: [],
            architecture_nodes: [],
          };
        }

        // 4. Fallback to static JSON or default project object
        return (
          projectsData.find((p) => p.id === projectId || (p as any).slug === projectId) || {
            id: projectId,
            title: "Interactive Course Studio",
            description: "Master project concepts in this interactive classroom.",
            category: "Full-Stack Development",
            course_modules: [],
            architecture_nodes: [],
          }
        );
      } catch {
        return (
          projectsData.find((p) => p.id === projectId) || {
            id: projectId,
            title: "Interactive Course Studio",
            description: "Master project concepts in this interactive classroom.",
            category: "Full-Stack Development",
            course_modules: [],
            architecture_nodes: [],
          }
        );
      }
    },
  });

  const project = dbProject as any;

  const rawModules = project?.course_modules || [];
  const modules =
    rawModules.length > 0
      ? rawModules
      : [
          {
            step: 1,
            title: "Project Setup & Environment",
            text: "Initialize a Vite + React + TypeScript workspace. Set up Tailwind CSS.",
            voice_script:
              "Welcome! Let's start by setting up our project environment and installing dependencies.",
            code_snippet: "// Project initialization complete\n// Run npm install to proceed",
            quiz: {
              question: "Which bundler are we using?",
              options: ["Webpack", "Vite", "Rollup", "Parcel"],
              correct: 1,
            },
          },
          {
            step: 2,
            title: "UI Architecture & Layout",
            text: "Structure the main components. Build the navigation and responsive grid layouts.",
            voice_script:
              "Now, let's architect the layout. We will use Tailwind CSS grid classes to structure the UI.",
            code_snippet:
              'export default function Layout() {\n  return (\n    <div className="grid grid-cols-12">\n      {/* Main layout */}\n    </div>\n  );\n}',
            quiz: {
              question: "Which CSS framework is used?",
              options: ["Bootstrap", "Material UI", "Tailwind CSS", "Chakra UI"],
              correct: 2,
            },
          },
          {
            step: 3,
            title: "Implementing Core Features",
            text: `Develop the core functionality: ${project?.description?.substring(0, 60) || project?.title}...`,
            voice_script:
              "Time to build the main functionality. Follow the steps in the editor to integrate the components.",
            code_snippet:
              "// Core functionality integration\nfunction CoreFeature() {\n  // Implementation here\n}",
            quiz: {
              question: "What is the primary goal of this step?",
              options: ["Styling", "Core Logic", "Deployment", "Testing"],
              correct: 1,
            },
          },
          {
            step: 4,
            title: "Animations & Polish",
            text: "Add smooth transitions, hover effects, and animations to bring the template to life.",
            voice_script:
              "Finally, let's polish the UI with animations and transitions to make it look cinematic.",
            code_snippet:
              '// Animation configuration\nconst spring = {\n  type: "spring",\n  stiffness: 700,\n  damping: 30\n};',
            quiz: {
              question: "Why do we add animations?",
              options: [
                "To slow down the app",
                "To improve UX and polish",
                "To save data",
                "To fix bugs",
              ],
              correct: 1,
            },
          },
        ];

  const rawNodes = project?.architecture_nodes || [];
  const architectureNodes =
    rawNodes.length > 0
      ? rawNodes
      : [
          {
            id: "root",
            label: "<main className='relative overflow-hidden'>",
            type: "container",
            children: [
              {
                id: "hero-bg",
                label: "<HeroBackground />",
                type: "media",
                children: [],
              },
              {
                id: "navbar",
                label: "<Navigation />",
                type: "component",
                children: [],
              },
              {
                id: "content-grid",
                label: "<ContentGrid />",
                type: "component",
                children: [
                  {
                    id: "feature-card",
                    label: "<FeatureCard />",
                    type: "component",
                    children: [],
                  },
                ],
              },
            ],
          },
        ];

  const [activeStep, setActiveStep] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) return <div className="p-8">Course not found</div>;

  const [sidebarMode, setSidebarMode] = useState<"curriculum" | "architecture">("curriculum");
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [editorCode, setEditorCode] = useState("");
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Gamification State
  const [xp, setXp] = useState(1250);
  const [streak, setStreak] = useState(12);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showXPPopup, setShowXPPopup] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (modules[activeStep]) {
      setEditorCode(modules[activeStep].code_snippet || "// Write code here...");
      setSelectedAnswer(null); // Reset quiz answer for new step
      // Stop speech when changing steps
      if (synthRef.current) {
        synthRef.current.cancel();
        setIsPlayingVoice(false);
      }
    }
  }, [activeStep, modules]);

  const handleQuizAnswer = (index: number, correctIndex: number) => {
    if (selectedAnswer !== null) return; // Already answered
    setSelectedAnswer(index);
    if (index === correctIndex) {
      // Correct!
      setXp((prev) => prev + 50);
      setShowXPPopup(true);
      if (!completedSteps.includes(activeStep)) {
        setCompletedSteps((prev) => [...prev, activeStep]);
      }
      setTimeout(() => setShowXPPopup(false), 2000);

      // Check if course is complete
      if (activeStep === modules.length - 1 && !completedSteps.includes(activeStep)) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"],
        });
      }
    }
  };

  const toggleVoice = () => {
    if (!synthRef.current) return;

    if (isPlayingVoice) {
      synthRef.current.cancel();
      setIsPlayingVoice(false);
    } else {
      const script = modules[activeStep]?.voice_script;
      if (script) {
        const utterance = new SpeechSynthesisUtterance(script);
        utterance.rate = 0.9; // Slightly slower for tutorial
        utterance.pitch = 1;
        utterance.onend = () => setIsPlayingVoice(false);
        synthRef.current.speak(utterance);
        setIsPlayingVoice(true);
      }
    }
  };

  if (!project) return <div className="p-8">Course not found</div>;

  const currentModule = modules[activeStep];
  const isStepCompleted = completedSteps.includes(activeStep) || !currentModule?.quiz;

  return (
    <div className="h-screen w-full bg-background flex flex-col font-sans overflow-hidden relative">
      {/* Floating XP Popup */}
      <AnimatePresence>
        {showXPPopup && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: -50, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute left-[150px] top-[40%] z-50 bg-green-500/10 text-green-500 border border-green-500/20 px-4 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)] flex items-center gap-2"
          >
            <Star className="h-4 w-4 fill-green-500" />
            +50 XP
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link
            to="/course/$projectId"
            params={{ projectId: project.id }}
            className="p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-md bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
              <Monitor className="h-3.5 w-3.5" />
            </div>
            <h1 className="font-display font-semibold text-sm">{project.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 mr-4">
            <div className="flex items-center gap-1.5 bg-accent px-3 py-1.5 rounded-full border border-border">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-xs font-bold">{streak} Day Streak</span>
            </div>
            <div className="flex items-center gap-1.5 bg-accent px-3 py-1.5 rounded-full border border-border">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold">{xp} XP</span>
            </div>
          </div>
          <div className="text-xs font-medium text-muted-foreground bg-accent px-3 py-1.5 rounded-full border border-border">
            Step {activeStep + 1} of {modules.length || 1}
          </div>
        </div>
      </header>

      {/* Main Studio Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile FAB to open curriculum */}
        <div className="lg:hidden absolute bottom-4 right-4 z-20">
          <Button
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-full shadow-2xl h-14 w-14 p-0"
          >
            <BookOpen className="h-6 w-6" />
          </Button>
        </div>

        {/* Left Sidebar: Curriculum & Instructions */}
        <aside
          className={cn(
            "bg-card flex flex-col shrink-0 border-border z-40 transition-transform duration-300",
            "fixed inset-x-0 bottom-0 h-[85vh] rounded-t-3xl border-t shadow-[0_-10px_40px_rgba(0,0,0,0.5)] lg:static lg:h-auto lg:w-80 lg:rounded-none lg:border-r lg:border-t-0 lg:shadow-none lg:translate-y-0",
            isMobileMenuOpen ? "translate-y-0" : "translate-y-full",
          )}
        >
          {/* Mobile Drag Handle */}
          <div
            className="flex lg:hidden justify-center pt-3 pb-2 w-full cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="w-12 h-1.5 bg-muted rounded-full" />
          </div>

          {/* Sidebar Toggle Header */}
          <div className="flex items-center p-2 border-b border-border bg-muted/20">
            <div className="flex bg-accent/50 p-1 rounded-xl w-full">
              <button
                onClick={() => setSidebarMode("curriculum")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${sidebarMode === "curriculum" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <BookOpen className="h-3.5 w-3.5" /> Curriculum
              </button>
              <button
                onClick={() => setSidebarMode("architecture")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${sidebarMode === "architecture" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Box className="h-3.5 w-3.5" /> Blueprint
              </button>
            </div>
          </div>

          {sidebarMode === "curriculum" ? (
            <>
              {/* Progress / Step Nav */}
              <div className="p-4 border-b border-border space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                    disabled={activeStep === 0}
                    className="p-1.5 rounded-lg bg-accent text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/80 transition"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-xs font-semibold text-muted-foreground">
                    MODULE {activeStep + 1}
                  </span>
                  <button
                    onClick={() => setActiveStep((prev) => Math.min(modules.length - 1, prev + 1))}
                    disabled={
                      activeStep === modules.length - 1 || (!isStepCompleted && currentModule?.quiz)
                    }
                    className="p-1.5 rounded-lg bg-accent text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/80 transition"
                    title={
                      !isStepCompleted && currentModule?.quiz
                        ? "Complete the quiz to unlock the next step!"
                        : "Next Step"
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-accent rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((activeStep + 1) / Math.max(1, modules.length)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Lesson Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {currentModule ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h2 className="text-lg font-display font-semibold leading-snug">
                        {currentModule.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {currentModule.text}
                      </p>

                      {/* Voice Player */}
                      {currentModule.voice_script && (
                        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-4 mt-6">
                          <button
                            onClick={toggleVoice}
                            className="shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-all shadow-glow"
                          >
                            {isPlayingVoice ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4 ml-0.5" />
                            )}
                          </button>
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-primary">
                              Listen to the Breakdown
                            </p>
                            <p className="text-[11px] text-muted-foreground italic leading-tight">
                              "{currentModule.voice_script.substring(0, 60)}..."
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Quiz Knowledge Check */}
                      {currentModule.quiz && (
                        <div className="mt-8 bg-card border border-border rounded-xl p-5 shadow-sm">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="bg-primary/20 p-1.5 rounded-md">
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className="text-sm font-semibold">Knowledge Check</h3>
                          </div>
                          <p className="text-sm text-foreground mb-4">
                            {currentModule.quiz.question}
                          </p>
                          <div className="space-y-2">
                            {currentModule.quiz.options.map((option: string, index: number) => {
                              const isSelected = selectedAnswer === index;
                              const isCorrect = index === currentModule.quiz.correct_index;
                              const showCorrect = selectedAnswer !== null && isCorrect;
                              const showWrong = isSelected && !isCorrect;

                              return (
                                <button
                                  key={index}
                                  onClick={() =>
                                    handleQuizAnswer(index, currentModule.quiz.correct_index)
                                  }
                                  disabled={selectedAnswer !== null}
                                  className={`w-full text-left p-3 rounded-lg border text-sm transition-all flex items-center justify-between ${
                                    showCorrect
                                      ? "border-green-500/50 bg-green-500/10 text-green-700"
                                      : showWrong
                                        ? "border-red-500/50 bg-red-500/10 text-red-700"
                                        : "border-border hover:border-primary/50 hover:bg-accent"
                                  }`}
                                >
                                  <span>{option}</span>
                                  {showCorrect && (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          {selectedAnswer !== null && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-4 text-xs text-muted-foreground bg-accent/50 p-3 rounded-lg"
                            >
                              <span className="font-semibold text-foreground">Explanation:</span>{" "}
                              {currentModule.quiz.explanation}
                            </motion.div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <div className="text-sm text-muted-foreground italic">
                    No content available for this step.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto bg-black/40">
              {/* @ts-ignore */}
              <ArchitectureGraph nodes={architectureNodes} />
            </div>
          )}
        </aside>

        {/* Right Area: Split Code & Preview */}
        <div className="flex-1 flex flex-col lg:flex-row bg-black/5">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col border-r border-border border-b lg:border-b-0 min-h-[300px]">
            <div className="h-10 bg-card border-b border-border flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Code2 className="h-3.5 w-3.5" /> Code Sandbox
              </div>
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
              </div>
            </div>
            <div className="flex-1 bg-[#1e1e1e] relative">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={editorCode}
                onChange={(value) => setEditorCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: "JetBrains Mono, monospace",
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  renderLineHighlight: "all",
                  wordWrap: "on",
                  scrollbar: { alwaysConsumeMouseWheel: false },
                }}
              />
            </div>
          </div>

          {/* Live Preview */}
          <div className="flex-1 flex flex-col relative min-h-[300px]">
            <div className="h-10 bg-card border-b border-border flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Layout className="h-3.5 w-3.5" /> Live Render
              </div>
              <button className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent">
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex-1 bg-white relative overflow-hidden">
              {/* We use an iframe pointing to the preset site */}
              {/* In a real integrated environment, this might be a Sandpack preview */}
              <iframe
                src={project.path}
                className="w-full h-full border-0"
                title="Live Preview"
                sandbox="allow-scripts allow-same-origin"
              />

              {/* Placeholder Overlay to simulate interactive linking between code & iframe */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white text-[10px] px-2 py-1 rounded border border-white/10 pointer-events-none">
                Sync Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArchitectureGraph({ nodes }: { nodes: any[] }) {
  if (!nodes || nodes.length === 0)
    return (
      <div className="p-6 text-sm text-muted-foreground text-center">
        No architecture data available for this project.
      </div>
    );

  const renderNode = (node: any, depth = 0) => {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: depth * 0.1 }}
        key={node.id}
        className="flex flex-col relative"
      >
        <div className="flex items-center gap-2 py-2" style={{ paddingLeft: depth * 16 }}>
          {/* Connecting line segment for nested children (visual only, handled by parent's before pseudo-element usually, but we can keep it simple here) */}
          <div className="h-6 w-6 rounded-md bg-accent/80 flex items-center justify-center shrink-0 border border-border/50 text-muted-foreground shadow-sm z-10">
            {node.type === "container" ? (
              <Layout className="h-3 w-3" />
            ) : node.type === "media" ? (
              <Play className="h-3 w-3" />
            ) : node.type === "animation" ? (
              <Code2 className="h-3 w-3" />
            ) : (
              <Box className="h-3 w-3" />
            )}
          </div>
          <div className="text-xs font-mono text-primary/80 whitespace-pre-wrap bg-background/50 px-2 py-1 rounded-md border border-border/30">
            {node.label}
          </div>
        </div>
        {node.children && node.children.length > 0 && (
          <div
            className="flex flex-col relative before:absolute before:left-[11px] before:top-0 before:bottom-0 before:w-[1px] before:bg-border/60"
            style={{ marginLeft: depth * 16 }}
          >
            {node.children.map((child: any) => renderNode(child, 1))}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="p-4 overflow-x-hidden pb-12">
      <div className="mb-4 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
        DOM Blueprint
      </div>
      <div className="bg-card/50 rounded-xl p-3 border border-border/30 shadow-inner overflow-hidden">
        {nodes.map((n) => renderNode(n, 0))}
      </div>
    </div>
  );
}
