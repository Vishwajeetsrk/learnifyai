import { useGlobalCurrency, type CurrencyCode } from "@/lib/currency";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function CurrencySelector({ className }: { className?: string }) {
  const { currency, config, changeCurrency, currencies } = useGlobalCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative inline-block text-left", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-background/80 backdrop-blur text-xs font-semibold text-foreground hover:bg-accent/50 transition-all shadow-xs"
        aria-label="Select Currency"
      >
        <span className="text-sm">{config.flag}</span>
        <span className="font-bold">{config.code}</span>
        <span className="text-muted-foreground">({config.symbol})</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl z-50 p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground border-b border-border/50 mb-1 flex items-center justify-between">
            <span>Global Currency</span>
            <Globe className="h-3 w-3 text-primary" />
          </div>
          <div className="max-h-60 overflow-y-auto space-y-0.5 no-scrollbar">
            {currencies.map((c) => {
              const active = c.code === currency;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    changeCurrency(c.code as CurrencyCode);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left",
                    active
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : "text-foreground hover:bg-muted/70"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{c.flag}</span>
                    <div>
                      <p className="leading-none">{c.code} <span className="opacity-75">({c.symbol})</span></p>
                      <p className={cn("text-[10px] mt-0.5", active ? "text-primary-foreground/80" : "text-muted-foreground")}>{c.name}</p>
                    </div>
                  </div>
                  {active && <Check className="h-3.5 w-3.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
