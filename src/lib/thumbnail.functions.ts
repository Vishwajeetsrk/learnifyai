import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const Input = z.object({
  prompt: z.string().min(3).max(8000),
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
    "gore",
    "blood splatter",
    "violence against",
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
  // Reject file paths / image references — AI models can't read images from prompts
  if (/\.(png|jpg|jpeg|gif|webp|bmp|svg)\b/i.test(prompt))
    return "Image files cannot be used as prompts. Describe what you want the thumbnail to look like in words.";
  if (/^[\w-]+\.[a-z]{2,4}$/.test(prompt.trim()))
    return "That looks like a filename. Enter a text description of the thumbnail instead.";
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

    // 1. Gemini 2.0 Flash Image Generation — best free tier, excellent text rendering
    if (geminiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${geminiKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: data.prompt.slice(0, 1400) }] }],
            generationConfig: {
              responseModalities: ["Image", "Text"],
            },
          }),
        });

        if (res.ok) {
          const json = (await res.json()) as {
            candidates?: Array<{
              content?: { parts?: Array<{ inlineData?: { mimeType: string; data: string } }> };
            }>;
          };
          const inline = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
          if (inline?.inlineData?.data) {
            return {
              dataUrl: `data:${inline.inlineData.mimeType};base64,${inline.inlineData.data}`,
            };
          }
        } else {
          const txt = await res.text().catch(() => "");
          console.warn(`Gemini image API error (${res.status}): ${txt.slice(0, 120)}`);
        }
      } catch (err) {
        console.warn("Gemini failed. Trying Stability AI...", err);
      }
    }

    // 2. Stability AI (SD3 / SDXL) — paid, sharp text rendering
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
          const json = (await res.json()) as { image?: string };
          if (json.image) return { dataUrl: `data:image/webp;base64,${json.image}` };
        } else {
          const txt = await res.text().catch(() => "");
          console.warn(`Stability AI failed (${res.status}): ${txt.slice(0, 120)}`);
        }
      } catch (err) {
        console.warn("Stability AI error. Trying OpenRouter FLUX...", err);
      }
    }

    // 3. OpenRouter — FLUX Pro (paid, great text)
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
          const json = (await res.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
          };
          const content = json.choices?.[0]?.message?.content || "";
          const m = content.match(/https?:\/\/[^\s"}]+\.(png|jpg|jpeg|webp)/i);
          if (m) return { dataUrl: m[0] };
        } else {
          const txt = await res.text().catch(() => "");
          console.warn(`OpenRouter FLUX failed (${res.status}): ${txt.slice(0, 120)}`);
        }
      } catch (err) {
        console.warn("OpenRouter FLUX error.", err);
      }
    }

    // 4. Hugging Face (free fallback)
    if (hfKey) {
      try {
        const res = await fetch(
          "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${hfKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: data.prompt.slice(0, 500) }),
          },
        );
        if (res.ok) {
          const blob = await res.arrayBuffer();
          const base64 = Buffer.from(blob).toString("base64");
          return { dataUrl: `data:image/jpeg;base64,${base64}` };
        }
      } catch (err) {
        console.warn("Hugging Face error.", err);
      }
    }

    // 5. Pollinations AI (with API key — last resort)
    const pollinationsApiKey = process.env.POLLINATIONS_API_KEY || "";
    const pollinationsUrls = [
      (p: string) => `https://image.pollinations.ai/prompt/${p}?model=flux&nofeed=true`,
      (p: string) => `https://gen.pollinations.ai/image/${p}?model=flux&nofeed=true`,
    ];
    for (const buildUrl of pollinationsUrls) {
      try {
        const pw = encodeURIComponent(data.prompt.slice(0, 400));
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 20000);
        const headers: Record<string, string> = { Accept: "image/*, */*" };
        if (pollinationsApiKey) headers["Authorization"] = `Bearer ${pollinationsApiKey}`;
        const res = await fetch(buildUrl(pw), {
          signal: controller.signal,
          headers,
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
            try {
              JSON.parse(text);
            } catch {
              const base64 = Buffer.from(text, "binary").toString("base64");
              return { dataUrl: `data:image/jpeg;base64,${base64}` };
            }
          }
        }
      } catch (err) {
        console.warn(`Pollinations error.`, err);
      }
    }

    // 6. Fal AI (paid fallback)
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
            image_size:
              data.size === "1536x1024"
                ? "landscape_4_3"
                : data.size === "1024x1536"
                  ? "portrait_4_3"
                  : "square_hd",
            num_images: 1,
            output_format: "jpeg",
          }),
        });
        if (res.ok) {
          const json = (await res.json()) as { images?: Array<{ url?: string }> };
          const url = json.images?.[0]?.url;
          if (url) return { dataUrl: url };
        }
      } catch (err) {
        console.warn("Fal AI error.", err);
      }
    }

    // 7. Last resort: generate a local SVG thumbnail (always works, no API needed)
    try {
      const title = data.prompt.slice(0, 80).replace(/["<>]/g, "");
      const esc = (s: string) =>
        s
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
      const lines: string[] = [];
      let line = "";
      for (const word of title.split(" ")) {
        if ((line + " " + word).length > 20) {
          if (line) lines.push(line);
          line = word;
        } else line = line ? line + " " + word : word;
      }
      if (line) lines.push(line);
      const clamped = lines.slice(0, 4);
      const fontSize = clamped.length <= 2 ? 110 : clamped.length === 3 ? 88 : 72;
      const textYStart = clamped.length <= 2 ? 440 : 380;
      const lineH = clamped.length <= 2 ? 130 : 110;
      const padX = 60;
      const padY = 20;
      const textLines = clamped
        .map((l, i) => {
          const y = textYStart + i * lineH;
          const textW = l.length * fontSize * 0.55;
          return `
          <rect x="${768 - textW / 2 - padX}" y="${y - fontSize - padY + 14}" width="${textW + padX * 2}" height="${fontSize + padY * 2}" rx="12" fill="#000000" fill-opacity="0.55"/>
          <text x="768" y="${y}" text-anchor="middle" fill="#ffffff" font-family="Arial,Helvetica,system-ui,sans-serif" font-size="${fontSize}" font-weight="900" letter-spacing="-0.5">${esc(l)}</text>`;
        })
        .join("\n        ");
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1024" viewBox="0 0 1536 1024">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0f172a"/>
            <stop offset="40%" style="stop-color:#1e1b4b"/>
            <stop offset="100%" style="stop-color:#312e81"/>
          </linearGradient>
        </defs>
        <rect width="1536" height="1024" fill="url(#bg)"/>
        <circle cx="200" cy="900" r="550" fill="#fde68a" opacity="0.05"/>
        <circle cx="1400" cy="200" r="450" fill="#c7d2fe" opacity="0.05"/>
        ${textLines}
        <rect x="618" y="920" width="300" height="3" rx="1.5" fill="#a5b4fc" opacity="0.4"/>
        <text x="768" y="895" text-anchor="middle" fill="#a5b4fc" font-family="Arial,Helvetica,system-ui,sans-serif" font-size="26" font-weight="700" letter-spacing="4">LEARNIFY AI</text>
      </svg>`;
      const base64 = Buffer.from(svg, "utf-8").toString("base64");
      return { dataUrl: `data:image/svg+xml;base64,${base64}` };
    } catch (_) {
      throw new Error(
        "Image generation failed. All providers exhausted. Check your API keys or try again later.",
      );
    }
  });

export const THUMBNAIL_STYLES = [
  {
    id: "bold",
    label: "Bold & Modern",
    hint: "vibrant gradient, large bold typography, high contrast",
  },
  {
    id: "retro_flat",
    label: "Retro Flat Vector",
    hint: "mint green or flat pastel background, bold offset 3D shadow text, clean 2D vector illustrations, wireframes, cursor arrow, retro comic outline aesthetic",
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
  const styleObj = THUMBNAIL_STYLES.find((s) => s.id === opts.style) ?? THUMBNAIL_STYLES[0];
  const titleText = opts.title.length > 120 ? opts.title.slice(0, 117) + "..." : opts.title;

  return `
Generate a premium educational course thumbnail for: "${titleText}"
Category: ${opts.category ?? "General Education"}
Description: ${opts.description?.slice(0, 300) ?? "None"}
First lesson: ${opts.lessonHint?.slice(0, 240) ?? "None"}

Style: ${styleObj.label} — ${styleObj.hint}
Colors: ${opts.colors || "Auto premium palette based on category"}

CRITICAL: The illustration MUST be directly related to "${titleText}" and "${opts.category}". If it's a programming course, show code, terminal, computer, UI, or tech illustration. If it's marketing, show charts, growth, funnel, analytics. If it's data science, show data visualization, charts, AI. Create a relevant visual that matches the course subject.

Layout: 1536x1024 landscape. Title text on left (35-45% of canvas), relevant illustration on right. Large bold title, clear typography, high contrast, premium quality.

Design: Make it look like a Udemy/Coursera premium course thumbnail. ${styleObj.hint}. Professional lighting, modern composition, no clutter.

IMPORTANT - TEXT: Only show the course title "${titleText}". No other text, no description, no bullet points, no watermarks, no logos, no UI elements, no fake buttons. Just the title in large bold font.

Avoid: blurry, low quality, pixelated, hands, faces, real people, watermarks, extra text, paragraphs, misspelled words, clipart, flat lighting.
  `.trim();
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
