import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getProjectContent } from '../utils/projectContent';

function ModalImage({ project }) {
    const { t } = useLanguage();
    const [failed, setFailed] = useState(false);
    if (project.image && !failed) {
        return (
            <img
                src={project.image}
                alt={project.title}
                onError={() => setFailed(true)}
                className="modal-image"
                decoding="async"
                style={{ width: '100%', aspectRatio: '16/9', height: 'auto', objectFit: 'cover', borderRadius: 'var(--r-md)', display: 'block' }}
            />
        );
    }
    return (
        <div className="sketchy-img" style={{ aspectRatio: '16/9', width: '100%', height: 'auto', display: 'grid', placeItems: 'center', background: 'var(--bg-2)', borderRadius: 'var(--r-md)' }}>
            [{t('modal.imageFallback').replace('{title}', project.title)}]
        </div>
    );
}

export default function Modal({ project, onClose }) {
    const { t, lang } = useLanguage();
    const modalRef = useRef(null);

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';

        const modalElement = modalRef.current;
        let handleFocusTrap = null;

        if (modalElement) {
            const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
            handleFocusTrap = (e) => {
                if (e.key !== 'Tab') return;
                const focusables = modalElement.querySelectorAll(focusableSelectors);
                if (focusables.length === 0) return;
                const firstElement = focusables[0];
                const lastElement = focusables[focusables.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            };

            const focusables = modalElement.querySelectorAll(focusableSelectors);
            if (focusables.length > 0) {
                focusables[0].focus();
            }

            window.addEventListener('keydown', handleFocusTrap);
        }

        return () => {
            window.removeEventListener('keydown', onKey);
            if (handleFocusTrap) {
                window.removeEventListener('keydown', handleFocusTrap);
            }
            document.body.style.overflow = '';
        };
    }, [onClose]);

    if (!project) return null;

    const { subtitle, description: desc, learnings } = getProjectContent(project, lang);
    
    const statusLabel = t(
        project.status === 'Completed'
            ? 'projects.filters.completed'
            : project.status === 'Discontinued'
            ? 'projects.filters.discontinued'
            : 'projects.filters.wip'
    );

    const statusCls = project.status === 'Completed' ? 'completed' : project.status === 'Discontinued' ? 'disc' : 'wip';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                ref={modalRef}
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className="modal-container"
            >
                {/* Title bar (Removing the legacy path prefix) */}
                <div className="modal-titlebar">
                    <span className="modal-titlebar-key">{project.title}</span>
                    <button onClick={onClose} className="modal-close-btn">
                        {t('modal.close')}
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    <div className="modal-grid">
                        
                        {/* Left Column: Hero, Image Box & CTAs */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 4 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                    <h2 className="proj-featured-title" style={{ fontSize: 28, margin: 0 }}>{project.title}</h2>
                                    <span className={`status ${statusCls}`}><span className="led" />{statusLabel}</span>
                                    <span className="modal-meta-id" style={{ fontSize: 11, opacity: 0.6, marginLeft: 'auto' }}>#{project.id}</span>
                                </div>
                                <span className="proj-featured-subtitle">{subtitle}</span>
                            </div>

                            <ModalImage project={project} />
                            
                            <div className="modal-actions" style={{ border: 'none', padding: 0, margin: 0, marginTop: 4 }}>
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
                        </div>

                        {/* Right Column: Description, Tags, Learnings */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <p className="modal-desc" style={{ margin: 0 }}>{desc}</p>

                            <div className="modal-tags" style={{ marginTop: 0 }}>
                                {project.tags.map(tag => (
                                    <span key={tag} className="tag">{tag}</span>
                                ))}
                            </div>

                            {/* Takeaways Section */}
                            {learnings.length > 0 && (
                                <div className="proj-featured-learnings-box" style={{ marginTop: 0 }}>
                                    <span className="proj-featured-learnings-title">{t('modal.keyTakeaways')}</span>
                                    {learnings.map((l, i) => (
                                        <div key={i} className="proj-featured-learning-item">
                                            <span className="proj-featured-learning-num">{String(i + 1).padStart(2, '0')}</span>
                                            <span>{l}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
