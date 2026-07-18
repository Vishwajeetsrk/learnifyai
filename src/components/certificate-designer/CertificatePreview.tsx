import { useRef } from "react";
import { CertElement, CertDesign } from "./types";
import { Lock, Unlock, ChevronRight, Copy, Trash2 } from "lucide-react";

type CertificatePreviewProps = {
  elements: CertElement[];
  design: CertDesign;
  bgImageUrl?: string | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CertElement>) => void;
  scale?: number;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
};

export function CertificatePreview({
  elements,
  design,
  bgImageUrl,
  selectedId,
  onSelect,
  onUpdateElement,
  scale = 1,
  onDeleteElement,
  onDuplicateElement,
}: CertificatePreviewProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const activeBgImage = design.show_bg_image !== false ? bgImageUrl : null;

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

  const borderCss =
    activeBgImage || design.border_style === "none"
      ? "none"
      : design.border_style === "ornate"
        ? `1px solid ${design.accent_color}55`
        : `${design.border_width}px ${design.border_style} ${design.accent_color}`;

  return (
    <div
      ref={canvasRef}
      id="certificate-preview-export"
      className="relative shadow-2xl overflow-hidden"
      style={{
        width: 842,
        height: 595,
        ...getPatternStyle(design.background_pattern, design.bg_color, design.accent_color),
        ...(activeBgImage
          ? {
              backgroundImage: `url("${activeBgImage}")`,
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : {}),
        border: borderCss,
      }}
      onClick={(e) => {
        if (e.target === canvasRef.current) onSelect(null);
      }}
    >
      {/* Corner Styles */}
      {!activeBgImage && design.corner_style !== "none" && (
        <>
          <div
            className="absolute top-0 left-0 pointer-events-none"
            style={{
              width: 140,
              height: 140,
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
              width: 140,
              height: 140,
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

      {/* Ornate Border */}
      {!activeBgImage && design.border_style === "ornate" && (
        <>
          <div
            className="absolute inset-2 pointer-events-none"
            style={{ border: `3px double ${design.accent_color}aa` }}
          />
          <div
            className="absolute inset-[12px] pointer-events-none"
            style={{ border: `1px solid ${design.accent_color}44` }}
          />
        </>
      )}

      {/* Elements */}
      {elements.map((el, i) => {
        if (el.hidden) return null;
        const isSelected = selectedId === el.id;
        const isLocked = el.locked === true;
        const rotation = el.rotation || 0;

        const handleMouseDown = (e: React.MouseEvent) => {
          if (isLocked) return;
          e.stopPropagation();
          onSelect(el.id);
          
          const startX = e.clientX;
          const startY = e.clientY;
          const elemX = el.x;
          const elemY = el.y;

          const handleMouseMove = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;
            const nextX = elemX + dx / scale;
            const nextY = elemY + dy / scale;
            
            const maxW = 842 - (el.width || 50);
            const maxH = 595 - (el.height || 30);
            const boundedX = Math.max(0, Math.min(maxW, nextX));
            const boundedY = Math.max(0, Math.min(maxH, nextY));

            onUpdateElement(el.id, {
              x: Math.round(boundedX),
              y: Math.round(boundedY),
            });
          };

          const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
          };

          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
        };

        const handleTouchStart = (e: React.TouchEvent) => {
          if (isLocked) return;
          e.stopPropagation();
          onSelect(el.id);
          
          const touch = e.touches[0];
          const startX = touch.clientX;
          const startY = touch.clientY;
          const elemX = el.x;
          const elemY = el.y;

          const handleTouchMove = (moveEvent: TouchEvent) => {
            const touchMove = moveEvent.touches[0];
            const dx = touchMove.clientX - startX;
            const dy = touchMove.clientY - startY;
            const nextX = elemX + dx / scale;
            const nextY = elemY + dy / scale;

            const maxW = 842 - (el.width || 50);
            const maxH = 595 - (el.height || 30);
            const boundedX = Math.max(0, Math.min(maxW, nextX));
            const boundedY = Math.max(0, Math.min(maxH, nextY));

            onUpdateElement(el.id, {
              x: Math.round(boundedX),
              y: Math.round(boundedY),
            });
          };

          const handleTouchEnd = () => {
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
          };

          document.addEventListener("touchmove", handleTouchMove, { passive: true });
          document.addEventListener("touchend", handleTouchEnd);
        };

        const handleResizeStart = (e: React.MouseEvent, direction: string) => {
          e.stopPropagation();
          e.preventDefault();
          const startX = e.clientX;
          const startY = e.clientY;
          const startW = el.width || 100;
          const startH = el.height || 40;
          const startXPos = el.x;
          const startYPos = el.y;

          const handleResizeMove = (moveEvent: MouseEvent) => {
            const dx = (moveEvent.clientX - startX) / scale;
            const dy = (moveEvent.clientY - startY) / scale;

            let nextW = startW;
            let nextH = startH;
            let nextX = startXPos;
            let nextY = startYPos;

            if (direction.includes("right")) {
              nextW = Math.max(20, startW + dx);
            }
            if (direction.includes("left")) {
              const possibleW = startW - dx;
              if (possibleW > 20) {
                nextW = possibleW;
                nextX = startXPos + dx;
              }
            }
            if (direction.includes("bottom")) {
              nextH = Math.max(20, startH + dy);
            }
            if (direction.includes("top")) {
              const possibleH = startH - dy;
              if (possibleH > 20) {
                nextH = possibleH;
                nextY = startYPos + dy;
              }
            }

            onUpdateElement(el.id, {
              width: Math.round(nextW),
              height: Math.round(nextH),
              x: Math.round(nextX),
              y: Math.round(nextY),
            });
          };

          const handleResizeUp = () => {
            document.removeEventListener("mousemove", handleResizeMove);
            document.removeEventListener("mouseup", handleResizeUp);
          };

          document.addEventListener("mousemove", handleResizeMove);
          document.addEventListener("mouseup", handleResizeUp);
        };

        return (
          <div
            key={el.id}
            className={`absolute ${isSelected ? "ring-2 ring-blue-500 ring-offset-1 z-50" : "hover:ring-1 hover:ring-blue-300 z-10"}`}
            style={{
              left: el.x,
              top: el.y,
              width: el.width || "auto",
              height: el.height || "auto",
              zIndex: isSelected ? 50 : (el.zIndex ?? i + 10),
              cursor: isLocked ? "not-allowed" : "move",
              transform: rotation ? `rotate(${rotation}deg)` : undefined,
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {/* FLOATING CONTEXT TOOLBAR */}
            {isSelected && (
              <div 
                className="absolute left-1/2 -translate-x-1/2 -top-11 bg-slate-900/95 text-white rounded-lg shadow-xl px-2 py-1 flex items-center gap-1.5 z-[100] backdrop-blur-sm border border-slate-700/50 scale-75 origin-bottom"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => onUpdateElement(el.id, { locked: !isLocked })} 
                  className={`p-1 hover:bg-slate-800 rounded transition-colors ${isLocked ? "text-amber-400" : "text-slate-300"}`}
                  title={isLocked ? "Unlock Element" : "Lock Element"}
                >
                  {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
                </button>
                <div className="w-px h-3 bg-slate-700" />
                <button 
                  onClick={() => onUpdateElement(el.id, { zIndex: (el.zIndex ?? 10) + 1 })} 
                  className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-300"
                  title="Bring Forward"
                >
                  <ChevronRight size={12} className="-rotate-90" />
                </button>
                <button 
                  onClick={() => onUpdateElement(el.id, { zIndex: Math.max(0, (el.zIndex ?? 10) - 1) })} 
                  className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-300"
                  title="Send Backward"
                >
                  <ChevronRight size={12} className="rotate-90" />
                </button>
                <div className="w-px h-3 bg-slate-700" />
                <button 
                  onClick={() => onDuplicateElement(el.id)} 
                  className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-300"
                  title="Duplicate"
                >
                  <Copy size={12} />
                </button>
                <button 
                  onClick={() => onDeleteElement(el.id)} 
                  className="p-1 hover:bg-slate-800 text-red-400 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}

            {/* RESIZE HANDLES */}
            {isSelected && !isLocked && (
              <>
                <div 
                  className="absolute w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full z-[60] cursor-nwse-resize"
                  style={{ top: -4, left: -4 }}
                  onMouseDown={(e) => handleResizeStart(e, "top-left")}
                />
                <div 
                  className="absolute w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full z-[60] cursor-nesw-resize"
                  style={{ top: -4, right: -4 }}
                  onMouseDown={(e) => handleResizeStart(e, "top-right")}
                />
                <div 
                  className="absolute w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full z-[60] cursor-nesw-resize"
                  style={{ bottom: -4, left: -4 }}
                  onMouseDown={(e) => handleResizeStart(e, "bottom-left")}
                />
                <div 
                  className="absolute w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full z-[60] cursor-nwse-resize"
                  style={{ bottom: -4, right: -4 }}
                  onMouseDown={(e) => handleResizeStart(e, "bottom-right")}
                />
              </>
            )}

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
                justifyContent:
                  el.align === "center"
                    ? "center"
                    : el.align === "right"
                      ? "flex-end"
                      : "flex-start",
                alignItems: "center",
                lineHeight: el.lineHeight || 1.2,
                letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : "normal",
                textTransform: el.textTransform || "none",
                opacity: el.opacity ?? 1,
                textShadow: el.shadowColor
                  ? `${el.shadowOffsetX || 0}px ${el.shadowOffsetY || 0}px ${el.shadowBlur || 4}px ${el.shadowColor}`
                  : "none",
              }}
            >
              {el.type === "text" && (
                <span
                  dangerouslySetInnerHTML={{ __html: (el.content || "").replace(/\n/g, "<br/>") }}
                />
              )}

              {el.type === "date" && (
                <span className="flex items-center gap-1">
                  {el.label && <span className="text-xs mr-1">{el.label}</span>}
                  <span>
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </span>
              )}

              {el.type === "table" && (
                <div
                  className="w-full h-full border"
                  style={{ borderColor: el.borderColor || design.accent_color }}
                >
                  <table
                    className="w-full h-full border-collapse"
                    style={{ fontSize: el.fontSize ? `${el.fontSize * 0.6}px` : "10px" }}
                  >
                    <tbody>
                      {Array.from({ length: el.rows || 3 }).map((_, r) => (
                        <tr key={r}>
                          {Array.from({ length: el.cols || 2 }).map((_, c) => (
                            <td
                              key={c}
                              className="border p-1 text-center"
                              style={{
                                borderColor: el.borderColor || design.accent_color,
                                backgroundColor:
                                  r === 0
                                    ? el.headerBg || `${design.accent_color}22`
                                    : "transparent",
                                padding: `${el.cellPadding || 4}px`,
                              }}
                            >
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
                <div
                  className="w-full h-full flex items-center justify-center pointer-events-none"
                  dangerouslySetInnerHTML={{
                    __html: el.svgContent.replace(
                      /currentColor/,
                      el.svgColor || design.accent_color,
                    ),
                  }}
                />
              )}

              {el.type === "shape" && (
                <div
                  className="w-full h-full"
                  style={{
                    backgroundColor: el.fillColor || "transparent",
                    border: `${el.strokeWidth || 2}px solid ${el.strokeColor || design.accent_color}`,
                    borderRadius: el.borderRadius || (el.shapeType === "circle" ? "50%" : "0"),
                    clipPath:
                      el.shapeType === "triangle"
                        ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                        : el.shapeType === "diamond"
                          ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
                          : el.shapeType === "hexagon"
                            ? "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
                            : undefined,
                  }}
                />
              )}

              {el.type === "image" &&
                (el.url ? (
                  <img
                    src={el.url}
                    alt=""
                    className="w-full h-full object-contain pointer-events-none"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-xs text-slate-400">
                    Image
                  </div>
                ))}

              {el.type === "org_logo" &&
                (el.url ? (
                  <img
                    src={el.url}
                    alt="Logo"
                    className="w-full h-full object-contain pointer-events-none"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-[10px] text-slate-400 rounded-lg p-2">
                    LOGO
                  </div>
                ))}

              {el.type === "qr" && (
                <div className="w-full h-full bg-white p-1 rounded-md border border-slate-200 flex items-center justify-center shadow-sm">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                      window.location.origin + "/verify/certificate/" + (el.content || "LAI-2026-000124")
                    )}`}
                    alt="QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {el.type === "badge" &&
                (el.url ? (
                  <img src={el.url} alt="Badge" className="w-full h-full object-contain" />
                ) : (
                  <div
                    className="w-full h-full rounded-full flex flex-col items-center justify-center p-2 border-2 border-amber-400/80 shadow-md"
                    style={{
                      background: `radial-gradient(circle, ${design.accent_color}22 0%, ${design.accent_color}44 100%)`,
                    }}
                  >
                    <span className="text-[9px] font-black tracking-widest uppercase text-amber-600 leading-none">
                      {el.content || "BADGE"}
                    </span>
                  </div>
                ))}

              {el.type === "seal_icon" && (
                <div
                  className="w-full h-full rounded-full border-4 border-amber-500/80 flex flex-col items-center justify-center p-3 text-center shadow-lg"
                  style={{
                    background: `radial-gradient(circle, #fef3c7 0%, ${design.accent_color}55 100%)`,
                  }}
                >
                  <span className="text-[10px] font-black tracking-widest text-amber-900 uppercase">
                    {el.content || "SEAL"}
                  </span>
                </div>
              )}

              {el.type === "guilloche_watermark" && (
                <div className="w-full h-full flex items-center justify-center pointer-events-none opacity-30">
                  <svg
                    className="w-full h-full text-amber-500"
                    viewBox="0 0 100 100"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="50" cy="50" r="45" strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx="50" cy="50" r="35" strokeWidth="0.8" />
                    <circle cx="50" cy="50" r="25" strokeWidth="1.2" strokeDasharray="4 2" />
                    <path
                      d="M 50 5 L 50 95 M 5 50 L 95 50 M 18 18 L 82 82 M 18 82 L 82 18"
                      strokeWidth="0.5"
                    />
                  </svg>
                </div>
              )}

              {el.type === "divider_line" && (
                <div className="w-full h-full flex items-center justify-center pointer-events-none">
                  <div
                    className="w-full h-[2px]"
                    style={{
                      background: `linear-gradient(90deg, transparent 0%, ${el.color || design.accent_color} 50%, transparent 100%)`,
                    }}
                  />
                </div>
              )}

              {el.type === "signature" && (
                <div className="w-full h-full border-b border-dashed flex items-end justify-center pb-1">
                  {el.url ? (
                    <img
                      src={el.url}
                      alt="Signature"
                      className="h-full object-contain pointer-events-none"
                    />
                  ) : (
                    <div
                      style={{
                        fontFamily: "'Great Vibes', cursive",
                        fontSize: "1.5em",
                        opacity: 0.7,
                        transform: "rotate(-3deg)",
                      }}
                    >
                      Signature
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
