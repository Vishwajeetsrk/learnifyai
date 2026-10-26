import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useServerFn } from "@tanstack/react-start";
import { exportProjectZip } from "@/lib/project-export.functions";
import { triggerZipDownload } from "@/lib/project-export-download";
import { toast } from "sonner";
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
  Download,
  RotateCcw,
  Terminal,
  RefreshCw,
  Smartphone,
  Tablet,
  Lock,
  ExternalLink,
  Sparkles,
  Loader2,
  Trash2,
  Check,
  Zap,
  Copy,
  CheckCheck,
  Lightbulb,
  Layers,
  FileCode,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import confetti from "canvas-confetti";
import projectsData from "@/data/projects.json";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/studio/$projectId")({
  component: StudioClassroomPage,
});

/**
 * Builds a self-contained, sandboxed HTML document that compiles and renders
 * user JSX/HTML/Tailwind code on the fly and pipes console logs to the parent.
 */
function buildSandboxHtml(code: string): string {
  const isReact =
    code.includes("export default function") ||
    code.includes("function App") ||
    code.includes("function Layout") ||
    code.includes("const App =") ||
    code.includes("import React") ||
    code.includes("useState") ||
    code.includes("useEffect") ||
    (code.includes("<") && code.includes("/>")) ||
    code.includes("className=");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: '#6366f1',
            accent: '#8b5cf6'
          }
        }
      }
    };
  </script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      min-height: 100vh;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #09090b;
      color: #f4f4f5;
    }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 9999px; }
  </style>
  <script>
    // Console output interceptor
    const sendLog = (level, args) => {
      try {
        const text = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
        window.parent.postMessage({ type: 'STUDIO_CONSOLE', level, message: text }, '*');
      } catch (e) {}
    };
    console.log = (...args) => sendLog('info', args);
    console.error = (...args) => sendLog('error', args);
    console.warn = (...args) => sendLog('warn', args);
    window.onerror = (msg, url, line) => {
      sendLog('error', ['Runtime Error [Line ' + line + ']: ' + msg]);
      return false;
    };
  </script>
</head>
<body class="bg-zinc-950 text-zinc-100 antialiased p-4 sm:p-6">
  <div id="root"></div>

  ${
    isReact
      ? `<script type="text/babel">
    const { useState, useEffect, useRef, useMemo, useCallback } = React;
    try {
      ${code.replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)/g, "function $1")}
      
      const ComponentToRender = typeof App !== 'undefined' ? App : (typeof Layout !== 'undefined' ? Layout : null);
      if (ComponentToRender) {
        ReactDOM.createRoot(document.getElementById('root')).render(<ComponentToRender />);
      } else {
        document.getElementById('root').innerHTML = '<div class="p-5 border border-indigo-500/30 rounded-2xl bg-indigo-950/20 text-sm"><p class="text-indigo-400 font-bold mb-1 flex items-center gap-1.5"><i class="fa fa-sparkles"></i> Code Sandboxed</p><p class="text-zinc-400 text-xs">Component compiled successfully. Define an <code>App()</code> or <code>Layout()</code> function to mount custom UI.</p></div>';
      }
    } catch (err) {
      console.error(err.message);
      document.getElementById('root').innerHTML = '<div class="p-4 border border-rose-500/50 rounded-xl bg-rose-950/40 text-rose-300 text-xs font-mono"><p class="font-bold mb-1 text-rose-400">Compilation Error</p><pre class="whitespace-pre-wrap">' + err.message + '</pre></div>';
    }
  </script>`
      : `<div id="content">${code}</div>`
  }
