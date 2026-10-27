"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type ReceiptPeriod = "monthly" | "yearly"

/** One printed ledger row: a label on the left, a short value on the right, dot leaders between. */
export interface ReceiptItem {
  /** Left column. Printed as given; short uppercase reads most like a receipt. */
  label: string
  /** Right column. Keep it to a few characters: "10", "2M", "UNLIMITED". */
  value: string
}

export interface ReceiptPlan {
  /** Stable id. Also seeds the order number and the barcode, so both stay consistent between renders. */
  id: string
  /** Plan name, printed as the document title. */
  name: string
  /** One short line under the plan name. */
  tagline?: string
  /** Price per month when billed monthly, in major units (32 = $32.00 or 999 = ₹999.00). */
  monthly: number
  /** Total per year when billed yearly. Defaults to `monthly * (12 - monthsFree)`. */
  yearly?: number
  /** Ledger rows printed between the plan name and the total. 4–7 reads best. */
  items: ReceiptItem[]
  /** Button label. Defaults to `Choose <name>`. */
  cta?: string
  /** Prints "MOST POPULAR", uses the primary-colored button and gets the savings stamp first. */
  featured?: boolean
}

export interface ReceiptPricingProps extends React.ComponentProps<"section"> {
  /** The plans to print, left to right. */
  plans: ReceiptPlan[]
  /** Controlled billing period. */
  period?: ReceiptPeriod
  /** Uncontrolled starting period. */
  defaultPeriod?: ReceiptPeriod
  /** Called when the reader switches period (before the paper finishes reprinting). */
  onPeriodChange?: (period: ReceiptPeriod) => void
  /** Called when a plan's button is pressed. */
  onSelectPlan?: (plan: ReceiptPlan, period: ReceiptPeriod) => void
  /** Months waived on yearly billing. Drives the default yearly price and the discount line. */
  monthsFree?: number
  /** ISO 4217 code for `Intl.NumberFormat`. */
  currency?: string
  /** Locale for `Intl.NumberFormat`. Fixed by default so server and client format identically. */
  locale?: string
  /** Printed at the top of every receipt. */
  merchant?: string
  /** Small line under the merchant. */
  merchantNote?: string
  /** Two letters in front of the generated order number. */
  orderPrefix?: string
  /** Labels for the two radio options. */
  periodLabels?: [string, string]
  /** Stamp text on yearly receipts. `{months}` is replaced with `monthsFree`. */
  stampLabel?: string
  /** Print the rotated savings stamp on yearly receipts. */
  showStamp?: boolean
  /** Print the barcode block at the foot of each receipt. */
  showBarcode?: boolean
  /** Print the receipts the first time the section scrolls into view. */
  printOnReveal?: boolean
  /** Milliseconds for one receipt to print top to bottom. */
  printMs?: number
  /** Milliseconds for the old receipt to tear off. Exits are shorter than entrances on purpose. */
  tearMs?: number
  /** Milliseconds between receipts, so the row prints left to right. */
  stagger?: number
  /** Distance in px between the serrations on the torn edges. */
  toothWidth?: number
  /** Depth in px of each serration. Half of `toothWidth` gives a continuous zigzag. */
  toothDepth?: number
  /** Strength (0–1) of the thermal scan lines on the paper. 0 turns them off. */
  grain?: number
}

type Phase = "idle" | "tear" | "hidden" | "print"

const ENTER = "cubic-bezier(0.22, 1, 0.36, 1)"
const EXIT = "cubic-bezier(0.4, 0, 1, 1)"

/** FNV-1a. Small, stable, and enough to give every plan its own order number and barcode. */
function hash(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Bar widths in px, derived from the seed so the same receipt always prints the same code. */
function bars(seed: string, count: number): number[] {
  let h = hash(seed)
  const out: number[] = []
  for (let i = 0; i < count; i++) {
    h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0
    out.push((h % 3) + 1)
  }
  return out
}

function useReducedMotion(): boolean {
  const subscribe = React.useCallback((onChange: () => void) => {
    if (typeof window === "undefined" || !window.matchMedia) return () => {}
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])
  return React.useSyncExternalStore(
    subscribe,
    () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false),
    () => false
  )
}

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

