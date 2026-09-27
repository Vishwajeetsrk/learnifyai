"use client";

import React, { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Highlighter,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code2,
  Table,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  HelpCircle,
  BarChart2,
  Lightbulb,
  Eye,
  Edit3,
  Sparkles,
  Play,
  ChevronDown,
  FileSpreadsheet,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { InteractiveLessonContent } from "./InteractiveLessonContent";
import { cn } from "@/lib/utils";

interface RichLessonEditorProps {
  value: string;
  onChange: (val: string) => void;
  onAiGenerate?: () => void;
  isAiGenerating?: boolean;
}

export function RichLessonEditor({
  value,
  onChange,
  onAiGenerate,
  isAiGenerating = false,
}: RichLessonEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (prefix: string, suffix: string = "", defaultText: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || defaultText;
    const replacement = `${prefix}${selected}${suffix}`;

    const updated = value.substring(0, start) + replacement + value.substring(end);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selected.length
      );
    }, 10);
  };

  const insertSnippet = (snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = value.substring(0, start);
    const after = value.substring(end);

    const prefix = before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
    const suffix = after.startsWith("\n\n") ? "" : after.startsWith("\n") ? "\n" : "\n\n";

    const updated = before + prefix + snippet + suffix + after;
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
    }, 10);
  };

  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm space-y-0">
      {/* Mode Switcher & Quick AI Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 border-b border-border/60 bg-muted/30">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            variant={activeTab === "edit" ? "default" : "ghost"}
            onClick={() => setActiveTab("edit")}
            className="h-7 text-xs px-2.5 font-medium"
          >
            <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit Content
          </Button>
          <Button
            type="button"
            size="sm"
            variant={activeTab === "preview" ? "default" : "ghost"}
            onClick={() => setActiveTab("preview")}
            className="h-7 text-xs px-2.5 font-medium"
          >
            <Eye className="h-3.5 w-3.5 mr-1" /> Live Preview
          </Button>
        </div>

        {onAiGenerate && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAiGenerate}
            disabled={isAiGenerating}
            className="h-7 text-[11px] px-2.5 bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary font-medium"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-500 fill-amber-500" />
            {isAiGenerating ? "Generating..." : "AI Write Lesson Notes"}
          </Button>
        )}
      </div>

      {activeTab === "edit" && (
        <>
          {/* MS Word-Style Formatting Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border/40 bg-muted/15 text-xs">
            {/* Typography */}
            <div className="flex items-center gap-0.5 pr-1 border-r border-border/50">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => insertText("**", "**", "bold text")}
                title="Bold (Ctrl+B)"
              >
                <Bold className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => insertText("*", "*", "italic text")}
                title="Italic (Ctrl+I)"
              >
                <Italic className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => insertText("~~", "~~", "strikethrough text")}
                title="Strikethrough"
              >
                <Strikethrough className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => insertText("<mark>", "</mark>", "highlighted text")}
                title="Highlight"
              >
                <Highlighter className="h-3.5 w-3.5 text-amber-500" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => insertText("`", "`", "code")}
                title="Inline Code"
              >
                <Code2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Headings */}
            <div className="flex items-center gap-0.5 px-1 border-r border-border/50">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => insertText("## ", "", "Heading 2")}
                title="Heading 2"
              >
                <Heading2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => insertText("### ", "", "Heading 3")}
                title="Heading 3"
              >
                <Heading3 className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Lists & Quotes */}
            <div className="flex items-center gap-0.5 px-1 border-r border-border/50">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => insertText("- ", "", "List item")}
                title="Bullet List"
              >
                <List className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => insertText("1. ", "", "First item")}
                title="Numbered List"
              >
                <ListOrdered className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => insertText("- [ ] ", "", "Task checklist")}
                title="Task Checklist"
              >
                <CheckSquare className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => insertText("> ", "", "Important note")}
                title="Blockquote"
              >
                <Quote className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Insert Media & Links */}
            <div className="flex items-center gap-0.5 px-1 border-r border-border/50">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => insertText("[", "](https://example.com)", "Link title")}
                title="Insert Link"
              >
                <LinkIcon className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => insertText("![", "](https://images.unsplash.com/...)", "Image description")}
                title="Insert Image"
              >
                <ImageIcon className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => insertSnippet("---")}
                title="Horizontal Divider"
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() =>
                  insertSnippet(
                    "<details>\n<summary>Click to view solution & tips</summary>\n\nWrite detailed collapsible hints, step-by-step solutions or references here.\n\n</details>"
                  )
                }
                title="Insert Collapsible Accordion"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Special Practical Blocks */}
            <div className="flex items-center gap-1 pl-1 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  insertSnippet(
                    `| Step / Concept | Code / Command | Expected Output |\n| :--- | :--- | :--- |\n| 1. Initialize | \`npm create vite@latest\` | Project scaffolding created |\n| 2. Run Dev | \`npm run dev\` | Server running on localhost:5173 |`
                  )
                }
                className="h-7 px-2 text-[11px] gap-1"
                title="Insert formatted Table"
              >
                <Table className="h-3 w-3 text-indigo-500" />
                Table
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  insertSnippet(
                    "```python\n# Practical Challenge: Run in IDE\ndef calculate_result(data):\n    # Process data and return output\n    return [x * 2 for x in data]\n\nprint(calculate_result([1, 2, 3, 4]))\n```"
                  )
                }
                className="h-7 px-2 text-[11px] gap-1"
                title="Insert executable Code & IDE block"
              >
                <Play className="h-3 w-3 text-emerald-500 fill-emerald-500" />
                Code &amp; IDE
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  insertSnippet(
                    "```excel\n=SUM(B2:B5)\n```"
                  )
                }
                className="h-7 px-2 text-[11px] gap-1"
                title="Insert interactive Excel & Spreadsheet simulator block"
              >
                <FileSpreadsheet className="h-3 w-3 text-emerald-600" />
                Excel Simulator
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  insertSnippet(
                    "```diagram\n  ┌──────────────────────────────────────┐\n  │ Ribbon: Home / Insert / Formulas ... │\n  ├──────────────────────────────────────┤\n  │ Name box  │  fx function bar          │\n  ├──────┬───────────────────────────────┤\n  │      │   A   B   C    D             │\n  │  R1  │  Name  Score  Grade           │\n  │  R2  │  Vish   85    Pass            │\n  │  R3  │  Nisha  92    Pass            │\n  ├──────┴───────────────────────────────┤\n  │ Sheet tabs:  Sheet1 | Sheet2         │\n  └──────────────────────────────────────┘\n```"
                  )
                }
                className="h-7 px-2 text-[11px] gap-1"
                title="Insert Architecture Map / Diagram"
              >
                <Layers className="h-3 w-3 text-sky-500" />
                Diagram
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  insertSnippet(
                    `:::quiz\n**Question:** What is the primary purpose of this feature?\n- [ ] It manages background timers\n- [x] It optimizes rendering and synchronizes state\n- [ ] It compiles TypeScript to C++\n- [ ] It compresses video frames\n*Explanation:* This method synchronizes local component state with the external rendering pipeline.\n:::`
                  )
                }
                className="h-7 px-2 text-[11px] gap-1"
                title="Insert interactive Multiple Choice Question (MCQ)"
              >
                <HelpCircle className="h-3 w-3 text-amber-500" />
                Quiz (MCQ)
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  insertSnippet(
                    `:::poll\n**Quick Check:** How well do you understand this concept?\n- 🚀 Completely confident, ready to build!\n- 👍 Good understanding, need a little practice\n- 🤔 A bit confused about syntax\n- 🆘 Need mentor support\n:::`
                  )
                }
                className="h-7 px-2 text-[11px] gap-1"
                title="Insert interactive Poll"
              >
                <BarChart2 className="h-3 w-3 text-sky-500" />
                Poll
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  insertSnippet(
                    `> [!TIP]\n> **Pro Tip:** Keep your code modular and use standard error boundaries for resilient user experiences.`
                  )
                }
                className="h-7 px-2 text-[11px] gap-1"
                title="Insert Word-style Callout Box"
              >
                <Lightbulb className="h-3 w-3 text-yellow-500" />
                Callout
              </Button>
            </div>
          </div>

          {/* Textarea */}
          <div className="relative p-2">
            <Textarea
              ref={textareaRef}
              rows={12}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Write comprehensive lesson content with formatted headings, code blocks, tables, interactive quizzes (:::quiz), and polls (:::poll)..."
              className="w-full font-mono text-xs leading-relaxed min-h-[260px] border-none shadow-none focus-visible:ring-0 resize-y p-2"
            />
          </div>

          {/* Status footer */}
          <div className="flex items-center justify-between px-3 py-1.5 border-t border-border/40 bg-muted/20 text-[11px] text-muted-foreground">
            <span>
              {value.length} characters · {value.split(/\r\n|\r|\n/).length} lines
            </span>
            <span className="text-[10px]">
              Supports Markdown, Tables, Code Blocks, Quizzes (:::quiz) &amp; Polls (:::poll)
            </span>
          </div>
        </>
      )}

      {activeTab === "preview" && (
        <div className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto bg-card">
          {value.trim() ? (
            <InteractiveLessonContent content={value} />
          ) : (
            <p className="text-xs text-muted-foreground italic text-center py-10">
              No content to preview yet. Click &ldquo;Edit Content&rdquo; above to write lesson notes.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
