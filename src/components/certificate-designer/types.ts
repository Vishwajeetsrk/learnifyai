export type CertElementType =
  | "text"
  | "image"
  | "qr"
  | "org_logo"
  | "signature"
  | "badge"
  | "seal_icon"
  | "guilloche_watermark"
  | "divider_line"
  | "svg"
  | "shape"
  | "date"
  | "table"
  | "watermark";

export type ShapeType =
  "rect" | "circle" | "triangle" | "diamond" | "line" | "hexagon" | "star" | "heart";

export type CertElement = {
  id: string;
  type: CertElementType;
  content?: string;
  url?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  hidden?: boolean;
  locked?: boolean;
  zIndex?: number;

  // Text Styling
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  align?: "left" | "center" | "right" | "justify";
  fontWeight?:
    "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
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

  // SVG specific
  svgContent?: string;
  svgColor?: string;

  // Shape specific
  shapeType?: ShapeType;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  borderRadius?: number;

  // Table specific
  rows?: number;
  cols?: number;
  cellPadding?: number;
  borderColor?: string;
  headerBg?: string;

  // Date specific
  dateFormat?: string;

  // Label for layers panel
  label?: string;
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
  show_bg_image?: boolean;
};

export type CertTemplate = {
  id?: string;
  name: string;
  type: string;
  layout: string;
  bg_image_url?: string | null;
  config_json: { elements: CertElement[]; design: CertDesign };
};

export type Certificate = {
  id: string;
  title: string;
  courseTitle?: string;
  status: "active" | "draft" | "revoked";
  recipientName?: string;
  code?: string;
  issuedAt?: string;
  expiresAt?: string;
  [key: string]: any;
};

export type Verification = {
  id: string;
  code: string;
  recipientName: string;
  courseTitle: string;
  status: "verified" | "invalid" | "expired";
  verifiedAt: string;
  ip?: string;
  [key: string]: any;
};

