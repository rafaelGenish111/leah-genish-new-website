import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n/i18n.js';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(i18n.language || 'he');
    const [direction, setDirection] = useState(language === 'he' ? 'rtl' : 'ltr');

    // Load language preference from localStorage
    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && ['he', 'en'].includes(savedLanguage)) {
            setLanguage(savedLanguage);
            setDirection(savedLanguage === 'he' ? 'rtl' : 'ltr');
            i18n.changeLanguage(savedLanguage);
            updateDocumentDirection(savedLanguage);
        }
    }, []);

    const updateDocumentDirection = (lang) => {
        const dir = lang === 'he' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', lang);
        setDirection(dir);
    };

    const changeLanguage = (lang) => {
        if (['he', 'en'].includes(lang)) {
            setLanguage(lang);
            i18n.changeLanguage(lang);
            localStorage.setItem('language', lang);
            updateDocumentDirection(lang);
        }
    };

    const toggleLanguage = () => {
        const newLang = language === 'he' ? 'en' : 'he';
        changeLanguage(newLang);
    };

    const value = {
        language,
        direction,
        changeLanguage,
        toggleLanguage,
        isRTL: direction === 'rtl',
        isLTR: direction === 'ltr'
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