/**
 * ReceiptPricing — a pricing section whose plans print like thermal receipts.
 */
export function ReceiptPricing({
  plans,
  period,
  defaultPeriod = "monthly",
  onPeriodChange,
  onSelectPlan,
  monthsFree = 2,
  currency = "INR",
  locale = "en-IN",
  merchant = "Learnify AI",
  merchantNote = "Official Indian EdTech Ledger · GST 18%",
  orderPrefix = "LN",
  periodLabels = ["Monthly", "Yearly (2 Mo Free)"],
  stampLabel = "{months} months free",
  showStamp = true,
  showBarcode = true,
  printOnReveal = true,
  printMs = 460,
  tearMs = 200,
  stagger = 60,
  toothWidth = 12,
  toothDepth = 6,
  grain = 0.05,
  className,
  children,
  ...rest
}: ReceiptPricingProps) {
  const rootRef = React.useRef<HTMLElement | null>(null)
  const optionRefs = React.useRef<Array<HTMLButtonElement | null>>([])
  const reduce = useReducedMotion()

  const [internal, setInternal] = React.useState<ReceiptPeriod>(defaultPeriod)
  const selected = period ?? internal
  const [printed, setPrinted] = React.useState<ReceiptPeriod>(selected)
  const [phase, setPhase] = React.useState<Phase>("idle")

  const count = Math.max(plans.length, 1)
  const rowMs = (base: number) => base + stagger * (count - 1)

  React.useEffect(() => {
    if (selected === printed) return
    if (reduce || printMs + tearMs === 0) {
      setPrinted(selected)
      setPhase("idle")
      return
    }
    const tearDone = rowMs(tearMs)
    setPhase("tear")
    const t1 = window.setTimeout(() => {
      setPrinted(selected)
      setPhase("hidden")
    }, tearDone)
    const t2 = window.setTimeout(() => setPhase("print"), tearDone + 32)
    const t3 = window.setTimeout(() => setPhase("idle"), tearDone + 32 + rowMs(printMs))
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
    }
  }, [selected, reduce])

  useIsoLayoutEffect(() => {
    const host = rootRef.current
    if (!host || !printOnReveal || reduce) return
    let t1 = 0
    let t2 = 0
    const start = () => {
      t1 = window.setTimeout(() => setPhase("print"), 32)
      t2 = window.setTimeout(() => setPhase("idle"), 32 + rowMs(printMs))
    }
    setPhase("hidden")
    const rect = host.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
      start()
      return () => {
        window.clearTimeout(t1)
        window.clearTimeout(t2)
      }
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        start()
      },
      { threshold: 0.2 }
    )
    io.observe(host)
    return () => {
      io.disconnect()
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])

  const money = React.useMemo(
    () => new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }),
    [locale, currency]
  )

  const select = (next: ReceiptPeriod) => {
    if (period === undefined) setInternal(next)
    onPeriodChange?.(next)
  }

  const onOptionKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const order: ReceiptPeriod[] = ["monthly", "yearly"]
    const at = order.indexOf(selected)
    let next = at
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (at + 1) % order.length
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (at + order.length - 1) % order.length
    else if (e.key === "Home") next = 0
    else if (e.key === "End") next = order.length - 1
    else return
    e.preventDefault()
    const value = order[next]
    if (!value) return
    select(value)
    optionRefs.current[next]?.focus()
  }

  const stamp = stampLabel.replace("{months}", String(monthsFree))
  const summary = plans
    .map((p) => {
      const due = printed === "yearly" ? (p.yearly ?? p.monthly * (12 - monthsFree)) : p.monthly
      return `${p.name} ${money.format(due)} ${printed === "yearly" ? "per year" : "per month"}`
    })
    .join(", ")

  return (
    <section
      ref={rootRef}
      data-slot="receipt-pricing"
      data-period={selected}
      className={cn("w-full", className)}
      {...rest}
    >
      {children}

      <div
        data-slot="period-toggle"
        role="radiogroup"
        aria-label="Billing period"
        className="bg-muted/80 backdrop-blur-sm mx-auto flex h-11 w-fit items-center rounded-full p-1 border border-border/60 shadow-inner"
      >
        {(["monthly", "yearly"] as const).map((option, i) => {
          const active = selected === option
          return (
            <button
              key={option}
              ref={(node) => {
                optionRefs.current[i] = node
              }}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              data-slot={option === "yearly" ? "cta-primary" : "period-option"}
              data-period={option}
              data-state={active ? "checked" : "unchecked"}
              onClick={() => select(option)}
              onKeyDown={onOptionKeyDown}
              className={cn(
                "focus-visible:ring-ring/50 h-9 cursor-pointer rounded-full px-5 text-sm font-semibold outline-none transition-all duration-200 focus-visible:ring-[2px]",
                active ? "bg-background text-foreground shadow-sm scale-100" : "text-muted-foreground hover:text-foreground hover:scale-[0.98]"
              )}
            >
              {periodLabels[i]}
            </button>
          )
        })}
      </div>

      <div
        data-slot="receipt-row"
        className="mx-auto mt-10 grid w-full max-w-6xl grid-cols-1 items-start justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {plans.map((plan, i) => (
          <ReceiptSlip
            key={plan.id}
            plan={plan}
            period={printed}
            phase={phase}
            delay={stagger * i}
            index={i}
            money={money}
            monthsFree={monthsFree}
            merchant={merchant}
            merchantNote={merchantNote}
            orderPrefix={orderPrefix}
            stamp={stamp}
            showStamp={showStamp}
            showBarcode={showBarcode}
            printMs={printMs}
            tearMs={tearMs}
            toothWidth={toothWidth}
            toothDepth={toothDepth}
            grain={grain}
            onSelect={() => onSelectPlan?.(plan, selected)}
          />
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Billed {printed}. {summary}.
      </p>
    </section>
  )
}

