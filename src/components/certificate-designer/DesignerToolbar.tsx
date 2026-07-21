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
  Palette,
  Shapes,
  Calendar,
  Table2,
  Minus,
  Droplets,
  Grid3X3,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
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
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  snapToGrid: boolean;
  onToggleSnap: () => void;
  selectedId: string | null;
  onDeleteSelected: () => void;
  onDuplicateSelected: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onLockToggle: () => void;
  isLocked: boolean;
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
  scale,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  showGrid,
  onToggleGrid,
  snapToGrid,
  onToggleSnap,
  selectedId,
  onDeleteSelected,
  onDuplicateSelected,
  onBringForward,
  onSendBackward,
  onLockToggle,
  isLocked,
}: ToolbarProps) {
  return (
    <div className="h-12 border-b bg-card flex items-center justify-between px-3 shrink-0 shadow-sm z-10 gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <Input
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className="w-36 h-7 font-medium bg-transparent border-transparent hover:border-input focus:border-input focus-visible:ring-1 text-xs shrink-0"
          placeholder="Template Name"
        />

        <div className="h-5 w-px bg-border shrink-0" />

        <div className="flex items-center gap-0.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="h-5 w-px bg-border shrink-0" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
              <Type className="h-3.5 w-3.5 mr-1" /> Add
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => onAddElement("text")}>
              <Type className="h-3.5 w-3.5 mr-2" /> Text
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddElement("image")}>
              <ImageIcon className="h-3.5 w-3.5 mr-2" /> Image
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddElement("svg")}>
              <Palette className="h-3.5 w-3.5 mr-2" /> SVG Icon
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddElement("org_logo")}>
              <Building2 className="h-3.5 w-3.5 mr-2" /> Logo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAddElement("badge")}>
              <Award className="h-3.5 w-3.5 mr-2" /> Badge
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddElement("seal_icon")}>
              <ShieldCheck className="h-3.5 w-3.5 mr-2" /> Seal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddElement("qr")}>
              <QrCode className="h-3.5 w-3.5 mr-2" /> QR Code
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAddElement("signature")}>
              <PenTool className="h-3.5 w-3.5 mr-2" /> Signature
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddElement("date")}>
              <Calendar className="h-3.5 w-3.5 mr-2" /> Date Field
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddElement("table")}>
              <Table2 className="h-3.5 w-3.5 mr-2" /> Table
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAddElement("divider_line")}>
              <Minus className="h-3.5 w-3.5 mr-2" /> Divider
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddElement("guilloche_watermark")}>
              <Sparkles className="h-3.5 w-3.5 mr-2" /> Watermark
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5 mr-1" /> Dynamic Fields
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuItem onClick={() => onAddElement("text")}>
              Student Name ({`{student_name}`})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddElement("text")}>
              Course Name ({`{course_name}`})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddElement("date")}>
              Issue Date ({`{issue_date}`})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddElement("text")}>
              Expiry Date ({`{expiry_date}`})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddElement("qr")}>
              Certificate ID ({`{certificate_id}`})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddElement("text")}>
              Score ({`{score}`})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddElement("text")}>
              Grade ({`{grade}`})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddElement("signature")}>
              Instructor ({`{instructor_name}`})
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedId && (
          <>
            <div className="h-5 w-px bg-border shrink-0" />
            <div className="flex items-center gap-0.5 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={onDuplicateSelected}
                title="Duplicate (Ctrl+D)"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={onDeleteSelected}
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={onBringForward}
                title="Bring Forward"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={onSendBackward}
                title="Send Backward"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={onLockToggle}
                title={isLocked ? "Unlock" : "Lock"}
              >
                {isLocked ? (
                  <Lock className="h-3.5 w-3.5 text-amber-600" />
                ) : (
                  <Unlock className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onToggleGrid}
          title="Toggle Grid"
          style={showGrid ? { backgroundColor: "hsl(var(--primary) / 0.1)" } : {}}
        >
          <Grid3X3 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onToggleSnap}
          title="Snap to Grid"
          style={snapToGrid ? { backgroundColor: "hsl(var(--primary) / 0.1)" } : {}}
        >
          <Droplets className="h-3.5 w-3.5" />
        </Button>

        <div className="h-5 w-px bg-border shrink-0" />

        <div className="flex items-center gap-0.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onZoomOut}
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="text-[10px] font-mono font-medium w-10 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onZoomIn}
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onZoomFit}
            title="Zoom to Fit"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="h-5 w-px bg-border shrink-0" />

        <Button
          variant="secondary"
          size="sm"
          onClick={onAiOptimize}
          className="h-7 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 text-xs"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1" /> AI
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <Download className="h-3.5 w-3.5 mr-1" /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExportPNG}>High-Res PNG</DropdownMenuItem>
            <DropdownMenuItem onClick={onExportPDF}>Print PDF</DropdownMenuItem>
            {onExportSVG && <DropdownMenuItem onClick={onExportSVG}>Vector SVG</DropdownMenuItem>}
            {onExportGIF && <DropdownMenuItem onClick={onExportGIF}>Animated GIF</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" onClick={onSave} disabled={isSaving} className="h-7 text-xs">
          <Save className="h-3.5 w-3.5 mr-1" /> {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
