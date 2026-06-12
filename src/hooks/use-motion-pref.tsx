import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type MotionPref = "auto" | "full" | "reduced";

interface Ctx {
  pref: MotionPref;
  setPref: (p: MotionPref) => void;
  /** True when the user (or OS, in auto) wants reduced motion */
  reduced: boolean;
}

const MotionCtx = createContext<Ctx | null>(null);
const KEY = "ui.motion";

function osPrefersReduced(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function MotionPrefProvider({ children }: { children: ReactNode }) {
  const [pref, setPrefState] = useState<MotionPref>("auto");
  const [osReduced, setOsReduced] = useState(false);

  useEffect(() => {
    try {
      const p = (localStorage.getItem(KEY) as MotionPref) || "auto";
      setPrefState(p);
    } catch {}
    setOsReduced(osPrefersReduced());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setOsReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const reduced = pref === "reduced" || (pref === "auto" && osReduced);

  // Reflect on <html> so global CSS can react
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("reduce-motion", reduced);
  }, [reduced]);

  const setPref = useCallback((p: MotionPref) => {
    setPrefState(p);
    try {
      localStorage.setItem(KEY, p);
    } catch {}
  }, []);

  const value = useMemo<Ctx>(() => ({ pref, setPref, reduced }), [pref, setPref, reduced]);
  return <MotionCtx.Provider value={value}>{children}</MotionCtx.Provider>;
}

const FALLBACK: Ctx = {
  pref: "auto",
  setPref: () => {},
  reduced: false,
};

export function useMotionPref() {
  const ctx = useContext(MotionCtx);
  return ctx ?? FALLBACK;
}
