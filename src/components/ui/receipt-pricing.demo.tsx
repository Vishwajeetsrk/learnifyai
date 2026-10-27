"use client"

import React from "react"
import { ReceiptPricing, type ReceiptPlan } from "@/components/ui/receipt-pricing"
import { toast } from "sonner"

const PLANS: ReceiptPlan[] = [
  {
    id: "student",
    name: "Student Starter",
    tagline: "Career acceleration for college & juniors",
    monthly: 499,
    cta: "Activate Student Access",
    items: [
      { label: "AI Credits", value: "5,000 / mo" },
      { label: "Certificates", value: "Verified QR" },
      { label: "Mock Interviews", value: "5 / mo" },
      { label: "Coach Sessions", value: "Community" },
      { label: "GST (18%)", value: "Included" },
    ],
  },
  {
    id: "pro",
    name: "Engineer Pro",
    tagline: "Complete toolkit for software engineers",
    monthly: 1499,
    featured: true,
    cta: "Join Pro Track",
    items: [
      { label: "AI Credits", value: "Unlimited" },
      { label: "1:1 Coaching", value: "1 Session/mo" },
      { label: "Code Sandbox", value: "Unlimited" },
      { label: "System Design", value: "Full Stack" },
      { label: "Razorpay Checkout", value: "Instant" },
      { label: "GST (18%)", value: "Included" },
    ],
  },
  {
    id: "executive",
    name: "Staff & Executive",
    tagline: "Direct mentorship with FAANG/Staff directors",
    monthly: 3999,
    cta: "Reserve Executive Seat",
    items: [
      { label: "1:1 Strategy", value: "Weekly 45m" },
      { label: "Video Meetings", value: "Meet & Zoom" },
      { label: "Resume Rewrite", value: "Staff Review" },
      { label: "Negotiation Prep", value: "Included" },
      { label: "Dedicated Coach", value: "Dr. Vikram" },
      { label: "GST (18%)", value: "Included" },
    ],
  },
]

export function ReceiptPricingDemo() {
  const handleSelectPlan = (plan: ReceiptPlan, period: "monthly" | "yearly") => {
    toast.success(`Selected ${plan.name} (${period} billing) via Razorpay`)
  }

  return (
    <div className="bg-transparent flex w-full flex-col items-center justify-center py-10 px-4">
      <ReceiptPricing
        plans={PLANS}
        defaultPeriod="yearly"
        merchant="LEARNIFY AI EDTECH"
        merchantNote="SAC 998431 · GSTIN 29XXXXX1234X1Z5 · 18% GST"
        orderPrefix="LNF"
        monthsFree={2}
        currency="INR"
        locale="en-IN"
        onSelectPlan={handleSelectPlan}
      >
        <div className="mx-auto mb-8 max-w-2xl text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span>Thermal Ledger Print Animation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Transparent Ledger Pricing
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base max-w-lg mx-auto">
            Printed itemized receipts with serrated tear edges. Toggle yearly billing to tear off monthly slips and reprint with 2 months free.
          </p>
        </div>
      </ReceiptPricing>
    </div>
  )
}

export default ReceiptPricingDemo
