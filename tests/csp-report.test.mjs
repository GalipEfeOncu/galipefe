import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeCspReport, shouldLogCspReport } from '../api/csp-report.js';

test('CSP report sanitization removes URL query strings and keeps useful fields', () => {
    const sanitized = sanitizeCspReport({
        'csp-report': {
            'effective-directive': 'script-src-elem',
            'document-uri': 'https://www.galipefeoncu.com/projects/private-token?email=user@example.com',
            'blocked-uri': 'https://third-party.example/email/alice@example.com/script.js?token=secret',
            'source-file': 'https://www.galipefeoncu.com/assets/session-secret/app.js?session=secret',
            'line-number': 18,
        },
    });

    assert.deepEqual(sanitized, {
        directive: 'script-src-elem',
        document: 'https://www.galipefeoncu.com',
        blocked: 'https://third-party.example',
        source: 'https://www.galipefeoncu.com',
        line: 18,
    });
    assert.doesNotMatch(JSON.stringify(sanitized), /secret|user@example/);
});

test('CSP report sanitizer ignores malformed report payloads', () => {
    assert.equal(sanitizeCspReport(null), null);
    assert.equal(sanitizeCspReport({ 'csp-report': { 'blocked-uri': 'inline' } }), null);
    assert.equal(sanitizeCspReport({ 'effective-directive': 'script-src\nforged-log' }), null);
    assert.equal(sanitizeCspReport({ 'effective-directive': 'script-src', 'document-uri': 'not a URL' }).document, undefined);
});

test('CSP report logging deduplicates identical events in a warm function instance', () => {
    const report = { directive: 'script-src', document: 'https://www.galipefeoncu.com' };
    assert.equal(shouldLogCspReport(report), true);
    assert.equal(shouldLogCspReport(report), false);
});
