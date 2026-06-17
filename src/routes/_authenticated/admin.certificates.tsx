import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Plus, Trash2, Save, Image as ImageIcon, Type, Copy, Edit3, Settings, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppShell } from "@/components/AppShell";
import { listTemplates, saveTemplate, deleteTemplate } from "@/lib/certificate-admin.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/admin/certificates")({
  component: AdminCertificatesPage,
});

type CertElement = {
  id: string;
  type: "text" | "image" | "qr";
  content?: string;
  url?: string;
  x: number;
  y: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  align?: "left" | "center" | "right";
  width?: number;
  height?: number;
};

type CertTemplate = {
  id?: string;
  name: string;
  type: string;
  layout: string;
  bg_image_url?: string | null;
  config_json: { elements: CertElement[] };
};

const DEFAULT_ELEMENTS: CertElement[] = [
  { id: "e1", type: "text", content: "{name}", x: 400, y: 250, fontSize: 48, fontFamily: "Playfair Display", color: "#1a1a1a", align: "center" },
  { id: "e2", type: "text", content: "has successfully completed", x: 400, y: 320, fontSize: 18, fontFamily: "Inter", color: "#666666", align: "center" },
  { id: "e3", type: "text", content: "{course}", x: 400, y: 380, fontSize: 32, fontFamily: "Inter", color: "#1a1a1a", align: "center" },
  { id: "e4", type: "text", content: "Issued on: {date}", x: 400, y: 460, fontSize: 14, fontFamily: "Inter", color: "#666666", align: "center" },
  { id: "e5", type: "text", content: "ID: {certificate_id}", x: 100, y: 550, fontSize: 12, fontFamily: "Inter", color: "#999999", align: "left" },
  { id: "e6", type: "qr", x: 650, y: 480, width: 80, height: 80 },
];

