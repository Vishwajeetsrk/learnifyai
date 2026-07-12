import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CertElement,
  CertDesign,
  FONTS,
  FONT_CATEGORIES,
  BORDER_OPTIONS,
  PATTERN_OPTIONS,
  COLOR_PALETTES,
  SHAPE_OPTIONS,
  ShapeType,
  SVG_ICONS,
  SVG_CATEGORIES,
} from "./types";
import { ImageEditor } from "./ImageEditor";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette,
  Layout,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronDown,
  ChevronRight,
  Upload,
  Plus,
  Image as ImageIcon,
  Sparkles,
  QrCode,
  PenTool,
  Award,
  ShieldCheck,
  Minus,
  Shapes,
  Scissors,
} from "lucide-react";

type PropertiesPanelProps = {
  elements: CertElement[];
  design: CertDesign;
  bgImageUrl: string;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CertElement>) => void;
  onUpdateDesign: (updates: Partial<CertDesign>) => void;
  onUpdateBgImageUrl: (url: string) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onAddElement: (type: CertElement["type"]) => void;
  onAddShape: (shapeType: ShapeType) => void;
  onAddSvg: (svg: string, name: string) => void;
  onAddDivider: () => void;
  onUploadImage: (file: File) => void;
};

export function PropertiesPanel({
  elements,
  design,
  bgImageUrl,
  selectedId,
  onSelect,
  onUpdateElement,
  onUpdateDesign,
  onUpdateBgImageUrl,
  onDeleteElement,
  onDuplicateElement,
  onAddElement,
  onAddShape,
  onAddSvg,
  onAddDivider,
  onUploadImage,
}: PropertiesPanelProps) {
  const selectedEl = elements.find((e) => e.id === selectedId);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    text: true,
    position: true,
    style: true,
    colors: true,
    typography: true,
    layout: true,
    assets: true,
    addElements: true,
    svgPicker: false,
  });
  const [svgSearch, setSvgSearch] = useState("");
  const [svgCategory, setSvgCategory] = useState("all");
  const [imageEditor, setImageEditor] = useState<{
    open: boolean;
    title: string;
    initialUrl: string;
    aspectRatio: number;
    outputWidth: number;
    outputHeight: number;
    onApply: (dataUrl: string) => void;
  }>({
    open: false,
    title: "",
    initialUrl: "",
    aspectRatio: 1,
    outputWidth: 400,
    outputHeight: 400,
    onApply: () => {},
  });

  const toggle = (s: string) => setExpandedSections((p) => ({ ...p, [s]: !p[s] }));

  const filteredSvgs = SVG_ICONS.filter((icon) => {
    const matchSearch = !svgSearch || icon.name.toLowerCase().includes(svgSearch.toLowerCase());
    const matchCat = svgCategory === "all" || icon.category === svgCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="w-[380px] bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden shrink-0">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* ADD ELEMENTS */}
          <div>
            <button
              onClick={() => toggle("addElements")}
              className="flex items-center gap-2 text-xs font-bold text-slate-900 w-full mb-3"
            >
              {expandedSections.addElements ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
              <Plus className="h-4 w-4 text-[#6B5BFB]" /> Add Elements
            </button>
            {expandedSections.addElements && (
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { type: "text" as const, icon: Type, label: "Text" },
                  { type: "image" as const, icon: ImageIcon, label: "Image" },
                  { type: "org_logo" as const, icon: Award, label: "Logo" },
                  { type: "qr" as const, icon: QrCode, label: "QR" },
                  { type: "badge" as const, icon: ShieldCheck, label: "Badge" },
                  { type: "signature" as const, icon: PenTool, label: "Signature" },
                  { type: "date" as const, icon: Type, label: "Date" },
                  { type: "divider_line" as const, icon: Minus, label: "Divider" },
                  { type: "svg" as const, icon: Shapes, label: "SVG" },
                  { type: "shape" as const, icon: Shapes, label: "Shape" },
                  { type: "table" as const, icon: Layout, label: "Table" },
                  { type: "guilloche_watermark" as const, icon: Sparkles, label: "Watermark" },
                ].map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => onAddElement(type)}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg border border-slate-200 hover:border-[#6B5BFB]/40 hover:bg-[#6B5BFB]/5 transition-all text-[10px] text-slate-600"
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SELECTED ELEMENT PROPERTIES */}
          {selectedEl && (
            <div className="border-t border-slate-100 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase">
                  Element Properties
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onDuplicateElement(selectedEl.id)}
                    title="Duplicate"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500"
                    onClick={() => onDeleteElement(selectedEl.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* TEXT PROPERTIES */}
              {selectedEl.type === "text" && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-slate-500">Content</Label>
                    <Textarea
                      value={selectedEl.content || ""}
                      onChange={(e) => onUpdateElement(selectedEl.id, { content: e.target.value })}
                      className="mt-1 text-xs min-h-[60px]"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Font Family</Label>
                    <Select
                      value={selectedEl.fontFamily || design.font_family}
                      onValueChange={(v) => onUpdateElement(selectedEl.id, { fontFamily: v })}
                    >
                      <SelectTrigger className="mt-1 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONTS.map((f) => (
                          <SelectItem key={f.value} value={f.value}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-slate-500">
                        Size: {selectedEl.fontSize}px
                      </Label>
                      <Slider
                        value={[selectedEl.fontSize || 16]}
                        min={8}
                        max={200}
                        onValueChange={(v) => onUpdateElement(selectedEl.id, { fontSize: v[0] })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500">Color</Label>
                      <div className="flex gap-2 items-center mt-1">
                        <input
                          type="color"
                          value={selectedEl.color || design.text_color}
                          onChange={(e) =>
                            onUpdateElement(selectedEl.id, { color: e.target.value })
                          }
                          className="w-8 h-8 rounded cursor-pointer border border-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-lg">
                    <Button
                      variant={selectedEl.align === "left" ? "secondary" : "ghost"}
                      size="sm"
                      className="h-7"
                      onClick={() => onUpdateElement(selectedEl.id, { align: "left" })}
                    >
                      <AlignLeft className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant={selectedEl.align === "center" ? "secondary" : "ghost"}
                      size="sm"
                      className="h-7"
                      onClick={() => onUpdateElement(selectedEl.id, { align: "center" })}
                    >
                      <AlignCenter className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant={selectedEl.align === "right" ? "secondary" : "ghost"}
                      size="sm"
                      className="h-7"
                      onClick={() => onUpdateElement(selectedEl.id, { align: "right" })}
                    >
                      <AlignRight className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant={selectedEl.fontWeight === "bold" ? "secondary" : "ghost"}
                      size="sm"
                      className="h-7"
                      onClick={() =>
                        onUpdateElement(selectedEl.id, {
                          fontWeight: selectedEl.fontWeight === "bold" ? "normal" : "bold",
                        })
                      }
                    >
                      <b className="font-serif text-xs">B</b>
                    </Button>
                  </div>
                </div>
              )}

              {/* IMAGE PROPERTIES */}
              {(selectedEl.type === "image" ||
                selectedEl.type === "org_logo" ||
                selectedEl.type === "signature" ||
                selectedEl.type === "badge") && (
                <div className="space-y-3">
                  <Label className="text-xs text-slate-500">Image Source</Label>
                  <div className="flex gap-2">
                    <Input
                      value={selectedEl.url || ""}
                      onChange={(e) => onUpdateElement(selectedEl.id, { url: e.target.value })}
                      placeholder="https://..."
                      className="text-xs flex-1"
                    />
                    <label className="cursor-pointer inline-flex items-center justify-center h-8 px-3 bg-slate-100 hover:bg-slate-200 rounded-lg border text-xs font-medium shrink-0">
                      <Upload className="h-3 w-3 mr-1" /> Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) onUpdateElement(selectedEl.id, { url: URL.createObjectURL(f) });
                        }}
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* SVG PROPERTIES */}
              {selectedEl.type === "svg" && (
                <div className="space-y-3">
                  <Label className="text-xs text-slate-500">SVG Content</Label>
                  <Textarea
                    value={selectedEl.svgContent || ""}
                    onChange={(e) => onUpdateElement(selectedEl.id, { svgContent: e.target.value })}
                    className="text-xs font-mono min-h-[80px]"
                    rows={4}
                  />
                  <div>
                    <Label className="text-xs text-slate-500">SVG Color</Label>
                    <div className="flex gap-2 items-center mt-1">
                      <input
                        type="color"
                        value={selectedEl.svgColor || design.accent_color}
                        onChange={(e) =>
                          onUpdateElement(selectedEl.id, { svgColor: e.target.value })
                        }
                        className="w-8 h-8 rounded cursor-pointer border border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SHAPE PROPERTIES */}
              {selectedEl.type === "shape" && (
                <div className="space-y-3">
                  <Label className="text-xs text-slate-500">Shape</Label>
                  <Select
                    value={selectedEl.shapeType || "rect"}
                    onValueChange={(v) =>
                      onUpdateElement(selectedEl.id, { shapeType: v as ShapeType })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SHAPE_OPTIONS.map((s) => (
                        <SelectItem key={s.type} value={s.type}>
                          {s.icon} {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-slate-500">Fill</Label>
                      <div className="flex gap-2 items-center mt-1">
                        <input
                          type="color"
                          value={selectedEl.fillColor || "ffffff"}
                          onChange={(e) =>
                            onUpdateElement(selectedEl.id, { fillColor: e.target.value })
                          }
                          className="w-8 h-8 rounded cursor-pointer border border-slate-200"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500">Stroke</Label>
                      <div className="flex gap-2 items-center mt-1">
                        <input
                          type="color"
                          value={selectedEl.strokeColor || design.accent_color}
                          onChange={(e) =>
                            onUpdateElement(selectedEl.id, { strokeColor: e.target.value })
                          }
                          className="w-8 h-8 rounded cursor-pointer border border-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DATE PROPERTIES */}
              {selectedEl.type === "date" && (
                <div className="space-y-3">
                  <Label className="text-xs text-slate-500">Date Format</Label>
                  <Select
                    value={selectedEl.dateFormat || "MMMM D, YYYY"}
                    onValueChange={(v) => onUpdateElement(selectedEl.id, { dateFormat: v })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "YYYY-MM-DD",
                        "MM/DD/YYYY",
                        "DD/MM/YYYY",
                        "MMMM D, YYYY",
                        "MMM D, YYYY",
                        "D MMMM YYYY",
                      ].map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div>
                    <Label className="text-xs text-slate-500">Label</Label>
                    <Input
                      value={selectedEl.label || ""}
                      onChange={(e) => onUpdateElement(selectedEl.id, { label: e.target.value })}
                      placeholder="Date"
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* POSITION & SIZE */}
              <div className="space-y-3">
                <Label className="text-xs text-slate-500 font-semibold">Position & Size</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10px] text-slate-400">X</Label>
                    <Input
                      type="number"
                      value={Math.round(selectedEl.x)}
                      onChange={(e) =>
                        onUpdateElement(selectedEl.id, { x: parseInt(e.target.value) || 0 })
                      }
                      className="h-7 text-xs font-mono mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-slate-400">Y</Label>
                    <Input
                      type="number"
                      value={Math.round(selectedEl.y)}
                      onChange={(e) =>
                        onUpdateElement(selectedEl.id, { y: parseInt(e.target.value) || 0 })
                      }
                      className="h-7 text-xs font-mono mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-slate-400">Width</Label>
                    <Input
                      type="number"
                      value={Math.round(selectedEl.width || 0)}
                      onChange={(e) =>
                        onUpdateElement(selectedEl.id, {
                          width: parseInt(e.target.value) || undefined,
                        })
                      }
                      className="h-7 text-xs font-mono mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-slate-400">Height</Label>
                    <Input
                      type="number"
                      value={Math.round(selectedEl.height || 0)}
                      onChange={(e) =>
                        onUpdateElement(selectedEl.id, {
                          height: parseInt(e.target.value) || undefined,
                        })
                      }
                      className="h-7 text-xs font-mono mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-[10px] text-slate-400">
                    Rotation: {Math.round(selectedEl.rotation || 0)}°
                  </Label>
                  <Slider
                    value={[selectedEl.rotation || 0]}
                    min={-180}
                    max={180}
                    onValueChange={(v) => onUpdateElement(selectedEl.id, { rotation: v[0] })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-slate-400">
                    Opacity: {Math.round((selectedEl.opacity ?? 1) * 100)}%
                  </Label>
                  <Slider
                    value={[(selectedEl.opacity ?? 1) * 100]}
                    min={0}
                    max={100}
                    onValueChange={(v) => onUpdateElement(selectedEl.id, { opacity: v[0] / 100 })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* COLOR PALETTES */}
          <div className="border-t border-slate-100 pt-4">
            <button
              onClick={() => toggle("colors")}
              className="flex items-center gap-2 text-xs font-bold text-slate-900 w-full mb-3"
            >
              {expandedSections.colors ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
              <Palette className="h-4 w-4 text-[#6B5BFB]" /> Color Palette
            </button>
            {expandedSections.colors && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-1.5">
                  {COLOR_PALETTES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() =>
                        onUpdateDesign({
                          accent_color: p.accent,
                          bg_color: p.bg,
                          text_color: p.text,
                          accent_color_2: p.accent2,
                        })
                      }
                      className={`p-2 rounded-lg border text-left transition-all text-[10px] ${
                        design.accent_color === p.accent && design.bg_color === p.bg
                          ? "border-[#6B5BFB] ring-1 ring-[#6B5BFB]/30"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex gap-1 mb-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: p.accent }}
                        />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.bg }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.text }} />
                      </div>
                      <span className="font-medium text-slate-700">{p.name}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <Label className="text-xs text-slate-500">Accent</Label>
                    <div className="flex gap-2 items-center mt-1">
                      <input
                        type="color"
                        value={design.accent_color}
                        onChange={(e) => onUpdateDesign({ accent_color: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer border border-slate-200"
                      />
                      <Input
                        value={design.accent_color}
                        onChange={(e) => onUpdateDesign({ accent_color: e.target.value })}
                        className="h-7 text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Accent 2</Label>
                    <div className="flex gap-2 items-center mt-1">
                      <input
                        type="color"
                        value={design.accent_color_2 || "#8a6d2b"}
                        onChange={(e) => onUpdateDesign({ accent_color_2: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer border border-slate-200"
                      />
                      <Input
                        value={design.accent_color_2 || ""}
                        onChange={(e) => onUpdateDesign({ accent_color_2: e.target.value })}
                        className="h-7 text-xs font-mono"
                        placeholder="#8a6d2b"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Background</Label>
                    <div className="flex gap-2 items-center mt-1">
                      <input
                        type="color"
                        value={design.bg_color}
                        onChange={(e) => onUpdateDesign({ bg_color: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer border border-slate-200"
                      />
                      <Input
                        value={design.bg_color}
                        onChange={(e) => onUpdateDesign({ bg_color: e.target.value })}
                        className="h-7 text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Text</Label>
                    <div className="flex gap-2 items-center mt-1">
                      <input
                        type="color"
                        value={design.text_color}
                        onChange={(e) => onUpdateDesign({ text_color: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer border border-slate-200"
                      />
                      <Input
                        value={design.text_color}
                        onChange={(e) => onUpdateDesign({ text_color: e.target.value })}
                        className="h-7 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* TYPOGRAPHY */}
          <div className="border-t border-slate-100 pt-4">
            <button
              onClick={() => toggle("typography")}
              className="flex items-center gap-2 text-xs font-bold text-slate-900 w-full mb-3"
            >
              {expandedSections.typography ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
              <Type className="h-4 w-4 text-[#6B5BFB]" /> Typography
            </button>
            {expandedSections.typography && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-slate-500">Title Font</Label>
                  <Select
                    value={design.title_font || design.font_family}
                    onValueChange={(v) => onUpdateDesign({ title_font: v, font_family: v })}
                  >
                    <SelectTrigger className="mt-1 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONTS.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Body Font</Label>
                  <Select
                    value={design.body_font || design.font_family}
                    onValueChange={(v) => onUpdateDesign({ body_font: v })}
                  >
                    <SelectTrigger className="mt-1 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONTS.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* LAYOUT & DECORATION */}
          <div className="border-t border-slate-100 pt-4">
            <button
              onClick={() => toggle("layout")}
              className="flex items-center gap-2 text-xs font-bold text-slate-900 w-full mb-3"
            >
              {expandedSections.layout ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
              <Layout className="h-4 w-4 text-[#6B5BFB]" /> Layout & Decoration
            </button>
            {expandedSections.layout && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-slate-500">Background Pattern</Label>
                  <Select
                    value={design.background_pattern}
                    onValueChange={(v) => onUpdateDesign({ background_pattern: v })}
                  >
                    <SelectTrigger className="mt-1 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PATTERN_OPTIONS.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Border Style</Label>
                  <Select
                    value={design.border_style}
                    onValueChange={(v) => onUpdateDesign({ border_style: v })}
                  >
                    <SelectTrigger className="mt-1 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BORDER_OPTIONS.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.icon} {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Corners</Label>
                  <Select
                    value={design.corner_style}
                    onValueChange={(v) => onUpdateDesign({ corner_style: v })}
                  >
                    <SelectTrigger className="mt-1 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["none", "diagonal", "ribbon"].map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {design.border_style !== "none" && (
                  <div>
                    <Label className="text-xs text-slate-500">
                      Border Width: {design.border_width}px
                    </Label>
                    <Slider
                      value={[design.border_width]}
                      min={1}
                      max={40}
                      onValueChange={(v) => onUpdateDesign({ border_width: v[0] })}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ASSETS */}
          <div className="border-t border-slate-100 pt-4">
            <button
              onClick={() => toggle("assets")}
              className="flex items-center gap-2 text-xs font-bold text-slate-900 w-full mb-3"
            >
              {expandedSections.assets ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
              <ImageIcon className="h-4 w-4 text-[#6B5BFB]" /> Assets
            </button>
            {expandedSections.assets && (
              <div className="space-y-4">
                {/* Logo */}
                <div>
                  <Label className="text-xs text-slate-500">Logo</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={bgImageUrl}
                      onChange={(e) => onUpdateBgImageUrl(e.target.value)}
                      placeholder="https://... or /favicon.ico"
                      className="text-xs flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs shrink-0"
                      onClick={() =>
                        setImageEditor({
                          open: true,
                          title: "Edit Logo",
                          initialUrl: bgImageUrl,
                          aspectRatio: 1,
                          outputWidth: 200,
                          outputHeight: 200,
                          onApply: (dataUrl) => onUpdateBgImageUrl(dataUrl),
                        })
                      }
                    >
                      <Scissors className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <label className="cursor-pointer inline-flex items-center justify-center h-8 px-3 bg-slate-100 hover:bg-slate-200 rounded-lg border text-xs font-medium shrink-0">
                      <Upload className="h-3 w-3 mr-1" /> Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setImageEditor({
                              open: true,
                              title: "Edit Logo",
                              initialUrl: URL.createObjectURL(f),
                              aspectRatio: 1,
                              outputWidth: 200,
                              outputHeight: 200,
                              onApply: (dataUrl) => onUpdateBgImageUrl(dataUrl),
                            });
                          }
                        }}
                      />
                    </label>
                  </div>
                  {bgImageUrl && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={bgImageUrl}
                        alt="Logo preview"
                        className="h-10 w-10 object-contain rounded border border-slate-200 bg-white"
                      />
                      <span className="text-[10px] text-slate-400">Logo preview</span>
                    </div>
                  )}
                </div>

                {/* Signature */}
                <div>
                  <Label className="text-xs text-slate-500">Signature</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={elements.find((e) => e.type === "signature")?.url || ""}
                      onChange={(e) => {
                        const sig = elements.find((e) => e.type === "signature");
                        if (sig) onUpdateElement(sig.id, { url: e.target.value });
                      }}
                      placeholder="https://...signature.png"
                      className="text-xs flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs shrink-0"
                      onClick={() => {
                        const sig = elements.find((e) => e.type === "signature");
                        setImageEditor({
                          open: true,
                          title: "Edit Signature",
                          initialUrl: sig?.url || "",
                          aspectRatio: 2,
                          outputWidth: 300,
                          outputHeight: 150,
                          onApply: (dataUrl) => {
                            if (sig) onUpdateElement(sig.id, { url: dataUrl });
                          },
                        });
                      }}
                    >
                      <Scissors className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <label className="cursor-pointer inline-flex items-center justify-center h-8 px-3 bg-slate-100 hover:bg-slate-200 rounded-lg border text-xs font-medium shrink-0">
                      <Upload className="h-3 w-3 mr-1" /> Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const sig = elements.find((el) => el.type === "signature");
                          setImageEditor({
                            open: true,
                            title: "Edit Signature",
                            initialUrl: URL.createObjectURL(f),
                            aspectRatio: 2,
                            outputWidth: 300,
                            outputHeight: 150,
                            onApply: (dataUrl) => {
                              if (sig?.id) onUpdateElement(sig.id, { url: dataUrl });
                            },
                          });
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Upload signature — background will be removed for transparent overlay
                  </p>
                </div>

                {/* Stamp */}
                <div>
                  <Label className="text-xs text-slate-500">Stamp / Seal</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={elements.find((e) => e.type === "seal_icon")?.url || ""}
                      onChange={(e) => {
                        const seal = elements.find((e) => e.type === "seal_icon");
                        if (seal) onUpdateElement(seal.id, { url: e.target.value });
                      }}
                      placeholder="https://...stamp.png"
                      className="text-xs flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs shrink-0"
                      onClick={() => {
                        const seal = elements.find((e) => e.type === "seal_icon");
                        setImageEditor({
                          open: true,
                          title: "Edit Stamp",
                          initialUrl: seal?.url || "",
                          aspectRatio: 1,
                          outputWidth: 200,
                          outputHeight: 200,
                          onApply: (dataUrl) => {
                            if (seal) onUpdateElement(seal.id, { url: dataUrl });
                          },
                        });
                      }}
                    >
                      <Scissors className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <label className="cursor-pointer inline-flex items-center justify-center h-8 px-3 bg-slate-100 hover:bg-slate-200 rounded-lg border text-xs font-medium shrink-0">
                      <Upload className="h-3 w-3 mr-1" /> Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const seal = elements.find((e) => e.type === "seal_icon");
                          if (seal) {
                            setImageEditor({
                              open: true,
                              title: "Edit Stamp",
                              initialUrl: URL.createObjectURL(f),
                              aspectRatio: 1,
                              outputWidth: 200,
                              outputHeight: 200,
                              onApply: (dataUrl) => onUpdateElement(seal.id, { url: dataUrl }),
                            });
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Upload official stamp or seal image
                  </p>
                </div>

                {/* Background Toggle */}
                <div>
                  <Label className="text-xs text-slate-500">Template Background</Label>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-slate-400">
                      {design.show_bg_image === false ? "Hidden" : "Visible"}
                    </span>
                    <Switch
                      checked={design.show_bg_image !== false}
                      onCheckedChange={(v) => onUpdateDesign({ show_bg_image: v })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Image Editor Modal */}
          <ImageEditor
            open={imageEditor.open}
            onClose={() => setImageEditor((prev) => ({ ...prev, open: false }))}
            onApply={imageEditor.onApply}
            initialUrl={imageEditor.initialUrl}
            title={imageEditor.title}
            aspectRatio={imageEditor.aspectRatio}
            outputWidth={imageEditor.outputWidth}
            outputHeight={imageEditor.outputHeight}
          />

          {/* SVG ICON LIBRARY */}
          <div className="border-t border-slate-100 pt-4">
            <button
              onClick={() => toggle("svgPicker")}
              className="flex items-center gap-2 text-xs font-bold text-slate-900 w-full mb-3"
            >
              {expandedSections.svgPicker ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
              <Shapes className="h-4 w-4 text-[#6B5BFB]" /> SVG Icon Library
            </button>
            {expandedSections.svgPicker && (
              <div className="space-y-2">
                <Input
                  value={svgSearch}
                  onChange={(e) => setSvgSearch(e.target.value)}
                  placeholder="Search icons..."
                  className="h-8 text-xs"
                />
                <div className="flex gap-1 overflow-x-auto pb-1">
                  {SVG_CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSvgCategory(c.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap ${
                        svgCategory === c.id
                          ? "bg-[#6B5BFB] text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-5 gap-1 max-h-40 overflow-y-auto">
                  {filteredSvgs.map((icon) => (
                    <button
                      key={icon.id}
                      onClick={() => onAddSvg(icon.svg, icon.name)}
                      className="aspect-square p-1.5 rounded-lg border border-slate-200 hover:border-[#6B5BFB]/40 hover:bg-[#6B5BFB]/5 transition-all flex items-center justify-center"
                      title={icon.name}
                      dangerouslySetInnerHTML={{
                        __html: icon.svg.replace(/currentColor/, design.accent_color),
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
