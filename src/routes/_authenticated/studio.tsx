import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  Video,
  ShieldAlert,
  Search,
  ArrowLeft,
  Brain,
  Sparkles,
  Wand2,
  FileCheck2,
  ExternalLink,
  Paperclip,
  ClipboardList,
  Youtube,
  CheckCircle2,
  Copy,
  Link2,
  Upload,
  Image as ImageIcon,
  Code2,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { runAiTool } from "@/lib/ai-tools.functions";
import { suggestCourseCategory } from "@/lib/course.functions";
import {
  generateFullCourse,
  materializeCourse,
  autoCompleteCourse,
  generateLessonNotes,
} from "@/lib/course-builder.functions";
import {
  verifyYoutubeKey,
  startCourseEnrichment,
  listCourseEnrichmentRuns,
  searchYoutubeVideo,
} from "@/lib/youtube.functions";
import {
  generateCourseThumbnail,
  buildThumbnailPrompt,
  THUMBNAIL_STYLES,
  validateThumbnailImage,
  checkThumbnailPromptSafety,
  type SizeKey,
} from "@/lib/thumbnail.functions";
import { EnrichmentProgressDialog } from "@/components/EnrichmentProgressDialog";
import { ThumbnailEditor } from "@/components/ThumbnailEditor";
import { History, AlertTriangle, Scissors, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { buildCourseVideoEmbedUrl } from "@/lib/course-player";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/studio")({
  head: () => ({ meta: [{ title: "Creator Studio — Learnify AI" }] }),
  component: StudioPage,
  errorComponent: ({ error, reset }) => (
    <AppShell>
      <div className="max-w-lg mx-auto p-10 text-center space-y-3">
        <h2 className="text-lg font-display font-semibold">Studio hit a snag</h2>
        <p className="text-sm text-muted-foreground break-words">
          {error.message || "Something went wrong loading Studio."}
        </p>
        <div className="flex justify-center gap-2 pt-2">
          <Button onClick={() => reset()}>Try again</Button>
          <Button
            variant="outline"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            Go to dashboard
          </Button>
        </div>
      </div>
    </AppShell>
  ),
});

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

const courseUrlForSlug = (slug: string) => {
  const path = `/courses/${slug || "my-course"}`;
  return typeof window === "undefined" ? path : `${window.location.origin}${path}`;
};

const validateLessonVideoUrl = (value: string) => {
  const result = buildCourseVideoEmbedUrl(value);
  return result.ok ? null : result.message;
};

async function getCourseVideoIssues(courseId: string) {
  const { data, error } = await supabase
    .from("lessons")
    .select("id, title, video_url")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });
  if (error) throw error;
  return (data ?? [])
    .map((lesson) => ({ ...lesson, error: validateLessonVideoUrl(lesson.video_url ?? "") }))
    .filter((lesson) => lesson.error);
}

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  category: string;
  level: string;
  price_inr: number;
  instructor: string;
  duration_minutes: number;
  published: boolean;
  created_at: string;
};

type Lesson = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  duration_minutes: number;
  order_index: number;
  is_preview: boolean;
};

