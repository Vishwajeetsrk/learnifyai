"use client";

import { useEffect, useRef, type CSSProperties } from "react";

export type FaqCard = {
  id: string;
  tab: string;
  q: string;
  a: string;
};

export type FaqDrawerOptions = {
  /** Small caps line above the title. */
  label?: string;
  title?: string;
  lead?: string;
  /** The text on the drawer's label holder. */
  drawer?: string;
  /** How many cards, 3 to 12. */
  count?: number;
  /** Which card starts open: "1" to "12", or "none". */
  open?: "none" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | string;
  /** Opening one card closes the others. */
  single?: boolean;
  askNote?: string;
  askLabel?: string;
  /** http(s), mailto, tel or a path. Anything else falls back to the default. */
  askHref?: string;
  /** "auto" follows the page: prefers-color-scheme, a .dark ancestor, or a [data-finish] ancestor. */
  finish?: "auto" | "aluminium" | "graphite";
  /** Optional custom card list. Falls back to DEFAULT_CARDS if not provided. */
  cards?: readonly FaqCard[];
};

/** Dark when a .dark / [data-theme=dark] ancestor says so, light when .light says so, else the system's setting. */
const isDark = (host: Element, mq: MediaQueryList | null): boolean => {
  if (host.closest(".dark, [data-theme='dark']")) return true;
  if (host.closest(".light, [data-theme='light']")) return false;
  return !!mq?.matches;
};

/** Default Learnify AI Platform FAQ Cards */
export const DEFAULT_LEARNIFY_CARDS: readonly FaqCard[] = Object.freeze([
  Object.freeze({
    id: "pricing-billing",
    tab: "Pricing",
    q: "How does Learnify AI billing work?",
    a: "We offer straightforward pricing with zero hidden fees. Single courses start at ₹99, Career Pro subscriptions provide unlimited access to all 50+ templates, interactive Scrimba workshops, and high-DPI verified credentials. All transactions are processed in Indian Rupees (INR ₹) via Cashfree and Razorpay with 18% GST tax invoices.",
  }),
  Object.freeze({
    id: "certification",
    tab: "Certificates",
    q: "Are Learnify AI certificates verifiable and tamper-proof?",
    a: "Yes. Every certificate features a banknote-grade Guilloche mathematical rosette lathe, cryptographic SHA-256 attestation, sovereign Rupee security seal, and a unique verifiable QR code. Prospective employers can instantly verify credential validity at learnifyai.in/verify/:id at any time.",
  }),
  Object.freeze({
    id: "career-pro",
    tab: "Career Pro",
    q: "What is included in the Career Pro membership?",
    a: "Career Pro unlocks full source-code export (production-ready ZIPs) for all 50+ design showcase templates, AI-directed Scrimba split-studio interactive code sandboxes, unlimited AI interview simulations with real-time feedback, and priority academic support.",
  }),
  Object.freeze({
    id: "refunds",
    tab: "Refunds",
    q: "What is your refund policy?",
    a: "We offer an instant 7-day money-back guarantee for subscription plans if you have not downloaded more than 2 source code packages. Instant GST-compliant credit notes are generated and refunded to your original payment method within 3 to 5 business days.",
  }),
  Object.freeze({
    id: "creator-payouts",
    tab: "Creators",
    q: "How do creators earn and withdraw payouts?",
    a: "Verified course creators and template designers keep up to 80% of net sales. Earnings accrue in your real-time creator wallet and can be withdrawn directly to your Indian bank account via instant IMPS or UPI VPA with automated TDS reporting.",
  }),
  Object.freeze({
    id: "offline-access",
    tab: "Access",
    q: "Can I download projects and run them offline?",
    a: "Absolutely. All exported projects are standalone bundles (HTML5, Vanilla CSS, Vite React, or Tailwind v4) that run out-of-the-box locally with `npm run dev` or simple static file hosting on Vercel, Netlify, or AWS.",
  }),
  Object.freeze({
    id: "security-data",
    tab: "Security",
    q: "Where is user data hosted and secured?",
    a: "All personal profiles and credential metadata are stored in Supabase with strict Row-Level Security (RLS) policies. Payment gateways never expose card or banking credentials to our servers, maintaining PCI-DSS Level 1 compliance.",
  }),
]);

const FINISHES: readonly string[] = Object.freeze(["auto", "aluminium", "graphite"]);

const DEFAULTS: Required<FaqDrawerOptions> = Object.freeze({
  label: "Platform Inquiries",
  title: "Everything you need to know.",
  lead: "The questions learners, creators, and engineering leads ask before getting started, neatly filed. Pull a card to inspect it.",
  drawer: "Learnify · Q–Z",
  count: 7,
  open: "1",
  single: true,
  askNote: "Have a specific question not in the drawer? Our academic support council is ready to help.",
  askLabel: "Ask Council",
  askHref: "mailto:support@learnifyai.in",
  finish: "auto",
  cards: DEFAULT_LEARNIFY_CARDS,
});

/** Tabs sit at three stations along the top edge, as a filing clerk staggers them. */
const TAB_STATIONS = Object.freeze([0.04, 0.37, 0.7]);
const tabStation = (i: number) => TAB_STATIONS[i % TAB_STATIONS.length];

/** How far into the drawer a card stands: 0 at the front, 1 at the back. */
const depthOf = (i: number, n: number) => (n <= 1 ? 0 : (n - 1 - i) / (n - 1));

/** The index printed on a card: Q.01, Q.02… */
const cardNumber = (i: number) => `Q.${String(i + 1).padStart(2, "0")}`;

/** A link the Ask key may carry: a page, a path, mail or a phone - never a script. */
const safeHref = (h: any, fallback = DEFAULTS.askHref) => {
  const s = String(h ?? "").trim();
  return /^(https?:\/\/|mailto:|tel:|\/|#|\.\/|\.\.\/)/i.test(s) ? s : fallback;
};

function normalise(
  opts: FaqDrawerOptions = {},
  prev: Required<FaqDrawerOptions> = DEFAULTS
): Required<FaqDrawerOptions> {
  const o: any = { ...prev, ...opts };
  for (const k of ["label", "title", "lead", "drawer", "askNote", "askLabel"]) o[k] = String(o[k] ?? "");
  o.askHref = safeHref(o.askHref);
  const activeCards = Array.isArray(opts.cards) && opts.cards.length > 0 ? opts.cards : prev.cards || DEFAULT_LEARNIFY_CARDS;
  o.cards = activeCards;
  o.count = Math.min(activeCards.length, Math.max(3, Math.round(Number(o.count)) || activeCards.length));
  o.open = String(o.open);
  o.single = o.single !== false && o.single !== "false";
  if (!FINISHES.includes(o.finish)) o.finish = "auto";
  return o;
}

function resolveFinish(own: string, around: string | undefined, prefersDark: boolean, tone: string | undefined) {
  if (own === "aluminium" || own === "graphite") return own;
  if (around === "aluminium" || around === "graphite") return around;
  if (tone === "light" || tone === "dark") return tone === "dark" ? "graphite" : "aluminium";
  return prefersDark ? "graphite" : "aluminium";
}

const esc = (s: any) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      (({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      } as Record<string, string>)[c] as string)
  );

let seq = 0;

function mount(host: HTMLElement, opts: FaqDrawerOptions = {}) {
  let o = normalise(opts);
  const uid = `fq${(seq += 1)}`;
  const root = document.createElement("section");
  root.className = "fq";
  root.dataset.block = "faq-drawer";
  root.setAttribute("aria-labelledby", `${uid}-title`);
  host.append(root);

  const render = () => {
    const n = o.count;
    const cardsList = (o.cards || DEFAULT_LEARNIFY_CARDS).slice(0, n);
    const cardsHtml = cardsList
      .map(
        (c, i) => `<details class="fq-card"${o.single ? ` name="${uid}"` : ""}${
          o.open === String(i + 1) ? " open" : ""
        } style="--k: ${i}; --depth: ${depthOf(i, n).toFixed(3)}; --tab-at: ${tabStation(i)}">
      <summary class="fq-edge">
        <span class="fq-tab" aria-hidden="true">${esc(c.tab)}</span>
        <span class="fq-no" aria-hidden="true">${cardNumber(i)}</span>
        <span class="fq-q">${esc(c.q)}</span>
        <span class="fq-mark" aria-hidden="true"></span>
      </summary>
      <div class="fq-face"><p class="fq-a">${esc(c.a)}</p><p class="fq-filed" aria-hidden="true">Filed under ${esc(
          c.tab
        )} · ${cardNumber(i)}</p></div>
    </details>`
      )
      .join("");

    root.innerHTML = `<div class="fq-wrap">
  <header class="fq-head">
    <p class="fq-label"></p>
    <h2 class="fq-title" id="${uid}-title"></h2>
    <p class="fq-lead"></p>
  </header>
  <div class="fq-cabinet">
    <div class="fq-drawer">
      <div class="fq-tray">${cardsHtml}</div>
      <div class="fq-front" aria-hidden="true">
        <span class="fq-holder"><span class="fq-holder-card"></span></span>
        <span class="fq-pull"></span>
      </div>
    </div>
    <div class="fq-ask">
      <p class="fq-note"></p>
      <a class="fq-key" href="${esc(o.askHref)}"></a>
    </div>
  </div>
</div>`;
    root.querySelector(".fq-label")!.textContent = o.label;
    root.querySelector(".fq-title")!.textContent = o.title;
    root.querySelector(".fq-lead")!.textContent = o.lead;
    root.querySelector(".fq-holder-card")!.textContent = o.drawer;
    root.querySelector(".fq-note")!.textContent = o.askNote;
    root.querySelector(".fq-key")!.textContent = o.askLabel;
  };

  const dark = typeof matchMedia === "function" ? matchMedia("(prefers-color-scheme: dark)") : null;
  const applyFinish = () => {
    const f = resolveFinish(
      o.finish,
      (host.closest("[data-finish]") as HTMLElement | null)?.dataset.finish,
      isDark(host, dark),
      (host.closest('[data-tone="light"], [data-tone="dark"]') as HTMLElement | null)?.dataset.tone
    );
    if (root.dataset.finish !== f) root.dataset.finish = f;
  };
  const finishObs = new MutationObserver(applyFinish);
  finishObs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-finish", "class", "data-theme"],
    subtree: true,
  });
  dark?.addEventListener("change", applyFinish);

  render();
  applyFinish();

  return {
    root,
    open(i: number) {
      const d = root.querySelectorAll(".fq-card")[i] as HTMLDetailsElement | undefined;
      if (d) d.open = true;
    },
    update(next = {}) {
      o = normalise(next, o);
      render();
      applyFinish();
    },
    destroy() {
      finishObs.disconnect();
      dark?.removeEventListener("change", applyFinish);
      root.remove();
    },
  };
}

export type FaqDrawerProps = FaqDrawerOptions & { className?: string; style?: CSSProperties };

/** An FAQ as a card-index drawer: each question typed along a card edge on a staggered tab, pull one to read it. */
export function FaqDrawer({ className, style, ...options }: FaqDrawerProps) {
  const host = useRef<HTMLDivElement>(null);
  const key = JSON.stringify(options);

  useEffect(() => {
    if (!host.current) return;
    const block = mount(host.current, JSON.parse(key) as FaqDrawerOptions);
    return () => block.destroy();
  }, [key]);

  return (
    <>
      <style>{CSS}</style>
      <div ref={host} className={className} style={{ width: "100%", ...style }} />
    </>
  );
}

export default FaqDrawer;

