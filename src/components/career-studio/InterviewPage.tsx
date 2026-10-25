import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Mic,
  MicOff,
  Send,
  Loader2,
  MessageSquare,
  Video,
  VideoOff,
  ChevronRight,
  Target,
  Lightbulb,
  CheckCircle2,
  XCircle,
  BarChart3,
  RotateCcw,
  Volume2,
  VolumeX,
  Briefcase,
  Palette,
  Settings,
  Rocket,
  Wrench,
  Smartphone,
  Clipboard,
  Check,
  Play,
  Pause,
  Download,
  FileText,
  FileDown,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  Copy,
  Radio,
  UserCheck,
  ShieldAlert,
  RefreshCw,
  SlidersHorizontal,
  Award,
  Info,
  ExternalLink,
  Layers,
  CheckCheck,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { generateInterviewQuestion, evaluateInterviewAnswer } from "@/lib/resume.functions";
import {
  type Question,
  PRESET_QUESTIONS,
  getRoleKey,
  getDefaultQuestionForRole,
} from "@/lib/interview-presets";

const JOB_ROLES = [
  { id: "frontend", label: "Frontend Developer", icon: Palette },
  { id: "backend", label: "Backend Developer", icon: Settings },
  { id: "fullstack", label: "Full-Stack Developer", icon: Rocket },
  { id: "dataScience", label: "Data Scientist", icon: BarChart3 },
  { id: "devops", label: "DevOps Engineer", icon: Wrench },
  { id: "mobile", label: "Mobile Developer", icon: Smartphone },
  { id: "pm", label: "Product Manager", icon: Clipboard },
  { id: "designer", label: "UI/UX Designer", icon: Target },
];

