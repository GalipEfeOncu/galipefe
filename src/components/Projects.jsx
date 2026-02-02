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

            <div className="projects-grid">
                {projects.map((project) => (
                    <article
                        key={project.id}
                        className="project-card"
                        onClick={() => onOpenModal(project)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && onOpenModal(project)}
                    >
                        <div className="card-image-container">
                            {project.status && (
                                <span className={`card-status-badge ${getStatusClass(project.status)}`}>
                                    {project.status}
                                </span>
                            )}
                            {project.image ? (
                                <img src={project.image} alt={project.title} className="card-image" />
                            ) : (
                                <span className="card-icon">{project.icon || 'folder'}</span>
                            )}
                        </div>
                        <div className="card-content">
                            <h3 className="card-title">{project.title}</h3>
                            <p className="card-desc" dangerouslySetInnerHTML={{ __html: project.description.split('<br>')[0] }}></p>
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
