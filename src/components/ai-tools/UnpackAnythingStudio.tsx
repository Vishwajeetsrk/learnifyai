import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Upload,
  FileText,
  FileCode,
  FileSpreadsheet,
  Film,
  Image as ImageIcon,
  ListPlus,
  Monitor,
  Smartphone,
  Sliders,
  Play,
  RotateCcw,
  ExternalLink,
  Bot,
  Chrome,
  Terminal,
  Code2,
  Check,
  Copy,
  X,
  Share2,
  Download,
  BookOpen,
  Volume2,
  Maximize2,
  Eye,
  ArrowRight,
  Send,
  Loader2,
  MessageSquare,
  HelpCircle,
  File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ScrimbaWorkspace } from "@/components/courses/ScrimbaWorkspace";

// ─── 7 Persona Configurations ───────────────────────────────────────────────
export type TeachingPersona =
  | "explain"
  | "standard"
  | "per"
  | "tom"
  | "lol"
  | "professor"
  | "tldr";

export interface PersonaOption {
  id: TeachingPersona;
  label: string;
  desc: string;
  voiceStyle: string;
  color: string;
}

export const PERSONA_OPTIONS: PersonaOption[] = [
  {
    id: "explain",
    label: "Explain",
    desc: "Simple words, small steps",
    voiceStyle: "Gentle, accessible, beginner-friendly",
    color: "from-sky-500 to-blue-600",
  },
  {
    id: "standard",
    label: "Standard",
    desc: "Clear, well-rounded teaching",
    voiceStyle: "Structured, balanced, authoritative",
    color: "from-indigo-500 to-purple-600",
  },
  {
    id: "per",
    label: "Per",
    desc: "Plain language, concrete examples",
    voiceStyle: "Conversational, practical, pragmatic",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "tom",
    label: "Tom",
    desc: "Tom Chant, in his own voice",
    voiceStyle: "Warm British cadence, energetic, motivating",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "lol",
    label: "LOL",
    desc: "Funny and sarcastic, still accurate",
    voiceStyle: "Witty, punchy humor, memorable analogies",
    color: "from-rose-500 to-pink-600",
  },
  {
    id: "professor",
    label: "Professor",
    desc: "Maximum depth, down to the bytes",
    voiceStyle: "Deep computer science theory, memory, complexity",
    color: "from-violet-600 to-indigo-800",
  },
  {
    id: "tldr",
    label: "TLDR",
    desc: "A few slides, straight to the point",
    voiceStyle: "Rapid summary, key takeaways, zero fluff",
    color: "from-zinc-500 to-slate-700",
  },
];

export type SizeFormat = "desktop" | "mobile" | "custom";

export interface UploadedFile {
  name: string;
  size: string;
  type: "pdf" | "word" | "video" | "image" | "code";
}

// Preset Prompts for instant exploration
const PRESET_TOPICS = [
  {
    title: "React 19 useEffect & State",
    prompt: "How does React useState and useEffect work? Build an interactive countdown timer with state reset.",
    lang: "javascript",
  },
  {
    title: "Binary Search Visualizer",
    prompt: "Explain Binary Search with step-by-step array inspection and visual low/mid/high pointers.",
    lang: "javascript",
  },
  {
    title: "CSS Flexbox vs Grid",
    prompt: "Explain CSS Flexbox vs Grid with an interactive playground where I can toggle flex-direction and grid-template-columns.",
    lang: "html",
  },
  {
    title: "JavaScript Async/Await",
    prompt: "Explain Promises and Async/Await in JavaScript with simulated API network delay and live console.",
    lang: "javascript",
  },
];

