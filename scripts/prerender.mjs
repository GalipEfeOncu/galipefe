import { PassThrough } from 'node:stream';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { createServer, loadEnv } from 'vite';
import {
    buildPageData,
    buildProjectRouteManifest,
    buildSitemap,
    filterPublicProjects,
    makeNotFoundPage,
    safeJson,
    serializePrerenderData,
} from './prerender-manifest.mjs';
import { projectPath } from '../src/utils/projectSlug.js';
import { normalizeProjectArrays } from '../src/utils/projectData.js';
import { localizedPath } from '../src/utils/localePath.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SITE_URL = 'https://www.galipefeoncu.com';
const PROJECT_FIELDS = [
    'id', 'translationKey', 'published', 'archived', 'category', 'title', 'status', 'subtitle', 'subtitleEn', 'subtitleTr',
    'description', 'descriptionEn', 'descriptionTr', 'role', 'roleEn', 'roleTr', 'outcome',
    'outcomeEn', 'outcomeTr', 'learnings', 'learningsEn', 'learningsTr', 'tags', 'image', 'icon',
    'link', 'demoLink', 'order', 'updatedAt',
];

function decodeFirestoreValue(value) {
    if ('nullValue' in value) return null;
    if ('booleanValue' in value) return value.booleanValue;
    if ('integerValue' in value) return Number(value.integerValue);
    if ('doubleValue' in value) return value.doubleValue;
    if ('stringValue' in value) return value.stringValue;
    if ('timestampValue' in value) return new Date(value.timestampValue);
    if ('referenceValue' in value) return value.referenceValue;
    if ('bytesValue' in value) return value.bytesValue;
    if ('geoPointValue' in value) return value.geoPointValue;
    if ('arrayValue' in value) return (value.arrayValue.values ?? []).map(decodeFirestoreValue);
    if ('mapValue' in value) {
        return Object.fromEntries(Object.entries(value.mapValue.fields ?? {}).map(([key, entry]) => [key, decodeFirestoreValue(entry)]));
    }
    return undefined;
}

function projectFromDocument(document) {
    const fields = Object.fromEntries(
        Object.entries(document.fields ?? {}).map(([key, value]) => [key, decodeFirestoreValue(value)]),
    );
    const project = Object.fromEntries(
        PROJECT_FIELDS.filter((key) => fields[key] !== undefined).map((key) => [key, fields[key]]),
    );
    return normalizeProjectArrays({ ...project, docId: document.name.split('/').at(-1) });
}

