import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown, Check } from "lucide-react";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/i18n";

function setGoogtransCookie(code: string) {
  if (typeof document === "undefined") return;
  const domain = window.location.hostname;
  const value = `/en/${code}`;
  document.cookie = `googtrans=${value}; path=/; domain=${domain}`;
  document.cookie = `googtrans=${value}; path=/`;
}

function triggerGoogleTranslateCombo(code: string) {
  if (typeof document === "undefined") return;
  const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
  if (combo) {
    combo.value = code;
    combo.dispatchEvent(new Event("change"));
  }
}

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [activeCode, setActiveCode] = useState<string>(() => {
    if (typeof window === "undefined") return "en";
    return localStorage.getItem("learnify-lang") || i18n.language?.split("-")[0] || "en";
  });
  const ref = useRef<HTMLDivElement>(null);

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === activeCode) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Mount Google Translate script & hidden element
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Ensure hidden container exists
    let container = document.getElementById("google_translate_element");
    if (!container) {
      container = document.createElement("div");
      container.id = "google_translate_element";
      container.style.display = "none";
      document.body.appendChild(container);
    }

    // Set up global init callback
    (window as any).googleTranslateElementInit = function () {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,bn,ta,te,mr,gu,kn,es,fr,de",
          autoDisplay: false,
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element",
      );

      // Trigger saved language if non-English
      const saved = localStorage.getItem("learnify-lang") || "en";
      if (saved && saved !== "en") {
        setTimeout(() => {
          triggerGoogleTranslateCombo(saved);
        }, 500);
      }
    };

    // Inject Google Translate script if not already present
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    // Restore saved language preference on load
    const saved = localStorage.getItem("learnify-lang") || "en";
    if (saved !== activeCode) {
      setActiveCode(saved);
      i18n.changeLanguage(saved);
    }
  }, []);

  function switchLang(code: LanguageCode) {
    setActiveCode(code);
    i18n.changeLanguage(code);
    localStorage.setItem("learnify-lang", code);
    document.documentElement.lang = code;
    setOpen(false);

    if (code === "en") {
      setGoogtransCookie("en");
      triggerGoogleTranslateCombo("en");
      // Clear translation state
      const iframe = document.querySelector("iframe.goog-te-banner-frame") as HTMLIFrameElement;
      if (iframe) {
        try {
          const innerDoc = iframe.contentDocument || iframe.contentWindow?.document;
          const closeBtn = innerDoc?.querySelector(".goog-close-link") as HTMLElement;
          if (closeBtn) closeBtn.click();
        } catch {
          // ignore iframe security policy
        }
      }
    } else {
      setGoogtransCookie(code);
      triggerGoogleTranslateCombo(code);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="group h-9 px-2.5 flex items-center justify-center gap-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border border-border/40"
        aria-label="Select language"
      >
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Globe className="h-4 w-4 text-primary" />
        </motion.div>
        <span className="text-xs font-semibold uppercase">{currentLang.code}</span>
        <ChevronDown
          className={`h-3 w-3 ml-0.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 z-20 w-52 rounded-xl border bg-popover shadow-xl overflow-hidden"
            >
              <div className="p-1 max-h-80 overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-muted-foreground border-b mb-1">
                  Global Language
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLang(lang.code)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors ${
                      currentLang.code === lang.code
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <span className="text-xs font-mono opacity-60 w-5">{lang.code.toUpperCase()}</span>
                    <span className="flex-1 text-left">{lang.nativeLabel}</span>
                    {currentLang.code === lang.code && (
                      <Check className="h-3.5 w-3.5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
