"use client";

import { useState, lazy, Suspense, useEffect, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { adminContentAction, adminContentQuery } from "@/lib/admin-content.functions";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  RefreshCw,
  FileText,
  Code2,
  Sparkles,
  Save,
  CheckCircle2,
  Upload,
  ImageIcon,
  X,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { FREE_COURSES_GUIDE_POST } from "@/lib/canonical-blog";
import { BLOG_POSTS_DATA } from "@/lib/blog-posts-data";
import { generateDeepResearchBlogPost } from "@/lib/admin-content.functions";
import {
  useAdminDraft,
  AutosaveStatusBadge,
  DraftRecoveryBanner,
} from "@/lib/admin-editor-workspace";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const RichTextEditor = lazy(() => import("./RichTextEditor"));

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  author_id: string | null;
  published: boolean;
  published_at: string | null;
  scheduled_at?: string | null;
  created_at: string;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

// ─── Sub-Component: BlogEditorModal ──────────────────────────────────────────

interface BlogEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: BlogPost | null;
  onSaved: () => void;
  initialOverride?: Partial<BlogPost> | null;
}

function BlogEditorModal({
  open,
  onOpenChange,
  editing,
  onSaved,
  initialOverride,
}: BlogEditorModalProps) {
  const doAdminAction = useServerFn(adminContentAction);

  const initialValues: Partial<BlogPost> = useMemo(() => {
    if (initialOverride) return initialOverride;
    if (editing) return { ...editing };
    return {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      featured_image: "",
      published: false,
    };
  }, [editing, initialOverride]);

  const [editorMode, setEditorMode] = useState<"rich" | "markdown">(() => {
    const c = initialValues.content || "";
    return c.trim().startsWith("#") || c.includes("## ") ? "markdown" : "rich";
  });

  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  async function uploadFeaturedImage(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are accepted.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB.");
      return;
    }
    setImageUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const filename = `blog-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("blog-assets")
        .upload(filename, file, { upsert: false, contentType: file.type });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("blog-assets").getPublicUrl(filename);
      updateField("featured_image", urlData.publicUrl);
      toast.success("Featured image uploaded successfully.");
    } catch (e: any) {
      toast.error(e?.message || "Image upload failed.");
    } finally {
      setImageUploading(false);
    }
  }

  // Connect to persistent Admin Editor Workspace
  const {
    formData,
    updateField,
    updateAll,
    status,
    lastSavedAt,
    isDirty,
    saveDraftNow,
    clearDraft,
    restoreDraft,
    discardRecoverableDraft,
    hasRecoverableDraft,
    recoverableDraftDate,
    recoverableDraft,
  } = useAdminDraft<Partial<BlogPost>>({
    module: "blog",
    recordId: editing?.id || "new",
    initialData: initialValues,
    getTitle: (d) => d.title || "Untitled Blog Post",
    onServerSave: async (draftData) => {
      if (!draftData.title?.trim()) return; // Don't autosave empty title to server
      const slug = draftData.slug?.trim() || slugify(draftData.title);
      const payload = {
        title: draftData.title.trim(),
        slug,
        content: draftData.content || "",
        excerpt: draftData.excerpt?.trim() || null,
        featured_image: draftData.featured_image?.trim() || null,
        published: !!draftData.published,
        published_at: draftData.published ? (editing?.published_at || new Date().toISOString()) : null,
      };

      if (editing?.id) {
        await doAdminAction({
          data: { table: "blog_posts", action: "update", id: editing.id, data: payload },
        });
      }
    },
    enabled: open,
  });

  // Handle Save Draft (Explicit manual draft save)
  const handleSaveDraft = async () => {
    if (!formData.title?.trim()) {
      toast.error("Title is required to save a draft");
      return;
    }
    setSaving(true);
    try {
      const slug = formData.slug?.trim() || slugify(formData.title);
      const payload = {
        title: formData.title.trim(),
        slug,
        content: formData.content || "",
        excerpt: formData.excerpt?.trim() || null,
        featured_image: formData.featured_image?.trim() || null,
        published: false, // Explicitly keep as draft
        published_at: editing?.published_at || null,
      };

      if (editing) {
        await doAdminAction({
          data: { table: "blog_posts", action: "update", id: editing.id, data: payload },
        });
      } else {
        await doAdminAction({
          data: { table: "blog_posts", action: "insert", data: payload },
        });
      }

      await saveDraftNow();
      toast.success("Draft saved successfully!");
      onSaved();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  // Handle Schedule Release
  const handleScheduleRelease = async () => {
    if (!formData.title?.trim()) {
      toast.error("Title is required to schedule release");
      return;
    }
    if (!formData.scheduled_at) {
      toast.error("Please pick a scheduled release date and time");
      return;
    }
    const releaseTime = new Date(formData.scheduled_at).getTime();
    if (releaseTime <= Date.now()) {
      toast.error("Scheduled date must be in the future");
      return;
    }

    setPublishing(true);
    try {
      const slug = formData.slug?.trim() || slugify(formData.title);
      const payload = {
        title: formData.title.trim(),
        slug,
        content: formData.content || "",
        excerpt: formData.excerpt?.trim() || null,
        featured_image: formData.featured_image?.trim() || null,
        published: false,
        scheduled_at: new Date(formData.scheduled_at).toISOString(),
        published_at: null,
      };

      if (editing) {
        await doAdminAction({
          data: { table: "blog_posts", action: "update", id: editing.id, data: payload },
        });
      } else {
        await doAdminAction({
          data: { table: "blog_posts", action: "insert", data: payload },
        });
      }

      await saveDraftNow();
      toast.success(`Scheduled for release on ${format(new Date(formData.scheduled_at), "MMM d, yyyy 'at' h:mm a")}!`);
      onSaved();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to schedule release");
    } finally {
      setPublishing(false);
    }
  };

  // Handle Publish Live
  const handlePublishLive = async () => {
    if (!formData.title?.trim()) {
      toast.error("Title is required to publish");
      return;
    }
    setPublishing(true);
    try {
      const slug = formData.slug?.trim() || slugify(formData.title);
      const payload = {
        title: formData.title.trim(),
        slug,
        content: formData.content || "",
        excerpt: formData.excerpt?.trim() || null,
        featured_image: formData.featured_image?.trim() || null,
        published: true, // Publish live!
        published_at: editing?.published_at || new Date().toISOString(),
      };

      if (editing) {
        await doAdminAction({
          data: { table: "blog_posts", action: "update", id: editing.id, data: payload },
        });
      } else {
        await doAdminAction({
          data: { table: "blog_posts", action: "insert", data: payload },
        });
      }

      clearDraft();
      toast.success("Post published live!");
      onSaved();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to publish post");
    } finally {
      setPublishing(false);
    }
  };

  // Handle Live Preview
  const handlePreview = () => {
    const slug = formData.slug || slugify(formData.title || "preview");
    window.open(`/blog/${slug}?preview=true`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden rounded-2xl shadow-2xl">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b bg-card/60 backdrop-blur-md shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-display font-bold">
                {editing ? "Edit Blog Post" : "Create New Post"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Autosaved continuously. Switch tabs freely without losing changes.
              </DialogDescription>
            </div>
            {/* Real-Time Autosave Indicator Badge */}
            <div className="flex items-center gap-2">
              <AutosaveStatusBadge
                status={status}
                lastSavedAt={lastSavedAt}
                isDirty={isDirty}
                onRetry={saveDraftNow}
              />
            </div>
          </div>

          {/* Recoverable Draft Notice */}
          {hasRecoverableDraft && recoverableDraftDate && (
            <div className="mt-3">
              <DraftRecoveryBanner
                date={recoverableDraftDate}
                hasRecoverableDraft={hasRecoverableDraft}
                onRestore={restoreDraft}
                onDiscard={discardRecoverableDraft}
                currentData={formData}
                draftData={recoverableDraft?.data}
                moduleName="Blog Post"
              />
            </div>
          )}
        </DialogHeader>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Post Title</Label>
              <Input
                value={formData.title || ""}
                onChange={(e) => {
                  const title = e.target.value;
                  updateField("title", title);
                  if (!editing && (!formData.slug || formData.slug === slugify(formData.title || ""))) {
                    updateField("slug", slugify(title));
                  }
                }}
                placeholder="The Ultimate Guide to..."
                className="font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">URL Slug</Label>
              <Input
                value={formData.slug || ""}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="ultimate-guide-..."
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-sky-400" /> Schedule Release Date (Optional)
            </Label>
            <Input
              type="datetime-local"
              value={formData.scheduled_at ? formData.scheduled_at.slice(0, 16) : ""}
              onChange={(e) => updateField("scheduled_at", e.target.value ? new Date(e.target.value).toISOString() : null)}
              className="text-xs font-mono"
            />
            <p className="text-[10px] text-muted-foreground">
              Set a future release time to automatically publish via the automated maintenance cron.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Excerpt / Summary</Label>
            <Textarea
              rows={2}
              value={formData.excerpt || ""}
              onChange={(e) => updateField("excerpt", e.target.value)}
              placeholder="Short 1-2 sentence preview for search engines and cards..."
              className="text-xs resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Featured Image</Label>
            <div className="space-y-2">
              {/* File upload button */}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadFeaturedImage(file);
                    e.target.value = "";
                  }}
                />
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed text-xs transition-colors",
                    imageUploading
                      ? "border-primary/50 bg-primary/5 text-primary cursor-wait"
                      : "border-border hover:border-primary/50 hover:bg-muted/30 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {imageUploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="h-3.5 w-3.5" />
                  )}
                  {imageUploading ? "Uploading to Supabase Storage…" : "Upload image (max 5 MB)"}
                </div>
              </label>
              {/* URL fallback input */}
              <div className="flex items-center gap-2">
                <Input
                  value={formData.featured_image || ""}
                  onChange={(e) => updateField("featured_image", e.target.value)}
                  placeholder="Or paste image URL (Unsplash, CDN, etc.)"
                  className="text-xs font-mono"
                />
                {formData.featured_image && (
                  <button
                    type="button"
                    onClick={() => updateField("featured_image", "")}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    aria-label="Clear image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {/* Preview */}
              {formData.featured_image && (
                <div className="relative rounded-lg overflow-hidden border bg-muted/30 aspect-video w-full max-w-xs">
                  <img
                    src={formData.featured_image}
                    alt="Featured image preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40">
                    <ImageIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Editor Header: Visual vs Markdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Article Content</Label>
              <div className="flex items-center rounded-lg border bg-muted/40 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setEditorMode("rich")}
                  className={cn(
                    "px-3 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 cursor-pointer",
                    editorMode === "rich"
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Sparkles className="h-3 w-3 text-indigo-400" /> Visual Editor
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode("markdown")}
                  className={cn(
                    "px-3 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 cursor-pointer",
                    editorMode === "markdown"
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Code2 className="h-3 w-3 text-sky-400" /> Markdown / Raw HTML
                </button>
              </div>
            </div>

            {editorMode === "rich" ? (
              <Suspense
                fallback={<div className="h-[380px] rounded-xl border bg-muted/40 animate-pulse" />}
              >
                <RichTextEditor
                  content={formData.content || ""}
                  onChange={(html) => updateField("content", html)}
                  placeholder="Start writing or paste your article..."
                />
              </Suspense>
            ) : (
              <Textarea
                rows={18}
                value={formData.content || ""}
                onChange={(e) => updateField("content", e.target.value)}
                placeholder="# Write your post in Markdown..."
                className="font-mono text-xs leading-relaxed min-h-[420px] bg-slate-950/20"
              />
            )}
          </div>
        </div>

        {/* Sticky Footer Action Bar */}
        <DialogFooter className="p-4 px-6 border-t bg-card/80 backdrop-blur-md flex items-center justify-between sm:justify-between w-full shrink-0">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handlePreview}
              className="text-xs"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Preview
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={saving || publishing}
              className="border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-300 font-medium"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5 mr-1.5" />
              )}
              Save Draft
            </Button>

            {formData.scheduled_at && new Date(formData.scheduled_at).getTime() > Date.now() && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleScheduleRelease}
                disabled={saving || publishing}
                className="border-sky-500/30 hover:bg-sky-500/10 text-sky-400 font-medium"
              >
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Schedule Release
              </Button>
            )}

            <Button
              type="button"
              size="sm"
              onClick={handlePublishLive}
              disabled={saving || publishing}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm"
            >
              {publishing ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              )}
              {editing?.published ? "Update Live" : "Publish Live"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component: BlogManager ─────────────────────────────────────────────

export default function BlogManager() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const doAdminAction = useServerFn(adminContentAction);
  const doQuery = useServerFn(adminContentQuery);
  const doGenerateBlog = useServerFn(generateDeepResearchBlogPost);

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [initialOverride, setInitialOverride] = useState<Partial<BlogPost> | null>(null);
  const [deleting, setDeleting] = useState(false);

  // AI Deep Research Blog Dialog States
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiKeywords, setAiKeywords] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);

  // Fetch blog posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const result = await doQuery({
        data: { table: "blog_posts", columns: "*", orderBy: "created_at", ascending: false },
      });
      if (result && !Array.isArray(result)) return [];
      return (result ?? []) as unknown as BlogPost[];
    },
  });

  // Deep-link check on mount / URL changes
  useEffect(() => {
    const search = location.search as any;
    const editParam = search?.edit;
    if (!editParam) return;

    if (editParam === "new") {
      setEditing(null);
      setInitialOverride(null);
      setOpen(true);
    } else if (posts && posts.length > 0) {
      const found = posts.find((p) => p.id === editParam);
      if (found) {
        setEditing(found);
        setInitialOverride(null);
        setOpen(true);
      }
    }
  }, [location.search, posts]);

  const openNew = () => {
    setEditing(null);
    setInitialOverride(null);
    setOpen(true);
    navigate({
      to: "/admin/content",
      search: (prev: any) => ({ ...prev, tab: "blog", edit: "new" }),
      replace: true,
    });
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setInitialOverride(null);
    setOpen(true);
    navigate({
      to: "/admin/content",
      search: (prev: any) => ({ ...prev, tab: "blog", edit: post.id }),
      replace: true,
    });
  };

  const handleModalClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      navigate({
        to: "/admin/content",
        search: (prev: any) => {
          const { edit, ...rest } = prev || {};
          return { ...rest, tab: "blog" };
        },
        replace: true,
      });
    }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      const newStatus = !post.published;
      await doAdminAction({
        data: {
          table: "blog_posts",
          action: "update",
          id: post.id,
          data: {
            published: newStatus,
            published_at:
              newStatus && !post.published_at ? new Date().toISOString() : post.published_at,
          },
        },
      });
      toast.success(newStatus ? "Post published live" : "Post moved to draft");
      qc.invalidateQueries({ queryKey: ["blog-posts"] });
    } catch (e: any) {
      toast.error(e?.message || "Failed to update publish status");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await doAdminAction({
        data: { table: "blog_posts", action: "delete", id: deleteId },
      });
      toast.success("Post deleted");
      qc.invalidateQueries({ queryKey: ["blog-posts"] });
      setDeleteId(null);
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const handleGenerateBlog = async () => {
    if (!aiTopic.trim()) return toast.error("Please enter a research topic");
    setAiGenerating(true);
    try {
      const res = await doGenerateBlog({
        data: {
          topic: aiTopic.trim(),
          keywords: aiKeywords.trim() || undefined,
        },
      });
      if (res?.post) {
        setInitialOverride({
          title: res.post.title,
          slug: res.post.slug,
          excerpt: res.post.excerpt,
          featured_image: res.post.featured_image,
          content: res.post.content,
          published: false,
        });
        setAiDialogOpen(false);
        setEditing(null);
        setOpen(true);
        toast.success("Deep research blog drafted! Review, edit with word tools, and publish.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Generation failed");
    } finally {
      setAiGenerating(false);
    }
  };

  const seedDefaultPosts = async () => {
    const defaults = [
      {
        title: FREE_COURSES_GUIDE_POST.title,
        slug: FREE_COURSES_GUIDE_POST.slug,
        excerpt: FREE_COURSES_GUIDE_POST.excerpt,
        featured_image: FREE_COURSES_GUIDE_POST.featured_image,
        published: true,
        content: FREE_COURSES_GUIDE_POST.content,
      },
      ...BLOG_POSTS_DATA.map((p: any) => ({
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        featured_image: p.featured_image,
        published: true,
        content: p.content,
      })),
    ];

    try {
      for (const d of defaults) {
        await doAdminAction({ data: { table: "blog_posts", action: "insert", data: d } });
      }
      toast.success("Default blog posts with full research seeded!");
      qc.invalidateQueries({ queryKey: ["blog-posts"] });
    } catch (e: any) {
      toast.error(e?.message || "Seeding failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-base font-semibold">Blog Posts</h2>
          <p className="text-xs text-muted-foreground">
            Manage deep technical research articles, certifications, guides, and platform updates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAiDialogOpen(true)}
            className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
            AI Research Writer
          </Button>
          {!posts?.length && (
            <Button variant="outline" size="sm" onClick={seedDefaultPosts}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Seed 2026 Guide & Defaults
            </Button>
          )}
          <Button onClick={openNew} size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            New Post
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : !posts?.length ? (
        <div className="text-center py-12 border border-dashed rounded-xl space-y-3">
          <FileText className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-sm font-semibold">No blog posts in database yet</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Click below to populate the 2026 Free Courses & Certificates master guide.
          </p>
          <Button size="sm" onClick={seedDefaultPosts}>
            Seed 2026 Free Courses Guide
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 rounded-xl border bg-card/60 hover:bg-card transition gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                {post.featured_image ? (
                  <img
                    src={post.featured_image}
                    alt=""
                    className="h-12 w-12 rounded-lg object-cover border shrink-0"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-muted/60 border flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm truncate">{post.title}</h3>
                    <span
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0",
                        post.published
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : post.scheduled_at && new Date(post.scheduled_at).getTime() > Date.now()
                            ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      )}
                    >
                      {post.published
                        ? "Published"
                        : post.scheduled_at && new Date(post.scheduled_at).getTime() > Date.now()
                          ? `Scheduled (${format(new Date(post.scheduled_at), "MMM d, h:mm a")})`
                          : "Draft"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate max-w-md">
                    /blog/{post.slug}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  title="View post"
                  className="h-8 w-8 p-0"
                >
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => togglePublish(post)}
                  title={post.published ? "Unpublish (Move to draft)" : "Publish live"}
                  className="h-8 w-8 p-0"
                >
                  {post.published ? (
                    <Eye className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEdit(post)}
                  title="Edit post"
                  className="h-8 w-8 p-0"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteId(post.id)}
                  title="Delete post"
                  className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal with Draft Persistence & Autosave */}
      <BlogEditorModal
        open={open}
        onOpenChange={handleModalClose}
        editing={editing}
        initialOverride={initialOverride}
        onSaved={() => qc.invalidateQueries({ queryKey: ["blog-posts"] })}
      />

      {/* AI Deep Research Generator Dialog */}
      <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              AI Deep Research Blog Writer
            </DialogTitle>
            <DialogDescription>
              Researches and drafts comprehensive technical articles with comparisons, code snippets, and key takeaways.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Research Topic</Label>
              <Input
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="e.g., Guide to Free Certificates in 2026, Microservices vs Monolith"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Target Keywords (optional)</Label>
              <Input
                value={aiKeywords}
                onChange={(e) => setAiKeywords(e.target.value)}
                placeholder="e.g., CS50, freeCodeCamp, AWS, Google Cloud"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAiDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateBlog} disabled={aiGenerating}>
              {aiGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Researching...
                </>
              ) : (
                "Generate Draft"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(v) => {
          if (!v) setDeleteId(null);
        }}
      >
        <AlertDialogContent className="max-w-sm">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center">
              <Trash2 className="h-7 w-7 text-destructive" />
            </div>
            <div className="text-center space-y-1">
              <AlertDialogTitle className="text-lg">Delete this post?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground">
                This action cannot be undone. The post will be permanently removed.
              </AlertDialogDescription>
            </div>
          </div>
          <AlertDialogFooter className="grid grid-cols-2 gap-2">
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
