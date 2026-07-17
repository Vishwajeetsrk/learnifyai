import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCleanBannerUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("supabase.co") && u.pathname.includes("/sign/")) {
      // Convert signed URL to public URL by replacing /sign/ with /public/
      u.pathname = u.pathname.replace("/sign/", "/public/");
      u.search = "";
      return u.toString();
    }
  } catch {
    // not a valid URL
  }
  return url;
}

export function optimizeAvatarUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  try {
    if (url.includes("api.dicebear.com")) {
      let style = "avataaars";
      const match = url.match(/api\.dicebear\.com\/[^/]+\/([^/]+)/);
      if (match && match[1]) {
        style = match[1];
      }
      const urlObj = new URL(url);
      const seed = urlObj.searchParams.get("seed") || "Learnify";
      return `https://api.dicebear.com/10.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
    }
  } catch {
    // not a valid URL
  }
  return url;
}
