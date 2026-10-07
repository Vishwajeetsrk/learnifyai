import React from "react";
import { Code2 } from "lucide-react";

export interface TechnologyIconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number | string;
  className?: string;
  showColor?: boolean;
}

/**
 * Normalized official technology SVG icons
 */
export function TechnologyIcon({
  name,
  size = 16,
  className = "",
  showColor = true,
  ...props
}: TechnologyIconProps) {
  const norm = (name || "").toLowerCase().trim().replace(/[^a-z0-9+#]/g, "");

  const s = typeof size === "number" ? `${size}px` : size;

  // React
  if (norm === "react" || norm === "reactjs" || norm === "reactnative") {
    return (
      <svg
        width={s}
        height={s}
        viewBox="-11.5 -10.23174 23 20.46348"
        fill="none"
        className={className}
        aria-label="React"
        {...props}
      >
        <circle cx="0" cy="0" r="2.05" fill={showColor ? "#61DAFB" : "currentColor"} />
        <g stroke={showColor ? "#61DAFB" : "currentColor"} strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  // Next.js
  if (norm === "nextjs" || norm === "next") {
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 180 180"
        fill="none"
        className={className}
        aria-label="Next.js"
        {...props}
      >
        <mask height="180" id="mask-next" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: "alpha" }}>
          <circle cx="90" cy="90" fill="#000" r="90" />
        </mask>
        <g mask="url(#mask-next)">
          <circle cx="90" cy="90" data-circle="true" fill="#000" r="90" stroke="#fff" strokeWidth="6" />
          <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear_next)" />
          <rect fill="url(#paint1_linear_next)" height="72" width="12" x="115" y="54" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_next" x1="109" x2="144.5" y1="116.5" y2="160.5">
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_next" x1="121" x2="120.799" y1="54" y2="106.875">
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // TypeScript
  if (norm === "typescript" || norm === "ts") {
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 128 128"
        className={className}
        aria-label="TypeScript"
        {...props}
      >
        <rect width="128" height="128" rx="16" fill={showColor ? "#3178C6" : "currentColor"} />
        <path
          d="M71.2 81.3c0 3.3.9 6 2.8 8.1 1.9 2.1 4.5 3.1 7.9 3.1 2.3 0 4.4-.5 6.3-1.6 1.9-1.1 3.4-2.6 4.4-4.5l12.7 7.7c-3.1 4.8-7.2 8.5-12.2 11.1-5 2.6-10.7 3.9-17 3.9-7.3 0-13.6-1.5-18.7-4.6-5.2-3.1-9.1-7.4-11.8-12.9-2.7-5.5-4-11.9-4-19.3 0-7.5 1.4-14 4.1-19.6 2.8-5.6 6.8-9.9 12.1-13 5.3-3.1 11.5-4.6 18.6-4.6 6.9 0 12.8 1.4 17.7 4.2 4.9 2.8 8.8 6.7 11.6 11.8 2.8 5.1 4.2 11 4.2 17.8 0 1.3-.1 2.5-.2 3.8H71.2c0 2.2.4 4.5 1.3 6.7.9 2.2 2.2 3.9 4 5.2 1.8 1.3 4 2 6.6 2 2.7 0 5-.7 6.8-2 1.9-1.3 3.1-3 3.8-5.1h15.2c-.7 4.8-2.7 8.8-6.1 11.9-3.4 3.1-7.9 4.6-13.6 4.6-5 0-9.2-1.2-12.7-3.7-3.5-2.4-5.9-5.8-7.3-10.2l-14.7 1.6zM26 40h42v13.5H48.8V108H33.3V53.5H26V40z"
          fill="#FFF"
        />
      </svg>
    );
  }

  // JavaScript
  if (norm === "javascript" || norm === "js") {
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 128 128"
        className={className}
        aria-label="JavaScript"
        {...props}
      >
        <rect width="128" height="128" rx="16" fill={showColor ? "#F7DF1E" : "currentColor"} />
        <path
          d="M33.6 108c5.4 0 9.8-1.5 13.1-4.6 3.4-3.1 5.3-7.5 5.7-13.3l-13.4-.8c-.3 2.9-1.2 5-2.6 6.3-1.4 1.3-3.3 1.9-5.7 1.9-2.3 0-4.1-.7-5.3-2-1.2-1.4-1.8-3.4-1.8-6.1V40H10v49.8c0 5.8 1.7 10.4 5.1 13.8 3.4 3.3 9.6 4.4 18.5 4.4zm48.9-.1c6.5 0 12-1.5 16.5-4.4 4.5-2.9 7.7-7 9.6-12.2l-13.4-5.4c-1.1 3-2.8 5.3-5.1 6.8-2.3 1.5-5.1 2.3-8.4 2.3-3.8 0-6.8-.9-9-2.7-2.2-1.8-3.3-4.2-3.3-7.3 0-2.8 1.1-5.1 3.3-6.9 2.2-1.8 5.8-3.3 10.8-4.6l5.7-1.4c6.9-1.8 12.1-4.4 15.6-7.8 3.5-3.4 5.3-8 5.3-13.8 0-6.2-2.3-11.2-6.8-15-4.5-3.8-10.6-5.7-18.3-5.7-6.5 0-12.1 1.6-16.7 4.8s-7.8 7.5-9.6 13l13.1 5.4c1-2.9 2.5-5.1 4.5-6.5 2-1.4 4.5-2.2 7.6-2.2 3.4 0 6.1.8 8 2.3 1.9 1.5 2.8 3.6 2.8 6.1 0 2.5-1 4.5-3 6-2 1.5-5.3 2.8-9.8 4l-5.7 1.5c-7.3 1.9-12.8 4.6-16.4 8.2s-5.4 8.3-5.4 14.2c0 6.5 2.3 11.7 7 15.5 4.7 3.8 11.2 5.7 19.5 5.7z"
          fill="#000"
        />
      </svg>
    );
  }

  // Tailwind CSS
  if (norm === "tailwind" || norm === "tailwindcss") {
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 54 33"
        fill="none"
        className={className}
        aria-label="Tailwind CSS"
        {...props}
      >
        <path
          d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
          fill={showColor ? "#38BDF8" : "currentColor"}
        />
      </svg>
    );
  }

  // Node.js
  if (norm === "nodejs" || norm === "node") {
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-label="Node.js"
        {...props}
      >
        <path
          d="M16 2.2L2.7 9.9v15.4L16 33l13.3-7.7V9.9L16 2.2z"
          fill={showColor ? "#5FA04E" : "currentColor"}
        />
        <path
          d="M16 4.5l11.3 6.5v13L16 30.5 4.7 24V11L16 4.5z"
          fill="#333"
        />
        <path
          d="M16 11c-2.8 0-5 1.6-5 4.2 0 2.4 1.7 3.5 4.3 4l1.4.3c1.5.3 2.3.8 2.3 1.7 0 1.2-1.1 2-2.8 2-1.8 0-3-.7-3.5-2.1h-2.4c.5 2.6 2.6 4.2 5.9 4.2 3 0 5.3-1.6 5.3-4.3 0-2.4-1.8-3.6-4.4-4.1l-1.4-.3c-1.5-.3-2.2-.7-2.2-1.6 0-1.2 1-1.9 2.5-1.9 1.6 0 2.7.6 3.1 1.9h2.3c-.5-2.4-2.4-4.1-5.2-4.1z"
          fill="#FFF"
        />
      </svg>
    );
  }

  // Python
  if (norm === "python" || norm === "py") {
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 128 128"
        className={className}
        aria-label="Python"
        {...props}
      >
        <path
          d="M63.5 0C40.6 0 42 9.9 42 9.9l.1 10.3h22.1v3.1H22.7S9 21.7 9 44.5c0 22.8 12 21.8 12 21.8h7.2v-10.2s-.4-12.2 12-12.2h20.7s11.6.2 11.6-11.3V11.4S74.2 0 63.5 0zm-12.4 6.8c2.4 0 4.3 1.9 4.3 4.3 0 2.4-1.9 4.3-4.3 4.3-2.4 0-4.3-1.9-4.3-4.3s1.9-4.3 4.3-4.3z"
          fill={showColor ? "#3776AB" : "currentColor"}
        />
        <path
          d="M64.5 128c22.9 0 21.5-9.9 21.5-9.9l-.1-10.3H63.8v-3.1h41.5s13.7 1.6 13.7-21.2c0-22.8-12-21.8-12-21.8h-7.2v10.2s.4 12.2-12 12.2H67.1s-11.6-.2-11.6 11.3v21.2s-1.7 11.4 9 11.4zm12.4-6.8c-2.4 0-4.3-1.9-4.3-4.3 0-2.4 1.9-4.3 4.3-4.3 2.4 0 4.3 1.9 4.3 4.3 0 2.4-1.9 4.3-4.3 4.3z"
          fill={showColor ? "#FFD43B" : "currentColor"}
        />
      </svg>
    );
  }

  // HTML5
  if (norm === "html" || norm === "html5") {
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 128 128"
        className={className}
        aria-label="HTML5"
        {...props}
      >
        <path d="M19.1 113.8L8.6 0h110.8l-10.5 113.8L63.9 128" fill={showColor ? "#E44D26" : "currentColor"} />
        <path d="M64 117.7l37.2-10.3 8.8-97.6H64" fill={showColor ? "#F16529" : "currentColor"} />
        <path d="M64 52.8H45.7l-1.3-14.7H64V24.5H30.8l3.8 42.9H64v-14.6zm0 37.9l-.1.1-17.7-4.8-1.1-12.7H31.5l2.2 24.8 30.2 8.4.1-.1v-15.7z" fill="#EBEBEB" />
        <path d="M63.9 52.8h18.4l-1.7 19.4-16.7 4.5v14.7l30.3-8.4.3-3.3 3.4-38.6.8-8.7H63.9v14.4zm0-28.3v13.6h33.8l1.2-13.6H63.9z" fill="#FFF" />
      </svg>
    );
  }

  // CSS3
  if (norm === "css" || norm === "css3") {
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 128 128"
        className={className}
        aria-label="CSS3"
        {...props}
      >
        <path d="M19.1 113.8L8.6 0h110.8l-10.5 113.8L63.9 128" fill={showColor ? "#1572B6" : "currentColor"} />
        <path d="M64 117.7l37.2-10.3 8.8-97.6H64" fill={showColor ? "#33A9DC" : "currentColor"} />
        <path d="M64 70.3l-16.7-4.5-1.1-12.7H32.6l2.2 24.8 29.2 8.1V70.3zm0-45.8H31.1l1.3 14.7H64V24.5z" fill="#EBEBEB" />
        <path d="M64 70.3v15.7l29.2-8.1.3-3.3 2.1-23.7H82.3l-1.2 14.9-17.1 4.5zm31.7-32.2l1.2-13.6H64v13.6h31.7z" fill="#FFF" />
      </svg>
    );
  }

  // Supabase
  if (norm === "supabase") {
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 109 113"
        fill="none"
        className={className}
        aria-label="Supabase"
        {...props}
      >
        <path
          d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9754 107.314L54.1485 56.4771H99.1913C106.857 56.4771 111.164 65.2394 106.377 71.2295L63.7076 110.284Z"
          fill={showColor ? "#3ECF8E" : "currentColor"}
        />
        <path
          d="M45.317 2.70685C48.1765 -0.894375 53.9744 1.07849 54.0492 5.67667L54.3414 56.4772H10.1581C2.49257 56.4772 -1.81432 47.7149 2.97238 41.7248L45.317 2.70685Z"
          fill={showColor ? "#249361" : "currentColor"}
        />
      </svg>
    );
  }

  // GitHub / Git
  if (norm === "github" || norm === "git") {
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
  }

  // Docker
  if (norm === "docker") {
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 24 24"
        fill={showColor ? "#2496ED" : "currentColor"}
        className={className}
        aria-label="Docker"
        {...props}
      >
        <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.186.186 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186H8.1a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m-2.928 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.208a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185M23.987 11.75c-.385-.246-1.572-.37-2.738-.285-.285-1.077-1.042-1.89-2.008-2.298l-.487-.197-.333.407c-.424.518-.744 1.157-.932 1.879a7.35 7.35 0 00-1.834-.234H.185A.186.186 0 000 11.207v1.888c0 3.865 3.125 7.007 6.969 7.007 7.747 0 14.15-4.805 16.633-5.267.892-.167 1.873-.667 2.196-1.084l.2-.266-.201-.265a3.46 3.46 0 00-1.81-.47" />
      </svg>
    );
  }

  // MongoDB / Database
  if (norm === "mongodb" || norm === "mongo") {
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-label="MongoDB"
        {...props}
      >
        <path
          d="M12 1.5C12 1.5 5.5 8 5.5 14c0 4.2 3.1 7.2 6.5 8.5 3.4-1.3 6.5-4.3 6.5-8.5 0-6-6.5-12.5-6.5-12.5z"
          fill={showColor ? "#47A248" : "currentColor"}
        />
        <path
          d="M12 2v20.5c.3-.1.6-.2.9-.4 2.8-1.5 4.6-4.5 4.6-8.1 0-5.3-5.5-12-5.5-12z"
          fill={showColor ? "#499D4A" : "currentColor"}
        />
      </svg>
    );
  }

  // PostgreSQL
  if (norm === "postgresql" || norm === "postgres" || norm === "sql") {
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-label="PostgreSQL"
        {...props}
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.5h-2v-2h2v2zm3.3-6.8l-1.3 1.3c-.4.4-.6.9-.6 1.5v.5h-2v-.5c0-1.1.4-2.1 1.2-2.8l1.2-1.2c.4-.4.6-.9.6-1.5 0-1.1-.9-2-2-2s-2 .9-2 2H9.4c0-2.2 1.8-4 4-4s4 1.8 4 4c0 .8-.3 1.6-.9 2.2z"
          fill={showColor ? "#336791" : "currentColor"}
        />
      </svg>
    );
  }

  // Three.js / WebGL / GSAP
  if (norm === "threejs" || norm === "three" || norm === "webgl" || norm === "3d" || norm === "gsap") {
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 24 24"
        fill="none"
        stroke={showColor ? "#6366F1" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-label="3D & WebGL"
        {...props}
      >
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    );
  }

  // Default fallback code icon
  return (
    <Code2
      size={typeof size === "number" ? size : 16}
      className={className || "text-indigo-400"}
      aria-label={name}
      {...(props as any)}
    />
  );
}

