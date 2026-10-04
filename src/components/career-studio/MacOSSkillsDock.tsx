"use client";

import React, { useState, useMemo } from "react";
import { CourseBrandLogo } from "@/components/courses/CourseBrandLogo";
import { cn } from "@/lib/utils";
import { Sparkles, Check, Plus, Search } from "lucide-react";

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
  { id: "tailwind", name: "Tailwind CSS", brand: "tailwindcss", category: "frontend" },
  { id: "python", name: "Python", brand: "python", category: "backend" },
  { id: "nodejs", name: "Node.js", brand: "nodejs", category: "backend" },
  { id: "postgresql", name: "PostgreSQL", brand: "postgresql", category: "backend" },
  { id: "mongodb", name: "MongoDB", brand: "mongodb", category: "backend" },
  { id: "docker", name: "Docker", brand: "docker", category: "cloud" },
  { id: "aws", name: "AWS", brand: "aws", category: "cloud" },
  { id: "git", name: "Git", brand: "git", category: "tools" },
  { id: "github", name: "GitHub", brand: "github", category: "tools" },
  { id: "figma", name: "Figma", brand: "figma", category: "design" },
  { id: "ai", name: "AI & LLMs", brand: "chatgpt", category: "ai" },
];

const CATEGORIES: { id: "all" | DockSkill["category"]; label: string }[] = [
  { id: "all", label: "All Skills" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "cloud", label: "Cloud & DevOps" },
  { id: "ai", label: "AI & Data" },
  { id: "design", label: "Design & Tools" },
];

export interface MacOSSkillsDockProps {
  activeSkills: string[];
  onToggleSkill: (skillName: string) => void;
  className?: string;
}

/**
 * Modern, responsive Skill Selector Hub.
 * Replaces the jittery physics dock with a high-contrast, mobile-first skill explorer
 * with category filters, clear active states, and fluid responsive grid layouts.
 */
export const MacOSSkillsDock: React.FC<MacOSSkillsDockProps> = ({
  activeSkills,
  onToggleSkill,
  className = "",
}) => {
  const [selectedCategory, setSelectedCategory] = useState<"all" | DockSkill["category"]>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const isSkillActive = (skillName: string) => {
    const lower = skillName.toLowerCase();
    return activeSkills.some(
      (s) => s.toLowerCase() === lower || s.toLowerCase().includes(lower),
    );
  };

  const filteredSkills = useMemo(() => {
    return POPULAR_DOCK_SKILLS.filter((skill) => {
      const matchesCategory =
        selectedCategory === "all" ||
        skill.category === selectedCategory ||
        (selectedCategory === "design" && (skill.category === "design" || skill.category === "tools"));
      const matchesSearch =
        !searchQuery.trim() ||
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const activeCount = useMemo(() => {
    return POPULAR_DOCK_SKILLS.filter((s) => isSkillActive(s.name)).length;
  }, [activeSkills]);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card/90 dark:bg-slate-900/90 shadow-md p-3.5 sm:p-4.5 space-y-3.5 select-none transition-all",
        className,
      )}
    >
      {/* Header bar: Title, badge counter & search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground text-sm font-display">
                Quick-Add Essential Skills
              </span>
              {activeCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                  {activeCount} selected
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              Click any skill to instantly add or remove it from your portfolio
            </p>
          </div>
        </div>

        {/* Search input for quick filtering */}
        <div className="relative w-full sm:w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs rounded-lg bg-muted/60 dark:bg-slate-950/70 border border-border/70 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>
      </div>

      {/* Category Pills (Touch friendly, horizontal scroll on mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium text-xs whitespace-nowrap transition-all cursor-pointer shrink-0",
                isSelected
                  ? "bg-indigo-600 text-white shadow-xs font-semibold"
                  : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50",
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Skills Grid: Fully Responsive, High Contrast, 44px min tap targets */}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 pt-0.5">
        {filteredSkills.map((skill) => {
          const active = isSkillActive(skill.name);

          return (
            <button
              key={skill.id}
              type="button"
              onClick={() => onToggleSkill(skill.name)}
              className={cn(
                "group relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer min-h-[44px]",
                "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                active
                  ? "bg-indigo-500/15 dark:bg-indigo-950/50 border-indigo-500/60 text-indigo-950 dark:text-indigo-200 shadow-xs ring-1 ring-indigo-500/30 font-semibold"
                  : "bg-background/80 dark:bg-slate-950/60 border-border/70 text-foreground hover:border-indigo-400/50 hover:bg-muted/70 hover:shadow-xs",
              )}
            >
              {/* Brand Logo Icon */}
              <div
                className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                  active
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "bg-muted/80 text-muted-foreground",
                )}
              >
                <CourseBrandLogo brand={skill.brand} size={16} />
              </div>

              {/* Skill Name */}
              <span className="text-xs truncate flex-1 font-medium">{skill.name}</span>

              {/* Active / Inactive Action Icon */}
              <div
                className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors",
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-muted-foreground/50 group-hover:text-muted-foreground",
                )}
              >
                {active ? (
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                ) : (
                  <Plus className="w-3 h-3 group-hover:scale-110 transition-transform" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {filteredSkills.length === 0 && (
        <div className="py-6 text-center text-xs text-muted-foreground">
          No skills found matching "{searchQuery}". Type skill name directly into the textarea below.
        </div>
      )}
    </div>
  );
};
