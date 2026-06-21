import { useState, useCallback, useRef } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { CertTemplate, CertElement, CertDesign, DEFAULT_DESIGN } from "./types";
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
  const [bgImageUrl, setBgImageUrl] = useState(initialTemplate.bg_image_url);
  const [elements, setElements] = useState<CertElement[]>(initialTemplate.config_json?.elements ?? []);
  const [design, setDesign] = useState<CertDesign>(initialTemplate.config_json?.design ?? DEFAULT_DESIGN);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [scale, setScale] = useState(1);

  // Simple History Stack
  const [history, setHistory] = useState<{elements: CertElement[], design: CertDesign}[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveHistory = useCallback((newElements: CertElement[], newDesign: CertDesign) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ elements: JSON.parse(JSON.stringify(newElements)), design: JSON.parse(JSON.stringify(newDesign)) });
    if (newHistory.length > 20) newHistory.shift(); // keep last 20
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const onUpdateElement = useCallback((id: string, updates: Partial<CertElement>) => {
    setElements(prev => {
      const next = prev.map(el => el.id === id ? { ...el, ...updates } : el);
      // We don't save history on EVERY pixel drag (it floods), so we skip it here and rely on manual saves or debouncing if needed, 
      // but for simplicity we will save history for property changes.
      return next;
    });
  }, []);

  const onUpdateDesign = useCallback((updates: Partial<CertDesign>) => {
    setDesign(prev => {
      const next = { ...prev, ...updates };
      saveHistory(elements, next);
      return next;
    });
  }, [elements, saveHistory]);

  const onAddElement = (type: CertElement["type"]) => {
    const newEl: CertElement = {
      id: Date.now().toString(),
      type,
      x: 100, y: 100,
      width: type === 'qr' ? 100 : type === 'org_logo' ? 120 : type === 'image' ? 200 : undefined,
      height: type === 'qr' ? 100 : type === 'org_logo' ? 120 : type === 'image' ? 150 : undefined,
      content: type === 'text' ? "New Text" : undefined,
      fontSize: type === 'text' ? 24 : undefined,
      color: type === 'text' ? design.text_color : undefined,
      fontFamily: type === 'text' ? design.font_family : undefined,
    };
    const nextElements = [...elements, newEl];
    setElements(nextElements);
    setSelectedId(newEl.id);
    saveHistory(nextElements, design);
  };

  const onDeleteElement = (id: string) => {
    const nextElements = elements.filter(e => e.id !== id);
    setElements(nextElements);
    setSelectedId(null);
    saveHistory(nextElements, design);
  };

  const onDuplicateElement = (id: string) => {
    const target = elements.find(e => e.id === id);
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
        bg_image_url: bgImageUrl,
        config_json: { elements, design }
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
    await new Promise(r => setTimeout(r, 100));
    const el = document.getElementById("certificate-canvas-export");
    if (!el) throw new Error("Canvas not found");
    
    // We need to temporarily set scale to 1 to capture high quality
    const oldScale = el.style.transform;
    el.style.transform = 'scale(1)';
    
    const canvas = await html2canvas(el, { scale: 3, useCORS: true, backgroundColor: null });
    
    el.style.transform = oldScale; // restore
    return canvas;
  };

  const onExportPNG = async () => {
    try {
      toast.info("Generating PNG...");
      const canvas = await exportCanvas();
      const link = document.createElement("a");
      link.download = `${templateName || 'certificate'}.png`;
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
        format: "a4" // 297 x 210 mm
      });
      
      pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
      pdf.save(`${templateName || 'certificate'}.pdf`);
      toast.success("Downloaded PDF!");
    } catch (e: any) {
      toast.error("Export failed: " + e.message);
    }
  };

  const onAiOptimize = () => {
    // Stub for AI Optimization
    toast.success("✨ AI Optimization Applied!");
    onUpdateDesign({
      font_family: "Playfair Display",
      border_style: "ornate",
      text_color: "#1a1a1a"
    });
    setElements(prev => prev.map(el => {
      if (el.type === 'text') {
        return { ...el, fontFamily: "Playfair Display", color: "#1a1a1a" };
      }
      return el;
    }));
  };

  // Setup canvas scaling to fit screen
  const workspaceRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden">
      <DesignerToolbar 
        templateName={templateName}
        setTemplateName={setTemplateName}
        onSave={handleSave}
        onExportPNG={onExportPNG}
        onExportPDF={onExportPDF}
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
        <div ref={workspaceRef} className="flex-1 bg-muted/30 overflow-auto relative flex items-center justify-center" onClick={() => setSelectedId(null)}>
           <div className="absolute top-4 left-4 flex gap-2">
             <button className="px-2 py-1 bg-white border rounded text-xs shadow-sm" onClick={(e) => { e.stopPropagation(); setScale(s => Math.min(s + 0.1, 2)); }}>Zoom In</button>
             <button className="px-2 py-1 bg-white border rounded text-xs shadow-sm" onClick={(e) => { e.stopPropagation(); setScale(s => Math.max(s - 0.1, 0.3)); }}>Zoom Out</button>
             <span className="px-2 py-1 bg-white border rounded text-xs shadow-sm">{Math.round(scale * 100)}%</span>
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
           selectedId={selectedId}
           onSelect={setSelectedId}
           onUpdateElement={onUpdateElement}
           onUpdateDesign={onUpdateDesign}
           onDeleteElement={onDeleteElement}
           onDuplicateElement={onDuplicateElement}
        />
      </div>
      
      <div className="absolute top-4 left-4 z-[60]">
         <button onClick={onClose} className="px-3 py-1.5 bg-background border rounded-md shadow-sm hover:bg-muted text-sm font-medium">← Back to Admin</button>
      </div>
    </div>
  );
}
