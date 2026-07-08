import { useRef, useMemo } from "react";
import { Rnd } from "react-rnd";
import { Building2, Image as ImageIcon, ShieldCheck, Star, Calendar, Table2 } from "lucide-react";
import { CertElement, CertDesign } from "./types";

type DesignerCanvasProps = {
  elements: CertElement[];
  design: CertDesign;
  bgImageUrl?: string | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CertElement>) => void;
  scale?: number;
  showGrid?: boolean;
  snapToGrid?: boolean;
  gridSize?: number;
};

export function DesignerCanvas({
  elements, design, bgImageUrl, selectedId, onSelect, onUpdateElement,
  scale = 1, showGrid = false, snapToGrid = false, gridSize = 10,
}: DesignerCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const activeBgImage = design.show_bg_image !== false ? bgImageUrl : null;

  const snap = (val: number) => snapToGrid ? Math.round(val / gridSize) * gridSize : val;

  const getPatternStyle = (pattern: string, bg: string, accent: string): React.CSSProperties => {
    switch (pattern) {
      case "guilloche":
        return {
          backgroundColor: bg,
          backgroundImage: `radial-gradient(circle at center, ${accent}15 0%, transparent 70%), repeating-radial-gradient(circle at center, ${accent}22 0, ${accent}22 2px, transparent 2px, transparent 12px)`,
        };
      case "waves":
        return {
          backgroundColor: bg,
          backgroundImage: `repeating-linear-gradient(-45deg, ${accent}18, ${accent}18 2px, transparent 2px, transparent 10px), repeating-linear-gradient(45deg, ${accent}18, ${accent}18 2px, transparent 2px, transparent 10px)`,
        };
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
        return { background: `linear-gradient(135deg, ${bg} 0%, ${accent}22 100%)` };
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
        return { backgroundColor: bg, backdropFilter: "blur(10px)" };
      default:
        return { backgroundColor: bg };
    }
  };

  const borderCss = activeBgImage || design.border_style === "none"
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
        width: 842, height: 595,
        transform: `scale(${scale})`,
        ...getPatternStyle(design.background_pattern, design.bg_color, design.accent_color),
        ...(activeBgImage ? {
          backgroundImage: `url("${activeBgImage}")`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        } : {}),
        border: borderCss,
      }}
      onClick={(e) => { if (e.target === canvasRef.current) onSelect(null); }}
    >
      {/* Grid overlay */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            backgroundImage: `linear-gradient(rgba(107,91,251,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(107,91,251,0.08) 1px, transparent 1px)`,
            backgroundSize: `${gridSize}px ${gridSize}px`,
          }} />
      )}

      {/* Corner Styles */}
      {!activeBgImage && design.corner_style !== "none" && (
        <>
          <div className="absolute top-0 left-0 pointer-events-none"
            style={{
              width: 140, height: 140, background: design.accent_color, opacity: 0.85,
              clipPath: design.corner_style === "ribbon" ? "polygon(0 0, 100% 0, 80% 100%, 0 100%)" : "polygon(0 0, 100% 0, 0 100%)",
            }} />
          <div className="absolute bottom-0 right-0 pointer-events-none"
            style={{
              width: 140, height: 140, background: design.accent_color, opacity: 0.85,
              clipPath: design.corner_style === "ribbon" ? "polygon(100% 0, 100% 100%, 0 100%, 20% 0)" : "polygon(100% 0, 100% 100%, 0 100%)",
            }} />
        </>
      )}

      {/* Ornate Border */}
      {!activeBgImage && design.border_style === "ornate" && (
        <>
          <div className="absolute inset-2 pointer-events-none" style={{ border: `3px double ${design.accent_color}aa` }} />
          <div className="absolute inset-[12px] pointer-events-none" style={{ border: `1px solid ${design.accent_color}44` }} />
        </>
      )}

      {/* Elements */}
      {elements.map((el, i) => {
        if (el.hidden) return null;
        const isSelected = selectedId === el.id;
        const isLocked = el.locked === true;
        const rotation = el.rotation || 0;

        return (
          <Rnd
            key={el.id}
            position={{ x: el.x, y: el.y }}
            size={{ width: el.width || "auto", height: el.height || "auto" }}
            onDragStop={(e, d) => {
              if (!isLocked) onUpdateElement(el.id, { x: snap(d.x), y: snap(d.y) });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              if (!isLocked) {
                onUpdateElement(el.id, {
                  width: parseInt(ref.style.width, 10),
                  height: parseInt(ref.style.height, 10),
                  x: snap(position.x), y: snap(position.y),
                });
              }
            }}
            scale={scale} bounds="parent"
            enableResizing={{
              top: isSelected && !isLocked, right: isSelected && !isLocked,
              bottom: isSelected && !isLocked, left: isSelected && !isLocked,
              topRight: isSelected && !isLocked, bottomRight: isSelected && !isLocked,
              bottomLeft: isSelected && !isLocked, topLeft: isSelected && !isLocked,
            }}
            disableDragging={!isSelected || isLocked}
            onClick={(e: any) => { e.stopPropagation(); onSelect(el.id); }}
            className={`absolute ${isSelected ? "ring-2 ring-primary ring-offset-2 z-50 cursor-move" : "hover:ring-1 hover:ring-primary/50 cursor-pointer"}`}
            style={{ zIndex: isSelected ? 50 : (el.zIndex ?? (i + 10)) }}
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
                transform: rotation ? `rotate(${rotation}deg)` : undefined,
                textShadow: el.shadowColor
                  ? `${el.shadowOffsetX || 0}px ${el.shadowOffsetY || 0}px ${el.shadowBlur || 4}px ${el.shadowColor}`
                  : "none",
              }}
            >
              {el.type === "text" && (
                <span dangerouslySetInnerHTML={{ __html: (el.content || "").replace(/\n/g, "<br/>") }} />
              )}

              {el.type === "date" && (
                <span className="flex items-center gap-1">
                  {el.label && <span className="text-xs mr-1">{el.label}</span>}
                  <span>{new Date().toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                    ...(el.dateFormat?.includes("MM") && { month: "2-digit" }),
                    ...(el.dateFormat?.includes("DD") && { day: "2-digit" }),
                  })}</span>
                </span>
              )}

              {el.type === "table" && (
                <div className="w-full h-full border" style={{ borderColor: el.borderColor || design.accent_color }}>
                  <table className="w-full h-full border-collapse" style={{ fontSize: el.fontSize ? `${el.fontSize * 0.6}px` : "10px" }}>
                    <tbody>
                      {Array.from({ length: el.rows || 3 }).map((_, r) => (
                        <tr key={r}>
                          {Array.from({ length: el.cols || 2 }).map((_, c) => (
                            <td key={c} className="border p-1 text-center" style={{
                              borderColor: el.borderColor || design.accent_color,
                              backgroundColor: r === 0 ? (el.headerBg || `${design.accent_color}22`) : "transparent",
                              padding: `${el.cellPadding || 4}px`,
                            }}>
                              {r === 0 ? `Header ${c + 1}` : `Cell ${r}-${c + 1}`}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {el.type === "svg" && el.svgContent && (
                <div className="w-full h-full flex items-center justify-center pointer-events-none"
                  dangerouslySetInnerHTML={{
                    __html: el.svgContent.replace(/currentColor/, el.svgColor || design.accent_color),
                  }} />
              )}

              {el.type === "shape" && (
                <div className="w-full h-full" style={{
                  backgroundColor: el.fillColor || "transparent",
                  border: `${el.strokeWidth || 2}px solid ${el.strokeColor || design.accent_color}`,
                  borderRadius: el.borderRadius || (el.shapeType === "circle" ? "50%" : "0"),
                  clipPath: el.shapeType === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                    : el.shapeType === "diamond" ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
                    : el.shapeType === "hexagon" ? "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
                    : undefined,
                }} />
              )}

              {el.type === "image" && (el.url ? (
                <img src={el.url} alt="" className="w-full h-full object-contain pointer-events-none" />
              ) : (
                <div className="w-full h-full bg-muted/50 border-2 border-dashed flex flex-col items-center justify-center text-xs text-muted-foreground">
                  <ImageIcon className="h-6 w-6 opacity-50 mb-1" /> Image
                </div>
              ))}

              {el.type === "org_logo" && (el.url ? (
                <img src={el.url} alt="Logo" className="w-full h-full object-contain pointer-events-none" />
              ) : (
                <div className="w-full h-full bg-muted/30 border-2 border-dashed flex flex-col items-center justify-center text-xs text-muted-foreground rounded-lg p-2">
                  <Building2 className="h-6 w-6 opacity-60 mb-1 text-primary" />
                  <span className="font-semibold text-[10px]">LOGO</span>
                </div>
              ))}

              {el.type === "qr" && (
                <div className="w-full h-full bg-white border border-border/80 shadow-sm flex flex-col items-center justify-center text-xs text-muted-foreground rounded-md p-2">
                  <ShieldCheck className="h-full w-full opacity-40 text-primary" />
                </div>
              )}

              {el.type === "badge" && (el.url ? (
                <img src={el.url} alt="Badge" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full rounded-full flex flex-col items-center justify-center p-2 border-2 border-amber-400/80 shadow-md"
                  style={{ background: `radial-gradient(circle, ${design.accent_color}22 0%, ${design.accent_color}44 100%)` }}>
                  <Star className="h-7 w-7 text-amber-500 mb-0.5" />
                  <span className="text-[9px] font-black tracking-widest uppercase text-amber-600 leading-none">{el.content || "BADGE"}</span>
                </div>
              ))}

              {el.type === "seal_icon" && (
                <div className="w-full h-full rounded-full border-4 border-amber-500/80 flex flex-col items-center justify-center p-3 text-center shadow-lg"
                  style={{
                    background: `radial-gradient(circle, #fef3c7 0%, ${design.accent_color}55 100%)`,
                    boxShadow: `0 0 15px ${design.accent_color}66`,
                  }}>
                  <Star className="h-10 w-10 text-amber-600 mb-1 animate-pulse" />
                  <span className="text-[10px] font-black tracking-widest text-amber-900 uppercase">{el.content || "SEAL"}</span>
                </div>
              )}

              {el.type === "guilloche_watermark" && (
                <div className="w-full h-full flex items-center justify-center pointer-events-none opacity-30">
                  <svg className="w-full h-full text-amber-500" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                    <circle cx="50" cy="50" r="45" strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx="50" cy="50" r="35" strokeWidth="0.8" />
                    <circle cx="50" cy="50" r="25" strokeWidth="1.2" strokeDasharray="4 2" />
                    <path d="M 50 5 L 50 95 M 5 50 L 95 50 M 18 18 L 82 82 M 18 82 L 82 18" strokeWidth="0.5" />
                  </svg>
                </div>
              )}

              {el.type === "divider_line" && (
                <div className="w-full h-full flex items-center justify-center pointer-events-none">
                  <div className="w-full h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent 0%, ${el.color || design.accent_color} 50%, transparent 100%)` }} />
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
