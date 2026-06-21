import { forwardRef } from "react";
import { Award, ShieldCheck } from "lucide-react";

export type CertDesign = {
  title_text: string;
  subtitle: string;
  body_template: string;
  signatory_name: string;
  signatory_title: string;
  accent_color: string;
  bg_color: string;
  text_color: string;
  font_family: string;
  logo_url?: string | null;
  signature_url?: string | null;
  stamp_url?: string | null;
  title_font?: string | null;
  body_font?: string | null;
  title_size?: number;
  name_size?: number;
  body_size?: number;
  border_style?: "double" | "solid" | "dashed" | "ornate" | "none" | string;
  border_width?: number;
  corner_style?: "diagonal" | "ribbon" | "none" | string;
  background_pattern?: "none" | "dots" | "grid" | "diagonal" | "gradient" | string;
  accent_color_2?: string | null;
  layout?: "classic" | "modern" | "elegant" | "minimal" | string;
};

export const DEFAULT_DESIGN: CertDesign = {
  title_text: "Certificate of Completion",
  subtitle: "This is to certify that",
  body_template: "has successfully completed the course {course} on {date}.",
  signatory_name: "Learnify AI",
  signatory_title: "Director of Learning",
  accent_color: "#c9a84c",
  bg_color: "#fdfbf5",
  text_color: "#0f1b3d",
  font_family: "Playfair Display",
  logo_url: "/logo.png",
  signature_url: null,
  stamp_url: null,
  title_font: null,
  body_font: null,
  title_size: 1,
  name_size: 1,
  body_size: 1,
  border_style: "double",
  border_width: 10,
  corner_style: "diagonal",
  background_pattern: "none",
  accent_color_2: null,
  layout: "classic",
};

export const FONT_OPTIONS = [
  "Playfair Display",
  "Cormorant Garamond",
  "Cinzel",
  "Libre Baskerville",
  "Merriweather",
  "Lora",
  "Inter",
  "Montserrat",
  "Poppins",
  "Raleway",
  "Bebas Neue",
  "Oswald",
  "Great Vibes",
  "Pinyon Script",
  "Allura",
  "Dancing Script",
];

export const BORDER_STYLES = ["double", "solid", "dashed", "ornate", "none"];
export const CORNER_STYLES = ["diagonal", "ribbon", "none"];
export const BACKGROUND_PATTERNS = ["none", "dots", "grid", "diagonal", "gradient"];
export const LAYOUTS = ["classic", "modern", "elegant", "minimal"];

export type CertContext = {
  name: string;
  course: string;
  date: string;
  role: string;
  from: string;
  to: string;
  instructor?: string;
  code: string;
  score?: number | null;
  total?: number | null;
  qrDataUrl?: string;
};

export function interpolate(template: string, ctx: CertContext) {
  return template
    .replaceAll("{name}", ctx.name)
    .replaceAll("{course}", ctx.course)
    .replaceAll("{date}", ctx.date)
    .replaceAll("{role}", ctx.role)
    .replaceAll("{from}", ctx.from)
    .replaceAll("{to}", ctx.to);
}

