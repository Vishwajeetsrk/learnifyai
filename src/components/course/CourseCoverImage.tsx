import { useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { getCleanBannerUrl, cn } from "@/lib/utils";

const COURSE_BRANDS: Array<[match: string, logos: string[]]> = [
  ["html-css", ["html", "css"]],
  ["javascript", ["js"]],
  ["python", ["python"]],
  ["java", ["java"]],
  ["excel", ["excel"]],
  ["word-powerpoint", ["word", "powerpoint"]],
  ["power-bi", ["powerbi"]],
  ["figma", ["figma"]],
  ["vs-code", ["vscode", "git"]],
  ["chatgpt-claude", ["chatgpt", "claude"]],
  ["google-workspace", ["google"]],
  ["template", ["template"]],
];

const BRAND_ACCENTS: Record<string, string> = {
  html: "#f97316",
  javascript: "#facc15",
  python: "#38bdf8",
  java: "#f87171",
  excel: "#4ade80",
  word: "#60a5fa",
  powerbi: "#fbbf24",
  figma: "#c084fc",
  vscode: "#22d3ee",
  chatgpt: "#a3e635",
  google: "#34d399",
  template: "#818cf8",
};

export function courseBrandLogos(slug = ""): string[] {
  const hit = COURSE_BRANDS.find(([m]) => slug.includes(m));
  return hit ? hit[1] : ["template"];
}

export function courseAccent(slug = ""): string {
  const logos = courseBrandLogos(slug);
  return BRAND_ACCENTS[logos[0]] ?? "#818cf8";
}

interface CourseCoverImageProps {
  coverUrl?: string | null;
  slug?: string | null;
  title?: string;
  className?: string;
  imgClassName?: string;
}

export function CourseCoverImage({
  coverUrl,
  slug,
  title,
  className,
  imgClassName,
}: CourseCoverImageProps) {
  const [failed, setFailed] = useState(false);
  const logos = courseBrandLogos(slug ?? "");
  const accent = courseAccent(slug ?? "");

  if (!coverUrl || failed) {
    return (
      <div
        className={cn("w-full h-full flex items-center justify-center gap-3", className)}
        style={{
          background: `linear-gradient(135deg, #0b1120 0%, ${accent}66 100%)`,
        }}
        role="img"
        aria-label={title ? `${title} cover` : undefined}
      >
        {logos.map((l) => (
          <img
            key={l}
            src={`/course-logos/${l}.svg`}
            alt=""
            className="h-12 w-12 sm:h-14 sm:w-14 bg-white rounded-2xl p-2 shadow-lg"
          />
        ))}
      </div>
    );
  }

  return (
    <SafeImage
      src={getCleanBannerUrl(coverUrl) ?? coverUrl}
      alt={title ?? ""}
      className={cn("h-full w-full object-cover", imgClassName)}
      onError={() => setFailed(true)}
    />
  );
}
