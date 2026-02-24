import { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Modal({ project, onClose }) {
    const modalRef = useRef(null);
    const { t } = useLanguage();

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

    // Helper to get translated status
    const translateStatus = (statusStr) => {
        switch (statusStr) {
            case 'All': return t('projects.filters.all');
            case 'Completed': return t('projects.filters.completed');
            case 'Work in Progress': return t('projects.filters.wip');
            case 'Discontinued': return t('projects.filters.discontinued');
            default: return statusStr;
        }
    };

    const projectData = t(`projectData.${project.translationKey}`) || {};
    const subtitle = projectData.subtitle || project.subtitle;
    const description = projectData.desc || project.description;
    const learnings = projectData.learnings || project.learnings;

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
                                {translateStatus(project.status)}
                            </span>
                        )}
                        <h2 className="modal-title-large">{project.title}</h2>
                        <span className="modal-subtitle-text">{subtitle}</span>
                    </div>

                    {/* 3. Description */}
                    <div className="modal-section">
                        <h3 className="modal-section-title">{t('projects.modal.about')}</h3>
                        <p className="modal-text">{description}</p>
                    </div>

                    {/* 4. Learnings (Bullet points) */}
                    {learnings && learnings.length > 0 && (
                        <div className="modal-section">
                            <h3 className="modal-section-title">{t('projects.modal.learnings')}</h3>
                            <ul className="modal-learnings-list">
                                {learnings.map((item, index) => (
                                    <li key={index} className="modal-learning-item">
                                        <span className="bullet-point">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {(project.link || project.demoLink) && (
                        <div className="modal-footer" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1.5rem', width: '100%' }}>
                            {project.link && (
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="modal-secondary-btn" style={{ flex: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <span>{t('projects.modal.githubRepo')}</span>
                                    <span style={{ fontSize: '1.2em' }}>💻</span>
                                </a>
                            )}
                            {project.demoLink && (
                                <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="modal-cta-btn" style={{ flex: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <span>{t('projects.modal.liveDemo')}</span>
                                    <span style={{ fontSize: '1.2em' }}>🚀</span>
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
