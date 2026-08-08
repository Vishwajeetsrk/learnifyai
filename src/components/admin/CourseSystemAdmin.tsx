import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { RichLessonContent } from "@/components/course/RichLessonContent";
import { ExerciseEditorSection } from "@/components/course/ExerciseEditorSection";
import {
  adminListCourses,
  adminGetCourse,
  adminCreateCourse,
  adminUpdateCourse,
  adminDeleteCourse,
  adminAddModule,
  adminUpdateModule,
  adminDeleteModule,
  adminAddLesson,
  adminUpdateLesson,
  adminDeleteLesson,
  adminCourseAnalytics,
} from "@/lib/admin-courses.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  GraduationCap,
  Plus,
  Search,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Users,
  BookOpen,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Save,
  X,
  Loader2,
  Clock,
  Award,
  TrendingUp,
  Settings,
  PencilRuler,
} from "lucide-react";

type CourseRow = any;
type ModuleRow = any;
type LessonRow = any;

const CATEGORIES = [
  "General",
  "Full Stack Development",
  "Python",
  "AI & Prompt Engineering",
  "Data Science",
  "Cyber Security",
  "UI/UX Design",
  "Digital Marketing",
  "Resume Builder",
  "Interview Preparation",
  "Career Roadmaps",
  "Academic & CS Fundamentals",
  "Business & Startups",
];

const LEVELS = ["beginner", "intermediate", "advanced"] as const;

