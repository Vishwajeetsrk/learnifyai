import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Mic,
  MicOff,
  Send,
  Loader2,
  MessageSquare,
  Video,
  ChevronRight,
  Star,
  Target,
  Lightbulb,
  CheckCircle2,
  XCircle,
  BarChart3,
  RotateCcw,
  Volume2,
  VolumeX,
  Briefcase,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { generateInterviewQuestion, evaluateInterviewAnswer } from "@/lib/resume.functions";

export const Route = createFileRoute("/_authenticated/interview")({
  head: () => ({ meta: [{ title: "Interview Prep — Learnify AI" }] }),
  component: InterviewPage,
});

const JOB_ROLES = [
  { id: "frontend", label: "Frontend Developer", icon: "🎨" },
  { id: "backend", label: "Backend Developer", icon: "⚙️" },
  { id: "fullstack", label: "Full-Stack Developer", icon: "🚀" },
  { id: "dataScience", label: "Data Scientist", icon: "📊" },
  { id: "devops", label: "DevOps Engineer", icon: "🔧" },
  { id: "mobile", label: "Mobile Developer", icon: "📱" },
  { id: "pm", label: "Product Manager", icon: "📋" },
  { id: "designer", label: "UI/UX Designer", icon: "🎯" },
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

function InterviewPage() {
  const generateQuestion = useServerFn(generateInterviewQuestion);
  const evaluateAnswer = useServerFn(evaluateInterviewAnswer);

  const [step, setStep] = useState<"setup" | "interview" | "results">("setup");
  const [role, setRole] = useState("");
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

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const totalQuestions = 10;

  // Persist session to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("learnify-interview-session");
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (s.step === "interview" && s.questionIndex < totalQuestions) {
          setStep(s.step);
          setRole(s.role);
          setDifficulty(s.difficulty);
          setMode(s.mode);
          setQuestionIndex(s.questionIndex);
          setPreviousQuestions(s.previousQuestions || []);
          setScores(s.scores || []);
          if (s.currentQuestion) setCurrentQuestion(s.currentQuestion);
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (step === "interview") {
      localStorage.setItem("learnify-interview-session", JSON.stringify({
        step, role, difficulty, mode, questionIndex, previousQuestions, scores, currentQuestion,
      }));
    } else {
      localStorage.removeItem("learnify-interview-session");
    }
  }, [step, role, difficulty, mode, questionIndex, previousQuestions, scores, currentQuestion]);

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
      utterance.rate = 0.9;
      utterance.pitch = 1;
      synthRef.current.speak(utterance);
    },
    [isMuted],
  );

  const startVoiceRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
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

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

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

  const loadQuestion = useCallback(
    async (idx: number) => {
      setLoading(true);
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
          if (mode === "voice" || mode === "video") {
            speakText(res.question.question);
          }
        }
      } catch (err: any) {
        console.error("Failed to generate question:", err);
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
    setStep("setup");
    setCurrentQuestion(null);
    setEvaluation(null);
    setUserAnswer("");
    setScores([]);
    setQuestionIndex(0);
    setPreviousQuestions([]);
  };

  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 grid place-items-center shadow-lg">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Interview Prep</h1>
            <p className="text-muted-foreground text-sm">Practice mock interviews with AI feedback</p>
          </div>
        </div>

        {/* Setup Step */}
        {step === "setup" && (
          <div className="space-y-6">
            {/* Job Role Selection */}
            <div className="rounded-2xl border bg-card p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" /> Select Job Role
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {JOB_ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all",
                      role === r.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/40 hover:bg-muted/30",
                    )}
                  >
                    <span className="text-2xl mb-2 block">{r.icon}</span>
                    <span className="text-sm font-medium">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Selection */}
            <div className="rounded-2xl border bg-card p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" /> Select Mode
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {MODES.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id as any)}
                      className={cn(
                        "p-4 rounded-xl border text-center transition-all",
                        mode === m.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/40 hover:bg-muted/30",
                      )}
                    >
                      <Icon className={cn("h-6 w-6 mx-auto mb-2", mode === m.id ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-sm font-medium block">{m.label}</span>
                      <span className="text-xs text-muted-foreground">{m.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty */}
            <div className="rounded-2xl border bg-card p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Difficulty
              </h2>
              <div className="flex gap-3">
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

            <Button
              size="lg"
              onClick={handleStart}
              disabled={!role}
              className="w-full sm:w-auto"
            >
              Start Interview <ChevronRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        )}

        {/* Interview Step */}
        {step === "interview" && (
          <div className="space-y-6">
            {/* Progress */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                {questionIndex + 1} / {totalQuestions}
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                <p className="text-sm text-muted-foreground">Generating question...</p>
              </div>
            ) : currentQuestion ? (
              <div className="space-y-4">
                {/* Question Card */}
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
                          {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                        </Button>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold leading-relaxed">{currentQuestion.question}</h3>

                  {showTips && currentQuestion.tips.length > 0 && (
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

                {/* Answer Input */}
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
                            {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                          </Button>
                          <div>
                            <p className="text-sm font-medium">
                              {isRecording ? "Recording... Click to stop" : "Click to start recording"}
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

                {/* Evaluation */}
                {evaluation && (
                  <div className="rounded-2xl border bg-card p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Evaluation</h3>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-2xl font-bold",
                          evaluation.score >= 70 ? "text-emerald-500" : evaluation.score >= 50 ? "text-yellow-500" : "text-red-500",
                        )}>
                          {evaluation.score}
                        </span>
                        <span className="text-sm text-muted-foreground">/ 100</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{evaluation.feedback}</p>

                    <div className="grid grid-cols-2 gap-4">
                      {evaluation.strengths.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-emerald-500 mb-1.5 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Strengths
                          </p>
                          <ul className="text-sm space-y-1">
                            {evaluation.strengths.map((s, i) => (
                              <li key={i} className="text-muted-foreground">• {s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {evaluation.improvements.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-yellow-500 mb-1.5 flex items-center gap-1">
                            <XCircle className="h-3 w-3" /> Improvements
                          </p>
                          <ul className="text-sm space-y-1">
                            {evaluation.improvements.map((s, i) => (
                              <li key={i} className="text-muted-foreground">• {s}</li>
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
                      {questionIndex + 1 >= totalQuestions ? "See Results" : "Next Question"} <ChevronRight className="h-4 w-4 ml-1.5" />
                    </Button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* Results Step */}
        {step === "results" && (
          <div className="space-y-6">
            <div className="rounded-2xl border bg-card p-8 text-center">
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Interview Complete!</h2>
              <p className="text-muted-foreground mb-6">Here's how you performed</p>

              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-3xl font-bold text-primary">{avgScore}</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg Score</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-3xl font-bold">{scores.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Questions</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className={cn(
                    "text-3xl font-bold",
                    avgScore >= 70 ? "text-emerald-500" : avgScore >= 50 ? "text-yellow-500" : "text-red-500",
                  )}>
                    {avgScore >= 70 ? "A" : avgScore >= 50 ? "B" : avgScore >= 30 ? "C" : "D"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Grade</p>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button onClick={handleRestart}>
                  <RotateCcw className="h-4 w-4 mr-1.5" /> New Interview
                </Button>
              </div>
            </div>

            {/* Score Breakdown */}
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
                          score >= 70 ? "bg-emerald-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500",
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
    </AppShell>
  );
}
