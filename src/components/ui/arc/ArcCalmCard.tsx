import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ArcCalmCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  interactive?: boolean;
}

export function ArcCalmCard({
  children,
  className,
  glow = false,
  interactive = true,
  ...props
}: ArcCalmCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => interactive && setIsHovered(true)}
      onHoverEnd={() => interactive && setIsHovered(false)}
      whileHover={
        shouldReduceMotion || !interactive
          ? undefined
          : {
              y: -2,
              scale: 1.01,
              transition: { type: "spring", stiffness: 450, damping: 25 },
            }
      }
      whileTap={
        shouldReduceMotion || !interactive
          ? undefined
          : { scale: 0.99, transition: { duration: 0.1 } }
      }
      className={cn(
        "relative rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl p-5 shadow-sm transition-colors duration-200",
        interactive && "cursor-pointer hover:border-primary/40",
        glow && isHovered && "ring-1 ring-primary/30 shadow-[0_8px_30px_rgb(37,99,235,0.08)]",
        className,
      )}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}
