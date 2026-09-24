import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const vercel = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
const indexHtml = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('Vercel serves a report-only CSP with the application network sources and report endpoint', () => {
    const headers = vercel.headers.find(({ source }) => source === '/(.*)').headers;
    const reportOnly = headers.find(({ key }) => key === 'Content-Security-Policy-Report-Only');

    assert.ok(reportOnly);
    assert.match(reportOnly.value, /default-src 'self'/);
    assert.match(reportOnly.value, /https:\/\/fonts\.googleapis\.com/);
    assert.match(reportOnly.value, /https:\/\/firestore\.googleapis\.com/);
    assert.match(reportOnly.value, /https:\/\/vitals\.vercel-insights\.com/);
    assert.match(reportOnly.value, /report-uri \/api\/csp-report/);
    assert.equal(headers.some(({ key }) => key === 'Content-Security-Policy'), false);
});

test('HTML loads the theme script from the same origin and has no inline event handlers', () => {
    assert.match(indexHtml, /<script src="\/theme\.js"><\/script>/);
    assert.doesNotMatch(indexHtml, /\son[a-z]+="/i);
});
