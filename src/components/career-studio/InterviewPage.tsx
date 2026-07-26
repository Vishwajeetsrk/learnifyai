import { useState, useRef, useCallback, useEffect } from "react";
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
  BarChart3 as BarChart3Icon,
  Wrench,
  Smartphone,
  Clipboard,
  Check,
  Play,
  Pause,
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
import { ThreeAvatarCanvas } from "@/components/career-studio/ThreeAvatarCanvas";
import { Link } from "@tanstack/react-router";

const JOB_ROLES = [
  { id: "frontend", label: "Frontend Developer", icon: Palette },
  { id: "backend", label: "Backend Developer", icon: Settings },
  { id: "fullstack", label: "Full-Stack Developer", icon: Rocket },
  { id: "dataScience", label: "Data Scientist", icon: BarChart3Icon },
  { id: "devops", label: "DevOps Engineer", icon: Wrench },
  { id: "mobile", label: "Mobile Developer", icon: Smartphone },
  { id: "pm", label: "Product Manager", icon: Clipboard },
  { id: "designer", label: "UI/UX Designer", icon: Target },
];

const DIFFICULTIES = [
  { id: "easy", label: "Easy", color: "text-emerald-500 bg-emerald-500/10" },
  { id: "medium", label: "Medium", color: "text-yellow-500 bg-yellow-500/10" },
  { id: "hard", label: "Hard", color: "text-red-500 bg-red-500/10" },
];

const MODES = [
  { id: "chat", label: "Chat", icon: MessageSquare, desc: "Type your answers" },
  { id: "voice", label: "Voice", icon: Mic, desc: "Speak your answers" },
  { id: "video", label: "Video", icon: Video, desc: "Record video responses" },
];

interface Question {
  question: string;
  type: string;
  tips: string[];
  expectedPoints: string[];
  followUp: string;
}

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

/* ────────────────────────────────────────────────────────────────
   LOCAL QUESTION PRESETS (From Tech Interview Handbooks)
──────────────────────────────────────────────────────────────── */
const PRESET_QUESTIONS: Record<string, Question[]> = {
  mobile: [
    {
      question:
        "What are the key differences between Android and iOS development, and how do you decide which platform to develop for first?",
      type: "technical",
      tips: [
        "Consider the market share and target audience",
        "Think about the development tools and languages used for each platform",
        "Reflect on the design and user experience guidelines for each platform",
      ],
      expectedPoints: [
        "Android uses Kotlin/Java & Android Studio; iOS uses Swift & Xcode",
        "Android has a larger global market share, iOS has higher monetization in premium markets",
        "Android UI fragmented across many devices; iOS has a highly standardized and closed ecosystem",
        "Decision depends on target user demographics, project budget, and developer expertise",
      ],
      followUp: "How does React Native or Flutter fit into this decision-making process?",
    },
    {
      question: "Explain the lifecycle of an Activity in Android vs. a View Controller in iOS.",
      type: "technical",
      tips: [
        "Contrast onCreate/onStart/onResume with viewDidLoad/viewWillAppear/viewDidAppear",
        "Explain memory warning handling in both",
        "Discuss state preservation",
      ],
      expectedPoints: [
        "Android Activity states: Created, Started, Resumed, Paused, Stopped, Destroyed",
        "iOS View Controller lifecycle: loadView, viewDidLoad, viewWillAppear, viewDidAppear, viewWillDisappear, viewDidDisappear",
        "Android handles configuration changes by destroying and recreating activities unless configured otherwise",
        "iOS View Controllers release resource-heavy views during low-memory warnings",
      ],
      followUp: "What is the modern state preservation mechanism in Jetpack Compose or SwiftUI?",
    },
  ],
  frontend: [
    {
      question:
        "Explain the virtual DOM reconciliation process in React, and how Fiber architecture improves UI responsiveness.",
      type: "technical",
      tips: [
        "Mention the diffing algorithm complexity",
        "Explain key properties for lists",
        "Discuss task prioritization in React 18 Fiber",
      ],
      expectedPoints: [
        "Diffing algorithm reduces reconciliation from O(n^3) to O(n) using heuristic assumptions",
        "Fibers allow breaking rendering work into incremental units/chunks",
        "Enables pause, reuse, and abort actions for update rendering tasks",
        "Prioritizes user interaction updates (e.g., typing) over background rendering",
      ],
      followUp: "How does concurrent rendering differ from traditional sync rendering?",
    },
  ],
};