async function fetchPublicProjects() {
    const env = loadEnv('production', ROOT, 'VITE_');
    const {
        VITE_FIREBASE_API_KEY: apiKey,
        VITE_FIREBASE_AUTH_DOMAIN: authDomain,
        VITE_FIREBASE_PROJECT_ID: projectId,
        VITE_FIREBASE_APP_ID: appId,
    } = env;

    if (!apiKey || !authDomain || !projectId || !appId) {
        if (process.env.VERCEL) {
            throw new Error('Static project pages require VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, and VITE_FIREBASE_APP_ID in the Vercel build environment.');
        }
        console.warn('[prerender] Firebase build variables are missing; only the public profile routes will be generated.');
        return null;
    }

    const endpoint = new URL(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`);
    endpoint.searchParams.set('key', apiKey);
    const structuredQuery = {
        from: [{ collectionId: 'projects' }],
        where: {
            compositeFilter: {
                op: 'AND',
                filters: [
                    { fieldFilter: { field: { fieldPath: 'published' }, op: 'EQUAL', value: { booleanValue: true } } },
                    { fieldFilter: { field: { fieldPath: 'archived' }, op: 'EQUAL', value: { booleanValue: false } } },
                ],
            },
        },
        orderBy: [{ field: { fieldPath: 'order' }, direction: 'ASCENDING' }],
        limit: 1000,
    };

    try {
        let rows;
        for (let attempt = 0; attempt < 2; attempt += 1) {
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Referer: `${SITE_URL}/`,
                    },
                    body: JSON.stringify({ structuredQuery }),
                    signal: AbortSignal.timeout(12000),
                });

                if (!response.ok) throw new Error(`Firestore returned HTTP ${response.status}.`);
                rows = await response.json();
                break;
            } catch (error) {
                const retryable = error instanceof TypeError
                    || error.name === 'TimeoutError'
                    || ['ETIMEDOUT', 'ECONNRESET', 'EAI_AGAIN'].includes(error.cause?.code);
                if (attempt > 0 || !retryable) throw error;
                console.warn('[prerender] Firestore request timed out or lost its connection; retrying once.');
                await new Promise((resolve) => setTimeout(resolve, 750));
            }
        }

        const projects = rows.filter((row) => row.document).map((row) => projectFromDocument(row.document));
        return filterPublicProjects(projects);
    } catch (error) {
        const reason = error.cause?.code ?? error.name ?? 'unknown error';
        if (process.env.VERCEL) {
            throw new Error(`Could not read the canonical public Firestore catalogue during the Vercel build (${reason}).`);
        }
        console.warn(`[prerender] Firestore catalogue is unavailable in this environment (${reason}); project pages will be omitted from this local build.`);
        return null;
    }
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function truncateDescription(value, maxLength = 160) {
    const clean = String(value ?? '').replace(/\s+/g, ' ').trim();
    if (clean.length <= maxLength) return clean;
    const prefix = clean.slice(0, maxLength - 1);
    const wordEnd = prefix.lastIndexOf(' ');
    return `${prefix.slice(0, wordEnd > 90 ? wordEnd : prefix.length).trimEnd()}…`;
}

function calculateAge(date = new Date()) {
    const birth = new Date(2006, 8, 2);
    let age = date.getFullYear() - birth.getFullYear();
    const month = date.getMonth() - birth.getMonth();
    if (month < 0 || (month === 0 && date.getDate() < birth.getDate())) age -= 1;
    return age;
}

function updateMeta(html, attr, key, content) {
    let found = false;
    const keyPattern = new RegExp(`\\b${attr}="${key}"`, 'i');
    const updated = html.replace(/<meta\b[^>]*>/gi, (tag) => {
        if (!keyPattern.test(tag)) return tag;
        found = true;
        const value = escapeHtml(content);
        return /\bcontent="[^"]*"/i.test(tag)
            ? tag.replace(/\bcontent="[^"]*"/i, `content="${value}"`)
            : tag.replace(/\s*\/?\s*>$/, ` content="${value}">`);
    });
    if (!found) throw new Error(`Could not find meta tag ${attr}="${key}" in index.html.`);
    return updated;
}

function updateCanonical(html, canonicalUrl) {
    let found = false;
    const updated = html.replace(/<link\b[^>]*>/gi, (tag) => {
        if (!/\brel="canonical"/i.test(tag)) return tag;
        found = true;
        return tag.replace(/\bhref="[^"]*"/i, `href="${escapeHtml(canonicalUrl)}"`);
    });
    if (!found) throw new Error('Could not find the canonical link in index.html.');
    return updated;
}

function makeWebPageEntity(page, websiteId, personId) {
    const webpage = {
        '@type': page.type === 'contact' ? 'ContactPage' : page.type === 'projects' ? 'CollectionPage' : 'WebPage',
        '@id': `${page.url}#webpage`,
        url: page.url,
        name: page.title,
        description: page.description,
        inLanguage: page.lang,
        isPartOf: { '@id': websiteId },
        about: { '@id': personId },
    };

    if (page.type === 'projects') {
        webpage.mainEntity = {
            '@type': 'ItemList',
            itemListElement: (page.projects ?? []).map((project, index) => {
                const url = `${SITE_URL}${localizedPath(projectPath(project), page.lang)}`;
                return {
                    '@type': 'ListItem',
                    position: index + 1,
                    item: { '@type': 'CreativeWork', '@id': url, name: project.title, url },
                };
            }),
        };
    }

    if (page.type === 'project') {
        const project = page.project;
        webpage.mainEntity = { '@id': `${page.url}#project` };
        return [webpage, {
            '@type': 'CreativeWork',
            '@id': `${page.url}#project`,
            name: project.title,
            description: page.description,
            url: page.url,
            author: { '@id': personId },
            isPartOf: { '@id': websiteId },
        }];
    }

    return [webpage];
}