export function CourseSystemAdmin() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"courses" | "analytics">("courses");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const doList = useServerFn(adminListCourses);
  const doGet = useServerFn(adminGetCourse);
  const doCreate = useServerFn(adminCreateCourse);
  const doUpdate = useServerFn(adminUpdateCourse);
  const doDelete = useServerFn(adminDeleteCourse);
  const doAnalytics = useServerFn(adminCourseAnalytics);

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const r = await doList();
      return (r ?? []) as CourseRow[];
    },
  });

  const { data: analytics = [] } = useQuery({
    queryKey: ["admin-course-analytics"],
    queryFn: async () => {
      const r = await doAnalytics();
      return (r ?? []) as any[];
    },
    enabled: tab === "analytics",
  });

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return courses.filter(
      (c) =>
        !needle ||
        c.title?.toLowerCase().includes(needle) ||
        c.category?.toLowerCase().includes(needle) ||
        c.instructor?.toLowerCase().includes(needle),
    );
  }, [courses, search]);

  const handleCreate = async (form: any) => {
    try {
      await doCreate({ data: form });
      toast.success("Course created");
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      setShowEditor(false);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await doDelete({ data: { courseId: deleteId } });
      toast.success("Course deleted");
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
    } catch (e: any) {
      toast.error(e.message);
    }
    setDeleteId(null);
  };

  const stats = useMemo(() => {
    const total = courses.length;
    const published = courses.filter((c) => c.published).length;
    const totalEnrolled = courses.reduce(
      (s, c) => s + (Array.isArray(c.enrollments) ? c.enrollments.length : 0),
      0,
    );
    return { total, published, draft: total - published, totalEnrolled };
  }, [courses]);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary font-medium">
            Administration
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-display font-semibold tracking-tight flex items-center gap-2">
            <GraduationCap className="h-7 w-7" /> Course System
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage courses, modules, lessons, and track enrollments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={tab === "courses" ? "default" : "outline"}
            onClick={() => setTab("courses")}
          >
            <BookOpen className="h-4 w-4 mr-1" /> Courses
          </Button>
          <Button
            size="sm"
            variant={tab === "analytics" ? "default" : "outline"}
            onClick={() => setTab("analytics")}
          >
            <BarChart3 className="h-4 w-4 mr-1" /> Analytics
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {[
          { label: "Total Courses", value: stats.total, icon: BookOpen, color: "text-blue-500" },
          { label: "Published", value: stats.published, icon: Eye, color: "text-green-500" },
          { label: "Drafts", value: stats.draft, icon: EyeOff, color: "text-amber-500" },
          {
            label: "Total Enrolled",
            value: stats.totalEnrolled,
            icon: Users,
            color: "text-violet-500",
          },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${s.color}`}>
                <s.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tab === "courses" ? (
        <>
          {/* Toolbar */}
          <div className="flex items-center gap-3 mt-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="pl-9"
              />
            </div>
            <Button onClick={() => setShowEditor(true)}>
              <Plus className="h-4 w-4 mr-1" /> New Course
            </Button>
          </div>

          {/* Courses Table */}
          <div className="mt-4 rounded-xl border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 text-left">
                    <th className="px-4 py-3 font-medium">Course</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Level</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Enrolled</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" /> Loading courses...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                        No courses found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((c) => (
                      <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <div className="font-medium">{c.title}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                            {c.description}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary">{c.category}</Badge>
                        </td>
                        <td className="px-4 py-3 capitalize">{c.level}</td>
                        <td className="px-4 py-3 font-medium">
                          {Number(c.price_inr) === 0 ? "Free" : `₹${c.price_inr}`}
                        </td>
                        <td className="px-4 py-3">
                          {Array.isArray(c.enrollments) ? c.enrollments.length : 0}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={c.published ? "default" : "outline"}>
                            {c.published ? "Published" : "Draft"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() =>
                                setSelectedCourseId(selectedCourseId === c.id ? null : c.id)
                              }
                              title="View details"
                            >
                              {selectedCourseId === c.id ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => {
                                setShowEditor(true);
                                setSelectedCourseId(c.id);
                              }}
                              title="Edit metadata"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Link to="/course-builder/$courseId" params={{ courseId: c.id }}>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/30"
                                title="Open Block Editor"
                              >
                                <PencilRuler className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-red-500 hover:text-red-600"
                              onClick={() => setDeleteId(c.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expanded Course Details */}
          {selectedCourseId && <CourseDetail courseId={selectedCourseId} doGet={doGet} />}
        </>
      ) : (
        /* Analytics Tab */
        <div className="mt-4 rounded-xl border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="px-4 py-3 font-medium">Course</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Lessons</th>
                  <th className="px-4 py-3 font-medium">Enrolled</th>
                  <th className="px-4 py-3 font-medium">Completed</th>
                  <th className="px-4 py-3 font-medium">Completion %</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {analytics.map((c: any) => {
                  const compRate =
                    c.enrolled > 0 ? Math.round((c.completed / c.enrolled) * 100) : 0;
                  return (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{c.title}</td>
                      <td className="px-4 py-3">
                        <Badge variant={c.published ? "default" : "outline"}>
                          {c.published ? "Published" : "Draft"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">{c.totalLessons}</td>
                      <td className="px-4 py-3">{c.enrolled}</td>
                      <td className="px-4 py-3">{c.completed}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${compRate}%` }}
                            />
                          </div>
                          <span className="text-xs">{compRate}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Course Editor Dialog */}
      {showEditor && (
        <CourseEditor
          courseId={selectedCourseId}
          onClose={() => {
            setShowEditor(false);
            setSelectedCourseId(null);
          }}
          onCreate={handleCreate}
          doGet={doGet}
        />
      )}

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete this course and all its modules, lessons, and enrollments.
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ─── Lesson Editor Dialog ─── */
function LessonEditor({
  lesson,
  onClose,
  doUpdate,
}: {
  lesson: LessonRow;
  onClose: () => void;
  doUpdate: any;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: lesson.title ?? "",
    description: lesson.description ?? "",
    video_url: lesson.video_url ?? "",
    duration_minutes: lesson.duration_minutes ?? 0,
    is_preview: lesson.is_preview ?? false,
    content_md: lesson.content_md ?? "",
    content_translations: JSON.stringify(lesson.content_translations ?? {}, null, 2),
  });
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    let translations: Record<string, string> = {};
    if (form.content_translations.trim()) {
      try {
        translations = JSON.parse(form.content_translations);
      } catch {
        toast.error("Translations must be valid JSON (an object of { \"hi\": \"...\" })");
        return;
      }
    }
    setSaving(true);
    try {
      await doUpdate({
        data: {
          lessonId: lesson.id,
          title: form.title,
          description: form.description,
          video_url: form.video_url,
          duration_minutes: Number(form.duration_minutes) || 0,
          is_preview: form.is_preview,
          content_md: form.content_md,
          content_translations: translations,
        },
      });
      toast.success("Lesson updated");
      qc.invalidateQueries({ queryKey: ["admin-course-detail", lesson.course_id] });
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    }
    setSaving(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lesson</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Title *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Lesson title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Video URL</label>
              <Input
                value={form.video_url}
                onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_preview}
                onChange={(e) => setForm({ ...form, is_preview: e.target.checked })}
                className="rounded"
              />
              <label className="text-sm font-medium">Preview (free)</label>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Duration (min)</label>
              <Input
                type="number"
                className="w-24 h-8"
                value={form.duration_minutes}
                onChange={(e) =>
                  setForm({ ...form, duration_minutes: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Content (Markdown + rich blocks)</label>
            <Textarea
              value={form.content_md}
              onChange={(e) => setForm({ ...form, content_md: e.target.value })}
              rows={14}
              className="font-mono text-xs leading-relaxed"
              placeholder={"Supports GFM tables, callouts ([!tip], [!warning], [!info], [!note]), code fences with language, and special blocks:\n\n```quiz\nQ: What is...\nA. Option 1\nB. Option 2\nCorrect: A\nExplain: ...\n```\n\n```flashcards\nQuestion | Answer\n```\n\n```diagram\ntext diagram\n```"}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Special blocks: <code>```quiz</code> (Q:, A.-D., Correct:, Explain:),{" "}
              <code>```flashcards</code> (one <code>front | back</code> per line),{" "}
              <code>```diagram</code> (terminal style), callouts <code>[!tip]</code> etc.
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Translations (JSON)</label>
            <Textarea
              value={form.content_translations}
              onChange={(e) => setForm({ ...form, content_translations: e.target.value })}
              rows={5}
              className="font-mono text-xs leading-relaxed"
              placeholder={'{ "hi": "Hindi content...", "es": "Spanish content..." }'}
            />
          </div>
          <ExerciseEditorSection lessonId={lesson.id} />
          {showPreview && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                Live preview
              </div>
              <RichLessonContent content={form.content_md} />
            </div>
          )}
        </div>
        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => setShowPreview((v) => !v)}
            disabled={saving}
          >
            <Eye className="h-4 w-4 mr-1" />
            {showPreview ? "Hide Preview" : "Preview"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !form.title}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Save className="h-4 w-4 mr-1" />
            )}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Course Detail (Modules + Lessons) ─── */
function CourseDetail({ courseId, doGet }: { courseId: string; doGet: any }) {
  const qc = useQueryClient();
  const doAddModule = useServerFn(adminAddModule);
  const doUpdateModule = useServerFn(adminUpdateModule);
  const doDeleteModule = useServerFn(adminDeleteModule);
  const doAddLesson = useServerFn(adminAddLesson);
  const doUpdateLesson = useServerFn(adminUpdateLesson);
  const doDeleteLesson = useServerFn(adminDeleteLesson);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-course-detail", courseId],
    queryFn: async () => {
      const r = await doGet({ data: { courseId } });
      return r as any;
    },
  });

  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [newLessonModuleId, setNewLessonModuleId] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [editingLesson, setEditingLesson] = useState<LessonRow | null>(null);

  if (isLoading) {
    return (
      <Card className="mt-4">
        <CardContent className="p-8 text-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" /> Loading course details...
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const { course, modules, lessons, enrollments } = data;

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return;
    try {
      await doAddModule({ data: { courseId, title: newModuleTitle.trim() } });
      toast.success("Module added");
      qc.invalidateQueries({ queryKey: ["admin-course-detail", courseId] });
      setNewModuleTitle("");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleAddLesson = async (moduleId: string) => {
    if (!newLessonTitle.trim()) return;
    try {
      await doAddLesson({ data: { courseId, moduleId, title: newLessonTitle.trim() } });
      toast.success("Lesson added");
      qc.invalidateQueries({ queryKey: ["admin-course-detail", courseId] });
      setNewLessonTitle("");
      setNewLessonModuleId(null);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    try {
      await doDeleteModule({ data: { moduleId } });
      toast.success("Module deleted");
      qc.invalidateQueries({ queryKey: ["admin-course-detail", courseId] });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      await doDeleteLesson({ data: { lessonId } });
      toast.success("Lesson deleted");
      qc.invalidateQueries({ queryKey: ["admin-course-detail", courseId] });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const moduleMap = new Map<string, ModuleRow[]>();
  (modules as ModuleRow[]).forEach((m) => {
    if (!moduleMap.has(m.course_id)) moduleMap.set(m.course_id, []);
    moduleMap.get(m.course_id)!.push(m);
  });

  const lessonMap = new Map<string, LessonRow[]>();
  (lessons as LessonRow[]).forEach((l) => {
    if (!lessonMap.has(l.module_id)) lessonMap.set(l.module_id, []);
    lessonMap.get(l.module_id)!.push(l);
  });

  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <p className="text-sm text-muted-foreground">
              {modules.length} modules · {lessons.length} lessons · {enrollments.length} enrolled
            </p>
          </div>
          <Badge variant={course.published ? "default" : "outline"}>
            {course.published ? "Published" : "Draft"}
          </Badge>
        </div>

        {/* Modules List */}
        <div className="space-y-3">
          {(moduleMap.get(courseId) ?? (modules as ModuleRow[]))
            .sort((a, b) => a.order_index - b.order_index)
            .map((mod) => {
              const modLessons = lessonMap.get(mod.id) ?? [];
              const isExpanded = expandedModules.has(mod.id);
              return (
                <div key={mod.id} className="rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-2 px-4 py-3">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 shrink-0"
                      onClick={() => toggleModule(mod.id)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{mod.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {modLessons.length} lessons
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() =>
                        setNewLessonModuleId(newLessonModuleId === mod.id ? null : mod.id)
                      }
                      title="Add lesson"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-red-500"
                      onClick={() => handleDeleteModule(mod.id)}
                      title="Delete module"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-3 space-y-2">
                      {modLessons
                        .sort((a, b) => a.order_index - b.order_index)
                        .map((les) => (
                          <div
                            key={les.id}
                            className="flex items-center gap-2 pl-8 py-2 rounded-md bg-background/50"
                          >
                            <BookOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <button
                              className="text-sm flex-1 text-left hover:text-primary truncate"
                              title="Edit lesson"
                              onClick={() => setEditingLesson(les)}
                            >
                              {les.title}
                            </button>
                            <span className="text-xs text-muted-foreground">
                              {les.duration_minutes}m
                            </span>
                            {les.is_preview && (
                              <Badge variant="outline" className="text-[10px]">
                                Preview
                              </Badge>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-5 w-5"
                              onClick={() => setEditingLesson(les)}
                              title="Edit lesson"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-5 w-5 text-red-500"
                              onClick={() => handleDeleteLesson(les.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}

                      {newLessonModuleId === mod.id && (
                        <div className="flex items-center gap-2 pl-8">
                          <Input
                            value={newLessonTitle}
                            onChange={(e) => setNewLessonTitle(e.target.value)}
                            placeholder="Lesson title..."
                            className="h-8 text-sm"
                            onKeyDown={(e) => e.key === "Enter" && handleAddLesson(mod.id)}
                          />
                          <Button size="sm" className="h-8" onClick={() => handleAddLesson(mod.id)}>
                            <Save className="h-3 w-3 mr-1" /> Add
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8"
                            onClick={() => {
                              setNewLessonModuleId(null);
                              setNewLessonTitle("");
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

          {/* Add Module */}
          <div className="flex items-center gap-2 mt-2">
            <Input
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              placeholder="New module title..."
              className="h-8 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleAddModule()}
            />
            <Button size="sm" className="h-8" onClick={handleAddModule}>
              <Plus className="h-3 w-3 mr-1" /> Module
            </Button>
          </div>
        </div>
      </CardContent>
      {editingLesson && (
        <LessonEditor
          lesson={editingLesson}
          onClose={() => setEditingLesson(null)}
          doUpdate={doUpdateLesson}
        />
      )}
    </Card>
  );
}

/* ─── Course Editor Dialog ─── */
function CourseEditor({
  courseId,
  onClose,
  onCreate,
  doGet,
}: {
  courseId: string | null;
  onClose: () => void;
  onCreate: (form: any) => void;
  doGet: any;
}) {
  const qc = useQueryClient();
  const doUpdate = useServerFn(adminUpdateCourse);

  const isEdit = !!courseId && courseId !== "new";

  const { data: existing } = useQuery({
    queryKey: ["admin-course-edit", courseId],
    queryFn: async () => {
      if (!isEdit) return null;
      const r = await doGet({ data: { courseId } });
      return (r as any)?.course ?? null;
    },
    enabled: isEdit,
  });

  const [form, setForm] = useState({
    title: existing?.title ?? "",
    slug: existing?.slug ?? "",
    description: existing?.description ?? "",
    category: existing?.category ?? "General",
    level: existing?.level ?? "beginner",
    price_inr: existing?.price_inr ?? 0,
    instructor: existing?.instructor ?? "Learnify AI",
    cover_url: existing?.cover_url ?? "",
    duration_minutes: existing?.duration_minutes ?? 0,
    published: existing?.published ?? false,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isEdit) {
        await doUpdate({ data: { courseId: courseId!, ...form } });
        toast.success("Course updated");
        qc.invalidateQueries({ queryKey: ["admin-courses"] });
        qc.invalidateQueries({ queryKey: ["admin-course-detail", courseId] });
      } else {
        await onCreate(form);
      }
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    }
    setSaving(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Course" : "Create Course"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium">Title *</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Course title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Slug *</label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="course-slug"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Course description"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Level</label>
              <Select value={form.level} onValueChange={(v: any) => setForm({ ...form, level: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Price (INR)</label>
              <Input
                type="number"
                value={form.price_inr}
                onChange={(e) => setForm({ ...form, price_inr: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Duration (min)</label>
              <Input
                type="number"
                value={form.duration_minutes}
                onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Instructor</label>
              <Input
                value={form.instructor}
                onChange={(e) => setForm({ ...form, instructor: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Cover URL</label>
              <Input
                value={form.cover_url}
                onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="rounded"
            />
            <label className="text-sm font-medium">Published</label>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !form.title || !form.slug}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Save className="h-4 w-4 mr-1" />
            )}
            {isEdit ? "Save Changes" : "Create Course"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
