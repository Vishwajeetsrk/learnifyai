import { useState, useCallback, useEffect, useRef } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { toast } from "sonner";
import {
  CertTemplate,
  CertElement,
  CertDesign,
  DEFAULT_DESIGN,
  ShapeType,
  COLOR_PALETTES,
} from "./types";
import { useServerFn } from "@tanstack/react-start";
import { aiOptimizeDesign } from "@/lib/canva-cert.functions";
import { CertificatePreview } from "./CertificatePreview";
import { PropertiesPanel } from "./PropertiesPanel";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Save,
  Download,
  Sparkles,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";

type DesignerWorkspaceProps = {
  initialTemplate: CertTemplate;
  onSave: (template: CertTemplate) => Promise<void>;
  onClose: () => void;
};

export function DesignerWorkspace({ initialTemplate, onSave, onClose }: DesignerWorkspaceProps) {
  const doAiOptimize = useServerFn(aiOptimizeDesign);

  // Template state
  const [templateName, setTemplateName] = useState(initialTemplate.name);
  const [bgImageUrl, setBgImageUrl] = useState(initialTemplate.bg_image_url ?? "");
  const [elements, setElements] = useState<CertElement[]>(
    initialTemplate.config_json?.elements ?? [],
  );
  const [design, setDesign] = useState<CertDesign>(
    initialTemplate.config_json?.design ?? DEFAULT_DESIGN,
  );

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [scale, setScale] = useState(0.75);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        const availableWidth = width - 64;
        const newScale = Math.min(1, Math.max(0.2, availableWidth / 842));
        setScale(newScale);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Canvas dimensions (A4 landscape)
  const CANVAS_WIDTH = 842;
  const CANVAS_HEIGHT = 595;

  // History (50 steps)
  const [history, setHistory] = useState<{ elements: CertElement[]; design: CertDesign }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Element operations
  const onUpdateElement = useCallback((id: string, updates: Partial<CertElement>) => {
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)));
  }, []);

  const saveHistory = useCallback(
    (newElements: CertElement[], newDesign: CertDesign) => {
      setHistory((prev) => {
        const next = prev.slice(0, historyIndex + 1);
        next.push({
          elements: JSON.parse(JSON.stringify(newElements)),
          design: JSON.parse(JSON.stringify(newDesign)),
        });
        if (next.length > 50) next.shift();
        return next;
      });
      setHistoryIndex((prev) => Math.min(prev + 1, 49));
    },
    [historyIndex],
  );

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
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (ctrl && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
      if (ctrl && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        const tag = document.activeElement?.tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA") {
          e.preventDefault();
          onDeleteElement(selectedId);
        }
      }
      // Nudge arrow keys shortcut
      if (selectedId && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        const tag = document.activeElement?.tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA") {
          e.preventDefault();
          const target = elements.find((el) => el.id === selectedId);
          if (target) {
            const nudge = e.shiftKey ? 10 : 1;
            if (e.key === "ArrowLeft") {
              onUpdateElement(selectedId, { x: Math.max(0, target.x - nudge) });
            }
            if (e.key === "ArrowRight") {
              onUpdateElement(selectedId, { x: Math.min(842 - (target.width || 50), target.x + nudge) });
            }
            if (e.key === "ArrowUp") {
              onUpdateElement(selectedId, { y: Math.max(0, target.y - nudge) });
            }
            if (e.key === "ArrowDown") {
              onUpdateElement(selectedId, { y: Math.min(595 - (target.height || 30), target.y + nudge) });
            }
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, historyIndex, undo, redo, elements, onUpdateElement]);


  const onUpdateDesign = useCallback(
    (updates: Partial<CertDesign>) => {
      setDesign((prev) => {
        const next = { ...prev, ...updates };
        saveHistory(elements, next);
        return next;
      });
    },
    [elements, saveHistory],
  );

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
      id: Date.now().toString(),
      type,
      x: Math.round((842 - d.w) / 2),
      y: Math.round((595 - d.h) / 2),
      width: d.w,
      height: d.h,
      content: d.content,
      fontSize: type === "text" ? 20 : undefined,
      color: type === "text" ? design.text_color : undefined,
      fontFamily: type === "text" ? design.font_family : undefined,
      align: "center",
      ...(type === "svg"
        ? {
            svgContent:
              '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>',
            svgColor: design.accent_color,
          }
        : {}),
      ...(type === "shape"
        ? {
            shapeType: "rect" as ShapeType,
            fillColor: "transparent",
            strokeColor: design.accent_color,
            strokeWidth: 2,
          }
        : {}),
      ...(type === "date" ? { dateFormat: "MMMM D, YYYY", label: "Date" } : {}),
      ...(type === "table"
        ? { rows: 3, cols: 2, cellPadding: 4, borderColor: design.accent_color }
        : {}),
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

  // Save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        ...initialTemplate,
        name: templateName,
        bg_image_url: bgImageUrl || null,
        config_json: { elements, design },
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Export
  const onExportPNG = async () => {
    try {
      toast.info("Generating PNG...");
      setSelectedId(null);
      const prevScale = scale;
      setScale(1);
      await new Promise((r) => setTimeout(r, 150));
      const el = document.getElementById("certificate-preview-export");
      if (!el) throw new Error("Canvas not found");
      const canvas = await html2canvas(el, { scale: 3, useCORS: true, backgroundColor: null });
      setScale(prevScale);
      const link = document.createElement("a");
      link.download = `${templateName || "certificate"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Downloaded!");
    } catch (e: any) {
      toast.error("Export failed: " + e.message);
    }
  };

  const onExportPDF = async () => {
    try {
      toast.info("Generating PDF...");
      setSelectedId(null);
      const prevScale = scale;
      setScale(1);
      await new Promise((r) => setTimeout(r, 150));
      const el = document.getElementById("certificate-preview-export");
      if (!el) throw new Error("Canvas not found");
      const canvas = await html2canvas(el, { scale: 3, useCORS: true, backgroundColor: null });
      setScale(prevScale);
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 297, 210);
      pdf.save(`${templateName || "certificate"}.pdf`);
      toast.success("Downloaded PDF!");
    } catch (e: any) {
      toast.error("Export failed: " + e.message);
    }
  };

  const onAiOptimize = async () => {
    toast.info("AI analyzing design...");
    try {
      const result = (await doAiOptimize({ data: { elements, design } })) as any;
      const u = result.design_updates;
      if (!u) {
        toast.error(result.reasoning || "No suggestions");
        return;
      }
      onUpdateDesign({
        font_family: u.font_family,
        border_style: u.border_style,
        corner_style: u.corner_style,
        background_pattern: u.background_pattern,
        accent_color: u.accent_color,
        bg_color: u.bg_color,
        text_color: u.text_color,
      });
      toast.success("AI Optimization applied!");
    } catch (e: any) {
      toast.error("AI failed: " + e.message);
    }
  };

  // Asset operations
  const onAddShape = (shapeType: ShapeType) => {
    const newEl: CertElement = {
      id: Date.now().toString(),
      type: "shape",
      shapeType,
      x: Math.round((842 - 120) / 2),
      y: Math.round((595 - 120) / 2),
      width: 120,
      height: 120,
      fillColor: "transparent",
      strokeColor: design.accent_color,
      strokeWidth: 2,
    };
    const next = [...elements, newEl];
    setElements(next);
    setSelectedId(newEl.id);
    saveHistory(next, design);
  };

  const onAddSvg = (svg: string, name: string) => {
    const newEl: CertElement = {
      id: Date.now().toString(),
      type: "svg",
      svgContent: svg,
      svgColor: design.accent_color,
      x: Math.round((842 - 60) / 2),
      y: Math.round((595 - 60) / 2),
      width: 60,
      height: 60,
    };
    const next = [...elements, newEl];
    setElements(next);
    setSelectedId(newEl.id);
    saveHistory(next, design);
  };

  const onAddDivider = () => {
    const newEl: CertElement = {
      id: Date.now().toString(),
      type: "divider_line",
      x: Math.round((842 - 400) / 2),
      y: Math.round(595 / 2),
      width: 400,
      height: 4,
      color: design.accent_color,
    };
    const next = [...elements, newEl];
    setElements(next);
    setSelectedId(newEl.id);
    saveHistory(next, design);
  };

  const onUploadImage = (file: File) => {
    const url = URL.createObjectURL(file);
    const newEl: CertElement = {
      id: Date.now().toString(),
      type: "image",
      url,
      x: 150,
      y: 150,
      width: 200,
      height: 150,
    };
    const next = [...elements, newEl];
    setElements(next);
    setSelectedId(newEl.id);
    saveHistory(next, design);
  };

  const selectedEl = elements.find((e) => e.id === selectedId);

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col md:flex-row overflow-hidden">
      {/* Top Bar */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-6 w-px bg-slate-200" />
          <input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="font-semibold text-sm text-slate-900 bg-transparent border-transparent hover:border-input focus:border-input focus-visible:ring-1 px-2 py-1 rounded-md w-48"
            placeholder="Template Name"
          />
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={undo}
              disabled={historyIndex <= 0}
              title="Undo (Ctrl+Z)"
            >
              <Undo className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              title="Redo (Ctrl+Y)"
            >
              <Redo className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile hide/show properties panel */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-xs h-7 px-2"
            onClick={() => setSelectedId(selectedId ? null : elements[0]?.id || null)}
          >
            {selectedId ? "Hide Properties" : "Show Elements"}
          </Button>

          <div className="hidden md:flex items-center gap-1 bg-slate-100 rounded-lg px-2 py-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setScale((s) => Math.max(s - 0.1, 0.3))}
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            <span className="text-[10px] font-mono w-10 text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setScale((s) => Math.min(s + 0.1, 2))}
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setScale(1)}>
              <Maximize2 className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={onAiOptimize}
            className="h-8 text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" /> AI Upgrade
          </Button>

          <Button variant="outline" size="sm" onClick={onExportPNG} className="h-8 text-xs">
            <Download className="h-3.5 w-3.5 mr-1" /> PNG
          </Button>
          <Button variant="outline" size="sm" onClick={onExportPDF} className="h-8 text-xs">
            <Download className="h-3.5 w-3.5 mr-1" /> PDF
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="h-8 text-xs bg-[#6B5BFB] hover:bg-[#5a4be0] text-white"
          >
            <Save className="h-3.5 w-3.5 mr-1" /> {isSaving ? "Saving..." : "Save Template"}
          </Button>
        </div>
      </header>

      {/* Split View */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Preview (Centered & Scaled) */}
        <div ref={containerRef} className="flex-1 bg-slate-100 overflow-hidden flex items-center justify-center p-8 min-h-[300px] md:min-h-0">
          <div style={{ transform: `scale(${scale})`, transformOrigin: "center center", transition: "transform 0.1s ease-out" }}>
            <CertificatePreview
              elements={elements}
              design={design}
              bgImageUrl={bgImageUrl}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onUpdateElement={onUpdateElement}
              scale={scale}
              onDeleteElement={onDeleteElement}
              onDuplicateElement={onDuplicateElement}
            />
          </div>
        </div>

        {/* Right: Properties Panel */}
        <div className="w-full md:w-[380px] shrink-0 border-t md:border-t-0 md:border-l border-slate-200 bg-white overflow-auto">
          <PropertiesPanel
            elements={elements}
            design={design}
            bgImageUrl={bgImageUrl}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onUpdateElement={onUpdateElement}
            onUpdateDesign={onUpdateDesign}
            onUpdateBgImageUrl={setBgImageUrl}
            onDeleteElement={onDeleteElement}
            onDuplicateElement={onDuplicateElement}
            onAddElement={onAddElement}
            onAddShape={onAddShape}
            onAddSvg={onAddSvg}
            onAddDivider={onAddDivider}
            onUploadImage={onUploadImage}
          />
        </div>
      </div>
    </div>
  );
}
