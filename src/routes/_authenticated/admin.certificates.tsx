import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  Save,
  Image as ImageIcon,
  Type,
  Edit3,
  Settings,
  ShieldCheck,
  Palette,
  Square,
  LayoutGrid,
  Scissors,
  Bold,
  Italic,
  Underline,
  SmilePlus,
  ArrowUp,
  ArrowDown,
  Copy,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AppShell } from "@/components/AppShell";
import { listTemplates, saveTemplate, deleteTemplate } from "@/lib/certificate-admin.functions";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { DesignerWorkspace } from "@/components/certificate-designer/DesignerWorkspace";

export const Route = createFileRoute("/_authenticated/admin/certificates")({
  component: AdminCertificatesPage,
});

type CertElement = {
  id: string;
  type: "text" | "image" | "qr" | "org_logo";
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
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline";
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

function applyTheme(t: (typeof THEMES)[0]): CertDesign {
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
  {
    id: "e1",
    type: "text",
    content: "{name}",
    x: 400,
    y: 220,
    fontSize: 48,
    fontFamily: "Playfair Display",
    color: "#1a1a1a",
    align: "center",
    fontWeight: "bold",
    fontStyle: "normal",
    textDecoration: "none",
  },
  {
    id: "e2",
    type: "text",
    content: "has successfully completed",
    x: 400,
    y: 300,
    fontSize: 18,
    fontFamily: "Inter",
    color: "#666666",
    align: "center",
    fontWeight: "normal",
    fontStyle: "normal",
    textDecoration: "none",
  },
  {
    id: "e3",
    type: "text",
    content: "{course}",
    x: 400,
    y: 360,
    fontSize: 32,
    fontFamily: "Inter",
    color: "#1a1a1a",
    align: "center",
    fontWeight: "bold",
    fontStyle: "normal",
    textDecoration: "none",
  },
  {
    id: "e4",
    type: "text",
    content: "Issued on: {date}",
    x: 400,
    y: 440,
    fontSize: 14,
    fontFamily: "Inter",
    color: "#666666",
    align: "center",
    fontWeight: "normal",
    fontStyle: "normal",
    textDecoration: "none",
  },
  {
    id: "e5",
    type: "text",
    content: "ID: {certificate_id}",
    x: 100,
    y: 540,
    fontSize: 12,
    fontFamily: "Inter",
    color: "#999999",
    align: "left",
    fontWeight: "normal",
    fontStyle: "normal",
    textDecoration: "none",
  },
  { id: "e6", type: "qr", x: 650, y: 470, width: 80, height: 80 },
];

function makeDefaultTemplate(theme?: (typeof THEMES)[0]): CertTemplate {
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

  if (!isAdmin)
    return (
      <AppShell>
        <div className="p-10 text-center">Unauthorized</div>
      </AppShell>
    );

  const templates = q.data ?? [];

  const handleCreate = () => {
    setActive(makeDefaultTemplate());
  };

  const handleSaveTemplate = async (template: CertTemplate) => {
    setSaving(true);
    try {
      await saveTemp({ data: template });
      toast.success("Template saved!");
      qc.invalidateQueries({ queryKey: ["admin-cert-templates"] });
      setActive(null);
    } catch (e: any) {
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
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const updateActiveEl = (updates: Partial<CertElement>) => {
    if (!active || !selectedEl) return;
    setActive({
      ...active,
      config_json: {
        ...active.config_json,
        elements: active.config_json.elements.map((e) =>
          e.id === selectedEl ? { ...e, ...updates } : e,
        ),
      },
    });
  };

  const updateDesign = (updates: Partial<CertDesign>) => {
    if (!active) return;
    setActive({
      ...active,
      config_json: { ...active.config_json, design: { ...active.config_json.design, ...updates } },
    });
  };

  const applyThemeColors = (themeId: string) => {
    const t = THEMES.find((th) => th.name === themeId || th.id === themeId);
    if (!t) return;
    setActive({
      ...active!,
      type: t.name,
      config_json: {
        ...active!.config_json,
        design: { ...active!.config_json.design, ...applyTheme(t) },
      },
    });
  };

  const addText = () => {
    if (!active) return;
    setActive({
      ...active,
      config_json: {
        ...active.config_json,
        elements: [
          ...active.config_json.elements,
          {
            id: Date.now().toString(),
            type: "text",
            content: "New Text",
            x: 100,
            y: 100,
            fontSize: 24,
            color: active.config_json.design.text_color,
            fontFamily: active.config_json.design.font_family,
            align: "left",
            fontWeight: "normal",
            fontStyle: "normal",
            textDecoration: "none",
          },
        ],
      },
    });
  };

  const addImage = () => {
    if (!active) return;
    setActive({
      ...active,
      config_json: {
        ...active.config_json,
        elements: [
          ...active.config_json.elements,
          {
            id: Date.now().toString(),
            type: "image",
            url: "",
            x: 100,
            y: 100,
            width: 160,
            height: 120,
          },
        ],
      },
    });
  };

  const addOrgLogo = () => {
    if (!active) return;
    setActive({
      ...active,
      config_json: {
        ...active.config_json,
        elements: [
          ...active.config_json.elements,
          { id: Date.now().toString(), type: "org_logo", x: 60, y: 40, width: 100, height: 100 },
        ],
      },
    });
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
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 shrink-0 hidden sm:block">
              <img src="/illustrations/Cyber_Security.svg" alt="" className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-semibold flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-primary" /> Certificate Designer
              </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Design verifiable professional credentials with drag-and-drop.
            </p>
            </div>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4" /> New Template
          </Button>
        </div>

        {!active ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {templates.map((t: any) => {
              const parsed =
                typeof t.config_json === "string" ? JSON.parse(t.config_json) : t.config_json;
              const els: CertElement[] = parsed?.elements ?? [];
              const design: CertDesign = parsed?.design ?? {
                accent_color: "#c9a84c",
                bg_color: "#fdfbf5",
                text_color: "#0f1b3d",
                font_family: "Playfair Display",
                border_style: "double",
                border_width: 10,
                corner_style: "diagonal",
                background_pattern: "none",
                layout: "classic",
              };
              return (
                <div key={t.id} className="rounded-xl border bg-card p-5 shadow-card group">
                  <div
                    className="aspect-[1.414] rounded-lg mb-4 overflow-hidden relative"
                    style={{ background: design.bg_color }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        ...getPatternStyle(
                          design.background_pattern,
                          design.bg_color,
                          design.accent_color,
                        ),
                        ...(t.bg_image_url
                          ? { backgroundImage: `url(${t.bg_image_url})`, backgroundSize: "cover" }
                          : {}),
                      }}
                    >
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 842 595"
                        preserveAspectRatio="xMidYMid meet"
                        style={{ overflow: "visible" }}
                      >
                        {els.map((el) => {
                          if (el.type === "text") {
                            return (
                              <text
                                key={el.id}
                                x={el.x}
                                y={el.y}
                                fontSize={el.fontSize || 16}
                                fill={el.color || design.text_color}
                                fontFamily={el.fontFamily || "Georgia, serif"}
                                textAnchor={
                                  el.align === "center"
                                    ? "middle"
                                    : el.align === "right"
                                      ? "end"
                                      : "start"
                                }
                                dominantBaseline="hanging"
                                fontWeight={el.fontWeight}
                              >
                                {el.content}
                              </text>
                            );
                          }
                          if (el.type === "org_logo") {
                            return (
                              <rect
                                key={el.id}
                                x={el.x}
                                y={el.y}
                                width={el.width || 80}
                                height={el.height || 60}
                                rx="4"
                                fill="#e2e8f0"
                                stroke="#94a3b8"
                                strokeWidth="1"
                                strokeDasharray="3,2"
                              />
                            );
                          }
                          return null;
                        })}
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setActive({
                            ...t,
                            config_json: {
                              elements: els.length > 0 ? els : [...DEFAULT_ELEMENTS],
                              design,
                            },
                          });
                        }}
                      >
                        <Edit3 className="h-4 w-4" /> Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(t.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
          <DesignerWorkspace
            initialTemplate={active as any}
            onSave={handleSaveTemplate as any}
            onClose={() => setActive(null)}
          />
        )}
      </div>
    </AppShell>
  );
}
