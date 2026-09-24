import { Buffer } from 'node:buffer';

const MAX_REPORT_BYTES = 8192;
const MAX_LOGGED_REPORTS_PER_INSTANCE = 25;
const loggedReportSignatures = new Set();

export const config = { api: { bodyParser: false } };

function safeLocation(value) {
    if (typeof value !== 'string' || !value) return undefined;
    if (['inline', 'eval', 'self'].includes(value)) return value;
    if (value.startsWith('data:')) return 'data:';
    if (value.startsWith('blob:')) return 'blob:';

    try {
        const url = new URL(value);
        if (!['http:', 'https:'].includes(url.protocol) || url.origin.length > 256) return undefined;
        return url.origin;
    } catch {
        return undefined;
    }
}

export function sanitizeCspReport(body) {
    const report = Array.isArray(body)
        ? body[0]?.body
        : body?.['csp-report'] ?? body?.body ?? body;
    if (!report || typeof report !== 'object') return null;

    const directive = report['effective-directive'] ?? report['violated-directive'] ?? report.effectiveDirective;
    if (typeof directive !== 'string' || !/^[a-z][a-z0-9-]{0,63}$/i.test(directive.trim())) return null;

    return {
        directive: directive.trim().toLowerCase(),
        document: safeLocation(report['document-uri'] ?? report.documentURL),
        blocked: safeLocation(report['blocked-uri'] ?? report.blockedURL),
        source: safeLocation(report['source-file'] ?? report.sourceFile),
        line: Number.isSafeInteger(report['line-number']) && report['line-number'] >= 0
            ? report['line-number']
            : undefined,
    };
}

export function shouldLogCspReport(report) {
    const signature = JSON.stringify(report);
    if (loggedReportSignatures.has(signature) || loggedReportSignatures.size >= MAX_LOGGED_REPORTS_PER_INSTANCE) return false;
    loggedReportSignatures.add(signature);
    return true;
}

async function readReport(request) {
    const chunks = [];
    let size = 0;

    for await (const chunk of request) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        size += buffer.length;
        if (size > MAX_REPORT_BYTES) return null;
        chunks.push(buffer);
    }

    try {
        return JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
        return null;
    }
}

export default async function handler(request, response) {
    response.setHeader('Cache-Control', 'no-store');

    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        return response.status(405).end();
    }

    const report = await readReport(request);
    const sanitized = sanitizeCspReport(report);
    if (sanitized && shouldLogCspReport(sanitized)) {
        console.warn('[csp-report]', JSON.stringify(sanitized));
    }
    return response.status(204).end();
}
