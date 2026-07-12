import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Users,
  Trophy,
  ChevronRight,
  Sparkles,
  Play,
  CheckCircle,
  BarChart3,
  FileText,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getTopic, DIFFICULTY_COLORS, TOPICS } from "@/components/system-design/content";
import { LearningCard } from "@/components/system-design/LearningCard";
import { ArchitectureVisualizer } from "@/components/system-design/ArchitectureVisualizer";
import { VoiceNarration } from "@/components/system-design/VoiceNarration";
import { InteractiveQuiz } from "@/components/system-design/InteractiveQuiz";
import { ComparisonView } from "@/components/system-design/ComparisonView";
import {
  markTopicCompleted,
  markTopicAccessed,
  useLearningProgress,
} from "@/components/system-design/LearningProgress";
import { KnowledgeGraph } from "@/components/system-design/KnowledgeGraph";
import { CheatSheetGenerator } from "@/components/cheat-sheet/CheatSheetGenerator";

export const Route = createFileRoute("/_authenticated/system-design/$topic")({
  head: ({ params }) => ({
    meta: [
      {
        title: `${getTopic(params.topic)?.title || "Topic"} — System Design Academy — Learnify AI`,
      },
    ],
  }),
  component: SystemDesignTopicPage,
});

function SystemDesignTopicPage() {
  const navigate = useNavigate();
  const { topic: topicId } = useParams({ from: Route.id });
  const { refresh } = useLearningProgress();
  const topic = getTopic(topicId);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [completedLesson, setCompletedLesson] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  // Mark as accessed on mount
  useMemo(() => {
    if (topic) markTopicAccessed(topic.id);
  }, [topic?.id]);

  if (!topic) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <p className="text-lg font-semibold">Topic not found</p>
          <p className="text-sm text-muted-foreground">
            The system design topic "{topicId}" doesn't exist.
          </p>
          <Button variant="outline" size="sm" onClick={() => navigate({ to: "/system-design" })}>
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Academy
          </Button>
        </div>
      </AppShell>
    );
  }

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleQuizComplete = (score: number, total: number) => {
    markTopicCompleted(topic.id, Math.round((score / total) * 100));
    setQuizCompleted(true);
    setCompletedLesson(true);
    refresh();
  };

  const handleGraphTopicClick = (id: string) => {
    navigate({ to: `/system-design/${id}` });
  };

  const topicIndex = TOPICS.findIndex((t) => t.id === topic.id);
  const prevTopic = topicIndex > 0 ? TOPICS[topicIndex - 1] : null;
  const nextTopic = topicIndex < TOPICS.length - 1 ? TOPICS[topicIndex + 1] : null;

  const allText = [
    topic.description,
    ...topic.sections.map((s) => s.content),
    ...topic.quiz.map((q) => q.question + " " + q.explanation),
  ].join(". ");

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/system-design" className="hover:text-foreground transition">
            Academy
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{topic.title}</span>
        </div>

        {/* Hero */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/50 overflow-hidden">
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] capitalize font-normal",
                      DIFFICULTY_COLORS[topic.difficulty],
                    )}
                  >
                    {topic.difficulty}
                  </Badge>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" /> {topic.duration}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{topic.title}</h1>
                <p className="text-sm text-muted-foreground">{topic.subtitle}</p>
              </div>
              {quizCompleted && (
                <div className="shrink-0 h-10 px-3 rounded-full bg-green-500/10 border border-green-500/30 flex items-center gap-1.5 text-green-500 text-xs font-medium">
                  <CheckCircle className="h-4 w-4" /> Completed
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 text-xs"
                onClick={() => setShowCheatSheet(true)}
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" /> Cheat Sheet
              </Button>
            </div>

            <p className="text-sm leading-relaxed">{topic.description}</p>

            {/* Meta badges */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="h-3 w-3" /> Used by {topic.companies.slice(0, 3).join(", ")}
              </span>
              {topic.prerequisites.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-3 w-3" /> Prerequisites: {topic.prerequisites.join(", ")}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Trophy className="h-3 w-3" /> {topic.quiz.length} quiz questions
              </span>
            </div>
          </div>

          {/* Architecture diagram preview */}
          {topic.architecture && (
            <div className="border-t border-border px-6 sm:px-8 pb-6 sm:pb-8 pt-4">
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                Architecture Overview
              </p>
              <ArchitectureVisualizer diagram={topic.architecture} />
            </div>
          )}
        </div>

        {/* Voice narration */}
        <VoiceNarration text={allText} title={topic.title} language="en-US" />

        {/* Learning sections */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" /> Lesson Content
          </h2>
          <div className="space-y-2">
            {topic.sections.map((section) => (
              <LearningCard
                key={section.id}
                section={section}
                isOpen={!!openSections[section.id]}
                onToggle={() => toggleSection(section.id)}
              />
            ))}
          </div>
        </div>

        {/* Comparisons */}
        {topic.comparisons && topic.comparisons.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Comparisons
            </h2>
            <div className="space-y-3">
              {topic.comparisons.map((comp, i) => (
                <ComparisonView key={i} comparison={comp} />
              ))}
            </div>
          </div>
        )}

        {/* Case studies */}
        {topic.caseStudies && topic.caseStudies.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Real-World Case Studies
            </h2>
            <div className="space-y-4">
              {topic.caseStudies.map((cs, i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {cs.company[0]}
                      </div>
                      <div>
                        <p className="text-xs font-medium">{cs.company}</p>
                        <p className="text-[10px] text-muted-foreground">{cs.title}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {cs.description}
                    </p>
                  </div>
                  <div className="border-t border-border">
                    <ArchitectureVisualizer diagram={cs.architecture} compact />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Knowledge Graph */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" /> Knowledge Graph
          </h2>
          <KnowledgeGraph onTopicClick={handleGraphTopicClick} compact />
        </div>

        {/* Quiz */}
        <div className="space-y-3" id="quiz">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" /> Knowledge Check
            </h2>
            {!showQuiz && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => setShowQuiz(true)}
              >
                <Play className="h-3 w-3 mr-1.5" /> Start Quiz
              </Button>
            )}
          </div>
          {showQuiz && <InteractiveQuiz questions={topic.quiz} onComplete={handleQuizComplete} />}
          {!showQuiz && (
            <p className="text-xs text-muted-foreground">
              Test your understanding with {topic.quiz.length} questions about {topic.title}.
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {prevTopic ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: `/system-design/${prevTopic.id}` })}
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> {prevTopic.title}
            </Button>
          ) : (
            <div />
          )}
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/system-design" })}>
            Back to Academy
          </Button>
          {nextTopic ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: `/system-design/${nextTopic.id}` })}
            >
              {nextTopic.title} <ChevronRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* Cheat Sheet Dialog */}
      <Dialog open={showCheatSheet} onOpenChange={setShowCheatSheet}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> {topic.title} — Cheat Sheet
            </DialogTitle>
          </DialogHeader>
          <CheatSheetGenerator topic={topic} onClose={() => setShowCheatSheet(false)} />
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
