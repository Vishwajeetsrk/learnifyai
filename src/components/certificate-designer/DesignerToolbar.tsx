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
  Building2,
  Award,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CertElement } from "./types";

type ToolbarProps = {
  templateName: string;
  setTemplateName: (v: string) => void;
  onSave: () => void;
  onExportPNG: () => void;
  onExportPDF: () => void;
  onExportSVG?: () => void;
  onExportGIF?: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onAddElement: (type: CertElement["type"]) => void;
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
  onExportSVG,
  onExportGIF,
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
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 border-r pr-3">
          <Input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="w-44 h-8 font-medium bg-transparent border-transparent hover:border-input focus:border-input focus-visible:ring-1 text-xs"
            placeholder="Template Name"
          />
        </div>

        <div className="flex items-center gap-1 border-r pr-3">
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
            className="h-8 px-2 text-xs"
            onClick={() => onAddElement("text")}
            title="Add text element"
          >
            <Type className="h-3.5 w-3.5 mr-1" /> Text
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => onAddElement("image")}
            title="Add image element"
          >
            <ImageIcon className="h-3.5 w-3.5 mr-1" /> Image
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => onAddElement("org_logo")}
            title="Add organization logo"
          >
            <Building2 className="h-3.5 w-3.5 mr-1" /> Logo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => onAddElement("signature")}
            title="Add signature line"
          >
            <PenTool className="h-3.5 w-3.5 mr-1" /> Signature
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => onAddElement("qr")}
            title="Add QR code badge"
          >
            <QrCode className="h-3.5 w-3.5 mr-1" /> QR
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => onAddElement("badge")}
            title="Add verification seal / badge"
          >
            <Award className="h-3.5 w-3.5 mr-1" /> Badge
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => onAddElement("seal_icon")}
            title="Add official seal crest"
          >
            <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Seal
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => onAddElement("guilloche_watermark")}
            title="Add guilloche security watermark"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" /> Watermark
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onAiOptimize}
          className="h-8 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 text-xs"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1" /> AI Optimize
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Download className="h-3.5 w-3.5 mr-1" /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExportPNG}>Download High-Res PNG</DropdownMenuItem>
            <DropdownMenuItem onClick={onExportPDF}>Download Print PDF</DropdownMenuItem>
            {onExportSVG && <DropdownMenuItem onClick={onExportSVG}>Download Vector SVG</DropdownMenuItem>}
            {onExportGIF && <DropdownMenuItem onClick={onExportGIF}>Download Animated GIF</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" onClick={onSave} disabled={isSaving} className="h-8 text-xs">
          <Save className="h-3.5 w-3.5 mr-1" /> {isSaving ? "Saving..." : "Save Template"}
        </Button>
      </div>
    </div>
  );
}
