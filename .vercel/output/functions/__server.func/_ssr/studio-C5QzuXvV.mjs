import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { r as runAiTool } from "./ai-tools.functions-BcVu6Syx.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BR3wbl1z.mjs";
import { b as createServerFn } from "./server-BLOOEPZP.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BVm8xUae.mjs";
import { v as verifyYoutubeKey, s as startCourseEnrichment, l as listCourseEnrichmentRuns, E as EnrichmentProgressDialog } from "./EnrichmentProgressDialog-Dn6uxaSe.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-CV-3vits.mjs";
import { B as Button, c as cn } from "./button-s-7T9USx.mjs";
import { L as Label } from "./label-Dmhuxdmf.mjs";
import { I as Input$2 } from "./input-BHvIASyb.mjs";
import { R as Root, T as Track, a as Range, b as Thumb } from "../_libs/radix-ui__react-slider.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as AppShell } from "./AppShell-BXcQmjDj.mjs";
import { u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import { b as buildCourseVideoEmbedUrl } from "./course-player-MW9-dEKE.mjs";
import { T as Textarea } from "./textarea-7FPcqnpF.mjs";
import { B as Badge } from "./badge-LGfgVerF.mjs";
import { S as Switch } from "./switch-DyY6BxUU.mjs";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dn0qHyRx.mjs";
import "../_libs/seroval.mjs";
import { ak as ShieldAlert, n as Search, Q as WandSparkles, aa as Plus, L as LoaderCircle, al as Video, am as ClipboardList, O as FileCheckCorner, B as Brain, an as Pencil, ah as Trash2, ao as Link2, ap as Copy, aq as Upload, k as Sparkles, ar as Scissors, as as TriangleAlert, at as History, au as RotateCcw, d as BookOpen, av as ArrowLeft, ai as ExternalLink, aj as Paperclip, aw as Image$1, c as Check, b as CircleCheck, ax as Youtube } from "../_libs/lucide-react.mjs";
import { f as format } from "../_libs/date-fns.mjs";
import { o as objectType, s as stringType, n as numberType, e as enumType, b as booleanType, c as anyType } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./progress-BdEZ1sO8.mjs";
import "../_libs/radix-ui__react-progress.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "./scroll-area-ejh7i3q4.mjs";
import "../_libs/radix-ui__react-scroll-area.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "./ThemeToggle-DNuVEMie.mjs";
import "./learnify-logo-CyXPmSny.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/use-sync-external-store.mjs";
import "./client.server-BbcUHF3e.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
const Input$1 = objectType({
  topic: stringType().min(2).max(300),
  level: enumType(["Beginner", "Intermediate", "Advanced"]).default("Beginner"),
  audience: stringType().max(300).optional(),
  modules: numberType().int().min(2).max(8).default(4),
  category: stringType().max(100).default("General")
});
const generateFullCourse = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => Input$1.parse(d)).handler(createSsrRpc("0fe497f84feaa9c26289e06c5d010fd10007bd792c5b4f317356ad7ef5df9201"));
const Materialize = objectType({
  blueprint: anyType(),
  price_inr: numberType().min(0).default(0),
  instructor: stringType().max(120).default("Learnify AI"),
  published: booleanType().default(false)
});
const materializeCourse = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => Materialize.parse(d)).handler(createSsrRpc("53f06c97cbe7e94e3c1ce694ee7711927e617b2e4f4daa837d1aed57029f5e43"));
const Input = objectType({
  prompt: stringType().min(3).max(2e3),
  size: enumType(["1024x1024", "1536x1024", "1024x1536"]).default("1536x1024")
});
function checkThumbnailPromptSafety(prompt) {
  const p = prompt.toLowerCase();
  const banned = [
    "nude",
    "nudity",
    "naked",
    "porn",
    "sexual",
    "nsfw",
    "explicit",
    "gore",
    "blood splatter",
    "violence against",
    "kill ",
    "swastika",
    "nazi",
    "isis",
    "terror",
    // common copyrighted IPs that AI image providers reject
    "marvel",
    "disney",
    "pixar",
    "nintendo",
    "pokemon",
    "mickey mouse",
    "iron man",
    "spiderman",
    "spider-man",
    "batman",
    "superman",
    "harry potter",
    "star wars"
  ];
  const hit = banned.find((b) => p.includes(b));
  if (hit) return `Prompt contains restricted content ("${hit.trim()}"). Try a descriptive non-IP variant.`;
  if (prompt.trim().length < 8) return "Prompt is too short. Add a few descriptive words.";
  return null;
}
const generateCourseThumbnail = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => Input.parse(data)).handler(createSsrRpc("52e8b3a8374cfc4c7f341db1275eccec848f905cddd81b72ce7910e92d6ebb98"));
const THUMBNAIL_STYLES = [{
  id: "bold",
  label: "Bold & Modern",
  hint: "vibrant gradient, large bold typography, high contrast"
}, {
  id: "minimal",
  label: "Minimal Clean",
  hint: "white background, thin sans-serif type, subtle accent shape"
}, {
  id: "tech",
  label: "Tech / Dev",
  hint: "dark navy background, neon accents, code/glow motif"
}, {
  id: "education",
  label: "Education",
  hint: "warm pastel, friendly illustration, classroom feel"
}, {
  id: "playful",
  label: "Playful",
  hint: "bright colors, geometric shapes, fun rounded type"
}, {
  id: "luxury",
  label: "Premium",
  hint: "deep black with gold accents, serif type, elegant"
}];
function buildThumbnailPrompt(opts) {
  const style = THUMBNAIL_STYLES.find((s) => s.id === opts.style) ?? THUMBNAIL_STYLES[0];
  const parts = [`Course thumbnail (1536x1024, social-share friendly) for an online course titled "${opts.title}".`, opts.category ? `Category: ${opts.category}.` : "", opts.description ? `About: ${opts.description.slice(0, 300)}.` : "", opts.lessonHint ? `First lesson theme: ${opts.lessonHint.slice(0, 240)}.` : "", `Style: ${style.label} — ${style.hint}.`, opts.colors ? `Color palette hint: ${opts.colors}.` : "", `Render the title text "${opts.title}" prominently and legibly. No watermark, no logos, no copyrighted IP, no real faces.`, opts.customNotes ? `Extra direction: ${opts.customNotes}` : ""];
  return parts.filter(Boolean).join(" ");
}
function parseSizeKey(s) {
  const [w, h] = s.split("x").map(Number);
  return {
    w,
    h,
    ratio: w / h
  };
}
const MIN_THUMBNAIL_WIDTH = 800;
const MIN_THUMBNAIL_HEIGHT = 600;
const ASPECT_TOLERANCE = 0.08;
async function validateThumbnailImage(src, expected) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const w = img.naturalWidth, h = img.naturalHeight;
      if (w < MIN_THUMBNAIL_WIDTH || h < MIN_THUMBNAIL_HEIGHT) {
        return resolve({
          ok: false,
          width: w,
          height: h,
          message: `Image is too small (${w}×${h}). Minimum ${MIN_THUMBNAIL_WIDTH}×${MIN_THUMBNAIL_HEIGHT}.`
        });
      }
      if (expected) {
        const target = parseSizeKey(expected);
        const ratio = w / h;
        const diff = Math.abs(ratio - target.ratio) / target.ratio;
        if (diff > ASPECT_TOLERANCE) {
          return resolve({
            ok: false,
            width: w,
            height: h,
            message: `Aspect ratio doesn't match ${expected} (got ${w}×${h}). Use the inline editor to crop.`
          });
        }
      }
      resolve({
        ok: true,
        width: w,
        height: h
      });
    };
    img.onerror = () => resolve({
      ok: false,
      width: 0,
      height: 0,
      message: "Image failed to load."
    });
    img.src = src;
  });
}
const Slider = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Root,
  {
    ref,
    className: cn("relative flex w-full touch-none select-none items-center", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Track, { className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Range, { className: "absolute h-full bg-primary" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/slider.tsx",
        lineNumber: 16,
        columnNumber: 7
      }, void 0) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/slider.tsx",
        lineNumber: 15,
        columnNumber: 5
      }, void 0),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Thumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/slider.tsx",
        lineNumber: 18,
        columnNumber: 5
      }, void 0)
    ]
  },
  void 0,
  true,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/slider.tsx",
    lineNumber: 10,
    columnNumber: 3
  },
  void 0
));
Slider.displayName = Root.displayName;
const THEMES = [
  { id: "none", label: "None", color: "transparent" },
  { id: "indigo", label: "Indigo", color: "#4f46e5" },
  { id: "emerald", label: "Emerald", color: "#059669" },
  { id: "amber", label: "Amber", color: "#d97706" },
  { id: "rose", label: "Rose", color: "#e11d48" },
  { id: "noir", label: "Noir", color: "#0a0a0a" }
];
function ThumbnailEditor({
  open,
  onClose,
  image,
  targetWidth = 1536,
  targetHeight = 1024,
  onApply
}) {
  const canvasRef = reactExports.useRef(null);
  const [img, setImg] = reactExports.useState(null);
  const [zoom, setZoom] = reactExports.useState(1);
  const [offsetX, setOffsetX] = reactExports.useState(0);
  const [offsetY, setOffsetY] = reactExports.useState(0);
  const [text, setText] = reactExports.useState("");
  const [textColor, setTextColor] = reactExports.useState("#ffffff");
  const [fontSize, setFontSize] = reactExports.useState(96);
  const [theme, setTheme] = reactExports.useState("none");
  const [tintOpacity, setTintOpacity] = reactExports.useState(0.25);
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!open || !image) {
      setImg(null);
      return;
    }
    setLoading(true);
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => {
      setImg(i);
      setLoading(false);
    };
    i.onerror = () => {
      setLoading(false);
    };
    i.src = image;
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
    setText("");
    setTheme("none");
  }, [open, image]);
  reactExports.useEffect(() => {
    const c = canvasRef.current;
    if (!c || !img) return;
    c.width = targetWidth;
    c.height = targetHeight;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const scale = Math.max(targetWidth / img.width, targetHeight / img.height) * zoom;
    const dw = img.width * scale;
    const dh = img.height * scale;
    const slackX = Math.max(0, dw - targetWidth) / 2;
    const slackY = Math.max(0, dh - targetHeight) / 2;
    const dx = (targetWidth - dw) / 2 + offsetX / 100 * slackX;
    const dy = (targetHeight - dh) / 2 + offsetY / 100 * slackY;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    try {
      ctx.drawImage(img, dx, dy, dw, dh);
    } catch {
    }
    const t = THEMES.find((x) => x.id === theme);
    if (t && t.color !== "transparent") {
      ctx.fillStyle = t.color;
      ctx.globalAlpha = tintOpacity;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.globalAlpha = 1;
    }
    if (text.trim()) {
      ctx.font = `700 ${fontSize}px Inter, system-ui, sans-serif`;
      ctx.textBaseline = "bottom";
      ctx.textAlign = "left";
      const padding = 60;
      ctx.shadowColor = "rgba(0,0,0,0.55)";
      ctx.shadowBlur = 18;
      ctx.fillStyle = textColor;
      const maxW = targetWidth - padding * 2;
      const words = text.split(/\s+/);
      const lines = [];
      let line = "";
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (ctx.measureText(test).width > maxW && line) {
          lines.push(line);
          line = w;
        } else line = test;
      }
      if (line) lines.push(line);
      let y = targetHeight - padding;
      for (let i = lines.length - 1; i >= 0; i--) {
        ctx.fillText(lines[i], padding, y);
        y -= fontSize * 1.1;
      }
      ctx.shadowBlur = 0;
    }
  }, [
    img,
    zoom,
    offsetX,
    offsetY,
    text,
    textColor,
    fontSize,
    theme,
    tintOpacity,
    targetWidth,
    targetHeight
  ]);
  function apply() {
    const c = canvasRef.current;
    if (!c) return;
    try {
      const url = c.toDataURL("image/jpeg", 0.9);
      onApply(url);
      onClose();
    } catch (e) {
      alert(
        "This image is on a remote host that blocks editing. Upload the file first, then edit."
      );
    }
  }
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { className: "max-w-3xl max-h-[92vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Scissors, { className: "h-4 w-4 text-primary" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
          lineNumber: 178,
          columnNumber: 13
        }, this),
        " Inline thumbnail editor"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
        lineNumber: 177,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: "Adjust crop & position, drop in title text, and apply a color theme." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
        lineNumber: 180,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
      lineNumber: 176,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-md border bg-muted overflow-hidden", children: loading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "aspect-[3/2] grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
        lineNumber: 188,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
        lineNumber: 187,
        columnNumber: 15
      }, this) : !img ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "aspect-[3/2] grid place-items-center text-sm text-muted-foreground", children: "No image" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
        lineNumber: 191,
        columnNumber: 15
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("canvas", { ref: canvasRef, className: "w-full h-auto" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
        lineNumber: 195,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
        lineNumber: 185,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: [
            "Zoom (",
            zoom.toFixed(2),
            "×)"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
            lineNumber: 201,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Slider,
            {
              min: 1,
              max: 3,
              step: 0.05,
              value: [zoom],
              onValueChange: ([v]) => setZoom(v)
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
              lineNumber: 202,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "Horizontal" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
            lineNumber: 209,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Slider,
            {
              min: -100,
              max: 100,
              step: 1,
              value: [offsetX],
              onValueChange: ([v]) => setOffsetX(v)
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
              lineNumber: 210,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "Vertical" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
            lineNumber: 217,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Slider,
            {
              min: -100,
              max: 100,
              step: 1,
              value: [offsetY],
              onValueChange: ([v]) => setOffsetY(v)
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
              lineNumber: 218,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
          lineNumber: 200,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "Overlay text" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
            lineNumber: 227,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Input$2,
            {
              value: text,
              onChange: (e) => setText(e.target.value),
              placeholder: "Course title…",
              maxLength: 80
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
              lineNumber: 228,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex gap-2 items-end", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "Text color" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
                lineNumber: 236,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Input$2,
                {
                  type: "color",
                  value: textColor,
                  onChange: (e) => setTextColor(e.target.value),
                  className: "h-9 p-1"
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
                  lineNumber: 237,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
              lineNumber: 235,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "Font size" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
                lineNumber: 245,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Input$2,
                {
                  type: "number",
                  min: 24,
                  max: 220,
                  value: fontSize,
                  onChange: (e) => setFontSize(Number(e.target.value) || 96)
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
                  lineNumber: 246,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
              lineNumber: 244,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
            lineNumber: 234,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "Color theme" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
            lineNumber: 255,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex gap-1.5 flex-wrap", children: THEMES.map((t) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "button",
            {
              type: "button",
              onClick: () => setTheme(t.id),
              className: `h-7 px-2 rounded-md border text-xs flex items-center gap-1.5 ${theme === t.id ? "border-primary bg-primary/5" : "hover:bg-accent"}`,
              children: [
                t.color !== "transparent" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "h-3 w-3 rounded-full", style: { background: t.color } }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
                  lineNumber: 265,
                  columnNumber: 23
                }, this),
                t.label
              ]
            },
            t.id,
            true,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
              lineNumber: 258,
              columnNumber: 19
            },
            this
          )) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
            lineNumber: 256,
            columnNumber: 15
          }, this),
          theme !== "none" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "Tint strength" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
              lineNumber: 273,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Slider,
              {
                min: 0,
                max: 0.7,
                step: 0.05,
                value: [tintOpacity],
                onValueChange: ([v]) => setTintOpacity(v)
              },
              void 0,
              false,
              {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
                lineNumber: 274,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
            lineNumber: 272,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
          lineNumber: 226,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
        lineNumber: 199,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
      lineNumber: 184,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: onClose, children: "Cancel" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
        lineNumber: 287,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: apply, disabled: !img, children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Check, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
          lineNumber: 291,
          columnNumber: 13
        }, this),
        " Apply"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
        lineNumber: 290,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
      lineNumber: 286,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
    lineNumber: 175,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThumbnailEditor.tsx",
    lineNumber: 174,
    columnNumber: 5
  }, this);
}
const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
const courseUrlForSlug = (slug) => {
  const path = `/courses/${slug || "my-course"}`;
  return typeof window === "undefined" ? path : `${window.location.origin}${path}`;
};
const validateLessonVideoUrl = (value) => {
  const result = buildCourseVideoEmbedUrl(value);
  return result.ok ? null : result.message;
};
async function getCourseVideoIssues(courseId) {
  const {
    data,
    error
  } = await supabase.from("lessons").select("id, title, video_url").eq("course_id", courseId).order("order_index", {
    ascending: true
  });
  if (error) throw error;
  return (data ?? []).map((lesson) => ({
    ...lesson,
    error: validateLessonVideoUrl(lesson.video_url ?? "")
  })).filter((lesson) => lesson.error);
}
function StudioPage() {
  const {
    user,
    isAdmin,
    isCreator,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [search, setSearch] = reactExports.useState("");
  const [editing, setEditing] = reactExports.useState(null);
  const [creating, setCreating] = reactExports.useState(false);
  const [deletingCourse, setDeletingCourse] = reactExports.useState(null);
  const [manageLessonsFor, setManageLessonsFor] = reactExports.useState(null);
  const [manageMcqFor, setManageMcqFor] = reactExports.useState(null);
  const [manageAssignFor, setManageAssignFor] = reactExports.useState(null);
  const [reviewSubFor, setReviewSubFor] = reactExports.useState(null);
  const [aiBuilderOpen, setAiBuilderOpen] = reactExports.useState(false);
  const coursesQuery = useQuery({
    enabled: isCreator,
    queryKey: ["studio-courses"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("courses").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const filtered = reactExports.useMemo(() => {
    const s = search.toLowerCase().trim();
    return (coursesQuery.data ?? []).filter((c) => !s || c.title.toLowerCase().includes(s) || c.category.toLowerCase().includes(s) || c.instructor.toLowerCase().includes(s));
  }, [coursesQuery.data, search]);
  if (!loading && !isCreator) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-h-[60vh] grid place-items-center p-10 text-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ShieldAlert, { className: "h-10 w-10 mx-auto text-destructive" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 113,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "mt-4 text-2xl font-display font-semibold", children: "Studio is restricted" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 114,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-2 text-muted-foreground", children: "Only approved creators and admins can publish courses." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 115,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { className: "mt-6", onClick: () => navigate({
        to: "/apply-creator"
      }), children: "Apply to Creator Program" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 118,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 112,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 111,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 110,
      columnNumber: 12
    }, this);
  }
  async function deleteCourse() {
    if (!deletingCourse) return;
    const {
      error
    } = await supabase.from("courses").delete().eq("id", deletingCourse.id);
    if (error) return toast.error(error.message);
    toast.success("Course deleted");
    setDeletingCourse(null);
    qc.invalidateQueries({
      queryKey: ["studio-courses"]
    });
  }
  async function togglePublish(c) {
    if (!c.published) {
      try {
        const issues = await getCourseVideoIssues(c.id);
        if (issues.length) {
          setManageLessonsFor(c);
          return toast.error(`Fix ${issues.length} lesson video URL${issues.length === 1 ? "" : "s"} before publishing.`);
        }
      } catch (e) {
        return toast.error(e?.message ?? "Could not validate lesson videos");
      }
    }
    const {
      error
    } = await supabase.from("courses").update({
      published: !c.published
    }).eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success(c.published ? "Unpublished" : "Published");
    qc.invalidateQueries({
      queryKey: ["studio-courses"]
    });
  }
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 md:px-10 py-8 max-w-7xl", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-end justify-between gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs uppercase tracking-widest text-primary font-medium", children: "Creator Studio" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 166,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "mt-1 text-2xl md:text-3xl font-display font-semibold", children: "Courses" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 169,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-muted-foreground text-sm mt-1", children: "Create, edit, and publish your catalog." }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 170,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 165,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Search, { className: "h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 176,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search courses…", className: "pl-9 w-56" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 177,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 175,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: () => setAiBuilderOpen(true), children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(WandSparkles, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 180,
              columnNumber: 15
            }, this),
            " My AI Course"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 179,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: () => {
            setEditing(null);
            setCreating(true);
          }, children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Plus, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 186,
              columnNumber: 15
            }, this),
            " New course"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 182,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 174,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 164,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 rounded-2xl border bg-card shadow-card overflow-hidden", children: coursesQuery.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-10 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 193,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 192,
        columnNumber: 37
      }, this) : filtered.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-10 text-center text-sm text-muted-foreground", children: "No courses yet. Create your first one." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 194,
        columnNumber: 46
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("thead", { className: "bg-muted/40 text-xs uppercase text-muted-foreground", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tr", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-4 md:px-6 py-3", children: "Title" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 200,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-4 md:px-6 py-3", children: "Category" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 201,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-4 md:px-6 py-3", children: "Level" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 202,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-right px-4 md:px-6 py-3", children: "Price" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 203,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-4 md:px-6 py-3", children: "Published" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 204,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-4 md:px-6 py-3", children: "Created" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 205,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "px-4 md:px-6 py-3 text-right", children: "Actions" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 206,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 199,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 198,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tbody", { children: filtered.map((c) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tr", { className: "border-t hover:bg-accent/30", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 md:px-6 py-3 font-medium", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: c.title }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 212,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground", children: c.slug }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 213,
              columnNumber: 25
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 211,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 md:px-6 py-3", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "secondary", className: "text-[10px]", children: c.category }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 216,
            columnNumber: 25
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 215,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 md:px-6 py-3 text-xs", children: c.level }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 220,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 md:px-6 py-3 text-right font-medium", children: c.price_inr > 0 ? `₹${c.price_inr}` : "Free" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 221,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 md:px-6 py-3", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Switch, { checked: c.published, onCheckedChange: () => togglePublish(c) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 225,
            columnNumber: 25
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 224,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 md:px-6 py-3 text-xs text-muted-foreground", children: format(new Date(c.created_at), "dd-MM-yyyy") }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 227,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 md:px-6 py-3 text-right", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-1 justify-end flex-wrap", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "ghost", onClick: () => setManageLessonsFor(c), children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Video, { className: "h-4 w-4" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
                lineNumber: 233,
                columnNumber: 29
              }, this),
              " Lessons"
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 232,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "ghost", onClick: () => setManageAssignFor(c), children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ClipboardList, { className: "h-4 w-4" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
                lineNumber: 236,
                columnNumber: 29
              }, this),
              " Assign."
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 235,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "ghost", onClick: () => setReviewSubFor(c), children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(FileCheckCorner, { className: "h-4 w-4" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
                lineNumber: 239,
                columnNumber: 29
              }, this),
              " Subs"
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 238,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "ghost", onClick: () => setManageMcqFor(c), children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Brain, { className: "h-4 w-4" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
                lineNumber: 242,
                columnNumber: 29
              }, this),
              " Test"
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 241,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "ghost", onClick: () => {
              setCreating(false);
              setEditing(c);
            }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Pencil, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 248,
              columnNumber: 29
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 244,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "ghost", className: "text-destructive hover:text-destructive", onClick: () => setDeletingCourse(c), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trash2, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 251,
              columnNumber: 29
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 250,
              columnNumber: 27
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 231,
            columnNumber: 25
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 230,
            columnNumber: 23
          }, this)
        ] }, c.id, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 210,
          columnNumber: 38
        }, this)) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 209,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 197,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 196,
        columnNumber: 22
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 191,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 163,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CourseFormDialog, { open: creating || !!editing, onClose: () => {
      setCreating(false);
      setEditing(null);
    }, course: editing, userId: user?.id ?? null, onSaved: () => qc.invalidateQueries({
      queryKey: ["studio-courses"]
    }) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 262,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LessonsDialog, { course: manageLessonsFor, onClose: () => setManageLessonsFor(null) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 269,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(McqDialog, { course: manageMcqFor, onClose: () => setManageMcqFor(null) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 271,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AssignmentsManagerDialog, { course: manageAssignFor, onClose: () => setManageAssignFor(null) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 273,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SubmissionsReviewDialog, { course: reviewSubFor, onClose: () => setReviewSubFor(null) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 275,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AiBuilderDialog, { open: aiBuilderOpen, onClose: () => setAiBuilderOpen(false), onCreated: () => {
      setAiBuilderOpen(false);
      qc.invalidateQueries({
        queryKey: ["studio-courses"]
      });
    } }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 277,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialog, { open: !!deletingCourse, onOpenChange: (o) => !o && setDeletingCourse(null), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogTitle, { children: "Delete this course?" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 287,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogDescription, { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("b", { children: deletingCourse?.title }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 289,
            columnNumber: 15
          }, this),
          " and its lessons will be permanently removed."
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 288,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 286,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogCancel, { children: "Cancel" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 293,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogAction, { onClick: deleteCourse, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Delete" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 294,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 292,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 285,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 284,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
    lineNumber: 162,
    columnNumber: 10
  }, this);
}
function CourseFormDialog({
  open,
  onClose,
  course,
  userId,
  onSaved
}) {
  const navigate = useNavigate();
  const [title, setTitle] = reactExports.useState("");
  const [slug, setSlug] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("General");
  const [level, setLevel] = reactExports.useState("Beginner");
  const [price, setPrice] = reactExports.useState(0);
  const [instructor, setInstructor] = reactExports.useState("Learnify AI");
  const [duration, setDuration] = reactExports.useState(0);
  const [coverUrl, setCoverUrl] = reactExports.useState("");
  const [published, setPublished] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [coverFailed, setCoverFailed] = reactExports.useState(false);
  const [aiThumbOpen, setAiThumbOpen] = reactExports.useState(false);
  const [editorOpen, setEditorOpen] = reactExports.useState(false);
  const [history, setHistory] = reactExports.useState([]);
  const historyKey = `thumb-history:${course?.id ?? "new"}`;
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      setHistory(JSON.parse(localStorage.getItem(historyKey) || "[]"));
    } catch {
      setHistory([]);
    }
  }, [historyKey, open]);
  function pushHistory(url) {
    if (!url) return;
    setHistory((prev) => {
      const next = [url, ...prev.filter((u) => u !== url)].slice(0, 8);
      try {
        localStorage.setItem(historyKey, JSON.stringify(next));
      } catch {
      }
      return next;
    });
  }
  async function applyCoverFromSource(url, opts) {
    if (!opts?.skipValidate) {
      const check = await validateThumbnailImage(url, opts?.expected ?? null);
      if (!check.ok) {
        toast.warning(check.message || "Thumbnail validation warning");
      } else {
        toast.success(`Thumbnail ${check.width}×${check.height} ✓`);
      }
    }
    setCoverFailed(false);
    setCoverUrl(url);
    pushHistory(url);
  }
  reactExports.useEffect(() => {
    if (course) {
      setTitle(course.title);
      setSlug(course.slug);
      setDescription(course.description ?? "");
      setCategory(course.category);
      setLevel(course.level);
      setPrice(Number(course.price_inr));
      setInstructor(course.instructor);
      setDuration(course.duration_minutes);
      setCoverUrl(course.cover_url ?? "");
      setPublished(course.published);
    } else {
      setTitle("");
      setSlug("");
      setDescription("");
      setCategory("General");
      setLevel("Beginner");
      setPrice(0);
      setInstructor("Learnify AI");
      setDuration(0);
      setCoverUrl("");
      setPublished(false);
    }
    setCoverFailed(false);
  }, [course, open]);
  async function save() {
    if (!title.trim()) return toast.error("Title required");
    const finalSlug = slugify(slug.trim() || title);
    if (!finalSlug) return toast.error("Add a valid course URL slug");
    if (published && coverUrl.trim() && coverFailed) return toast.error("Cover image is not visible. Replace the image URL before publishing.");
    if (published && !course) return toast.error("Create the course as draft first, then add lessons with valid videos before publishing.");
    if (published && course) {
      try {
        const issues = await getCourseVideoIssues(course.id);
        if (issues.length) return toast.error(`Fix ${issues.length} lesson video URL${issues.length === 1 ? "" : "s"} before publishing.`);
      } catch (e) {
        return toast.error(e?.message ?? "Could not validate lesson videos");
      }
    }
    setSaving(true);
    const payload = {
      title: title.trim(),
      slug: finalSlug,
      description: description.trim() || null,
      category: category.trim() || "General",
      level: level.trim() || "Beginner",
      price_inr: Number(price) || 0,
      instructor: instructor.trim() || "Learnify AI",
      duration_minutes: Number(duration) || 0,
      cover_url: coverUrl.trim() || null,
      published
    };
    if (course) {
      const {
        error
      } = await supabase.from("courses").update(payload).eq("id", course.id);
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Course updated");
      onSaved();
      onClose();
      return;
    }
    const {
      data: createdCourse,
      error: insertErr
    } = await supabase.from("courses").insert({
      ...payload,
      created_by: userId
    }).select("id,slug").single();
    setSaving(false);
    if (insertErr) return toast.error(insertErr.message);
    toast.success("Course created");
    onSaved();
    onClose();
    try {
      if (createdCourse?.slug) navigate({
        to: "/courses/$slug",
        params: {
          slug: createdCourse.slug
        }
      });
    } catch {
    }
  }
  async function copyCourseUrl() {
    await navigator.clipboard?.writeText(courseUrlForSlug(slugify(slug || title)));
    toast.success("Course URL copied");
  }
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { children: course ? "Edit course" : "New course" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 467,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: "Course details — visible to learners when published." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 468,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 466,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid gap-4 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5 sm:col-span-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Title" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 474,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { value: title, onChange: (e) => {
          setTitle(e.target.value);
          if (!course && !slug) setSlug(slugify(e.target.value));
        }, maxLength: 120 }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 475,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 473,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Slug" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 481,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { value: slug, onChange: (e) => setSlug(slugify(e.target.value)), maxLength: 80, placeholder: "my-course-name" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 483,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "button", variant: "secondary", onClick: () => setSlug(slugify(title)), disabled: !title.trim(), children: "Generate" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 484,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 482,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 rounded-md border bg-muted/40 px-2.5 py-2 text-[11px]", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link2, { className: "h-3.5 w-3.5 text-primary shrink-0" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 489,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { href: courseUrlForSlug(slugify(slug || title)), target: "_blank", rel: "noreferrer", className: "font-mono text-primary hover:underline truncate", children: courseUrlForSlug(slugify(slug || title)) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 490,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "button", size: "icon", variant: "ghost", className: "h-7 w-7 shrink-0", onClick: copyCourseUrl, "aria-label": "Copy course URL", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Copy, { className: "h-3.5 w-3.5" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 494,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 493,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 488,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-muted-foreground", children: "Lowercase letters, numbers, and dashes only. Confirm this URL before saving." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 497,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 480,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Category" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 502,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { value: category, onChange: (e) => setCategory(e.target.value), maxLength: 50 }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 503,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 501,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Level" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 506,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { value: level, onChange: (e) => setLevel(e.target.value), maxLength: 30, placeholder: "Beginner/Intermediate/Advanced" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 507,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 505,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Price (INR)" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 510,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { type: "number", min: 0, value: price, onChange: (e) => setPrice(Number(e.target.value)) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 511,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 509,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Instructor" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 514,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { value: instructor, onChange: (e) => setInstructor(e.target.value), maxLength: 80 }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 515,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 513,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Duration (mins)" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 518,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { type: "number", min: 0, value: duration, onChange: (e) => setDuration(Number(e.target.value)) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 519,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 517,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5 sm:col-span-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Cover image / Thumbnail" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 522,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { value: coverUrl, onChange: (e) => {
            setCoverUrl(e.target.value);
            setCoverFailed(false);
          }, placeholder: "Paste image URL, upload, or generate with AI", className: "min-w-[180px] flex-1" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 524,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "inline-flex items-center gap-1.5 rounded-md border bg-secondary px-3 text-sm font-medium hover:bg-secondary/80 cursor-pointer", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Upload, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 529,
              columnNumber: 17
            }, this),
            " Upload",
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("input", { type: "file", accept: "image/*", className: "hidden", onChange: async (e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (!f) return;
              if (f.size > 8 * 1024 * 1024) return toast.error("Image too large (max 8MB)");
              try {
                const dataUrl = await resizeImageToDataUrl(f, 1536, 0.85);
                await applyCoverFromSource(dataUrl, {
                  expected: "1536x1024"
                });
              } catch (err) {
                toast.error(err?.message ?? "Could not read image");
              }
            } }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 530,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 528,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "button", variant: "secondary", onClick: () => setAiThumbOpen(true), children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 546,
              columnNumber: 17
            }, this),
            " AI Thumbnail"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 545,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "button", variant: "outline", onClick: () => setEditorOpen(true), disabled: !coverUrl, children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Scissors, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 549,
              columnNumber: 17
            }, this),
            " Edit"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 548,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "button", variant: "ghost", onClick: async () => {
            const seed = encodeURIComponent((title || category || "learning").trim().toLowerCase().replace(/\s+/g, "-"));
            await applyCoverFromSource(`https://picsum.photos/seed/${seed}/1536/1024`, {
              expected: "1536x1024"
            });
          }, children: "Quick stock" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 551,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 523,
          columnNumber: 13
        }, this),
        coverUrl && !coverFailed ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-2 overflow-hidden rounded-md border bg-muted", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: coverUrl, alt: "Cover preview", className: "w-full max-h-48 object-cover", onLoad: () => setCoverFailed(false), onError: () => setCoverFailed(true) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 562,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 561,
          columnNumber: 41
        }, this) : coverFailed ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-destructive flex items-center gap-1", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TriangleAlert, { className: "h-3 w-3" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 564,
            columnNumber: 17
          }, this),
          " Cover image is not loading. Replace the URL before publishing."
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 563,
          columnNumber: 38
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-muted-foreground", children: "Tip: 1536×1024 (or 1200×630) works best on cards and social shares." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 566,
          columnNumber: 22
        }, this),
        history.length > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-2 rounded-lg border bg-muted/30 p-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between mb-1.5", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[11px] font-medium flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(History, { className: "h-3 w-3" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
                lineNumber: 573,
                columnNumber: 21
              }, this),
              " Version history (",
              history.length,
              ")"
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 572,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { type: "button", className: "text-[10px] text-muted-foreground hover:text-destructive", onClick: () => {
              try {
                localStorage.removeItem(historyKey);
              } catch {
              }
              setHistory([]);
            }, children: "Clear" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 575,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 571,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex gap-1.5 overflow-x-auto pb-1", children: history.map((u, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative shrink-0 group", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: u, alt: `v${i + 1}`, className: "h-14 w-24 object-cover rounded-md border" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 586,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { type: "button", onClick: () => {
              setCoverFailed(false);
              setCoverUrl(u);
              toast.success(`Reverted to v${i + 1}`);
            }, className: "absolute inset-0 grid place-items-center bg-black/60 text-white text-[10px] opacity-0 group-hover:opacity-100 rounded-md transition", title: "Revert to this version", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RotateCcw, { className: "h-3 w-3" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
                lineNumber: 593,
                columnNumber: 27
              }, this),
              " Revert"
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 592,
              columnNumber: 25
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 587,
              columnNumber: 23
            }, this)
          ] }, i, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 585,
            columnNumber: 42
          }, this)) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 584,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 570,
          columnNumber: 36
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AiThumbnailDialog, { open: aiThumbOpen, onClose: () => setAiThumbOpen(false), courseId: course?.id ?? null, defaultTitle: title, defaultCategory: category, defaultDescription: description, onApply: async (url) => {
          await applyCoverFromSource(url, {
            expected: "1536x1024",
            skipValidate: false
          });
          setAiThumbOpen(false);
        } }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 600,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ThumbnailEditor, { open: editorOpen, onClose: () => setEditorOpen(false), image: coverUrl || null, onApply: (url) => applyCoverFromSource(url, {
          skipValidate: true
        }) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 607,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 521,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5 sm:col-span-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Description" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 612,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Textarea, { rows: 4, maxLength: 1e3, value: description, onChange: (e) => setDescription(e.target.value) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 613,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 611,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 sm:col-span-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Switch, { checked: published, onCheckedChange: setPublished }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 616,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "!m-0", children: "Published" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 617,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 615,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 472,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: onClose, disabled: saving, children: "Cancel" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 621,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: save, disabled: saving, children: [
        saving ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 625,
          columnNumber: 23
        }, this) : null,
        " Save"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 624,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 620,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
    lineNumber: 465,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
    lineNumber: 464,
    columnNumber: 10
  }, this);
}
function LessonsDialog({
  course,
  onClose
}) {
  const qc = useQueryClient();
  const [editing, setEditing] = reactExports.useState(null);
  const [adding, setAdding] = reactExports.useState(false);
  const courseId = course?.id;
  const lessonsQuery = useQuery({
    enabled: !!courseId,
    queryKey: ["studio-lessons", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const {
        data,
        error
      } = await supabase.from("lessons").select("*").eq("course_id", courseId).order("order_index", {
        ascending: true
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  async function removeLesson(l) {
    const {
      error
    } = await supabase.from("lessons").delete().eq("id", l.id);
    if (error) return toast.error(error.message);
    toast.success("Lesson removed");
    qc.invalidateQueries({
      queryKey: ["studio-lessons"]
    });
  }
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open: !!course, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { className: "max-w-3xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(BookOpen, { className: "h-5 w-5 text-primary" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 671,
          columnNumber: 13
        }, this),
        " ",
        course?.title,
        " · Lessons"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 670,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: "Manage the lesson plan for this course." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 673,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 669,
      columnNumber: 9
    }, this),
    course && (editing || adding ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LessonForm, { lesson: editing, courseId: course.id, nextOrder: lessonsQuery.data?.length ?? 0, onCancel: () => {
      setEditing(null);
      setAdding(false);
    }, onSaved: () => {
      setEditing(null);
      setAdding(false);
      qc.invalidateQueries({
        queryKey: ["studio-lessons"]
      });
    } }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 676,
      columnNumber: 41
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(YouTubeToolbar, { courseId: course.id, onDone: () => qc.invalidateQueries({
        queryKey: ["studio-lessons"]
      }) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 686,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", onClick: () => setAdding(true), children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Plus, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 691,
          columnNumber: 19
        }, this),
        " Add lesson"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 690,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 689,
        columnNumber: 15
      }, this),
      lessonsQuery.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-6 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 695,
        columnNumber: 19
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 694,
        columnNumber: 41
      }, this) : (lessonsQuery.data ?? []).length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-6 text-center text-sm text-muted-foreground", children: "No lessons yet." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 696,
        columnNumber: 67
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "space-y-2 mt-2", children: (lessonsQuery.data ?? []).map((l) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "flex items-center justify-between gap-3 border rounded-lg px-3 py-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-sm font-medium truncate", children: [
            l.order_index + 1,
            ". ",
            l.title
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 699,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground truncate", children: [
            l.duration_minutes,
            " min",
            l.is_preview ? " · Preview" : ""
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 702,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 698,
          columnNumber: 23
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-1 shrink-0", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "icon", variant: "ghost", onClick: () => setEditing(l), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Pencil, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 708,
            columnNumber: 27
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 707,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "icon", variant: "ghost", className: "text-destructive", onClick: () => removeLesson(l), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trash2, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 711,
            columnNumber: 27
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 710,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 706,
          columnNumber: 23
        }, this)
      ] }, l.id, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 697,
        columnNumber: 55
      }, this)) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 696,
        columnNumber: 154
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 685,
      columnNumber: 15
    }, this)),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { children: editing || adding ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: () => {
      setEditing(null);
      setAdding(false);
    }, children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowLeft, { className: "h-4 w-4" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 723,
        columnNumber: 15
      }, this),
      " Back"
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 719,
      columnNumber: 32
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: onClose, children: "Close" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 724,
      columnNumber: 25
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 718,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
    lineNumber: 668,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
    lineNumber: 667,
    columnNumber: 10
  }, this);
}
function LessonForm({
  lesson,
  courseId,
  nextOrder,
  onCancel,
  onSaved
}) {
  const [title, setTitle] = reactExports.useState(lesson?.title ?? "");
  const [description, setDescription] = reactExports.useState(lesson?.description ?? "");
  const [videoUrl, setVideoUrl] = reactExports.useState(lesson?.video_url ?? "");
  const [duration, setDuration] = reactExports.useState(lesson?.duration_minutes ?? 5);
  const [orderIndex, setOrderIndex] = reactExports.useState(lesson?.order_index ?? nextOrder);
  const [isPreview, setIsPreview] = reactExports.useState(lesson?.is_preview ?? false);
  const [saving, setSaving] = reactExports.useState(false);
  const videoError = reactExports.useMemo(() => validateLessonVideoUrl(videoUrl), [videoUrl]);
  async function save() {
    if (!title.trim()) return toast.error("Title required");
    if (videoError) return toast.error(videoError);
    setSaving(true);
    const payload = {
      course_id: courseId,
      title: title.trim(),
      description: description.trim() || null,
      video_url: videoUrl.trim() || null,
      duration_minutes: Number(duration) || 0,
      order_index: Number(orderIndex) || 0,
      is_preview: isPreview
    };
    const {
      error
    } = lesson ? await supabase.from("lessons").update(payload).eq("id", lesson.id) : await supabase.from("lessons").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(lesson ? "Lesson updated" : "Lesson added");
    onSaved();
  }
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid gap-3 sm:grid-cols-2", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5 sm:col-span-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Title" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 775,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { value: title, onChange: (e) => setTitle(e.target.value), maxLength: 120 }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 776,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 774,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5 sm:col-span-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Video URL (YouTube link or direct video)" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 779,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { value: videoUrl, onChange: (e) => setVideoUrl(e.target.value), placeholder: "https://www.youtube.com/watch?v=…", "aria-invalid": !!videoError }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 780,
        columnNumber: 9
      }, this),
      videoError ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-destructive", children: videoError }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 781,
        columnNumber: 23
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-emerald-600 flex items-center gap-1", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheck, { className: "h-3 w-3" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 782,
          columnNumber: 13
        }, this),
        " Playable video URL"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 781,
        columnNumber: 86
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 778,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Duration (mins)" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 786,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { type: "number", min: 0, value: duration, onChange: (e) => setDuration(Number(e.target.value)) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 787,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 785,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Order" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 790,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { type: "number", min: 0, value: orderIndex, onChange: (e) => setOrderIndex(Number(e.target.value)) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 791,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 789,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5 sm:col-span-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Description" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 794,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Textarea, { rows: 3, maxLength: 500, value: description, onChange: (e) => setDescription(e.target.value) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 795,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 793,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 sm:col-span-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Switch, { checked: isPreview, onCheckedChange: setIsPreview }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 798,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "!m-0", children: "Free preview lesson" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 799,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 797,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "sm:col-span-2 flex justify-end gap-2 pt-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: onCancel, disabled: saving, children: "Cancel" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 802,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: save, disabled: saving || !!videoError, children: [
        saving ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 806,
          columnNumber: 21
        }, this) : null,
        " Save lesson"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 805,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 801,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
    lineNumber: 773,
    columnNumber: 10
  }, this);
}
function McqDialog({
  course,
  onClose
}) {
  const qc = useQueryClient();
  const aiFn = useServerFn(runAiTool);
  const [topic, setTopic] = reactExports.useState("");
  const [count, setCount] = reactExports.useState(10);
  const [generating, setGenerating] = reactExports.useState(false);
  const [bulkJson, setBulkJson] = reactExports.useState("");
  const courseId = course?.id;
  const q = useQuery({
    enabled: !!courseId,
    queryKey: ["studio-mcq", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const {
        data,
        error
      } = await supabase.from("mcq_questions").select("*").eq("course_id", courseId).order("order_index");
      if (error) throw error;
      return data ?? [];
    }
  });
  async function generate() {
    if (!course) return;
    const t = topic.trim() || course.title;
    setGenerating(true);
    try {
      const res = await aiFn({
        data: {
          action: "quiz",
          topic: t,
          count,
          difficulty: "medium"
        }
      });
      const parsed = JSON.parse(res.json);
      const startIdx = q.data?.length ?? 0;
      const rows = parsed.questions.map((qq, i) => ({
        course_id: course.id,
        question: qq.question,
        options: qq.options,
        answer: qq.answer,
        explanation: qq.explanation,
        order_index: startIdx + i
      }));
      const {
        error
      } = await supabase.from("mcq_questions").insert(rows);
      if (error) throw error;
      toast.success(`Added ${rows.length} questions`);
      qc.invalidateQueries({
        queryKey: ["studio-mcq"]
      });
    } catch (e) {
      toast.error(e?.message ?? "Generation failed");
    } finally {
      setGenerating(false);
    }
  }
  async function bulkAdd() {
    if (!course || !bulkJson.trim()) return;
    try {
      const parsed = JSON.parse(bulkJson);
      const arr = Array.isArray(parsed) ? parsed : parsed.questions;
      if (!Array.isArray(arr)) throw new Error("Expected an array or { questions: [] }");
      const startIdx = q.data?.length ?? 0;
      const rows = arr.map((qq, i) => ({
        course_id: course.id,
        question: String(qq.question),
        options: qq.options,
        answer: Number(qq.answer),
        explanation: qq.explanation ?? null,
        order_index: startIdx + i
      }));
      const {
        error
      } = await supabase.from("mcq_questions").insert(rows);
      if (error) throw error;
      toast.success(`Added ${rows.length} questions`);
      setBulkJson("");
      qc.invalidateQueries({
        queryKey: ["studio-mcq"]
      });
    } catch (e) {
      toast.error(e?.message ?? "Invalid JSON");
    }
  }
  async function remove(id) {
    await supabase.from("mcq_questions").delete().eq("id", id);
    qc.invalidateQueries({
      queryKey: ["studio-mcq"]
    });
  }
  async function clearAll() {
    if (!course || !confirm("Delete ALL test questions for this course?")) return;
    await supabase.from("mcq_questions").delete().eq("course_id", course.id);
    qc.invalidateQueries({
      queryKey: ["studio-mcq"]
    });
  }
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open: !!course, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { className: "max-w-3xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Brain, { className: "h-5 w-5 text-primary" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 939,
          columnNumber: 13
        }, this),
        " ",
        course?.title,
        " · Final Test"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 938,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: "Add MCQs students must pass (≥70%) to claim their certificate." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 941,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 937,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-lg border p-3 space-y-2 bg-muted/30", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "AI-generate questions" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 948,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-[1fr_100px_auto] gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { placeholder: `Topic (defaults to "${course?.title ?? "course"}")`, value: topic, onChange: (e) => setTopic(e.target.value) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 950,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { type: "number", min: 3, max: 20, value: count, onChange: (e) => setCount(Number(e.target.value) || 10) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 951,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: generate, disabled: generating, children: [
            generating ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 953,
              columnNumber: 31
            }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 953,
              columnNumber: 78
            }, this),
            " ",
            "Generate"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 952,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 949,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 947,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-lg border p-3 space-y-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs", children: "Bulk add JSON" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 960,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Textarea, { rows: 4, placeholder: `[{"question":"...","options":["a","b","c","d"],"answer":0,"explanation":"..."}]`, value: bulkJson, onChange: (e) => setBulkJson(e.target.value), className: "font-mono text-xs" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 961,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", onClick: bulkAdd, disabled: !bulkJson.trim(), children: "Add from JSON" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 962,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 959,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm font-medium", children: [
          q.data?.length ?? 0,
          " questions"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 968,
          columnNumber: 13
        }, this),
        (q.data?.length ?? 0) > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "ghost", className: "text-destructive", onClick: clearAll, children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trash2, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 970,
            columnNumber: 17
          }, this),
          " Clear all"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 969,
          columnNumber: 43
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 967,
        columnNumber: 11
      }, this),
      q.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin mx-auto" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 974,
        columnNumber: 26
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "space-y-2", children: (q.data ?? []).map((qq, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "border rounded-lg p-3", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm font-medium", children: [
            i + 1,
            ". ",
            qq.question
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 978,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "text-xs text-muted-foreground mt-1 space-y-0.5", children: qq.options.map((o, idx) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: idx === qq.answer ? "text-emerald-600 font-medium" : "", children: [
            String.fromCharCode(65 + idx),
            ". ",
            o,
            " ",
            idx === qq.answer && "✓"
          ] }, idx, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 982,
            columnNumber: 53
          }, this)) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 981,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 977,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "icon", variant: "ghost", onClick: () => remove(qq.id), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trash2, { className: "h-4 w-4 text-destructive" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 988,
          columnNumber: 23
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 987,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 976,
        columnNumber: 19
      }, this) }, qq.id, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 975,
        columnNumber: 46
      }, this)) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 974,
        columnNumber: 81
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 946,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: onClose, children: "Close" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 996,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 995,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
    lineNumber: 936,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
    lineNumber: 935,
    columnNumber: 10
  }, this);
}
function AiBuilderDialog({
  open,
  onClose,
  onCreated
}) {
  const genFn = useServerFn(generateFullCourse);
  const matFn = useServerFn(materializeCourse);
  const navigate = useNavigate();
  const [topic, setTopic] = reactExports.useState("");
  const [level, setLevel] = reactExports.useState("Beginner");
  const [audience, setAudience] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("Programming");
  const [count, setCount] = reactExports.useState(4);
  const [price, setPrice] = reactExports.useState(0);
  const [published, setPublished] = reactExports.useState(false);
  const [blueprint, setBlueprint] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState("");
  const generate = async () => {
    if (!topic.trim()) return toast.error("Enter a topic");
    setBusy("gen");
    try {
      const r = await genFn({
        data: {
          topic,
          level,
          audience: audience || void 0,
          modules: count,
          category
        }
      });
      setBlueprint(r.course);
      toast.success("Course blueprint ready — review and create");
    } catch (e) {
      toast.error(e?.message ?? "Generation failed");
    } finally {
      setBusy("");
    }
  };
  const materialize = async () => {
    if (!blueprint) return;
    setBusy("save");
    try {
      const r = await matFn({
        data: {
          blueprint,
          price_inr: price,
          instructor: "Learnify AI",
          published
        }
      });
      toast.success(`Course created (slug: ${r.slug})`);
      setBlueprint(null);
      setTopic("");
      onCreated();
      try {
        if (r?.slug) navigate({
          to: "/courses/$slug",
          params: {
            slug: r.slug
          }
        });
      } catch {
      }
    } catch (e) {
      toast.error(e?.message ?? "Save failed");
    } finally {
      setBusy("");
    }
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { className: "max-w-3xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(WandSparkles, { className: "h-5 w-5 text-primary" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1083,
          columnNumber: 13
        }, this),
        " My AI Course Builder"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1082,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: "Generates modules → chapters → real-world examples → projects → assignments → MCQs." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1085,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1081,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid gap-2 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5 sm:col-span-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Topic" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1093,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { placeholder: "e.g. Full-stack Next.js + tRPC + Prisma", value: topic, onChange: (e) => setTopic(e.target.value), maxLength: 300 }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1094,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1092,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Level" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1097,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("select", { className: "w-full h-9 rounded-md border bg-background px-2 text-sm", value: level, onChange: (e) => setLevel(e.target.value), children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { children: "Beginner" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 1099,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { children: "Intermediate" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 1100,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { children: "Advanced" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
              lineNumber: 1101,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1098,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1096,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Modules" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1105,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { type: "number", min: 2, max: 8, value: count, onChange: (e) => setCount(Number(e.target.value) || 4) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1106,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1104,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Category" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1109,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { value: category, onChange: (e) => setCategory(e.target.value) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1110,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1108,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Price (INR)" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1113,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { type: "number", min: 0, value: price, onChange: (e) => setPrice(Number(e.target.value) || 0) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1114,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1112,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5 sm:col-span-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Target audience (optional)" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1117,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { value: audience, onChange: (e) => setAudience(e.target.value), placeholder: "e.g. junior frontend engineers learning the backend" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1118,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1116,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 sm:col-span-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Switch, { checked: published, onCheckedChange: setPublished }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1121,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "!m-0", children: "Publish immediately" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1122,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1120,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1091,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: generate, disabled: busy !== "", className: "w-full", children: [
        busy === "gen" ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1127,
          columnNumber: 31
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1127,
          columnNumber: 78
        }, this),
        " ",
        "Generate blueprint"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1126,
        columnNumber: 11
      }, this),
      blueprint && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3 mt-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-lg border p-3 bg-muted/30", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-display font-semibold", children: blueprint.title }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1133,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground", children: blueprint.description }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1134,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] mt-1", children: [
            blueprint.modules?.length,
            " modules ·",
            " ",
            blueprint.modules?.reduce((s, m) => s + (m.chapters?.length ?? 0), 0),
            " ",
            "chapters · ",
            blueprint.mcqs?.length ?? 0,
            " MCQs"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1135,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1132,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "text-xs space-y-2 max-h-[280px] overflow-y-auto border rounded-lg p-3", children: blueprint.modules?.map((m, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-semibold", children: [
            i + 1,
            ". ",
            m.title
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1143,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-muted-foreground", children: m.description }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1146,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "ml-4 list-disc text-muted-foreground", children: m.chapters?.map((c, ci) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: c.title }, ci, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1148,
            columnNumber: 64
          }, this)) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1147,
            columnNumber: 21
          }, this),
          m.project && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "ml-4 text-primary", children: [
            "📦 Project: ",
            m.project.title
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1150,
            columnNumber: 35
          }, this)
        ] }, i, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1142,
          columnNumber: 64
        }, this)) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1141,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: materialize, disabled: busy !== "", className: "w-full", children: [
          busy === "save" ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1154,
            columnNumber: 36
          }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Plus, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1154,
            columnNumber: 83
          }, this),
          " ",
          "Create course in catalog"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1153,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1131,
        columnNumber: 25
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1090,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: onClose, children: "Close" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1161,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1160,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
    lineNumber: 1080,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
    lineNumber: 1079,
    columnNumber: 10
  }, this);
}
function AssignmentsManagerDialog({
  course,
  onClose
}) {
  const qc = useQueryClient();
  const [adding, setAdding] = reactExports.useState(false);
  const [title, setTitle] = reactExports.useState("");
  const [prompt, setPrompt] = reactExports.useState("");
  const [starter, setStarter] = reactExports.useState("");
  const courseId = course?.id;
  const q = useQuery({
    enabled: !!courseId,
    queryKey: ["studio-assignments", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const {
        data,
        error
      } = await supabase.from("course_assignments").select("*").eq("course_id", courseId).order("order_index");
      if (error) throw error;
      return data ?? [];
    }
  });
  const add = async () => {
    if (!course || !title.trim() || !prompt.trim()) return toast.error("Title and prompt required");
    const idx = q.data?.length ?? 0;
    const {
      error
    } = await supabase.from("course_assignments").insert({
      course_id: course.id,
      title: title.trim(),
      prompt: prompt.trim(),
      starter_code: starter.trim() || null,
      order_index: idx
    });
    if (error) return toast.error(error.message);
    setTitle("");
    setPrompt("");
    setStarter("");
    setAdding(false);
    qc.invalidateQueries({
      queryKey: ["studio-assignments"]
    });
    toast.success("Assignment added");
  };
  const remove = async (id) => {
    await supabase.from("course_assignments").delete().eq("id", id);
    qc.invalidateQueries({
      queryKey: ["studio-assignments"]
    });
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open: !!course, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { className: "max-w-3xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ClipboardList, { className: "h-5 w-5 text-primary" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1235,
          columnNumber: 13
        }, this),
        " ",
        course?.title,
        " · Assignments"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1234,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: "Practical tasks and projects learners submit." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1237,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1233,
      columnNumber: 9
    }, this),
    adding ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { placeholder: "Assignment title", value: title, onChange: (e) => setTitle(e.target.value), maxLength: 180 }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1241,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Textarea, { rows: 5, placeholder: "Detailed prompt with deliverables…", value: prompt, onChange: (e) => setPrompt(e.target.value), maxLength: 4e3 }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1242,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Textarea, { rows: 4, placeholder: "Starter code (optional)", value: starter, onChange: (e) => setStarter(e.target.value), className: "font-mono text-xs" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1243,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-end gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: () => setAdding(false), children: "Cancel" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1245,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: add, children: "Save assignment" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1248,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1244,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1240,
      columnNumber: 19
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", onClick: () => setAdding(true), children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Plus, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1253,
          columnNumber: 17
        }, this),
        " Add assignment"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1252,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1251,
        columnNumber: 13
      }, this),
      q.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin mx-auto" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1256,
        columnNumber: 28
      }, this) : (q.data ?? []).length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground text-center py-8", children: "No assignments yet." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1256,
        columnNumber: 113
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "space-y-2", children: (q.data ?? []).map((a, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "border rounded-lg p-3 flex items-start gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm font-medium", children: [
            i + 1,
            ". ",
            a.title
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1259,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground whitespace-pre-wrap line-clamp-3 mt-1", children: a.prompt }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1262,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1258,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "icon", variant: "ghost", onClick: () => remove(a.id), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trash2, { className: "h-4 w-4 text-destructive" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1267,
          columnNumber: 23
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1266,
          columnNumber: 21
        }, this)
      ] }, a.id, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1257,
        columnNumber: 47
      }, this)) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1256,
        columnNumber: 201
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1250,
      columnNumber: 20
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: onClose, children: "Close" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1274,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1273,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
    lineNumber: 1232,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
    lineNumber: 1231,
    columnNumber: 10
  }, this);
}
function SubmissionsReviewDialog({
  course,
  onClose
}) {
  const qc = useQueryClient();
  const [feedbackMap, setFeedbackMap] = reactExports.useState({});
  const courseId = course?.id;
  const q = useQuery({
    enabled: !!courseId,
    queryKey: ["studio-subs", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const {
        data,
        error
      } = await supabase.from("assignment_submissions").select("*, profiles:user_id(full_name, email), course_assignments:assignment_id(title)").eq("course_id", courseId).order("submitted_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const updateStatus = async (id, status) => {
    const fb = feedbackMap[id];
    const {
      error
    } = await supabase.from("assignment_submissions").update({
      status,
      feedback: fb ?? void 0,
      reviewed_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    qc.invalidateQueries({
      queryKey: ["studio-subs"]
    });
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open: !!course, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { className: "max-w-3xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(FileCheckCorner, { className: "h-5 w-5 text-primary" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1327,
          columnNumber: 13
        }, this),
        " ",
        course?.title,
        " · Submissions"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1326,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: "Review and provide feedback on learner submissions." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1329,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1325,
      columnNumber: 9
    }, this),
    q.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin mx-auto" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1332,
      columnNumber: 24
    }, this) : (q.data ?? []).length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground text-center py-8", children: "No submissions yet." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1332,
      columnNumber: 109
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3", children: (q.data ?? []).map((s) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "border rounded-lg p-3 space-y-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-start justify-between gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm font-medium", children: s.course_assignments?.title ?? "Assignment" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1336,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-muted-foreground", children: [
            s.profiles?.full_name ?? s.profiles?.email ?? "Learner",
            " ·",
            " ",
            format(new Date(s.submitted_at), "dd MMM HH:mm")
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1339,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1335,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: "text-[10px] capitalize", children: String(s.status).replace("_", " ") }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1344,
          columnNumber: 19
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1334,
        columnNumber: 17
      }, this),
      s.content && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs whitespace-pre-wrap bg-muted/40 rounded p-2 max-h-40 overflow-y-auto", children: s.content }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1348,
        columnNumber: 31
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex gap-3 text-xs", children: [
        s.link_url && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { className: "text-primary underline inline-flex items-center gap-1", href: s.link_url, target: "_blank", rel: "noreferrer", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ExternalLink, { className: "h-3 w-3" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1353,
            columnNumber: 23
          }, this),
          " Link"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1352,
          columnNumber: 34
        }, this),
        s.attachment_url && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { className: "text-primary underline inline-flex items-center gap-1", href: s.attachment_url, target: "_blank", rel: "noreferrer", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Paperclip, { className: "h-3 w-3" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1356,
            columnNumber: 23
          }, this),
          " File"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1355,
          columnNumber: 40
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1351,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Textarea, { rows: 2, placeholder: "Feedback for the learner…", defaultValue: s.feedback ?? "", onChange: (e) => setFeedbackMap((m) => ({
        ...m,
        [s.id]: e.target.value
      })) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1359,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: () => updateStatus(s.id, "needs_changes"), children: "Needs changes" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1364,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: () => updateStatus(s.id, "reviewed"), children: "Mark reviewed" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1367,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", onClick: () => updateStatus(s.id, "approved"), children: "Approve" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1370,
          columnNumber: 19
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1363,
        columnNumber: 17
      }, this)
    ] }, s.id, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1333,
      columnNumber: 45
    }, this)) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1332,
      columnNumber: 197
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: onClose, children: "Close" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1378,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1377,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
    lineNumber: 1324,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
    lineNumber: 1323,
    columnNumber: 10
  }, this);
}
function YouTubeToolbar({
  courseId,
  onDone
}) {
  const verifyFn = useServerFn(verifyYoutubeKey);
  const startFn = useServerFn(startCourseEnrichment);
  const listRunsFn = useServerFn(listCourseEnrichmentRuns);
  const [verifyUrl, setVerifyUrl] = reactExports.useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [verifying, setVerifying] = reactExports.useState(false);
  const [verifyResult, setVerifyResult] = reactExports.useState(null);
  const [withTranscript, setWithTranscript] = reactExports.useState(true);
  const [starting, setStarting] = reactExports.useState(false);
  const [activeRunId, setActiveRunId] = reactExports.useState(null);
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [pastRuns, setPastRuns] = reactExports.useState([]);
  const [showHistory, setShowHistory] = reactExports.useState(false);
  async function loadHistory() {
    try {
      const res = await listRunsFn({
        data: {
          courseId
        }
      });
      setPastRuns(res.runs ?? []);
    } catch {
    }
  }
  reactExports.useEffect(() => {
    loadHistory();
  }, [courseId]);
  async function doVerify() {
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await verifyFn({
        data: {
          url: verifyUrl
        }
      });
      setVerifyResult({
        title: res.meta.title,
        channel: res.meta.channelTitle
      });
      toast.success("YouTube key is working.");
    } catch (e) {
      toast.error(e?.message ?? "Verification failed");
    } finally {
      setVerifying(false);
    }
  }
  async function doStart() {
    setStarting(true);
    try {
      const res = await startFn({
        data: {
          courseId,
          withTranscript
        }
      });
      setActiveRunId(res.runId);
      setDialogOpen(true);
      toast.success("Enrichment started — monitoring progress.");
    } catch (e) {
      toast.error(e?.message ?? "Failed to start enrichment");
    } finally {
      setStarting(false);
    }
  }
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-lg border bg-muted/30 p-3 space-y-3", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 text-sm font-medium", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Youtube, { className: "h-4 w-4 text-red-500" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1462,
        columnNumber: 9
      }, this),
      " YouTube tools"
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1461,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col sm:flex-row gap-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { value: verifyUrl, onChange: (e) => setVerifyUrl(e.target.value), placeholder: "Paste a YouTube URL to verify the API key", className: "flex-1" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1465,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: doVerify, disabled: verifying, children: [
        verifying ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1467,
          columnNumber: 24
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheck, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1467,
          columnNumber: 71
        }, this),
        " ",
        "Verify key"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1466,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1464,
      columnNumber: 7
    }, this),
    verifyResult && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-emerald-600 dark:text-emerald-400", children: [
      "✓ ",
      verifyResult.title,
      " — ",
      verifyResult.channel
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1471,
      columnNumber: 24
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col sm:flex-row sm:items-center gap-3 pt-1 border-t", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Switch, { checked: withTranscript, onCheckedChange: setWithTranscript }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1476,
          columnNumber: 11
        }, this),
        "Pull transcripts & summarize into lesson content"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1475,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "sm:ml-auto flex gap-2", children: [
        activeRunId && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: () => setDialogOpen(true), children: "View progress" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1480,
          columnNumber: 27
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", onClick: doStart, disabled: starting, children: [
          starting ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1484,
            columnNumber: 25
          }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(WandSparkles, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1484,
            columnNumber: 72
          }, this),
          " ",
          "Re-run YouTube enrichment"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1483,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1479,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1474,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-muted-foreground", children: [
      "Refreshes each lesson's ",
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("code", { children: "video_url" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1490,
        columnNumber: 38
      }, this),
      " with the top YouTube match. With transcripts on, key takeaways, notes and a glossary are added to lesson content. Cached transcripts are reused across courses."
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1489,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "pt-2 border-t", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { type: "button", className: "text-xs text-muted-foreground hover:text-foreground underline", onClick: () => {
        setShowHistory((s) => !s);
        if (!showHistory) loadHistory();
      }, children: [
        showHistory ? "Hide" : "Show",
        " past runs (",
        pastRuns.length,
        ")"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1496,
        columnNumber: 9
      }, this),
      showHistory && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "mt-2 space-y-1 text-xs", children: [
        pastRuns.map((r) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { type: "button", className: "underline hover:text-foreground text-muted-foreground", onClick: () => {
            setActiveRunId(r.id);
            setDialogOpen(true);
          }, children: format(new Date(r.started_at), "MMM d, HH:mm") }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1504,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: "text-[10px]", children: r.status }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1510,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: "text-[10px]", children: [
            "key: ",
            r.youtube_key_status
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1513,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-muted-foreground", children: [
            r.updated_videos,
            "/",
            r.total,
            " videos · ",
            r.updated_transcripts,
            " summaries",
            r.failures?.length ? ` · ${r.failures.length} failed` : ""
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1516,
            columnNumber: 17
          }, this)
        ] }, r.id, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1503,
          columnNumber: 32
        }, this)),
        !pastRuns.length && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "text-muted-foreground", children: "No runs yet." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1521,
          columnNumber: 34
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1502,
        columnNumber: 25
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1495,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(EnrichmentProgressDialog, { runId: activeRunId, open: dialogOpen, onOpenChange: (v) => {
      setDialogOpen(v);
      if (!v) {
        loadHistory();
        onDone();
      }
    } }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1525,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
    lineNumber: 1460,
    columnNumber: 10
  }, this);
}
async function resizeImageToDataUrl(file, maxWidth, quality) {
  const bitmap = await createImageBitmap(file).catch(async () => {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = rej;
        i.src = url;
      });
      return img;
    } finally {
      URL.revokeObjectURL(url);
    }
  });
  const w = bitmap.width;
  const h = bitmap.height;
  const scale = Math.min(1, maxWidth / w);
  const tw = Math.round(w * scale);
  const th = Math.round(h * scale);
  const canvas = document.createElement("canvas");
  canvas.width = tw;
  canvas.height = th;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, tw, th);
  return canvas.toDataURL("image/jpeg", quality);
}
function AiThumbnailDialog({
  open,
  onClose,
  courseId,
  defaultTitle,
  defaultCategory,
  defaultDescription,
  onApply
}) {
  const [style, setStyle] = reactExports.useState("bold");
  const [colors, setColors] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [size, setSize] = reactExports.useState("1536x1024");
  const [busy, setBusy] = reactExports.useState(false);
  const [preview, setPreview] = reactExports.useState(null);
  const [lessonHint, setLessonHint] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const [warn, setWarn] = reactExports.useState(null);
  const generate = useServerFn(generateCourseThumbnail);
  reactExports.useEffect(() => {
    if (open) {
      setPreview(null);
      setError(null);
      setWarn(null);
    }
  }, [open]);
  reactExports.useEffect(() => {
    if (!open || !courseId) {
      setLessonHint("");
      return;
    }
    let cancelled = false;
    (async () => {
      const {
        data
      } = await supabase.from("lessons").select("title, description").eq("course_id", courseId).order("order_index", {
        ascending: true
      }).limit(1).maybeSingle();
      if (cancelled) return;
      if (data) setLessonHint([data.title, data.description].filter(Boolean).join(" — "));
    })();
    return () => {
      cancelled = true;
    };
  }, [open, courseId]);
  const prompt = buildThumbnailPrompt({
    title: defaultTitle || "Untitled course",
    category: defaultCategory,
    description: defaultDescription,
    style,
    colors,
    customNotes: notes,
    lessonHint
  });
  async function run() {
    setError(null);
    setWarn(null);
    if (!defaultTitle.trim()) {
      setError("Add a course title first.");
      return;
    }
    const unsafe = checkThumbnailPromptSafety(prompt);
    if (unsafe) {
      setError(unsafe);
      return;
    }
    setBusy(true);
    try {
      const res = await generate({
        data: {
          prompt,
          size
        }
      });
      setPreview(res.dataUrl);
      const check = await validateThumbnailImage(res.dataUrl, size);
      if (!check.ok) setWarn(check.message ?? "Generated image failed validation.");
    } catch (e) {
      setError(e?.message ?? "Generation failed");
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-4 w-4 text-primary" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1660,
          columnNumber: 13
        }, this),
        " AI Thumbnail Generator"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1659,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: "Pick a style, tweak colors and notes, generate a thumbnail based on your course." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1662,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1658,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Style template" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1668,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2", children: THUMBNAIL_STYLES.map((s) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { type: "button", onClick: () => setStyle(s.id), className: `text-left rounded-xl border p-2.5 text-xs transition ${style === s.id ? "border-primary bg-primary/5" : "hover:bg-accent"}`, children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-medium", children: s.label }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1671,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-muted-foreground line-clamp-2 mt-0.5", children: s.hint }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1672,
            columnNumber: 19
          }, this)
        ] }, s.id, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1670,
          columnNumber: 42
        }, this)) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1669,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1667,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid sm:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Colors (optional)" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1678,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$2, { value: colors, onChange: (e) => setColors(e.target.value), placeholder: "e.g. indigo & gold, pastel green", maxLength: 120 }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1679,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1677,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Size" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1682,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex gap-1", children: ["1536x1024", "1024x1024", "1024x1536"].map((s) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { type: "button", onClick: () => setSize(s), className: `flex-1 rounded-md border p-1.5 text-xs ${size === s ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent"}`, children: s }, s, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1684,
            columnNumber: 78
          }, this)) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1683,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1681,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1676,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Extra direction (optional)" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1691,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Textarea, { value: notes, onChange: (e) => setNotes(e.target.value), maxLength: 400, rows: 2, placeholder: "e.g. include a small lightbulb icon, no text on bottom-right" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1692,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1690,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-md border bg-muted/40 p-2.5 text-[11px] text-muted-foreground", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-medium text-foreground", children: "Prompt preview: " }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1695,
          columnNumber: 13
        }, this),
        prompt,
        lessonHint && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-1 text-[10px] italic", children: [
          'Auto-included from first lesson: "',
          lessonHint.slice(0, 120),
          lessonHint.length > 120 ? "…" : "",
          '"'
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1697,
          columnNumber: 28
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1694,
        columnNumber: 11
      }, this),
      error && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-md border border-destructive/40 bg-destructive/10 p-2.5 text-xs text-destructive flex items-start gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TriangleAlert, { className: "h-4 w-4 mt-0.5 shrink-0" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1703,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-medium", children: "Generation failed" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1705,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[11px] opacity-90", children: error }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
            lineNumber: 1706,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1704,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: run, disabled: busy, children: "Retry" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1708,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1702,
        columnNumber: 21
      }, this),
      warn && !error && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-md border border-amber-500/40 bg-amber-500/10 p-2.5 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TriangleAlert, { className: "h-4 w-4 mt-0.5 shrink-0" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1713,
          columnNumber: 15
        }, this),
        " ",
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: warn }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1713,
          columnNumber: 69
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1712,
        columnNumber: 30
      }, this),
      preview && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "overflow-hidden rounded-md border bg-muted", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: preview, alt: "AI thumbnail", className: "w-full max-h-72 object-contain bg-black/5" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1716,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1715,
        columnNumber: 23
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1666,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: onClose, children: "Cancel" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1720,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "secondary", onClick: run, disabled: busy, children: [
        busy ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1724,
          columnNumber: 21
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(WandSparkles, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1724,
          columnNumber: 68
        }, this),
        preview ? "Regenerate" : "Generate"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1723,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: () => preview && onApply(preview), disabled: !preview, children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Image$1, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
          lineNumber: 1728,
          columnNumber: 13
        }, this),
        " Use this thumbnail"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
        lineNumber: 1727,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
      lineNumber: 1719,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
    lineNumber: 1657,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/studio.tsx?tsr-split=component",
    lineNumber: 1656,
    columnNumber: 10
  }, this);
}
export {
  StudioPage as component
};
