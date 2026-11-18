"use client"

import * as React from "react"
import { AutoHeight } from "@animate-ui/react/primitives/effects/auto-height"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export { AutoHeight }

const SHORT =
  "Animate UI provides fluid, physics-based animated primitives built with Motion and Radix / Base UI."
const LONG = [
  "Animate UI provides fluid, physics-based animated primitives built with Motion and Radix / Base UI.",
  "Swap the import of your Radix UI, Base UI or React Aria primitives and your components animate smoothly with identical API semantics.",
  "Self-contained primitives cover reactive height interpolation, particle bursts, and tactile micro-interactions seamlessly.",
]

const swap = {
  initial: { opacity: 0, filter: "blur(4px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(4px)" },
  transition: { duration: 0.35, ease: "easeInOut" },
} as const

export default function AutoHeightDemo({
  className,
}: {
  className?: string
}) {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <div className={cn("flex w-full max-w-sm flex-col items-start gap-4", className)}>
      <AutoHeight
        deps={[expanded]}
        className="w-full rounded-xl border bg-card p-4 text-sm shadow-xs"
      >
        <AnimatePresence mode="wait" initial={false}>
          {expanded ? (
            <motion.div key="long" className="flex flex-col gap-2" {...swap}>
              {LONG.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed">{paragraph}</p>
              ))}
            </motion.div>
          ) : (
            <motion.p key="short" className="leading-relaxed" {...swap}>
              {SHORT}
            </motion.p>
          )}
        </AnimatePresence>
      </AutoHeight>
      <Button
        variant="outline"
        size="sm"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded ? "Show less" : "Show more"}
      </Button>
    </div>
  )
}