// Fonts embedded as data URIs (SIL OFL 1.1)
const INSTRUMENT_SANS_400 = "data:font/woff2;base64,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";
const INSTRUMENT_SANS_700 = "data:font/woff2;base64,d09GMgABAAAAAGzQABAAAAABC2QAAGxtAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGoJmG4HmfByYGgZgP1NUQVRaAIgmEQgKgcF4gZ4hATYCJAOPVAuHbAAEIAWOJAegCQwHG4b0J2iXX4Lb9GZVCuJzjRmbjbDdDtrC6Z2rAnbsBY8DusjVs///PzOpjLF/4H5ARQNIrRICKopRmafkZPbClEhZU9ryXlSm1OP0g/v2Kio171mM66gTpY2q6DxcXLtDEpKQDPVK3YTRMwNtgnTod4fEDV74jpOVWcWXntLahedy9hXZfODZ0dMbsq4IzJBZQ+aQNeADywj5orEUk1v9qrJ4f9lpQ7m2OH1WxOUx4Px8V91T02MThwx/IliEXU7wwxawyVQ9xg2XgbHLoES0GOtkXp6H+vPr3HppUPk9oLzYSMxASB3QNu/+ERGRIWIUxhRRsVBRGeLcpr121a50keGiXZvr1KXRY8gjWLkZvSg3PK+b/wer1bCWAgmGkM3IXDdzMwMEEsIOIYyECChTtGwXxThKcYDUbhy7rlGhrc/abYdj/tbxbTdP7ff8zsxePpZsasZg6A/MwZiNitzln+fv/dzr3DfTgQeoYgtHvIom9lVT0KNzVZnsuXyevOvabepBoggC4SRSoDACoZEEjGyxzt6LD1bhHAIrSUgQiniMQaEkVwAB9uT2NsDDl2VR/arJecyqE63Pm6bKUs5MMhSkzLoE8DvGAcezAbILQPk69ywi5Lr+//ZzeoEv3qYh4g9mksJvO91z25ROtQO0lUbkNcD/AmuYZLcKoFOUTHJJ4a/CDqBkswLytUpR94J2nDrsT6A2dmnXbRSRoD6eDrRp/d/m9sTu74vZSVRWJePt7Gw7Vt2qjVSmprFaVAkQglgIAQIRiChLBdxoljUqDUoSftAHxYN/2xn2n3TXpSOYWu4R/EZNZwtJ/qBtgT+j7ISekDNyAUDx/mRtX39LCoEEBJKcOWX05H8AQP77A/x9zvZfRJusiLcrwY97C+YfuaaXBunpgHgW8cJMMpPFrF3PyskMCGLBgkkXYQAHI7f/21TTJTw69plTu71OGSdq4zFW8hEy/ERIPCGZ4gS0MjpcWyiFHN9MUT22vy9V69qPLQxB2t5lG6bCRLXDyJzMCXelDVn25jwhnX7/363G64dPEIADG18wYWqCmi2uCMKcIYhRGQ2INkRpXZInSd6UJmRZGyLDBNK0ZkVjMjdrNJuCNqR8CvFwCvEWz7eYjnu43UOG/39XzvbNZU3YMlWVdYJxDt/JZ50Hu0sdwoHjoFaFVxz8PtX0qTtysAqgInF6oxibbgHp9aOiU1NS+3dvL2ColKIDXC3pBJ5z59ZN585Fafh//6bvwsEE2jogFL1Ff/ukgZQElFosqVvx30sK9jJzkCAyiF9KKbLH9d2+r48T73O3B7poRC4iRZAgQYJkg1sz78+7J33//zLDuZ/fHGsda984atSoqoqKiIiokfuFinTDr0XUPwksWung21KNhFI8JqpDbR1mO6+ONYxNDdw7LBhSFmASujjVmS4uwVQ2BgDUYXs4x/kGIAhHgcEgS2ZCzyqxposRSsaHiAjSi4QffwGkhpCZZCpEg7lZZhsWwQodlu3exsz0StxkUU8OTX2SW6bss/bhsJuCx/+iRvoQmw1kxwPy4gcFCISChEHRYqCJ5kKxFkFxDkEJjkEnJUGpbkC3PIGeKYEUVJBaJVStGmrQBnX4Jf6oEkTfMBKyiEySH5EUKRG5614YZdTIaNKEhAhgOjAQgeQBSqvppD6NAeDrqia1aYJAf0LjECt/Xntj7L2/HLwvNhqgTvMcPGavHwfuy+G/r8jqs64P4YEnIZJlHuRbW6/BD2YuZNVY6DgQE0KPPILWYBlkrukm9rUxIkUaQc6fmIiALRF0cfpKaERvcWJNC/UXCsZwmqEbiwGodRphGDmnr+p0SgD8DwaBwUMF/c0WwKAu/BX7Bb6DL+BjeBdeh/upS41dc5cBMNy5g21AYmPYMHq/f8Zu9l9OmUHrk9YsNW6DDqaoMA7R5MuZeDcUf7IfVW7YJ4Y7D1Yeh4bSALJYK58MYK25SGssY8sCb/JQYxMQF3SmtjO1wlUX8d4DPMUNmC1xgNfOLIhnQXSqXqPX6EmQxNJuk7c9ukJX4EULuGDg5YIL4Ww4FY6PHQkHw76wO+xobh0OnIhjFq0sdc5R//Va2bSXfjDSLskN/AQdcDRW1Ns4P7Vg1njWYT2vx/TAB+zyVfgwO9qPjf3ea0w62Ly5Ht8Rr3ePO0j36yN373Vt2MXQbjcKbDF0VoxA5pqOrc9uxosClOEBShzGaOjZMQhCr1rcrzvnCv0OfurQM/3xzX9XtFCB0CM6r/s+YIcuQgcZ4NCY1e6+nRCgCegbaYjTh6D/+HapTS3yQK/Wu3Tng6dYeSGToZFsa4QGW9TNZ3rY7ejUD7NKDu8yxUcYV2SnlmW1yPss/84u+kIdzfL/vXGdkBuXPJe/Zvlwcid/iYSX4ff/DzY2vuV9P7BPu+NCPuMcW5+h/JwhemjLulUH9FN9/wPe5FRwOzvax72xzYrSQ3aAfVzDgN6kD9y9m5XBsmZbHcyhAb1VlJBPJslbrbo6IrA/kfPRccdTIpUrIDYZDgv667FwzTr8ibLxVL+68X3jKVj6tt78NxFDAC7oV7rZP8Z+a94LdsCkEcTmvhEI0HpAz7Yd8IP3IVsLF+wo0C16ra578CgABbhEn3Aw2TDwQG0e7iXuSCe+nUVokFksJjvCXP2Lsb+Xyt+vxzGw5cYjIHLzj4fRx+Ns3fXMdUj2LH9u3c7W13YztlM3xlGu40dP8pK/XWc4lusCH0YOva30+2583Jqn2ikVhRLPTnFJzl7sXki40zskrXVqxJOB09SMp8VIM2pZ/APRKTpEnzkDTkyIO/dsfzsAUojsSpvOFXZKCJoO0UgJILTNOZmTSOwTg4DFhiQeWTu5OPXi4HQ4fUyNxzxOdboL/yqh/1sag/R3HnsmLZftkbYu4+YMpcb2Kh6lIPpEWT7NUZii8OwiyLujuNqfjEjrWT3txLoiBY/TmPKmTRQSCA2U/T4Q2s0+oJjcXNc0BFeke+NqZ7s48xgbnC1FMdzYCbbs4GTBMhZ4jAABxggQTFHIiSrylV1i1znPzN2xB9ujigof6Pvk2g6pDkns9ApYrtfLgzSKOBHbxe4Um5pTsEJM89fEtA62X42kFETfY2Z6DF1PrY+bgLSiejABECIMNnAYZKjL+HBmus43YQKjjLq67+phqjtZBsvmJrjUXdfVVRIOeTrrYMMApFPEWAsAgEhUU321/l+MTK8dTAAEZ7lF5Eah5wEQcIeUMcZaBwAU5FZX6KZb3TUeH858zXTV5hJeedcEE0y/jgLoY40Ib/wJJpJJTGcrOznOWZJ5xVtyyOVlPpjqv3y+YZoRcKN0tS7V+Tpz82Qdq8N1oPZe7grNfj8VIQZYV37BPYV2KflB4fWJHDT1I8Uwu+HWEwz6uAidBP33RwYL4uuE1nSL9DAQq75gQgRo/sW97D2ggRWfIiyIEwV6myqvRtDUkdFRJpAV1VRV5K1ratA4ZBQ4FFURYhQ5OBQcFBhMRPHAJdTUZMOCBgoFiklJBkolRN5hSkwMHEiq2HHRkFEnErRIajg0CQuD4bRklcDyGgo6RLQEWo6II7gUIrqCaYhipIDEBjpUbZRMCMSUayHh9EVLChFYsMEbAgXb2b++VZUUnSjSVTSli5QSj7xSUA41bUhHVllDyZpl3shyQNSksVqa2o54A3OiaTJmZVN8waqqpCylqjRjP1We0UMTlcGhg5WQgeIBzpzD9MhSmIxrKfkKz+61QQpeBs9oFelSGM/jqVHPIIHEo3iCDR6VYrJmQ0YmzK6BMWbcaIipYteKRtTSojU05Gmq0dbU0k5pqKiq0FVTBBUaFoNAUBAIdRk8XjqNYpRV5eSCoaSQSFSqGigkJJJcUNAlIzTDJKKjajRSuhZURyssMx9qIJKpWCrEh5GmoGGaXHWOUOBpKy2VUySGj5wSLsW1+tMhBY51r9A/K2oAtY/lMklZeVe4aeRVyaDQOL1nqEIdBIz+cDIBZCOgL98pEAtSXFgO4oLLsaIKJjYwNn4mYDjEvai+hUSQx9yxw96eAmpPRY36orBpo7tEMQSlWGnbrLzOQJUByUQ26O5lPE52I8GZrKoQeNQFqQ3PK5PwkWpR9YzSC7WwFK2Lqez0nSoHQRRBNiiiqCP0upT11WdRdjpkIRK6U1I5YowIp3GBT8n6v/Qh/cWYNrs3SJAJ92LcgxU0tYGT+DVsKtAEkhPiTB2m02WcEygGaCQUJ00OjYRGGgrSxNoXYFPXkosjvFPhIHEpWKTI5DfjOKaJj28/XED3atF1avzy6dx2qioK4NjRqpTL+0ol8eooEYWVKSi4YggKEDqFUdBFoaoZRj4HjIEND4phTkeHZvo17vZUfLA2emJH+njDNh363FOkkVtDf4glV7g0lSlXqpJTkAEKHhSSAiIUAeFamCspRfIot7gKUuvZ8YgoIC/GqleSH5D0JwpPkXUn1zpLUvW8WkNd1O5VBZoNl0OK8oBkwEMo3cTRMqUyDqZGjHxEZfv1ELF85CroHiUvnlJvCPYBBSIGwaRNdK8+wCuAwNVOvIZNfnqD5TBCBpD0JdhTzQtzEUlNIVpYeU4Uj2liNAJyjXAZLplUZlrCyXhu2cRgqFig0At7UIt/hpx8k05VB0FKJAMdq2a9lWhBkXlBWjwFcQMFrMW9cRyuilwiXRiJBovT/eZhyFZhnDCCDOlY6jvSIi7a7GRjRvUIxnqEuHk4+GPcDGc0bUUfm2E5q8YZGLzlEc7bhqjW5UASvBZ8liq4QvzrOvZtj/V3A+e3aMREIEry7mK8accYur/rK+qnLapU4l/P8VZF5kTHYYKKrhkWkYgVRERr5bITftdY8qVgEsFikCABFhJoKdQS4HFv9glrYVlC4bBsbFKaPlRWYWo3pDVz2j1Vn1PkPVPVbvJrAactEIEER4XlErMoB5epLFUmwOw8kcFLwgLxA8W5WvC0N4eIrlbEh0Lt7pnlz6nW6u7U8ZUvcxhpcufb1Cg4nKGsVvMObYtFWkBKRRpF40LKLz4ZJwV/Ji6GJxKFjIq1gmmKUagidiCXLMn6spI0B15JsJw6mAU5cfxuNlHh5K5ugDDKcupMR5oc7EopC5HT4+vtFEg+iV8LtBwmFJEqOMzhkfWE1UKskrdnlwPisTK7cTENDh5+BFoKFA5umMKVOunOEEI2OD1GT/RYsgs351CeWQYMBHttO3SqOU70wNWyPTzgMstgCYXDBTT2VN5vKcA1McPv4J4gi5Dbw6SEHHZKA5FOlSLtaoFgF/ys3ILRciNAi8fQz0dJV7BoqSfJJ1JKQ5zNufrp6XkOTiDeTsgpQmP+dVLPiRFXaau+4+B1iWvgHjeIHx7YkpSYoFM5kefBSG+Cls6asUeqj2ea1omcioq6eiz02Mp8qnQjFZ0kTv9GGhHDAl6uAbJZQGr9IhaH3DI3olEjlLFM2LCTDHUFTtup/D6uMs8X9FZl8tNTexFERy5XeRXVwVKnDaEhUm1SiuviNYSFQi0KI7JwogOSdyqa1o5QBrzrJC8ueJ+22vj9GdfVVzR8HfRYJNGkQoOuk0FdAoCET9EgFRNu1oSAWTwnSEDVErSImoE7arYASHrLmDJhAsHFXPpnfDAhh4KpG8W1PxQFrZer/hwt79hXDhUemGa3GXRheaN+AuNUDO9al24/DvxBCu4lfhqoM+G0X/DbOhmyxpp++n69fnkBGVqyhgZ1qGI21MLfA7a+RZe1PqovhLp/rziSOSDiSkio7M6DUZBP+wvPILVrL8PdjhoBIBlO4VyC/M15Snn2PMsoSAI15CuuVJ5HmM9GX4/EoMigdpGg17UeqCeGlRnf7SvLesN/qzoNDgvw0u2UlmJr6g3Cgu8z/Dj974ZZZJJCfRI9oU+sQVB3LOtfN6/DJYfglxKyalMgEJCwMl1eS8q2/5EgQBFQvf4VaoyLaBfkyjl7OKKV1G2OFDTlsf/wP+opobPXiAsXTtXFCfR8ndkACYxe+YQcVgQhasseMCiMaEPlhFO3wT4C0/Jn3TyrV/lITiEr+Nu9ICVoxN3Pu6NLx4wj4XjZp8VgiVY0m7V0/fS4diFE1DIxkOQwwTSoIFx3mEE+QVIMRcpUHAmYQ1W92yyYIAmQv0DS1NQXEidO2xEAiROUQCJ6LY61YiBqEor8ht+qOWfGxPUk8xw/SzmlnDGsLABGAR2KuFIywCFl121GT2v5QZ9CAIHYXhmKu+63jdHjubNXZ/CBgpcFF5kaq6ok2amPz+FTg4EjK2JapqRSYrL5F9xnb5sYIUAuD562F0KbR8DZvCAzkTnsS/H0seJCDVEWb3vmouDYFql6TcTIJT5kUznKKJ1NQXHwNpI5UbOjZ2k+o3RNkiZBT1ZEp1fypnfUIk5PUBYjLOt3KDbZ8rN9DRB3v06qGByGSw03v1I89HknIeSlryEQjRDi7nPyBK+MfSmEwBHnWEModAe3JgRZWGsP6HZs9Gl5EJT1CtORnBdpA07rCA0OeSEQBTy6eI432bqMAhnzxAIP1ggXTZhUbYBtcHI/BqDihx2LOejj322wOEx68QE0JeWVNXUm9WD2FqWrr4vGibmaHWhnWnaSQqOrOypmDPDhpNxEDaSMiQh1+2ao/aL3aGZjgBT0PKGS2KXn1OOqSpoLTSg3PjEHojy5qOolZNWtaYoV5pvpeCh2oEpaJtTJCNlYUW3Fa6EgNjusF7AhYxOEanmfPBgrp+agCrkq7ynt2odDxQ9Zan5GPgZeSjdSW/RJY4RKeCZLlAiveOrwEIDOfaqCmTihimozpfEHSHZOOt0vh+YKmEoNuNs4K0GPnnAlGvHCkebaDEUy8FpzGKHBh2U7nnAhwzD847hkT+LZMmEXInA+myFiapIkR1rSP+dB6kmZDgVaTzvnQJBsiBSpwN2QSPn3ckSCEYNmoQxcjUqiD1MPgBLuAmlTmPMdL1Z34lR/u8xC4li8DF/wMHfGQZEZwx1Trx89BQgId8q3CnDpLcABwmDH6t6Lt+rp8ZvU70lr8qgamkcjbzeVBtLrEbyEyXqlZaSVo6CKadBYINyY9rnobFWo+ISyqTWKHZItUlpdIlLgdCxEU11AZ3Y9eRhvFuPZLNuWZICSV9AjK+MpnlL24JeNsM4gaU8AzpJi4ICeABKdQ+QJj8hMv3nvSYNW2P05UOoSXUyDA5iiaFT8qlBxFcXYXf4t+d4rLDlh8W741eqLUT42ZzbAcQG2DxHRb9Qzoi1JKWOm4rZ0CijTdu8AUz4v56HTpSOm9Y37NPEBViHtbhewedT92jUa72Zw5LDt1zLMzS8aUa95nJH0cktY9WkKlJKQKEqEmKU/24/+2KIjL+UAFZw6tAs83Sh5JdvuuFFsPVQmFBXvVOe3w94hSBabFFxcpmuLvBMZaWw3DcQfd4GM2Qj1+S9KI1c4iVqsyRvMZrkYjpTO3CEFTaHu9RoCcUfkJR4X9KgR3oWz6oi8+rXEm8x5WtZG8ZxsQp5VUAZ8OmzR8SYeXIiBOtOOAEfENSimOoYdsQVJlYW9wyEg+5YfikH9d1LBPC6iNCJgXxRqR4IPuHvQ5XXmbXWibPM6ZgIIBCDhMNOxfyOSCZs0CzPF7RVSafysj1j+3X3BpQLaT/B2DGz0th0/FXZzTpm8IcEuYJLXuQv7YH42qJ219IFZT6VPTGOpIS906yXYC3qeq4KiEOD23I/lDIw8coyfNsDKfLIRjWk0ww31FvpBckeEZsnB8NSVB+xgyj6zWzQ7DUzu/htbD6iARmhO147U9KRcmP8pX/sy+S/PtT2PGqMhWco26yRdJZydsptAYrBuUQ+qArBrvs8dy01hpNN0FFUpaPDSIF44atonqT2ttLGm1khVQTKJpbdaUxTmJVhVTB9hkyJq9/NveIuPJ+FSxryrjnbmjlzwvAdr1uVzksfUaF8R8XhIyVC4TRGFZbM6i0N6TX7/1Wvhk3KGIoC4MFBWZhFRERFuNIhRiF0BIIVkdezaC9krVJ5p96hE6TmBs41xxoxUdrt9Ycq/YTEOHXjKSOYSYMVKo0TkHDGjZFD8VDtYB2hO5jDo9xrogV2sMwwMUjMIykEDRULgO3ZEf2zaTuGUxYRxqaJ6jMLjwxmcKywMLA/mQ4Kw3FbsAjzAEIQ8lCN4gHXsAQMumBj1AGxfMMzR7dBUXHGmNPIgUtLvE6bP1ANJ7zTjXtz4zympM4UXpgZXZfq4cKfjEMgDcmHcimv/CJfidw+D9D8ga9pHELfx4XYqIya4wF6nGJwou8BHliF8oHC71nvOVlfoG8y1DS3keOZtxOAWiFj+s3xEXA02NKpGFzi50b+FmoyU2KAr7ApheW2BE7rjv0pm+MMvgwvRqG4ACYZDY1NgG6Z5+FI0OkCUkiqKATyFEmBkpaU5XHvGTgZC2OS1FKVkOYRpaKBUXMuzIyNCKTRXccB3cJwa14kT14QIbTKpJhQPgCSsLq+tqgkJku0qPeactTtXHZVhtOcWddXLRQ4+186iPAGQ9WImxTm5uJdqGWEbHUehaTArga9SdYoZaO+YJwzchEIGpoKG393Cguf8u+eyIB9hRNWNa0jaPT7VJYKyO6hiZVBTj32Qfhoqys8TyV074ReWRL8SIFaUmD4SEgWRrVkTP2Ck6ENKwjAIgqW1cOKsIu8kDZFLki1S/dq7YKT6BIBSzAdR28MMTZVARZI1C4h86ksP1dzngTNsAuSlVFUs10D9M3IK8qFd4Jkc9D9uLcRXcSxXgX7OfkOtul4U0sXFbqGscjlntWxxJAJHsuS7VYZ4qZpHpcyfaJFSOHlZ2XWn1j2rCmSZVGpIIvPEdPrRLikZ8q0PkAd+yPu/XPYKhymfCHCpE6j7N8NzT43FPb23lJsXjHobNyyw65KxywNa9x0C1rlx097xblvORXrPoKfuLg5w6oigkP2KKkpVVWWFFtYl6QEcSkTYFKJqaij8hlLHVGgKEFRACoird62UD7Q8Cg+pHpWZBk154VoypgaJdkGrrS1tgTvtkc7L09oBrxiNcEIUiNG+IiQ+7kAF9ikLItzhwxopZWI+Ycey0yGjfx8JxD9RSp4PD07zcmhHNmyuXAf6RmuTD+1UcxO8oQ5iVOUgmZagzN+gctOtOUCqpSa3SLYQo2R8REUP6Eu90BNAP+U11VRmgWrzTwWkyQ9CPRMjFHIpmYnRIxFtThc4K1xy5Gjq1QhdKeVay3dlWB3gRGMxNTVkm3iU42V5woLlND2eJsUnK4ybr6sOpcFLKwLBv9iXxhsuqXPVTBGUMU7FCOlNeM4M5K6imYlFyvnQpgsb30FGK591S9YqrwoTTliAPzypAp04giLM2stavRNzAA6jff8cpaiDKEUsfmFXj9nyg2nYwHwxJkfOFV3bpmP22ie3rQFV4vbFU39KrwY54XaVLCXBuCDJN8VZv5sXNBZ4m8epblH/C+ibgiG17drv+5zEChP2L2e+naLLkZh99xh9JJYCsLOBpFIYRR/7IFXlA9PMzrjCEzkEzrEDT6IYSBQ05cdNJzN9g0JgsQCFkBZjp5T/0Hbkdzs2btFIVCG/37+mxIigRG3o/SY89ciug3svazEzDhc9kRPpO0QksBJYcsl61vmscclkn9umS19sE4GXPEUabOJUbXnavuq44eXhAcMHQwJ1FMt2QbL3maBzTjMNbXyFV8XgGUw0Q7+Wvh2wXiaSZaTwObchHrzgeT/N4THsTnSnJEHocNreGhGAw61pcQYijGO04b6AM3LnClPfssrzWYHTH6fFgHapDEUTWavPj2RHIH0YWxZ3OgL24AAbE7V7h4zyArqXcv1s46Q5nYec8i8kW3LQRL7vhxPNhOD7aRbzhfe8spmiarlkISH2SDiJ6+HrE0CQSrIRjyxIdzsAKgsx2n16lnhfiLY09ZUZGUmpVHscOyVHuQhq5QaFlzYtEoIOp6fZc5nS0WQph7qpEg4PUiYIJSa70qI05vAc0an5NB0R5tQ811dTofK6wR+0IcTU+hCzfLjvyeEkQt1UiDwqnGQXlCS2fsAJYb4cCQBZRpIykw5JcBIxrFACufnrYxNmiJR4IaZF0NWdhEzLTUR5lUMYjZ7pVKd7nSB80uA1gt92ygFxWUbJ+bFuWmkSBgAJikO8LS/FY9mZC+8DtHf8FD8XE2nxim2HPWLaAOz4qPEtfOSODGiQ4ITuf1rQAgOUf2kP6ew8TqKd3Pxat9tjY88EvL8hBCeRRhkEc5OX0XjMzx027MgkeNDTBSDbDcGnlpyW5SlA/XblN6l5nkZdq6B+jurDE0IJvEON2A75FBVE0i4LX1ApcOJ6R1XwtrjOYkfqTkOtjhuO3CLCmXLKhGH9cpOZ6gPTQj4GEJxclwys6be4RlJMgWAbrWXsq70o0Gt3HOiWwmkQ4RfmDRTO/Z/s85kVF3ZdxBXRD8j9csI24YKFLk7bCa3Vh1A9gYBPyCnbBKX+RMCf/Ia+TcHMgi2Yd8UIdWCe27pTM7YUhL0QBEsx4ixbdlfMiWV7ln0eCfdMSBoQt2/HC27jrtAoZrRjy3FlOJPur8Mmp+iESwgkj++enT2MgZi9JjgcvMgdgphJIIh8qntCbxQ83+pnwnptxoCwTeteoayYp2HcWSoJH9j0Qga4UvFStnA5fuW5dQaFYkteAvNXE2PDSCh19J7trCNPRXcbcA7uDQGhbJuIShkL9RgHquZKHFfb7Hlu038OQMXcjFjgO+9hy22NC/5grW1Twf9pBKKFpTOiSK+s6OGQ4/JLisJ6zcmqVQcQEhbHVdkLZEl/yO+1D/8SuiFwnA6ST9KSed2sODZOFqikmBDZsq344fF1KFiQAnoWFvjwF6CQvpx709kkSEWKALJ/gnUDl+0yMtnRvyWaNjH2aVxObagasBZ5L99TZ6eFl6qzXpnERad+Pb6i5MMQvDRo3VZKK3i0aqo6DanoaIdzvYiBU7mko9zTidDAJdMZjPVapTKPCWqF3WeUa+cl66rTlqoQbvIx+xN+RXaXAkAPAUFNIFBj/XNVlIN2MCwhNLyFxV9JGfZaxiFGTKTDNEXCmrOn5CXciriXTK1Og9YiiIeSdJru1kulvKjrxWTeVRkpb7Sv0Wx7pCcS3ImXuBtix3T66q1lTVUjoBdcr0pAbOA+ZKUJIT8pxT48YjJXT5lHwE7s8C6QoHC4DZhY6Jrjhx2kV7Mrz5DiWoLEgVNKY5C8UvqX5gRSLv4g9VWCIJdDx/X4zzYvcvHqx0+t7jgRGaykSkPlVrA6R12O28EXF3nhuhqDOBN7Gnb3/OdmPn/a4GhtzQEL2JJRb2rbUHU/ynLRJw6MRkCUiKoRjuPD/w32jqe1/3rJm5Kz01lvZt6UqrNy2LbcJSU+HBLorBzFOyHiYQsoS4wQ0Y5t9I4+WB954ojeejLH75WJuvaEuZCwCvjA7MSYJC7Ow6kDutYRhEdWYiHcoIxy2vz3S5Bq5v5+t9LPFs6QA5jg/C1dxIcjCT/upEJ4ChNBJkqMIBNtEGGTk5Y47bq9bnnqvOfeSPdejrvy5HusSLGnPqn0XLU62Ro0yNesRYGv2hTpiNOnuCLqy2SFMszoRpZZRrZ5Bsl8g2yxQRG/PKrlWtCs04pjq35DHPj1DjHgsFAjvcONSRFh1pjuvd4zfOypmQ7d5xzHZJobMjwp0bEGEQAyuQ6aoS9+Rn+aYC7gtvXG9ycOCRlCiDVgMLoJINmSsWYdrtmIWJTS1FxtXdJlDi5qliymV3aal0OY9o1tmWYfUEE6TAKQOHFy+QLjAVA5MilevxmobISiQ1SHBgHzECouCIpcRiQAJe2nhCnbkrXGwdc8ObFY2mb5D2HEzVyf9Blclbj8wHS0B6AQFclAHL+UAcD83f3d6cn8Zv/2ATBe1VDeL9ADl8At4FaCiwEbQvXwD0fgCsaL1nx82RXGZ8Dd0s+3kz+99guKwRAnAKhZgSnfMSeBYpAXV+/AQxskZ3Ys27zUfc5ikJRteBeru5P1yzTRpgbCH1dyDdwEV7slCijTltQ1t+GaOzcWmQqbZFskMsMnc22uxkU8VFkc3VeOrzIiQj2wRhtE4wHMmU7oMSww3o58j8uEX6Af1ckRdPIT++6Mc1GUNrUUYM2l5iITcjp5gQqA8U+tAQA6oFm+os3/X/pkeiiNZ9aRu5c938OAmBGOAT81vtcq4qATitrsHv6/LX8J/v4jOZggH1QAF7AAM3CAMmAETFAJviEeOsA0AzQAUB/IyalMoL8oMvPWXHLzrSCrm1UgB2QHNsACGoAWixYA0CGHPg/Y/YJSQAU0ZAO4ig8EODoPACQMAAwSAfiDSBBIAPaogBIUO6A/FHNuMOToALiF4Dec64hLiIOIDxAjiADChgiHX4DPwXfCx+AD8D54E9wNX5Tye4o/xZvCTIEnP0u+ldyW7E6uTJYlC5PZSdVezW/ICc3fTHT//7tPW/9N0/vsvZj4K98lS60v+a1+i69nKQoqZt2L/lryCzfZ7UqX2WbIXD+8JZz4vxDNqEx5MkkhvkrQGvfJtqTnLa/8EGGEPj5iNblUvONF2EIWQrywgUkE4UUtXBDicvx5kRu5vnt899+9XW2/PR/8ssvFt03yTX2vvRNv9YvdXxdY8wa3a53LXuwi5+kIY50PZmpapnagye7fm22kgbb1Qle3rXPa0PQm+oV5x2x0mfOs8qJ+v+lnFd73F9K8Yh+bWEYbVUQxHn8C+cN6Z8rfAOBhmau/3KUpfD5MW45kXzZlcTIzM1G5rPXNwQ9wdg/zgPFPD/KsPJsfj5GFNBCBjomlaTy+SLZSXinkzIUrdyex+LfqK0ioCJGiRBtjnAkmmsQCY57Yf/taYKFFFosTb4mlllluo8122m2vffY765xLrkiRKt1Nd9x13wNPPPXCS6+8luGNt95574MsOfLkK1TiEwUViloZrQpVajVo1KTFF1+1atehU5duP/vLP/4NYJBAEunIQBG3P5PceiC5IENJSMnIKSipqOUbycCmSLEvZlfGyaVCpSrVz+xuHg28Gvcu4fgJ6in4vPT0M88+9+LoL6svGUrWvuVsvf3Ou++9/8FHa+tnz52/cPHS5Ssbn362efWvf/v87//49/Z4Z3dv/7//i2/MgyKhRIisXWWZ92TB3OLUSgyvdklM2RE5IBUayknnnQwzjCgYAxaJElqJu6r444vMkbGrhs6D78/r51gKEoaKOKJziYIiM10xEtgmRb81ArB7NPvCjCK66b4SNTHw35VhiHR1xBQFuyBNpti2hgTbpXEK84lYpDsUZWFAeLID/5F96oFsKJciZFhy8kXbJdsXIZHBy0bbL6mJ1HkmFiRjMh7sHHa5jxZQQlJKOuM6R4n0I5JNxhLIJpwUvSp5ha0vlEM1hJ7oSRMzqNJTTLz1KoQBRSwoPbrqAJHDxlfHCgLsCjaPB+slL2UNXBjDsClmg2nbLTsmbaAHtXrCXAb1gQWtD0xpk0MUsR3n8BmxCnmiMpJmojVAWC/NirAtugcMDB+zT4AAZqZ4DYuLMIsKHgamklvKe1SSzSpFtaQgSgjQ1FuVE4fqgM7FXbmyxWkPb/mN2Qdzs9QSxlFH0GrRNQs6Qj4oYSIlJQMNKFWM2M8Q6tcqJVKGUR8i5jy4/htB4I3Qe7fCOAHZ0mfDv/nGwIFKQs4PytgS5bO+MedG9qmOCMI0kSwCUiE0b+kA6gvl59a8GwtuxHrRhwFmoAl0q1BmREEl6s+sCtmvS6tD1yj6W/zRkK/FfOIb1jUCEEGCBHvArHfh7F1YVDa6UGERtpj8S6S8wyIuGV49wbcOujjs4+PCo8BTEt8YmYhVElTY7lv/JJjRf5aVFa6WSKxWPLOgrBlkU9Cyrt1yOEEEFasDPCk2hZcsez4tOMeLaYMUVvuJ+/OVPWRAJug+rP+Wbny8l3nBc7Yv5Au+eRN8cMa7dwpBvaPh5vCbFnwHtDNKqfqEw2fvhOQ5d1B9UpLzc2S8JMsWIgRnxri9r63eAs2Jrph6wt2y89xKbKirq+eDvkGcbDCVmysqabwgWsDHRgv0EdPgGI6rV6tsmHrF49QkQ+t5gxUDF21iSwqXuaq27vC3Ef6LNNVnNbdMUdmiqgGCWhaBqNZsdMKyrYOkl6wv5EV+rl1vAL45krS8iSCvhPI5OWTvqL7jZr6zNik+JVC2N4362dot8B3JWcAcYNn/rRhrePHExVNTz0ytuvrNXMsWQsF31r/Wi7L1xwY7ZhGD9762jiFVS8y4M+dnpW29Hu8zGZgN/UrKXNpwxlrW/JDZHPsxP362mm3Ryzu+WfOtuq4F30C6+cG0ITWK2E3O+VJW2eRaJYJIIUHT7IvUqbLikjoEneNdxUM+KtHKSNXALRN3TNcM1QVkeY9bEAzYMcUa7ERkmlFnkU/XVy+FHj7w6ubn940FN5ElcWXVafMksCRpksjScqEFpveiLQSaPX9iCldpzIrMK1tjz70ZcPeOxJSBEM9SuoKMFkjbDFcL1P1hj1qhBUe5T4l+7d6kZKm8ylnOzR7hwRz96Wuk90hrGqYuyV7/aqLIgywHwQboHoNeQxDNOb9qHw3mhQF7KVckrloiwXpovhT2lO6um3x81mMe1zyuezzv6YKni54ueYqiCnEZ53zQEiSA2Sg8MJSBCRWV3UeLpWGJKdLQdbAvKvuI5I1rFixffI1N2Ps0/0f3nw6cQcwBG8EzJ8gEluH4tj9HNAS5gyHCbptlusiu31WXRW/7Ji3n2tV9j+GBxIDEOF6egADsCY2VbnUvzURADkRQwvWL0FJK4xQwzeAOLj/kyTvRM8xCl/8JbX15RHxMd1PU44xPIv/XYcQyaWxFt6hp+qpSG98T4MV6KGf1VzlmXCfALFfCggkwka8y8J/co5gCiPxNKU0Ylb6b/+NV1bZ4zwyAiPk6sEE+HQ1IkER7n+enRpIQRHaLFTj9IKbDqgpobrm+nf8wUoPlYCwNISyMrFBH8muUgoNE2T2xB63JIlXxGdCqUJtMOF0pQ/bADIgVoYBaCUBIgmwUyaRZoMUMVXYULxT/pTLl+8fohZ+kXEEGRBBLszLrCKXLF/cmBjTTyTFiWfpQCMzGiuwlDhZXnPW46tInG1fhzxOLvFo9cl8MFc98wkDFo8g54oOV19SIh1WESSxtfRrcqBKYs+xWtUcPiZt/Q8QJncOglpFkBdhebKlqH8OlH8MGhJ4zdrCUpDnQw2nAuguVXTnNoRpUydhpWusJgHQ8goUlucc9rALVapGge8F2A12Gk8XieI5MyJOCm7mblUEm5So7O9UHYsVVOHLatgz2Gas9EJ4lQ2vGsGpSUcALUDIL9spPgL5Q++VlAmz94ccVLkio2lMVqHN5q11bKPWCJEUsPhDSV4zClg9pLbisQl+u8VA600OKMlTYdDepbtElVPkUn9QkFc0qbSDyVup26g6lndRd1DxkGDOCKWJL2DHpinRkR0DwSL11wXnQoiqJtreYhtYU62JpOaFqANbEtkqj9GKVdMFMu9IuVSaSjCSaPINPpfgNc5a+g3gfBDWzViG/MIAoVlp26YYiHjpBmRvjrCrStN79MN1nr7coRQtFTI2trn3C5ERP0yctv9XjTbW3evOEYTMjoWigRPEghGdeJEbVPmQ/KWO8yMJzSs/vqoeAjKMCqat3GvCmc5IgUwqb3ATC+ipz+A15qe9YWmYCO8GtOImQJ+n8UF6FYdQI6gSkCCvBK4qR+csOa0LzaBCCIlg6ZkIPGNwzLGxoV/5mKJFiA/w8b0KUsAS6WWBfYhhZjpVFwN8FBV6hRHMprSDDkTkZ8sF8/5D2sAVUKrfGaZ10WBVeUW8abzvYl8T0oH2npAKaK07WO1XvBGDqTKYg4mmZMR0m2HBjxy3t7qyFUwz9mIIIQg7iDKYoXFqJIhLx1WWQRgkbSGETKQBhKeXFYGzYMjMfFwplmBuca32rZwehL+QDOiJEr4VG0BZfRsW51SUxFJmanlnoafC5CNXSysB/bsck3iYAyjCsSEo9IQ7Kg6S6gZQOgzB8RIMTsMx8jJw9JiI+ME7x0ApCWqxKGiy/N5VuTYHMGJYKztV/UizdM/UKAkPoEz64A4yMIDI0AqH3QLiWxDiBZaF0hzyOxf2KoRgwKDXRpvV73kxMCRbMHySljK2cWkF2wdL8nHLjD6VnaLEDeCbwZFIowjBkhBUAMQYxWiU6XcjGZSc1/nnkIhIhoVHjxXKUM16Qn84VRGH5zvpYln60klSm8o7WKSPCF3UvBN1QZMF9UEAiKaM6iXyBFAj8S1/NUU9aixxXBc+XLTAvlW+pL5bsifZt4qna8Jw1OhAfG8o5TxWXkKHTooPqSRwRj6ogyRapGCQGOlTaSsln2XpIZdnjFeFnYi1MzNntq/IaZciuYcETeD49/e6Zf7KJSXzffxNQ2C6Ia7YP8bOpr46yzpzvon5yvyoUgEJfpBBZ4BA0Bz/udNnNFccNr5+xxA67vuq52WeSgk3Xp8o5qPiWUtgs8go+x8uLSmNTtm37svdqh7Wrh3a6BRBAAANQil1DnRCm8k2/iD08c94gfQME0iFjSipHaDhXUpMyVcwuqKNsjrtyQtBJIad4nHHgrKB2aHHj8QiIMfV2GT0R81y9QVWobiBXW0gkcBWwHVJZ9Cx0fNlsg3l8r84+ykYNu2ijKj1prCFThgVP4Pn3r0823jT4tmPMwatlSeLmqYJ2SWkx5ATIGYvMX2Wrl64ad22Ob7OundKHV4CWW7B8RpRrqDA+Ay8+10u618zeSFfK+Kxb+srjm7DvvH44p8Qov2z4jY41lbUEXk+QDUtdFW49f8tw+4u8w/kux3u878/gAfuHWfDI/CdVfCr1DCRnBaifXiRqTPk42yhg9pAv+4QofICLPOP6FdICts8TYbsdaNe9nv81ZgZi0R1+PzUvhvxGDwrEJseVkincCkkGHClb+72EaauQE8yNEARmV1zSBOiObJNpkLTAKTg3u60lQdNHNblwCr0/qUhqrmklbKtoqWQ5MoGxy9GBF/IrbRa82YAQKJISmryQf7QGSUshlxJdlFxWZCOm89xoQrAV64zDJmNfhKxZZO4LW3CrehtEn2A+M1YH3kTlTc75X17F9DmjESsQUlZaUJknkHvRdQ6OS9vtD+bj0ACutb0sYQhx0u1R9q/1jsv/bA2t/syCX1pkWPbuCm9D+pl9CX+sbWcO9tIdnq6/7vmzvh8gJGOc/E5IMb0aM8PDxSdfnpeq60ksAIbsKQlpYrMQtVGf0wb+CzbB/7pZb7HFnnWsdf17z/t900Bjq6OEOiTUyzyHBDWQCtBQZiQvlACtKLSPLa+uIINsZXFS1ZQ4PQPyy0ubLqSlUu1COQHrAz/Y8Rvxqgh4BpmVjfnlIVpO5TjcDX3uMKTPIaOQBlXBRhW7NFjoKwZooHIJBa0kfCTFJpitVFANubbzWLDHJ8rEEoeA+yKffvoZe2ir7UTblQQEHHh1F6o4cQkBhM0kFLPRrtW/Ykr5KGinZRQT55Ysj8JnBzbSDK+GlUjLLbjnQ7SUeMnHZb7tFaBDwpWJPCMWMPAEvHJKVPfmmj5rSfYVXHRtPrsP+3r+7eYd+z/jZ/85c2dFvkxskyND/FJxzjBUUkt/svbvKCR4rDfqsPakxajPjOUku4Azx6LFiUfniOcWIJEp7KvMn20u4flBGMVJmuWZEYazhjOHM4bTh9OGU49Da4Ls7fzBy+sCb4fD3RLi/Te4/wqpLS+v94a43DVVjhC7u6HcHVJwx4IOBRBc6H/JbmhyeULwXo+vPgTV3EymhKwYhRoSWWghiwsd/FkY4NfCBHcLC3xb2ODzIw64tKCQwclCAXP/p4LZFo+vHuwGAJiKhhE6ZAcy4CFb+suGfuLTV9b0kRW9ZUkvWdCSOY3MKDIlMimAuQAHJnrow4KBLgbQMYYQT8CwYaL9a8/ZozPhGbff5fh+1EPR6Tx+7DrWHJkHk8xptizsvHHJAnzc2mncc8E+K0wXCqvyOqAj/uFuJCHuN4FJ+yqyLhlM1xb6JkXRbGj39AlczJfgiKOOOe1MhrJjHx47er0NJ/XxG/v/QuDQsd8BBx1yCtIRbaRRRtteXkQSyk/mRcwXvje8iG2WJz+TLBEdGOvOgycfcEIFT0tDHbSBX8t8rNixN5gDRwJOhJy5cOUdgXBWEkh/ZIL+ifmOGmG1NdZa19mZsdEmm22x1Tbb7bDTLrvtiYn6yEIDZOMg5DDEZYTHmAlTZsxZsGTFGp8N23hDg4jC8w9YpV1H9KDV+jSkMU3p01+MQMdlyQrplboSEZOQGWa0GJPNsNQqF133wMPIBmVENYyPsn/25StWSqtZmy79uqGhHkr4Byqw1NHhT1uvzVg44kTKlKY6NWlOCxrGgDFm3ac7e2bYUPzTZ9r6FSbpLy8ujfTHv5fh/+PeFhMQoSD/CBn5RXqqIMmbmQHRnvZPtjo6hIKQYcAjrFXH3VjYbZfdIY75Ehxx1LGQYRfOi9WkJ/hRE/poPljwy0/EKJG0dPQMjEzMLKxOeZf3+ZCPyUp2cpKLQCZIeJDbvYoZ95jGsIiIq0wn/jB+zlPPPA+KWBecaOsSyfoeH5KLmWejxV74TSDwyqIgZ6nRgcIBEwn5SBFBdRYmgqg3b5FHZ+9207W8PNKB+e4iEwbo9g3YAWZORGzSIW/7boAh3QXwaDCY74DPmDBeqyw9E5SBqNAh+0PKrK7ARRly0JcmbLDGTOFIYCYuOgjQsQB6NUpwThKJOsfp5p82A2L1ULWpy/RJGd1A2QYhx5FrnhTc6SNb42M+hbK88cIjd1yT5ILTjjpgly3WWSFOrOkmQkY8nVtstLMuypAfTXQdgrpMy0R45arILBPQtvlLtA4jnt+I4zMWazEWaTIWajSC5RgRdIYNjy4T4rXex1kXJgq67ASus90hY7N9xgbHjljvKOnWxqQDrshxaefgH7dXticPeyahyxPSbopRnpD/4EmnlOomalRYm9C9PHn4ytpMqNtq5ba8+fIRI98co4kGl4IJeR5Ls3ZtOiQQFegzueORx5tzg82ynmoHD0BL2LH3PXk5+jsGuYzadzWNV6/YR/z0bLbdOYnOu+CSy664KknJtQk9j9ThdKuJ/ZfVyvWQiSZsBF1/4RusICHxYylWz6NNeVGRe2lHCQ0WvtEKiir/VsuoOZ4OKGfO5MBaheedbRPEreQDXg/2A/bE/zzZIpLYvse+VlBvgObdugEuMqU7CpqqLxMxkDQy18rciMO+H7x7wgEOu+1+cCIAX8zZyxku2W/oHplYF5MglhAybDIqCLHiFWtQto+UsBDQWtwAkN/2h9LhwEOAbVKlu+2BJ154nS4asTSYE1fe/MiF0yviUGGN68Vy/Ca3VDU0kkGySO4S3q2td9bPkUImI1ORKCQWSUZykfs7VNrWPva/xlSepJKku+6eJ5555e2Av7L4BFy4kwgQTMPEzqXWp8Vs/CanaBoge5NMkrsEd131zvoZMpErkPAKOkcfC2QIwNAHwiJT3R7bPb9int9anu86oPMGnTugc+34zrmdoc649jTw0QOKBY6PAZCByAsymgUrd7yRF2VUUac29WnP7wFi9FgNf0JHFVDWnJwpnrKAJVt2fzly3K1G2bkls4kSQbHekynNRRrPN8+cKVYrUCGfdJS27OXtREKyypETT8EbAvSIwhgTA7E8CNv68tZb4A0ZdvjirBSpbrjj6UAog5lUEG19yWq16jVo0aE7vLpcOu5z236vTWT3rgeuac719rk564Zut6Sb4zdy58xOF0GHfqB32JA1M+91Obcw7+nnCTTcUMHCDOtgoWaaaroZ4kVqd8k5FyS56Kpk1zyK58oPkdy/ldykUq6MRjVtz6vyzc9+9VsIqIsGDJeREum5YpA0XNdxpDN2i4nb+B6z8pCNJ8zdY+85By8N9oLAa+6yeMgmkknoI7F8PgpJFPNVxE8Jqc9kSg2hJEcJUWmECuFqjNRotGajNBnri/FajfPVJJ1m+2ErvXb0y3a+28FPu/qHa1+DpeJL4UyAwcqWAc15MdpM1lVHWtKZXl1pjSpUNKlMVcpTGmUqoo7WIv/t4q/dDNi3JaJHx+Xvd0gnlCQvBSmKIp/zKfkpTDGE9WtDgORbaL4BuSkY9QWY9AAGnRv0vT5AQdZNWJA07pyMG9f6oDXu46ZpMOqelyG3b7Wo4v6ETPz4yBBBrnD7UEQ/yrsKEfkNU+9ispP4/FrrrtV9GKnvUnR+ZNFov/EKHFfIE9fdd6eMBrFlQifeYOUNm4iuNAWm1rvqXmhoSPjHNt2HB69ilTZsxJwH2HCXFnC3yuV401AoyOHdsm9H1K/C1wpFuTh0d5YfdSpc7uz2apc6utQYcWpsIK241LB38O7tVBxRHxt7HepudCJB4ucoxoQvyCbULA7JE0ZxxtnU8A2hEVmMxoKN6NXA9yiJRTKMWMti4RKhOBDUZSyyjO1HdsF1QPM8LFaa4OvdkBCjiBU1Z7rL5XyNG1OW5wU/nmgc2SQiRrg9ccCOYhI7TC/Cyy0fNI7TM9Y7HaYoaWN51tnkTGO9HkK+rCJfZCExhJqRHc/A+WRiGELMZhvzUVMzeWFo38IuvL7fk6UZGBClWCXM+lt6aH1+SBa3y9mMnYthMJAbVMJ00tVJfmrmSPvARLzGbMmx/MCog+WZOIAWo8hWXRI1KLNLPJdbRZ5nLxGQSefx2SMUsASDj1kYufHD+pdo0l76NPoPDzSpr7VDzFwYKKVo6cI6tlL3+b+izzCl0GTC3CI23ATOh2VYz6L8IcL2rFkUEGIkt0fGHzwfi3iDHNhgk4OlY9V70ODopzyHmPeK9xAL0Lwsz9FjVYp64JFD76whtwmEP27C1WzMtYb3thINGpBh3or5OSoIQ9VK+Q5mZ3+Hzs35MY7pz7aUVj1wi8kNH5FhE+hou3yXNbXMbrefPaVXqlkEtVIfNRyOgq6RcHi3LyADH0mW7apM00he7pn/iKah6Ip0INPLtvlYgeMgmjzn4JhrpRRpPtAO5g9OP2hR9uCMusMzfq+0rQcaoXPOfVjPsPJkA8NQcuukO/6WOhorfMIAqFshuuxs4st/WZTmjEB+Fud/+IcYicVbgyjmbC22XO0WUiJcB4levMM49+sMBjDrGwEjHAyTpdhopy8Xl9gGAWt/JJMscF+VrzPpDtv7TXq2IW+CpiWo4nFr5S3Zl8GPJpONyUqxU0NaazvTphdV1GBI7V1M2VhyLMjLDWiVsFOdh0ql9nMtgT48/9u9qCYoxnUC0y2DYlQdaNrOLKD6vty2vYf0BPLZ6XGoEn/hB4YcRKTWBief1HbX3hRfA3k/DQjsvjVRhf7B3fBJ8crUuf5fhWgOXsta3bg9ym1fJj9YpS8iXVEFFNDKL9orG7TdsuzPp11md9hqxXIDWA8xSeM7Ljf+Q+EeDlRz9OSxGSJXxzvP+1JyjPVRwCwoO30QOyq1lr1rUsZyZDgcmAURa2KVJkHXFdCw0JikqdRIXbjaBGXyumuaUdNLrg/GG8zHQupEYb1s6NvO74v6nYkRmVjgbB2IowfZfuYdwB2kQ704srWTdTXGHmiCIfb2NM8qct4MW2SD+M5Oa852p7tmuu+38DP9uXvEHNVxeuJZM9o4bPeEzYU3AsUCOmdvlxamb5DcHEfmR4Y/ItVoIBR6KqpsbIb+btIfUHZiDGd182UZk8kZFFCdIC46KZH+qVGNsGTGGvGuuYYrzZeWW0+/m+Z5PsO+F7Vl2U2aLEWzv26eT9fJa7AzaGQQ6BwDavrMqnnmAWR9Zk0sQRFjm1QXrtTuR1QL9cP9hOjGXZixM4QuO/n0i/WX/pge8Ly7E8V587x4ditnVTXvTkY32ree7S7TZ8fvx/hmwiNnysjg3SGbJrZpotnIfgwDGNdCHfs9kf3h22PNaXhtLuvLHmObfU9uKffuZ6Fts5+TX1gg7iubP7449SOCQTUzLtbnVgT2dX+v6gBaMGFvYmsf3rBwFNeyAjJG/nCOiaVd7yts9TECGO9LLq2x6wtuwwx4R94yVz7Z+9ftRmxsSnd3TPqG52PTVc/t8vD5H7yFOH13vcsugBcRpjIrz0o4lGmHNaKc49V8fX7SBAGavljF77479to4hj89pogCtK1FW7Noq7aDrfjFrCoSbXhNfRtxTb0RiC1Nrsay6Y1Q66WJJgRs5Wh9py3aasmqbU1/qI+2sJ8TNqF7VzVPZBgUtmgDGXOtSolqYWRQeC3H72nzOmwjDsPyestZH4ZtPb93z0jCs1Z3/cntJXsaiIREVgXcQo7Fr1/v9wDCe4WgAIQGdlkjtVkvrjRLo+QYrbjArTfmnABaZFGt5VV0xWpqfGPeilubub6V94b8wFNGQvvB59oKr+3w+80GlR2pa/Fcesr/2QRT0EKEaQraiIg7xKSmp7mSPsqggI+LOoNFwYBK483PtbhLSBV2s0QLxdMNFoaaQ5P9UUP0QWyfZw36qwPw3RNokNwdnvxC43/k9q/o+DLY2d1n4gHVpT8+hYeafdHpxKq9APIY5rbLIPuEpS1tTbMiiSbdUwde6p4y4OIJhv7j94Cvp10JX5g4bvflTfekfue7J/e/8GM0D5iw9+TdzKuRzwMn7ru68azUo+HxoRgk/Wy2lidKktH0Za1Xs1RmXxYrq/dqWI9vcaM9A5R+0n7dgl6z5bbZw/SR7hafTYJVrxe1tsXUKE64qoPV6q5SvuSC58UpvU5bF1o+qIdhuVtcl47Fck8Udv2qnoORyp3a51X85vRu/bRBfHZ7MHmM1K8STme3+ODrWvEOzbXcaWdCzvkG01cqd8lPEu3IJ6+CW56t7aTcAUe3Rh5gY230vL7uCYsriTVbNVEvw2HinOCGabLntDu5d27wWdwlP4a2cnjJwfM9dhk51mVnQ0HuxiHhkMtibt30sN0RV/2MVHtux66MUXiYDkePbQwfLCDjtqw3ousRx4fBAcKfT3Vwbg14N5Q64RVHXH6R00YG2vkgNkIWOc/4aHvNltqrG47HYFgB4K8JApbMl7O7r5zslDGAMiEvmwbnaBxsBz+oSOzrDkCGXk5vOFfnFLqveSPGZadsdCZVYlMr6kSlE3U6YX3mxgiHDmHI0VQ0VqUVKGMJ5jpY2udOGrhtKG1vKO1evtRCfhDvWo0/Bi9eWDKsSDOv5GW+v8btHWyMXmXhnUWbvH7e4VyeVUqfL4y0XMu05NCUU0+tYndG/bHoNXHTddutxVqkBZeHcbcaop/G6oqqeoJoeDAKtTXxT7PwVRWTGsTGM4ksmlJWWlN1/j/3hZqOVFjUJRXPZU8nUI2xJldWTUWWIxPKxBTOuTBWWW0rqqxrlVIq4OC31Er1Kb+JvJfAgsEMtxXYOKwKZDgENWAJxR51lHFmwdiXULQc0pygUzauudSPpvJMQv/AjIzZVzdw8OhBQKFKyx7YdzrMib1rlxBSQ0bNO+4b7hwJGTw1nDtwMzXszGnXdEj3QQXk4QdOIIQj6NKqr/V37aOnw+Vunis9y6hNI20RYerLJhTzzemjdLwhj+FAtOurTr1GN6gL5IUtvr9/+Rt6hcz3PZ5vfTQ/EDKPS9wc2Fw6mf6n88yF4ILF3+U/yWjZ3sJN98vJgA88R6lYCrWGdsDzLik8M/NxNiz/szKfI4dB0VpxdBnbRmLk8XjMAidJWnz16yzohxl6mWXljPVmM31tmbOXbiwckdk6YNbxcF25QS4o5tDcegPdW8IXiMv1kbqJcGtRx7AUjAUOGtxCdr1Swapx84wfBz5e9XGec9LjKZ/6qCCQwPd4wrICvYH7WZWIKkPXgn++692W/do5XjwDzIn+Hf7tEv+cH2yB+aaLbHsaPEV7p0rchUOiPM9SVTBok8hEJVxavd5E87q4Gr4VYdvA2TrBZ/svPD3p5yB4IJu/Z+kfLvgXAAwW+DawC1YW2JbAWhhWHvrKn5iUzEZTwoNxLp8TegKyT1r4aW7hhC/Xd6LG18UJ+/1gUjYpdpu1oddy3Ze7DDArV/z12YF8nPW3hYk9yWd2v/XJzqS3Ate4KGoPWz/+3Q+y7X00NjpjysYXtnyBhq1ZfjNpy8+tu85Fpz1C5k4U5hbawAjM1M9wOpnrrZ6S3XuL6ur3FNn3eCwu81lsIdMqUamI6dVqGPWlPEjEC9HdWh3DWyoEq2AGlTvIT/n8IO23tndh/rli196GBteeuSJ/pmLJL30PpTCSyc1jenR6ZoObZyJJQx/0/aJYYoQt/OLXfEBroX2S5wfUhTxTE0tYLpWKKprYxm/9NxizZPI+xpwNTG/xf864nJl5mfG5/1tjE0vkFEOi8iaWMXeLxj+FEVjd3hL7dEMX71OR2e4sNCWMUd6RgNlsGjAzmvyTEja7t8T5IdeiwtdKFoFnCxJDMz3F2n6R3f5j0HCp8RxrKps0xt5t+xvp26X3gcJlQ9MdEY2baxwSnVCSgUlvC1+LroTbXTqxxL6KalmzxQ9zbN6so/DpX6KSk+1r0TXwYpfevaUZ7FiGkiz7veNqYZpaRmZQtVDuim8vLI1TDSiSs0w5hblzwd0TMzsnS7YyLx59ypP2E1ubC8RS+2oqeM32yO/1P7KBYlhwYmZqNDhrN+erVOb8kneCGya3zoDkkPnJc/lx5/MnQubBkyvz26c3UrZsfH/TRvLMxi1X5vdPrMUH14LFF7gJm+eO4tP2uqZP43ZRZp6fRO3K3gWWp4ftP/JFR/7nHfvC9qcDfPUwUbXHj6hel572/qJ57ZOlhsEzum7/zBlX79LBfp7gIqAu6AweErdApC0pdMSl5IaUWPTXgrtkPEh0r/Fvjf2B004bSNXNn/ngsvX9y2f18xPKw+ypw29NfsRUfARGYe69dvu0223fs9denz8sKvaEqsb7cZpUkqSMR6/X6eheB18iKmSQyuUjNbnBYM6alG/9Bg5gwYo7NMJ2zbhCY2Jj9qMUglPBPZXC9Wvks/xTTdKncySpxeybUStGKriPg/x1AazOFact/m1lDx57uXoUJltVWOtpdhT/mOTsUMJ0hTpIWZtXGr45Pr891lcKT+KkksRUVISxoJAD3GOXV36ETYPRrG8prKpr/JZ7BBk0OPQyvi2vOnJ9XL4r+ia0YgUnfflybKIBl57XIFWaWiTCVoNR6G+S6DUNImGjPjo5ZW85yyFso2A9cDnPINBy0etmx1aofTmgCaa2Sdu8/k0L49LuaTukkrsgps9k5rRWib2tDLFWoZComXSJxs6kASiYaZVU1qrXI4OFTdJasix364bda7FoaYo4KwtGS9HYtbs3bI2w6LxgT+OGcadYrqiEWKLy1WJFPVWTqvGF0HqG+EEx6RLuX/IgG2Zo5ykazUaVp4UrZZswZHlpmbhA1r5B3Lzc4dnHbKnhB11bR2aHfMghAYmU1JZGlkNy8l9a8UCWauXH/JkM/CZ29jivixtsIQOWu1oiazUYZf52icXYLBIpauaj5eINwlkaDzKaDJAqollXhjst8LWtHFlcXuJM+PmXZic1EktDpT4cbLI2AezN2r7CMN1Ik5Qg+4LV0PhmKaSUuYSsRr2B01wtUqhs0rYy/6b7ng1rAmaGWCWTSVRMukRtf+lSAv7C+MKnfOI+QnrDPWx427oyiTK30G4qBBJnj1MuxrTK/3f8XzDwZsyNn5ubYkOTDydljZP0eQW85vvwi2XXX5x5FuZ5icyPApPqcYHTrA0d4DizJuvL54P/76bAa/2nZbg+DFJ3Ax3etM4ukZoKCmW1ZS1xL6dEYS0o1pZVbdyJ5p4WTF+HKxvQ5xW8fZNxQZAFy1kjUQSMRoVvjTgnlzNynyQD/oJWX3pvmoQkV2kYDJVWRoKD7a04kxe7O01OVqr0XC73K8k4evd0m0x2+zaUgnSYsU0iv9Bb7msTG00+seikoIBPYvChaAgJKfsHCgpF+SGbhLuk+3ymVdvzbTUYpf7WRRLPMn/3stCSFAWTniI1YxGvEshfLx2/uqnxDeJwCd/pHePSDztYIhNSs1miY4E04O1rwtMvYk0WroZyCSSbwRmJ/+8WGh6IgcxSQVzvkDg6QiWlAhjM21u4xNAvnqKTZpPi+l43R9tic3UCTaOlsqLVtETZz/kzE1+ZEPtCWRSrizLk8bQtFuCGwb+82Xj2Thx7jk4Ss4XZLajUc1uSM9MoLJoY+mn86+bOobUGL4VfwKWT1FYMs0VZRiHnsUSCEg8VZIU67XbHsS2s31FmfNSWs00X7vHHm1Y1gdswpi4bZ6AUjvOJW7Eo0X1MeFt/qdQDC7zWP/4veHbpnwPbv8nZ9s2OS//A0W3/7NSXL3aUDznLF+vKg9v+GSt3Li53gh3jP9xCzPRfuk+n8vs/2f0z4eLY1V2P6SD32hAr2Fs1Sb9CuHn2+cHJiyCzOqXgBrVptjrBfILZBP6GqTH37ybDcKPxrcpc6Zqb0b+8trqJGoHQnWQMSnprxv+xLXsdSkq7fe75gZ0nVtAPz/jwZZf3vrzftX546tj/xHtnlpmCVatvPH6ucMv/jv/L+m2oKaIpfXbr+FbwbuJR/0bX0cRNhN5OJJwU+rC7Y3NHTvfSPGC5kCQ9N3S2I33ufqNywRLTRJRY/6uRcg/mjfBGwbu1T3u7sPDD7o6IjvTuf8f/VVHQqHQc6fWZR+HSF4F2R49/s4p4v+NsB7j/Nl+YELI+ghwXhZdXVCuZkFTFY/fG6UXzS4gIbOa+SksoBIX9dCUs9K/wBHhM61knuLaNbsBlKMmq0lyjyZ6rUpXl6wsQ+UikFQF3rUyrBDkw25DdOFNfb9w9VGwrGiy2xXqPcdpfoLCTJpaubJBIVtaJRTRBCEX+b9fgiC7yaYsGfWtcZsRCzG+6F0BSwGnqazEUpqkxmbeJmVs8wdCK0Zamlm5/LRVZpHX0tDg0urV+QIDpAkxN7RLd1tVHaZm7qOQBGdQi4NHwWC+Z8KEzuEwqdTTSdTp3Ni+XT83SygjpixlaKi6HLpaW+qjAf7J52yfpPQp6qF/id3w2sQAwsIbhxujKratfEEhsSCJiSEgpv/+VgN60019tDo25nTihIXLlVTxOncYgrvdxgQI2Ejy8r1Wz/42Skpo+T6Rjq9ZDUCtX94nvv8+S52AYiho2t1KulNSs4pT4aDIuh6Ng0+hKNguDHgRbImcH+LV9cT3+OI+0rOKs4NqyBkCCWdoZ8lKImW3NIbFf8MxYoprKFxY0kg0GZtjPpyLzB/iL2RmW/XJiQbLSNrrFx5imUb+k0i5S6QdpEIGckSEiEpDEDAikwwxutsC1VLxVlkNFh18LdyjEXe1iPKGazXNJFNIq+OZlHgseft+vmO23GUbZ7dnIvlQMiweRSCdBkg2i2PTiArqeBieSELiM3Q3BUNewr6lpbXMNi2CWCo1UQ+YPryqZa/0gA2btLtVM19drdvcUW6zdxZrd9R7tdLfd3EmkS1c0SMQr6miQ7qdDFsXu364ZEhCJQz/9zfu8avwXGXb82BszLJz/sB/wA0UmX6u4JEmHIfyBxGyxvwWr6GuprQv4a6mpRQpHoMWmgdf4ARWm8DJltYt1O20nCMjnVPLXQmoLibELj9mAT/3RsnOZVOCopiuVFdnMXD6VoN2Xsjj7p7QculhU6qaCopO92yDkoh49/Wd/gp/32c4FkAFz9TVGVe7Q01diCJBEhJWkx6gebUzb1OnXF4ZG3K6cEBPpwhIevU5jENS7uYADWzt6eJ9fsb/Tnu9s90Q4dvBOIgXcNb3iW++T5GoMGSplMyrlSn5NI6fIRxjgcC7hCDMszLlHYCpidjW3sH+R2f/IkzPWTAjbCzJh2maGuBRiEq06Eh3N0WExaiqfU1BDVquZ4UQ+FavWYrl0eoZl//RiQVBpE13rI9yiUpdica+o9Jt4COHNIJqQK8UEYiNYDtO42CzX6+IdzI2EVLd7mVMunpykyNVoiqiUzXRJFMIqL0fXv+Hw+37J7BqbbDS7PZuMlWZnZ0MkUiTotkFEm0yiY8gYRCgT9xcq7ZryrVBXl6+mrsPr5KBz+GIFTZbVMF0OL/AD3rt9NkFe7qnikjV5SjEp9gH+nmUiEEyrnxzImB+AGXxGdSMoikn4bO+YHYlB75JfSzjcBt7V+BTdjSGNtn+4ui8Ji81iKWjeTTCJ2tHKMOgaSMI8LuGdgWc9M/AgzRdR/E2tN1toYRD3vfHfWUvamDkYONnRk5wqo1HkuOpNw5qCVhLsBtEA78W9ZWawfTylxqQT1bkRbvjGduZ4XXd3L6yrg9chhLtAW/l8j6Gur9JzqN623hWtVApWGKM3WXp4GIRsWtSTjgK2mIQTezu780kFam2phft1mUOrTr1pqWjeTQb9bzwDmRyugt1bxjsDv47seRMouf5Vv9qyvLbACAxnIeKtOHQzntgEpNPqHRUZYOZRJE6CJ5jS8e1SY0EzsGn1MF4KWcqg3cMsNyBTV/N+ShFTV/dhqu+Jv+BO3GVqFTy2VsWk6VVsnl4BBjDDpw+9OXr62HD35WOjb14+BHhfBDyBzbzluesBEEsZJZ0M5F8KQHh9RXHZd82Nju9dJZtcJa6bq9qqbjqKwdHfUCdJqzMUUOB5h6KUc1Yqyo+i5nwcpTzUsWkBg9NvS3vQE6f9k2YVCjn5517R8yDN5gebnpR3IfIunvVxTtw69+a+iJhgrLMp/Ic9h+H1Wp/MEI6TMvPXEkekMvUqFfRLmJtcZtcXde6qBYcZHH0lZeT3E4dlUuKoRWm82+L6fD4azlBKQ+Qx/ky70HDVhbQ/GYj8UipYircgfBEDZREIWStfChd4bU2+qr0UKiJ/dV4prffLlYKkJEEM9EI8d+CQbfS+V3+3jTfr1Zq9OeHqJc8z3hl4E3Bm1Qk/B8k9sdGmBjD0Ye/BtWuk82CaGw2CD6Q3CpyT/iRH3JMBnl2YrkNTSbFLNampmqWxSVOHblVg2yShVqQt4j/fpgww81cEAYnBiGqh3ombwZOVhyF4gW0NgPo2ynT8fe49WNvHZud4VR5vY0v9LN9bt1OR35nHwdZILfkkMsHMHFtcomeQIUOxnoa0sWUabIaYL3N0JVh7mF/MBhISPTeiZVi5wNaUZSruz863EhsleqWnl2ujVcahkDlLfIn5YfEho98kEwXI+Jixr5Mz3ABqHnzGWIBn07QlWUK+ncg0sIS26ly4IudOHQpRgMUQlkefvXV7dPN1WF4XQ1kiyGvyNqbL8jZBhKFksoGhIhWmqEUZNYZhBX6V2lkhb0eD592XojklZGY+h8cstFN5lZZNv9B+ASlzdmpbSnLK66pIW1yuQaRvzK2saLUuUfdzTxHOS4x7Ob5QaGjJ7b0L7wzN6LiTr0WDgOp4FAlLlVF+NscYzgg2RxrWcSorOesMBmaWyXSG/EQ9BHlIObmkBmTMgEnd/GhlodDBZrroV9lMRxlLZKqzwdTF1TsJTKkOgmQmFnZ0XUmYxl3YyH/B5LK/d0GhF7LzG5dHpzVmK0PxK0uWr4jNJmCxA+odiD+Tkx6kVjjBVFVeVd6XcTnqnNC46ok8myDXFqyusMTqzRVaY4wJHPoEL8ZixDgcBhJj8ISXaAiHQ4v/H6+FK+EpCjgiLwWeDyjdEz0T4C+pk8Qs4HFoeTYK9xeGNYtsouWPlHalB2r9XwUQEnFmZsZJ9nueG9QAjcKkxHtyU4Op4P6P/W3917vbundcf8nEHqqH3U8dBfzy4pfYZpimjVlQTl5vNpPWFjjb6FpdK9VU/F8ek2awGEZeRr1On9lkEjAYEPHRZJS52E/5YV2U40ez/vZglOPy77ABJjCF1K5cWX6jDgcJy3wskyXAVriWiDe65ngcXyZculuNwuMd9YmbuuDxXQtd4I/0J/uPnA02nwnue7I/vfo3J8cpHXzpPPPZXuet608T171zOEsImbVaDoVZh99Z9/hDV4fzTb1P/EbbsNqv3X6BNbxW/qZeKwJ0M33T9533u6RD7rNuUMa/xs6MBgIGQwC0GWzYD/f2JHIGhdyHRFxGoi7BazIsB5O5MxeZd73drKtONM+7+cwWP3ghjZfxRmimEp2l5ThrbIikZ6pnhAy9sIbrXMVNTX6G/wnsf+id+L0dT9K7cb4QaCPmm8PnB2FENS7LLBJlmmwyo5Bx0iTMZXZBYu7KjRRSNxLpIFGcFfCMTDqTIKbeSB0vI5eC2WoMhMPev6SwpldYnqXQLsKZX2H0yUwGDZMCX0xnvK49eHS+8si8HIa8jDELBBjTkTQaP9dZLswl6xNv3taeX7587tCDJ9LRiXqKILfcyQMU1JFaVn/LWPMR8Kzvu+bvcIfc37qBgP816srocMBoUNlhQ8jAhv1wH0+iDqOQR1CpXyFRtxA1GZaDyew3F9lGcd5u9lUnmhtt/kaXxfiFeQfMpIShIRzeIhThTbYfjeUiziQSupbcqib2KST8NC7+mgi6HoXDvKrwJL3CgNGAE5+geLKFf8lOn2NILHKZ2MJkSsxyudRCh+LcGYSi+HgtgahfgDBv7sTmGUBOn8CWm3eqpHhInrJMFuwD7hMXL8TX/Qz6+58A8GQrgp/r4r2G+97iQuOFi/EM+DmfefKktv9n8AzzPjpgnR/i+CGCrgjQ2Bs+cXhJlJuA4QdWLFeYplP/A2DrCSmeWr5CgaIuJy4FadCuyV39fBKAJ56anAK3Fbu3X3BuB6cUfXqOC+AdhZe7faZ6+9eM4K2fXE/WAJ5i9fbtzdrVQ2s6rgJHFP/J1S9fsOCBgKYnZmpJLoQXlV6GcJEyNfoMME3O/j4r8/vs7OuZWdez1JFxkZGxkVHI4LaCIkPKCDoyJrE2zoZdKX6QBR958TR2ee41REouAV61u8ENpMoWlSVPIcWocdrOQSAtkWI5f95W2JcsOHdTqKLCnfCs6LDk0EhhbHK1dXbfdTRWTAfvf8n6BJ8pk+/4YAkUHx0dkYhIlt9qA2My9CIMJgqNjtoOXXQmPYUgS8Gvw2f24bGuTHwV2CTCoBlktElKIkmxBNwn00fD08PT0h4BXUn+7Dev+ChsfMlW/B9GKdm0Fr0dAn1CoSgZzE2W2ye1FpU1UmmlVImTVbbsr8tn8OcKefzlSrNAbElpllob99d6Bi6X+gY1EnXWXKYDr6umOnTLmKaBTVkjlUJlqZdSJYirjHUrkSvZFeWueOyt8QOnN/V36ug6HcTTAORUUJXzkJp6VyprjyytmlTV+1xVhx72Tt0jlnqZoPLEe1JM+8siCooaNzXAOyo2ATobXmSXFZUmadBI2k9SY79UOi5VDkq1S7LKxaLSNoqWlMesFepMUaaOSfTUjEnD6XqtY3AjlD86ETqRp7c6RY8++kaWWyM1JkqlWVJlslSLl1Xi9teFAN7lCs9AsX+msgdSE1OpjG2hijnFSUq+1JguleYXKjNpuaSkSi1JUeoRYVFvCbGLBs1qylOwMaVbZPe4KQgAD+ogp6v1tRtAr3LklTTtNCjuLUBlGjSZDms0H7cDKUYOxJAxQlM1jmi2LrdIqaN7r1e2f7kHkYTW8LhHowkvF+UEKyGqL2tCigpAHGm4R2efUg4D+lvvlC9dWTuZrWFlD1ZNdb1qQYqyLnyuOFZeOUpT51ICpba0U6hXu35YccNF0KIbRVlx1zvDdDS7k0wjW9NSzimWpS6zaoZW1SKCnXUy8OjZpfIVENi91S4Ap0RXKbNV+i/1qO/Cy3X6peBXKE8Xb1GdgDbf5t7SIzdigv0vr7ooStwLefe9NFdN83aFEqhgLVXl4dHMleXgMZDX/HFcsZlowLJ2JbLG3bxySVXL6RSpW5p2ZeV8WDUbq5fCVUvKKydRA1PLYu0r8ppfqYWpHbD2twDXLi2vOVQ73szWsSC07kjd47T7dvqcxsedrF5ZMydWLoRVc2P1cnpVy4ZLQJ4+FRUO0R9J+Sc1jkul832Vk2fguskhiTV9gZXD5Kr+RGdqT6z9P9AqPeJKcv10poHunK6fhcCmRzd/tPEayAbHueE7E/UncXHDXQUURjvtDb651e4UsazJsdq0uR50l9St+jk3xjShxm04hhA/pMm8fst6p/P6gUTPG/ZUu/g6V12DjUnWr6xdkK1h5VJYtbBe1aoBnWAkID2pn1fOQaIWdVhlTX9g5Qi5amDi9WIQVXr1i3pKBgtMkx5NbszJQVbZaErq4KEn1c0EboPWHN7nYn/+VAAnCvGpfZMpVsVYvq8bAsutx9GTK6ATtFw9tlxf7gw5U+SClpfkNhSv0nrd8h+x1qwh1Y5qIGqeTguM00HsDJxRbYnKKrE86BfZIPWcIDnG/6eyKJ4WalghiKSSlGbWfroEvlpb90ZlphQVFGo0aCmngkqqqKWOesf8/ZQNYLmfu/W39/z0z9KNv+/l639/Xy5TT88fV7vCEf98s+/XS/va+/2nD1j8o8c70wW98y0ANLXOWFCebp791K6PW42qKFpZjof/Iv66qJtnGleWcigxADDVN0UBWPM6hDYdX+VmQVOjGOJ3ypnRRlnA+Gy9Lcgamf0xYC04rq0YzyPupY59AD6c+yLIouv6/qfiK7I0dKfKu1ELsbZsc6JY0K8VEGi/IjzobGDqFLvNvzt3wMUu4neKe1zcV9axljTi842VCVhVOJ23eACmy7qcvA4TXNfCHe1Zzh60Ju4T3qf6oDwAwi1tJnblnCZLZkcqz9F056Msza4mkNUy0xb40InGjcLx3vEw/bhnrjdRT2SWtVVZEa0c8NYtAvaOxVr1VtG6I64k2vOzOeLD02gaC1C7NXbDwDmLYTTjgW0NgDSjRTOoL0UBcLkOARQEMXYL/SNBV65pbeAHvAVNGM8GHfUcNgJX05q9MfUS+ILWLbQYRe9lh2K6qlqx+zMa15TdqeI7Cq1162AyPNGS0iiulMPKUo3FlUpGsr3Qw6ecYv+juzPwJqIB4ZaJfncqu4YBHMTTWgtAY7BM4OLsWklOY2Ltu/bPjSSVeHGaOqWlAOpCjbeBXosBTNC09wUPxqpX2tg9kEQgn7i7JHt3Q/ZFbLfgEo3WAs2OrLRvnwJZryKIc8aCR8dJgEPA3v24Cjca2+PCs+bz1PUu6pnsXS3WK3stc0uaGa/LAtRuzYhZ1sqFq6eZrqFrZV/IXcGWxnplLyd2cK1OrZdtlgVAeUQ6yPTSy2Xcrvgsye3FWMjYXvb5Lehq39aPROrY41Lofo/B3LX00V9s616OcVCfd6uL1Pwaa7HY8LQ1ZLktYxpJJ7xazM2IWYqPEifNg+msGKs+CzkF0u5kxViYBbIGO7MzSwyr8tLCVMT+2vRGQi7R9GK0GOZod0vz+sXeGarHIiRWICQY0gxxrfT+GSHud+n7M9i8XJ8/8fO0/IodAPQa+8+KL3yknvye2x3PZ4DlT+n+b3+fevCY0fzOGvFy/Xp3d/cfAQLOfO37rxDF/7+MJL8APrr8/Qn44leZ++Nuue/U9TVERwAENM/WG6Dvzk2rPzp0/0Ekv8/pxK1l9shMmeHB+k134tPj97fg0IBZtFVTA4y65J8mo8LM7vob0C5aTE5lR/0Yjy+YDw7gRdzvP7kcsyiJ9VFga8OMCZpjD6TAQyqP+/Djx8+wTJOqcEnz4CVKl56QGRYzmUSX3vYZuTywtcyOPPtHukV4zaN/ic0J+SiPQHi60aohA/WQf44/YnW+lmPdtbddz/VymrOPB2Li4g9jZ3dkq+NIXe7DZUiOKTPrQWv+n0zPI8ZSsy6KX/XkFeWcymMom2LLojDik5mQweAHMk3Y8f885Trv/H9ZOAWjO5h6bLp9A5K5clqRyqWRxGye6e1DeltNjxefp2JlGxeZ5WgyMHgv/fKzoZnuyK5Kj413fZmX5IG12b/xjDlUZmTG18clmCASMTWLPXY8dTz0rgu12r45fvWJfdiZo3nYd+zyue4MR2fqj0t3TteJx+1Za9RkYTf51lHite0lfWNjNm+h7Xk1szHHXIjfW/GzM2bxjtvQeF2WWSOAy2MMYjAzq66YvOdPjiVYDRIQgz14S8cziDxbGvIG0APRbJgs1vH+u33Eha4bbVZk8dqJ23GulwlbyTaZmZM7cpRXIdKKFpB5CSwtTppNvP+s2jayhAhJ/qhk+pc3w0f4a9b6mcnmEFv1Wj9PqEAIfBDTmLJPXGCZND00vre0XNJuIK08N5h+WZcbm1hfQxbRI0Y6DF2Qsaru4Yl9Ei8tS9GB2+2ZlJvZuMRPOPUmWJZQMzUTvoPiJatUCcq2MVda/4xOtB/kmaKI7zpBgcNt8PjH7+Tkj+ZAAimIgTXMH59k7xnOmrOgXLbzZJ3fBQ9Wvu+NDCBmzM0VHiYxo5OVi3Erg1EGSvITBPm9TegKQ3+7P1rt16x8QMKWHoDHjytVxD87JDBaGyTJjkwa4eGpQzrl0gnmiQycSVOPw+xQn/uMa1YVkQaxH6Zskqg2c1Z5cUKAkUlDY8QBCTDJqibB9NAIjQ6eoWMRXWjFWHRGD41MEHikPjg4KguY9mgALBtkA1tcDwIz5cQx6mHo64rcuHZolAX75t1h0sYLJtWVm8R8ON0yAtHRwJEOpaJSPmNRw3oLhM8GJAfwb64M/gGnAWOgwenyA/P2BLViQRBqmOhr3+GznCkBPwO7bnZSEz5kmvXZmYhiSLidhoID15gtT7bc3XJry4MtT7fcC7IZIhFwnL2GVMqGeMgshLZQvkbSgYSUr9wX1BcEDPfT1/EX3JbLs5wqjIf8UrKQk6svHpRHzf48xMShybXYBzM4URoXNyW6zobURC5ta3whskO0F/A7/alGsSyiun9/GP7IZXQKZVLV0oNsU41mukZ8OBvhVknPvXyKFvhNzFTOpLITbq8Hdyg9sER1Mgbk5bKgP/Mleo1cAZ5q9HIIdLbofScHCpfKEkjE3cob+GZAcibrj9Qdyc0/34xdt/f93ewar0qqpNRd4FCSPfnJ7vRLN3rmtevDqNO2tduRkfnDkaH7TX3G3MIUJsPlUoizVUNha79WEdX8hPBjU5tVHIeGfNRp3jH+gjtWdJr+h1+Qgc8ZNJ5LD1yeBOOBsEXhbzJh+fPs+Zis/42xkvx2lN9jpvwIJCHXXHejoQ7Mc89xjgT+qXbudXDyNV1kgND8YJCnICYUpo8scObiZwyQDa4ZBKJwKlKsxG8vZYibG/cY5YFa7a6eJ8zFMG/BZDGFzxYqRV1ynWAJrumtgw9f9GpSktjW6A/Blc3PXmz+VDlGWUTNce0sgBSPWZ6IW0PItOXe6zwKjGfNfvOIefPh+7ow04qtMe307SmnERaXK694S8SVr6BllkoSItRAAParsDCtTRUC4VZU1CqrK25lJexFiPQrs5QVlaNoZdZYZ33O1lbOpaKRVTaqqkZzVdeowRhj0aqqNuRpnI2ImLeJsLmVkm310HidYkwgwV6HTaylJn+ztoMm5dfaZNsKtMNO21ulTbuOppj6ajM/A00zXXs7e9WuZtRbC/wShXGmO/7SMweXaIPprr36DN02ec84p+PQMQK3qY8KHsrq9WiirEwWaStkaBBrfLfRpLKX4qP9DNBxBbEzS+UlPwUpTFGKU5JPTINSphR6KFWnLJpovboCxyOPDaMfVDX9I5xwNrmhnzWZqiN9dsqS/TI75c88d9Ot99z8Q0sHM01pTku+5Gta02YwPQfsc9ghCXab1WN76KbDXmfrTBe2Lt3uZsuOjTmCMeTUrUevPv2++e6Hn3757Y+//hnwjRFJVlRNN0zLdlzPFyiJVTiK+8NhCoKBIaSgSPS00YfD8RQ7M8sIrKhrw3IioEoKy5GBFOypUPelBkqZ0KRBQUlBGlRJ0MRlriy4Tpdbrr9Vrh3eY7VOWvYv4mXbA/W807U67iZV6twwHv3mgtHsgWiDYvpChvbwX6wbuyJ4MwrNNoAbJuKQPWONIjxDpl7t6W3nMSOgL2kVHq9V7zd3MvcQZJfPZFEWk28Woeoirdni1KsFGtbTZLWZLK5mc3Jm0Uz+mV/5yOZdeJDYECg4W5vTZMOfJls/5wvbCjn31jnMl37oMinLG+wihWtX4WpWxv40rhWsolPdQZU3KHPxFewjKI80q8xI3KkB9TlAebFIsUlHxfYUeocRm5lLFtP7GZc2ZfigrgCNLFxyGNz7Hq3LlLbqEKRROlV0idAl/YDJRKyrAvF7wXLkZqoawdMuuiiZAAyp9a4FBiya+TXrTRYzrMyESYJOeCmPpZ9M/cp82nuOjxb6sHFASj1pmsCJB8X0lYgR0b/W+TErSyMzVVJHEJK/ROh+NX0hpmyMMYZMltrpsjRL7SzLsot1qYAqWsEOzTJTEZwBHsp4vGgGHAZj/RhJAB8oiKExGpS5+qr3kX2v7HklKsXsUmHGpHQ5W6y85KsLl3UKZRk+sTd1NLozqFbV1wG4RnnDF+rFQ+gBngqDAHAqgToPrrdo5P4pZPfrJs1S0TYVAdcoBrwhKcAEnqYTojFtZ0Aci7c/Uc04YBFoYHq6XwlvGf7iwxfTL6T35pV+4ZgKdsJtmj8Nncp8VTJzCY55nogUbMNVDCing7BlnoVNWDxyeHYyr5/gf2Awdhb0KXbHvkBRF337aF0mP5DnSvvI4rBU79Eg+xQ1Fl7MzUz47FvTipBOiwsgdhqiT/bO6SIMdvgGszA2Sz9Ep2HR3Log9VddiZViZEbHv1N35kUZDsPEjJ7Y+Kzg7SHS7+SMc4zLP2QMnwbAUwQHEaLTmDYzEENmQX7ADFCQ9H2h4PJw1z5SX+GhOk8I/6HhZ1lUvzU9qUN7jD29W1D1CbujPAWUwfoWdN9ff2J6qx+4b50XPuFq9gYyHXqpWqjFX/K9jYsEsLTBEUcqoiOV39rNVtFBo/fFdZ3rxluI4pwzvqL7pe35iblmND+JXKnqFMM0PvNMf2bXki9HKC7DotGO5jLWedTPzg6ooZfUhVaMIeESdHzQfnvJ3FvMIJh2jidAjZdSE/eExzUVKWGR5XDtBeHaSBCy6IoZIPNOk2fNh1b7366rRobHaRKjS9PM5wv5Mcm9gvrMpfh4ei31XIuqwVyNP3XOT3GNgLW1VHk+qz0YOhuyTKARArWMXKBvQ0/7Mfmo/x2j/Kv/FSV0Dg==";
const GEIST_MONO_400 = "data:font/woff2;base64,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";

