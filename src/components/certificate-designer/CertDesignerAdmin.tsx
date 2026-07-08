import { useState, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listCanvaTemplates, saveCanvaTemplate, deleteCanvaTemplate, seedAllTemplates } from "@/lib/canva-cert.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { DesignerWorkspace } from "./DesignerWorkspace";
import { TourChecklist } from "@/components/ProductTour";
import {
  Award, Plus, Search, LayoutTemplate, Trash2, Edit3, Eye, Copy,
  Palette, Sparkles, RefreshCw, MoreVertical, Download, ExternalLink,
} from "lucide-react";

type CanvaTemplate = {
  id: string; name: string; category: string; bg_image_url: string;
  thumbnail_url: string | null; fields_json: any; theme_colors: any;
  created_at: string; updated_at: string; created_by: string | null;
};

const CATEGORIES = ["All", "UI/UX Design", "Python Programming", "Web Development", "Excel Data Analysis", "Data Structures & Algorithms", "Digital Marketing", "AI Fundamentals", "Data Structures Advanced"];

export function CertDesignerAdmin() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [designerTemplate, setDesignerTemplate] = useState<CanvaTemplate | null>(null);
  const [showDesigner, setShowDesigner] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const doList = useServerFn(listCanvaTemplates);
  const doSave = useServerFn(saveCanvaTemplate);
  const doDelete = useServerFn(deleteCanvaTemplate);
  const doSeed = useServerFn(seedAllTemplates);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["canva-cert-templates"],
    queryFn: async () => { const r = await doList(); return (r ?? []) as CanvaTemplate[]; },
  });

  const filtered = useMemo(() => templates.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "All" || t.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchSearch && matchCat;
  }), [templates, search, selectedCategory]);

  const handleSeed = async () => {
    try { const res = await doSeed(); toast.success(`Seeded: ${res.created} SVG templates created${res.errors?.length ? `, ${res.errors.length} errors` : ""}`); qc.invalidateQueries({ queryKey: ["canva-cert-templates"] }); }
    catch (e: any) { toast.error(e.message); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await doDelete({ data: { id: deleteId } }); toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["canva-cert-templates"] }); }
    catch (e: any) { toast.error(e.message); }
    setDeleteId(null);
  };

  const handleNew = () => {
    setDesignerTemplate({
      id: "new", name: "New Certificate", category: "Professional",
      bg_image_url: "", thumbnail_url: null, fields_json: null, theme_colors: null,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(), created_by: null,
    });
    setShowDesigner(true);
  };

  const handleEdit = (t: CanvaTemplate) => {
    setDesignerTemplate(t);
    setShowDesigner(true);
  };

  const handleDuplicate = async (t: CanvaTemplate) => {
    const dup = { ...t, id: "new", name: t.name + " (Copy)", created_at: new Date().toISOString() };
    try { await doSave({ data: dup }); toast.success("Duplicated"); qc.invalidateQueries({ queryKey: ["canva-cert-templates"] }); }
    catch (e: any) { toast.error(e.message); }
  };

  if (showDesigner && designerTemplate) {
    return (
      <DesignerWorkspace
        initialTemplate={{
          id: designerTemplate.id,
          name: designerTemplate.name,
          type: designerTemplate.category || "Certificate",
          layout: designerTemplate.fields_json?.design?.layout || "classic",
          bg_image_url: designerTemplate.bg_image_url || "",
          config_json: designerTemplate.fields_json || { elements: [], design: {} },
        }}
        onSave={async (tmpl) => {
          await doSave({ data: { ...designerTemplate, ...tmpl, fields_json: tmpl.config_json } as any });
          qc.invalidateQueries({ queryKey: ["canva-cert-templates"] });
          toast.success("Saved");
          setShowDesigner(false);
        }}
        onClose={() => setShowDesigner(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#6B5BFB] to-[#3B82F6] flex items-center justify-center">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900">Certificate Designer</h1>
              <p className="text-xs text-slate-500">Create, edit, and manage certificate templates</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSeed} className="text-xs">
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Seed 155 SVG Templates
            </Button>
            <Button size="sm" onClick={handleNew} className="text-xs bg-[#6B5BFB] hover:bg-[#5a4be0] text-white">
              <Plus className="h-3.5 w-3.5 mr-1" /> New Certificate
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Search + Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 text-sm bg-white" />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? "bg-[#6B5BFB] text-white border-[#6B5BFB] shadow-md"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#6B5BFB]/40"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[1.414] bg-slate-200 rounded-2xl" />
                <div className="h-4 bg-slate-200 rounded mt-3 w-3/4" />
                <div className="h-3 bg-slate-100 rounded mt-2 w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((t) => (
              <Card key={t.id} className="group overflow-hidden border border-slate-200 hover:border-[#6B5BFB]/40 hover:shadow-xl transition-all duration-300">
                <div className="aspect-[1.414] relative bg-white overflow-hidden">
                  {t.bg_image_url ? (
                    <img src={t.bg_image_url} alt={t.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-slate-900 to-indigo-950">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-amber-400 border border-amber-400/20 mb-2">
                        {t.category || "Professional"}
                      </span>
                      <h3 className="font-serif font-bold text-sm text-white line-clamp-1">{t.name}</h3>
                    </div>
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 p-4">
                    <Button size="sm" onClick={() => handleEdit(t)}
                      className="text-white text-xs font-semibold px-4 rounded-xl bg-[#6B5BFB] hover:bg-[#5a4be0]">
                      <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDuplicate(t)}
                      className="bg-white/10 text-white border-white/20 text-xs rounded-xl">
                      <Copy className="h-3.5 w-3.5 mr-1" /> Duplicate
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setDeleteId(t.id)}
                      className="bg-red-500/20 text-red-300 border-red-400/20 text-xs rounded-xl">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3 bg-white flex items-center justify-between">
                  <span className="font-medium text-sm text-slate-900 line-clamp-1">{t.name}</span>
                  <Badge variant="secondary" className="text-[10px]">{t.category || "General"}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-200">
            <Palette className="h-16 w-16 mx-auto mb-4 text-slate-300" />
            <h3 className="font-bold text-lg text-slate-900">No templates found</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">Seed 155 SVG templates from 8 categories or create your own</p>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={handleSeed} variant="outline" className="text-xs">
                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Seed 155 SVG Templates
              </Button>
              <Button onClick={handleNew} className="text-xs bg-[#6B5BFB] hover:bg-[#5a4be0] text-white">
                <Plus className="h-3.5 w-3.5 mr-1" /> New Certificate
              </Button>
            </div>
          </div>
        )}
        {/* Available Product Tours */}
        <div className="mt-6">
          <TourChecklist />
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this template? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} className="text-xs">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} className="text-xs">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
