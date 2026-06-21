import { useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import { Building2, Image as ImageIcon, ShieldCheck, PenTool } from "lucide-react";
import { CertElement, CertDesign } from "./types";

type DesignerCanvasProps = {
  elements: CertElement[];
  design: CertDesign;
  bgImageUrl?: string | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CertElement>) => void;
  scale?: number;
};

export function DesignerCanvas({
  elements,
  design,
  bgImageUrl,
  selectedId,
  onSelect,
  onUpdateElement,
  scale = 1,
}: DesignerCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const getPatternStyle = (pattern: string, bg: string, accent: string) => {
    switch (pattern) {
      case "dots":
        return {
          backgroundImage: `radial-gradient(${accent}44 1.5px, transparent 1.5px)`,
          backgroundSize: "16px 16px",
          backgroundColor: bg,
        };
      case "grid":
        return {
          backgroundImage: `linear-gradient(${accent}22 1px, transparent 1px), linear-gradient(90deg, ${accent}22 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          backgroundColor: bg,
        };
      case "diagonal":
        return {
          backgroundImage: `repeating-linear-gradient(45deg, ${accent}1a 0 1px, transparent 1px 12px)`,
          backgroundColor: bg,
        };
      case "gradient":
        return {
          background: `linear-gradient(135deg, ${bg} 0%, ${accent}22 100%)`,
        };
      case "mesh":
        return {
          background: `radial-gradient(at 0% 0%, ${accent}33 0, transparent 50%), radial-gradient(at 100% 100%, ${accent}33 0, transparent 50%)`,
          backgroundColor: bg,
        };
      case "noise":
        return {
          backgroundColor: bg,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
        };
      case "glass":
        return {
          backgroundColor: bg,
          backdropFilter: "blur(10px)",
        };
      default:
        return { backgroundColor: bg };
    }
  };

  const borderCss =
    design.border_style === "none"
      ? "none"
      : design.border_style === "ornate"
        ? `1px solid ${design.accent_color}55`
        : `${design.border_width}px ${design.border_style} ${design.accent_color}`;

  return (
    <div
      ref={canvasRef}
      id="certificate-canvas-export"
      className="relative shadow-2xl overflow-hidden shrink-0 origin-top-left transition-transform duration-200"
      style={{
        width: 842,
        height: 595,
        transform: `scale(${scale})`,
        ...getPatternStyle(design.background_pattern, design.bg_color, design.accent_color),
        ...(bgImageUrl ? { backgroundImage: `url(${bgImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {}),
        border: borderCss,
      }}
      onClick={(e) => {
        if (e.target === canvasRef.current) {
          onSelect(null);
        }
      }}
    >
      {/* Corner Styles */}
      {design.corner_style !== "none" && (
        <>
          <div
            className="absolute top-0 left-0 pointer-events-none"
            style={{
              width: "140px",
              height: "140px",
              background: design.accent_color,
              opacity: 0.85,
              clipPath:
                design.corner_style === "ribbon"
                  ? "polygon(0 0, 100% 0, 80% 100%, 0 100%)"
                  : "polygon(0 0, 100% 0, 0 100%)",
            }}
          />
          <div
            className="absolute bottom-0 right-0 pointer-events-none"
            style={{
              width: "140px",
              height: "140px",
              background: design.accent_color,
              opacity: 0.85,
              clipPath:
                design.corner_style === "ribbon"
                  ? "polygon(100% 0, 100% 100%, 0 100%, 20% 0)"
                  : "polygon(100% 0, 100% 100%, 0 100%)",
            }}
          />
        </>
      )}

      {/* Ornate Border Extras */}
      {design.border_style === "ornate" && (
        <>
          <div className="absolute inset-2 pointer-events-none" style={{ border: `3px double ${design.accent_color}aa` }} />
          <div className="absolute inset-[12px] pointer-events-none" style={{ border: `1px solid ${design.accent_color}44` }} />
        </>
      )}

      {elements.map((el) => {
        const isSelected = selectedId === el.id;

        return (
          <Rnd
            key={el.id}
            position={{ x: el.x, y: el.y }}
            size={{ width: el.width || "auto", height: el.height || "auto" }}
            onDragStop={(e, d) => {
              onUpdateElement(el.id, { x: d.x, y: d.y });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              onUpdateElement(el.id, {
                width: parseInt(ref.style.width, 10),
                height: parseInt(ref.style.height, 10),
                x: position.x,
                y: position.y,
              });
            }}
            scale={scale}
            bounds="parent"
            enableResizing={{
              top: isSelected, right: isSelected, bottom: isSelected, left: isSelected,
              topRight: isSelected, bottomRight: isSelected, bottomLeft: isSelected, topLeft: isSelected
            }}
            disableDragging={!isSelected}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(el.id);
            }}
            className={`absolute ${isSelected ? "ring-2 ring-primary ring-offset-2 z-50 cursor-move" : "hover:ring-1 hover:ring-primary/50 cursor-pointer"}`}
            style={{
              zIndex: isSelected ? 50 : 10,
            }}
          >
            <div
              className="w-full h-full"
              style={{
                fontSize: el.fontSize,
                fontFamily: el.fontFamily || design.font_family,
                color: el.color || design.text_color,
                textAlign: el.align,
                fontWeight: el.fontWeight || "normal",
                fontStyle: el.fontStyle || "normal",
                textDecoration: el.textDecoration || "none",
                display: "flex",
                justifyContent: el.align === "center" ? "center" : el.align === "right" ? "flex-end" : "flex-start",
                alignItems: "center",
                lineHeight: el.lineHeight || 1.2,
                letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : "normal",
                textTransform: el.textTransform || "none",
                opacity: el.opacity ?? 1,
                textShadow: el.shadowColor ? `${el.shadowOffsetX || 0}px ${el.shadowOffsetY || 0}px ${el.shadowBlur || 4}px ${el.shadowColor}` : "none",
              }}
            >
              {el.type === "text" && <span dangerouslySetInnerHTML={{ __html: (el.content || "").replace(/\n/g, "<br/>") }} />}
              
              {el.type === "image" && (
                el.url ? (
                  <img src={el.url} alt="" className="w-full h-full object-contain pointer-events-none" />
                ) : (
                  <div className="w-full h-full bg-muted/50 border-2 border-dashed flex flex-col items-center justify-center text-xs text-muted-foreground">
                    <ImageIcon className="h-6 w-6 opacity-50 mb-1" /> Image
                  </div>
                )
              )}

              {el.type === "org_logo" && (
                <div className="w-full h-full bg-muted/30 border-2 border-dashed flex flex-col items-center justify-center text-xs text-muted-foreground rounded-lg">
                  <Building2 className="h-6 w-6 opacity-50 mb-1" /> Logo
                </div>
              )}

              {el.type === "qr" && (
                <div className="w-full h-full bg-white border shadow-sm flex flex-col items-center justify-center text-xs text-muted-foreground rounded-md p-2">
                  <ShieldCheck className="h-full w-full opacity-30 text-primary" />
                </div>
              )}

              {el.type === "signature" && (
                <div className="w-full h-full border-b border-dashed flex items-end justify-center pb-1">
                  {el.url ? (
                     <img src={el.url} alt="Signature" className="h-full object-contain pointer-events-none" />
                  ) : (
                    <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: "1.5em", opacity: 0.7, transform: "rotate(-3deg)" }}>
                       Signature
                    </div>
                  )}
                </div>
              )}
            </div>
          </Rnd>
        );
      })}
    </div>
  );
}
