import { projects } from '../data/projects';

export default function Projects({ onOpenModal }) {
    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed': return 'status-completed';
            case 'Work in Progress': return 'status-wip';
            case 'Discontinued': return 'status-discontinued';
            default: return '';
        }
    };

    return (
        <section className="container section" id="projects">
            <h2 className="section-title">Selected Works</h2>

            <div className="projects-list">
                {projects.map((project) => (
                    <article
                        key={project.id}
                        className="project-card-h"
                        onClick={() => onOpenModal(project)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && onOpenModal(project)}
                    >
                        <div className="project-card-h-image">
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
                        <div className="project-card-h-content">
                            <div>
                                <h3 className="project-card-h-title">{project.title}</h3>
                                <span className="project-card-h-subtitle">{project.subtitle}</span>
                                <p className="project-card-h-desc">{project.description}</p>
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
        </section>
    );
}