</body>
</html>`;
}

function StudioClassroomPage() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const exportZipFn = useServerFn(exportProjectZip);

  const { data: dbProject, isLoading } = useQuery({
    queryKey: ["design-project", projectId],
    queryFn: async () => {
      try {
        const { data: dp } = await supabase
          .from("design_projects")
          .select("*")
          .eq("id", projectId)
          .maybeSingle();
        if (dp) return dp;

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

  // Subscription status check for Career Pro download
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
            code_snippet: `export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-xl mx-auto rounded-2xl border border-indigo-500/30 bg-zinc-900/60 p-6 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-indigo-400">Environment Ready</h1>
        <p className="text-zinc-400 mt-2 text-sm">Vite + React workspace initialized with Tailwind CSS.</p>
        <button className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition">
          Test Button
        </button>
      </div>
    </div>
  );
}`,
            quiz: {
              question: "Which bundler provides instant Hot Module Replacement in modern web stacks?",
              options: ["Webpack", "Vite", "Rollup", "Parcel"],
              correct: 1,
              explanation: "Vite leverages native ES modules and esbuild for sub-second development server startup and instant HMR.",
            },
          },
          {
            step: 2,
            title: "UI Architecture & Layout",
            text: "Structure the main components. Build responsive navigation and grid layouts.",
            voice_script:
              "Now, let's architect the layout. We will use Tailwind CSS grid classes to structure the UI.",
            code_snippet: `export default function Layout() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <nav className="h-16 border-b border-zinc-800 px-6 flex items-center justify-between">
        <span className="font-bold text-lg tracking-wider text-indigo-400">LEARNIFY STUDIO</span>
        <div className="flex gap-4 text-sm text-zinc-400">
          <a href="#" className="hover:text-white">Templates</a>
          <a href="#" className="hover:text-white">Docs</a>
        </div>
      </nav>
      <main className="flex-1 p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">Feature 1</div>
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">Feature 2</div>
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">Feature 3</div>
      </main>
    </div>
  );
}`,
            quiz: {
              question: "Which CSS framework utility handles responsive grid layouts across breakpoints?",
              options: ["Bootstrap", "Material UI", "Tailwind CSS", "Chakra UI"],
              correct: 2,
              explanation: "Tailwind CSS provides responsive prefixes like md:grid-cols-3 for seamless multi-device adaptation.",
            },
          },
          {
            step: 3,
            title: "Implementing Core Features",
            text: `Develop the core functionality: ${project?.description?.substring(0, 60) || project?.title}...`,
            voice_script:
              "Time to build the main functionality. Follow the steps in the editor to integrate the components.",
            code_snippet: `export default function App() {
  const [count, setCount] = React.useState(0);
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="p-8 rounded-3xl border border-indigo-500/30 bg-zinc-900/80 text-center space-y-4 max-w-md w-full shadow-2xl">
        <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold">Interactive Component</span>
        <h2 className="text-3xl font-extrabold">Live Counter: {count}</h2>
        <div className="flex justify-center gap-3 pt-2">
          <button 
            onClick={() => setCount(c => c - 1)}
            className="px-5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 font-semibold text-sm transition"
          >
            - Decrease
          </button>
          <button 
            onClick={() => setCount(c => c + 1)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition"
          >
            + Increment
          </button>
        </div>
      </div>
    </div>
  );
}`,
            quiz: {
              question: "What React hook allows declaring state variables inside function components?",
              options: ["useEffect", "useState", "useRef", "useMemo"],
              correct: 1,
              explanation: "useState is the foundational React hook for storing and updating reactive component state.",
            },
          },
          {
            step: 4,
            title: "Animations & Polish",
            text: "Add smooth transitions, hover effects, and animations to bring the template to life.",
            voice_script:
              "Finally, let's polish the UI with animations and transitions to make it look cinematic.",
            code_snippet: `export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 space-y-6">
      <div className="relative group cursor-pointer">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-70 blur-xl group-hover:opacity-100 transition duration-500 animate-pulse"></div>
        <div className="relative px-8 py-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-2">
          <h3 className="text-xl font-bold">Cinematic Card</h3>
          <p className="text-xs text-zinc-400">Hover over me to witness the smooth glowing ambient light.</p>
        </div>
      </div>
    </div>
  );
}`,
            quiz: {
              question: "Why do we add micro-animations to user interfaces?",
              options: [
                "To slow down the app",
                "To improve visual hierarchy, affordance, and UX polish",
                "To consume network bandwidth",
                "To replace testing",
              ],
              correct: 1,
              explanation: "Deliberate micro-animations provide tactile feedback, reduce perceived latency, and delight users.",
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
              { id: "hero-bg", label: "<HeroBackground />", type: "media", children: [] },
              { id: "navbar", label: "<Navigation />", type: "component", children: [] },
              {
                id: "content-grid",
                label: "<ContentGrid />",
                type: "component",
                children: [
                  { id: "feature-card", label: "<FeatureCard />", type: "component", children: [] },
                ],
              },
            ],
          },
        ];

  const [activeStep, setActiveStep] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<"curriculum" | "architecture">("curriculum");
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [editorCode, setEditorCode] = useState("");
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Live execution and preview states
  const [previewMode, setPreviewMode] = useState<"sandbox" | "reference">("sandbox");
  const [autoRun, setAutoRun] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [sandboxSrcDoc, setSandboxSrcDoc] = useState("");
  const [consoleLogs, setConsoleLogs] = useState<
    Array<{ id: string; level: "info" | "warn" | "error"; text: string; time: string }>
  >([]);
  const [showConsole, setShowConsole] = useState(false);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [downloadingZip, setDownloadingZip] = useState(false);

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

  // Sync editor code with active module
  useEffect(() => {
    if (modules[activeStep]) {
      const code = modules[activeStep].code_snippet || "// Write code here...";
      setEditorCode(code);
      setSelectedAnswer(null);
      if (synthRef.current) {
        synthRef.current.cancel();
        setIsPlayingVoice(false);
      }
    }
  }, [activeStep, modules]);

  // Listen for iframe console messages
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "STUDIO_CONSOLE") {
        setConsoleLogs((prev) => [
          ...prev.slice(-49),
          {
            id: Math.random().toString(),
            level: e.data.level || "info",
            text: e.data.message || "",
            time: new Date().toLocaleTimeString(),
          },
        ]);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Execution engine: compile & run code in sandbox iframe
  const runCodeNow = useCallback(() => {
    setIsRunning(true);
    setConsoleLogs([]);
    const srcDoc = buildSandboxHtml(editorCode);
    setSandboxSrcDoc(srcDoc);
    setTimeout(() => setIsRunning(false), 250);
  }, [editorCode]);

  // Debounced Auto-run
  useEffect(() => {
    if (!autoRun) return;
    const timer = setTimeout(() => {
      runCodeNow();
    }, 600);
    return () => clearTimeout(timer);
  }, [editorCode, autoRun, runCodeNow]);

  // Keyboard shortcut: Ctrl+Enter / Cmd+Enter runs code
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runCodeNow();
        toast.success("Code executed in Live Sandbox!");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [runCodeNow]);

  const handleExportZip = async () => {
    if (!user) {
      toast.info("Please sign in to export project source code");
      navigate({ to: "/login" });
      return;
    }
    if (!hasCareerPro) {
      toast.info("Full project source code download is an exclusive Career Pro feature");
      navigate({ to: "/pricing" });
      return;
    }

    setDownloadingZip(true);
    toast.loading(`Packaging ${project?.title || projectId} archive...`, { id: "export-zip" });
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
      setDownloadingZip(false);
    }
  };

  const handleQuizAnswer = (index: number, correctIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === correctIndex) {
      setXp((prev) => prev + 50);
      setShowXPPopup(true);
      if (!completedSteps.includes(activeStep)) {
        setCompletedSteps((prev) => [...prev, activeStep]);
      }
      setTimeout(() => setShowXPPopup(false), 2000);

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

  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const toggleVoice = () => {
    if (!synthRef.current) return;
    if (isPlayingVoice) {
      synthRef.current.cancel();
      setIsPlayingVoice(false);
    } else {
      const script = modules[activeStep]?.voice_script;
      if (script) {
        const utterance = new SpeechSynthesisUtterance(script);
        utterance.rate = speechRate;
        utterance.pitch = 1;
        utterance.onend = () => setIsPlayingVoice(false);
        utterance.onerror = () => setIsPlayingVoice(false);
        synthRef.current.speak(utterance);
        setIsPlayingVoice(true);
      }
    }
  };

  const cycleSpeechRate = () => {
    const nextRate = speechRate === 0.8 ? 1.0 : speechRate === 1.0 ? 1.25 : 0.8;
    setSpeechRate(nextRate);
    toast.info(`Voice Narration Speed: ${nextRate}x`);
    if (isPlayingVoice && synthRef.current) {
      synthRef.current.cancel();
      setIsPlayingVoice(false);
    }
  };

  const handleCopySnippet = () => {
    if (!editorCode) return;
    navigator.clipboard.writeText(editorCode).then(() => {
      setCopiedSnippet(true);
      toast.success("Code snippet copied!");
      setTimeout(() => setCopiedSnippet(false), 2000);
    });
  };

  const handleFormatCode = () => {
    try {
      const lines = editorCode.split("\n");
      const cleaned = lines.map((l) => l.trimEnd()).join("\n");
      setEditorCode(cleaned);
      toast.success("Code formatting cleaned!");
    } catch {
      toast.info("Formatting preserved");
    }
  };

  const getViewportWidth = () => {
    if (viewport === "mobile") return "375px";
    if (viewport === "tablet") return "768px";
    return "100%";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
            className="absolute left-[150px] top-[40%] z-50 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-full font-bold shadow-[0_0_20px_rgba(34,197,94,0.3)] flex items-center gap-2"
          >
            <Star className="h-4 w-4 fill-emerald-500" />
            +50 XP
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className="h-14 border-b border-border/80 bg-card/90 backdrop-blur-md flex items-center justify-between px-4 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/course/$projectId"
            params={{ projectId: project.id }}
            className="p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-sm">
              <Monitor className="h-4 w-4" />
            </div>
            <h1 className="font-display font-bold text-sm text-foreground truncate max-w-[180px] sm:max-w-xs md:max-w-md">
              {project.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Download ZIP Button */}
          {hasCareerPro ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportZip}
              disabled={downloadingZip}
              className="h-8 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Download complete project template source code (Career Pro)"
            >
              {downloadingZip ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">Export ZIP</span>
            </Button>
          ) : (
            <Link
              to="/pricing"
              className="h-8 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1"
              title="Career Pro users get instant ZIP source code download"
            >
              <Lock className="h-3 w-3" />
              <span className="hidden sm:inline">Export ZIP (Pro)</span>
            </Link>
          )}

          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full border border-orange-500/30 text-xs font-bold shadow-sm">
              <Flame className="h-3.5 w-3.5 fill-orange-500" />
              <span>{streak} Day Streak</span>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-500/30 text-xs font-bold shadow-sm">
              <Star className="h-3.5 w-3.5 fill-amber-500" />
              <span>{xp} XP</span>
            </div>
          </div>
          <div className="text-xs font-bold text-foreground bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
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
            className="rounded-full shadow-2xl h-14 w-14 p-0 cursor-pointer"
          >
            <BookOpen className="h-6 w-6" />
          </Button>
        </div>

        {/* Left Sidebar: Curriculum & Instructions */}
        <aside
          className={cn(
            "bg-card flex flex-col shrink-0 border-border/80 z-40 transition-transform duration-300",
            "fixed inset-x-0 bottom-0 h-[85vh] rounded-t-3xl border-t shadow-[0_-10px_40px_rgba(0,0,0,0.5)] lg:static lg:h-auto lg:w-84 lg:rounded-none lg:border-r lg:border-t-0 lg:shadow-none lg:translate-y-0",
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
          <div className="p-3 border-b border-border/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/40 w-full">
              <button
                onClick={() => setSidebarMode("curriculum")}
                className={cn(
                  "flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                  sidebarMode === "curriculum"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <BookOpen className="h-3.5 w-3.5" />
                Curriculum
              </button>
              <button
                onClick={() => setSidebarMode("architecture")}
                className={cn(
                  "flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                  sidebarMode === "architecture"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Box className="h-3.5 w-3.5" />
                DOM Tree
              </button>
            </div>
          </div>

          {sidebarMode === "curriculum" ? (
            <>
              {/* Progress Bar & Interactive Timeline Markers */}
              <div className="px-5 py-3 border-b border-border/60 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-primary" />
                    <span>Curriculum Milestones</span>
                  </span>
                  <span className="text-foreground font-mono">
                    {Math.round(((activeStep + 1) / Math.max(1, modules.length)) * 100)}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary via-indigo-500 to-accent"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((activeStep + 1) / Math.max(1, modules.length)) * 100}%`,
                    }}
                  />
                </div>

                {/* Step Milestone Markers (Interactive Practice Markers) */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                  {modules.map((m: any, idx: number) => {
                    const isDone = completedSteps.includes(idx);
                    const isCurrent = activeStep === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveStep(idx)}
                        title={`Step ${idx + 1}: ${m.title}`}
                        className={cn(
                          "flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 cursor-pointer border",
                          isCurrent
                            ? "bg-primary text-primary-foreground border-primary shadow-xs ring-2 ring-primary/30"
                            : isDone
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-muted/40 text-muted-foreground border-border/40 hover:text-foreground hover:bg-muted",
                        )}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full bg-background/50 flex items-center justify-center text-[9px] font-bold">
                            {idx + 1}
                          </span>
                        )}
                        <span className="max-w-[75px] truncate">{m.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lesson Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {currentModule ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold">
                          Step {activeStep + 1} of {modules.length}
                        </span>
                        {completedSteps.includes(activeStep) && (
                          <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Step Mastered
                          </span>
                        )}
                      </div>

                      <h2 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                        {currentModule.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                        {currentModule.text}
                      </p>

                      {/* Voice Narration Player */}
                      {currentModule.voice_script && (
                        <div className="p-3.5 rounded-2xl border border-primary/30 bg-primary/10 flex items-center gap-3 shadow-sm">
                          <button
                            onClick={toggleVoice}
                            className={cn(
                              "shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer",
                              isPlayingVoice
                                ? "bg-primary text-primary-foreground animate-pulse"
                                : "bg-primary text-primary-foreground hover:scale-105",
                            )}
                          >
                            {isPlayingVoice ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4 ml-0.5" />
                            )}
                          </button>
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                                <Sparkles className="h-3 w-3" /> Voice Narration
                                {isPlayingVoice && (
                                  <span className="flex items-center gap-0.5 ml-1.5 h-2.5">
                                    <span className="w-0.5 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <span className="w-0.5 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <span className="w-0.5 h-2 bg-primary rounded-full animate-bounce" />
                                  </span>
                                )}
                              </p>
                              <button
                                onClick={cycleSpeechRate}
                                className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-primary/20 hover:bg-primary/30 text-primary transition-colors cursor-pointer"
                                title="Change voice narration speed"
                              >
                                {speechRate}x
                              </button>
                            </div>
                            <p className="text-[11px] text-foreground/80 italic leading-tight truncate">
                              "{currentModule.voice_script}"
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Deep Learning Concept Card */}
                      <div className="p-3.5 rounded-xl border border-border/80 bg-muted/30 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                          <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                          <span>Core Engineering Concept</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {activeStep === 0
                            ? "Establishing the core canvas, viewport coordinate spaces, and component mounting lifecycle before layering animations."
                            : activeStep === 1
                              ? "Synchronizing GPU-accelerated transforms (xPercent, scale) on compositor threads to achieve high-performance 60fps renders."
                              : activeStep === 2
                                ? "Handling reactive state changes and fluid event binding to ensure responsive, lag-free user interactivity."
                                : "Fine-tuning easing curves, physics inertia, and micro-interactions for a truly cinematic user experience."}
                        </p>
                      </div>

                      {/* Quiz Knowledge Check */}
                      {currentModule.quiz && (
                        <div className="mt-6 bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
                          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                            <div className="bg-primary/15 p-1.5 rounded-lg text-primary">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <h3 className="text-xs sm:text-sm font-bold text-foreground">
                              Knowledge Check
                            </h3>
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-foreground leading-relaxed">
                            {currentModule.quiz.question}
                          </p>
                          <div className="space-y-2">
                            {currentModule.quiz.options.map((option: string, index: number) => {
                              const correctIdx =
                                currentModule.quiz.correct_index ?? currentModule.quiz.correct ?? 0;
                              const isSelected = selectedAnswer === index;
                              const isCorrect = index === correctIdx;
                              const showCorrect = selectedAnswer !== null && isCorrect;
                              const showWrong = isSelected && !isCorrect;

                              return (
                                <button
                                  key={index}
                                  onClick={() => handleQuizAnswer(index, correctIdx)}
                                  disabled={selectedAnswer !== null}
                                  className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                                    showCorrect
                                      ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold"
                                      : showWrong
                                        ? "border-rose-500 bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold"
                                        : "border-border/80 bg-card text-foreground hover:border-primary/60 hover:bg-primary/5"
                                  }`}
                                >
                                  <span>{option}</span>
                                  {showCorrect && (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          {selectedAnswer !== null && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-3 text-xs text-foreground bg-accent/60 p-3 rounded-xl border border-border/60 font-medium"
                            >
                              <span className="font-bold text-primary">Explanation:</span>{" "}
                              {currentModule.quiz.explanation ||
                                "Correct answer! You've unlocked +50 XP and the next module."}
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

              {/* Step Navigation Bottom Bar */}
              <div className="p-3 border-t border-border/80 bg-card flex items-center justify-between gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  disabled={activeStep === 0}
                  className="text-xs h-9 cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
                </Button>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {activeStep + 1} / {modules.length}
                </span>
                <Button
                  size="sm"
                  onClick={() => setActiveStep((prev) => Math.min(modules.length - 1, prev + 1))}
                  disabled={activeStep === modules.length - 1}
                  className="text-xs h-9 cursor-pointer"
                >
                  Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
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
        <div className="flex-1 flex flex-col lg:flex-row bg-black/5 overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col border-r border-border border-b lg:border-b-0 min-h-[340px] relative">
            {/* Editor Toolbar */}
            <div className="h-10 bg-card border-b border-border flex items-center justify-between px-3 shrink-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Code2 className="h-3.5 w-3.5 text-indigo-500" />
                <span className="font-mono text-[11px]">Component Sandbox</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Copy Snippet */}
                <button
                  onClick={handleCopySnippet}
                  title="Copy snippet code"
                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedSnippet ? (
                    <CheckCheck className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span className="hidden sm:inline text-[10px]">{copiedSnippet ? "Copied" : "Copy"}</span>
                </button>

                {/* Format code */}
                <button
                  onClick={handleFormatCode}
                  title="Clean up whitespace formatting"
                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <FileCode className="h-3 w-3" />
                  <span className="hidden sm:inline text-[10px]">Format</span>
                </button>

                {/* Reset button */}
                <button
                  onClick={() => {
                    if (currentModule?.code_snippet) {
                      setEditorCode(currentModule.code_snippet);
                      toast.info("Reset code to step template");
                    }
                  }}
                  title="Reset code to original step template"
                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span className="hidden sm:inline text-[10px]">Reset</span>
                </button>

                {/* Console Toggle Button */}
                <button
                  onClick={() => setShowConsole((v) => !v)}
                  className={cn(
                    "px-2 py-1 rounded text-xs flex items-center gap-1 cursor-pointer transition-colors",
                    showConsole
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                  title="Toggle Execution Console"
                >
                  <Terminal className="h-3 w-3" />
                  <span className="text-[10px]">Logs ({consoleLogs.length})</span>
                </button>

                {/* Auto-run Toggle */}
                <button
                  onClick={() => {
                    setAutoRun((v) => !v);
                    toast.info(autoRun ? "Auto-run paused" : "Auto-run active on edit");
                  }}
                  className={cn(
                    "px-2 py-1 rounded text-[10px] font-medium border flex items-center gap-1 transition-colors cursor-pointer",
                    autoRun
                      ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                      : "bg-muted border-border text-muted-foreground",
                  )}
                  title="Toggle live re-render on code change"
                >
                  <Zap className="h-2.5 w-2.5" />
                  <span>{autoRun ? "Auto-Run: ON" : "Auto-Run: OFF"}</span>
                </button>

                {/* Run Code Button with Keyboard Shortcut Badge */}
                <Button
                  size="sm"
                  onClick={runCodeNow}
                  disabled={isRunning}
                  className="h-7 px-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title="Run code (Ctrl + Enter)"
                >
                  {isRunning ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Play className="h-3 w-3 fill-white" />
                  )}
                  <span>Run</span>
                  <kbd className="hidden md:inline text-[9px] bg-black/30 px-1 py-0.5 rounded font-mono font-normal opacity-90">
                    ⌘↵
                  </kbd>
                </Button>
              </div>
            </div>

            {/* Monaco Editor Container */}
            <div className="flex-1 bg-[#1e1e1e] relative min-h-0">
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
                  padding: { top: 14 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  renderLineHighlight: "all",
                  wordWrap: "on",
                  scrollbar: { alwaysConsumeMouseWheel: false },
                }}
              />

              {/* Collapsible Console Drawer */}
              {showConsole && (
                <div className="absolute inset-x-0 bottom-0 h-44 bg-zinc-950/95 border-t border-border flex flex-col z-20 backdrop-blur-md">
                  <div className="h-7 bg-zinc-900 border-b border-border/60 px-3 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal className="h-3 w-3 text-primary" /> Execution Console
                    </span>
                    <button
                      onClick={() => setConsoleLogs([])}
                      title="Clear console"
                      className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="h-2.5 w-2.5" /> Clear
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-1">
                    {consoleLogs.length === 0 ? (
                      <div className="text-zinc-500 text-[11px] p-2 italic">
                        No console output. Use <code>console.log()</code> in your code to inspect variables.
                      </div>
                    ) : (
                      consoleLogs.map((log) => (
                        <div
                          key={log.id}
                          className={cn(
                            "px-2 py-1 rounded text-[11px] flex items-start gap-2",
                            log.level === "error"
                              ? "bg-rose-950/40 text-rose-300 border border-rose-800/40"
                              : log.level === "warn"
                                ? "bg-amber-950/40 text-amber-300 border border-amber-800/40"
                                : "text-zinc-300",
                          )}
                        >
                          <span className="text-zinc-600 text-[9px] shrink-0 mt-0.5">
                            {log.time}
                          </span>
                          <span className="font-semibold text-[10px] uppercase shrink-0">
                            [{log.level}]
                          </span>
                          <span className="whitespace-pre-wrap break-all flex-1">{log.text}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Preview Pane */}
          <div className="flex-1 flex flex-col relative min-h-[340px] bg-background">
            {/* Preview Toolbar */}
            <div className="h-10 bg-card border-b border-border flex items-center justify-between px-3 shrink-0">
              {/* Dual View Mode Tabs */}
              <div className="flex items-center gap-1 bg-muted/70 p-0.5 rounded-lg border border-border/40">
                <button
                  onClick={() => setPreviewMode("sandbox")}
                  className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer",
                    previewMode === "sandbox"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  title="Run active editor code live"
                >
                  <Play className="h-3 w-3 fill-current" />
                  Live Sandbox Run
                </button>
                <button
                  onClick={() => setPreviewMode("reference")}
                  className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer",
                    previewMode === "reference"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  title="View full production 3D/GSAP preset template"
                >
                  <Sparkles className="h-3 w-3" />
                  Reference Prototype
                </button>
              </div>

              {/* Viewport Width Controls */}
              <div className="flex items-center gap-1">
                {(["desktop", "tablet", "mobile"] as const).map((v) => {
                  const Icon = v === "mobile" ? Smartphone : v === "tablet" ? Tablet : Monitor;
                  return (
                    <button
                      key={v}
                      onClick={() => setViewport(v)}
                      title={`${v.charAt(0).toUpperCase() + v.slice(1)} Viewport`}
                      className={cn(
                        "p-1.5 rounded-md transition-all cursor-pointer",
                        viewport === v
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      <Icon className="h-3 w-3" />
                    </button>
                  );
                })}

                <button
                  onClick={runCodeNow}
                  title="Reload Live Preview"
                  className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-accent cursor-pointer ml-1"
                >
                  <RefreshCw className={cn("h-3 w-3", isRunning && "animate-spin text-primary")} />
                </button>

                <a
                  href={project.path}
                  target="_blank"
                  rel="noreferrer"
                  title="Open reference template in full tab"
                  className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-accent cursor-pointer"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Preview Frame Body */}
            <div className="flex-1 bg-zinc-950 p-2 sm:p-4 flex items-center justify-center overflow-hidden">
              <div
                style={{
                  width: getViewportWidth(),
                  transition: "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                className="h-full rounded-2xl border border-border shadow-2xl bg-black overflow-hidden relative flex flex-col"
              >
                {/* Simulated Browser Chrome */}
                <div className="h-7 bg-zinc-900 border-b border-border/60 px-3 flex items-center gap-2 shrink-0 select-none">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-rose-500/70" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/70" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/70" />
                  </div>
                  <div className="bg-zinc-800/80 rounded px-3 py-0.5 flex-1 flex items-center justify-center gap-1.5 text-zinc-400 font-mono text-[9px] truncate">
                    <span className="text-primary font-bold">
                      {previewMode === "sandbox" ? "sandbox://localhost:3000" : `template://learnifyai.in${project.path}`}
                    </span>
                  </div>
                </div>

                {previewMode === "sandbox" ? (
                  /* Sandboxed Code Runner Iframe */
                  <iframe
                    srcDoc={sandboxSrcDoc || buildSandboxHtml(editorCode)}
                    title="Code Sandbox Live Runner"
                    className="w-full flex-1 bg-zinc-950 border-0"
                    sandbox="allow-scripts allow-modals allow-same-origin"
                  />
                ) : (
                  /* Master Preset Template Iframe */
                  <iframe
                    src={project.path}
                    className="w-full flex-1 bg-white border-0"
                    title="Live Reference Template"
                    sandbox="allow-scripts allow-same-origin allow-popups"
                  />
                )}

                {/* Status Overlay Badge */}
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full border border-white/10 pointer-events-none flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{previewMode === "sandbox" ? "Code Live Preview Active" : "Reference Preset"}</span>
                </div>
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
