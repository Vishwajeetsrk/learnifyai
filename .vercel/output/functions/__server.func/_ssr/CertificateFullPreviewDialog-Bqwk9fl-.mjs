import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { D as Dialog, a as DialogContent, c as DialogTitle } from "./dialog-CV-3vits.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { J as Award, a6 as ShieldCheck, a7 as ZoomOut, a8 as ZoomIn, a2 as Maximize2, a9 as RefreshCcw } from "../_libs/lucide-react.mjs";
const DEFAULT_DESIGN = {
  title_text: "Certificate of Completion",
  subtitle: "This is to certify that",
  body_template: "has successfully completed the course {course} on {date}.",
  signatory_name: "Learnify AI",
  signatory_title: "Director of Learning",
  accent_color: "#c9a84c",
  bg_color: "#fdfbf5",
  text_color: "#0f1b3d",
  font_family: "Playfair Display",
  logo_url: null,
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
  layout: "classic"
};
const FONT_OPTIONS = [
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
  "Dancing Script"
];
const BORDER_STYLES = ["double", "solid", "dashed", "ornate", "none"];
const CORNER_STYLES = ["diagonal", "ribbon", "none"];
const BACKGROUND_PATTERNS = ["none", "dots", "grid", "diagonal", "gradient"];
const LAYOUTS = ["classic", "modern", "elegant", "minimal"];
function interpolate(template, ctx) {
  return template.replaceAll("{name}", ctx.name).replaceAll("{course}", ctx.course).replaceAll("{date}", ctx.date).replaceAll("{role}", ctx.role).replaceAll("{from}", ctx.from).replaceAll("{to}", ctx.to);
}
function patternBackground(pattern, bg, accent, accent2) {
  switch (pattern) {
    case "dots":
      return {
        backgroundColor: bg,
        backgroundImage: `radial-gradient(${accent}33 1px, transparent 1px)`,
        backgroundSize: "18px 18px"
      };
    case "grid":
      return {
        backgroundColor: bg,
        backgroundImage: `linear-gradient(${accent}22 1px, transparent 1px), linear-gradient(90deg, ${accent}22 1px, transparent 1px)`,
        backgroundSize: "32px 32px"
      };
    case "diagonal":
      return {
        backgroundColor: bg,
        backgroundImage: `repeating-linear-gradient(45deg, ${accent}11 0 2px, transparent 2px 14px)`
      };
    case "gradient":
      return {
        background: `linear-gradient(135deg, ${bg} 0%, ${accent2 || accent}22 100%)`
      };
    default:
      return { background: bg };
  }
}
const CertificateRender = reactExports.forwardRef(({ design, ctx }, ref) => {
  const pct = ctx.total ? Math.round((ctx.score ?? 0) / ctx.total * 100) : null;
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
  const borderCss = borderStyle === "none" ? "none" : borderStyle === "ornate" ? `${borderWidth}px double ${design.accent_color}` : `${borderWidth}px ${borderStyle} ${design.accent_color}`;
  const bgStyle = patternBackground(
    pattern,
    design.bg_color,
    design.accent_color,
    design.accent_color_2
  );
  const showCorners = cornerStyle !== "none" && layout !== "minimal";
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      ref,
      className: "relative w-full mx-auto overflow-hidden shadow-2xl",
      style: {
        color: design.text_color,
        aspectRatio: "1.414 / 1",
        fontFamily: `'${bodyFont}', Georgia, serif`,
        border: borderCss,
        ...bgStyle
      },
      children: [
        borderStyle === "ornate" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "absolute inset-2 pointer-events-none",
            style: { border: `1px solid ${design.accent_color}88` }
          },
          void 0,
          false,
          {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
            lineNumber: 180,
            columnNumber: 9
          },
          void 0
        ),
        showCorners && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "div",
            {
              className: "absolute top-0 left-0",
              style: {
                width: "180px",
                height: "180px",
                background: design.text_color,
                clipPath: cornerStyle === "ribbon" ? "polygon(0 0, 100% 0, 80% 100%, 0 100%)" : "polygon(0 0, 100% 0, 0 100%)"
              }
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
              lineNumber: 188,
              columnNumber: 11
            },
            void 0
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "div",
            {
              className: "absolute bottom-0 right-0",
              style: {
                width: "180px",
                height: "180px",
                background: design.text_color,
                clipPath: cornerStyle === "ribbon" ? "polygon(100% 0, 100% 100%, 0 100%, 20% 0)" : "polygon(100% 0, 100% 100%, 0 100%)"
              }
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
              lineNumber: 200,
              columnNumber: 11
            },
            void 0
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "div",
            {
              className: "absolute top-2 left-2",
              style: {
                width: "120px",
                height: "120px",
                background: design.accent_color,
                opacity: 0.85,
                clipPath: cornerStyle === "ribbon" ? "polygon(0 0, 100% 0, 80% 100%, 0 100%)" : "polygon(0 0, 100% 0, 0 100%)"
              }
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
              lineNumber: 212,
              columnNumber: 11
            },
            void 0
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "div",
            {
              className: "absolute bottom-2 right-2",
              style: {
                width: "120px",
                height: "120px",
                background: design.accent_color,
                opacity: 0.85,
                clipPath: cornerStyle === "ribbon" ? "polygon(100% 0, 100% 100%, 0 100%, 20% 0)" : "polygon(100% 0, 100% 100%, 0 100%)"
              }
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
              lineNumber: 225,
              columnNumber: 11
            },
            void 0
          )
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
          lineNumber: 187,
          columnNumber: 9
        }, void 0),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "absolute z-20 top-5 right-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.18em] font-semibold shadow-sm",
            style: {
              background: design.bg_color,
              color: design.text_color,
              border: `1.5px solid ${design.accent_color}`
            },
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { style: { color: design.accent_color }, children: "Issued" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
                lineNumber: 250,
                columnNumber: 9
              }, void 0),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: ctx.date }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
                lineNumber: 251,
                columnNumber: 9
              }, void 0)
            ]
          },
          void 0,
          true,
          {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
            lineNumber: 242,
            columnNumber: 7
          },
          void 0
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative z-10 h-full flex flex-col items-center text-center px-[7%] py-[5.5%]", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3", children: [
            design.logo_url ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: design.logo_url, alt: "Logo", className: "h-12 w-12 object-contain" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
              lineNumber: 257,
              columnNumber: 13
            }, void 0) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "h-12 w-12 rounded-full grid place-items-center",
                style: { background: design.text_color, color: design.bg_color },
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Award, { className: "h-6 w-6" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
                  lineNumber: 263,
                  columnNumber: 15
                }, void 0)
              },
              void 0,
              false,
              {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
                lineNumber: 259,
                columnNumber: 13
              },
              void 0
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-left", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "text-[10px] tracking-[0.35em] uppercase font-semibold",
                  style: { color: design.accent_color },
                  children: "Learnify AI"
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
                  lineNumber: 267,
                  columnNumber: 13
                },
                void 0
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[10px] uppercase tracking-[0.2em] opacity-60", children: "Verified Achievement" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
                lineNumber: 273,
                columnNumber: 13
              }, void 0)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
              lineNumber: 266,
              columnNumber: 11
            }, void 0)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
            lineNumber: 255,
            columnNumber: 9
          }, void 0),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "h1",
            {
              className: "mt-7 font-semibold leading-tight",
              style: {
                fontSize: `clamp(${1.4 * titleSize}rem, ${3.6 * titleSize}vw, ${2.8 * titleSize}rem)`,
                color: design.text_color,
                fontFamily: `'${titleFont}', Georgia, serif`,
                letterSpacing: layout === "modern" ? "0.02em" : "0.005em"
              },
              children: design.title_text
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
              lineNumber: 279,
              columnNumber: 9
            },
            void 0
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "h-[2px] w-12", style: { background: design.accent_color } }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
              lineNumber: 291,
              columnNumber: 11
            }, void 0),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "h-1.5 w-1.5 rotate-45", style: { background: design.accent_color } }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
              lineNumber: 292,
              columnNumber: 11
            }, void 0),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "h-[2px] w-12", style: { background: design.accent_color } }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
              lineNumber: 293,
              columnNumber: 11
            }, void 0)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
            lineNumber: 290,
            columnNumber: 9
          }, void 0),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "p",
            {
              className: "mt-5 text-xs uppercase tracking-[0.28em] opacity-70",
              style: { fontSize: `${0.75 * bodySize}rem` },
              children: design.subtitle
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
              lineNumber: 296,
              columnNumber: 9
            },
            void 0
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "h2",
            {
              className: "mt-2 font-bold break-words max-w-[92%]",
              style: {
                fontSize: `clamp(${1.8 * nameSize}rem, ${5 * nameSize}vw, ${3.4 * nameSize}rem)`,
                color: design.accent_color,
                fontFamily: `'${titleFont}', Georgia, serif`,
                lineHeight: 1.1
              },
              children: ctx.name
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
              lineNumber: 302,
              columnNumber: 9
            },
            void 0
          ),
          ctx.role && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-1 text-[10px] uppercase tracking-[0.3em] opacity-70", children: ctx.role }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
            lineNumber: 314,
            columnNumber: 11
          }, void 0),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "p",
            {
              className: "mt-5 max-w-[78%] opacity-90 leading-relaxed",
              style: { fontSize: `${0.95 * bodySize}rem` },
              children: body
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
              lineNumber: 317,
              columnNumber: 9
            },
            void 0
          ),
          ctx.instructor && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-1.5 text-[11px] opacity-60 italic", children: [
            "Instructor · ",
            ctx.instructor
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
            lineNumber: 324,
            columnNumber: 11
          }, void 0),
          pct !== null && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "div",
            {
              className: "mt-4 inline-flex items-center gap-2 text-xs px-3.5 py-1 rounded-full font-semibold",
              style: {
                background: `${design.accent_color}1f`,
                color: design.text_color,
                border: `1px solid ${design.accent_color}`
              },
              children: [
                "Final score · ",
                ctx.score,
                " / ",
                ctx.total,
                " (",
                pct,
                "%)"
              ]
            },
            void 0,
            true,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
              lineNumber: 328,
              columnNumber: 11
            },
            void 0
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-auto pt-6 w-full grid grid-cols-3 gap-6 items-end text-left", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-12 flex items-end", children: design.signature_url && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: design.signature_url, alt: "Signature", className: "h-12 object-contain" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
                lineNumber: 344,
                columnNumber: 17
              }, void 0) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
                lineNumber: 342,
                columnNumber: 13
              }, void 0),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "border-t mt-1 pt-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold",
                  style: { borderColor: design.accent_color, color: design.text_color, opacity: 0.9 },
                  children: design.signatory_name
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
                  lineNumber: 347,
                  columnNumber: 13
                },
                void 0
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[9px] uppercase tracking-[0.18em] opacity-60", children: design.signatory_title }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
                lineNumber: 353,
                columnNumber: 13
              }, void 0)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
              lineNumber: 341,
              columnNumber: 11
            }, void 0),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col items-center", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "p-1.5 rounded-md",
                  style: { background: design.bg_color, border: `1px solid ${design.accent_color}55` },
                  children: ctx.qrDataUrl ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: ctx.qrDataUrl, alt: "Verify QR", className: "h-20 w-20" }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
                    lineNumber: 363,
                    columnNumber: 17
                  }, void 0) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-20 w-20 grid place-items-center opacity-40", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ShieldCheck, { className: "h-6 w-6" }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
                    lineNumber: 366,
                    columnNumber: 19
                  }, void 0) }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
                    lineNumber: 365,
                    columnNumber: 17
                  }, void 0)
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
                  lineNumber: 358,
                  columnNumber: 13
                },
                void 0
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-1.5 text-[9px] uppercase tracking-[0.22em] opacity-70", children: "Scan to verify" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
                lineNumber: 370,
                columnNumber: 13
              }, void 0),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[10px] font-mono opacity-80 break-all max-w-[140px] text-center", children: ctx.code }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
                lineNumber: 373,
                columnNumber: 13
              }, void 0)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
              lineNumber: 357,
              columnNumber: 11
            }, void 0),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-12 flex justify-end items-end", children: design.stamp_url ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: design.stamp_url, alt: "Stamp", className: "h-14 object-contain" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
                lineNumber: 380,
                columnNumber: 17
              }, void 0) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "h-14 w-14 rounded-full grid place-items-center text-[8px] uppercase tracking-widest font-bold opacity-80",
                  style: { border: `2px solid ${design.accent_color}`, color: design.accent_color },
                  children: "Verified"
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
                  lineNumber: 382,
                  columnNumber: 17
                },
                void 0
              ) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
                lineNumber: 378,
                columnNumber: 13
              }, void 0),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "border-t mt-1 pt-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold whitespace-nowrap",
                  style: { borderColor: design.accent_color, color: design.text_color, opacity: 0.9 },
                  children: "Date of Issue"
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
                  lineNumber: 390,
                  columnNumber: 13
                },
                void 0
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[11px] font-semibold", style: { color: design.accent_color }, children: ctx.date }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
                lineNumber: 396,
                columnNumber: 13
              }, void 0)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
              lineNumber: 377,
              columnNumber: 11
            }, void 0)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
            lineNumber: 340,
            columnNumber: 9
          }, void 0)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
          lineNumber: 254,
          columnNumber: 7
        }, void 0)
      ]
    },
    void 0,
    true,
    {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateDesign.tsx",
      lineNumber: 168,
      columnNumber: 5
    },
    void 0
  );
});
CertificateRender.displayName = "CertificateRender";
const MIN = 0.25;
const MAX = 2.5;
const STEP = 0.1;
function CertificateFullPreviewDialog({ open, onOpenChange, design, ctx, title }) {
  const wrapRef = reactExports.useRef(null);
  const innerRef = reactExports.useRef(null);
  const [zoom, setZoom] = reactExports.useState(1);
  const fit = () => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    const prev = inner.style.transform;
    inner.style.transform = "scale(1)";
    const w = inner.scrollWidth;
    const h = inner.scrollHeight;
    inner.style.transform = prev;
    const pad = 32;
    const sx = (wrap.clientWidth - pad) / w;
    const sy = (wrap.clientHeight - pad) / h;
    const z = Math.max(MIN, Math.min(MAX, Math.min(sx, sy)));
    setZoom(z);
  };
  reactExports.useEffect(() => {
    if (!open) return;
    const t = setTimeout(fit, 30);
    return () => clearTimeout(t);
  }, [open]);
  reactExports.useEffect(() => {
    const el = wrapRef.current;
    if (!el || !open) return;
    const onWheel = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      setZoom((z) => Math.max(MIN, Math.min(MAX, z + (e.deltaY < 0 ? STEP : -STEP))));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [open]);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { className: "max-w-[98vw] w-[98vw] h-[96vh] p-0 gap-0 flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { className: "sr-only", children: title ?? "Certificate preview" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateFullPreviewDialog.tsx",
      lineNumber: 65,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between gap-2 px-4 py-2 border-b bg-card", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-sm font-medium truncate", children: title ?? "Certificate preview" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateFullPreviewDialog.tsx",
        lineNumber: 67,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => setZoom((z) => Math.max(MIN, z - STEP)),
            "aria-label": "Zoom out",
            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ZoomOut, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateFullPreviewDialog.tsx",
              lineNumber: 75,
              columnNumber: 15
            }, this)
          },
          void 0,
          false,
          {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateFullPreviewDialog.tsx",
            lineNumber: 69,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs tabular-nums w-14 text-center text-muted-foreground", children: [
          Math.round(zoom * 100),
          "%"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateFullPreviewDialog.tsx",
          lineNumber: 77,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => setZoom((z) => Math.min(MAX, z + STEP)),
            "aria-label": "Zoom in",
            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ZoomIn, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateFullPreviewDialog.tsx",
              lineNumber: 86,
              columnNumber: 15
            }, this)
          },
          void 0,
          false,
          {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateFullPreviewDialog.tsx",
            lineNumber: 80,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: fit, "aria-label": "Fit to screen", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Maximize2, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateFullPreviewDialog.tsx",
            lineNumber: 89,
            columnNumber: 15
          }, this),
          " Fit"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateFullPreviewDialog.tsx",
          lineNumber: 88,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: () => setZoom(1), "aria-label": "Reset zoom", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefreshCcw, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateFullPreviewDialog.tsx",
            lineNumber: 92,
            columnNumber: 15
          }, this),
          " 100%"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateFullPreviewDialog.tsx",
          lineNumber: 91,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateFullPreviewDialog.tsx",
        lineNumber: 68,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateFullPreviewDialog.tsx",
      lineNumber: 66,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      "div",
      {
        ref: wrapRef,
        className: "flex-1 overflow-auto bg-[radial-gradient(circle_at_1px_1px,_hsl(var(--muted))_1px,_transparent_0)] [background-size:18px_18px]",
        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-max min-h-max p-6 flex items-start justify-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            ref: innerRef,
            style: {
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              width: "1123px"
              // A4 landscape @ ~96dpi
            },
            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CertificateRender, { design, ctx }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateFullPreviewDialog.tsx",
              lineNumber: 109,
              columnNumber: 15
            }, this)
          },
          void 0,
          false,
          {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateFullPreviewDialog.tsx",
            lineNumber: 101,
            columnNumber: 13
          },
          this
        ) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateFullPreviewDialog.tsx",
          lineNumber: 100,
          columnNumber: 11
        }, this)
      },
      void 0,
      false,
      {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateFullPreviewDialog.tsx",
        lineNumber: 96,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 py-2 text-[11px] text-muted-foreground border-t bg-muted/30", children: "Tip: hold Ctrl/⌘ and scroll to zoom. Drag the scrollbars or trackpad to pan." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateFullPreviewDialog.tsx",
      lineNumber: 113,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateFullPreviewDialog.tsx",
    lineNumber: 64,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CertificateFullPreviewDialog.tsx",
    lineNumber: 63,
    columnNumber: 5
  }, this);
}
export {
  BACKGROUND_PATTERNS as B,
  CertificateRender as C,
  DEFAULT_DESIGN as D,
  FONT_OPTIONS as F,
  LAYOUTS as L,
  CertificateFullPreviewDialog as a,
  BORDER_STYLES as b,
  CORNER_STYLES as c
};
