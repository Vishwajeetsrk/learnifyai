import { useState } from "react";
import type { ReactNode } from "react";
import {
  Download,
  Printer,
  FileText,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Zap,
  Code2,
  BookOpen,
  Building2,
  Link,
  Table,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  GraduationCap,
  Lightbulb,
  Bookmark,
  BookmarkCheck,
  Clock,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CheatSection {
  id: string;
  title: string;
  icon: string;
  content: string;
  code?: string;
  lang?: string;
}

export interface QuickRef {
  term: string;
  definition: string;
  example?: string;
}

export interface CheatComparison {
  title: string;
  headers: string[];
  rows: string[][];
}

export interface Gotcha {
  bad: string;
  good: string;
}

export interface InterviewQA {
  q: string;
  a: string;
}

export interface Resource {
  title: string;
  url: string;
  type: "docs" | "video" | "course" | "tool";
}

export interface CheatSheetData {
  topic: string;
  level: "beginner" | "advanced";
  tagline: string;
  emoji: string;
  color: string;
  sections: CheatSection[];
  quickref: QuickRef[];
  comparison: CheatComparison;
  gotchas: Gotcha[];
  interviewQA: InterviewQA[];
  companies: string[];
  resources: Resource[];
}

interface CheatSheetRendererProps {
  data: CheatSheetData;
  rawJson: string;
  onReset?: () => void;
}

// ─── Brand Logo SVGs ──────────────────────────────────────────────────────────

const BRAND_LOGOS: Record<string, ReactNode> = {
  html: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="HTML5">
      <path d="M5 3l2.2 24.4L16 30l8.8-2.6L27 3z" fill="#E44D26" />
      <path d="M16 28.1l7.1-2L25 5H16z" fill="#F16529" />
      <path
        d="M11.5 14h4.5V10.5H8l.3 3.5H11.5zm-.3 4h-3.8l.3 3.5L16 23.6v-3.7l-4.8-1.3z"
        fill="#EBEBEB"
      />
      <path d="M16 10.5v3.5h4.2l-.4 4-3.8 1v3.7l7-2-.1-.6-.7-8.1-.1-1H16z" fill="white" />
    </svg>
  ),
  css: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="CSS3">
      <path d="M5 3l2.2 24.4L16 30l8.8-2.6L27 3z" fill="#1572B6" />
      <path d="M16 28.1l7.1-2L25 5H16z" fill="#33A9DC" />
      <path
        d="M16 13h4.5l-.3 3.5L16 17.5v3.7l6.9-1.9.1-.6.7-7.7H16zm0-2.5H9.5l.3 3.5H16z"
        fill="white"
      />
      <path d="M16 17.5l-3.5-1-.3-3H9l.6 6.5L16 21.2z" fill="#EBEBEB" />
    </svg>
  ),
  javascript: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="JavaScript">
      <rect width="32" height="32" fill="#F7DF1E" rx="2" />
      <path
        d="M9.5 25.5l2.1-1.3c.4.7.8 1.3 1.7 1.3.8 0 1.4-.3 1.4-1.6V14h2.6v9.9c0 2.6-1.5 3.8-3.8 3.8-2 0-3.2-1-3.8-2.2zm7.5-.2l2.1-1.2c.6.9 1.3 1.6 2.6 1.6 1.1 0 1.8-.5 1.8-1.3 0-.9-.7-1.2-1.9-1.7l-.6-.3c-1.9-.8-3.2-1.8-3.2-3.9 0-1.9 1.5-3.4 3.8-3.4 1.7 0 2.9.6 3.7 2l-2 1.3c-.4-.8-1-1.1-1.7-1.1-.8 0-1.3.5-1.3 1.1 0 .8.5 1.1 1.6 1.6l.6.3c2.2 1 3.5 1.9 3.5 4.1 0 2.3-1.8 3.6-4.3 3.6-2.4 0-3.9-1.1-4.7-2.7z"
        fill="#333"
      />
    </svg>
  ),
  typescript: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="TypeScript">
      <rect width="32" height="32" fill="#3178C6" rx="2" />
      <path
        d="M18 14.5h-4v11h-2.5v-11H7.5V12H18v2.5zm1 7.5c.4.8 1 1.4 2.3 1.4 1.1 0 1.8-.5 1.8-1.3 0-.9-.7-1.2-1.8-1.7l-.6-.3c-1.8-.8-3-1.7-3-3.7 0-1.9 1.4-3.2 3.6-3.2 1.5 0 2.7.5 3.5 1.9l-1.9 1.2c-.4-.7-.9-1-1.7-1-.7 0-1.2.4-1.2 1 0 .7.5 1 1.5 1.5l.6.3c2.1.9 3.3 1.8 3.3 3.9 0 2.2-1.7 3.4-4 3.4-2.3 0-3.8-1-4.4-2.6l2-.9z"
        fill="white"
      />
    </svg>
  ),
  react: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="React">
      <circle cx="16" cy="16" r="3" fill="#61DAFB" />
      <ellipse cx="16" cy="16" rx="14" ry="5.5" fill="none" stroke="#61DAFB" strokeWidth="1.5" />
      <ellipse
        cx="16"
        cy="16"
        rx="14"
        ry="5.5"
        fill="none"
        stroke="#61DAFB"
        strokeWidth="1.5"
        transform="rotate(60 16 16)"
      />
      <ellipse
        cx="16"
        cy="16"
        rx="14"
        ry="5.5"
        fill="none"
        stroke="#61DAFB"
        strokeWidth="1.5"
        transform="rotate(120 16 16)"
      />
    </svg>
  ),
  vue: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="Vue.js">
      <path d="M16 4l4 7H28L16 28 4 11h8z" fill="#42B883" />
      <path d="M16 4l4 7h-8z" fill="#35495E" />
    </svg>
  ),
  angular: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="Angular">
      <path d="M16 3L4 7l1.8 15.6L16 28l10.2-5.4L28 7z" fill="#DD0031" />
      <path d="M16 3v25l10.2-5.4L28 7z" fill="#C3002F" />
      <path d="M16 7.5l7 15.5h-2.5L19 19.5h-6L11.5 23H9zm0 5.5l-2.2 5h4.4z" fill="white" />
    </svg>
  ),
  nodejs: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="Node.js">
      <path d="M16 3L4 9.5v13L16 29l12-6.5v-13z" fill="#339933" />
      <path d="M16 6.5v19" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M16 6.5l10 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 25.5L6 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  python: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="Python">
      <path
        d="M15.9 3C10.4 3 10 5.5 10 7.5V10h6v1H7.5C5.5 11 3 12 3 16s2.5 5 4.5 5H9v-2.5c0-2 2-4 4.5-4H19c2.5 0 4.5-2 4.5-4V7.5C23.5 5 21 3 15.9 3zm-1 3c.8 0 1.5.7 1.5 1.5S15.7 9 14.9 9s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5z"
        fill="#3776AB"
      />
      <path
        d="M16.1 29c5.5 0 5.9-2.5 5.9-4.5V22h-6v-1h8.5c2 0 4.5-1 4.5-5s-2.5-5-4.5-5H23v2.5c0 2-2 4-4.5 4H13c-2.5 0-4.5 2-4.5 4v5c0 2.5 2.5 4.5 7.6 4.5zm1-3c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z"
        fill="#FFD43B"
      />
    </svg>
  ),
  supabase: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="Supabase">
      <defs>
        <linearGradient id="sbGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3ECF8E" />
          <stop offset="100%" stopColor="#1C9B6A" />
        </linearGradient>
      </defs>
      <path d="M18 3L5 18h9l-2 11 16-15h-10z" fill="url(#sbGrad)" />
    </svg>
  ),
  firebase: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="Firebase">
      <path d="M7 24.5l5-10 3 4.5 2-8 8 13.5H7z" fill="#FFA000" />
      <path d="M12 14.5l3 4.5 2-8 8 13.5-8-13.5-5 3.5z" fill="#F57F17" />
      <path d="M7 24.5L12 4l3 6.5 2-3 6 10.5-8-6L7 24.5z" fill="#FFCA28" />
    </svg>
  ),
  docker: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="Docker">
      <path
        d="M28.5 14.5c-.5-.4-1.7-.6-2.6-.4-.1-.9-.6-1.7-1.5-2.3l-.5-.3-.4.5c-.5.7-.6 1.9-.2 2.7-.3.2-.8.4-1.4.5H3c-.2 1.2.1 2.8 1.1 3.9.9 1 2.3 1.5 4.2 1.5 4 0 7-1.8 8.8-5h1.1c.8 0 2.6-.1 3.4-1.6.1.1.3.3.4.3l.5.3.5-.4c.6-.5.9-1.5.5-2.7z"
        fill="#2496ED"
      />
      <path
        d="M6 14H4v2h2zm3 0H7v2h2zm3 0h-2v2h2zm3 0h-2v2h2zm-9-3H4v2h2zm3 0H7v2h2zm3 0h-2v2h2zm3 0h-2v2h2zm0-3h-2v2h2zm3 0h-2v2h2z"
        fill="white"
      />
    </svg>
  ),
  git: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="Git">
      <path
        d="M29.5 14.5L17.5 2.5a1.7 1.7 0 00-2.4 0L12.7 4.9l3 3a2 2 0 012.6 2.5l2.9 2.9a2 2 0 112.4 3.7 2 2 0 01-2.8-2.8l-2.7-2.7v7.1a2 2 0 11-2.4 2.5 2 2 0 012.4-2.7V9.9a2 2 0 01-.7-3.3l-3-2.9-7.9 7.9a1.7 1.7 0 000 2.4l12 12a1.7 1.7 0 002.4 0l10-10a1.7 1.7 0 000-2.5z"
        fill="#F05032"
      />
    </svg>
  ),
  mysql: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="MySQL">
      <path
        d="M4 16.5c0-5 5.4-9 12-9s12 4 12 9c0 1.2-.3 2.3-.9 3.3L29 28h-3l-1.8-7.2A12.5 12.5 0 014 16.5z"
        fill="#00618A"
      />
      <path
        d="M16 10.5c-3.9 0-7 2.2-7 5 0 1.4.8 2.7 2 3.6l1.2-4.7h7.5l1.2 4.7c1.3-.9 2-2.2 2-3.6 0-2.8-3.1-5-7-5z"
        fill="white"
      />
    </svg>
  ),
  postgresql: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="PostgreSQL">
      <circle cx="16" cy="16" r="13" fill="#336791" />
      <path
        d="M16 7c-5 0-8 2.5-8 6 0 2 1.2 3.8 3 5-.4 2-1 4-1 4h3l1-3c.6.1 1.3.2 2 .2s1.4-.1 2-.2l1 3h3s-.6-2-1-4c1.8-1.2 3-3 3-5 0-3.5-3-6-8-6z"
        fill="white"
        opacity="0.9"
      />
    </svg>
  ),
  mongodb: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="MongoDB">
      <path
        d="M16 3C9.4 3 5 10 5 16c0 6.5 4 11 7 12l1 1v-8.5C10.5 20 9 18 9 16c0-3.9 3.1-7 7-7s7 3.1 7 7c0 2-1.5 4-4 4.5V29l1-1c3-1 7-5.5 7-12 0-6-4.4-13-11-13z"
        fill="#47A248"
      />
      <path d="M16 9a7 7 0 010 14V9z" fill="#B8F0C0" opacity="0.5" />
    </svg>
  ),
  aws: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="AWS">
      <path
        d="M9 19c-1.5.4-2.5 1.3-2.5 2.5 0 1.7 1.5 2.5 4 2.5 1 0 2-.1 2.7-.3L9 19zm14 0l-4.2 4.7c.7.2 1.7.3 2.7.3 2.5 0 4-.8 4-2.5 0-1.2-1-2.1-2.5-2.5z"
        fill="#FF9900"
      />
      <path
        d="M16 8.5C12.4 8.5 9 11 9 14c0 1.5.8 2.9 2 3.8L16 12l5 5.8c1.2-.9 2-2.3 2-3.8 0-3-3.4-5.5-7-5.5z"
        fill="#FF9900"
      />
      <path d="M10.5 17.5L16 12l5.5 5.5c-.5.3-1.8.5-3.5.5h-4c-1.7 0-3-.2-3.5-.5z" fill="#FF9900" />
    </svg>
  ),
  wordpress: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="WordPress">
      <circle cx="16" cy="16" r="13" fill="#21759B" />
      <path
        d="M3.5 16c0-2.7.9-5.2 2.3-7.2L10 20.5A12.5 12.5 0 013.5 16zm10 12.3L9 17l-2.5 7A12.5 12.5 0 0013.5 28.3zm5-1.3l4-11.5.5 10.5A12.5 12.5 0 0118.5 27zm1.2-16.5c.6 0 1.1-.1 1.1-.1 .5-.1.5-.7-.1-.7 0 0-1.6.1-2.5.1-.9 0-2.4-.1-2.4-.1-.6 0-.6.6-.1.7 0 0 .5.1 1 .1l1.4 3.9-2 6.1-3.3-9.9c.6 0 1.1-.1 1.1-.1.5-.1.5-.7-.1-.7 0 0-1.6.1-2.5.1l-.8-.1C11.8 8 13.8 7 16 7c1.8 0 3.4.6 4.7 1.5z"
        fill="white"
      />
    </svg>
  ),
  figma: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="Figma">
      <path d="M16 16a4 4 0 118 0 4 4 0 01-8 0z" fill="#1ABCFE" />
      <path d="M8 24a4 4 0 014-4h4v4a4 4 0 01-8 0z" fill="#0ACF83" />
      <path d="M16 4h-4a4 4 0 000 8h4V4z" fill="#FF7262" />
      <path d="M8 8a4 4 0 004 4h4V4h-4a4 4 0 00-4 4z" fill="#F24E1E" />
      <path d="M8 16a4 4 0 004 4h4v-8h-4a4 4 0 00-4 4z" fill="#A259FF" />
    </svg>
  ),
  canva: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="Canva">
      <circle cx="16" cy="16" r="13" fill="#00C4CC" />
      <path
        d="M20.5 12.5a5 5 0 00-4.5 2.8 5 5 0 00-4.5-2.8 5 5 0 000 10h9a5 5 0 000-10z"
        fill="white"
      />
    </svg>
  ),
  chatgpt: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="ChatGPT">
      <circle cx="16" cy="16" r="13" fill="#10A37F" />
      <path
        d="M23 12.5c0-2.5-2-4.5-4.5-4.5-1.2 0-2.3.4-3.1 1.1A4.5 4.5 0 009 13a4.5 4.5 0 001.5 8.5H21a3 3 0 000-6h-1.5A3 3 0 0023 12.5z"
        fill="white"
        opacity="0.9"
      />
    </svg>
  ),
  excel: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="Excel">
      <rect x="2" y="2" width="28" height="28" rx="4" fill="#217346" />
      <path d="M18 8h8v16h-8z" fill="#33A65E" opacity="0.5" />
      <path d="M7 11l4 5-4 5h3l2.5-3.5L15 21h3l-4-5 4-5h-3l-2.5 3.5L10 11z" fill="white" />
      <rect x="18" y="8" width="8" height="2.5" fill="white" opacity="0.7" />
      <rect x="18" y="12.5" width="8" height="2.5" fill="white" opacity="0.7" />
      <rect x="18" y="17" width="8" height="2.5" fill="white" opacity="0.7" />
      <rect x="18" y="21.5" width="8" height="2.5" fill="white" opacity="0.7" />
    </svg>
  ),
  gmail: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="Gmail">
      <path d="M4 6h24v20H4z" fill="white" />
      <path d="M4 6l12 10L28 6H4z" fill="#EA4335" />
      <path d="M4 6v20l7-7V11z" fill="#34A853" />
      <path d="M28 6v20l-7-7V11z" fill="#FBBC04" />
      <path d="M4 26l7-7h10l7 7H4z" fill="#4285F4" />
    </svg>
  ),
  google: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="Google">
      <path
        d="M28.8 16.2c0-.9-.1-1.8-.2-2.7H16v5.1h7.2a6.2 6.2 0 01-2.7 4v3.3h4.3c2.6-2.4 4-5.9 4-9.7z"
        fill="#4285F4"
      />
      <path
        d="M16 29c3.6 0 6.7-1.2 8.9-3.2l-4.3-3.3a8.9 8.9 0 01-4.6 1.3 8.8 8.8 0 01-8.3-6.1H3.2v3.5A13 13 0 0016 29z"
        fill="#34A853"
      />
      <path
        d="M7.7 17.7A8.8 8.8 0 017.2 15a8.8 8.8 0 01.5-2.7V8.8H3.2A13 13 0 003 15a13 13 0 00.2 2.8z"
        fill="#FBBC04"
      />
      <path
        d="M16 8.3a7 7 0 015 2l3.7-3.7A12.5 12.5 0 0016 3 13 13 0 003.2 8.8L7.7 12.3A8.8 8.8 0 0116 8.3z"
        fill="#EA4335"
      />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="GitHub">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 3C9.4 3 4 8.5 4 15.4c0 5.5 3.5 10.1 8.4 11.7.6.1.8-.3.8-.6v-2c-3.4.8-4.1-1.6-4.1-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.3 1.8 1.3 1.1 1.9 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.4-5.5-6.1 0-1.4.5-2.5 1.2-3.4-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.4 1.3a11.5 11.5 0 016 0c2.3-1.6 3.4-1.3 3.4-1.3.7 1.7.2 3 .1 3.3.8.9 1.2 2 1.2 3.4 0 4.8-2.8 5.8-5.5 6.1.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6C24.5 25.5 28 20.9 28 15.4 28 8.5 22.6 3 16 3z"
        fill="#24292E"
      />
    </svg>
  ),
  tailwind: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="Tailwind CSS">
      <path
        d="M16 7c-3.6 0-5.8 1.8-6.9 5.4 1.4-1.8 2.9-2.5 4.6-2.1 1 .2 1.7 1 2.5 1.8 1.3 1.3 2.7 2.8 5.9 2.8 3.6 0 5.8-1.8 6.9-5.4-1.4 1.8-2.9 2.5-4.6 2.1-1-.2-1.7-1-2.5-1.8C20.6 8.5 19.2 7 16 7zm-6.9 9c-3.6 0-5.8 1.8-6.9 5.4 1.4-1.8 2.9-2.5 4.6-2.1 1 .2 1.7 1 2.5 1.8 1.3 1.3 2.7 2.8 5.9 2.8 3.6 0 5.8-1.8 6.9-5.4-1.4 1.8-2.9 2.5-4.6 2.1-1-.2-1.7-1-2.5-1.8-1.3-1.3-2.7-2.8-5.9-2.8z"
        fill="#38BDF8"
      />
    </svg>
  ),
  nextjs: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="Next.js">
      <circle cx="16" cy="16" r="13" fill="black" />
      <path
        d="M10 22V10l14 14.5V10"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),
  vite: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="Vite">
      <path d="M29 5L16.5 27 4 5h7.5L16.5 14 21.5 5z" fill="#646CFF" />
      <path d="M16.5 27L21.5 5h7.5z" fill="#FF9A37" />
    </svg>
  ),
  redis: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="Redis">
      <ellipse cx="16" cy="22" rx="13" ry="4.5" fill="#A41E11" />
      <ellipse cx="16" cy="17.5" rx="13" ry="4.5" fill="#D82C20" />
      <ellipse cx="16" cy="13" rx="13" ry="4.5" fill="#FF6B6B" />
      <path d="M3 13v9c0 2.5 5.8 4.5 13 4.5s13-2 13-4.5v-9" fill="#D82C20" opacity="0.5" />
    </svg>
  ),
  kubernetes: (
    <svg viewBox="0 0 32 32" className="w-full h-full" aria-label="Kubernetes">
      <circle cx="16" cy="16" r="13" fill="#326CE5" />
      <path d="M16 5l10 5v12l-10 5L6 22V10z" fill="none" stroke="white" strokeWidth="1.5" />
      <circle cx="16" cy="5" r="1.5" fill="white" />
      <circle cx="26" cy="10" r="1.5" fill="white" />
      <circle cx="26" cy="22" r="1.5" fill="white" />
      <circle cx="16" cy="27" r="1.5" fill="white" />
      <circle cx="6" cy="22" r="1.5" fill="white" />
      <circle cx="6" cy="10" r="1.5" fill="white" />
    </svg>
  ),
};

