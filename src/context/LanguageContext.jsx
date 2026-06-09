import { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Check localStorage for saved lang, otherwise default to 'tr' or 'en', validating input.
    const [lang, setLang] = useState(() => {
        const saved = localStorage.getItem('site_lang');
        const validLangs = ['en', 'tr'];
        if (saved && validLangs.includes(saved)) return saved;

        // Dynamic fallback based on browser preferences
        const browserLang = navigator.language || navigator.userLanguage || '';
        return browserLang.startsWith('tr') ? 'tr' : 'en';
    });

    useEffect(() => {
        localStorage.setItem('site_lang', lang);
        document.documentElement.lang = lang;
    }, [lang]);

    const toggleLang = () => {
        setLang(prev => prev === 'en' ? 'tr' : 'en');
    };

    const t = (key) => {
        const keys = key.split('.');
        let val = translations[lang];
        for (let k of keys) {
            if (val === undefined || val[k] === undefined) return key;
            val = val[k];
        }
        return val;
    };

    return (
        <LanguageContext.Provider value={{ lang, toggleLang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);
