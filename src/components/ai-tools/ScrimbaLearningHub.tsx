import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tv,
  Code2,
  Maximize2,
  Compass,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Layers,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ExplainerVideoPlayer, ExplainerTopicData } from "./ExplainerVideoPlayer";
import { EXPLAINER_TOPIC_PRESETS } from "./explainerTopics";
import { ScrimbaWorkspace } from "@/components/courses/ScrimbaWorkspace";
import { generateTopicBundle } from "./topicCodeGenerator";

export type LearningHubMode = "watch" | "scrimba_split" | "ide_only";

interface ScrimbaLearningHubProps {
  initialTopicId?: string;
  defaultMode?: LearningHubMode;
}

export function ScrimbaLearningHub({
  initialTopicId = "magnetism",
  defaultMode = "watch",
}: ScrimbaLearningHubProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(initialTopicId);
  const [hubMode, setHubMode] = useState<LearningHubMode>(defaultMode);

  const topicBundle = React.useMemo(() => {
    return generateTopicBundle(selectedTopicId);
  }, [selectedTopicId]);

  const topic: ExplainerTopicData =
    EXPLAINER_TOPIC_PRESETS[selectedTopicId] || topicBundle.explainerData;

  const codeData = React.useMemo(() => {
    return {
      lang: topicBundle.lang,
      code: topicBundle.files[topicBundle.defaultFile],
      practiceChallenges: topicBundle.practiceChallenges,
    };
  }, [topicBundle]);


  return (
    <div className="space-y-6">
      {/* ─── Top Studio Controller Bar ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/80 shadow-sm">
        {/* Topic Selector Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1 flex items-center gap-1 font-mono">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Topic:
          </span>
          {Object.values(EXPLAINER_TOPIC_PRESETS).map((t) => {
            const isSelected = selectedTopicId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTopicId(t.id)}
                className={cn(
                  "px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-muted/40 hover:bg-muted border-border/60 text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{t.emoji}</span>
                <span>{t.title}</span>
              </button>
            );
          })}
        </div>

        {/* 3 Workstation Learning Modes */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60">
          <button
            type="button"
            onClick={() => {
              setHubMode("watch");
              toast.info("Watch Mode: Immersive Explainer Theater");
            }}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer",
              hubMode === "watch"
                ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Tv className="h-3.5 w-3.5 text-sky-400" />
            <span>Watch (Explainer)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setHubMode("scrimba_split");
              toast.success("Learnify AI: Live Watch & Code dual workspace active!");
            }}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer",
              hubMode === "scrimba_split"
                ? "bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Zap className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
            <span>Watch &amp; Code (Learnify AI Split)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setHubMode("ide_only");
              toast.info("Full IDE Mode: Maximized code sandbox");
            }}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer",
              hubMode === "ide_only"
                ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Code2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>Full IDE</span>
          </button>
        </div>
      </div>

      {/* ─── Mode 1: Watch (Explainer Theater) ─── */}
      {hubMode === "watch" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-sky-500/30 text-sky-400 bg-sky-500/10 text-xs font-mono">
                Explainer Theater Mode
              </Badge>
              <span className="text-xs text-muted-foreground">
                Hover over the progress bar to see chapter previews. Click &quot;GO DEEPER&quot; to code.
              </span>
            </div>

            <Button
              size="sm"
              onClick={() => setHubMode("scrimba_split")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs gap-1.5 cursor-pointer shadow-md"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Switch to Watch &amp; Code</span>
            </Button>
          </div>

          <ExplainerVideoPlayer
            topic={topic}
            practiceChallenges={codeData.practiceChallenges}
            onGoDeeper={() => {
              setHubMode("scrimba_split");
              toast.success("Diving deeper! Learnify AI Watch & Code workspace activated.");
            }}
            onSwitchToWatchAndCode={() => setHubMode("scrimba_split")}
            isSplitMode={false}
          />
        </motion.div>
      )}

      {/* ─── Mode 2: Watch & Code (Learnify AI Split Dual Workspace) ─── */}
      {hubMode === "scrimba_split" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between px-1 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-display font-bold text-base text-foreground">
                Live Dual-Pane Workspace · Watch on Left &amp; Code on Right
              </h3>
              <Badge variant="outline" className="text-xs bg-indigo-500/10 text-indigo-400 border-indigo-500/30 font-mono">
                Hot-Reload Active
              </Badge>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setHubMode("watch")}
              className="text-xs gap-1.5 cursor-pointer"
            >
              <Tv className="h-3.5 w-3.5 text-sky-400" />
              <span>Back to Theater Mode</span>
            </Button>
          </div>

          {/* Side-by-side Dual Split Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            {/* Left Pane: Explainer Video Player */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground px-1">
                <span>[Pane 1] Video Explainer &amp; Diagrams</span>
                <span className="text-sky-400">Audio Synth Ready</span>
              </div>
              <ExplainerVideoPlayer
                topic={topic}
                practiceChallenges={codeData.practiceChallenges}
                onGoDeeper={() => {
                  toast.info("Already in deep learning code mode! Edit the code on the right.");
                }}
                onSwitchToWatchAndCode={() => setHubMode("watch")}
                isSplitMode={true}
              />
            </div>

            {/* Right Pane: Interactive Code IDE & Live Sandbox Runner */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground px-1">
                <span>[Pane 2] Monaco Code Editor &amp; Cloud Sandbox</span>
                <span className="text-emerald-400">Interactive Runtime</span>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-[#0e111a] overflow-hidden shadow-2xl">
                <ScrimbaWorkspace
                  courseTitle={topic.category}
                  lessonTitle={`${topic.title} Lab`}
                  instructorName={topic.author.name}
                  injectedCode={codeData.code}
                  injectedLang={codeData.lang}
                  practiceChallenges={codeData.practiceChallenges}
                  isStandAlonePlayer={true}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── Mode 3: Full IDE Mode ─── */}
      {hubMode === "ide_only" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 text-xs font-mono">
                Full IDE Workstation
              </Badge>
              <span className="text-xs text-muted-foreground">
                Maximized multi-file editor with terminal runner and dynamic file tree.
              </span>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setHubMode("scrimba_split")}
              className="text-xs gap-1.5 cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>Back to Watch &amp; Code</span>
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0e111a] overflow-hidden shadow-2xl">
            <ScrimbaWorkspace
              courseTitle={topic.category}
              lessonTitle={`${topic.title} Full IDE`}
              instructorName={topic.author.name}
              injectedCode={codeData.code}
              injectedLang={codeData.lang}
              practiceChallenges={codeData.practiceChallenges}
              isStandAlonePlayer={true}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
