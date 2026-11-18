"use client"

import * as React from "react"
import { HighlightText } from "@animate-ui/react/primitives/texts/highlight"
import { RefreshIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export { HighlightText }

export default function HighlightTextDemo({
  text = "Learn Smarter with AI Mentors",
  delay = 0,
  className,
}: {
  text?: string
  delay?: number
  className?: string
}) {
  const [run, setRun] = React.useState(0)

  return (
    <div className="flex flex-col items-center gap-6">
      <HighlightText
        key={`${run}-${delay}`}
        delay={delay}
        className={cn(
          "rounded-md bg-linear-to-r from-blue-100 to-purple-100 px-2 py-1 text-2xl sm:text-4xl font-semibold dark:from-blue-500/30 dark:to-purple-500/30",
          className
        )}
        text={text}
      />
      <Button variant="outline" size="sm" onClick={() => setRun((n) => n + 1)}>
        <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} data-icon="inline-start" />
        Replay
      </Button>
    </div>
  )
}
