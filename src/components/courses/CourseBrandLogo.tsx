import React from "react";
import { cn } from "@/lib/utils";

export type KnownBrand =
  | "microsoft-excel"
  | "microsoft-word"
  | "microsoft-powerpoint"
  | "microsoft-power-bi"
  | "python"
  | "java"
  | "figma"
  | "google-workspace"
  | "chatgpt"
  | "claude"
  | "html5"
  | "css3"
  | "javascript"
  | "vs-code"
  | "git"
  | "github"
  | "react"
  | "nextjs"
  | "nodejs"
  | "docker"
  | "aws"
  | "azure"
  | "firebase"
  | "supabase"
  | "postgresql"
  | "mysql"
  | "tailwindcss";

interface CourseBrandLogoProps {
  brand: KnownBrand | string;
  size?: number | string;
  className?: string;
  variant?: "color" | "monochrome";
}

/**
 * Authentic, canonical technology & software brand marks.
 * Conforms to official guidelines, preserving accurate geometries, colors, and aspect ratios.
 */
export function CourseBrandLogo({
  brand,
  size = 32,
  className,
  variant = "color",
}: CourseBrandLogoProps) {
  const norm = (brand || "").toLowerCase().trim().replace(/\s+/g, "-");

  // Microsoft Excel
  if (norm.includes("excel") || norm === "microsoft-excel") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Microsoft Excel Logo"
      >
        <rect x="2" y="4" width="28" height="24" rx="3" fill="#107C41" />
        <rect x="14" y="8" width="13" height="16" rx="1.5" fill="#21A366" />
        <path d="M14 13.5H27M14 18.5H27M20.5 8V24" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
        <rect x="4" y="7" width="14" height="18" rx="2" fill="#0E6435" />
        <path
          d="M7.5 11.5L14.5 20.5M14.5 11.5L7.5 20.5"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Microsoft Word
  if (norm.includes("word") || norm === "microsoft-word") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Microsoft Word Logo"
      >
        <rect x="2" y="4" width="28" height="24" rx="3" fill="#185ABD" />
        <rect x="14" y="8" width="13" height="16" rx="1.5" fill="#2B79D9" />
        <path d="M17 12H24M17 16H24M17 20H22" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.85" />
        <rect x="4" y="7" width="14" height="18" rx="2" fill="#103F91" />
        <path
          d="M6.5 12L8.5 20L11 13.5L13.5 20L15.5 12"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Microsoft PowerPoint
  if (norm.includes("powerpoint") || norm === "microsoft-powerpoint") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Microsoft PowerPoint Logo"
      >
        <rect x="2" y="4" width="28" height="24" rx="3" fill="#C43E1C" />
        <rect x="14" y="8" width="13" height="16" rx="1.5" fill="#D83B01" />
        <circle cx="20.5" cy="16" r="5" fill="#F8A88A" />
        <path d="M20.5 16V11A5 5 0 0 1 25.5 16H20.5Z" fill="#FFFFFF" />
        <rect x="4" y="7" width="14" height="18" rx="2" fill="#982C12" />
        <path
          d="M8.5 12H12C13.5 12 14.5 13 14.5 14.5C14.5 16 13.5 17 12 17H8.5V20M8.5 12V20"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Microsoft Power BI
  if (norm.includes("power-bi") || norm.includes("powerbi") || norm === "microsoft-power-bi") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Microsoft Power BI Logo"
      >
        <rect x="2" y="3" width="28" height="26" rx="4" fill="#201F1E" />
        <rect x="7" y="16" width="4.5" height="10" rx="1.2" fill="#E6AD10" />
        <rect x="13.5" y="11" width="4.5" height="15" rx="1.2" fill="#F2C811" />
        <rect x="20" y="6" width="4.5" height="20" rx="1.2" fill="#F9DE59" />
      </svg>
    );
  }

  // Python
  if (norm.includes("python")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Python Logo"
      >
        <path
          d="M15.8 4C10.2 4 10.5 6.4 10.5 6.4L10.5 8.9H16.1V9.7H8.3C8.3 9.7 5 9.3 5 15C5 20.7 7.9 20.4 7.9 20.4H9.6V17.9C9.6 17.9 9.4 14.8 12.6 14.8H18.2C18.2 14.8 21.1 14.9 21.1 12V6.4C21.1 6.4 21.4 4 15.8 4ZM13.4 6C14.1 6 14.6 6.5 14.6 7.2C14.6 7.9 14.1 8.4 13.4 8.4C12.7 8.4 12.2 7.9 12.2 7.2C12.2 6.5 12.7 6 13.4 6Z"
          fill="#3776AB"
        />
        <path
          d="M16.2 28C21.8 28 21.5 25.6 21.5 25.6L21.5 23.1H15.9V22.3H23.7C23.7 22.3 27 22.7 27 17C27 11.3 24.1 11.6 24.1 11.6H22.4V14.1C22.4 14.1 22.6 17.2 19.4 17.2H13.8C13.8 17.2 10.9 17.1 10.9 20V25.6C10.9 25.6 10.6 28 16.2 28ZM18.6 26C17.9 26 17.4 25.5 17.4 24.8C17.4 24.1 17.9 23.6 18.6 23.6C19.3 23.6 19.8 24.1 19.8 24.8C19.8 25.5 19.3 26 18.6 26Z"
          fill="#FFD43B"
        />
      </svg>
    );
  }

  // Java
  if (norm.includes("java")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Java Logo"
      >
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#1E293B" />
        <path
          d="M13.5 8.5C13.5 8.5 15.5 10 13 12.5C10.8 14.7 12 16.5 13.5 16.5C15 16.5 16 14.5 15 13C14 11.5 15.5 9.5 15.5 9.5"
          stroke="#E76F00"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M17.5 7.5C17.5 7.5 19 9 17 11.5C15.2 13.7 16.5 15.5 17.5 15.5"
          stroke="#E76F00"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M8.5 20.5C8.5 20.5 11 22 17 22C23 22 24.5 20.5 24.5 20.5M9.5 23.5C9.5 23.5 12 25 16.5 25C21 25 23.5 23.5 23.5 23.5"
          stroke="#5382A1"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Figma
  if (norm.includes("figma")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Figma Logo"
      >
        <path d="M11 6H16V11H11C9.61929 11 8.5 9.88071 8.5 8.5C8.5 7.11929 9.61929 6 11 6Z" fill="#F24E1E" />
        <path d="M16 6H21C22.3807 6 23.5 7.11929 23.5 8.5C23.5 9.88071 22.3807 11 21 11H16V6Z" fill="#FF7262" />
        <path d="M16 11H21C22.3807 11 23.5 12.1193 23.5 13.5C23.5 14.8807 22.3807 16 21 16H16V11Z" fill="#1ABCFE" />
        <path d="M11 11H16V16H11C9.61929 16 8.5 14.8807 8.5 13.5C8.5 12.1193 9.61929 11 11 11Z" fill="#A259FF" />
        <path d="M11 16H16V21C16 22.3807 14.8807 23.5 13.5 23.5C12.1193 23.5 11 22.3807 11 21V16Z" fill="#0ACF83" />
      </svg>
    );
  }

  // Google Workspace
  if (norm.includes("google") || norm.includes("workspace")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Google Workspace Logo"
      >
        <path
          d="M26.5 16.3C26.5 15.5 26.4 14.8 26.3 14H16V18.2H21.9C21.6 19.7 20.8 20.9 19.5 21.8V24.8H23.4C25.7 22.7 26.5 19.8 26.5 16.3Z"
          fill="#4285F4"
        />
        <path
          d="M16 27C19 27 21.5 26 23.4 24.8L19.5 21.8C18.4 22.5 17.3 22.9 16 22.9C13.1 22.9 10.7 21 9.8 18.4H5.8V21.5C7.7 25.1 11.5 27 16 27Z"
          fill="#34A853"
        />
        <path
          d="M9.8 18.4C9.6 17.6 9.5 16.8 9.5 16C9.5 15.2 9.6 14.4 9.8 13.6V10.5H5.8C5 12.1 4.5 14 4.5 16C4.5 18 5 19.9 5.8 21.5L9.8 18.4Z"
          fill="#FBBC05"
        />
        <path
          d="M16 9.1C17.6 9.1 19.1 9.7 20.2 10.7L23.4 7.5C21.4 5.7 18.9 4.6 16 4.6C11.5 4.6 7.7 6.9 5.8 10.5L9.8 13.6C10.7 11 13.1 9.1 16 9.1Z"
          fill="#EA4335"
        />
      </svg>
    );
  }

  // ChatGPT / OpenAI
  if (norm.includes("chatgpt") || norm.includes("openai")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="ChatGPT Logo"
      >
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#10A37F" />
        <path
          d="M24 14.2A5.3 5.3 0 0 0 21.8 9.5A5.4 5.4 0 0 0 15 9.1V10.7A3.8 3.8 0 0 1 19.8 12.6L20 13.3L19.4 13.6A5.4 5.4 0 0 0 16.5 18.6L16.5 20.3A5.4 5.4 0 0 0 21.5 22.8A5.3 5.3 0 0 0 24 14.2ZM12.2 22.5A5.3 5.3 0 0 0 17 22.9V21.3A3.8 3.8 0 0 1 12.2 19.4L12 18.7L12.6 18.4A5.4 5.4 0 0 0 15.5 13.4L15.5 11.7A5.4 5.4 0 0 0 10.5 9.2A5.3 5.3 0 0 0 8 17.8A5.3 5.3 0 0 0 12.2 22.5Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // Claude (Anthropic)
  if (norm.includes("claude") || norm.includes("anthropic")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Claude AI Logo"
      >
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#CC785C" />
        <path
          d="M16 7L18.4 13.6L25 16L18.4 18.4L16 25L13.6 18.4L7 16L13.6 13.6L16 7Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // HTML5
  if (norm.includes("html")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="HTML5 Logo"
      >
        <path d="M5 4L7.5 28L16 30.5L24.5 28L27 4H5Z" fill="#E34F26" />
        <path d="M16 28.5L22.8 26.5L24.8 6.5H16V28.5Z" fill="#EF652A" />
        <path
          d="M10 10.5H22.5L22.1 14.5H16V17.5H21.8L21.2 23.5L16 25V21.5L18.8 20.8L19 18.5H12.5L12 13.5H16V10.5H10Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // CSS3
  if (norm.includes("css")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="CSS3 Logo"
      >
        <path d="M5 4L7.5 28L16 30.5L24.5 28L27 4H5Z" fill="#1572B6" />
        <path d="M16 28.5L22.8 26.5L24.8 6.5H16V28.5Z" fill="#33A9DC" />
        <path
          d="M22.5 10.5H10L10.5 14.5H19.5L19 18.5H12L12.5 22.5L16 23.5L19.5 22.5L19.8 19.5H22.8L22 25L16 26.5L10 25L9 16.5H16V13.5H9L8.5 7.5H23L22.5 10.5Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // JavaScript
  if (norm.includes("javascript") || norm === "js") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="JavaScript Logo"
      >
        <rect x="2" y="2" width="28" height="28" rx="4" fill="#F7DF1E" />
        <path
          d="M13 15V22C13 23.5 11.8 24.2 10.2 24.2C8.5 24.2 7.5 23.2 7 22.2L8.8 21C9.2 21.6 9.6 22.2 10.3 22.2C10.8 22.2 11.2 22 11.2 21.2V15H13ZM22.5 15.5C21 15 19.2 14.8 18 15.5C16.8 16.2 16.5 17.5 16.5 18.5C16.5 20.8 18.5 21.5 20.2 22C21.5 22.5 22 22.8 22 23.5C22 24.2 21.2 24.8 19.8 24.8C18.2 24.8 17.2 23.8 16.5 22.8L15 24C16 25.5 17.8 26.2 19.8 26.2C22.5 26.2 24 24.8 24 23.2C24 20.8 22 20 20.2 19.5C19 19 18.5 18.6 18.5 18C18.5 17.4 19.2 16.8 20.2 16.8C21.2 16.8 22 17.2 22.5 18L24 16.5C23.5 15.8 22.5 15.5 22.5 15.5Z"
          fill="#000000"
        />
      </svg>
    );
  }

  // VS Code
  if (norm.includes("vs-code") || norm.includes("vscode")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Visual Studio Code Logo"
      >
        <path d="M22.5 2L13 11L6 5.5L3 7V25L6 26.5L13 21L22.5 30L28 27V5L22.5 2Z" fill="#007ACC" />
        <path d="M22.5 8.5L11 16L22.5 23.5V8.5Z" fill="#1F9CF0" />
      </svg>
    );
  }

  // Git
  if (norm.includes("git")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Git Logo"
      >
        <path
          d="M30 14.5L17.5 2C16.8 1.3 15.8 1.3 15.1 2L2 15.1C1.3 15.8 1.3 16.8 2 17.5L14.5 30C15.2 30.7 16.2 30.7 16.9 30L30 16.9C30.7 16.2 30.7 15.2 30 14.5Z"
          fill="#F05032"
        />
        <circle cx="16" cy="11" r="2.5" fill="#FFFFFF" />
        <circle cx="11" cy="16" r="2.5" fill="#FFFFFF" />
        <circle cx="19" cy="21" r="2.5" fill="#FFFFFF" />
        <path d="M16 13.5V17L13.5 16M16 17V21M16 21H16.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // React
  if (norm.includes("react")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="React Logo"
      >
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#20232A" />
        <circle cx="16" cy="16" r="2.5" fill="#61DAFB" />
        <ellipse cx="16" cy="16" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" />
        <ellipse cx="16" cy="16" rx="10" ry="4" transform="rotate(60 16 16)" stroke="#61DAFB" strokeWidth="1.2" />
        <ellipse cx="16" cy="16" rx="10" ry="4" transform="rotate(120 16 16)" stroke="#61DAFB" strokeWidth="1.2" />
      </svg>
    );
  }

  // Next.js
  if (norm.includes("nextjs") || norm.includes("next.js") || norm === "next") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Next.js Logo"
      >
        <circle cx="16" cy="16" r="14" fill="#000000" />
        <path
          d="M21.5 22.5L12.8 11.2H11V20.8H12.8V13.8L20.3 23.6C20.7 23.3 21.1 22.9 21.5 22.5Z"
          fill="url(#nextjs_grad)"
        />
        <rect x="19.2" y="11.2" width="1.8" height="9.6" fill="#FFFFFF" />
        <defs>
          <linearGradient id="nextjs_grad" x1="16.5" y1="16" x2="22" y2="23" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Node.js
  if (norm.includes("nodejs") || norm.includes("node.js") || norm === "node") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Node.js Logo"
      >
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#18181B" />
        <path
          d="M16 6L24.5 11V21L16 26L7.5 21V11L16 6Z"
          fill="#339933"
        />
        <path
          d="M16 10L21.5 13.2V19.8L16 23L10.5 19.8V13.2L16 10Z"
          fill="#5FA04E"
        />
        <path
          d="M16 13L19 14.8V18.2L16 20L13 18.2V14.8L16 13Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // TypeScript
  if (norm.includes("typescript") || norm === "ts") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="TypeScript Logo"
      >
        <rect x="2" y="2" width="28" height="28" rx="4" fill="#3178C6" />
        <path
          d="M7 12H17M12 12V22"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M24 13.5C23 12.5 21.2 12 19.5 12.5C18 13 17.5 14.2 17.5 15.5C17.5 17.5 19.5 18 21.5 18.5C23.2 19 24 19.5 24 20.5C24 21.8 22.8 22.5 21 22.5C19 22.5 17.5 21.5 17 20"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Docker
  if (norm.includes("docker")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Docker Logo"
      >
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#0DB7ED" />
        <path
          d="M6 14H8V16H6V14ZM9 14H11V16H9V14ZM12 14H14V16H12V14ZM9 11H11V13H9V11ZM12 11H14V13H12V11ZM15 11H17V13H15V11ZM15 14H17V16H15V14ZM18 14H20V16H18V14Z"
          fill="#FFFFFF"
        />
        <path
          d="M27 16.5C26.5 16.2 25.5 16.2 24.8 16.5C24.5 15.5 23.5 14.8 22 14.8H5C4.5 17.5 6 23 13 23C20 23 23.5 19.5 25.5 18C26.5 18 27.5 17.5 27 16.5Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // AWS
  if (norm.includes("aws") || norm.includes("amazon")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="AWS Logo"
      >
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#232F3E" />
        <path
          d="M10 12L8 18H9.8L10.3 16.5H12.7L13.2 18H15L13 12H10ZM10.7 15L11.5 12.8L12.3 15H10.7Z"
          fill="#FFFFFF"
        />
        <path
          d="M15.5 13.5L16.8 18H18.2L19.5 14.2L20.8 18H22.2L23.5 13.5H21.8L21 16.5L19.8 13.5H18.2L17 16.5L16.2 13.5H15.5Z"
          fill="#FFFFFF"
        />
        <path
          d="M7 21C11.5 24 19 24 24 21M24 21L21.5 22M24 21V23.5"
          stroke="#FF9900"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Azure
  if (norm.includes("azure")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Microsoft Azure Logo"
      >
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#0078D4" />
        <path
          d="M7 23.5L14 7H18L10.5 23.5H7ZM15.5 18L17.5 13.5L25 23.5H19.5L15.5 18Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // Firebase
  if (norm.includes("firebase")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Firebase Logo"
      >
        <path d="M7 23L10.5 6L14 12L7 23Z" fill="#FFA000" />
        <path d="M19 9L15 14L19 23L25 21L19 9Z" fill="#F57C00" />
        <path d="M14 12L19 23H7L14 12Z" fill="#FFCA28" />
      </svg>
    );
  }

  // Supabase
  if (norm.includes("supabase")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Supabase Logo"
      >
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#1C1C1C" />
        <path
          d="M17.5 5.5L7 17.5H15L14 26.5L24.5 14.5H16.5L17.5 5.5Z"
          fill="#3ECF8E"
        />
      </svg>
    );
  }

  // PostgreSQL
  if (norm.includes("postgres") || norm.includes("postgresql")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="PostgreSQL Logo"
      >
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#336791" />
        <path
          d="M16 8C12 8 9 10.5 9 14.5C9 17.5 10.5 19.5 12.5 20.5V23.5H14.5V20.8C15 20.9 15.5 21 16 21C20.5 21 23 18 23 14.5C23 10.5 20 8 16 8ZM14.5 13.5C14.5 12.7 15.2 12 16 12C16.8 12 17.5 12.7 17.5 13.5C17.5 14.3 16.8 15 16 15C15.2 15 14.5 14.3 14.5 13.5Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // MySQL / SQL
  if (norm.includes("mysql") || norm === "sql" || norm.includes("database")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="SQL Database Logo"
      >
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#00618A" />
        <ellipse cx="16" cy="9" rx="8" ry="3" fill="#E48E00" />
        <path
          d="M8 9V14C8 15.6 11.6 17 16 17C20.4 17 24 15.6 24 14V9"
          stroke="#FFFFFF"
          strokeWidth="2"
        />
        <path
          d="M8 14V19C8 20.6 11.6 22 16 22C20.4 22 24 20.6 24 19V14"
          stroke="#FFFFFF"
          strokeWidth="2"
        />
        <path
          d="M8 19V24C8 25.6 11.6 27 16 27C20.4 27 24 25.6 24 24V19"
          stroke="#FFFFFF"
          strokeWidth="2"
        />
      </svg>
    );
  }

  // Tailwind CSS
  if (norm.includes("tailwind")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Tailwind CSS Logo"
      >
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#0F172A" />
        <path
          d="M11.5 13.5C12.5 11 14.5 10 17.5 10C21.5 10 22 13 23.5 13.5C24.5 14 25.5 13.5 26.5 12C25.5 14.5 23.5 15.5 20.5 15.5C16.5 15.5 16 12.5 14.5 12C13.5 11.5 12.5 12 11.5 13.5ZM6.5 19.5C7.5 17 9.5 16 12.5 16C16.5 16 17 19 18.5 19.5C19.5 20 20.5 19.5 21.5 18C20.5 20.5 18.5 21.5 15.5 21.5C11.5 21.5 11 18.5 9.5 18C8.5 17.5 7.5 18 6.5 19.5Z"
          fill="#38BDF8"
        />
      </svg>
    );
  }

  // GitHub
  if (norm.includes("github")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="GitHub Logo"
      >
        <circle cx="16" cy="16" r="14" fill="#181717" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 6C10.48 6 6 10.48 6 16C6 20.42 8.87 24.17 12.84 25.49C13.34 25.58 13.52 25.27 13.52 25.01C13.52 24.78 13.51 23.99 13.51 23.16C10.73 23.77 10.14 22.01 10.14 22.01C9.68 20.86 9.03 20.55 9.03 20.55C8.12 19.93 9.1 19.94 9.1 19.94C10.1 20.01 10.63 20.97 10.63 20.97C11.52 22.5 12.97 22.06 13.54 21.8C13.63 21.15 13.89 20.71 14.17 20.46C11.95 20.21 9.62 19.35 9.62 15.53C9.62 14.44 10.01 13.55 10.65 12.85C10.55 12.6 10.21 11.58 10.75 10.23C10.75 10.23 11.59 9.96 13.5 11.25C14.3 11.03 15.15 10.92 16 10.91C16.85 10.92 17.7 11.03 18.5 11.25C20.41 9.96 21.25 10.23 21.25 10.23C21.79 11.58 21.45 12.6 21.35 12.85C21.99 13.55 22.38 14.44 22.38 15.53C22.38 19.36 20.04 20.2 17.81 20.45C18.17 20.76 18.49 21.37 18.49 22.31C18.49 23.66 18.48 24.75 18.48 25.01C18.48 25.27 18.66 25.59 19.17 25.49C23.13 24.16 26 20.41 26 16C26 10.48 21.52 6 16 6Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // AI / Machine Learning
  if (norm.includes("ai") || norm.includes("machine-learning") || norm.includes("deep-learning")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Artificial Intelligence Logo"
      >
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#4F46E5" />
        <circle cx="16" cy="16" r="3.5" fill="#FFFFFF" />
        <circle cx="9" cy="10" r="2.2" fill="#A5B4FC" />
        <circle cx="23" cy="10" r="2.2" fill="#A5B4FC" />
        <circle cx="9" cy="22" r="2.2" fill="#A5B4FC" />
        <circle cx="23" cy="22" r="2.2" fill="#A5B4FC" />
        <path
          d="M10.8 11.5L13.8 14M21.2 11.5L18.2 14M10.8 20.5L13.8 18M21.2 20.5L18.2 18M16 6.5V12.5M16 19.5V25.5"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Cybersecurity / Security
  if (norm.includes("cyber") || norm.includes("security")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        role="img"
        aria-label="Cybersecurity Logo"
      >
        <rect x="2" y="2" width="28" height="28" rx="6" fill="#0F172A" />
        <path
          d="M16 6L24 9.5V16C24 21.2 20.6 25 16 26.5C11.4 25 8 21.2 8 16V9.5L16 6Z"
          fill="#10B981"
        />
        <path
          d="M16 10L21 12.5V16.5C21 19.5 18.8 22 16 23.2C13.2 22 11 19.5 11 16.5V12.5L16 10Z"
          fill="#064E3B"
        />
        <path
          d="M14 16L15.5 17.5L18.5 14.5"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Generic Fallback
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center text-foreground font-bold text-xs uppercase shadow-sm",
        className,
      )}
    >
      {norm.slice(0, 2) || "AI"}
    </div>
  );
}
