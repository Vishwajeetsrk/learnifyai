import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Brain,
  DollarSign,
  BookOpen,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Rocket,
} from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { CustomVideoPlayer } from "@/components/ui/CustomVideoPlayer";
import { supabase } from "@/integrations/supabase/client";

interface WatchDemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TOUR_STEPS = [
  {
    id: "overview",
    label: "What Is There?",
    icon: Brain,
    features: [
      {
        num: "01",
        title: "AI Tutor & Smart Notes",
        desc: "24/7 AI tutor that explains complex concepts, generates instant quizzes, and creates structured study notes.",
        icon: Sparkles,
        color: "text-indigo-600",
        bg: "bg-indigo-500/10",
      },
      {
        num: "02",
        title: "Career Studio 5-in-1",
        desc: "Resume Builder, ATS Checker, Mock Interview Coach, Skill Gap Analyzer, and Portfolio Builder all integrated.",
        icon: Rocket,
        color: "text-purple-600",
        bg: "bg-purple-500/10",
      },
      {
        num: "03",
        title: "Verified QR Certificates",
        desc: "Earn tamper-proof certificates with QR code verification and 1-click LinkedIn Profile integration.",
        icon: GraduationCap,
        color: "text-emerald-600",
        bg: "bg-emerald-500/10",
      },
    ],
  },
  {
    id: "usage",
    label: "How To Use It?",
    icon: BookOpen,
    steps: [
      {
        step: "Step 1",
        title: "Create Your Free Account",
        desc: "Sign up in 10 seconds. Free plan includes 500 free AI credits every month.",
      },
      {
        step: "Step 2",
        title: "Enroll in Courses & AI Labs",
        desc: "Choose from 12 Launch Categories spanning Full Stack, Python, Data Science, Cyber Security, UI/UX, and Marketing.",
      },
      {
        step: "Step 3",
        title: "Interact with AI Tutor",
        desc: "Ask questions anytime during video lessons. Get instant code explanations, quiz practice, and career roadmap guidance.",
      },
      {
        step: "Step 4",
        title: "Complete Assessment & Claim Certificate",
        desc: "Pass the course assessment to generate a shareable certificate for your resume and LinkedIn.",
      },
    ],
  },
  {
    id: "earnings",
    label: "How To Earn?",
    icon: DollarSign,
    earnCards: [
      {
        title: "Course Creators",
        subtitle: "80/20 Revenue Split",
        desc: "Publish paid courses or cohort programs. Keep 80% of all sales with automated Cashfree payouts directly to your bank account.",
        items: ["Free or Paid Creator Plans", "Automated GST Invoicing & Tax handling"],
        color: "emerald",
        icon: DollarSign,
      },
      {
        title: "1-on-1 Coaches & Mentors",
        subtitle: "Set Your Own Rates",
        desc: "Set your own hourly session rates for resume reviews, mock interviews, and career guidance. Instant wallet top-ups and payouts.",
        items: ["Free & Paid Coach Tiers", "Verified Mentor Badge & Student Ratings"],
        color: "purple",
        icon: GraduationCap,
      },
    ],
  },
];

const DEFAULT_VIDEO_URL =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

