import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChatGptIcon, ClaudeIcon } from "@hugeicons/core-free-icons";
import {
  OpenaiChatgpt as TheSvgOpenaiChatgpt,
  Claude as TheSvgClaudeIcon,
  ClaudeAi as TheSvgClaudeAiIcon,
  ClaudeCode as TheSvgClaudeCodeIcon,
  MicrosoftPowerpoint as TheSvgMicrosoftPowerpoint,
} from "@thesvg/react";
import { cn } from "@/lib/utils";

// Re-export core primitives for universal access
export { HugeiconsIcon, ChatGptIcon, ClaudeIcon };
export {
  TheSvgOpenaiChatgpt,
  TheSvgClaudeIcon,
  TheSvgClaudeAiIcon,
  TheSvgClaudeCodeIcon,
  TheSvgMicrosoftPowerpoint,
};

export interface BrandIconProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

export interface MicrosoftPowerpointIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  idPrefix?: string;
}

/**
 * Official Microsoft PowerPoint Fluent Vector Icon
 * Rendered with high-fidelity radial and linear gradients as specified.
 */
export function MicrosoftPowerpointIcon({
  size = 32,
  className,
  idPrefix,
  ...props
}: MicrosoftPowerpointIconProps) {
  const generatedId = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const prefix = idPrefix || `ppt-${generatedId}-`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="60 78.75 581.25 562.5"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      role="img"
      aria-label="Microsoft PowerPoint"
      {...props}
    >
      <defs>
        <radialGradient
          id={`${prefix}b`}
          cx="0"
          cy="0"
          r="1"
          fx="0"
          fy="0"
          gradientTransform="rotate(135 185.459 218.557) scale(564.67953 950.43148)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".152" stopColor="#aa1d2d" stopOpacity="1" />
          <stop offset=".381" stopColor="#d12b18" stopOpacity=".439216" />
          <stop offset=".602" stopColor="#ff3c00" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={`${prefix}c`}
          cx="0"
          cy="0"
          r="1"
          fx="0"
          fy="0"
          gradientTransform="matrix(484.01207 -228.61784 414.17447 876.85825 -19.41 588.618)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".407" stopColor="#ff66fb" stopOpacity=".501961" />
          <stop offset="1" stopColor="#ea3d01" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={`${prefix}e`}
          cx="0"
          cy="0"
          r="1"
          fx="0"
          fy="0"
          gradientTransform="matrix(355.8576 74.56878 -71.0897 339.25471 312.756 393.631)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".786" stopColor="#ffa05c" stopOpacity="0" />
          <stop offset=".905" stopColor="#ffce84" stopOpacity="1" />
        </radialGradient>
        <radialGradient
          id={`${prefix}f`}
          cx="0"
          cy="0"
          r="1"
          fx="0"
          fy="0"
          gradientTransform="matrix(307.21144 -201.01593 192.23383 293.78981 369.795 355.78)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".295" stopColor="#ff99e9" stopOpacity=".8" />
          <stop offset=".728" stopColor="#ff99e9" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={`${prefix}g`}
          cx="0"
          cy="0"
          r="1"
          fx="0"
          fy="0"
          gradientTransform="matrix(257.14316 -294.39511 268.86446 234.84308 328.567 398.718)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fd6ef9" stopOpacity="1" />
          <stop offset=".637" stopColor="#f94" stopOpacity="1" />
          <stop offset=".852" stopColor="#fcc479" stopOpacity="1" />
        </radialGradient>
        <radialGradient
          id={`${prefix}h`}
          cx="0"
          cy="0"
          r="1"
          fx="0"
          fy="0"
          gradientTransform="matrix(-29.04584 196.8193 -444.81484 -65.64406 302.985 115.92)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".144" stopColor="#ff8d13" stopOpacity="1" />
          <stop offset=".537" stopColor="#ff7f29" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={`${prefix}i`}
          cx="0"
          cy="0"
          r="1"
          fx="0"
          fy="0"
          gradientTransform="rotate(45 -386.466 244.891) scale(339.41099)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#f8193e" stopOpacity="1" />
          <stop offset=".939" stopColor="#920616" stopOpacity="1" />
        </radialGradient>
        <radialGradient
          id={`${prefix}j`}
          cx="0"
          cy="0"
          r="1"
          fx="0"
          fy="0"
          gradientTransform="matrix(0 168 -191.25 0 179.97 489)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".576" stopColor="#ffb055" stopOpacity="0" />
          <stop offset=".974" stopColor="#fff2be" stopOpacity=".301961" />
        </radialGradient>
        <linearGradient
          id={`${prefix}a`}
          x1="22.096"
          x2="-.876"
          y1="4.056"
          y2="26.033"
          gradientTransform="scale(15)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".058" stopColor="#ff7f48" stopOpacity="1" />
          <stop offset="1" stopColor="#e5495b" stopOpacity="1" />
        </linearGradient>
        <linearGradient
          id={`${prefix}d`}
          x1="27.549"
          x2="47.729"
          y1="28.172"
          y2="13.216"
          gradientTransform="scale(15)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".311" stopColor="#ff6e30" stopOpacity="1" />
          <stop offset=".635" stopColor="#ffa05c" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M641.2 360c0-155.332-125.907-281.25-281.223-281.25C204.66 78.75 78.75 204.668 78.75 360s125.91 281.25 281.227 281.25c155.316 0 281.222-125.918 281.222-281.25Zm0 0"
        stroke="none"
        fillRule="nonzero"
        fill={`url(#${prefix}a)`}
      />
      <path
        d="M641.2 360c0-155.332-125.907-281.25-281.223-281.25C204.66 78.75 78.75 204.668 78.75 360s125.91 281.25 281.227 281.25c155.316 0 281.222-125.918 281.222-281.25Zm0 0"
        stroke="none"
        fillRule="nonzero"
        fill={`url(#${prefix}b)`}
      />
      <path
        d="M641.2 360c0-155.332-125.907-281.25-281.223-281.25C204.66 78.75 78.75 204.668 78.75 360s125.91 281.25 281.227 281.25c155.316 0 281.222-125.918 281.222-281.25Zm0 0"
        stroke="none"
        fillRule="nonzero"
        fill={`url(#${prefix}c)`}
      />
      <path
        d="M360.016 78.75c155.312.004 281.218 125.922 281.218 281.25 0 51.672-13.96 100.07-38.273 141.68l4.57-10.121c27.832-61.797-17.406-131.727-85.183-131.676l-111.93.086c-27.824.023-50.402-22.535-50.402-50.36V197.477c-.004-67.805-70.012-112.993-131.793-85.067l-8.996 4.074c41.406-23.992 89.492-37.734 140.789-37.734Zm0 0"
        stroke="none"
        fillRule="nonzero"
        fill={`url(#${prefix}d)`}
      />
      <path
        d="M360.016 78.75c155.312.004 281.218 125.922 281.218 281.25 0 51.672-13.96 100.07-38.273 141.68l4.57-10.121c27.832-61.797-17.406-131.727-85.183-131.676l-111.93.086c-27.824.023-50.402-22.535-50.402-50.36V197.477c-.004-67.805-70.012-112.993-131.793-85.067l-8.996 4.074c41.406-23.992 89.492-37.734 140.789-37.734Zm0 0"
        stroke="none"
        fillRule="nonzero"
        fill={`url(#${prefix}e)`}
      />
      <path
        d="M360.016 78.75c155.312.004 281.218 125.922 281.218 281.25 0 51.672-13.96 100.07-38.273 141.68l4.57-10.121c27.832-61.797-17.406-131.727-85.183-131.676l-111.93.086c-27.824.023-50.402-22.535-50.402-50.36V197.477c-.004-67.805-70.012-112.993-131.793-85.067l-8.996 4.074c41.406-23.992 89.492-37.734 140.789-37.734Zm0 0"
        stroke="none"
        fillRule="nonzero"
        fill={`url(#${prefix}f)`}
      />
      <path
        d="M360.016 78.75c155.312.004 281.218 125.922 281.218 281.25 0 51.672-13.96 100.07-38.273 141.68l4.57-10.121c27.832-61.797-17.406-131.727-85.183-131.676l-111.93.086c-27.824.023-50.402-22.535-50.402-50.36V197.477c-.004-67.805-70.012-112.993-131.793-85.067l-8.996 4.074c41.406-23.992 89.492-37.734 140.789-37.734Zm0 0"
        stroke="none"
        fillRule="nonzero"
        fill={`url(#${prefix}g)`}
      />
      <path
        d="M360.016 78.75c155.312.004 281.218 125.922 281.218 281.25 0 51.672-13.96 100.07-38.273 141.68l4.57-10.121c27.832-61.797-17.406-131.727-85.183-131.676l-111.93.086c-27.824.023-50.402-22.535-50.402-50.36V197.477c-.004-67.805-70.012-112.993-131.793-85.067l-8.996 4.074c41.406-23.992 89.492-37.734 140.789-37.734Zm0 0"
        stroke="none"
        fillRule="nonzero"
        fill={`url(#${prefix}h)`}
      />
      <path
        d="M108.75 345h142.5c26.926 0 48.75 21.824 48.75 48.75v142.5c0 26.926-21.824 48.75-48.75 48.75h-142.5C81.824 585 60 563.176 60 536.25v-142.5C60 366.824 81.824 345 108.75 345Zm0 0"
        stroke="none"
        fillRule="nonzero"
        fill={`url(#${prefix}i)`}
      />
      <path
        d="M108.75 345h142.5c26.926 0 48.75 21.824 48.75 48.75v142.5c0 26.926-21.824 48.75-48.75 48.75h-142.5C81.824 585 60 563.176 60 536.25v-142.5C60 366.824 81.824 345 108.75 345Zm0 0"
        stroke="none"
        fillRule="nonzero"
        fill={`url(#${prefix}j)`}
      />
      <path
        d="M168.293 488.906v44.664h-30.875V396.426h47.7c17.077 0 30.077 3.73 39 11.191 8.987 7.457 13.48 18.52 13.48 33.184 0 15.113-5.036 26.906-15.106 35.387-10.004 8.48-23.453 12.718-40.34 12.718Zm0-68.761v45.043h12.906c7.645 0 13.543-2.004 17.684-6.024 4.14-4.016 6.215-9.785 6.215-17.309 0-6.949-2.043-12.304-6.121-16.07-4.016-3.762-9.782-5.64-17.301-5.64Zm0 0"
        stroke="none"
        fillRule="nonzero"
        fill="#fff"
        fillOpacity="1"
      />
    </svg>
  );
}

