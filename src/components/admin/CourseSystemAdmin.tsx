import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useLocation, useNavigate } from "@tanstack/react-router";
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
import {
  useAdminDraft,
  AutosaveStatusBadge,
  DraftRecoveryBanner,
} from "@/lib/admin-editor-workspace";
import { CANONICAL_BRANDS, formatCourseDuration, getCanonicalBrand } from "@/lib/brand-registry";
import { CourseBrandLogo } from "@/components/courses/CourseBrandLogo";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
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

  const location = useLocation();
  const navigate = useNavigate();

  // URL state synchronization for ?edit=
  const searchParams = new URLSearchParams(location.search);
  const editParam = searchParams.get("edit");

  useEffect(() => {
    if (editParam) {
      setSelectedCourseId(editParam === "new" ? null : editParam);
      setShowEditor(true);
    }
  }, [editParam]);

  const openEditor = (id: string | null) => {
    setSelectedCourseId(id);
    setShowEditor(true);
    navigate({
      search: (prev: any) => ({
        ...prev,
        edit: id || "new",
      }),
    } as any);
  };

  const closeEditor = () => {
    setShowEditor(false);
    navigate({
      search: (prev: any) => {
        const next = { ...prev };
        delete next.edit;
        return next;
      },
    } as any);
  };

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
      closeEditor();
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
                              title="Edit"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
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
                            <span className="text-sm flex-1">{les.title}</span>
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
  const [activeTab, setActiveTab] = useState<"general" | "curriculum" | "pricing" | "certificate">("general");
  const [saving, setSaving] = useState(false);

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

  const { data: certTemplates = [] } = useQuery({
    queryKey: ["certificate-templates-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("certificate_templates")
        .select("id, name, is_default")
        .order("name");
      return data ?? [];
    },
  });

  const initialValues = useMemo(() => {
    return {
      title: existing?.title ?? "",
      slug: existing?.slug ?? "",
      description: existing?.description ?? "",
      category: existing?.category ?? "General",
      level: (existing?.level as "beginner" | "intermediate" | "advanced") ?? "beginner",
      price_inr: existing?.price_inr ?? 0,
      instructor: existing?.instructor ?? "Learnify AI",
      cover_url: existing?.cover_url ?? "",
      duration_minutes: existing?.duration_minutes ?? 0,
      published: existing?.published ?? false,
      certificate_template_id: existing?.certificate_template_id ?? null,
      technology: existing?.technology ?? "",
    };
  }, [existing]);

  const {
    formData: form,
    updateField,
    status,
    lastSavedAt,
    saveDraftNow,
    clearDraft,
    restoreDraft,
    discardRecoverableDraft,
    hasRecoverableDraft,
    recoverableDraftDate,
    recoverableDraft,
  } = useAdminDraft<typeof initialValues>({
    module: "courses",
    recordId: courseId || "new",
    initialData: initialValues,
    getTitle: (d) => d?.title || "Untitled Course",
    onServerSave: async (draftData) => {
      if (!draftData.title?.trim() || !courseId || courseId === "new") return;
      await doUpdate({
        data: {
          courseId,
          title: draftData.title.trim(),
          slug: draftData.slug?.trim() || draftData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: draftData.description ?? "",
          category: draftData.category ?? "General",
          level: draftData.level ?? "beginner",
          price_inr: Number(draftData.price_inr) || 0,
          instructor: draftData.instructor ?? "Learnify AI",
          cover_url: draftData.cover_url ?? "",
          duration_minutes: Number(draftData.duration_minutes) || 0,
          published: !!draftData.published,
          certificate_template_id: draftData.certificate_template_id || null,
          technology: draftData.technology || null,
        },
      });
    },
    enabled: true,
  });

  const durationInfo = useMemo(() => {
    return formatCourseDuration(Number(form.duration_minutes) || 0);
  }, [form.duration_minutes]);

  const handleSave = async () => {
    if (!form.title?.trim() || !form.slug?.trim()) {
      toast.error("Title and slug are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        description: form.description ?? "",
        category: form.category ?? "General",
        level: form.level ?? "beginner",
        price_inr: Number(form.price_inr) || 0,
        instructor: form.instructor ?? "Learnify AI",
        cover_url: form.cover_url ?? "",
        duration_minutes: Number(form.duration_minutes) || 0,
        published: !!form.published,
        certificate_template_id: form.certificate_template_id || null,
        technology: form.technology || null,
      };

      if (isEdit) {
        await doUpdate({ data: { courseId: courseId!, ...payload } });
        toast.success("Course updated");
        qc.invalidateQueries({ queryKey: ["admin-courses"] });
        qc.invalidateQueries({ queryKey: ["admin-course-detail", courseId] });
      } else {
        await onCreate(payload);
      }
      await clearDraft();
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-3 border-b bg-card">
          <div className="flex items-center justify-between pr-4">
            <div>
              <DialogTitle className="text-xl font-bold">
                {isEdit ? "Edit Course" : "Create New Course"}
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Autosaved continuously. Switch tabs freely without losing changes.
              </p>
            </div>
            <AutosaveStatusBadge status={status} lastSavedAt={lastSavedAt} />
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <DraftRecoveryBanner
            hasRecoverableDraft={hasRecoverableDraft}
            recoverableDraftDate={recoverableDraftDate}
            onRestore={restoreDraft}
            onDiscard={discardRecoverableDraft}
            currentData={form}
            draftData={recoverableDraft?.data}
            moduleName="Course"
          />

          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="general" className="text-xs">General & Brand</TabsTrigger>
              <TabsTrigger value="curriculum" className="text-xs">Schedule</TabsTrigger>
              <TabsTrigger value="pricing" className="text-xs">Pricing & Access</TabsTrigger>
              <TabsTrigger value="certificate" className="text-xs">Certificate</TabsTrigger>
            </TabsList>

            {/* Tab: General & Brand */}
            <TabsContent value="general" className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={form.title}
                  onChange={(e) => {
                    updateField("title", e.target.value);
                    if (!isEdit && !form.slug) {
                      updateField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                  placeholder="e.g. Microsoft Excel & Sheets Mastery"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Slug *</label>
                  <Input
                    value={form.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                    placeholder="e.g. excel-mastery"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => updateField("category", v)}
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

              {/* Canonical Brand Selector */}
              <div>
                <label className="text-sm font-medium flex items-center justify-between">
                  <span>Canonical Technology / Software Brand</span>
                  {form.technology && (
                    <span className="text-xs text-primary font-semibold flex items-center gap-1.5">
                      <CourseBrandLogo brand={form.technology} size={16} />
                      {getCanonicalBrand(form.technology)?.canonicalName || form.technology}
                    </span>
                  )}
                </label>
                <Select
                  value={form.technology || "none"}
                  onValueChange={(v) => updateField("technology", v === "none" ? "" : v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select official software / brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Generic / None</SelectItem>
                    {CANONICAL_BRANDS.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        <div className="flex items-center gap-2">
                          <CourseBrandLogo brand={b.id} size={16} />
                          <span>{b.canonicalName}</span>
                          <span className="text-[10px] text-muted-foreground ml-1">({b.category})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Connects this course to canonical official brand vector marks across the marketplace.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Comprehensive course overview and syllabus highlights..."
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Cover Image URL</label>
                <Input
                  value={form.cover_url}
                  onChange={(e) => updateField("cover_url", e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </TabsContent>

            {/* Tab: Curriculum & Schedule */}
            <TabsContent value="curriculum" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Level</label>
                  <Select
                    value={form.level}
                    onValueChange={(v: any) => updateField("level", v)}
                  >
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
                  <label className="text-sm font-medium">Total Duration (minutes)</label>
                  <Input
                    type="number"
                    value={form.duration_minutes}
                    onChange={(e) => updateField("duration_minutes", Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Dynamic Duration Normalization Card */}
              <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-foreground">Normalized Marketplace Schedule</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {durationInfo.schedulePace}
                  </div>
                </div>
                <Badge variant="secondary" className="font-bold">
                  {durationInfo.totalDuration}
                </Badge>
              </div>

              <div>
                <label className="text-sm font-medium">Instructor</label>
                <Input
                  value={form.instructor}
                  onChange={(e) => updateField("instructor", e.target.value)}
                  placeholder="e.g. Learnify AI Faculty"
                />
              </div>
            </TabsContent>

            {/* Tab: Pricing & Access */}
            <TabsContent value="pricing" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Price (INR)</label>
                  <Input
                    type="number"
                    value={form.price_inr}
                    onChange={(e) => updateField("price_inr", Number(e.target.value))}
                    placeholder="0 for 100% Free"
                  />
                  <span className="text-[11px] text-muted-foreground">
                    {Number(form.price_inr) === 0 ? "Displayed as FREE to all students" : `₹${form.price_inr}`}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium">Visibility & Status</label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="course-published-checkbox"
                      checked={form.published}
                      onChange={(e) => updateField("published", e.target.checked)}
                      className="rounded h-4 w-4"
                    />
                    <label htmlFor="course-published-checkbox" className="text-sm font-medium cursor-pointer">
                      Published on Marketplace
                    </label>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab: Certificate */}
            <TabsContent value="certificate" className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Certificate Template</label>
                <Select
                  value={form.certificate_template_id || "default"}
                  onValueChange={(v) => updateField("certificate_template_id", v === "default" ? null : v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Auto-Assign Default Platform Template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Auto-Assign Default Platform Template</SelectItem>
                    {certTemplates.map((t: any) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name} {t.is_default ? "(Platform Default)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                  When a learner completes 100% of this course's lessons and quizzes, a verified credential with a unique tamper-proof verification ID will be generated using this template.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="p-4 border-t bg-muted/20 flex items-center justify-between sm:justify-between w-full">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              saveDraftNow();
              toast.success("Draft saved locally");
            }}
          >
            Save Draft
          </Button>
          <div className="flex items-center gap-2">
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
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
