import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

function ModalImage({ project }) {
    const [failed, setFailed] = useState(false);
    if (project.image && !failed) {
        return (
            <img
                src={project.image}
                alt={project.title}
                onError={() => setFailed(true)}
                className="modal-image"
                decoding="async"
                style={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: 'var(--r-md)', display: 'block' }}
            />
        );
    }
    return (
        <div className="sketchy-img" style={{ height: 220, display: 'grid', placeItems: 'center', background: 'var(--bg-2)' }}>
            [hero screenshot - {project.title}]
        </div>
    );
}

export default function Modal({ project, onClose }) {
    const { t } = useLanguage();
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

    const subtitle = t(`projectData.${project.translationKey}.subtitle`) || project.subtitle;
    const desc = t(`projectData.${project.translationKey}.desc`) || project.description;
    const learnings = t(`projectData.${project.translationKey}.learnings`) || project.learnings || [];
    
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
                        
                        {/* Left Column: Image, Metadata & CTAs */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <ModalImage project={project} />
                            
                            <div className="modal-meta" style={{ border: 'none', padding: 0, margin: 0 }}>
                                <span className={`status ${statusCls}`}><span className="led" />{statusLabel}</span>
                                <span className="modal-meta-id">id: #{project.id}</span>
                            </div>
                            
                            <div className="modal-actions" style={{ border: 'none', padding: 0, marginTop: 8 }}>
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

                        {/* Right Column: Heading, Description, Learnings */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="modal-hero">
                                <div className="modal-icon">{project.icon || '◇'}</div>
                                <div className="modal-title-wrap">
                                    <h2 className="modal-title" id="modal-title">{project.title}</h2>
                                    <div className="modal-subtitle">{subtitle}</div>
                                </div>
                            </div>

                            <p className="modal-desc">{desc}</p>

                            <div className="modal-tags">
                                {project.tags.map(tag => (
                                    <span key={tag} className="tag">{tag}</span>
                                ))}
                            </div>

                            {/* Takeaways Section */}
                            {learnings.length > 0 && (
                                <div className="modal-takeaways-section">
                                    <hr className="section-divider" style={{ margin: '8px 0 16px' }} />
                                    <div className="modal-takeaways-label">{t('modal.keyTakeaways')}</div>
                                    <div>
                                        {learnings.map((l, i) => (
                                            <div key={i} className="modal-takeaway-item">
                                                <span className="modal-takeaway-num">{String(i + 1).padStart(2, '0')}</span>
                                                <span className="modal-takeaway-text">{l}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
