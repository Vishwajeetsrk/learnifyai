"use client";

import { useState, lazy, Suspense } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { adminContentAction, adminContentQuery } from "@/lib/admin-content.functions";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Loader2, Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";

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
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const result = await doQuery({ data: { table: "blog_posts", columns: "*", orderBy: "created_at", ascending: false } });
      return (result ?? []) as BlogPost[];
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
    setForm({ title: "", slug: "", content: "", excerpt: "", featured_image: "", published: false });
    setOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({ ...post });
    setOpen(true);
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
        published_at: form.published && !editing?.published_at ? new Date().toISOString() : editing?.published_at || null,
      };
      if (editing) {
        const res = await doAdminAction({ data: { table: "blog_posts", action: "update", id: editing.id, data: payload } });
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

  const [deleting, setDeleting] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Create and manage blog posts with the rich text editor.</p>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />New Post</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>
      ) : !posts?.length ? (
        <p className="text-sm text-muted-foreground text-center py-10">No posts yet.</p>
      ) : (
        <div className="space-y-2">
          {posts.map((post: BlogPost) => (
            <div key={post.id} className="rounded-xl border bg-card p-4 flex items-center gap-3">
              {post.featured_image ? (
                <img src={post.featured_image} alt="" className="h-14 w-20 rounded-md object-cover shrink-0" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="h-14 w-20 rounded-md bg-muted grid place-items-center shrink-0 text-xs text-muted-foreground">No img</div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-semibold truncate flex items-center gap-2">
                  {post.title}
                  {post.published ? <Eye className="h-3 w-3 text-green-500" /> : <EyeOff className="h-3 w-3 text-muted-foreground" />}
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-2">
                  <span>/blog/{post.slug}</span>
                  <span>· {format(new Date(post.created_at), "PP")}</span>
                  {post.excerpt && <span className="truncate max-w-[200px]">· {post.excerpt}</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => openEdit(post)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="outline" onClick={() => setDeleteId(post.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={(v) => { if (!v) setOpen(false); }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Post" : "New Post"}</DialogTitle>
            <DialogDescription>Write your blog post using the rich text editor below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Title</Label>
                <Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })} placeholder="Post title" />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={form.slug || ""} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="post-url-slug" />
              </div>
            </div>
            <div>
              <Label>Excerpt</Label>
              <Textarea rows={2} value={form.excerpt || ""} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Short summary shown in blog listing" />
            </div>
            <div>
              <Label>Featured image URL</Label>
              <Input value={form.featured_image || ""} onChange={(e) => setForm({ ...form, featured_image: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <Label>Content</Label>
              <Suspense fallback={<div className="h-[300px] rounded-xl border bg-muted animate-pulse" />}>
                <RichTextEditor
                  content={form.content || ""}
                  onChange={(html) => setForm({ ...form, content: html })}
                  placeholder="Start writing your blog post..."
                />
              </Suspense>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={!!form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
              <Label className="cursor-pointer">Published</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
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
            <AlertDialogCancel disabled={deleting} className="flex-1">Cancel</AlertDialogCancel>
            <Button variant="destructive" className="flex-1" disabled={deleting} onClick={async () => {
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
            }}>
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
