import { useState, useCallback, useEffect, useRef } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { CertTemplate, CertElement, CertDesign, DEFAULT_DESIGN, ShapeType } from "./types";
import { useServerFn } from "@tanstack/react-start";
import { aiOptimizeDesign } from "@/lib/canva-cert.functions";
import { DesignerToolbar } from "./DesignerToolbar";
import { DesignerSidebar } from "./DesignerSidebar";
import { DesignerCanvas } from "./DesignerCanvas";

type DesignerWorkspaceProps = {
  initialTemplate: CertTemplate;
  onSave: (template: CertTemplate) => Promise<void>;
  onClose: () => void;
};

export function DesignerWorkspace({ initialTemplate, onSave, onClose }: DesignerWorkspaceProps) {
  const [templateName, setTemplateName] = useState(initialTemplate.name);
  const doAiOptimize = useServerFn(aiOptimizeDesign);
  const [bgImageUrl, setBgImageUrl] = useState(initialTemplate.bg_image_url ?? "");
  const [elements, setElements] = useState<CertElement[]>(initialTemplate.config_json?.elements ?? []);
  const [design, setDesign] = useState<CertDesign>(initialTemplate.config_json?.design ?? DEFAULT_DESIGN);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [scale, setScale] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [gridSize] = useState(10);
  const [clipboard, setClipboard] = useState<CertElement | null>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTemplateName(initialTemplate.name);
    setBgImageUrl(initialTemplate.bg_image_url ?? "");
    setElements(initialTemplate.config_json?.elements ?? []);
    setDesign(initialTemplate.config_json?.design ?? DEFAULT_DESIGN);
  }, [initialTemplate]);

  // History Stack (50 steps)
  const [history, setHistory] = useState<{ elements: CertElement[]; design: CertDesign }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveHistory = useCallback((newElements: CertElement[], newDesign: CertDesign) => {
    setHistory((prev) => {
      const next = prev.slice(0, historyIndex + 1);
      next.push({ elements: JSON.parse(JSON.stringify(newElements)), design: JSON.parse(JSON.stringify(newDesign)) });
      if (next.length > 50) next.shift();
      return next;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setElements(prev.elements);
      setDesign(prev.design);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setElements(next.elements);
      setDesign(next.design);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      const isInput = tag === "INPUT" || tag === "TEXTAREA" || document.activeElement?.getAttribute("contenteditable") === "true";
      const ctrl = e.ctrlKey || e.metaKey;

      // Ctrl+Z / Ctrl+Y
      if (ctrl && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); return; }
      if (ctrl && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); redo(); return; }
      // Ctrl+S
      if (ctrl && e.key === "s") { e.preventDefault(); handleSave(); return; }

      if (isInput) return;

      // Delete
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        onDeleteElement(selectedId);
        return;
      }
      // Ctrl+C
      if (ctrl && e.key === "c" && selectedId) {
        const el = elements.find((el) => el.id === selectedId);
        if (el) setClipboard(JSON.parse(JSON.stringify(el)));
        return;
      }
      // Ctrl+V
      if (ctrl && e.key === "v" && clipboard) {
        e.preventDefault();
        const newEl = { ...clipboard, id: Date.now().toString(), x: clipboard.x + 20, y: clipboard.y + 20 };
        const next = [...elements, newEl];
        setElements(next);
        setSelectedId(newEl.id);
        saveHistory(next, design);
        return;
      }
      // Ctrl+D
      if (ctrl && e.key === "d" && selectedId) {
        e.preventDefault();
        onDuplicateElement(selectedId);
        return;
      }
      // Arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) && selectedId) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const el = elements.find((el) => el.id === selectedId);
        if (!el) return;
        const updates: Partial<CertElement> = {};
        if (e.key === "ArrowUp") updates.y = el.y - step;
        if (e.key === "ArrowDown") updates.y = el.y + step;
        if (e.key === "ArrowLeft") updates.x = el.x - step;
        if (e.key === "ArrowRight") updates.x = el.x + step;
        onUpdateElement(el.id, updates);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, elements, design, clipboard, historyIndex, undo, redo]);

  const onUpdateElement = useCallback((id: string, updates: Partial<CertElement>) => {
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)));
  }, []);

  const onUpdateDesign = useCallback((updates: Partial<CertDesign>) => {
    setDesign((prev) => {
      const next = { ...prev, ...updates };
      saveHistory(elements, next);
      return next;
    });
  }, [elements, saveHistory]);

  const onAddElement = (type: CertElement["type"]) => {
    const defaults: Record<string, { w: number; h: number; content?: string }> = {
      text: { w: 300, h: 40, content: "Sample Text" },
      image: { w: 200, h: 150 },
      org_logo: { w: 120, h: 50 },
      qr: { w: 80, h: 80 },
      badge: { w: 90, h: 90, content: "VERIFIED" },
      seal_icon: { w: 100, h: 100, content: "SEAL" },
      signature: { w: 180, h: 50 },
      guilloche_watermark: { w: 250, h: 250 },
      divider_line: { w: 400, h: 4 },
      svg: { w: 60, h: 60 },
      shape: { w: 120, h: 120 },
      date: { w: 150, h: 30 },
      table: { w: 250, h: 120 },
    };
    const d = defaults[type] || { w: 200, h: 40 };
    const newEl: CertElement = {
      id: Date.now().toString(), type,
      x: Math.round((842 - d.w) / 2), y: Math.round((595 - d.h) / 2),
      width: d.w, height: d.h,
      content: d.content,
      fontSize: type === "text" ? 20 : undefined,
      color: type === "text" ? design.text_color : undefined,
      fontFamily: type === "text" ? design.font_family : undefined,
      align: "center",
      ...(type === "svg" ? { svgContent: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>', svgColor: design.accent_color } : {}),
      ...(type === "shape" ? { shapeType: "rectangle" as ShapeType, fillColor: "transparent", strokeColor: design.accent_color, strokeWidth: 2 } : {}),
      ...(type === "date" ? { dateFormat: "MMMM D, YYYY", label: "Date" } : {}),
      ...(type === "table" ? { rows: 3, cols: 2, cellPadding: 4, borderColor: design.accent_color } : {}),
    };
    const next = [...elements, newEl];
    setElements(next);
    setSelectedId(newEl.id);
    saveHistory(next, design);
  };

  const onDeleteElement = (id: string) => {
    const next = elements.filter((e) => e.id !== id);
    setElements(next);
    setSelectedId(null);
    saveHistory(next, design);
  };

  const onDuplicateElement = (id: string) => {
    const target = elements.find((e) => e.id === id);
    if (!target) return;
    const newEl = { ...target, id: Date.now().toString(), x: target.x + 20, y: target.y + 20 };
    const next = [...elements, newEl];
    setElements(next);
    setSelectedId(newEl.id);
    saveHistory(next, design);
  };

  const onBringForward = (id: string) => {
    const idx = elements.findIndex((e) => e.id === id);
    if (idx < elements.length - 1) {
      const next = [...elements];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      setElements(next);
    }
  };

  const onSendBackward = (id: string) => {
    const idx = elements.findIndex((e) => e.id === id);
    if (idx > 0) {
      const next = [...elements];
      [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
      setElements(next);
    }
  };

  const onLockToggle = () => {
    if (!selectedId) return;
    const el = elements.find((e) => e.id === selectedId);
    if (el) onUpdateElement(selectedId, { locked: !el.locked });
  };

  // Export
  const exportCanvas = async () => {
    setSelectedId(null);
    await new Promise((r) => setTimeout(r, 100));
    const el = document.getElementById("certificate-canvas-export");
    if (!el) throw new Error("Canvas not found");
    const oldScale = el.style.transform;
    el.style.transform = "scale(1)";
    const canvas = await html2canvas(el, { scale: 3, useCORS: true, backgroundColor: null });
    el.style.transform = oldScale;
    return canvas;
  };

  const onExportPNG = async () => {
    try {
      toast.info("Generating PNG...");
      const canvas = await exportCanvas();
      const link = document.createElement("a");
      link.download = `${templateName || "certificate"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Downloaded!");
    } catch (e: any) { toast.error("Export failed: " + e.message); }
  };

  const onExportPDF = async () => {
    try {
      toast.info("Generating PDF...");
      const canvas = await exportCanvas();
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 297, 210);
      pdf.save(`${templateName || "certificate"}.pdf`);
      toast.success("Downloaded PDF!");
    } catch (e: any) { toast.error("Export failed: " + e.message); }
  };

  const onExportSVG = async () => {
    try {
      toast.info("Generating SVG...");
      setSelectedId(null);
      await new Promise((r) => setTimeout(r, 100));
      const el = document.getElementById("certificate-canvas-export");
      if (!el) throw new Error("Canvas not found");
      const clone = el.cloneNode(true) as HTMLElement;
      clone.style.transform = "scale(1)";
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="842" height="595" viewBox="0 0 842 595"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="width:842px;height:595px">${clone.outerHTML}</div></foreignObject></svg>`;
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `${templateName || "certificate"}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Downloaded SVG!");
    } catch (e: any) { toast.error("SVG export failed: " + e.message); }
  };

  const onExportGIF = onExportPNG;

  const onAiOptimize = async () => {
    toast.info("AI analyzing design...");
    try {
      const result = await doAiOptimize({ data: { elements, design } }) as any;
      const u = result.design_updates;
      if (!u) { toast.error(result.reasoning || "No suggestions"); return; }
      onUpdateDesign({
        font_family: u.font_family, border_style: u.border_style, corner_style: u.corner_style,
        background_pattern: u.background_pattern, accent_color: u.accent_color,
        bg_color: u.bg_color, text_color: u.text_color,
      });
      toast.success("AI Optimization applied!");
    } catch (e: any) { toast.error("AI failed: " + e.message); }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({ ...initialTemplate, name: templateName, bg_image_url: bgImageUrl || null, config_json: { elements, design } });
    } finally { setIsSaving(false); }
  };

  const onAddShape = (shapeType: ShapeType) => {
    const newEl: CertElement = {
      id: Date.now().toString(), type: "shape", shapeType,
      x: Math.round((842 - 120) / 2), y: Math.round((595 - 120) / 2),
      width: 120, height: 120,
      fillColor: "transparent", strokeColor: design.accent_color, strokeWidth: 2,
    };
    const next = [...elements, newEl];
    setElements(next);
    setSelectedId(newEl.id);
    saveHistory(next, design);
  };

  const onAddSvg = (svg: string, name: string) => {
    const newEl: CertElement = {
      id: Date.now().toString(), type: "svg", svgContent: svg, svgColor: design.accent_color,
      x: Math.round((842 - 60) / 2), y: Math.round((595 - 60) / 2),
      width: 60, height: 60,
    };
    const next = [...elements, newEl];
    setElements(next);
    setSelectedId(newEl.id);
    saveHistory(next, design);
  };

  const onAddDivider = () => {
    const newEl: CertElement = {
      id: Date.now().toString(), type: "divider_line",
      x: Math.round((842 - 400) / 2), y: Math.round(595 / 2),
      width: 400, height: 4, color: design.accent_color,
    };
    const next = [...elements, newEl];
    setElements(next);
    setSelectedId(newEl.id);
    saveHistory(next, design);
  };

  const onUploadImage = (file: File) => {
    const url = URL.createObjectURL(file);
    const newEl: CertElement = {
      id: Date.now().toString(), type: "image", url,
      x: 150, y: 150, width: 200, height: 150,
    };
    const next = [...elements, newEl];
    setElements(next);
    setSelectedId(newEl.id);
    saveHistory(next, design);
  };

  const handleFileDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files?.length) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) { toast.error("Drop an image file"); return; }
    const url = URL.createObjectURL(file);
    const targetEl = e.target as HTMLElement;
    const isBg = targetEl === workspaceRef.current || targetEl.id === "certificate-canvas-export";
    if (isBg) {
      setBgImageUrl(url);
      saveHistory(elements, design);
      toast.success("Background set!");
    } else {
      const newEl: CertElement = { id: Date.now().toString(), type: "image", url, x: 150, y: 150, width: 200, height: 150 };
      const next = [...elements, newEl];
      setElements(next);
      setSelectedId(newEl.id);
      saveHistory(next, design);
    }
  }, [elements, design, saveHistory]);

  const selectedEl = elements.find((e) => e.id === selectedId);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden">
      <DesignerToolbar
        templateName={templateName} setTemplateName={setTemplateName}
        onSave={handleSave} onExportPNG={onExportPNG} onExportPDF={onExportPDF}
        onExportSVG={onExportSVG} onExportGIF={onExportGIF}
        onUndo={undo} onRedo={redo} onAddElement={onAddElement}
        canUndo={historyIndex > 0} canRedo={historyIndex < history.length - 1}
        isSaving={isSaving} onAiOptimize={onAiOptimize}
        scale={scale} onZoomIn={() => setScale((s) => Math.min(s + 0.1, 2))}
        onZoomOut={() => setScale((s) => Math.max(s - 0.1, 0.3))}
        onZoomFit={() => setScale(1)}
        showGrid={showGrid} onToggleGrid={() => setShowGrid(!showGrid)}
        snapToGrid={snapToGrid} onToggleSnap={() => setSnapToGrid(!snapToGrid)}
        selectedId={selectedId} onDeleteSelected={() => selectedId && onDeleteElement(selectedId)}
        onDuplicateSelected={() => selectedId && onDuplicateElement(selectedId)}
        onBringForward={() => selectedId && onBringForward(selectedId)}
        onSendBackward={() => selectedId && onSendBackward(selectedId)}
        onLockToggle={onLockToggle}
        isLocked={selectedEl?.locked ?? false}
      />

      <div className="flex-1 flex overflow-hidden">
        <div ref={workspaceRef} className="flex-1 bg-muted/30 overflow-auto relative flex items-center justify-center"
          onClick={() => setSelectedId(null)} onDragOver={(e) => e.preventDefault()} onDrop={handleFileDrop}>
          <DesignerCanvas elements={elements} design={design} bgImageUrl={bgImageUrl}
            selectedId={selectedId} onSelect={setSelectedId} onUpdateElement={onUpdateElement}
            scale={scale} showGrid={showGrid} snapToGrid={snapToGrid} gridSize={gridSize} />
        </div>

        <DesignerSidebar elements={elements} design={design} bgImageUrl={bgImageUrl}
          selectedId={selectedId} onSelect={setSelectedId} onUpdateElement={onUpdateElement}
          onUpdateDesign={onUpdateDesign} onUpdateBgImageUrl={setBgImageUrl}
          onDeleteElement={onDeleteElement} onDuplicateElement={onDuplicateElement}
          onAddShape={onAddShape} onAddSvg={onAddSvg} onAddDivider={onAddDivider}
          onUploadImage={onUploadImage} />
      </div>

      <div className="absolute top-4 left-4 z-[60]">
        <button onClick={onClose} className="px-3 py-1.5 bg-background border rounded-md shadow-sm hover:bg-muted text-sm font-medium">
          ← Back to Admin
        </button>
      </div>
    </div>
  );
}