const DEFAULT_PRESET: Question = {
  question:
    "What are the key differences between Android and iOS development, and how do you decide which platform to develop for first?",
  type: "technical",
  tips: [
    "Consider the market share and target audience",
    "Think about the development tools and languages used for each platform",
    "Reflect on the design and user experience guidelines for each platform",
  ],
  expectedPoints: [
    "Android uses Kotlin/Java; iOS uses Swift",
    "Android has larger market share; iOS has higher revenue per user",
    "Fragmented devices on Android vs unified ecosystem on iOS",
  ],
  followUp: "How do cross-platform frameworks impact this choice?",
};

/* ── Interactive SVG Talking Avatar ── */
function SVGAvatar({ viseme, avatarModel }: { viseme: string; avatarModel: string }) {
  const isSarah = avatarModel === "sarah";
  const name = isSarah ? "Sarah Jenkins" : "Alex Rivera";
  const role = isSarah ? "Senior Engineering Interviewer" : "Technical Recruitment Lead";

  const VISEMES: Record<string, string> = {
    X: "M45 56 Q50 59 55 56", // closed smile
    A: "M44 56 Q50 61 56 56 Q50 58 44 56 Z", // slightly open
    B: "M43 56 Q50 63 57 56 Q50 57 43 56 Z", // more open
    C: "M44 56 Q50 65 56 56 Q50 59 44 56 Z", // wide open vertical
    D: "M42 56 Q50 68 58 56 Q50 58 42 56 Z", // very wide open
    E: "M45 55 Q50 58 55 55 Q50 61 45 55 Z", // wide horizontal narrow vertical
    O: "M46 56 Q50 62 54 56 Q50 51 46 56 Z", // rounded circle
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <svg
        className="w-24 h-24 drop-shadow-xl"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Circle */}
        <circle cx="50" cy="50" r="48" fill={isSarah ? "url(#sarah-grad)" : "url(#alex-grad)"} />

        {/* Neck */}
        <rect x="46" y="65" width="8" height="12" fill="#FDBA74" rx="2" />

        {/* Head/Face */}
        <path
          d="M50 25 C36 25 33 36 33 48 C33 60 38 70 50 70 C62 70 67 60 67 48 C67 36 64 25 50 25 Z"
          fill="#FDBA74"
        />

        {/* Hair */}
        {isSarah ? (
          /* Female/Sarah Hair Style */
          <>
            <path
              d="M50 22 C34 22 30 30 30 45 C35 44 40 36 50 36 C60 36 65 44 70 45 C70 30 66 22 50 22 Z"
              fill="#451a03"
            />
            <path d="M30 40 C30 55 32 64 35 66 C35 50 33 45 33 40 Z" fill="#451a03" />
            <path d="M70 40 C70 55 68 64 65 66 C65 50 67 45 67 40 Z" fill="#451a03" />
          </>
        ) : (
          /* Male/Alex Hair Style */
          <path
            d="M50 21 C36 21 34 26 34 32 C38 32 44 26 50 28 C56 26 62 32 66 32 C66 26 64 21 50 21 Z"
            fill="#1e293b"
          />
        )}

        {/* Eyes (Blinking Animation via CSS Class) */}
        <ellipse
          cx="43"
          cy="46"
          rx="3"
          ry="3"
          fill="#1E293B"
          className="animate-blink"
          style={{ transformOrigin: "43px 46px" }}
        />
        <ellipse
          cx="57"
          cy="46"
          rx="3"
          ry="3"
          fill="#1E293B"
          className="animate-blink"
          style={{ transformOrigin: "57px 46px" }}
        />

        {/* Eyebrows */}
        <path
          d="M39 41 C41 40 44 41 45 42"
          stroke={isSarah ? "#451a03" : "#1e293b"}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M61 41 C59 40 56 41 55 42"
          stroke={isSarah ? "#451a03" : "#1e293b"}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Mouth (Talking / Lip Sync viseme Morphing) */}
        {viseme === "X" ? (
          <path
            d={VISEMES.X}
            stroke="#be123c"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <path d={VISEMES[viseme] || VISEMES.X} fill="#be123c" />
        )}

        {/* Glasses for Sarah */}
        {isSarah && (
          <>
            <rect
              x="37"
              y="43"
              width="11"
              height="7"
              rx="2"
              stroke="#0f172a"
              strokeWidth="1.2"
              fill="none"
            />
            <rect
              x="52"
              y="43"
              width="11"
              height="7"
              rx="2"
              stroke="#0f172a"
              strokeWidth="1.2"
              fill="none"
            />
            <line x1="48" y1="46" x2="52" y2="46" stroke="#0f172a" strokeWidth="1.2" />
          </>
        )}

        <defs>
          <linearGradient
            id="sarah-grad"
            x1="0"
            y1="0"
            x2="100"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6366F1" />
            <stop offset="1" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient
            id="alex-grad"
            x1="0"
            y1="0"
            x2="100"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>

      <div className="mt-2 text-sm font-bold">{name}</div>
      <div className="text-[10px] text-muted-foreground font-semibold">{role}</div>
    </div>
  );
}

