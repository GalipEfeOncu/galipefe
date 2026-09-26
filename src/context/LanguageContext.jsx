import { createContext, useContext, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children, initialLanguage = 'en' }) => {
    const lang = initialLanguage;

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    const t = (key) => {
        const keys = key.split('.');
        let val = translations[lang];
        for (let k of keys) {
            if (val === undefined || val[k] === undefined) {
                if (import.meta.env.DEV) {
                    console.warn(`[i18n] Missing translation key: "${key}" (lang: ${lang})`);
                }
                return key;
            }
            val = val[k];
        }
        return val;
    };

    return (
        <LanguageContext.Provider value={{ lang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);