function getBrandLogo(name: string): ReactNode | null {
  const normalized = name
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, "")
    .replace(/\.js$/, "js")
    .replace("node.js", "nodejs")
    .replace("vue.js", "vue")
    .replace("next.js", "nextjs");
  return BRAND_LOGOS[normalized] ?? null;
}

function CompanyChip({ name }: { name: string }) {
  const logo = getBrandLogo(name);
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/50 bg-card/60 hover:bg-card transition-all hover:shadow-sm hover:-translate-y-0.5 duration-150">
      {logo ? (
        <div className="w-4 h-4 shrink-0">{logo}</div>
      ) : (
        <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      )}
      <span className="text-[11px] font-medium">{name}</span>
    </div>
  );
}

// ─── Color palette helper ─────────────────────────────────────────────────────

function colorPalette(color: string) {
  const map: Record<
    string,
    { bg: string; border: string; text: string; badge: string; codeBg: string; headerGrad: string }
  > = {
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      text: "text-blue-400",
      badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      codeBg: "bg-blue-950/40",
      headerGrad: "from-blue-600 to-blue-800",
    },
    orange: {
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
      text: "text-orange-400",
      badge: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      codeBg: "bg-orange-950/40",
      headerGrad: "from-orange-600 to-orange-800",
    },
    red: {
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      text: "text-red-400",
      badge: "bg-red-500/20 text-red-300 border-red-500/30",
      codeBg: "bg-red-950/40",
      headerGrad: "from-red-600 to-red-800",
    },
    green: {
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      text: "text-green-400",
      badge: "bg-green-500/20 text-green-300 border-green-500/30",
      codeBg: "bg-green-950/40",
      headerGrad: "from-green-600 to-green-800",
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      text: "text-purple-400",
      badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      codeBg: "bg-purple-950/40",
      headerGrad: "from-purple-600 to-purple-800",
    },
    yellow: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      text: "text-yellow-400",
      badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      codeBg: "bg-yellow-950/40",
      headerGrad: "from-yellow-600 to-yellow-800",
    },
    pink: {
      bg: "bg-pink-500/10",
      border: "border-pink-500/30",
      text: "text-pink-400",
      badge: "bg-pink-500/20 text-pink-300 border-pink-500/30",
      codeBg: "bg-pink-950/40",
      headerGrad: "from-pink-600 to-pink-800",
    },
    cyan: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
      text: "text-cyan-400",
      badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      codeBg: "bg-cyan-950/40",
      headerGrad: "from-cyan-600 to-cyan-800",
    },
    indigo: {
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/30",
      text: "text-indigo-400",
      badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      codeBg: "bg-indigo-950/40",
      headerGrad: "from-indigo-600 to-indigo-800",
    },
    teal: {
      bg: "bg-teal-500/10",
      border: "border-teal-500/30",
      text: "text-teal-400",
      badge: "bg-teal-500/20 text-teal-300 border-teal-500/30",
      codeBg: "bg-teal-950/40",
      headerGrad: "from-teal-600 to-teal-800",
    },
  };
  return map[color] ?? map["blue"];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ResourceIcon({ type }: { type: Resource["type"] }) {
  if (type === "docs") return <BookOpen className="h-3 w-3" />;
  if (type === "video") return <Zap className="h-3 w-3" />;
  if (type === "course") return <GraduationCap className="h-3 w-3" />;
  return <Code2 className="h-3 w-3" />;
}

