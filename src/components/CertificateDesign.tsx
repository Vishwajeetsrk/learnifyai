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
  // Rich design fields (all optional)
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
<<<<<<< HEAD
  logo_url: null,
=======
  logo_url: "/favicon.ico",
>>>>>>> fc4522b843573bc1c1f5dd8e35d41f7bbd28de87
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
  switch (pattern) {
    case "dots":
      return {
        backgroundColor: bg,
        backgroundImage: `radial-gradient(${accent}33 1px, transparent 1px)`,
        backgroundSize: "18px 18px",
      };
    case "grid":
      return {
        backgroundColor: bg,
        backgroundImage: `linear-gradient(${accent}22 1px, transparent 1px), linear-gradient(90deg, ${accent}22 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      };
    case "diagonal":
      return {
        backgroundColor: bg,
        backgroundImage: `repeating-linear-gradient(45deg, ${accent}11 0 2px, transparent 2px 14px)`,
      };
    case "gradient":
      return {
        background: `linear-gradient(135deg, ${bg} 0%, ${accent2 || accent}22 100%)`,
      };
    default:
      return { background: bg };
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
        ? `${borderWidth}px double ${design.accent_color}`
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
      className="relative w-full mx-auto overflow-hidden shadow-2xl"
      style={{
        color: design.text_color,
        aspectRatio: "1.414 / 1",
        fontFamily: `'${bodyFont}', Georgia, serif`,
        border: borderCss,
        ...bgStyle,
      }}
    >
      {borderStyle === "ornate" && (
        <div
          className="absolute inset-2 pointer-events-none"
          style={{ border: `1px solid ${design.accent_color}88` }}
        />
      )}

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

      {/* Top-right "Issued on" pill — always visible, sits above any corner ornament */}
      <div
        className="absolute z-20 top-5 right-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.18em] font-semibold shadow-sm"
        style={{
          background: design.bg_color,
          color: design.text_color,
          border: `1.5px solid ${design.accent_color}`,
        }}
      >
        <span style={{ color: design.accent_color }}>Issued</span>
        <span>{ctx.date}</span>
      </div>

      <div className="relative z-10 h-full flex flex-col items-center text-center px-[7%] py-[5.5%]">
        <div className="flex items-center gap-3">
          {design.logo_url ? (
            <img src={design.logo_url} alt="Logo" className="h-12 w-12 object-contain" />
          ) : (
            <div
              className="h-12 w-12 rounded-full grid place-items-center"
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
          className="mt-7 font-semibold leading-tight"
          style={{
            fontSize: `clamp(${1.4 * titleSize}rem, ${3.6 * titleSize}vw, ${2.8 * titleSize}rem)`,
            color: design.text_color,
            fontFamily: `'${titleFont}', Georgia, serif`,
            letterSpacing: layout === "modern" ? "0.02em" : "0.005em",
          }}
        >
          {design.title_text}
        </h1>
        <div className="mt-2 flex items-center gap-2">
          <span className="h-[2px] w-12" style={{ background: design.accent_color }} />
          <span className="h-1.5 w-1.5 rotate-45" style={{ background: design.accent_color }} />
          <span className="h-[2px] w-12" style={{ background: design.accent_color }} />
        </div>

        <p
          className="mt-5 text-xs uppercase tracking-[0.28em] opacity-70"
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
          }}
        >
          {ctx.name}
        </h2>
        {ctx.role && (
          <p className="mt-1 text-[10px] uppercase tracking-[0.3em] opacity-70">{ctx.role}</p>
        )}

        <p
          className="mt-5 max-w-[78%] opacity-90 leading-relaxed"
          style={{ fontSize: `${0.95 * bodySize}rem` }}
        >
          {body}
        </p>
        {ctx.instructor && (
          <p className="mt-1.5 text-[11px] opacity-60 italic">Instructor · {ctx.instructor}</p>
        )}

        {pct !== null && (
          <div
            className="mt-4 inline-flex items-center gap-2 text-xs px-3.5 py-1 rounded-full font-semibold"
            style={{
              background: `${design.accent_color}1f`,
              color: design.text_color,
              border: `1px solid ${design.accent_color}`,
            }}
          >
            Final score · {ctx.score} / {ctx.total} ({pct}%)
          </div>
        )}

        <div className="mt-auto pt-6 w-full grid grid-cols-3 gap-6 items-end text-left">
          <div>
            <div className="h-12 flex items-end">
              {design.signature_url && (
                <img src={design.signature_url} alt="Signature" className="h-12 object-contain" />
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
          <div className="flex flex-col items-center">
            <div
              className="p-1.5 rounded-md"
              style={{ background: design.bg_color, border: `1px solid ${design.accent_color}55` }}
            >
              {ctx.qrDataUrl ? (
                <img src={ctx.qrDataUrl} alt="Verify QR" className="h-20 w-20" />
              ) : (
                <div className="h-20 w-20 grid place-items-center opacity-40">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="mt-1.5 text-[9px] uppercase tracking-[0.22em] opacity-70">
              Scan to verify
            </div>
            <div className="text-[10px] font-mono opacity-80 break-all max-w-[140px] text-center">
              {ctx.code}
            </div>
          </div>
          <div className="text-right">
            <div className="h-12 flex justify-end items-end">
              {design.stamp_url ? (
                <img src={design.stamp_url} alt="Stamp" className="h-14 object-contain" />
              ) : (
                <div
                  className="h-14 w-14 rounded-full grid place-items-center text-[8px] uppercase tracking-widest font-bold opacity-80"
                  style={{ border: `2px solid ${design.accent_color}`, color: design.accent_color }}
                >
                  Verified
                </div>
              )}
            </div>
            <div
              className="border-t mt-1 pt-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold whitespace-nowrap"
              style={{ borderColor: design.accent_color, color: design.text_color, opacity: 0.9 }}
            >
              Date of Issue
            </div>
            <div className="text-[11px] font-semibold" style={{ color: design.accent_color }}>
              {ctx.date}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
CertificateRender.displayName = "CertificateRender";
