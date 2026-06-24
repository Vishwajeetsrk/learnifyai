import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Copy,
  FileText,
  Globe,
  ArrowUp,
  ArrowDown,
  X,
  Save,
  Layout,
  Type,
  Image,
  Video,
  Code,
  MessageSquare,
  List,
  Columns,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  wcmsListPages,
  wcmsUpsertPage,
  wcmsDeletePage,
  wcmsListBlocks,
  wcmsSaveBlocks,
  wcmsDeleteBlock,
} from "@/lib/wcms.functions";
import { PagePreviewDialog } from "./PagePreviewDialog";

// ═══════════════════════════════════════════════════════════════
// Block Type Definitions
// ═══════════════════════════════════════════════════════════════

const BLOCK_TYPES = [
  { value: "hero", label: "Hero Section", icon: Sparkles, category: "layout" },
  { value: "text", label: "Text Block", icon: Type, category: "content" },
  { value: "image", label: "Image", icon: Image, category: "media" },
  { value: "video", label: "Video Embed", icon: Video, category: "media" },
  { value: "code", label: "Code Block", icon: Code, category: "content" },
  { value: "cta", label: "Call to Action", icon: MessageSquare, category: "conversion" },
  { value: "features", label: "Feature Grid", icon: Columns, category: "layout" },
  { value: "list", label: "List / Bullet Points", icon: List, category: "content" },
  { value: "faq", label: "FAQ Accordion", icon: MessageSquare, category: "content" },
  { value: "pricing", label: "Pricing Table", icon: Sparkles, category: "conversion" },
  { value: "testimonial", label: "Testimonial", icon: MessageSquare, category: "social" },
  { value: "spacer", label: "Spacer / Divider", icon: Layout, category: "layout" },
  { value: "html", label: "Custom HTML", icon: Code, category: "advanced" },
  { value: "markdown", label: "Markdown", icon: FileText, category: "content" },
] as const;

type BlockContent = Record<string, unknown>;

const DEFAULT_BLOCK_CONTENT: Record<string, BlockContent> = {
  hero: {
    heading: "Welcome",
    subheading: "Your subheading here",
    background_color: "#0f172a",
    text_color: "#ffffff",
    cta_text: "Get Started",
    cta_url: "#",
  },
  text: { html: "<p>Enter your text here...</p>", alignment: "left" },
  image: { src: "", alt: "", caption: "", width: "100%", rounded: true },
  video: { url: "", caption: "" },
  code: { language: "javascript", code: "console.log('Hello');" },
  cta: {
    heading: "Ready to start?",
    subheading: "Join thousands of learners",
    button_text: "Sign Up Free",
    button_url: "/signin",
    background_color: "#6366f1",
  },
  features: {
    columns: 3,
    items: [{ title: "Feature 1", description: "Description", icon: "Sparkles" }],
  },
  list: { items: ["Item 1", "Item 2", "Item 3"], style: "bullet" },
  faq: { items: [{ question: "Question 1?", answer: "Answer 1" }] },
  pricing: {
    plans: [{ name: "Starter", price: "Free", features: ["Feature 1"], cta_text: "Get Started" }],
  },
  testimonianl: {
    quote: "Amazing platform!",
    author: "John Doe",
    role: "Developer",
    avatar_url: "",
  },
  spacer: { height: 64 },
  html: { content: "<div>Custom HTML</div>" },
  markdown: { content: "# Hello World" },
};

type WcmsPage = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  published: boolean;
  template: string;
  sort_order: number;
  created_at: string;
};

type WcmsBlock = {
  id: string;
  page_id: string;
  block_type: string;
  label: string | null;
  content: BlockContent;
  sort_order: number;
  visible: boolean;
};

// ═══════════════════════════════════════════════════════════════
// Page Manager Component
// ═══════════════════════════════════════════════════════════════

