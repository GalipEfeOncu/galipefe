import { useEffect, useRef } from 'react';

export default function Modal({ project, onClose }) {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (project) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [project, onClose]);

    if (!project) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed': return 'status-completed';
            case 'Work in Progress': return 'status-wip';
            case 'Discontinued': return 'status-discontinued';
            default: return '';
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" role="dialog" aria-modal="true" ref={modalRef}>
                <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>

                {/* 1. Project Image at the top */}
                {project.image && (
                    <div className="modal-image-container">
                        <img src={project.image} alt={project.title} className="modal-image" />
                    </div>
                )}

                <div className="modal-body-container">
                    {/* 2. Project Title & Subtitle */}
                    <div className="modal-header-content">
                        {project.status && (
                            <span className={`modal-status ${getStatusClass(project.status)}`}>
                                {project.status}
                            </span>
                        )}
                        <h2 className="modal-title-large">{project.title}</h2>
                        <span className="modal-subtitle-text">{project.subtitle}</span>
                    </div>

                    {/* 3. Description */}
                    <div className="modal-section">
                        <h3 className="modal-section-title">About</h3>
                        <p className="modal-text">{project.description}</p>
                    </div>

                    {/* 4. Learnings (Bullet points) */}
                    {project.learnings && project.learnings.length > 0 && (
                        <div className="modal-section">
                            <h3 className="modal-section-title">Key Learnings</h3>
                            <ul className="modal-learnings-list">
                                {project.learnings.map((item, index) => (
                                    <li key={index} className="modal-learning-item">
                                        <span className="bullet-point">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {project.link && (
                        <div className="modal-footer">
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="modal-cta-btn">
                                View Project →
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
