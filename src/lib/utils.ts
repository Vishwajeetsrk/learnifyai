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
