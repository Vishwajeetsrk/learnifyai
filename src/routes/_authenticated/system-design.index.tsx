import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Search,
  GraduationCap,
  Clock,
  ArrowRight,
  Zap,
  Globe,
  Database,
  Box,
  Shield,
  Hash,
  Gauge,
  Triangle,
  Inbox,
  Shuffle,
  BookOpen,
  BarChart3,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TOPICS, DIFFICULTY_COLORS, KNOWLEDGE_GRAPH } from "@/components/system-design";
import { KnowledgeGraph } from "@/components/system-design/KnowledgeGraph";
import { LearningProgress } from "@/components/system-design/LearningProgress";

export const Route = createFileRoute("/_authenticated/system-design/")({
  head: () => ({ meta: [{ title: "System Design Academy — Learnify AI" }] }),
  component: SystemDesignAcademyPage,
});

const TOPIC_ICONS: Record<string, React.ReactNode> = {
  shuffle: <Shuffle className="h-4 w-4" />,
  zap: <Zap className="h-4 w-4" />,
  database: <Database className="h-4 w-4" />,
  globe: <Globe className="h-4 w-4" />,
  inbox: <Inbox className="h-4 w-4" />,
  shield: <Shield className="h-4 w-4" />,
  box: <Box className="h-4 w-4" />,
  hash: <Hash className="h-4 w-4" />,
  gauge: <Gauge className="h-4 w-4" />,
  triangle: <Triangle className="h-4 w-4" />,
};

function SystemDesignAcademyPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [showGraph, setShowGraph] = useState(false);

  const filteredTopics = TOPICS.filter((t) => {
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase()) && !t.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedDifficulty && t.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const handleTopicClick = (topicId: string) => {
    navigate({ to: `/system-design/${topicId}` });
  };

  const topicsByDifficulty = {
    beginner: filteredTopics.filter((t) => t.difficulty === "beginner"),
    intermediate: filteredTopics.filter((t) => t.difficulty === "intermediate"),
    advanced: filteredTopics.filter((t) => t.difficulty === "advanced"),
  };

  const totalTopics = TOPICS.length;
  const shownTopics = filteredTopics.length;

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">System Design Academy</h1>
              <p className="text-sm text-muted-foreground">Master distributed systems through interactive learning</p>
            </div>
          </div>
        </div>

        {/* Progress + Graph row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <LearningProgress />
          </div>
          <div className="relative">
            <div className={cn(
              "rounded-xl border border-border bg-card overflow-hidden transition-all",
              showGraph ? "lg:col-span-2" : ""
            )}>
              {showGraph ? (
                <div className="p-2">
                  <div className="flex items-center justify-between px-2 pb-2">
                    <span className="text-xs font-semibold">Knowledge Graph</span>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setShowGraph(false)}>Close</Button>
                  </div>
                  <KnowledgeGraph onTopicClick={handleTopicClick} compact />
                </div>
              ) : (
                <button
                  onClick={() => setShowGraph(true)}
                  className="w-full p-4 text-left hover:bg-muted/30 transition flex items-center gap-3"
                >
                  <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">Explore Knowledge Graph</p>
                    <p className="text-[10px] text-muted-foreground">Visualize topic relationships</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics..."
              className="pl-9 h-9 text-sm"
              aria-label="Search system design topics"
            />
          </div>
          <div className="flex gap-1.5">
            {(["beginner", "intermediate", "advanced"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-medium border transition capitalize",
                  selectedDifficulty === d
                    ? DIFFICULTY_COLORS[d].split(" ")[0] + " border-primary/30 bg-primary/5"
                    : "border-border text-muted-foreground hover:border-foreground/30"
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {searchQuery && (
          <p className="text-xs text-muted-foreground">
            {shownTopics} of {totalTopics} topics match
          </p>
        )}

        {/* Topic Grids by difficulty */}
        {!searchQuery && !selectedDifficulty && (
          <>
            <DifficultySection
              title="Getting Started"
              subtitle="Foundational concepts for beginners"
              topics={topicsByDifficulty.beginner}
              color="green"
              onTopicClick={handleTopicClick}
            />
            <DifficultySection
              title="Core Concepts"
              subtitle="Intermediate patterns and architectures"
              topics={topicsByDifficulty.intermediate}
              color="yellow"
              onTopicClick={handleTopicClick}
            />
            <DifficultySection
              title="Advanced Topics"
              subtitle="Complex distributed systems theory"
              topics={topicsByDifficulty.advanced}
              color="red"
              onTopicClick={handleTopicClick}
            />
          </>
        )}

        {/* Flat results when searching/filtering */}
        {(searchQuery || selectedDifficulty) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} onClick={() => handleTopicClick(topic.id)} />
            ))}
            {filteredTopics.length === 0 && (
              <div className="col-span-full text-center py-12 text-sm text-muted-foreground">
                No topics match your search.
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function DifficultySection({
  title,
  subtitle,
  topics,
  color,
  onTopicClick,
}: {
  title: string;
  subtitle: string;
  topics: typeof TOPICS;
  color: string;
  onTopicClick: (id: string) => void;
}) {
  if (topics.length === 0) return null;
  const borderColor = color === "green" ? "border-green-500/30" : color === "yellow" ? "border-yellow-500/30" : "border-red-500/30";
  const textColor = color === "green" ? "text-green-500" : color === "yellow" ? "text-yellow-500" : "text-red-500";

  return (
    <section className="space-y-3">
      <div className={cn("border-l-2 pl-3", borderColor)}>
        <h2 className={cn("text-sm font-semibold", textColor)}>{title}</h2>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} onClick={() => onTopicClick(topic.id)} />
        ))}
      </div>
    </section>
  );
}

function TopicCard({
  topic,
  onClick,
}: {
  topic: (typeof TOPICS)[number];
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group text-left rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-lg transition-all duration-200 space-y-3"
    >
      <div className="flex items-start justify-between">
        <div className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center",
          "bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors"
        )}>
          {TOPIC_ICONS[topic.icon] || <BookOpen className="h-4 w-4" />}
        </div>
        <Badge variant="outline" className={cn("text-[10px] capitalize font-normal", DIFFICULTY_COLORS[topic.difficulty])}>
          {topic.difficulty}
        </Badge>
      </div>
      <div>
        <h3 className="text-sm font-medium group-hover:text-primary transition-colors">{topic.title}</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{topic.subtitle}</p>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {topic.duration}
        </span>
        <span className="flex items-center gap-1">
          <Shuffle className="h-3 w-3" />
          {topic.companies.slice(0, 2).join(", ")}
        </span>
      </div>
    </button>
  );
}