export function WatchDemoModal({ open, onOpenChange }: WatchDemoModalProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [videoUrl, setVideoUrl] = useState(DEFAULT_VIDEO_URL);

  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setDirection(0);
      (async () => {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "tour_video_url")
          .maybeSingle();
        if ((data as any)?.value) setVideoUrl((data as any).value as string);
      })();
    }
  }, [open]);

  const goNext = () => {
    if (activeStep < TOUR_STEPS.length - 1) {
      setDirection(1);
      setActiveStep((p) => p + 1);
    }
  };
  const goPrev = () => {
    if (activeStep > 0) {
      setDirection(-1);
      setActiveStep((p) => p - 1);
    }
  };
  const current = TOUR_STEPS[activeStep];

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] max-w-4xl max-h-[95dvh] sm:max-h-[90dvh] bg-card rounded-2xl border shadow-2xl overflow-hidden flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-3 sm:p-4 md:p-5 text-white relative shrink-0">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAzIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNnY2aDJ2Mmgydi0yem0wLThoLTJ2LTJoMnYyek0yNCAyNGgtMnYtMmgydjJ6bTAtNGgtMnYtMmgydjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-1">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                  <span>Learnify AI Interactive Tour</span>
                </div>
                <h2 className="text-base sm:text-lg md:text-2xl font-bold font-display leading-tight">
                  Watch & Experience Learnify AI
                </h2>
                <p className="text-[11px] sm:text-sm text-indigo-200/90 mt-0.5 leading-relaxed">
                  Discover how intelligent tutoring, 100+ career courses, and the creator economy
                  work together.
                </p>
              </div>
              <DialogPrimitive.Close
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </DialogPrimitive.Close>
            </div>
          </div>

          {/* Video */}
          <div className="w-full bg-slate-950 relative shrink-0 h-[30vh] sm:h-[35vh] min-h-[180px] max-h-[320px]">
            <CustomVideoPlayer src={videoUrl} autoPlay />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain">
            <div className="p-3 sm:p-4 md:p-5 pb-6">
              {/* Step Indicators */}
              <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                {TOUR_STEPS.map((step, i) => {
                  const StepIcon = step.icon;
                  const isActive = i === activeStep;
                  const isDone = i < activeStep;
                  return (
                    <button
                      key={step.id}
                      onClick={() => {
                        setDirection(i > activeStep ? 1 : -1);
                        setActiveStep(i);
                      }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md"
                          : isDone
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      <StepIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{step.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Animated Content */}
              <div className="relative min-h-[180px] overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={current.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="w-full"
                  >
                    {current.id === "overview" && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {current.features!.map((f, i) => (
                          <motion.div
                            key={f.num}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-4 rounded-xl border border-border bg-muted/30 hover:shadow-md transition-all group cursor-default"
                          >
                            <div
                              className={`w-9 h-9 rounded-lg ${f.bg} ${f.color} flex items-center justify-center mb-2.5 font-bold text-sm`}
                            >
                              {f.num}
                            </div>
                            <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                              {f.title}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {f.desc}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    {current.id === "usage" && (
                      <div className="space-y-2.5">
                        {current.steps!.map((s, i) => (
                          <motion.div
                            key={s.step}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="p-3 rounded-xl border bg-card flex items-center gap-3 hover:border-primary/30 transition-all"
                          >
                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md shrink-0">
                              {s.step}
                            </span>
                            <div className="min-w-0">
                              <h5 className="text-sm font-semibold">{s.title}</h5>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {s.desc}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    {current.id === "earnings" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {current.earnCards!.map((card, i) => (
                          <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.12 }}
                            className={`p-4 rounded-xl border bg-gradient-to-br ${card.color === "emerald" ? "from-emerald-500/10 to-teal-500/5 border-emerald-500/20" : "from-purple-500/10 to-indigo-500/5 border-purple-500/20"}`}
                          >
                            <div
                              className={`flex items-center gap-2 ${card.color === "emerald" ? "text-emerald-600" : "text-purple-600"} font-bold text-xs mb-2`}
                            >
                              <card.icon className="w-4 h-4" /> {card.title} ({card.subtitle})
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed mb-2.5">
                              {card.desc}
                            </p>
                            <ul className="text-xs space-y-1.5">
                              {card.items.map((item) => (
                                <li key={item} className="flex items-center gap-2">
                                  <CheckCircle2
                                    className={`w-3.5 h-3.5 shrink-0 ${card.color === "emerald" ? "text-emerald-500" : "text-purple-500"}`}
                                  />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Footer */}
              <div className="mt-3 pt-3 border-t flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
                <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                  {TOUR_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === activeStep ? "w-5 bg-primary" : i < activeStep ? "w-1.5 bg-primary/40" : "w-1.5 bg-muted"}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs text-muted-foreground flex-1 text-center sm:text-left">
                    Ready to elevate your tech & career journey?
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goPrev}
                      disabled={activeStep === 0}
                      className="h-7 w-7 p-0"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {activeStep < TOUR_STEPS.length - 1 ? (
                      <Button size="sm" onClick={goNext} className="h-7 text-xs">
                        Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => onOpenChange(false)} className="h-7 text-xs">
                        Close Tour <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
