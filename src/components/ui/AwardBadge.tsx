/**
 * AwardBadge.tsx
 * Learnify AI & Product Hunt style 3D Holographic Matrix3d Award Badge.
 * Features:
 * - Dynamic 3D perspective tilt via matrix3d calculation from mouse cursor offset
 * - Opposite rebound matrix on enter & leave with elastic timeout smoothing
 * - 10 layered iridescent rainbow polygon overlays with mixBlendMode: "overlay"
 * - Full support for standard badge types ("golden-kitty", "product-of-the-day", etc.)
 * - Full support for custom Learnify AI admin badges (course champion, AI mastery, custom titles, rank places, colors)
 */
import React, { MouseEvent, useEffect, useRef, useState, useId } from "react";
import { Trophy, Star, Crown, Zap, Award, Shield, Target, Brain, Code2, CheckCircle } from "lucide-react";

export type AwardBadgeType =
  | "golden-kitty"
  | "product-of-the-day"
  | "product-of-the-month"
  | "product-of-the-week"
  | "course-champion"
  | "perfect-score"
  | "high-achiever"
  | "ai-mastery"
  | "fast-learner"
  | "custom";

export type BadgeShape = "circle" | "shield" | "medal" | "ribbon" | "seal" | "pill" | "hexagon";

export interface AwardBadgeProps {
  type?: AwardBadgeType;
  place?: number;
  link?: string;
  // Custom / Admin configured fields
  title?: string;
  subtitle?: string;
  name?: string; // backwards compatibility
  description?: string;
  iconName?: string;
  shape?: BadgeShape;
  primaryColor?: string;
  accentColor?: string;
  textColor?: string;
  brandLogoUrl?: string;
  width?: number | string;
  size?: number | string;
  className?: string;
  onClick?: () => void;
  staticMode?: boolean;
}

const identityMatrix =
  "1, 0, 0, 0, " +
  "0, 1, 0, 0, " +
  "0, 0, 1, 0, " +
  "0, 0, 0, 1";

const maxRotate = 0.25;
const minRotate = -0.25;
const maxScale = 1;
const minScale = 0.97;

const defaultBackgroundColors = ["#f3e3ac", "#ddd", "#f1cfa6"];

const defaultTitles: Record<string, string> = {
  "golden-kitty": "Golden Kitty Awards",
  "product-of-the-day": "Product of the Day",
  "product-of-the-month": "Product of the Month",
  "product-of-the-week": "Product of the Week",
  "course-champion": "Course Champion",
  "perfect-score": "Perfect Score (100%)",
  "high-achiever": "Honor Roll (90%+)",
  "ai-mastery": "AI Mastery Distinction",
  "fast-learner": "Fast Learner Award",
  custom: "Verified Credential",
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Star,
  Crown,
  Zap,
  Award,
  Shield,
  Target,
  Brain,
  Code2,
  CheckCircle,
};

