import { useCallback, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Search,
  Folder,
  Tag,
  Copy,
  Check,
  X,
  Edit,
  Grid,
  List as ListIcon,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { supabase } from "@/integrations/supabase/client";
import {
  wcmsListMedia,
  wcmsUploadMedia,
  wcmsUpdateMedia,
  wcmsDeleteMedia,
} from "@/lib/wcms.functions";

type MediaItem = {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  url: string;
  alt_text: string | null;
  folder: string;
  tags: string[];
  created_at: string;
};

const FOLDERS = ["All", "/", "images", "icons", "banners", "avatars", "documents", "videos"];
const TAGS = ["hero", "logo", "thumbnail", "icon", "banner", "avatar", "screenshot", "certificate"];

export default function MediaLibrary() {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const listMediaFn = useServerFn(wcmsListMedia);
  const uploadMediaFn = useServerFn(wcmsUploadMedia);
  const updateMediaFn = useServerFn(wcmsUpdateMedia);
  const deleteMediaFn = useServerFn(wcmsDeleteMedia);

  const [view, setView] = useState<"grid" | "list">("grid");
  const [folderFilter, setFolderFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [editItem, setEditItem] = useState<MediaItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const { data: media = [], isLoading } = useQuery({
    queryKey: ["wcms-media", folderFilter],
    queryFn: () =>
      listMediaFn({
        data: { folder: folderFilter === "All" ? undefined : folderFilter, limit: 200 },
      }),
  });

  const filtered = media.filter((m: MediaItem) =>
    search
      ? m.original_name.toLowerCase().includes(search.toLowerCase()) ||
        m.alt_text?.toLowerCase().includes(search.toLowerCase()) ||
        m.tags.some((t) => t.includes(search.toLowerCase()))
      : true,
  );

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setUploading(true);
      for (const file of Array.from(files)) {
        try {
          const ext = file.name.split(".").pop() ?? "bin";
          const path = `media/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
          const { error: uploadErr } = await supabase.storage
            .from("avatars")
            .upload(path, file, { contentType: file.type, upsert: false });
          if (uploadErr) throw uploadErr;
          const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
          await uploadMediaFn({
            data: {
              filename: path,
              original_name: file.name,
              mime_type: file.type,
              size_bytes: file.size,
              url: urlData.publicUrl,
              alt_text: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
              folder: "/",
              tags: [],
            },
          });
        } catch (e: any) {
          toast.error(`Failed to upload ${file.name}: ${e.message}`);
        }
      }
      setUploading(false);
      toast.success("Upload complete");
      qc.invalidateQueries({ queryKey: ["wcms-media"] });
    },
    [uploadMediaFn, qc],
  );

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
    toast.success("URL copied");
  };

  const removeMedia = async () => {
    if (!deleteId) return;
    try {
      await deleteMediaFn({ data: { id: deleteId } });
      toast.success("Deleted");
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    }
    setDeleteId(null);
    setSelected(null);
    qc.invalidateQueries({ queryKey: ["wcms-media"] });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold font-display flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" /> Media Library
          </h2>
          <p className="text-sm text-muted-foreground">
            Upload, manage, and organize all media files.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setView(view === "grid" ? "list" : "grid")}>
            {view === "grid" ? <ListIcon className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media..."
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {FOLDERS.map((f) => (
            <Button
              key={f}
              size="sm"
              variant={folderFilter === f ? "default" : "outline"}
              onClick={() => setFolderFilter(f)}
            >
              <Folder className="h-3 w-3 mr-1" /> {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Media Grid / List */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 border border-dashed rounded-xl text-muted-foreground">
          <ImageIcon className="h-10 w-10 mx-auto mb-3 opacity-20" />
          <p>No media files found. Upload your first file.</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((m: MediaItem) => (
            <div
              key={m.id}
              className="group relative rounded-xl border bg-card overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
              onClick={() => setSelected(m)}
            >
              {m.mime_type.startsWith("image/") ? (
                <img
                  src={m.url}
                  alt={m.alt_text ?? ""}
                  className="w-full aspect-square object-cover"
                  loading="lazy"
                />
              ) : m.mime_type.startsWith("video/") ? (
                <div className="w-full aspect-square bg-muted flex items-center justify-center">
                  <span className="text-3xl">🎬</span>
                </div>
              ) : (
                <div className="w-full aspect-square bg-muted flex items-center justify-center">
                  <span className="text-3xl">📄</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <p className="text-white text-xs truncate">{m.original_name}</p>
              </div>
              {m.tags.length > 0 && (
                <div className="absolute top-1 right-1 flex gap-1">
                  {m.tags.slice(0, 2).map((t) => (
                    <Badge key={t} className="text-[8px] px-1 py-0 bg-black/50 text-white border-0">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((m: MediaItem) => (
            <div
              key={m.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
              onClick={() => setSelected(m)}
            >
              {m.mime_type.startsWith("image/") ? (
                <img src={m.url} alt="" className="h-10 w-10 rounded object-cover" />
              ) : (
                <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-lg">
                  📄
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{m.original_name}</div>
                <div className="text-xs text-muted-foreground">
                  {formatSize(m.size_bytes)} · {m.folder}
                </div>
              </div>
              <div className="flex gap-1">
                {m.tags.slice(0, 3).map((t) => (
                  <Badge key={t} variant="outline" className="text-[10px]">
                    {t}
                  </Badge>
                ))}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(m.url);
                }}
              >
                {copiedUrl === m.url ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Media Detail Dialog */}
      {selected && (
        <Dialog open onOpenChange={(v) => !v && setSelected(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selected.original_name}</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              {selected.mime_type.startsWith("image/") && (
                <img
                  src={selected.url}
                  alt={selected.alt_text ?? ""}
                  className="w-full max-h-[300px] object-contain rounded-lg"
                />
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span> {selected.mime_type}
                </div>
                <div>
                  <span className="text-muted-foreground">Size:</span>{" "}
                  {formatSize(selected.size_bytes)}
                </div>
                <div>
                  <span className="text-muted-foreground">Folder:</span> {selected.folder}
                </div>
                <div>
                  <span className="text-muted-foreground">Tags:</span>{" "}
                  {selected.tags.join(", ") || "none"}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => copyToClipboard(selected.url)}>
                  {copiedUrl === selected.url ? (
                    <>
                      <Check className="h-4 w-4 mr-2" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" /> Copy URL
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setEditItem(selected)}>
                  <Edit className="h-4 w-4 mr-2" /> Edit Details
                </Button>
                <Button variant="outline" onClick={() => window.open(selected.url, "_blank")}>
                  <ImageIcon className="h-4 w-4 mr-2" /> Open Full
                </Button>
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteId(selected.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Media Dialog */}
      {editItem && (
        <MediaEditDialog
          item={editItem}
          onSave={async (updates) => {
            await updateMediaFn({ data: { id: editItem.id, ...updates } });
            toast.success("Updated");
            setEditItem(null);
            qc.invalidateQueries({ queryKey: ["wcms-media"] });
          }}
          onCancel={() => setEditItem(null)}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={removeMedia}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function MediaEditDialog({
  item,
  onSave,
  onCancel,
}: {
  item: MediaItem;
  onSave: (updates: { alt_text?: string; folder?: string; tags?: string[] }) => void;
  onCancel: () => void;
}) {
  const [altText, setAltText] = useState(item.alt_text ?? "");
  const [folder, setFolder] = useState(item.folder);
  const [tags, setTags] = useState(item.tags.join(", "));

  return (
    <Dialog open onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Media</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Alt Text</Label>
            <Input
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe this media"
            />
          </div>
          <div className="space-y-2">
            <Label>Folder</Label>
            <Input
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              placeholder="/images"
            />
          </div>
          <div className="space-y-2">
            <Label>Tags (comma-separated)</Label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="hero, banner, logo"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {TAGS.map((t) => (
              <Button
                key={t}
                size="sm"
                variant="outline"
                className="text-xs h-6"
                onClick={() => setTags(tags ? `${tags}, ${t}` : t)}
              >
                + {t}
              </Button>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              onSave({
                alt_text: altText,
                folder,
                tags: tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              })
            }
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
