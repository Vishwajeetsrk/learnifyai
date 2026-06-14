import { c as createSsrRpc } from "./createSsrRpc-BR3wbl1z.mjs";
import { b as createServerFn } from "./server-BLOOEPZP.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BVm8xUae.mjs";
import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { T as Trophy, k as Sparkles } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
const COUPONS = {
  WELCOME10: {
    type: "percent",
    value: 10,
    label: "10% off"
  },
  LEARN20: {
    type: "percent",
    value: 20,
    label: "20% off"
  },
  STUDENT25: {
    type: "percent",
    value: 25,
    label: "25% student discount"
  },
  FLAT100: {
    type: "flat",
    value: 100,
    label: "₹100 off"
  },
  FLAT500: {
    type: "flat",
    value: 500,
    label: "₹500 off"
  }
};
const checkoutCart = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  coupon: stringType().max(32).optional().nullable()
}).parse(d ?? {})).handler(createSsrRpc("f966471f0f8d772914e7079bb4c6bdb7b3bdc0b3bbf083e774838addc510cd74"));
const enrollFree = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  courseId: stringType().uuid()
}).parse(d)).handler(createSsrRpc("38660a908ea62c5e5e1ea56cc139ed8843b00f8bfacf37baf697ab9dfdbb38fd"));
const markCourseStarted = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  courseId: stringType().uuid(),
  lessonId: stringType().uuid().optional()
}).parse(d)).handler(createSsrRpc("0cc2f971d05de3145f43353722b8178a645ace556cc25413698d1b3f614b3af3"));
const recomputeProgress = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  courseId: stringType().uuid()
}).parse(d)).handler(createSsrRpc("e97ccf3588dd1866bb25f9a7b8f8279c126f7c27de88a0113e7ef54960811555"));
function CelebrationOverlay({
  show,
  title,
  message,
  withSound = false,
  durationMs,
  onDone
}) {
  reactExports.useEffect(() => {
    if (!show || !durationMs || !onDone) return;
    const timer = window.setTimeout(onDone, durationMs);
    return () => window.clearTimeout(timer);
  }, [durationMs, onDone, show]);
  reactExports.useEffect(() => {
    if (!show || !withSound) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.09);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + index * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + index * 0.09 + 0.24);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(ctx.currentTime + index * 0.09);
      oscillator.stop(ctx.currentTime + index * 0.09 + 0.26);
    });
    const closeTimer = window.setTimeout(() => void ctx.close(), 900);
    return () => window.clearTimeout(closeTimer);
  }, [show, withSound]);
  if (!show) return null;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "fixed inset-0 z-[80] pointer-events-none grid place-items-center overflow-hidden bg-background/20 backdrop-blur-sm", children: [
    Array.from({ length: 26 }).map((_, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      motion.span,
      {
        className: "absolute h-2.5 w-2.5 rounded-full bg-primary shadow-glow",
        initial: { x: 0, y: 0, scale: 0, opacity: 0 },
        animate: {
          x: Math.cos(i * 0.75) * (160 + i % 6 * 28),
          y: Math.sin(i * 0.75) * (130 + i % 5 * 24),
          scale: [0, 1, 0.3],
          opacity: [0, 1, 0]
        },
        transition: { duration: 1.2, ease: "easeOut", delay: i % 5 * 0.025 }
      },
      i,
      false,
      {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CelebrationOverlay.tsx",
        lineNumber: 58,
        columnNumber: 9
      },
      this
    )),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      motion.div,
      {
        className: "rounded-2xl border bg-card px-8 py-7 text-center shadow-card max-w-sm mx-4",
        initial: { y: 24, opacity: 0, scale: 0.9 },
        animate: { y: 0, opacity: 1, scale: 1 },
        transition: { type: "spring", stiffness: 260, damping: 18 },
        children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mx-auto h-14 w-14 rounded-2xl bg-primary text-primary-foreground grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trophy, { className: "h-7 w-7" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CelebrationOverlay.tsx",
            lineNumber: 78,
            columnNumber: 11
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CelebrationOverlay.tsx",
            lineNumber: 77,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-4 flex items-center justify-center gap-2 text-primary", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CelebrationOverlay.tsx",
              lineNumber: 81,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs uppercase tracking-widest font-semibold", children: "Congratulations" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CelebrationOverlay.tsx",
              lineNumber: 82,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CelebrationOverlay.tsx",
              lineNumber: 83,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CelebrationOverlay.tsx",
            lineNumber: 80,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "mt-2 font-display text-2xl font-semibold", children: title }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CelebrationOverlay.tsx",
            lineNumber: 85,
            columnNumber: 9
          }, this),
          message && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-2 text-sm text-muted-foreground", children: message }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CelebrationOverlay.tsx",
            lineNumber: 86,
            columnNumber: 21
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CelebrationOverlay.tsx",
        lineNumber: 71,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CelebrationOverlay.tsx",
    lineNumber: 56,
    columnNumber: 5
  }, this);
}
export {
  COUPONS as C,
  CelebrationOverlay as a,
  checkoutCart as c,
  enrollFree as e,
  markCourseStarted as m,
  recomputeProgress as r
};
