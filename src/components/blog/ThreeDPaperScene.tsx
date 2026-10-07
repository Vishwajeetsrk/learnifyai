"use client";

import React from "react";
import { ThreeDPaper, type ThreeDPaperVariant } from "@/shaders/3d-paper/ThreeDPaper";
import "@/shaders/threeui.css";
import { Award, Compass } from "lucide-react";

export interface ThreeDPaperSceneProps {
  variant?: ThreeDPaperVariant;
  title?: string;
  className?: string;
}

export function ThreeDPaperScene({
  variant = "certificate",
  title = "3D Interactive Holographic Certificate",
  className = "",
}: ThreeDPaperSceneProps) {
  return (
    <div className={`my-8 overflow-hidden rounded-2xl border border-border/60 bg-card/90 shadow-2xl not-prose ${className}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 bg-muted/30 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <Award className="h-4 w-4 text-primary" />
          <span className="text-xs font-display font-bold tracking-tight text-foreground">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
          <Compass className="h-3 w-3 text-emerald-400" />
          <span className="hidden sm:inline">Drag to turn & tilt · Hover to light</span>
        </div>
      </div>

      {/* 3D Canvas Frame */}
      <div className="shader-frame relative w-full h-[400px] sm:h-[480px] bg-[#08080a]">
        <ThreeDPaper variant={variant} className="w-full h-full" />
      </div>
    </div>
  );
}

export default ThreeDPaperScene;
