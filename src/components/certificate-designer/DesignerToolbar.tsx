import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  Save,
  Undo,
  Redo,
  Sparkles,
  Type,
  Image as ImageIcon,
  QrCode,
  ShieldCheck,
  PenTool,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ToolbarProps = {
  templateName: string;
  setTemplateName: (v: string) => void;
  onSave: () => void;
  onExportPNG: () => void;
  onExportPDF: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onAddElement: (type: "text" | "image" | "qr" | "org_logo" | "signature") => void;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
  onAiOptimize: () => void;
};

export function DesignerToolbar({
  templateName,
  setTemplateName,
  onSave,
  onExportPNG,
  onExportPDF,
  onUndo,
  onRedo,
  onAddElement,
  canUndo,
  canRedo,
  isSaving,
  onAiOptimize,
}: ToolbarProps) {
  return (
    <div className="h-14 border-b bg-card flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 border-r pr-4">
          <Input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="w-48 h-8 font-medium bg-transparent border-transparent hover:border-input focus:border-input focus-visible:ring-1"
            placeholder="Template Name"
          />
        </div>

        <div className="flex items-center gap-1 border-r pr-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => onAddElement("text")}
          >
            <Type className="h-4 w-4 mr-1.5" /> Text
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => onAddElement("image")}
          >
            <ImageIcon className="h-4 w-4 mr-1.5" /> Image
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => onAddElement("signature")}
          >
            <PenTool className="h-4 w-4 mr-1.5" /> Signature
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => onAddElement("qr")}>
            <QrCode className="h-4 w-4 mr-1.5" /> QR
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onAiOptimize}
          className="h-8 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200"
        >
          <Sparkles className="h-4 w-4 mr-1.5" /> AI Optimize
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Download className="h-4 w-4 mr-1.5" /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExportPNG}>Download High-Res PNG</DropdownMenuItem>
            <DropdownMenuItem onClick={onExportPDF}>Download Print PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" onClick={onSave} disabled={isSaving} className="h-8">
          <Save className="h-4 w-4 mr-1.5" /> {isSaving ? "Saving..." : "Save Template"}
        </Button>
      </div>
    </div>
  );
}
