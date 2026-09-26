export function localeFromPath(pathname) {
    return pathname === '/tr' || pathname.startsWith('/tr/') ? 'tr' : 'en';
}

export function unlocalizedPath(pathname) {
    if (localeFromPath(pathname) === 'en') return pathname;
    return pathname.slice(3) || '/';
}

export function localizedPath(pathname, lang) {
    const path = unlocalizedPath(pathname);
    if (lang !== 'tr') return path;
    return path === '/' ? '/tr' : `/tr${path}`;
}
