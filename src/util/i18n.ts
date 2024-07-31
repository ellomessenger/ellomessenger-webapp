import { use } from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const i18n = use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    detection: {
      order: ['queryString', 'cookie'],
      caches: ['cookie'],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      bindI18n: 'languageChanged',
      useSuspense: false,
    },
  });

export default i18n;