export const AwardBadge: React.FC<AwardBadgeProps> = ({
  type = "product-of-the-day",
  place,
  link,
  title,
  subtitle,
  name,
  description,
  iconName,
  shape = "pill",
  primaryColor,
  accentColor,
  textColor = "#475569",
  brandLogoUrl,
  width,
  size,
  className = "",
  onClick,
  staticMode = false,
}) => {
  const ref = useRef<HTMLAnchorElement & HTMLDivElement>(null);
  const filterId = useId().replace(/:/g, "_");
  const [firstOverlayPosition, setFirstOverlayPosition] = useState<number>(0);
  const [matrix, setMatrix] = useState<string>(identityMatrix);
  const [currentMatrix, setCurrentMatrix] = useState<string>(identityMatrix);
  const [disableInOutOverlayAnimation, setDisableInOutOverlayAnimation] = useState<boolean>(true);
  const [disableOverlayAnimation, setDisableOverlayAnimation] = useState<boolean>(false);
  const [isTimeoutFinished, setIsTimeoutFinished] = useState<boolean>(false);

  const enterTimeout = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeout1 = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeout2 = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeout3 = useRef<NodeJS.Timeout | null>(null);

  const resolvedTitle = title || name || defaultTitles[type] || "Achievement Award";
  const resolvedSubtitle = subtitle || (type.startsWith("product") || type === "golden-kitty" ? "PRODUCT HUNT" : "LEARNIFY AI");
  
  // Background color selection
  const bgColor =
    primaryColor ||
    (place && defaultBackgroundColors[place - 1]
      ? defaultBackgroundColors[place - 1]
      : defaultBackgroundColors[1]);

  const getDimensions = () => {
    const left = ref?.current?.getBoundingClientRect()?.left || 0;
    const right = ref?.current?.getBoundingClientRect()?.right || 0;
    const top = ref?.current?.getBoundingClientRect()?.top || 0;
    const bottom = ref?.current?.getBoundingClientRect()?.bottom || 0;
    return { left, right, top, bottom };
  };

  const getMatrix = (clientX: number, clientY: number) => {
    const { left, right, top, bottom } = getDimensions();
    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;
    const widthRange = Math.max(1, xCenter - left);
    const heightRange = Math.max(1, yCenter - top);
    const totalRange = Math.max(1, xCenter - left + yCenter - top);

    const scale = [
      maxScale - ((maxScale - minScale) * Math.abs(xCenter - clientX)) / widthRange,
      maxScale - ((maxScale - minScale) * Math.abs(yCenter - clientY)) / heightRange,
      maxScale -
        ((maxScale - minScale) * (Math.abs(xCenter - clientX) + Math.abs(yCenter - clientY))) /
          totalRange,
    ];

    const rightWidth = Math.max(1, right - left);
    const bottomHeight = Math.max(1, top - bottom);

    const rotate = {
      x1: 0.25 * ((yCenter - clientY) / Math.max(1, yCenter) - (xCenter - clientX) / Math.max(1, xCenter)),
      x2: maxRotate - ((maxRotate - minRotate) * Math.abs(right - clientX)) / rightWidth,
      x3: 0,
      y0: 0,
      y2: maxRotate - ((maxRotate - minRotate) * (top - clientY)) / bottomHeight,
      y3: 0,
      z0: -(maxRotate - ((maxRotate - minRotate) * Math.abs(right - clientX)) / rightWidth),
      z1: 0.2 - ((0.2 + 0.6) * (top - clientY)) / bottomHeight,
      z3: 0,
    };

    return (
      `${scale[0]}, ${rotate.y0}, ${rotate.z0}, 0, ` +
      `${rotate.x1}, ${scale[1]}, ${rotate.z1}, 0, ` +
      `${rotate.x2}, ${rotate.y2}, ${scale[2]}, 0, ` +
      `${rotate.x3}, ${rotate.y3}, ${rotate.z3}, 1`
    );
  };

  const getOppositeMatrix = (_matrix: string, clientY: number, onMouseEnter?: boolean) => {
    const { top, bottom } = getDimensions();
    const oppositeY = bottom - clientY + top;
    const weakening = onMouseEnter ? 0.7 : 4;
    const multiplier = onMouseEnter ? -1 : 1;
    const bottomHeight = Math.max(1, top - bottom);

    return _matrix
      .split(", ")
      .map((item, index) => {
        if (index === 2 || index === 4 || index === 8) {
          return ((-parseFloat(item) * multiplier) / weakening).toString();
        } else if (index === 0 || index === 5 || index === 10) {
          return "1";
        } else if (index === 6) {
          return (
            (multiplier * (maxRotate - ((maxRotate - minRotate) * (top - oppositeY)) / bottomHeight)) /
            weakening
          ).toString();
        } else if (index === 9) {
          return (
            (maxRotate - ((maxRotate - minRotate) * (top - oppositeY)) / bottomHeight) /
            weakening
          ).toString();
        }
        return item;
      })
      .join(", ");
  };

  const handleMouseEnter = (e: MouseEvent<any>) => {
    if (staticMode) return;
    if (leaveTimeout1.current) clearTimeout(leaveTimeout1.current);
    if (leaveTimeout2.current) clearTimeout(leaveTimeout2.current);
    if (leaveTimeout3.current) clearTimeout(leaveTimeout3.current);

    setDisableOverlayAnimation(true);
    const { left, right, top, bottom } = getDimensions();
    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;
    setDisableInOutOverlayAnimation(false);

    enterTimeout.current = setTimeout(() => setDisableInOutOverlayAnimation(true), 350);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFirstOverlayPosition((Math.abs(xCenter - e.clientX) + Math.abs(yCenter - e.clientY)) / 1.5);
      });
    });

    const mat = getMatrix(e.clientX, e.clientY);
    const oppMatrix = getOppositeMatrix(mat, e.clientY, true);
    setMatrix(oppMatrix);
    setIsTimeoutFinished(false);
    setTimeout(() => {
      setIsTimeoutFinished(true);
    }, 200);
  };

  const handleMouseMove = (e: MouseEvent<any>) => {
    if (staticMode) return;
    const { left, right, top, bottom } = getDimensions();
    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;
    setTimeout(
      () => setFirstOverlayPosition((Math.abs(xCenter - e.clientX) + Math.abs(yCenter - e.clientY)) / 1.5),
      150
    );
    if (isTimeoutFinished) {
      setCurrentMatrix(getMatrix(e.clientX, e.clientY));
    }
  };

  const handleMouseLeave = (e: MouseEvent<any>) => {
    if (staticMode) return;
    const oppMatrix = getOppositeMatrix(matrix, e.clientY);
    if (enterTimeout.current) clearTimeout(enterTimeout.current);
    setCurrentMatrix(oppMatrix);
    setTimeout(() => setCurrentMatrix(identityMatrix), 200);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDisableInOutOverlayAnimation(false);
        leaveTimeout1.current = setTimeout(() => setFirstOverlayPosition(-firstOverlayPosition / 4), 150);
        leaveTimeout2.current = setTimeout(() => setFirstOverlayPosition(0), 300);
        leaveTimeout3.current = setTimeout(() => {
          setDisableOverlayAnimation(false);
          setDisableInOutOverlayAnimation(true);
        }, 500);
      });
    });
  };

  useEffect(() => {
    if (isTimeoutFinished) {
      setMatrix(currentMatrix);
    }
  }, [currentMatrix, isTimeoutFinished]);

  const overlayAnimations = [...Array(10).keys()]
    .map(
      (e) => `
@keyframes overlayAnimation_${filterId}_${e + 1} {
  0% { transform: rotate(${e * 10}deg); }
  50% { transform: rotate(${(e + 1) * 10}deg); }
  100% { transform: rotate(${e * 10}deg); }
}
`
    )
    .join(" ");

  // Custom Icon selection
  const CustomIcon = iconName ? ICON_MAP[iconName] || Trophy : null;

  const content = (
    <>
      <style>{overlayAnimations}</style>
      <div
        style={{
          transform: staticMode ? undefined : `perspective(700px) matrix3d(${matrix})`,
          transformOrigin: "center center",
          transition: "transform 200ms ease-out",
          willChange: "transform",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 260 54"
          className="w-full h-auto drop-shadow-sm select-none"
        >
          <defs>
            <filter id={`blur1_${filterId}`}>
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
            <mask id={`badgeMask_${filterId}`}>
              <rect width="260" height="54" fill="white" rx="10" />
            </mask>
          </defs>

          {/* Background card */}
          <rect width="260" height="54" rx="10" fill={bgColor} />
          <rect
            x="4"
            y="4"
            width="252"
            height="46"
            rx="8"
            fill="transparent"
            stroke={accentColor || "rgba(0,0,0,0.15)"}
            strokeWidth="1"
          />

          {/* Subtitle */}
          <text
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="9"
            fontWeight="bold"
            letterSpacing="0.08em"
            fill={textColor}
            opacity="0.8"
            x="53"
            y="20"
          >
            {resolvedSubtitle}
          </text>

          {/* Title */}
          <text
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="15"
            fontWeight="bold"
            fill={textColor}
            x="52"
            y="39"
          >
            {resolvedTitle}
            {place ? ` #${place}` : ""}
          </text>

          {/* Left Icon / Wreath */}
          {brandLogoUrl ? (
            <image href={brandLogoUrl} x="10" y="11" width="32" height="32" />
          ) : CustomIcon ? (
            <g transform="translate(14, 13)">
              <circle cx="14" cy="14" r="14" fill={textColor} opacity="0.12" />
              {/* Fallback laurel SVG with Lucide icon inside */}
              <path
                fill={textColor}
                d="M14.963 9.075c.787-3-.188-5.887-.188-5.887S12.488 5.175 11.7 8.175c-.787 3 .188 5.887.188 5.887s2.25-1.987 3.075-4.987"
              />
            </g>
          ) : (
            <g transform="translate(8, 9)">
              <path
                fill={textColor}
                d="M14.963 9.075c.787-3-.188-5.887-.188-5.887S12.488 5.175 11.7 8.175c-.787 3 .188 5.887.188 5.887s2.25-1.987 3.075-4.987m-4.5 1.987c.787 3-.188 5.888-.188 5.888S7.988 14.962 7.2 11.962c-.787-3 .188-5.887.188-5.887s2.287 1.987 3.075 4.987m.862 10.388s-.6-2.962-2.775-5.175C6.337 14.1 3.375 13.5 3.375 13.5s.6 2.962 2.775 5.175c2.213 2.175 5.175 2.775 5.175 2.775m3.3 3.413s-1.988-2.288-4.988-3.075-5.887.187-5.887.187 1.987 2.287 4.988 3.075c3 .787 5.887-.188 5.887-.188Zm6.75 0s1.988-2.288 4.988-3.075c3-.826 5.887.187 5.887.187s-1.988 2.287-4.988 3.075c-3 .787-5.887-.188-5.887-.188ZM32.625 13.5s-2.963.6-5.175 2.775c-2.213 2.213-2.775 5.175-2.775 5.175s2.962-.6 5.175-2.775c2.175-2.213 2.775-5.175 2.775-5.175M28.65 6.075s.975 2.887.188 5.887c-.826 3-3.076 4.988-3.076 4.988s-.974-2.888-.187-5.888c.788-3 3.075-4.987 3.075-4.987m-4.5 7.987s.975-2.887.188-5.887c-.788-3-3.076-4.988-3.076-4.988s-.974 2.888-.187 5.888c.788 3 3.075 4.988 3.075 4.988ZM18 26.1c.975-.225 3.113-.6 5.325 0 3 .788 5.063 3.038 5.063 3.038s-2.888.975-5.888.187a13 13 0 0 1-1.425-.525c.563.788 1.125 1.425 2.288 1.913l-.863 2.062c-2.063-.862-2.925-2.137-3.675-3.262-.262-.375-.525-.713-.787-1.05-.26.293-.465.586-.686.903l-.102.147-.048.068c-.775 1.108-1.643 2.35-3.627 3.194l-.862-2.062c1.162-.488 1.725-1.125 2.287-1.913-.45.225-.938.375-1.425.525-3 .788-5.887-.187-5.887-.187s1.987-2.288 4.987-3.075c2.212-.563 4.35-.188 5.325.037"
              />
            </g>
          )}

          {/* Holographic Iridescent Animated Overlays */}
          <g style={{ mixBlendMode: "overlay" }} mask={`url(#badgeMask_${filterId})`}>
            {[
              { deg: 0, color: "hsl(358, 100%, 62%)", idx: 1 },
              { deg: 10, color: "hsl(30, 100%, 50%)", idx: 2 },
              { deg: 20, color: "hsl(60, 100%, 50%)", idx: 3 },
              { deg: 30, color: "hsl(96, 100%, 50%)", idx: 4 },
              { deg: 40, color: "hsl(233, 85%, 47%)", idx: 5 },
              { deg: 50, color: "hsl(271, 85%, 47%)", idx: 6 },
              { deg: 60, color: "hsl(300, 20%, 35%)", idx: 7 },
              { deg: 70, color: "transparent", idx: 8 },
              { deg: 80, color: "transparent", idx: 9 },
              { deg: 90, color: "white", idx: 10 },
            ].map(({ deg, color, idx }) => (
              <g
                key={idx}
                style={{
                  transform: `rotate(${firstOverlayPosition + deg}deg)`,
                  transformOrigin: "center center",
                  transition: !disableInOutOverlayAnimation ? "transform 200ms ease-out" : "none",
                  animation: disableOverlayAnimation
                    ? "none"
                    : `overlayAnimation_${filterId}_${idx} 5s infinite`,
                  willChange: "transform",
                }}
              >
                <polygon
                  points="0,0 260,54 260,0 0,54"
                  fill={color}
                  filter={`url(#blur1_${filterId})`}
                  opacity="0.5"
                />
              </g>
            ))}
          </g>
        </svg>
      </div>
    </>
  );

  const finalWidth = width ?? (typeof size === "number" ? `${size}px` : size);
  const wrapperStyle = finalWidth ? { width: finalWidth } : undefined;
  const wrapperClasses = `inline-block ${finalWidth ? "" : "w-[180px] sm:w-[260px]"} h-auto cursor-pointer ${className}`;

  if (link) {
    return (
      <a
        ref={ref}
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        style={wrapperStyle}
        className={wrapperClasses}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onClick={onClick}
        title={description || resolvedTitle}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      ref={ref}
      style={wrapperStyle}
      className={wrapperClasses}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      title={description || resolvedTitle}
    >
      {content}
    </div>
  );
};

export interface BadgeRowProps {
  children?: React.ReactNode;
  badges?: Array<{
    name?: string;
    badge_name?: string;
    iconName?: string;
    badge_icon?: string;
    primaryColor?: string;
    badge_color?: string;
    accentColor?: string;
    [key: string]: any;
  }>;
  size?: number | string;
  className?: string;
}

export const BadgeRow: React.FC<BadgeRowProps> = ({
  children,
  badges,
  size = 180,
  className = "",
}) => {
  if (badges && badges.length > 0) {
    return (
      <div className={`flex flex-wrap items-center gap-3 ${className}`}>
        {badges.map((b, idx) => {
          const badgeTitle = b.name || b.badge_name || "Achievement";
          const icon = b.iconName || b.badge_icon || "Award";
          const color = b.primaryColor || b.badge_color || "#4f46e5";
          return (
            <AwardBadge
              key={idx}
              title={badgeTitle}
              subtitle="LEARNIFY AI"
              iconName={icon}
              primaryColor={color}
              accentColor={b.accentColor || "#a5b4fc"}
              brandLogoUrl="https://www.learnifyai.in/assets/learnify-logo-Dbtnnfk3.png"
              size={size}
            />
          );
        })}
      </div>
    );
  }
  return <div className={`flex flex-wrap items-center gap-3 ${className}`}>{children}</div>;
};

// ─── Demos (Exact Product Hunt / Learnify Demos) ──────────────────────────────
const demoLink = "https://www.producthunt.com/golden-kitty-awards/hall-of-fame?year=2024#bootstrapped-small-teams-2";

export const GoldenKitty = () => (
  <div className="grid grid-cols-1 gap-4">
    <AwardBadge type="golden-kitty" link={demoLink} />
  </div>
);

export const ProductOfTheDay = () => (
  <div className="grid grid-cols-1 gap-4">
    <AwardBadge type="product-of-the-day" place={1} link={demoLink} />
  </div>
);

export const ProductOfTheMonth = () => (
  <div className="grid grid-cols-1 gap-4">
    <AwardBadge type="product-of-the-month" place={2} link={demoLink} />
  </div>
);

export const ProductOfTheWeek = () => (
  <div className="grid grid-cols-1 gap-4">
    <AwardBadge type="product-of-the-week" place={3} link={demoLink} />
  </div>
);

export default AwardBadge;