const DIFFICULTIES = [
  { id: "easy", label: "Easy", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { id: "medium", label: "Medium", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { id: "hard", label: "Hard", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
];

const MODES = [
  { id: "video", label: "Video & Audio", icon: Video, desc: "Camera & microphone practice" },
  { id: "voice", label: "Audio Only", icon: Mic, desc: "Speak answers without webcam" },
  { id: "chat", label: "Written Response", icon: MessageSquare, desc: "Type answers directly" },
];

interface Evaluation {
  score: number;
  rating: string;
  strengths: string[];
  improvements: string[];
  feedback: string;
  modelAnswer: string;
  pointsCovered: string[];
  pointsMissed: string[];
}

export interface HumanInterviewer {
  id: "priya" | "vikram" | "anjali" | "rishabh";
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  gender: "female" | "male";
  bio: string;
  badge: string;
  accentColor: string;
}

export const HUMAN_INTERVIEWERS: HumanInterviewer[] = [
  {
    id: "priya",
    name: "Priya Kapoor",
    role: "Principal AI & Systems Architect",
    company: "Ex-Google / Cloud AI",
    avatarUrl: "/avatars/Priya-Kapoor.png",
    gender: "female",
    bio: "Evaluates architectural trade-offs, system scalability, and core algorithmic precision.",
    badge: "Staff Architect",
    accentColor: "from-indigo-500 to-purple-600",
  },
  {
    id: "vikram",
    name: "Vikram Singh",
    role: "Director of Engineering",
    company: "Ex-Amazon / Web Services",
    avatarUrl: "/avatars/Vikram-Singh.png",
    gender: "male",
    bio: "Focuses on high-scale backend design, production resilience, and leadership maturity.",
    badge: "Director",
    accentColor: "from-blue-500 to-indigo-600",
  },
  {
    id: "anjali",
    name: "Anjali Verma",
    role: "Lead Technical Hiring Manager",
    company: "Ex-Meta / Tech Recruiting",
    avatarUrl: "/avatars/Anjali-Verma.png",
    gender: "female",
    bio: "Specializes in behavioral assessments, team leadership, and the STAR framework.",
    badge: "Hiring Lead",
    accentColor: "from-rose-500 to-pink-600",
  },
  {
    id: "rishabh",
    name: "Rishabh Sharma",
    role: "Staff Software Engineer",
    company: "Ex-Microsoft / Azure",
    avatarUrl: "/avatars/Rishabh-Sharma.png",
    gender: "male",
    bio: "Deep-dives into distributed systems, data structures, concurrency, and debugging.",
    badge: "Staff Engineer",
    accentColor: "from-emerald-500 to-teal-600",
  },
];

/* ── Remotion-Style Cinematic Waveform Visualizer ── */
function AudioEqualizerSpectrum({
  active,
  level = 0.5,
  barCount = 18,
  color = "emerald",
}: {
  active: boolean;
  level?: number;
  barCount?: number;
  color?: "emerald" | "indigo" | "rose" | "amber";
}) {
  const bars = useMemo(() => Array.from({ length: barCount }), [barCount]);

  const colorMap = {
    emerald: "from-emerald-400 via-teal-300 to-emerald-500",
    indigo: "from-indigo-400 via-violet-300 to-indigo-500",
    rose: "from-rose-400 via-pink-300 to-rose-500",
    amber: "from-amber-400 via-yellow-300 to-amber-500",
  };

  return (
    <div className="flex items-end justify-center gap-1 h-8 px-2 py-1">
      {bars.map((_, i) => {
        // Compute pseudo-random or dynamic wave heights
        const seed = Math.sin((i / barCount) * Math.PI) * 0.8 + 0.2;
        const baseHeight = active ? Math.max(15, Math.min(100, (seed * level + 0.15) * 100)) : 12;
        const animDelay = `${(i * 60) % 600}ms`;
        const animDuration = active ? `${400 + (i % 5) * 120}ms` : "1200ms";

        return (
          <span
            key={i}
            className={cn(
              "w-1 rounded-full bg-gradient-to-t transition-all duration-150 shadow-sm",
              colorMap[color],
              active ? "opacity-100" : "opacity-35",
            )}
            style={{
              height: `${baseHeight}%`,
              minHeight: "4px",
              animation: active ? `spectrumPulse ${animDuration} infinite ease-in-out alternate` : "none",
              animationDelay: animDelay,
            }}
          />
        );
      })}
    </div>
  );
}

/* ── Realistic Human AI Interviewer Video Stage ── */
function HumanInterviewerDisplay({
  interviewer,
  aiSpeaking,
  evaluating,
  isRecording,
  onReplayAudio,
  isMuted,
  onToggleMute,
}: {
  interviewer: HumanInterviewer;
  aiSpeaking: boolean;
  evaluating: boolean;
  isRecording: boolean;
  onReplayAudio: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}) {
  const [avatarError, setAvatarError] = useState(false);

  // Initials for avatar fallback
  const initials = interviewer.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="relative w-full h-full min-h-[300px] sm:min-h-[330px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-slate-800/80 flex flex-col justify-between p-4 shadow-2xl backdrop-blur-xl group">
      {/* Cinematic Ambient Glow */}
      <div
        className={cn(
          "absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700",
          aiSpeaking ? "bg-emerald-500 opacity-30" : evaluating ? "bg-amber-500 opacity-25" : "bg-indigo-600",
        )}
      />

      {/* Top Studio Conference Header */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-200 shadow-md">
          <span className="relative flex h-2 w-2">
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                aiSpeaking
                  ? "bg-emerald-400"
                  : evaluating
                    ? "bg-amber-400"
                    : isRecording
                      ? "bg-indigo-400"
                      : "bg-slate-400",
              )}
            />
            <span
              className={cn(
                "relative inline-flex rounded-full h-2 w-2",
                aiSpeaking
                  ? "bg-emerald-500"
                  : evaluating
                    ? "bg-amber-500"
                    : isRecording
                      ? "bg-indigo-500"
                      : "bg-slate-400",
              )}
            />
          </span>
          <span className="font-display tracking-tight text-white font-bold">{interviewer.name}</span>
          <span className="text-[10px] text-slate-400 font-normal border-l border-slate-700/80 pl-2">
            {interviewer.badge}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggleMute}
            className="h-7 w-7 p-0 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60"
            title={isMuted ? "Unmute AI Interviewer" : "Mute AI Interviewer"}
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5 text-rose-400" /> : <Volume2 className="h-3.5 w-3.5 text-slate-300" />}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onReplayAudio}
            className="h-7 w-7 p-0 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60"
            title="Replay Question Audio"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-300" />
          </Button>

          <Badge
            variant="outline"
            className={cn(
              "text-[10px] px-2.5 py-0.5 border backdrop-blur-md font-semibold transition-all shadow-sm",
              aiSpeaking
                ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                : evaluating
                  ? "border-amber-500/50 bg-amber-500/15 text-amber-300"
                  : isRecording
                    ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-300"
                    : "border-slate-700 bg-slate-900/80 text-slate-300",
            )}
          >
            {evaluating ? "Evaluating Response" : aiSpeaking ? "Speaking" : isRecording ? "Listening" : "Ready"}
          </Badge>
        </div>
      </div>

      {/* Human Portrait Stage with Dynamic Multi-Ring Glow */}
      <div className="flex-1 flex flex-col items-center justify-center my-3 relative">
        {/* Animated aura rings */}
        {aiSpeaking && (
          <>
            <div className="absolute w-44 h-44 rounded-full bg-emerald-500/15 animate-ping [animation-duration:2.5s]" />
            <div className="absolute w-36 h-36 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
          </>
        )}

        <div className="relative group/avatar">
          <div
            className={cn(
              "w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-2xl relative bg-slate-900 flex items-center justify-center",
              aiSpeaking
                ? "border-emerald-400 ring-4 ring-emerald-500/30 scale-105"
                : evaluating
                  ? "border-amber-400/80 ring-2 ring-amber-500/20"
                  : isRecording
                    ? "border-indigo-400/80 ring-2 ring-indigo-500/20"
                    : "border-slate-700/80 ring-1 ring-slate-800",
            )}
          >
            {!avatarError ? (
              <img
                src={interviewer.avatarUrl}
                alt=""
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/avatar:scale-105"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div
                className={cn(
                  "w-full h-full flex flex-col items-center justify-center bg-gradient-to-br text-white font-bold",
                  interviewer.accentColor,
                )}
              >
                <span className="text-2xl font-display">{initials}</span>
                <span className="text-[9px] opacity-80 uppercase tracking-widest mt-0.5">AI Lead</span>
              </div>
            )}
          </div>

          {/* Broadcast Live Indicator badge */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-950/95 border border-slate-700/80 px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-lg text-[10px] text-slate-300 font-medium">
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                aiSpeaking ? "bg-emerald-400 animate-pulse" : "bg-indigo-400",
              )}
            />
            <span className="tracking-tight text-white font-semibold">Verified AI Lead</span>
          </div>
        </div>

        {/* Remotion-Style Audio Spectrum Equalizer */}
        <div className="mt-4 w-48 flex flex-col items-center">
          <AudioEqualizerSpectrum
            active={aiSpeaking}
            level={aiSpeaking ? 0.85 : 0.2}
            barCount={16}
            color={aiSpeaking ? "emerald" : "indigo"}
          />
        </div>

        {/* Interviewer Single Clean Nameplate (NO repetition) */}
        <div className="mt-1 text-center max-w-xs">
          <p className="text-xs text-slate-400 font-medium line-clamp-1">
            {interviewer.role} · <span className="text-slate-300 font-semibold">{interviewer.company}</span>
          </p>
        </div>
      </div>

      {/* Conference Status Subtitle Bar */}
      <div className="w-full z-10">
        <div className="bg-slate-900/85 border border-slate-800/80 rounded-xl px-3 py-1.5 text-center text-xs text-slate-300 backdrop-blur-md shadow-sm">
          {evaluating ? (
            <span className="text-amber-400 flex items-center justify-center gap-1.5 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
              Analyzing candidate response against architectural rubrics...
            </span>
          ) : aiSpeaking ? (
            <span className="text-emerald-400 flex items-center justify-center gap-1.5 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              Interviewer is presenting the question...
            </span>
          ) : isRecording ? (
            <span className="text-indigo-400 flex items-center justify-center gap-1.5 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
              Listening to candidate response...
            </span>
          ) : (
            <span className="text-slate-400">
              Ready for your answer. Dictate using voice or type in the response panel.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Remotion-Style Candidate Stage (HD Webcam OR Studio Hologram Avatar) ── */
function CandidateStudioDisplay({
  cameraActive,
  micActive,
  isRecording,
  recordingTime,
  audioLevel,
  videoRef,
  onToggleCamera,
  onToggleMic,
  onToggleVoiceRecording,
  onOpenTroubleshooter,
  studioAvatarMode,
  candidateName = "Candidate",
}: {
  cameraActive: boolean;
  micActive: boolean;
  isRecording: boolean;
  recordingTime: number;
  audioLevel: number;
  videoRef: (node: HTMLVideoElement | null) => void;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  onToggleVoiceRecording: () => void;
  onOpenTroubleshooter: () => void;
  studioAvatarMode: boolean;
  candidateName?: string;
}) {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full h-full min-h-[300px] sm:min-h-[330px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-slate-800/80 flex flex-col justify-between p-4 shadow-2xl backdrop-blur-xl">
      {/* Top Status Indicators */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-200 shadow-md">
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              cameraActive ? "bg-emerald-500 animate-pulse" : "bg-indigo-400",
            )}
          />
          <span className="font-display tracking-tight text-white font-bold">
            {cameraActive ? "Live Webcam (HD)" : "Studio Candidate Avatar"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isRecording ? (
            <Badge
              variant="outline"
              className="text-[10px] flex items-center gap-1.5 px-3 py-1 border-rose-500/50 bg-rose-500/15 text-rose-300 font-bold animate-pulse backdrop-blur-md"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
              REC {formatTime(recordingTime)}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] flex items-center gap-1.5 px-2.5 py-0.5 backdrop-blur-md font-medium",
                micActive
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : "border-slate-700 bg-slate-900/80 text-slate-400",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  micActive ? (audioLevel > 0.15 ? "bg-emerald-400 scale-125" : "bg-emerald-500") : "bg-slate-500",
                )}
              />
              {micActive ? "Mic Active" : "Mic Muted"}
            </Badge>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={onOpenTroubleshooter}
            className="h-7 w-7 p-0 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60"
            title="Camera & Microphone Diagnostics"
          >
            <HelpCircle className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Display: Live Webcam OR Studio Candidate Hologram Avatar */}
      <div className="w-full flex-1 flex flex-col items-center justify-center relative rounded-2xl overflow-hidden bg-slate-950/80 border border-slate-800/80 my-2 shadow-inner">
        {cameraActive ? (
          <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1] rounded-2xl"
            />
            {/* Live broadcast watermark & audio meter overlay */}
            <div className="absolute bottom-2.5 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] text-white/90">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>1080p HD · 30 FPS</span>
            </div>

            {/* Live mic VU meter in video overlay */}
            <div className="absolute bottom-2.5 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
              <Mic className="h-3 w-3 text-emerald-400" />
              <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-75"
                  style={{ width: `${Math.min(100, audioLevel * 140)}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Studio Candidate Hologram Avatar */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Cinematic Geometric Mesh Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950/60 to-black pointer-events-none" />

            {/* Hologram Pulse Rings */}
            <div className="relative mb-2">
              <div
                className={cn(
                  "w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-300 shadow-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900",
                  isRecording
                    ? "border-rose-500 ring-4 ring-rose-500/20 scale-105"
                    : micActive && audioLevel > 0.1
                      ? "border-emerald-400 ring-4 ring-emerald-500/20 scale-102"
                      : "border-indigo-500/60 ring-1 ring-indigo-500/20",
                )}
              >
                <div className="w-16 h-16 rounded-full bg-indigo-600/20 border border-indigo-400/30 flex items-center justify-center text-indigo-200">
                  <UserCheck className="h-8 w-8 text-indigo-400" />
                </div>
              </div>

              {/* Pulsing state ring */}
              {isRecording && (
                <div className="absolute inset-0 rounded-full border border-rose-500 animate-ping [animation-duration:2s]" />
              )}
            </div>

            {/* Candidate Name & Mode */}
            <div className="text-center z-10 mb-2">
              <p className="text-sm font-display font-bold text-white tracking-tight">
                {candidateName}
              </p>
              <p className="text-[11px] text-slate-400 font-medium">
                {studioAvatarMode ? "Virtual Studio Presence Active" : "Webcam Off · Audio / Text Active"}
              </p>
            </div>

            {/* Live Reactive Audio Spectrum Waveform */}
            <div className="w-48 z-10">
              <AudioEqualizerSpectrum
                active={isRecording || (micActive && audioLevel > 0.05)}
                level={isRecording ? Math.max(0.4, audioLevel) : audioLevel}
                barCount={20}
                color={isRecording ? "rose" : "indigo"}
              />
            </div>
          </div>
        )}
      </div>

      {/* Sleek Studio Control Bar */}
      <div className="w-full flex items-center justify-between pt-2.5 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          {/* Microphone Toggle Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggleMic}
            className={cn(
              "h-8 px-3 text-xs font-semibold gap-1.5 rounded-xl transition-all cursor-pointer border",
              micActive
                ? "bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-100 shadow-sm"
                : "bg-rose-500/15 hover:bg-rose-500/25 border-rose-500/40 text-rose-300",
            )}
            title={micActive ? "Mute Microphone" : "Unmute Microphone"}
          >
            {micActive ? (
              <>
                <Mic className="h-3.5 w-3.5 text-emerald-400" />
                <span>Mic On</span>
              </>
            ) : (
              <>
                <MicOff className="h-3.5 w-3.5 text-rose-400" />
                <span>Mic Muted</span>
              </>
            )}
          </Button>

          {/* Camera / Studio Avatar Toggle */}
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggleCamera}
            className={cn(
              "h-8 px-3 text-xs font-semibold gap-1.5 rounded-xl transition-all cursor-pointer border",
              cameraActive
                ? "bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-100 shadow-sm"
                : "bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-500/40 text-indigo-300",
            )}
            title={cameraActive ? "Switch to Studio Avatar" : "Switch to Webcam"}
          >
            {cameraActive ? (
              <>
                <Video className="h-3.5 w-3.5 text-emerald-400" />
                <span>Webcam</span>
              </>
            ) : (
              <>
                <VideoOff className="h-3.5 w-3.5 text-indigo-400" />
                <span>Studio Avatar</span>
              </>
            )}
          </Button>
        </div>

        {/* Primary Dictation Trigger */}
        <Button
          size="sm"
          variant={isRecording ? "destructive" : "default"}
          className={cn(
            "h-8 text-xs font-bold rounded-xl px-3.5 cursor-pointer shadow-md transition-all",
            isRecording
              ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse"
              : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white",
          )}
          onClick={onToggleVoiceRecording}
        >
          {isRecording ? (
            <>
              <MicOff className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              <span>Stop Dictation</span>
            </>
          ) : (
            <>
              <Mic className="h-3.5 w-3.5 mr-1.5" />
              <span>Voice Answer</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

/* ── Hardware Diagnostics & Permissions Helper Modal ── */
function DeviceTroubleshooterModal({
  isOpen,
  onClose,
  onRetryDevices,
  onUseStudioMode,
  cameraStatus,
  micStatus,
}: {
  isOpen: boolean;
  onClose: () => void;
  onRetryDevices: () => void;
  onUseStudioMode: () => void;
  cameraStatus: "granted" | "denied" | "unavailable" | "prompt";
  micStatus: "granted" | "denied" | "unavailable" | "prompt";
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(12px)", backgroundColor: "rgba(0,0,0,0.75)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-slate-700/80 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 shadow-2xl text-slate-100"
        style={{ animation: "dialog-in 0.25s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-display font-bold text-white">Device & Permission Helper</h3>
            <p className="text-xs text-slate-400">Configure camera and audio for seamless interview prep</p>
          </div>
        </div>

        {/* Device Status Cards */}
        <div className="space-y-2.5 mb-5">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs">
            <div className="flex items-center gap-2.5">
              <Video className="h-4 w-4 text-indigo-400" />
              <div>
                <p className="font-semibold text-slate-200">Webcam Hardware</p>
                <p className="text-[11px] text-slate-400">
                  {cameraStatus === "granted"
                    ? "Camera allowed & active"
                    : cameraStatus === "denied"
                      ? "Permission blocked in browser"
                      : cameraStatus === "unavailable"
                        ? "No camera device detected"
                        : "Ready to request access"}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px]",
                cameraStatus === "granted"
                  ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                  : cameraStatus === "denied"
                    ? "border-rose-500/40 text-rose-400 bg-rose-500/10"
                    : "border-slate-600 text-slate-400 bg-slate-800",
              )}
            >
              {cameraStatus === "granted" ? "Active" : cameraStatus === "denied" ? "Blocked" : "Standby"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs">
            <div className="flex items-center gap-2.5">
              <Mic className="h-4 w-4 text-emerald-400" />
              <div>
                <p className="font-semibold text-slate-200">Microphone Hardware</p>
                <p className="text-[11px] text-slate-400">
                  {micStatus === "granted"
                    ? "Microphone allowed & active"
                    : micStatus === "denied"
                      ? "Permission blocked in browser"
                      : micStatus === "unavailable"
                        ? "No microphone device detected"
                        : "Ready to request access"}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px]",
                micStatus === "granted"
                  ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                  : micStatus === "denied"
                    ? "border-rose-500/40 text-rose-400 bg-rose-500/10"
                    : "border-slate-600 text-slate-400 bg-slate-800",
              )}
            >
              {micStatus === "granted" ? "Active" : micStatus === "denied" ? "Blocked" : "Standby"}
            </Badge>
          </div>
        </div>

        {/* How to enable permissions steps */}
        <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 mb-5 space-y-1.5">
          <p className="font-bold flex items-center gap-1.5 text-indigo-300">
            <Info className="h-3.5 w-3.5" /> How to allow browser access:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-[11px] text-indigo-200/90 pl-1">
            <li>Click the <b>tune/lock icon</b> on the left of your browser address bar.</li>
            <li>Toggle <b>Camera</b> and <b>Microphone</b> to <b>Allow</b>.</li>
            <li>Click <b>Retry Devices</b> below to reconnect immediately.</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => {
              onRetryDevices();
              onClose();
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9 text-xs rounded-xl"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Re-detect Camera & Microphone
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              onUseStudioMode();
              onClose();
            }}
            className="w-full border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold h-9 text-xs rounded-xl"
          >
            Continue in Studio Avatar Mode (No Camera Needed)
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Interview Component ── */
export function InterviewPage({ embedded = false }: { embedded?: boolean }) {
  const generateQuestion = useServerFn(generateInterviewQuestion);
  const evaluateAnswer = useServerFn(evaluateInterviewAnswer);

  const [step, setStep] = useState<"setup" | "interview" | "results">(() => {
    return (typeof window !== "undefined" && (localStorage.getItem("interview_step") as any)) || "setup";
  });
  const [role, setRole] = useState(() => {
    return (typeof window !== "undefined" && localStorage.getItem("interview_role")) || "";
  });
  const [customRole, setCustomRole] = useState(() => {
    return (typeof window !== "undefined" && localStorage.getItem("interview_custom_role")) || "";
  });
  const [interviewerId, setInterviewerId] = useState<"priya" | "vikram" | "anjali" | "rishabh">(() => {
    return (
      (typeof window !== "undefined" &&
        (localStorage.getItem("interview_interviewer_id") as any)) ||
      "priya"
    );
  });
  const selectedInterviewer =
    HUMAN_INTERVIEWERS.find((i) => i.id === interviewerId) || HUMAN_INTERVIEWERS[0];
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(() => {
    return (typeof window !== "undefined" && (localStorage.getItem("interview_difficulty") as any)) || "medium";
  });
  const [mode, setMode] = useState<"video" | "voice" | "chat">(() => {
    return (typeof window !== "undefined" && (localStorage.getItem("interview_mode") as any)) || "video";
  });

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("interview_current_question");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return null;
  });
  const [questionIndex, setQuestionIndex] = useState(() => {
    return (typeof window !== "undefined" && Number(localStorage.getItem("interview_question_index"))) || 0;
  });
  const [previousQuestions, setPreviousQuestions] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("interview_prev_questions");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [];
  });
  const [userAnswer, setUserAnswer] = useState(() => {
    return (typeof window !== "undefined" && localStorage.getItem("interview_user_answer")) || "";
  });
  const [evaluation, setEvaluation] = useState<Evaluation | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("interview_evaluation");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [scores, setScores] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("interview_scores");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [];
  });

  // Media Stream & Hardware Control States
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [cameraStatus, setCameraStatus] = useState<"granted" | "denied" | "unavailable" | "prompt">("prompt");
  const [micStatus, setMicStatus] = useState<"granted" | "denied" | "unavailable" | "prompt">("prompt");
  const [studioAvatarMode, setStudioAvatarMode] = useState(false);
  const [showTroubleshooter, setShowTroubleshooter] = useState(false);

  // Audio Level Analyser via Web Audio API
  const [audioLevel, setAudioLevel] = useState(0);

  // Dictation / Voice Input States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const recordingTimerRef = useRef<any>(null);

  const totalQuestions = 10;

  // Persist State to LocalStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("interview_step", step);
    localStorage.setItem("interview_role", role);
    localStorage.setItem("interview_custom_role", customRole);
    localStorage.setItem("interview_difficulty", difficulty);
    localStorage.setItem("interview_mode", mode);
    localStorage.setItem("interview_interviewer_id", interviewerId);
    localStorage.setItem("interview_question_index", String(questionIndex));
    localStorage.setItem("interview_user_answer", userAnswer);
    if (currentQuestion) localStorage.setItem("interview_current_question", JSON.stringify(currentQuestion));
    if (previousQuestions) localStorage.setItem("interview_prev_questions", JSON.stringify(previousQuestions));
    if (evaluation) localStorage.setItem("interview_evaluation", JSON.stringify(evaluation));
    if (scores) localStorage.setItem("interview_scores", JSON.stringify(scores));
  }, [step, role, customRole, difficulty, mode, interviewerId, questionIndex, userAnswer, currentQuestion, previousQuestions, evaluation, scores]);

  // Insert spectrum animation keyframes
  useEffect(() => {
    if (typeof document !== "undefined") {
      const id = "remotion-spectrum-styles";
      if (!document.getElementById(id)) {
        const style = document.createElement("style");
        style.id = id;
        style.textContent = `
          @keyframes spectrumPulse {
            0% { transform: scaleY(0.25); }
            50% { transform: scaleY(1.0); }
            100% { transform: scaleY(0.4); }
          }
          @keyframes dialog-in {
            from { opacity: 0; transform: scale(0.94) translateY(6px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Callback ref for HTMLVideoElement to ensure stream binding
  const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
    videoElementRef.current = node;
    if (node && videoStream && cameraActive) {
      node.srcObject = videoStream;
      node.play().catch(() => {});
    }
  }, [videoStream, cameraActive]);

  // Bind video element whenever stream or cameraActive updates
  useEffect(() => {
    if (videoElementRef.current) {
      if (cameraActive && videoStream) {
        videoElementRef.current.srcObject = videoStream;
        videoElementRef.current.play().catch(() => {});
      } else {
        videoElementRef.current.srcObject = null;
      }
    }
  }, [videoStream, cameraActive]);

  // Web Audio API Audio Level Analyser
  useEffect(() => {
    if (!micActive || !videoStream) {
      setAudioLevel(0);
      return;
    }

    const audioTracks = videoStream.getAudioTracks();
    if (audioTracks.length === 0 || !audioTracks[0].enabled) {
      setAudioLevel(0);
      return;
    }

    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let animId: number;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source = audioCtx.createMediaStreamSource(videoStream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateLevel = () => {
          if (!analyser) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setAudioLevel(Math.min(1, avg / 120));
          animId = requestAnimationFrame(updateLevel);
        };
        updateLevel();
      }
    } catch (e) {
      console.warn("Web Audio API analyser initialized with fallback:", e);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (source) source.disconnect();
      if (audioCtx && audioCtx.state !== "closed") {
        audioCtx.close().catch(() => {});
      }
    };
  }, [videoStream, micActive]);

  // Gracefully probe and initialize devices when entering interview mode
  const initializeMediaDevices = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraStatus("unavailable");
      setMicStatus("unavailable");
      setStudioAvatarMode(true);
      return;
    }

    // Check available physical hardware devices
    let hasCamera = false;
    let hasMic = false;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      hasCamera = devices.some((d) => d.kind === "videoinput");
      hasMic = devices.some((d) => d.kind === "audioinput");
    } catch {
      hasCamera = true;
      hasMic = true;
    }

    if (!hasCamera) setCameraStatus("unavailable");
    if (!hasMic) setMicStatus("unavailable");

    // Acquire stream safely
    try {
      if (mode === "video" && hasCamera) {
        // Request video and audio
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          audio: hasMic ? { echoCancellation: true, noiseSuppression: true } : false,
        });

        setVideoStream(stream);
        setCameraActive(true);
        setCameraStatus("granted");
        setStudioAvatarMode(false);

        if (stream.getAudioTracks().length > 0) {
          setMicActive(true);
          setMicStatus("granted");
        } else {
          setMicActive(false);
        }
      } else if (hasMic) {
        // Audio only or Studio Avatar mode
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
        });

        setVideoStream(stream);
        setCameraActive(false);
        setStudioAvatarMode(true);
        setMicActive(true);
        setMicStatus("granted");
      } else {
        // No camera or mic hardware detected
        setCameraActive(false);
        setMicActive(false);
        setStudioAvatarMode(true);
      }
    } catch (err: any) {
      console.warn("Initial media access handled with Studio Avatar fallback:", err);

      if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
        if (mode === "video") setCameraStatus("denied");
        setMicStatus("denied");
      } else if (err?.name === "NotFoundError" || err?.name === "DevicesNotFoundError") {
        setCameraStatus("unavailable");
        setMicStatus("unavailable");
      }

      // Try audio-only if video failed
      if (mode === "video") {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setVideoStream(audioStream);
          setCameraActive(false);
          setCameraStatus("denied");
          setMicActive(true);
          setMicStatus("granted");
          setStudioAvatarMode(true);
          return;
        } catch {
          // Both failed
        }
      }

      setCameraActive(false);
      setMicActive(false);
      setStudioAvatarMode(true);
    }
  }, [mode]);

  useEffect(() => {
    if (step === "interview") {
      initializeMediaDevices();
    }
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [step, initializeMediaDevices]);

  // Toggle Camera with device resilience
  const toggleCamera = async () => {
    if (cameraActive) {
      // Switch to Studio Avatar Mode
      if (videoStream) {
        videoStream.getVideoTracks().forEach((track) => {
          track.enabled = false;
        });
      }
      setCameraActive(false);
      setStudioAvatarMode(true);
      toast.info("Switched to Studio Candidate Avatar");
      return;
    }

    // Try turning camera ON
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        toast.info("Media devices not supported in this browser. Studio Avatar Mode is active.");
        setStudioAvatarMode(true);
        return;
      }

      // If existing stream has a video track, re-enable it
      const existingVideoTracks = videoStream?.getVideoTracks() || [];
      if (existingVideoTracks.length > 0) {
        existingVideoTracks.forEach((t) => (t.enabled = true));
        setCameraActive(true);
        setStudioAvatarMode(false);
        setCameraStatus("granted");
        toast.success("Webcam HD connected");
        return;
      }

      // Fetch new video track
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
      });

      const videoTrack = newStream.getVideoTracks()[0];
      if (videoTrack) {
        if (videoStream) {
          videoStream.addTrack(videoTrack);
        } else {
          setVideoStream(newStream);
        }
        setCameraActive(true);
        setStudioAvatarMode(false);
        setCameraStatus("granted");
        toast.success("Webcam HD connected");
      }
    } catch (err: any) {
      console.warn("Camera request error:", err);
      if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
        setCameraStatus("denied");
        toast.info("Camera permission is not enabled. Switched to Studio Avatar Mode.");
      } else if (err?.name === "NotFoundError") {
        setCameraStatus("unavailable");
        toast.info("No physical webcam detected. Switched to Studio Avatar Mode.");
      } else if (err?.name === "NotReadableError") {
        toast.warning("Camera is in use by another app. Switched to Studio Avatar Mode.");
      } else {
        toast.info("Switched to Studio Avatar Mode.");
      }
      setCameraActive(false);
      setStudioAvatarMode(true);
    }
  };

  // Toggle Microphone with graceful status
  const toggleMic = async () => {
    if (micActive) {
      // Mute mic
      if (videoStream) {
        videoStream.getAudioTracks().forEach((t) => (t.enabled = false));
      }
      setMicActive(false);
      toast.info("Microphone muted");
      return;
    }

    // Unmute or acquire mic
    try {
      const existingAudioTracks = videoStream?.getAudioTracks() || [];
      if (existingAudioTracks.length > 0) {
        existingAudioTracks.forEach((t) => (t.enabled = true));
        setMicActive(true);
        setMicStatus("granted");
        toast.success("Microphone active");
        return;
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      const audioTrack = newStream.getAudioTracks()[0];
      if (audioTrack) {
        if (videoStream) {
          videoStream.addTrack(audioTrack);
        } else {
          setVideoStream(newStream);
        }
        setMicActive(true);
        setMicStatus("granted");
        toast.success("Microphone active");
      }
    } catch (err: any) {
      console.warn("Microphone request error:", err);
      setMicActive(false);
      if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
        setMicStatus("denied");
        toast.info("Microphone permission blocked. Text response mode is active.");
      } else {
        setMicStatus("unavailable");
        toast.info("Audio device unavailable. Text response mode is active.");
      }
    }
  };

  // Human Interviewer Text-to-Speech
  const speakText = useCallback(
    (text: string) => {
      if (isMuted || !synthRef.current) return;
      try {
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.96;
        utterance.pitch = selectedInterviewer.gender === "female" ? 1.05 : 0.95;

        const voices = synthRef.current.getVoices?.() || [];
        if (voices.length > 0) {
          const preferredVoice = voices.find((v: any) =>
            selectedInterviewer.gender === "female"
              ? /female|samantha|zira|victoria|karen|google.*us.*female/i.test(v.name)
              : /male|david|alex|daniel|george|google.*us.*male/i.test(v.name),
          );
          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
        }

        utterance.onstart = () => setAiSpeaking(true);
        utterance.onend = () => setAiSpeaking(false);
        utterance.onerror = () => setAiSpeaking(false);

        synthRef.current.speak(utterance);
      } catch {
        setAiSpeaking(false);
      }
    },
    [isMuted, selectedInterviewer],
  );

  // Dictation / Voice Input Recognition
  const startVoiceRecognition = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.info("Voice transcription is not supported in this browser. You can type your answer directly.");
      textareaRef.current?.focus();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      let initialAnswer = userAnswer ? `${userAnswer.trim()} ` : "";

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserAnswer(`${initialAnswer}${transcript}`);
      };

      recognition.onerror = (event: any) => {
        setIsRecording(false);
        clearInterval(recordingTimerRef.current);
        if (event?.error === "not-allowed" || event?.error === "service-not-allowed") {
          setMicStatus("denied");
          toast.info("Microphone access blocked. Type your response in the box below.");
        } else if (event?.error === "no-speech") {
          toast.info("No speech detected. Speak clearly into your mic or type below.");
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        clearInterval(recordingTimerRef.current);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
      toast.success("Voice recording started. Speak your answer!");
    } catch (e: any) {
      console.warn("Voice recognition error:", e);
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    }
  }, [userAnswer]);

  const stopVoiceRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
    clearInterval(recordingTimerRef.current);
  }, []);

  const toggleVoiceRecording = () => {
    if (isRecording) {
      stopVoiceRecognition();
      toast.info("Voice recording saved to your answer box");
    } else {
      startVoiceRecognition();
    }
  };

  // Load question with AI generator + rich fallback presets
  const loadQuestion = useCallback(
    async (idx: number) => {
      setLoading(true);

      const roleToUse = (role || customRole || "Software Engineer").trim();
      const roleKey = getRoleKey(roleToUse);
      const presets = PRESET_QUESTIONS[roleKey];

      if (presets && presets[idx]) {
        setCurrentQuestion(presets[idx]);
        setPreviousQuestions((prev) => [...prev, presets[idx].question]);
        setLoading(false);
        speakText(presets[idx].question);
        return;
      }

      try {
        const res = await generateQuestion({
          data: {
            role: roleToUse,
            mode,
            difficulty,
            questionIndex: idx,
            previousQuestions,
          },
        });

        const qObj: Question =
          res.question && typeof res.question === "object"
            ? res.question
            : typeof res.question === "string"
              ? {
                  question: res.question,
                  type: (res as any).type || "technical",
                  tips: (res as any).tips || (res as any).hints || [],
                  expectedPoints: (res as any).expectedPoints || (res as any).idealAnswerOutline || [],
                  followUp: (res as any).followUp || "",
                }
              : (res as any)?.questionText
                ? {
                    question: (res as any).questionText,
                    type: (res as any).type || "technical",
                    tips: (res as any).tips || [],
                    expectedPoints: (res as any).expectedPoints || [],
                    followUp: (res as any).followUp || "",
                  }
                : getDefaultQuestionForRole(roleToUse, idx);

        if (qObj && qObj.question) {
          setCurrentQuestion(qObj);
          setPreviousQuestions((prev) => [...prev, qObj.question]);
          speakText(qObj.question);
        } else {
          const fallback = getDefaultQuestionForRole(roleToUse, idx);
          setCurrentQuestion(fallback);
          setPreviousQuestions((prev) => [...prev, fallback.question]);
          speakText(fallback.question);
        }
      } catch (err: any) {
        console.warn("AI generation failed, using role preset:", err);
        const fallback = getDefaultQuestionForRole(roleToUse, idx);
        setCurrentQuestion(fallback);
        setPreviousQuestions((prev) => [...prev, fallback.question]);
        speakText(fallback.question);
      } finally {
        setLoading(false);
      }
    },
    [role, customRole, mode, difficulty, previousQuestions, speakText],
  );

  const handleStart = () => {
    setStep("interview");
    setQuestionIndex(0);
    setScores([]);
    setPreviousQuestions([]);
    setUserAnswer("");
    setEvaluation(null);
    loadQuestion(0);
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !currentQuestion) {
      toast.error("Please provide your answer before submitting");
      return;
    }

    setEvaluating(true);
    stopVoiceRecognition();

    try {
      const res = await evaluateAnswer({
        data: {
          role: role || customRole || "Software Engineer",
          question: currentQuestion.question,
          answer: userAnswer,
          expectedPoints: currentQuestion.expectedPoints,
          difficulty,
        },
      });

      const evalData = (res as any)?.evaluation || res;
      if (evalData && typeof evalData.score === "number") {
        setEvaluation(evalData);
        setScores((prev) => [...prev, evalData.score]);
        toast.success(`Answer evaluated: ${evalData.score}/100!`);
      } else {
        toast.error("Could not parse evaluation response. Please retry.");
      }
    } catch (err: any) {
      console.error("Evaluation service error:", err);
      toast.error("Evaluation service encountered an issue. Please try again.");
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (questionIndex + 1 >= totalQuestions) {
      setStep("results");
      return;
    }
    setQuestionIndex((prev) => prev + 1);
    setCurrentQuestion(null);
    setEvaluation(null);
    setUserAnswer("");
    setShowTips(false);
    loadQuestion(questionIndex + 1);
  };

  const handleRestart = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
    setStep("setup");
    setCurrentQuestion(null);
    setEvaluation(null);
    setUserAnswer("");
    setScores([]);
    setQuestionIndex(0);
    setPreviousQuestions([]);
    setCameraActive(false);
  };

  // Helper to insert STAR Method Framework
  const insertStarPrompt = (section: string) => {
    const template = `\n[${section.toUpperCase()}]: `;
    setUserAnswer((prev) => `${prev.trim()}${template}`);
    textareaRef.current?.focus();
  };

  const avgScore =
    scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  // Download PDF Report
  const downloadInterviewPdf = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("AI Mock Interview Scorecard & Feedback Report", 15, 15);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      let y = 25;
      doc.text(`Role: ${role || customRole || "Software Engineer"} (${difficulty.toUpperCase()} Level)`, 15, y);
      y += 6;
      doc.text(
        `Overall Score: ${avgScore}/100 | Grade: ${
          avgScore >= 80 ? "A+" : avgScore >= 70 ? "A" : avgScore >= 50 ? "B" : avgScore >= 30 ? "C" : "D"
        }`,
        15,
        y,
      );
      y += 6;
      doc.text(`Questions Answered: ${scores.length} / ${totalQuestions}`, 15, y);
      y += 8;

      doc.setDrawColor(200, 200, 200);
      doc.line(15, y, 195, y);
      y += 8;

      doc.setFont("helvetica", "bold");
      doc.text("QUESTION BY QUESTION BREAKDOWN:", 15, y);
      y += 8;

      scores.forEach((sc, i) => {
        if (y > 270) {
          doc.addPage();
          y = 15;
        }
        doc.setFont("helvetica", "bold");
        doc.text(`Question ${i + 1}: ${sc}/100 Match`, 15, y);
        y += 6;
      });

      doc.save(`Interview_Scorecard_${(role || customRole || "Career").replace(/\s+/g, "_")}.pdf`);
      toast.success("Interview PDF Report downloaded!");
    } catch {
      toast.error("Failed to generate PDF report download");
    }
  };

  // Download Word Document (.docx)
  const downloadInterviewWord = () => {
    const docHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Interview Scorecard</title>
      <style>body { font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 800px; margin: auto; padding: 20px; }</style>
      </head>
      <body>
        <h1>AI Mock Interview Scorecard — ${role || customRole || "Software Engineer"}</h1>
        <p><b>Average Score:</b> ${avgScore}/100</p>
        <p><b>Grade:</b> ${avgScore >= 80 ? "A+" : avgScore >= 70 ? "A" : avgScore >= 50 ? "B" : avgScore >= 30 ? "C" : "D"}</p>
        <p><b>Questions Evaluated:</b> ${scores.length}</p>
      </body>
      </html>
    `;
    const blob = new Blob(["\ufeff", docHtml], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: `Interview_Scorecard_${(role || customRole || "Career").replace(/\s+/g, "_")}.docx`,
    });
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Word Interview Transcript downloaded!");
  };

  // Download Text Report
  const downloadInterviewTxt = () => {
    const textContent = `AI MOCK INTERVIEW SCORECARD & REPORT
Role: ${role || customRole || "Software Engineer"}
Difficulty: ${difficulty.toUpperCase()}
Overall Score: ${avgScore}/100
Grade: ${avgScore >= 80 ? "A+" : avgScore >= 70 ? "A" : avgScore >= 50 ? "B" : avgScore >= 30 ? "C" : "D"}
Questions Evaluated: ${scores.length}

SCORES:
${scores.map((sc, i) => `Q${i + 1}: ${sc}/100`).join("\n")}
`;
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: `Interview_Scorecard_${(role || customRole || "Career").replace(/\s+/g, "_")}.txt`,
    });
    a.click();
    toast.success("Text Interview Report downloaded!");
  };

  // Word count & speech duration estimate
  const wordCount = userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0;
  const estimatedSpeakMinutes = Math.max(1, Math.round(wordCount / 130));

  const mainContent = (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Studio Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700 grid place-items-center shadow-lg shadow-indigo-950/50">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
                Interview Prep Studio
              </h1>
              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-[10px] font-semibold">
                AI 4.0 Pro
              </Badge>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">
              Practice mock interviews with realistic AI interviewers, speech recognition & instant scoring
            </p>
          </div>
        </div>

        {step === "interview" && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs font-semibold gap-1.5 border-slate-700 bg-slate-900/80 text-slate-300 hover:bg-slate-800"
              onClick={() => setShowTroubleshooter(true)}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-400" />
              <span>Devices</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs font-bold gap-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/30 shrink-0 cursor-pointer"
              onClick={() => setShowExitDialog(true)}
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>Exit Session</span>
            </Button>
          </div>
        )}
      </div>

      {/* ── STEP 1: SETUP SCREEN ── */}
      {step === "setup" && (
        <div className="space-y-6">
          {/* Select Job Role */}
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 space-y-4 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-white flex items-center gap-2 text-base">
                <Briefcase className="h-4 w-4 text-indigo-400" /> 1. Select Target Job Role
              </h2>
              {role && (
                <span className="text-xs font-medium text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  Selected: {JOB_ROLES.find((r) => r.id === role)?.label || customRole || role}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {JOB_ROLES.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setRole(r.id);
                      setCustomRole("");
                    }}
                    className={cn(
                      "p-4 rounded-2xl border text-left transition-all cursor-pointer relative group",
                      isSelected
                        ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-950/30 ring-2 ring-indigo-500/50"
                        : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-800/50",
                    )}
                  >
                    <Icon className={cn("h-6 w-6 mb-2.5 transition-colors", isSelected ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200")} />
                    <span className="text-xs sm:text-sm font-bold block truncate text-slate-100">{r.label}</span>
                    {isSelected && (
                      <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                Or type ANY custom role for interview preparation:
              </label>
              <Input
                placeholder="e.g. Cloud Solutions Architect, Blockchain Developer, Quant Analyst, AI Engineer..."
                value={customRole}
                onChange={(e) => {
                  setCustomRole(e.target.value);
                  setRole(e.target.value);
                }}
                className="h-10 text-xs sm:text-sm font-semibold rounded-xl bg-slate-950/80 border-slate-700/80 focus-visible:ring-indigo-500"
              />
            </div>
          </div>

          {/* Select Mode */}
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 space-y-4 shadow-xl backdrop-blur-xl">
            <h2 className="font-display font-semibold text-white flex items-center gap-2 text-base">
              <MessageSquare className="h-4 w-4 text-indigo-400" /> 2. Select Interview Mode
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MODES.map((m) => {
                const Icon = m.icon;
                const isSelected = mode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id as any)}
                    className={cn(
                      "p-4 rounded-2xl border text-center transition-all cursor-pointer",
                      isSelected
                        ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-950/30 ring-2 ring-indigo-500/50"
                        : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-800/50",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-6 w-6 mx-auto mb-2 transition-colors",
                        isSelected ? "text-indigo-400" : "text-slate-400",
                      )}
                    />
                    <span className="text-sm font-bold block text-slate-100">{m.label}</span>
                    <span className="text-xs text-slate-400 mt-0.5 block">{m.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Select Human AI Interviewer */}
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 space-y-4 shadow-xl backdrop-blur-xl">
            <div>
              <h2 className="font-display font-semibold text-white flex items-center gap-2 text-base">
                <Target className="h-4 w-4 text-indigo-400" /> 3. Select Human AI Interviewer
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose an expert interviewer tailored to your target industry and technical depth.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {HUMAN_INTERVIEWERS.map((interviewer) => {
                const isSelected = interviewer.id === interviewerId;
                return (
                  <button
                    key={interviewer.id}
                    type="button"
                    onClick={() => setInterviewerId(interviewer.id)}
                    className={cn(
                      "p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative group",
                      isSelected
                        ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-950/30 ring-2 ring-indigo-500/50"
                        : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-800/50",
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
                        <img
                          src={interviewer.avatarUrl}
                          alt={interviewer.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate text-slate-100">
                          {interviewer.name}
                        </p>
                        <p className="text-[11px] text-indigo-400 font-semibold truncate">
                          {interviewer.company}
                        </p>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-2.5">
                      {interviewer.bio}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px]">
                      <span className="font-semibold text-slate-400">{interviewer.badge}</span>
                      {isSelected ? (
                        <span className="text-indigo-400 font-bold flex items-center gap-1">
                          <Check className="h-3 w-3" /> Selected
                        </span>
                      ) : (
                        <span className="text-slate-500 group-hover:text-slate-300">
                          Select Lead
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
            <h2 className="font-display font-semibold text-white mb-4 flex items-center gap-2 text-base">
              <Award className="h-4 w-4 text-indigo-400" /> 4. Difficulty Level
            </h2>
            <div className="flex flex-wrap gap-3">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id as any)}
                  className={cn(
                    "px-6 py-2.5 rounded-xl border font-semibold text-xs transition-all cursor-pointer",
                    difficulty === d.id
                      ? "border-indigo-500 bg-indigo-500/15 shadow-md text-white ring-2 ring-indigo-500/40"
                      : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200",
                  )}
                >
                  <span className={cn("px-2 py-0.5 rounded-md", d.color)}>{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            onClick={handleStart}
            disabled={!role}
            className="w-full sm:w-auto h-12 px-8 font-display font-bold text-base rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-950/50 cursor-pointer"
          >
            Start Practice Interview <ChevronRight className="h-5 w-5 ml-1.5" />
          </Button>
        </div>
      )}

      {/* ── STEP 2: LIVE INTERVIEW STAGE ── */}
      {step === "interview" && (
        <div className="space-y-6">
          {/* Progress & Question Counter Bar */}
          <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800/80 p-3 rounded-2xl backdrop-blur-md">
            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-300 font-bold shrink-0">
              Question {questionIndex + 1} of {totalQuestions}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-slate-800 bg-slate-900/40">
              <div className="relative mb-4">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
                <Sparkles className="h-4 w-4 text-emerald-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                {selectedInterviewer.name} is preparing your next question...
              </p>
              <p className="text-xs text-slate-400 mt-1">Analyzing role criteria and difficulty curve</p>
            </div>
          ) : currentQuestion ? (
            <div className="space-y-5">
              {/* Remotion Broadcast Double Stage Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Real Human AI Interviewer Stage */}
                <HumanInterviewerDisplay
                  interviewer={selectedInterviewer}
                  aiSpeaking={aiSpeaking}
                  evaluating={evaluating}
                  isRecording={isRecording}
                  onReplayAudio={() => speakText(currentQuestion.question)}
                  isMuted={isMuted}
                  onToggleMute={() => setIsMuted(!isMuted)}
                />

                {/* Candidate Studio Stage */}
                <CandidateStudioDisplay
                  cameraActive={cameraActive}
                  micActive={micActive}
                  isRecording={isRecording}
                  recordingTime={recordingSeconds}
                  audioLevel={audioLevel}
                  videoRef={setVideoRef}
                  onToggleCamera={toggleCamera}
                  onToggleMic={toggleMic}
                  onToggleVoiceRecording={toggleVoiceRecording}
                  onOpenTroubleshooter={() => setShowTroubleshooter(true)}
                  studioAvatarMode={studioAvatarMode}
                  candidateName="Candidate Response"
                />
              </div>

              {/* Question Headline Card */}
              <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs capitalize border-indigo-500/40 bg-indigo-500/10 text-indigo-300 font-bold">
                      {currentQuestion.type || "Technical"}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize border-slate-700 bg-slate-800/60 text-slate-300">
                      {difficulty}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTips(!showTips)}
                      className={cn(
                        "text-xs font-semibold h-8 rounded-xl",
                        showTips ? "bg-amber-500/15 text-amber-300" : "text-slate-400 hover:text-slate-200",
                      )}
                    >
                      <Lightbulb className="h-3.5 w-3.5 mr-1 text-amber-400" />
                      Hints & Tips
                    </Button>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-display font-bold leading-relaxed text-slate-100">
                  {currentQuestion.question}
                </h3>

                {showTips && currentQuestion.tips?.length > 0 && (
                  <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 animate-in fade-in slide-in-from-top-2">
                    <p className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                      <Lightbulb className="h-3.5 w-3.5" /> Key Architectural Concepts to Cover:
                    </p>
                    <ul className="text-xs text-amber-200/90 space-y-1 pl-1">
                      {currentQuestion.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Candidate Response Workspace */}
              {!evaluation && (
                <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6 space-y-4 shadow-xl backdrop-blur-xl">
                  {/* STAR Method Insertion Helpers */}
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="font-semibold text-slate-300">STAR Structure:</span>
                      <button
                        type="button"
                        onClick={() => insertStarPrompt("Situation")}
                        className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-[11px] cursor-pointer"
                      >
                        Situation
                      </button>
                      <button
                        type="button"
                        onClick={() => insertStarPrompt("Task")}
                        className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-[11px] cursor-pointer"
                      >
                        Task
                      </button>
                      <button
                        type="button"
                        onClick={() => insertStarPrompt("Action")}
                        className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-[11px] cursor-pointer"
                      >
                        Action
                      </button>
                      <button
                        type="button"
                        onClick={() => insertStarPrompt("Result")}
                        className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-[11px] cursor-pointer"
                      >
                        Result
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{wordCount} words (~{estimatedSpeakMinutes} min speech)</span>
                      {userAnswer && (
                        <button
                          type="button"
                          onClick={() => setUserAnswer("")}
                          className="text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                        >
                          Clear Text
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Textarea */}
                  <Textarea
                    ref={textareaRef}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your structured answer here, or click 'Voice Answer' to dictate your speech in real time..."
                    rows={6}
                    className="resize-none text-xs sm:text-sm bg-slate-950/80 border-slate-700/80 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500 rounded-2xl"
                  />

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!userAnswer.trim() || evaluating}
                    className="w-full h-11 font-display font-bold text-sm rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-950/50 cursor-pointer"
                  >
                    {evaluating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Evaluating Response...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        <span>Submit Answer for Evaluation</span>
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* ── Evaluation Results Card ── */}
              {evaluation && (
                <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 space-y-5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">AI Evaluation Scorecard</h3>
                      <p className="text-xs text-slate-400">Feedback from {selectedInterviewer.name}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span
                          className={cn(
                            "text-3xl font-display font-black",
                            evaluation.score >= 80
                              ? "text-emerald-400"
                              : evaluation.score >= 60
                                ? "text-indigo-400"
                                : evaluation.score >= 40
                                  ? "text-amber-400"
                                  : "text-rose-400",
                          )}
                        >
                          {evaluation.score}
                        </span>
                        <span className="text-xs text-slate-400 block font-semibold">/ 100 Match</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                    {evaluation.feedback}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {evaluation.strengths?.length > 0 && (
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" /> Demonstrated Strengths
                        </p>
                        <ul className="text-xs space-y-1.5 text-slate-300">
                          {evaluation.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 font-bold">•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {evaluation.improvements?.length > 0 && (
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                        <p className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                          <Target className="h-4 w-4" /> Opportunities for Growth
                        </p>
                        <ul className="text-xs space-y-1.5 text-slate-300">
                          {evaluation.improvements.map((s, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-amber-400 font-bold">•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {evaluation.modelAnswer && (
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5" /> Model Architect Answer:
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            navigator.clipboard.writeText(evaluation.modelAnswer);
                            toast.success("Model answer copied to clipboard");
                          }}
                          className="h-6 text-[10px] text-slate-400 hover:text-white"
                        >
                          <Copy className="h-3 w-3 mr-1" /> Copy Answer
                        </Button>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{evaluation.modelAnswer}</p>
                    </div>
                  )}

                  <Button
                    onClick={handleNextQuestion}
                    className="w-full h-11 font-display font-bold text-sm rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg cursor-pointer"
                  >
                    {questionIndex + 1 >= totalQuestions ? "See Final Scorecard" : "Advance to Next Question"}{" "}
                    <ChevronRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* ── STEP 3: RESULTS SCORECARD ── */}
      {step === "results" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-4 shadow-lg shadow-indigo-950/50">
              <Award className="h-8 w-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
              Interview Complete!
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Executive performance report for {role || customRole || "Software Engineer"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto mb-8">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <p className="text-3xl font-display font-black text-indigo-400">{avgScore}</p>
                <p className="text-xs text-slate-400 mt-1 font-semibold">Average Match</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <p className="text-3xl font-display font-black text-white">{scores.length}</p>
                <p className="text-xs text-slate-400 mt-1 font-semibold">Questions Covered</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <p
                  className={cn(
                    "text-3xl font-display font-black",
                    avgScore >= 80
                      ? "text-emerald-400"
                      : avgScore >= 60
                        ? "text-indigo-400"
                        : avgScore >= 40
                          ? "text-amber-400"
                          : "text-rose-400",
                  )}
                >
                  {avgScore >= 80 ? "A+" : avgScore >= 70 ? "A" : avgScore >= 50 ? "B" : avgScore >= 30 ? "C" : "D"}
                </p>
                <p className="text-xs text-slate-400 mt-1 font-semibold">Executive Grade</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
              <Button
                onClick={downloadInterviewPdf}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 rounded-full px-4"
              >
                <FileDown className="h-4 w-4" /> Download PDF Report
              </Button>
              <Button
                onClick={downloadInterviewWord}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 rounded-full px-4"
              >
                <FileText className="h-4 w-4" /> Word (.docx)
              </Button>
              <Button
                onClick={downloadInterviewTxt}
                variant="outline"
                className="font-bold text-xs gap-1.5 rounded-full border-slate-700 text-slate-300 hover:bg-slate-800 px-4"
              >
                <Download className="h-4 w-4" /> Text (.txt)
              </Button>
            </div>

            <Button
              onClick={handleRestart}
              className="font-display font-bold text-sm rounded-xl px-6 bg-slate-800 hover:bg-slate-700 text-slate-100"
            >
              <RotateCcw className="h-4 w-4 mr-2" /> Start New Interview
            </Button>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
            <h3 className="font-display font-bold text-white mb-4">Question Breakdown</h3>
            <div className="space-y-3">
              {scores.map((score, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-semibold w-24">Question {i + 1}</span>
                  <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        score >= 80
                          ? "bg-emerald-500"
                          : score >= 60
                            ? "bg-indigo-500"
                            : score >= 40
                              ? "bg-amber-500"
                              : "bg-rose-500",
                      )}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-200 w-12 text-right">{score}/100</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  {/* Exit Confirmation Dialog */}
  const exitDialog = showExitDialog && (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(12px)", backgroundColor: "rgba(0,0,0,0.8)" }}
      onClick={() => setShowExitDialog(false)}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl border border-rose-500/30 bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950/40 p-6 shadow-2xl text-slate-100"
        style={{ animation: "dialog-in 0.2s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h3 className="text-center text-lg font-display font-bold text-white mb-1">Exit Interview?</h3>
        <p className="text-center text-xs text-slate-400 mb-6 leading-relaxed">
          Your progress for this interview session will be cleared. Are you sure you want to exit?
        </p>
        <div className="flex gap-3">
          <button
            className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 transition hover:bg-slate-700 active:scale-95 cursor-pointer"
            onClick={() => setShowExitDialog(false)}
          >
            Continue Session
          </button>
          <button
            className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-rose-700 active:scale-95 cursor-pointer shadow-lg shadow-rose-950/50"
            onClick={() => {
              setShowExitDialog(false);
              stopVoiceRecognition();
              handleRestart();
              toast.info("Interview session ended");
            }}
          >
            Exit & Reset
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {embedded ? mainContent : <AppShell>{mainContent}</AppShell>}
      {exitDialog}
      <DeviceTroubleshooterModal
        isOpen={showTroubleshooter}
        onClose={() => setShowTroubleshooter(false)}
        onRetryDevices={initializeMediaDevices}
        onUseStudioMode={() => {
          setCameraActive(false);
          setStudioAvatarMode(true);
          toast.info("Studio Candidate Avatar active");
        }}
        cameraStatus={cameraStatus}
        micStatus={micStatus}
      />
    </>
  );
}
