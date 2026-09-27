"use client";

import { useState, lazy, Suspense } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { FREE_COURSES_GUIDE_POST } from "@/lib/canonical-blog";
import { BLOG_POSTS_DATA } from "@/lib/blog-posts-data";
import { generateDeepResearchBlogPost } from "@/lib/admin-content.functions";
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

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  author_id: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
};

export default function BlogManager() {
  const qc = useQueryClient();
  const doAdminAction = useServerFn(adminContentAction);
  const doQuery = useServerFn(adminContentQuery);
  const doGenerateBlog = useServerFn(generateDeepResearchBlogPost);

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editorMode, setEditorMode] = useState<"rich" | "markdown">("rich");

  // AI Deep Research Blog Dialog States
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiKeywords, setAiKeywords] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);

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

  const [form, setForm] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featured_image: "",
    published: false,
  });

  const openNew = () => {
    setEditing(null);
    setForm({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      featured_image: "",
      published: false,
    });
    setEditorMode("rich");
    setOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({ ...post });
    if (post.content && (post.content.trim().startsWith("#") || post.content.includes("## "))) {
      setEditorMode("markdown");
    } else {
      setEditorMode("rich");
    }
    setOpen(true);
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

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

  const save = async () => {
    if (!form.title?.trim()) return toast.error("Title required");
    const slug = form.slug?.trim() || slugify(form.title);
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug,
        content: form.content || "",
        excerpt: form.excerpt?.trim() || null,
        featured_image: form.featured_image?.trim() || null,
        published: !!form.published,
        published_at:
          form.published && !editing?.published_at
            ? new Date().toISOString()
            : editing?.published_at || null,
      };
      if (editing) {
        const res = await doAdminAction({
          data: { table: "blog_posts", action: "update", id: editing.id, data: payload },
        });
        if (!res) throw new Error("No response from server");
      } else {
        await doAdminAction({ data: { table: "blog_posts", action: "insert", data: payload } });
      }
      toast.success(editing ? "Post updated" : "Post created");
      qc.invalidateQueries({ queryKey: ["blog-posts"] });
      setOpen(false);
    } catch (e: any) {
      toast.error(e?.message || "Save failed");
    } finally {
      setSaving(false);
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
        setForm({
          title: res.post.title,
          slug: res.post.slug,
          excerpt: res.post.excerpt,
          featured_image: res.post.featured_image,
          content: res.post.content,
          published: false,
        });
        setEditorMode("markdown");
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
        <p className="text-sm text-muted-foreground">
          Deep technical research blogs with tables, diagrams, SEO metadata, and rich editing.
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAiDialogOpen(true)}
            className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
            AI Deep Research Writer
          </Button>
          {!posts?.length && (
            <Button variant="outline" size="sm" onClick={seedDefaultPosts}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Seed Canonical Posts
            </Button>
          )}
          <Button onClick={openNew}>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : !posts?.length ? (
        <div className="text-center py-12 border border-dashed rounded-xl space-y-3">
          <FileText className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-sm font-semibold">No blog posts in database yet</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Click 'Seed Default Posts' to populate initial articles into your database.
          </p>
          <Button size="sm" onClick={seedDefaultPosts}>
            Seed Default Posts
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post: BlogPost) => (
            <div key={post.id} className="rounded-xl border bg-card p-4 flex items-center gap-3">
              {post.featured_image ? (
                <img
                  src={post.featured_image}
                  alt=""
                  className="h-14 w-20 rounded-md object-cover shrink-0"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="h-14 w-20 rounded-md bg-muted grid place-items-center shrink-0 text-xs text-muted-foreground">
                  No img
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-semibold truncate flex items-center gap-2">
                  <span className="truncate">{post.title}</span>
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0",
                      post.published
                        ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                        : "bg-muted text-muted-foreground border border-border/50"
                    )}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] text-primary/80">/blog/{post.slug}</span>
                  <span>· {format(new Date(post.created_at), "PP")}</span>
                  {post.excerpt && <span className="truncate max-w-[240px]">· {post.excerpt}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  asChild
                  title="View post in new tab"
                  className="h-8 w-8 p-0"
                >
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
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
                    <Eye className="h-3.5 w-3.5 text-green-500" />
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

      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) setOpen(false);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Post" : "New Post"}</DialogTitle>
            <DialogDescription>
              Write your blog post using the rich text editor below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Title</Label>
                <Input
                  value={form.title || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                      slug: editing ? form.slug : slugify(e.target.value),
                    })
                  }
                  placeholder="Post title"
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={form.slug || ""}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="post-url-slug"
                />
              </div>
            </div>
            <div>
              <Label>Excerpt</Label>
              <Textarea
                rows={2}
                value={form.excerpt || ""}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Short summary shown in blog listing"
              />
            </div>
            <div>
              <Label>Featured image URL</Label>
              <Input
                value={form.featured_image || ""}
                onChange={(e) => setForm({ ...form, featured_image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label>Content</Label>
                <div className="flex items-center rounded-lg border bg-muted/40 p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setEditorMode("rich")}
                    className={cn(
                      "px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5",
                      editorMode === "rich"
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Sparkles className="h-3 w-3" /> Visual Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode("markdown")}
                    className={cn(
                      "px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5",
                      editorMode === "markdown"
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Code2 className="h-3 w-3" /> Markdown / Raw HTML
                  </button>
                </div>
              </div>

              {editorMode === "rich" ? (
                <Suspense
                  fallback={<div className="h-[300px] rounded-xl border bg-muted animate-pulse" />}
                >
                  <RichTextEditor
                    content={form.content || ""}
                    onChange={(html) => setForm({ ...form, content: html })}
                    placeholder="Start writing your blog post..."
                  />
                </Suspense>
              ) : (
                <Textarea
                  rows={16}
                  value={form.content || ""}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="# Write your post in Markdown..."
                  className="font-mono text-xs leading-relaxed min-h-[350px]"
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={!!form.published}
                onCheckedChange={(v) => setForm({ ...form, published: v })}
              />
              <Label className="cursor-pointer">Published</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={deleting} className="flex-1">
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              className="flex-1"
              disabled={deleting}
              onClick={async () => {
                setDeleting(true);
                try {
                  const id = deleteId;
                  if (!id) return;
                  await doAdminAction({ data: { table: "blog_posts", action: "delete", id } });
                  toast.success("Post deleted");
                  qc.invalidateQueries({ queryKey: ["blog-posts"] });
                } catch (err: any) {
                  toast.error(err?.message || "Delete failed");
                } finally {
                  setDeleteId(null);
                  setDeleting(false);
                }
              }}
            >
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AI Deep Research Writer Dialog */}
      <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              AI Deep Research Blog Writer
            </DialogTitle>
            <DialogDescription>
              Generate a publication-grade, deeply researched 2026 technical blog with architecture diagrams, comparison tables, code examples, and SEO keywords.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Research Topic / Headline</Label>
              <Input
                placeholder="e.g. How to Become a Full-Stack AI Engineer in 2026: The Complete Roadmap"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Target SEO Keywords (Optional)</Label>
              <Input
                placeholder="e.g. TanStack Start, React 19, LangGraph, Supabase pgvector"
                value={aiKeywords}
                onChange={(e) => setAiKeywords(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Quick 2026 Research Ideas
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "How to Become a Full-Stack AI Engineer in 2026: The Complete Roadmap",
                  "Building Production Autonomous AI Agents with LangGraph & Python",
                  "Comparing Cashfree vs Razorpay for Indian EdTech & SaaS Applications",
                  "Building Real-Time Bidirectional Voice Agents with WebSockets",
                  "Next-Gen Vector Search: pgvector vs Qdrant vs Milvus in 2026",
                ].map((idea) => (
                  <button
                    key={idea}
                    type="button"
                    onClick={() => setAiTopic(idea)}
                    className="text-[11px] px-2.5 py-1 rounded-lg border border-border/80 bg-muted/40 hover:bg-muted text-left transition truncate max-w-full cursor-pointer"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAiDialogOpen(false)}
              disabled={aiGenerating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateBlog}
              disabled={aiGenerating || !aiTopic.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
            >
              {aiGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deep Researching & Drafting...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Deep Blog
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
