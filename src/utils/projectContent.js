import { translations } from '../data/translations.js';

function getStaticTranslation(lang, translationKey, field) {
    if (!translationKey) return undefined;
    return translations[lang]?.projectData?.[translationKey]?.[field];
}

function getLocalizedField(project, lang, field) {
    const localizedField = lang === 'tr' ? `${field}Tr` : `${field}En`;
    const otherLocalizedField = lang === 'tr' ? `${field}En` : `${field}Tr`;
    return project[localizedField] ?? project[field] ?? project[otherLocalizedField];
}

export function getProjectContent(project, lang) {
    const translatedSubtitle = getStaticTranslation(lang, project.translationKey, 'subtitle');
    const translatedDescription = getStaticTranslation(lang, project.translationKey, 'desc');
    const translatedLearnings = getStaticTranslation(lang, project.translationKey, 'learnings');

    const fallbackLearnings = getLocalizedField(project, lang, 'learnings');

    return {
        subtitle: translatedSubtitle ?? getLocalizedField(project, lang, 'subtitle') ?? '',
        description: translatedDescription ?? getLocalizedField(project, lang, 'description') ?? '',
        learnings: Array.isArray(translatedLearnings)
            ? translatedLearnings
            : Array.isArray(fallbackLearnings)
                ? fallbackLearnings
                : [],
    };
}
