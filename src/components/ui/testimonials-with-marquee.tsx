"use client";

import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { Quote, Award, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRealHumanAvatar } from "@/lib/real-avatars";

export interface TestimonialItem {
  name: string;
  college?: string;
  role?: string;
  rating?: number;
  review: string;
  achievement?: string;
  avatar?: string;
  linkedin?: string;
}

interface TestimonialsMarqueeProps {
  items: TestimonialItem[];
  speed?: number;
  className?: string;
  pauseOnHover?: boolean;
  onItemClick?: (item: TestimonialItem) => void;
}

function TestimonialCard({
  item,
  onClick,
}: {
  item: TestimonialItem;
  onClick?: () => void;
}) {
  return (
    <div
      className={cn(
        "relative w-72 shrink-0 rounded-2xl border border-border bg-card p-5 shadow-sm",
        "hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer select-none"
      )}
      onClick={onClick}
    >
      <Quote className="absolute top-4 right-4 h-6 w-6 text-primary/10" />

      {item.achievement && (
        <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold px-2.5 py-0.5 mb-3 border border-emerald-500/20">
          <Award className="w-3 h-3" />
          {item.achievement}
        </div>
      )}

      {item.rating != null && (
        <div className="flex gap-0.5 mb-2.5">
          {Array.from({ length: item.rating }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          ))}
        </div>
      )}

      <p className="text-xs text-foreground/80 leading-relaxed mb-4 line-clamp-4">
        &ldquo;{item.review}&rdquo;
      </p>

      <div className="flex items-center gap-3 pt-3 border-t border-border/60">
        <img
          src={
            item.avatar ||
            getRealHumanAvatar(item.name)
          }
          alt={item.name}
          className="h-9 w-9 rounded-full object-cover shrink-0 border border-primary/20 shadow-sm"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getRealHumanAvatar(item.name);
          }}
        />
        <div className="min-w-0">
          <div className="text-xs font-semibold truncate">{item.name}</div>
          {(item.role || item.college) && (
            <div className="text-[10px] text-muted-foreground truncate">
              {[item.role, item.college].filter(Boolean).join(" · ")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({
  items,
  speed,
  direction,
  pauseOnHover,
  onItemClick,
}: {
  items: TestimonialItem[];
  speed: number;
  direction: "left" | "right";
  pauseOnHover: boolean;
  onItemClick?: (item: TestimonialItem) => void;
}) {
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);

  const doubled = [...items, ...items, ...items];
  const CARD_WIDTH = 296; // 288px card + 8px gap

  useAnimationFrame((_t, delta) => {
    if (hovering.current && pauseOnHover) return;
    const totalWidth = CARD_WIDTH * items.length;
    const dir = direction === "left" ? -1 : 1;
    let next = x.get() + dir * (speed / 1000) * delta;
    if (Math.abs(next) >= totalWidth) {
      next = next % totalWidth;
    }
    x.set(next);
  });

  return (
    <div
      className="overflow-hidden relative"
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      {/* Gradient masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />

      <motion.div
        ref={containerRef}
        style={{ x }}
        className="flex gap-4 py-2"
      >
        {doubled.map((item, i) => (
          <TestimonialCard
            key={i}
            item={item}
            onClick={() => onItemClick?.(item)}
          />
        ))}
      </motion.div>
    </div>
  );
}

export function TestimonialsMarquee({
  items,
  speed = 40,
  className,
  pauseOnHover = true,
  onItemClick,
}: TestimonialsMarqueeProps) {
  if (!items || items.length === 0) return null;

  const half = Math.ceil(items.length / 2);
  const row1 = items.slice(0, half);
  const row2 = items.slice(half);

  return (
    <div className={cn("space-y-4", className)}>
      <MarqueeRow
        items={row1}
        speed={speed}
        direction="left"
        pauseOnHover={pauseOnHover}
        onItemClick={onItemClick}
      />
      {row2.length > 0 && (
        <MarqueeRow
          items={row2}
          speed={speed * 0.8}
          direction="right"
          pauseOnHover={pauseOnHover}
          onItemClick={onItemClick}
        />
      )}
    </div>
  );
}
