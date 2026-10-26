"use client";

import * as React from "react";
import { FinanceBento, FinanceBentoData } from "@/components/ui/finance-bento";

/* Geist + Geist Mono for the demo */
function useFonts() {
  React.useEffect(() => {
    const id = "geist-fonts";
    if (document.getElementById(id)) return;
    const l = document.createElement("link");
    l.id = id;
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Geist:wght@200;300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
}

/* 36 month-end balances that grow with some honest wobble */
const history = Array.from({ length: 36 }, (_, i) => {
  const t = i / 35;
  const d = new Date(2026, 9 - (35 - i), 1);
  const noise = (Math.sin(i * 12.9898 + 156.466) * 43758.5453) % 1;
  return {
    date: d.toISOString(),
    fiat: 14000 + t * 7000 + Math.sin(i * 0.9) * 900,
    stocks: 12000 + t * 19000 + Math.sin(i * 0.55) * 1600 + noise * 800,
    crypto: Math.max(2500, 4000 + t * 12000 + Math.sin(i * 0.8 + 1) * 3200 + Math.cos(i * 0.33) * 1400),
  };
});

export const sampleFinanceData: FinanceBentoData = {
  history,
  payments: [
    { name: "Rent", date: "Nov 1", amount: 1800 },
    { name: "Index fund · auto-buy", date: "Nov 3", amount: 500 },
    { name: "Insurance", date: "Nov 9", amount: 96 },
  ],
  goals: [
    { name: "House deposit", progress: 0.42, target: 60000 },
    { name: "Japan, spring", progress: 0.76, target: 6000 },
  ],
  cashflow: {
    months: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    income: [[2.4, 3.6, 5.4, 6.4, 5.0, 3.4], [2.0, 3.0, 4.4, 5.2, 4.2, 2.8], [1.6, 2.4, 3.4, 4.0, 3.3, 2.2]],
    spending: [[1.2, 2.2, 3.8, 4.6, 3.4, 1.8], [1.0, 1.8, 3.0, 3.8, 2.8, 1.5], [0.8, 1.4, 2.4, 3.0, 2.2, 1.2]],
  },
  crypto: [
    { name: "Bitcoin", symbol: "BTC", share: 0.62, change: "+3.1%", ohlc: [[66.1, 67.0, 65.8, 66.8], [66.8, 67.6, 66.5, 67.4], [67.4, 67.9, 66.9, 67.1], [67.1, 68.2, 67.0, 68.0], [68.0, 68.9, 67.8, 68.7], [68.7, 69.1, 68.1, 68.4], [68.4, 69.6, 68.3, 69.4]] },
    { name: "Ethereum", symbol: "ETH", share: 0.26, change: "−0.8%", ohlc: [[3.52, 3.58, 3.44, 3.47], [3.47, 3.55, 3.4, 3.53], [3.53, 3.56, 3.38, 3.41], [3.41, 3.5, 3.36, 3.48], [3.48, 3.51, 3.39, 3.43], [3.43, 3.49, 3.37, 3.46], [3.46, 3.52, 3.42, 3.44]] },
    { name: "Solana", symbol: "SOL", share: 0.12, change: "+6.4%", ohlc: [[142, 149, 139, 147], [147, 151, 141, 143], [143, 156, 142, 154], [154, 158, 147, 149], [149, 162, 148, 160], [160, 166, 155, 157], [157, 171, 156, 168]] },
  ],
  stocks: { days: ["Mon", "Tue", "Wed", "Thu", "Fri"], values: [2.1, 1.2, 3.4, 1.9, 4.6] },
};

const AVATAR = "/assets/vishwajeet-profile.png";

export default function FinanceBentoDemo() {
  useFonts();
  return (
    <div className="min-h-screen w-full bg-black px-4 py-6 sm:px-6 sm:py-8">
      <FinanceBento
        className="mx-auto max-w-[1320px]"
        data={sampleFinanceData}
        title="Overview"
        subtitle="Updated today, 09:41"
        avatar={AVATAR}
        avatarAlt="Vishwajeet"
        credit={false}
      />
    </div>
  );
}
