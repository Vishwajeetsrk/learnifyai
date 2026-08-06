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
      const urlObj = new URL(url);
      // Profile borders are applied via the Avatar ring classes, not the image.
      urlObj.searchParams.delete("profile_border");
      const seed = urlObj.searchParams.get("seed") || "Learnify";
      urlObj.searchParams.set("seed", seed);
      return urlObj.toString();
    }
  } catch {
    // not a valid URL
  }
  return url;
}
