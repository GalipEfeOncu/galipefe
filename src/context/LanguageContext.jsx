import { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Check localStorage for saved lang, otherwise default to 'tr' or 'en', you want user to have choices.
    const [lang, setLang] = useState(() => {
        const saved = localStorage.getItem('site_lang');
        return saved ? saved : 'en';
    });

    useEffect(() => {
        localStorage.setItem('site_lang', lang);
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

export const useLanguage = () => useContext(LanguageContext);
