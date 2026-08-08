/**
 * Course Builder — Full-page no-code course editor
 * Route: /_authenticated/course-builder.$courseId
 * Access: Creators (own courses) + Admins (all courses)
 */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useCallback, useEffect } from "react";
import {
  ArrowLeft, Eye, Globe, GlobeLock, Sparkles, Loader2,
  Check, AlertTriangle, BookOpen, PanelLeftClose, PanelLeftOpen,
  Settings2, Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CurriculumSidebar } from "@/components/course-builder/CurriculumSidebar";
import { LessonBlockEditor } from "@/components/course-builder/LessonBlockEditor";
import { CourseSettingsPanel } from "@/components/course-builder/CourseSettingsPanel";
import { useAuth } from "@/hooks/use-auth";
import {
  getCourseForEditor,
  updateCourseSettings,
  updateCourseCover,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
  createModule,
  updateModule,
  deleteModule,
  reorderModules,
  saveLessonBlocks,
  getLessonBlocks,
} from "@/lib/lesson-blocks.functions";
import type {
  CurriculumModule,
  CurriculumLesson,
} from "@/components/course-builder/CurriculumSidebar";
import type { ContentBlock } from "@/components/course/BlockRenderer";

// ────────────────────────────────────────────────────────────
// ROUTE
// ────────────────────────────────────────────────────────────

export const Route = createFileRoute("/_authenticated/course-builder/$courseId")({
  head: () => ({ meta: [{ title: "Course Builder — Learnify AI" }] }),
  component: CourseBuilderPage,
});

// ────────────────────────────────────────────────────────────
// PAGE
// ────────────────────────────────────────────────────────────

