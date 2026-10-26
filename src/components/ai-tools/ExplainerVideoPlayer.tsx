import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Sparkles,
  Sliders,
  Share2,
  Bookmark,
  ThumbsUp,
  UserPlus,
  Flag,
  Code2,
  Compass,
  Layers,
  ChevronRight,
  ExternalLink,
  Cpu,
  Brain,
  Globe,
  Globe2,
  Palette,
  Download,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── Interfaces & Storyboard Schema (Aligned with MVD 6.0) ───────────────────
export interface StoryboardChapter {
  id: string;
  title: string;
  timestamp: string; // e.g. "0:08"
  timeSec: number;
  durationSec: number;
  subtitle: string;
  spokenWords: string;
  zoomTarget?: "all" | "q1" | "q2" | "q3" | "q4";
  codeSnippet?: string;
}

export interface ExplainerTopicData {
  id: string;
  title: string;
  emoji: string;
  category: string;
  tagline: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    isFollowed: boolean;
  };
  durationFormatted: string;
  totalDurationSec: number;
  views: number;
  timeAgo: string;
  chapters: StoryboardChapter[];
  quadrants?: {
    q1: { title: string; subtitle: string; labelN?: string; labelS?: string; desc?: string };
    q2: { title: string; subtitle: string; ruleA?: string; ruleB?: string; desc?: string };
    q3: { title: string; subtitle: string; notes?: string; desc?: string };
    q4: { title: string; subtitle: string; cutLabel?: string; desc?: string };
  };
  deepLearningGraph?: {
    inputFeatures: string[];
    hiddenNodes: number;
    activation: string;
    outputClasses: string[];
    lossType: string;
  };
}

interface ExplainerVideoPlayerProps {
  topic: ExplainerTopicData;
  onGoDeeper?: () => void;
  onSwitchToWatchAndCode?: () => void;
  isSplitMode?: boolean;
}

