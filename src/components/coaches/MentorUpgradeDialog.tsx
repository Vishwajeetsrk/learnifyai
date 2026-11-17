import React, { useState, useEffect, useRef } from "react";
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
  FolderOpen,
  Upload,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Lock,
  Unlock,
  Check,
  Palette,
} from "lucide-react";
import type { MentorRole } from "./mentorData";
import { CuteMentorFace } from "./CuteMentorFace";
import {
  getMentorCustomization,
  saveMentorCustomization,
  type MentorCustomization,
  type MentorTone,
  type CustomSkillFile,
} from "./mentorCustomization";

interface MentorUpgradeDialogProps {
  mentor: MentorRole;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomizationSaved?: (config: MentorCustomization) => void;
}

const COLOR_PRESETS = [
  { id: "emerald", hex: "#10B981", label: "Brand Green" },
  { id: "indigo", hex: "#6366F1", label: "Indigo" },
  { id: "rose", hex: "#F43F5E", label: "Rose" },
  { id: "amber", hex: "#F59E0B", label: "Amber" },
  { id: "sky", hex: "#0EA5E9", label: "Sky" },
  { id: "purple", hex: "#A855F7", label: "Purple" },
];

export function MentorUpgradeDialog({
  mentor,
  open,
  onOpenChange,
  onCustomizationSaved,
}: MentorUpgradeDialogProps) {
  const [activeTab, setActiveTab] = useState<"preferences" | "plugins" | "skills" | "level">("preferences");
  const [config, setConfig] = useState<MentorCustomization>(() => getMentorCustomization(mentor.id));
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setConfig(getMentorCustomization(mentor.id));
    }
  }, [open, mentor.id]);

  const handleSave = () => {
    saveMentorCustomization(config);
    toast.success(`${config.customName || mentor.name}'s configuration, skills & plugins saved!`);
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
    toast.success(`${config.customName || mentor.name} upgraded to Level ${nextLevel}! Deep reasoning unlocked.`);
    onCustomizationSaved?.(updated);
  };

  const handleToggleGoogleAuth = () => {
    const nextState = !config.googleConnected;
    const updated = {
      ...config,
      googleConnected: nextState,
      googleAccountEmail: nextState ? "support.learnifyai@gmail.com" : "",
    };
    setConfig(updated);
    toast.success(nextState ? "Google Workspace & Drive connected successfully!" : "Google account disconnected.");
  };

  const handleSkillUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = (event.target?.result as string) || "";
        const newSkill: CustomSkillFile = {
          id: `skill-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          content: content.slice(0, 30000), // Protect context budget
          uploadedAt: new Date().toISOString(),
        };

        setConfig((prev) => {
          const list = prev.customSkills || [];
          return {
            ...prev,
            customSkills: [...list.filter((s) => s.name !== file.name), newSkill],
          };
        });
        toast.success(`Skill file loaded: ${file.name}`);
      };
      reader.readAsText(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteSkill = (skillId: string) => {
    setConfig((prev) => ({
      ...prev,
      customSkills: (prev.customSkills || []).filter((s) => s.id !== skillId),
    }));
    toast.info("Skill engine file removed from mentor memory.");
  };

  const tones: { id: MentorTone; label: string; desc: string }[] = [
    { id: "candid", label: "Direct & Candid", desc: "No sugar-coating; points out architectural flaws immediately." },
    { id: "socratic", label: "Socratic Method", desc: "Asks probing diagnostic questions to lead you to the solution." },
    { id: "encouraging", label: "Warm & Supportive", desc: "Positive reinforcement with patient step-by-step guidance." },
    { id: "concise", label: "Executive & Concise", desc: "Ultra-condensed bullets and actionable takeaways." },
    { id: "deep_dive", label: "Staff Deep Dive", desc: "Exhaustive edge-case analysis, latency math & trade-offs." },
  ];

  const activeColorHex = config.customAvatarColor || mentor.accentHex;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border bg-card shadow-2xl">
        {/* Header with Cute Animated Face */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <CuteMentorFace
                mentor={mentor}
                size="lg"
                isInteractive
                isSpeaking={false}
                customColor={activeColorHex}
                showOnlineBadge={true}
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-[9px] font-bold text-white shadow-xs">
                Lv.{config.mentorLevel}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold truncate">
                  {config.customName || mentor.name}
                </h3>
                <Badge variant="outline" className="text-[10px] bg-primary/20 text-indigo-300 border-indigo-400/30">
                  {mentor.badge}
                </Badge>
              </div>
              <p className="text-xs text-slate-300 truncate mt-0.5">
                {config.customTitle || mentor.title}
              </p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold font-mono">
                  <Zap className="w-3.5 h-3.5" /> {config.mentorXp} XP
                </span>
                <span>·</span>
                <span>Active Plugins: {Object.values(config.plugins).filter(Boolean).length}/6</span>
                <span>·</span>
                <span>Custom Skills: {(config.customSkills || []).length} active</span>
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-1.5 mt-5 border-t border-white/10 pt-3 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab("preferences")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                activeTab === "preferences"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 inline mr-1.5" />
              Identity &amp; Memory
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("plugins")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                activeTab === "plugins"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />
              Plugins &amp; Google Cloud
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("skills")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                activeTab === "skills"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
              Skill Engine Files ({(config.customSkills || []).length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("level")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
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

        {/* Tab 1: Preferences & Identity */}
        {activeTab === "preferences" && (
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Custom Mentor Name & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-muted/30 border border-border/60">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-foreground">Custom Mentor Name</Label>
                <Input
                  value={config.customName || ""}
                  onChange={(e) => setConfig({ ...config, customName: e.target.value })}
                  placeholder={mentor.name}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-foreground">Custom Specialty / Title</Label>
                <Input
                  value={config.customTitle || ""}
                  onChange={(e) => setConfig({ ...config, customTitle: e.target.value })}
                  placeholder={mentor.title}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {/* Custom Avatar Color Aura */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-primary" /> Avatar Aura &amp; Accent Halo
              </Label>
              <div className="flex items-center gap-2 flex-wrap">
                {COLOR_PRESETS.map((color) => {
                  const isSelected = (config.customAvatarColor || mentor.accentHex) === color.hex;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setConfig({ ...config, customAvatarColor: color.hex })}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary"
                          : "border-border/70 hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color.hex }} />
                      <span>{color.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

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
                {config.customName || mentor.name} tailors explanations and analogies to your specific level and toolchain.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Primary Goal / Challenge
              </Label>
              <Input
                value={config.careerGoal}
                onChange={(e) => setConfig({ ...config, careerGoal: e.target.value })}
                placeholder="e.g. Pass Google Staff System Design & scale payment engine to 50k RPS"
                className="text-xs"
              />
            </div>

            {/* Tone Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Mentorship Tone &amp; Feedback Style
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tones.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setConfig({ ...config, preferredTone: t.id })}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
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
                placeholder="e.g. Always evaluate trade-offs between consistency and latency. Never reveal full code solutions before testing my intuition."
                className="text-xs resize-none"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Skills & Plugins (Gmail, Google Docs, Sheets, Slides, GitHub, Web Search) */}
        {activeTab === "plugins" && (
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Google Workspace & Drive Cloud Account Auth Card */}
            <div className="p-4 rounded-2xl border border-primary/30 bg-primary/5 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-card border flex items-center justify-center shrink-0 shadow-xs">
                    {/* Official Google Brand SVG */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">Google Workspace &amp; Drive</span>
                      {config.googleConnected ? (
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-semibold">
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] bg-muted text-muted-foreground">
                          Disconnected
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {config.googleConnected
                        ? `Account: ${config.googleAccountEmail || "support.learnifyai@gmail.com"} · Scopes: Drive, Docs, Sheets, Slides`
                        : "Connect your Google account to auto-save and view live cloud preview links in chat."}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={config.googleConnected ? "outline" : "default"}
                  onClick={handleToggleGoogleAuth}
                  className="h-8 text-xs font-semibold gap-1.5 shrink-0"
                >
                  {config.googleConnected ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-muted-foreground" /> Disconnect
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-primary" /> Connect Google
                    </>
                  )}
                </Button>
              </div>

              {config.googleConnected && (
                <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Auto-save generated artifacts directly to user's Google Drive folder
                  </span>
                  <Switch
                    checked={config.googleDriveEnabled ?? true}
                    onCheckedChange={(checked) => setConfig({ ...config, googleDriveEnabled: checked })}
                  />
                </div>
              )}
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

        {/* Tab 3: Custom Skill Engine & Knowledge Files */}
        {activeTab === "skills" && (
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h4 className="text-sm font-bold text-foreground">Custom Skill Engine &amp; Knowledge Files</h4>
                <p className="text-xs text-muted-foreground">
                  Upload custom instruction files, company RFCs, or skill definitions (e.g. SKILL.md, .json, .prompt) to empower {config.customName || mentor.name}.
                </p>
              </div>
              <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs font-bold">
                Active in Memory
              </Badge>
            </div>

            {/* Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary/60 bg-muted/20 hover:bg-muted/40 transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".md,.txt,.json,.prompt,.yaml"
                onChange={handleSkillUpload}
                className="hidden"
              />
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <h5 className="text-xs font-bold text-foreground mt-2">
                Drop your Skill Engine folder or files here
              </h5>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Supports SKILL.md, .md, .json, .prompt, .txt up to 5MB each
              </p>
            </div>

            {/* Uploaded Skills List */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Active Loaded Skills ({(config.customSkills || []).length})
              </Label>

              {(!config.customSkills || config.customSkills.length === 0) ? (
                <div className="p-4 rounded-xl border border-dashed text-center text-xs text-muted-foreground">
                  No custom skill files uploaded yet. Drag and drop any SKILL.md or guideline file above.
                </div>
              ) : (
                config.customSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-3 rounded-xl border bg-card flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground truncate">{skill.name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {skill.size} · Uploaded {new Date(skill.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                        <Check className="w-2.5 h-2.5 mr-1" /> Linked
                      </Badge>
                      <button
                        type="button"
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="p-1 rounded text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition"
                        title="Remove skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Mentor Upgrade & Level Up */}
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
            <CheckCircle2 className="w-4 h-4" /> Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MentorUpgradeDialog;
