/**
 * CurriculumSidebar — drag-and-drop curriculum manager for the course builder
 * Manages modules and lessons with reorder, add/delete, preview toggle
 */
import {
  useState, useCallback, useRef,
} from "react";
import {
  ChevronDown, ChevronRight, Plus, Trash2, GripVertical,
  Eye, EyeOff, Lock, Unlock, BookOpen, MoreHorizontal,
  Pencil, Check, X as XIcon, Play, Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// ────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────

export interface CurriculumLesson {
  id: string;
  title: string;
  duration_minutes: number;
  is_preview: boolean;
  is_free_preview: boolean;
  video_url: string | null;
  content_format: string;
  order_index: number;
}

export interface CurriculumModule {
  id: string;
  title: string;
  description: string;
  order_index: number;
  lessons: CurriculumLesson[];
}

interface CurriculumSidebarProps {
  modules: CurriculumModule[];
  selectedLessonId: string | null;
  selectedPanel: "lesson" | "settings";
  onSelectLesson: (lessonId: string) => void;
  onSelectSettings: () => void;
  onAddModule: () => Promise<void>;
  onAddLesson: (moduleId: string) => Promise<void>;
  onDeleteModule: (moduleId: string) => Promise<void>;
  onDeleteLesson: (lessonId: string) => Promise<void>;
  onRenameModule: (moduleId: string, title: string) => Promise<void>;
  onRenameLesson: (lessonId: string, title: string) => Promise<void>;
  onToggleFreePreview: (lessonId: string, val: boolean) => Promise<void>;
  onReorderModules: (orderedIds: string[]) => Promise<void>;
  onReorderLessons: (moduleId: string, orderedIds: string[]) => Promise<void>;
  loading?: boolean;
}

// ────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────────────────

export function CurriculumSidebar({
  modules,
  selectedLessonId,
  selectedPanel,
  onSelectLesson,
  onSelectSettings,
  onAddModule,
  onAddLesson,
  onDeleteModule,
  onDeleteLesson,
  onRenameModule,
  onRenameLesson,
  onToggleFreePreview,
  onReorderModules,
  onReorderLessons,
  loading,
}: CurriculumSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    () => new Set(modules.map((m) => m.id)),
  );
  const [draggingModuleId, setDraggingModuleId] = useState<string | null>(null);
  const [draggingLessonId, setDraggingLessonId] = useState<string | null>(null);

  const toggleModule = useCallback((id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Drag-drop for modules (simple array reorder)
  const dragModuleOver = useRef<string | null>(null);
  const dragLessonOver = useRef<{ moduleId: string; lessonId: string } | null>(null);

  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
  const totalMins = modules.reduce(
    (s, m) => s + m.lessons.reduce((ls, l) => ls + (l.duration_minutes ?? 0), 0),
    0,
  );

  return (
    <aside className="flex flex-col h-full bg-[#131320] border-r border-white/8">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-white/8">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Curriculum
          </span>
          <Badge variant="outline" className="text-xs border-white/10 text-slate-500 py-0">
            {totalLessons} lessons
          </Badge>
        </div>
        <p className="text-xs text-slate-600">{Math.floor(totalMins / 60)}h {totalMins % 60}m total</p>
      </div>

      {/* Settings button */}
      <button
        onClick={onSelectSettings}
        className={cn(
          "flex items-center gap-2.5 px-4 py-3 text-sm border-b border-white/5 transition-colors",
          selectedPanel === "settings"
            ? "bg-indigo-950/40 text-indigo-300 border-l-2 border-l-indigo-500"
            : "text-slate-400 hover:bg-white/5 hover:text-white",
        )}
      >
        <Layers className="w-4 h-4 flex-shrink-0" />
        Course Settings
      </button>

      {/* Modules list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 rounded-lg bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : modules.length === 0 ? (
          <div className="p-6 text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="text-xs text-slate-500">No modules yet. Add your first module below.</p>
          </div>
        ) : (
          <div className="py-2">
            {modules.map((mod, mi) => (
              <ModuleRow
                key={mod.id}
                mod={mod}
                index={mi}
                expanded={expandedModules.has(mod.id)}
                selectedLessonId={selectedLessonId}
                onToggle={() => toggleModule(mod.id)}
                onSelectLesson={onSelectLesson}
                onAddLesson={() => onAddLesson(mod.id)}
                onDeleteModule={() => onDeleteModule(mod.id)}
                onRenameModule={(title) => onRenameModule(mod.id, title)}
                onDeleteLesson={onDeleteLesson}
                onRenameLesson={onRenameLesson}
                onToggleFreePreview={onToggleFreePreview}
                // Drag events
                onModuleDragStart={() => setDraggingModuleId(mod.id)}
                onModuleDragOver={() => { dragModuleOver.current = mod.id; }}
                onModuleDragEnd={() => {
                  if (draggingModuleId && dragModuleOver.current && draggingModuleId !== dragModuleOver.current) {
                    const ids = modules.map((m) => m.id);
                    const from = ids.indexOf(draggingModuleId);
                    const to = ids.indexOf(dragModuleOver.current);
                    ids.splice(from, 1);
                    ids.splice(to, 0, draggingModuleId);
                    onReorderModules(ids);
                  }
                  setDraggingModuleId(null);
                  dragModuleOver.current = null;
                }}
                onLessonDragStart={(lid) => setDraggingLessonId(lid)}
                onLessonDragOver={(lid) => { dragLessonOver.current = { moduleId: mod.id, lessonId: lid }; }}
                onLessonDragEnd={(lid) => {
                  if (draggingLessonId && dragLessonOver.current?.moduleId === mod.id && draggingLessonId !== dragLessonOver.current.lessonId) {
                    const ids = mod.lessons.map((l) => l.id);
                    const from = ids.indexOf(draggingLessonId);
                    const to = ids.indexOf(dragLessonOver.current.lessonId);
                    ids.splice(from, 1);
                    ids.splice(to, 0, draggingLessonId);
                    onReorderLessons(mod.id, ids);
                  }
                  setDraggingLessonId(null);
                  dragLessonOver.current = null;
                }}
                isDraggingModule={draggingModuleId === mod.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add module */}
      <div className="p-3 border-t border-white/8">
        <Button
          variant="outline"
          size="sm"
          onClick={onAddModule}
          className="w-full border-dashed border-white/15 text-slate-400 hover:border-indigo-500 hover:text-indigo-300 hover:bg-indigo-950/20 text-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Module
        </Button>
      </div>
    </aside>
  );
}

// ────────────────────────────────────────────────────────────
// MODULE ROW
// ────────────────────────────────────────────────────────────

interface ModuleRowProps {
  mod: CurriculumModule;
  index: number;
  expanded: boolean;
  selectedLessonId: string | null;
  onToggle: () => void;
  onSelectLesson: (id: string) => void;
  onAddLesson: () => void;
  onDeleteModule: () => void;
  onRenameModule: (title: string) => void;
  onDeleteLesson: (id: string) => Promise<void>;
  onRenameLesson: (id: string, title: string) => Promise<void>;
  onToggleFreePreview: (id: string, val: boolean) => Promise<void>;
  onModuleDragStart: () => void;
  onModuleDragOver: () => void;
  onModuleDragEnd: () => void;
  onLessonDragStart: (id: string) => void;
  onLessonDragOver: (id: string) => void;
  onLessonDragEnd: (id: string) => void;
  isDraggingModule: boolean;
}

function ModuleRow({
  mod, index, expanded, selectedLessonId,
  onToggle, onSelectLesson, onAddLesson, onDeleteModule,
  onRenameModule, onDeleteLesson, onRenameLesson, onToggleFreePreview,
  onModuleDragStart, onModuleDragOver, onModuleDragEnd,
  onLessonDragStart, onLessonDragOver, onLessonDragEnd,
  isDraggingModule,
}: ModuleRowProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(mod.title);

  const saveTitle = () => {
    if (editTitle.trim()) onRenameModule(editTitle.trim());
    setEditing(false);
  };

  return (
    <div
      className={cn(
        "transition-all",
        isDraggingModule && "opacity-50 scale-[0.98]",
      )}
      draggable
      onDragStart={onModuleDragStart}
      onDragOver={(e) => { e.preventDefault(); onModuleDragOver(); }}
      onDragEnd={onModuleDragEnd}
    >
      {/* Module header */}
      <div className="flex items-center gap-1.5 px-3 py-2 group hover:bg-white/4">
        {/* Drag handle */}
        <GripVertical className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 cursor-grab flex-shrink-0" />

        {/* Expand toggle */}
        <button onClick={onToggle} className="text-slate-400 hover:text-white transition-colors flex-shrink-0">
          {expanded
            ? <ChevronDown className="w-3.5 h-3.5" />
            : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {/* Title */}
        {editing ? (
          <div className="flex-1 flex items-center gap-1">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") setEditing(false); }}
              className="h-6 text-xs bg-slate-800 border-indigo-500 py-0 px-2"
              autoFocus
            />
            <button onClick={saveTitle} className="text-emerald-400 hover:text-emerald-300 p-0.5"><Check className="w-3 h-3" /></button>
            <button onClick={() => setEditing(false)} className="text-slate-400 hover:text-white p-0.5"><XIcon className="w-3 h-3" /></button>
          </div>
        ) : (
          <span className="flex-1 text-xs font-semibold text-slate-300 truncate cursor-pointer" onClick={onToggle}>
            Module {index + 1}: {mod.title}
          </span>
        )}

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-white">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-xs">
            <DropdownMenuItem onClick={() => setEditing(true)} className="text-slate-300 hover:text-white cursor-pointer">
              <Pencil className="w-3 h-3 mr-2" /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onAddLesson} className="text-slate-300 hover:text-white cursor-pointer">
              <Plus className="w-3 h-3 mr-2" /> Add Lesson
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDeleteModule} className="text-red-400 hover:text-red-300 cursor-pointer">
              <Trash2 className="w-3 h-3 mr-2" /> Delete Module
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Lessons */}
      {expanded && (
        <div className="pb-1">
          {mod.lessons.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              selected={selectedLessonId === lesson.id}
              onSelect={() => onSelectLesson(lesson.id)}
              onDelete={() => onDeleteLesson(lesson.id)}
              onRename={(title) => onRenameLesson(lesson.id, title)}
              onToggleFreePreview={(val) => onToggleFreePreview(lesson.id, val)}
              onDragStart={() => onLessonDragStart(lesson.id)}
              onDragOver={() => onLessonDragOver(lesson.id)}
              onDragEnd={() => onLessonDragEnd(lesson.id)}
            />
          ))}
          {/* Add lesson */}
          <button
            onClick={onAddLesson}
            className="w-full flex items-center gap-2 pl-10 pr-3 py-1.5 text-xs text-slate-600 hover:text-indigo-400 hover:bg-indigo-950/10 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add lesson
          </button>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// LESSON ROW
// ────────────────────────────────────────────────────────────

interface LessonRowProps {
  lesson: CurriculumLesson;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
  onToggleFreePreview: (val: boolean) => void;
  onDragStart: () => void;
  onDragOver: () => void;
  onDragEnd: () => void;
}

function LessonRow({
  lesson, selected, onSelect, onDelete, onRename, onToggleFreePreview,
  onDragStart, onDragOver, onDragEnd,
}: LessonRowProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(lesson.title);

  const saveTitle = () => {
    if (editTitle.trim()) onRename(editTitle.trim());
    setEditing(false);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 pl-8 pr-3 py-1.5 group cursor-pointer transition-colors",
        selected
          ? "bg-indigo-950/40 border-l-2 border-l-indigo-500"
          : "hover:bg-white/4 border-l-2 border-l-transparent",
      )}
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => { e.preventDefault(); onDragOver(); }}
      onDragEnd={onDragEnd}
      onClick={onSelect}
    >
      <GripVertical className="w-3 h-3 text-slate-700 group-hover:text-slate-500 cursor-grab flex-shrink-0" />

      {/* Icon */}
      <span className="flex-shrink-0 text-slate-500">
        {lesson.video_url
          ? <Play className="w-3 h-3 text-sky-500" />
          : <BookOpen className="w-3 h-3" />}
      </span>

      {/* Title */}
      {editing ? (
        <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") setEditing(false); }}
            className="h-5 text-xs bg-slate-800 border-indigo-500 py-0 px-1.5"
            autoFocus
          />
          <button onClick={saveTitle} className="text-emerald-400 p-0.5"><Check className="w-3 h-3" /></button>
          <button onClick={() => setEditing(false)} className="text-slate-400 p-0.5"><XIcon className="w-3 h-3" /></button>
        </div>
      ) : (
        <span className={cn(
          "flex-1 text-xs truncate",
          selected ? "text-indigo-200" : "text-slate-400 group-hover:text-slate-200",
        )}>
          {lesson.title}
        </span>
      )}

      {/* Free preview badge */}
      {lesson.is_free_preview && (
        <span className="text-[10px] text-emerald-400 border border-emerald-500/30 rounded px-1 flex-shrink-0">Free</span>
      )}

      {/* Actions */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 flex-shrink-0"
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setEditing(true)}
          className="p-0.5 rounded hover:bg-white/10 text-slate-500 hover:text-white"
          title="Rename"
        >
          <Pencil className="w-3 h-3" />
        </button>
        <button
          onClick={() => onToggleFreePreview(!lesson.is_free_preview)}
          className="p-0.5 rounded hover:bg-white/10 text-slate-500 hover:text-emerald-400"
          title={lesson.is_free_preview ? "Remove free preview" : "Set as free preview"}
        >
          {lesson.is_free_preview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
        </button>
        <button
          onClick={onDelete}
          className="p-0.5 rounded hover:bg-white/10 text-slate-500 hover:text-red-400"
          title="Delete lesson"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
