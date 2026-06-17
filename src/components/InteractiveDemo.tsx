import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, FileText, Check, Send } from "lucide-react";

const tabs = [
  {
    id: "tutor",
    label: "AI Tutor",
    icon: Brain,
    desc: "Ask anything. Get personalized, step-by-step answers grounded in your course.",
  },
  {
    id: "quiz",
    label: "Quiz Generator",
    icon: Sparkles,
    desc: "Turn any topic into a 10-question MCQ in seconds, with explanations.",
  },
  {
    id: "notes",
    label: "Smart Notes",
    icon: FileText,
    desc: "Auto-generate flashcards, summaries, and slide decks from any lesson.",
  },
] as const;

type TabId = (typeof tabs)[number]["id"];

function TutorDemo() {
  const [typed, setTyped] = useState("");
  const full =
    "Sure! Gradient descent updates weights by moving opposite to the loss gradient. Step size = learning rate × ∂L/∂w …";
  useEffect(() => {
    setTyped("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="space-y-3" aria-live="polite">
      <div className="flex justify-end">
        <div className="rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm max-w-[80%] shadow-sm">
          Explain gradient descent like I'm new.
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <div
          className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <Brain className="h-3.5 w-3.5 text-white" />
        </div>
        <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5 text-sm max-w-[85%] min-h-[3rem]">
          {typed}
          <span
            className="inline-block w-1 h-3.5 bg-primary ml-0.5 animate-pulse align-middle"
            aria-hidden="true"
          />
        </div>
      </div>
      <form
        className="flex items-center gap-2 mt-4 rounded-full border border-border/60 bg-background px-4 py-2.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="demo-followup" className="sr-only">
          Ask a follow-up question
        </label>
        <input
          id="demo-followup"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          placeholder="Ask a follow-up…"
        />
        <button
          type="submit"
          aria-label="Send follow-up"
          className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Send className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}

function QuizDemo() {
  const [selected, setSelected] = useState<number | null>(null);
  const options = [
    { text: "O(n)", correct: false },
    { text: "O(log n)", correct: true },
    { text: "O(n²)", correct: false },
    { text: "O(1)", correct: false },
  ];
  useEffect(() => {
    setSelected(null);
    const id = setTimeout(() => setSelected(1), 1800);
    return () => clearTimeout(id);
  }, []);
  return (
    <fieldset>
      <legend className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
        Question 3 of 10
      </legend>
      <div className="font-semibold mb-4">What's the time complexity of binary search?</div>
      <div role="radiogroup" aria-label="Answer choices" className="space-y-2.5">
        {options.map((o, i) => {
          const isSel = selected === i;
          const isCorrect = isSel && o.correct;
          return (
            <motion.button
              key={o.text}
              type="button"
              role="radio"
              aria-checked={isSel}
              onClick={() => setSelected(i)}
              whileHover={{ x: 4 }}
              className={`w-full text-left rounded-xl border px-4 py-3 text-sm flex items-center justify-between transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                isCorrect
                  ? "border-emerald-500/60 bg-emerald-500/10"
                  : isSel
                    ? "border-rose-500/60 bg-rose-500/10"
                    : "border-border/60 bg-background hover:border-primary/40"
              }`}
            >
              <span>{o.text}</span>
              {isCorrect && (
                <Check className="h-4 w-4 text-emerald-500" aria-label="Correct answer" />
              )}
            </motion.button>
          );
        })}
      </div>
    </fieldset>
  );
}

function NotesDemo() {
  const cards = [
    { front: "Photosynthesis", back: "Plants convert light + CO₂ + H₂O → glucose + O₂" },
    { front: "Mitochondria", back: "The powerhouse of the cell — ATP production" },
    { front: "Newton's 2nd Law", back: "F = m × a" },
  ];
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setFlipped((f) => !f);
      if (flipped) setIdx((i) => (i + 1) % cards.length);
    }, 2200);
    return () => clearInterval(id);
  }, [flipped]);
  return (
    <div>
      <div
        className="text-xs uppercase tracking-wider text-muted-foreground mb-3"
        aria-live="polite"
      >
        Auto-generated flashcards · {idx + 1} of {cards.length}
      </div>
      <div className="relative h-40 [perspective:1000px]">
        <motion.div
          className="absolute inset-0 rounded-2xl border border-border/60 bg-card p-6 flex items-center justify-center text-center shadow-md"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.55 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="[backface-visibility:hidden] font-display text-xl font-semibold">
            {cards[idx].front}
          </div>
          <div className="absolute inset-0 flex items-center justify-center p-6 [transform:rotateY(180deg)] [backface-visibility:hidden] text-sm text-muted-foreground">
            {cards[idx].back}
          </div>
        </motion.div>
      </div>
      <div className="mt-3 flex gap-1.5" aria-hidden="true">
        {cards.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i === idx ? "bg-primary" : "bg-muted"}`}
          />
        ))}
      </div>
    </div>
  );
}

export function InteractiveDemo() {
  const [active, setActive] = useState<TabId>("tutor");
  const current = tabs.find((t) => t.id === active)!;
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
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

  return (
    <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-card to-background shadow-2xl overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 md:p-8 border-b border-border/60">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary font-medium">Live Demo</p>
          <h3 className="font-display text-2xl font-semibold mt-1.5" id="demo-tab-title">
            {current.label}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">{current.desc}</p>
        </div>
        <div role="tablist" aria-label="Interactive demo sections" className="flex flex-wrap gap-2">
          {tabs.map((t) => {
            const selected = active === t.id;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[t.id] = el;
                }}
                role="tab"
                id={`demo-tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`demo-panel-${t.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(t.id)}
                onKeyDown={onKeyDown}
                className={`px-3.5 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  selected
                    ? "bg-foreground text-background shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                <t.icon className="h-3.5 w-3.5" aria-hidden="true" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      <div
        role="tabpanel"
        id={`demo-panel-${active}`}
        aria-labelledby={`demo-tab-${active}`}
        className="p-6 md:p-8 min-h-[340px] bg-muted/20"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {active === "tutor" && <TutorDemo />}
            {active === "quiz" && <QuizDemo />}
            {active === "notes" && <NotesDemo />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
