import { type ReactNode } from "react";

/* Figma-inspired Design System colors */
export const P = "#6B5BFB";
export const SG = "#10B981";
export const WO = "#F59E0B";
export const ER = "#EF4444";
export const IN = "#3B82F6";
export const TX = "#0F172A";
export const BL = "#94A3B8";
export const BG1 = "#F8FAFC";
export const BD = "#E5E7EB";
export const CR = "#8B5CF6";
export const PK = "#EC4899";
export const CY = "#06B6D4";

/* KPICard – stat card with icon, value, label, trend */
export function KPICard({
  icon,
  value,
  label,
  trend,
  color = IN,
  bgColor,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  trend?: { dir: "up" | "down"; pct: string; label: string };
  color?: string;
  bgColor?: string;
}) {
  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: bgColor ?? `${color}15`, color }}
        >
          {icon}
        </div>
      </div>
      <p className="text-2xl font-extrabold text-slate-900">{value}</p>
      {trend && (
        <p
          className={`text-[11px] font-semibold flex items-center gap-1 ${
            trend.dir === "up" ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {trend.dir === "up" ? "↑" : "↓"} {trend.pct}{" "}
          <span className="text-slate-400 font-normal">{trend.label}</span>
        </p>
      )}
    </div>
  );
}

/* SectionCard – white card container */
export function SectionCard({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between">
          {title && <h3 className="font-bold text-sm text-slate-900">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

/* Btn – primary/outline/ghost button */
export function Btn({
  children,
  variant = "primary",
  size = "sm",
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "font-bold rounded-xl transition-all inline-flex items-center justify-center gap-1.5";
  const sizes: Record<string, string> = {
    sm: "text-xs px-4 h-9",
    md: "text-sm px-5 h-10",
    lg: "text-base px-6 h-12",
  };
  const variants: Record<string, string> = {
    primary: `bg-[${P}] text-white hover:opacity-90 shadow-sm`,
    outline: `border border-slate-200 text-slate-700 hover:border-slate-300 bg-white`,
    ghost: `text-slate-600 hover:bg-slate-100`,
  };
  return (
    <button
      className={`${base} ${sizes[size] || sizes.sm} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/* StatusBadge – colored pill */
export function StatusBadge({
  label,
  color = BL,
  bgColor,
}: {
  label: string;
  color?: string;
  bgColor?: string;
}) {
  return (
    <span
      className="text-[9px] font-bold px-2 py-0.5 rounded-full border"
      style={{
        backgroundColor: bgColor ?? `${color}15`,
        color,
        borderColor: `${color}30`,
      }}
    >
      {label}
    </span>
  );
}

/* CertThumbnail – mini certificate preview */
export function CertThumbnail({
  name,
  category = "Professional",
  bg = "from-slate-900 to-indigo-950",
  actions,
}: {
  name: string;
  category?: string;
  bg?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="group rounded-2xl bg-white border border-slate-200 overflow-hidden hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col relative">
      <div
        className={`aspect-[1.414] relative bg-gradient-to-br ${bg} p-4 flex flex-col justify-between overflow-hidden`}
      >
        <div className="flex items-center justify-between z-10">
          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-amber-400 border border-amber-400/20 backdrop-blur-md">
            {category}
          </span>
          {actions && (
            <div className="flex gap-1">{actions}</div>
          )}
        </div>
        <div className="my-auto text-center z-10 text-white">
          <h4 className="font-serif font-bold text-sm line-clamp-1">{name}</h4>
          <p className="text-[10px] text-slate-300 line-clamp-1">
            Certificate of Completion
          </p>
        </div>
      </div>
      <div className="p-3 bg-white flex items-center justify-between text-xs border-t border-slate-100">
        <span className="font-medium text-slate-900 line-clamp-1">{name}</span>
        <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
          Free
        </span>
      </div>
    </div>
  );
}

/* SparkLine – tiny inline bar chart */
export function SparkLine({
  data,
  color = P,
  height = 32,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const max = Math.max(...data, 1);
  const w = 100 / data.length;
  return (
    <div className="flex items-end gap-[2px]" style={{ height }}>
      {data.map((v, i) => (
        <div
          key={i}
          className="rounded-sm transition-all duration-300"
          style={{
            width: `${w}%`,
            height: `${(v / max) * 100}%`,
            backgroundColor: color,
            opacity: 0.6 + (v / max) * 0.4,
          }}
        />
      ))}
    </div>
  );
}
