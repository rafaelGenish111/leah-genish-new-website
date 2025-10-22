import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import heTranslations from './locales/he.json';
import enTranslations from './locales/en.json';

const resources = {
    he: {
        translation: heTranslations
    },
    en: {
        translation: enTranslations
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'he', // default language
        fallbackLng: 'he',

        interpolation: {
            escapeValue: false // React already does escaping
        },

        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage']
        }
    });

export default i18n;