/**
 * Returns raw HTML SVG string for inclusion in static/rendered HTML templates
 */
export function getTechnologyRawSvg(name: string, size = 16): string {
  const norm = (name || "").toLowerCase().trim().replace(/[^a-z0-9+#]/g, "");

  if (norm === "react" || norm === "reactjs" || norm === "reactnative") {
    return `<svg width="${size}" height="${size}" viewBox="-11.5 -10.23174 23 20.46348" fill="none" style="display:inline-block;vertical-align:middle;flex-shrink:0"><circle cx="0" cy="0" r="2.05" fill="#61DAFB"/><g stroke="#61DAFB" stroke-width="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>`;
  }

  if (norm === "nextjs" || norm === "next") {
    return `<svg width="${size}" height="${size}" viewBox="0 0 180 180" fill="none" style="display:inline-block;vertical-align:middle;flex-shrink:0"><circle cx="90" cy="90" r="90" fill="#000"/><path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="#FFF"/><rect fill="#FFF" height="72" width="12" x="115" y="54"/></svg>`;
  }

  if (norm === "typescript" || norm === "ts") {
    return `<svg width="${size}" height="${size}" viewBox="0 0 128 128" style="display:inline-block;vertical-align:middle;flex-shrink:0"><rect width="128" height="128" rx="16" fill="#3178C6"/><path d="M71.2 81.3c0 3.3.9 6 2.8 8.1 1.9 2.1 4.5 3.1 7.9 3.1 2.3 0 4.4-.5 6.3-1.6 1.9-1.1 3.4-2.6 4.4-4.5l12.7 7.7c-3.1 4.8-7.2 8.5-12.2 11.1-5 2.6-10.7 3.9-17 3.9-7.3 0-13.6-1.5-18.7-4.6-5.2-3.1-9.1-7.4-11.8-12.9-2.7-5.5-4-11.9-4-19.3 0-7.5 1.4-14 4.1-19.6 2.8-5.6 6.8-9.9 12.1-13 5.3-3.1 11.5-4.6 18.6-4.6 6.9 0 12.8 1.4 17.7 4.2 4.9 2.8 8.8 6.7 11.6 11.8 2.8 5.1 4.2 11 4.2 17.8 0 1.3-.1 2.5-.2 3.8H71.2c0 2.2.4 4.5 1.3 6.7.9 2.2 2.2 3.9 4 5.2 1.8 1.3 4 2 6.6 2 2.7 0 5-.7 6.8-2 1.9-1.3 3.1-3 3.8-5.1h15.2c-.7 4.8-2.7 8.8-6.1 11.9-3.4 3.1-7.9 4.6-13.6 4.6-5 0-9.2-1.2-12.7-3.7-3.5-2.4-5.9-5.8-7.3-10.2l-14.7 1.6zM26 40h42v13.5H48.8V108H33.3V53.5H26V40z" fill="#FFF"/></svg>`;
  }

  if (norm === "javascript" || norm === "js") {
    return `<svg width="${size}" height="${size}" viewBox="0 0 128 128" style="display:inline-block;vertical-align:middle;flex-shrink:0"><rect width="128" height="128" rx="16" fill="#F7DF1E"/><path d="M75.5 83.2c1.7 2.8 3.9 4.9 7.4 4.9 3.6 0 5.8-1.8 5.8-4.4 0-3-2.4-4.1-6.5-5.9l-2.2-.9c-6.4-2.7-10.6-6.1-10.6-13.2 0-6.6 5.1-11.6 13.1-11.6 5.6 0 9.7 2 12.7 7.3l-6.7 4.3c-1.5-2.6-3.1-3.6-6-3.6-2.8 0-4.7 1.7-4.7 3.8 0 2.5 1.6 3.6 5.3 5.2l2.2.9c7.6 3.2 12 6.7 12 13.9 0 7.9-6.2 12.3-14.6 12.3-8.2 0-13.6-4.1-16.5-9.8l9.3-5.7zM35 83.9c1.4 2.5 3.3 4.2 6.4 4.2 3.3 0 5.4-1.3 5.4-6.4V52.8h8.8v28.8c0 9.6-5.6 14.1-13.9 14.1-6.7 0-11.2-3.5-13.3-8.6l6.6-3.2z" fill="#000"/></svg>`;
  }

  if (norm === "tailwind" || norm === "tailwindcss") {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="#06B6D4" style="display:inline-block;vertical-align:middle;flex-shrink:0"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.335 6.182 14.974 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19.2 12.001 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.335 13.382 8.974 12 6.001 12z"/></svg>`;
  }

  if (norm === "nodejs" || norm === "node") {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="#339933" style="display:inline-block;vertical-align:middle;flex-shrink:0"><path d="M12 2l9 5.2v10.4l-9 5.2-9-5.2V7.2L12 2zm0 2.3L4.8 8.5v7l7.2 4.2 7.2-4.2v-7L12 4.3z"/></svg>`;
  }

  if (norm === "python") {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="display:inline-block;vertical-align:middle;flex-shrink:0"><path d="M11.927 2C6.91 2 7.228 4.18 7.228 4.18l.006 2.26h4.757v.678H4.664S2 6.808 2 11.838c0 5.03 2.327 4.85 2.327 4.85h1.39v-1.95s-.077-2.327 2.28-2.327h4.697v-.679H6.017V9.45s0-2.328 2.366-2.328h5.908s2.25.038 2.25-2.25V3.87S16.944 2 11.927 2z" fill="#3776AB"/><path d="M12.073 22c5.017 0 4.699-2.18 4.699-2.18l-.006-2.26h-4.757v-.678h7.327S22 17.192 22 12.162c0-5.03-2.327-4.85-2.327-4.85h-1.39v1.95s.077 2.327-2.28 2.327H11.306v.679h6.677v2.282s0 2.328-2.366 2.328H9.709s-2.25-.038-2.25 2.25V20.13S7.056 22 12.073 22z" fill="#FFD43B"/></svg>`;
  }

  if (norm === "supabase") {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;flex-shrink:0"><path d="M13.4 2.1L3.9 14.2c-.4.5 0 1.2.6 1.2h7.8l-1.7 6.5c-.2.8.8 1.3 1.3.7l9.5-12.1c.4-.5 0-1.2-.6-1.2h-7.8l1.7-6.5c.2-.8-.8-1.3-1.3-.7z" fill="#3ECF8E"/></svg>`;
  }

  if (norm === "docker") {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="#2496ED" style="display:inline-block;vertical-align:middle;flex-shrink:0"><path d="M13 6.5h2v2h-2zm-3 0h2v2h-2zm-3 0h2v2H7zm6 3h2v2h-2zm-3 0h2v2h-2zm-3 0h2v2H7zm-3 0h2v2H4zm14.7 1.9c-.3-.2-1.3-.3-2.1.2-.1-.7-.6-1.3-1.2-1.7l-.4-.2-.3.4c-.4.6-.5 1.5-.2 2.2-.4.2-1 .3-1.8.3H2c-.4 1.7.3 3.6 1.8 4.7 1.9 1.4 4.5 1.7 8.2 1.7 6.1 0 10.3-2.7 10.7-7.4v-.2c0-.6-.3-1.2-.8-1.4z"/></svg>`;
  }

  if (norm === "github" || norm === "git") {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block;vertical-align:middle;flex-shrink:0"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`;
  }

  // Fallback Code SVG
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;flex-shrink:0"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`;
}