export type EditorHistory = {
  past: { elements: CertElement[]; design: CertDesign }[];
  future: { elements: CertElement[]; design: CertDesign }[];
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
  // Sans-serif
  { value: "Inter", label: "Inter", category: "sans" },
  { value: "Poppins", label: "Poppins", category: "sans" },
  { value: "Manrope", label: "Manrope", category: "sans" },
  { value: "DM Sans", label: "DM Sans", category: "sans" },
  { value: "Montserrat", label: "Montserrat", category: "sans" },
  { value: "Outfit", label: "Outfit", category: "sans" },
  { value: "Sora", label: "Sora", category: "sans" },
  { value: "Oswald", label: "Oswald", category: "sans" },
  { value: "Raleway", label: "Raleway", category: "sans" },
  { value: "Nunito", label: "Nunito", category: "sans" },
  { value: "Work Sans", label: "Work Sans", category: "sans" },
  { value: "Source Sans 3", label: "Source Sans 3", category: "sans" },
  { value: "Barlow", label: "Barlow", category: "sans" },
  { value: "Rubik", label: "Rubik", category: "sans" },
  { value: "Space Grotesk", label: "Space Grotesk", category: "sans" },
  { value: "Archivo", label: "Archivo", category: "sans" },
  { value: "Plus Jakarta Sans", label: "Plus Jakarta Sans", category: "sans" },
  { value: "Figtree", label: "Figtree", category: "sans" },
  { value: "Lexend", label: "Lexend", category: "sans" },
  { value: "Urbanist", label: "Urbanist", category: "sans" },
  // Serif
  { value: "Playfair Display", label: "Playfair Display", category: "serif" },
  { value: "Merriweather", label: "Merriweather", category: "serif" },
  { value: "Lora", label: "Lora", category: "serif" },
  { value: "Cormorant Garamond", label: "Cormorant Garamond", category: "serif" },
  { value: "Cinzel", label: "Cinzel", category: "serif" },
  { value: "Libre Baskerville", label: "Libre Baskerville", category: "serif" },
  { value: "EB Garamond", label: "EB Garamond", category: "serif" },
  { value: "Crimson Text", label: "Crimson Text", category: "serif" },
  { value: "Bitter", label: "Bitter", category: "serif" },
  { value: "Cardo", label: "Cardo", category: "serif" },
  { value: "Spectral", label: "Spectral", category: "serif" },
  { value: "Vollkorn", label: "Vollkorn", category: "serif" },
  // Script / Handwriting
  { value: "Great Vibes", label: "Great Vibes", category: "script" },
  { value: "Dancing Script", label: "Dancing Script", category: "script" },
  { value: "Pacifico", label: "Pacifico", category: "script" },
  { value: "Satisfy", label: "Satisfy", category: "script" },
  { value: "Sacramento", label: "Sacramento", category: "script" },
  { value: "Alex Brush", label: "Alex Brush", category: "script" },
  { value: "Allura", label: "Allura", category: "script" },
  { value: "Lobster", label: "Lobster", category: "script" },
  { value: "Cookie", label: "Cookie", category: "script" },
  { value: "Caveat", label: "Caveat", category: "script" },
  // Display / Decorative
  { value: "Cinzel Decorative", label: "Cinzel Decorative", category: "display" },
  { value: "Uncial Antiqua", label: "Uncial Antiqua", category: "display" },
  { value: "Megrim", label: "Megrim", category: "display" },
  { value: "Orbitron", label: "Orbitron", category: "display" },
  { value: "Abril Fatface", label: "Abril Fatface", category: "display" },
  { value: "Righteous", label: "Righteous", category: "display" },
  { value: "Bungee", label: "Bungee", category: "display" },
  { value: "Black Ops One", label: "Black Ops One", category: "display" },
  // Monospace
  { value: "Roboto Mono", label: "Roboto Mono", category: "mono" },
  { value: "JetBrains Mono", label: "JetBrains Mono", category: "mono" },
  { value: "Fira Code", label: "Fira Code", category: "mono" },
  { value: "Source Code Pro", label: "Source Code Pro", category: "mono" },
  { value: "IBM Plex Mono", label: "IBM Plex Mono", category: "mono" },
  // Custom (Giant Font Bundle)
  { value: "Aladin", label: "Aladin", category: "custom" },
  { value: "Aldebara", label: "Aldebara", category: "custom" },
  { value: "Alphabet Wave", label: "Alphabet Wave", category: "custom" },
  { value: "Amoxan", label: "Amoxan", category: "custom" },
  { value: "animasi eyes", label: "animasi eyes", category: "custom" },
  { value: "Annabelle", label: "Annabelle", category: "custom" },
  { value: "Azhitromicin", label: "Azhitromicin", category: "custom" },
  { value: "Baby Cute", label: "Baby Cute", category: "custom" },
  { value: "Baby doll", label: "Baby doll", category: "custom" },
  { value: "BALOTAK", label: "BALOTAK", category: "custom" },
  { value: "Beautiful leaves", label: "Beautiful leaves", category: "custom" },
  { value: "BELAROSA", label: "BELAROSA", category: "custom" },
  { value: "Black Forest", label: "Black Forest", category: "custom" },
  { value: "Blue ocean", label: "Blue ocean", category: "custom" },
  { value: "Booster", label: "Booster", category: "custom" },
  { value: "Bougenville flowers", label: "Bougenville flowers", category: "custom" },
  { value: "broken Heart", label: "broken Heart", category: "custom" },
  { value: "Browie", label: "Browie", category: "custom" },
  { value: "BUBBLE BOBA", label: "BUBBLE BOBA", category: "custom" },
  { value: "Butterfly", label: "Butterfly", category: "custom" },
  { value: "cakiss", label: "cakiss", category: "custom" },
  { value: "Cattrine", label: "Cattrine", category: "custom" },
  { value: "Ceftriaxon", label: "Ceftriaxon", category: "custom" },
  { value: "Charles", label: "Charles", category: "custom" },
  { value: "Cheerful Year", label: "Cheerful Year", category: "custom" },
  { value: "Christmas", label: "Christmas", category: "custom" },
  { value: "Coffee Break", label: "Coffee Break", category: "custom" },
  { value: "Coffee Robusta", label: "Coffee Robusta", category: "custom" },
  { value: "Crunchy", label: "Crunchy", category: "custom" },
  { value: "CUTE LOVE", label: "CUTE LOVE", category: "custom" },
  { value: "Cutes", label: "Cutes", category: "custom" },
  { value: "Delicious Food", label: "Delicious Food", category: "custom" },
  { value: "Devil Beside You", label: "Devil Beside You", category: "custom" },
  { value: "DIAMOND", label: "DIAMOND", category: "custom" },
  { value: "Digital Marketing", label: "Digital Marketing", category: "custom" },
  { value: "Donuts", label: "Donuts", category: "custom" },
  { value: "Emerald", label: "Emerald", category: "custom" },
  { value: "everybody", label: "everybody", category: "custom" },
  { value: "explore", label: "explore", category: "custom" },
  { value: "flowers", label: "flowers", category: "custom" },
  { value: "FRIENDLY", label: "FRIENDLY", category: "custom" },
  { value: "Funny Kids (1)", label: "Funny Kids (1)", category: "custom" },
  { value: "Gendis Flower", label: "Gendis Flower", category: "custom" },
  { value: "Georgia", label: "Georgia", category: "custom" },
  { value: "GEORGIOS", label: "GEORGIOS", category: "custom" },
  { value: "Golden Pumpkin", label: "Golden Pumpkin", category: "custom" },
  { value: "Greentea Milkshake", label: "Greentea Milkshake", category: "custom" },
  { value: "Gupis", label: "Gupis", category: "custom" },
  { value: "Halloween", label: "Halloween", category: "custom" },
  { value: "Happy Christmas", label: "Happy Christmas", category: "custom" },
  { value: "Happy New Year", label: "Happy New Year", category: "custom" },
  { value: "Happy Shopping", label: "Happy Shopping", category: "custom" },
  { value: "Happy weekend", label: "Happy weekend", category: "custom" },
  { value: "Hello Christmas", label: "Hello Christmas", category: "custom" },
  { value: "Hello Winter", label: "Hello Winter", category: "custom" },
  { value: "Hellow January", label: "Hellow January", category: "custom" },
  { value: "Hidrocloroquin", label: "Hidrocloroquin", category: "custom" },
  { value: "Hollster", label: "Hollster", category: "custom" },
  { value: "Honeymoon", label: "Honeymoon", category: "custom" },
  { value: "Jelline", label: "Jelline", category: "custom" },
  { value: "JONS", label: "JONS", category: "custom" },
  { value: "Just Friend", label: "Just Friend", category: "custom" },
  { value: "kindergarten", label: "kindergarten", category: "custom" },
  { value: "Krriiukk", label: "Krriiukk", category: "custom" },
  { value: "Leaf", label: "Leaf", category: "custom" },
  { value: "Lets go to school", label: "Lets go to school", category: "custom" },
  { value: "Lighting", label: "Lighting", category: "custom" },
  { value: "Love Bubbles", label: "Love Bubbles", category: "custom" },
  { value: "Lovely", label: "Lovely", category: "custom" },
  { value: "MandalaClipArt-Regular", label: "MandalaClipArt-Regular", category: "custom" },
  { value: "Manopo", label: "Manopo", category: "custom" },
  { value: "Memoriam", label: "Memoriam", category: "custom" },
  { value: "Mennuah", label: "Mennuah", category: "custom" },
  { value: "Methilprednisolon", label: "Methilprednisolon", category: "custom" },
  { value: "Michy", label: "Michy", category: "custom" },
  { value: "Miracle Of Christmas", label: "Miracle Of Christmas", category: "custom" },
  { value: "Mom cooking", label: "Mom cooking", category: "custom" },
  { value: "MONOLOG", label: "MONOLOG", category: "custom" },
  { value: "Moo Milky", label: "Moo Milky", category: "custom" },
  { value: "MOUW", label: "MOUW", category: "custom" },
  { value: "My Princess", label: "My Princess", category: "custom" },
  { value: "Naturally", label: "Naturally", category: "custom" },
  { value: "North Star", label: "North Star", category: "custom" },
  { value: "NOTHING", label: "NOTHING", category: "custom" },
  { value: "ONE MORE", label: "ONE MORE", category: "custom" },
  { value: "One Stripe", label: "One Stripe", category: "custom" },
  { value: "Outline", label: "Outline", category: "custom" },
  { value: "Photography", label: "Photography", category: "custom" },
  { value: "Pikachu", label: "Pikachu", category: "custom" },
  { value: "Pillow", label: "Pillow", category: "custom" },
  { value: "Playground", label: "Playground", category: "custom" },
  { value: "Polipuli", label: "Polipuli", category: "custom" },
  { value: "Pompom", label: "Pompom", category: "custom" },
  { value: "POW KIDS", label: "POW KIDS", category: "custom" },
  { value: "Princess", label: "Princess", category: "custom" },
  { value: "PURPLE", label: "PURPLE", category: "custom" },
  { value: "PUZZLE", label: "PUZZLE", category: "custom" },
  { value: "QIWQIW", label: "QIWQIW", category: "custom" },
  { value: "Remember", label: "Remember", category: "custom" },
  { value: "Richeese", label: "Richeese", category: "custom" },
  { value: "Rolling door", label: "Rolling door", category: "custom" },
  { value: "Sand", label: "Sand", category: "custom" },
  { value: "sandra", label: "sandra", category: "custom" },
  { value: "sansan", label: "sansan", category: "custom" },
  { value: "Sansullin", label: "Sansullin", category: "custom" },
  { value: "Santa Claus", label: "Santa Claus", category: "custom" },
  { value: "Saranghae", label: "Saranghae", category: "custom" },
  { value: "Sarapan", label: "Sarapan", category: "custom" },
  { value: "Say Hello", label: "Say Hello", category: "custom" },
  { value: "Scarlove", label: "Scarlove", category: "custom" },
  { value: "SHIZUKA", label: "SHIZUKA", category: "custom" },
  { value: "Sky face", label: "Sky face", category: "custom" },
  { value: "Solaria", label: "Solaria", category: "custom" },
  { value: "Solatip", label: "Solatip", category: "custom" },
  { value: "Squaress", label: "Squaress", category: "custom" },
  { value: "Srengngee", label: "Srengngee", category: "custom" },
  { value: "START-UP", label: "START-UP", category: "custom" },
  { value: "Stay Story", label: "Stay Story", category: "custom" },
  { value: "Stricker", label: "Stricker", category: "custom" },
  { value: "Stripe Calm", label: "Stripe Calm", category: "custom" },
  { value: "Sunshine", label: "Sunshine", category: "custom" },
  { value: "Taro Flowers", label: "Taro Flowers", category: "custom" },
  { value: "Thai tea", label: "Thai tea", category: "custom" },
  { value: "Travelling", label: "Travelling", category: "custom" },
  { value: "Tremor", label: "Tremor", category: "custom" },
  { value: "Unicorn Beautifull", label: "Unicorn Beautifull", category: "custom" },
  { value: "UPNORMAL", label: "UPNORMAL", category: "custom" },
  { value: "wedding knick knacks", label: "wedding knick knacks", category: "custom" },
  { value: "Wedding", label: "Wedding", category: "custom" },
  { value: "Welcome Santa", label: "Welcome Santa", category: "custom" },
  { value: "WILD", label: "WILD", category: "custom" },
  { value: "willy", label: "willy", category: "custom" },
  { value: "Winner", label: "Winner", category: "custom" },
  { value: "Winter Soraya", label: "Winter Soraya", category: "custom" },
];

