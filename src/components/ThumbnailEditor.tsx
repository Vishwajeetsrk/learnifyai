import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Scissors,
  Check,
  Undo,
  Redo,
  RefreshCcw,
  Download,
  Wand2,
  ZoomIn,
  Type,
  Image as ImageIcon,
  Square,
  Layers,
  Sparkles,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Trash2,
} from "lucide-react";
import html2canvas from "html2canvas-pro";
import { Rnd } from "react-rnd";

/* ---------- Constants ---------- */

const THEMES = [
  { id: "none", label: "None", color: "transparent" },
  { id: "indigo", label: "Indigo", color: "rgba(79, 70, 229, 0.4)" },
  { id: "emerald", label: "Emerald", color: "rgba(5, 150, 105, 0.4)" },
  { id: "amber", label: "Amber", color: "rgba(217, 119, 6, 0.4)" },
  { id: "rose", label: "Rose", color: "rgba(225, 29, 72, 0.4)" },
  { id: "noir", label: "Noir", color: "rgba(10, 10, 10, 0.6)" },
  { id: "ocean", label: "Ocean", color: "rgba(14, 116, 144, 0.4)" },
  { id: "cyberpunk", label: "Cyberpunk", color: "rgba(236, 72, 153, 0.4)" },
  { id: "sunset", label: "Sunset", color: "linear-gradient(135deg, rgba(249,115,22,0.4), rgba(236,72,153,0.4))" },
  { id: "luxury", label: "Luxury Gold", color: "rgba(202, 138, 4, 0.3)" },
  { id: "midnight", label: "Midnight", color: "rgba(30, 27, 75, 0.6)" },
];

const FONTS = [
  "Inter", "Poppins", "Montserrat", "Manrope", "Outfit",
  "Space Grotesk", "DM Sans", "Sora", "General Sans", "Plus Jakarta Sans",
  "Arial", "system-ui"
];

/* ---------- Types ---------- */

type LayerType = "image" | "text" | "shape";

interface BaseLayer {
  id: string;
  type: LayerType;
  x: number;
  y: number;
  width: number | string;
  height: number | string;
  rotation: number;
  locked: boolean;
  hidden: boolean;
  zIndex: number;
}

interface ImageLayer extends BaseLayer {
  type: "image";
  src: string;
  flipH: boolean;
  flipV: boolean;
  fit: "contain" | "cover" | "fill";
  filters: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    sepia: number;
    grayscale: number;
    invert: number;
  };
}

interface TextLayer extends BaseLayer {
  type: "text";
  text: string;
  fontFamily: string;
  fontWeight: string;
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  color: string;
  textAlign: "left" | "center" | "right";
  effect: "none" | "shadow" | "glow" | "outline" | "glass" | "gradient" | "neon" | "3d";
}

interface ShapeLayer extends BaseLayer {
  type: "shape";
  shapeType: "rectangle" | "circle" | "blob";
  fill: string;
  radius: number;
}

type AnyLayer = ImageLayer | TextLayer | ShapeLayer;

/* ---------- Helper Functions ---------- */

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

/* ---------- Main Component ---------- */

type Props = {
  open: boolean;
  onClose: () => void;
  image: string | null;
  targetWidth?: number;
  targetHeight?: number;
  onApply: (dataUrl: string) => void;
};

