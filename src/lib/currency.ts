import { useState, useEffect } from "react";

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AED" | "CAD" | "AUD" | "SGD" | "JPY";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  rateFromINR: number;     // Nominal exchange rate from INR
  pppMultiplier: number;   // Purchasing Power Parity & market adjustment multiplier
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: "INR", symbol: "₹", name: "India (INR)", flag: "🇮🇳", rateFromINR: 1.0, pppMultiplier: 1.0 },
  USD: { code: "USD", symbol: "$", name: "United States (USD)", flag: "🇺🇸", rateFromINR: 0.012, pppMultiplier: 3.5 }, // ₹100 -> $4.20 / $4.99
  EUR: { code: "EUR", symbol: "€", name: "Europe (EUR)", flag: "🇪🇺", rateFromINR: 0.011, pppMultiplier: 3.5 }, // ₹100 -> €3.85 / €4.99
  GBP: { code: "GBP", symbol: "£", name: "United Kingdom (GBP)", flag: "🇬🇧", rateFromINR: 0.0094, pppMultiplier: 3.5 },
  AED: { code: "AED", symbol: "د.إ", name: "United Arab Emirates (AED)", flag: "🇦🇪", rateFromINR: 0.044, pppMultiplier: 3.0 },
  CAD: { code: "CAD", symbol: "C$", name: "Canada (CAD)", flag: "🇨🇦", rateFromINR: 0.016, pppMultiplier: 3.2 },
  AUD: { code: "AUD", symbol: "A$", name: "Australia (AUD)", flag: "🇦🇺", rateFromINR: 0.018, pppMultiplier: 3.2 },
  SGD: { code: "SGD", symbol: "S$", name: "Singapore (SGD)", flag: "🇸🇬", rateFromINR: 0.016, pppMultiplier: 3.0 },
  JPY: { code: "JPY", symbol: "¥", name: "Japan (JPY)", flag: "🇯🇵", rateFromINR: 1.80, pppMultiplier: 2.5 },
};

const CURRENCY_STORAGE_KEY = "learnify_global_currency";

export function getStoredCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "INR";
  try {
    const saved = localStorage.getItem(CURRENCY_STORAGE_KEY) as CurrencyCode;
    if (saved && SUPPORTED_CURRENCIES[saved]) return saved;
  } catch {
    /* ignore */
  }
  return "INR";
}

export function setGlobalCurrency(code: CurrencyCode) {
  if (typeof window === "undefined" || !SUPPORTED_CURRENCIES[code]) return;
  try {
    localStorage.setItem(CURRENCY_STORAGE_KEY, code);
    window.dispatchEvent(new CustomEvent("currency-change", { detail: code }));
  } catch {
    /* ignore */
  }
}

export function convertFromINR(
  amountInINR: number,
  targetCode: CurrencyCode = getStoredCurrency()
): { amount: number; formatted: string; symbol: string; code: CurrencyCode } {
  const config = SUPPORTED_CURRENCIES[targetCode] || SUPPORTED_CURRENCIES.INR;
  if (amountInINR === 0) {
    return { amount: 0, formatted: "Free", symbol: config.symbol, code: config.code };
  }

  // Adjust for PPP & international market pricing
  const rawConverted = amountInINR * config.rateFromINR * config.pppMultiplier;
  const converted = Math.max(0.99, Math.round(rawConverted * 100) / 100);

  const numFormatted = targetCode === "JPY"
    ? Math.round(converted).toLocaleString()
    : converted.toFixed(2);

  const formatted = `${config.symbol}${numFormatted}`;
  return { amount: converted, formatted, symbol: config.symbol, code: config.code };
}

export function formatCurrency(amountInINR: number, codeOverride?: CurrencyCode): string {
  return convertFromINR(amountInINR, codeOverride).formatted;
}

export function useGlobalCurrency() {
  const [currency, setCurrencyState] = useState<CurrencyCode>(getStoredCurrency());

  useEffect(() => {
    const handleCurrencyChange = (e: Event) => {
      const customEvent = e as CustomEvent<CurrencyCode>;
      if (customEvent.detail && SUPPORTED_CURRENCIES[customEvent.detail]) {
        setCurrencyState(customEvent.detail);
      }
    };
    window.addEventListener("currency-change", handleCurrencyChange);
    return () => window.removeEventListener("currency-change", handleCurrencyChange);
  }, []);

  const changeCurrency = (newCode: CurrencyCode) => {
    setGlobalCurrency(newCode);
    setCurrencyState(newCode);
  };

  return {
    currency,
    config: SUPPORTED_CURRENCIES[currency],
    changeCurrency,
    format: (inrAmount: number) => convertFromINR(inrAmount, currency).formatted,
    convert: (inrAmount: number) => convertFromINR(inrAmount, currency),
    currencies: Object.values(SUPPORTED_CURRENCIES),
  };
}
