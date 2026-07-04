import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listCanvaTemplates, saveCanvaTemplate, deleteCanvaTemplate, seedAllTemplates, updateAllTemplateFields, DEFAULT_FIELDS } from "@/lib/canva-cert.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Upload, Trash2, Pencil, Eye, Download, Palette, GripVertical, Image as ImageIcon, FileImage, Search, RefreshCw } from "lucide-react";
import { CertDesignerPreview } from "./CertDesignerPreview";
import { CertDesignerEditor } from "./CertDesignerEditor";

const CATEGORIES = ["Professional", "Achievement", "Academic", "Technology", "Executive", "Certification"];
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

const CATEGORY_COLORS: Record<string, string> = {
  Professional: "bg-blue-100 text-blue-700",
  Achievement: "bg-amber-100 text-amber-700",
  Academic: "bg-purple-100 text-purple-700",
  Technology: "bg-emerald-100 text-emerald-700",
  Executive: "bg-rose-100 text-rose-700",
  Certification: "bg-cyan-100 text-cyan-700",
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
  const [updating, setUpdating] = useState(false);
  const doUpdate = useServerFn(updateAllTemplateFields);

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

  const categoryCounts = templates.reduce(
    (acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

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
      fields_json: JSON.parse(JSON.stringify(DEFAULT_FIELDS)),
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

  const handleUpdateFields = async () => {
    setUpdating(true);
    try {
      const result = await doUpdate() as any;
      toast.success(`Updated ${result?.updated || 0} templates, ${result?.skipped || 0} skipped`);
      if (result?.errors?.length) toast.warning(`${result.errors.length} errors`);
      qc.invalidateQueries({ queryKey: ["canva-cert-templates"] });
    } catch (err: any) {
      toast.error(err?.message || "Update failed");
    }
    setUpdating(false);
  };

  return (
    <div className="space-y-5">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

      {/* Stats Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        {Object.entries(categoryCounts).map(([cat, count]) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(filterCategory === cat ? "all" : cat)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              filterCategory === cat
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            {cat}
            <span className={`ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full ${
              filterCategory === cat ? "bg-white/20" : "bg-muted"
            }`}>{count}</span>
          </button>
        ))}
      </div>

      {/* Search & Actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleUpdateFields} disabled={updating} size="sm">
            {updating ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1.5" />}
            Update Fields
          </Button>
          <Button variant="outline" onClick={handleSeedAll} disabled={seeding} size="sm">
            {seeding ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Palette className="h-4 w-4 mr-1.5" />}
            Seed 30 Templates
          </Button>
          <Button onClick={() => fileInputRef.current?.click()} size="sm">
            <Upload className="h-4 w-4 mr-1.5" /> Upload Template
          </Button>
        </div>
      </div>

      {/* Template Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading templates...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl bg-card/30">
          <FileImage className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="font-medium text-foreground mb-1">
            {search || filterCategory !== "all" ? "No matching templates" : "No templates yet"}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {search || filterCategory !== "all"
              ? "Try adjusting your search or filters"
              : "Upload your first Canva design or seed the built-in collection"}
          </p>
          {!search && filterCategory === "all" && (
            <div className="flex items-center justify-center gap-2">
              <Button onClick={handleSeedAll} variant="outline" size="sm" disabled={seeding}>
                {seeding ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Palette className="h-4 w-4 mr-1.5" />}
                Seed 30 Templates
              </Button>
              <Button onClick={() => fileInputRef.current?.click()} size="sm">
                <Upload className="h-4 w-4 mr-1.5" /> Upload
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((tpl) => (
            <Card key={tpl.id} className="group overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-200">
              {/* Template Preview */}
              <div className="aspect-[1.414/1] relative overflow-hidden bg-muted">
                <img
                  src={tpl.thumbnail_url || tpl.bg_image_url}
                  alt={tpl.name}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />
                {/* Hover overlay with actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-end p-3 gap-2">
                  <div className="flex items-center gap-1.5 w-full">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1 h-8 text-xs bg-white/90 hover:bg-white"
                      onClick={(e) => { e.stopPropagation(); setSelected(tpl); setPreviewOpen(true); }}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1 h-8 text-xs bg-white/90 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onEditTemplate) onEditTemplate(tpl);
                        else { setSelected(tpl); setEditOpen(true); }
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                      onClick={(e) => { e.stopPropagation(); setDeleteId(tpl.id); }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                {/* Category badge */}
                <div className="absolute top-2 right-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm ${
                    CATEGORY_COLORS[tpl.category] || "bg-gray-100 text-gray-700"
                  }`}>
                    {tpl.category}
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <CardContent className="p-3 space-y-1">
                <h3 className="font-medium text-sm leading-snug text-foreground line-clamp-1">{tpl.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(tpl.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  {tpl.fields_json && (
                    <span className="text-[10px] text-muted-foreground">
                      {Object.keys(tpl.fields_json).length} fields
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialogs */}
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
          <p className="text-sm text-muted-foreground">
            This template will be permanently removed. This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
