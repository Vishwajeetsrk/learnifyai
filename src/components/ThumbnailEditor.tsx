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
import { Loader2, Scissors, Check } from "lucide-react";

const THEMES = [
  { id: "none", label: "None", color: "transparent" },
  { id: "indigo", label: "Indigo", color: "#4f46e5" },
  { id: "emerald", label: "Emerald", color: "#059669" },
  { id: "amber", label: "Amber", color: "#d97706" },
  { id: "rose", label: "Rose", color: "#e11d48" },
  { id: "noir", label: "Noir", color: "#0a0a0a" },
];

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0); // -100..100 (% of slack)
  const [offsetY, setOffsetY] = useState(0);
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(96);
  const [theme, setTheme] = useState("none");
  const [tintOpacity, setTintOpacity] = useState(0.25);
  const [loading, setLoading] = useState(false);

  // Load image when opened
  useEffect(() => {
    if (!open || !image) {
      setImg(null);
      return;
    }
    setLoading(true);
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => {
      setImg(i);
      setLoading(false);
    };
    i.onerror = () => {
      setLoading(false);
    };
    i.src = image;
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
    setText("");
    setTheme("none");
  }, [open, image]);

  // Redraw
  useEffect(() => {
    const c = canvasRef.current;
    if (!c || !img) return;
    c.width = targetWidth;
    c.height = targetHeight;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    // cover-fit base
    const scale = Math.max(targetWidth / img.width, targetHeight / img.height) * zoom;
    const dw = img.width * scale;
    const dh = img.height * scale;
    const slackX = Math.max(0, dw - targetWidth) / 2;
    const slackY = Math.max(0, dh - targetHeight) / 2;
    const dx = (targetWidth - dw) / 2 + (offsetX / 100) * slackX;
    const dy = (targetHeight - dh) / 2 + (offsetY / 100) * slackY;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    try {
      ctx.drawImage(img, dx, dy, dw, dh);
    } catch {
      /* tainted */
    }

    // tint
    const t = THEMES.find((x) => x.id === theme);
    if (t && t.color !== "transparent") {
      ctx.fillStyle = t.color;
      ctx.globalAlpha = tintOpacity;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.globalAlpha = 1;
    }

    // text overlay
    if (text.trim()) {
      ctx.font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
      ctx.textBaseline = "bottom";
      ctx.textAlign = "left";
      const padding = 60;
      // shadow for legibility
      ctx.shadowColor = "rgba(0,0,0,0.55)";
      ctx.shadowBlur = 18;
      ctx.fillStyle = textColor;
      // wrap
      const maxW = targetWidth - padding * 2;
      const words = text.split(/\s+/);
      const lines: string[] = [];
      let line = "";
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (ctx.measureText(test).width > maxW && line) {
          lines.push(line);
          line = w;
        } else line = test;
      }
      if (line) lines.push(line);
      let y = targetHeight - padding;
      for (let i = lines.length - 1; i >= 0; i--) {
        ctx.fillText(lines[i], padding, y);
        y -= fontSize * 1.1;
      }
      ctx.shadowBlur = 0;
    }
  }, [
    img,
    zoom,
    offsetX,
    offsetY,
    text,
    textColor,
    fontSize,
    theme,
    tintOpacity,
    targetWidth,
    targetHeight,
  ]);

  function apply() {
    const c = canvasRef.current;
    if (!c) return;
    try {
      const url = c.toDataURL("image/jpeg", 0.9);
      onApply(url);
      onClose();
    } catch (e) {
      // CORS-tainted canvas — likely a remote URL. Tell the user.
      // eslint-disable-next-line no-alert
      alert(
        "This image is on a remote host that blocks editing. Upload the file first, then edit.",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scissors className="h-4 w-4 text-primary" /> Inline thumbnail editor
          </DialogTitle>
          <DialogDescription>
            Adjust crop & position, drop in title text, and apply a color theme.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-md border bg-muted overflow-hidden">
            {loading ? (
              <div className="aspect-[3/2] grid place-items-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : !img ? (
              <div className="aspect-[3/2] grid place-items-center text-sm text-muted-foreground">
                No image
              </div>
            ) : (
              <canvas ref={canvasRef} className="w-full h-auto" />
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Zoom ({zoom.toFixed(2)}×)</Label>
              <Slider
                min={1}
                max={3}
                step={0.05}
                value={[zoom]}
                onValueChange={([v]) => setZoom(v)}
              />
              <Label className="text-xs">Horizontal</Label>
              <Slider
                min={-100}
                max={100}
                step={1}
                value={[offsetX]}
                onValueChange={([v]) => setOffsetX(v)}
              />
              <Label className="text-xs">Vertical</Label>
              <Slider
                min={-100}
                max={100}
                step={1}
                value={[offsetY]}
                onValueChange={([v]) => setOffsetY(v)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Overlay text</Label>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Course title…"
                maxLength={80}
              />
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label className="text-xs">Text color</Label>
                  <Input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="h-9 p-1"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs">Font size</Label>
                  <Input
                    type="number"
                    min={24}
                    max={220}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value) || 96)}
                  />
                </div>
              </div>
              <Label className="text-xs">Color theme</Label>
              <div className="flex gap-1.5 flex-wrap">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`h-7 px-2 rounded-md border text-xs flex items-center gap-1.5 ${theme === t.id ? "border-primary bg-primary/5" : "hover:bg-accent"}`}
                  >
                    {t.color !== "transparent" && (
                      <span className="h-3 w-3 rounded-full" style={{ background: t.color }} />
                    )}
                    {t.label}
                  </button>
                ))}
              </div>
              {theme !== "none" && (
                <>
                  <Label className="text-xs">Tint strength</Label>
                  <Slider
                    min={0}
                    max={0.7}
                    step={0.05}
                    value={[tintOpacity]}
                    onValueChange={([v]) => setTintOpacity(v)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={apply} disabled={!img}>
            <Check className="h-4 w-4" /> Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
