import { useState } from "react";
import {
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Layers,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  Copy,
  Trash2,
  Grid3X3,
  Magnet,
  Maximize,
  Sliders,
  Palette,
  Minus,
  Plus,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CertElement,
  CertDesign,
  FONTS,
  COLOR_PALETTES,
  PATTERN_OPTIONS,
  BORDER_OPTIONS,
} from "./types";

type CanvaFormatBarProps = {
  selectedElement: CertElement | undefined;
  design: CertDesign;
  onUpdateElement: (id: string, updates: Partial<CertElement>) => void;
  onUpdateDesign: (updates: Partial<CertDesign>) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  canvasWidth?: number;
  canvasHeight?: number;
  showGrid: boolean;
  onToggleGrid: () => void;
  snapToGrid: boolean;
  onToggleSnap: () => void;
  totalElementsCount?: number;
};

const COMMON_COLORS = [
  "#000000",
  "#1A1A2E",
  "#334155",
  "#64748B",
  "#94A3B8",
  "#FFFFFF",
  "#D4AF37", // Gold
  "#B38728",
  "#FBF5B7",
  "#1E3A8A", // Royal Navy
  "#2563EB",
  "#0D9488", // Teal
  "#059669", // Emerald
  "#DC2626", // Crimson
  "#7C3AED", // Purple
  "#BE185D", // Rose
];

