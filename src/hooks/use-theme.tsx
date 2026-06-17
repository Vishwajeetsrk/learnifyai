import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ColorTheme = "indigo" | "ocean" | "sunset" | "forest" | "rose" | "noir";
export type Mode = "light" | "dark" | "system";

export const COLOR_THEMES: { id: ColorTheme; label: string; swatch: string }[] = [
  { id: "indigo", label: "Indigo", swatch: "oklch(0.55 0.22 260)" },
  { id: "ocean", label: "Ocean", swatch: "oklch(0.62 0.16 215)" },
  { id: "sunset", label: "Sunset", swatch: "oklch(0.66 0.21 35)" },
  { id: "forest", label: "Forest", swatch: "oklch(0.58 0.15 155)" },
  { id: "rose", label: "Rose", swatch: "oklch(0.64 0.21 0)" },
  { id: "noir", label: "Noir", swatch: "oklch(0.2 0 0)" },
];

interface ThemeContextValue {
  mode: Mode;
  color: ColorTheme;
  resolvedMode: "light" | "dark";
  setMode: (m: Mode) => void;
  setColor: (c: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const MODE_KEY = "ui.mode";
const COLOR_KEY = "ui.color";

function getSystemMode(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(mode: Mode, color: ColorTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const resolved = mode === "system" ? getSystemMode() : mode;
  root.classList.toggle("dark", resolved === "dark");
  if (color === "indigo") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", color);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>("system");
  const [color, setColorState] = useState<ColorTheme>("indigo");
  const [resolvedMode, setResolvedMode] = useState<"light" | "dark">("light");

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const m = (localStorage.getItem(MODE_KEY) as Mode) || "system";
      const c = (localStorage.getItem(COLOR_KEY) as ColorTheme) || "indigo";
      setModeState(m);
      setColorState(c);
      applyTheme(m, c);
      setResolvedMode(m === "system" ? getSystemMode() : m);
    } catch {
      applyTheme("system", "indigo");
    }
  }, []);

  // Listen to OS theme changes when in system mode
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (mode === "system") {
        applyTheme("system", color);
        setResolvedMode(getSystemMode());
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode, color]);

  const setMode = useCallback(
    (m: Mode) => {
      setModeState(m);
      try {
        localStorage.setItem(MODE_KEY, m);
      } catch {}
      applyTheme(m, color);
      setResolvedMode(m === "system" ? getSystemMode() : m);
    },
    [color],
  );

  const setColor = useCallback(
    (c: ColorTheme) => {
      setColorState(c);
      try {
        localStorage.setItem(COLOR_KEY, c);
      } catch {}
      applyTheme(mode, c);
    },
    [mode],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      color,
      resolvedMode,
      setMode,
      setColor,
    }),
    [mode, color, resolvedMode, setMode, setColor],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
