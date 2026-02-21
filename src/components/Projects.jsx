import { useState } from 'react';
import { projects } from '../data/projects';

export default function Projects({ onOpenModal }) {
    const [filter, setFilter] = useState('All');

    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed': return 'status-completed';
            case 'Work in Progress': return 'status-wip';
            case 'Discontinued': return 'status-discontinued';
            default: return '';
        }
    };

    const statuses = ['All', 'Completed', 'Work in Progress', 'Discontinued'];

    const filteredProjects = filter === 'All'
        ? projects
        : projects.filter(p => p.status === filter);

    const [featured, ...rest] = filteredProjects;

    return (
        <section className="container section" id="projects">
            {/* Page Header */}
            <div className="projects-header">
                <h1 className="projects-title">My Projects</h1>
                <p className="projects-subtitle">
                    A collection of things I've built — from action games to desktop apps and modern web experiences.
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="projects-filters">
                {statuses.map((status) => (
                    <button
                        key={status}
                        className={`filter-tab ${filter === status ? 'filter-active' : ''}`}
                        onClick={() => setFilter(status)}
                    >
                        {status}
                        {status !== 'All' && (
                            <span className="filter-count">
                                {projects.filter(p => p.status === status).length}
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
                                {featured.status}
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
                            <span className="project-featured-subtitle">{featured.subtitle}</span>
                            <p className="project-featured-desc">{featured.description}</p>
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
                                        {project.status}
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
                                    <span className="project-card-v-subtitle">{project.subtitle}</span>
                                    <p className="project-card-v-desc">{project.description}</p>
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
