"use client";

import React, { useState } from "react";
import {
  Sparkles,
  GraduationCap,
  Award,
  Zap,
  TrendingUp,
  Receipt,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface LearningInvestmentBentoProps {
  totalInvested: number;
  currentPlan?: string;
  creditsRemaining?: number;
  creditsUsed?: number;
  paymentCount?: number;
  userName?: string;
  avatarUrl?: string;
  className?: string;
}

export function LearningInvestmentBento({
  totalInvested,
  currentPlan = "Career Pro",
  creditsRemaining = 850,
  creditsUsed = 150,
  paymentCount = 1,
  userName = "Learner",
  avatarUrl = "/assets/vishwajeet-profile.png",
  className = "",
}: LearningInvestmentBentoProps) {
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

  const totalCredits = creditsRemaining + creditsUsed;
  const creditProgress = totalCredits > 0 ? Math.round((creditsRemaining / totalCredits) * 100) : 100;

  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-[#0A0D14] text-white p-4 sm:p-7 shadow-2xl relative overflow-hidden font-sans",
        className
      )}
    >
      {/* Background Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
              Learning Investment & Milestone Matrix
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Live analytics tracking your career acceleration, AI training compute, certification value, and verified credentials.
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
                  currency === c ? "bg-blue-600 text-white font-bold" : "text-zinc-400 hover:text-white"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <img
              src={avatarUrl}
              alt={userName}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://api.dicebear.com/7.x/bottts/svg?seed=Learner";
              }}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-blue-500/50"
            />
            <span className="text-xs font-medium text-zinc-200">{userName}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6 relative z-10">
        {/* Total Invested & Value Card (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-zinc-950/60 p-5 sm:p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
                Capital Invested in Upskilling
              </span>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
                High ROI Tier
              </Badge>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl sm:text-5xl font-extralight font-display text-white">
                {formatMoney(totalInvested)}
              </span>
              <span className="text-xs sm:text-sm text-emerald-400 font-mono font-medium">
                Verified Tax-Deductible Education
              </span>
            </div>

            {/* Milestones Progress Rows */}
            <div className="mt-6 space-y-4">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-400" />
                    Full-Stack AI Engineering Track
                  </span>
                  <span className="font-mono text-amber-400">72% Completed</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" style={{ width: "72%" }} />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-400" />
                    Cloud Architecture & System Design
                  </span>
                  <span className="font-mono text-blue-400">48% Completed</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "48%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              All Course Access & Engraved Verification Active
            </span>
            <span className="font-mono">18% GST Compliant</span>
          </div>
        </div>

        {/* Plan & AI Compute Pool (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Active Plan Card */}
          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5 backdrop-blur-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                Active Plan
              </span>
              <span className="text-emerald-400 font-mono text-[11px]">ACTIVE</span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold font-display text-white">{currentPlan}</div>
              <p className="text-xs text-zinc-400 mt-1">Unlimited course streaming & verification</p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Gateways: Cashfree / Razorpay</span>
              <span className="text-blue-400 font-mono">{paymentCount} Invoices</span>
            </div>
          </div>

          {/* AI Compute Pool */}
          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5 backdrop-blur-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-yellow-400" />
                AI Inference Credits
              </span>
              <span className="text-yellow-400 font-mono text-xs">{creditProgress}% pool</span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-light font-display text-white">
                {creditsRemaining} <span className="text-xs text-zinc-400 font-sans">credits remaining</span>
              </div>
              <div className="mt-3 w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${creditProgress}%` }}
                />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Used this cycle: {creditsUsed}</span>
              <span className="text-emerald-400 font-medium">Auto-Replenish Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearningInvestmentBento;
