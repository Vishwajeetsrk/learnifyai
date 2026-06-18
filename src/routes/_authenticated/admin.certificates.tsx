import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Plus, Trash2, Save, Image as ImageIcon, Type, Edit3, Settings, ShieldCheck, Palette, Square, LayoutGrid, Scissors } from "lucide-react";
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

type CertDesign = {
  accent_color: string;
  bg_color: string;
  text_color: string;
  accent_color_2?: string | null;
  font_family: string;
  title_font?: string | null;
  body_font?: string | null;
  border_style: string;
  border_width: number;
  corner_style: string;
  background_pattern: string;
  layout: string;
};

type CertTemplate = {
  id?: string;
  name: string;
  type: string;
  layout: string;
  bg_image_url?: string | null;
  config_json: { elements: CertElement[]; design: CertDesign }; // design embedded in config_json for DB
};

const FONTS = [
  { value: "Playfair Display", label: "Playfair Display", category: "serif" },
  { value: "Inter", label: "Inter", category: "sans" },
  { value: "Cormorant Garamond", label: "Cormorant Garamond", category: "serif" },
  { value: "Cinzel", label: "Cinzel", category: "serif" },
  { value: "Libre Baskerville", label: "Libre Baskerville", category: "serif" },
  { value: "Merriweather", label: "Merriweather", category: "serif" },
  { value: "Montserrat", label: "Montserrat", category: "sans" },
  { value: "Poppins", label: "Poppins", category: "sans" },
  { value: "Raleway", label: "Raleway", category: "sans" },
  { value: "Great Vibes", label: "Great Vibes", category: "script" },
  { value: "Oswald", label: "Oswald", category: "sans" },
  { value: "Roboto Mono", label: "Roboto Mono", category: "mono" },
];

const THEMES = [
  {
    id: "executive-gold",
    name: "Executive Gold",
    desc: "Navy + Gold — classic prestige",
    accent: "#c9a84c",
    bg: "#0f1b3d",
    text: "#fdfbf5",
    accent2: "#8a6d2b",
    font: "Playfair Display",
    border: "double",
    borderWidth: 10,
    corner: "diagonal",
    pattern: "none",
    layout: "classic",
  },
  {
    id: "modern-corporate",
    name: "Modern Corporate",
    desc: "Clean white + blue — sleek",
    accent: "#2563eb",
    bg: "#ffffff",
    text: "#1e293b",
    accent2: "#60a5fa",
    font: "Inter",
    border: "solid",
    borderWidth: 6,
    corner: "none",
    pattern: "none",
    layout: "modern",
  },
  {
    id: "university-style",
    name: "University Style",
    desc: "Cream + crimson — academic",
    accent: "#8b0000",
    bg: "#fdfbf5",
    text: "#1a1a1a",
    accent2: "#c62828",
    font: "Cinzel",
    border: "ornate",
    borderWidth: 12,
    corner: "ribbon",
    pattern: "none",
    layout: "elegant",
  },
  {
    id: "creator-academy",
    name: "Creator Academy",
    desc: "Dark + vibrant — modern bold",
    accent: "#e94560",
    bg: "#1a1a2e",
    text: "#eaeaea",
    accent2: "#0f3460",
    font: "Montserrat",
    border: "dashed",
    borderWidth: 4,
    corner: "none",
    pattern: "dots",
    layout: "minimal",
  },
  {
    id: "nature-green",
    name: "Nature Green",
    desc: "Soft green + emerald — fresh",
    accent: "#16a34a",
    bg: "#f0fdf4",
    text: "#052e16",
    accent2: "#86efac",
    font: "Merriweather",
    border: "solid",
    borderWidth: 8,
    corner: "none",
    pattern: "none",
    layout: "classic",
  },
  {
    id: "royal-purple",
    name: "Royal Purple",
    desc: "Deep purple + amethyst — regal",
    accent: "#a855f7",
    bg: "#2e1065",
    text: "#f5f3ff",
    accent2: "#7c3aed",
    font: "Cormorant Garamond",
    border: "double",
    borderWidth: 10,
    corner: "diagonal",
    pattern: "gradient",
    layout: "elegant",
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    desc: "Warm + energetic — creative",
    accent: "#ea580c",
    bg: "#fff7ed",
    text: "#431407",
    accent2: "#fdba74",
    font: "Raleway",
    border: "dashed",
    borderWidth: 5,
    corner: "ribbon",
    pattern: "none",
    layout: "modern",
  },
  {
    id: "ocean-teal",
    name: "Ocean Teal",
    desc: "Cyan + teal — calm, modern",
    accent: "#0d9488",
    bg: "#ecfeff",
    text: "#134e4a",
    accent2: "#5eead4",
    font: "Poppins",
    border: "ornate",
    borderWidth: 8,
    corner: "none",
    pattern: "none",
    layout: "minimal",
  },
  {
    id: "midnight-amber",
    name: "Midnight Amber",
    desc: "Dark slate + amber — premium",
    accent: "#f59e0b",
    bg: "#111827",
    text: "#f9fafb",
    accent2: "#d97706",
    font: "Oswald",
    border: "double",
    borderWidth: 8,
    corner: "diagonal",
    pattern: "dots",
    layout: "classic",
  },
  {
    id: "rose-gold",
    name: "Rose Gold",
    desc: "Blush + rose — elegant chic",
    accent: "#e11d48",
    bg: "#fff1f2",
    text: "#4c0519",
    accent2: "#fb7185",
    font: "Great Vibes",
    border: "solid",
    borderWidth: 6,
    corner: "ribbon",
    pattern: "gradient",
    layout: "elegant",
  },
];

