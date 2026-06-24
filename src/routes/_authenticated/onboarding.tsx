import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Loader2,
  Sparkles,
  Rocket,
  Compass,
  Check,
  ArrowRight,
  ArrowLeft,
  Target,
  BookOpen,
  Code,
  Award,
  Users,
  Zap,
  Star,
  GraduationCap,
  MessageSquare,
  Lightbulb,
  ChevronRight,
  Trophy,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import {
  getOnboardingProgress,
  completeOnboardingStep,
  saveAiOnboardingProfile,
  sendOnboardingCoachMessage,
  logDailyUsage,
  skipOnboarding,
} from "@/lib/onboarding.functions";
import { STUDENT_TOUR, CREATOR_TOUR, ADMIN_TOUR } from "@/components/ProductTour";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({ meta: [{ title: "Onboarding — Learnify AI" }] }),
  component: OnboardingPage,
});

const ONBOARDING_STEPS = [
  { id: "welcome", label: "Welcome", icon: Rocket },
  { id: "ai_onboarding", label: "AI Setup", icon: Sparkles },
  { id: "product_tour", label: "Product Tour", icon: Compass },
  { id: "first_project", label: "First Project", icon: Code },
  { id: "ai_coach", label: "AI Coach", icon: MessageSquare },
  { id: "daily_usage", label: "Daily Habits", icon: Calendar },
  { id: "advanced", label: "Advanced", icon: Zap },
  { id: "complete", label: "All Done!", icon: Trophy },
];

const GOALS = [
  "Learn programming",
  "Build a portfolio",
  "Get a job",
  "Switch careers",
  "Start a business",
  "Upskill at work",
  "Teach others",
  "Just for fun",
];

const INTERESTS = [
  "Web Development",
  "Mobile Apps",
  "AI/ML",
  "Data Science",
  "DevOps",
  "Cloud",
  "Cybersecurity",
  "Game Dev",
  "UI/UX Design",
  "Blockchain",
  "IoT",
  "Robotics",
];

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner", desc: "Just starting out" },
  { value: "intermediate", label: "Intermediate", desc: "Built a few projects" },
  { value: "advanced", label: "Advanced", desc: "Experienced developer" },
  { value: "expert", label: "Expert", desc: "Years of experience" },
];

