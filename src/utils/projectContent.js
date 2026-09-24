function getLocalizedField(project, lang, field) {
    const localizedField = lang === 'tr' ? `${field}Tr` : `${field}En`;
    const otherLocalizedField = lang === 'tr' ? `${field}En` : `${field}Tr`;
    return project[localizedField] ?? project[field] ?? project[otherLocalizedField];
}

export function getProjectContent(project, lang) {
    const fallbackLearnings = getLocalizedField(project, lang, 'learnings');

    return {
        subtitle: getLocalizedField(project, lang, 'subtitle') ?? '',
        description: getLocalizedField(project, lang, 'description') ?? '',
        role: getLocalizedField(project, lang, 'role') ?? '',
        outcome: getLocalizedField(project, lang, 'outcome') ?? '',
        learnings: Array.isArray(fallbackLearnings)
            ? fallbackLearnings.filter((item) => typeof item === 'string')
            : [],
    };
}
