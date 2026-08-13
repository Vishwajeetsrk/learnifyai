import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  BookMarked,
  StickyNote,
  Image as ImageIcon,
  Video,
  FileCode2,
  Upload,
  Trash2,
  Download,
  Loader2,
  Plus,
  Pencil,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const RESOURCE_TYPES = [
  { value: "pdf", label: "PDF", icon: FileText, accept: ".pdf" },
  { value: "cheatsheet", label: "Cheat Sheet", icon: BookMarked, accept: ".pdf,.png,.jpg,.jpeg,.webp" },
  { value: "notes", label: "Notes", icon: StickyNote, accept: ".pdf,.md,.txt" },
  { value: "image", label: "Photo / Diagram", icon: ImageIcon, accept: ".png,.jpg,.jpeg,.svg,.webp" },
  { value: "video", label: "Video", icon: Video, accept: ".mp4,.webm" },
  { value: "content", label: "Content File", icon: FileCode2, accept: ".html,.md,.txt,.zip,.json,.csv" },
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number]["value"];

export function typeMeta(t: string) {
  return RESOURCE_TYPES.find((r) => r.value === t) ?? RESOURCE_TYPES[0];
}

export function useCourseResources(courseId: string | null) {
  return useQuery({
    enabled: !!courseId,
    queryKey: ["course-resources-list", courseId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("course_resources")
        .select("*")
        .eq("course_id", courseId)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as any[];
    },
  });
}

export function resourceDownloadUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${window.location.origin}${url}`;
  return `${window.location.origin}/${url}`;
}

/* ── Read-only list (student course player Resources tab) ── */
export function CourseResourcesList({ courseId }: { courseId: string }) {
  const { data: resources = [], isLoading } = useCourseResources(courseId);

  if (isLoading) return <div className="text-sm text-muted-foreground py-4">Loading resources...</div>;
  if (resources.length === 0)
    return (
      <p className="text-sm text-muted-foreground">
        No downloadable resources for this course yet.
      </p>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {resources.map((r: any) => {
        const meta = typeMeta(r.type);
        const Icon = meta.icon;
        return (
          <a
            key={r.id}
            href={resourceDownloadUrl(r.file_url)}
            download={r.title.replace(/[^\w.\- ]+/g, "").trim() || "resource"}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-3.5 hover:border-primary/40 hover:shadow-md transition-all group"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold truncate">{r.title}</p>
                <Badge variant="secondary" className="text-[9px] capitalize shrink-0">
                  {meta.label}
                </Badge>
              </div>
              {r.description && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">{r.description}</p>
              )}
            </div>
            <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
          </a>
        );
      })}
    </div>
  );
}

/* ── Manage dialog (Creator Studio + Admin Course System) ── */
export function CourseResourcesDialog({
  courseId,
  courseTitle,
  onClose,
}: {
  courseId: string;
  courseTitle?: string;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const { data: resources = [], isLoading } = useCourseResources(courseId);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<string>("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const invalidate = () => qc.invalidateQueries({ queryKey: ["course-resources-list", courseId] });

  const uploadFile = async (f: File) => {
    const safe = f.name.replace(/[^\w.\- ]+/g, "_");
    const path = `course-resources/${courseId}/${Date.now()}-${safe}`;
    const { error: upErr } = await supabase.storage.from("media").upload(path, f, {
      contentType: f.type,
    });
    if (upErr) throw upErr;
    const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
    return urlData?.publicUrl ?? "";
  };

  const handleAdd = async () => {
    if (!file) return toast.error("Choose a file to upload");
    if (!title.trim()) return toast.error("Give the resource a title");
    setUploading(true);
    try {
      const url = await uploadFile(file);
      const { error } = await (supabase as any).from("course_resources").insert({
        course_id: courseId,
        title: title.trim(),
        description: description.trim() || null,
        type,
        file_url: url,
        sort_order: resources.length,
      });
      if (error) throw error;
      toast.success("Resource added");
      setFile(null);
      setTitle("");
      setDescription("");
      setAdding(false);
      invalidate();
    } catch (e: any) {
      toast.error(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (r: any) => {
    const { error } = await (supabase as any)
      .from("course_resources")
      .delete()
      .eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success("Resource deleted");
    invalidate();
  };

  const handleSaveEdit = async (r: any) => {
    if (!editTitle.trim()) return toast.error("Title required");
    const { error } = await (supabase as any)
      .from("course_resources")
      .update({ title: editTitle.trim() })
      .eq("id", r.id);
    if (error) return toast.error(error.message);
    setEditingId(null);
    invalidate();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[85dvh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Course Resources</DialogTitle>
          <DialogDescription>
            {courseTitle ? `${courseTitle} — ` : ""}PDFs, cheat sheets, notes, images, videos and
            content files learners can download.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {isLoading ? (
            <div className="py-8 grid place-items-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : resources.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No resources yet. Add your first PDF, cheat sheet or notes.
            </p>
          ) : (
            resources.map((r: any) => {
              const meta = typeMeta(r.type);
              const Icon = meta.icon;
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-3 rounded-xl border border-border/70 p-3"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="h-[18px] w-[18px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    {editingId === r.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="h-8 text-xs"
                          autoFocus
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => handleSaveEdit(r)}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => setEditingId(null)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold truncate">{r.title}</p>
                          <Badge variant="secondary" className="text-[9px] capitalize shrink-0">
                            {meta.label}
                          </Badge>
                        </div>
                        {r.description && (
                          <p className="text-xs text-muted-foreground truncate">{r.description}</p>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      title="Download"
                      onClick={() => window.open(resourceDownloadUrl(r.file_url), "_blank")}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      title="Rename"
                      onClick={() => {
                        setEditingId(r.id);
                        setEditTitle(r.title);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      title="Delete"
                      onClick={() => handleDelete(r)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}

          {adding && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {RESOURCE_TYPES.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setType(t.value)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-medium transition cursor-pointer",
                        type === t.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/70 hover:bg-muted",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" /> {t.label}
                    </button>
                  );
                })}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">File *</Label>
                <input
                  ref={fileRef}
                  type="file"
                  accept={typeMeta(type).accept}
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary cursor-pointer"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Title *</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Python Cheat Sheet (PDF)"
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Description</Label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional short note"
                    className="h-9 text-xs"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => {
                    setAdding(false);
                    setFile(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="text-xs gap-1.5"
                  onClick={handleAdd}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="h-3.5 w-3.5" />
                  )}
                  Upload & Add
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="border-t pt-3 flex items-center justify-between gap-2 shrink-0">
          {!adding ? (
            <Button size="sm" className="gap-1.5 text-xs" onClick={() => setAdding(true)}>
              <Plus className="h-3.5 w-3.5" /> Add Resource
            </Button>
          ) : (
            <span />
          )}
          <Button size="sm" variant="outline" className="text-xs" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}