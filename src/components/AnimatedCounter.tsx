import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring, motion } from "framer-motion";

function format(n: number, suffix: string, compact: boolean): string {
  if (!compact) return Math.round(n).toLocaleString() + suffix;
  if (n >= 1_000_000)
    return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace(/\.0$/, "") + "M" + suffix;
  if (n >= 1_000)
    return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1).replace(/\.0$/, "") + "K" + suffix;
  return Math.round(n).toLocaleString() + suffix;
}

export function AnimatedCounter({
  value,
  suffix = "",
  compact = true,
  duration = 1.6,
  className,
}: {
  value: number;
  suffix?: string;
  compact?: boolean;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.4 });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: duration * 1000, bounce: 0 });
  const [display, setDisplay] = useState("0" + suffix);

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => setDisplay(format(v, suffix, compact)));
    return () => unsub();
  }, [spring, suffix, compact]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {display}
    </motion.span>
  );
}
