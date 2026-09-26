import path from 'node:path';
import { projectPath, projectSlug } from '../src/utils/projectSlug.js';
import { localizedPath, unlocalizedPath } from '../src/utils/localePath.js';

const STATIC_PATHS = ['/', '/projects', '/contact'];

export function filterPublicProjects(projects) {
    return (Array.isArray(projects) ? projects : [])
        .filter((project) => project?.published === true && project?.archived === false);
}

export function buildProjectRouteManifest(projects, distDirectory, siteUrl, lang = 'en') {
    const slugs = new Set();

    return filterPublicProjects(projects).map((project) => {
        const slug = projectSlug(project);
        if (slugs.has(slug)) throw new Error(`Published project URL collision for slug "${slug}".`);
        slugs.add(slug);
        const route = localizedPath(projectPath(project), lang);

        return {
            project,
            slug,
            path: route,
            file: path.join(distDirectory, ...(lang === 'tr' ? ['tr'] : []), 'projects', `${slug}.html`),
            canonical: `${siteUrl}${route}`,
        };
    });
}

export function buildPageData(page, commonData, projects) {
    return {
        ...commonData,
        ...(page.type === 'projects' ? { projects } : {}),
        ...(page.type === 'project' ? { project: page.project } : {}),
    };
}

export function makeNotFoundPage(distDirectory, title, description) {
    return {
        type: 'not-found',
        path: '/__portfolio_not_found__',
        file: path.join(distDirectory, '404.html'),
        title,
        description,
        noIndex: true,
    };
}

export function serializePrerenderData(data, isNotFound = false) {
    const json = safeJson(data);
    const statusAttribute = isNotFound ? ' data-static-status="404"' : '';
    return `<script id="portfolio-prerender-data"${statusAttribute} type="application/json">${json}</script>`;
}

export function safeJson(value) {
    return JSON.stringify(value)
        .replace(/</g, '\\u003c')
        .replace(/>/g, '\\u003e')
        .replace(/&/g, '\\u0026')
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');
}

function updatedDate(project) {
    const date = project.updatedAt instanceof Date
        ? project.updatedAt
        : project.updatedAt?.seconds
            ? new Date(project.updatedAt.seconds * 1000)
            : null;
    return date && Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : null;
}

function escapeXml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export function buildSitemap(projects, siteUrl) {
    const projectPaths = buildProjectRouteManifest(projects ?? [], '', siteUrl)
        .map(({ path: projectRoute, project }) => ({ path: projectRoute, lastmod: updatedDate(project) }));
    const urls = [
        ...STATIC_PATHS.map((route) => ({ path: route, lastmod: null })),
        ...projectPaths,
    ];
    const entries = urls.flatMap(({ path: route, lastmod }) => ['en', 'tr'].map((lang) => {
        const path = localizedPath(route, lang);
        const url = `${siteUrl}${path}`;
        const alternatives = ['en', 'tr'].map((otherLang) =>
            `<xhtml:link rel="alternate" hreflang="${otherLang}" href="${escapeXml(`${siteUrl}${localizedPath(unlocalizedPath(route), otherLang)}`)}"/>`,
        );
        alternatives.push(`<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${siteUrl}${route}`)}"/>`);
        return `  <url><loc>${escapeXml(url)}</loc>${alternatives.join('')}${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;
    }));
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;
}
