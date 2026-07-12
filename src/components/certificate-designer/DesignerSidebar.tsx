import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Layers,
  Image as ImageIcon,
  Square,
  Ribbon,
  RotateCcw,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  CertElement,
  CertDesign,
  FONTS,
  BORDER_OPTIONS,
  PATTERN_OPTIONS,
  THEMES,
  ShapeType,
  SHAPE_OPTIONS,
} from "./types";
import { FontPicker } from "./FontPicker";
import { AssetLibrary } from "./AssetLibrary";

type SidebarProps = {
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
  onAddShape?: (shapeType: ShapeType) => void;
  onAddSvg?: (svg: string, name: string) => void;
  onAddDivider?: () => void;
  onUploadImage?: (file: File) => void;
};

export function DesignerSidebar({
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
  onAddShape,
  onAddSvg,
  onAddDivider,
  onUploadImage,
}: SidebarProps) {
  const selectedEl = elements.find((e) => e.id === selectedId);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    text: true,
    position: true,
    style: true,
    border: true,
    assets: true,
  });

  const toggle = (s: string) => setExpandedSections((p) => ({ ...p, [s]: !p[s] }));

  return (
    <div className="w-[320px] bg-card border-l flex flex-col h-full overflow-hidden shrink-0">
      <Tabs defaultValue={selectedEl ? "properties" : "design"} className="flex-1 flex flex-col">
        <div className="p-2 border-b">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="layers">Layers</TabsTrigger>
            <TabsTrigger value="properties" disabled={!selectedEl}>
              Props
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* DESIGN TAB */}
            <TabsContent value="design" className="m-0 space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Palette className="h-4 w-4 text-primary" /> Theme Presets
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() =>
                        onUpdateDesign({
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
                        })
                      }
                      className="p-2 border rounded text-left hover:border-primary/50 text-xs truncate"
                      style={{
                        background: t.bg,
                        color: t.text,
                        borderLeft: `4px solid ${t.accent}`,
                      }}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <h3 className="font-semibold text-sm">Colors</h3>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { label: "Background", key: "bg_color", value: design.bg_color },
                      { label: "Accent", key: "accent_color", value: design.accent_color },
                      { label: "Text Color", key: "text_color", value: design.text_color },
                      {
                        label: "Accent 2",
                        key: "accent_color_2",
                        value: design.accent_color_2 || "#8a6d2b",
                      },
                    ] as const
                  ).map((c) => (
                    <div key={c.key}>
                      <Label className="text-xs">{c.label}</Label>
                      <div className="flex gap-2 items-center mt-1">
                        <input
                          type="color"
                          value={c.value}
                          onChange={(e) => onUpdateDesign({ [c.key]: e.target.value } as any)}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                        <Input
                          value={c.value}
                          onChange={(e) => onUpdateDesign({ [c.key]: e.target.value } as any)}
                          className="h-8 text-xs font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <h3 className="font-semibold text-sm">Background Pattern</h3>
                <Select
                  value={design.background_pattern}
                  onValueChange={(v) => onUpdateDesign({ background_pattern: v })}
                >
                  <SelectTrigger>
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

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4 text-primary" /> Template Background
                  </h3>
                  <Button
                    size="sm"
                    variant={design.show_bg_image === false ? "outline" : "secondary"}
                    onClick={() =>
                      onUpdateDesign({ show_bg_image: design.show_bg_image === false })
                    }
                    className="h-7 text-[11px]"
                  >
                    {design.show_bg_image === false ? (
                      <Eye className="h-3 w-3 mr-1" />
                    ) : (
                      <EyeOff className="h-3 w-3 mr-1" />
                    )}
                    {design.show_bg_image === false ? "Show PNG Image" : "Hide PNG Image"}
                  </Button>
                </div>
                <Input
                  value={bgImageUrl}
                  onChange={(e) => onUpdateBgImageUrl(e.target.value)}
                  placeholder="https://example.com/image.png"
                  className="text-xs"
                />
                {bgImageUrl && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onUpdateBgImageUrl("")}
                    className="h-7 text-xs text-muted-foreground hover:text-destructive"
                  >
                    Clear background image URL
                  </Button>
                )}
              </div>

              <div className="space-y-3 border-t pt-4">
                <h3 className="font-semibold text-sm">Border Style</h3>
                <Select
                  value={design.border_style}
                  onValueChange={(v) => onUpdateDesign({ border_style: v })}
                >
                  <SelectTrigger>
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
                {design.border_style !== "none" && (
                  <div className="pt-2">
                    <Label className="text-xs mb-2 block">
                      Border Width: {design.border_width}px
                    </Label>
                    <Slider
                      value={[design.border_width]}
                      min={1}
                      max={40}
                      onValueChange={(v) => onUpdateDesign({ border_width: v[0] })}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3 border-t pt-4">
                <h3 className="font-semibold text-sm">Assets Library</h3>
                {onAddShape && onAddSvg && onAddDivider && onUploadImage && (
                  <AssetLibrary
                    onAddShape={onAddShape}
                    onAddSvg={onAddSvg}
                    onAddDivider={onAddDivider}
                    onUploadImage={onUploadImage}
                    accentColor={design.accent_color}
                  />
                )}
              </div>
            </TabsContent>

            {/* LAYERS TAB */}
            <TabsContent value="layers" className="m-0 space-y-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center justify-between">
                <span>Canvas Layers ({elements.length})</span>
                <span className="text-[10px]">Top to Bottom</span>
              </div>
              {[...elements].reverse().map((el) => (
                <div
                  key={el.id}
                  className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                    selectedId === el.id
                      ? "bg-primary/10 border-primary/40 shadow-sm"
                      : "bg-card hover:bg-accent/40 border-border"
                  }`}
                  onClick={() => onSelect(el.id)}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                      {el.type}
                    </span>
                    <span className="truncate font-medium">{el.content || el.type}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateElement(el.id, { hidden: !el.hidden });
                      }}
                      title={el.hidden ? "Unhide" : "Hide"}
                    >
                      {el.hidden ? (
                        <EyeOff className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateElement(el.id, { locked: !el.locked });
                      }}
                      title={el.locked ? "Unlock" : "Lock"}
                    >
                      {el.locked ? (
                        <Lock className="h-3 w-3 text-amber-600" />
                      ) : (
                        <Unlock className="h-3 w-3 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateElement(el.id);
                      }}
                      title="Duplicate"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteElement(el.id);
                      }}
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {elements.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-6">
                  No elements on canvas
                </p>
              )}
            </TabsContent>

            {/* PROPERTIES TAB */}
            <TabsContent value="properties" className="m-0 space-y-6">
              {selectedEl ? (
                <>
                  {/* TEXT PROPERTIES */}
                  {selectedEl.type === "text" && (
                    <div className="space-y-4">
                      <button
                        onClick={() => toggle("text")}
                        className="flex items-center gap-2 text-xs font-semibold w-full"
                      >
                        {expandedSections.text ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                        <Type className="h-3.5 w-3.5 text-primary" /> Text
                      </button>
                      {expandedSections.text && (
                        <>
                          <div>
                            <Label className="text-xs">Content</Label>
                            <Textarea
                              value={selectedEl.content || ""}
                              onChange={(e) =>
                                onUpdateElement(selectedEl.id, { content: e.target.value })
                              }
                              className="mt-1 text-xs min-h-[60px]"
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Font Family</Label>
                            <FontPicker
                              value={selectedEl.fontFamily || design.font_family}
                              onChange={(v) => onUpdateElement(selectedEl.id, { fontFamily: v })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs">Size: {selectedEl.fontSize}px</Label>
                              <Slider
                                value={[selectedEl.fontSize || 16]}
                                min={8}
                                max={200}
                                onValueChange={(v) =>
                                  onUpdateElement(selectedEl.id, { fontSize: v[0] })
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Color</Label>
                              <div className="flex gap-2 items-center mt-1">
                                <input
                                  type="color"
                                  value={selectedEl.color || design.text_color}
                                  onChange={(e) =>
                                    onUpdateElement(selectedEl.id, { color: e.target.value })
                                  }
                                  className="w-8 h-8 rounded cursor-pointer"
                                />
                                <Input
                                  value={selectedEl.color || ""}
                                  onChange={(e) =>
                                    onUpdateElement(selectedEl.id, { color: e.target.value })
                                  }
                                  className="h-8 text-xs font-mono"
                                  placeholder="inherit"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-1 bg-muted p-1 rounded-md">
                            <Button
                              variant={selectedEl.align === "left" ? "secondary" : "ghost"}
                              size="sm"
                              className="h-8"
                              onClick={() => onUpdateElement(selectedEl.id, { align: "left" })}
                            >
                              <AlignLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={selectedEl.align === "center" ? "secondary" : "ghost"}
                              size="sm"
                              className="h-8"
                              onClick={() => onUpdateElement(selectedEl.id, { align: "center" })}
                            >
                              <AlignCenter className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={selectedEl.align === "right" ? "secondary" : "ghost"}
                              size="sm"
                              className="h-8"
                              onClick={() => onUpdateElement(selectedEl.id, { align: "right" })}
                            >
                              <AlignRight className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={selectedEl.fontWeight === "bold" ? "secondary" : "ghost"}
                              size="sm"
                              className="h-8"
                              onClick={() =>
                                onUpdateElement(selectedEl.id, {
                                  fontWeight: selectedEl.fontWeight === "bold" ? "normal" : "bold",
                                })
                              }
                            >
                              <b className="font-serif">B</b>
                            </Button>
                          </div>
                          <div>
                            <Label className="text-xs">
                              Letter Spacing: {selectedEl.letterSpacing || 0}px
                            </Label>
                            <Slider
                              value={[selectedEl.letterSpacing || 0]}
                              min={-5}
                              max={30}
                              step={0.5}
                              onValueChange={(v) =>
                                onUpdateElement(selectedEl.id, { letterSpacing: v[0] })
                              }
                              className="mt-1"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* IMAGE PROPERTIES */}
                  {(selectedEl.type === "image" ||
                    selectedEl.type === "org_logo" ||
                    selectedEl.type === "signature" ||
                    selectedEl.type === "badge") && (
                    <div className="space-y-4">
                      <button
                        onClick={() => toggle("style")}
                        className="flex items-center gap-2 text-xs font-semibold w-full"
                      >
                        {expandedSections.style ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                        <ImageIcon className="h-3.5 w-3.5 text-primary" /> Image Source
                      </button>
                      {expandedSections.style && (
                        <div className="flex gap-2">
                          <Input
                            value={selectedEl.url || ""}
                            onChange={(e) =>
                              onUpdateElement(selectedEl.id, { url: e.target.value })
                            }
                            placeholder="https://..."
                            className="text-xs flex-1"
                          />
                          <label className="cursor-pointer inline-flex items-center justify-center h-9 px-3 bg-secondary hover:bg-secondary/80 rounded-md border text-xs font-medium shrink-0">
                            <Ribbon className="h-3.5 w-3.5 mr-1" /> Upload
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f)
                                  onUpdateElement(selectedEl.id, { url: URL.createObjectURL(f) });
                              }}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SVG PROPERTIES */}
                  {selectedEl.type === "svg" && (
                    <div className="space-y-4">
                      <Label className="text-xs font-semibold">SVG Content</Label>
                      <Textarea
                        value={selectedEl.svgContent || ""}
                        onChange={(e) =>
                          onUpdateElement(selectedEl.id, { svgContent: e.target.value })
                        }
                        className="text-xs font-mono min-h-[80px]"
                        rows={4}
                      />
                      <div>
                        <Label className="text-xs">SVG Color</Label>
                        <div className="flex gap-2 items-center mt-1">
                          <input
                            type="color"
                            value={selectedEl.svgColor || design.accent_color}
                            onChange={(e) =>
                              onUpdateElement(selectedEl.id, { svgColor: e.target.value })
                            }
                            className="w-8 h-8 rounded cursor-pointer"
                          />
                          <Input
                            value={selectedEl.svgColor || ""}
                            onChange={(e) =>
                              onUpdateElement(selectedEl.id, { svgColor: e.target.value })
                            }
                            className="h-8 text-xs font-mono"
                            placeholder="auto"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SHAPE PROPERTIES */}
                  {selectedEl.type === "shape" && (
                    <div className="space-y-4">
                      <Label className="text-xs font-semibold">Shape</Label>
                      <Select
                        value={selectedEl.shapeType || "rectangle"}
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
                          <Label className="text-xs">Fill</Label>
                          <div className="flex gap-2 items-center mt-1">
                            <input
                              type="color"
                              value={selectedEl.fillColor || "transparent"}
                              onChange={(e) =>
                                onUpdateElement(selectedEl.id, { fillColor: e.target.value })
                              }
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <Input
                              value={selectedEl.fillColor || ""}
                              onChange={(e) =>
                                onUpdateElement(selectedEl.id, { fillColor: e.target.value })
                              }
                              className="h-8 text-xs font-mono"
                              placeholder="none"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Stroke</Label>
                          <div className="flex gap-2 items-center mt-1">
                            <input
                              type="color"
                              value={selectedEl.strokeColor || design.accent_color}
                              onChange={(e) =>
                                onUpdateElement(selectedEl.id, { strokeColor: e.target.value })
                              }
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <Input
                              value={selectedEl.strokeColor || ""}
                              onChange={(e) =>
                                onUpdateElement(selectedEl.id, { strokeColor: e.target.value })
                              }
                              className="h-8 text-xs font-mono"
                              placeholder="auto"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">
                          Stroke Width: {selectedEl.strokeWidth || 2}px
                        </Label>
                        <Slider
                          value={[selectedEl.strokeWidth || 2]}
                          min={0}
                          max={20}
                          onValueChange={(v) =>
                            onUpdateElement(selectedEl.id, { strokeWidth: v[0] })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  {/* DATE PROPERTIES */}
                  {selectedEl.type === "date" && (
                    <div className="space-y-4">
                      <Label className="text-xs font-semibold">Date Format</Label>
                      <Select
                        value={selectedEl.dateFormat || "YYYY-MM-DD"}
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
                        <Label className="text-xs">Label</Label>
                        <Input
                          value={selectedEl.label || ""}
                          onChange={(e) =>
                            onUpdateElement(selectedEl.id, { label: e.target.value })
                          }
                          placeholder="Issued Date"
                          className="mt-1 text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* TABLE PROPERTIES */}
                  {selectedEl.type === "table" && (
                    <div className="space-y-4">
                      <Label className="text-xs font-semibold">Table</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Rows</Label>
                          <Input
                            type="number"
                            value={selectedEl.rows || 3}
                            min={1}
                            max={20}
                            onChange={(e) =>
                              onUpdateElement(selectedEl.id, {
                                rows: parseInt(e.target.value) || 3,
                              })
                            }
                            className="mt-1 h-8 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Columns</Label>
                          <Input
                            type="number"
                            value={selectedEl.cols || 2}
                            min={1}
                            max={10}
                            onChange={(e) =>
                              onUpdateElement(selectedEl.id, {
                                cols: parseInt(e.target.value) || 2,
                              })
                            }
                            className="mt-1 h-8 text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">
                          Cell Padding: {selectedEl.cellPadding || 4}px
                        </Label>
                        <Slider
                          value={[selectedEl.cellPadding || 4]}
                          min={0}
                          max={20}
                          onValueChange={(v) =>
                            onUpdateElement(selectedEl.id, { cellPadding: v[0] })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  {/* POSITION & SIZE */}
                  <div className="space-y-4">
                    <button
                      onClick={() => toggle("position")}
                      className="flex items-center gap-2 text-xs font-semibold w-full"
                    >
                      {expandedSections.position ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                      <Layout className="h-3.5 w-3.5 text-primary" /> Position & Size
                    </button>
                    {expandedSections.position && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-[10px] text-muted-foreground">X</Label>
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
                          <Label className="text-[10px] text-muted-foreground">Y</Label>
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
                          <Label className="text-[10px] text-muted-foreground">W</Label>
                          <Input
                            type="number"
                            value={Math.round(selectedEl.width || 0)}
                            onChange={(e) =>
                              onUpdateElement(selectedEl.id, {
                                width: parseInt(e.target.value) || undefined,
                              })
                            }
                            placeholder="Auto"
                            className="h-7 text-xs font-mono mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-[10px] text-muted-foreground">H</Label>
                          <Input
                            type="number"
                            value={Math.round(selectedEl.height || 0)}
                            onChange={(e) =>
                              onUpdateElement(selectedEl.id, {
                                height: parseInt(e.target.value) || undefined,
                              })
                            }
                            placeholder="Auto"
                            className="h-7 text-xs font-mono mt-1"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-[10px] text-muted-foreground flex justify-between">
                            Rotation: {Math.round(selectedEl.rotation || 0)}°
                          </Label>
                          <Slider
                            value={[selectedEl.rotation || 0]}
                            min={-180}
                            max={180}
                            onValueChange={(v) =>
                              onUpdateElement(selectedEl.id, { rotation: v[0] })
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* OPACITY */}
                  <div className="border-t pt-4 space-y-2">
                    <Label className="text-xs flex justify-between">
                      <span>Opacity</span>{" "}
                      <span>{Math.round((selectedEl.opacity ?? 1) * 100)}%</span>
                    </Label>
                    <Slider
                      value={[(selectedEl.opacity ?? 1) * 100]}
                      min={0}
                      max={100}
                      onValueChange={(v) => onUpdateElement(selectedEl.id, { opacity: v[0] / 100 })}
                    />
                  </div>

                  {/* ACTIONS */}
                  <div className="border-t pt-4 grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDuplicateElement(selectedEl.id)}
                    >
                      <Copy className="h-4 w-4 mr-2" /> Duplicate
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteElement(selectedEl.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground text-sm pt-10">
                  Select an element to edit properties
                </div>
              )}
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