function patternBackground(pattern: string, bg: string, accent: string, accent2?: string | null) {
  const safeBg = bg || "#ffffff";
  switch (pattern) {
    case "dots":
      return {
        backgroundColor: safeBg,
        backgroundImage: `radial-gradient(${accent}33 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      };
    case "grid":
      return {
        backgroundColor: safeBg,
        backgroundImage: `linear-gradient(${accent}1a 1px, transparent 1px), linear-gradient(90deg, ${accent}1a 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      };
    case "diagonal":
      return {
        backgroundColor: safeBg,
        backgroundImage: `repeating-linear-gradient(45deg, ${accent}0a 0 1px, transparent 1px 10px, ${accent}0a 10px 11px, transparent 11px 20px)`,
      };
    case "gradient":
      return {
        background: `radial-gradient(circle at 100% 0%, ${accent}1a 0%, transparent 60%), radial-gradient(circle at 0% 100%, ${accent2 || accent}1a 0%, ${safeBg} 60%)`,
        backgroundColor: safeBg,
      };
    default:
      return { background: safeBg };
  }
}

type Props = { design: CertDesign; ctx: CertContext };

export const CertificateRender = forwardRef<HTMLDivElement, Props>(({ design, ctx }, ref) => {
  const pct = ctx.total ? Math.round(((ctx.score ?? 0) / ctx.total) * 100) : null;
  const body = interpolate(design.body_template, ctx);

  const titleFont = design.title_font || design.font_family;
  const bodyFont = design.body_font || design.font_family;
  const titleSize = design.title_size ?? 1;
  const nameSize = design.name_size ?? 1;
  const bodySize = design.body_size ?? 1;

  const borderStyle = design.border_style ?? "double";
  const borderWidth = design.border_width ?? 10;
  const cornerStyle = design.corner_style ?? "diagonal";
  const pattern = design.background_pattern ?? "none";
  const layout = design.layout ?? "classic";

  const borderCss =
    borderStyle === "none"
      ? "none"
      : borderStyle === "ornate"
        ? `1px solid ${design.accent_color}55`
        : `${borderWidth}px ${borderStyle} ${design.accent_color}`;

  const bgStyle = patternBackground(
    pattern,
    design.bg_color,
    design.accent_color,
    design.accent_color_2,
  );

  const showCorners = cornerStyle !== "none" && layout !== "minimal";

  return (
    <div
      ref={ref}
      className="relative w-full mx-auto overflow-hidden shadow-2xl bg-white"
      style={{
        color: design.text_color,
        aspectRatio: "1.414 / 1",
        fontFamily: `'${bodyFont}', Georgia, serif`,
        border: borderCss,
        ...bgStyle,
        colorScheme: "light",
      }}
    >
      {/* Ornate Border Extras */}
      {borderStyle === "ornate" && (
        <>
          <div
            className="absolute inset-2 pointer-events-none"
            style={{ border: `3px double ${design.accent_color}aa` }}
          />
          <div
            className="absolute inset-[12px] pointer-events-none"
            style={{ border: `1px solid ${design.accent_color}44` }}
          />
          {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map(
            (pos, i) => (
              <div
                key={i}
                className={`absolute ${pos} w-8 h-8 pointer-events-none`}
                style={{
                  borderTop: pos.includes("top") ? `2px solid ${design.accent_color}` : "none",
                  borderBottom: pos.includes("bottom")
                    ? `2px solid ${design.accent_color}`
                    : "none",
                  borderLeft: pos.includes("left") ? `2px solid ${design.accent_color}` : "none",
                  borderRight: pos.includes("right") ? `2px solid ${design.accent_color}` : "none",
                }}
              />
            ),
          )}
        </>
      )}

      {/* Decorative Corners */}
      {showCorners && (
        <>
          <div
            className="absolute top-0 left-0"
            style={{
              width: "180px",
              height: "180px",
              background: design.text_color,
              clipPath:
                cornerStyle === "ribbon"
                  ? "polygon(0 0, 100% 0, 80% 100%, 0 100%)"
                  : "polygon(0 0, 100% 0, 0 100%)",
            }}
          />
          <div
            className="absolute bottom-0 right-0"
            style={{
              width: "180px",
              height: "180px",
              background: design.text_color,
              clipPath:
                cornerStyle === "ribbon"
                  ? "polygon(100% 0, 100% 100%, 0 100%, 20% 0)"
                  : "polygon(100% 0, 100% 100%, 0 100%)",
            }}
          />
          <div
            className="absolute top-2 left-2"
            style={{
              width: "120px",
              height: "120px",
              background: design.accent_color,
              opacity: 0.85,
              clipPath:
                cornerStyle === "ribbon"
                  ? "polygon(0 0, 100% 0, 80% 100%, 0 100%)"
                  : "polygon(0 0, 100% 0, 0 100%)",
            }}
          />
          <div
            className="absolute bottom-2 right-2"
            style={{
              width: "120px",
              height: "120px",
              background: design.accent_color,
              opacity: 0.85,
              clipPath:
                cornerStyle === "ribbon"
                  ? "polygon(100% 0, 100% 100%, 0 100%, 20% 0)"
                  : "polygon(100% 0, 100% 100%, 0 100%)",
            }}
          />
        </>
      )}

      {/* Top-right "Issued on" pill */}
      <div
        className="absolute z-20 top-5 right-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.18em] font-semibold shadow-sm bg-white/60 backdrop-blur-sm"
        style={{
          color: design.text_color,
          border: `1px solid ${design.accent_color}66`,
        }}
      >
        <span style={{ color: design.accent_color }}>Issued</span>
        <span>{ctx.date}</span>
      </div>

      <div className="relative z-10 h-full flex flex-col items-center text-center px-[7%] py-[5%]">
        <div className="flex items-center gap-3">
          {design.logo_url ? (
            <img src={design.logo_url} alt="Logo" className="h-12 w-12 object-contain" />
          ) : (
            <div
              className="h-12 w-12 rounded-full grid place-items-center shadow-inner"
              style={{ background: design.text_color, color: design.bg_color }}
            >
              <Award className="h-6 w-6" />
            </div>
          )}
          <div className="text-left">
            <div
              className="text-[10px] tracking-[0.35em] uppercase font-semibold"
              style={{ color: design.accent_color }}
            >
              Learnify AI
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] opacity-60">
              Verified Achievement
            </div>
          </div>
        </div>

        <h1
          className="mt-6 font-semibold leading-tight drop-shadow-sm"
          style={{
            fontSize: `clamp(${1.4 * titleSize}rem, ${3.6 * titleSize}vw, ${2.8 * titleSize}rem)`,
            color: design.text_color,
            fontFamily: `'${titleFont}', Georgia, serif`,
            letterSpacing: layout === "modern" ? "0.02em" : "0.005em",
          }}
        >
          {design.title_text}
        </h1>

        {layout !== "minimal" && (
          <div className="mt-3 flex items-center gap-2 opacity-80">
            <span className="h-[2px] w-12" style={{ background: design.accent_color }} />
            <span className="h-2 w-2 rotate-45" style={{ background: design.accent_color }} />
            <span className="h-[2px] w-12" style={{ background: design.accent_color }} />
          </div>
        )}

        <p
          className="mt-5 text-xs uppercase tracking-[0.28em] opacity-80 font-medium"
          style={{ fontSize: `${0.75 * bodySize}rem` }}
        >
          {design.subtitle}
        </p>
        <h2
          className="mt-2 font-bold break-words max-w-[92%]"
          style={{
            fontSize: `clamp(${1.8 * nameSize}rem, ${5 * nameSize}vw, ${3.4 * nameSize}rem)`,
            color: design.accent_color,
            fontFamily: `'${titleFont}', Georgia, serif`,
            lineHeight: 1.1,
            textShadow: `1px 1px 0px ${design.bg_color}, 2px 2px 4px rgba(0,0,0,0.05)`,
          }}
        >
          {ctx.name}
        </h2>
        {ctx.role && (
          <p className="mt-1 text-[10px] uppercase tracking-[0.3em] opacity-70 font-semibold">
            {ctx.role}
          </p>
        )}

        <p
          className="mt-5 max-w-[78%] opacity-90 leading-relaxed"
          style={{ fontSize: `${0.95 * bodySize}rem` }}
        >
          {body}
        </p>
        {ctx.instructor && (
          <p className="mt-2 text-[11px] opacity-70 italic font-medium">
            Instructor · {ctx.instructor}
          </p>
        )}

        {pct !== null && (
          <div
            className="mt-4 inline-flex items-center gap-2 text-xs px-4 py-1.5 rounded-full font-semibold shadow-sm backdrop-blur-sm"
            style={{
              background: `${design.accent_color}11`,
              color: design.text_color,
              border: `1px solid ${design.accent_color}55`,
            }}
          >
            Final score · {ctx.score} / {ctx.total} ({pct}%)
          </div>
        )}

        <div className="mt-auto pt-6 w-full grid grid-cols-3 gap-6 items-end text-left">
          {/* Signature Block */}
          <div>
            <div className="h-14 flex items-end">
              {design.signature_url ? (
                <img
                  src={design.signature_url}
                  alt="Signature"
                  className="h-14 object-contain drop-shadow-sm"
                />
              ) : (
                <div
                  style={{
                    fontFamily: "'Great Vibes', 'Dancing Script', cursive",
                    fontSize: "2rem",
                    color: design.text_color,
                    opacity: 0.8,
                    transform: "rotate(-3deg) translateY(-4px)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {design.signatory_name}
                </div>
              )}
            </div>
            <div
              className="border-t mt-1 pt-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold"
              style={{ borderColor: design.accent_color, color: design.text_color, opacity: 0.9 }}
            >
              {design.signatory_name}
            </div>
            <div className="text-[9px] uppercase tracking-[0.18em] opacity-60">
              {design.signatory_title}
            </div>
          </div>

          {/* QR Verification Block */}
          <div className="flex flex-col items-center">
            <div
              className="p-1.5 rounded-md shadow-sm"
              style={{ background: "#ffffff", border: `1px solid ${design.accent_color}44` }}
            >
              {ctx.qrDataUrl ? (
                <img src={ctx.qrDataUrl} alt="Verify QR" className="h-20 w-20" />
              ) : (
                <div className="h-20 w-20 grid place-items-center opacity-30">
                  <ShieldCheck className="h-8 w-8" />
                </div>
              )}
            </div>
            <div className="mt-2 text-[9px] uppercase tracking-[0.22em] font-bold opacity-70">
              Verify Validity
            </div>
            <div className="text-[10px] font-mono opacity-60 break-all max-w-[140px] text-center mt-0.5">
              {ctx.code}
            </div>
          </div>

          {/* Stamp / Date Block */}
          <div className="text-right flex flex-col items-end">
            <div className="h-16 flex justify-end items-end mb-2">
              {design.stamp_url ? (
                <img
                  src={design.stamp_url}
                  alt="Stamp"
                  className="h-16 object-contain drop-shadow-md"
                />
              ) : (
                <div
                  className="h-16 w-16 rounded-full flex items-center justify-center text-[8px] uppercase tracking-[0.2em] font-extrabold shadow-md relative"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${design.accent_color}, ${design.accent_color}cc)`,
                    color: design.bg_color,
                    boxShadow: `0 0 0 3px ${design.accent_color}33, inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 6px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.15)`,
                  }}
                >
                  <div
                    className="absolute inset-[3px] rounded-full"
                    style={{ border: `1px dashed ${design.bg_color}99` }}
                  />
                  <span
                    className="opacity-95 transform -rotate-12 z-10"
                    style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}
                  >
                    Verified
                  </span>
                </div>
              )}
            </div>
            <div
              className="border-t w-full text-right pt-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold whitespace-nowrap"
              style={{ borderColor: design.accent_color, color: design.text_color, opacity: 0.9 }}
            >
              Date of Issue
            </div>
            <div
              className="text-[11px] font-semibold tracking-wide"
              style={{ color: design.accent_color }}
            >
              {ctx.date}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
CertificateRender.displayName = "CertificateRender";
