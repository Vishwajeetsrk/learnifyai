export type StoreCategory =
  | "all"
  | "templates"
  | "software"
  | "books_guides"
  | "website_designs"
  | "tools"
  | "cosmetics";

export interface DigitalProductMeta {
  downloadUrl: string;
  demoUrl: string;
  format: string;
  size: string;
  extraPerks: string[];
}

export function parseProductMetadata(perks?: string[] | null): DigitalProductMeta {
  const meta: DigitalProductMeta = {
    downloadUrl: "",
    demoUrl: "",
    format: "",
    size: "",
    extraPerks: [],
  };

  if (!Array.isArray(perks)) return meta;

  for (const item of perks) {
    if (typeof item !== "string") continue;
    const trimmed = item.trim();
    if (trimmed.startsWith("download:")) {
      meta.downloadUrl = trimmed.slice("download:".length).trim();
    } else if (trimmed.startsWith("demo:")) {
      meta.demoUrl = trimmed.slice("demo:".length).trim();
    } else if (trimmed.startsWith("format:")) {
      meta.format = trimmed.slice("format:".length).trim();
    } else if (trimmed.startsWith("size:")) {
      meta.size = trimmed.slice("size:".length).trim();
    } else if (trimmed) {
      meta.extraPerks.push(trimmed);
    }
  }

  return meta;
}

export function buildProductPerks(data: {
  downloadUrl?: string;
  demoUrl?: string;
  format?: string;
  size?: string;
  extraPerks?: string[] | string;
}): string[] {
  const list: string[] = [];
  if (data.downloadUrl?.trim()) list.push(`download:${data.downloadUrl.trim()}`);
  if (data.demoUrl?.trim()) list.push(`demo:${data.demoUrl.trim()}`);
  if (data.format?.trim()) list.push(`format:${data.format.trim()}`);
  if (data.size?.trim()) list.push(`size:${data.size.trim()}`);

  if (Array.isArray(data.extraPerks)) {
    for (const p of data.extraPerks) {
      if (p?.trim()) list.push(p.trim());
    }
  } else if (typeof data.extraPerks === "string" && data.extraPerks.trim()) {
    data.extraPerks
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((s) => list.push(s));
  }

  return list;
}

export const PRODUCT_CATEGORIES = [
  { id: "templates", label: "Templates & Notion", icon: "LayoutTemplate", desc: "Next.js, React, Tailwind, and Notion templates" },
  { id: "software", label: "Software & Code", icon: "Code2", desc: "Production apps, scripts, boilerplates, and utilities" },
  { id: "books_guides", label: "Books & Guides", icon: "BookOpen", desc: "eBooks, interview handbooks, and PDF cheat sheets" },
  { id: "website_designs", label: "Website Designs", icon: "Palette", desc: "Figma UI kits, landing page templates, and design systems" },
  { id: "tools", label: "Tools & Utilities", icon: "Wrench", desc: "Developer tools, workflow automations, and AI prompts" },
  { id: "cosmetics", label: "Cosmetics & Themes", icon: "Sparkles", desc: "Badges, profile customizations, and themes" },
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  templates: "Templates & Notion",
  software: "Software & Code",
  books_guides: "Books & Guides",
  website_designs: "Website Designs",
  tools: "Tools & Utilities",
  cosmetics: "Cosmetics & Themes",
};
