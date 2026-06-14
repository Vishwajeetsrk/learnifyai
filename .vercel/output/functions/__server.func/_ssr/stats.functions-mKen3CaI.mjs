import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BR3wbl1z.mjs";
import { b as createServerFn } from "./server-BLOOEPZP.mjs";
import { u as useInView, a as useMotionValue, b as useSpring, m as motion } from "../_libs/framer-motion.mjs";
function format(n, suffix, compact) {
  if (!compact) return Math.round(n).toLocaleString() + suffix;
  if (n >= 1e6)
    return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, "") + "M" + suffix;
  if (n >= 1e3)
    return (n / 1e3).toFixed(n >= 1e4 ? 0 : 1).replace(/\.0$/, "") + "K" + suffix;
  return Math.round(n).toLocaleString() + suffix;
}
function AnimatedCounter({
  value,
  suffix = "",
  compact = true,
  duration = 1.6,
  className
}) {
  const ref = reactExports.useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.4 });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: duration * 1e3, bounce: 0 });
  const [display, setDisplay] = reactExports.useState("0" + suffix);
  reactExports.useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);
  reactExports.useEffect(() => {
    const unsub = spring.on("change", (v) => setDisplay(format(v, suffix, compact)));
    return () => unsub();
  }, [spring, suffix, compact]);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    motion.span,
    {
      ref,
      className,
      initial: { opacity: 0, y: 8 },
      animate: inView ? { opacity: 1, y: 0 } : {},
      transition: { duration: 0.5 },
      children: display
    },
    void 0,
    false,
    {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AnimatedCounter.tsx",
      lineNumber: 42,
      columnNumber: 5
    },
    this
  );
}
const getPlatformStats = createServerFn({
  method: "GET"
}).handler(createSsrRpc("650b04cc0e21de1a2a2c7a4767bb223985953e97b50d84eeb1221e8983ab99f1"));
export {
  AnimatedCounter as A,
  getPlatformStats as g
};