export const FONT_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "sans", label: "Sans" },
  { id: "serif", label: "Serif" },
  { id: "script", label: "Script" },
  { id: "display", label: "Display" },
  { id: "mono", label: "Mono" },
  { id: "custom", label: "Custom" },
];

export const BORDER_OPTIONS = [
  { id: "none", label: "None", icon: "○" },
  { id: "solid", label: "Solid", icon: "━" },
  { id: "double", label: "Double", icon: "═" },
  { id: "dashed", label: "Dashed", icon: "╍" },
  { id: "dotted", label: "Dotted", icon: "⸬" },
  { id: "ornate", label: "Ornate", icon: "☰" },
  { id: "luxury", label: "Luxury Frame", icon: "❖" },
  { id: "ribbon", label: "Ribbon Frame", icon: "🎀" },
];

export const PATTERN_OPTIONS = [
  { id: "none", label: "Solid Color", preview: null },
  { id: "guilloche", label: "Guilloche Rosette", preview: "guilloche" },
  { id: "waves", label: "Security Waves", preview: "waves" },
  { id: "gradient", label: "Linear Gradient", preview: "gradient" },
  { id: "mesh", label: "Mesh Gradient", preview: "mesh" },
  { id: "dots", label: "Micro Dots", preview: "dots" },
  { id: "grid", label: "Security Grid", preview: "grid" },
  { id: "diagonal", label: "Fine Stripes", preview: "diagonal" },
  { id: "noise", label: "Parchment Texture", preview: "noise" },
  { id: "glass", label: "Glassmorphism", preview: "glass" },
];