export const PowerPointIcon = MicrosoftPowerpointIcon;

/**
 * ChatGPT Icon Component using Hugeicons
 * Usage: <ChatGptIconComponent size={24} /> or <HugeiconsIcon icon={ChatGptIcon} />
 */
export function ChatGptIconComponent({
  size = 24,
  className,
  color = "currentColor",
  strokeWidth = 1.5,
  ...props
}: BrandIconProps) {
  const numericSize = typeof size === "number" ? size : parseInt(String(size), 10) || 24;

  return (
    <div
      className={cn("inline-flex items-center justify-center shrink-0", className)}
      role="img"
      aria-label="ChatGPT"
      {...props}
    >
      <HugeiconsIcon
        icon={ChatGptIcon}
        size={numericSize}
        color={color}
        strokeWidth={strokeWidth}
      />
    </div>
  );
}

/**
 * Claude Icon Component using Hugeicons
 * Usage: <ClaudeIconComponent size={24} /> or <HugeiconsIcon icon={ClaudeIcon} />
 */
export function ClaudeIconComponent({
  size = 24,
  className,
  color = "currentColor",
  strokeWidth = 1.5,
  ...props
}: BrandIconProps) {
  const numericSize = typeof size === "number" ? size : parseInt(String(size), 10) || 24;

  return (
    <div
      className={cn("inline-flex items-center justify-center shrink-0", className)}
      role="img"
      aria-label="Claude AI"
      {...props}
    >
      <HugeiconsIcon
        icon={ClaudeIcon}
        size={numericSize}
        color={color}
        strokeWidth={strokeWidth}
      />
    </div>
  );
}

