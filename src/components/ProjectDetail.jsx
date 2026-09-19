import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getProjectContent } from '../utils/projectContent';
import { projectPath, projectSlug } from '../utils/projectSlug';
import useSEO from '../hooks/useSEO';

function truncateDescription(value, maxLength = 160) {
    const clean = String(value ?? '').replace(/\s+/g, ' ').trim();
    if (clean.length <= maxLength) return clean;
    const prefix = clean.slice(0, maxLength - 1);
    const wordEnd = prefix.lastIndexOf(' ');
    return `${prefix.slice(0, wordEnd > 90 ? wordEnd : prefix.length).trimEnd()}…`;
}

function StatusBadge({ status }) {
    const { t } = useLanguage();
    const isCompleted = status === 'Completed';
    const isDiscontinued = status === 'Discontinued';
    const label = t(isCompleted
        ? 'projects.filters.completed'
        : isDiscontinued
            ? 'projects.filters.discontinued'
            : 'projects.filters.wip');

    return (
        <span className={`status ${isCompleted ? 'completed' : isDiscontinued ? 'disc' : 'wip'}`}>
            <span className="led" />
            {label}
        </span>
    );
}

function ProjectImage({ project }) {
    const { t } = useLanguage();
    const [failed, setFailed] = useState(false);

    if (project.image && !failed) {
        return (
            <img
                src={project.image}
                alt={project.title}
                className="project-detail-image"
                decoding="async"
                onError={() => setFailed(true)}
            />
        );
    }

    return (
        <div className="project-detail-image project-detail-image-fallback" role="img" aria-label={project.title}>
            [{t('modal.imageFallback').replace('{title}', project.title)}]
        </div>
    );
}

export default function ProjectDetail({ initialProject }) {
    const { slug } = useParams();
    const location = useLocation();
    const { lang, t } = useLanguage();
    const locationProject = location.state?.project;
    const routeProject = initialProject ?? locationProject ?? null;
    const [project, setProject] = useState(routeProject);
    const [loading, setLoading] = useState(!routeProject);

    useEffect(() => {
        if (routeProject) {
            setProject(routeProject);
            setLoading(false);
            return undefined;
        }

        let active = true;
        setLoading(true);
        import('../services/projectService').then(({ projectService }) => projectService.getProjects())
            .then((result) => {
                if (!active || !result.ok) return;
                const match = result.projects.find((item) => projectSlug(item) === slug) ?? null;
                setProject(match);
            })
            .catch(() => {
                if (active) setProject(null);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => { active = false; };
    }, [routeProject, slug]);

    const content = project ? getProjectContent(project, lang) : null;
    const canonicalPath = project ? projectPath(project) : `/projects/${slug}`;
    const pageTitle = project ? `${project.title} | Galip Efe Öncü` : t('projectDetail.notFoundTitle');
    const descriptionText = [content?.subtitle, content?.description].filter(Boolean).join(' ') || t('projectDetail.notFoundDescription');
    const pageDescription = truncateDescription(descriptionText);

    useSEO({
        title: pageTitle,
        description: pageDescription,
        canonicalPath,
        noIndex: !project,
    });

    if (!project) {
        return (
            <div className="page project-detail-page container">
                <Link to="/projects" className="project-detail-back">← {t('projectDetail.backToProjects')}</Link>
                <h1 className="page-title">{loading ? t('projectDetail.loading') : t('projectDetail.notFoundTitle')}</h1>
                {!loading && <p className="page-subtitle">{t('projectDetail.notFoundDescription')}</p>}
            </div>
        );
    }

    const statusLabel = project.status === 'Completed'
        ? t('projects.filters.completed')
        : project.status === 'Discontinued'
            ? t('projects.filters.discontinued')
            : t('projects.filters.wip');

    return (
        <article className="page project-detail-page container" aria-labelledby="project-detail-title">
            <Link to="/projects" className="project-detail-back">← {t('projectDetail.backToProjects')}</Link>

            <header className="project-detail-header">
                <div className="project-detail-heading-row">
                    <h1 className="page-title" id="project-detail-title">{project.title}</h1>
                    <StatusBadge status={project.status} />
                </div>
                {content.subtitle && <p className="page-subtitle">{content.subtitle}</p>}
            </header>

            <div className="project-detail-grid">
                <div className="project-detail-media-column">
                    <ProjectImage project={project} />
                    <div className="project-detail-actions">
                        {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn">
                                {t('modal.repo')} ↗
                            </a>
                        )}
                        {project.demoLink && (
                            <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="btn primary">
                                {t('modal.liveDemo')} ↗
                            </a>
                        )}
                    </div>
                    <dl className="project-detail-facts">
                        <div>
                            <dt>{t('modal.statusLabel')}</dt>
                            <dd>{statusLabel}</dd>
                        </div>
                        {project.category && (
                            <div>
                                <dt>{t('projects.categoryField')}</dt>
                                <dd>{t(`projects.category.${project.category}`)}</dd>
                            </div>
                        )}
                    </dl>
                </div>

                <div className="project-detail-copy">
                    {content.description && <p className="modal-desc project-detail-description">{content.description}</p>}

                    {(content.role || content.outcome) && (
                        <div className="project-case-summary project-detail-case-summary">
                            {content.role && (
                                <div>
                                    <span>{t('modal.role')}</span>
                                    <p>{content.role}</p>
                                </div>
                            )}
                            {content.outcome && (
                                <div>
                                    <span>{t('modal.outcome')}</span>
                                    <p>{content.outcome}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {Array.isArray(project.tags) && project.tags.length > 0 && (
                        <div className="modal-tags project-detail-tags" aria-label={t('projects.tagsLabel')}>
                            {project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
                        </div>
                    )}

                    {content.learnings.length > 0 && (
                        <div className="proj-featured-learnings-box project-detail-learnings">
                            <h2 className="proj-featured-learnings-title">{t('modal.keyTakeaways')}</h2>
                            {content.learnings.map((learning, index) => (
                                <div className="proj-featured-learning-item" key={`${index}-${learning}`}>
                                    <span className="proj-featured-learning-num">{String(index + 1).padStart(2, '0')}</span>
                                    <span>{learning}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