export const SHAPE_OPTIONS: { type: ShapeType; label: string; icon: string }[] = [
  { type: "rect", label: "Rectangle", icon: "□" },
  { type: "circle", label: "Circle", icon: "○" },
  { type: "triangle", label: "Triangle", icon: "△" },
  { type: "diamond", label: "Diamond", icon: "◇" },
  { type: "hexagon", label: "Hexagon", icon: "⬡" },
  { type: "star", label: "Star", icon: "☆" },
  { type: "heart", label: "Heart", icon: "♡" },
  { type: "line", label: "Line", icon: "─" },
];

export const SVG_ICONS: { id: string; name: string; category: string; svg: string }[] = [
  // Education
  {
    id: "graduation",
    name: "Graduation Cap",
    category: "education",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  },
  {
    id: "book",
    name: "Book",
    category: "education",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  },
  {
    id: "award",
    name: "Award",
    category: "education",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
  },
  {
    id: "certificate",
    name: "Certificate",
    category: "education",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M7 8h10"/><path d="M7 12h6"/><circle cx="17" cy="19" r="3"/><path d="M17 16v6l-2-1-2 1v-6"/></svg>',
  },
  {
    id: "pencil",
    name: "Pencil",
    category: "education",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>',
  },
  // Achievements
  {
    id: "trophy",
    name: "Trophy",
    category: "achievements",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
  },
  {
    id: "medal",
    name: "Medal",
    category: "achievements",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="M13 12 18.88 2.2"/><circle cx="12" cy="17" r="5"/></svg>',
  },
  {
    id: "star",
    name: "Star",
    category: "achievements",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  },
  {
    id: "crown",
    name: "Crown",
    category: "achievements",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M3 20h18"/></svg>',
  },
  {
    id: "ribbon",
    name: "Ribbon",
    category: "achievements",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3 7h7l-5.5 4.5 2 7L12 16l-6.5 4.5 2-7L2 9h7z"/></svg>',
  },
  // Technology
  {
    id: "code",
    name: "Code",
    category: "technology",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  },
  {
    id: "gear",
    name: "Gear",
    category: "technology",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  },
  {
    id: "cloud",
    name: "Cloud",
    category: "technology",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
  },
  {
    id: "database",
    name: "Database",
    category: "technology",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
  },
  {
    id: "cpu",
    name: "CPU",
    category: "technology",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>',
  },
  // Business
  {
    id: "briefcase",
    name: "Briefcase",
    category: "business",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  },
  {
    id: "chart",
    name: "Chart",
    category: "business",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  },
  {
    id: "globe",
    name: "Globe",
    category: "business",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  },
  {
    id: "users",
    name: "Users",
    category: "business",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  },
  // Nature
  {
    id: "leaf",
    name: "Leaf",
    category: "nature",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 1c1 2 2 4.5 2 8 0 5.5-4.78 11-10 11z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
  },
  {
    id: "sun",
    name: "Sun",
    category: "nature",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  },
  {
    id: "mountain",
    name: "Mountain",
    category: "nature",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3l4 8 5-5 5 15H2z"/></svg>',
  },
  // Decorative
  {
    id: "diamond",
    name: "Diamond",
    category: "decorative",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M2 9h20"/></svg>',
  },
  {
    id: "shield",
    name: "Shield",
    category: "decorative",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  },
  {
    id: "heart",
    name: "Heart",
    category: "decorative",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  },
  {
    id: "sparkle",
    name: "Sparkle",
    category: "decorative",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/><path d="M19 15l.67 2.33L22 18l-2.33.67L19 21l-.67-2.33L16 18l2.33-.67z"/></svg>',
  },
  {
    id: "floral",
    name: "Floral",
    category: "decorative",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.5L12 12l2-2.5c1.2-.7 2-2 2-3.5a4 4 0 0 0-4-4z"/><path d="M19.07 4.93a4 4 0 0 0-5.66 0c-1.56 1.56-1.56 4.09 0 5.66L12 12l4.93-4.93a4 4 0 0 0 0-5.14z" transform="rotate(45 12 12)"/><path d="M4.93 4.93a4 4 0 0 0 0 5.66L12 12l-7.07-7.07a4 4 0 0 0 0-5.14z" transform="rotate(45 12 12)"/></svg>',
  },
];