function AdminCertificatesPage() {
  const { isAdmin } = useAuth();
  const qc = useQueryClient();
  const getTemplates = useServerFn(listTemplates);
  const saveTemp = useServerFn(saveTemplate);
  const delTemp = useServerFn(deleteTemplate);

  const [active, setActive] = useState<CertTemplate | null>(null);
  const [selectedEl, setSelectedEl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const q = useQuery({
    enabled: !!isAdmin,
    queryKey: ["admin-cert-templates"],
    queryFn: () => getTemplates(),
  });

  if (!isAdmin) return <AppShell><div className="p-10 text-center">Unauthorized</div></AppShell>;

  const templates = q.data ?? [];

  const handleCreate = () => {
    setActive({
      name: "New Template",
      type: "Executive Gold",
      layout: "landscape",
      bg_image_url: "",
      config_json: { elements: [...DEFAULT_ELEMENTS] }
    });
  };

  const handleSave = async () => {
    if (!active) return;
    setSaving(true);
    try {
      await saveTemp({ data: active });
      toast.success("Template saved!");
      qc.invalidateQueries({ queryKey: ["admin-cert-templates"] });
      setActive(null);
    } catch(e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await delTemp({ data: { id } });
      toast.success("Template deleted");
      qc.invalidateQueries({ queryKey: ["admin-cert-templates"] });
    } catch(e: any) {
      toast.error(e.message);
    }
  };

  const updateActiveEl = (updates: Partial<CertElement>) => {
    if (!active || !selectedEl) return;
    setActive({
      ...active,
      config_json: {
        elements: active.config_json.elements.map(e => e.id === selectedEl ? { ...e, ...updates } : e)
      }
    });
  };

  const addText = () => {
    if(!active) return;
    setActive({
      ...active,
      config_json: {
        elements: [...active.config_json.elements, { id: Date.now().toString(), type: "text", content: "New Text", x: 100, y: 100, fontSize: 24, color: "#000", fontFamily: "Inter", align: "left" }]
      }
    })
  };

  const addImage = () => {
    if(!active) return;
    setActive({
      ...active,
      config_json: {
        elements: [...active.config_json.elements, { id: Date.now().toString(), type: "image", url: "", x: 100, y: 100, width: 160, height: 120 }]
      }
    })
  };

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-8 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-semibold flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" /> Certificate System 2.0
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Design and manage verifiable professional credentials.</p>
          </div>
          <Button onClick={handleCreate}><Plus className="h-4 w-4" /> New Template</Button>
        </div>

        {!active ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {templates.map((t: any) => (
              <div key={t.id} className="rounded-xl border bg-card p-5 shadow-card group">
                <div className="aspect-[1.414] bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                  {t.bg_image_url ? (
                    <img src={t.bg_image_url} alt="bg" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => {
                      const parsed = typeof t.config_json === 'string' ? JSON.parse(t.config_json) : t.config_json;
                      setActive({ ...t, config_json: { elements: parsed?.elements ?? [...DEFAULT_ELEMENTS] } });
                    }}><Edit3 className="h-4 w-4" /> Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(t.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-xs text-muted-foreground">{t.type}</p>
              </div>
            ))}
            {templates.length === 0 && !q.isLoading && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No templates found. Create your first one!
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
            {/* BUILDER CANVAS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-card border rounded-lg p-2 shadow-sm">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setActive(null)}>Cancel</Button>
                  <Button variant="outline" size="sm" onClick={addText}><Type className="h-4 w-4" /> Add Text</Button>
                  <Button variant="outline" size="sm" onClick={addImage}><ImageIcon className="h-4 w-4" /> Add Image</Button>
                </div>
                <Button onClick={handleSave} disabled={saving}><Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Template"}</Button>
              </div>

              {/* The actual A4 landscape canvas is roughly 842 x 595 at 72dpi. We will scale it down visually. */}
              <div className="bg-muted p-8 rounded-xl border flex items-center justify-center overflow-auto shadow-inner h-[700px]">
                <div 
                  className="relative bg-white shadow-2xl overflow-hidden shrink-0" 
                  style={{ width: 842, height: 595, backgroundImage: active.bg_image_url ? `url(${active.bg_image_url})` : 'none', backgroundSize: 'cover' }}
                  onClick={() => setSelectedEl(null)}
                >
                  {active.config_json.elements.map(el => (
                    <motion.div
                      key={el.id}
                      drag
                      dragMomentum={false}
                      onDragEnd={(e, info) => {
                        const newX = el.x + info.offset.x;
                        const newY = el.y + info.offset.y;
                        updateActiveEl({ x: newX, y: newY });
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEl(el.id);
                      }}
                      className={`absolute cursor-move border-2 border-transparent hover:border-primary/50 ${selectedEl === el.id ? '!border-primary ring-2 ring-primary/20' : ''}`}
                      style={{ 
                        left: el.x, 
                        top: el.y, 
                        fontSize: el.fontSize, 
                        fontFamily: el.fontFamily, 
                        color: el.color,
                        textAlign: el.align,
                        width: el.width,
                        height: el.height,
                        transform: el.align === 'center' ? 'translateX(-50%)' : el.align === 'right' ? 'translateX(-100%)' : 'none'
                      }}
                    >
                      {el.type === 'text' && (el.content)}
                      {el.type === 'image' && (
                        el.url ? (
                          <img src={el.url} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full bg-muted border border-dashed flex items-center justify-center text-[10px] text-muted-foreground">
                            <ImageIcon className="h-6 w-6 opacity-40" />
                          </div>
                        )
                      )}
                      {el.type === 'qr' && (
                        <div className="w-full h-full bg-black/10 border border-dashed flex items-center justify-center text-[10px] text-muted-foreground">
                          QR Code
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* PROPERTIES PANEL */}
            <div className="bg-card border rounded-xl p-5 shadow-card space-y-6 h-fit sticky top-6">
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-4"><Settings className="h-4 w-4 text-primary" /> Template Settings</h3>
                <div className="space-y-3">
                  <div>
                    <Label>Template Name</Label>
                    <Input value={active.name} onChange={e => setActive({...active, name: e.target.value})} />
                  </div>
                  <div>
                    <Label>Theme Type</Label>
                    <Select value={active.type} onValueChange={v => setActive({...active, type: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Executive Gold">Executive Gold</SelectItem>
                        <SelectItem value="Modern Corporate">Modern Corporate</SelectItem>
                        <SelectItem value="University Style">University Style</SelectItem>
                        <SelectItem value="Creator Academy">Creator Academy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Background Image URL</Label>
                    <Input value={active.bg_image_url || ""} onChange={e => setActive({...active, bg_image_url: e.target.value})} placeholder="https://..." />
                  </div>
                </div>
              </div>

              {selectedEl && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold flex items-center justify-between mb-4">
                    Element Properties
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => {
                      setActive({...active, config_json: { elements: active.config_json.elements.filter(e => e.id !== selectedEl) }});
                      setSelectedEl(null);
                    }}><Trash2 className="h-4 w-4" /></Button>
                  </h3>
                  
                  {active.config_json.elements.find(e => e.id === selectedEl)?.type === 'text' && (
                    <div className="space-y-3">
                      <div>
                        <Label>Content (Supports {'{name}'}, {'{course}'})</Label>
                        <Input 
                          value={active.config_json.elements.find(e => e.id === selectedEl)?.content} 
                          onChange={e => updateActiveEl({ content: e.target.value })} 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Font Size</Label>
                          <Input type="number" value={active.config_json.elements.find(e => e.id === selectedEl)?.fontSize} onChange={e => updateActiveEl({ fontSize: Number(e.target.value) })} />
                        </div>
                        <div>
                          <Label>Color</Label>
                          <Input type="color" className="p-1 h-9" value={active.config_json.elements.find(e => e.id === selectedEl)?.color} onChange={e => updateActiveEl({ color: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <Label>Font Family</Label>
                        <Select value={active.config_json.elements.find(e => e.id === selectedEl)?.fontFamily} onValueChange={v => updateActiveEl({ fontFamily: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter (Sans)</SelectItem>
                            <SelectItem value="Playfair Display">Playfair (Serif)</SelectItem>
                            <SelectItem value="Roboto Mono">Roboto (Mono)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Alignment</Label>
                        <Select value={active.config_json.elements.find(e => e.id === selectedEl)?.align} onValueChange={v => updateActiveEl({ align: v as any })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  {active.config_json.elements.find(e => e.id === selectedEl)?.type === 'image' && (
                    <div className="space-y-3">
                      <div>
                        <Label>Image URL</Label>
                        <Input 
                          value={active.config_json.elements.find(e => e.id === selectedEl)?.url || ""} 
                          onChange={e => updateActiveEl({ url: e.target.value })} 
                          placeholder="https://..." 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Width (px)</Label>
                          <Input type="number" value={active.config_json.elements.find(e => e.id === selectedEl)?.width} onChange={e => updateActiveEl({ width: Number(e.target.value) })} />
                        </div>
                        <div>
                          <Label>Height (px)</Label>
                          <Input type="number" value={active.config_json.elements.find(e => e.id === selectedEl)?.height} onChange={e => updateActiveEl({ height: Number(e.target.value) })} />
                        </div>
                      </div>
                    </div>
                  )}
                  {active.config_json.elements.find(e => e.id === selectedEl)?.type === 'qr' && (
                    <div className="text-sm text-muted-foreground">
                      QR Codes automatically point to the certificate verification URL.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
