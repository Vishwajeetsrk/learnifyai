/**
 * CourseSettingsPanel — no-code course metadata editor
 * Title, description, cover image, pricing, level, category, outcomes, requirements
 */
import { useState, useCallback } from "react";
import {
  BookOpen, IndianRupee, Globe, Tag, Award,
  Users, Target, ListChecks, Sparkles, Upload,
  ExternalLink, Info, Clock, CheckCircle, X as XIcon, Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// ────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────

export interface CourseSettings {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  price_inr: number;
  published: boolean;
  cover_url: string | null;
  instructor: string;
  language: string;
  teaser_video_url: string | null;
  requirements: string[];
  outcomes: string[];
  target_audience: string;
  certificate_enabled: boolean;
  completion_threshold: number;
  slug: string;
}

interface CourseSettingsPanelProps {
  course: CourseSettings;
  onUpdate: (patch: Partial<CourseSettings>) => void;
  onPublishToggle: (published: boolean) => Promise<void>;
  onCoverChange: (url: string) => Promise<void>;
  isSaving?: boolean;
  slug: string;
}

// ────────────────────────────────────────────────────────────
// CATEGORIES
// ────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Web Development", "Mobile Development", "Data Science", "Machine Learning",
  "DevOps", "Cybersecurity", "Cloud Computing", "UI/UX Design",
  "Product Management", "Business", "Marketing", "Finance",
  "Python", "JavaScript", "React", "Node.js", "Database",
  "System Design", "Career", "Soft Skills", "General",
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "bn", label: "Bengali" },
  { code: "te", label: "Telugu" },
  { code: "ta", label: "Tamil" },
  { code: "mr", label: "Marathi" },
  { code: "gu", label: "Gujarati" },
  { code: "kn", label: "Kannada" },
];

// ────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────────────────

