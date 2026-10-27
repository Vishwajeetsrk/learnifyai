"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  TrendingUp,
  Wallet,
  CreditCard,
  ShieldCheck,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Activity,
  FileCheck2,
  RefreshCw,
  Clock,
  Layers,
  ChevronRight,
  BarChart3,
  Receipt,
  Scale,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Timeframe = "1M" | "3M" | "1Y" | "All";
export type Currency = "INR" | "USD" | "EUR";

export interface PlatformTreasuryData {
  totalRevenue?: number;
  mrr?: number;
  arr?: number;
  activeSubscribers?: number;
  freeCashRunwayMonths?: number;
  gstAccrued?: number;
  pendingPayoutsAmount?: number;
  pendingPayoutsCount?: number;
  gateways?: {
    cashfreeShare?: number;
    razorpayShare?: number;
    escrowShare?: number;
  };
}

export interface PlatformTreasuryBentoProps {
  data?: PlatformTreasuryData;
  title?: string;
  subtitle?: string;
  adminName?: string;
  avatarUrl?: string;
  className?: string;
}

const EXCHANGE_RATES: Record<Currency, { rate: number; symbol: string; prefix: string }> = {
  INR: { rate: 1, symbol: "₹", prefix: "₹" },
  USD: { rate: 0.0116, symbol: "$", prefix: "$" },
  EUR: { rate: 0.0108, symbol: "€", prefix: "€" },
};

