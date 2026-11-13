import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MentorAvatar } from "./MentorAvatar";
import type { MentorRole, CoachingMode } from "./mentorData";
import {
  Sparkles,
  Bot,
  Zap,
  MessageSquare,
  Wrench,
  CheckCircle2,
  Compass,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface MentorProfileDialogProps {
  mentor: MentorRole | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPrompt: (prompt: string) => void;
  activeMode: CoachingMode;
  onModeChange: (mode: CoachingMode) => void;
}

export function MentorProfileDialog({
  mentor,
  open,
  onOpenChange,
  onSelectPrompt,
  activeMode,
  onModeChange,
}: MentorProfileDialogProps) {
  if (!mentor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl border-border bg-card">
        {/* Banner with gradient */}
        <div
          className="h-32 w-full relative p-6 flex items-end justify-between overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${mentor.accentHex}22 0%, ${mentor.accentHex}44 100%)`,
          }}
        >
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border/50 text-[11px] font-semibold text-emerald-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AI Mentor · Active
          </div>

          <div className="absolute -bottom-10 left-6">
            <MentorAvatar mentor={mentor} size="xl" showStatusIndicator={false} />
          </div>
        </div>

        {/* Content */}
        <div className="pt-12 px-6 pb-6 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-display text-foreground">{mentor.name}</h2>
              <Badge variant="outline" className="text-xs font-semibold py-0.5 px-2 border-primary/30 bg-primary/10 text-primary">
                {mentor.badge}
              </Badge>
              <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                {mentor.level}
              </Badge>
            </div>
            <p className="text-sm font-medium text-foreground/80 mt-1">{mentor.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{mentor.specialty}</p>
          </div>

          {/* Bio & Philosophy */}
          <div className="space-y-2 rounded-2xl bg-muted/40 p-4 border border-border/60">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-primary" /> About This AI Mentor
            </div>
            <p className="text-xs text-foreground/90 leading-relaxed">{mentor.bio}</p>
            <div className="pt-2 border-t border-border/40 text-[11px] italic text-muted-foreground">
              "{mentor.philosophy}"
            </div>
          </div>

          {/* Core Skills */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Core Competencies
            </div>
            <div className="flex flex-wrap gap-1.5">
              {mentor.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs bg-card border border-border/80 text-foreground/80 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Available AI Tools */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-primary" /> Built-in AI Capabilities
            </div>
            <div className="grid grid-cols-2 gap-2">
              {mentor.tools.map((tool, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 rounded-xl bg-muted/30 border border-border/50 text-xs font-medium text-foreground"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{tool}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Drill Starters */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-primary" /> Recommended Prompts
            </div>
            <div className="space-y-1.5">
              {mentor.samplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelectPrompt(prompt);
                    onOpenChange(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-card hover:bg-primary/5 hover:border-primary/40 border border-border text-xs text-foreground/90 transition-all flex items-center justify-between group"
                >
                  <span className="truncate pr-2 font-medium">{prompt}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Transparency alert */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <span>
              <strong>100% Transparent AI Mentorship:</strong> {mentor.name} is powered by Learnify's fine-tuned LLM system prompts and engineering tools.
            </span>
          </div>

          {/* Action button */}
          <div className="pt-2 flex gap-3">
            <Button
              className="flex-1 rounded-xl h-10 font-semibold text-xs gap-2"
              onClick={() => onOpenChange(false)}
            >
              <MessageSquare className="w-4 h-4" /> Continue Chatting
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MentorProfileDialog;