/* ── Main Component ── */
export function InterviewPage({ embedded = false }: { embedded?: boolean }) {
  const generateQuestion = useServerFn(generateInterviewQuestion);
  const evaluateAnswer = useServerFn(evaluateInterviewAnswer);

  const [step, setStep] = useState<"setup" | "interview" | "results">("setup");
  const [role, setRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [avatarModel, setAvatarModel] = useState<"eric" | "sarah" | "alex">("eric");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [mode, setMode] = useState<"chat" | "voice" | "video">("chat");

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showTips, setShowTips] = useState(false);

  // Video & Audio Stream control states
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [viseme, setViseme] = useState("X");

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const totalQuestions = 10;

  // Blinking & Talking Avatar style tag insert
  useEffect(() => {
    if (typeof document !== "undefined") {
      const id = "avatar-animation-styles";
      if (!document.getElementById(id)) {
        const style = document.createElement("style");
        style.id = id;
        style.textContent = `
          @keyframes blink { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
          @keyframes talk { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.4); } }
          .animate-blink { animation: blink 4s infinite; }
          .animate-talk { animation: talk 0.18s infinite; }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  // Initialize camera/mic for video/voice modes
  useEffect(() => {
    if (
      step === "interview" &&
      (mode === "video" || mode === "voice") &&
      typeof window !== "undefined"
    ) {
      navigator.mediaDevices
        ?.getUserMedia({ video: mode === "video", audio: true })
        .then((stream) => {
          setVideoStream(stream);
          setCameraActive(mode === "video");
          setMicActive(true);
          if (videoRef.current && mode === "video") {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn("Media devices access error:", err);
          setCameraActive(false);
        });

      return () => {
        if (videoStream) {
          videoStream.getTracks().forEach((track) => track.stop());
        }
      };
    }
  }, [step, mode]);

  useEffect(() => {
    if (!aiSpeaking) {
      setViseme("X");
      return;
    }
    const visemeKeys = ["A", "B", "C", "D", "E", "O"];
    const timer = setInterval(() => {
      const nextViseme = visemeKeys[Math.floor(Math.random() * visemeKeys.length)];
      setViseme(nextViseme);
    }, 100);
    return () => clearInterval(timer);
  }, [aiSpeaking]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const speakText = useCallback(
    (text: string) => {
      if (isMuted || !synthRef.current) return;
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onstart = () => setAiSpeaking(true);
      utterance.onend = () => setAiSpeaking(false);
      utterance.onerror = () => setAiSpeaking(false);

      synthRef.current.speak(utterance);
    },
    [isMuted],
  );

  const startVoiceRecognition = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return toast.warning("Speech recognition is not supported in this browser.");
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setUserAnswer(transcript);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, []);

  const stopVoiceRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const toggleCamera = () => {
    if (videoStream) {
      const tracks = videoStream.getVideoTracks();
      tracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setCameraActive(!cameraActive);
      toast.success(cameraActive ? "Webcam feed paused" : "Webcam feed started");
    }
  };

  const toggleMic = () => {
    if (videoStream) {
      const tracks = videoStream.getAudioTracks();
      tracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setMicActive(!micActive);
      toast.success(micActive ? "Microphone muted" : "Microphone active");
    }
  };

  const loadQuestion = useCallback(
    async (idx: number) => {
      setLoading(true);

      // Preset check first to make load immediate
      const roleKey = role.toLowerCase();
      const presets =
        PRESET_QUESTIONS[roleKey] ||
        PRESET_QUESTIONS[roleKey.includes("frontend") ? "frontend" : ""];
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
            role,
            mode,
            difficulty,
            questionIndex: idx,
            previousQuestions,
          },
        });
        if (res.question) {
          setCurrentQuestion(res.question);
          setPreviousQuestions((prev) => [...prev, res.question.question]);
          speakText(res.question.question);
        } else {
          setCurrentQuestion(DEFAULT_PRESET);
          speakText(DEFAULT_PRESET.question);
        }
      } catch (err: any) {
        console.error("Failed to generate question:", err);
        setCurrentQuestion(DEFAULT_PRESET);
        speakText(DEFAULT_PRESET.question);
      } finally {
        setLoading(false);
      }
    },
    [role, mode, difficulty, previousQuestions, speakText],
  );

  const handleStart = () => {
    setStep("interview");
    setQuestionIndex(0);
    setScores([]);
    setPreviousQuestions([]);
    loadQuestion(0);
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !currentQuestion) return;
    setEvaluating(true);
    stopVoiceRecognition();

    try {
      const res = await evaluateAnswer({
        data: {
          role,
          question: currentQuestion.question,
          answer: userAnswer,
          expectedPoints: currentQuestion.expectedPoints,
          difficulty,
        },
      });
      if (res.evaluation) {
        setEvaluation(res.evaluation);
        setScores((prev) => [...prev, res.evaluation.score]);
      }
    } catch (err: any) {
      console.error("Failed to evaluate:", err);
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
  };

  const avgScore =
    scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const mainContent = (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 grid place-items-center shadow-lg">
          <Briefcase className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Interview Prep</h1>
          <p className="text-muted-foreground text-sm">Practice mock interviews with AI feedback</p>
        </div>
      </div>

      {step === "setup" && (
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" /> Select Job Role
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {JOB_ROLES.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setRole(r.id);
                      setCustomRole("");
                    }}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all cursor-pointer",
                      role === r.id
                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                        : "border-border hover:border-primary/40 hover:bg-muted/30",
                    )}
                  >
                    <Icon className="h-6 w-6 mb-2 text-primary" />
                    <span className="text-xs sm:text-sm font-bold block truncate">{r.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <label className="text-xs font-bold text-muted-foreground mb-1 block">
                Or type ANY custom role for interview preparation:
              </label>
              <Input
                placeholder="e.g. Cloud Solutions Architect, Blockchain Developer, Quant Analyst..."
                value={customRole}
                onChange={(e) => {
                  setCustomRole(e.target.value);
                  setRole(e.target.value);
                }}
                className="h-10 text-xs sm:text-sm font-semibold rounded-xl"
              />
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" /> Select Mode
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MODES.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id as any)}
                    className={cn(
                      "p-4 rounded-xl border text-center transition-all cursor-pointer",
                      mode === m.id
                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                        : "border-border hover:border-primary/40 hover:bg-muted/30",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-6 w-6 mx-auto mb-2",
                        mode === m.id ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    <span className="text-sm font-bold block">{m.label}</span>
                    <span className="text-xs text-muted-foreground">{m.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" /> AI Interviewer Avatar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setAvatarModel("eric")}
                className={cn(
                  "p-4 rounded-xl border text-center transition-all cursor-pointer relative overflow-hidden",
                  avatarModel === "eric"
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                    : "border-border hover:bg-muted/30",
                )}
              >
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black">
                  3D FBX
                </div>
                <div className="w-12 h-12 rounded-full mx-auto bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-bold mb-2 shadow-md">
                  EV
                </div>
                <span className="text-sm font-bold block">Eric Vance</span>
                <span className="text-[10px] text-muted-foreground">3D RenderPeople Avatar</span>
              </button>

              <button
                onClick={() => setAvatarModel("sarah")}
                className={cn(
                  "p-4 rounded-xl border text-center transition-all cursor-pointer",
                  avatarModel === "sarah"
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                    : "border-border hover:bg-muted/30",
                )}
              >
                <div className="w-12 h-12 rounded-full mx-auto bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold mb-2 shadow-md">
                  SJ
                </div>
                <span className="text-sm font-bold block">Sarah Jenkins</span>
                <span className="text-[10px] text-muted-foreground">Senior Tech Lead</span>
              </button>

              <button
                onClick={() => setAvatarModel("alex")}
                className={cn(
                  "p-4 rounded-xl border text-center transition-all cursor-pointer",
                  avatarModel === "alex"
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                    : "border-border hover:bg-muted/30",
                )}
              >
                <div className="w-12 h-12 rounded-full mx-auto bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold mb-2 shadow-md">
                  AR
                </div>
                <span className="text-sm font-bold block">Alex Rivera</span>
                <span className="text-[10px] text-muted-foreground">Technical Recruiter</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" /> Difficulty
            </h2>
            <div className="flex flex-wrap gap-3">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id as any)}
                  className={cn(
                    "px-6 py-3 rounded-xl border font-medium transition-all",
                    difficulty === d.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <span className={cn("px-2 py-0.5 rounded-full text-xs", d.color)}>{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Button size="lg" onClick={handleStart} disabled={!role} className="w-full sm:w-auto">
            Start Interview <ChevronRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      )}

      {step === "interview" && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground font-bold shrink-0">
              {questionIndex + 1} / {totalQuestions}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs font-bold gap-1 text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20 shrink-0 cursor-pointer"
              onClick={() => {
                if (confirm("Exit this session? Progress will be reset.")) {
                  stopVoiceRecognition();
                  handleRestart();
                  toast.success("Cancelled");
                }
              }}
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>Exit / Cancel</span>
            </Button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
              <p className="text-sm text-muted-foreground">Generating question...</p>
            </div>
          ) : currentQuestion ? (
            <div className="space-y-4">
              {/* Talking Avatar & Candidate Feed Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Talking AI Interviewer */}
                <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-card to-purple-950/30 p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-lg min-h-[240px]">
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md z-10">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full bg-indigo-400",
                        aiSpeaking && "animate-ping",
                      )}
                    />
                    AI Interactor:{" "}
                    {avatarModel === "eric"
                      ? "Eric (3D Technical Lead)"
                      : avatarModel === "sarah"
                        ? "Sarah (Senior Tech Lead)"
                        : "Alex (Recruitment Lead)"}
                  </div>

                  {avatarModel === "eric" ? (
                    <ThreeAvatarCanvas
                      aiSpeaking={aiSpeaking}
                      viseme={viseme}
                      className="w-full h-56"
                    />
                  ) : (
                    <SVGAvatar viseme={viseme} avatarModel={avatarModel} />
                  )}

                  <div className="absolute bottom-3 whitespace-nowrap bg-slate-900/90 text-indigo-300 border border-indigo-500/30 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md z-10">
                    {evaluating
                      ? "Evaluating..."
                      : aiSpeaking
                        ? `${avatarModel === "eric" ? "Eric" : avatarModel === "sarah" ? "Sarah" : "Alex"} is Speaking...`
                        : isRecording
                          ? "Listening..."
                          : "Standing By..."}
                  </div>
                </div>

                {/* Candidate Feed */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 flex flex-col justify-between relative overflow-hidden shadow-lg min-h-[220px]">
                  <div className="w-full flex items-center justify-between z-10 mb-2">
                    <div className="flex items-center gap-1.5 bg-red-500/90 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      {mode === "video" ? "LIVE CAMERA" : "AUDIO READY"}
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] border-slate-700 text-slate-300"
                    >
                      {isRecording ? "🔴 RECORDING" : "STANDBY"}
                    </Badge>
                  </div>

                  <div
                    className="w-full flex-1 flex flex-col items-center justify-center relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800"
                    style={{ minHeight: 140 }}
                  >
                    {mode === "video" && cameraActive && (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover rounded-xl"
                      />
                    )}

                    {(!cameraActive || mode !== "video") && (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <VideoOff className="h-8 w-8 mb-1.5 text-slate-500" />
                        <span className="text-xs font-bold text-slate-300">Camera Stream Off</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">
                          Microphone connected & ready
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Feed Controls */}
                  <div className="w-full flex items-center justify-between pt-2.5 border-t border-slate-800 mt-2 text-xs">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={toggleMic}
                        className="h-7 w-7 p-0 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200"
                      >
                        {micActive ? (
                          <Mic className="h-3.5 w-3.5" />
                        ) : (
                          <MicOff className="h-3.5 w-3.5 text-red-400" />
                        )}
                      </Button>
                      {mode === "video" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={toggleCamera}
                          className="h-7 w-7 p-0 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200"
                        >
                          {cameraActive ? (
                            <Video className="h-3.5 w-3.5" />
                          ) : (
                            <VideoOff className="h-3.5 w-3.5 text-red-400" />
                          )}
                        </Button>
                      )}
                    </div>

                    <Button
                      size="sm"
                      variant={isRecording ? "destructive" : "default"}
                      className="h-7 text-xs font-bold rounded-lg px-3"
                      onClick={isRecording ? stopVoiceRecognition : startVoiceRecognition}
                    >
                      {isRecording ? (
                        <MicOff className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <Mic className="h-3.5 w-3.5 mr-1" />
                      )}
                      {isRecording ? "Stop Answer" : "Start Answer"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-card p-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="outline" className="text-xs capitalize">
                    {currentQuestion.type}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTips(!showTips)}
                      className="text-xs"
                    >
                      <Lightbulb className="h-3.5 w-3.5 mr-1" /> Tips
                    </Button>
                    {(mode === "voice" || mode === "video") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-xs"
                      >
                        {isMuted ? (
                          <VolumeX className="h-3.5 w-3.5" />
                        ) : (
                          <Volume2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-semibold leading-relaxed">
                  {currentQuestion.question}
                </h3>

                {showTips && currentQuestion.tips?.length > 0 && (
                  <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-xs font-medium text-primary mb-1.5">Hints:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {currentQuestion.tips.map((tip, i) => (
                        <li key={i}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {!evaluation && (
                <div className="rounded-2xl border bg-card p-6 space-y-4">
                  {mode === "chat" ? (
                    <Textarea
                      ref={textareaRef}
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      rows={6}
                      className="resize-none"
                    />
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Button
                          variant={isRecording ? "destructive" : "default"}
                          size="lg"
                          onClick={isRecording ? stopVoiceRecognition : startVoiceRecognition}
                          className="rounded-full h-14 w-14"
                        >
                          {isRecording ? (
                            <MicOff className="h-6 w-6" />
                          ) : (
                            <Mic className="h-6 w-6" />
                          )}
                        </Button>
                        <div>
                          <p className="text-sm font-medium">
                            {isRecording
                              ? "Recording... Click to stop"
                              : "Click to start recording"}
                          </p>
                          <p className="text-xs text-muted-foreground">Speak your answer clearly</p>
                        </div>
                      </div>
                      {userAnswer && (
                        <div className="p-3 rounded-lg bg-muted/50 text-sm">{userAnswer}</div>
                      )}
                    </div>
                  )}

                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!userAnswer.trim() || evaluating}
                    className="w-full"
                  >
                    {evaluating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    {evaluating ? "Evaluating..." : "Submit Answer"}
                  </Button>
                </div>
              )}

              {evaluation && (
                <div className="rounded-2xl border bg-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Evaluation</h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-2xl font-bold",
                          evaluation.score >= 70
                            ? "text-emerald-500"
                            : evaluation.score >= 50
                              ? "text-yellow-500"
                              : "text-red-500",
                        )}
                      >
                        {evaluation.score}
                      </span>
                      <span className="text-sm text-muted-foreground">/ 100</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{evaluation.feedback}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {evaluation.strengths?.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-emerald-500 mb-1.5 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Strengths
                        </p>
                        <ul className="text-sm space-y-1">
                          {evaluation.strengths.map((s, i) => (
                            <li key={i} className="text-muted-foreground">
                              • {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {evaluation.improvements?.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-yellow-500 mb-1.5 flex items-center gap-1">
                          <XCircle className="h-3 w-3" /> Improvements
                        </p>
                        <ul className="text-sm space-y-1">
                          {evaluation.improvements.map((s, i) => (
                            <li key={i} className="text-muted-foreground">
                              • {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {evaluation.modelAnswer && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs font-medium mb-1">Model Answer:</p>
                      <p className="text-sm text-muted-foreground">{evaluation.modelAnswer}</p>
                    </div>
                  )}

                  <Button onClick={handleNextQuestion} className="w-full">
                    {questionIndex + 1 >= totalQuestions ? "See Results" : "Next Question"}{" "}
                    <ChevronRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {step === "results" && (
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-8 text-center">
            <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Interview Complete!</h2>
            <p className="text-muted-foreground mb-6">Here's how you performed</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto mb-6">
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-3xl font-bold text-primary">{avgScore}</p>
                <p className="text-xs text-muted-foreground mt-1">Avg Score</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-3xl font-bold">{scores.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Questions</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p
                  className={cn(
                    "text-3xl font-bold",
                    avgScore >= 70
                      ? "text-emerald-500"
                      : avgScore >= 50
                        ? "text-yellow-500"
                        : "text-red-500",
                  )}
                >
                  {avgScore >= 70 ? "A" : avgScore >= 50 ? "B" : avgScore >= 30 ? "C" : "D"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Grade</p>
              </div>
            </div>

            <Button onClick={handleRestart}>
              <RotateCcw className="h-4 w-4 mr-1.5" /> New Interview
            </Button>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h3 className="font-semibold mb-4">Score Breakdown</h3>
            <div className="space-y-2">
              {scores.map((score, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-20">Q{i + 1}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        score >= 70
                          ? "bg-emerald-500"
                          : score >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500",
                      )}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-10 text-right">{score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (embedded) return mainContent;
  return <AppShell>{mainContent}</AppShell>;
}