export interface ReceiptSlipProps {
  plan: ReceiptPlan
  period: ReceiptPeriod
  phase: Phase
  delay: number
  index: number
  money: Intl.NumberFormat
  monthsFree: number
  merchant: string
  merchantNote: string
  orderPrefix: string
  stamp: string
  showStamp: boolean
  showBarcode: boolean
  printMs: number
  tearMs: number
  toothWidth: number
  toothDepth: number
  grain: number
  onSelect: () => void
}

/** One slip of paper. Exported so a single plan can be dropped into a card or a checkout page. */
export function ReceiptSlip({
  plan,
  period,
  phase,
  delay,
  index,
  money,
  monthsFree,
  merchant,
  merchantNote,
  orderPrefix,
  stamp,
  showStamp,
  showBarcode,
  printMs,
  tearMs,
  toothWidth,
  toothDepth,
  grain,
  onSelect,
}: ReceiptSlipProps) {
  const yearly = plan.yearly ?? plan.monthly * (12 - monthsFree)
  const isYearly = period === "yearly"
  const subtotal = isYearly ? plan.monthly * 12 : plan.monthly
  const discount = isYearly ? subtotal - yearly : 0
  const due = isYearly ? yearly : plan.monthly
  const perMonth = isYearly ? yearly / 12 : plan.monthly
  const order = `${orderPrefix}-${(hash(plan.id) % 90000) + 10000}`
  const code = `${order}-${isYearly ? "YR" : "MO"}`

  const paper: React.CSSProperties = {
    ["--tooth-w" as string]: `${toothWidth}px`,
    ["--tooth-h" as string]: `${toothDepth * 2}px`,
    maskImage: MASK_LAYERS,
    maskSize: MASK_SIZE,
    maskPosition: MASK_POSITION,
    maskRepeat: MASK_REPEAT,
    WebkitMaskImage: MASK_LAYERS,
    WebkitMaskSize: MASK_SIZE,
    WebkitMaskPosition: MASK_POSITION,
    WebkitMaskRepeat: MASK_REPEAT,
    backgroundImage:
      grain > 0
        ? `repeating-linear-gradient(180deg, color-mix(in oklab, currentColor ${(grain * 100).toFixed(1)}%, transparent) 0 1px, transparent 1px 4px)`
        : undefined,
    ...phaseStyle(phase, delay, printMs, tearMs),
  }

  return (
    <div
      data-slot="receipt-slip"
      data-plan={plan.id}
      className="w-full max-w-[21rem] transition-transform duration-200 ease-out hover:-translate-y-1"
      style={{ filter: "drop-shadow(0 2px 4px rgb(0 0 0 / 0.1)) drop-shadow(0 16px 20px rgb(0 0 0 / 0.2))" }}
    >
      <article
        aria-label={`${plan.name} plan`}
        className="bg-card text-card-foreground border-border/80 dark:bg-neutral-100 dark:text-neutral-900 dark:border-neutral-300 relative overflow-hidden border-x px-6 pt-9 pb-8 font-mono rounded-none"
        style={paper}
      >
        <header className="text-center">
          <p className="text-[13px] font-bold tracking-[0.32em] uppercase text-primary dark:text-neutral-900">{merchant}</p>
          <p className="text-muted-foreground dark:text-neutral-600 mt-1.5 text-[11px] tracking-[0.14em] uppercase">{merchantNote}</p>
        </header>

        <Rule className="mt-5" />

        <dl className="text-muted-foreground dark:text-neutral-600 mt-3 space-y-1 text-[11px] tracking-[0.1em] uppercase">
          <div className="flex justify-between gap-3">
            <dt>Order ID</dt>
            <dd className="text-card-foreground dark:text-neutral-900 font-bold tabular-nums">{order}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Billing</dt>
            <dd className="text-card-foreground dark:text-neutral-900 font-semibold">{isYearly ? "Annualized (18% GST incl)" : "Monthly Recurring"}</dd>
          </div>
        </dl>

        <Rule className="mt-3" />

        <div className="mt-4 text-center">
          <h3 className="text-xl font-bold tracking-[0.18em] uppercase">{plan.name}</h3>
          {plan.tagline ? <p className="text-muted-foreground dark:text-neutral-600 mt-1 text-[11px] tracking-[0.08em] uppercase">{plan.tagline}</p> : null}
          {plan.featured ? (
            <p className="text-primary dark:text-indigo-600 mt-2 text-[11px] font-bold tracking-[0.24em] uppercase">
              <span aria-hidden="true">★ </span>Recommended by Mentors<span aria-hidden="true"> ★</span>
            </p>
          ) : null}
        </div>

        <Rule className="mt-4" />

        <ul className="mt-4 space-y-1.5 text-xs tracking-[0.05em] uppercase">
          {plan.items.map((item) => (
            <li key={item.label} className="flex items-baseline gap-1.5">
              <span className="shrink-0">{item.label}</span>
              <span aria-hidden="true" className="border-current/30 min-w-3 flex-1 translate-y-[-0.28em] border-b border-dotted" />
              <span className="shrink-0 font-semibold tabular-nums">{item.value}</span>
            </li>
          ))}
        </ul>

        <Rule className="mt-4" />

        <dl className="mt-4 space-y-1.5 text-xs tracking-[0.06em] uppercase">
          <div className="flex items-baseline justify-between gap-3">
            <dt>Base Subtotal</dt>
            <dd className="tabular-nums font-semibold">{money.format(subtotal)}</dd>
          </div>
          {discount > 0 ? (
            <div className="text-emerald-600 dark:text-emerald-700 font-bold flex items-baseline justify-between gap-3">
              <dt>{monthsFree} Mo Savings waived</dt>
              <dd className="tabular-nums">-{money.format(discount)}</dd>
            </div>
          ) : null}
        </dl>

        <div className="border-current/40 mt-3 border-t-[3px] border-double pt-3">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-xs font-bold tracking-[0.1em] uppercase">Total Payable</p>
            <p className="text-2xl font-black tabular-nums">{money.format(due)}</p>
          </div>
          <p className="text-muted-foreground dark:text-neutral-600 mt-1.5 text-[11px] tracking-[0.08em] uppercase">
            {isYearly ? `${money.format(perMonth)} / mo · Billed annually` : "Billed monthly · Cancel anytime in 1-click"}
          </p>
        </div>

        {showStamp && isYearly && monthsFree > 0 && plan.monthly > 0 && due > 0 ? (
          <p
            className="border-emerald-600 text-emerald-600 dark:border-emerald-700 dark:text-emerald-700 mx-auto mt-4 w-fit border-2 px-3 py-1 text-[11px] font-black tracking-[0.2em] uppercase rounded-sm"
            style={{ transform: `rotate(${-3 + (index % 3) * 1.2}deg)` }}
          >
            {stamp}
          </p>
        ) : null}

        <button
          type="button"
          data-slot="plan-cta"
          onClick={onSelect}
          className={cn(
            "focus-visible:ring-ring/50 mt-5 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-lg text-xs font-bold tracking-[0.16em] uppercase outline-none transition-all duration-200 focus-visible:ring-[2px] active:scale-[0.98]",
            plan.featured
              ? "bg-primary text-primary-foreground dark:bg-neutral-900 dark:text-white hover:opacity-90 shadow-md"
              : "border-current/40 hover:bg-current/10 border font-semibold"
          )}
        >
          {plan.cta ?? `Select ${plan.name}`}
        </button>

        {showBarcode ? (
          <div className="mt-6">
            <div aria-hidden="true" className="mx-auto flex h-9 w-fit items-stretch">
              {bars(code, 46).map((w, b) => (
                <span
                  key={b}
                  className={b % 2 === 0 ? "bg-current" : ""}
                  style={{ width: `${w}px` }}
                />
              ))}
            </div>
            <p aria-hidden="true" className="text-muted-foreground dark:text-neutral-600 mt-1.5 text-center text-[10.5px] font-mono tracking-[0.24em] uppercase">{code}</p>
          </div>
        ) : null}

        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={headStyle(phase, delay, printMs)} />
      </article>
    </div>
  )
}

