import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const Input = z.object({
  prompt: z.string().min(3).max(2000),
  size: z.enum(["1024x1024", "1536x1024", "1024x1536"]).default("1536x1024"),
});

// Lightweight prompt safety: block obvious unsafe / IP-violating content before
// hitting the gateway. Returns a friendly reason or null.
export function checkThumbnailPromptSafety(prompt: string): string | null {
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
    "star wars",
  ];
  const hit = banned.find((b) => p.includes(b));
  if (hit)
    return `Prompt contains restricted content ("${hit.trim()}"). Try a descriptive non-IP variant.`;
  if (prompt.trim().length < 8) return "Prompt is too short. Add a few descriptive words.";
  return null;
}

export const generateCourseThumbnail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => Input.parse(data))
  .handler(async ({ data }) => {
    const safety = checkThumbnailPromptSafety(data.prompt);
    if (safety) throw new Error(safety);

    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI image service not configured. Contact support.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [{ role: "user", content: `${data.prompt}\n\n(Render at ${data.size}.)` }],
        modalities: ["image", "text"],
      }),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("Rate limited — try again in a moment.");
      if (res.status === 402)
        throw new Error("AI credits exhausted. Add funds in Workspace settings.");
      if (res.status === 400 && /policy|moderation|safety/i.test(txt)) {
        throw new Error(
          "AI provider rejected the prompt (content policy). Try a different style or wording.",
        );
      }
      throw new Error(`AI image error (${res.status}): ${txt.slice(0, 180)}`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { images?: Array<{ image_url?: { url?: string } }> } }>;
    };
    const url = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (url) return { dataUrl: url };
    throw new Error("AI returned no image. Try regenerating.");
  });

export const THUMBNAIL_STYLES = [
  {
    id: "bold",
    label: "Bold & Modern",
    hint: "vibrant gradient, large bold typography, high contrast",
  },
  {
    id: "minimal",
    label: "Minimal Clean",
    hint: "white background, thin sans-serif type, subtle accent shape",
  },
  { id: "tech", label: "Tech / Dev", hint: "dark navy background, neon accents, code/glow motif" },
  {
    id: "education",
    label: "Education",
    hint: "warm pastel, friendly illustration, classroom feel",
  },
  { id: "playful", label: "Playful", hint: "bright colors, geometric shapes, fun rounded type" },
  { id: "luxury", label: "Premium", hint: "deep black with gold accents, serif type, elegant" },
] as const;

export function buildThumbnailPrompt(opts: {
  title: string;
  category?: string;
  description?: string;
  style: string;
  colors?: string;
  customNotes?: string;
  lessonHint?: string;
}) {
  const style = THUMBNAIL_STYLES.find((s) => s.id === opts.style) ?? THUMBNAIL_STYLES[0];
  const parts = [
    `Course thumbnail (1536x1024, social-share friendly) for an online course titled "${opts.title}".`,
    opts.category ? `Category: ${opts.category}.` : "",
    opts.description ? `About: ${opts.description.slice(0, 300)}.` : "",
    opts.lessonHint ? `First lesson theme: ${opts.lessonHint.slice(0, 240)}.` : "",
    `Style: ${style.label} — ${style.hint}.`,
    opts.colors ? `Color palette hint: ${opts.colors}.` : "",
    `Render the title text "${opts.title}" prominently and legibly. No watermark, no logos, no copyrighted IP, no real faces.`,
    opts.customNotes ? `Extra direction: ${opts.customNotes}` : "",
  ];
  return parts.filter(Boolean).join(" ");
}

// Client-side helper to validate a thumbnail's dimensions and aspect ratio.
// Returns { ok, width, height, message } — message is friendly when ok=false.
export type SizeKey = "1024x1024" | "1536x1024" | "1024x1536";

export function parseSizeKey(s: SizeKey): { w: number; h: number; ratio: number } {
  const [w, h] = s.split("x").map(Number);
  return { w, h, ratio: w / h };
}

export const MIN_THUMBNAIL_WIDTH = 800;
export const MIN_THUMBNAIL_HEIGHT = 600;
export const ASPECT_TOLERANCE = 0.08; // ±8%

export async function validateThumbnailImage(
  src: string,
  expected: SizeKey | null,
): Promise<{ ok: boolean; width: number; height: number; message?: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const w = img.naturalWidth,
        h = img.naturalHeight;
      if (w < MIN_THUMBNAIL_WIDTH || h < MIN_THUMBNAIL_HEIGHT) {
        return resolve({
          ok: false,
          width: w,
          height: h,
          message: `Image is too small (${w}×${h}). Minimum ${MIN_THUMBNAIL_WIDTH}×${MIN_THUMBNAIL_HEIGHT}.`,
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
            message: `Aspect ratio doesn't match ${expected} (got ${w}×${h}). Use the inline editor to crop.`,
          });
        }
      }
      resolve({ ok: true, width: w, height: h });
    };
    img.onerror = () =>
      resolve({ ok: false, width: 0, height: 0, message: "Image failed to load." });
    img.src = src;
  });
}