/**
 * ChatGPT Badge Logo (Emerald Brand Pill with Hugeicons mark)
 */
export function ChatGptBadgeLogo({
  size = 32,
  className,
}: {
  size?: number | string;
  className?: string;
}) {
  const num = typeof size === "number" ? size : parseInt(String(size), 10) || 32;
  const iconSize = Math.max(16, Math.round(num * 0.62));

  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "rounded-xl bg-[#10A37F] text-white flex items-center justify-center shrink-0 shadow-md border border-[#10A37F]/30",
        className
      )}
      title="ChatGPT"
      role="img"
      aria-label="ChatGPT Logo"
    >
      <HugeiconsIcon icon={ChatGptIcon} size={iconSize} color="#FFFFFF" strokeWidth={1.8} />
    </div>
  );
}

/**
 * Claude AI Badge Logo (Terracotta Brand Pill with Hugeicons mark)
 */
export function ClaudeBadgeLogo({
  size = 32,
  className,
}: {
  size?: number | string;
  className?: string;
}) {
  const num = typeof size === "number" ? size : parseInt(String(size), 10) || 32;
  const iconSize = Math.max(16, Math.round(num * 0.62));

  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "rounded-xl bg-[#D97757] text-white flex items-center justify-center shrink-0 shadow-md border border-[#D97757]/30",
        className
      )}
      title="Claude AI"
      role="img"
      aria-label="Claude AI Logo"
    >
      <HugeiconsIcon icon={ClaudeIcon} size={iconSize} color="#FFFFFF" strokeWidth={1.8} />
    </div>
  );
}
