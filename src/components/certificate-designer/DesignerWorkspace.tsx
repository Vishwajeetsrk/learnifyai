import { useState, useCallback, useEffect, useRef } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { CertTemplate, CertElement, CertDesign, DEFAULT_DESIGN } from "./types";
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
  const [elements, setElements] = useState<CertElement[]>(
    initialTemplate.config_json?.elements ?? [],
  );
  const [design, setDesign] = useState<CertDesign>(
    initialTemplate.config_json?.design ?? DEFAULT_DESIGN,
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    setTemplateName(initialTemplate.name);
    setBgImageUrl(initialTemplate.bg_image_url ?? "");
    setElements(initialTemplate.config_json?.elements ?? []);
    setDesign(initialTemplate.config_json?.design ?? DEFAULT_DESIGN);
  }, [initialTemplate]);



  // Simple History Stack
  const [history, setHistory] = useState<{ elements: CertElement[]; design: CertDesign }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveHistory = useCallback(
    (newElements: CertElement[], newDesign: CertDesign) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({
        elements: JSON.parse(JSON.stringify(newElements)),
        design: JSON.parse(JSON.stringify(newDesign)),
      });
      if (newHistory.length > 20) newHistory.shift(); // keep last 20
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex],
  );

  // Keyboard shortcut listener for deleting selected element
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedId) return;

      const targetTag = document.activeElement?.tagName;
      if (
        targetTag === "INPUT" ||
        targetTag === "TEXTAREA" ||
        document.activeElement?.getAttribute("contenteditable") === "true"
      ) {
        return;
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        const nextElements = elements.filter((el) => el.id !== selectedId);
        setElements(nextElements);
        setSelectedId(null);
        saveHistory(nextElements, design);
        toast.success("Element deleted");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, elements, design, saveHistory]);

  const onUpdateElement = useCallback((id: string, updates: Partial<CertElement>) => {
    setElements((prev) => {
      const next = prev.map((el) => (el.id === id ? { ...el, ...updates } : el));
      // We don't save history on EVERY pixel drag (it floods), so we skip it here and rely on manual saves or debouncing if needed,
      // but for simplicity we will save history for property changes.
      return next;
    });
  }, []);

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
    const width = type === "qr" ? 80 : type === "org_logo" ? 120 : type === "signature" ? 180 : type === "badge" ? 90 : type === "seal_icon" ? 100 : type === "guilloche_watermark" ? 250 : type === "divider_line" ? 400 : 300;
    const height = type === "qr" ? 80 : type === "org_logo" ? 50 : type === "signature" ? 50 : type === "badge" ? 90 : type === "seal_icon" ? 100 : type === "guilloche_watermark" ? 250 : type === "divider_line" ? 4 : 40;
    const x = Math.round((842 - width) / 2);
    const y = Math.round((595 - height) / 2);

    const newEl: CertElement = {
      id: Date.now().toString(),
      type,
      x,
      y,
      width,
      height,
      content: type === "text" ? "Sample Text" : type === "badge" ? "VERIFIED" : type === "seal_icon" ? "OFFICIAL SEAL" : undefined,
      fontSize: type === "text" ? 20 : undefined,
      color: type === "text" ? design.text_color : undefined,
      fontFamily: type === "text" ? design.font_family : undefined,
      align: "center",
    };
    const nextElements = [...elements, newEl];
    setElements(nextElements);
    setSelectedId(newEl.id);
    saveHistory(nextElements, design);
  };

  const onCenterHorizontal = (id: string) => {
    const target = elements.find((e) => e.id === id);
    if (!target) return;
    const w = target.width || 200;
    const nextX = Math.round((842 - w) / 2);
    onUpdateElement(id, { x: nextX });
    toast.success("Centered horizontally");
  };

  const onCenterVertical = (id: string) => {
    const target = elements.find((e) => e.id === id);
    if (!target) return;
    const h = target.height || 40;
    const nextY = Math.round((595 - h) / 2);
    onUpdateElement(id, { y: nextY });
    toast.success("Centered vertically");
  };

  const onDeleteElement = (id: string) => {
    const nextElements = elements.filter((e) => e.id !== id);
    setElements(nextElements);
    setSelectedId(null);
    saveHistory(nextElements, design);
  };

  const onDuplicateElement = (id: string) => {
    const target = elements.find((e) => e.id === id);
    if (!target) return;
    const newEl = { ...target, id: Date.now().toString(), x: target.x + 20, y: target.y + 20 };
    const nextElements = [...elements, newEl];
    setElements(nextElements);
    setSelectedId(newEl.id);
    saveHistory(nextElements, design);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setElements(prev.elements);
      setDesign(prev.design);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setElements(next.elements);
      setDesign(next.design);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const finalTemplate: CertTemplate = {
        ...initialTemplate,
        name: templateName,
        bg_image_url: bgImageUrl || null,
        config_json: { elements, design },
      };
      await onSave(finalTemplate);
    } finally {
      setIsSaving(false);
    }
  };

  const exportCanvas = async () => {
    // Deselect to hide resize handles
    setSelectedId(null);
    // Wait for react to render without selection
    await new Promise((r) => setTimeout(r, 100));
    const el = document.getElementById("certificate-canvas-export");
    if (!el) throw new Error("Canvas not found");

    // We need to temporarily set scale to 1 to capture high quality
    const oldScale = el.style.transform;
    el.style.transform = "scale(1)";

    const canvas = await html2canvas(el, { scale: 3, useCORS: true, backgroundColor: null });

    el.style.transform = oldScale; // restore
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
    } catch (e: any) {
      toast.error("Export failed: " + e.message);
    }
  };

  const onExportPDF = async () => {
    try {
      toast.info("Generating Print PDF...");
      const canvas = await exportCanvas();
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4", // 297 x 210 mm
      });

      pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
      pdf.save(`${templateName || "certificate"}.pdf`);
      toast.success("Downloaded PDF!");
    } catch (e: any) {
      toast.error("Export failed: " + e.message);
    }
  };

  const onExportSVG = async () => {
    try {
      toast.info("Generating Vector SVG...");
      setSelectedId(null);
      await new Promise((r) => setTimeout(r, 100));

      const el = document.getElementById("certificate-canvas-export");
      if (!el) throw new Error("Canvas element not found");

      const clone = el.cloneNode(true) as HTMLElement;
      clone.style.transform = "scale(1)";
      clone.style.margin = "0";

      const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="842" height="595" viewBox="0 0 842 595">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml" style="width: 842px; height: 595px;">
              ${clone.outerHTML}
            </div>
          </foreignObject>
        </svg>
      `;

      const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `${templateName || "certificate"}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Downloaded Vector SVG!");
    } catch (e: any) {
      toast.error("SVG export failed: " + e.message);
    }
  };

  const onExportGIF = async () => {
    try {
      toast.info("Generating High-Res Image...");
      const canvas = await exportCanvas();
      const link = document.createElement("a");
      link.download = `${templateName || "certificate"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Downloaded!");
    } catch (e: any) {
      toast.error("Export failed: " + e.message);
    }
  };

  const onAiOptimize = async () => {
    toast.info("AI analyzing your design...");
    try {
      const result = await doAiOptimize({ data: { elements, design } }) as any;
      const updates = result.design_updates;
      if (!updates) {
        toast.error(result.reasoning || "AI could not generate suggestions");
        return;
      }
      onUpdateDesign({
        font_family: updates.font_family || design.font_family,
        border_style: updates.border_style || design.border_style,
        corner_style: updates.corner_style || design.corner_style,
        background_pattern: updates.background_pattern || design.background_pattern,
        accent_color: updates.accent_color || design.accent_color,
        bg_color: updates.bg_color || design.bg_color,
        text_color: updates.text_color || design.text_color,
      });
      toast.success("✨ AI Optimization applied!");
    } catch (e: any) {
      toast.error("AI Optimization failed: " + e.message);
    }
  };

  // Setup canvas scaling to fit screen
  const workspaceRef = useRef<HTMLDivElement>(null);

  const handleFileDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files?.length) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please drop an image file (PNG, JPG, SVG)");
      return;
    }

    const url = URL.createObjectURL(file);
    const targetEl = e.target as HTMLElement;
    
    // If dropped on the canvas background, set it as the background image
    const isBg = targetEl === workspaceRef.current || targetEl.id === "certificate-canvas-export";
    if (isBg) {
      setBgImageUrl(url);
      saveHistory(elements, { ...design });
      toast.success("Background image set successfully!");
    } else {
      // Add as draggable image element
      const newEl: CertElement = {
        id: Date.now().toString(),
        type: "image",
        url: url,
        x: 150,
        y: 150,
        width: 200,
        height: 150,
      };
      const nextElements = [...elements, newEl];
      setElements(nextElements);
      setSelectedId(newEl.id);
      saveHistory(nextElements, design);
      toast.success("Image element added successfully!");
    }
  }, [elements, design, saveHistory]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden">
      <DesignerToolbar
        templateName={templateName}
        setTemplateName={setTemplateName}
        onSave={handleSave}
        onExportPNG={onExportPNG}
        onExportPDF={onExportPDF}
        onExportSVG={onExportSVG}
        onExportGIF={onExportGIF}
        onUndo={undo}
        onRedo={redo}
        onAddElement={onAddElement}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        isSaving={isSaving}
        onAiOptimize={onAiOptimize}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Canvas Area */}
        <div
          ref={workspaceRef}
          className="flex-1 bg-muted/30 overflow-auto relative flex items-center justify-center"
          onClick={() => setSelectedId(null)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
        >
          <div className="absolute top-4 left-4 flex items-center gap-1 bg-card/90 backdrop-blur border border-border p-1 rounded-lg shadow-sm z-20">
            <button
              className="px-2 py-1 hover:bg-accent rounded text-xs font-semibold"
              onClick={(e) => {
                e.stopPropagation();
                setScale((s) => Math.max(s - 0.1, 0.3));
              }}
              title="Zoom Out"
            >
              −
            </button>
            <button
              className="px-2.5 py-1 text-xs font-mono font-medium hover:bg-accent rounded"
              onClick={(e) => {
                e.stopPropagation();
                setScale(1);
              }}
              title="Reset Zoom (100%)"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              className="px-2 py-1 hover:bg-accent rounded text-xs font-semibold"
              onClick={(e) => {
                e.stopPropagation();
                setScale((s) => Math.min(s + 0.1, 2));
              }}
              title="Zoom In"
            >
              +
            </button>
          </div>

          <DesignerCanvas
            elements={elements}
            design={design}
            bgImageUrl={bgImageUrl}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onUpdateElement={onUpdateElement}
            scale={scale}
          />
        </div>

        {/* Right Sidebar Properties/Layers */}
        <DesignerSidebar
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
        />
      </div>

      <div className="absolute top-4 left-4 z-[60]">
        <button
          onClick={onClose}
          className="px-3 py-1.5 bg-background border rounded-md shadow-sm hover:bg-muted text-sm font-medium"
        >
          ← Back to Admin
        </button>
      </div>
    </div>
  );
}
