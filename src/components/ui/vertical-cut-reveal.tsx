"use client";

import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface VerticalCutRevealProps {
  children: string;
  className?: string;
  splitBy?: "words" | "chars";
  staggerChildren?: number;
  duration?: number;
  delay?: number;
  containerClassName?: string;
}

export function VerticalCutReveal({
  children,
  className,
  splitBy = "words",
  staggerChildren = 0.06,
  duration = 0.65,
  delay = 0,
  containerClassName,
}: VerticalCutRevealProps) {
  const units = splitBy === "words" ? children.split(" ") : children.split("");

  const variants: Variants = {
    hidden: {
      y: "110%",
      opacity: 0,
      rotateX: -20,
    },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        duration,
        delay: delay + i * staggerChildren,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <motion.span
      initial="hidden"
      animate="visible"
      className={cn("inline-flex flex-wrap", containerClassName)}
      aria-label={children}
    >
      {units.map((unit, i) => (
        <span key={i} className="overflow-hidden inline-block" style={{ perspective: "800px" }}>
          <motion.span
            className={cn("inline-block", className)}
            custom={i}
            variants={variants}
          >
            {unit}
            {splitBy === "words" && i < units.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
