import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Upload, ZoomIn, ZoomOut, Crop, Scissors, RotateCcw, Check, X, ImageIcon } from "lucide-react";

type ImageEditorProps = {
  open: boolean;
  onClose: () => void;
  onApply: (dataUrl: string) => void;
  initialUrl?: string;
  title?: string;
  aspectRatio?: number; // width/height, e.g. 1 for square, 1.414 for A4
  outputWidth?: number;
  outputHeight?: number;
};

export function ImageEditor({
  open, onClose, onApply, initialUrl, title = "Edit Image",
  aspectRatio = 1, outputWidth = 400, outputHeight = 400,
}: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(initialUrl || null);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [bgRemoved, setBgRemoved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset on open
  useEffect(() => {
    if (open) {
      setImageSrc(initialUrl || null);
      setZoom(1);
      setPanX(0);
      setPanY(0);
      setRotation(0);
      setBgRemoved(false);
    }
  }, [open, initialUrl]);

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fill with transparent for background removal preview
    if (bgRemoved) {
      ctx.fillStyle = "transparent";
    } else {
      ctx.fillStyle = "#ffffff";
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2 + panX, canvas.height / 2 + panY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calculate draw dimensions maintaining aspect ratio
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let drawW, drawH;
    if (imgAspect > aspectRatio) {
      drawW = canvas.width * 0.8;
      drawH = drawW / imgAspect;
    } else {
      drawH = canvas.height * 0.8;
      drawW = drawH * imgAspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }, [zoom, panX, panY, rotation, bgRemoved, aspectRatio]);

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        imgRef.current = img;
        drawCanvas();
      };
      img.src = imageSrc;
    }
  }, [imageSrc, drawCanvas]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // File upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Drag to pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => setIsDragging(false);

  // Background removal (simple threshold-based)
  const removeBackground = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsProcessing(true);
    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Get corner pixel color as background reference
      const bgR = data[0];
      const bgG = data[1];
      const bgB = data[2];
      const threshold = 60;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // If pixel is close to background color, make it transparent
        if (
          Math.abs(r - bgR) < threshold &&
          Math.abs(g - bgG) < threshold &&
          Math.abs(b - bgB) < threshold
        ) {
          data[i + 3] = 0; // Set alpha to 0
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setBgRemoved(true);
    } finally {
      setIsProcessing(false);
    }
  };

  // Apply
  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create output canvas at desired dimensions
    const output = document.createElement("canvas");
    output.width = outputWidth;
    output.height = outputHeight;
    const ctx = output.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(canvas, 0, 0, outputWidth, outputHeight);
    const dataUrl = output.toDataURL("image/png");
    onApply(dataUrl);
    onClose();
  };

  // Reset
  const handleReset = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setRotation(0);
    setBgRemoved(false);
    if (imageSrc && imgRef.current) {
      drawCanvas();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl p-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="text-sm font-bold">{title}</DialogTitle>
        </DialogHeader>

        <div className="px-4 space-y-3">
          {/* Canvas Area */}
          <div
            className="relative bg-slate-100 rounded-xl overflow-hidden border border-slate-200"
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {imageSrc ? (
              <canvas
                ref={canvasRef}
                width={500}
                height={Math.round(500 / aspectRatio)}
                className="w-full"
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <ImageIcon className="h-12 w-12 text-slate-300 mb-3" />
                <p className="text-sm text-slate-500 mb-3">No image selected</p>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-3.5 w-3.5 mr-1" /> Choose Image
                </Button>
              </div>
            )}

            {/* Processing overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-sm font-medium">Processing...</div>
              </div>
            )}
          </div>

          {/* Controls */}
          {imageSrc && (
            <div className="space-y-3">
              {/* Zoom */}
              <div className="flex items-center gap-3">
                <Label className="text-xs text-slate-500 w-12">Zoom</Label>
                <Button variant="outline" size="icon" className="h-7 w-7 shrink-0"
                  onClick={() => setZoom((z) => Math.max(z - 0.1, 0.2))}>
                  <ZoomOut className="h-3 w-3" />
                </Button>
                <Slider value={[zoom]} min={0.2} max={3} step={0.05}
                  onValueChange={(v) => setZoom(v[0])} className="flex-1" />
                <Button variant="outline" size="icon" className="h-7 w-7 shrink-0"
                  onClick={() => setZoom((z) => Math.min(z + 0.1, 3))}>
                  <ZoomIn className="h-3 w-3" />
                </Button>
                <span className="text-[10px] font-mono w-10 text-right">{Math.round(zoom * 100)}%</span>
              </div>

              {/* Rotation */}
              <div className="flex items-center gap-3">
                <Label className="text-xs text-slate-500 w-12">Rotate</Label>
                <Slider value={[rotation]} min={-180} max={180} step={5}
                  onValueChange={(v) => setRotation(v[0])} className="flex-1" />
                <span className="text-[10px] font-mono w-10 text-right">{rotation}°</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={removeBackground}
                  className="text-xs h-7" disabled={isProcessing}>
                  <Scissors className="h-3 w-3 mr-1" /> Remove BG
                </Button>
                <Button variant="outline" size="sm" onClick={handleReset} className="text-xs h-7">
                  <RotateCcw className="h-3 w-3 mr-1" /> Reset
                </Button>
                <div className="flex-1" />
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="text-xs h-7">
                  <Upload className="h-3 w-3 mr-1" /> Change
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 pt-2">
          <Button variant="outline" onClick={onClose} className="text-xs h-8">
            <X className="h-3 w-3 mr-1" /> Cancel
          </Button>
          <Button onClick={handleApply} disabled={!imageSrc || isProcessing} className="text-xs h-8 bg-[#6B5BFB] hover:bg-[#5a4be0] text-white">
            <Check className="h-3 w-3 mr-1" /> Apply
          </Button>
        </DialogFooter>

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </DialogContent>
    </Dialog>
  );
}