export function UnpackAnythingStudio() {
  const [prompt, setPrompt] = useState("");
  const [selectedPersona, setSelectedPersona] = useState<TeachingPersona>("tom");
  const [sizeFormat, setSizeFormat] = useState<SizeFormat>("custom");
  const [isPlaylistMode, setIsPlaylistMode] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Active Generated Video Session
  const [activeExplainer, setActiveExplainer] = useState<{
    title: string;
    topic: string;
    persona: TeachingPersona;
    sizeFormat: SizeFormat;
    code?: string;
    lang?: string;
  } | null>({
    title: "Let's Make a Cake! (Interactive Cake Scrimba)",
    topic: "Fullstack Introduction & CSS Animations",
    persona: "tom",
    sizeFormat: "custom",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: UploadedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      let type: UploadedFile["type"] = "pdf";
      const name = f.name.toLowerCase();
      if (name.endsWith(".pdf")) type = "pdf";
      else if (name.endsWith(".doc") || name.endsWith(".docx")) type = "word";
      else if (name.endsWith(".mp4") || name.endsWith(".mov") || name.endsWith(".webm")) type = "video";
      else if (name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".webp") || name.endsWith(".svg")) type = "image";
      else type = "code";

      const sizeStr = f.size > 1024 * 1024
        ? `${(f.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(f.size / 1024)} KB`;

      newFiles.push({ name: f.name, size: sizeStr, type });
    }

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    toast.success(`Attached ${newFiles.length} file(s) for unpack context!`);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = () => {
    if (!prompt.trim() && uploadedFiles.length === 0) {
      toast.error("Please enter a question or attach a file to unpack!");
      return;
    }

    setIsGenerating(true);
    setGenerationStep("Deconstructing concept into micro-steps...");

    setTimeout(() => {
      setGenerationStep(`Applying ${selectedPersona.toUpperCase()} voice & narrative pacing...`);
    }, 900);

    setTimeout(() => {
      setGenerationStep("Generating synchronized code and live browser sandbox...");
    }, 1800);

    setTimeout(() => {
      setGenerationStep("Compiling timeline checkpoints & practice forks...");
    }, 2600);

    setTimeout(() => {
      const chosenTitle = prompt.trim()
        ? prompt.trim().slice(0, 60) + (prompt.length > 60 ? "..." : "")
        : uploadedFiles[0]?.name
        ? `Explaining ${uploadedFiles[0].name}`
        : "Interactive Scrimba Explainer";

      setActiveExplainer({
        title: chosenTitle,
        topic: prompt.trim() || "Multi-document explainer",
        persona: selectedPersona,
        sizeFormat,
      });

      setIsGenerating(false);
      setGenerationStep("");
      toast.success("✨ Scrimba Explainer generated! Code and live preview are now active.");
    }, 3200);
  };

  const copyApiSnippet = () => {
    const snippet = `POST /api/v1/explainers\nContent-Type: application/json\n\n{\n  "prompt": "${prompt || "Explain this code"}",\n  "persona": "${selectedPersona}",\n  "format": "${sizeFormat}"\n}`;
    navigator.clipboard.writeText(snippet);
    setCopiedLink(true);
    toast.success("API Request payload copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* ─── Hero Creation Card ─── */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/10 via-card to-card p-6 sm:p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Badge & Title */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Explainer Engine · Scrimba Split</span>
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-foreground">
              Unpack anything
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
              Type a question and get an explainer video back in Scrimba Split (Watch &amp; Code) format. Share it with the community to help others learn.
            </p>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" /> Quick Topics:
            </span>
            {PRESET_TOPICS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(p.prompt)}
                className="text-xs px-2.5 py-1 rounded-lg border border-border/80 bg-background/80 hover:bg-primary/10 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              >
                {p.title}
              </button>
            ))}
          </div>

          {/* Main Prompt Input Box */}
          <div className="space-y-3">
            <div className="relative rounded-2xl border-2 border-border/80 bg-background/90 focus-within:border-primary transition-all shadow-inner">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type any question or concept (e.g. 'How does React useEffect work?', 'Explain Binary Search with interactive code', 'Build a REST API with Node.js', 'What is CSS Flexbox vs Grid?')..."
                className="w-full resize-none border-0 bg-transparent p-4 sm:p-5 text-sm sm:text-base focus-visible:ring-0 focus-visible:outline-none min-h-[110px]"
              />

              {/* Uploaded File Chips */}
              {uploadedFiles.length > 0 && (
                <div className="px-4 pb-3 flex flex-wrap gap-2">
                  {uploadedFiles.map((f, i) => (
                    <div
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-xs font-mono border border-border"
                    >
                      {f.type === "pdf" && <FileText className="h-3.5 w-3.5 text-red-400" />}
                      {f.type === "word" && <File className="h-3.5 w-3.5 text-blue-400" />}
                      {f.type === "video" && <Film className="h-3.5 w-3.5 text-emerald-400" />}
                      {f.type === "image" && <ImageIcon className="h-3.5 w-3.5 text-amber-400" />}
                      {f.type === "code" && <FileCode className="h-3.5 w-3.5 text-sky-400" />}
                      <span className="max-w-[160px] truncate">{f.name}</span>
                      <span className="text-[10px] text-muted-foreground">({f.size})</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-muted-foreground hover:text-red-400 ml-1 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Toolbar Inside Prompt Box */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 border-t border-border/50 bg-muted/20">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    accept=".pdf,.doc,.docx,.mp4,.mov,.webm,.png,.jpg,.jpeg,.webp,.svg,.txt,.js,.jsx,.ts,.tsx,.py,.html,.css,.json"
                    className="hidden"
                    id="unpack-file-input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 text-xs gap-1.5 border-border hover:bg-muted font-medium cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5 text-primary" />
                    <span>Upload [PDF, Word, Video, Image]</span>
                  </Button>

                  {/* Playlist Icon Button */}
                  <Button
                    type="button"
                    variant={isPlaylistMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setIsPlaylistMode(!isPlaylistMode);
                      toast.info(
                        !isPlaylistMode
                          ? "Playlist Mode Active: Will generate a multi-chapter lesson series!"
                          : "Single Lesson Explainer Mode."
                      );
                    }}
                    className={cn(
                      "h-8 text-xs gap-1.5 transition-all cursor-pointer",
                      isPlaylistMode && "bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-bold"
                    )}
                    title="Create full playlist with all topics"
                  >
                    <ListPlus className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Create Full Playlist</span>
                  </Button>
                </div>

                {/* Size Format Buttons */}
                <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/60">
                  <span className="text-[10px] font-bold text-muted-foreground px-2 uppercase tracking-wider">
                    Format:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSizeFormat("desktop")}
                    className={cn(
                      "px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition cursor-pointer",
                      sizeFormat === "desktop"
                        ? "bg-background text-foreground shadow-sm font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Monitor className="h-3 w-3" /> Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setSizeFormat("mobile")}
                    className={cn(
                      "px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition cursor-pointer",
                      sizeFormat === "mobile"
                        ? "bg-background text-foreground shadow-sm font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Smartphone className="h-3 w-3" /> Mobile
                  </button>
                  <button
                    type="button"
                    onClick={() => setSizeFormat("custom")}
                    className={cn(
                      "px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition cursor-pointer",
                      sizeFormat === "custom"
                        ? "bg-background text-foreground shadow-sm font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Sliders className="h-3 w-3" /> Split (Watch &amp; Code)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Persona Switchers: 7 Distinct Personas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Volume2 className="h-3.5 w-3.5 text-primary" /> Teaching Persona &amp; Voice Style:
              </span>
              <span className="text-[11px] text-muted-foreground italic">
                {PERSONA_OPTIONS.find((p) => p.id === selectedPersona)?.desc}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {PERSONA_OPTIONS.map((p) => {
                const isSelected = selectedPersona === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPersona(p.id)}
                    className={cn(
                      "p-2.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/40 font-semibold text-foreground"
                        : "border-border/60 bg-card hover:border-border hover:bg-muted/40 text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold font-display text-foreground">{p.label}</span>
                      {isSelected && <Check className="h-3 w-3 text-primary shrink-0" />}
                    </div>
                    <p className="text-[10px] leading-tight text-muted-foreground truncate">{p.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Full Scrimba Split output with editable code, speech narration &amp; live runner</span>
            </div>

            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-gradient-to-r from-indigo-600 via-primary to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-sm shadow-xl px-8 h-12 transition-all hover:scale-[1.02] cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span>{generationStep || "Generating Scrimba Explainer..."}</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2 fill-white" />
                  <span>Generate Scrimba Explainer</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Active Scrimba Explainer Player ─── */}
      {activeExplainer && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 px-1">
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-xl font-bold font-display tracking-tight text-foreground">
                {activeExplainer.title}
              </h3>
              <Badge variant="outline" className="border-sky-500/30 text-sky-400 bg-sky-500/10 text-xs">
                Persona: {activeExplainer.persona.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {activeExplainer.sizeFormat === "mobile" ? "Mobile Viewport" : "Split Watch & Code"}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.success("Community link copied! Anyone can fork and learn.");
                }}
                className="h-8 text-xs gap-1.5 cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share Explainer</span>
              </Button>
            </div>
          </div>

          {/* The Live Interactive Scrimba Workspace */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e111a] overflow-hidden shadow-2xl">
            <ScrimbaWorkspace
              courseTitle="AI Suite Explainer"
              lessonTitle={activeExplainer.title}
              instructorName={
                activeExplainer.persona === "tom"
                  ? "Tom Chant"
                  : activeExplainer.persona === "professor"
                  ? "Prof. Alan Turing"
                  : "Learnify AI Tutor"
              }
              injectedCode={activeExplainer.code}
              injectedLang={activeExplainer.lang || "html"}
              isStandAlonePlayer={true}
            />
          </div>
        </div>
      )}

      {/* ─── 4 Ecosystem Integration Showcase Cards (Exact Specs) ─── */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-primary" />
          <h3 className="font-display font-bold text-lg text-foreground">
            Connect Everywhere · The Explainer Ecosystem
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. ChatGPT Plugin */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px]">
                  ChatGPT Plugin
                </Badge>
              </div>

              <div>
                <h4 className="font-bold text-sm text-foreground">Ask @Explain anything</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Use the plugin on ChatGPT and the answer arrives as a video, not text.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs font-mono space-y-1.5">
                <div className="text-slate-400">@Explain what is SEO for beginners?</div>
                <div className="text-emerald-500 font-semibold flex items-center gap-1">
                  <Check className="h-3 w-3" /> Sure! Here&apos;s a clear explanation (Video attached)
                </div>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full text-xs font-semibold border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-500"
            >
              <a href="https://chatgpt.com/plugins/explain?open_in_app" target="_blank" rel="noopener noreferrer">
                Open ChatGPT Plugin <ExternalLink className="h-3 w-3 ml-1.5" />
              </a>
            </Button>
          </div>

          {/* 2. Chrome Extension */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 hover:border-sky-500/40 transition-all flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-500 flex items-center justify-center">
                  <Chrome className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="border-sky-500/30 text-sky-600 dark:text-sky-400 text-[10px]">
                  Chrome Extension
                </Badge>
              </div>

              <div>
                <h4 className="font-bold text-sm text-foreground">Explain any webpage</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Turn any long article or webpage you visit into an interactive video summary.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs font-mono space-y-1.5">
                <div className="text-slate-400 truncate">dev.to/why-signals-are-fast</div>
                <div className="text-sky-400 font-semibold flex items-center gap-1">
                  <Play className="h-3 w-3" /> Explain this page
                </div>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full text-xs font-semibold border-sky-500/30 hover:bg-sky-500/10 hover:text-sky-400"
            >
              <a href="https://chromewebstore.google.com/detail/explain-by-" target="_blank" rel="noopener noreferrer">
                Install Extension <ExternalLink className="h-3 w-3 ml-1.5" />
              </a>
            </Button>
          </div>

          {/* 3. Claude + MCP */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 hover:border-purple-500/40 transition-all flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center">
                  <Terminal className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="border-purple-500/30 text-purple-600 dark:text-purple-400 text-[10px]">
                  Claude + MCP
                </Badge>
              </div>

              <div>
                <h4 className="font-bold text-sm text-foreground">Explain your codebase</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Create videos of your codebase or PR, right from Claude or Codex.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 text-[11px] font-mono space-y-1">
                <div className="flex items-center gap-1 text-slate-400">
                  <FileCode className="h-3 w-3 text-purple-400" />
                  <span>src/components/parser.ts</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <FileCode className="h-3 w-3 text-yellow-400" />
                  <span>index.ts</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <FileText className="h-3 w-3 text-sky-400" />
                  <span>README.md</span>
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(`{"mcpServers": {"explain-codebase": {"command": "npx", "args": ["-y", "@learnifyai/mcp-explainer"]}}}`);
                toast.success("Claude MCP config copied to clipboard!");
              }}
              className="w-full text-xs font-semibold border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-400 cursor-pointer"
            >
              <Copy className="h-3 w-3 mr-1.5" />
              Copy Claude MCP Config
            </Button>
          </div>

          {/* 4. Developer API */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                  <Code2 className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px]">
                  REST API
                </Badge>
              </div>

              <div>
                <h4 className="font-bold text-sm text-foreground">Add explainers to your app</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Create and embed explainer videos from your own server.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#090C15] border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                <div className="text-amber-400 font-bold">POST /api/v1/explainers</div>
                <div className="text-slate-400">prompt: &quot;Explain this Q3 report&quot;</div>
                <div className="text-slate-400">file: q3-report.pdf</div>
                <div className="text-emerald-400 font-semibold pt-1 border-t border-slate-800 flex items-center gap-1">
                  <span>↓ Q3 report, explained</span>
                  <span className="text-[10px] text-slate-500">3:12</span>
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyApiSnippet}
              className="w-full text-xs font-semibold border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500 cursor-pointer"
            >
              {copiedLink ? <Check className="h-3 w-3 mr-1.5 text-emerald-400" /> : <Copy className="h-3 w-3 mr-1.5" />}
              {copiedLink ? "Copied!" : "Copy API Request"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