function updateStructuredData(html, page, baseGraph) {
    const match = html.match(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/i);
    if (!match) throw new Error('Could not find JSON-LD in index.html.');
    if (page.type === 'not-found') return html.replace(match[0], '');

    const website = baseGraph['@graph'].find((entry) => entry['@type'] === 'WebSite');
    const person = baseGraph['@graph'].find((entry) => entry['@type'] === 'Person');
    const websiteId = website['@id'];
    const personId = person['@id'];
    const graph = page.type === 'home'
        ? [website, person, {
            ...baseGraph['@graph'].find((entry) => entry['@type'] === 'ProfilePage'),
            '@id': `${page.canonical}#profile-page`,
            url: page.canonical,
            name: page.title,
            inLanguage: page.lang,
        }]
        : [website, person, ...makeWebPageEntity({ ...page, url: page.canonical }, websiteId, personId)];
    const script = `<script type="application/ld+json">\n${safeJson({ '@context': 'https://schema.org', '@graph': graph })}\n    </script>`;
    return html.replace(match[0], script);
}

function prepareDocument(template, markup, page, bootstrapData, baseGraph) {
    let html = template;
    html = html.replace(/<html lang="[^"]*">/i, `<html lang="${page.lang}">`);
    html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
    html = updateMeta(html, 'name', 'description', page.description);
    html = updateMeta(html, 'name', 'robots', page.noIndex ? 'noindex, follow' : 'index, follow');
    html = updateMeta(html, 'property', 'og:title', page.title);
    html = updateMeta(html, 'property', 'og:description', page.description);
    html = updateMeta(html, 'property', 'og:site_name', 'Galip Efe Öncü');
    html = updateMeta(html, 'property', 'og:locale', page.lang === 'tr' ? 'tr_TR' : 'en_US');
    html = updateMeta(html, 'property', 'og:image', page.image ?? `${SITE_URL}/assets/images/pp.webp`);
    html = updateMeta(html, 'property', 'og:image:alt', page.imageAlt ?? 'Galip Efe Öncü');
    html = updateMeta(html, 'name', 'twitter:card', 'summary_large_image');
    html = updateMeta(html, 'name', 'twitter:title', page.title);
    html = updateMeta(html, 'name', 'twitter:description', page.description);
    html = updateMeta(html, 'name', 'twitter:image', page.image ?? `${SITE_URL}/assets/images/pp.webp`);
    html = updateMeta(html, 'name', 'twitter:image:alt', page.imageAlt ?? 'Galip Efe Öncü');

    if (page.canonical) {
        html = updateCanonical(html, page.canonical);
        html = updateMeta(html, 'property', 'og:url', page.canonical);
        html = updateMeta(html, 'name', 'twitter:url', page.canonical);
        const basePath = page.path === '/tr' ? '/' : page.path.replace(/^\/tr\//, '/');
        const alternatives = ['en', 'tr'].map((lang) =>
            `  <link rel="alternate" hreflang="${lang}" href="${escapeHtml(`${SITE_URL}${localizedPath(basePath, lang)}`)}" />`,
        );
        alternatives.push(`  <link rel="alternate" hreflang="x-default" href="${escapeHtml(`${SITE_URL}${basePath}`)}" />`);
        html = html.replace('</head>', `${alternatives.join('\n')}\n  </head>`);
    } else {
        html = html.replace(/<link\b(?=[^>]*\brel="canonical")[^>]*>\s*/i, '');
        html = updateMeta(html, 'property', 'og:url', SITE_URL);
        html = updateMeta(html, 'name', 'twitter:url', SITE_URL);
    }

    html = updateStructuredData(html, page, baseGraph);

    const payload = serializePrerenderData(bootstrapData, page.type === 'not-found');
    html = html.replace('</head>', `  ${payload}\n  </head>`);
    const rootPattern = /<div id="root"><\/div>/;
    if (!rootPattern.test(html)) throw new Error('Could not find the empty #root element in built index.html.');
    return html.replace(rootPattern, `<div id="root">${markup}</div>`);
}

function prepareUtilityShell(template, page, baseGraph) {
    let html = template.replace(/<html lang="[^"]*">/i, `<html lang="${page.lang}">`)
        .replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
    html = updateMeta(html, 'name', 'description', page.description);
    html = updateMeta(html, 'name', 'robots', page.robots);
    html = updateMeta(html, 'property', 'og:locale', page.lang === 'tr' ? 'tr_TR' : 'en_US');
    html = updateMeta(html, 'property', 'og:title', page.title);
    html = updateMeta(html, 'property', 'og:description', page.description);
    html = updateMeta(html, 'name', 'twitter:title', page.title);
    html = updateMeta(html, 'name', 'twitter:description', page.description);
    html = updateMeta(html, 'property', 'og:url', SITE_URL);
    html = updateMeta(html, 'name', 'twitter:url', SITE_URL);
    html = html.replace(/<link\b(?=[^>]*\brel="canonical")[^>]*>\s*/i, '');
    return updateStructuredData(html, { type: 'not-found' }, baseGraph);
}

async function renderMarkup(App, LanguageProvider, location, prerenderData) {
    const app = React.createElement(
        React.StrictMode,
        null,
        React.createElement(
            StaticRouter,
            { location, basename: prerenderData.lang === 'tr' ? '/tr' : '/' },
            React.createElement(
                LanguageProvider,
                { initialLanguage: prerenderData.lang },
                React.createElement(App, { prerenderData }),
            ),
        ),
    );

    return new Promise((resolve, reject) => {
        const chunks = [];
        const output = new PassThrough();
        let renderError;
        const timeout = setTimeout(() => {
            renderer.abort();
            reject(new Error(`Static rendering timed out for ${location}.`));
        }, 30000);

        output.on('data', (chunk) => chunks.push(chunk));
        output.on('error', (error) => {
            clearTimeout(timeout);
            reject(error);
        });
        output.on('end', () => {
            clearTimeout(timeout);
            if (renderError) reject(renderError);
            else resolve(Buffer.concat(chunks).toString('utf8'));
        });

        const renderer = renderToPipeableStream(app, {
            onAllReady() {
                renderer.pipe(output);
            },
            onShellError(error) {
                clearTimeout(timeout);
                reject(error);
            },
            onError(error) {
                renderError ??= error;
            },
        });
    });
}

async function main() {
    const projects = await fetchPublicProjects();
    const vite = await createServer({
        mode: 'production',
        logLevel: 'error',
        server: { middlewareMode: true },
        appType: 'custom',
    });

    try {
        const [{ default: App }, { LanguageProvider }, { translations }, { getProjectContent }] = await Promise.all([
            vite.ssrLoadModule('/src/App.jsx'),
            vite.ssrLoadModule('/src/context/LanguageContext.jsx'),
            vite.ssrLoadModule('/src/data/translations.js'),
            vite.ssrLoadModule('/src/utils/projectContent.js'),
        ]);
        const template = await readFile(path.join(DIST, 'index.html'), 'utf8');
        const jsonLdMatch = template.match(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
        if (!jsonLdMatch) throw new Error('The base page is missing its identity JSON-LD.');
        const baseGraph = JSON.parse(jsonLdMatch[1]);
        const now = new Date();
        const pages = [];
        for (const lang of ['en', 'tr']) {
            const copy = translations[lang];
            const staticRoutes = [
                { type: 'home', path: '/', file: lang === 'tr' ? path.join(DIST, 'tr.html') : path.join(DIST, 'index.html'), title: copy.seo.aboutTitle, description: copy.seo.aboutDesc },
                { type: 'projects', path: '/projects', file: path.join(DIST, ...(lang === 'tr' ? ['tr'] : []), 'projects.html'), title: `${copy.projects.title} | Galip Efe Öncü`, description: copy.seo.projectsDesc, projects },
                { type: 'contact', path: '/contact', file: path.join(DIST, ...(lang === 'tr' ? ['tr'] : []), 'contact.html'), title: `${copy.contact.title} | Galip Efe Öncü`, description: copy.seo.contactDesc },
            ];
            pages.push(...staticRoutes.map((page) => ({
                ...page, lang, path: localizedPath(page.path, lang), canonical: `${SITE_URL}${localizedPath(page.path, lang)}`,
            })));

            if (projects !== null) {
                for (const route of buildProjectRouteManifest(projects, DIST, SITE_URL, lang)) {
                    const { project } = route;
                    const content = getProjectContent(project, lang);
                    const description = truncateDescription([content.subtitle, content.description].filter(Boolean).join(' '));
                    const image = typeof project.image === 'string' && /^https:\/\//i.test(project.image)
                        ? project.image
                        : undefined;
                    pages.push({
                        ...route, lang, type: 'project', title: `${project.title} | Galip Efe Öncü`, description,
                        image, imageAlt: project.title,
                    });
                }
            }
        }

        for (const page of pages) {
            const commonData = { lang: page.lang, year: now.getFullYear(), age: calculateAge(now) };
            const pageData = buildPageData(page, commonData, projects);
            const markup = await renderMarkup(App, LanguageProvider, page.path, pageData);
            const html = prepareDocument(template, markup, page, pageData, baseGraph);
            await mkdir(path.dirname(page.file), { recursive: true });
            await writeFile(page.file, html);
        }

        const copy = translations.en;
        const commonData = { lang: 'en', year: now.getFullYear(), age: calculateAge(now) };
        const notFoundPage = { ...makeNotFoundPage(DIST, copy.seo.notFoundTitle, copy.seo.notFoundDesc), lang: 'en' };
        const notFoundMarkup = await renderMarkup(App, LanguageProvider, notFoundPage.path, commonData);
        await writeFile(notFoundPage.file, prepareDocument(template, notFoundMarkup, notFoundPage, commonData, baseGraph));
        for (const lang of ['en', 'tr']) {
            const utilityCopy = translations[lang];
            const utilityDirectory = path.join(DIST, ...(lang === 'tr' ? ['tr'] : []));
            await writeFile(path.join(utilityDirectory, 'admin.html'), prepareUtilityShell(template, {
                lang, title: 'Admin | Galip Efe Öncü', description: 'Private portfolio administration route.', robots: 'noindex, nofollow',
            }, baseGraph));
            await writeFile(path.join(utilityDirectory, 'typing-test.html'), prepareUtilityShell(template, {
                lang, title: `${utilityCopy.typingGame.pageTitle} | Galip Efe Öncü`, description: utilityCopy.seo.typingTestDesc, robots: 'noindex, follow',
            }, baseGraph));
        }
        await writeFile(path.join(DIST, 'sitemap.xml'), buildSitemap(projects, SITE_URL));

        console.log(`[prerender] Generated ${pages.length} public HTML routes${projects === null ? ' (Firestore catalogue unavailable locally)' : ` from ${projects.length} public projects`}.`);
    } finally {
        await vite.close();
    }
}

main().catch((error) => {
    console.error(`[prerender] ${error.message}`);
    process.exitCode = 1;
});