const BORDER_OPTIONS = [
  { id: "double", label: "Double", icon: "═" },
  { id: "solid", label: "Solid", icon: "━" },
  { id: "dashed", label: "Dashed", icon: "╍" },
  { id: "ornate", label: "Ornate", icon: "☰" },
  { id: "none", label: "None", icon: "○" },
];

const PATTERN_OPTIONS = [
  { id: "none", label: "Solid", preview: null },
  { id: "dots", label: "Dots", preview: "dots" },
  { id: "grid", label: "Grid", preview: "grid" },
  { id: "diagonal", label: "Stripes", preview: "diagonal" },
  { id: "gradient", label: "Gradient", preview: "gradient" },
];

const LAYOUT_OPTIONS = [
  { id: "classic", label: "Classic", desc: "Traditional centered" },
  { id: "modern", label: "Modern", desc: "Sleek & clean" },
  { id: "elegant", label: "Elegant", desc: "Ornate & refined" },
  { id: "minimal", label: "Minimal", desc: "Simple & sparse" },
];

const CORNER_OPTIONS = [
  { id: "diagonal", label: "Diagonal", desc: "Triangular folds" },
  { id: "ribbon", label: "Ribbon", desc: "Ribbon folds" },
  { id: "none", label: "None", desc: "Clean corners" },
];

function applyTheme(t: typeof THEMES[0]): CertDesign {
  return {
    accent_color: t.accent,
    bg_color: t.bg,
    text_color: t.text,
    accent_color_2: t.accent2,
    font_family: t.font,
    border_style: t.border,
    border_width: t.borderWidth,
    corner_style: t.corner,
    background_pattern: t.pattern,
    layout: t.layout,
  };
}

const DEFAULT_ELEMENTS: CertElement[] = [
  { id: "e1", type: "text", content: "{name}", x: 400, y: 220, fontSize: 48, fontFamily: "Playfair Display", color: "#1a1a1a", align: "center" },
  { id: "e2", type: "text", content: "has successfully completed", x: 400, y: 300, fontSize: 18, fontFamily: "Inter", color: "#666666", align: "center" },
  { id: "e3", type: "text", content: "{course}", x: 400, y: 360, fontSize: 32, fontFamily: "Inter", color: "#1a1a1a", align: "center" },
  { id: "e4", type: "text", content: "Issued on: {date}", x: 400, y: 440, fontSize: 14, fontFamily: "Inter", color: "#666666", align: "center" },
  { id: "e5", type: "text", content: "ID: {certificate_id}", x: 100, y: 540, fontSize: 12, fontFamily: "Inter", color: "#999999", align: "left" },
  { id: "e6", type: "qr", x: 650, y: 470, width: 80, height: 80 },
];

