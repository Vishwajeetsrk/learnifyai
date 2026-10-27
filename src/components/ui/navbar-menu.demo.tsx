"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import { Sparkles, Code2, Cpu, Compass, BookOpen, Layers, Award } from "lucide-react";

export function NavbarDemo() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center py-12 px-4 bg-neutral-50 dark:bg-neutral-950 min-h-[380px] rounded-3xl border border-neutral-200/70 dark:border-neutral-800/80 overflow-hidden">
      <Navbar className="top-6" />
      <div className="mt-28 text-center space-y-2 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Aceternity Motion Menu</span>
        </div>
        <p className="text-neutral-900 dark:text-neutral-100 font-semibold text-lg">
          Hover over the navigation items above to explore smooth animated dropdowns
        </p>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-md mx-auto">
          Spring-physics layout transition with responsive active cards, live links, and dark mode support.
        </p>
      </div>
    </div>
  );
}

export function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-8 inset-x-0 max-w-2xl mx-auto z-50 px-4", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Coaching">
          <div className="flex flex-col space-y-3.5 text-sm min-w-[200px] p-1">
            <HoveredLink href="/coaching" className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-500" />
              <span>1-on-1 Mentorship</span>
            </HoveredLink>
            <HoveredLink href="/coaching#agent" className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-500" />
              <span>10-Role AI Coach Studio</span>
            </HoveredLink>
            <HoveredLink href="/coaches" className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>Executive Directory</span>
            </HoveredLink>
            <HoveredLink href="/coaching#booking" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span>Open Slot Calendar</span>
            </HoveredLink>
          </div>
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Masterclasses">
          <div className="text-sm grid grid-cols-2 gap-5 p-2 max-w-[540px]">
            <ProductItem
              title="System Design Pro"
              href="/projects"
              src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=80"
              description="Master high-concurrency microservices, caching, and event-driven architectures."
            />
            <ProductItem
              title="AI & GenAI Systems"
              href="/projects"
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80"
              description="Build production-ready LLM agents, multi-modal pipelines, and RAG vector search."
            />
            <ProductItem
              title="Frontend Architecture"
              href="/projects"
              src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&auto=format&fit=crop&q=80"
              description="Zero-runtime CSS, React 19 server actions, and high-frequency animations."
            />
            <ProductItem
              title="Staff Leadership"
              href="/projects"
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80"
              description="Ace engineering director interviews, lead team alignment, and negotiate offers."
            />
          </div>
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Pricing & Plans">
          <div className="flex flex-col space-y-3.5 text-sm min-w-[210px] p-1">
            <HoveredLink href="/pricing" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Student Tier (₹999/mo)</span>
            </HoveredLink>
            <HoveredLink href="/pricing" className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-500" />
              <span>Pro Engineer (₹2,499/mo)</span>
            </HoveredLink>
            <HoveredLink href="/pricing" className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Executive Career Track</span>
            </HoveredLink>
            <HoveredLink href="/pricing" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Thermal Receipt Pricing</span>
            </HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default NavbarDemo;
