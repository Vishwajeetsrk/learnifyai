import React from "react";
import {
  Globe,
  Mail,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Facebook,
  MessageSquare,
  Send,
  Link as LinkIcon,
} from "lucide-react";

export interface SocialIconProps extends React.SVGProps<SVGSVGElement> {
  platform: string;
  size?: number | string;
  className?: string;
  showColor?: boolean;
}

export function detectSocialPlatform(urlOrName: string): string {
  const str = (urlOrName || "").toLowerCase().trim();
  if (str.includes("github.com") || str === "github") return "github";
  if (str.includes("linkedin.com") || str === "linkedin") return "linkedin";
  if (str.includes("twitter.com") || str.includes("x.com") || str === "twitter" || str === "x") return "x";
  if (str.includes("instagram.com") || str === "instagram") return "instagram";
  if (str.includes("youtube.com") || str === "youtube") return "youtube";
  if (str.includes("discord.gg") || str.includes("discord.com") || str === "discord") return "discord";
  if (str.includes("telegram.me") || str.includes("t.me") || str === "telegram") return "telegram";
  if (str.includes("wa.me") || str.includes("whatsapp.com") || str === "whatsapp") return "whatsapp";
  if (str.includes("dribbble.com") || str === "dribbble") return "dribbble";
  if (str.includes("behance.net") || str === "behance") return "behance";
  if (str.includes("medium.com") || str === "medium") return "medium";
  if (str.includes("dev.to") || str === "devto") return "devto";
  if (str.includes("stackoverflow.com") || str === "stackoverflow") return "stackoverflow";
  if (str.includes("mailto:") || str.includes("@") || str === "email") return "email";
  return "website";
}

export function normalizeSocialUrl(url: string, platformHint?: string): string {
  const trimmed = (url || "").trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("mailto:") || trimmed.startsWith("tel:")) return trimmed;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return `mailto:${trimmed}`;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const platform = platformHint || detectSocialPlatform(trimmed);
  if (platform === "github") return `https://github.com/${trimmed.replace(/^@/, "")}`;
  if (platform === "linkedin") return `https://linkedin.com/in/${trimmed.replace(/^@/, "")}`;
  if (platform === "x" || platform === "twitter") return `https://x.com/${trimmed.replace(/^@/, "")}`;
  if (platform === "instagram") return `https://instagram.com/${trimmed.replace(/^@/, "")}`;
  if (platform === "youtube") return `https://youtube.com/@${trimmed.replace(/^@/, "")}`;

  return `https://${trimmed}`;
}

export function SocialIcon({
  platform,
  size = 18,
  className = "",
  showColor = true,
  ...props
}: SocialIconProps) {
  const norm = detectSocialPlatform(platform);
  const s = typeof size === "number" ? `${size}px` : size;
  const numSize = typeof size === "number" ? size : 18;

  switch (norm) {
    case "github":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          aria-label="GitHub"
          {...props}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`${className} ${showColor ? "text-[#0A66C2]" : ""}`}
          aria-label="LinkedIn"
          {...props}
        >
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 1.54-1.54 1.54 1.54 0 0 0-3.08 0c0 .85.69 1.54 1.54 1.54m1.39 9.74v-8.37H5.07v8.37h2.78z" />
        </svg>
      );
    case "x":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          aria-label="X / Twitter"
          {...props}
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "instagram":
      return <Instagram size={numSize} className={`${className} ${showColor ? "text-[#E4405F]" : ""}`} aria-label="Instagram" {...(props as any)} />;
    case "youtube":
      return <Youtube size={numSize} className={`${className} ${showColor ? "text-[#FF0000]" : ""}`} aria-label="YouTube" {...(props as any)} />;
    case "discord":
      return <MessageSquare size={numSize} className={`${className} ${showColor ? "text-[#5865F2]" : ""}`} aria-label="Discord" {...(props as any)} />;
    case "telegram":
      return <Send size={numSize} className={`${className} ${showColor ? "text-[#229ED9]" : ""}`} aria-label="Telegram" {...(props as any)} />;
    case "email":
      return <Mail size={numSize} className={className} aria-label="Email" {...(props as any)} />;
    default:
      return <Globe size={numSize} className={className} aria-label="Portfolio / Website" {...(props as any)} />;
  }
}

/**
 * Returns raw HTML SVG string for inclusion in static/rendered HTML templates
 */
export function getSocialRawSvg(platform: string, size = 18): string {
  const norm = detectSocialPlatform(platform);

  if (norm === "github") {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block;vertical-align:middle;flex-shrink:0"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`;
  }

  if (norm === "linkedin") {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="#0A66C2" style="display:inline-block;vertical-align:middle;flex-shrink:0"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 1.54-1.54 1.54 1.54 0 0 0-3.08 0c0 .85.69 1.54 1.54 1.54m1.39 9.74v-8.37H5.07v8.37h2.78z"/></svg>`;
  }

  if (norm === "x" || norm === "twitter") {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block;vertical-align:middle;flex-shrink:0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
  }

  if (norm === "email") {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;flex-shrink:0"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;
  }

  // Fallback Globe SVG
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;flex-shrink:0"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`;
}

