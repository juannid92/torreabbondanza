import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import it from "@/locales/it.json";
import en from "@/locales/en.json";
import ru from "@/locales/ru.json";
import zh from "@/locales/zh.json";
import de from "@/locales/de.json";
import fr from "@/locales/fr.json";

export const SUPPORTED_LANGUAGES = ["it", "en", "ru", "zh", "de", "fr"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<Language, string> = {
  it: "Italiano",
  en: "English",
  ru: "Русский",
  zh: "中文",
  de: "Deutsch",
  fr: "Français",
};

// Flag emojis per language switcher
export const LANGUAGE_FLAGS: Record<Language, string> = {
  it: "🇮🇹",
  en: "🇬🇧",
  ru: "🇷🇺",
  zh: "🇨🇳",
  de: "🇩🇪",
  fr: "🇫🇷",
};

// hreflang mapping for SEO
export const HREFLANG_MAP: Record<Language, string> = {
  it: "it-IT",
  en: "en",
  ru: "ru",
  zh: "zh",
  de: "de",
  fr: "fr",
};

i18n.use(initReactI18next).init({
  resources: {
    it: { translation: it },
    en: { translation: en },
    ru: { translation: ru },
    zh: { translation: zh },
    de: { translation: de },
    fr: { translation: fr },
  },
  lng: "it",
  fallbackLng: "it",
  supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
  interpolation: { escapeValue: false },
  detection: {
    order: ["querystring", "localStorage", "navigator"],
    lookupQuerystring: "lang",
    caches: ["localStorage"],
  },
});

export default i18n;
