import { useState } from "react";
import { GraduationCap, Copy, Check, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ExamArtifact } from "./types";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface InteractiveExamCardProps {
  exam: ExamArtifact;
}

export function InteractiveExamCard({ exam }: InteractiveExamCardProps) {
  const availableTabs: Array<{ key: "marks2" | "marks5" | "marks8" | "marks10"; label: string }> = [];
  if (exam.marks2) availableTabs.push({ key: "marks2", label: "2 Marks (Definition)" });
  if (exam.marks5) availableTabs.push({ key: "marks5", label: "5 Marks (Standard)" });
  if (exam.marks8) availableTabs.push({ key: "marks8", label: "8 Marks (Detailed)" });
  if (exam.marks10) availableTabs.push({ key: "marks10", label: "10 Marks (Comprehensive)" });

  const [activeTab, setActiveTab] = useState<"marks2" | "marks5" | "marks8" | "marks10">(
    availableTabs[0]?.key || "marks5",
  );
  const [copied, setCopied] = useState(false);

  if (availableTabs.length === 0) return null;

  const currentContent = exam[activeTab] || "";

  const handleCopy = () => {
    if (!currentContent) return;
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    toast.success("Exam answer copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-2xl border border-border/80 bg-gradient-to-b from-card to-card/50 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              University & Competitive Exam Format
            </span>
            <h4 className="text-sm font-semibold text-foreground">{exam.topic}</h4>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="h-7 text-xs rounded-lg border-border/60"
        >
          {copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
          {copied ? "Copied" : "Copy Answer"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-border/60 pb-2 mb-3 overflow-x-auto">
        {availableTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-lg transition-all shrink-0 cursor-pointer",
              activeTab === tab.key
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Answer Body */}
      <div className="rounded-xl bg-background/80 border border-border/50 p-4 prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentContent}</ReactMarkdown>
      </div>
    </div>
  );
}