const CSS = `
@font-face { font-family: 'FQ Instrument Sans'; src: url("${INSTRUMENT_SANS_400}") format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'FQ Instrument Sans'; src: url("${INSTRUMENT_SANS_700}") format('woff2'); font-weight: 700; font-style: normal; font-display: swap; }
@font-face { font-family: 'FQ Geist Mono'; src: url("${GEIST_MONO_400}") format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }

.fq {
  color-scheme: light;
  --tui-desk: #d8d7d2;
  --tui-face: #e6e6e2;
  --tui-face-hi: #f2f2ef;
  --tui-face-lo: #cbccc8;
  --tui-well: #d3d4d0;
  --tui-skirt: #a4a5a1;
  --tui-ink: #1b1c1e;
  --tui-ink-2: #4b4d51;
  --tui-rule: rgb(27 28 30 / 0.16);
  --tui-cap: #1e1f21;
  --tui-cap-hi: #2d2e31;
  --tui-cap-skirt: #070708;
  --tui-cap-ink: #efede8;
  --tui-cap-hl: rgb(255 255 255 / 0.14);
  --tui-hl: rgb(255 255 255 / 0.9);
  --tui-sh: 24 25 28;
  --tui-sh-a: 0.24;
  --tui-grain: 0.5;
  --tui-focus: #1b1c1e;
  --tui-ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --tui-well-fill: linear-gradient(to bottom, color-mix(in oklab, var(--tui-well) 86%, rgb(var(--tui-sh))), var(--tui-well) 55%);
  --tui-raised:
    inset 0 1px 0 var(--tui-hl),
    0 0 0 1px rgb(var(--tui-sh) / calc(var(--tui-sh-a) * 0.35)),
    0 1px 1.5px rgb(var(--tui-sh) / calc(var(--tui-sh-a) * 1.2)),
    0 5px 12px -5px rgb(var(--tui-sh) / var(--tui-sh-a));
  --tui-inset:
    inset 0 3px 3px -2px rgb(var(--tui-sh) / calc(var(--tui-sh-a) * 2.6)),
    inset 0 9px 12px -9px rgb(var(--tui-sh) / calc(var(--tui-sh-a) * 1.8)),
    inset 0 0 0 1px rgb(var(--tui-sh) / calc(var(--tui-sh-a) * 0.45)),
    inset 0 -1px 0 color-mix(in oklab, var(--tui-hl) 60%, transparent),
    0 1px 0 var(--tui-hl),
    0 -1px 0 rgb(var(--tui-sh) / calc(var(--tui-sh-a) * 0.35));
  --tui-pressed:
    inset 0 5px 5px -4px rgb(var(--tui-sh) / calc(var(--tui-sh-a) * 3)),
    inset 4px 0 4px -4px rgb(var(--tui-sh) / calc(var(--tui-sh-a) * 1.4)),
    inset -4px 0 4px -4px rgb(var(--tui-sh) / calc(var(--tui-sh-a) * 1.4)),
    0 -1px 0 rgb(var(--tui-sh) / calc(var(--tui-sh-a) * 1.3)),
    0 1px 0 var(--tui-hl);

  --fq-paper: #f3f0e7;
  --fq-type: #26251f;
  --fq-type-2: #5d5b53;
  --fq-rule: rgb(38 37 31 / 0.13);
  --fq-rule-2: rgb(38 37 31 / 0.34);
  --fq-drop: rgb(24 25 28 / 0.3);
  --fq-sans: 'FQ Instrument Sans', 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
  --fq-type-face: 'FQ Geist Mono', 'Geist Mono', ui-monospace, monospace;

  position: relative;
  container: fq / inline-size;
  interpolate-size: allow-keywords;
  background: var(--tui-desk);
  color: var(--tui-ink);
  font: 400 15px/1.55 var(--fq-sans);
  -webkit-font-smoothing: antialiased;
}

.fq[data-finish='graphite'] {
  color-scheme: dark;
  --tui-desk: #090a0f;
  --tui-face: #13151b;
  --tui-face-hi: #1e222d;
  --tui-face-lo: #0d0f14;
  --tui-well: #0d0f14;
  --tui-skirt: #06070a;
  --tui-ink: #f1f5f9;
  --tui-ink-2: #94a3b8;
  --tui-rule: rgb(241 245 249 / 0.12);
  --tui-cap: #f8fafc;
  --tui-cap-hi: #ffffff;
  --tui-cap-skirt: #cbd5e1;
  --tui-cap-ink: #090a0f;
  --tui-cap-hl: rgb(255 255 255 / 0.85);
  --tui-hl: rgb(255 255 255 / 0.12);
  --tui-well-fill: linear-gradient(to bottom, #050608, var(--tui-well) 45%, #13151b);
  --tui-sh: 0 0 0;
  --tui-sh-a: 0.65;
  --tui-grain: 0.35;
  --tui-focus: #38bdf8;
  --fq-drop: rgb(0 0 0 / 0.65);
}

.fq *, .fq *::before, .fq *::after { box-sizing: border-box; }
.fq-head > *, .fq-card p, .fq-ask p { margin: 0; }

.fq-wrap {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.35fr);
  gap: 40px clamp(40px, 6cqi, 104px);
  align-items: start;
  width: min(100% - 2 * clamp(20px, 5cqi, 64px), 1240px);
  margin-inline: auto;
  padding-block: clamp(48px, 6cqi, 96px);
}

.fq-head { position: sticky; top: 24px; padding-top: 24px; }
.fq-head .fq-label {
  margin-bottom: 14px;
  font: 700 11px/1.2 var(--fq-sans);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--tui-ink-2);
}
.fq-title {
  font: 700 clamp(30px, 3.6cqi, 48px)/1.05 var(--fq-sans);
  letter-spacing: -0.035em;
  text-wrap: balance;
}
.fq-head .fq-lead {
  margin-top: 18px;
  max-width: 38ch;
  font-size: clamp(14px, 1.25cqi, 16px);
  color: var(--tui-ink-2);
  text-wrap: pretty;
  line-height: 1.6;
}

.fq-drawer {
  position: relative;
  isolation: isolate;
  padding: 12px 12px 0;
  border-radius: 16px;
  background: var(--tui-face);
  box-shadow: var(--tui-raised);
}

.fq-tray {
  display: grid;
  padding: 40px 12px 16px;
  border-radius: 10px 10px 4px 4px;
  background: var(--tui-well-fill) var(--tui-well);
  box-shadow: var(--tui-inset);
}

.fq-card {
  --shade: calc(var(--depth, 0) * 0.11);
  position: relative;
  margin-inline: calc(var(--depth, 0) * 5px);
  border-radius: 6px 6px 1px 1px;
  background:
    linear-gradient(rgb(40 36 26 / var(--shade)), rgb(40 36 26 / var(--shade))),
    var(--fq-paper);
  color: var(--fq-type);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.95),
    inset 0 2px 0 rgb(0 0 0 / 0.05),
    0 -1px 0 rgb(0 0 0 / 0.1),
    0 -7px 10px -5px var(--fq-drop);
  transition: transform 220ms var(--tui-ease), box-shadow 220ms var(--tui-ease);
}
.fq-card:first-child { box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.95), 0 -1px 0 rgb(0 0 0 / 0.08); }
.fq-card:not([open]):hover { transform: translateY(-3px); }
.fq-card[open] {
  z-index: 2;
  margin-top: 9px;
  transform: translateY(-12px);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.95),
    0 -5px 9px -5px var(--fq-drop),
    0 22px 30px -16px var(--fq-drop),
    0 2px 3px rgb(0 0 0 / 0.12);
}

.fq-edge {
  display: grid;
  grid-template-columns: 5.2ch minmax(0, 1fr) auto;
  align-items: baseline;
  column-gap: 12px;
  padding: 16px 18px 22px;
  list-style: none;
  cursor: pointer;
  font: 500 15px/22px var(--fq-type-face);
  border-radius: inherit;
  -webkit-tap-highlight-color: transparent;
}
.fq-edge::-webkit-details-marker { display: none; }
.fq-edge::marker { content: ''; }
.fq-edge:focus-visible { outline: 2px solid var(--fq-type); outline-offset: -5px; }
.fq-no { font-size: 11.5px; letter-spacing: 0.04em; color: var(--fq-type-2); font-weight: 700; }
.fq-q { text-wrap: pretty; font-weight: 600; }
.fq-mark { width: 12px; height: 12px; align-self: center; position: relative; }
.fq-mark::before, .fq-mark::after { content: ''; position: absolute; left: 1px; right: 1px; top: 5.25px; height: 1.5px; background: var(--fq-type-2); }
.fq-mark::after { transform: rotate(90deg); transition: transform 220ms var(--tui-ease); }
.fq-card[open] .fq-mark::after { transform: rotate(0deg); }

.fq-tab {
  position: absolute;
  bottom: 100%;
  left: calc(var(--tab-at, 0) * 100%);
  height: 20px;
  padding: 3px 11px 0;
  border-radius: 5px 5px 0 0;
  background:
    linear-gradient(rgb(40 36 26 / var(--shade)), rgb(40 36 26 / var(--shade))),
    var(--fq-paper);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.95), 0 -4px 7px -4px var(--fq-drop);
  font: 600 10.5px/16px var(--fq-type-face);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--fq-type-2);
  white-space: nowrap;
  pointer-events: none;
}

.fq-card::details-content {
  block-size: 0;
  overflow: clip;
  transition: block-size 320ms var(--tui-ease), content-visibility 320ms allow-discrete;
}
.fq-card[open]::details-content { block-size: auto; }
.fq-face {
  margin: -8px 18px 0;
  padding: 16px 0 22px calc(5.2ch + 12px);
  border-top: 3px double var(--fq-rule-2);
  font: 400 14px/26px var(--fq-type-face);
  background: repeating-linear-gradient(to bottom, transparent 0 25px, var(--fq-rule) 25px 26px) 0 20px / 100% calc(100% - 42px) no-repeat;
}
.fq-a { max-width: 60ch; line-height: 1.7; }
.fq-filed { margin-top: 26px; font-size: 11px; letter-spacing: 0.06em; color: var(--fq-type-2); text-align: right; }

.fq-front {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 10px;
  margin: 0 -12px;
  padding: 16px 0 18px;
  border-radius: 0 0 16px 16px;
  background: linear-gradient(to bottom, color-mix(in oklab, var(--tui-face-hi) 70%, var(--tui-face)), var(--tui-face));
  box-shadow: inset 0 1px 0 var(--tui-hl), inset 0 2px 0 rgb(var(--tui-sh) / calc(var(--tui-sh-a) * 0.6)), 0 -1px 0 rgb(var(--tui-sh) / calc(var(--tui-sh-a) * 0.9));
}

.fq-holder {
  display: block;
  padding: 3px;
  border-radius: 4px;
  background: linear-gradient(var(--tui-face-lo), var(--tui-face-hi));
  box-shadow: 0 0 0 1px rgb(var(--tui-sh) / calc(var(--tui-sh-a) * 1.2)), 0 1px 0 var(--tui-hl), inset 0 1px 1px rgb(0 0 0 / 0.25);
}
.fq-holder-card {
  display: block;
  min-width: 140px;
  padding: 4px 14px 3px;
  border-radius: 2px;
  background: var(--fq-paper);
  box-shadow: inset 0 1px 2px rgb(0 0 0 / 0.25);
  font: 600 11px/16px var(--fq-type-face);
  letter-spacing: 0.1em;
  text-align: center;
  text-transform: uppercase;
  color: var(--fq-type);
}

.fq-pull {
  display: block;
  width: 112px;
  height: 22px;
  border-radius: 3px 3px 54px 54px / 3px 3px 22px 22px;
  background: var(--tui-well-fill) var(--tui-well);
  box-shadow: var(--tui-inset);
}

.fq-ask {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px 24px;
  margin-top: 28px;
  padding-inline: 4px;
}
.fq-note { font-size: 14px; color: var(--tui-ink-2); max-width: 44ch; }
.fq-key {
  display: inline-flex;
  align-items: center;
  height: 44px;
  padding: 0 22px;
  border-radius: 10px;
  font: 700 14px/1 var(--fq-sans);
  color: var(--tui-cap-ink);
  text-decoration: none;
  background:
    radial-gradient(120% 90% at 50% 0%, rgb(255 255 255 / 0.1), transparent 60%),
    linear-gradient(var(--tui-cap-hi), var(--tui-cap));
  box-shadow:
    inset 0 1px 0 var(--tui-cap-hl),
    0 3px 0 var(--tui-cap-skirt),
    0 4px 2px rgb(var(--tui-sh) / calc(var(--tui-sh-a) * 1.4)),
    0 9px 14px -6px rgb(var(--tui-sh) / var(--tui-sh-a));
  transition: transform 70ms var(--tui-ease), box-shadow 70ms var(--tui-ease);
}
.fq-key:active { transform: translateY(3px); box-shadow: var(--tui-pressed); }
.fq-key:focus-visible { outline: 2px solid var(--tui-focus); outline-offset: 3px; }

@container fq (max-width: 959px) {
  .fq-wrap { grid-template-columns: minmax(0, 1fr); }
  .fq-head { position: static; padding-top: 0; max-width: 640px; }
}
@container fq (max-width: 559px) {
  .fq-drawer { padding: 8px 8px 0; }
  .fq-tray { padding: 34px 6px 12px; }
  .fq-card { margin-inline: calc(var(--depth, 0) * 3px); }
  .fq-edge { grid-template-columns: minmax(0, 1fr) auto; padding: 14px 14px 20px; font-size: 14px; line-height: 21px; }
  .fq-no { display: none; }
  .fq-tab { font-size: 9.5px; padding-inline: 8px; }
  .fq-face { margin-inline: 14px; padding-left: 0; font-size: 13.5px; }
  .fq-front { margin-inline: -8px; }
  .fq-ask { flex-direction: column; align-items: stretch; }
  .fq-key { justify-content: center; }
}

@media (prefers-reduced-motion: reduce) {
  .fq-card, .fq-mark::after, .fq-key, .fq-card::details-content { transition: none; }
  .fq-card:not([open]):hover { transform: none; }
}
`;