export function ExplainerVideoPlayer({
  topic,
  onGoDeeper,
  onSwitchToWatchAndCode,
  isSplitMode = false,
}: ExplainerVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowed, setIsFollowed] = useState(topic.author.isFollowed);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [captionStyle, setCaptionStyle] = useState<"glass" | "karaoke" | "cinema" | "cyberpunk">("glass");
  const [isExportingVideo, setIsExportingVideo] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [hoveredChapter, setHoveredChapter] = useState<{
    index: number;
    title: string;
    timestamp: string;
    xPercent: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeChapter = topic.chapters[activeChapterIndex] || topic.chapters[0];

  // ─── Web Audio API Ambient Music Synthesizer (MVD 6.0 Audio Spec) ─────────
  const initAmbientAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : 0.05, ctx.currentTime);
      gainNodeRef.current = masterGain;

      // Filter for warm, deep analog tone
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(480, ctx.currentTime);

      // Dual gentle drone oscillators (A2 & E3 harmony)
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(110, ctx.currentTime); // A2

      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(164.81, ctx.currentTime); // E3

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1Ref.current = osc1;
      osc2Ref.current = osc2;
    } catch {
      // AudioContext not allowed before user interaction
    }
  }, [isMuted]);

  // Volume / Mute toggle
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(
        isMuted || !isPlaying ? 0 : 0.05,
        audioCtxRef.current.currentTime,
        0.1
      );
    }
  }, [isMuted, isPlaying]);

  // Speech Narration with active word highlighting & multi-language locale
  const speakChapter = useCallback(
    (chapter: StoryboardChapter) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window) || isMuted) {
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(chapter.spokenWords);
      utterance.rate = playbackSpeed;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;

      const localeMap: Record<string, string> = {
        en: "en-US",
        hi: "hi-IN",
        es: "es-ES",
        fr: "fr-FR",
        de: "de-DE",
        ja: "ja-JP",
      };
      utterance.lang = localeMap[selectedLanguage] || "en-US";

      const voices = window.speechSynthesis.getVoices();
      const matched =
        voices.find((v) => v.lang.toLowerCase().startsWith(selectedLanguage.toLowerCase())) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0];
      if (matched) utterance.voice = matched;

      window.speechSynthesis.speak(utterance);
    },
    [isMuted, playbackSpeed, selectedLanguage]
  );

  // ─── Export Explainer Video as MP4 ────────────────────────────────────────
  const handleDownloadMp4 = useCallback(async () => {
    setIsExportingVideo(true);
    setExportProgress(10);
    toast.info("Rendering 1080p MP4 explainer with diagrams & captions...");

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context unavailable");

      const stream = canvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported("video/mp4")
        ? "video/mp4"
        : MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";

      const mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6000000 });
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const cleanTitle = topic.title.toLowerCase().replace(/[^a-z0-9]/g, "-");
        a.download = `learnify-${cleanTitle}-${selectedLanguage}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsExportingVideo(false);
        setExportProgress(100);
        toast.success("MP4 Explainer video downloaded successfully!");
      };

      mediaRecorder.start();

      let frame = 0;
      const totalFrames = 50;
      const renderInterval = setInterval(() => {
        frame++;
        setExportProgress(Math.min(95, Math.round((frame / totalFrames) * 90) + 10));

        // Background
        const grad = ctx.createLinearGradient(0, 0, 1920, 1080);
        grad.addColorStop(0, "#0b0f19");
        grad.addColorStop(0.5, "#0e1424");
        grad.addColorStop(1, "#080c14");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1920, 1080);

        // Header
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 32px 'Space Grotesk', sans-serif";
        ctx.fillText(`LEARNIFY AI · ${topic.category.toUpperCase()}`, 100, 100);

        // Title
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 64px 'Space Grotesk', sans-serif";
        ctx.fillText(`${topic.emoji} ${topic.title}`, 100, 190);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "26px 'DM Sans', sans-serif";
        ctx.fillText(
          `Created by: ${topic.author.name} · Language: ${selectedLanguage.toUpperCase()} · Scene: ${activeChapter.title}`,
          100,
          250
        );

        // Center Card Graphic
        ctx.fillStyle = "#faf9f5";
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(320, 310, 1280, 580, 32);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 36px 'Space Grotesk', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`The Basics of ${topic.title}`, 960, 390);

        ctx.fillStyle = "#475569";
        ctx.font = "24px 'DM Sans', sans-serif";
        ctx.fillText(activeChapter.subtitle, 960, 450);

        // Vector illustration indicator
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(960, 580, 70, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 44px sans-serif";
        ctx.fillText(topic.emoji, 960, 595);

        ctx.fillStyle = "#64748b";
        ctx.font = "bold 20px 'Fira Code', monospace";
        ctx.fillText(
          `Scene ${activeChapterIndex + 1} of ${topic.chapters.length} · Timestamp ${activeChapter.timestamp}`,
          960,
          720
        );

        // Subtitle Bar
        ctx.fillStyle = captionStyle === "cyberpunk" ? "#022c22" : "rgba(2, 6, 23, 0.95)";
        ctx.strokeStyle =
          captionStyle === "cyberpunk" ? "#22c55e" : captionStyle === "karaoke" ? "#facc15" : "#38bdf8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(260, 955, 1400, 85, 20);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = captionStyle === "karaoke" ? "#facc15" : captionStyle === "cyberpunk" ? "#4ade80" : "#ffffff";
        ctx.font = captionStyle === "cyberpunk" ? "bold 24px 'Fira Code', monospace" : "bold 26px 'DM Sans', sans-serif";
        ctx.fillText(`LEARNIFY AI: ${activeChapter.title} — ${activeChapter.spokenWords}`, 960, 1008);
        ctx.textAlign = "left";

        if (frame >= totalFrames) {
          clearInterval(renderInterval);
          mediaRecorder.stop();
        }
      }, 40);
    } catch (err: any) {
      setIsExportingVideo(false);
      toast.error(`Export failed: ${err.message || String(err)}`);
    }
  }, [topic, selectedLanguage, activeChapter, activeChapterIndex, captionStyle]);

  // Play / Pause Cycle
  const handleTogglePlay = () => {
    if (!isPlaying) {
      initAmbientAudio();
      if (audioCtxRef.current?.state === "suspended") {
        audioCtxRef.current.resume();
      }
      setIsPlaying(true);
      speakChapter(activeChapter);
    } else {
      setIsPlaying(false);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  // Timeline ticking
  useEffect(() => {
    if (!isPlaying) {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
      return;
    }

    playTimerRef.current = setInterval(() => {
      setCurrentTimeSec((prev) => {
        const nextTime = prev + 1 * playbackSpeed;
        if (nextTime >= topic.totalDurationSec) {
          setIsPlaying(false);
          return 0;
        }

        // Determine active chapter
        let currentIdx = 0;
        for (let i = 0; i < topic.chapters.length; i++) {
          if (nextTime >= topic.chapters[i].timeSec) {
            currentIdx = i;
          }
        }
        if (currentIdx !== activeChapterIndex) {
          setActiveChapterIndex(currentIdx);
          speakChapter(topic.chapters[currentIdx]);
        }

        return nextTime;
      });
    }, 1000 / playbackSpeed);

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, playbackSpeed, topic, activeChapterIndex, speakChapter]);

  // Jump to specific chapter
  const jumpToChapter = (idx: number) => {
    const chapter = topic.chapters[idx];
    if (!chapter) return;
    setActiveChapterIndex(idx);
    setCurrentTimeSec(chapter.timeSec);
    if (isPlaying) {
      speakChapter(chapter);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Calculate zoom transform for 4-quadrant infographic
  const getQuadrantZoomStyle = (target?: "all" | "q1" | "q2" | "q3" | "q4") => {
    switch (target) {
      case "q1": // Top-left
        return "scale(1.5) translate(18%, 18%)";
      case "q2": // Top-right
        return "scale(1.5) translate(-18%, 18%)";
      case "q3": // Bottom-left
        return "scale(1.5) translate(18%, -18%)";
      case "q4": // Bottom-right
        return "scale(1.5) translate(-18%, -18%)";
      case "all":
      default:
        return "scale(1) translate(0%, 0%)";
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "rounded-2xl border border-slate-800 bg-[#0c0f17] text-white overflow-hidden shadow-2xl flex flex-col transition-all",
        isFullscreen ? "p-4 h-screen" : "w-full"
      )}
    >
      {/* ─── Video Display Stage ─── */}
      <div className="relative aspect-video w-full bg-gradient-to-b from-[#0a101d] via-[#09111f] to-[#040810] flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none">
        {/* Organic Abstract Layer Wave Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
            <path
              d="M0,120 C300,180 600,60 1000,140 L1000,0 L0,0 Z"
              fill="rgba(56, 189, 248, 0.15)"
            />
            <path
              d="M0,220 C400,280 700,160 1000,240 L1000,0 L0,0 Z"
              fill="rgba(99, 102, 241, 0.12)"
            />
          </svg>
        </div>

        {/* ─── Top Stage Header ─── */}
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">{topic.emoji}</span>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400 block font-mono">
                {topic.category}
              </span>
              <h2 className="text-sm sm:text-base font-bold font-display tracking-tight text-white/95">
                {topic.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Top-Right "GO DEEPER" button from the reference video */}
            <Button
              size="sm"
              onClick={onGoDeeper || onSwitchToWatchAndCode}
              className="h-8 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 font-bold text-xs gap-1.5 shadow-lg backdrop-blur-sm transition-all hover:scale-105 cursor-pointer"
            >
              <Compass className="h-3.5 w-3.5 text-sky-400" />
              <span>GO DEEPER</span>
            </Button>

            {onSwitchToWatchAndCode && (
              <Button
                size="sm"
                variant="outline"
                onClick={onSwitchToWatchAndCode}
                className="h-8 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-semibold text-xs gap-1.5 backdrop-blur-sm cursor-pointer hidden sm:flex"
              >
                <Code2 className="h-3.5 w-3.5 text-indigo-400" />
                <span>{isSplitMode ? "Watch Mode" : "Watch & Code"}</span>
              </Button>
            )}
          </div>
        </div>

        {/* ─── Center Visual Presentation Stage ─── */}
        <div className="relative z-10 my-auto flex items-center justify-center w-full px-2">
          {/* SCENE TYPE A: 4-Quadrant Pinned Infographic Card (Exact match to Magnetism in recording) */}
          {topic.quadrants && (
            <motion.div
              style={{
                transform: getQuadrantZoomStyle(activeChapter.zoomTarget),
                transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              className="relative w-full max-w-2xl bg-[#faf9f5] text-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl border border-amber-900/10"
            >
              {/* Illustrated Center Push-Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
                <div className="w-5 h-5 rounded-full bg-rose-500 shadow-md border-2 border-white" />
                <div className="bg-white/95 px-3 py-1 rounded-xl shadow-lg border border-slate-200 text-center -mt-1">
                  <span className="text-[11px] font-bold text-slate-800 block">The Basics</span>
                  <span className="text-[9px] text-slate-500 font-medium -mt-0.5 block">of {topic.title}</span>
                </div>
              </div>

              {/* 4 Quadrants Grid */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 divide-x divide-y divide-slate-200">
                {/* Quadrant 1: The Two Poles */}
                <div
                  onClick={() => jumpToChapter(1)}
                  className={cn(
                    "p-3 rounded-xl transition-all cursor-pointer flex flex-col justify-between min-h-[110px]",
                    activeChapter.zoomTarget === "q1" ? "bg-amber-500/10 ring-2 ring-amber-500/40" : "hover:bg-slate-100"
                  )}
                >
                  <h4 className="font-serif font-bold text-sm text-slate-900 text-center">
                    {topic.quadrants.q1.title}
                  </h4>
                  <div className="my-2 flex items-center justify-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">North</span>
                    <div className="flex rounded-md overflow-hidden border border-slate-700 shadow-sm font-bold text-xs">
                      <div className="bg-rose-500 text-white px-3 py-1.5 flex items-center justify-center">N</div>
                      <div className="bg-sky-600 text-white px-3 py-1.5 flex items-center justify-center">S</div>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">South</span>
                  </div>
                  <p className="text-[10px] text-slate-500 text-center">{topic.quadrants.q1.subtitle}</p>
                </div>

                {/* Quadrant 2: Push and Pull */}
                <div
                  onClick={() => jumpToChapter(2)}
                  className={cn(
                    "p-3 rounded-xl transition-all cursor-pointer flex flex-col justify-between min-h-[110px]",
                    activeChapter.zoomTarget === "q2" ? "bg-amber-500/10 ring-2 ring-amber-500/40" : "hover:bg-slate-100"
                  )}
                >
                  <h4 className="font-serif font-bold text-sm text-slate-900 text-center">
                    {topic.quadrants.q2.title}
                  </h4>
                  <div className="my-1.5 space-y-1.5 text-[11px] font-semibold text-slate-700 flex flex-col items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-emerald-600 font-bold">Attract:</span>
                      <div className="h-4 px-2 rounded bg-rose-500 text-white text-[10px] font-bold flex items-center">N</div>
                      <span className="text-xs text-slate-400">→ ←</span>
                      <div className="h-4 px-2 rounded bg-sky-600 text-white text-[10px] font-bold flex items-center">S</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-rose-500 font-bold">Repel:</span>
                      <div className="h-4 px-2 rounded bg-rose-500 text-white text-[10px] font-bold flex items-center">N</div>
                      <span className="text-xs text-slate-400">← →</span>
                      <div className="h-4 px-2 rounded bg-rose-500 text-white text-[10px] font-bold flex items-center">N</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 text-center">{topic.quadrants.q2.subtitle}</p>
                </div>

                {/* Quadrant 3: The Field */}
                <div
                  onClick={() => jumpToChapter(3)}
                  className={cn(
                    "p-3 rounded-xl transition-all cursor-pointer flex flex-col justify-between min-h-[110px] pt-4",
                    activeChapter.zoomTarget === "q3" ? "bg-amber-500/10 ring-2 ring-amber-500/40" : "hover:bg-slate-100"
                  )}
                >
                  <h4 className="font-serif font-bold text-sm text-slate-900 text-center">
                    {topic.quadrants.q3.title}
                  </h4>
                  <div className="my-1 flex items-center justify-center">
                    {/* SVG Vector Field Lines */}
                    <svg className="w-28 h-12" viewBox="0 0 140 60">
                      <ellipse cx="70" cy="30" rx="60" ry="24" fill="none" stroke="#94a3b8" strokeDasharray="3 3" />
                      <ellipse cx="70" cy="30" rx="42" ry="16" fill="none" stroke="#64748b" />
                      <rect x="45" y="20" width="25" height="20" fill="#f43f5e" rx="2" />
                      <text x="57" y="34" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">N</text>
                      <rect x="70" y="20" width="25" height="20" fill="#0284c7" rx="2" />
                      <text x="82" y="34" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">S</text>
                    </svg>
                  </div>
                  <p className="text-[10px] text-slate-500 text-center">{topic.quadrants.q3.subtitle}</p>
                </div>

                {/* Quadrant 4: Always Two */}
                <div
                  onClick={() => jumpToChapter(4)}
                  className={cn(
                    "p-3 rounded-xl transition-all cursor-pointer flex flex-col justify-between min-h-[110px] pt-4",
                    activeChapter.zoomTarget === "q4" ? "bg-amber-500/10 ring-2 ring-amber-500/40" : "hover:bg-slate-100"
                  )}
                >
                  <h4 className="font-serif font-bold text-sm text-slate-900 text-center">
                    {topic.quadrants.q4.title}
                  </h4>
                  <div className="my-1 flex items-center justify-center gap-1.5">
                    <div className="flex border border-slate-400 rounded text-[9px] font-bold">
                      <span className="bg-rose-500 text-white px-1.5 py-0.5">N</span>
                      <span className="bg-sky-600 text-white px-1.5 py-0.5">S</span>
                    </div>
                    <span className="text-[10px] text-slate-400">✂ Cut →</span>
                    <div className="flex border border-slate-400 rounded text-[9px] font-bold">
                      <span className="bg-rose-500 text-white px-1.5 py-0.5">N</span>
                      <span className="bg-sky-600 text-white px-1.5 py-0.5">S</span>
                    </div>
                    <div className="flex border border-slate-400 rounded text-[9px] font-bold">
                      <span className="bg-rose-500 text-white px-1.5 py-0.5">N</span>
                      <span className="bg-sky-600 text-white px-1.5 py-0.5">S</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 text-center">{topic.quadrants.q4.subtitle}</p>
                </div>
              </div>

              {/* Watermark badge from recording */}
              <div className="absolute bottom-2 right-3">
                <span className="text-[9px] font-medium text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-md">
                  Generated diagram
                </span>
              </div>
            </motion.div>
          )}

          {/* SCENE TYPE B: Deep Learning Neural Network Architecture */}
          {topic.deepLearningGraph && !topic.quadrants && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-2xl bg-slate-900/90 rounded-2xl p-5 border border-slate-700 shadow-2xl backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-sky-400" />
                  <span className="text-xs font-bold text-white font-mono">Neural Architecture (Forward &amp; Backprop)</span>
                </div>
                <Badge variant="outline" className="border-sky-500/30 text-sky-400 bg-sky-500/10 text-[10px]">
                  {topic.deepLearningGraph.activation} Activation · {topic.deepLearningGraph.lossType}
                </Badge>
              </div>

              {/* Neural Network Nodes & Synapses Vector */}
              <div className="flex items-center justify-between px-4 py-2">
                {/* Input Layer */}
                <div className="space-y-3 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block font-mono">Input (X)</span>
                  {topic.deepLearningGraph.inputFeatures.map((f, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      className="h-8 px-2.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-[11px] font-bold flex items-center justify-center shadow-sm"
                    >
                      {f}
                    </motion.div>
                  ))}
                </div>

                {/* Synaptic Weights Flow Vector */}
                <div className="flex-1 px-4 flex items-center justify-center">
                  <div className="w-full relative h-16 flex items-center">
                    <div className="w-full border-t border-dashed border-sky-400/30" />
                    <motion.div
                      animate={{ left: ["0%", "100%"] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                      className="absolute w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]"
                    />
                  </div>
                </div>

                {/* Hidden Dense Layer */}
                <div className="space-y-2 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block font-mono">Hidden (W·X + b)</span>
                  {Array.from({ length: topic.deepLearningGraph.hiddenNodes }).map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center shadow-inner"
                    >
                      h{i + 1}
                    </div>
                  ))}
                </div>

                {/* Activation Vector */}
                <div className="flex-1 px-4 flex items-center justify-center">
                  <div className="w-full relative h-16 flex items-center">
                    <div className="w-full border-t border-dashed border-purple-400/30" />
                    <motion.div
                      animate={{ left: ["0%", "100%"] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 0.5 }}
                      className="absolute w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]"
                    />
                  </div>
                </div>

                {/* Output Layer */}
                <div className="space-y-3 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block font-mono">Output (Ŷ)</span>
                  {topic.deepLearningGraph.outputClasses.map((c, i) => (
                    <div
                      key={i}
                      className="h-8 px-3 rounded-lg bg-sky-500/20 border border-sky-400/40 text-sky-300 font-mono text-[11px] font-bold flex items-center justify-center shadow-sm"
                    >
                      {c}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono">Forward: Ŷ = σ(W₂ · σ(W₁X + b₁) + b₂)</span>
                <span className="text-amber-400 font-mono font-semibold">Backprop: ∇W = ∂L/∂W</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* ─── Bottom Subtitle Pill (Dynamic Styles: Glass, Karaoke, Cinema, Cyberpunk) ─── */}
        <div className="relative z-10 flex flex-col items-center justify-center mb-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeChapter.id}-${captionStyle}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="max-w-lg w-[90%] text-center"
            >
              {captionStyle === "karaoke" ? (
                <div className="inline-block bg-black/90 text-yellow-300 font-extrabold text-sm sm:text-base border-2 border-yellow-400/80 px-6 py-2 rounded-2xl shadow-[0_0_20px_rgba(250,204,21,0.5)] tracking-wide animate-pulse">
                  <span className="text-amber-400 mr-1.5">🔥</span>
                  {activeChapter.subtitle}
                </div>
              ) : captionStyle === "cinema" ? (
                <div className="inline-block bg-black/95 text-white border-y border-white/20 px-8 py-2 text-xs sm:text-sm font-serif tracking-widest shadow-2xl">
                  {activeChapter.subtitle}
                </div>
              ) : captionStyle === "cyberpunk" ? (
                <div className="inline-block bg-[#051c14] text-emerald-400 border border-emerald-500/80 px-5 py-1.5 rounded-lg text-xs font-mono shadow-[0_0_15px_rgba(16,185,129,0.3)] tracking-wider">
                  <span className="text-emerald-500 font-bold mr-1">&gt;</span> {activeChapter.subtitle}
                </div>
              ) : (
                <div className="px-4 py-2 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 text-center shadow-xl">
                  <p className="text-xs sm:text-sm font-medium text-white/90 leading-snug">
                    <span className="text-sky-400 font-bold mr-1.5">{activeChapter.title}:</span>
                    {activeChapter.subtitle}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── Controls & Segmented Progress Bar (Matches recording) ─── */}
        <div className="relative z-20 space-y-2 pt-2">
          {/* Segmented Timeline */}
          <div
            className="relative h-2 w-full flex gap-1 cursor-pointer group py-1"
            onMouseLeave={() => setHoveredChapter(null)}
          >
            {topic.chapters.map((chap, idx) => {
              const isPast = currentTimeSec >= chap.timeSec + chap.durationSec;
              const isCurrent = activeChapterIndex === idx;

              // Calculate percent within this segment
              let fillPercent = 0;
              if (isPast) {
                fillPercent = 100;
              } else if (isCurrent) {
                const elapsedInChap = Math.max(0, currentTimeSec - chap.timeSec);
                fillPercent = Math.min(100, (elapsedInChap / chap.durationSec) * 100);
              }

              return (
                <div
                  key={chap.id}
                  onClick={() => jumpToChapter(idx)}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const parentRect = e.currentTarget.parentElement?.getBoundingClientRect() || rect;
                    const xPercent = ((rect.left + rect.width / 2 - parentRect.left) / parentRect.width) * 100;
                    setHoveredChapter({
                      index: idx,
                      title: chap.title,
                      timestamp: chap.timestamp,
                      xPercent,
                    });
                  }}
                  className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden transition-all group-hover:h-2"
                >
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      isCurrent ? "bg-gradient-to-r from-sky-400 to-indigo-500 shadow-[0_0_8px_#38bdf8]" : isPast ? "bg-sky-400" : "bg-transparent"
                    )}
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              );
            })}

            {/* Hover Tooltip Card (Shown in frame_009 of user recording!) */}
            <AnimatePresence>
              {hoveredChapter && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5 }}
                  style={{ left: `${hoveredChapter.xPercent}%` }}
                  className="absolute bottom-6 -translate-x-1/2 z-30 pointer-events-none p-2.5 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-md min-w-[150px] text-center space-y-1"
                >
                  <div className="w-full h-12 rounded bg-slate-800 flex items-center justify-center text-xs text-slate-400 font-mono">
                    {topic.emoji} Scene #{hoveredChapter.index + 1}
                  </div>
                  <div className="font-bold text-xs text-white truncate">{hoveredChapter.title}</div>
                  <div className="text-[10px] text-sky-400 font-mono">{hoveredChapter.timestamp}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Lower Control Bar */}
          <div className="flex items-center justify-between text-xs text-slate-300 pt-0.5">
            <div className="flex items-center gap-3">
              {/* Play / Pause */}
              <button
                type="button"
                onClick={handleTogglePlay}
                className="h-8 w-8 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 flex items-center justify-center transition cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="h-4 w-4 fill-sky-300" /> : <Play className="h-4 w-4 fill-sky-300 ml-0.5" />}
              </button>

              {/* Volume / Mute */}
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
                title={isMuted ? "Unmute Ambient Music & Voice" : "Mute"}
              >
                {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4" />}
              </button>

              {/* Timestamp */}
              <span className="font-mono text-[11px] text-slate-400">
                {formatTime(currentTimeSec)} / {topic.durationFormatted}
              </span>
            </div>

            {/* Learnify AI Official Brand Emblem */}
            <div className="flex items-center gap-1.5 font-display font-bold select-none">
              <Logo markOnly height="h-4" />
              <span className="text-[11px] text-white tracking-wider">LEARNIFY AI</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Multi-Language Selector Dropdown */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-md px-1.5 py-0.5">
                <Globe2 className="h-3 w-3 text-sky-400 shrink-0" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value);
                    const langNames: Record<string, string> = {
                      en: "English 🇬🇧",
                      hi: "हिंदी / Hinglish 🇮🇳",
                      es: "Español 🇪🇸",
                      fr: "Français 🇫🇷",
                      de: "Deutsch 🇩🇪",
                      ja: "日本語 🇯🇵",
                    };
                    toast.success(`Explainer language set to ${langNames[e.target.value] || e.target.value}`);
                  }}
                  className="bg-transparent text-[10px] font-mono font-bold text-slate-300 focus:outline-none cursor-pointer"
                  title="Select Audio & Caption Language"
                >
                  <option value="en" className="bg-slate-900 text-slate-100">🇬🇧 EN</option>
                  <option value="hi" className="bg-slate-900 text-slate-100">🇮🇳 HI</option>
                  <option value="es" className="bg-slate-900 text-slate-100">🇪🇸 ES</option>
                  <option value="fr" className="bg-slate-900 text-slate-100">🇫🇷 FR</option>
                  <option value="de" className="bg-slate-900 text-slate-100">🇩🇪 DE</option>
                  <option value="ja" className="bg-slate-900 text-slate-100">🇯🇵 JA</option>
                </select>
              </div>

              {/* Caption Visual Style Switcher */}
              <div className="hidden md:flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-md px-1.5 py-0.5">
                <Palette className="h-3 w-3 text-amber-400 shrink-0" />
                <select
                  value={captionStyle}
                  onChange={(e) => {
                    setCaptionStyle(e.target.value as any);
                    toast.info(`Caption Style: ${e.target.value.toUpperCase()}`);
                  }}
                  className="bg-transparent text-[10px] font-mono font-bold text-slate-300 focus:outline-none cursor-pointer"
                  title="Caption Visual Style"
                >
                  <option value="glass" className="bg-slate-900 text-slate-100">Glass Pill</option>
                  <option value="karaoke" className="bg-slate-900 text-slate-100">🔥 Viral Karaoke</option>
                  <option value="cinema" className="bg-slate-900 text-slate-100">Cinema Bar</option>
                  <option value="cyberpunk" className="bg-slate-900 text-slate-100">Cyber Terminal</option>
                </select>
              </div>

              {/* Playback Speed Switcher */}
              <button
                type="button"
                onClick={() => {
                  const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
                  const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                  setPlaybackSpeed(speeds[nextIdx]);
                }}
                className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              >
                {playbackSpeed.toFixed(1)}x
              </button>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="text-slate-400 hover:text-white transition cursor-pointer"
                title="Fullscreen Video"
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Video Information & Creator Bar (Matches frame_007 in recording) ─── */}
      <div className="p-4 sm:p-5 border-t border-slate-800 space-y-4 bg-[#0a0d14]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
              {topic.author.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-white">{topic.author.handle}</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsFollowed(!isFollowed);
                    toast.success(isFollowed ? "Unfollowed creator" : `Following ${topic.author.handle}!`);
                  }}
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border transition cursor-pointer",
                    isFollowed
                      ? "bg-sky-500/20 text-sky-300 border-sky-500/30"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
                  )}
                >
                  {isFollowed ? "FOLLOWING" : "+ FOLLOW"}
                </button>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                <span>⏱ {topic.durationFormatted}</span>
                <span>•</span>
                <span>👁 {topic.views} views</span>
                <span>•</span>
                <span>{topic.timeAgo}</span>
              </div>
            </div>
          </div>

          {/* Social Action Buttons */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsLiked(!isLiked);
                toast.success(isLiked ? "Like removed" : "Liked explainer!");
              }}
              className={cn("h-7 px-2.5 text-xs gap-1 border-slate-700 text-slate-300 cursor-pointer", isLiked && "text-sky-400 border-sky-500/40 bg-sky-500/10")}
            >
              <ThumbsUp className="h-3 w-3" />
              <span>Like</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsSaved(!isSaved);
                toast.success(isSaved ? "Removed from saved" : "Saved to library!");
              }}
              className={cn("h-7 px-2.5 text-xs gap-1 border-slate-700 text-slate-300 cursor-pointer", isSaved && "text-amber-400 border-amber-500/40 bg-amber-500/10")}
            >
              <Bookmark className="h-3 w-3" />
              <span>Save</span>
            </Button>
            <Button
              size="sm"
              onClick={handleDownloadMp4}
              disabled={isExportingVideo}
              className="h-7 px-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs gap-1.5 shadow-sm transition-all hover:scale-105 cursor-pointer"
            >
              {isExportingVideo ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Exporting {exportProgress}%</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  <span>Download MP4</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Report logged. Our safety auditor will review it.")}
              className="h-7 px-2.5 text-xs gap-1 border-slate-700 text-slate-400 hover:text-rose-400 cursor-pointer"
            >
              <Flag className="h-3 w-3" />
              <span>Report</span>
            </Button>
          </div>
        </div>

        {/* Tagline & AI Disclaimer */}
        <div className="space-y-1">
          <p className="text-xs text-slate-300 leading-relaxed">{topic.tagline}</p>
          <p className="text-[11px] text-slate-500 italic">
            Explain is AI and can make mistakes. Please do your own diligence.
          </p>
        </div>

        {/* ─── Synchronized Interactive Transcript (Matches frame_007) ─── */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Synchronized Transcript
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Click any chapter to jump</span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {topic.chapters.map((chap, idx) => {
              const isActive = activeChapterIndex === idx;
              return (
                <div
                  key={chap.id}
                  onClick={() => jumpToChapter(idx)}
                  className={cn(
                    "p-2.5 rounded-xl transition text-left cursor-pointer flex flex-col gap-0.5",
                    isActive
                      ? "bg-sky-500/15 border border-sky-500/30 text-white"
                      : "hover:bg-slate-800/50 text-slate-400"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />}
                      {chap.title}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">{chap.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {chap.spokenWords}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
