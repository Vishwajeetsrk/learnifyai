import React from "react";
import { cn } from "@/lib/utils";

// Premium Gamification Badges using SVG gradients and drop shadows

export function StreakBadge({ className, level = 1 }: { className?: string; level?: number }) {
  const isHigh = level > 5;
  return (
    <svg viewBox="0 0 100 100" className={cn("w-12 h-12 drop-shadow-md", className)}>
      <defs>
        <linearGradient id="streakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isHigh ? "#FF512F" : "#F09819"} />
          <stop offset="100%" stopColor={isHigh ? "#DD2476" : "#EDDE5D"} />
        </linearGradient>
        <filter id="glowStreak" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <path
        d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z"
        fill="url(#streakGrad)"
        stroke="#fff"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M45 25 Q65 40 55 55 Q70 60 50 80 Q40 60 50 45 Q35 40 45 25 Z"
        fill="#fff"
        filter="url(#glowStreak)"
        className="animate-pulse"
      />
    </svg>
  );
}

export function XpBadge({ className, level = 1 }: { className?: string; level?: number }) {
  const isHigh = level > 5;
  return (
    <svg viewBox="0 0 100 100" className={cn("w-12 h-12 drop-shadow-md", className)}>
      <defs>
        <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isHigh ? "#8E2DE2" : "#4CA1AF"} />
          <stop offset="100%" stopColor={isHigh ? "#4A00E0" : "#C4E0E5"} />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill="url(#xpGrad)" stroke="#fff" strokeWidth="4" />
      <polygon
        points="50,20 60,40 80,40 65,55 70,75 50,65 30,75 35,55 20,40 40,40"
        fill="#fff"
        className="animate-spin-slow origin-center"
        style={{ animationDuration: "10s" }}
      />
    </svg>
  );
}

export function CourseBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("w-12 h-12 drop-shadow-md", className)}>
      <defs>
        <linearGradient id="courseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#11998e" />
          <stop offset="100%" stopColor="#38ef7d" />
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="60" height="60" rx="12" fill="url(#courseGrad)" stroke="#fff" strokeWidth="4" />
      <path d="M35 40 L65 40 M35 50 L65 50 M35 60 L55 60" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function TestBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("w-12 h-12 drop-shadow-md", className)}>
      <defs>
        <linearGradient id="testGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF416C" />
          <stop offset="100%" stopColor="#FF4B2B" />
        </linearGradient>
      </defs>
      <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="url(#testGrad)" stroke="#fff" strokeWidth="4" />
      <path d="M35 50 L45 60 L65 40" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChallengeBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("w-12 h-12 drop-shadow-md", className)}>
      <defs>
        <linearGradient id="chalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2980B9" />
          <stop offset="100%" stopColor="#6DD5FA" />
        </linearGradient>
      </defs>
      <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" fill="url(#chalGrad)" stroke="#fff" strokeWidth="4" />
      <path d="M40 40 L60 60 M60 40 L40 60" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}
