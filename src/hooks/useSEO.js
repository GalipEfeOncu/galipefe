import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Reusable SEO hook to dynamically manage page-level metadata.
 * Uses vanilla DOM manipulation to remain dependency-free.
 * 
 * @param {Object} params
 * @param {string} params.titleKey - Translation key for document title
 * @param {string} params.descriptionKey - Translation key for meta description
 * @param {string} [params.ogImage] - Optional absolute URL for sharing image
 */
export default function useSEO({ titleKey, descriptionKey, ogImage }) {
    const { t, lang } = useLanguage();

    useEffect(() => {
        // 1. Update document title
        const pageTitle = titleKey ? `${t(titleKey)} | Galip Efe Öncü` : 'Galip Efe Öncü | Portfolio';
        document.title = pageTitle;

        // 2. Resolve description text
        const pageDesc = descriptionKey ? t(descriptionKey) : t('hero.desc');

        // Helper to update or create meta tags
        const updateMeta = (selector, queryAttr, attrValue, content) => {
            let el = document.querySelector(selector);
            if (!el) {
                // Create if it doesn't exist to prevent errors
                el = document.createElement('meta');
                el.setAttribute(queryAttr, attrValue);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        // 3. Update Meta Description
        updateMeta('meta[name="description"]', 'name', 'description', pageDesc);

        // 4. Update Open Graph tags
        updateMeta('meta[property="og:title"]', 'property', 'og:title', pageTitle);
        updateMeta('meta[property="og:description"]', 'property', 'og:description', pageDesc);
        updateMeta('meta[property="og:url"]', 'property', 'og:url', window.location.href);

        const absoluteImage = ogImage || 'https://galipefe.vercel.app/assets/images/pp.webp';
        updateMeta('meta[property="og:image"]', 'property', 'og:image', absoluteImage);

        // 5. Update Twitter Card tags
        updateMeta('meta[property="twitter:title"]', 'property', 'twitter:title', pageTitle);
        updateMeta('meta[property="twitter:description"]', 'property', 'twitter:description', pageDesc);
        updateMeta('meta[property="twitter:url"]', 'property', 'twitter:url', window.location.href);
        updateMeta('meta[property="twitter:image"]', 'property', 'twitter:image', absoluteImage);
    }, [t, lang, titleKey, descriptionKey, ogImage]);
}
