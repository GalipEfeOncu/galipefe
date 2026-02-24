import { useState } from 'react';
import { projects } from '../data/projects';
import { useLanguage } from '../context/LanguageContext';

export default function Projects({ onOpenModal }) {
    const [filter, setFilter] = useState('All');
    const { t } = useLanguage();

    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed': return 'status-completed';
            case 'Work in Progress': return 'status-wip';
            case 'Discontinued': return 'status-discontinued';
            default: return '';
        }
    };

    const statuses = [
        { id: 'All', label: t('projects.filters.all') },
        { id: 'Completed', label: t('projects.filters.completed') },
        { id: 'Work in Progress', label: t('projects.filters.wip') },
        { id: 'Discontinued', label: t('projects.filters.discontinued') }
    ];

    const filteredProjects = filter === 'All'
        ? projects
        : projects.filter(p => p.status === filter);

    const [featured, ...rest] = filteredProjects;

    const translateStatus = (statusId) => {
        const found = statuses.find(s => s.id === statusId);
        return found ? found.label : statusId;
    };

    return (
        <section className="container section" id="projects">
            {/* Page Header */}
            <div className="projects-header">
                <h1 className="projects-title">{t('projects.title')}</h1>
                <p className="projects-subtitle">
                    {t('projects.subtitle')}
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="projects-filters">
                {statuses.map((status) => (
                    <button
                        key={status.id}
                        className={`filter-tab ${filter === status.id ? 'filter-active' : ''}`}
                        onClick={() => setFilter(status.id)}
                    >
                        {status.label}
                        {status.id !== 'All' && (
                            <span className="filter-count">
                                {projects.filter(p => p.status === status.id).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Featured Project (first one) */}
            {featured && (
                <article
                    className="project-featured"
                    onClick={() => onOpenModal(featured)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && onOpenModal(featured)}
                >
                    <div className="project-featured-image">
                        {featured.status && (
                            <span className={`card-status-badge ${getStatusClass(featured.status)}`}>
                                {translateStatus(featured.status)}
                            </span>
                        )}
                        {featured.image ? (
                            <img src={featured.image} alt={featured.title} />
                        ) : (
                            <span className="card-icon">{featured.icon || '📁'}</span>
                        )}
                    </div>
                    <div className="project-featured-content">
                        <div>
                            <h2 className="project-featured-title">{featured.title}</h2>
                            <span className="project-featured-subtitle">{t(`projectData.${featured.translationKey}.subtitle`)}</span>
                            <p className="project-featured-desc">{t(`projectData.${featured.translationKey}.desc`)}</p>
                        </div>
                        <div className="tags">
                            {featured.tags && featured.tags.map(tag => (
                                <span key={tag} className="tag">{tag}</span>
                            ))}
                        </div>
                    </div>
                </article>
            )}

            {/* Rest of Projects in Grid */}
            {rest.length > 0 && (
                <div className="projects-grid">
                    {rest.map((project) => (
                        <article
                            key={project.id}
                            className="project-card-v"
                            onClick={() => onOpenModal(project)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => e.key === 'Enter' && onOpenModal(project)}
                        >
                            <div className="project-card-v-image">
                                {project.status && (
                                    <span className={`card-status-badge ${getStatusClass(project.status)}`}>
                                        {translateStatus(project.status)}
                                    </span>
                                )}
                                {project.image ? (
                                    <img src={project.image} alt={project.title} />
                                ) : (
                                    <span className="card-icon">{project.icon || '📁'}</span>
                                )}
                            </div>
                            <div className="project-card-v-content">
                                <div>
                                    <h3 className="project-card-v-title">{project.title}</h3>
                                    <span className="project-card-v-subtitle">{t(`projectData.${project.translationKey}.subtitle`)}</span>
                                    <p className="project-card-v-desc">{t(`projectData.${project.translationKey}.desc`)}</p>
                                </div>
                                <div className="tags">
                                    {project.tags && project.tags.map(tag => (
                                        <span key={tag} className="tag">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
