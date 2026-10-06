"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface HoloTiltCardProps {
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

export const HoloTiltCard: React.FC<HoloTiltCardProps> = ({
  selected = false,
  onClick,
  className = "",
  children,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    // Only enable 3D tilt calculations on fine pointer (mouse) devices
    if (typeof window !== "undefined") {
      setCanHover(window.matchMedia("(pointer: fine)").matches);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!canHover || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle, refined 4-degree tilt (replaces jarring steep tilt)
      const rX = ((y - centerY) / centerY) * -4;
      const rY = ((x - centerX) / centerX) * 4;

      setRotateX(rX);
      setRotateY(rY);

      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlare({ x: glareX, y: glareY, opacity: 0.12 });
    },
    [canHover],
  );

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      style={{ perspective: canHover ? 1000 : undefined }}
      className="transition-transform duration-200"
    >
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: canHover
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`
            : undefined,
          transition: "transform 0.15s ease-out, box-shadow 0.2s ease, border-color 0.2s ease",
        }}
        className={cn(
          "relative overflow-hidden rounded-xl border p-3.5 text-left cursor-pointer select-none transition-all duration-200",
          selected
            ? "border-primary bg-primary/10 ring-2 ring-primary/40 shadow-md shadow-primary/10"
            : "border-border/80 bg-card hover:border-primary/50 hover:bg-muted/40 shadow-xs",
          className,
        )}
      >
        {/* Subtle dynamic glare sheen for desktop */}
        {canHover && (
          <div
            className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
            style={{
              opacity: glare.opacity,
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.4) 0%, rgba(99, 102, 241, 0.2) 40%, transparent 80%)`,
            }}
          />
        )}

        {/* Selected check badge */}
        {selected && (
          <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs z-30">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </div>
        )}

        {/* Content */}
        <div className="relative z-20 pr-3">{children}</div>
      </div>
    </div>
  );
};
