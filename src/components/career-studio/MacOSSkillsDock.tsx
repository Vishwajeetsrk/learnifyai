"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { CourseBrandLogo } from "@/components/courses/CourseBrandLogo";
import { cn } from "@/lib/utils";
import { Sparkles, Check } from "lucide-react";

export interface DockSkill {
  id: string;
  name: string;
  brand: string;
  category: "frontend" | "backend" | "cloud" | "design" | "ai" | "tools";
}

export const POPULAR_DOCK_SKILLS: DockSkill[] = [
  { id: "react", name: "React", brand: "react", category: "frontend" },
  { id: "nextjs", name: "Next.js", brand: "nextjs", category: "frontend" },
  { id: "typescript", name: "TypeScript", brand: "typescript", category: "frontend" },
  { id: "javascript", name: "JavaScript", brand: "javascript", category: "frontend" },
  { id: "python", name: "Python", brand: "python", category: "backend" },
  { id: "nodejs", name: "Node.js", brand: "nodejs", category: "backend" },
  { id: "tailwind", name: "Tailwind CSS", brand: "tailwindcss", category: "frontend" },
  { id: "docker", name: "Docker", brand: "docker", category: "cloud" },
  { id: "aws", name: "AWS", brand: "aws", category: "cloud" },
  { id: "postgresql", name: "PostgreSQL", brand: "postgresql", category: "backend" },
  { id: "mongodb", name: "MongoDB", brand: "mongodb", category: "backend" },
  { id: "git", name: "Git", brand: "git", category: "tools" },
  { id: "github", name: "GitHub", brand: "github", category: "tools" },
  { id: "figma", name: "Figma", brand: "figma", category: "design" },
  { id: "ai", name: "AI & LLMs", brand: "chatgpt", category: "ai" },
];

interface MacOSSkillsDockProps {
  activeSkills: string[];
  onToggleSkill: (skillName: string) => void;
  className?: string;
}

