import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { projects } from '../data/projects';

function StatusBadge({ status }) {
    const cls = status === 'Completed' ? 'completed' : status === 'Discontinued' ? 'disc' : 'wip';
    return (
        <span className={`status ${cls}`}>
            <span className="led" />
            {status}
        </span>
    );
}

function ProjectImage({ project, height = 140, style = {} }) {
    const [failed, setFailed] = useState(false);
    if (project.image && !failed) {
        return (
            <img
                src={project.image}
                alt={project.title}
                onError={() => setFailed(true)}
                style={{ width: '100%', height, objectFit: 'cover', display: 'block', ...style }}
            />
        );
    }
    return (
        <div className="sketchy-img" style={{ height, borderRadius: 0, border: 'none', ...style }}>
            [{project.icon || '◇'} {project.title}]
        </div>
    );
}

export default function Projects({ onOpenModal }) {
    const { t } = useLanguage();
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        document.title = `${t('projects.title')} | Galip Efe Öncü`;
    }, [t]);

    const filters = [
        { key: 'All', label: t('projects.filters.all'), count: projects.length },
        { key: 'Completed', label: t('projects.filters.completed'), count: projects.filter(p => p.status === 'Completed').length },
        { key: 'Work in Progress', label: t('projects.filters.wip'), count: projects.filter(p => p.status === 'Work in Progress').length },
        { key: 'Discontinued', label: t('projects.filters.discontinued'), count: projects.filter(p => p.status === 'Discontinued').length },
    ];

    const list = filter === 'All' ? projects : projects.filter(p => p.status === filter);
    const featured = list[0];
    const rest = list.slice(1);

    const getSubtitle = (p) => t(`projectData.${p.translationKey}.subtitle`) || p.subtitle;
    const getDesc = (p) => t(`projectData.${p.translationKey}.desc`) || p.description;

    return (
        <div className="page">
            <div className="projects-header">
                <h1 className="projects-title">{t('projects.title')}</h1>
                <p className="projects-subtitle">{t('projects.subtitle')}</p>
            </div>

            <div className="projects-filters">
                {filters.map(f => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`pill projects-filter-btn ${filter === f.key ? 'accent' : ''}`}
                        aria-pressed={filter === f.key}
                    >
                        {f.label}
                        <span className="projects-filter-count">{f.count}</span>
                    </button>
                ))}
                <span style={{ flex: 1 }} />
                <span className="projects-sort">{t('projects.sortLabel')}</span>
            </div>

            {list.length === 0 ? (
                <div className="panel projects-empty">
                    <div className="projects-empty-icon">🔍</div>
                    <div className="projects-empty-title">{t('projects.emptyStateTitle')}</div>
                    <div className="projects-empty-desc">{t('projects.emptyStateDesc')}</div>
                </div>
            ) : (
                <>
                    {featured && (
                        <button
                            className="panel proj-featured proj-featured-btn"
                            onClick={() => onOpenModal(featured)}
                            aria-label={`${featured.title} - ${t('projects.viewDetails')}`}
                        >
                            <span>
                                <ProjectImage project={featured} height={260} style={{ borderRadius: 0 }} />
                            </span>
                            <span className="proj-featured-content">
                                <span className="proj-featured-label">{t('projects.featuredLabel')}</span>
                                <span className="proj-featured-title">{featured.title}</span>
                                <span className="proj-featured-subtitle">{getSubtitle(featured)}</span>
                                <span className="proj-featured-desc">{getDesc(featured)}</span>
                                <span className="proj-featured-tags">
                                    {featured.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                                </span>
                                <span className="proj-featured-footer">
                                    <StatusBadge status={featured.status} />
                                    <span style={{ flex: 1 }} />
                                    <span className="proj-featured-view">{t('projects.viewDetails')}</span>
                                </span>
                            </span>
                        </button>
                    )}

                    <div className="projects-grid">
                        {rest.map(p => (
                            <button
                                key={p.id}
                                className="panel proj-card proj-card-btn"
                                onClick={() => onOpenModal(p)}
                                aria-label={`${p.title} - ${t('projects.viewDetails')}`}
                            >
                                <span className="proj-card-img-wrap">
                                    <ProjectImage project={p} height={140} />
                                </span>
                                <span className="proj-card-body">
                                    <span className="proj-card-header">
                                        <span className="proj-card-title">{p.title}</span>
                                        {p.icon && <span className="proj-card-icon">{p.icon}</span>}
                                    </span>
                                    <span className="proj-card-subtitle">{getSubtitle(p)}</span>
                                    <span className="proj-card-tags">
                                        {p.tags.slice(0, 3).map(tag => <span key={tag} className="tag">{tag}</span>)}
                                    </span>
                                    <span className="proj-card-status"><StatusBadge status={p.status} /></span>
                                </span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