export function PlatformTreasuryBento({
  data,
  title = "Platform Treasury & Liquidity Matrix",
  subtitle = "Executive multi-gateway settlement, 18% GST tax vault, creator escrow reserves & runway velocity",
  adminName = "Vishwajeet",
  avatarUrl = "/assets/vishwajeet-profile.png",
  className = "",
}: PlatformTreasuryBentoProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("1Y");
  const [currency, setCurrency] = useState<Currency>("INR");
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    total: number;
    cashfree: number;
    razorpay: number;
    escrow: number;
    x: number;
    y: number;
  } | null>(null);

  const { rate, symbol } = EXCHANGE_RATES[currency];

  const formatAmount = (inrVal: number, compact: boolean = false) => {
    const converted = inrVal * rate;
    if (compact) {
      if (currency === "INR") {
        if (converted >= 10000000) return `₹${(converted / 10000000).toFixed(2)}Cr`;
        if (converted >= 100000) return `₹${(converted / 100000).toFixed(1)}L`;
        if (converted >= 1000) return `₹${(converted / 1000).toFixed(0)}K`;
        return `₹${Math.round(converted)}`;
      } else {
        if (converted >= 1000000) return `${symbol}${(converted / 1000000).toFixed(2)}M`;
        if (converted >= 1000) return `${symbol}${(converted / 1000).toFixed(1)}K`;
        return `${symbol}${Math.round(converted)}`;
      }
    }
    return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  // Base platform financial anchors
  const baseRevenue = data?.totalRevenue || 5840000;
  const baseMrr = data?.mrr || 485000;
  const baseArr = data?.arr || baseMrr * 12;
  const baseFreeCash = 1850000;
  const runwayMonths = data?.freeCashRunwayMonths || 14.2;
  const gstCollected = data?.gstAccrued || Math.round(baseRevenue * 0.18);
  const pendingPayouts = data?.pendingPayoutsAmount || 84500;
  const pendingPayoutsCount = data?.pendingPayoutsCount || 6;

  // Multi-gateway allocations
  const cfsShare = data?.gateways?.cashfreeShare ?? 0.62;
  const rzpShare = data?.gateways?.razorpayShare ?? 0.28;
  const wltShare = data?.gateways?.escrowShare ?? 0.10;

  const cfsAmount = Math.round(baseRevenue * cfsShare);
  const rzpAmount = Math.round(baseRevenue * rzpShare);
  const wltAmount = Math.round(baseRevenue * wltShare);

  // Timeframe chart points generator
  const chartSeries = useMemo(() => {
    if (timeframe === "1M") {
      return [
        { label: "Oct 1", total: baseRevenue * 0.94, cfs: 0.61, rzp: 0.29, wlt: 0.1 },
        { label: "Oct 7", total: baseRevenue * 0.955, cfs: 0.615, rzp: 0.285, wlt: 0.1 },
        { label: "Oct 14", total: baseRevenue * 0.97, cfs: 0.62, rzp: 0.28, wlt: 0.1 },
        { label: "Oct 21", total: baseRevenue * 0.985, cfs: 0.625, rzp: 0.275, wlt: 0.1 },
        { label: "Oct 27", total: baseRevenue, cfs: 0.62, rzp: 0.28, wlt: 0.1 },
      ];
    }
    if (timeframe === "3M") {
      return [
        { label: "Aug 1", total: baseRevenue * 0.78, cfs: 0.58, rzp: 0.32, wlt: 0.1 },
        { label: "Aug 15", total: baseRevenue * 0.82, cfs: 0.59, rzp: 0.31, wlt: 0.1 },
        { label: "Sep 1", total: baseRevenue * 0.86, cfs: 0.6, rzp: 0.3, wlt: 0.1 },
        { label: "Sep 15", total: baseRevenue * 0.91, cfs: 0.61, rzp: 0.29, wlt: 0.1 },
        { label: "Oct 1", total: baseRevenue * 0.95, cfs: 0.615, rzp: 0.285, wlt: 0.1 },
        { label: "Oct 27", total: baseRevenue, cfs: 0.62, rzp: 0.28, wlt: 0.1 },
      ];
    }
    if (timeframe === "1Y") {
      return [
        { label: "Nov '25", total: baseRevenue * 0.35, cfs: 0.52, rzp: 0.38, wlt: 0.1 },
        { label: "Jan '26", total: baseRevenue * 0.44, cfs: 0.54, rzp: 0.36, wlt: 0.1 },
        { label: "Mar '26", total: baseRevenue * 0.56, cfs: 0.56, rzp: 0.34, wlt: 0.1 },
        { label: "May '26", total: baseRevenue * 0.68, cfs: 0.59, rzp: 0.31, wlt: 0.1 },
        { label: "Jul '26", total: baseRevenue * 0.81, cfs: 0.61, rzp: 0.29, wlt: 0.1 },
        { label: "Sep '26", total: baseRevenue * 0.92, cfs: 0.62, rzp: 0.28, wlt: 0.1 },
        { label: "Oct '26", total: baseRevenue, cfs: 0.62, rzp: 0.28, wlt: 0.1 },
      ];
    }
    // "All"
    return [
      { label: "2024", total: baseRevenue * 0.18, cfs: 0.45, rzp: 0.45, wlt: 0.1 },
      { label: "Q2 '25", total: baseRevenue * 0.32, cfs: 0.50, rzp: 0.40, wlt: 0.1 },
      { label: "Q4 '25", total: baseRevenue * 0.52, cfs: 0.55, rzp: 0.35, wlt: 0.1 },
      { label: "Q2 '26", total: baseRevenue * 0.74, cfs: 0.59, rzp: 0.31, wlt: 0.1 },
      { label: "Q4 '26", total: baseRevenue, cfs: 0.62, rzp: 0.28, wlt: 0.1 },
    ];
  }, [timeframe, baseRevenue]);

  // SVG Chart Geometry
  const chartW = 740;
  const chartH = 220;
  const paddingX = 40;
  const paddingY = 30;
  const plotW = chartW - paddingX * 2;
  const plotH = chartH - paddingY * 2;

  const maxVal = useMemo(
    () => Math.max(...chartSeries.map((s) => s.total)) * 1.12,
    [chartSeries]
  );
  const minVal = useMemo(
    () => Math.min(...chartSeries.map((s) => s.total)) * 0.88,
    [chartSeries]
  );

  const getCoordinates = (index: number, val: number) => {
    const x = paddingX + (index / (chartSeries.length - 1)) * plotW;
    const y = chartH - paddingY - ((val - minVal) / (maxVal - minVal || 1)) * plotH;
    return { x, y };
  };

  const points = chartSeries.map((s, idx) => getCoordinates(idx, s.total));

  // Build smooth cubic bezier path
  const curvePath = useMemo(() => {
    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      const cp1x = p1.x + (p2.x - p0.x) * 0.18;
      const cp1y = p1.y + (p2.y - p0.y) * 0.18;
      const cp2x = p2.x - (p3.x - p1.x) * 0.18;
      const cp2y = p2.y - (p3.y - p1.y) * 0.18;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [points]);

  const areaPath = useMemo(() => {
    if (!curvePath || points.length === 0) return "";
    const last = points[points.length - 1];
    const first = points[0];
    const bottomY = chartH - paddingY;
    return `${curvePath} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
  }, [curvePath, points, chartH, paddingY]);

  // Cashflow 6-month model
  const cashflowMonths = [
    { month: "May", in: 380000, out: 120000 },
    { month: "Jun", in: 420000, out: 135000 },
    { month: "Jul", in: 490000, out: 148000 },
    { month: "Aug", in: 540000, out: 162000 },
    { month: "Sep", in: 610000, out: 180000 },
    { month: "Oct", in: 685000, out: 195000 },
  ];

  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-[#0A0D14] text-white p-4 sm:p-7 shadow-2xl relative overflow-hidden font-sans",
        className
      )}
    >
      {/* Background Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header & Executive Controls */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white flex items-center gap-2">
                {title}
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl font-normal">
            {subtitle}
          </p>
        </div>

        {/* Controls Toolbar: Timeframe + Currency + Admin Avatar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe Pill Selector */}
          <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            {(["1M", "3M", "1Y", "All"] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200",
                  timeframe === tf
                    ? "bg-white text-black shadow-md font-semibold"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Currency Pill Selector */}
          <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            {(["INR", "USD", "EUR"] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={cn(
                  "px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-all duration-200",
                  currency === c
                    ? "bg-blue-600 text-white shadow-md font-bold"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Admin Identity Chip */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <img
              src={avatarUrl}
              alt={adminName}
              onError={(e) => {
                // fallback
                (e.currentTarget as HTMLImageElement).src =
                  "https://api.dicebear.com/7.x/bottts/svg?seed=Admin";
              }}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-blue-500/50"
            />
            <span className="text-xs font-medium text-zinc-200">Admin {adminName}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6 relative z-10">
        {/* ======================================================== */}
        {/* CARD 1: Executive Liquidity Stream (Hero 8 Columns) */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-zinc-950/60 p-5 sm:p-6 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-400">
                <Activity className="h-3.5 w-3.5 text-blue-400" />
                <span>Executive Liquidity Stream</span>
                <span className="text-zinc-500">·</span>
                <span className="text-emerald-400 flex items-center gap-1 font-mono">
                  <ArrowUpRight className="h-3 w-3" /> +18.4% YoY
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight font-display text-white">
                  {formatAmount(baseRevenue)}
                </span>
                <span className="text-xs sm:text-sm text-emerald-400 font-medium font-mono">
                  +{formatAmount(148200)} this cycle
                </span>
              </div>
            </div>

            {/* Stream Legend */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-medium text-zinc-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Cashfree Subscriptions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>Razorpay Checkout</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Wallet Escrow</span>
              </div>
            </div>
          </div>

          {/* Interactive SVG Area Curve */}
          <div className="relative mt-6 w-full overflow-hidden select-none">
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full h-44 sm:h-56 overflow-visible"
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <defs>
                <linearGradient id="treasuryGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.38" />
                  <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="60%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#818CF8" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines */}
              {[0.25, 0.5, 0.75].map((ratio, i) => {
                const y = chartH - paddingY - ratio * plotH;
                return (
                  <line
                    key={i}
                    x1={paddingX}
                    y1={y}
                    x2={chartW - paddingX}
                    y2={y}
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Shaded Area & Line */}
              <path d={areaPath} fill="url(#treasuryGlow)" />
              <path
                d={curvePath}
                fill="none"
                stroke="url(#strokeGradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Data Interactive Nodes */}
              {points.map((pt, idx) => {
                const item = chartSeries[idx];
                const isHovered = hoveredPoint?.date === item.label;
                return (
                  <g key={idx} className="cursor-pointer">
                    {/* Hover column trigger */}
                    <rect
                      x={pt.x - plotW / (chartSeries.length * 2)}
                      y={0}
                      width={plotW / chartSeries.length}
                      height={chartH}
                      fill="transparent"
                      onMouseEnter={() => {
                        setHoveredPoint({
                          date: item.label,
                          total: item.total,
                          cashfree: Math.round(item.total * item.cfs),
                          razorpay: Math.round(item.total * item.rzp),
                          escrow: Math.round(item.total * item.wlt),
                          x: pt.x,
                          y: pt.y,
                        });
                      }}
                    />

                    {/* Outer glow ring on hover */}
                    {isHovered && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="9"
                        fill="rgba(59, 130, 246, 0.25)"
                        className="animate-ping"
                      />
                    )}

                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? "6" : "4"}
                      fill="#0A0D14"
                      stroke={isHovered ? "#60A5FA" : "#3B82F6"}
                      strokeWidth={isHovered ? "3" : "2"}
                      className="transition-all duration-200"
                    />

                    {/* Bottom date label */}
                    <text
                      x={pt.x}
                      y={chartH - 8}
                      textAnchor="middle"
                      fill={isHovered ? "#FFFFFF" : "rgba(255,255,255,0.45)"}
                      fontSize="11"
                      fontFamily="sans-serif"
                      fontWeight={isHovered ? "600" : "400"}
                    >
                      {item.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Floating Tooltip Box */}
            {hoveredPoint && (
              <div
                className="absolute z-30 pointer-events-none rounded-xl border border-white/15 bg-zinc-950/95 p-3 shadow-2xl backdrop-blur-xl text-xs space-y-1.5 transition-all duration-150 transform -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${(hoveredPoint.x / chartW) * 100}%`,
                  top: `${(hoveredPoint.y / chartH) * 100 - 12}%`,
                }}
              >
                <div className="font-semibold text-white border-b border-white/10 pb-1 flex items-center justify-between gap-4">
                  <span>{hoveredPoint.date}</span>
                  <span className="font-mono text-blue-400">
                    {formatAmount(hoveredPoint.total)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Cashfree (CFS)
                  </span>
                  <span className="font-mono text-white">
                    {formatAmount(hoveredPoint.cashfree, true)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    Razorpay (RZP)
                  </span>
                  <span className="font-mono text-white">
                    {formatAmount(hoveredPoint.razorpay, true)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Escrow Pool
                  </span>
                  <span className="font-mono text-white">
                    {formatAmount(hoveredPoint.escrow, true)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD 2: Multi-Gateway Settlement Mix (Hero 4 Columns) */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-zinc-950/60 p-5 sm:p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-indigo-400" />
                Gateway Allocation Mix
              </span>
              <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 text-[10px]">
                Target 60/30/10
              </Badge>
            </div>

            {/* Allocation Stack Progress Bar */}
            <div className="mt-4">
              <div className="h-3 w-full rounded-full bg-white/5 overflow-hidden flex p-0.5 gap-1">
                <div
                  style={{ width: `${cfsShare * 100}%` }}
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                  title="Cashfree"
                />
                <div
                  style={{ width: `${rzpShare * 100}%` }}
                  className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                  title="Razorpay"
                />
                <div
                  style={{ width: `${wltShare * 100}%` }}
                  className="h-full rounded-full bg-amber-400 transition-all duration-500"
                  title="Escrow"
                />
              </div>
            </div>

            {/* Gateway Cards Breakdown */}
            <div className="mt-5 space-y-3">
              {/* Cashfree */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-mono font-bold text-xs text-blue-400">
                      CF
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Cashfree Subscriptions</h4>
                      <p className="text-[10px] text-zinc-400">Auto-debit e-mandates & UPI</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-white">
                      {formatAmount(cfsAmount, true)}
                    </div>
                    <span className="text-[10px] text-blue-400 font-mono font-medium">
                      {(cfsShare * 100).toFixed(0)}% pot
                    </span>
                  </div>
                </div>
              </div>

              {/* Razorpay */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-mono font-bold text-xs text-cyan-400">
                      RZ
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Razorpay Checkout</h4>
                      <p className="text-[10px] text-zinc-400">Direct courses, cards & QR</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-white">
                      {formatAmount(rzpAmount, true)}
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono font-medium">
                      {(rzpShare * 100).toFixed(0)}% pot
                    </span>
                  </div>
                </div>
              </div>

              {/* Escrow Pool */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-amber-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-mono font-bold text-xs text-amber-400">
                      WT
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Wallet Escrow Reserve</h4>
                      <p className="text-[10px] text-zinc-400">Creator payouts & 7d buffer</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-white">
                      {formatAmount(wltAmount, true)}
                    </div>
                    <span className="text-[10px] text-amber-400 font-mono font-medium">
                      {(wltShare * 100).toFixed(0)}% pot
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              T+1 Settlement Auto-Sweep
            </span>
            <span className="font-mono text-zinc-300">RBI Compliant</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ROW 2: 4 Executive KPI Bento Cards (Span 3 each) */}
        {/* ======================================================== */}

        {/* Tile 1: Operating Runway */}
        <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-zinc-950/60 p-5 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                Operational Runway
              </span>
              <span className="text-emerald-400 font-mono text-[11px]">Low Burn</span>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-light font-display text-white">
                {runwayMonths} <span className="text-base text-zinc-400 font-sans">months</span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Based on liquid cash: <span className="text-white font-mono">{formatAmount(baseFreeCash, true)}</span>
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5">
            <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
              <span>Runway target (12 mo)</span>
              <span className="text-emerald-400 font-mono">118%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
            </div>
          </div>
        </div>

        {/* Tile 2: 18% GST Tax Vault */}
        <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-zinc-950/60 p-5 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="h-3.5 w-3.5 text-blue-400" />
                18% GST Compliance
              </span>
              <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 text-[9px]">
                SAC 998431
              </Badge>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-light font-display text-white">
                {formatAmount(gstCollected, true)}
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                CGST 9% + SGST 9% accrued
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-zinc-400">Next Return: GSTR-3B</span>
            <span className="text-blue-400 font-medium">Due Nov 20</span>
          </div>
        </div>

        {/* Tile 3: Creator Payouts & Clearance Queue */}
        <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-zinc-950/60 p-5 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5 text-purple-400" />
                Creator Payouts Queue
              </span>
              <span className="text-purple-400 font-mono text-[11px]">
                {pendingPayoutsCount} Pending
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-light font-display text-white">
                {formatAmount(pendingPayouts)}
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Cashfree Payout API: <span className="text-emerald-400">Instant UPI/NEFT</span>
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-zinc-400">Clearance SLA</span>
            <span className="text-purple-400 font-mono font-medium">&lt; 2 Hours</span>
          </div>
        </div>

        {/* Tile 4: ARR & MRR Velocity Targets */}
        <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-zinc-950/60 p-5 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
                ARR & MRR Velocity
              </span>
              <span className="text-amber-400 font-mono text-[11px]">
                MRR {formatAmount(baseMrr, true)}
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-light font-display text-white">
                {formatAmount(baseArr, true)} <span className="text-xs text-zinc-400">ARR</span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Annual ARR Target: {formatAmount(10000000, true)} (₹1 Cr)
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5">
            <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
              <span>Goal Progress</span>
              <span className="text-amber-400 font-mono">
                {Math.min(100, Math.round((baseArr / 10000000) * 100))}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                style={{ width: `${Math.min(100, Math.round((baseArr / 10000000) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ROW 3: Monthly Net Cash Flow vs Gateway Telemetry (6 + 6) */}
        {/* ======================================================== */}

        {/* Cashflow Mirrored Chart */}
        <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-zinc-950/60 p-5 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-400" />
                Platform Cash Flow Dynamics
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Monthly Gross Inflow vs Net Infrastructure & Creator Outflows
              </p>
            </div>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
              +71.5% Gross Margin
            </Badge>
          </div>

          {/* Bar Chart Representation */}
          <div className="mt-6 flex items-end justify-between gap-2 h-36 px-2">
            {cashflowMonths.map((m, idx) => {
              const maxBar = 750000;
              const inHeight = Math.round((m.in / maxBar) * 100);
              const outHeight = Math.round((m.out / maxBar) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 h-28">
                    {/* Inflow bar */}
                    <div
                      style={{ height: `${inHeight}%` }}
                      className="w-1/2 max-w-[16px] rounded-t-md bg-blue-500 group-hover:bg-blue-400 transition-all"
                      title={`Inflow: ${formatAmount(m.in)}`}
                    />
                    {/* Outflow bar */}
                    <div
                      style={{ height: `${outHeight}%` }}
                      className="w-1/2 max-w-[16px] rounded-t-md bg-zinc-600 group-hover:bg-zinc-500 transition-all"
                      title={`Outflow: ${formatAmount(m.out)}`}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium">{m.month}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                Gross Inflow
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-sm bg-zinc-600" />
                Infra & Payouts
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-medium">
              Net Surplus +{formatAmount(490000, true)}/mo
            </span>
          </div>
        </div>

        {/* Gateway Telemetry & Webhook Health */}
        <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-zinc-950/60 p-5 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  Gateway Telemetry & Webhook SLAs
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Real-time webhook latency, mandate health and fraud prevention
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                99.98% Gateway Uptime
              </div>
            </div>

            <div className="mt-5 space-y-3.5">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    Cashfree Recurring Subscriptions Webhook Sync
                  </span>
                  <span className="font-mono text-emerald-400">99.4% Success</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "99.4%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    Razorpay Direct Checkout & UPI Auto-Pay
                  </span>
                  <span className="font-mono text-emerald-400">99.8% Success</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: "99.8%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    Cashfree Payouts API (Instant IFSC / UPI VPA)
                  </span>
                  <span className="font-mono text-emerald-400">100% Cleared</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400">
            <span>Chargeback / Dispute Rate: &lt; 0.08% (Industry benchmark &lt; 1%)</span>
            <span className="text-blue-400 font-medium hover:underline cursor-pointer flex items-center gap-1">
              Gateway Logs <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlatformTreasuryBento;
