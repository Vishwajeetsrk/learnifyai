import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import en from "../public/locales/en/translation.json";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English", dir: "ltr" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", dir: "ltr" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা", dir: "ltr" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்", dir: "ltr" },
  { code: "te", label: "Telugu", nativeLabel: "తెలుగు", dir: "ltr" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी", dir: "ltr" },
  { code: "gu", label: "Gujarati", nativeLabel: "ગુજરાતી", dir: "ltr" },
  { code: "kn", label: "Kannada", nativeLabel: "ಕನ್ನಡ", dir: "ltr" },
  { code: "es", label: "Spanish", nativeLabel: "Español", dir: "ltr" },
  { code: "fr", label: "French", nativeLabel: "Français", dir: "ltr" },
  { code: "de", label: "German", nativeLabel: "Deutsch", dir: "ltr" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: LanguageCode = "en";

function getLanguageFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const path = window.location.pathname;
  const match = path.match(/^\/([a-z]{2})(?:\/|$)/);
  if (match) {
    const code = match[1];
    if (SUPPORTED_LANGUAGES.some((l) => l.code === code)) {
      return code;
    }
  }
  return null;
}

export function getLocaleFromUrl(): string | null {
  return getLanguageFromUrl();
}

export function getPathWithoutLocale(): string {
  if (typeof window === "undefined") return "/";
  const path = window.location.pathname;
  const match = path.match(/^\/[a-z]{2}(\/.*)$/);
  return match ? match[1] || "/" : path;
}

export function getLocalizedPath(path: string, lang: string): string {
  if (lang === DEFAULT_LANGUAGE) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `/${lang}${cleanPath}`;
}

export function getCurrentLanguage(): string {
  return i18n.language?.split("-")[0] || DEFAULT_LANGUAGE;
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    ns: ["translation"],
    defaultNS: "translation",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    resources: {
      en: { translation: en },
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      order: ["path", "localStorage", "navigator"],
      lookupLocalStorage: "learnify-lang",
      lookupFromPathIndex: 0,
      caches: ["localStorage"],
    },
  });

const urlLang = getLanguageFromUrl();
if (urlLang && urlLang !== i18n.language) {
  i18n.changeLanguage(urlLang);
}

export default i18n;
