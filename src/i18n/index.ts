import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import fr from "./locales/fr.json";

/** Languages the app ships translations for. */
export const SUPPORTED_LANGUAGES = ["en", "fr"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_STORAGE_KEY = "vintedut-language";

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES,
    // Lets "fr-FR" / "en-US" resolve to "fr" / "en".
    nonExplicitSupportedLngs: true,
    interpolation: {
      // React already escapes interpolated values.
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ["localStorage"],
    },
  });

// Keep the document language in sync for accessibility and correct hyphenation.
i18n.on("languageChanged", (language) => {
  document.documentElement.lang = language;
});

export default i18n;