export function CourseSettingsPanel({
  course, onUpdate, onPublishToggle, onCoverChange, isSaving, slug,
}: CourseSettingsPanelProps) {
  const [publishing, setPublishing] = useState(false);

  const handlePublish = useCallback(async () => {
    setPublishing(true);
    try {
      await onPublishToggle(!course.published);
    } finally {
      setPublishing(false);
    }
  }, [course.published, onPublishToggle]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/8">
        <h2 className="text-base font-semibold text-white font-display">Course Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">Configure metadata, pricing, and publishing</p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <Accordion type="multiple" defaultValue={["basic", "publish"]} className="divide-y divide-white/5">

          {/* ── PUBLISH STATUS ── */}
          <AccordionItem value="publish" className="border-none">
            <AccordionTrigger className="px-6 py-3 text-sm font-medium text-slate-300 hover:no-underline hover:text-white">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                Publication Status
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {course.published ? "🟢 Live" : "⚪ Draft"}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {course.published
                        ? "Students can enroll and access this course"
                        : "Only you can see this course"}
                    </p>
                  </div>
                  <Switch
                    checked={course.published}
                    onCheckedChange={handlePublish}
                    disabled={publishing}
                  />
                </div>
                {course.published && (
                  <a
                    href={`/courses/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View live course →
                  </a>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ── BASIC INFO ── */}
          <AccordionItem value="basic" className="border-none">
            <AccordionTrigger className="px-6 py-3 text-sm font-medium text-slate-300 hover:no-underline hover:text-white">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                Basic Information
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-5 space-y-4">
              {/* Title */}
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Course Title *</Label>
                <Input
                  value={course.title}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  placeholder="e.g. Complete React Developer Bootcamp"
                  className="bg-slate-950 border-white/10 text-sm"
                  maxLength={120}
                />
                <p className="text-xs text-slate-600 mt-1">{course.title?.length ?? 0}/120</p>
              </div>

              {/* Description */}
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Description *</Label>
                <Textarea
                  value={course.description}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  placeholder="What will students learn? What makes this course unique?"
                  className="bg-slate-950 border-white/10 text-sm min-h-[100px] resize-y"
                  maxLength={1000}
                />
              </div>

              {/* Instructor */}
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Instructor Name</Label>
                <Input
                  value={course.instructor}
                  onChange={(e) => onUpdate({ instructor: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="bg-slate-950 border-white/10 text-sm"
                />
              </div>

              {/* Level + Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-slate-500 mb-1.5 block">Level</Label>
                  <Select value={course.level} onValueChange={(v) => onUpdate({ level: v })}>
                    <SelectTrigger className="bg-slate-950 border-white/10 text-sm h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      {LEVELS.map((l) => (
                        <SelectItem key={l} value={l} className="text-slate-300 text-xs">{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-slate-500 mb-1.5 block">Language</Label>
                  <Select value={course.language ?? "en"} onValueChange={(v) => onUpdate({ language: v })}>
                    <SelectTrigger className="bg-slate-950 border-white/10 text-sm h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      {LANGUAGES.map((l) => (
                        <SelectItem key={l.code} value={l.code} className="text-slate-300 text-xs">{l.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Category */}
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Category</Label>
                <Select value={course.category} onValueChange={(v) => onUpdate({ category: v })}>
                  <SelectTrigger className="bg-slate-950 border-white/10 text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 max-h-48">
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c} className="text-slate-300 text-xs">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ── COVER IMAGE ── */}
          <AccordionItem value="media" className="border-none">
            <AccordionTrigger className="px-6 py-3 text-sm font-medium text-slate-300 hover:no-underline hover:text-white">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-400" />
                Cover Image & Teaser
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-5 space-y-4">
              {/* Cover URL */}
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Cover Image URL</Label>
                <Input
                  value={course.cover_url ?? ""}
                  onChange={(e) => onUpdate({ cover_url: e.target.value || null })}
                  placeholder="https://... (1536×1024 recommended)"
                  className="bg-slate-950 border-white/10 text-sm"
                />
              </div>
              {course.cover_url && (
                <div className="rounded-lg overflow-hidden border border-white/10">
                  <img src={course.cover_url} alt="Cover" className="w-full object-cover max-h-36" />
                </div>
              )}
              {/* Teaser video */}
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Teaser Video URL (optional)</Label>
                <Input
                  value={course.teaser_video_url ?? ""}
                  onChange={(e) => onUpdate({ teaser_video_url: e.target.value || null })}
                  placeholder="YouTube URL for course preview trailer"
                  className="bg-slate-950 border-white/10 text-sm"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ── PRICING ── */}
          <AccordionItem value="pricing" className="border-none">
            <AccordionTrigger className="px-6 py-3 text-sm font-medium text-slate-300 hover:no-underline hover:text-white">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-indigo-400" />
                Pricing
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-5 space-y-4">
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Price (₹)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <Input
                    type="number"
                    min={0}
                    value={course.price_inr ?? 0}
                    onChange={(e) => onUpdate({ price_inr: Number(e.target.value) })}
                    className="bg-slate-950 border-white/10 text-sm pl-8"
                  />
                </div>
                {(course.price_inr ?? 0) === 0 ? (
                  <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Free course — students can enroll for free
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1">
                    Students pay ₹{course.price_inr?.toLocaleString("en-IN")} to enroll
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ── LEARNING OUTCOMES ── */}
          <AccordionItem value="outcomes" className="border-none">
            <AccordionTrigger className="px-6 py-3 text-sm font-medium text-slate-300 hover:no-underline hover:text-white">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                Learning Outcomes
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-5">
              <StringListEditor
                label="What students will learn"
                placeholder="e.g. Build full-stack React applications"
                icon={<CheckCircle className="w-3 h-3 text-emerald-400" />}
                values={course.outcomes ?? []}
                onChange={(outcomes) => onUpdate({ outcomes })}
              />
            </AccordionContent>
          </AccordionItem>

          {/* ── REQUIREMENTS ── */}
          <AccordionItem value="requirements" className="border-none">
            <AccordionTrigger className="px-6 py-3 text-sm font-medium text-slate-300 hover:no-underline hover:text-white">
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-indigo-400" />
                Requirements / Prerequisites
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-5">
              <StringListEditor
                label="What students need to know"
                placeholder="e.g. Basic HTML & CSS knowledge"
                icon={<Info className="w-3 h-3 text-amber-400" />}
                values={course.requirements ?? []}
                onChange={(requirements) => onUpdate({ requirements })}
              />
            </AccordionContent>
          </AccordionItem>

          {/* ── TARGET AUDIENCE ── */}
          <AccordionItem value="audience" className="border-none">
            <AccordionTrigger className="px-6 py-3 text-sm font-medium text-slate-300 hover:no-underline hover:text-white">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Target Audience
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-5">
              <Textarea
                value={course.target_audience ?? ""}
                onChange={(e) => onUpdate({ target_audience: e.target.value })}
                placeholder="Who is this course for? e.g. Beginners who want to learn React from scratch."
                className="bg-slate-950 border-white/10 text-sm min-h-[80px] resize-none"
                maxLength={300}
              />
            </AccordionContent>
          </AccordionItem>

          {/* ── CERTIFICATE ── */}
          <AccordionItem value="certificate" className="border-none">
            <AccordionTrigger className="px-6 py-3 text-sm font-medium text-slate-300 hover:no-underline hover:text-white">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400" />
                Certificate Settings
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-5 space-y-4">
              <div className="flex items-center gap-3">
                <Switch
                  checked={course.certificate_enabled ?? true}
                  onCheckedChange={(v) => onUpdate({ certificate_enabled: v })}
                />
                <Label className="text-sm text-slate-300">Issue completion certificate</Label>
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">
                  Completion Threshold (%)
                </Label>
                <Input
                  type="number"
                  min={0} max={100}
                  value={course.completion_threshold ?? 80}
                  onChange={(e) => onUpdate({ completion_threshold: Number(e.target.value) })}
                  className="bg-slate-950 border-white/10 text-sm w-28"
                />
                <p className="text-xs text-slate-600 mt-1">
                  Students need to complete {course.completion_threshold ?? 80}% of lessons to get the certificate
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// STRING LIST EDITOR (outcomes / requirements)
// ────────────────────────────────────────────────────────────

function StringListEditor({
  label, placeholder, icon, values, onChange,
}: {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed || values.includes(trimmed)) return;
    onChange([...values, trimmed]);
    setInput("");
  };

  const remove = (i: number) => {
    onChange(values.filter((_, idx) => idx !== i));
  };

  const updateItem = (i: number, val: string) => {
    const next = [...values];
    next[i] = val;
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {values.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="flex-shrink-0">{icon}</span>
          <Input
            value={v}
            onChange={(e) => updateItem(i, e.target.value)}
            className="flex-1 bg-slate-950 border-white/10 text-sm h-8 px-2"
          />
          <button onClick={() => remove(i)} className="text-slate-500 hover:text-red-400 flex-shrink-0">
            <XIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <span className="flex-shrink-0">{icon}</span>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") add(); }}
          placeholder={placeholder}
          className="flex-1 bg-slate-950 border-white/10 text-sm h-8 px-2"
        />
        <button
          onClick={add}
          disabled={!input.trim()}
          className="text-indigo-400 hover:text-indigo-300 disabled:opacity-30 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {values.length === 0 && (
        <p className="text-xs text-slate-600 pl-5">Press Enter or + to add items</p>
      )}
    </div>
  );
}