export default function PageManager() {
  const qc = useQueryClient();
  const listPagesFn = useServerFn(wcmsListPages);
  const upsertPageFn = useServerFn(wcmsUpsertPage);
  const deletePageFn = useServerFn(wcmsDeletePage);

  const [editing, setEditing] = useState<WcmsPage | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingBlocksFor, setEditingBlocksFor] = useState<WcmsPage | null>(null);
  const [previewPage, setPreviewPage] = useState<WcmsPage | null>(null);

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ["wcms-pages"],
    queryFn: () => listPagesFn(),
  });

  const newPage = () => {
    setEditing({
      id: "",
      slug: "",
      title: "",
      description: "",
      meta_title: null,
      meta_description: null,
      og_image_url: null,
      published: false,
      template: "default",
      sort_order: pages.length,
      created_at: "",
    });
    setOpen(true);
  };

  const savePage = async () => {
    if (!editing) return;
    if (!editing.slug || !editing.title) return toast.error("Slug and title required");
    try {
      await upsertPageFn({
        data: {
          ...editing,
          slug: editing.slug
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-")
            .replace(/-+/g, "-"),
        },
      });
      toast.success(editing.id ? "Page updated" : "Page created");
      setOpen(false);
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["wcms-pages"] });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message || "Save failed");
    }
  };

  const removePage = async () => {
    if (!deleteId) return;
    try {
      await deletePageFn({ data: { id: deleteId } });
      toast.success("Page deleted");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    }
    setDeleteId(null);
    qc.invalidateQueries({ queryKey: ["wcms-pages"] });
  };

  const movePage = async (idx: number, dir: -1 | 1) => {
    const reordered = [...pages];
    const swap = idx + dir;
    if (swap < 0 || swap >= reordered.length) return;
    [reordered[idx], reordered[swap]] = [reordered[swap], reordered[idx]];
    for (let i = 0; i < reordered.length; i++) {
      await upsertPageFn({
        data: {
          id: reordered[i].id,
          slug: reordered[i].slug,
          title: reordered[i].title,
          sort_order: i,
          published: reordered[i].published,
        },
      });
    }
    qc.invalidateQueries({ queryKey: ["wcms-pages"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold font-display flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" /> Page Manager
          </h2>
          <p className="text-sm text-muted-foreground">
            Create, edit, and manage all website pages with drag-drop blocks.
          </p>
        </div>
        <Button onClick={newPage}>
          <Plus className="h-4 w-4 mr-2" /> New Page
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : pages.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">
          No pages yet. Create your first page.
        </p>
      ) : (
        <div className="space-y-2">
          {pages.map((p: WcmsPage, idx: number) => (
            <div
              key={p.id}
              className="rounded-xl border bg-card p-4 flex items-center gap-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => movePage(idx, -1)}
                  disabled={idx === 0}
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => movePage(idx, 1)}
                  disabled={idx === pages.length - 1}
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>
              <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{p.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5 flex gap-3">
                  <span className="font-mono">/{p.slug}</span>
                  <span>{p.template}</span>
                </div>
              </div>
              <Badge variant={p.published ? "default" : "secondary"}>
                {p.published ? (
                  <>
                    <Eye className="h-3 w-3 mr-1" /> Live
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" /> Draft
                  </>
                )}
              </Badge>
              <div className="flex gap-1 shrink-0">
                {p.published && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPreviewPage(p)}
                    title="Preview"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => setEditingBlocksFor(p)}>
                  <Layout className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(p);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDeleteId(p.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Page Edit Dialog */}
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) {
            setOpen(false);
            setEditing(null);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit Page" : "New Page"}</DialogTitle>
            <DialogDescription>Configure page settings, SEO, and visibility.</DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="Home Page"
                />
              </div>
              <div className="space-y-2">
                <Label>URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">/</span>
                  <Input
                    value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    placeholder="home"
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Meta Title (SEO)</Label>
                  <Input
                    value={editing.meta_title ?? ""}
                    onChange={(e) => setEditing({ ...editing, meta_title: e.target.value || null })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select
                    value={editing.template}
                    onValueChange={(v) => setEditing({ ...editing, template: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="landing">Landing Page</SelectItem>
                      <SelectItem value="blog">Blog Post</SelectItem>
                      <SelectItem value="fullwidth">Full Width</SelectItem>
                      <SelectItem value="sidebar">With Sidebar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Meta Description (SEO)</Label>
                <Textarea
                  value={editing.meta_description ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, meta_description: e.target.value || null })
                  }
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>OG Image URL</Label>
                <Input
                  value={editing.og_image_url ?? ""}
                  onChange={(e) => setEditing({ ...editing, og_image_url: e.target.value || null })}
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={editing.published}
                  onCheckedChange={(v) => setEditing({ ...editing, published: v })}
                />
                <Label>{editing.published ? "Published (live)" : "Draft (hidden)"}</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setEditing(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={savePage}>
              <Save className="h-4 w-4 mr-2" /> Save Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this page and all its blocks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={removePage}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Block Editor */}
      {editingBlocksFor && (
        <BlockEditor page={editingBlocksFor} onClose={() => setEditingBlocksFor(null)} />
      )}

      {/* Page Preview */}
      {previewPage && (
        <PagePreviewDialog
          pageId={previewPage.id}
          pageTitle={previewPage.title}
          open={!!previewPage}
          onOpenChange={(v) => !v && setPreviewPage(null)}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Block Editor (inline dialog with drag-drop)
// ═══════════════════════════════════════════════════════════════

function BlockEditor({ page, onClose }: { page: WcmsPage; onClose: () => void }) {
  const qc = useQueryClient();
  const listBlocksFn = useServerFn(wcmsListBlocks);
  const saveBlocksFn = useServerFn(wcmsSaveBlocks);
  const [blocks, setBlocks] = useState<WcmsBlock[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<WcmsBlock | null>(null);
  const [saving, setSaving] = useState(false);

  useQuery({
    queryKey: ["wcms-blocks", page.id],
    queryFn: async () => {
      const result = await listBlocksFn({ data: { pageId: page.id } });
      setBlocks(result as WcmsBlock[]);
      setLoaded(true);
      return result;
    },
  });

  const addBlock = (type: string) => {
    const def = DEFAULT_BLOCK_CONTENT[type] ?? {};
    const newBlock: WcmsBlock = {
      id: crypto.randomUUID(),
      page_id: page.id,
      block_type: type,
      label: BLOCK_TYPES.find((b) => b.value === type)?.label ?? type,
      content: { ...def },
      sort_order: blocks.length,
      visible: true,
    };
    setBlocks([...blocks, newBlock]);
    setAddMenuOpen(false);
  };

  const updateBlock = (id: string, updates: Partial<WcmsBlock>) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const moveBlock = (idx: number, dir: -1 | 1) => {
    const arr = [...blocks];
    const swap = idx + dir;
    if (swap < 0 || swap >= arr.length) return;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
    setBlocks(arr.map((b, i) => ({ ...b, sort_order: i })));
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      await saveBlocksFn({
        data: {
          pageId: page.id,
          blocks: blocks.map((b, i) => ({
            id: b.id.startsWith("crypto") ? undefined : b.id,
            block_type: b.block_type,
            label: b.label,
            content: b.content,
            sort_order: i,
            visible: b.visible,
          })),
        },
      });
      toast.success("Blocks saved");
      qc.invalidateQueries({ queryKey: ["wcms-blocks", page.id] });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message || "Save failed");
    }
    setSaving(false);
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" /> Editing: {page.title}
          </DialogTitle>
          <DialogDescription>
            Add, remove, and reorder content blocks for this page.
          </DialogDescription>
        </DialogHeader>

        {!loaded ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <div className="space-y-3 mt-4">
            {blocks.length === 0 && (
              <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground">
                <Layout className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p>No blocks yet. Click below to add your first content block.</p>
              </div>
            )}
            {blocks.map((block, idx) => {
              const bt = BLOCK_TYPES.find((b) => b.value === block.block_type);
              const Icon = bt?.icon ?? FileText;
              return (
                <div
                  key={block.id}
                  className={`rounded-xl border p-3 flex items-center gap-3 group transition-colors ${block.visible ? "bg-card" : "bg-muted/30 opacity-60"}`}
                >
                  <div className="flex flex-col gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4"
                      onClick={() => moveBlock(idx, -1)}
                      disabled={idx === 0}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4"
                      onClick={() => moveBlock(idx, 1)}
                      disabled={idx === blocks.length - 1}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                  <Icon className="h-4 w-4 text-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium">{block.label || block.block_type}</span>
                    <span className="text-xs text-muted-foreground ml-2">{block.block_type}</span>
                  </div>
                  <Switch
                    checked={block.visible}
                    onCheckedChange={(v) => updateBlock(block.id, { visible: v })}
                    className="scale-75"
                  />
                  <Button size="sm" variant="ghost" onClick={() => setEditingBlock(block)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeBlock(block.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}

            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={() => setAddMenuOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Block
            </Button>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={saveAll} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Blocks
          </Button>
        </DialogFooter>

        {/* Add Block Menu */}
        <Dialog open={addMenuOpen} onOpenChange={setAddMenuOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Content Block</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {BLOCK_TYPES.map((bt) => {
                const Icon = bt.icon;
                return (
                  <Button
                    key={bt.value}
                    variant="outline"
                    className="justify-start h-auto py-3 flex-col items-start"
                    onClick={() => addBlock(bt.value)}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{bt.label}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 uppercase">
                      {bt.category}
                    </span>
                  </Button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>

        {/* Block Content Editor */}
        {editingBlock && (
          <BlockContentEditor
            block={editingBlock}
            onSave={(content) => {
              updateBlock(editingBlock.id, {
                content,
                label: (content.label as string) ?? editingBlock.label,
              });
              setEditingBlock(null);
            }}
            onCancel={() => setEditingBlock(null)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════════════════════
// Block Content Editor (per-type forms)
// ═══════════════════════════════════════════════════════════════

function BlockContentEditor({
  block,
  onSave,
  onCancel,
}: {
  block: WcmsBlock;
  onSave: (content: Record<string, unknown>) => void;
  onCancel: () => void;
}) {
  const [content, setContent] = useState({ ...block.content });
  const type = block.block_type;

  const field = (
    key: string,
    label: string,
    type: "text" | "textarea" | "url" | "number" = "text",
  ) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {type === "textarea" ? (
        <Textarea
          value={(content[key] as string) ?? ""}
          onChange={(e) => setContent({ ...content, [key]: e.target.value })}
          rows={3}
        />
      ) : (
        <Input
          type={type}
          value={(content[key] as string | number) ?? ""}
          onChange={(e) =>
            setContent({
              ...content,
              [key]: type === "number" ? Number(e.target.value) : e.target.value,
            })
          }
        />
      )}
    </div>
  );

  const renderFields = () => {
    switch (type) {
      case "hero":
        return (
          <>
            {field("heading", "Heading")}
            {field("subheading", "Subheading", "textarea")}
            {field("cta_text", "Button Text")}
            {field("cta_url", "Button URL", "url")}
            {field("background_color", "Background Color", "text")}
            {field("text_color", "Text Color", "text")}
          </>
        );
      case "text":
        return (
          <>
            {field("html", "HTML Content", "textarea")}
            {field("alignment", "Alignment (left/center/right)")}
          </>
        );
      case "image":
        return (
          <>
            {field("src", "Image URL", "url")}
            {field("alt", "Alt Text")}
            {field("caption", "Caption")}
            {field("width", "Width (e.g. 100%, 500px)")}
          </>
        );
      case "video":
        return (
          <>
            {field("url", "Video URL (YouTube/Vimeo)", "url")}
            {field("caption", "Caption")}
          </>
        );
      case "code":
        return (
          <>
            {field("language", "Language (js/python/html)")}
            {field("code", "Code", "textarea")}
          </>
        );
      case "cta":
        return (
          <>
            {field("heading", "Heading")}
            {field("subheading", "Subheading")}
            {field("button_text", "Button Text")}
            {field("button_url", "Button URL", "url")}
            {field("background_color", "Background Color")}
          </>
        );
      case "spacer":
        return <>{field("height", "Height in px", "number")}</>;
      case "html":
        return <>{field("content", "HTML Content", "textarea")}</>;
      case "markdown":
        return <>{field("content", "Markdown Content", "textarea")}</>;
      case "list":
        return (
          <div className="space-y-2">
            <Label>Items (one per line)</Label>
            <Textarea
              value={((content.items as string[]) ?? []).join("\n")}
              onChange={(e) =>
                setContent({ ...content, items: e.target.value.split("\n").filter(Boolean) })
              }
              rows={5}
            />
            <Select
              value={(content.style as string) ?? "bullet"}
              onValueChange={(v) => setContent({ ...content, style: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bullet">Bullet List</SelectItem>
                <SelectItem value="numbered">Numbered List</SelectItem>
                <SelectItem value="checklist">Checklist</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case "faq":
        return (
          <div className="space-y-3">
            <Label>FAQ Items</Label>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {((content.items as any[]) ?? []).map((item: any, i: number) => (
              <div key={i} className="space-y-2 p-3 border rounded-lg">
                <Input
                  value={(item as Record<string, unknown>).question as string}
                  onChange={(e) => {
                    const items = [...((content.items as Record<string, unknown>[]) ?? [])];
                    items[i] = { ...items[i], question: e.target.value };
                    setContent({ ...content, items });
                  }}
                  placeholder="Question"
                />
                <Textarea
                  value={(item as Record<string, unknown>).answer as string}
                  onChange={(e) => {
                    const items = [...((content.items as Record<string, unknown>[]) ?? [])];
                    items[i] = { ...items[i], answer: e.target.value };
                    setContent({ ...content, items });
                  }}
                  placeholder="Answer"
                  rows={2}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => {
                    setContent({
                      ...content,
                      items: ((content.items as unknown[]) ?? []).filter(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (_: any, j: number) => j !== i,
                      ),
                    });
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setContent({
                  ...content,
                  items: [
                    ...((content.items as Record<string, unknown>[]) ?? []),
                    { question: "", answer: "" },
                  ],
                });
              }}
            >
              <Plus className="h-3 w-3 mr-1" /> Add FAQ
            </Button>
          </div>
        );
      default:
        return (
          <div className="space-y-2">
            <Label>Content (JSON)</Label>
            <Textarea
              value={JSON.stringify(content, null, 2)}
              onChange={(e) => {
                try {
                  setContent(JSON.parse(e.target.value));
                } catch {}
              }}
              rows={8}
              className="font-mono text-xs"
            />
          </div>
        );
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {block.label ?? block.block_type}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Block Label</Label>
            <Input
              value={(content.label as string) ?? block.label ?? ""}
              onChange={(e) => setContent({ ...content, label: e.target.value })}
            />
          </div>
          {renderFields()}
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(content)}>
            <Save className="h-4 w-4 mr-2" /> Save Block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
