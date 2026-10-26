/**
 * Learnify AI — Product Updates & Changelog Data Store
 * Powers /updates and Admin Content Manager.
 */

export interface ProductUpdate {
  id: string;
  version: string;
  releaseDate: string; // e.g. "Oct 26, 2026" or "Jul 24, 2026"
  title: string;
  summary?: string;
  mediaType: "video" | "image";
  mediaUrl: string;
  badge?: string;
  bulletPoints: string[];
  isPublished: boolean;
  order: number;
}

export const DEFAULT_PRODUCT_UPDATES: ProductUpdate[] = [
  {
    id: "update-v4-2",
    version: "v4.2",
    releaseDate: "Oct 26, 2026",
    title: "Learnify Studio, Multi-Video Playlists & Realtime Explainer Engine",
    summary: "Introducing continuous multi-video curriculums, cute practice checkpoints, and instant video download.",
    mediaType: "video",
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-code-on-a-computer-screen-40763-large.mp4",
    badge: "Major Release",
    bulletPoints: [
      "Continuous multi-video playlist engine for complete curriculums (HTML, Java, Python, React, AI)",
      "Cute practice checkpoints (⭐, 🎯, ⚡) with auto-pause, hint assistant, and solutions",
      "Full 1080p MP4 lesson video exporter rendering all storyboard scenes with narration",
      "Real-time canvas screenshot reporting for instant admin triage with visual feedback",
      "AI Knowledge Cache with sub-second accuracy and verified specs",
      "Brand-new ultra-sleek footer with watermark typography and creator badge",
    ],
    isPublished: true,
    order: 1,
  },
  {
    id: "update-v4-1",
    version: "v4.1",
    releaseDate: "Oct 12, 2026",
    title: "Synchronized Captions, Multi-Language Audio & Studio Drag-and-Drop",
    summary: "Multilingual narration in 6 languages and visual caption modes.",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    badge: "Feature Drop",
    bulletPoints: [
      "Voice narration in 6 languages: English, Hindi/Hinglish, Spanish, French, German, Japanese",
      "4 visual caption styles: Glass Pill, Viral Karaoke, Cinema Bar, Cyber Terminal",
      "Drag-and-drop workspace layout with customizable panel split ratios",
      "Interactive code runner with live browser DOM reload",
      "Ambient drone synthesizer with Web Audio API harmonic drones",
    ],
    isPublished: true,
    order: 2,
  },
  {
    id: "update-v4-0",
    version: "v4.0",
    releaseDate: "Sep 28, 2026",
    title: "Learnify AI 4.0 — The AI-Native Learning & Career Operating System",
    summary: "The next evolution of developer education in India.",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    badge: "Genesis Release",
    bulletPoints: [
      "Verified QR-code digital certificates with LinkedIn one-click license sharing",
      "24/7 AI tutor embedded inside lessons with real-time code fixes",
      "Automated ATS resume matching and full-stack placement roadmaps",
      "Digital Store with XP redeemable software kits and developer boilerplates",
      "GST-compliant automated invoicing with Cashfree and UPI payments",
    ],
    isPublished: true,
    order: 3,
  },
];

const STORAGE_KEY = "learnify_product_updates";

export function getProductUpdates(): ProductUpdate[] {
  if (typeof window === "undefined") return DEFAULT_PRODUCT_UPDATES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PRODUCT_UPDATES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PRODUCT_UPDATES;
  } catch {
    return DEFAULT_PRODUCT_UPDATES;
  }
}

export function saveProductUpdates(updates: ProductUpdate[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updates));
    window.dispatchEvent(new Event("learnify_updates_changed"));
  } catch (e) {
    console.error("Failed to save product updates", e);
  }
}
