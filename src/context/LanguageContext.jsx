import { createContext, useContext, useEffect, useSyncExternalStore } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();
let languageWithoutStorage = null;

function getPreferredLanguage(fallback) {
    if (typeof window === 'undefined') return fallback;

    try {
        const saved = window.localStorage.getItem('site_lang');
        if (saved === 'en' || saved === 'tr') return saved;
    } catch {
        if (languageWithoutStorage) return languageWithoutStorage;
    }

    const browserLanguage = navigator.language || navigator.userLanguage || '';
    return browserLanguage.startsWith('tr') ? 'tr' : fallback;
}

function subscribeToLanguage(onChange) {
    window.addEventListener('storage', onChange);
    window.addEventListener('portfolio-language-change', onChange);
    return () => {
        window.removeEventListener('storage', onChange);
        window.removeEventListener('portfolio-language-change', onChange);
    };
}

export const LanguageProvider = ({ children, initialLanguage = 'en' }) => {
    const lang = useSyncExternalStore(
        subscribeToLanguage,
        () => getPreferredLanguage(initialLanguage),
        () => initialLanguage,
    );

    const setLang = (nextValue) => {
        const current = getPreferredLanguage(initialLanguage);
        const next = typeof nextValue === 'function' ? nextValue(current) : nextValue;
        if (next !== 'en' && next !== 'tr') return;

        try {
            window.localStorage.setItem('site_lang', next);
            languageWithoutStorage = null;
        } catch {
            languageWithoutStorage = next;
        }
        document.documentElement.lang = next;
        window.dispatchEvent(new Event('portfolio-language-change'));
    };

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    const toggleLang = () => {
        setLang(prev => prev === 'en' ? 'tr' : 'en');
    };

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
        <LanguageContext.Provider value={{ lang, toggleLang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);
