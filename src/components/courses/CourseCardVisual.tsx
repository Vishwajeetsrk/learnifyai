import React from "react";
import { CourseBrandLogo, type KnownBrand } from "./CourseBrandLogo";
import { SafeImage } from "@/components/ui/SafeImage";
import { getCleanBannerUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { GraduationCap } from "lucide-react";

interface CourseCardVisualProps {
  course: {
    slug?: string;
    title?: string;
    cover_url?: string | null;
    category?: string;
  };
  className?: string;
  aspectRatio?: "video" | "square";
}

export interface CourseVisualTheme {
  title: string;
  brands: KnownBrand[];
  gradientClass: string;
  accentBorder: string;
  badgeStyles?: Array<{
    border: string;
    bg?: string;
  }>;
}

/**
 * Canonical 12 Core Courses Matrix powered by @thesvg/react (thesvg.org by GLINCKER).
 * Every core course features pixel-perfect SVG brand vectors, signature radiant backdrops,
 * and high-contrast glass badges with interactive hover scaling.
 */
export const CORE_COURSE_THEMES: Record<string, CourseVisualTheme> = {
  // 1. Designing User Interfaces & Experiences (UI & UX)
  "designing-user-interfaces-and-experiences": {
    title: "Designing User Interfaces and Experiences (UI & UX)",
    brands: ["figma"],
    gradientClass: "from-[#1F1329] via-[#352245] to-[#140B1B]", // Royal Purple (#1F1329 → #352245)
    accentBorder: "border-purple-500/40",
  },
  // 2. Power BI Data Visualization
  "power-bi-visuals": {
    title: "Power BI Data Visualization",
    brands: ["microsoft-power-bi"],
    gradientClass: "from-[#2A230B] via-[#4D3F12] to-[#1C1706]", // Amber Gold (#2A230B → #4D3F12)
    accentBorder: "border-amber-500/40",
  },
  "power-bi-and-data-analytics": {
    title: "Power BI Data Visualization",
    brands: ["microsoft-power-bi"],
    gradientClass: "from-[#2A230B] via-[#4D3F12] to-[#1C1706]",
    accentBorder: "border-amber-500/40",
  },
  // 3. Word & PowerPoint Pro (Deep Blue & Crimson dual badge)
  "word-powerpoint-pro": {
    title: "Word & PowerPoint Pro",
    brands: ["microsoft-word", "microsoft-powerpoint"],
    gradientClass: "from-[#081E3D] via-[#1A2645] to-[#250B10]", // Deep Blue & Crimson
    accentBorder: "border-blue-500/40",
    badgeStyles: [
      { border: "border-blue-500/50", bg: "bg-[#081E3D]/90" },
      { border: "border-rose-500/50", bg: "bg-[#250B10]/90" },
    ],
  },
  "word-and-powerpoint-pro": {
    title: "Word & PowerPoint Pro",
    brands: ["microsoft-word", "microsoft-powerpoint"],
    gradientClass: "from-[#081E3D] via-[#1A2645] to-[#250B10]",
    accentBorder: "border-blue-500/40",
    badgeStyles: [
      { border: "border-blue-500/50", bg: "bg-[#081E3D]/90" },
      { border: "border-rose-500/50", bg: "bg-[#250B10]/90" },
    ],
  },
  // 4. Java Fundamentals
  "java-fundamentals": {
    title: "Java Fundamentals",
    brands: ["java"],
    gradientClass: "from-[#2A1108] via-[#4E200F] to-[#1C0A04]", // Coffee Crimson (#2A1108 → #4E200F)
    accentBorder: "border-orange-500/40",
  },
  // 5. ChatGPT & Claude AI Productivity
  "chatgpt-claude-ai": {
    title: "ChatGPT & Claude AI Productivity",
    brands: ["chatgpt", "claude"],
    gradientClass: "from-[#06261E] via-[#0D4033] to-[#041A14]", // Forest Emerald (#06261E → #0D4033)
    accentBorder: "border-emerald-500/40",
    badgeStyles: [
      { border: "border-emerald-500/50", bg: "bg-[#06261E]/90" },
      { border: "border-amber-600/50", bg: "bg-[#24170D]/90" },
    ],
  },
  "chatgpt-claude-ai-productivity": {
    title: "ChatGPT & Claude AI Productivity",
    brands: ["chatgpt", "claude"],
    gradientClass: "from-[#06261E] via-[#0D4033] to-[#041A14]",
    accentBorder: "border-emerald-500/40",
    badgeStyles: [
      { border: "border-emerald-500/50", bg: "bg-[#06261E]/90" },
      { border: "border-amber-600/50", bg: "bg-[#24170D]/90" },
    ],
  },
  // 6. Figma UI Bootcamp
  "figma-ui-bootcamp": {
    title: "Figma UI Bootcamp",
    brands: ["figma"],
    gradientClass: "from-[#1F1329] via-[#352245] to-[#140B1B]", // Royal Purple (#1F1329 → #352245)
    accentBorder: "border-purple-500/40",
  },
  // 7. HTML & CSS Essentials
  "html-css-essentials": {
    title: "HTML & CSS Essentials",
    brands: ["html5", "css3"],
    gradientClass: "from-[#2B1109] via-[#4F2011] to-[#1C0A04]", // Orange Flame (#2B1109 → #4F2011)
    accentBorder: "border-orange-500/40",
    badgeStyles: [
      { border: "border-orange-500/50", bg: "bg-[#2B1109]/90" },
      { border: "border-blue-500/50", bg: "bg-[#0A1A2F]/90" },
    ],
  },
  // 8. JavaScript Zero to Pro
  "javascript-zero-to-pro": {
    title: "JavaScript Zero to Pro",
    brands: ["javascript"],
    gradientClass: "from-[#2A230B] via-[#4D3F12] to-[#1C1706]", // Cyber Gold (#2A230B → #4D3F12)
    accentBorder: "border-amber-500/40",
  },
  "javascript-essentials": {
    title: "JavaScript Zero to Pro",
    brands: ["javascript"],
    gradientClass: "from-[#2A230B] via-[#4D3F12] to-[#1C1706]",
    accentBorder: "border-amber-500/40",
  },
  // 9. Python for Everyone
  "python-for-everyone": {
    title: "Python for Everyone",
    brands: ["python"],
    gradientClass: "from-[#0B1E2E] via-[#15344F] to-[#091825]", // Navy Tech (#0B1E2E → #15344F)
    accentBorder: "border-sky-500/40",
  },
  "python-for-beginners": {
    title: "Python for Everyone",
    brands: ["python"],
    gradientClass: "from-[#0B1E2E] via-[#15344F] to-[#091825]",
    accentBorder: "border-sky-500/40",
  },
  // 10. Google Workspace Pro
  "google-workspace-pro": {
    title: "Google Workspace Pro",
    brands: ["google-workspace"],
    gradientClass: "from-[#0A1E38] via-[#12335E] to-[#071527]", // Google Blue (#0A1E38 → #12335E)
    accentBorder: "border-blue-500/40",
  },
  // 11. Excel & Sheets Mastery
  "excel-sheets-mastery": {
    title: "Excel & Sheets Mastery",
    brands: ["microsoft-excel", "google-sheets"],
    gradientClass: "from-[#082817] via-[#0E4728] to-[#061C10]", // Excel Emerald (#082817 → #0E4728)
    accentBorder: "border-emerald-500/40",
    badgeStyles: [
      { border: "border-emerald-500/50", bg: "bg-[#082817]/90" },
      { border: "border-green-500/50", bg: "bg-[#0A2616]/90" },
    ],
  },
  "excel-and-sheets-mastery": {
    title: "Excel & Sheets Mastery",
    brands: ["microsoft-excel", "google-sheets"],
    gradientClass: "from-[#082817] via-[#0E4728] to-[#061C10]",
    accentBorder: "border-emerald-500/40",
    badgeStyles: [
      { border: "border-emerald-500/50", bg: "bg-[#082817]/90" },
      { border: "border-green-500/50", bg: "bg-[#0A2616]/90" },
    ],
  },
  // 12. VS Code + Git Essentials
  "vs-code-git-essentials": {
    title: "VS Code + Git Essentials",
    brands: ["vs-code", "git"],
    gradientClass: "from-[#081F3D] via-[#0F396E] to-[#05152B]", // Azure Blue (#081F3D → #0F396E)
    accentBorder: "border-sky-500/40",
    badgeStyles: [
      { border: "border-sky-500/50", bg: "bg-[#081F3D]/90" },
      { border: "border-orange-500/50", bg: "bg-[#28120A]/90" },
    ],
  },
  "vs-code-and-git-mastery": {
    title: "VS Code + Git Essentials",
    brands: ["vs-code", "git"],
    gradientClass: "from-[#081F3D] via-[#0F396E] to-[#05152B]",
    accentBorder: "border-sky-500/40",
    badgeStyles: [
      { border: "border-sky-500/50", bg: "bg-[#081F3D]/90" },
      { border: "border-orange-500/50", bg: "bg-[#28120A]/90" },
    ],
  },
};

/**
 * Local high-quality generated course covers (slug → path).
 * These take priority over any database cover_url.
 * Add new entries here as more covers are generated.
 */
const LOCAL_COVERS: Record<string, string> = {
  // Non-core custom course covers can be mapped here.
};

/**
 * Maps course slug/title to canonical brand logos from @thesvg/react.
 * Handles both existing platform courses and any newly created technologies.
 */
export function getCourseBrands(slug: string = "", title: string = ""): KnownBrand[] {
  const normSlug = (slug || "").toLowerCase().trim();
  if (CORE_COURSE_THEMES[normSlug]) {
    return CORE_COURSE_THEMES[normSlug].brands;
  }

  const norm = `${slug} ${title}`.toLowerCase();

  // WordPress explicitly first to avoid accidental 'word' matching
  if (norm.includes("wordpress") || norm.includes("woocommerce")) {
    return ["wordpress", "php"];
  }

  // 12 Core Courses with Canonical @thesvg/react Icons
  if (norm.includes("word") && norm.includes("powerpoint")) {
    return ["microsoft-word", "microsoft-powerpoint"];
  }
  if (norm.includes("chatgpt") || norm.includes("claude")) {
    return ["chatgpt", "claude"];
  }
  if (
    norm.includes("vs-code") ||
    norm.includes("vscode") ||
    (norm.includes("code") && norm.includes("git"))
  ) {
    return ["vs-code", "git"];
  }
  if (norm.includes("html") || norm.includes("css")) {
    return ["html5", "css3"];
  }
  if (norm.includes("power-bi") || norm.includes("powerbi")) {
    return ["microsoft-power-bi"];
  }
  if (norm.includes("excel") || norm.includes("sheets")) {
    return ["microsoft-excel", "google-sheets"];
  }
  if (
    norm.includes("ui & ux") ||
    norm.includes("ui/ux") ||
    norm.includes("user-interfaces") ||
    norm.includes("design-systems")
  ) {
    return ["figma"];
  }
  if (norm.includes("figma")) {
    return ["figma"];
  }
  if (norm.includes("google-workspace") || norm.includes("workspace")) {
    return ["google-workspace"];
  }
  if (norm.includes("java") && !norm.includes("javascript")) {
    return ["java"];
  }
  if (norm.includes("javascript") || norm.includes("js")) {
    return ["javascript"];
  }
  if (norm.includes("python")) {
    return ["python"];
  }
  if (
    norm.includes("nextjs") ||
    norm.includes("next.js") ||
    (norm.includes("full-stack") && norm.includes("next"))
  ) {
    return ["nextjs", "react"];
  }
  if (norm.includes("react")) {
    return ["react", "typescript"];
  }
  if (norm.includes("svelte")) {
    return ["svelte"];
  }
  if (norm.includes("vue")) {
    return ["vuejs"];
  }
  if (norm.includes("angular")) {
    return ["angular"];
  }
  if (norm.includes("typescript") || norm.includes("ts-")) {
    return ["typescript", "javascript"];
  }
  if (norm.includes("javascript") || norm.includes("js")) {
    return ["javascript", "typescript"];
  }
  if (norm.includes("java") && !norm.includes("javascript")) {
    return ["java", "spring"];
  }
  if (norm.includes("c++") || norm.includes("cpp")) {
    return ["cplusplus"];
  }
  if (norm.includes("c#") || norm.includes("csharp")) {
    return ["csharp"];
  }
  if (norm.includes("go") || norm.includes("golang")) {
    return ["go"];
  }
  if (norm.includes("rust")) {
    return ["rust"];
  }
  if (norm.includes("php")) {
    return ["php"];
  }
  if (norm.includes("flutter") || norm.includes("dart")) {
    return ["flutter", "dart"];
  }
  if (norm.includes("swift") || norm.includes("ios")) {
    return ["swift"];
  }
  if (norm.includes("kotlin") || norm.includes("android")) {
    return ["kotlin"];
  }
  if (norm.includes("docker") || norm.includes("container")) {
    return ["docker", "kubernetes"];
  }
  if (norm.includes("kubernetes") || norm.includes("k8s")) {
    return ["kubernetes", "docker"];
  }
  if (norm.includes("aws") || norm.includes("amazon")) {
    return ["aws"];
  }
  if (norm.includes("azure")) {
    return ["azure"];
  }
  if (norm.includes("google") || norm.includes("workspace")) {
    return ["google-workspace"];
  }
  if (norm.includes("firebase")) {
    return ["firebase"];
  }
  if (norm.includes("supabase")) {
    return ["supabase", "postgresql"];
  }
  if (norm.includes("postgres") || norm.includes("postgresql")) {
    return ["postgresql"];
  }
  if (norm.includes("mysql") || norm.includes("sql") || norm.includes("database")) {
    return ["mysql"];
  }
  if (norm.includes("mongodb") || norm.includes("mongo")) {
    return ["mongodb"];
  }
  if (norm.includes("redis")) {
    return ["redis"];
  }
  if (norm.includes("graphql")) {
    return ["graphql"];
  }
  if (norm.includes("tailwind")) {
    return ["tailwindcss"];
  }
  if (norm.includes("git") || norm.includes("github")) {
    return ["git", "github"];
  }
  if (norm.includes("cyber") || norm.includes("security") || norm.includes("ethical-hacking")) {
    return ["cybersecurity"];
  }
  if (
    norm.includes("ai") ||
    norm.includes("machine-learning") ||
    norm.includes("deep-learning") ||
    norm.includes("prompt")
  ) {
    return ["chatgpt", "claude"];
  }

  // Default
  return ["react"];
}

export function CourseCardVisual({
  course,
  className,
  aspectRatio = "video",
}: CourseCardVisualProps) {
  const normSlug = (course.slug || "").toLowerCase().trim();
  let coreTheme = CORE_COURSE_THEMES[normSlug];

  if (!coreTheme && course.title) {
    const normTitle = (course.title || "").toLowerCase();
    for (const [key, theme] of Object.entries(CORE_COURSE_THEMES)) {
      if (
        (normSlug && normSlug.includes(key)) ||
        (theme.title && normTitle.includes(theme.title.toLowerCase()))
      ) {
        coreTheme = theme;
        break;
      }
    }
  }

  // 1. Dedicated Authentic @thesvg/react Vector Visual Cards for Core Masteries
  if (coreTheme) {
    const brands = coreTheme.brands;
    return (
      <div
        className={cn(
          "w-full overflow-hidden relative border-b border-border/50 flex items-center justify-center select-none group",
          aspectRatio === "video" ? "aspect-video" : "aspect-square",
          className,
        )}
      >
        <div
          className={cn(
            "w-full h-full bg-gradient-to-br transition-all duration-500 flex flex-col items-center justify-center p-6 relative overflow-hidden",
            coreTheme.gradientClass,
          )}
        >
          {/* Subtle micro-grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          {/* Radiant ambient glow backdrop */}
          <div className="absolute w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

          {/* Centered Glass Brand Badges */}
          <div className="relative z-10 flex items-center justify-center">
            {brands.map((b, i) => {
              const badgeStyle = coreTheme.badgeStyles?.[i];
              return (
                <div
                  key={b}
                  className={cn(
                    "rounded-2xl backdrop-blur-md shadow-2xl border transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-0.5 flex items-center justify-center",
                    brands.length === 1 ? "p-4" : "p-3",
                    badgeStyle?.bg || "bg-card/85",
                    badgeStyle?.border || coreTheme.accentBorder,
                    i > 0 && "-ml-2.5 shadow-xl relative z-10",
                  )}
                >
                  <CourseBrandLogo brand={b} size={brands.length === 1 ? 46 : 38} />
                </div>
              );
            })}
          </div>

          {/* Clean brand label footer */}
          <div className="absolute bottom-2.5 inset-x-3.5 flex items-center justify-between text-[10px] font-semibold text-white/70 tracking-wider uppercase">
            <span className="font-display flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Learnify AI
            </span>
            <span className="text-white/50">{course.category || "Mastery"}</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Custom or non-core courses fallback
  const brands = getCourseBrands(course.slug, course.title);
  const cleanCover = course.cover_url ? getCleanBannerUrl(course.cover_url) : null;

  // Local curated covers (slug-based fallback if DB cover is missing)
  const localCover = course.slug ? LOCAL_COVERS[course.slug] ?? null : null;

  // Effective cover: prioritize database cover_url (user uploaded/assigned), fall back to curated local cover
  const effectiveCover = cleanCover || localCover;

  // Render actual image if we have a valid raster or SVG file reference
  const hasValidCustomCover = Boolean(effectiveCover);

  // Gradient themes matching brand colors
  const primaryBrand = String(brands[0] || "");
  let gradientClass = "from-slate-900 via-indigo-950/80 to-slate-900";
  let accentBorder = "border-primary/30";

  if (primaryBrand.includes("excel") || primaryBrand.includes("sheets")) {
    gradientClass = "from-[#082817] via-[#0E4728] to-[#061C10]";
    accentBorder = "border-emerald-500/40";
  } else if (primaryBrand.includes("word") && !primaryBrand.includes("wordpress") || primaryBrand.includes("typescript")) {
    gradientClass = "from-[#081E3D] via-[#103A70] to-[#05152B]";
    accentBorder = "border-blue-500/40";
  } else if (primaryBrand.includes("powerpoint")) {
    gradientClass = "from-[#331108] via-[#5C1D0C] to-[#240A04]";
    accentBorder = "border-rose-500/40";
  } else if (primaryBrand.includes("power-bi") || primaryBrand.includes("javascript")) {
    gradientClass = "from-[#2A230B] via-[#4D3F12] to-[#1C1706]";
    accentBorder = "border-amber-500/40";
  } else if (primaryBrand.includes("python")) {
    gradientClass = "from-[#0B1E2E] via-[#15344F] to-[#091825]";
    accentBorder = "border-sky-500/40";
  } else if (primaryBrand.includes("java") && !primaryBrand.includes("javascript")) {
    gradientClass = "from-[#2A1108] via-[#4E200F] to-[#1C0A04]";
    accentBorder = "border-orange-500/40";
  } else if (primaryBrand.includes("workspace") || primaryBrand.includes("google")) {
    gradientClass = "from-[#0A1E38] via-[#12335E] to-[#071527]";
    accentBorder = "border-blue-500/40";
  } else if (primaryBrand.includes("vs-code") || primaryBrand.includes("vscode")) {
    gradientClass = "from-[#081F3D] via-[#0F396E] to-[#05152B]";
    accentBorder = "border-sky-500/40";
  } else if (primaryBrand.includes("figma")) {
    gradientClass = "from-[#1F1329] via-[#352245] to-[#140B1B]";
    accentBorder = "border-purple-500/40";
  } else if (primaryBrand.includes("chatgpt") || primaryBrand.includes("claude") || primaryBrand.includes("supabase")) {
    gradientClass = "from-[#06261E] via-[#0D4033] to-[#041A14]";
    accentBorder = "border-emerald-500/40";
  } else if (primaryBrand.includes("html") || primaryBrand.includes("git")) {
    gradientClass = "from-[#2B1109] via-[#4F2011] to-[#1C0A04]";
    accentBorder = "border-orange-500/40";
  } else if (primaryBrand.includes("react") || primaryBrand.includes("docker") || primaryBrand.includes("tailwind")) {
    gradientClass = "from-[#061B2E] via-[#0B355A] to-[#041220]";
    accentBorder = "border-cyan-500/40";
  } else if (primaryBrand.includes("nodejs")) {
    gradientClass = "from-[#0A220E] via-[#123E1B] to-[#061709]";
    accentBorder = "border-green-500/40";
  } else if (primaryBrand.includes("aws") || primaryBrand.includes("azure")) {
    gradientClass = "from-[#141C2A] via-[#1F2C42] to-[#0E131E]";
    accentBorder = "border-amber-500/40";
  } else if (primaryBrand.includes("wordpress")) {
    gradientClass = "from-[#0A1A2F] via-[#133256] to-[#081526]";
    accentBorder = "border-sky-500/40";
  } else if (primaryBrand.includes("svelte")) {
    gradientClass = "from-[#2A0E08] via-[#4A1A10] to-[#1C0804]";
    accentBorder = "border-orange-500/40";
  } else if (primaryBrand.includes("vue")) {
    gradientClass = "from-[#082419] via-[#0F3F2C] to-[#051710]";
    accentBorder = "border-emerald-500/40";
  } else if (primaryBrand.includes("angular")) {
    gradientClass = "from-[#2A0812] via-[#4A1020] to-[#1C050C]";
    accentBorder = "border-rose-500/40";
  }

  return (
    <div
      className={cn(
        "w-full overflow-hidden relative border-b border-border/50 flex items-center justify-center select-none",
        aspectRatio === "video" ? "aspect-video" : "aspect-square",
        className,
      )}
    >
      {hasValidCustomCover ? (
        <>
          <SafeImage
            src={effectiveCover!}
            alt={course.title || "Course Cover"}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {brands.length > 0 && (
            <div className="absolute top-2.5 left-2.5 p-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 shadow-lg flex items-center gap-1.5">
              {brands.map((b) => (
                <CourseBrandLogo key={b} brand={b} size={20} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div
          className={cn(
            "w-full h-full bg-gradient-to-br transition-all duration-500 flex flex-col items-center justify-center p-6 relative",
            gradientClass,
          )}
        >
          {/* Subtle micro-grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          {/* Glow backdrop */}
          <div className="absolute w-24 h-24 rounded-full bg-white/5 blur-xl pointer-events-none" />

          {brands.length > 0 ? (
            <div className="relative z-10 flex items-center gap-3">
              {brands.map((b, i) => (
                <div
                  key={b}
                  className={cn(
                    "p-3 rounded-2xl bg-card/85 backdrop-blur-md shadow-2xl border transition-transform duration-300 group-hover:scale-110 flex items-center justify-center",
                    accentBorder,
                    i > 0 && "-ml-2",
                  )}
                >
                  <CourseBrandLogo brand={b} size={42} />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative z-10 p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <GraduationCap className="h-10 w-10" />
            </div>
          )}

          {/* Clean brand label footer */}
          <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-[10px] font-semibold text-white/60 tracking-wider uppercase">
            <span>Learnify AI</span>
            <span>{course.category || "Course"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