function SectionIcon({ icon, className }: { icon: string; className?: string }) {
  const map: Record<string, typeof BookOpen> = {
    book: BookOpen,
    code: Code2,
    zap: Zap,
    lightbulb: Lightbulb,
    sparkles: Sparkles,
    message: MessageSquare,
    link: Link,
    table: Table,
    building: Building2,
    check: CheckCircle,
  };
  const Icon = map[icon] ?? BookOpen;
  return <Icon className={cn("h-4 w-4", className)} />;
}

function QACard({ qa, idx }: { qa: InterviewQA; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((o) => !o)}
      className="w-full text-left border border-border/60 rounded-xl overflow-hidden transition-all duration-200 hover:border-border"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-card/60">
        <div className="flex items-start gap-2.5">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold grid place-items-center mt-0.5">
            {idx + 1}
          </span>
          <p className="text-sm font-medium leading-snug">{qa.q}</p>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </div>
      {open && (
        <div className="px-4 py-3 bg-primary/5 border-t border-border/40">
          <p className="text-sm text-muted-foreground leading-relaxed">{qa.a}</p>
        </div>
      )}
    </button>
  );
}

// ─── Print HTML Generator ─────────────────────────────────────────────────────

function buildPrintHtml(data: CheatSheetData): string {
  const levelColor = data.level === "advanced" ? "#ef4444" : "#22c55e";
  const sectionHtml = (data.sections || [])
    .map(
      (sec, i) => `
    <div class="section">
      <div class="section-header">
        <span class="step">${i + 1}</span>
        <span class="section-title">${sec.title}</span>
      </div>
      <p class="section-content">${sec.content}</p>
      ${sec.code ? `<pre class="code-block">${sec.code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}<span class="lang-tag">${sec.lang || ""}</span></pre>` : ""}
    </div>
  `,
    )
    .join("");

  const quickrefHtml = (data.quickref || [])
    .map(
      (ref) => `
    <tr>
      <td><code>${ref.term}</code></td>
      <td>${ref.definition}</td>
      <td><code>${ref.example || "—"}</code></td>
    </tr>
  `,
    )
    .join("");

  const comparisonHtml = data.comparison?.rows?.length
    ? `
    <h2>${data.comparison.title || "Comparison"}</h2>
    <table>
      <thead><tr>${data.comparison.headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${data.comparison.rows.map((row) => `<tr>${row.map((c, i) => `<td${i === 0 ? ' class="fw"' : ""}>${c}</td>`).join("")}</tr>`).join("")}</tbody>
    </table>
  `
    : "";

  const gotchasHtml = (data.gotchas || [])
    .map(
      (g) => `
    <div class="gotcha-row">
      <div class="bad"><span class="label bad-label">Incorrect</span>${g.bad}</div>
      <div class="good"><span class="label good-label">Correct</span>${g.good}</div>
    </div>
  `,
    )
    .join("");

  const qaHtml = (data.interviewQA || [])
    .map(
      (qa, i) => `
    <div class="qa-item">
      <div class="qa-q"><span class="qa-num">${i + 1}</span>${qa.q}</div>
      <div class="qa-a">${qa.a}</div>
    </div>
  `,
    )
    .join("");

  const companiesHtml = (data.companies || [])
    .map((c) => `<span class="company">${c}</span>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${data.topic} Cheat Sheet — Learnify AI</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; color: #111; background: #fff; padding: 0; }
    .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 32px 40px; page-break-inside: avoid; }
    .header h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
    .header .meta { display: flex; align-items: center; gap: 10px; margin-top: 8px; flex-wrap: wrap; }
    .level-badge { background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; padding: 2px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: ${levelColor}; background: white; }
    .tagline { color: rgba(255,255,255,0.85); font-size: 13px; margin-top: 4px; }
    .companies { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 12px; }
    .company { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); border-radius: 20px; padding: 3px 10px; font-size: 11px; }
    .container { padding: 32px 40px; }
    h2 { font-size: 16px; font-weight: 700; margin: 24px 0 12px; color: #111; display: flex; align-items: center; gap: 8px; padding-bottom: 6px; border-bottom: 2px solid #e5e7eb; }
    .sections { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .section { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; break-inside: avoid; }
    .section-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .step { background: #4f46e5; color: white; width: 22px; height: 22px; border-radius: 50%; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .section-title { font-size: 13px; font-weight: 600; }
    .section-content { font-size: 12px; color: #555; line-height: 1.6; }
    .code-block { background: #1e1b4b; color: #c7d2fe; padding: 12px 14px; border-radius: 8px; font-size: 11px; font-family: monospace; margin-top: 10px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; position: relative; }
    .lang-tag { position: absolute; top: 6px; right: 8px; font-size: 9px; text-transform: uppercase; color: #818cf8; letter-spacing: 0.8px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px; }
    th { background: #4f46e5; color: white; padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; }
    td { padding: 9px 14px; border-bottom: 1px solid #f1f5f9; color: #374151; }
    td code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 10.5px; }
    td.fw { font-weight: 600; }
    tr:nth-child(even) td { background: #f8fafc; }
    .gotchas { margin-bottom: 20px; }
    .gotcha-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 8px; }
    .bad { background: #fef2f2; padding: 12px 14px; }
    .good { background: #f0fdf4; padding: 12px 14px; border-left: 1px solid #e5e7eb; }
    .label { display: block; font-size: 9px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 4px; }
    .bad-label { color: #ef4444; }
    .good-label { color: #22c55e; }
    .bad, .good { font-size: 12px; font-family: monospace; color: #555; }
    .qa-item { border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; margin-bottom: 8px; break-inside: avoid; }
    .qa-q { background: #f8fafc; padding: 10px 14px; font-size: 12.5px; font-weight: 500; display: flex; align-items: flex-start; gap: 8px; }
    .qa-num { background: #4f46e5; color: white; width: 20px; height: 20px; border-radius: 50%; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
    .qa-a { padding: 10px 14px 10px 42px; font-size: 12px; color: #555; line-height: 1.6; border-top: 1px solid #e5e7eb; }
    .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 11px; border-top: 1px solid #e5e7eb; margin-top: 24px; }
    @media print {
      .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .step { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="meta">
      <h1>${data.topic}</h1>
    </div>
    <div class="meta">
      <span class="level-badge">${data.level}</span>
      <span class="tagline">${data.tagline || ""}</span>
    </div>
    ${companiesHtml ? `<div class="companies">${companiesHtml}</div>` : ""}
  </div>
  <div class="container">
    ${sectionHtml ? `<h2>Core Concepts</h2><div class="sections">${sectionHtml}</div>` : ""}
    ${quickrefHtml ? `<h2>Quick Reference</h2><table><thead><tr><th>Term / API</th><th>Definition</th><th>Example</th></tr></thead><tbody>${quickrefHtml}</tbody></table>` : ""}
    ${comparisonHtml}
    ${gotchasHtml ? `<h2>Common Gotchas</h2><div class="gotchas">${gotchasHtml}</div>` : ""}
    ${qaHtml ? `<h2>Interview Q&A</h2>${qaHtml}` : ""}
    <div class="footer">
      Learnify AI Academy · ${data.topic} · ${data.level} · Generated by AI · ${new Date().toLocaleDateString()}
    </div>
  </div>
</body>
</html>`;
}

// ─── Main Renderer ────────────────────────────────────────────────────────────

export function CheatSheetRenderer({ data, rawJson, onReset }: CheatSheetRendererProps) {
  const palette = colorPalette(data.color || "blue");

  // Save state — persist in localStorage
  const saveKey = `cs_saved_${data.topic.toLowerCase().replace(/\s+/g, "_")}_${data.level}`;
  const [saved, setSaved] = useState(() => {
    try {
      return !!localStorage.getItem(saveKey);
    } catch {
      return false;
    }
  });

  const handleSave = () => {
    try {
      if (saved) {
        localStorage.removeItem(saveKey);
        setSaved(false);
        toast.success("Removed from saved cheat sheets");
      } else {
        localStorage.setItem(saveKey, JSON.stringify({ data, savedAt: new Date().toISOString() }));
        setSaved(true);
        toast.success("Cheat sheet saved! Access it from Library.");
      }
    } catch {
      toast.error("Unable to save — storage full or restricted");
    }
  };

  const handlePrint = () => {
    const html = buildPrintHtml(data);
    const w = window.open("", "_blank");
    if (!w) {
      toast.error("Popup blocked — allow popups to print");
      return;
    }
    w.document.write(html);
    w.document.close();
    setTimeout(() => {
      w.focus();
      w.print();
    }, 400);
  };

  const handleDownloadPdf = () => {
    const html = buildPrintHtml(data);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.topic.replace(/\s+/g, "-").toLowerCase()}-cheat-sheet.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded as print-ready HTML — open in browser and Print → Save as PDF");
  };

  const handleExportJSON = () => {
    const blob = new Blob([rawJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.topic.replace(/\s+/g, "-").toLowerCase()}-cheat-sheet.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const text = `📚 ${data.topic} (${data.level}) Cheat Sheet — Generated by Learnify AI`;
    if (navigator.share) {
      try {
        await navigator.share({ title: data.topic, text });
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Copied share text to clipboard!");
    }
  };

  const generatedAt = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-0 min-h-0">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/60 mb-4">
        <div className="flex items-center gap-2">
          {onReset && (
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={onReset}>
              <X className="h-3 w-3 mr-1" /> New Topic
            </Button>
          )}
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" /> {generatedAt}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            variant={saved ? "default" : "outline"}
            size="sm"
            className={cn("text-xs h-7 px-2", saved && "bg-primary/90")}
            onClick={handleSave}
          >
            {saved ? (
              <BookmarkCheck className="h-3 w-3 mr-1" />
            ) : (
              <Bookmark className="h-3 w-3 mr-1" />
            )}
            {saved ? "Saved" : "Save"}
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-7 px-2" onClick={handleShare}>
            <Share2 className="h-3 w-3 mr-1" /> Share
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-7 px-2" onClick={handlePrint}>
            <Printer className="h-3 w-3 mr-1" /> Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 px-2"
            onClick={handleDownloadPdf}
          >
            <FileText className="h-3 w-3 mr-1" /> PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 px-2"
            onClick={handleExportJSON}
          >
            <Download className="h-3 w-3 mr-1" /> JSON
          </Button>
        </div>
      </div>

      {/* Header Card */}
      <div className={cn("rounded-2xl border overflow-hidden mb-5", palette.border)}>
        {/* Gradient banner */}
        <div className={cn("px-5 py-4 bg-gradient-to-r", palette.headerGrad)}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 grid place-items-center shrink-0 shadow-lg backdrop-blur-sm">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-bold tracking-tight text-white">{data.topic}</h2>
                <Badge
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 border",
                    data.level === "advanced"
                      ? "bg-red-500/20 text-red-300 border-red-400/40"
                      : "bg-green-500/20 text-green-300 border-green-400/40",
                  )}
                >
                  {data.level}
                </Badge>
              </div>
              <p className="text-sm text-white/75 leading-relaxed">{data.tagline}</p>
            </div>
          </div>
        </div>

        {/* Companies with real logos */}
        {data.companies?.length > 0 && (
          <div className={cn("px-5 py-3 border-t border-border/40", palette.bg)}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Used by
              </span>
              {data.companies.map((c) => (
                <CompanyChip key={c} name={c} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Core Sections — Timeline Layout */}
      {data.sections?.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className={cn("h-4 w-4", palette.text)} />
            <h3 className="text-sm font-semibold">Core Concepts</h3>
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {data.sections.length} sections
            </span>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-3.5 top-4 bottom-4 w-px bg-border/60 hidden sm:block" />
            <div className="space-y-3 sm:ml-8">
              {data.sections.map((sec, i) => (
                <div key={sec.id} className="relative">
                  {/* Timeline dot */}
                  <div
                    className={cn(
                      "absolute -left-8 top-4 w-5 h-5 rounded-full border-2 border-background grid place-items-center hidden sm:grid",
                      palette.bg,
                      palette.border,
                    )}
                  >
                    <span className={cn("text-[9px] font-bold", palette.text)}>{i + 1}</span>
                  </div>
                  <div
                    className={cn(
                      "rounded-xl border bg-card/50 p-4 flex flex-col gap-2 transition-all hover:shadow-sm hover:border-border",
                      palette.border + "/40",
                    )}
                  >
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <SectionIcon icon={sec.icon} className={palette.text} />
                      {sec.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{sec.content}</p>
                    {sec.code && (
                      <div
                        className={cn(
                          "rounded-lg p-3 mt-1 overflow-x-auto relative",
                          palette.codeBg,
                        )}
                      >
                        <pre className="text-[11px] text-foreground/90 font-mono whitespace-pre-wrap break-words leading-relaxed">
                          <code>{sec.code}</code>
                        </pre>
                        {sec.lang && (
                          <div
                            className={cn(
                              "text-[9px] mt-1.5 uppercase tracking-wider font-semibold",
                              palette.text,
                            )}
                          >
                            {sec.lang}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Reference Table */}
      {data.quickref?.length > 0 && (
        <div className="rounded-xl border border-border/60 overflow-hidden mb-4">
          <div
            className={cn(
              "px-4 py-2.5 flex items-center gap-2 border-b border-border/60",
              palette.bg,
            )}
          >
            <Table className={cn("h-4 w-4", palette.text)} />
            <h3 className="text-sm font-semibold">Quick Reference</h3>
            <span className="text-[10px] text-muted-foreground ml-auto">
              {data.quickref.length} items
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30">
                  <th className="text-left px-4 py-2 font-semibold text-muted-foreground w-1/4">
                    Term / API
                  </th>
                  <th className="text-left px-4 py-2 font-semibold text-muted-foreground w-2/5">
                    Definition
                  </th>
                  <th className="text-left px-4 py-2 font-semibold text-muted-foreground">
                    Example
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.quickref.map((ref, i) => (
                  <tr
                    key={i}
                    className={cn(
                      "border-b border-border/30 hover:bg-muted/20 transition-colors",
                      i % 2 !== 0 && "bg-muted/10",
                    )}
                  >
                    <td className="px-4 py-2.5 align-top">
                      <code
                        className={cn(
                          "font-mono font-semibold text-[11px] px-1.5 py-0.5 rounded border",
                          palette.badge,
                        )}
                      >
                        {ref.term}
                      </code>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground align-top leading-relaxed">
                      {ref.definition}
                    </td>
                    <td className="px-4 py-2.5 align-top">
                      {ref.example ? (
                        <code className="font-mono text-[10px] text-foreground/80 bg-muted/50 px-1.5 py-0.5 rounded break-all">
                          {ref.example}
                        </code>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {data.comparison?.headers?.length > 0 && data.comparison.rows?.length > 0 && (
        <div className="rounded-xl border border-border/60 overflow-hidden mb-4">
          <div
            className={cn(
              "px-4 py-2.5 flex items-center gap-2 border-b border-border/60",
              palette.bg,
            )}
          >
            <Zap className={cn("h-4 w-4", palette.text)} />
            <h3 className="text-sm font-semibold">{data.comparison.title || "Comparison"}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30">
                  {data.comparison.headers.map((h, i) => (
                    <th
                      key={i}
                      className="text-left px-4 py-2.5 font-semibold text-muted-foreground whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.comparison.rows.map((row, ri) => (
                  <tr
                    key={ri}
                    className={cn(
                      "border-b border-border/30 hover:bg-muted/20 transition-colors",
                      ri % 2 !== 0 && "bg-muted/10",
                    )}
                  >
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className={cn(
                          "px-4 py-2.5 align-top leading-relaxed",
                          ci === 0 ? "font-semibold" : "text-muted-foreground",
                        )}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Gotchas */}
      {data.gotchas?.length > 0 && (
        <div className="rounded-xl border border-border/60 overflow-hidden mb-4">
          <div className="px-4 py-2.5 flex items-center gap-2 border-b border-border/60 bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <h3 className="text-sm font-semibold">Common Gotchas</h3>
            <span className="text-[10px] text-muted-foreground ml-auto">
              {data.gotchas.length} items
            </span>
          </div>
          <div className="divide-y divide-border/30">
            {data.gotchas.map((g, i) => (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/30"
              >
                <div className="px-4 py-3 bg-red-500/5 flex items-start gap-2">
                  <X className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider text-red-400 mb-1">
                      ❌ Bad
                    </div>
                    <code className="text-[11px] font-mono text-muted-foreground leading-relaxed">
                      {g.bad}
                    </code>
                  </div>
                </div>
                <div className="px-4 py-3 bg-green-500/5 flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider text-green-400 mb-1">
                      ✅ Good
                    </div>
                    <code className="text-[11px] font-mono text-muted-foreground leading-relaxed">
                      {g.good}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interview Q&A */}
      {data.interviewQA?.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className={cn("h-4 w-4", palette.text)} />
            <h3 className="text-sm font-semibold">Interview Q&amp;A</h3>
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {data.interviewQA.length} questions
            </span>
          </div>
          <div className="space-y-2">
            {data.interviewQA.map((qa, i) => (
              <QACard key={i} qa={qa} idx={i} />
            ))}
          </div>
        </div>
      )}

      {/* Resources */}
      {data.resources?.length > 0 && (
        <div className="rounded-xl border border-border/60 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Link className={cn("h-4 w-4", palette.text)} />
            <h3 className="text-sm font-semibold">Resources</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.resources.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border/40 bg-card/40 hover:bg-card/80 hover:border-border transition-all duration-150 hover:shadow-sm"
              >
                <span className={cn("p-1.5 rounded-md", palette.bg, palette.text)}>
                  <ResourceIcon type={r.type} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{r.title}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{r.type}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 pt-2 border-t border-border/30">
        <span className="font-semibold text-muted-foreground/80">Learnify AI Academy</span>
        <span>
          {data.topic} · {data.level} · Generated by AI
        </span>
      </div>
    </div>
  );
}

// ─── Legacy compat wrapper (used by system-design.$topic route) ───────────────

import type { Topic } from "@/components/system-design/types";

export function CheatSheetGenerator({ topic }: { topic: Topic; onClose?: () => void }) {
  const data: CheatSheetData = {
    topic: topic.title,
    level: (topic.difficulty === "advanced" ? "advanced" : "beginner") as "beginner" | "advanced",
    tagline: topic.subtitle || topic.description,
    emoji: "📋",
    color: "blue",
    sections: topic.sections.map((s) => ({
      id: s.id,
      title: s.title,
      icon: "book",
      content: s.content,
    })),
    quickref: [],
    comparison: topic.comparisons?.[0]
      ? {
          title: topic.comparisons[0].title,
          headers: ["Name", "Pros", "Cons"],
          rows: topic.comparisons[0].items.map((it) => [
            it.name,
            it.pros.slice(0, 2).join(", "),
            it.cons.slice(0, 2).join(", "),
          ]),
        }
      : { title: "", headers: [], rows: [] },
    gotchas: [],
    interviewQA: topic.quiz.map((q) => ({
      q: q.question,
      a: `${q.options[q.correctIndex]}. ${q.explanation}`,
    })),
    companies: topic.companies,
    resources: [],
  };

  return <CheatSheetRenderer data={data} rawJson={JSON.stringify(data, null, 2)} />;
}
