import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listCanvaTemplates, saveCanvaTemplate, deleteCanvaTemplate, seedAllTemplates } from "@/lib/canva-cert.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Upload, Trash2, Pencil, Eye, Download, Palette, GripVertical } from "lucide-react";
import { CertDesignerPreview } from "./CertDesignerPreview";
import { CertDesignerEditor } from "./CertDesignerEditor";

const CATEGORIES = ["Professional", "Achievement", "Academic", "Technology", "Executive", "Certification", "Executive"];
const PRESET_THEMES = [
  { name: "Navy & Gold", primary: "#0a1628", accent: "#c9a84c", background: "#f5f0e8", text: "#1a2744" },
  { name: "Purple & Gold", primary: "#2d1b69", accent: "#c9a84c", background: "#f5f0e8", text: "#2d1b69" },
  { name: "Teal & Gold", primary: "#0d5c5c", accent: "#c9a84c", background: "#f5f0e8", text: "#0d5c5c" },
  { name: "Classic Navy", primary: "#1a2744", accent: "#c9a84c", background: "#ffffff", text: "#1a2744" },
  { name: "Emerald", primary: "#065f46", accent: "#c9a84c", background: "#f0fdf4", text: "#065f46" },
  { name: "Rose", primary: "#881337", accent: "#c9a84c", background: "#fff1f2", text: "#881337" },
];

type CanvaTemplate = {
  id: string;
  name: string;
  category: string;
  bg_image_url: string;
  thumbnail_url: string | null;
  fields_json: any;
  theme_colors: any;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

export function CertDesignerAdmin({ onEditTemplate }: { onEditTemplate?: (template: CanvaTemplate) => void } = {}) {
  const qc = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selected, setSelected] = useState<CanvaTemplate | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const doList = useServerFn(listCanvaTemplates);
  const doSave = useServerFn(saveCanvaTemplate);
  const doDelete = useServerFn(deleteCanvaTemplate);
  const doSeed = useServerFn(seedAllTemplates);
  const [seeding, setSeeding] = useState(false);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["canva-cert-templates"],
    queryFn: async () => {
      const result = await doList();
      return (result ?? []) as CanvaTemplate[];
    },
  });

  const filtered = templates.filter((t) => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "all" || t.category === filterCategory;
    return matchSearch && matchCat;
  });

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, SVG)");
      return;
    }

    const url = URL.createObjectURL(file);
    setEditOpen(true);
    setSelected({
      id: "",
      name: file.name.replace(/\.[^.]+$/, ""),
      category: "Professional",
      bg_image_url: url,
      thumbnail_url: url,
      fields_json: {
        studentName: { x: 50, y: 42, fontSize: 48, fontFamily: "Great Vibes", color: "#1a2744" },
        courseName: { x: 50, y: 55, fontSize: 28, fontFamily: "Georgia", color: "#0a6e8a", fontWeight: "bold" },
        description: { x: 50, y: 62, fontSize: 14, fontFamily: "Georgia", color: "#555" },
        date: { x: 72, y: 78, fontSize: 14, fontFamily: "Georgia", color: "#333" },
        signatureName: { x: 20, y: 78, fontSize: 24, fontFamily: "Great Vibes", color: "#1a2744" },
        signatureTitle: { x: 20, y: 82, fontSize: 11, fontFamily: "Georgia", color: "#666" },
        certId: { x: 85, y: 8, fontSize: 10, fontFamily: "monospace", color: "#999" },
        badgeText: { x: 50, y: 90, fontSize: 9, fontFamily: "Georgia", color: "#888" },
      },
      theme_colors: PRESET_THEMES[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: null,
    } as CanvaTemplate);
    e.target.value = "";
  }, []);

  const handleSave = async (tpl: CanvaTemplate) => {
    try {
      const result = await doSave({
        data: {
          id: tpl.id || undefined,
          name: tpl.name,
          category: tpl.category,
          bg_image_url: tpl.bg_image_url,
          thumbnail_url: tpl.thumbnail_url,
          fields_json: tpl.fields_json,
          theme_colors: tpl.theme_colors,
        },
      });
      toast.success(tpl.id ? "Template updated" : "Template created");
      qc.invalidateQueries({ queryKey: ["canva-cert-templates"] });
      setEditOpen(false);
      setSelected(null);
    } catch (err: any) {
      toast.error(err?.message || "Save failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await doDelete({ data: { id: deleteId } });
      toast.success("Template deleted");
      qc.invalidateQueries({ queryKey: ["canva-cert-templates"] });
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    }
    setDeleteId(null);
  };

  const handleSeedAll = async () => {
    setSeeding(true);
    try {
      const result = await doSeed();
      const r = result as any;
      toast.success(`Seeded ${r?.created || 0} templates, ${r?.skipped || 0} skipped`);
      if (r?.errors?.length) toast.warning(`${r.errors.length} errors occurred`);
      qc.invalidateQueries({ queryKey: ["canva-cert-templates"] });
    } catch (err: any) {
      toast.error(err?.message || "Seed failed");
    }
    setSeeding(false);
  };

  return (
    <div className="space-y-4">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSeedAll} disabled={seeding}>
            {seeding ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Palette className="h-4 w-4 mr-2" />}
            Seed 30 Templates
          </Button>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" /> Upload Template
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-4">No templates yet. Upload your first Canva design!</p>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" /> Upload Template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((tpl) => (
            <Card key={tpl.id} className="group overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-[1.414/1] relative overflow-hidden bg-muted">
                <img
                  src={tpl.thumbnail_url || tpl.bg_image_url}
                  alt={tpl.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                  <Button size="sm" variant="secondary" onClick={() => { setSelected(tpl); setPreviewOpen(true); }}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => {
                    if (onEditTemplate) {
                      onEditTemplate(tpl);
                    } else {
                      setSelected(tpl); setEditOpen(true);
                    }
                  }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteId(tpl.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                    {tpl.category}
                  </span>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium text-sm truncate">{tpl.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(tpl.updated_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editOpen && selected && (
        <CertDesignerEditor
          template={selected}
          onSave={handleSave}
          onClose={() => { setEditOpen(false); setSelected(null); }}
        />
      )}

      {previewOpen && selected && (
        <CertDesignerPreview
          template={selected}
          onClose={() => { setPreviewOpen(false); setSelected(null); }}
        />
      )}

      <Dialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Template?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
