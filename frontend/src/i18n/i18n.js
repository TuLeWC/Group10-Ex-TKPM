import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en_sidebar from './locales/en/sidebar.json';

import vi_sidebar from './locales/vi/sidebar.json';

const resources = {
    en: {
        sidebar: en_sidebar,
    },
    vi: {
        sidebar: vi_sidebar,
    },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi',
    interpolation: { escapeValue: false },
    ns: ['sidebar'],
    defaultNS: 'sidebar',
    });

export default i18n;