function OnboardingPage() {
  const { user, isCreator, isAdmin } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const getProgressFn = useServerFn(getOnboardingProgress);
  const completeStepFn = useServerFn(completeOnboardingStep);
  const saveProfileFn = useServerFn(saveAiOnboardingProfile);
  const sendMessageFn = useServerFn(sendOnboardingCoachMessage);
  const logUsageFn = useServerFn(logDailyUsage);
  const skipFn = useServerFn(skipOnboarding);

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [aiProfile, setAiProfile] = useState<{
    goals: string[];
    experience: string;
    interests: string[];
    preferred_hours: string;
    learning_style: string;
  }>({
    goals: [],
    experience: "",
    interests: [],
    preferred_hours: "",
    learning_style: "",
  });
  const [coachMessages, setCoachMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [coachInput, setCoachInput] = useState("");
  const [coachLoading, setCoachLoading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectLang, setProjectLang] = useState("javascript");
  const coachRef = useRef<HTMLDivElement>(null);

  // Load existing progress
  useEffect(() => {
    getProgressFn()
      .then((progress) => {
        if (progress?.onboarding_completed) {
          navigate({ to: "/dashboard", replace: true });
          return;
        }
        const stepIdx = ONBOARDING_STEPS.findIndex((s) => s.id === progress?.current_step);
        if (stepIdx >= 0) setCurrentStep(stepIdx);
        if (progress?.ai_profile) {
          setAiProfile((prev) => ({
            goals: progress.ai_profile.goals ?? prev.goals,
            experience: progress.ai_profile.experience ?? prev.experience,
            interests: progress.ai_profile.interests ?? prev.interests,
            preferred_hours: progress.ai_profile.preferred_hours ?? prev.preferred_hours,
            learning_style: progress.ai_profile.learning_style ?? prev.learning_style,
          }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- run once on mount only

  useEffect(() => {
    if (coachRef.current) {
      coachRef.current.scrollTop = coachRef.current.scrollHeight;
    }
  }, [coachMessages]);

  const goToStep = (idx: number) => {
    if (idx >= 0 && idx < ONBOARDING_STEPS.length) setCurrentStep(idx);
  };

  const completeAndNext = async () => {
    const stepId = ONBOARDING_STEPS[currentStep].id;
    try {
      await completeStepFn({ data: { step: stepId } });
      qc.invalidateQueries({ queryKey: ["onboarding-progress"] });
      if (currentStep < ONBOARDING_STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch {
      toast.error("Failed to save progress");
    }
  };

  const handleSaveAiProfile = async () => {
    if (aiProfile.goals.length === 0) return toast.error("Select at least one goal");
    if (!aiProfile.experience) return toast.error("Select your experience level");
    if (aiProfile.interests.length === 0) return toast.error("Select at least one interest");
    try {
      await saveProfileFn({ data: aiProfile });
      toast.success("Profile saved!");
      await completeAndNext();
    } catch {
      toast.error("Save failed");
    }
  };

  const handleSendCoachMessage = async (text?: string) => {
    const msg = text || coachInput.trim();
    if (!msg) return;
    setCoachInput("");
    setCoachMessages((prev) => [...prev, { role: "user", text: msg }]);
    setCoachLoading(true);
    try {
      const result = await sendMessageFn({
        data: { message: msg, step: ONBOARDING_STEPS[currentStep].id },
      });
      setCoachMessages((prev) => [...prev, { role: "ai", text: result.response }]);
    } catch {
      setCoachMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, I couldn't process that. Please try again." },
      ]);
    }
    setCoachLoading(false);
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) return toast.error("Enter a project name");
    try {
      const { data: project, error } = await supabase
        .from("playground_projects" as any)
        .insert({
          user_id: user!.id,
          name: projectName,
          description: projectDesc || null,
          language: projectLang,
        })
        .select()
        .single();
      if (error) throw error;
      await completeStepFn({
        data: { step: "first_project", data: { project_id: (project as any).id } },
      });
      qc.invalidateQueries({ queryKey: ["onboarding-progress"] });
      toast.success("Project created!");
      setCurrentStep(currentStep + 1);
    } catch {
      toast.error("Failed to create project");
    }
  };

  const handleSkipAll = async () => {
    try {
      await skipFn();
      toast.success("Onboarding skipped. You can always restart from settings.");
      navigate({ to: "/dashboard", replace: true });
    } catch {
      toast.error("Skip failed");
    }
  };

  const handleLogDaily = async () => {
    try {
      await logUsageFn({
        data: {
          actions_count: 1,
          features_used: ["onboarding"],
          xp_earned: 10,
          notes: "Completed onboarding daily habits step",
        },
      });
      await completeAndNext();
    } catch {
      toast.error("Failed to log usage");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const step = ONBOARDING_STEPS[currentStep];
  const StepIcon = step.icon;
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <StepIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold text-sm sm:text-lg font-display">{step.label}</h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkipAll}
              className="text-xs sm:text-sm"
            >
              Skip All
            </Button>
          </div>
          <Progress value={progress} className="h-1.5" />
          {/* Step indicators */}
          <div className="flex gap-1 mt-3 overflow-x-auto">
            {ONBOARDING_STEPS.map((s, i) => (
              <button
                key={s.id}
                className={cn(
                  "h-1.5 rounded-full transition-all cursor-pointer shrink-0",
                  i === currentStep
                    ? "w-6 sm:w-8 bg-primary"
                    : i < currentStep
                      ? "w-2 sm:w-3 bg-primary/50"
                      : "w-2 sm:w-3 bg-muted",
                )}
                onClick={() => goToStep(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* ═══ WELCOME ═══ */}
        {step.id === "welcome" && (
          <div className="text-center space-y-6 sm:space-y-8 animate-in fade-in-0 slide-in-from-bottom-4">
            <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24">
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
              <div className="absolute inset-3 rounded-full bg-primary/5 flex items-center justify-center">
                <Rocket className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-4xl font-bold font-display mb-3">
                Welcome to Learnify AI! 🎉
              </h2>
              <p className="text-sm sm:text-lg text-muted-foreground max-w-xl mx-auto">
                Your intelligent learning journey starts now. Let's set up your profile and explore
                the platform together.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto">
              {[
                { icon: Sparkles, label: "AI Tutoring", desc: "24/7 assistance" },
                { icon: Code, label: "Playground", desc: "Write & run code" },
                { icon: Award, label: "Certificates", desc: "Earn credentials" },
              ].map((f) => (
                <Card key={f.label} className="text-center">
                  <CardContent className="pt-4 sm:pt-5 pb-3 sm:pb-4">
                    <f.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-1 sm:mb-2" />
                    <div className="text-xs sm:text-sm font-medium">{f.label}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">{f.desc}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button
              size="lg"
              onClick={completeAndNext}
              className="text-sm sm:text-base px-6 sm:px-8"
            >
              Let's Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* ═══ AI ONBOARDING ═══ */}
        {step.id === "ai_onboarding" && (
          <div className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold font-display mb-2">Tell us about yourself</h2>
              <p className="text-muted-foreground">
                Our AI will personalize your learning experience based on your goals.
              </p>
            </div>

            {/* Goals */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">What are your goals?</Label>
              <div className="flex flex-wrap gap-2">
                {GOALS.map((g) => (
                  <Badge
                    key={g}
                    variant={(aiProfile.goals ?? []).includes(g) ? "default" : "outline"}
                    className="cursor-pointer text-sm py-1.5 px-3"
                    onClick={() =>
                      setAiProfile((prev) => ({
                        ...prev,
                        goals: (prev.goals ?? []).includes(g)
                          ? (prev.goals ?? []).filter((x) => x !== g)
                          : [...(prev.goals ?? []), g],
                      }))
                    }
                  >
                    {(aiProfile.goals ?? []).includes(g) && <Check className="h-3 w-3 mr-1" />}
                    {g}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Your experience level</Label>
              <div className="grid grid-cols-2 gap-3">
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <button
                    key={lvl.value}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all",
                      aiProfile.experience === lvl.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "hover:bg-muted/30",
                    )}
                    onClick={() => setAiProfile((prev) => ({ ...prev, experience: lvl.value }))}
                  >
                    <div className="font-medium text-sm">{lvl.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{lvl.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">What interests you?</Label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((i) => (
                  <Badge
                    key={i}
                    variant={(aiProfile.interests ?? []).includes(i) ? "default" : "outline"}
                    className="cursor-pointer text-sm py-1.5 px-3"
                    onClick={() =>
                      setAiProfile((prev) => ({
                        ...prev,
                        interests: (prev.interests ?? []).includes(i)
                          ? (prev.interests ?? []).filter((x) => x !== i)
                          : [...(prev.interests ?? []), i],
                      }))
                    }
                  >
                    {(aiProfile.interests ?? []).includes(i) && <Check className="h-3 w-3 mr-1" />}
                    {i}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Learning Style */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Preferred learning style</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "visual", label: "Visual", desc: "Videos & diagrams", icon: "👁️" },
                  { value: "hands-on", label: "Hands-on", desc: "Learn by doing", icon: "🛠️" },
                  { value: "reading", label: "Reading", desc: "Articles & docs", icon: "📖" },
                  { value: "mixed", label: "Mixed", desc: "A bit of everything", icon: "🎯" },
                ].map((s) => (
                  <button
                    key={s.value}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all",
                      aiProfile.learning_style === s.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "hover:bg-muted/30",
                    )}
                    onClick={() => setAiProfile((prev) => ({ ...prev, learning_style: s.value }))}
                  >
                    <span className="text-2xl">{s.icon}</span>
                    <div className="font-medium text-sm mt-1">{s.label}</div>
                    <div className="text-xs text-muted-foreground">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => goToStep(currentStep - 1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleSaveAiProfile}>
                Save & Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ═══ PRODUCT TOUR ═══ */}
        {step.id === "product_tour" && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in-0 slide-in-from-bottom-4">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold font-display mb-2">
                Explore the Platform
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Take a quick tour to discover all the features available to you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {(isCreator ? CREATOR_TOUR : isAdmin ? ADMIN_TOUR : STUDENT_TOUR).steps.map(
                (s, i) => {
                  const Icon = s.icon ?? Rocket;
                  return (
                    <Card key={s.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-medium flex items-center gap-2">
                            {s.title}
                            <Badge variant="outline" className="text-[10px]">
                              Step {i + 1}
                            </Badge>
                          </div>
                          <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                            {s.content}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                },
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => goToStep(currentStep - 1)}
                className="order-2 sm:order-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <div className="flex gap-2 order-1 sm:order-2">
                <Button variant="outline" onClick={completeAndNext} className="flex-1 sm:flex-none">
                  Skip Tour
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      await completeStepFn({
                        data: { step: "product_tour", data: { started: true } },
                      });
                      qc.invalidateQueries({ queryKey: ["onboarding-progress"] });
                      setCurrentStep(currentStep + 1);
                      toast.success("Tour will start on the dashboard!");
                    } catch {
                      toast.error("Failed to save tour progress");
                    }
                  }}
                  className="flex-1 sm:flex-none"
                >
                  Start Tour <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ FIRST PROJECT ═══ */}
        {step.id === "first_project" && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in-0 slide-in-from-bottom-4">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold font-display mb-2">
                Create Your First Project
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Let's set up your first coding project. You can always create more later.
              </p>
            </div>

            <Card className="max-w-lg mx-auto">
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm">Project Name</Label>
                  <Input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="My Awesome Project"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Description (optional)</Label>
                  <Textarea
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    placeholder="What will you build?"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Language</Label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {[
                      { value: "javascript", label: "JavaScript" },
                      { value: "typescript", label: "TypeScript" },
                      { value: "python", label: "Python" },
                      { value: "html", label: "HTML/CSS" },
                      { value: "react", label: "React" },
                    ].map((l) => (
                      <Badge
                        key={l.value}
                        variant={projectLang === l.value ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => setProjectLang(l.value)}
                      >
                        {l.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-xs sm:text-sm text-muted-foreground">
                  <Lightbulb className="h-4 w-4 inline mr-1 text-primary" />
                  Your project will be created in the Playground where you can write and run code
                  instantly.
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => goToStep(currentStep - 1)}
                className="order-2 sm:order-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <div className="flex gap-2 order-1 sm:order-2">
                <Button variant="outline" onClick={completeAndNext} className="flex-1 sm:flex-none">
                  Skip for Now
                </Button>
                <Button onClick={handleCreateProject} className="flex-1 sm:flex-none">
                  <Code className="mr-2 h-4 w-4" /> Create Project
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ AI COACH ═══ */}
        {step.id === "ai_coach" && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in-0 slide-in-from-bottom-4">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold font-display mb-2">
                Meet Your AI Coach
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Your personal AI success coach is here to guide you. Ask anything!
              </p>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-0">
                {/* Chat area */}
                <div
                  ref={coachRef}
                  className="h-[300px] sm:h-[400px] overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4"
                >
                  {coachMessages.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Sparkles className="h-8 w-8 mx-auto mb-3 text-primary/50" />
                      <p className="text-sm">Start a conversation with your AI coach!</p>
                      <div className="flex flex-wrap gap-2 justify-center mt-4">
                        {[
                          "What should I learn first?",
                          "How do I stay motivated?",
                          "Suggest a learning path",
                          "What are the best practices?",
                        ].map((q) => (
                          <Button
                            key={q}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => handleSendCoachMessage(q)}
                          >
                            {q}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  {coachMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                          msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                        )}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {coachLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl px-4 py-3">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="border-t p-3 flex gap-2">
                  <Input
                    value={coachInput}
                    onChange={(e) => setCoachInput(e.target.value)}
                    placeholder="Ask your AI coach..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendCoachMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={() => handleSendCoachMessage()}
                    disabled={coachLoading || !coachInput.trim()}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => goToStep(currentStep - 1)}
                className="order-2 sm:order-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={completeAndNext} className="order-1 sm:order-2">
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ═══ DAILY USAGE ═══ */}
        {step.id === "daily_usage" && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in-0 slide-in-from-bottom-4">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold font-display mb-2">
                Build Daily Habits
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Consistency is key! Here's how to make the most of Learnify every day.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                {
                  icon: Target,
                  title: "Set Daily Goals",
                  desc: "Complete at least 1 lesson or exercise daily",
                  color: "#6366f1",
                },
                {
                  icon: Code,
                  title: "Code Every Day",
                  desc: "Use the playground to practice what you learn",
                  color: "#10b981",
                },
                {
                  icon: Users,
                  title: "Engage socially",
                  desc: "Comment on posts, help others, share progress",
                  color: "#f59e0b",
                },
              ].map((tip) => (
                <Card key={tip.title}>
                  <CardContent className="p-5 text-center">
                    <div
                      className="h-12 w-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                      style={{ backgroundColor: tip.color + "15" }}
                    >
                      <tip.icon className="h-6 w-6" style={{ color: tip.color }} />
                    </div>
                    <h3 className="font-semibold text-sm">{tip.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{tip.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="max-w-lg mx-auto bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-4 sm:p-5 text-center">
                <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm sm:text-base">
                  Earn +10 XP for completing this step!
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Log your first daily activity to earn bonus XP.
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => goToStep(currentStep - 1)}
                className="order-2 sm:order-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleLogDaily} className="order-1 sm:order-2">
                <Zap className="mr-2 h-4 w-4" /> Log Daily Activity (+10 XP)
              </Button>
            </div>
          </div>
        )}

        {/* ═══ ADVANCED ═══ */}
        {step.id === "advanced" && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in-0 slide-in-from-bottom-4">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold font-display mb-2">Level Up</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                You're all set! Here are some advanced features to explore.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
              {[
                {
                  icon: Sparkles,
                  title: "AI Tools",
                  desc: "Generate thumbnails, review code, prep interviews",
                  action: "/ai-tools",
                },
                {
                  icon: Compass,
                  title: "Coaching Hub",
                  desc: "Book 1-on-1 sessions with experts",
                  action: "/coaching",
                },
                {
                  icon: Award,
                  title: "Certificates",
                  desc: "Earn verified credentials for your skills",
                  action: "/certificates",
                },
                {
                  icon: Trophy,
                  title: "Leaderboard",
                  desc: "Compete and climb the rankings",
                  action: "/leaderboard",
                },
              ].map((feat) => (
                <Card
                  key={feat.title}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate({ to: feat.action })}
                >
                  <CardContent className="p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <feat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium">{feat.title}</div>
                      <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                        {feat.desc}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto mt-1 shrink-0" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => goToStep(currentStep - 1)}
                className="order-2 sm:order-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={completeAndNext} className="order-1 sm:order-2">
                Finish Setup <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ═══ COMPLETE ═══ */}
        {step.id === "complete" && (
          <div className="text-center space-y-6 sm:space-y-8 animate-in fade-in-0 slide-in-from-bottom-4">
            <div className="relative mx-w-24 mx-auto w-24 h-24 sm:w-32 sm:h-32">
              <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-pulse" />
              <div className="absolute inset-3 sm:inset-4 rounded-full bg-emerald-500/5 flex items-center justify-center">
                <Trophy className="h-10 w-10 sm:h-14 sm:w-14 text-emerald-500" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-4xl font-bold font-display mb-3">
                You're All Set! 🎉
              </h2>
              <p className="text-sm sm:text-lg text-muted-foreground max-w-xl mx-auto">
                Onboarding complete. Your personalized learning dashboard is ready. Let's start
                building something amazing!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate({ to: "/dashboard" })}
                className="text-sm sm:text-base"
              >
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: "/courses" })}
                className="text-sm sm:text-base"
              >
                Browse Courses
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