export function CanvaFormatBar({
  selectedElement,
  design,
  onUpdateElement,
  onUpdateDesign,
  onDuplicateElement,
  onDeleteElement,
  canvasWidth = 842,
  canvasHeight = 595,
  showGrid,
  onToggleGrid,
  snapToGrid,
  onToggleSnap,
}: CanvaFormatBarProps) {
  const el = selectedElement;
  const isText = el && (el.type === "text" || el.type === "date" || el.type === "dynamic_text" || el.type === "student_name" || el.type === "course_title" || el.type === "credential_id");
  const isShape = el && el.type === "shape";
  const isSvg = el && el.type === "svg";
  const isDivider = el && el.type === "divider_line";
  const isImageOrBadge = el && (el.type === "image" || el.type === "org_logo" || el.type === "signature" || el.type === "qr" || el.type === "badge" || el.type === "seal_icon");

  const [fontSearch, setFontSearch] = useState("");

  // Alignment helpers
  const alignCenterH = () => {
    if (!el) return;
    const w = el.width || 100;
    onUpdateElement(el.id, { x: Math.round((canvasWidth - w) / 2) });
  };

  const alignCenterV = () => {
    if (!el) return;
    const h = el.height || 40;
    onUpdateElement(el.id, { y: Math.round((canvasHeight - h) / 2) });
  };

  const currentFontSize = el?.fontSize || 20;

  return (
    <div className="h-11 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 flex items-center justify-between gap-2 overflow-x-auto text-xs shrink-0 select-none z-20">
      {/* LEFT SECTION: Contextual controls based on selection */}
      <div className="flex items-center gap-1.5 shrink-0">
        {isText ? (
          <>
            {/* Font Family Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 text-xs font-medium max-w-[150px] truncate justify-between border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60"
                  style={{ fontFamily: el.fontFamily || design.font_family }}
                >
                  <span className="truncate">{el.fontFamily || design.font_family || "Font"}</span>
                  <ChevronDown className="h-3 w-3 ml-1 opacity-50 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="start">
                <Input
                  value={fontSearch}
                  onChange={(e) => setFontSearch(e.target.value)}
                  placeholder="Filter fonts..."
                  className="h-7 text-xs mb-2"
                />
                <div className="max-h-60 overflow-y-auto space-y-0.5">
                  {FONTS.filter((f) => !fontSearch || f.label.toLowerCase().includes(fontSearch.toLowerCase()))
                    .slice(0, 40)
                    .map((f) => (
                      <button
                        key={f.value}
                        onClick={() => onUpdateElement(el.id, { fontFamily: f.value })}
                        className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors truncate ${
                          (el.fontFamily || design.font_family) === f.value
                            ? "bg-primary/10 text-primary font-semibold"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                        }`}
                        style={{ fontFamily: f.value }}
                      >
                        {f.label}
                      </button>
                    ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Font Size [-] [num] [+] */}
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden bg-slate-50 dark:bg-slate-800/60 h-8">
              <button
                onClick={() => onUpdateElement(el.id, { fontSize: Math.max(8, currentFontSize - 2) })}
                className="px-2 h-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                title="Decrease font size"
              >
                <Minus className="h-3 w-3" />
              </button>
              <input
                type="number"
                value={currentFontSize}
                onChange={(e) => onUpdateElement(el.id, { fontSize: Number(e.target.value) || 12 })}
                className="w-11 text-center bg-transparent border-0 text-xs font-mono font-medium focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() => onUpdateElement(el.id, { fontSize: Math.min(140, currentFontSize + 2) })}
                className="px-2 h-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                title="Increase font size"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            {/* Text Color Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="h-8 px-2 flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  title="Text color"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shadow-xs"
                    style={{ backgroundColor: el.color || design.text_color }}
                  />
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                <div className="text-[11px] font-semibold text-slate-500 mb-2">Text Color</div>
                <div className="grid grid-cols-8 gap-1 mb-3">
                  {COMMON_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => onUpdateElement(el.id, { color: c })}
                      className="w-5 h-5 rounded-md border border-slate-300 dark:border-slate-600 hover:scale-110 transition-transform"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={el.color || design.text_color}
                    onChange={(e) => onUpdateElement(el.id, { color: e.target.value })}
                    className="w-8 h-8 rounded border p-0.5 cursor-pointer"
                  />
                  <Input
                    value={el.color || design.text_color}
                    onChange={(e) => onUpdateElement(el.id, { color: e.target.value })}
                    className="h-8 font-mono text-xs uppercase"
                  />
                </div>
              </PopoverContent>
            </Popover>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

            {/* B / I / U / S */}
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden bg-slate-50 dark:bg-slate-800/60 h-8">
              <button
                onClick={() => onUpdateElement(el.id, { fontWeight: el.fontWeight === "bold" ? "normal" : "bold" })}
                className={`px-2 h-full transition-colors ${
                  el.fontWeight === "bold" ? "bg-primary text-primary-foreground font-bold" : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
                title="Bold (Ctrl+B)"
              >
                <Bold className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onUpdateElement(el.id, { fontStyle: el.fontStyle === "italic" ? "normal" : "italic" })}
                className={`px-2 h-full transition-colors ${
                  el.fontStyle === "italic" ? "bg-primary text-primary-foreground italic" : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
                title="Italic (Ctrl+I)"
              >
                <Italic className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() =>
                  onUpdateElement(el.id, {
                    textDecoration: el.textDecoration === "underline" ? "none" : "underline",
                  })
                }
                className={`px-2 h-full transition-colors ${
                  el.textDecoration === "underline" ? "bg-primary text-primary-foreground" : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
                title="Underline (Ctrl+U)"
              >
                <Underline className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() =>
                  onUpdateElement(el.id, {
                    textDecoration: el.textDecoration === "line-through" ? "none" : "line-through",
                  })
                }
                className={`px-2 h-full transition-colors ${
                  el.textDecoration === "line-through" ? "bg-primary text-primary-foreground" : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
                title="Strikethrough"
              >
                <Strikethrough className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Alignment Group */}
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden bg-slate-50 dark:bg-slate-800/60 h-8">
              {(["left", "center", "right", "justify"] as const).map((align) => {
                const Icon =
                  align === "left"
                    ? AlignLeft
                    : align === "center"
                      ? AlignCenter
                      : align === "right"
                        ? AlignRight
                        : AlignJustify;
                const active = (el.align || "center") === align;
                return (
                  <button
                    key={align}
                    onClick={() => onUpdateElement(el.id, { align })}
                    className={`px-2 h-full transition-colors ${
                      active ? "bg-primary text-primary-foreground" : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                    title={`Align ${align}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </button>
                );
              })}
            </div>

            {/* Uppercase toggle */}
            <Button
              variant={el.textTransform === "uppercase" ? "default" : "outline"}
              size="sm"
              className="h-8 px-2 text-xs font-semibold"
              onClick={() =>
                onUpdateElement(el.id, {
                  textTransform: el.textTransform === "uppercase" ? "none" : "uppercase",
                })
              }
              title="Toggle uppercase"
            >
              aA
            </Button>

            {/* Spacing Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2 text-xs" title="Letter & line spacing">
                  <Sliders className="h-3.5 w-3.5 mr-1" /> Spacing
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3 space-y-4" align="start">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span>Letter Spacing</span>
                    <span className="font-mono text-muted-foreground">{el.letterSpacing || 0}px</span>
                  </div>
                  <Slider
                    value={[el.letterSpacing || 0]}
                    min={-2}
                    max={20}
                    step={0.5}
                    onValueChange={([val]) => onUpdateElement(el.id, { letterSpacing: val })}
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span>Line Height</span>
                    <span className="font-mono text-muted-foreground">{el.lineHeight || 1.2}</span>
                  </div>
                  <Slider
                    value={[el.lineHeight || 1.2]}
                    min={0.8}
                    max={2.5}
                    step={0.1}
                    onValueChange={([val]) => onUpdateElement(el.id, { lineHeight: val })}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </>
        ) : isShape ? (
          <>
            {/* Shape Fill Color */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2 text-xs gap-1.5">
                  <span
                    className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600"
                    style={{ backgroundColor: el.fillColor || "transparent" }}
                  />
                  Fill
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                <div className="text-[11px] font-semibold text-slate-500 mb-2">Fill Color</div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs mb-2 h-7"
                  onClick={() => onUpdateElement(el.id, { fillColor: "transparent" })}
                >
                  Transparent Fill
                </Button>
                <div className="grid grid-cols-8 gap-1 mb-2">
                  {COMMON_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => onUpdateElement(el.id, { fillColor: c })}
                      className="w-5 h-5 rounded border border-slate-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={el.fillColor === "transparent" ? "#ffffff" : (el.fillColor || "#D4AF37")}
                  onChange={(e) => onUpdateElement(el.id, { fillColor: e.target.value })}
                  className="w-full h-8 rounded border p-0.5 cursor-pointer"
                />
              </PopoverContent>
            </Popover>

            {/* Shape Border Color */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2 text-xs gap-1.5">
                  <span
                    className="w-4 h-4 rounded border-2"
                    style={{ borderColor: el.strokeColor || design.accent_color }}
                  />
                  Stroke
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                <div className="text-[11px] font-semibold text-slate-500 mb-2">Border Color</div>
                <div className="grid grid-cols-8 gap-1 mb-2">
                  {COMMON_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => onUpdateElement(el.id, { strokeColor: c })}
                      className="w-5 h-5 rounded border border-slate-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={el.strokeColor || design.accent_color}
                  onChange={(e) => onUpdateElement(el.id, { strokeColor: e.target.value })}
                  className="w-full h-8 rounded border p-0.5 cursor-pointer"
                />
              </PopoverContent>
            </Popover>

            {/* Stroke Width Slider */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                  Width: {el.strokeWidth || 2}px
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-3" align="start">
                <div className="flex justify-between text-xs mb-2">
                  <span>Stroke Width</span>
                  <span className="font-mono">{el.strokeWidth || 2}px</span>
                </div>
                <Slider
                  value={[el.strokeWidth || 2]}
                  min={0}
                  max={20}
                  step={1}
                  onValueChange={([val]) => onUpdateElement(el.id, { strokeWidth: val })}
                />
              </PopoverContent>
            </Popover>

            {/* Corner Radius Slider (for rect) */}
            {el.shapeType === "rect" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                    Radius: {el.borderRadius || 0}px
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-3" align="start">
                  <div className="flex justify-between text-xs mb-2">
                    <span>Corner Radius</span>
                    <span className="font-mono">{el.borderRadius || 0}px</span>
                  </div>
                  <Slider
                    value={[el.borderRadius || 0]}
                    min={0}
                    max={60}
                    step={2}
                    onValueChange={([val]) => onUpdateElement(el.id, { borderRadius: val })}
                  />
                </PopoverContent>
              </Popover>
            )}
          </>
        ) : isDivider ? (
          <>
            {/* Divider Color */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2 text-xs gap-1.5">
                  <span
                    className="w-4 h-4 rounded-full border border-slate-300"
                    style={{ backgroundColor: el.color || design.accent_color }}
                  />
                  Line Color
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                <div className="grid grid-cols-8 gap-1 mb-2">
                  {COMMON_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => onUpdateElement(el.id, { color: c })}
                      className="w-5 h-5 rounded border border-slate-300"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={el.color || design.accent_color}
                  onChange={(e) => onUpdateElement(el.id, { color: e.target.value })}
                  className="w-full h-8 rounded border p-0.5 cursor-pointer"
                />
              </PopoverContent>
            </Popover>

            {/* Line Thickness */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                  Thickness: {el.height || 4}px
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-3" align="start">
                <Slider
                  value={[el.height || 4]}
                  min={1}
                  max={20}
                  step={1}
                  onValueChange={([val]) => onUpdateElement(el.id, { height: val })}
                />
              </PopoverContent>
            </Popover>
          </>
        ) : isSvg ? (
          <>
            {/* SVG Tint Color */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2 text-xs gap-1.5">
                  <span
                    className="w-4 h-4 rounded border border-slate-300"
                    style={{ backgroundColor: el.svgColor || design.accent_color }}
                  />
                  Icon Color
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                <div className="grid grid-cols-8 gap-1 mb-2">
                  {COMMON_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => onUpdateElement(el.id, { svgColor: c })}
                      className="w-5 h-5 rounded border border-slate-300"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={el.svgColor || design.accent_color}
                  onChange={(e) => onUpdateElement(el.id, { svgColor: e.target.value })}
                  className="w-full h-8 rounded border p-0.5 cursor-pointer"
                />
              </PopoverContent>
            </Popover>
          </>
        ) : isImageOrBadge ? (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-mono">{el.width} × {el.height} px</span>
          </div>
        ) : (
          /* CANVAS SETTINGS (when no element is selected) */
          <div className="flex items-center gap-2">
            {/* Background Color */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2 text-xs gap-1.5 border-slate-200 dark:border-slate-700">
                  <span
                    className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shadow-xs"
                    style={{ backgroundColor: design.bg_color }}
                  />
                  Canvas BG
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                <div className="text-[11px] font-semibold text-slate-500 mb-2">Background Color</div>
                <div className="grid grid-cols-8 gap-1 mb-2">
                  {["#FFFFFF", "#FAF8F5", "#F8FAFC", "#F0FDF4", "#FFFBEB", "#F5F3FF", "#0A1628", "#020617"].map((c) => (
                    <button
                      key={c}
                      onClick={() => onUpdateDesign({ bg_color: c })}
                      className="w-5 h-5 rounded border border-slate-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={design.bg_color}
                  onChange={(e) => onUpdateDesign({ bg_color: e.target.value })}
                  className="w-full h-8 rounded border p-0.5 cursor-pointer"
                />
              </PopoverContent>
            </Popover>

            {/* Pattern Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2 text-xs border-slate-200 dark:border-slate-700">
                  Pattern: {PATTERN_OPTIONS.find((p) => p.id === design.background_pattern)?.label || "None"}
                  <ChevronDown className="h-3 w-3 ml-1 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44">
                {PATTERN_OPTIONS.map((p) => (
                  <DropdownMenuItem
                    key={p.id}
                    onClick={() => onUpdateDesign({ background_pattern: p.id })}
                    className="text-xs"
                  >
                    {p.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Border Style */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2 text-xs border-slate-200 dark:border-slate-700">
                  Border: {BORDER_OPTIONS.find((b) => b.id === design.border_style)?.label || "Double"}
                  <ChevronDown className="h-3 w-3 ml-1 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44">
                {BORDER_OPTIONS.map((b) => (
                  <DropdownMenuItem
                    key={b.id}
                    onClick={() => onUpdateDesign({ border_style: b.id })}
                    className="text-xs"
                  >
                    {b.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Accent Color */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2 text-xs gap-1.5 border-slate-200 dark:border-slate-700">
                  <span
                    className="w-4 h-4 rounded-full border border-slate-300"
                    style={{ backgroundColor: design.accent_color }}
                  />
                  Accent
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                <div className="text-[11px] font-semibold text-slate-500 mb-2">Accent / Gold Color</div>
                <div className="grid grid-cols-8 gap-1 mb-2">
                  {["#D4AF37", "#C5A059", "#3B82F6", "#10B981", "#6366F1", "#EC4899", "#F97316", "#0F172A"].map((c) => (
                    <button
                      key={c}
                      onClick={() => onUpdateDesign({ accent_color: c })}
                      className="w-5 h-5 rounded border border-slate-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={design.accent_color}
                  onChange={(e) => onUpdateDesign({ accent_color: e.target.value })}
                  className="w-full h-8 rounded border p-0.5 cursor-pointer"
                />
              </PopoverContent>
            </Popover>

            {/* Quick Palette */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2 text-xs gap-1 border-slate-200 dark:border-slate-700">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Palette
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                {COLOR_PALETTES.map((p) => (
                  <DropdownMenuItem
                    key={p.name}
                    onClick={() =>
                      onUpdateDesign({
                        bg_color: p.bg,
                        text_color: p.text,
                        accent_color: p.accent,
                        accent_color_2: p.accent2,
                      })
                    }
                    className="flex items-center justify-between text-xs"
                  >
                    <span>{p.name}</span>
                    <div className="flex gap-1">
                      <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: p.accent }} />
                      <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: p.bg }} />
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* RIGHT SECTION: Alignment, Layering, Lock, Duplicate, Delete, Grid */}
      <div className="flex items-center gap-1.5 shrink-0">
        {el && (
          <>
            {/* Opacity slider */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-slate-600 dark:text-slate-300">
                  {Math.round((el.opacity ?? 1) * 100)}% Opacity
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-3" align="end">
                <div className="flex justify-between text-xs mb-2">
                  <span>Transparency</span>
                  <span className="font-mono">{Math.round((el.opacity ?? 1) * 100)}%</span>
                </div>
                <Slider
                  value={[(el.opacity ?? 1) * 100]}
                  min={10}
                  max={100}
                  step={5}
                  onValueChange={([val]) => onUpdateElement(el.id, { opacity: val / 100 })}
                />
              </PopoverContent>
            </Popover>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

            {/* Position / Canvas Center */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" title="Position & Alignment">
                  <Maximize className="h-3.5 w-3.5 mr-1" /> Align
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={alignCenterH} className="text-xs">
                  Center Horizontally
                </DropdownMenuItem>
                <DropdownMenuItem onClick={alignCenterV} className="text-xs">
                  Center Vertically
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onUpdateElement(el.id, { zIndex: (el.zIndex ?? 10) + 1 })}
                  className="text-xs"
                >
                  <ArrowUp className="h-3.5 w-3.5 mr-2" /> Bring Forward
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onUpdateElement(el.id, { zIndex: Math.max(0, (el.zIndex ?? 10) - 1) })}
                  className="text-xs"
                >
                  <ArrowDown className="h-3.5 w-3.5 mr-2" /> Send Backward
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onUpdateElement(el.id, { zIndex: 99 })}
                  className="text-xs"
                >
                  Bring to Front
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onUpdateElement(el.id, { zIndex: 1 })}
                  className="text-xs"
                >
                  Send to Back
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Lock / Unlock */}
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${el.locked ? "text-amber-500 bg-amber-50 dark:bg-amber-950/40" : "text-slate-600 dark:text-slate-400"}`}
              onClick={() => onUpdateElement(el.id, { locked: !el.locked })}
              title={el.locked ? "Unlock element" : "Lock element"}
            >
              {el.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
            </Button>

            {/* Duplicate */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-600 dark:text-slate-400"
              onClick={() => onDuplicateElement(el.id)}
              title="Duplicate (Ctrl+D)"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>

            {/* Delete */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              onClick={() => onDeleteElement(el.id)}
              title="Delete (Backspace / Del)"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />
          </>
        )}

        {/* Grid & Magnet / Snap toggles */}
        <Button
          variant={showGrid ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={onToggleGrid}
          title="Toggle Grid (G)"
        >
          <Grid3X3 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant={snapToGrid ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={onToggleSnap}
          title="Toggle Snap to Grid"
        >
          <Magnet className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
