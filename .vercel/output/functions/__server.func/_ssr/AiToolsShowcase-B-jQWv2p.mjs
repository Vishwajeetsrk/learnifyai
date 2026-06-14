import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { I as Input } from "./input-BHvIASyb.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { B as Badge } from "./badge-LGfgVerF.mjs";
import { S as StaggerGroup, a as StaggerItem } from "./Reveal-Bq96pMeu.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { k as Sparkles, M as MessageSquare, l as GraduationCap, m as Bell, Z as Zap, d as BookOpen, L as LoaderCircle, c as Check } from "../_libs/lucide-react.mjs";
const aiTools = [
  {
    id: "quiz",
    icon: Sparkles,
    label: "Quiz Generator",
    desc: "Turn any topic into a 10-question MCQ set."
  },
  {
    id: "doubt",
    icon: MessageSquare,
    label: "Doubt Solver",
    desc: "Ask any question, get a worked-out answer."
  },
  {
    id: "career",
    icon: GraduationCap,
    label: "Career Coach",
    desc: "Roadmaps tailored to your goals."
  },
  {
    id: "reminders",
    icon: Bell,
    label: "Smart Reminders",
    desc: "Spaced repetition that actually fits your week."
  },
  {
    id: "synthesizer",
    icon: Zap,
    label: "Lesson Synthesizer",
    desc: "Compress hours of video into 5-minute briefs."
  },
  {
    id: "flashcards",
    icon: BookOpen,
    label: "Auto Flashcards",
    desc: "Generate decks straight from your notes."
  }
];
function AiToolsShowcase() {
  const [selectedTool, setSelectedTool] = reactExports.useState("quiz");
  const [demoStep, setDemoStep] = reactExports.useState("idle");
  const [demoText, setDemoText] = reactExports.useState("");
  const [flashcardFlipped, setFlashcardFlipped] = reactExports.useState(false);
  const [flashcardIndex, setFlashcardIndex] = reactExports.useState(0);
  const [selectedAnswers, setSelectedAnswers] = reactExports.useState({});
  const handleSimulate = () => {
    setDemoStep("loading");
    setTimeout(() => {
      setDemoStep("done");
    }, 1200);
  };
  const renderInteractiveDemo = () => {
    switch (selectedTool) {
      case "quiz":
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col h-full justify-between gap-6", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-5 w-5 text-primary" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 79,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold text-sm text-foreground", children: "Interactive Quiz Generator" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 80,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 78,
              columnNumber: 15
            }, this),
            demoStep === "idle" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Simulate generating a quiz on any topic. Try entering a topic below!" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 87,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: "TOPIC" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 91,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  Input,
                  {
                    required: true,
                    value: demoText,
                    onChange: (e) => setDemoText(e.target.value),
                    placeholder: "e.g., React Hooks, Photosynthesis, Cryptography",
                    className: "bg-muted/50 h-9 text-xs",
                    onKeyDown: (e) => {
                      if (e.key === "Enter" && demoText.trim()) {
                        handleSimulate();
                      }
                    }
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                    lineNumber: 94,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 90,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Button,
                {
                  type: "button",
                  size: "sm",
                  className: "w-full text-xs",
                  onClick: () => {
                    if (demoText.trim()) handleSimulate();
                  },
                  children: "Generate Quiz"
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 107,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 86,
              columnNumber: 17
            }, this),
            demoStep === "loading" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-16 flex flex-col items-center justify-center gap-3 text-center", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 122,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs font-medium text-foreground", children: "Analyzing topic and drafting MCQs..." }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 123,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 121,
              columnNumber: 17
            }, this),
            demoStep === "done" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-between items-center bg-muted/40 p-2.5 rounded-lg text-[11px]", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-semibold text-foreground truncate max-w-[200px]", children: [
                  "Topic: ",
                  demoText || "React Hooks"
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 132,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-primary font-medium", children: "3 Questions" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 135,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 131,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs font-semibold text-foreground leading-relaxed", children: "Q: Which of the following is a rule of React Hooks?" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 138,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid gap-2", children: [
                  "Hooks can only be called from inside Class components",
                  "Hooks can be called conditionally inside if statements",
                  "Hooks must only be called at the top level of React functions",
                  "Hooks can be called inside regular Javascript functions"
                ].map((opt, i) => {
                  const isCorrect = i === 2;
                  const isSelected = selectedAnswers[0] === i;
                  const hasSelected = selectedAnswers[0] !== void 0;
                  let btnStyle = "border-border hover:bg-muted/40 text-foreground";
                  if (hasSelected) {
                    if (isCorrect)
                      btnStyle = "bg-emerald-500/10 border-emerald-500/50 text-emerald-700 dark:text-emerald-400 font-medium";
                    else if (isSelected)
                      btnStyle = "bg-destructive/10 border-destructive-300/30 text-destructive-700 dark:text-red-400";
                    else btnStyle = "opacity-50 text-muted-foreground";
                  }
                  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "button",
                    {
                      disabled: hasSelected,
                      onClick: () => setSelectedAnswers({ ...selectedAnswers, 0: i }),
                      className: `w-full text-left p-2.5 text-[11px] rounded-lg border transition-all ${btnStyle}`,
                      children: opt
                    },
                    i,
                    false,
                    {
                      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                      lineNumber: 162,
                      columnNumber: 27
                    },
                    this
                  );
                }) }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 141,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 137,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 130,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
            lineNumber: 77,
            columnNumber: 13
          }, this),
          demoStep === "done" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "w-full text-xs",
              onClick: () => {
                setDemoStep("idle");
                setSelectedAnswers({});
              },
              children: "Create Another Quiz"
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 179,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
          lineNumber: 76,
          columnNumber: 11
        }, this);
      case "doubt":
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col h-full justify-between gap-6", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MessageSquare, { className: "h-5 w-5 text-primary" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 198,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold text-sm text-foreground", children: "Real-Time Doubt Solver" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 199,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 197,
              columnNumber: 15
            }, this),
            demoStep === "idle" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Ask any question about your course and get an instant structured answer with code or examples." }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 206,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: "YOUR QUESTION" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 211,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  Input,
                  {
                    required: true,
                    value: demoText,
                    onChange: (e) => setDemoText(e.target.value),
                    placeholder: "e.g., Explain closure in JS, Why is the sky blue?",
                    className: "bg-muted/50 h-9 text-xs",
                    onKeyDown: (e) => {
                      if (e.key === "Enter" && demoText.trim()) {
                        handleSimulate();
                      }
                    }
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                    lineNumber: 214,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 210,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Button,
                {
                  type: "button",
                  size: "sm",
                  className: "w-full text-xs",
                  onClick: () => {
                    if (demoText.trim()) handleSimulate();
                  },
                  children: "Solve Doubt"
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 227,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 205,
              columnNumber: 17
            }, this),
            demoStep === "loading" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-16 flex flex-col items-center justify-center gap-3 text-center", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 242,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs font-medium text-foreground", children: "Searching course material and drafting answer..." }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 243,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 241,
              columnNumber: 17
            }, this),
            demoStep === "done" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "bg-muted/40 p-2.5 rounded-lg border text-[11px] font-mono text-foreground flex gap-2", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-semibold text-primary", children: "Q:" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 252,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "truncate", children: demoText || "How does CSS Flexbox work?" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 253,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 251,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "bg-primary/5 border border-primary/20 rounded-xl p-3.5 text-xs leading-relaxed space-y-2 text-foreground", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-1.5 font-semibold text-primary mb-1", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-3.5 w-3.5" }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                    lineNumber: 257,
                    columnNumber: 23
                  }, this),
                  " AI DOUBT SOLVER"
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 256,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { children: "Flexbox is a 1D layout model. It aligns items inside a container along either a **horizontal row** or a **vertical column**." }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 259,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "bg-black/5 dark:bg-black/30 p-2 rounded font-mono text-[10px] text-muted-foreground border", children: ".container { display: flex; justify-content: center; align-items: center; }" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 263,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 255,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 250,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
            lineNumber: 196,
            columnNumber: 13
          }, this),
          demoStep === "done" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "w-full text-xs",
              onClick: () => setDemoStep("idle"),
              children: "Ask Another Doubt"
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 273,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
          lineNumber: 195,
          columnNumber: 11
        }, this);
      case "career":
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col h-full justify-between gap-6", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(GraduationCap, { className: "h-5 w-5 text-primary" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 289,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold text-sm text-foreground", children: "AI Career Coach" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 290,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 288,
              columnNumber: 15
            }, this),
            demoStep === "idle" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Map out a personalized learning path to your dream job or skill goal." }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 297,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: "DREAM ROLE / SKILL GOAL" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 301,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  Input,
                  {
                    required: true,
                    value: demoText,
                    onChange: (e) => setDemoText(e.target.value),
                    placeholder: "e.g., Full-Stack Web Developer, Machine Learning Engineer",
                    className: "bg-muted/50 h-9 text-xs",
                    onKeyDown: (e) => {
                      if (e.key === "Enter" && demoText.trim()) {
                        handleSimulate();
                      }
                    }
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                    lineNumber: 304,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 300,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Button,
                {
                  type: "button",
                  size: "sm",
                  className: "w-full text-xs",
                  onClick: () => {
                    if (demoText.trim()) handleSimulate();
                  },
                  children: "Generate Roadmap"
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 317,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 296,
              columnNumber: 17
            }, this),
            demoStep === "loading" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-16 flex flex-col items-center justify-center gap-3 text-center", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 332,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs font-medium text-foreground", children: "Synthesizing market demands and skill graph..." }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 333,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 331,
              columnNumber: 17
            }, this),
            demoStep === "done" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs font-semibold text-foreground uppercase tracking-wider text-muted-foreground", children: [
                "Roadmap: ",
                demoText || "Full-Stack Dev"
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 341,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative border-l border-primary/30 pl-4 ml-2 space-y-4 py-2", children: [
                {
                  step: "Phase 1: Core Fundamentals",
                  skills: "HTML, CSS, JS, Git, Terminal"
                },
                {
                  step: "Phase 2: Frontend Mastery",
                  skills: "React 19, Tailwind CSS, TanStack Router"
                },
                {
                  step: "Phase 3: Backend & Systems",
                  skills: "SQL, Postgres, Node.js, Cloudflare Workers"
                }
              ].map((phase, idx) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative text-xs", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-primary" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 360,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h4", { className: "font-semibold text-foreground", children: phase.step }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 361,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-muted-foreground mt-0.5", children: phase.skills }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 362,
                  columnNumber: 25
                }, this)
              ] }, idx, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 359,
                columnNumber: 23
              }, this)) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 344,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 340,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
            lineNumber: 287,
            columnNumber: 13
          }, this),
          demoStep === "done" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "w-full text-xs",
              onClick: () => setDemoStep("idle"),
              children: "Generate New Roadmap"
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 371,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
          lineNumber: 286,
          columnNumber: 11
        }, this);
      case "reminders":
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col h-full justify-between gap-6", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Bell, { className: "h-5 w-5 text-primary" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 387,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold text-sm text-foreground", children: "Spaced Repetition Reminders" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 388,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 386,
              columnNumber: 15
            }, this),
            demoStep === "idle" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Add a topic to your daily learning loop. The AI calculates optimal review intervals (1, 3, 7, 14 days) to prevent forgetting." }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 395,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: "TOPIC TO RETAIN" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 400,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  Input,
                  {
                    required: true,
                    value: demoText,
                    onChange: (e) => setDemoText(e.target.value),
                    placeholder: "e.g., HTTP Status Codes, SQL Join logic",
                    className: "bg-muted/50 h-9 text-xs",
                    onKeyDown: (e) => {
                      if (e.key === "Enter" && demoText.trim()) {
                        handleSimulate();
                      }
                    }
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                    lineNumber: 403,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 399,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Button,
                {
                  type: "button",
                  size: "sm",
                  className: "w-full text-xs",
                  onClick: () => {
                    if (demoText.trim()) handleSimulate();
                  },
                  children: "Schedule Spaced Reviews"
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 416,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 394,
              columnNumber: 17
            }, this),
            demoStep === "loading" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-16 flex flex-col items-center justify-center gap-3 text-center", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 431,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs font-medium text-foreground", children: "Configuring review schedule in database..." }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 432,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 430,
              columnNumber: 17
            }, this),
            demoStep === "done" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-2.5 bg-muted/40 border rounded-lg text-xs text-foreground font-medium flex justify-between", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
                  "Topic: ",
                  demoText || "SQL Joins"
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 441,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-emerald-500 font-semibold flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Check, { className: "h-3 w-3" }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                    lineNumber: 443,
                    columnNumber: 23
                  }, this),
                  "Active"
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 442,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 440,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "bg-primary/5 border border-primary/20 rounded-xl p-4 text-xs space-y-3", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-semibold text-foreground flex items-center gap-1.5 text-primary", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Bell, { className: "h-3.5 w-3.5" }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                    lineNumber: 449,
                    columnNumber: 23
                  }, this),
                  " UPCOMING ALERTS"
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 448,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5 text-[11px] text-foreground", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-between border-b border-border pb-1", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Review 1 (Day 1)" }, void 0, false, {
                      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                      lineNumber: 453,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-medium text-muted-foreground", children: "Tomorrow" }, void 0, false, {
                      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                      lineNumber: 454,
                      columnNumber: 25
                    }, this)
                  ] }, void 0, true, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                    lineNumber: 452,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-between border-b border-border pb-1", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Review 2 (Day 3)" }, void 0, false, {
                      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                      lineNumber: 457,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-medium text-muted-foreground", children: "3 days from now" }, void 0, false, {
                      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                      lineNumber: 458,
                      columnNumber: 25
                    }, this)
                  ] }, void 0, true, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                    lineNumber: 456,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Review 3 (Day 7)" }, void 0, false, {
                      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                      lineNumber: 461,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-medium text-muted-foreground", children: "7 days from now" }, void 0, false, {
                      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                      lineNumber: 462,
                      columnNumber: 25
                    }, this)
                  ] }, void 0, true, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                    lineNumber: 460,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 451,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 447,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 439,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
            lineNumber: 385,
            columnNumber: 13
          }, this),
          demoStep === "done" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "w-full text-xs",
              onClick: () => setDemoStep("idle"),
              children: "Create New Reminder"
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 471,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
          lineNumber: 384,
          columnNumber: 11
        }, this);
      case "synthesizer":
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col h-full justify-between gap-6", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Zap, { className: "h-5 w-5 text-primary" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 487,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold text-sm text-foreground", children: "Lesson Synthesizer" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 488,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 486,
              columnNumber: 15
            }, this),
            demoStep === "idle" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Paste any YouTube educational video URL. The AI extracts the transcript and generates structured summaries." }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 495,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: "YOUTUBE VIDEO LINK" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 500,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  Input,
                  {
                    required: true,
                    value: demoText,
                    onChange: (e) => setDemoText(e.target.value),
                    placeholder: "e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    className: "bg-muted/50 h-9 text-xs",
                    onKeyDown: (e) => {
                      if (e.key === "Enter" && demoText.trim()) {
                        handleSimulate();
                      }
                    }
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                    lineNumber: 503,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 499,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Button,
                {
                  type: "button",
                  size: "sm",
                  className: "w-full text-xs",
                  onClick: () => {
                    if (demoText.trim()) handleSimulate();
                  },
                  children: "Synthesize Video"
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 516,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 494,
              columnNumber: 17
            }, this),
            demoStep === "loading" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-16 flex flex-col items-center justify-center gap-3 text-center", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 531,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs font-medium text-foreground", children: "Downloading captions and summarizing content..." }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 532,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 530,
              columnNumber: 17
            }, this),
            demoStep === "done" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "bg-muted/40 p-2.5 rounded-lg border text-xs text-foreground font-semibold flex items-center justify-between", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "truncate max-w-[200px]", children: [
                  "Source: ",
                  demoText || "React 19 Deep Dive"
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 541,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "secondary", className: "text-[9px]", children: "12 min video" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 544,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 540,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "bg-primary/5 border border-primary/20 rounded-xl p-3.5 text-xs leading-relaxed space-y-2 text-foreground", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-1.5 font-semibold text-primary mb-1", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Zap, { className: "h-3.5 w-3.5" }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                    lineNumber: 550,
                    columnNumber: 23
                  }, this),
                  " 5-MINUTE BRIEF"
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 549,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-semibold text-foreground", children: "Key Takeaways:" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 552,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "list-disc list-inside space-y-1 text-muted-foreground pl-1 text-[11px]", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: "**Server Components** render on the server, saving bundle size." }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                    lineNumber: 554,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: "**Actions API** simplifies state management for forms." }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                    lineNumber: 555,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: "**Ref Forwarding** is obsolete; `ref` is now a standard prop." }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                    lineNumber: 556,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 553,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 548,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 539,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
            lineNumber: 485,
            columnNumber: 13
          }, this),
          demoStep === "done" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "w-full text-xs",
              onClick: () => setDemoStep("idle"),
              children: "Synthesize Another Video"
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 564,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
          lineNumber: 484,
          columnNumber: 11
        }, this);
      case "flashcards":
        const flashcards = [
          {
            q: "What is a Closure in JavaScript?",
            a: "A closure is the combination of a function bundled together with references to its surrounding state (lexical environment)."
          },
          {
            q: "What is the difference between RLS and standard SQL rules?",
            a: "Row Level Security (RLS) restricts database queries on a per-user basis, whereas standard rules apply globally to tables."
          },
          {
            q: "What does TanStack Query manage?",
            a: "It manages asynchronous state, caching, background refetching, and synchronization in React apps."
          }
        ];
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col h-full justify-between gap-6", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(BookOpen, { className: "h-5 w-5 text-primary" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 594,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold text-sm text-foreground", children: "Auto Flashcards" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 595,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 593,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Test your recall with AI-generated flashcards from your note briefs. Click the card to flip it!" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 601,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  onClick: () => setFlashcardFlipped(!flashcardFlipped),
                  style: { perspective: "1000px" },
                  className: "relative h-40 w-full cursor-pointer group",
                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "div",
                    {
                      style: {
                        transformStyle: "preserve-3d",
                        transition: "transform 0.5s",
                        transform: flashcardFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                      },
                      className: "relative w-full h-full",
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "div",
                          {
                            style: { backfaceVisibility: "hidden" },
                            className: "absolute inset-0 bg-card border rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm hover:border-primary/50 transition",
                            children: [
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: "mb-2 text-[9px]", children: "QUESTION" }, void 0, false, {
                                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                                lineNumber: 625,
                                columnNumber: 23
                              }, this),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs font-semibold text-foreground text-center leading-relaxed", children: flashcards[flashcardIndex].q }, void 0, false, {
                                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                                lineNumber: 628,
                                columnNumber: 23
                              }, this),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[10px] text-muted-foreground mt-3 opacity-0 group-hover:opacity-100 transition", children: "Click card to flip" }, void 0, false, {
                                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                                lineNumber: 631,
                                columnNumber: 23
                              }, this)
                            ]
                          },
                          void 0,
                          true,
                          {
                            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                            lineNumber: 621,
                            columnNumber: 21
                          },
                          this
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "div",
                          {
                            style: {
                              backfaceVisibility: "hidden",
                              transform: "rotateY(180deg)"
                            },
                            className: "absolute inset-0 bg-primary/5 border border-primary/20 rounded-2xl p-5 flex flex-col items-center justify-center shadow-inner",
                            children: [
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: "mb-2 text-[9px] bg-primary", children: "ANSWER" }, void 0, false, {
                                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                                lineNumber: 644,
                                columnNumber: 23
                              }, this),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-foreground text-center leading-relaxed", children: flashcards[flashcardIndex].a }, void 0, false, {
                                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                                lineNumber: 645,
                                columnNumber: 23
                              }, this)
                            ]
                          },
                          void 0,
                          true,
                          {
                            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                            lineNumber: 637,
                            columnNumber: 21
                          },
                          this
                        )
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                      lineNumber: 612,
                      columnNumber: 19
                    },
                    this
                  )
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 607,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 600,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
            lineNumber: 592,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "flex-1 text-xs",
                onClick: () => setFlashcardFlipped(!flashcardFlipped),
                children: "Flip Card"
              },
              void 0,
              false,
              {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 655,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Button,
              {
                size: "sm",
                className: "flex-1 text-xs",
                onClick: () => {
                  setFlashcardIndex((flashcardIndex + 1) % flashcards.length);
                  setFlashcardFlipped(false);
                },
                children: "Next Card"
              },
              void 0,
              false,
              {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                lineNumber: 663,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
            lineNumber: 654,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
          lineNumber: 591,
          columnNumber: 11
        }, this);
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      className: "rounded-3xl p-8 md:p-12 relative overflow-hidden",
      style: { background: "var(--gradient-brand)" },
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          motion.div,
          {
            className: "absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]",
            animate: { opacity: [0.2, 0.4, 0.2] },
            transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          },
          void 0,
          false,
          {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
            lineNumber: 686,
            columnNumber: 7
          },
          this
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative max-w-2xl text-primary-foreground mb-10", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm font-medium opacity-80 mb-3", children: "AI Toolkit" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
            lineNumber: 693,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-4xl md:text-5xl font-semibold tracking-tight text-white", children: "Every action, supercharged by AI." }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
            lineNumber: 694,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-4 opacity-85 text-lg text-white/90", children: "A growing suite of one-click utilities, available inside every course. Click any tool below to simulate it live." }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
            lineNumber: 697,
            columnNumber: 9
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
          lineNumber: 692,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(StaggerGroup, { className: "lg:col-span-5 grid grid-cols-1 gap-2.5", stagger: 0.05, children: aiTools.map((t) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(StaggerItem, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "button",
            {
              onClick: () => {
                setSelectedTool(t.id);
                setDemoStep("idle");
                setDemoText("");
                setFlashcardFlipped(false);
                setFlashcardIndex(0);
                setSelectedAnswers({});
              },
              className: `w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${selectedTool === t.id ? "bg-background text-foreground border-transparent shadow-lg scale-[1.01]" : "bg-white/10 border-white/10 text-primary-foreground hover:bg-white/15"}`,
              children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className: `p-2.5 rounded-lg shrink-0 ${selectedTool === t.id ? "bg-primary/10 text-primary" : "bg-white/10 text-white"}`,
                    children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(t.icon, { className: "h-5 w-5" }, void 0, false, {
                      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                      lineNumber: 727,
                      columnNumber: 19
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                    lineNumber: 724,
                    columnNumber: 17
                  },
                  this
                ),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h4", { className: "font-semibold text-sm leading-none", children: t.label }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                    lineNumber: 730,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "p",
                    {
                      className: `text-xs mt-1.5 leading-relaxed ${selectedTool === t.id ? "text-muted-foreground" : "opacity-80"}`,
                      children: t.desc
                    },
                    void 0,
                    false,
                    {
                      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                      lineNumber: 731,
                      columnNumber: 19
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
                  lineNumber: 729,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
              lineNumber: 709,
              columnNumber: 15
            },
            this
          ) }, t.id, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
            lineNumber: 708,
            columnNumber: 13
          }, this)) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
            lineNumber: 706,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "lg:col-span-7 bg-background/95 border border-border shadow-2xl rounded-2xl p-6 min-h-[360px] flex flex-col justify-between transition-all duration-300", children: renderInteractiveDemo() }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
            lineNumber: 743,
            columnNumber: 9
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
          lineNumber: 704,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AiToolsShowcase.tsx",
      lineNumber: 682,
      columnNumber: 5
    },
    this
  );
}
export {
  AiToolsShowcase as A
};