export const MacOSSkillsDock: React.FC<MacOSSkillsDockProps> = ({
  activeSkills,
  onToggleSkill,
  className = "",
}) => {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [currentScales, setCurrentScales] = useState<number[]>(POPULAR_DOCK_SKILLS.map(() => 1));
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastMouseMoveTime = useRef<number>(0);

  // Responsive dock sizing parameters
  const [config, setConfig] = useState(() => {
    if (typeof window === "undefined") {
      return { baseIconSize: 42, maxScale: 1.55, effectWidth: 200 };
    }
    const width = window.innerWidth;
    if (width < 640) {
      return { baseIconSize: 34, maxScale: 1.35, effectWidth: 150 };
    }
    if (width < 1024) {
      return { baseIconSize: 38, maxScale: 1.45, effectWidth: 180 };
    }
    return { baseIconSize: 44, maxScale: 1.6, effectWidth: 220 };
  });

  const { baseIconSize, maxScale, effectWidth } = config;
  const minScale = 1.0;
  const baseSpacing = Math.max(4, Math.round(baseIconSize * 0.12));

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setConfig({ baseIconSize: 34, maxScale: 1.35, effectWidth: 150 });
      } else if (width < 1024) {
        setConfig({ baseIconSize: 38, maxScale: 1.45, effectWidth: 180 });
      } else {
        setConfig({ baseIconSize: 44, maxScale: 1.6, effectWidth: 220 });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Authentic macOS cosine-based magnification curve
  const calculateTargetMagnification = useCallback(
    (mousePosition: number | null) => {
      if (mousePosition === null) {
        return POPULAR_DOCK_SKILLS.map(() => minScale);
      }

      return POPULAR_DOCK_SKILLS.map((_, index) => {
        const normalIconCenter = index * (baseIconSize + baseSpacing) + baseIconSize / 2;
        const minX = mousePosition - effectWidth / 2;
        const maxX = mousePosition + effectWidth / 2;

        if (normalIconCenter < minX || normalIconCenter > maxX) {
          return minScale;
        }

        const theta = ((normalIconCenter - minX) / effectWidth) * 2 * Math.PI;
        const cappedTheta = Math.min(Math.max(theta, 0), 2 * Math.PI);
        const scaleFactor = (1 - Math.cos(cappedTheta)) / 2;

        return minScale + scaleFactor * (maxScale - minScale);
      });
    },
    [baseIconSize, baseSpacing, effectWidth, maxScale, minScale],
  );

  // Physics-based spring lerp animation loop
  const animateToTarget = useCallback(() => {
    const targetScales = calculateTargetMagnification(mouseX);
    const lerpFactor = mouseX !== null ? 0.22 : 0.12;

    setCurrentScales((prevScales) => {
      return prevScales.map((currentScale, index) => {
        const diff = targetScales[index] - currentScale;
        return currentScale + diff * lerpFactor;
      });
    });

    const scalesNeedUpdate = currentScales.some(
      (scale, index) => Math.abs(scale - targetScales[index]) > 0.003,
    );

    if (scalesNeedUpdate || mouseX !== null) {
      animationFrameRef.current = requestAnimationFrame(animateToTarget);
    }
  }, [mouseX, calculateTargetMagnification, currentScales]);

  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animateToTarget);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animateToTarget]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseMoveTime.current < 16) return;
      lastMouseMoveTime.current = now;

      if (dockRef.current) {
        const rect = dockRef.current.getBoundingClientRect();
        const padding = Math.max(8, baseIconSize * 0.15);
        setMouseX(e.clientX - rect.left - padding);
      }
    },
    [baseIconSize],
  );

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
    setActiveTooltip(null);
  }, []);

  const handleIconClick = (skill: DockSkill, index: number) => {
    const btn = iconRefs.current[index];
    if (btn) {
      btn.style.transition = "transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)";
      btn.style.transform = `scale(${currentScales[index] * 1.25}) translateY(-8px)`;
      setTimeout(() => {
        if (btn) {
          btn.style.transform = `scale(${currentScales[index]}) translateY(0px)`;
        }
      }, 180);
    }
    onToggleSkill(skill.name);
  };

  const isSkillActive = (skillName: string) => {
    const lower = skillName.toLowerCase();
    return activeSkills.some((s) => s.toLowerCase() === lower || s.toLowerCase().includes(lower));
  };

  return (
    <div className={cn("space-y-2 select-none", className)}>
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
          Interactive macOS Skill Dock
        </span>
        <span className="text-[11px] text-muted-foreground">Hover to magnify • Click to add</span>
      </div>

      <div className="overflow-x-auto pb-2 pt-4 px-1 scrollbar-none">
        <div
          ref={dockRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="inline-flex items-end justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-card/85 dark:bg-slate-900/85 backdrop-blur-xl border border-border/80 shadow-xl shadow-black/5 dark:shadow-black/40 min-w-max transition-colors"
          style={{
            height: `${Math.round(baseIconSize * maxScale) + 18}px`,
          }}
        >
          {POPULAR_DOCK_SKILLS.map((skill, index) => {
            const scale = currentScales[index] || 1;
            const active = isSkillActive(skill.name);
            const isHovered = activeTooltip === skill.name;

            return (
              <div
                key={skill.id}
                className="relative flex flex-col items-center justify-end"
                style={{
                  width: `${baseIconSize * scale}px`,
                  transition: "width 0.12s ease-out",
                }}
              >
                {/* macOS Hover Tooltip */}
                {isHovered && (
                  <div
                    className="absolute -top-9 px-2.5 py-1 rounded-md bg-slate-900 text-white text-[11px] font-semibold whitespace-nowrap shadow-lg pointer-events-none z-30 border border-slate-700/80 animate-in fade-in zoom-in-95 duration-150 flex items-center gap-1"
                    style={{
                      transform: "translateX(-50%)",
                      left: "50%",
                    }}
                  >
                    <span>{skill.name}</span>
                    {active && <Check className="h-2.5 w-2.5 text-emerald-400 stroke-[3]" />}
                  </div>
                )}

                {/* Magnified Dock Icon Button */}
                <button
                  ref={(el) => {
                    iconRefs.current[index] = el;
                  }}
                  type="button"
                  onClick={() => handleIconClick(skill, index)}
                  onMouseEnter={() => setActiveTooltip(skill.name)}
                  onMouseLeave={() => setActiveTooltip(null)}
                  className={cn(
                    "relative flex items-center justify-center rounded-xl transition-all cursor-pointer shadow-sm group",
                    active
                      ? "ring-2 ring-indigo-500 bg-indigo-50/90 dark:bg-indigo-950/60 shadow-indigo-500/20"
                      : "bg-muted/70 hover:bg-muted border border-border/60 hover:border-indigo-400/50",
                  )}
                  style={{
                    width: `${Math.round(baseIconSize * scale)}px`,
                    height: `${Math.round(baseIconSize * scale)}px`,
                    transformOrigin: "bottom center",
                  }}
                  title={skill.name}
                >
                  <div className="p-1.5 flex items-center justify-center pointer-events-none">
                    <CourseBrandLogo
                      brand={skill.brand}
                      size={Math.round(baseIconSize * scale * 0.62)}
                    />
                  </div>

                  {/* Active Skill Indicator Overlay Badge */}
                  {active && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                      <Check className="w-2 h-2 text-white stroke-[3]" />
                    </span>
                  )}
                </button>

                {/* macOS Dock Active Dot Indicator */}
                <div className="h-2 flex items-center justify-center mt-1">
                  <div
                    className={cn(
                      "w-1 h-1 rounded-full transition-all duration-300",
                      active
                        ? "bg-indigo-500 scale-125 ring-2 ring-indigo-500/30"
                        : "bg-transparent",
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
