export type CertElement = {
  id: string;
  type: "text" | "image" | "qr" | "org_logo" | "signature" | "badge";
  content?: string;
  url?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  
  // Text Styling
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  align?: "left" | "center" | "right" | "justify";
  fontWeight?: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline" | "line-through";
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  
  // Effects
  opacity?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
};

export type CertDesign = {
  accent_color: string;
  bg_color: string;
  text_color: string;
  accent_color_2?: string | null;
  font_family: string;
  title_font?: string | null;
  body_font?: string | null;
  
  border_style: string;
  border_width: number;
  corner_style: string;
  
  background_pattern: string;
  layout: string;
};

export type CertTemplate = {
  id?: string;
  name: string;
  type: string;
  layout: string;
  bg_image_url?: string | null;
  config_json: { elements: CertElement[]; design: CertDesign };
};

export const DEFAULT_DESIGN: CertDesign = {
  accent_color: "#c9a84c",
  bg_color: "#fdfbf5",
  text_color: "#0f1b3d",
  font_family: "Playfair Display",
  border_style: "double",
  border_width: 10,
  corner_style: "diagonal",
  background_pattern: "none",
  layout: "classic",
};

export const FONTS = [
  { value: "Inter", label: "Inter", category: "sans" },
  { value: "Poppins", label: "Poppins", category: "sans" },
  { value: "Manrope", label: "Manrope", category: "sans" },
  { value: "DM Sans", label: "DM Sans", category: "sans" },
  { value: "Montserrat", label: "Montserrat", category: "sans" },
  { value: "Outfit", label: "Outfit", category: "sans" },
  { value: "Sora", label: "Sora", category: "sans" },
  { value: "Playfair Display", label: "Playfair Display", category: "serif" },
  { value: "Merriweather", label: "Merriweather", category: "serif" },
  { value: "Lora", label: "Lora", category: "serif" },
  { value: "Cormorant Garamond", label: "Cormorant Garamond", category: "serif" },
  { value: "Cinzel", label: "Cinzel", category: "serif" },
  { value: "Libre Baskerville", label: "Libre Baskerville", category: "serif" },
  { value: "Great Vibes", label: "Great Vibes", category: "script" },
  { value: "Dancing Script", label: "Dancing Script", category: "script" },
  { value: "Oswald", label: "Oswald", category: "sans" },
  { value: "Roboto Mono", label: "Roboto Mono", category: "mono" },
];

export const BORDER_OPTIONS = [
  { id: "none", label: "None", icon: "○" },
  { id: "solid", label: "Solid", icon: "━" },
  { id: "double", label: "Double", icon: "═" },
  { id: "dashed", label: "Dashed", icon: "╍" },
  { id: "dotted", label: "Dotted", icon: "⸬" },
  { id: "ornate", label: "Ornate", icon: "☰" },
  { id: "luxury", label: "Luxury", icon: "❖" },
  { id: "ribbon", label: "Ribbon", icon: "🎀" },
];

export const PATTERN_OPTIONS = [
  { id: "none", label: "Solid", preview: null },
  { id: "gradient", label: "Linear Gradient", preview: "gradient" },
  { id: "mesh", label: "Mesh Gradient", preview: "mesh" },
  { id: "dots", label: "Dots", preview: "dots" },
  { id: "grid", label: "Grid", preview: "grid" },
  { id: "diagonal", label: "Stripes", preview: "diagonal" },
  { id: "noise", label: "Noise", preview: "noise" },
  { id: "glass", label: "Glass", preview: "glass" },
];

export const THEMES = [
  {
    id: "executive-gold",
    name: "Executive Gold",
    desc: "Navy + Gold — classic prestige",
    accent: "#c9a84c",
    bg: "#0f1b3d",
    text: "#fdfbf5",
    accent2: "#8a6d2b",
    font: "Playfair Display",
    border: "double",
    borderWidth: 10,
    corner: "diagonal",
    pattern: "none",
    layout: "classic",
  },
  {
    id: "modern-corporate",
    name: "Modern Corporate",
    desc: "Clean white + blue — sleek",
    accent: "#2563eb",
    bg: "#ffffff",
    text: "#1e293b",
    accent2: "#60a5fa",
    font: "Inter",
    border: "solid",
    borderWidth: 6,
    corner: "none",
    pattern: "none",
    layout: "modern",
  },
  {
    id: "university-style",
    name: "University Style",
    desc: "Cream + crimson — academic",
    accent: "#8b0000",
    bg: "#fdfbf5",
    text: "#1a1a1a",
    accent2: "#c62828",
    font: "Cinzel",
    border: "ornate",
    borderWidth: 12,
    corner: "ribbon",
    pattern: "none",
    layout: "elegant",
  },
  {
    id: "creator-academy",
    name: "Creator Academy",
    desc: "Dark + vibrant — modern bold",
    accent: "#e94560",
    bg: "#1a1a2e",
    text: "#eaeaea",
    accent2: "#0f3460",
    font: "Montserrat",
    border: "dashed",
    borderWidth: 4,
    corner: "none",
    pattern: "dots",
    layout: "minimal",
  },
  {
    id: "nature-green",
    name: "Nature Green",
    desc: "Soft green + emerald — fresh",
    accent: "#16a34a",
    bg: "#f0fdf4",
    text: "#052e16",
    accent2: "#86efac",
    font: "Merriweather",
    border: "solid",
    borderWidth: 8,
    corner: "none",
    pattern: "none",
    layout: "classic",
  },
  {
    id: "royal-purple",
    name: "Royal Purple",
    desc: "Deep purple + amethyst — regal",
    accent: "#a855f7",
    bg: "#2e1065",
    text: "#f5f3ff",
    accent2: "#7c3aed",
    font: "Cormorant Garamond",
    border: "double",
    borderWidth: 10,
    corner: "diagonal",
    pattern: "gradient",
    layout: "elegant",
  },
  {
    id: "ocean-teal",
    name: "Ocean Teal",
    desc: "Cyan + teal — calm, modern",
    accent: "#0d9488",
    bg: "#ecfeff",
    text: "#134e4a",
    accent2: "#5eead4",
    font: "Poppins",
    border: "ornate",
    borderWidth: 8,
    corner: "none",
    pattern: "none",
    layout: "minimal",
  },
  {
    id: "midnight-amber",
    name: "Midnight Amber",
    desc: "Dark slate + amber — premium",
    accent: "#f59e0b",
    bg: "#111827",
    text: "#f9fafb",
    accent2: "#d97706",
    font: "Oswald",
    border: "double",
    borderWidth: 8,
    corner: "diagonal",
    pattern: "dots",
    layout: "classic",
  },
  {
    id: "rose-gold",
    name: "Rose Gold",
    desc: "Blush + rose — elegant chic",
    accent: "#e11d48",
    bg: "#fff1f2",
    text: "#4c0519",
    accent2: "#fb7185",
    font: "Great Vibes",
    border: "solid",
    borderWidth: 6,
    corner: "ribbon",
    pattern: "gradient",
    layout: "elegant",
  },
];
