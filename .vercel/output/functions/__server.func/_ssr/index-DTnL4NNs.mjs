import { e as jsxDevRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { S as SiteHeader, a as SiteFooter } from "./SiteFooter-CadeW0CQ.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { A as AiToolsShowcase } from "./AiToolsShowcase-B-jQWv2p.mjs";
import { g as getPlatformStats, A as AnimatedCounter } from "./stats.functions-mKen3CaI.mjs";
import { R as Reveal, S as StaggerGroup, a as StaggerItem } from "./Reveal-Bq96pMeu.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { m as motion, A as AnimatePresence } from "../_libs/framer-motion.mjs";
import { k as Sparkles, A as ArrowRight, F as CirclePlay, B as Brain, d as BookOpen, T as Trophy, U as Users, W as Wallet, e as ChartColumn, H as FileText, y as Send, c as Check } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./ThemeToggle-DNuVEMie.mjs";
import "./learnify-logo-CyXPmSny.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "./router-BGh9Ntsg.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./client.server-BbcUHF3e.mjs";
import "../_libs/zod.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./input-BHvIASyb.mjs";
import "./badge-LGfgVerF.mjs";
import "./createSsrRpc-BR3wbl1z.mjs";
import "./server-BLOOEPZP.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const tabs = [
  {
    id: "tutor",
    label: "AI Tutor",
    icon: Brain,
    desc: "Ask anything. Get personalized, step-by-step answers grounded in your course."
  },
  {
    id: "quiz",
    label: "Quiz Generator",
    icon: Sparkles,
    desc: "Turn any topic into a 10-question MCQ in seconds, with explanations."
  },
  {
    id: "notes",
    label: "Smart Notes",
    icon: FileText,
    desc: "Auto-generate flashcards, summaries, and slide decks from any lesson."
  }
];
function TutorDemo() {
  const [typed, setTyped] = reactExports.useState("");
  const full = "Sure! Gradient descent updates weights by moving opposite to the loss gradient. Step size = learning rate × ∂L/∂w …";
  reactExports.useEffect(() => {
    setTyped("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, []);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3", "aria-live": "polite", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm max-w-[80%] shadow-sm", children: "Explain gradient descent like I'm new." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
      lineNumber: 45,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
      lineNumber: 44,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-start gap-2.5", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "div",
        {
          className: "h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0",
          "aria-hidden": "true",
          children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Brain, { className: "h-3.5 w-3.5 text-white" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
            lineNumber: 54,
            columnNumber: 11
          }, this)
        },
        void 0,
        false,
        {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
          lineNumber: 50,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5 text-sm max-w-[85%] min-h-[3rem]", children: [
        typed,
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "span",
          {
            className: "inline-block w-1 h-3.5 bg-primary ml-0.5 animate-pulse align-middle",
            "aria-hidden": "true"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
            lineNumber: 58,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
        lineNumber: 56,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
      lineNumber: 49,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      "form",
      {
        className: "flex items-center gap-2 mt-4 rounded-full border border-border/60 bg-background px-4 py-2.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
        onSubmit: (e) => e.preventDefault(),
        children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { htmlFor: "demo-followup", className: "sr-only", children: "Ask a follow-up question" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
            lineNumber: 68,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "input",
            {
              id: "demo-followup",
              className: "flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground",
              placeholder: "Ask a follow-up…"
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
              lineNumber: 71,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "button",
            {
              type: "submit",
              "aria-label": "Send follow-up",
              className: "h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Send, { className: "h-3.5 w-3.5", "aria-hidden": "true" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
                lineNumber: 81,
                columnNumber: 11
              }, this)
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
              lineNumber: 76,
              columnNumber: 9
            },
            this
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
        lineNumber: 64,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
    lineNumber: 43,
    columnNumber: 5
  }, this);
}
function QuizDemo() {
  const [selected, setSelected] = reactExports.useState(null);
  const options = [
    { text: "O(n)", correct: false },
    { text: "O(log n)", correct: true },
    { text: "O(n²)", correct: false },
    { text: "O(1)", correct: false }
  ];
  reactExports.useEffect(() => {
    setSelected(null);
    const id = setTimeout(() => setSelected(1), 1800);
    return () => clearTimeout(id);
  }, []);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("fieldset", { children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("legend", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-2", children: "Question 3 of 10" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
      lineNumber: 103,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-semibold mb-4", children: "What's the time complexity of binary search?" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
      lineNumber: 106,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { role: "radiogroup", "aria-label": "Answer choices", className: "space-y-2.5", children: options.map((o, i) => {
      const isSel = selected === i;
      const isCorrect = isSel && o.correct;
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        motion.button,
        {
          type: "button",
          role: "radio",
          "aria-checked": isSel,
          onClick: () => setSelected(i),
          whileHover: { x: 4 },
          className: `w-full text-left rounded-xl border px-4 py-3 text-sm flex items-center justify-between transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${isCorrect ? "border-emerald-500/60 bg-emerald-500/10" : isSel ? "border-rose-500/60 bg-rose-500/10" : "border-border/60 bg-background hover:border-primary/40"}`,
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: o.text }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
              lineNumber: 127,
              columnNumber: 15
            }, this),
            isCorrect && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Check, { className: "h-4 w-4 text-emerald-500", "aria-label": "Correct answer" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
              lineNumber: 129,
              columnNumber: 17
            }, this)
          ]
        },
        o.text,
        true,
        {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
          lineNumber: 112,
          columnNumber: 13
        },
        this
      );
    }) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
      lineNumber: 107,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
    lineNumber: 102,
    columnNumber: 5
  }, this);
}
function NotesDemo() {
  const cards = [
    { front: "Photosynthesis", back: "Plants convert light + CO₂ + H₂O → glucose + O₂" },
    { front: "Mitochondria", back: "The powerhouse of the cell — ATP production" },
    { front: "Newton's 2nd Law", back: "F = m × a" }
  ];
  const [idx, setIdx] = reactExports.useState(0);
  const [flipped, setFlipped] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const id = setInterval(() => {
      setFlipped((f) => !f);
      if (flipped) setIdx((i) => (i + 1) % cards.length);
    }, 2200);
    return () => clearInterval(id);
  }, [flipped]);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      "div",
      {
        className: "text-xs uppercase tracking-wider text-muted-foreground mb-3",
        "aria-live": "polite",
        children: [
          "Auto-generated flashcards · ",
          idx + 1,
          " of ",
          cards.length
        ]
      },
      void 0,
      true,
      {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
        lineNumber: 156,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative h-40 [perspective:1000px]", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      motion.div,
      {
        className: "absolute inset-0 rounded-2xl border border-border/60 bg-card p-6 flex items-center justify-center text-center shadow-md",
        animate: { rotateY: flipped ? 180 : 0 },
        transition: { duration: 0.55 },
        style: { transformStyle: "preserve-3d" },
        children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "[backface-visibility:hidden] font-display text-xl font-semibold", children: cards[idx].front }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
            lineNumber: 169,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "absolute inset-0 flex items-center justify-center p-6 [transform:rotateY(180deg)] [backface-visibility:hidden] text-sm text-muted-foreground", children: cards[idx].back }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
            lineNumber: 172,
            columnNumber: 11
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
        lineNumber: 163,
        columnNumber: 9
      },
      this
    ) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
      lineNumber: 162,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-3 flex gap-1.5", "aria-hidden": "true", children: cards.map((_, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      "div",
      {
        className: `h-1 flex-1 rounded-full ${i === idx ? "bg-primary" : "bg-muted"}`
      },
      i,
      false,
      {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
        lineNumber: 179,
        columnNumber: 11
      },
      this
    )) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
      lineNumber: 177,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
    lineNumber: 155,
    columnNumber: 5
  }, this);
}
function InteractiveDemo() {
  const [active, setActive] = reactExports.useState("tutor");
  const current = tabs.find((t) => t.id === active);
  const tabRefs = reactExports.useRef({});
  const onKeyDown = (e) => {
    const i = tabs.findIndex((t) => t.id === active);
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    const id = tabs[next].id;
    setActive(id);
    tabRefs.current[id]?.focus();
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-3xl border border-border/60 bg-gradient-to-br from-card to-background shadow-2xl overflow-hidden", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 md:p-8 border-b border-border/60", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs uppercase tracking-[0.18em] text-primary font-medium", children: "Live Demo" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
          lineNumber: 212,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display text-2xl font-semibold mt-1.5", id: "demo-tab-title", children: current.label }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
          lineNumber: 213,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-1 max-w-md", children: current.desc }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
          lineNumber: 216,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
        lineNumber: 211,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { role: "tablist", "aria-label": "Interactive demo sections", className: "flex flex-wrap gap-2", children: tabs.map((t) => {
        const selected = active === t.id;
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "button",
          {
            ref: (el) => {
              tabRefs.current[t.id] = el;
            },
            role: "tab",
            id: `demo-tab-${t.id}`,
            "aria-selected": selected,
            "aria-controls": `demo-panel-${t.id}`,
            tabIndex: selected ? 0 : -1,
            onClick: () => setActive(t.id),
            onKeyDown,
            className: `px-3.5 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${selected ? "bg-foreground text-background shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/70"}`,
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(t.icon, { className: "h-3.5 w-3.5", "aria-hidden": "true" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
                lineNumber: 240,
                columnNumber: 17
              }, this),
              t.label
            ]
          },
          t.id,
          true,
          {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
            lineNumber: 222,
            columnNumber: 15
          },
          this
        );
      }) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
        lineNumber: 218,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
      lineNumber: 210,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      "div",
      {
        role: "tabpanel",
        id: `demo-panel-${active}`,
        "aria-labelledby": `demo-tab-${active}`,
        className: "p-6 md:p-8 min-h-[340px] bg-muted/20",
        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -10 },
            transition: { duration: 0.25 },
            children: [
              active === "tutor" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TutorDemo, {}, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
                lineNumber: 261,
                columnNumber: 36
              }, this),
              active === "quiz" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(QuizDemo, {}, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
                lineNumber: 262,
                columnNumber: 35
              }, this),
              active === "notes" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(NotesDemo, {}, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
                lineNumber: 263,
                columnNumber: 36
              }, this)
            ]
          },
          active,
          true,
          {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
            lineNumber: 254,
            columnNumber: 11
          },
          this
        ) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
          lineNumber: 253,
          columnNumber: 9
        }, this)
      },
      void 0,
      false,
      {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
        lineNumber: 247,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/InteractiveDemo.tsx",
    lineNumber: 209,
    columnNumber: 5
  }, this);
}
const features = [{
  icon: Brain,
  title: "AI Tutor",
  desc: "Personalized 1-on-1 tutoring that adapts to how you learn."
}, {
  icon: BookOpen,
  title: "Smart Notes & Slides",
  desc: "Generate flashcards, summaries, and decks from any lesson."
}, {
  icon: Trophy,
  title: "Gamified Progress",
  desc: "Streaks, XP, badges, and leaderboards that make learning addictive."
}, {
  icon: Users,
  title: "Creator Economy",
  desc: "Coaches and creators ship courses, cohorts, and communities."
}, {
  icon: Wallet,
  title: "Built-in Wallet",
  desc: "Earnings, payouts, and tipping handled natively."
}, {
  icon: ChartColumn,
  title: "Career Intelligence",
  desc: "AI-guided paths, resume reviews, and skill graphs."
}];
function Index() {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SiteHeader, {}, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
      lineNumber: 40,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { className: "bg-hero relative overflow-hidden", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.div, { className: "absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--gradient-glow)] pointer-events-none", animate: {
        scale: [1, 1.08, 1],
        opacity: [0.7, 1, 0.7]
      }, transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      } }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
        lineNumber: 44,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "container mx-auto px-6 pt-24 pb-32 relative", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "max-w-3xl mx-auto text-center", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.div, { initial: {
          opacity: 0,
          y: -10
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.6
        }, className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-background/60 backdrop-blur text-xs font-medium text-muted-foreground mb-8 hover:border-primary/50 hover:bg-background/80 transition cursor-default", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-3.5 w-3.5 text-primary animate-pulse" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
            lineNumber: 63,
            columnNumber: 15
          }, this),
          "The AI-Native Learning OS"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 54,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.h1, { initial: {
          opacity: 0,
          y: 20
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.8,
          delay: 0.1,
          ease: [0.22, 1, 0.36, 1]
        }, className: "font-display text-5xl md:text-7xl font-semibold tracking-tighter leading-[1.05]", children: [
          "Learn ",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-gradient", children: "smarter" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
            lineNumber: 77,
            columnNumber: 21
          }, this),
          ".",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("br", {}, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
            lineNumber: 77,
            columnNumber: 68
          }, this),
          "Grow faster."
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 66,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.p, { initial: {
          opacity: 0,
          y: 20
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.8,
          delay: 0.25
        }, className: "mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto", children: "Learnify AI fuses intelligent tutoring, creator-powered courses, and a thriving learning community into one premium experience." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 80,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.div, { initial: {
          opacity: 0,
          y: 20
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.8,
          delay: 0.4
        }, className: "mt-10 flex flex-wrap items-center justify-center gap-3", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, size: "lg", className: "bg-foreground text-background hover:bg-foreground/90 shadow-glow group hover:-translate-y-0.5 hover:shadow-lg transition-all", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/signup", children: [
            "Start learning free",
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowRight, { className: "ml-1 h-4 w-4 transition group-hover:translate-x-1" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
              lineNumber: 106,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
            lineNumber: 104,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
            lineNumber: 103,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, size: "lg", variant: "outline", className: "hover:-translate-y-0.5 transition-all", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { href: "#demo", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CirclePlay, { className: "mr-1.5 h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
              lineNumber: 111,
              columnNumber: 19
            }, this),
            "Watch demo"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
            lineNumber: 110,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
            lineNumber: 109,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 93,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
        lineNumber: 53,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
        lineNumber: 52,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
      lineNumber: 43,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { id: "demo", className: "container mx-auto px-6 py-24 scroll-mt-24", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Reveal, { className: "max-w-2xl mx-auto text-center mb-12", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm font-medium text-primary mb-3", children: "See it in action" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 123,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-4xl md:text-5xl font-semibold tracking-tight", children: "Try the product. No signup." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 124,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-4 text-muted-foreground text-lg", children: "Click through a live AI Tutor chat, generate a quiz, and flip through auto-made flashcards." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 127,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
        lineNumber: 122,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Reveal, { variant: "scale", delay: 0.1, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(InteractiveDemo, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
        lineNumber: 133,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
        lineNumber: 132,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
      lineNumber: 121,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LiveStats, {}, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
      lineNumber: 138,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { id: "features", className: "container mx-auto px-6 py-28", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Reveal, { className: "max-w-2xl mb-16", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm font-medium text-primary mb-3", children: "Everything in one OS" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 143,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-4xl md:text-5xl font-semibold tracking-tight", children: "An ecosystem, not a course catalog." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 144,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-4 text-muted-foreground text-lg", children: "Six pillars working together so learners, creators, and institutions all win." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 147,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
        lineNumber: 142,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(StaggerGroup, { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-5", children: features.map((f) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(StaggerItem, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.div, { whileHover: {
        y: -6
      }, transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }, className: "group p-7 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-card transition-all h-full", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-3 transition-all duration-300", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(f.icon, { className: "h-5 w-5" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 161,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 160,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold text-xl mb-2", children: f.title }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 163,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-muted-foreground text-sm leading-relaxed", children: f.desc }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 164,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
        lineNumber: 153,
        columnNumber: 15
      }, this) }, f.title, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
        lineNumber: 152,
        columnNumber: 30
      }, this)) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
        lineNumber: 151,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
      lineNumber: 141,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { id: "ai", className: "relative", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "container mx-auto px-6 py-28", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Reveal, { variant: "scale", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AiToolsShowcase, {}, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
      lineNumber: 174,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
      lineNumber: 173,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
      lineNumber: 172,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
      lineNumber: 171,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { id: "creators", className: "container mx-auto px-6 py-28", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid lg:grid-cols-2 gap-16 items-center", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Reveal, { variant: "left", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm font-medium text-primary mb-3", children: "For creators & coaches" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 183,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-4xl md:text-5xl font-semibold tracking-tight", children: "Build a learning business, not just a course." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 184,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-5 text-muted-foreground text-lg", children: "Cohorts, communities, drops, and digital products — with a wallet, analytics, and AI co-pilot built in." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 187,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(StaggerGroup, { className: "mt-8 space-y-3", stagger: 0.07, children: ["Native payouts in 40+ countries", "Cohort + 1-on-1 + async, in one place", "AI assistant that drafts lessons with your voice", "Community spaces with realtime presence"].map((t) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(StaggerItem, { variant: "left", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-start gap-3 text-sm", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
            lineNumber: 194,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: t }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
            lineNumber: 195,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 193,
          columnNumber: 19
        }, this) }, t, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 192,
          columnNumber: 197
        }, this)) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 191,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, className: "mt-10 bg-foreground text-background hover:bg-foreground/90 hover:-translate-y-0.5 transition-all", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/apply-creator", children: "Apply to Creator Program" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 200,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 199,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
        lineNumber: 182,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Reveal, { variant: "right", delay: 0.1, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(StaggerGroup, { className: "aspect-square rounded-3xl border border-border bg-card shadow-card p-8 grid grid-cols-2 gap-4", stagger: 0.1, children: [Trophy, Wallet, Users, ChartColumn].map((Icon, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(StaggerItem, { variant: "scale", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.div, { whileHover: {
          y: -4,
          scale: 1.02
        }, transition: {
          type: "spring",
          stiffness: 300,
          damping: 18
        }, className: "rounded-2xl bg-secondary p-6 flex flex-col justify-between h-full hover:bg-secondary/80 transition cursor-default", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Icon, { className: "h-6 w-6 text-primary" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
            lineNumber: 215,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-display text-2xl font-semibold", children: ["1,284", "$12.4K", "892", "+38%"][i] }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
              lineNumber: 217,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground mt-1", children: ["Streak XP", "This month", "Members", "Engagement"][i] }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
              lineNumber: 220,
              columnNumber: 25
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
            lineNumber: 216,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 207,
          columnNumber: 21
        }, this) }, i, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 206,
          columnNumber: 70
        }, this)) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 205,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.div, { className: "absolute -inset-4 -z-10 rounded-[2rem]", style: {
          background: "var(--gradient-glow)"
        }, animate: {
          opacity: [0.6, 1, 0.6]
        }, transition: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        } }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 227,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
        lineNumber: 204,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
        lineNumber: 203,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
      lineNumber: 181,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
      lineNumber: 180,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { id: "pricing", className: "container mx-auto px-6 pb-10", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Reveal, { variant: "scale", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-3xl border border-border bg-card p-12 md:p-16 text-center shadow-card hover:shadow-glow transition-shadow duration-500", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-4xl md:text-5xl font-semibold tracking-tight max-w-2xl mx-auto", children: [
        "Your next skill is one ",
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-gradient", children: "conversation" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 246,
          columnNumber: 38
        }, this),
        " away."
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
        lineNumber: 245,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-5 text-muted-foreground text-lg max-w-xl mx-auto", children: "Start free. Upgrade when you're ready for unlimited AI sessions and creator tools." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
        lineNumber: 248,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-10 flex flex-wrap items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, size: "lg", className: "bg-foreground text-background hover:bg-foreground/90 shadow-glow hover:-translate-y-0.5 transition-all", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/signup", children: "Create your account" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 253,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 252,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, size: "lg", variant: "outline", className: "hover:-translate-y-0.5 transition-all", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/pricing", children: "View pricing" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 256,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
          lineNumber: 255,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
        lineNumber: 251,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
      lineNumber: 244,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
      lineNumber: 243,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
      lineNumber: 242,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SiteFooter, {}, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
      lineNumber: 263,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
    lineNumber: 39,
    columnNumber: 10
  }, this);
}
function LiveStats() {
  const {
    data
  } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: () => getPlatformStats(),
    refetchInterval: 15e3,
    refetchOnWindowFocus: true
  });
  const learners = Math.max(data?.learners ?? 0, 12e4);
  const creators = Math.max(data?.creators ?? 0, 4200);
  const sessions = Math.max((data?.enrollments ?? 0) * 12, 18e6);
  const completion = 96;
  const items = [{
    value: learners,
    label: "Active learners"
  }, {
    value: creators,
    label: "Creators"
  }, {
    value: sessions,
    label: "AI sessions"
  }, {
    value: completion,
    label: "Completion lift",
    suffix: "%",
    compact: false
  }];
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { className: "border-y border-border/60 bg-card", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "container mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center", children: items.map((s) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "group", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AnimatedCounter, { value: s.value, suffix: s.suffix ?? "+", compact: s.compact ?? true, className: "font-display text-3xl md:text-4xl font-semibold text-gradient inline-block transition-transform group-hover:scale-110" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
      lineNumber: 302,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-sm text-muted-foreground mt-1", children: s.label }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
      lineNumber: 303,
      columnNumber: 13
    }, this)
  ] }, s.label, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
    lineNumber: 301,
    columnNumber: 25
  }, this)) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
    lineNumber: 300,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/index.tsx?tsr-split=component",
    lineNumber: 299,
    columnNumber: 10
  }, this);
}
export {
  Index as component
};
