const SLUG_PATTERN = /[^a-z0-9]+/g;

export function projectSlug(project) {
    const source = project?.docId ?? project?.id ?? project?.translationKey ?? project?.title ?? '';
    const slug = String(source)
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(SLUG_PATTERN, '-')
        .replace(/^-+|-+$/g, '');

    if (!slug) {
        throw new Error('A published project needs a stable project ID or Firestore document ID to create its URL.');
    }

    return slug;
}

export function projectPath(project) {
    return `/projects/${projectSlug(project)}`;
}
