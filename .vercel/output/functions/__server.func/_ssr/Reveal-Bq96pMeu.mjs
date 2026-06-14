import { e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
const variants = {
  up: { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  scale: { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } },
  left: { hidden: { opacity: 0, x: -32 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 32 }, show: { opacity: 1, x: 0 } }
};
function Reveal({
  children,
  as: _As,
  delay = 0,
  duration = 0.6,
  variant = "up",
  className,
  amount = 0.2,
  once = true
}) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    motion.div,
    {
      className,
      initial: "hidden",
      whileInView: "show",
      viewport: { once, amount },
      variants: variants[variant],
      transition: { duration, delay, ease: [0.22, 1, 0.36, 1] },
      children
    },
    void 0,
    false,
    {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/Reveal.tsx",
      lineNumber: 32,
      columnNumber: 5
    },
    this
  );
}
function StaggerGroup({
  children,
  className,
  delay = 0,
  stagger = 0.08,
  amount = 0.15
}) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    motion.div,
    {
      className,
      initial: "hidden",
      whileInView: "show",
      viewport: { once: true, amount },
      variants: {
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } }
      },
      children
    },
    void 0,
    false,
    {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/Reveal.tsx",
      lineNumber: 59,
      columnNumber: 5
    },
    this
  );
}
function StaggerItem({
  children,
  className,
  variant = "up"
}) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    motion.div,
    {
      className,
      variants: variants[variant],
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      children
    },
    void 0,
    false,
    {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/Reveal.tsx",
      lineNumber: 84,
      columnNumber: 5
    },
    this
  );
}
export {
  Reveal as R,
  StaggerGroup as S,
  StaggerItem as a
};
