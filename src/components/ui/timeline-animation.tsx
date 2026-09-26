"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimelineItem {
  title: string;
  description?: string;
  date?: string;
  icon?: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

interface TimelineContentProps {
  items: TimelineItem[];
  className?: string;
  lineColor?: string;
  dotColor?: string;
}

function TimelineEntry({
  item,
  index,
  lineColor,
  dotColor,
}: {
  item: TimelineItem;
  index: number;
  lineColor: string;
  dotColor: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-6 pb-10 last:pb-0"
    >
      {/* Left column: dot + line */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.35, delay: index * 0.1 + 0.1 }}
          className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 bg-background shadow-sm"
          style={{ borderColor: dotColor }}
        >
          {item.icon ? (
            <span className="text-sm">{item.icon}</span>
          ) : (
            <div
              className="h-3 w-3 rounded-full"
              style={{ background: dotColor }}
            />
          )}
        </motion.div>
        {/* Vertical line — not on last item */}
        <div
          className="mt-2 flex-1 w-0.5 rounded-full"
          style={{ background: `linear-gradient(to bottom, ${lineColor}60, transparent)` }}
        />
      </div>

      {/* Right column: content */}
      <div className="flex-1 pb-2 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-semibold text-sm text-foreground leading-snug">{item.title}</h3>
          {item.badge && (
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
              style={{ background: item.badgeColor || dotColor }}
            >
              {item.badge}
            </span>
          )}
        </div>
        {item.date && (
          <p className="text-[11px] text-muted-foreground mb-1 font-medium">{item.date}</p>
        )}
        {item.description && (
          <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
        )}
      </div>
    </motion.div>
  );
}

export function TimelineContent({
  items,
  className,
  lineColor = "hsl(var(--primary))",
  dotColor = "hsl(var(--primary))",
}: TimelineContentProps) {
  return (
    <div className={cn("relative", className)}>
      {items.map((item, i) => (
        <TimelineEntry
          key={i}
          item={item}
          index={i}
          lineColor={lineColor}
          dotColor={dotColor}
        />
      ))}
    </div>
  );
}