function CourseBuilderPage() {
  const { courseId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  // Server fn hooks
  const $getCourse = useServerFn(getCourseForEditor);
  const $updateSettings = useServerFn(updateCourseSettings);
  const $updateCover = useServerFn(updateCourseCover);
  const $createLesson = useServerFn(createLesson);
  const $updateLesson = useServerFn(updateLesson);
  const $deleteLesson = useServerFn(deleteLesson);
  const $reorderLessons = useServerFn(reorderLessons);
  const $createModule = useServerFn(createModule);
  const $updateModule = useServerFn(updateModule);
  const $deleteModule = useServerFn(deleteModule);
  const $reorderModules = useServerFn(reorderModules);
  const $saveBlocks = useServerFn(saveLessonBlocks);
  const $getBlocks = useServerFn(getLessonBlocks);

  // State
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedPanel, setSelectedPanel] = useState<"lesson" | "settings">("settings");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [localModules, setLocalModules] = useState<CurriculumModule[]>([]);
  const [localCourse, setLocalCourse] = useState<any>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // Fetch course + curriculum
  const { data, isLoading, error } = useQuery({
    queryKey: ["course-editor", courseId],
    queryFn: () => $getCourse({ data: { courseId } }),
    enabled: !!courseId,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (data) {
      setLocalModules(data.modules as CurriculumModule[]);
      setLocalCourse(data.course);
    }
  }, [data]);

  // Fetch blocks for selected lesson
  const { data: blocksData, isLoading: blocksLoading } = useQuery({
    queryKey: ["lesson-blocks", selectedLessonId],
    queryFn: () => $getBlocks({ data: { lessonId: selectedLessonId! } }),
    enabled: !!selectedLessonId,
    staleTime: 10_000,
  });

  // ── Curriculum mutations ──

  const handleAddModule = useCallback(async () => {
    const idx = localModules.length;
    try {
      const res = await $createModule({ data: { courseId, title: `Module ${idx + 1}`, orderIndex: idx } });
      setLocalModules((prev) => [...prev, {
        id: res.module.id,
        title: res.module.title,
        description: "",
        order_index: idx,
        lessons: [],
      }]);
      toast("Module added");
    } catch (e: any) {
      toast.error(e.message);
    }
  }, [courseId, localModules.length, $createModule]);

  const handleAddLesson = useCallback(async (moduleId: string) => {
    const mod = localModules.find((m) => m.id === moduleId);
    if (!mod) return;
    const idx = mod.lessons.length;
    try {
      const res = await $createLesson({ data: { courseId, moduleId, title: "New Lesson", orderIndex: idx } });
      setLocalModules((prev) => prev.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: [...m.lessons, {
              id: (res.lesson as any).id,
              title: (res.lesson as any).title,
              duration_minutes: 10,
              is_preview: false,
              is_free_preview: false,
              video_url: null,
              content_format: "blocks",
              order_index: idx,
            }] }
          : m,
      ));
      setSelectedLessonId((res.lesson as any).id);
      setSelectedPanel("lesson");
      toast("Lesson added");
    } catch (e: any) {
      toast.error(e.message);
    }
  }, [courseId, localModules, $createLesson]);

  const handleDeleteModule = useCallback(async (moduleId: string) => {
    if (!confirm("Delete this module and all its lessons?")) return;
    try {
      await $deleteModule({ data: { moduleId } });
      setLocalModules((prev) => prev.filter((m) => m.id !== moduleId));
      toast("Module deleted");
    } catch (e: any) {
      toast.error(e.message);
    }
  }, [$deleteModule]);

  const handleDeleteLesson = useCallback(async (lessonId: string) => {
    if (!confirm("Delete this lesson and all its content?")) return;
    try {
      await $deleteLesson({ data: { lessonId } });
      setLocalModules((prev) => prev.map((m) => ({
        ...m,
        lessons: m.lessons.filter((l) => l.id !== lessonId),
      })));
      if (selectedLessonId === lessonId) {
        setSelectedLessonId(null);
        setSelectedPanel("settings");
      }
      toast("Lesson deleted");
    } catch (e: any) {
      toast.error(e.message);
    }
  }, [selectedLessonId, $deleteLesson]);

  const handleRenameModule = useCallback(async (moduleId: string, title: string) => {
    await $updateModule({ data: { moduleId, title } });
    setLocalModules((prev) => prev.map((m) => m.id === moduleId ? { ...m, title } : m));
  }, [$updateModule]);

  const handleRenameLesson = useCallback(async (lessonId: string, title: string) => {
    await $updateLesson({ data: { lessonId, title } });
    setLocalModules((prev) => prev.map((m) => ({
      ...m,
      lessons: m.lessons.map((l) => l.id === lessonId ? { ...l, title } : l),
    })));
  }, [$updateLesson]);

  const handleToggleFreePreview = useCallback(async (lessonId: string, val: boolean) => {
    await $updateLesson({ data: { lessonId, isFreePreview: val } });
    setLocalModules((prev) => prev.map((m) => ({
      ...m,
      lessons: m.lessons.map((l) => l.id === lessonId ? { ...l, is_free_preview: val } : l),
    })));
  }, [$updateLesson]);

  const handleReorderModules = useCallback(async (orderedIds: string[]) => {
    const reordered = orderedIds
      .map((id, i) => {
        const m = localModules.find((m) => m.id === id)!;
        return { ...m, order_index: i };
      })
      .sort((a, b) => a.order_index - b.order_index);
    setLocalModules(reordered);
    await $reorderModules({ data: { courseId, orderedIds } });
  }, [courseId, localModules, $reorderModules]);

  const handleReorderLessons = useCallback(async (moduleId: string, orderedIds: string[]) => {
    setLocalModules((prev) => prev.map((m) => {
      if (m.id !== moduleId) return m;
      const reordered = orderedIds
        .map((id, i) => {
          const l = m.lessons.find((l) => l.id === id)!;
          return { ...l, order_index: i };
        })
        .sort((a, b) => a.order_index - b.order_index);
      return { ...m, lessons: reordered };
    }));
    await $reorderLessons({ data: { moduleId, orderedIds } });
  }, [$reorderLessons]);

  // ── Block save ──

  const handleSaveBlocks = useCallback(async (blocks: ContentBlock[]) => {
    if (!selectedLessonId) return;
    await $saveBlocks({ data: { lessonId: selectedLessonId, blocks } });
    qc.invalidateQueries({ queryKey: ["lesson-blocks", selectedLessonId] });
  }, [selectedLessonId, $saveBlocks, qc]);

  // ── Course settings ──

  const handleSettingsUpdate = useCallback(async (patch: Record<string, any>) => {
    setLocalCourse((prev: any) => ({ ...prev, ...patch }));
    setSavingSettings(true);
    try {
      await $updateSettings({
        data: {
          courseId,
          title: patch.title,
          description: patch.description,
          category: patch.category,
          level: patch.level,
          priceInr: patch.price_inr,
          published: patch.published,
          instructor: patch.instructor,
          language: patch.language,
          teaserVideoUrl: patch.teaser_video_url,
          requirements: patch.requirements,
          outcomes: patch.outcomes,
          targetAudience: patch.target_audience,
          certificateEnabled: patch.certificate_enabled,
          completionThreshold: patch.completion_threshold,
        },
      });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSavingSettings(false);
    }
  }, [courseId, $updateSettings]);

  const handlePublishToggle = useCallback(async (published: boolean) => {
    await handleSettingsUpdate({ published });
    toast(
      published ? "Course published! 🎉" : "Course moved to draft",
    );
    qc.invalidateQueries({ queryKey: ["course-editor", courseId] });
  }, [handleSettingsUpdate, courseId, qc]);

  // ── Selected lesson info ──

  const selectedLesson = localModules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === selectedLessonId);

  // ── Loading / error states ──

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-[#0f0f16]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading course editor...</p>
        </div>
      </div>
    );
  }

  if (error || !localCourse) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-[#0f0f16]">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-white font-medium mb-1">Course not found</p>
          <p className="text-slate-400 text-sm mb-4">You don't have access to this course or it doesn't exist.</p>
          <Button variant="outline" onClick={() => navigate({ to: "/creator" })}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Creator Hub
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#0f0f16]">
      {/* ─── TOPBAR ─── */}
      <header className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/8 bg-[#0f0f16] z-20 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Back */}
          <Link
            to="/creator"
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors group flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Creator Hub</span>
          </Link>

          <div className="w-px h-4 bg-white/10 flex-shrink-0 hidden sm:block" />

          {/* Course title */}
          <h1 className="text-xs sm:text-sm font-semibold text-white truncate min-w-0">
            {localCourse.title}
          </h1>

          {/* Status */}
          <Badge
            variant="outline"
            className={localCourse.published
              ? "border-emerald-500/40 text-emerald-400 text-[10px] sm:text-xs flex-shrink-0"
              : "border-slate-600 text-slate-400 text-[10px] sm:text-xs flex-shrink-0"}
          >
            {localCourse.published ? "Live" : "Draft"}
          </Badge>

          {savingSettings && (
            <span className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1 flex-shrink-0">
              <Loader2 className="w-3 h-3 animate-spin" /> <span className="hidden sm:inline">Saving...</span>
            </span>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Preview */}
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-slate-300 hover:border-white/30 text-xs h-7 sm:h-8 px-2 sm:px-3"
            onClick={() => window.open(`/courses/${localCourse.slug}`, "_blank")}
          >
            <Eye className="w-3.5 h-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline">Preview</span>
          </Button>

          {/* Publish toggle */}
          <Button
            size="sm"
            className={localCourse.published
              ? "bg-slate-700 hover:bg-slate-600 text-white text-xs h-7 sm:h-8 px-2 sm:px-3"
              : "bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-7 sm:h-8 px-2 sm:px-3"}
            onClick={() => handlePublishToggle(!localCourse.published)}
          >
            {localCourse.published ? (
              <><GlobeLock className="w-3.5 h-3.5 sm:mr-1.5" /><span className="hidden sm:inline">Unpublish</span></>
            ) : (
              <><Globe className="w-3.5 h-3.5 sm:mr-1.5" /><span className="hidden sm:inline">Publish</span></>
            )}
          </Button>

          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-white/5"
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen
              ? <PanelLeftClose className="w-4 h-4 sm:w-5 sm:h-5" />
              : <PanelLeftOpen className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </header>

      {/* ─── MAIN LAYOUT ─── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`
            transition-all duration-200 overflow-hidden border-r border-white/8 z-30
            fixed md:relative inset-y-0 left-0 bg-[#131320]
            ${sidebarOpen ? "w-72 min-w-[280px]" : "w-0 min-w-0 border-r-0"}
          `}
        >
          {sidebarOpen && (
            <CurriculumSidebar
              modules={localModules}
              selectedLessonId={selectedLessonId}
              selectedPanel={selectedPanel}
              onSelectLesson={(id) => {
                setSelectedLessonId(id);
                setSelectedPanel("lesson");
                // On mobile, close sidebar after selecting lesson
                if (window.innerWidth < 768) setSidebarOpen(false);
              }}
              onSelectSettings={() => {
                setSelectedPanel("settings");
                setSelectedLessonId(null);
                if (window.innerWidth < 768) setSidebarOpen(false);
              }}
              onAddModule={handleAddModule}
              onAddLesson={handleAddLesson}
              onDeleteModule={handleDeleteModule}
              onDeleteLesson={handleDeleteLesson}
              onRenameModule={handleRenameModule}
              onRenameLesson={handleRenameLesson}
              onToggleFreePreview={handleToggleFreePreview}
              onReorderModules={handleReorderModules}
              onReorderLessons={handleReorderLessons}
            />
          )}
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {selectedPanel === "settings" ? (
            /* Course settings */
            <div className="flex-1 overflow-y-auto">
              <CourseSettingsPanel
                course={localCourse}
                onUpdate={(patch) => {
                  setLocalCourse((prev: any) => ({ ...prev, ...patch }));
                  // Debounced save — settings panel calls this on every field change
                  handleSettingsUpdate(patch);
                }}
                onPublishToggle={handlePublishToggle}
                onCoverChange={async (url) => {
                  setLocalCourse((prev: any) => ({ ...prev, cover_url: url }));
                  await $updateCover({ data: { courseId, coverUrl: url } });
                }}
                slug={localCourse.slug}
              />
            </div>
          ) : selectedLessonId && selectedLesson ? (
            /* Lesson block editor */
            <div className="flex-1 overflow-hidden flex flex-col">
              {blocksLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-400 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">Loading lesson content...</p>
                  </div>
                </div>
              ) : (
                <LessonBlockEditor
                  lessonId={selectedLessonId}
                  lessonTitle={selectedLesson.title}
                  initialBlocks={(blocksData?.blocks ?? []) as ContentBlock[]}
                  onSave={handleSaveBlocks}
                  onLessonTitleChange={(title) => handleRenameLesson(selectedLessonId, title)}
                  autoSave
                  className="flex-1"
                />
              )}
            </div>
          ) : (
            /* Empty state */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-indigo-950/50 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-7 h-7 text-indigo-400" />
                </div>
                <h3 className="text-white font-semibold font-display mb-2">Select a Lesson to Edit</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Choose a lesson from the curriculum sidebar to start editing its content, or add a new lesson.
                </p>
                <div className="mt-4 flex items-center gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPanel("settings")}
                    className="border-white/10 text-slate-300 hover:border-indigo-500 text-xs"
                  >
                    <Settings2 className="w-3.5 h-3.5 mr-1.5" />
                    Course Settings
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddModule}
                    className="bg-indigo-600 hover:bg-indigo-500 text-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Add First Module
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
