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

    const geminiKey = process.env.GEMINI_API_KEY;
    const stabilityKey = process.env.STABILITY_API_KEY;
    const falKey = process.env.FAL_KEY;
    const hfKey = process.env.HF_API_KEY;
    const openrouterKey = process.env.OPENROUTER_API_KEY;

    // 1. Hugging Face (free inference — FLUX.1-schnell, has user's API key)
    if (hfKey) {
      try {
        const res = await fetch("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${hfKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: data.prompt.slice(0, 500) }),
        });

        if (res.ok) {
          const blob = await res.arrayBuffer();
          const base64 = Buffer.from(blob).toString("base64");
          return { dataUrl: `data:image/jpeg;base64,${base64}` };
        } else {
          const txt = await res.text().catch(() => "");
          console.warn(`Hugging Face failed (${res.status}): ${txt.slice(0, 120)}`);
        }
      } catch (err) {
        console.warn("Hugging Face error. Trying Pollinations...", err);
      }
    }

    // 2. Pollinations AI (free, no key needed)
    const pollinationsUrls = [
      (p: string) => `https://image.pollinations.ai/prompt/${p}?model=flux&nofeed=true`,
      (p: string) => `https://gen.pollinations.ai/image/${p}?model=flux&nofeed=true`,
    ];
    for (const buildUrl of pollinationsUrls) {
      try {
        const short = data.prompt.slice(0, 400);
        const pw = encodeURIComponent(short);
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 20000);
        const res = await fetch(buildUrl(pw), {
          signal: controller.signal,
          headers: { Accept: "image/*, */*" },
        });
        clearTimeout(timer);
        const ct = res.headers.get("content-type") || "";
        if (res.ok && ct.startsWith("image/")) {
          const blob = await res.arrayBuffer();
          const base64 = Buffer.from(blob).toString("base64");
          return { dataUrl: `data:${ct};base64,${base64}` };
        } else if (res.ok) {
          const text = await res.text().catch(() => "");
          if (text.length > 100 && !text.includes("<html")) {
            // Some Pollinations endpoints return the image body as base64 or raw bytes via text
            try { JSON.parse(text); } catch {
              const base64 = Buffer.from(text, "binary").toString("base64");
              return { dataUrl: `data:image/jpeg;base64,${base64}` };
            }
          }
          console.warn(`Pollinations (${buildUrl("")}) unexpected response, trying next...`);
        } else {
          console.warn(`Pollinations AI failed (${res.status})`);
        }
      } catch (err) {
        console.warn(`Pollinations AI error (${buildUrl("")}), trying next...`, err);
      }
    }

    // 3. OpenRouter — FLUX Pro
    if (openrouterKey) {
      try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openrouterKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://learnifyaitool.vercel.app",
          },
          body: JSON.stringify({
            model: "black-forest-labs/flux-1.1-pro",
            messages: [{ role: "user", content: data.prompt }],
          }),
        });

        if (res.ok) {
          const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
          const content = json.choices?.[0]?.message?.content || "";
          const m = content.match(/https?:\/\/[^\s"}]+\.(png|jpg|jpeg|webp)/i);
          if (m) return { dataUrl: m[0] };
        } else {
          const txt = await res.text().catch(() => "");
          console.warn(`OpenRouter FLUX failed (${res.status}): ${txt.slice(0, 120)}`);
        }
      } catch (err) {
        console.warn("OpenRouter FLUX error. Trying Gemini...", err);
      }
    }

    // 4. Gemini 2.5 Flash Image via generateContent
    if (geminiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${geminiKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: data.prompt }] }],
            generationConfig: {
              responseModalities: ["image", "text"],
            },
          }),
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Gemini image API error (${res.status}): ${txt.slice(0, 180)}`);
        }

        const json = (await res.json()) as {
          candidates?: Array<{ content?: { parts?: Array<{ inlineData?: { mimeType: string; data: string } }> } }>;
        };
        const inline = json.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (inline?.inlineData?.data) {
          return { dataUrl: `data:${inline.inlineData.mimeType};base64,${inline.inlineData.data}` };
        }
      } catch (err: any) {
        console.warn("Gemini image gen failed. Trying Stability AI...", err);
      }
    }

    // 5. Stability AI (SD3 / SDXL)
    if (stabilityKey) {
      try {
        const sizeMap: Record<string, string> = {
          "1024x1024": "1024x1024",
          "1536x1024": "1536x1024",
          "1024x1536": "1024x1536",
        };
        const size = sizeMap[data.size] || "1024x1024";
        const res = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${stabilityKey}`,
            Accept: "application/json",
          },
          body: (() => {
            const form = new FormData();
            form.append("prompt", data.prompt);
            form.append("output_format", "webp");
            form.append("aspect_ratio", size.replace("x", ":"));
            return form;
          })(),
        });

        if (res.ok) {
          const json = await res.json() as { image?: string };
          if (json.image) return { dataUrl: `data:image/webp;base64,${json.image}` };
        } else {
          const txt = await res.text().catch(() => "");
          console.warn(`Stability AI failed (${res.status}): ${txt.slice(0, 120)}`);
        }
      } catch (err) {
        console.warn("Stability AI error. Trying Fal AI...", err);
      }
    }

    // 6. Fal AI (FLUX / SD3)
    if (falKey) {
      try {
        const res = await fetch("https://fal.run/fal-ai/flux-pro/v1.1-ultra", {
          method: "POST",
          headers: {
            Authorization: `Key ${falKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: data.prompt,
            image_size: data.size === "1536x1024" ? "landscape_4_3" : data.size === "1024x1536" ? "portrait_4_3" : "square_hd",
            num_images: 1,
            output_format: "jpeg",
          }),
        });

        if (res.ok) {
          const json = await res.json() as { images?: Array<{ url?: string }> };
          const url = json.images?.[0]?.url;
          if (url) return { dataUrl: url };
        } else {
          const txt = await res.text().catch(() => "");
          console.warn(`Fal AI failed (${res.status}): ${txt.slice(0, 120)}`);
        }
      } catch (err) {
        console.warn("Fal AI error.", err);
      }
    }

    throw new Error(
      "Image generation failed. All providers exhausted. Check your API keys or try again later.",
    );
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