function StudioPage() {
  const { user, isAdmin, isCreator, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Course | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [manageLessonsFor, setManageLessonsFor] = useState<Course | null>(null);
  const [manageMcqFor, setManageMcqFor] = useState<Course | null>(null);
  const [manageAssignFor, setManageAssignFor] = useState<Course | null>(null);
  const [manageProjectsFor, setManageProjectsFor] = useState<Course | null>(null);
  const [reviewSubFor, setReviewSubFor] = useState<Course | null>(null);
  const [aiBuilderOpen, setAiBuilderOpen] = useState(false);
  const [autoCompleting, setAutoCompleting] = useState<string | null>(null);
  const [autoCompleteResult, setAutoCompleteResult] = useState<any>(null);
  const autoCompleteFn = useServerFn(autoCompleteCourse);

  const handleAutoComplete = async (courseId: string) => {
    setAutoCompleting(courseId);
    setAutoCompleteResult(null);
    try {
      const res: any = await autoCompleteFn({ data: { courseId } });
      setAutoCompleteResult(res);
      toast.success(`AI auto-complete done for ${res.courseTitle}`);
    } catch (e: any) {
      toast.error(e?.message ?? "Auto-complete failed");
    } finally {
      setAutoCompleting(null);
      qc.invalidateQueries({ queryKey: ["studio-courses"] });
    }
  };

  const coursesQuery = useQuery({
    enabled: isCreator,
    queryKey: ["studio-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Course[];
    },
  });

  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim();
    return (coursesQuery.data ?? []).filter(
      (c) =>
        !s ||
        c.title.toLowerCase().includes(s) ||
        c.category.toLowerCase().includes(s) ||
        c.instructor.toLowerCase().includes(s),
    );
  }, [coursesQuery.data, search]);

  if (!loading && !isCreator) {
    return (
      <AppShell>
        <div className="min-h-[60vh] grid place-items-center p-10 text-center">
          <div>
            <ShieldAlert className="h-10 w-10 mx-auto text-destructive" />
            <h1 className="mt-4 text-2xl font-display font-semibold">Studio is restricted</h1>
            <p className="mt-2 text-muted-foreground">
              Only approved creators and admins can publish courses.
            </p>
            <Button className="mt-6" onClick={() => navigate({ to: "/apply-creator" })}>
              Apply to Creator Program
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  async function deleteCourse() {
    if (!deletingCourse) return;
    const { error } = await supabase.from("courses").delete().eq("id", deletingCourse.id);
    if (error) return toast.error(error.message);
    toast.success("Course deleted");
    setDeletingCourse(null);
    qc.invalidateQueries({ queryKey: ["studio-courses"] });
  }

  async function togglePublish(c: Course) {
    if (!c.published) {
      try {
        const issues = await getCourseVideoIssues(c.id);
        if (issues.length) {
          setManageLessonsFor(c);
          return toast.error(
            `Fix ${issues.length} lesson video URL${issues.length === 1 ? "" : "s"} before publishing.`,
          );
        }
      } catch (e: any) {
        return toast.error(e?.message ?? "Could not validate lesson videos");
      }
    }
    const { error } = await supabase
      .from("courses")
      .update({ published: !c.published })
      .eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success(c.published ? "Unpublished" : "Published");
    qc.invalidateQueries({ queryKey: ["studio-courses"] });
  }

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-8 max-w-7xl">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-medium">
              Creator Studio
            </div>
            <h1 className="mt-1 text-2xl md:text-3xl font-display font-semibold">Courses</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Create, edit, and publish your catalog.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses…"
                className="pl-9 w-56"
              />
            </div>
            <Button variant="outline" onClick={() => setAiBuilderOpen(true)}>
              <Wand2 className="h-4 w-4" /> My AI Course
            </Button>
            <Button
              onClick={() => {
                setEditing(null);
                setCreating(true);
              }}
            >
              <Plus className="h-4 w-4" /> New course
            </Button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border bg-card shadow-card overflow-hidden">
          {coursesQuery.isLoading ? (
            <div className="p-10 grid place-items-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No courses yet. Create your first one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 md:px-6 py-3">Title</th>
                    <th className="text-left px-4 md:px-6 py-3">Category</th>
                    <th className="text-left px-4 md:px-6 py-3">Level</th>
                    <th className="text-right px-4 md:px-6 py-3">Price</th>
                    <th className="text-left px-4 md:px-6 py-3">Published</th>
                    <th className="text-left px-4 md:px-6 py-3">Created</th>
                    <th className="px-4 md:px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-t hover:bg-accent/30">
                      <td className="px-4 md:px-6 py-3 font-medium">
                        <div>{c.title}</div>
                        <div className="text-xs text-muted-foreground">{c.slug}</div>
                      </td>
                      <td className="px-4 md:px-6 py-3">
                        <Badge variant="secondary" className="text-[10px]">
                          {c.category}
                        </Badge>
                      </td>
                      <td className="px-4 md:px-6 py-3 text-xs">{c.level}</td>
                      <td className="px-4 md:px-6 py-3 text-right font-medium">
                        {c.price_inr > 0 ? `₹${c.price_inr}` : "Free"}
                      </td>
                      <td className="px-4 md:px-6 py-3">
                        <Switch checked={c.published} onCheckedChange={() => togglePublish(c)} />
                      </td>
                      <td className="px-4 md:px-6 py-3 text-xs text-muted-foreground">
                        {format(new Date(c.created_at), "dd-MM-yyyy")}
                      </td>
                      <td className="px-4 md:px-6 py-3 text-right">
                        <div className="flex items-center gap-1 justify-end flex-wrap">
                          <Button size="sm" variant="ghost" onClick={() => setManageLessonsFor(c)}>
                            <Video className="h-4 w-4" /> Lessons
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setManageAssignFor(c)}>
                            <ClipboardList className="h-4 w-4" /> Assign.
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setManageProjectsFor(c)}>
                            <Code2 className="h-4 w-4" /> Projects
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setReviewSubFor(c)}>
                            <FileCheck2 className="h-4 w-4" /> Subs
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setManageMcqFor(c)}>
                            <Brain className="h-4 w-4" /> Test
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={autoCompleting === c.id}
                            onClick={() => handleAutoComplete(c.id)}
                          >
                            {autoCompleting === c.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4" />
                            )}{" "}
                            AI
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setCreating(false);
                              setEditing(c);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeletingCourse(c)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <CourseFormDialog
        open={creating || !!editing}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        course={editing}
        userId={user?.id ?? null}
        onSaved={() => qc.invalidateQueries({ queryKey: ["studio-courses"] })}
      />

      <LessonsDialog course={manageLessonsFor} onClose={() => setManageLessonsFor(null)} />

      <McqDialog course={manageMcqFor} onClose={() => setManageMcqFor(null)} />

      <AssignmentsManagerDialog course={manageAssignFor} onClose={() => setManageAssignFor(null)} />

      <ProjectsManagerDialog
        course={manageProjectsFor}
        onClose={() => setManageProjectsFor(null)}
      />

      <SubmissionsReviewDialog course={reviewSubFor} onClose={() => setReviewSubFor(null)} />

      <AiBuilderDialog
        open={aiBuilderOpen}
        onClose={() => setAiBuilderOpen(false)}
        onCreated={() => {
          setAiBuilderOpen(false);
          qc.invalidateQueries({ queryKey: ["studio-courses"] });
        }}
      />

      <AlertDialog
        open={!!autoCompleteResult}
        onOpenChange={(o) => !o && setAutoCompleteResult(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />{" "}
              {autoCompleteResult?.courseTitle ?? "Auto-Complete"} — Done
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-center">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {autoCompleteResult?.stats?.videosAdded ?? 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Videos added</div>
                  </div>
                  <div className="rounded-lg bg-violet-500/10 border border-violet-500/30 p-3 text-center">
                    <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                      {autoCompleteResult?.stats?.transcriptsAdded ?? 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Summaries added</div>
                  </div>
                  <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {autoCompleteResult?.stats?.mcqsAdded ?? 0}
                    </div>
                    <div className="text-xs text-muted-foreground">MCQs added</div>
                  </div>
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-center">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {autoCompleteResult?.stats?.assignmentsAdded ?? 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Assignments added</div>
                  </div>
                </div>
                {autoCompleteResult?.stats?.projectsAdded > 0 && (
                  <p className="text-xs text-muted-foreground text-center">
                    + {autoCompleteResult.stats.projectsAdded} project added
                  </p>
                )}
                {autoCompleteResult?.stats?.warnings?.length > 0 && (
                  <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-2 text-xs text-amber-700 dark:text-amber-400">
                    {autoCompleteResult.stats.warnings.map((w: string, i: number) => (
                      <div key={i}>⚠ {w}</div>
                    ))}
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAutoCompleteResult(null)}>Done</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deletingCourse} onOpenChange={(o) => !o && setDeletingCourse(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this course?</AlertDialogTitle>
            <AlertDialogDescription>
              <b>{deletingCourse?.title}</b> and its lessons will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteCourse}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

function CourseFormDialog({
  open,
  onClose,
  course,
  userId,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  course: Course | null;
  userId: string | null;
  onSaved: () => void;
}) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const suggestCategoryFn = useServerFn(suggestCourseCategory);
  const [suggestingCategory, setSuggestingCategory] = useState(false);

  async function handleSuggestCategory() {
    if (!title.trim()) return;
    setSuggestingCategory(true);
    try {
      const res = await suggestCategoryFn({
        data: {
          title,
          description,
        },
      });
      if (res?.category) {
        setCategory(res.category);
        toast.success(`Category suggested: ${res.category}`);
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to suggest category");
    } finally {
      setSuggestingCategory(false);
    }
  }
  const [level, setLevel] = useState("Beginner");
  const [price, setPrice] = useState(0);
  const [instructor, setInstructor] = useState("Learnify AI");
  const [duration, setDuration] = useState(0);
  const [coverUrl, setCoverUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [coverFailed, setCoverFailed] = useState(false);
  const [aiThumbOpen, setAiThumbOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const historyKey = `thumb-history:${course?.id ?? "new"}`;

  // Load history on open / course change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      setHistory(JSON.parse(localStorage.getItem(historyKey) || "[]"));
    } catch {
      setHistory([]);
    }
  }, [historyKey, open]);

  function pushHistory(url: string) {
    if (!url) return;
    setHistory((prev) => {
      const next = [url, ...prev.filter((u) => u !== url)].slice(0, 8);
      try {
        localStorage.setItem(historyKey, JSON.stringify(next));
      } catch {
        /* quota */
      }
      return next;
    });
  }

  async function applyCoverFromSource(
    url: string,
    opts?: { expected?: SizeKey | null; skipValidate?: boolean },
  ) {
    if (!opts?.skipValidate) {
      const check = await validateThumbnailImage(url, opts?.expected ?? null);
      if (!check.ok) {
        toast.warning(check.message || "Thumbnail validation warning");
      } else {
        toast.success(`Thumbnail ${check.width}×${check.height} ✓`);
      }
    }
    setCoverFailed(false);
    setCoverUrl(url);
    pushHistory(url);
  }

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setSlug(course.slug);
      setDescription(course.description ?? "");
      setCategory(course.category);
      setLevel(course.level);
      setPrice(Number(course.price_inr));
      setInstructor(course.instructor);
      setDuration(course.duration_minutes);
      setCoverUrl(course.cover_url ?? "");
      setPublished(course.published);
    } else {
      setTitle("");
      setSlug("");
      setDescription("");
      setCategory("General");
      setLevel("Beginner");
      setPrice(0);
      setInstructor("Learnify AI");
      setDuration(0);
      setCoverUrl("");
      setPublished(false);
      if (userId) {
        (async () => {
          try {
            const { data } = await supabase
              .from("profiles")
              .select("default_course_settings")
              .eq("id", userId)
              .single();
            if (data?.default_course_settings) {
              const d = data.default_course_settings as any;
              if (d.category) setCategory(d.category);
              if (d.level) setLevel(d.level);
              if (d.price_inr !== undefined) setPrice(d.price_inr);
            }
          } catch {
            /* ignore */
          }
        })();
      }
    }
    setCoverFailed(false);
  }, [course, open]);

  async function save() {
    if (!title.trim()) return toast.error("Title required");
    const finalSlug = slugify(slug.trim() || title);
    if (!finalSlug) return toast.error("Add a valid course URL slug");
    if (published && coverUrl.trim() && coverFailed)
      return toast.error("Cover image is not visible. Replace the image URL before publishing.");
    if (published && !course)
      return toast.error(
        "Create the course as draft first, then add lessons with valid videos before publishing.",
      );
    if (published && course) {
      try {
        const issues = await getCourseVideoIssues(course.id);
        if (issues.length)
          return toast.error(
            `Fix ${issues.length} lesson video URL${issues.length === 1 ? "" : "s"} before publishing.`,
          );
      } catch (e: any) {
        return toast.error(e?.message ?? "Could not validate lesson videos");
      }
    }
    setSaving(true);
    const payload = {
      title: title.trim(),
      slug: finalSlug,
      description: description.trim() || null,
      category: category.trim() || "General",
      level: level.trim() || "Beginner",
      price_inr: Number(price) || 0,
      instructor: instructor.trim() || "Learnify AI",
      duration_minutes: Number(duration) || 0,
      cover_url: coverUrl.trim() || null,
      published,
    };
    if (course) {
      const { error } = await supabase.from("courses").update(payload).eq("id", course.id);
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Course updated");
      onSaved();
      onClose();
      return;
    }

    // Create new course and get the saved slug so links are accurate.
    const { data: createdCourse, error: insertErr } = await supabase
      .from("courses")
      .insert({ ...payload, created_by: userId })
      .select("id,slug")
      .single();
    setSaving(false);
    if (insertErr) return toast.error(insertErr.message);
    toast.success(
      "Course created! Now add lessons with videos, assignments, and the final test MCQs.",
      { duration: 6000 },
    );
    onSaved();
    onClose();
  }

  async function copyCourseUrl() {
    await navigator.clipboard?.writeText(courseUrlForSlug(slugify(slug || title)));
    toast.success("Course URL copied");
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{course ? "Edit course" : "New course"}</DialogTitle>
          <DialogDescription>
            Course details — visible to learners when published.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!course && !slug) setSlug(slugify(e.target.value));
              }}
              maxLength={120}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Slug</Label>
            <div className="flex gap-2">
              <Input
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                maxLength={80}
                placeholder="my-course-name"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => setSlug(slugify(title))}
                disabled={!title.trim()}
              >
                Generate
              </Button>
            </div>
            <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-2.5 py-2 text-[11px]">
              <Link2 className="h-3.5 w-3.5 text-primary shrink-0" />
              <a
                href={courseUrlForSlug(slugify(slug || title))}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-primary hover:underline truncate"
              >
                {courseUrlForSlug(slugify(slug || title))}
              </a>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7 shrink-0"
                onClick={copyCourseUrl}
                aria-label="Copy course URL"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Lowercase letters, numbers, and dashes only. Confirm this URL before saving.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <div className="flex gap-2">
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                maxLength={50}
                list="course-categories-list"
                placeholder="e.g. Development"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleSuggestCategory}
                disabled={suggestingCategory || !title.trim()}
              >
                {suggestingCategory ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                AI
              </Button>
            </div>
            <datalist id="course-categories-list">
              <option value="Development" />
              <option value="Design" />
              <option value="Marketing" />
              <option value="AI & Data" />
              <option value="Business" />
              <option value="Personal Growth" />
            </datalist>
          </div>
          <div className="space-y-1.5">
            <Label>Level</Label>
            <Input
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              maxLength={30}
              placeholder="Beginner/Intermediate/Advanced"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Price (INR)</Label>
            <Input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Instructor</Label>
            <Input
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              maxLength={80}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Duration (mins)</Label>
            <Input
              type="number"
              min={0}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Cover image / Thumbnail</Label>
            <div className="flex gap-2 flex-wrap">
              <Input
                value={coverUrl}
                onChange={(e) => {
                  setCoverUrl(e.target.value);
                  setCoverFailed(false);
                }}
                placeholder="Paste image URL, upload, or generate with AI"
                className="min-w-[180px] flex-1"
              />
              <label className="inline-flex items-center gap-1.5 rounded-md border bg-secondary px-3 text-sm font-medium hover:bg-secondary/80 cursor-pointer">
                <Upload className="h-4 w-4" /> Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (!f) return;
                    if (f.size > 8 * 1024 * 1024) return toast.error("Image too large (max 8MB)");
                    try {
                      const dataUrl = await resizeImageToDataUrl(f, 1536, 0.85);
                      await applyCoverFromSource(dataUrl, { expected: "1536x1024" });
                    } catch (err: any) {
                      toast.error(err?.message ?? "Could not read image");
                    }
                  }}
                />
              </label>
              <Button type="button" variant="secondary" onClick={() => setAiThumbOpen(true)}>
                <Sparkles className="h-4 w-4" /> AI Thumbnail
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditorOpen(true)}
                disabled={!coverUrl}
              >
                <Scissors className="h-4 w-4" /> Edit
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={async () => {
                  const seed = encodeURIComponent(
                    (title || category || "learning").trim().toLowerCase().replace(/\s+/g, "-"),
                  );
                  // source.unsplash.com is deprecated. Use picsum.photos which supports CORS and seeded random images.
                  await applyCoverFromSource(`https://picsum.photos/seed/${seed}/1536/1024`, {
                    expected: "1536x1024",
                  });
                }}
              >
                Quick stock
              </Button>
            </div>
            {coverUrl && !coverFailed ? (
              <div className="mt-2 overflow-hidden rounded-md border bg-muted relative group">
                <img
                  src={coverUrl}
                  alt="Cover preview"
                  className="w-full max-h-48 object-cover"
                  onLoad={() => setCoverFailed(false)}
                  onError={() => setCoverFailed(true)}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    setCoverUrl("");
                    setCoverFailed(false);
                  }}
                  title="Remove image"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : coverFailed ? (
              <p className="text-[11px] text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Cover image is not loading. Replace the URL
                before publishing.
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                Tip: 1536×1024 (or 1200×630) works best on cards and social shares.
              </p>
            )}

            {history.length > 0 && (
              <div className="mt-2 rounded-lg border bg-muted/30 p-2">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-[11px] font-medium flex items-center gap-1.5">
                    <History className="h-3 w-3" /> Version history ({history.length})
                  </div>
                  <button
                    type="button"
                    className="text-[10px] text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      try {
                        localStorage.removeItem(historyKey);
                      } catch {}
                      setHistory([]);
                    }}
                  >
                    Clear
                  </button>
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {history.map((u, i) => (
                    <div key={i} className="relative shrink-0 group">
                      <img
                        src={u}
                        alt={`v${i + 1}`}
                        className="h-14 w-24 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverFailed(false);
                          setCoverUrl(u);
                          toast.success(`Reverted to v${i + 1}`);
                        }}
                        className="absolute inset-0 grid place-items-center bg-black/60 text-white text-[10px] opacity-0 group-hover:opacity-100 rounded-md transition"
                        title="Revert to this version"
                      >
                        <span className="flex items-center gap-1">
                          <RotateCcw className="h-3 w-3" /> Revert
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <AiThumbnailDialog
              open={aiThumbOpen}
              onClose={() => setAiThumbOpen(false)}
              courseId={course?.id ?? null}
              defaultTitle={title}
              defaultCategory={category}
              defaultDescription={description}
              onApply={async (url) => {
                await applyCoverFromSource(url, { expected: "1536x1024", skipValidate: false });
                setAiThumbOpen(false);
              }}
            />
            <ThumbnailEditor
              open={editorOpen}
              onClose={() => setEditorOpen(false)}
              image={coverUrl || null}
              onApply={(url) => applyCoverFromSource(url, { skipValidate: true })}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Textarea
              rows={4}
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Switch checked={published} onCheckedChange={setPublished} />
            <Label className="!m-0">Published</Label>
          </div>
          <div className="sm:col-span-2 rounded-xl border border-indigo-100 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/20 p-4 text-sm space-y-1.5">
            <p className="font-medium text-foreground">After saving the course:</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>
                Click <strong>Lessons</strong> to add video content — each lesson can have a YouTube
                or direct video URL
              </li>
              <li>
                Click <strong>Assign.</strong> for practical tasks and projects
              </li>
              <li>
                Click <strong>Test</strong> to add MCQs — students must pass (≥70%) to claim their
                certificate
              </li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function LessonsDialog({ course, onClose }: { course: Course | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [adding, setAdding] = useState(false);
  const courseId = course?.id;

  const lessonsQuery = useQuery({
    enabled: !!courseId,
    queryKey: ["studio-lessons", courseId],
    queryFn: async () => {
      if (!courseId) return [] as Lesson[];
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Lesson[];
    },
  });

  async function removeLesson(l: Lesson) {
    const { error } = await supabase.from("lessons").delete().eq("id", l.id);
    if (error) return toast.error(error.message);
    toast.success("Lesson removed");
    qc.invalidateQueries({ queryKey: ["studio-lessons"] });
  }

  return (
    <Dialog open={!!course} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> {course?.title} · Lessons
          </DialogTitle>
          <DialogDescription>Manage the lesson plan for this course.</DialogDescription>
        </DialogHeader>

        {course &&
          (editing || adding ? (
            <LessonForm
              lesson={editing}
              courseId={course.id}
              courseTitle={course.title}
              nextOrder={lessonsQuery.data?.length ?? 0}
              onCancel={() => {
                setEditing(null);
                setAdding(false);
              }}
              onSaved={() => {
                setEditing(null);
                setAdding(false);
                qc.invalidateQueries({ queryKey: ["studio-lessons"] });
              }}
            />
          ) : (
            <>
              <YouTubeToolbar
                courseId={course.id}
                onDone={() => qc.invalidateQueries({ queryKey: ["studio-lessons"] })}
              />
              <div className="flex justify-end">
                <Button size="sm" onClick={() => setAdding(true)}>
                  <Plus className="h-4 w-4" /> Add lesson
                </Button>
              </div>
              {lessonsQuery.isLoading ? (
                <div className="p-6 grid place-items-center">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (lessonsQuery.data ?? []).length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">No lessons yet.</div>
              ) : (
                <ul className="space-y-2 mt-2">
                  {(lessonsQuery.data ?? []).map((l) => (
                    <li
                      key={l.id}
                      className="flex items-center justify-between gap-3 border rounded-lg px-3 py-2"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">
                          {l.order_index + 1}. {l.title}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {l.duration_minutes} min{l.is_preview ? " · Preview" : ""}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button size="icon" variant="ghost" onClick={() => setEditing(l)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => removeLesson(l)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ))}

        <DialogFooter>
          {editing || adding ? (
            <Button
              variant="outline"
              onClick={() => {
                setEditing(null);
                setAdding(false);
              }}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          ) : (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function LessonForm({
  lesson,
  courseId,
  courseTitle = "",
  nextOrder,
  onCancel,
  onSaved,
}: {
  lesson: Lesson | null;
  courseId: string;
  courseTitle?: string;
  nextOrder: number;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(lesson?.title ?? "");
  const [description, setDescription] = useState(lesson?.description ?? "");
  const [videoUrl, setVideoUrl] = useState(lesson?.video_url ?? "");
  const [duration, setDuration] = useState(lesson?.duration_minutes ?? 5);
  const [orderIndex, setOrderIndex] = useState(lesson?.order_index ?? nextOrder);
  const [isPreview, setIsPreview] = useState(lesson?.is_preview ?? false);
  const [saving, setSaving] = useState(false);
  const videoError = useMemo(() => validateLessonVideoUrl(videoUrl), [videoUrl]);

  const searchVideoFn = useServerFn(searchYoutubeVideo);
  const generateNotesFn = useServerFn(generateLessonNotes);
  const [searchingVideo, setSearchingVideo] = useState(false);
  const [generatingNotes, setGeneratingNotes] = useState(false);

  async function handleAiFindVideo() {
    if (!title.trim()) return toast.error("Please enter a lesson title first.");
    setSearchingVideo(true);
    try {
      const res = await searchVideoFn({ data: { query: title } });
      if (res && res.url) {
        setVideoUrl(res.url);
        toast.success(`Found video: ${res.title}`);
      } else {
        toast.error("No video found for this title.");
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Error searching for video.");
    } finally {
      setSearchingVideo(false);
    }
  }

  async function handleAiWriteNotes() {
    if (!title.trim()) return toast.error("Please enter a lesson title first.");
    setGeneratingNotes(true);
    try {
      const res = await generateNotesFn({
        data: {
          title: title.trim(),
          courseTitle: courseTitle || "General Course",
        },
      });
      if (res && res.notes) {
        setDescription(res.notes);
        toast.success("AI generated summary and notes!");
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Error generating notes.");
    } finally {
      setGeneratingNotes(false);
    }
  }

  async function save() {
    if (!title.trim()) return toast.error("Title required");
    if (videoError) return toast.error(videoError);
    setSaving(true);
    const payload = {
      course_id: courseId,
      title: title.trim(),
      description: description.trim() || null,
      video_url: videoUrl.trim() || null,
      duration_minutes: Number(duration) || 0,
      order_index: Number(orderIndex) || 0,
      is_preview: isPreview,
    };
    const { error } = lesson
      ? await supabase.from("lessons").update(payload).eq("id", lesson.id)
      : await supabase.from("lessons").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(lesson ? "Lesson updated" : "Lesson added");
    onSaved();
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5 sm:col-span-2">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label>Video URL (YouTube link or direct video)</Label>
        <div className="flex gap-2">
          <Input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
            aria-invalid={!!videoError}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAiFindVideo}
            disabled={searchingVideo}
            className="h-10 text-xs shrink-0 flex items-center gap-1.5 bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary"
          >
            {searchingVideo ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Youtube className="h-3.5 w-3.5 text-red-500 fill-red-500" />
            )}
            AI Find Video
          </Button>
        </div>
        {videoError ? (
          <p className="text-[11px] text-destructive">{videoError}</p>
        ) : (
          <p className="text-[11px] text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Playable video URL
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label>Duration (mins)</Label>
        <Input
          type="number"
          min={0}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Order</Label>
        <Input
          type="number"
          min={0}
          value={orderIndex}
          onChange={(e) => setOrderIndex(Number(e.target.value))}
        />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <div className="flex items-center justify-between">
          <Label>Description</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAiWriteNotes}
            disabled={generatingNotes}
            className="h-7 text-[10px] flex items-center gap-1.5 text-primary hover:text-primary hover:bg-primary/5 px-2"
          >
            {generatingNotes ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3 text-yellow-500 fill-yellow-500" />
            )}
            AI Write Notes
          </Button>
        </div>
        <Textarea
          rows={3}
          maxLength={500}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2 sm:col-span-2">
        <Switch checked={isPreview} onCheckedChange={setIsPreview} />
        <Label className="!m-0">Free preview lesson</Label>
      </div>
      <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={save} disabled={saving || !!videoError}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save lesson
        </Button>
      </div>
    </div>
  );
}

/* ---------- MCQ Manager ---------- */

type Mcq = {
  id: string;
  course_id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string | null;
  order_index: number;
};

function McqDialog({ course, onClose }: { course: Course | null; onClose: () => void }) {
  const qc = useQueryClient();
  const aiFn = useServerFn(runAiTool);
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [bulkJson, setBulkJson] = useState("");
  const courseId = course?.id;

  const q = useQuery({
    enabled: !!courseId,
    queryKey: ["studio-mcq", courseId],
    queryFn: async () => {
      if (!courseId) return [] as Mcq[];
      const { data, error } = await supabase
        .from("mcq_questions")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index");
      if (error) throw error;
      return (data ?? []) as Mcq[];
    },
  });

  async function generate() {
    if (!course) return;
    const t = topic.trim() || course.title;
    setGenerating(true);
    try {
      const res = await aiFn({ data: { action: "quiz", topic: t, count, difficulty: "medium" } });
      const parsed = JSON.parse((res as any).json) as {
        questions: Array<{
          question: string;
          options: string[];
          answer: number;
          explanation: string;
        }>;
      };
      const startIdx = q.data?.length ?? 0;
      const rows = parsed.questions.map((qq, i) => ({
        course_id: course.id,
        question: qq.question,
        options: qq.options,
        answer: qq.answer,
        explanation: qq.explanation,
        order_index: startIdx + i,
      }));
      const { error } = await supabase.from("mcq_questions").insert(rows);
      if (error) throw error;
      toast.success(`Added ${rows.length} questions`);
      qc.invalidateQueries({ queryKey: ["studio-mcq"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  async function bulkAdd() {
    if (!course || !bulkJson.trim()) return;
    try {
      const parsed = JSON.parse(bulkJson);
      const arr = Array.isArray(parsed) ? parsed : parsed.questions;
      if (!Array.isArray(arr)) throw new Error("Expected an array or { questions: [] }");
      const startIdx = q.data?.length ?? 0;
      const rows = arr.map((qq: any, i: number) => ({
        course_id: course.id,
        question: String(qq.question),
        options: qq.options,
        answer: Number(qq.answer),
        explanation: qq.explanation ?? null,
        order_index: startIdx + i,
      }));
      const { error } = await supabase.from("mcq_questions").insert(rows);
      if (error) throw error;
      toast.success(`Added ${rows.length} questions`);
      setBulkJson("");
      qc.invalidateQueries({ queryKey: ["studio-mcq"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Invalid JSON");
    }
  }

  async function remove(id: string) {
    await supabase.from("mcq_questions").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["studio-mcq"] });
  }

  async function clearAll() {
    if (!course || !confirm("Delete ALL test questions for this course?")) return;
    await supabase.from("mcq_questions").delete().eq("course_id", course.id);
    qc.invalidateQueries({ queryKey: ["studio-mcq"] });
  }

  return (
    <Dialog open={!!course} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" /> {course?.title} · Final Test
          </DialogTitle>
          <DialogDescription>
            Add MCQs students must pass (≥70%) to claim their certificate.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border p-3 space-y-2 bg-muted/30">
            <Label className="text-xs">AI-generate questions</Label>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px_auto] gap-2">
              <Input
                placeholder={`Topic (defaults to "${course?.title ?? "course"}")`}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <Input
                type="number"
                min={3}
                max={20}
                value={count}
                onChange={(e) => setCount(Number(e.target.value) || 10)}
              />
              <Button onClick={generate} disabled={generating}>
                {generating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}{" "}
                Generate
              </Button>
            </div>
          </div>

          <div className="rounded-lg border p-3 space-y-2">
            <Label className="text-xs">Bulk add JSON</Label>
            <Textarea
              rows={4}
              placeholder={`[{"question":"...","options":["a","b","c","d"],"answer":0,"explanation":"..."}]`}
              value={bulkJson}
              onChange={(e) => setBulkJson(e.target.value)}
              className="font-mono text-xs"
            />
            <Button size="sm" onClick={bulkAdd} disabled={!bulkJson.trim()}>
              Add from JSON
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{q.data?.length ?? 0} questions</p>
            {(q.data?.length ?? 0) > 0 && (
              <Button size="sm" variant="ghost" className="text-destructive" onClick={clearAll}>
                <Trash2 className="h-4 w-4" /> Clear all
              </Button>
            )}
          </div>

          {q.isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
          ) : (
            <ul className="space-y-2">
              {(q.data ?? []).map((qq, i) => (
                <li key={qq.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {i + 1}. {qq.question}
                      </p>
                      <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                        {qq.options.map((o, idx) => (
                          <li
                            key={idx}
                            className={idx === qq.answer ? "text-emerald-600 font-medium" : ""}
                          >
                            {String.fromCharCode(65 + idx)}. {o} {idx === qq.answer && "✓"}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => remove(qq.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- My AI Course Builder ---------- */
function AiBuilderDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const genFn = useServerFn(generateFullCourse);
  const matFn = useServerFn(materializeCourse);
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [audience, setAudience] = useState("");
  const [category, setCategory] = useState("Programming");
  const [count, setCount] = useState(4);
  const [price, setPrice] = useState(0);
  const [published, setPublished] = useState(false);
  const [blueprint, setBlueprint] = useState<any>(null);
  const [busy, setBusy] = useState<"" | "gen" | "save">("");

  const generate = async () => {
    if (!topic.trim()) return toast.error("Enter a topic");
    setBusy("gen");
    try {
      const r = await genFn({
        data: { topic, level, audience: audience || undefined, modules: count, category },
      });
      setBlueprint(r.course);
      toast.success("Course blueprint ready — review and create");
    } catch (e: any) {
      toast.error(e?.message ?? "Generation failed");
    } finally {
      setBusy("");
    }
  };

  const materialize = async () => {
    if (!blueprint) return;
    setBusy("save");
    try {
      const r = await matFn({
        data: { blueprint, price_inr: price, instructor: "Learnify AI", published },
      });
      toast.success(`Course created (slug: ${r.slug})`);
      setBlueprint(null);
      setTopic("");
      onCreated();
      try {
        if (r?.slug) navigate({ to: "/courses/$slug", params: { slug: r.slug } });
      } catch {
        /* ignore */
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Save failed");
    } finally {
      setBusy("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" /> My AI Course Builder
          </DialogTitle>
          <DialogDescription>
            Generates modules → chapters → real-world examples → projects → assignments → MCQs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Topic</Label>
              <Input
                placeholder="e.g. Full-stack Next.js + tRPC + Prisma"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                maxLength={300}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Level</Label>
              <select
                className="w-full h-9 rounded-md border bg-background px-2 text-sm"
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Modules</Label>
              <Input
                type="number"
                min={2}
                max={8}
                value={count}
                onChange={(e) => setCount(Number(e.target.value) || 4)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Price (INR)</Label>
              <Input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Target audience (optional)</Label>
              <Input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. junior frontend engineers learning the backend"
              />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <Switch checked={published} onCheckedChange={setPublished} />
              <Label className="!m-0">Publish immediately</Label>
            </div>
          </div>

          <Button onClick={generate} disabled={busy !== ""} className="w-full">
            {busy === "gen" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}{" "}
            Generate blueprint
          </Button>

          {blueprint && (
            <div className="space-y-3 mt-2">
              <div className="rounded-lg border p-3 bg-muted/30">
                <p className="font-display font-semibold">{blueprint.title}</p>
                <p className="text-xs text-muted-foreground">{blueprint.description}</p>
                <p className="text-[11px] mt-1">
                  {blueprint.modules?.length} modules ·{" "}
                  {blueprint.modules?.reduce(
                    (s: number, m: any) => s + (m.chapters?.length ?? 0),
                    0,
                  )}{" "}
                  chapters · {blueprint.mcqs?.length ?? 0} MCQs
                </p>
              </div>
              <ul className="text-xs space-y-2 max-h-[280px] overflow-y-auto border rounded-lg p-3">
                {blueprint.modules?.map((m: any, i: number) => (
                  <li key={i}>
                    <p className="font-semibold">
                      {i + 1}. {m.title}
                    </p>
                    <p className="text-muted-foreground">{m.description}</p>
                    <ul className="ml-4 list-disc text-muted-foreground">
                      {m.chapters?.map((c: any, ci: number) => (
                        <li key={ci}>{c.title}</li>
                      ))}
                    </ul>
                    {m.project && (
                      <p className="ml-4 text-primary">📦 Project: {m.project.title}</p>
                    )}
                  </li>
                ))}
              </ul>
              <Button onClick={materialize} disabled={busy !== ""} className="w-full">
                {busy === "save" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}{" "}
                Create course in catalog
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Assignments Manager ---------- */
type Assignment = {
  id: string;
  title: string;
  prompt: string;
  starter_code: string | null;
  order_index: number;
};

function AssignmentsManagerDialog({
  course,
  onClose,
}: {
  course: Course | null;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [starter, setStarter] = useState("");
  const courseId = course?.id;

  const q = useQuery({
    enabled: !!courseId,
    queryKey: ["studio-assignments", courseId],
    queryFn: async () => {
      if (!courseId) return [] as Assignment[];
      const { data, error } = await supabase
        .from("course_assignments")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index");
      if (error) throw error;
      return (data ?? []) as Assignment[];
    },
  });

  const add = async () => {
    if (!course || !title.trim() || !prompt.trim()) return toast.error("Title and prompt required");
    const idx = q.data?.length ?? 0;
    const { error } = await supabase.from("course_assignments").insert({
      course_id: course.id,
      title: title.trim(),
      prompt: prompt.trim(),
      starter_code: starter.trim() || null,
      order_index: idx,
    });
    if (error) return toast.error(error.message);
    setTitle("");
    setPrompt("");
    setStarter("");
    setAdding(false);
    qc.invalidateQueries({ queryKey: ["studio-assignments"] });
    toast.success("Assignment added");
  };

  const remove = async (id: string) => {
    await supabase.from("course_assignments").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["studio-assignments"] });
  };

  return (
    <Dialog open={!!course} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" /> {course?.title} · Assignments
          </DialogTitle>
          <DialogDescription>Practical tasks and projects learners submit.</DialogDescription>
        </DialogHeader>

        {adding ? (
          <div className="space-y-2">
            <Input
              placeholder="Assignment title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={180}
            />
            <Textarea
              rows={5}
              placeholder="Detailed prompt with deliverables…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              maxLength={4000}
            />
            <Textarea
              rows={4}
              placeholder="Starter code (optional)"
              value={starter}
              onChange={(e) => setStarter(e.target.value)}
              className="font-mono text-xs"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAdding(false)}>
                Cancel
              </Button>
              <Button onClick={add}>Save assignment</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-end">
              <Button size="sm" onClick={() => setAdding(true)}>
                <Plus className="h-4 w-4" /> Add assignment
              </Button>
            </div>
            {q.isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            ) : (q.data ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No assignments yet.</p>
            ) : (
              <ul className="space-y-2">
                {(q.data ?? []).map((a, i) => (
                  <li key={a.id} className="border rounded-lg p-3 flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {i + 1}. {a.title}
                      </p>
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-3 mt-1">
                        {a.prompt}
                      </p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => remove(a.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Submissions Reviewer ---------- */
function SubmissionsReviewDialog({
  course,
  onClose,
}: {
  course: Course | null;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const courseId = course?.id;

  const q = useQuery({
    enabled: !!courseId,
    queryKey: ["studio-subs", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const { data, error } = await supabase
        .from("assignment_submissions")
        .select("*, profiles:user_id(full_name, email), course_assignments:assignment_id(title)")
        .eq("course_id", courseId)
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateStatus = async (id: string, status: string) => {
    const fb = feedbackMap[id];
    const { error } = await supabase
      .from("assignment_submissions")
      .update({
        status,
        feedback: fb ?? undefined,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    qc.invalidateQueries({ queryKey: ["studio-subs"] });
  };

  return (
    <Dialog open={!!course} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-primary" /> {course?.title} · Submissions
          </DialogTitle>
          <DialogDescription>Review and provide feedback on learner submissions.</DialogDescription>
        </DialogHeader>

        {q.isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin mx-auto" />
        ) : (q.data ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No submissions yet.</p>
        ) : (
          <div className="space-y-3">
            {(q.data ?? []).map((s: any) => (
              <div key={s.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {s.course_assignments?.title ?? "Assignment"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {s.profiles?.full_name ?? s.profiles?.email ?? "Learner"} ·{" "}
                      {format(new Date(s.submitted_at), "dd MMM HH:mm")}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {String(s.status).replace("_", " ")}
                  </Badge>
                </div>
                {s.content && (
                  <div className="text-xs whitespace-pre-wrap bg-muted/40 rounded p-2 max-h-40 overflow-y-auto">
                    {s.content}
                  </div>
                )}
                <div className="flex gap-3 text-xs">
                  {s.link_url && (
                    <a
                      className="text-primary underline inline-flex items-center gap-1"
                      href={s.link_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="h-3 w-3" /> Link
                    </a>
                  )}
                  {s.attachment_url && (
                    <a
                      className="text-primary underline inline-flex items-center gap-1"
                      href={s.attachment_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Paperclip className="h-3 w-3" /> File
                    </a>
                  )}
                </div>
                <Textarea
                  rows={2}
                  placeholder="Feedback for the learner…"
                  defaultValue={s.feedback ?? ""}
                  onChange={(e) => setFeedbackMap((m) => ({ ...m, [s.id]: e.target.value }))}
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(s.id, "needs_changes")}
                  >
                    Needs changes
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(s.id, "reviewed")}
                  >
                    Mark reviewed
                  </Button>
                  <Button size="sm" onClick={() => updateStatus(s.id, "approved")}>
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function YouTubeToolbar({ courseId, onDone }: { courseId: string; onDone: () => void }) {
  const verifyFn = useServerFn(verifyYoutubeKey);
  const startFn = useServerFn(startCourseEnrichment);
  const listRunsFn = useServerFn(listCourseEnrichmentRuns);
  const [verifyUrl, setVerifyUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<null | { title: string; channel: string }>(null);
  const [withTranscript, setWithTranscript] = useState(true);
  const [starting, setStarting] = useState(false);
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pastRuns, setPastRuns] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  async function loadHistory() {
    try {
      const res: any = await listRunsFn({ data: { courseId } });
      setPastRuns(res.runs ?? []);
    } catch {
      /* ignore */
    }
  }
  useEffect(() => {
    loadHistory();
  }, [courseId]);

  async function doVerify() {
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res: any = await verifyFn({ data: { url: verifyUrl } });
      setVerifyResult({ title: res.meta.title, channel: res.meta.channelTitle });
      toast.success("YouTube key is working.");
    } catch (e: any) {
      toast.error(e?.message ?? "Verification failed");
    } finally {
      setVerifying(false);
    }
  }

  async function doStart() {
    setStarting(true);
    try {
      const res: any = await startFn({ data: { courseId, withTranscript } });
      setActiveRunId(res.runId);
      setDialogOpen(true);
      toast.success("Enrichment started — monitoring progress.");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to start enrichment");
    } finally {
      setStarting(false);
    }
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-3 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Youtube className="h-4 w-4 text-red-500" /> YouTube tools
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={verifyUrl}
          onChange={(e) => setVerifyUrl(e.target.value)}
          placeholder="Paste a YouTube URL to verify the API key"
          className="flex-1"
        />
        <Button size="sm" variant="outline" onClick={doVerify} disabled={verifying}>
          {verifying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}{" "}
          Verify key
        </Button>
      </div>
      {verifyResult && (
        <div className="text-xs text-emerald-600 dark:text-emerald-400">
          ✓ {verifyResult.title} — {verifyResult.channel}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1 border-t">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Switch checked={withTranscript} onCheckedChange={setWithTranscript} />
          Pull transcripts & summarize into lesson content
        </label>
        <div className="sm:ml-auto flex gap-2">
          {activeRunId && (
            <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
              View progress
            </Button>
          )}
          <Button size="sm" onClick={doStart} disabled={starting}>
            {starting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}{" "}
            Re-run YouTube enrichment
          </Button>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground">
        Refreshes each lesson&apos;s <code>video_url</code> with the top YouTube match. With
        transcripts on, key takeaways, notes and a glossary are added to lesson content. Cached
        transcripts are reused across courses.
      </p>

      <div className="pt-2 border-t">
        <button
          type="button"
          className="text-xs text-muted-foreground hover:text-foreground underline"
          onClick={() => {
            setShowHistory((s) => !s);
            if (!showHistory) loadHistory();
          }}
        >
          {showHistory ? "Hide" : "Show"} past runs ({pastRuns.length})
        </button>
        {showHistory && (
          <ul className="mt-2 space-y-1 text-xs">
            {pastRuns.map((r) => (
              <li key={r.id} className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  className="underline hover:text-foreground text-muted-foreground"
                  onClick={() => {
                    setActiveRunId(r.id);
                    setDialogOpen(true);
                  }}
                >
                  {format(new Date(r.started_at), "MMM d, HH:mm")}
                </button>
                <Badge variant="outline" className="text-[10px]">
                  {r.status}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  key: {r.youtube_key_status}
                </Badge>
                <span className="text-muted-foreground">
                  {r.updated_videos}/{r.total} videos · {r.updated_transcripts} summaries
                  {r.failures?.length ? ` · ${r.failures.length} failed` : ""}
                </span>
              </li>
            ))}
            {!pastRuns.length && <li className="text-muted-foreground">No runs yet.</li>}
          </ul>
        )}
      </div>

      <EnrichmentProgressDialog
        runId={activeRunId}
        open={dialogOpen}
        onOpenChange={(v) => {
          setDialogOpen(v);
          if (!v) {
            loadHistory();
            onDone();
          }
        }}
      />
    </div>
  );
}

async function resizeImageToDataUrl(
  file: File,
  maxWidth: number,
  quality: number,
): Promise<string> {
  const bitmap = await createImageBitmap(file).catch(async () => {
    // Fallback via <img>
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = rej;
        i.src = url;
      });
      return img as unknown as ImageBitmap;
    } finally {
      URL.revokeObjectURL(url);
    }
  });
  const w = (bitmap as any).width as number;
  const h = (bitmap as any).height as number;
  const scale = Math.min(1, maxWidth / w);
  const tw = Math.round(w * scale);
  const th = Math.round(h * scale);
  const canvas = document.createElement("canvas");
  canvas.width = tw;
  canvas.height = th;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap as any, 0, 0, tw, th);
  return canvas.toDataURL("image/jpeg", quality);
}

function AiThumbnailDialog({
  open,
  onClose,
  courseId,
  defaultTitle,
  defaultCategory,
  defaultDescription,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  courseId: string | null;
  defaultTitle: string;
  defaultCategory: string;
  defaultDescription: string;
  onApply: (dataUrl: string) => void;
}) {
  const [style, setStyle] = useState<string>("bold");
  const [colors, setColors] = useState("");
  const [notes, setNotes] = useState("");
  const [size, setSize] = useState<SizeKey>("1536x1024");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [lessonHint, setLessonHint] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [warn, setWarn] = useState<string | null>(null);
  const generate = useServerFn(generateCourseThumbnail);

  useEffect(() => {
    if (open) {
      setPreview(null);
      setError(null);
      setWarn(null);
    }
  }, [open]);

  // Auto-fetch the first lesson title/description so prompts match course theme.
  useEffect(() => {
    if (!open || !courseId) {
      setLessonHint("");
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("lessons")
        .select("title, description")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      if (data) setLessonHint([data.title, data.description].filter(Boolean).join(" — "));
    })();
    return () => {
      cancelled = true;
    };
  }, [open, courseId]);

  const prompt = buildThumbnailPrompt({
    title: defaultTitle || "Untitled course",
    category: defaultCategory,
    description: defaultDescription,
    style,
    colors,
    customNotes: notes,
    lessonHint,
  });

  async function run() {
    setError(null);
    setWarn(null);
    if (!defaultTitle.trim()) {
      setError("Add a course title first.");
      return;
    }
    const unsafe = checkThumbnailPromptSafety(prompt);
    if (unsafe) {
      setError(unsafe);
      return;
    }
    setBusy(true);
    try {
      const res = await generate({ data: { prompt, size } });
      setPreview(res.dataUrl);
      const check = await validateThumbnailImage(res.dataUrl, size);
      if (!check.ok) setWarn(check.message ?? "Generated image failed validation.");
    } catch (e: any) {
      setError(e?.message ?? "Generation failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> AI Thumbnail Generator
          </DialogTitle>
          <DialogDescription>
            Pick a style, tweak colors and notes, generate a thumbnail based on your course.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Style template</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {THUMBNAIL_STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStyle(s.id)}
                  className={`text-left rounded-xl border p-2.5 text-xs transition ${style === s.id ? "border-primary bg-primary/5" : "hover:bg-accent"}`}
                >
                  <div className="font-medium">{s.label}</div>
                  <div className="text-muted-foreground line-clamp-2 mt-0.5">{s.hint}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Colors (optional)</Label>
              <Input
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                placeholder="e.g. indigo & gold, pastel green"
                maxLength={120}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Size</Label>
              <div className="flex gap-1">
                {(["1536x1024", "1024x1024", "1024x1536"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`flex-1 rounded-md border p-1.5 text-xs ${size === s ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Extra direction (optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={400}
              rows={2}
              placeholder="e.g. include a small lightbulb icon, no text on bottom-right"
            />
          </div>
          <div className="rounded-md border bg-muted/40 p-2.5 text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground">Prompt preview: </span>
            {prompt}
            {lessonHint && (
              <div className="mt-1 text-[10px] italic">
                Auto-included from first lesson: "{lessonHint.slice(0, 120)}
                {lessonHint.length > 120 ? "…" : ""}"
              </div>
            )}
          </div>
          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-2.5 text-xs text-destructive flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="font-medium">Generation failed</div>
                <div className="text-[11px] opacity-90">{error}</div>
              </div>
              <Button size="sm" variant="outline" onClick={run} disabled={busy}>
                Retry
              </Button>
            </div>
          )}
          {warn && !error && (
            <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-2.5 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" /> <span>{warn}</span>
            </div>
          )}
          {preview && (
            <div className="overflow-hidden rounded-md border bg-muted">
              <img
                src={preview}
                alt="AI thumbnail"
                className="w-full max-h-72 object-contain bg-black/5"
              />
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={run} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {preview ? "Regenerate" : "Generate"}
          </Button>
          <Button onClick={() => preview && onApply(preview)} disabled={!preview}>
            <ImageIcon className="h-4 w-4" /> Use this thumbnail
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Projects Manager ---------- */

function ProjectsManagerDialog({
  course,
  onClose,
}: {
  course: Course | null;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [items, setItems] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const aq = useQuery({
    enabled: !!course,
    queryKey: ["course-projects", course?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_assignments")
        .select("*")
        .eq("course_id", course!.id)
        .order("order_index");
      if (error) throw error;
      // Filter for project-type entries
      return (data ?? []).filter((a: any) => a.title?.startsWith("Project:"));
    },
  });

  useEffect(() => {
    setItems(aq.data ?? []);
  }, [aq.data]);

  const save = async (updated: any[]) => {
    if (!course) return;
    // Delete existing project entries
    const existing = aq.data ?? [];
    const ids = existing.map((a: any) => a.id);
    if (ids.length > 0) {
      await supabase.from("course_assignments").delete().in("id", ids);
    }
    // Insert updated
    const rows = updated.map((p, i) => ({
      course_id: course.id,
      title: `Project: ${p.title}`,
      prompt: p.prompt ?? "",
      starter_code: p.starter_code ?? null,
      order_index: i,
    }));
    const { error } = await supabase.from("course_assignments").insert(rows);
    if (error) return toast.error(error.message);
    toast.success("Projects saved");
    qc.invalidateQueries({ queryKey: ["course-projects", course.id] });
    onClose();
  };

  if (!course) return null;

  return (
    <Dialog open={!!course} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" /> Projects — {course.title}
          </DialogTitle>
          <DialogDescription>
            Hands-on projects for this course. Students see these in the course player.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => {
                setItems([...items, { title: "", prompt: "", starter_code: "" }]);
                setEditingIndex(items.length);
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> Add project
            </Button>
          </div>
          {items.map((p, i) => (
            <div key={i} className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Project #{i + 1}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => {
                    setItems(items.filter((_, idx) => idx !== i));
                    if (editingIndex === i) setEditingIndex(null);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <Input
                value={p.title}
                onChange={(e) => {
                  const copy = [...items];
                  copy[i] = { ...copy[i], title: e.target.value };
                  setItems(copy);
                }}
                placeholder="Project title (e.g. Build a Todo App)"
              />
              <textarea
                value={p.prompt}
                onChange={(e) => {
                  const copy = [...items];
                  copy[i] = { ...copy[i], prompt: e.target.value };
                  setItems(copy);
                }}
                placeholder="Project description / instructions"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm min-h-[80px]"
              />
              <Input
                value={p.starter_code ?? ""}
                onChange={(e) => {
                  const copy = [...items];
                  copy[i] = { ...copy[i], starter_code: e.target.value };
                  setItems(copy);
                }}
                placeholder="Starter code URL (optional)"
              />
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center text-muted-foreground py-8">No projects yet.</div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => save(items)}>Save projects</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