function makeDefaultTemplate(theme?: typeof THEMES[0]): CertTemplate {
  const t = theme ?? THEMES[0];
  return {
    name: t.name + " Template",
    type: t.name,
    layout: t.layout,
    bg_image_url: "",
    config_json: { elements: [...DEFAULT_ELEMENTS], design: applyTheme(t) },
  };
}

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
    setActive(makeDefaultTemplate());
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
        ...active.config_json,
        elements: active.config_json.elements.map(e => e.id === selectedEl ? { ...e, ...updates } : e)
      }
    });
  };

  const updateDesign = (updates: Partial<CertDesign>) => {
    if (!active) return;
    setActive({ ...active, config_json: { ...active.config_json, design: { ...active.config_json.design, ...updates } } });
  };

  const applyThemeColors = (themeId: string) => {
    const t = THEMES.find(th => th.name === themeId || th.id === themeId);
    if (!t) return;
    setActive({
      ...active!,
      type: t.name,
      config_json: { ...active!.config_json, design: { ...active!.config_json.design, ...applyTheme(t) } },
    });
  };

  const addText = () => {
    if(!active) return;
    setActive({
      ...active,
      config_json: {
        ...active.config_json,
        elements: [...active.config_json.elements, { id: Date.now().toString(), type: "text", content: "New Text", x: 100, y: 100, fontSize: 24, color: active.config_json.design.text_color, fontFamily: active.config_json.design.font_family, align: "left" }]
      }
    })
  };

  const addImage = () => {
    if(!active) return;
    setActive({
      ...active,
      config_json: {
        ...active.config_json,
        elements: [...active.config_json.elements, { id: Date.now().toString(), type: "image", url: "", x: 100, y: 100, width: 160, height: 120 }]
      }
    })
  };

  const getPatternStyle = (pattern: string, bg: string, accent: string) => {
    switch (pattern) {
      case "dots":
        return {
          backgroundImage: `radial-gradient(${accent}66 1.5px, transparent 1.5px)`,
          backgroundSize: "12px 12px",
          backgroundColor: bg,
        };
      case "grid":
        return {
          backgroundImage: `linear-gradient(${accent}44 1px, transparent 1px), linear-gradient(90deg, ${accent}44 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
          backgroundColor: bg,
        };
      case "diagonal":
        return {
          backgroundImage: `repeating-linear-gradient(45deg, ${accent}22 0 1px, transparent 1px 8px)`,
          backgroundColor: bg,
        };
      case "gradient":
        return {
          background: `linear-gradient(135deg, ${bg} 0%, ${accent}44 100%)`,
        };
      default:
        return { backgroundColor: bg };
    }
  };

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-8 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-semibold flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" /> Certificate Designer
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Design verifiable professional credentials with drag-and-drop.</p>
          </div>
          <Button onClick={handleCreate}><Plus className="h-4 w-4" /> New Template</Button>
        </div>

        {!active ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {templates.map((t: any) => {
              const parsed = typeof t.config_json === 'string' ? JSON.parse(t.config_json) : t.config_json;
              const els: CertElement[] = parsed?.elements ?? [];
              const design: CertDesign = parsed?.design ?? {
                accent_color: "#c9a84c", bg_color: "#fdfbf5", text_color: "#0f1b3d",
                font_family: "Playfair Display", border_style: "double", border_width: 10,
                corner_style: "diagonal", background_pattern: "none", layout: "classic",
              };
              return (
              <div key={t.id} className="rounded-xl border bg-card p-5 shadow-card group">
                <div className="aspect-[1.414] rounded-lg mb-4 overflow-hidden relative" style={{ background: design.bg_color }}>
                  <div className="absolute inset-0" style={{
                    ...getPatternStyle(design.background_pattern, design.bg_color, design.accent_color),
                    ...(t.bg_image_url ? { backgroundImage: `url(${t.bg_image_url})`, backgroundSize: 'cover' } : {}),
                  }}>
                    <svg width="100%" height="100%" viewBox="0 0 842 595" preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
                      {els.map(el => {
                        if (el.type === 'text') {
                          return (
                            <text key={el.id} x={el.x} y={el.y} fontSize={el.fontSize || 16} fill={el.color || design.text_color} fontFamily={el.fontFamily || 'Georgia, serif'} textAnchor={el.align === 'center' ? 'middle' : el.align === 'right' ? 'end' : 'start'} dominantBaseline="hanging">
                              {el.content}
                            </text>
                          );
                        }
                        return null;
                      })}
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => {
                      setActive({
                        ...t,
                        config_json: { elements: els.length > 0 ? els : [...DEFAULT_ELEMENTS], design },
                      });
                    }}><Edit3 className="h-4 w-4" /> Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(t.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-xs text-muted-foreground">{t.type}</p>
              </div>
              );
            })}
            {templates.length === 0 && !q.isLoading && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No templates found. Create your first one!
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
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

              <div className="bg-muted p-8 rounded-xl border flex items-center justify-center overflow-auto shadow-inner h-[700px]">
                <div
                  className="relative bg-white shadow-2xl overflow-hidden shrink-0"
                  style={{
                    width: 842, height: 595,
                    ...getPatternStyle(active.config_json.design.background_pattern, active.config_json.design.bg_color, active.config_json.design.accent_color),
                    ...(active.bg_image_url ? { backgroundImage: `url(${active.bg_image_url})`, backgroundSize: 'cover' } : {}),
                    border: active.config_json.design.border_style === "none"
                      ? "none"
                      : active.config_json.design.border_style === "ornate"
                        ? `${active.config_json.design.border_width}px double ${active.config_json.design.accent_color}`
                        : `${active.config_json.design.border_width}px ${active.config_json.design.border_style} ${active.config_json.design.accent_color}`,
                  }}
                  onClick={() => setSelectedEl(null)}
                >
                  {active.config_json.design.border_style === "ornate" && (
                    <div className="absolute inset-2 pointer-events-none z-0" style={{ border: `1px solid ${active.config_json.design.accent_color}88` }} />
                  )}
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
            <div className="bg-card border rounded-xl p-5 shadow-card space-y-6 h-fit sticky top-6 max-h-[calc(100vh-120px)] overflow-y-auto">
              {/* Template Name */}
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-4"><Settings className="h-4 w-4 text-primary" /> Template Settings</h3>
                <div className="space-y-3">
                  <div>
                    <Label>Template Name</Label>
                    <Input value={active.name} onChange={e => setActive({...active, name: e.target.value})} />
                  </div>
                  <div>
                    <Label>Background Image URL</Label>
                    <Input value={active.bg_image_url || ""} onChange={e => setActive({...active, bg_image_url: e.target.value})} placeholder="https://..." />
                  </div>
                </div>
              </div>

              <div className="border-t pt-5">
                <h4 className="font-semibold flex items-center gap-2 mb-3 text-sm"><Palette className="h-3.5 w-3.5 text-primary" /> Theme Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  {THEMES.map(t => {
                    const isActive = active.type === t.name;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => applyThemeColors(t.name)}
                        className={`relative flex items-center gap-2 rounded-lg border p-2.5 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${isActive ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'}`}
                        style={{ background: t.bg, color: t.text, borderColor: t.accent + '66' }}
                        title={t.desc}
                      >
                        <div className="h-7 w-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold"
                          style={{ background: t.accent, color: t.bg }}>
                          {t.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate">{t.name}</div>
                          <div className="text-[10px] truncate opacity-70">{t.desc}</div>
                        </div>
                        {isActive && (
                          <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-primary flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colors */}
              <div className="border-t pt-5">
                <h4 className="font-semibold flex items-center gap-2 mb-3 text-sm"><Palette className="h-3.5 w-3.5 text-primary" /> Colors</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Accent</Label>
                    <div className="relative mt-1">
                      <input type="color" value={active.config_json.design.accent_color}
                        onChange={e => updateDesign({ accent_color: e.target.value })}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                      <div className="w-full h-9 rounded-lg border flex items-center gap-2 px-2"
                        style={{ background: active.config_json.design.accent_color + '22', borderColor: active.config_json.design.accent_color }}>
                        <div className="h-5 w-5 rounded border" style={{ background: active.config_json.design.accent_color }} />
                        <span className="text-xs font-mono">{active.config_json.design.accent_color}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Background</Label>
                    <div className="relative mt-1">
                      <input type="color" value={active.config_json.design.bg_color}
                        onChange={e => updateDesign({ bg_color: e.target.value })}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                      <div className="w-full h-9 rounded-lg border flex items-center gap-2 px-2"
                        style={{ background: active.config_json.design.bg_color, borderColor: active.config_json.design.bg_color }}>
                        <div className="h-5 w-5 rounded border" style={{ background: active.config_json.design.bg_color, borderColor: '#00000033' }} />
                        <span className="text-xs font-mono">{active.config_json.design.bg_color}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Text</Label>
                    <div className="relative mt-1">
                      <input type="color" value={active.config_json.design.text_color}
                        onChange={e => updateDesign({ text_color: e.target.value })}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                      <div className="w-full h-9 rounded-lg border flex items-center gap-2 px-2"
                        style={{ background: active.config_json.design.text_color + '15', borderColor: active.config_json.design.text_color + '44' }}>
                        <div className="h-5 w-5 rounded border" style={{ background: active.config_json.design.text_color }} />
                        <span className="text-xs font-mono">{active.config_json.design.text_color}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Border Style */}
              <div className="border-t pt-5">
                <h4 className="font-semibold flex items-center gap-2 mb-3 text-sm"><Square className="h-3.5 w-3.5 text-primary" /> Border Style</h4>
                <div className="grid grid-cols-5 gap-1.5">
                  {BORDER_OPTIONS.map(b => {
                    const isActive = active.config_json.design.border_style === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => updateDesign({ border_style: b.id })}
                        className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-all hover:bg-accent/50 ${isActive ? 'ring-2 ring-primary bg-primary/10' : ''}`}
                      >
                        <div className="h-7 w-full rounded flex items-center justify-center text-lg font-semibold"
                          style={{
                            color: active.config_json.design.accent_color,
                            borderBottom: b.id === "none" ? "none" : `3px ${b.id} ${active.config_json.design.accent_color}`,
                          }}>
                          {b.id === "ornate" ? "☰" : b.id === "none" ? "✕" : ""}
                        </div>
                        <span className="text-[10px] text-muted-foreground">{b.label}</span>
                      </button>
                    );
                  })}
                </div>
                {active.config_json.design.border_style !== "none" && (
                  <div className="mt-2">
                    <Label className="text-xs">Border Width: {active.config_json.design.border_width}px</Label>
                    <input type="range" min="2" max="24"
                      value={active.config_json.design.border_width}
                      onChange={e => updateDesign({ border_width: Number(e.target.value) })}
                      className="w-full mt-1" />
                  </div>
                )}
              </div>

              {/* Corner Style */}
              <div className="border-t pt-5">
                <h4 className="font-semibold flex items-center gap-2 mb-3 text-sm"><Scissors className="h-3.5 w-3.5 text-primary" /> Corner Style</h4>
                <div className="grid grid-cols-3 gap-2">
                  {CORNER_OPTIONS.map(c => {
                    const isActive = active.config_json.design.corner_style === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => updateDesign({ corner_style: c.id })}
                        className={`flex flex-col items-center gap-1 rounded-lg border p-2.5 transition-all hover:bg-accent/50 ${isActive ? 'ring-2 ring-primary bg-primary/10' : ''}`}
                      >
                        <svg viewBox="0 0 40 40" className="h-6 w-6" style={{ color: active.config_json.design.accent_color }}>
                          {c.id === "diagonal" ? (
                            <>
                              <polygon points="0,0 20,0 0,20" fill="currentColor" opacity="0.7" />
                              <polygon points="40,40 20,40 40,20" fill="currentColor" opacity="0.7" />
                            </>
                          ) : c.id === "ribbon" ? (
                            <>
                              <polygon points="0,0 20,0 0,20" fill="currentColor" opacity="0.7" />
                              <polygon points="40,40 20,40 40,20" fill="currentColor" opacity="0.7" />
                            </>
                          ) : (
                            <>
                              <rect x="0" y="0" width="8" height="2" fill="currentColor" opacity="0.4" />
                              <rect x="0" y="0" width="2" height="8" fill="currentColor" opacity="0.4" />
                              <rect x="32" y="38" width="8" height="2" fill="currentColor" opacity="0.4" />
                              <rect x="38" y="32" width="2" height="8" fill="currentColor" opacity="0.4" />
                            </>
                          )}
                        </svg>
                        <span className="text-[10px] text-muted-foreground">{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Background Pattern */}
              <div className="border-t pt-5">
                <h4 className="font-semibold flex items-center gap-2 mb-3 text-sm"><LayoutGrid className="h-3.5 w-3.5 text-primary" /> Background Pattern</h4>
                <div className="grid grid-cols-5 gap-1.5">
                  {PATTERN_OPTIONS.map(p => {
                    const isActive = active.config_json.design.background_pattern === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => updateDesign({ background_pattern: p.id })}
                        className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-all hover:bg-accent/50 ${isActive ? 'ring-2 ring-primary bg-primary/10' : ''}`}
                      >
                        <div className="h-7 w-full rounded"
                          style={p.id === "none" ? { background: active.config_json.design.bg_color } :
                            getPatternStyle(p.id, active.config_json.design.bg_color, active.config_json.design.accent_color)} />
                        <span className="text-[10px] text-muted-foreground">{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Layout */}
              <div className="border-t pt-5">
                <h4 className="font-semibold flex items-center gap-2 mb-3 text-sm"><LayoutGrid className="h-3.5 w-3.5 text-primary" /> Layout</h4>
                <div className="grid grid-cols-2 gap-2">
                  {LAYOUT_OPTIONS.map(l => {
                    const isActive = active.config_json.design.layout === l.id;
                    return (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => updateDesign({ layout: l.id })}
                        className={`flex flex-col items-center gap-1 rounded-lg border p-2.5 transition-all hover:bg-accent/50 ${isActive ? 'ring-2 ring-primary bg-primary/10' : ''}`}
                      >
                        <div className="text-lg font-semibold" style={{ color: active.config_json.design.accent_color }}>
                          {l.id === "classic" ? "Aa" : l.id === "modern" ? "Aa" : l.id === "elegant" ? "Aa" : "Aa"}
                        </div>
                        <span className="text-xs font-medium">{l.label}</span>
                        <span className="text-[10px] text-muted-foreground">{l.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Typography */}
              <div className="border-t pt-5">
                <h4 className="font-semibold flex items-center gap-2 mb-3 text-sm"><Type className="h-3.5 w-3.5 text-primary" /> Typography</h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Font Family</Label>
                    <Select value={active.config_json.design.font_family} onValueChange={v => updateDesign({ font_family: v })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {FONTS.map(f => (
                          <SelectItem key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                            {f.label} <span className="text-[10px] text-muted-foreground ml-1">({f.category})</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Element Properties */}
              {selectedEl && (
                <div className="border-t pt-5">
                  <h3 className="font-semibold flex items-center justify-between mb-4">
                    Element Properties
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => {
                       setActive({...active, config_json: { ...active.config_json, elements: active.config_json.elements.filter(e => e.id !== selectedEl) }});
                      setSelectedEl(null);
                    }}><Trash2 className="h-4 w-4" /></Button>
                  </h3>

                  {active.config_json.elements.find(e => e.id === selectedEl)?.type === 'text' && (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Content (Supports {'{name}'}, {'{course}'})</Label>
                        <Input
                          value={active.config_json.elements.find(e => e.id === selectedEl)?.content}
                          onChange={e => updateActiveEl({ content: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Font Size</Label>
                          <Input type="number" value={active.config_json.elements.find(e => e.id === selectedEl)?.fontSize} onChange={e => updateActiveEl({ fontSize: Number(e.target.value) })} className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-xs">Color</Label>
                          <div className="relative mt-1">
                            <input type="color" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                              value={active.config_json.elements.find(e => e.id === selectedEl)?.color}
                              onChange={e => updateActiveEl({ color: e.target.value })} />
                            <div className="w-full h-9 rounded-lg border flex items-center gap-2 px-2"
                              style={{ background: (active.config_json.elements.find(e => e.id === selectedEl)?.color || '#000') + '22' }}>
                              <div className="h-5 w-5 rounded border" style={{ background: active.config_json.elements.find(e => e.id === selectedEl)?.color }} />
                              <span className="text-xs font-mono">{active.config_json.elements.find(e => e.id === selectedEl)?.color}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Font Family</Label>
                        <Select value={active.config_json.elements.find(e => e.id === selectedEl)?.fontFamily} onValueChange={v => updateActiveEl({ fontFamily: v })}>
                          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter (Sans)</SelectItem>
                            <SelectItem value="Playfair Display">Playfair (Serif)</SelectItem>
                            <SelectItem value="Roboto Mono">Roboto (Mono)</SelectItem>
                            <SelectItem value="Cinzel">Cinzel (Serif)</SelectItem>
                            <SelectItem value="Montserrat">Montserrat (Sans)</SelectItem>
                            <SelectItem value="Great Vibes">Great Vibes (Script)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Alignment</Label>
                        <Select value={active.config_json.elements.find(e => e.id === selectedEl)?.align} onValueChange={v => updateActiveEl({ align: v as any })}>
                          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
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
                        <Label className="text-xs">Image URL</Label>
                        <Input
                          value={active.config_json.elements.find(e => e.id === selectedEl)?.url || ""}
                          onChange={e => updateActiveEl({ url: e.target.value })}
                          placeholder="https://..."
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Width (px)</Label>
                          <Input type="number" value={active.config_json.elements.find(e => e.id === selectedEl)?.width} onChange={e => updateActiveEl({ width: Number(e.target.value) })} className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-xs">Height (px)</Label>
                          <Input type="number" value={active.config_json.elements.find(e => e.id === selectedEl)?.height} onChange={e => updateActiveEl({ height: Number(e.target.value) })} className="mt-1" />
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
