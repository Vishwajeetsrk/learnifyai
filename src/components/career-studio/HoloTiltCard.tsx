"use client";

import React, { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

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

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -8;
    const rY = ((x - centerX) / centerX) * 8;

    setRotateX(rX);
    setRotateY(rY);

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlare({ x: glareX, y: glareY, opacity: 0.18 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      style={{ perspective: 800 }}
      className="transition-transform duration-200"
    >
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`,
          transition: "transform 0.12s cubic-bezier(0.2, 0, 0.4, 1), box-shadow 0.2s ease",
        }}
        className={cn(
          "relative overflow-hidden rounded-xl border p-3.5 text-left cursor-pointer select-none transition-all",
          selected
            ? "border-primary bg-primary/10 ring-2 ring-primary/30 shadow-lg shadow-primary/15"
            : "border-border/80 bg-card hover:border-primary/50 hover:bg-muted/40 shadow-sm",
          className,
        )}
      >
        {/* Holographic dynamic glare sheen */}
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.8) 0%, rgba(99, 102, 241, 0.4) 40%, transparent 80%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-20">{children}</div>
      </div>
    </div>
  );
};