export function ThumbnailEditor({
  open,
  onClose,
  image,
  targetWidth = 1536,
  targetHeight = 1024,
  onApply,
}: Props) {
  const artboardRef = useRef<HTMLDivElement>(null);

  // State
  const [loading, setLoading] = useState(false);
  const [layers, setLayers] = useState<AnyLayer[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [workspaceZoom, setWorkspaceZoom] = useState(0.45); // Scale for the editor UI view
  const [bgState, setBgState] = useState({
    color: "#0f172a",
    theme: "none",
    noise: 0,
    vignette: 0,
  });
  const [showSafeAreas, setShowSafeAreas] = useState(true);

  // Load Initial State
  useEffect(() => {
    if (!open) return;
    if (image) {
      setLayers([
        {
          id: generateId(),
          type: "image",
          src: image,
          x: 0,
          y: 0,
          width: targetWidth,
          height: targetHeight,
          rotation: 0,
          locked: false,
          hidden: false,
          zIndex: 1,
          flipH: false,
          flipV: false,
          fit: "cover",
          filters: {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            blur: 0,
            sepia: 0,
            grayscale: 0,
            invert: 0,
          },
        },
      ]);
    } else {
      setLayers([]);
    }
    setBgState({ color: "#0f172a", theme: "none", noise: 0, vignette: 0 });
    setSelectedId(null);
  }, [open, image, targetWidth, targetHeight]);

  // Actions
  const updateLayer = (id: string, updates: Partial<AnyLayer>) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l)) as AnyLayer[]
    );
  };

  const addTextLayer = () => {
    const l: TextLayer = {
      id: generateId(),
      type: "text",
      x: 100,
      y: targetHeight - 200,
      width: targetWidth - 200,
      height: "auto",
      rotation: 0,
      locked: false,
      hidden: false,
      zIndex: layers.length + 1,
      text: "COURSE TITLE",
      fontFamily: "Inter",
      fontWeight: "900",
      fontSize: 140,
      letterSpacing: -2,
      lineHeight: 1.1,
      color: "#ffffff",
      textAlign: "left",
      effect: "shadow",
    };
    setLayers([...layers, l]);
    setSelectedId(l.id);
  };

  const addShapeLayer = () => {
    const l: ShapeLayer = {
      id: generateId(),
      type: "shape",
      shapeType: "rectangle",
      x: targetWidth / 2 - 150,
      y: targetHeight / 2 - 150,
      width: 300,
      height: 300,
      rotation: 0,
      locked: false,
      hidden: false,
      zIndex: layers.length + 1,
      fill: "#4f46e5",
      radius: 20,
    };
    setLayers([...layers, l]);
    setSelectedId(l.id);
  };

  const deleteLayer = (id: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const duplicateLayer = (id: string) => {
    const target = layers.find((l) => l.id === id);
    if (!target) return;
    const clone = { ...target, id: generateId(), x: Number(target.x) + 40, y: Number(target.y) + 40, zIndex: layers.length + 1 };
    setLayers([...layers, clone] as AnyLayer[]);
    setSelectedId(clone.id);
  };

  const applyChanges = async () => {
    if (!artboardRef.current) return;
    setLoading(true);
    // Hide safe areas before export
    const wasShowing = showSafeAreas;
    setShowSafeAreas(false);
    setSelectedId(null);

    // Give React a tick to hide safe area borders
    await new Promise((res) => setTimeout(res, 50));

    try {
      const canvas = await html2canvas(artboardRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 1, // Export exactly at target resolution (1536x1024)
        backgroundColor: bgState.color,
      });
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      onApply(dataUrl);
      onClose();
    } catch (e) {
      alert("Failed to export image. Ensure images are not blocked by CORS.");
    } finally {
      setShowSafeAreas(wasShowing);
      setLoading(false);
    }
  };

  // AI Macros
  const aiImproveTypography = () => {
    const updated = layers.map((l) => {
      if (l.type === "text") {
        return {
          ...l,
          fontFamily: "Space Grotesk",
          fontWeight: "900",
          letterSpacing: -3,
          effect: "shadow",
        };
      }
      return l;
    });
    setLayers(updated as AnyLayer[]);
  };

  const aiImproveContrast = () => {
    const updated = layers.map((l) => {
      if (l.type === "image") {
        return {
          ...l,
          filters: { ...l.filters, contrast: 120, brightness: 90, saturation: 110 },
        };
      }
      return l;
    });
    setLayers(updated as AnyLayer[]);
    setBgState({ ...bgState, theme: "noir" });
  };

  const selectedLayer = layers.find((l) => l.id === selectedId);
  const activeTheme = THEMES.find((t) => t.id === bgState.theme);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full flex flex-col p-0 gap-0 overflow-hidden bg-background">
        
        {/* --- Toolbar --- */}
        <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/40 shrink-0">
          <div className="flex items-center gap-2">
            <Scissors className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Thumbnail Editor 2.0</span>
            <div className="h-4 w-[1px] bg-border mx-2" />
            <Button variant="ghost" size="icon" className="h-8 w-8"><Undo className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Redo className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setWorkspaceZoom(1)}><ZoomIn className="h-4 w-4" /></Button>
            <div className="text-xs text-muted-foreground w-12 text-center">{Math.round(workspaceZoom * 100)}%</div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={aiImproveTypography}>
              <Sparkles className="h-3 w-3 mr-1.5" /> Auto Type
            </Button>
            <Button variant="outline" size="sm" onClick={aiImproveContrast}>
              <Sparkles className="h-3 w-3 mr-1.5" /> High Contrast
            </Button>
            <div className="h-4 w-[1px] bg-border mx-2" />
            <Label className="flex items-center gap-2 text-xs cursor-pointer">
              <Switch checked={showSafeAreas} onCheckedChange={setShowSafeAreas} />
              Safe Guides
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={applyChanges} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Apply & Save
            </Button>
          </div>
        </div>

        {/* --- Main Workspace --- */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Tools (Add Elements) */}
          <div className="w-16 border-r bg-muted/20 flex flex-col items-center py-4 gap-4 shrink-0 z-10">
            <Button variant="ghost" size="icon" className="h-10 w-10 flex-col gap-1" onClick={() => setSelectedId(null)}>
              <Layers className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 flex-col gap-1" onClick={addTextLayer}>
              <Type className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 flex-col gap-1" onClick={addShapeLayer}>
              <Square className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 flex-col gap-1">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Canvas Area */}
          <div 
            className="flex-1 bg-neutral-900 overflow-auto relative grid place-items-center p-8"
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedId(null) }}
          >
            {/* The scaled viewport wrapper so scrollbars work properly around the zoomed element */}
            <div 
              style={{
                width: targetWidth * workspaceZoom,
                height: targetHeight * workspaceZoom,
                position: "relative",
              }}
            >
              {/* Artboard: The actual div we snapshot */}
              <div
                ref={artboardRef}
                style={{
                  width: targetWidth,
                  height: targetHeight,
                  backgroundColor: bgState.color,
                  transform: `scale(${workspaceZoom})`,
                  transformOrigin: "top left",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  overflow: "hidden",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                }}
              >
                {/* Theme Overlay Base */}
                {activeTheme && activeTheme.color !== "transparent" && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: activeTheme.color,
                      mixBlendMode: "overlay",
                      zIndex: 0,
                    }}
                  />
                )}
                
                {/* Vignette */}
                {bgState.vignette > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `radial-gradient(circle, transparent 40%, rgba(0,0,0,${bgState.vignette / 100}) 120%)`,
                      zIndex: 9999, // below safe guides
                      pointerEvents: "none"
                    }}
                  />
                )}

                {/* Layers Render */}
                {[...layers].sort((a, b) => a.zIndex - b.zIndex).map((layer) => {
                  if (layer.hidden) return null;
                  
                  const isSelected = selectedId === layer.id;

                  // Render content based on type
                  let content = null;
                  if (layer.type === "image") {
                    const l = layer as ImageLayer;
                    const filterStr = `brightness(${l.filters.brightness}%) contrast(${l.filters.contrast}%) saturate(${l.filters.saturation}%) blur(${l.filters.blur}px) sepia(${l.filters.sepia}%) grayscale(${l.filters.grayscale}%) invert(${l.filters.invert}%)`;
                    content = (
                      <img 
                        src={l.src} 
                        alt="Layer" 
                        crossOrigin="anonymous"
                        style={{
                          width: "100%", height: "100%", 
                          objectFit: l.fit,
                          filter: filterStr,
                          transform: `scaleX(${l.flipH ? -1 : 1}) scaleY(${l.flipV ? -1 : 1})`,
                          pointerEvents: "none"
                        }}
                      />
                    );
                  } else if (layer.type === "text") {
                    const l = layer as TextLayer;
                    // Compute text effect css
                    let textShadow = "none";
                    if (l.effect === "shadow") textShadow = "4px 8px 24px rgba(0,0,0,0.7)";
                    if (l.effect === "glow") textShadow = `0 0 20px ${l.color}`;
                    if (l.effect === "outline") textShadow = `-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000`;
                    if (l.effect === "neon") textShadow = `0 0 5px #fff, 0 0 10px #fff, 0 0 20px ${l.color}, 0 0 40px ${l.color}, 0 0 80px ${l.color}`;
                    if (l.effect === "3d") textShadow = `1px 1px 0 #ccc, 2px 2px 0 #bbb, 3px 3px 0 #aaa, 4px 4px 0 #999, 5px 5px 0 #888, 6px 6px 20px rgba(0,0,0,0.5)`;
                    
                    content = (
                      <div style={{
                        width: "100%", height: "100%",
                        fontFamily: `"${l.fontFamily}", sans-serif`,
                        fontWeight: l.fontWeight,
                        fontSize: `${l.fontSize}px`,
                        letterSpacing: `${l.letterSpacing}px`,
                        lineHeight: l.lineHeight,
                        color: l.color,
                        textAlign: l.textAlign,
                        textShadow,
                        wordWrap: "break-word",
                        whiteSpace: "pre-wrap",
                        // Make editable if selected
                        outline: "none"
                      }}>
                        {l.text}
                      </div>
                    );
                  } else if (layer.type === "shape") {
                    const l = layer as ShapeLayer;
                    content = (
                      <div style={{
                        width: "100%", height: "100%",
                        backgroundColor: l.fill,
                        borderRadius: l.shapeType === "circle" ? "50%" : l.shapeType === "blob" ? "30% 70% 70% 30% / 30% 30% 70% 70%" : `${l.radius}px`,
                      }} />
                    );
                  }

                  return (
                    <Rnd
                      key={layer.id}
                      bounds="parent"
                      size={{ width: layer.width, height: layer.height }}
                      position={{ x: Number(layer.x), y: Number(layer.y) }}
                      onDragStop={(e, d) => { updateLayer(layer.id, { x: d.x, y: d.y }); setSelectedId(layer.id); }}
                      onResizeStop={(e, direction, ref, delta, position) => {
                        updateLayer(layer.id, {
                          width: ref.style.width,
                          height: ref.style.height,
                          ...position,
                        });
                        setSelectedId(layer.id);
                      }}
                      disableDragging={layer.locked}
                      enableResizing={!layer.locked}
                      onClick={() => setSelectedId(layer.id)}
                      style={{
                        zIndex: layer.zIndex,
                        transform: `rotate(${layer.rotation}deg)`,
                      }}
                      className={isSelected ? "outline-dashed outline-2 outline-primary outline-offset-4 ring-4 ring-primary/20" : ""}
                      // Ensure text isn't selectable so Rnd drag works easily unless double clicked
                      dragHandleClassName="drag-handle"
                    >
                      <div className="w-full h-full drag-handle" style={{ cursor: layer.locked ? "default" : "move" }}>
                        {content}
                      </div>
                    </Rnd>
                  );
                })}

                {/* Safe Area Guides */}
                {showSafeAreas && (
                  <div className="absolute inset-0 pointer-events-none z-[10000]">
                    {/* YouTube Safe Area (approx 16:9 safe zone for 3:2 canvas) */}
                    <div className="absolute top-[8%] bottom-[8%] left-0 right-0 border-y border-dashed border-red-500/60" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-red-500/60 opacity-50">+</div>
                    {/* UI Margins */}
                    <div className="absolute top-0 bottom-0 right-[4%] border-l border-dashed border-blue-500/60" />
                    <span className="absolute top-2 left-2 text-[10px] text-red-500 bg-black/40 px-1 py-0.5 rounded">Safe Area</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Properties Panel */}
          <div className="w-72 border-l bg-card flex flex-col shrink-0 z-10">
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                
                {!selectedLayer ? (
                  /* Background / Global Props */
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-sm mb-3">Background</h3>
                      <div className="space-y-2">
                        <Label className="text-xs">Background Color</Label>
                        <div className="flex gap-2">
                          <Input 
                            type="color" 
                            value={bgState.color} 
                            onChange={(e) => setBgState({ ...bgState, color: e.target.value })}
                            className="h-9 w-12 p-1"
                          />
                          <Input 
                            value={bgState.color}
                            onChange={(e) => setBgState({ ...bgState, color: e.target.value })}
                            className="flex-1 font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Theme Preset</Label>
                      <Select value={bgState.theme} onValueChange={(v) => setBgState({ ...bgState, theme: v })}>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {THEMES.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              <div className="flex items-center gap-2">
                                {t.color !== "transparent" && <span className="h-3 w-3 rounded-full" style={{ background: t.color }} />}
                                {t.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Vignette ({bgState.vignette}%)</Label>
                      <Slider min={0} max={100} step={1} value={[bgState.vignette]} onValueChange={([v]) => setBgState({ ...bgState, vignette: v })} />
                    </div>

                    <hr className="my-4 border-border" />
                    
                    <h3 className="font-semibold text-sm mb-3">Layer Stack</h3>
                    <div className="space-y-1">
                      {[...layers].sort((a, b) => b.zIndex - a.zIndex).map(l => (
                        <div key={l.id} className={`flex items-center justify-between p-2 rounded border text-xs cursor-pointer ${selectedId === l.id ? 'bg-primary/10 border-primary' : 'bg-muted/30 hover:bg-muted'}`} onClick={() => setSelectedId(l.id)}>
                          <span className="capitalize font-medium truncate max-w-[120px]">
                            {l.type === 'text' ? (l as TextLayer).text : l.type}
                          </span>
                          <div className="flex items-center gap-1">
                            <button onClick={(e) => { e.stopPropagation(); updateLayer(l.id, { hidden: !l.hidden }) }} className="p-1 hover:text-primary">
                              {l.hidden ? <EyeOff className="h-3 w-3 text-muted-foreground" /> : <Eye className="h-3 w-3" />}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); updateLayer(l.id, { locked: !l.locked }) }} className="p-1 hover:text-primary">
                              {l.locked ? <Lock className="h-3 w-3 text-muted-foreground" /> : <Unlock className="h-3 w-3" />}
                            </button>
                          </div>
                        </div>
                      ))}
                      {layers.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">No layers added.</p>}
                    </div>

                  </div>
                ) : (
                  /* Layer Specific Props */
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="font-semibold text-sm capitalize">{selectedLayer.type} Options</h3>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => duplicateLayer(selectedLayer.id)}><Copy className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => deleteLayer(selectedLayer.id)}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </div>

                    {/* Common Positional Props */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">X Pos</Label>
                        <Input type="number" value={Math.round(Number(selectedLayer.x))} onChange={(e) => updateLayer(selectedLayer.id, { x: Number(e.target.value) })} className="h-8 text-xs" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Y Pos</Label>
                        <Input type="number" value={Math.round(Number(selectedLayer.y))} onChange={(e) => updateLayer(selectedLayer.id, { y: Number(e.target.value) })} className="h-8 text-xs" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Rotation</Label>
                        <Input type="number" value={selectedLayer.rotation} onChange={(e) => updateLayer(selectedLayer.id, { rotation: Number(e.target.value) })} className="h-8 text-xs" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Z-Index</Label>
                        <Input type="number" value={selectedLayer.zIndex} onChange={(e) => updateLayer(selectedLayer.id, { zIndex: Number(e.target.value) })} className="h-8 text-xs" />
                      </div>
                    </div>

                    {/* Text Layer Controls */}
                    {selectedLayer.type === "text" && (() => {
                      const l = selectedLayer as TextLayer;
                      return (
                        <>
                          <div className="space-y-2">
                            <Label className="text-xs">Content</Label>
                            <Input value={l.text} onChange={(e) => updateLayer(l.id, { text: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Font Family</Label>
                            <Select value={l.fontFamily} onValueChange={(v) => updateLayer(l.id, { fontFamily: v })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {FONTS.map((f) => <SelectItem key={f} value={f} style={{ fontFamily: f }}>{f}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs">Size</Label>
                              <Input type="number" value={l.fontSize} onChange={(e) => updateLayer(l.id, { fontSize: Number(e.target.value) })} className="h-8" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Weight</Label>
                              <Select value={l.fontWeight} onValueChange={(v) => updateLayer(l.id, { fontWeight: v })}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {["300","400","500","600","700","800","900"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Letter Spacing</Label>
                            <Slider min={-10} max={30} step={1} value={[l.letterSpacing]} onValueChange={([v]) => updateLayer(l.id, { letterSpacing: v })} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Color</Label>
                            <div className="flex gap-2">
                              <Input type="color" value={l.color} onChange={(e) => updateLayer(l.id, { color: e.target.value })} className="h-9 w-12 p-1" />
                              <Input value={l.color} onChange={(e) => updateLayer(l.id, { color: e.target.value })} className="flex-1 font-mono text-xs" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Text Effect</Label>
                            <Select value={l.effect} onValueChange={(v: any) => updateLayer(l.id, { effect: v })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {["none", "shadow", "glow", "outline", "neon", "3d"].map(e => <SelectItem key={e} value={e} className="capitalize">{e}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      );
                    })()}

                    {/* Image Layer Controls */}
                    {selectedLayer.type === "image" && (() => {
                      const l = selectedLayer as ImageLayer;
                      return (
                        <Tabs defaultValue="adjust" className="w-full">
                          <TabsList className="w-full grid grid-cols-2">
                            <TabsTrigger value="adjust">Adjust</TabsTrigger>
                            <TabsTrigger value="filters">Filters</TabsTrigger>
                          </TabsList>
                          <TabsContent value="adjust" className="space-y-4 pt-2">
                            <div className="space-y-2">
                              <Label className="text-xs">Fit Mode</Label>
                              <Select value={l.fit} onValueChange={(v: any) => updateLayer(l.id, { fit: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {["cover", "contain", "fill"].map(e => <SelectItem key={e} value={e} className="capitalize">{e}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Label className="flex items-center gap-2 text-xs">
                                <Switch checked={l.flipH} onCheckedChange={(v) => updateLayer(l.id, { flipH: v })} />
                                Flip Horizontal
                              </Label>
                            </div>
                          </TabsContent>
                          <TabsContent value="filters" className="space-y-4 pt-2">
                            {[
                              { key: 'brightness', label: 'Brightness', min: 0, max: 200 },
                              { key: 'contrast', label: 'Contrast', min: 0, max: 200 },
                              { key: 'saturation', label: 'Saturation', min: 0, max: 200 },
                              { key: 'blur', label: 'Blur', min: 0, max: 50 },
                              { key: 'sepia', label: 'Sepia', min: 0, max: 100 },
                            ].map((filter) => (
                              <div key={filter.key} className="space-y-1">
                                <div className="flex justify-between">
                                  <Label className="text-xs text-muted-foreground">{filter.label}</Label>
                                  <span className="text-[10px] text-muted-foreground">{(l.filters as any)[filter.key]}</span>
                                </div>
                                <Slider 
                                  min={filter.min} max={filter.max} step={1} 
                                  value={[(l.filters as any)[filter.key]]} 
                                  onValueChange={([v]) => updateLayer(l.id, { filters: { ...l.filters, [filter.key]: v } })} 
                                />
                              </div>
                            ))}
                          </TabsContent>
                        </Tabs>
                      );
                    })()}

                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
