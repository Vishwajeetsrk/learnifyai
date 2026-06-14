import { c as createServerRpc } from "./createServerRpc-0AUf3IhG.mjs";
import { b as createServerFn } from "./server-BLOOEPZP.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BVm8xUae.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, e as enumType, s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
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
const generateCourseThumbnail_createServerFn_handler = createServerRpc({
  id: "52e8b3a8374cfc4c7f341db1275eccec848f905cddd81b72ce7910e92d6ebb98",
  name: "generateCourseThumbnail",
  filename: "src/lib/thumbnail.functions.ts"
}, (opts) => generateCourseThumbnail.__executeServer(opts));
const generateCourseThumbnail = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => Input.parse(data)).handler(generateCourseThumbnail_createServerFn_handler, async ({
  data
}) => {
  const safety = checkThumbnailPromptSafety(data.prompt);
  if (safety) throw new Error(safety);
  const lovableKey = process.env.LOVABLE_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  if (lovableKey) {
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [{
            role: "user",
            content: `${data.prompt}

(Render at ${data.size}.)`
          }],
          modalities: ["image", "text"]
        })
      });
      if (res.ok) {
        const json = await res.json();
        const url = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        if (url) return {
          dataUrl: url
        };
      } else {
        console.warn(`Lovable image generation failed (${res.status}). Trying fallback...`);
      }
    } catch (err) {
      console.warn("Lovable image generation error. Trying fallback...", err);
    }
  }
  if (geminiKey) {
    try {
      const aspectRatio = data.size === "1024x1024" ? "1:1" : data.size === "1024x1536" ? "3:4" : "4:3";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages?key=${geminiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: data.prompt,
          numberOfImages: 1,
          outputMimeType: "image/jpeg",
          aspectRatio
        })
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Gemini Imagen API error (${res.status}): ${txt.slice(0, 180)}`);
      }
      const json = await res.json();
      const base64Bytes = json.generatedImages?.[0]?.image?.imageBytes;
      if (base64Bytes) {
        return {
          dataUrl: `data:image/jpeg;base64,${base64Bytes}`
        };
      }
    } catch (err) {
      throw new Error(`Image generation failed: ${err.message || err}`);
    }
  }
  throw new Error("No image generation service configured. Please provide GEMINI_API_KEY or LOVABLE_API_KEY.");
});
export {
  generateCourseThumbnail_createServerFn_handler
};
