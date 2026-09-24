import path from 'node:path';
import { projectPath, projectSlug } from '../src/utils/projectSlug.js';

const STATIC_PATHS = ['/', '/projects', '/contact'];

export function filterPublicProjects(projects) {
    return (Array.isArray(projects) ? projects : [])
        .filter((project) => project?.published === true && project?.archived === false);
}

export function buildProjectRouteManifest(projects, distDirectory, siteUrl) {
    const slugs = new Set();

    return filterPublicProjects(projects).map((project) => {
        const slug = projectSlug(project);
        if (slugs.has(slug)) throw new Error(`Published project URL collision for slug "${slug}".`);
        slugs.add(slug);
        const route = projectPath(project);

        return {
            project,
            slug,
            path: route,
            file: path.join(distDirectory, 'projects', `${slug}.html`),
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
    const entries = urls.map(({ path: route, lastmod }) => {
        const url = `${siteUrl}${route === '/' ? '/' : route}`;
        return `  <url><loc>${escapeXml(url)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;
    });
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
}