function Rule({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("border-current/30 border-t border-dashed", className)} />
}

const MASK_LAYERS = [
  "linear-gradient(135deg, transparent 50%, black 0)",
  "linear-gradient(-135deg, transparent 50%, black 0)",
  "linear-gradient(black, black)",
  "linear-gradient(135deg, black 50%, transparent 0)",
  "linear-gradient(-135deg, black 50%, transparent 0)",
].join(", ")
const MASK_SIZE =
  "var(--tooth-w) var(--tooth-h), var(--tooth-w) var(--tooth-h), 100% calc(100% - var(--tooth-h)), var(--tooth-w) var(--tooth-h), var(--tooth-w) var(--tooth-h)"
const MASK_POSITION = "0 0, 0 0, 0 calc(var(--tooth-h) / 2), 0 100%, 0 100%"
const MASK_REPEAT = "repeat-x, repeat-x, no-repeat, repeat-x, repeat-x"

function phaseStyle(phase: Phase, delay: number, printMs: number, tearMs: number): React.CSSProperties {
  switch (phase) {
    case "tear":
      return {
        clipPath: "inset(0 0 0 0)",
        transform: "translateY(28px) rotate(0.5deg)",
        opacity: 0,
        transition: `transform ${tearMs}ms ${EXIT} ${delay}ms, opacity ${tearMs}ms linear ${delay}ms`,
      }
    case "hidden":
      return { clipPath: "inset(0 0 100% 0)", transform: "none", opacity: 1, transition: "none" }
    case "print":
      return {
        clipPath: "inset(0 0 0 0)",
        transform: "none",
        opacity: 1,
        transition: `clip-path ${printMs}ms ${ENTER} ${delay}ms`,
      }
    default:
      return { clipPath: "inset(0 0 0 0)", transform: "none", opacity: 1 }
  }
}

function headStyle(phase: Phase, delay: number, printMs: number): React.CSSProperties {
  const bar =
    "linear-gradient(to bottom, transparent 0%, transparent 86%, color-mix(in oklab, currentColor 6%, transparent) 97%, color-mix(in oklab, currentColor 30%, transparent) 100%)"
  if (phase === "hidden") return { backgroundImage: bar, transform: "translateY(-100%)", opacity: 1, transition: "none" }
  if (phase === "print")
    return {
      backgroundImage: bar,
      transform: "translateY(0)",
      opacity: 1,
      transition: `transform ${printMs}ms ${ENTER} ${delay}ms`,
    }
  return { backgroundImage: bar, transform: "translateY(0)", opacity: 0, transition: "opacity 160ms linear" }
}

export default ReceiptPricing
