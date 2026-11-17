import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Sparkles,
  Mail,
  FileText,
  Table,
  Presentation,
  Github,
  Globe,
  Sliders,
  Award,
  CheckCircle2,
  Zap,
} from "lucide-react";
import type { MentorRole } from "./mentorData";
import { CuteMentorFace } from "./CuteMentorFace";
import {
  getMentorCustomization,
  saveMentorCustomization,
  type MentorCustomization,
  type MentorTone,
} from "./mentorCustomization";

interface MentorUpgradeDialogProps {
  mentor: MentorRole;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomizationSaved?: (config: MentorCustomization) => void;
}

export function MentorUpgradeDialog({
  mentor,
  open,
  onOpenChange,
  onCustomizationSaved,
}: MentorUpgradeDialogProps) {
  const [activeTab, setActiveTab] = useState<"preferences" | "plugins" | "level">("preferences");
  const [config, setConfig] = useState<MentorCustomization>(() => getMentorCustomization(mentor.id));

  useEffect(() => {
    if (open) {
      setConfig(getMentorCustomization(mentor.id));
    }
  }, [open, mentor.id]);

  const handleSave = () => {
    saveMentorCustomization(config);
    toast.success(`${mentor.name}'s preferences, skills & plugins successfully saved!`);
    onCustomizationSaved?.(config);
    onOpenChange(false);
  };

  const handleLevelUp = () => {
    const nextLevel = Math.min(5, config.mentorLevel + 1);
    const updated = {
      ...config,
      mentorLevel: nextLevel,
      mentorXp: config.mentorXp + 500,
    };
    setConfig(updated);
    saveMentorCustomization(updated);
    toast.success(`🎉 ${mentor.name} upgraded to Level ${nextLevel}! Unlocked advanced deep reasoning.`);
    onCustomizationSaved?.(updated);
  };

  const tones: { id: MentorTone; label: string; desc: string }[] = [
    { id: "candid", label: "Direct & Candid", desc: "No sugar-coating; points out architectural flaws immediately." },
    { id: "socratic", label: "Socratic Method", desc: "Asks probing diagnostic questions to lead you to the solution." },
    { id: "encouraging", label: "Warm & Supportive", desc: "Positive reinforcement with patient step-by-step guidance." },
    { id: "concise", label: "Executive & Concise", desc: "Ultra-condensed bullets and actionable takeaways." },
    { id: "deep_dive", label: "Staff Deep Dive", desc: "Exhaustive edge-case analysis, latency math & trade-offs." },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-3xl border bg-card shadow-2xl">
        {/* Header with Cute Animated Face */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <CuteMentorFace mentor={mentor} size="lg" isInteractive isSpeaking={false} />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-[9px] font-bold text-white shadow-xs">
                Lv.{config.mentorLevel}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold truncate">{mentor.name}</h3>
                <Badge variant="outline" className="text-[10px] bg-primary/20 text-indigo-300 border-indigo-400/30">
                  {mentor.badge}
                </Badge>
              </div>
              <p className="text-xs text-slate-300 truncate mt-0.5">{mentor.title}</p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Zap className="w-3.5 h-3.5" /> {config.mentorXp} XP
                </span>
                <span>·</span>
                <span>Active Plugins: {Object.values(config.plugins).filter(Boolean).length}/6</span>
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 mt-5 border-t border-white/10 pt-3">
            <button
              type="button"
              onClick={() => setActiveTab("preferences")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "preferences"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 inline mr-1.5" />
              Preferences &amp; Memory
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("plugins")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "plugins"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />
              Skills &amp; Plugins (6)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("level")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "level"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Award className="w-3.5 h-3.5 inline mr-1.5" />
              Upgrade Mentor
            </button>
          </div>
        </div>

        {/* Tab 1: Preferences & Memory */}
        {activeTab === "preferences" && (
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Your Background &amp; Current Stack
              </Label>
              <Input
                value={config.learnerBackground}
                onChange={(e) => setConfig({ ...config, learnerBackground: e.target.value })}
                placeholder="e.g. 4 years React & Node engineer preparing for Staff Distributed Systems"
                className="text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                {mentor.name} tailors explanations and analogies to your specific level and toolchain.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Primary Career Goal
              </Label>
              <Input
                value={config.careerGoal}
                onChange={(e) => setConfig({ ...config, careerGoal: e.target.value })}
                placeholder="e.g. Crack Google L5 / Meta E5 or lead high-scale microservices"
                className="text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Mentorship Coaching Tone
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tones.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setConfig({ ...config, preferredTone: t.id })}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      config.preferredTone === t.id
                        ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                        : "border-border hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <div className="text-xs font-bold text-foreground">{t.label}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Custom Instructions / Persistent Directives
              </Label>
              <Textarea
                rows={3}
                value={config.customPrompt}
                onChange={(e) => setConfig({ ...config, customPrompt: e.target.value })}
                placeholder="e.g. Always include time complexity, ask me follow-up edge cases, never give the full answer right away."
                className="text-xs resize-none"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Skills & Plugins (Gmail, Google Docs, Sheets, Slides, GitHub, Web Search) */}
        {activeTab === "plugins" && (
          <div className="p-6 space-y-3.5 max-h-[60vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h4 className="text-sm font-bold text-foreground">Active Work Plugins &amp; Integrations</h4>
                <p className="text-xs text-muted-foreground">
                  Empower {mentor.name} to generate live drafts, spreadsheets, and presentation decks.
                </p>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-bold">
                Ready to Export
              </Badge>
            </div>

            {/* Plugin 1: Gmail */}
            <div className="p-3.5 rounded-2xl border bg-card flex items-center justify-between gap-3 hover:border-primary/40 transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>Gmail Plugin</span>
                    <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono">1-Click Draft</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Draft follow-up emails, salary negotiations, and session recaps directly to Gmail compose.
                  </p>
                </div>
              </div>
              <Switch
                checked={config.plugins.gmail}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, plugins: { ...config.plugins, gmail: checked } })
                }
              />
            </div>

            {/* Plugin 2: Google Docs */}
            <div className="p-3.5 rounded-2xl border bg-card flex items-center justify-between gap-3 hover:border-primary/40 transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>Google Docs Plugin</span>
                    <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono">RFC &amp; Specs</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Format architectural RFCs, meeting notes, and learning roadmaps with instant Docs creation.
                  </p>
                </div>
              </div>
              <Switch
                checked={config.plugins.googleDocs}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, plugins: { ...config.plugins, googleDocs: checked } })
                }
              />
            </div>

            {/* Plugin 3: Google Sheets / Excel */}
            <div className="p-3.5 rounded-2xl border bg-card flex items-center justify-between gap-3 hover:border-primary/40 transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <Table className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>Google Sheets / Excel Plugin</span>
                    <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono">CSV &amp; Models</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Generate latency estimations, interview prep schedules, and financial comparison sheets.
                  </p>
                </div>
              </div>
              <Switch
                checked={config.plugins.googleSheets}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, plugins: { ...config.plugins, googleSheets: checked } })
                }
              />
            </div>

            {/* Plugin 4: Google Slides / PPT */}
            <div className="p-3.5 rounded-2xl border bg-card flex items-center justify-between gap-3 hover:border-primary/40 transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <Presentation className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>Google Slides / PPT Plugin</span>
                    <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono">Decks &amp; Outlines</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Build multi-slide system design presentations, executive slide decks, and talk outlines.
                  </p>
                </div>
              </div>
              <Switch
                checked={config.plugins.googleSlides}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, plugins: { ...config.plugins, googleSlides: checked } })
                }
              />
            </div>

            {/* Plugin 5: GitHub Code Analysis */}
            <div className="p-3.5 rounded-2xl border bg-card flex items-center justify-between gap-3 hover:border-primary/40 transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-500/10 text-foreground flex items-center justify-center shrink-0">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>GitHub &amp; Code Runner</span>
                    <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono">Sandboxed JS</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Audits repository links, writes unit test suites, and verifies execution output in real time.
                  </p>
                </div>
              </div>
              <Switch
                checked={config.plugins.github}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, plugins: { ...config.plugins, github: checked } })
                }
              />
            </div>

            {/* Plugin 6: Live Web Search */}
            <div className="p-3.5 rounded-2xl border bg-card flex items-center justify-between gap-3 hover:border-primary/40 transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>Live Web Search</span>
                    <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono">Real-time Docs</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Pulls latest documentation, benchmark latency figures, and current tech compensation bands.
                  </p>
                </div>
              </div>
              <Switch
                checked={config.plugins.webSearch}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, plugins: { ...config.plugins, webSearch: checked } })
                }
              />
            </div>
          </div>
        )}

        {/* Tab 3: Mentor Upgrade & Level Up */}
        {activeTab === "level" && (
          <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-foreground">
                  Current Tier: Level {config.mentorLevel} / 5
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-sm mx-auto">
                  Higher levels unlock extended context retention, recursive architectural verification, and deeper multi-turn memory.
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (config.mentorLevel / 5) * 100)}%` }}
                />
              </div>

              <div className="pt-2">
                <Button
                  size="sm"
                  onClick={handleLevelUp}
                  disabled={config.mentorLevel >= 5}
                  className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {config.mentorLevel >= 5 ? "Max Level Reached" : `Upgrade to Level ${config.mentorLevel + 1}`}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Level Unlocks &amp; Capabilities
              </div>
              <ul className="space-y-2 text-xs">
                {[
                  { lv: 1, title: "Base 1-on-1 Mentorship", unlocked: true },
                  { lv: 2, title: "Gmail & Google Docs 1-Click Export Suite", unlocked: config.mentorLevel >= 2 },
                  { lv: 3, title: "Google Sheets & Slides Live Decks Generation", unlocked: config.mentorLevel >= 3 },
                  { lv: 4, title: "Deterministic Sandboxed Code Execution & Testing", unlocked: config.mentorLevel >= 4 },
                  { lv: 5, title: "Full Planetary Architecture Audit & L7 Peer Review", unlocked: config.mentorLevel >= 5 },
                ].map((item) => (
                  <li
                    key={item.lv}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      item.unlocked
                        ? "bg-card border-border/80 text-foreground"
                        : "bg-muted/20 border-border/40 text-muted-foreground opacity-60"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs">Lv.{item.lv}</span>
                      <span>{item.title}</span>
                    </span>
                    {item.unlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <span className="text-[10px] font-mono">Locked</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <DialogFooter className="p-4 bg-muted/40 border-t flex flex-row items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-xs">
            Close
          </Button>
          <Button size="sm" onClick={handleSave} className="gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Save Preferences &amp; Plugins
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MentorUpgradeDialog;
