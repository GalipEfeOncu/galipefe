function positiveSafeInteger(value) {
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export function collectProjectIdentities(projects = []) {
    return {
        usedIds: [...new Set(projects.map((project) => positiveSafeInteger(project.id)).filter(Boolean))],
        usedTranslationKeys: [...new Set(projects
            .map((project) => project.translationKey)
            .filter((key) => typeof key === 'string' && key.trim()))],
    };
}

export function nextAvailableId(projects = []) {
    const usedIds = new Set(collectProjectIdentities(projects).usedIds);
    let id = 1;
    while (usedIds.has(id)) id += 1;
    return id;
}

export function mergeProjectIdentities(identity, projects = []) {
    const fromProjects = collectProjectIdentities(projects);
    return {
        usedIds: [...new Set([
            ...(Array.isArray(identity?.usedIds) ? identity.usedIds.map(positiveSafeInteger).filter(Boolean) : []),
            ...fromProjects.usedIds,
        ])],
        usedTranslationKeys: [...new Set([
            ...(Array.isArray(identity?.usedTranslationKeys)
                ? identity.usedTranslationKeys.filter((key) => typeof key === 'string' && key.trim())
                : []),
            ...fromProjects.usedTranslationKeys,
        ])],
    };
}

export function nextAvailableIdFrom(usedIds = []) {
    const used = new Set(usedIds.map(positiveSafeInteger).filter(Boolean));
    let id = 1;
    while (used.has(id)) id += 1;
    return id;
}
