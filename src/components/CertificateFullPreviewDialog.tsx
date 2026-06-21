import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2, RefreshCcw } from "lucide-react";
import { CertificateRender, type CertDesign } from "@/components/CertificateDesign";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  design: CertDesign;
  ctx: Parameters<typeof CertificateRender>[0]["ctx"];
  title?: string;
};

const MIN = 0.25;
const MAX = 2.5;
const STEP = 0.1;

export function CertificateFullPreviewDialog({ open, onOpenChange, design, ctx, title }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  // Fit-to-screen: compute scale so the natural A4 inner fits the viewport.
  const fit = () => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    // Use the inner's natural size by temporarily resetting transform.
    const prev = inner.style.transform;
    inner.style.transform = "scale(1)";
    const w = inner.scrollWidth;
    const h = inner.scrollHeight;
    inner.style.transform = prev;
    const pad = 32;
    const sx = (wrap.clientWidth - pad) / w;
    const sy = (wrap.clientHeight - pad) / h;
    const z = Math.max(MIN, Math.min(MAX, Math.min(sx, sy)));
    setZoom(z);
  };

  useEffect(() => {
    if (!open) return;
    // Wait a tick so the dialog content has measured.
    const t = setTimeout(fit, 30);
    return () => clearTimeout(t);
  }, [open]);

  // Ctrl/Cmd + wheel to zoom
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !open) return;
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      setZoom((z) => Math.max(MIN, Math.min(MAX, z + (e.deltaY < 0 ? STEP : -STEP))));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] w-[98vw] h-[96vh] p-0 gap-0 flex flex-col overflow-hidden">
        <DialogTitle className="sr-only">{title ?? "Certificate preview"}</DialogTitle>
        <DialogDescription className="sr-only">Full screen certificate preview</DialogDescription>
        <div className="flex items-center justify-between gap-2 px-4 py-2 border-b bg-card">
          <div className="text-sm font-medium truncate">{title ?? "Certificate preview"}</div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZoom((z) => Math.max(MIN, z - STEP))}
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="text-xs tabular-nums w-14 text-center text-muted-foreground">
              {Math.round(zoom * 100)}%
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZoom((z) => Math.min(MAX, z + STEP))}
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={fit} aria-label="Fit to screen">
              <Maximize2 className="h-4 w-4" /> Fit
            </Button>
            <Button size="sm" variant="outline" onClick={() => setZoom(1)} aria-label="Reset zoom">
              <RefreshCcw className="h-4 w-4" /> 100%
            </Button>
          </div>
        </div>
        <div
          ref={wrapRef}
          className="flex-1 overflow-auto bg-[radial-gradient(circle_at_1px_1px,_hsl(var(--muted))_1px,_transparent_0)] [background-size:18px_18px]"
        >
          <div className="min-w-max min-h-max p-6 sm:p-12 flex items-center justify-center">
            <div
              className="relative transition-transform duration-100 ease-out"
              style={{ width: 1123 * zoom, height: 794 * zoom }}
            >
              <div
                ref={innerRef}
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "top left",
                  width: "1123px", // A4 landscape @ ~96dpi
                  height: "794px",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              >
                <CertificateRender design={design} ctx={ctx} />
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-2 text-[11px] text-muted-foreground border-t bg-muted/30">
          Tip: hold Ctrl/⌘ and scroll to zoom. Drag the scrollbars or trackpad to pan.
        </div>
      </DialogContent>
    </Dialog>
  );
}