export const SVG_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "education", label: "Education" },
  { id: "achievements", label: "Achievements" },
  { id: "technology", label: "Technology" },
  { id: "business", label: "Business" },
  { id: "nature", label: "Nature" },
  { id: "decorative", label: "Decorative" },
];

export const COLOR_PALETTES = [
  {
    id: "navy-gold",
    name: "Navy & Gold",
    accent: "#c9a84c",
    bg: "#0f1b3d",
    text: "#fdfbf5",
    accent2: "#8a6d2b",
  },
  {
    id: "black-gold",
    name: "Black & Gold",
    accent: "#d4af37",
    bg: "#0a0a0a",
    text: "#f5f5f5",
    accent2: "#b8860b",
  },
  {
    id: "indigo-modern",
    name: "Indigo Modern",
    accent: "#6366f1",
    bg: "#ffffff",
    text: "#1e293b",
    accent2: "#818cf8",
  },
  {
    id: "emerald-prestige",
    name: "Emerald Prestige",
    accent: "#10b981",
    bg: "#f0fdf4",
    text: "#052e16",
    accent2: "#34d399",
  },
  {
    id: "burgundy-classic",
    name: "Burgundy Classic",
    accent: "#991b1b",
    bg: "#fef2f2",
    text: "#1a1a1a",
    accent2: "#dc2626",
  },
  {
    id: "slate-minimal",
    name: "Slate Minimal",
    accent: "#475569",
    bg: "#f8fafc",
    text: "#0f172a",
    accent2: "#94a3b8",
  },
  {
    id: "rose-charcoal",
    name: "Rose & Charcoal",
    accent: "#e11d48",
    bg: "#1c1917",
    text: "#fafaf9",
    accent2: "#fb7185",
  },
  {
    id: "teal-editorial",
    name: "Teal Editorial",
    accent: "#0d9488",
    bg: "#f0fdfa",
    text: "#134e4a",
    accent2: "#2dd4bf",
  },
  {
    id: "royal-purple",
    name: "Royal Purple",
    accent: "#7c3aed",
    bg: "#f5f3ff",
    text: "#1e1b4b",
    accent2: "#a78bfa",
  },
  {
    id: "sunset-amber",
    name: "Sunset Amber",
    accent: "#f59e0b",
    bg: "#fffbeb",
    text: "#451a03",
    accent2: "#fbbf24",
  },
  {
    id: "forest-cream",
    name: "Forest & Cream",
    accent: "#166534",
    bg: "#fefce8",
    text: "#14532d",
    accent2: "#22c55e",
  },
  {
    id: "steel-blue",
    name: "Steel Blue",
    accent: "#2563eb",
    bg: "#eff6ff",
    text: "#1e3a5f",
    accent2: "#60a5fa",
  },
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
