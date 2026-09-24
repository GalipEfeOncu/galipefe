function stringList(value) {
    if (!Array.isArray(value)) return [];
    return value
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean);
}

export function normalizeProjectArrays(project) {
    const data = project && typeof project === 'object' && !Array.isArray(project) ? project : {};
    return {
        ...data,
        tags: [...new Set(stringList(data.tags))],
        learnings: stringList(data.learnings),
        learningsTr: stringList(data.learningsTr),
        learningsEn: stringList(data.learningsEn),
    };
}
