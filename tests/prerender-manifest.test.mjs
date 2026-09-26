import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {
    buildPageData,
    buildProjectRouteManifest,
    buildSitemap,
    filterPublicProjects,
    makeNotFoundPage,
    serializePrerenderData,
} from '../scripts/prerender-manifest.mjs';
import { localeFromPath, localizedPath, unlocalizedPath } from '../src/utils/localePath.js';

const siteUrl = 'https://www.galipefeoncu.com';
const projects = [
    {
        docId: 'project-one',
        id: 1,
        title: 'Project One',
        published: true,
        archived: false,
        updatedAt: new Date('2026-09-24T10:00:00.000Z'),
    },
    { docId: 'draft-project', id: 2, title: 'Draft', published: false, archived: false },
    { docId: 'archived-project', id: 3, title: 'Archived', published: true, archived: true },
];

test('only published, unarchived projects enter the static route manifest', () => {
    assert.deepEqual(filterPublicProjects(projects), [projects[0]]);

    const routes = buildProjectRouteManifest(projects, '/repo/dist', siteUrl);
    assert.equal(routes.length, 1);
    assert.equal(routes[0].path, '/projects/project-one');
    assert.equal(routes[0].file, path.join('/repo/dist', 'projects', 'project-one.html'));
    assert.equal(routes[0].canonical, `${siteUrl}/projects/project-one`);
    const turkishRoutes = buildProjectRouteManifest(projects, '/repo/dist', siteUrl, 'tr');
    assert.equal(turkishRoutes[0].path, '/tr/projects/project-one');
    assert.equal(turkishRoutes[0].file, path.join('/repo/dist', 'tr', 'projects', 'project-one.html'));
    assert.equal(turkishRoutes[0].canonical, `${siteUrl}/tr/projects/project-one`);
});

test('locale URLs preserve the English public routes and map Turkish equivalents', () => {
    assert.equal(localizedPath('/', 'en'), '/');
    assert.equal(localizedPath('/', 'tr'), '/tr');
    assert.equal(localizedPath('/projects/project-one', 'tr'), '/tr/projects/project-one');
    assert.equal(localizedPath('/tr/projects/project-one', 'en'), '/projects/project-one');
    assert.equal(unlocalizedPath('/tr/contact'), '/contact');
    assert.equal(localeFromPath('/tr/contact'), 'tr');
    assert.equal(localeFromPath('/typing-test'), 'en');
});

test('slug collisions fail before static HTML files can overwrite one another', () => {
    assert.throws(
        () => buildProjectRouteManifest([
            { docId: 'project/one', published: true, archived: false },
            { docId: 'project-one', published: true, archived: false },
        ], '/repo/dist', siteUrl),
        /Published project URL collision/,
    );
});

test('sitemap contains only public route paths and escapes project timestamps', () => {
    const sitemap = buildSitemap(projects, siteUrl);

    assert.match(sitemap, new RegExp(`${siteUrl}/`));
    assert.match(sitemap, new RegExp(`${siteUrl}/projects`));
    assert.match(sitemap, new RegExp(`${siteUrl}/contact`));
    assert.match(sitemap, new RegExp(`${siteUrl}/projects/project-one`));
    assert.match(sitemap, new RegExp(`${siteUrl}/tr/projects/project-one`));
    assert.match(sitemap, /hreflang="en"/);
    assert.match(sitemap, /hreflang="tr"/);
    assert.match(sitemap, /hreflang="x-default"/);
    assert.match(sitemap, /<lastmod>2026-09-24<\/lastmod>/);
    assert.doesNotMatch(sitemap, /draft-project|archived-project/);
});

test('static list and detail pages hydrate from the same fixture catalog', () => {
    const publicCatalog = filterPublicProjects(projects);
    const listData = buildPageData({ type: 'projects' }, { lang: 'en' }, publicCatalog);
    const detailData = buildPageData({ type: 'project', project: publicCatalog[0] }, { lang: 'en' }, publicCatalog);

    assert.deepEqual(listData.projects, [projects[0]]);
    assert.equal(detailData.project.docId, listData.projects[0].docId);
    assert.equal(detailData.lang, listData.lang);
});

test('404 output keeps its route metadata, noindex flag, and static 404 marker', () => {
    const page = makeNotFoundPage('/repo/dist', 'Not found', 'Missing page');
    const htmlPayload = serializePrerenderData({ lang: 'en' }, page.type === 'not-found');

    assert.equal(page.file, path.join('/repo/dist', '404.html'));
    assert.equal(page.noIndex, true);
    assert.match(htmlPayload, /data-static-status="404"/);
    assert.match(htmlPayload, /type="application\/json"/);
});

test('prerender data escapes script-breaking project content before embedding', () => {
    const payload = serializePrerenderData({ title: '</script><script>alert(1)</script>' });
    const embeddedJson = payload.slice(payload.indexOf('>') + 1, payload.lastIndexOf('</script>'));

    assert.match(payload, /\\u003c\/script\\u003e/);
    assert.doesNotMatch(embeddedJson, /<\/script>/);
});
