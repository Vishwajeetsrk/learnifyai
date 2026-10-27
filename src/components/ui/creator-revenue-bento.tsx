"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  TrendingUp,
  Wallet,
  Sparkles,
  BookOpen,
  Users,
  Code,
  ArrowUpRight,
  ShieldCheck,
  Target,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface CreatorRevenueBentoProps {
  gross: number;
  month: number;
  available: number;
  paidOut: number;
  creatorCredits?: any[];
  creatorName?: string;
  avatarUrl?: string;
  className?: string;
}

export function CreatorRevenueBento({
  gross,
  month,
  available,
  paidOut,
  creatorCredits = [],
  creatorName = "Creator",
  avatarUrl = "/assets/vishwajeet-profile.png",
  className = "",
}: CreatorRevenueBentoProps) {
  const [timeframe, setTimeframe] = useState<"1M" | "3M" | "1Y" | "All">("1M");
  const [currency, setCurrency] = useState<"INR" | "USD" | "EUR">("INR");

  const rate = currency === "INR" ? 1 : currency === "USD" ? 0.0116 : 0.0108;
  const symbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : "€";

  const formatMoney = (val: number) => {
    const c = val * rate;
    return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(c);
  };

  const courseRoyalties = Math.round(gross * 0.65);
  const mentorshipEarnings = Math.round(gross * 0.25);
  const assetEarnings = Math.round(gross * 0.10);

  const milestoneGoal = 100000;
  const milestoneProgress = Math.min(100, Math.round((gross / milestoneGoal) * 100));

  const monthlyGoal = 25000;
  const monthlyProgress = Math.min(100, Math.round((month / monthlyGoal) * 100));

  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-[#0A0D14] text-white p-4 sm:p-7 shadow-2xl relative overflow-hidden font-sans",
        className
      )}
    >
      {/* Background Ambient Glow */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
              Creator Revenue & Royalties Matrix
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Live course sales, 1-on-1 mentorship bookings, project asset royalties, and instant Cashfree payouts.
          </p>
        </div>

        {/* Currency & Identity */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10">
            {(["INR", "USD", "EUR"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={cn(
                  "px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-all",
                  currency === c ? "bg-emerald-600 text-white font-bold" : "text-zinc-400 hover:text-white"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <img
              src={avatarUrl}
              alt={creatorName}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://api.dicebear.com/7.x/bottts/svg?seed=Creator";
              }}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-500/50"
            />
            <span className="text-xs font-medium text-zinc-200">{creatorName}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6 relative z-10">
        {/* Stream Breakdown (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-zinc-950/60 p-5 sm:p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
                Revenue Streams Breakdown
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" /> +14.2% MoM
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extralight font-display text-white">
                {formatMoney(gross)}
              </span>
              <span className="text-xs text-zinc-400 font-medium">Lifetime Creator Earnings</span>
            </div>

            {/* Visual Stream Bar */}
            <div className="mt-5 h-3 w-full rounded-full bg-white/5 overflow-hidden flex p-0.5 gap-1">
              <div style={{ width: "65%" }} className="h-full rounded-full bg-emerald-500" title="Course Sales 65%" />
              <div style={{ width: "25%" }} className="h-full rounded-full bg-blue-500" title="Mentorship 25%" />
              <div style={{ width: "10%" }} className="h-full rounded-full bg-purple-500" title="Assets 10%" />
            </div>

            {/* Channels List */}
            <div className="mt-5 space-y-3">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Course Royalties (70% share)</h4>
                    <p className="text-[10px] text-zinc-400">Paid enrollments directly credited</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-white">{formatMoney(courseRoyalties)}</span>
                  <p className="text-[10px] text-emerald-400 font-mono">65% of volume</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">1-on-1 Mentorship Sessions</h4>
                    <p className="text-[10px] text-zinc-400">Verified student coaching hours</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-white">{formatMoney(mentorshipEarnings)}</span>
                  <p className="text-[10px] text-blue-400 font-mono">25% of volume</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Code className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Digital Project Assets & Code</h4>
                    <p className="text-[10px] text-zinc-400">Starter templates & boilerplate sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-white">{formatMoney(assetEarnings)}</span>
                  <p className="text-[10px] text-purple-400 font-mono">10% of volume</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Cashfree Instant Settlement Active
            </span>
            <span className="font-mono">Direct Bank Transfer</span>
          </div>
        </div>

        {/* Goals & Clearance Stats (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Milestone Target Card */}
          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5 backdrop-blur-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400 flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-amber-400" />
                Milestone Target (₹1 Lakh)
              </span>
              <span className="text-amber-400 font-mono text-xs">{milestoneProgress}%</span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-light font-display text-white">
                {formatMoney(gross)} <span className="text-xs text-zinc-400 font-sans">/ {formatMoney(milestoneGoal)}</span>
              </div>
              <div className="mt-3 w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                  style={{ width: `${milestoneProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Monthly Target Card */}
          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5 backdrop-blur-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-blue-400" />
                Monthly Pace Target (₹25K)
              </span>
              <span className="text-blue-400 font-mono text-xs">{monthlyProgress}%</span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-light font-display text-white">
                {formatMoney(month)} <span className="text-xs text-zinc-400 font-sans">/ {formatMoney(monthlyGoal)}</span>
              </div>
              <div className="mt-3 w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${monthlyProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Payout SLA Pill */}
          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4 backdrop-blur-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Payout Clearing SLA</h4>
                <p className="text-[10px] text-zinc-400">Cashfree Payouts: &lt; 2 Hours avg</p>
              </div>
            </div>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
              Ready to Withdraw
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatorRevenueBento;
