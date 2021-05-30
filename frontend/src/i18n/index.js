import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';


// languages
import fi from './langs/fi.json';
import en from './langs/en.json';


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fi,
      en,
    },
    fallbackLng: 'fi',
    initImmediate: false,
    react: {
      wait: true,
    },
  });
i18n.defaultLocale = 'fi';

export default i18n ;