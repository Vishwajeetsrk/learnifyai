/**
 * LessonBlockEditor — Notion-style no-code block editor
 * Supports 10 block types with slash commands and drag-to-reorder
 * Auto-saves with debounce
 */
import {
  useState, useCallback, useRef, useEffect,
} from "react";
import {
  Plus, Type, Play, Image as ImageIcon, Code2, Lightbulb,
  Minus, Globe, GitFork, FileText, ChevronDown, Check,
  Loader2, Save, Trash2, GripVertical, X as XIcon,
  AlertTriangle, Info, AlertOctagon, Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { BlockType, ContentBlock } from "@/components/course/BlockRenderer";
import { ExerciseEditorSection } from "@/components/course/ExerciseEditorSection";

// ────────────────────────────────────────────────────────────
// BLOCK DEFINITIONS
// ────────────────────────────────────────────────────────────

const BLOCK_DEFS: Array<{
  type: BlockType;
  label: string;
  description: string;
  icon: React.ReactNode;
  defaultContent: Record<string, any>;
}> = [
  {
    type: "text",
    label: "Text / Rich Text",
    description: "Paragraph, headings, lists, bold, italic",
    icon: <Type className="w-4 h-4" />,
    defaultContent: { html: "<p>Start typing your lesson content here...</p>" },
  },
  {
    type: "video",
    label: "Video Embed",
    description: "YouTube, Vimeo, or Loom",
    icon: <Play className="w-4 h-4" />,
    defaultContent: { url: "", title: "" },
  },
  {
    type: "image",
    label: "Image",
    description: "Upload or paste an image URL",
    icon: <ImageIcon className="w-4 h-4" />,
    defaultContent: { url: "", caption: "", alt: "" },
  },
  {
    type: "quiz",
    label: "Quiz / Knowledge Check",
    description: "Multiple choice questions with scoring",
    icon: <Trophy className="w-4 h-4" />,
    defaultContent: {
      title: "Knowledge Check",
      passingScore: 60,
      required: false,
      questions: [
        {
          question: "What is the main concept of this lesson?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          answer: 0,
          explanation: "Explanation goes here.",
        },
      ],
    },
  },
  {
    type: "code",
    label: "Code Snippet",
    description: "Syntax-highlighted code block",
    icon: <Code2 className="w-4 h-4" />,
    defaultContent: { code: "// Your code here\nconsole.log('Hello, world!');", language: "javascript", filename: "" },
  },
  {
    type: "callout",
    label: "Callout Box",
    description: "Tip, Note, Warning, or Danger",
    icon: <Lightbulb className="w-4 h-4" />,
    defaultContent: { variant: "tip", text: "Add your tip or note here." },
  },
  {
    type: "divider",
    label: "Divider",
    description: "Horizontal separator",
    icon: <Minus className="w-4 h-4" />,
    defaultContent: {},
  },
  {
    type: "embed",
    label: "Embed (iFrame)",
    description: "Figma, CodePen, Google Slides, etc.",
    icon: <Globe className="w-4 h-4" />,
    defaultContent: { src: "", title: "", height: 480 },
  },
  {
    type: "diagram",
    label: "Diagram (Mermaid)",
    description: "Flowchart, ER diagram, sequence",
    icon: <GitFork className="w-4 h-4" />,
    defaultContent: { mermaid: "flowchart TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Do it]\n    B -->|No| D[Skip]" },
  },
  {
    type: "file",
    label: "File / PDF Download",
    description: "Downloadable resource attachment",
    icon: <FileText className="w-4 h-4" />,
    defaultContent: { url: "", name: "Resource.pdf", size: "", mimeType: "application/pdf" },
  },
];

// ────────────────────────────────────────────────────────────
// MAIN EDITOR
// ────────────────────────────────────────────────────────────

export interface LessonBlockEditorProps {
  lessonId: string;
  lessonTitle: string;
  initialBlocks: ContentBlock[];
  onSave: (blocks: ContentBlock[]) => Promise<void>;
  onLessonTitleChange?: (title: string) => void;
  autoSave?: boolean;
  className?: string;
}

export function LessonBlockEditor({
  lessonId,
  lessonTitle,
  initialBlocks,
  onSave,
  onLessonTitleChange,
  autoSave = true,
  className,
}: LessonBlockEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(() =>
    [...initialBlocks].sort((a, b) => a.order_index - b.order_index),
  );
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [title, setTitle] = useState(lessonTitle);
  const [titleEditing, setTitleEditing] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDirty = useRef(false);

  // Sync if lesson switches
  useEffect(() => {
    setBlocks([...initialBlocks].sort((a, b) => a.order_index - b.order_index));
    setTitle(lessonTitle);
    setSaveState("idle");
    isDirty.current = false;
  }, [lessonId]);

  // Auto-save
  const triggerSave = useCallback(
    (newBlocks: ContentBlock[]) => {
      if (!autoSave) return;
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(async () => {
        setSaveState("saving");
        try {
          await onSave(newBlocks);
          setSaveState("saved");
          setTimeout(() => setSaveState("idle"), 2500);
        } catch {
          setSaveState("error");
        }
      }, 2000);
    },
    [autoSave, onSave],
  );

  const updateBlocks = useCallback(
    (updater: (prev: ContentBlock[]) => ContentBlock[]) => {
      setBlocks((prev) => {
        const next = updater(prev).map((b, i) => ({ ...b, order_index: i }));
        triggerSave(next);
        isDirty.current = true;
        return next;
      });
    },
    [triggerSave],
  );

  // Add block
  const addBlock = useCallback(
    (type: BlockType, afterIndex?: number) => {
      const def = BLOCK_DEFS.find((d) => d.type === type)!;
      const newBlock: ContentBlock = {
        id: `new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type,
        content: { ...def.defaultContent },
        order_index: afterIndex !== undefined ? afterIndex + 1 : blocks.length,
      };
      updateBlocks((prev) => {
        const next = [...prev];
        const insertAt = afterIndex !== undefined ? afterIndex + 1 : next.length;
        next.splice(insertAt, 0, newBlock);
        return next;
      });
    },
    [blocks.length, updateBlocks],
  );

  // Update block content
  const updateBlock = useCallback(
    (id: string, content: Record<string, any>) => {
      updateBlocks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, content } : b)),
      );
    },
    [updateBlocks],
  );

  // Delete block
  const deleteBlock = useCallback(
    (id: string) => {
      updateBlocks((prev) => prev.filter((b) => b.id !== id));
    },
    [updateBlocks],
  );

  // Reorder (drag)
  const dragBlock = useRef<string | null>(null);
  const dragOverBlock = useRef<string | null>(null);

  const handleManualSave = useCallback(async () => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    setSaveState("saving");
    try {
      await onSave(blocks);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      setSaveState("error");
    }
  }, [blocks, onSave]);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Editor header */}
      <div className="px-6 py-4 border-b border-white/8 flex items-center gap-3">
        {/* Lesson title */}
        <div className="flex-1 min-w-0">
          {titleEditing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => { setTitleEditing(false); onLessonTitleChange?.(title); }}
              onKeyDown={(e) => { if (e.key === "Enter") { setTitleEditing(false); onLessonTitleChange?.(title); } }}
              className="text-lg font-semibold bg-transparent border-indigo-500 h-8 px-2 w-full"
              autoFocus
            />
          ) : (
            <h2
              className="text-lg font-semibold text-white cursor-pointer hover:text-indigo-300 transition-colors truncate"
              onClick={() => setTitleEditing(true)}
              title="Click to edit lesson title"
            >
              {title || "Untitled Lesson"}
            </h2>
          )}
          <p className="text-xs text-slate-500 mt-0.5">{blocks.length} block{blocks.length !== 1 ? "s" : ""}</p>
        </div>

        {/* Save status */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {saveState === "saving" && (
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
            </span>
          )}
          {saveState === "saved" && (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
          {saveState === "error" && (
            <span className="text-xs text-red-400">Save failed</span>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={handleManualSave}
            className="h-8 border-white/10 text-slate-300 hover:border-indigo-500 hover:text-white text-xs"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Save
          </Button>
        </div>
      </div>

      {/* Blocks */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {blocks.length === 0 && (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
              <Plus className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-slate-500 text-sm mb-1">No content yet</p>
            <p className="text-slate-600 text-xs">Use the + button below to add your first block</p>
          </div>
        )}

        {blocks.map((block, index) => (
          <BlockEditorRow
            key={block.id}
            block={block}
            index={index}
            onUpdate={(content) => updateBlock(block.id, content)}
            onDelete={() => deleteBlock(block.id)}
            onAddAfter={(type) => addBlock(type, index)}
            onDragStart={() => { dragBlock.current = block.id; }}
            onDragOver={(e) => { e.preventDefault(); dragOverBlock.current = block.id; }}
            onDragEnd={() => {
              if (dragBlock.current && dragOverBlock.current && dragBlock.current !== dragOverBlock.current) {
                updateBlocks((prev) => {
                  const next = [...prev];
                  const from = next.findIndex((b) => b.id === dragBlock.current);
                  const to = next.findIndex((b) => b.id === dragOverBlock.current);
                  const [item] = next.splice(from, 1);
                  next.splice(to, 0, item);
                  return next;
                });
              }
              dragBlock.current = null;
              dragOverBlock.current = null;
            }}
          />
        ))}

        {/* Add first/next block button */}
        <AddBlockButton onAdd={(type) => addBlock(type)} />

        {/* Lesson coding exercise (admin/creator editable) */}
        <div className="pt-6">
          <ExerciseEditorSection lessonId={lessonId} />
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// BLOCK ROW WRAPPER
// ────────────────────────────────────────────────────────────

interface BlockEditorRowProps {
  block: ContentBlock;
  index: number;
  onUpdate: (content: Record<string, any>) => void;
  onDelete: () => void;
  onAddAfter: (type: BlockType) => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

function BlockEditorRow({
  block, index, onUpdate, onDelete, onAddAfter,
  onDragStart, onDragOver, onDragEnd,
}: BlockEditorRowProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative group"
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Drag handle on desktop hover */}
      <div className={cn(
        "hidden sm:flex absolute -left-7 top-2 flex-col items-center gap-0.5 transition-opacity",
        hovered ? "opacity-100" : "opacity-0",
      )}>
        <GripVertical className="w-4 h-4 text-slate-500 cursor-grab" />
      </div>

      {/* Block editor */}
      <div className="rounded-xl border border-white/8 bg-[#16162a] hover:border-white/15 transition-colors overflow-hidden">
        {/* Block type badge */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5 bg-white/2">
          <GripVertical className="w-3.5 h-3.5 text-slate-600 sm:hidden cursor-grab flex-shrink-0" />
          {BLOCK_DEFS.find((d) => d.type === block.type)?.icon}
          <span className="text-xs text-slate-400 capitalize font-medium">{block.type}</span>
          <span className="text-[10px] text-slate-600">#{index + 1}</span>
          
          <button
            onClick={onDelete}
            className="ml-auto w-6 h-6 flex items-center justify-center rounded hover:bg-red-950/50 text-slate-500 hover:text-red-400 transition-colors"
            title="Delete block"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content editor per type */}
        <div className="p-4">
          <BlockContentEditor block={block} onUpdate={onUpdate} />
        </div>
      </div>

      {/* Add block between */}
      <div className={cn(
        "flex justify-center py-1 transition-opacity",
        hovered ? "opacity-100" : "opacity-0",
      )}>
        <AddBlockButton onAdd={onAddAfter} compact />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// BLOCK CONTENT EDITORS
// ────────────────────────────────────────────────────────────

function BlockContentEditor({
  block, onUpdate,
}: { block: ContentBlock; onUpdate: (c: Record<string, any>) => void }) {
  switch (block.type) {
    case "text":    return <TextBlockEditor content={block.content} onUpdate={onUpdate} />;
    case "video":   return <VideoBlockEditor content={block.content} onUpdate={onUpdate} />;
    case "image":   return <ImageBlockEditor content={block.content} onUpdate={onUpdate} />;
    case "quiz":    return <QuizBlockEditor content={block.content} onUpdate={onUpdate} />;
    case "code":    return <CodeBlockEditor content={block.content} onUpdate={onUpdate} />;
    case "callout": return <CalloutBlockEditor content={block.content} onUpdate={onUpdate} />;
    case "divider": return <div className="text-center text-slate-600 text-xs py-2">—— Section Divider ——</div>;
    case "embed":   return <EmbedBlockEditor content={block.content} onUpdate={onUpdate} />;
    case "diagram": return <DiagramBlockEditor content={block.content} onUpdate={onUpdate} />;
    case "file":    return <FileBlockEditor content={block.content} onUpdate={onUpdate} />;
    default:        return null;
  }
}

// TEXT
function TextBlockEditor({ content, onUpdate }: { content: Record<string, any>; onUpdate: (c: Record<string, any>) => void }) {
  return (
    <div>
      <Label className="text-xs text-slate-500 mb-1.5 block">Content (HTML)</Label>
      <Textarea
        value={content.html ?? ""}
        onChange={(e) => onUpdate({ ...content, html: e.target.value })}
        placeholder="<p>Your lesson content...</p><h2>Heading</h2><ul><li>Bullet point</li></ul>"
        className="min-h-[140px] text-sm font-mono bg-slate-950 border-white/10 resize-y text-slate-200"
      />
      <p className="text-xs text-slate-600 mt-1.5">Supports HTML tags: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;code&gt;, &lt;a href=""&gt;</p>
    </div>
  );
}

// VIDEO
function VideoBlockEditor({ content, onUpdate }: { content: Record<string, any>; onUpdate: (c: Record<string, any>) => void }) {
  const [preview, setPreview] = useState(false);
  const embedId = getYouTubeId(content.url ?? "");

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs text-slate-500 mb-1.5 block">Video URL</Label>
        <Input
          value={content.url ?? ""}
          onChange={(e) => onUpdate({ ...content, url: e.target.value })}
          placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
          className="bg-slate-950 border-white/10 text-sm"
        />
        <p className="text-xs text-slate-600 mt-1">Supports YouTube, Vimeo, and Loom URLs</p>
      </div>
      <div>
        <Label className="text-xs text-slate-500 mb-1.5 block">Video Title (optional)</Label>
        <Input
          value={content.title ?? ""}
          onChange={(e) => onUpdate({ ...content, title: e.target.value })}
          placeholder="e.g. Introduction to React Hooks"
          className="bg-slate-950 border-white/10 text-sm"
        />
      </div>
      {embedId && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPreview((v) => !v)}
          className="text-xs border-white/10"
        >
          {preview ? "Hide Preview" : "Preview Video"}
        </Button>
      )}
      {preview && embedId && (
        <div className="rounded-lg overflow-hidden border border-white/10" style={{ paddingBottom: "56.25%", position: "relative" }}>
          <iframe
            src={`https://www.youtube.com/embed/${embedId}?rel=0`}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match?.[1] ?? null;
}

// IMAGE
function ImageBlockEditor({ content, onUpdate }: { content: Record<string, any>; onUpdate: (c: Record<string, any>) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs text-slate-500 mb-1.5 block">Image URL</Label>
        <Input
          value={content.url ?? ""}
          onChange={(e) => onUpdate({ ...content, url: e.target.value })}
          placeholder="https://example.com/image.png or Supabase Storage URL"
          className="bg-slate-950 border-white/10 text-sm"
        />
      </div>
      <div>
        <Label className="text-xs text-slate-500 mb-1.5 block">Caption (optional)</Label>
        <Input
          value={content.caption ?? ""}
          onChange={(e) => onUpdate({ ...content, caption: e.target.value })}
          placeholder="Image caption shown below..."
          className="bg-slate-950 border-white/10 text-sm"
        />
      </div>
      {content.url && (
        <img src={content.url} alt={content.caption || "Preview"} className="max-h-48 rounded-lg object-contain border border-white/10" />
      )}
    </div>
  );
}

// QUIZ
function QuizBlockEditor({ content, onUpdate }: { content: Record<string, any>; onUpdate: (c: Record<string, any>) => void }) {
  const questions = content.questions ?? [];

  const updateQuestion = (qi: number, patch: Record<string, any>) => {
    const next = [...questions];
    next[qi] = { ...next[qi], ...patch };
    onUpdate({ ...content, questions: next });
  };

  const addQuestion = () => {
    onUpdate({
      ...content,
      questions: [
        ...questions,
        { question: "New question?", options: ["A", "B", "C", "D"], answer: 0, explanation: "" },
      ],
    });
  };

  const removeQuestion = (qi: number) => {
    onUpdate({ ...content, questions: questions.filter((_: any, i: number) => i !== qi) });
  };

  return (
    <div className="space-y-4">
      {/* Quiz settings */}
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <Label className="text-xs text-slate-500 mb-1.5 block">Quiz Title</Label>
          <Input
            value={content.title ?? "Knowledge Check"}
            onChange={(e) => onUpdate({ ...content, title: e.target.value })}
            className="bg-slate-950 border-white/10 text-sm w-48"
          />
        </div>
        <div>
          <Label className="text-xs text-slate-500 mb-1.5 block">Passing Score (%)</Label>
          <Input
            type="number"
            min={0} max={100}
            value={content.passingScore ?? 60}
            onChange={(e) => onUpdate({ ...content, passingScore: Number(e.target.value) })}
            className="bg-slate-950 border-white/10 text-sm w-24"
          />
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Switch
            checked={content.required ?? false}
            onCheckedChange={(v) => onUpdate({ ...content, required: v })}
          />
          <Label className="text-xs text-slate-400">Required to continue</Label>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {questions.map((q: any, qi: number) => (
          <div key={qi} className="rounded-lg border border-white/10 bg-slate-950 p-3 space-y-2">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-xs border-indigo-500/30 text-indigo-400 mt-0.5 flex-shrink-0">Q{qi + 1}</Badge>
              <Input
                value={q.question}
                onChange={(e) => updateQuestion(qi, { question: e.target.value })}
                placeholder="Question text..."
                className="flex-1 bg-slate-900 border-white/10 text-sm"
              />
              <button onClick={() => removeQuestion(qi)} className="text-red-400/60 hover:text-red-400 flex-shrink-0 mt-1">
                <XIcon className="w-4 h-4" />
              </button>
            </div>
            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:pl-8 pl-0">
              {(q.options ?? []).map((opt: string, oi: number) => (
                <div key={oi} className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQuestion(qi, { answer: oi })}
                    className={cn(
                      "w-5 h-5 rounded-full border flex-shrink-0 text-xs flex items-center justify-center",
                      q.answer === oi ? "border-emerald-500 bg-emerald-600 text-white" : "border-white/20 text-slate-500 hover:border-emerald-500/50",
                    )}
                  >
                    {q.answer === oi ? "✓" : String.fromCharCode(65 + oi)}
                  </button>
                  <Input
                    value={opt}
                    onChange={(e) => {
                      const opts = [...q.options];
                      opts[oi] = e.target.value;
                      updateQuestion(qi, { options: opts });
                    }}
                    className="text-xs bg-slate-900 border-white/10 h-7 px-2"
                    placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                  />
                </div>
              ))}
            </div>
            {/* Explanation */}
            <div className="sm:pl-8 pl-0">
              <Input
                value={q.explanation ?? ""}
                onChange={(e) => updateQuestion(qi, { explanation: e.target.value })}
                placeholder="Explanation (shown after answering)..."
                className="text-xs bg-slate-900 border-white/10 h-7 px-2"
              />
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addQuestion} className="text-xs border-dashed border-white/15 text-slate-400 hover:border-indigo-500 hover:text-indigo-300">
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Question
        </Button>
      </div>
    </div>
  );
}

// CODE
const LANGUAGES = ["javascript", "typescript", "python", "java", "cpp", "go", "rust", "html", "css", "sql", "bash", "json", "yaml", "plaintext"];

function CodeBlockEditor({ content, onUpdate }: { content: Record<string, any>; onUpdate: (c: Record<string, any>) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Label className="text-xs text-slate-500 mb-1.5 block">Filename (optional)</Label>
          <Input
            value={content.filename ?? ""}
            onChange={(e) => onUpdate({ ...content, filename: e.target.value })}
            placeholder="e.g. index.js"
            className="bg-slate-950 border-white/10 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-slate-500 mb-1.5 block">Language</Label>
          <Select value={content.language ?? "javascript"} onValueChange={(v) => onUpdate({ ...content, language: v })}>
            <SelectTrigger className="w-36 bg-slate-950 border-white/10 text-sm h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              {LANGUAGES.map((l) => (
                <SelectItem key={l} value={l} className="text-slate-300 text-xs">{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label className="text-xs text-slate-500 mb-1.5 block">Code</Label>
        <Textarea
          value={content.code ?? ""}
          onChange={(e) => onUpdate({ ...content, code: e.target.value })}
          placeholder="// Paste your code here..."
          className="min-h-[160px] font-mono text-sm bg-slate-950 border-white/10 text-emerald-300 resize-y"
          style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
        />
      </div>
    </div>
  );
}

// CALLOUT
const CALLOUT_VARIANTS = [
  { value: "tip", label: "Tip", icon: <Lightbulb className="w-3.5 h-3.5" />, color: "text-emerald-400" },
  { value: "note", label: "Note", icon: <Info className="w-3.5 h-3.5" />, color: "text-indigo-400" },
  { value: "info", label: "Info", icon: <Info className="w-3.5 h-3.5" />, color: "text-sky-400" },
  { value: "warning", label: "Warning", icon: <AlertTriangle className="w-3.5 h-3.5" />, color: "text-amber-400" },
  { value: "danger", label: "Danger", icon: <AlertOctagon className="w-3.5 h-3.5" />, color: "text-red-400" },
];

function CalloutBlockEditor({ content, onUpdate }: { content: Record<string, any>; onUpdate: (c: Record<string, any>) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs text-slate-500 mb-1.5 block">Type</Label>
        <div className="flex gap-2 flex-wrap">
          {CALLOUT_VARIANTS.map((v) => (
            <button
              key={v.value}
              onClick={() => onUpdate({ ...content, variant: v.value })}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all",
                content.variant === v.value
                  ? "border-current bg-current/10"
                  : "border-white/10 text-slate-500 hover:border-white/20",
                content.variant === v.value && v.color,
              )}
            >
              {v.icon} {v.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label className="text-xs text-slate-500 mb-1.5 block">Message</Label>
        <Textarea
          value={content.text ?? ""}
          onChange={(e) => onUpdate({ ...content, text: e.target.value })}
          placeholder="Your tip, note, or warning message..."
          className="bg-slate-950 border-white/10 text-sm resize-none min-h-[80px]"
        />
      </div>
    </div>
  );
}

// EMBED
function EmbedBlockEditor({ content, onUpdate }: { content: Record<string, any>; onUpdate: (c: Record<string, any>) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs text-slate-500 mb-1.5 block">Embed URL</Label>
        <Input
          value={content.src ?? ""}
          onChange={(e) => onUpdate({ ...content, src: e.target.value })}
          placeholder="https://figma.com/embed?... or https://codepen.io/embed/..."
          className="bg-slate-950 border-white/10 text-sm"
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Label className="text-xs text-slate-500 mb-1.5 block">Title</Label>
          <Input
            value={content.title ?? ""}
            onChange={(e) => onUpdate({ ...content, title: e.target.value })}
            placeholder="e.g. Figma Design"
            className="bg-slate-950 border-white/10 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-slate-500 mb-1.5 block">Height (px)</Label>
          <Input
            type="number"
            value={content.height ?? 480}
            onChange={(e) => onUpdate({ ...content, height: Number(e.target.value) })}
            className="bg-slate-950 border-white/10 text-sm w-28"
          />
        </div>
      </div>
    </div>
  );
}

// DIAGRAM
function DiagramBlockEditor({ content, onUpdate }: { content: Record<string, any>; onUpdate: (c: Record<string, any>) => void }) {
  const EXAMPLES = [
    { label: "Flowchart", value: "flowchart TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Do it]\n    B -->|No| D[Skip it]" },
    { label: "Sequence", value: "sequenceDiagram\n    Client->>Server: Request\n    Server-->>Client: Response" },
    { label: "ER Diagram", value: "erDiagram\n    USER ||--o{ ORDER : places\n    ORDER ||--|{ ITEM : contains" },
    { label: "Class Diagram", value: "classDiagram\n    class Animal {\n      +name: string\n      +speak() void\n    }" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label className="text-xs text-slate-500">Mermaid Definition</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs border-white/10 h-6 px-2">
              Examples <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-900 border-white/10 text-xs">
            {EXAMPLES.map((ex) => (
              <DropdownMenuItem
                key={ex.label}
                onClick={() => onUpdate({ ...content, mermaid: ex.value })}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                {ex.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Textarea
        value={content.mermaid ?? ""}
        onChange={(e) => onUpdate({ ...content, mermaid: e.target.value })}
        placeholder="flowchart TD&#10;    A[Start] --> B[End]"
        className="min-h-[140px] font-mono text-sm bg-slate-950 border-white/10 text-violet-300 resize-y"
        style={{ fontFamily: "monospace" }}
      />
      <p className="text-xs text-slate-600">
        Supports: flowchart, sequenceDiagram, erDiagram, classDiagram, gantt, pie.{" "}
        <a href="https://mermaid.js.org/syntax/flowchart.html" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
          Docs →
        </a>
      </p>
    </div>
  );
}

// FILE
function FileBlockEditor({ content, onUpdate }: { content: Record<string, any>; onUpdate: (c: Record<string, any>) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs text-slate-500 mb-1.5 block">File URL</Label>
        <Input
          value={content.url ?? ""}
          onChange={(e) => onUpdate({ ...content, url: e.target.value })}
          placeholder="https://your-storage-url.com/file.pdf"
          className="bg-slate-950 border-white/10 text-sm"
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Label className="text-xs text-slate-500 mb-1.5 block">Display Name</Label>
          <Input
            value={content.name ?? ""}
            onChange={(e) => onUpdate({ ...content, name: e.target.value })}
            placeholder="e.g. Week 1 Slides.pdf"
            className="bg-slate-950 border-white/10 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-slate-500 mb-1.5 block">Size (optional)</Label>
          <Input
            value={content.size ?? ""}
            onChange={(e) => onUpdate({ ...content, size: e.target.value })}
            placeholder="e.g. 2.3 MB"
            className="bg-slate-950 border-white/10 text-sm w-32"
          />
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// ADD BLOCK BUTTON
// ────────────────────────────────────────────────────────────

function AddBlockButton({
  onAdd, compact = false,
}: { onAdd: (type: BlockType) => void; compact?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {compact ? (
          <button className="w-7 h-7 rounded-full border border-dashed border-white/20 bg-white/3 flex items-center justify-center text-slate-500 hover:border-indigo-500 hover:text-indigo-400 hover:bg-indigo-950/20 transition-all">
            <Plus className="w-3.5 h-3.5" />
          </button>
        ) : (
          <Button
            variant="outline"
            className="border-dashed border-white/15 text-slate-400 hover:border-indigo-500 hover:text-indigo-300 hover:bg-indigo-950/20 w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Block
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="w-72 bg-slate-900 border-white/10"
      >
        <DropdownMenuLabel className="text-xs text-slate-500">Insert Block</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/5" />
        {BLOCK_DEFS.map((def) => (
          <DropdownMenuItem
            key={def.type}
            onClick={() => onAdd(def.type)}
            className="flex items-start gap-3 py-2.5 cursor-pointer text-slate-300 hover:text-white hover:bg-white/5"
          >
            <span className="text-indigo-400 mt-0.5 flex-shrink-0">{def.icon}</span>
            <div>
              <p className="text-sm font-medium">{def.label}</p>
              <p className="text-xs text-slate-500">{def.description}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
