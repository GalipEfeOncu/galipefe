import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const SITE_URL = 'https://galipefeoncu.com';
const DEFAULT_IMAGE = `${SITE_URL}/assets/images/pp.webp`;

/**
 * Reusable SEO hook to dynamically manage page-level metadata.
 * Uses vanilla DOM manipulation to remain dependency-free.
 * 
 * @param {Object} params
 * @param {string} [params.titleKey] - Translation key for document title
 * @param {string} [params.fullTitleKey] - Translation key for a complete title without the site-name suffix
 * @param {string} params.descriptionKey - Translation key for meta description
 * @param {string} [params.ogImage] - Optional absolute URL for sharing image
 * @param {boolean} [params.noIndex] - Prevent indexing for utility/error routes
 */
export default function useSEO({ titleKey, fullTitleKey, descriptionKey, ogImage, noIndex = false }) {
    const { t, lang } = useLanguage();

    useEffect(() => {
        // 1. Update document title
        const pageTitle = fullTitleKey
            ? t(fullTitleKey)
            : titleKey
                ? `${t(titleKey)} | Galip Efe Öncü`
                : 'Galip Efe Öncü | Portfolio';
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

        const updateLink = (selector, rel, href) => {
            let el = document.querySelector(selector);
            if (!el) {
                el = document.createElement('link');
                el.setAttribute('rel', rel);
                document.head.appendChild(el);
            }
            el.setAttribute('href', href);
        };

        const normalizedPath = window.location.pathname === '/'
            ? '/'
            : window.location.pathname.replace(/\/+$/, '');
        const canonicalUrl = `${SITE_URL}${normalizedPath}`;

        // 3. Update Meta Description
        updateMeta('meta[name="description"]', 'name', 'description', pageDesc);
        updateMeta('meta[name="robots"]', 'name', 'robots', noIndex ? 'noindex, follow' : 'index, follow');
        updateLink('link[rel="canonical"]', 'canonical', canonicalUrl);

        // 4. Update Open Graph tags
        updateMeta('meta[property="og:title"]', 'property', 'og:title', pageTitle);
        updateMeta('meta[property="og:description"]', 'property', 'og:description', pageDesc);
        updateMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
        updateMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'Galip Efe Öncü');
        updateMeta('meta[property="og:locale"]', 'property', 'og:locale', lang === 'tr' ? 'tr_TR' : 'en_US');

        const absoluteImage = ogImage || DEFAULT_IMAGE;
        updateMeta('meta[property="og:image"]', 'property', 'og:image', absoluteImage);
        updateMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', 'Galip Efe Öncü');

        // 5. Update Twitter Card tags
        updateMeta('meta[property="twitter:title"]', 'property', 'twitter:title', pageTitle);
        updateMeta('meta[property="twitter:description"]', 'property', 'twitter:description', pageDesc);
        updateMeta('meta[property="twitter:url"]', 'property', 'twitter:url', canonicalUrl);
        updateMeta('meta[property="twitter:image"]', 'property', 'twitter:image', absoluteImage);
        updateMeta('meta[property="twitter:image:alt"]', 'property', 'twitter:image:alt', 'Galip Efe Öncü');
    }, [t, lang, titleKey, fullTitleKey, descriptionKey, ogImage, noIndex]);
}
