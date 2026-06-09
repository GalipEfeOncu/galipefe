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
                style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 4, marginBottom: 18 }}
            />
        );
    }
    return (
        <div className="sketchy-img" style={{ height: 220, marginBottom: 18 }}>
            [hero screenshot — {project.title}]
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

            // Focus close button on mount
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

    return (
        <div
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'grid', placeItems: 'center', padding: 24 }}
        >
            <div
                ref={modalRef}
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                style={{ width: '100%', maxWidth: 980, maxHeight: '92vh', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 80px rgba(0,0,0,.6)' }}
            >
                {/* Title bar */}
                <div style={{ padding: '10px 14px', background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--mono)', fontSize: 12, flexShrink: 0 }}>
                    <span style={{ color: 'var(--dim)' }}>~/projects/</span>
                    <span style={{ color: 'var(--accent)' }}>{project.translationKey}</span>
                    <button
                        onClick={onClose}
                        style={{ marginLeft: 'auto', color: 'var(--muted)', cursor: 'pointer', padding: '2px 8px', borderRadius: 4, background: 'transparent', border: 'none', fontFamily: 'var(--mono)', fontSize: 12 }}
                    >
                        {t('modal.close')}
                    </button>
                </div>

                {/* Body */}
                <div className="modal-inner" style={{ flex: 1, display: 'flex', minHeight: 0 }}>
                    {/* Sidebar */}
                    <div className="scroll-y modal-sidebar" style={{ width: 240, borderRight: '1px solid var(--border)', background: 'var(--bg-2)', padding: 16, display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0 }}>
                        <div style={{ width: 56, height: 56, borderRadius: 8, background: 'var(--accent-soft)', border: '1px solid var(--accent-line)', display: 'grid', placeItems: 'center', fontSize: 26 }}>
                            {project.icon || '◇'}
                        </div>
                        <dl className="kv" style={{ fontSize: 11.5 }}>
                            <dt>{t('modal.idLabel')}</dt><dd>#{project.id}</dd>
                            <dt>{t('modal.statusLabel')}</dt><dd className="accent">{statusLabel}</dd>
                            <dt>{t('modal.repoLabel')}</dt>
                            <dd>
                                {project.link
                                    ? <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>{t('modal.github')}</a>
                                    : <span className="muted">—</span>
                                }
                            </dd>
                        </dl>
                        <div>
                            <div className="mono muted" style={{ fontSize: 10, letterSpacing: '0.14em', marginBottom: 6 }}>{t('modal.stack')}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {project.tags.map(tag => <span key={tag} className="tag" style={{ alignSelf: 'flex-start' }}>{tag}</span>)}
                            </div>
                        </div>
                        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {project.link && (
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn" style={{ justifyContent: 'center' }}>
                                    {t('modal.repo')}
                                </a>
                            )}
                            {project.demoLink && (
                                <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="btn primary" style={{ justifyContent: 'center' }}>
                                    {t('modal.liveDemo')}
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="scroll-y" style={{ flex: 1, padding: 24 }}>
                        <h2 id="modal-title" style={{ fontSize: 26, fontWeight: 600, margin: 0 }}>{project.title}</h2>
                        <div className="mono muted" style={{ fontSize: 12, marginBottom: 16 }}>{subtitle}</div>
                        <ModalImage project={project} />
                        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'var(--text-2)' }}>{desc}</p>
                        <hr className="divider" style={{ margin: '20px 0' }} />
                        <div className="mono muted" style={{ fontSize: 10, letterSpacing: '0.16em', marginBottom: 10 }}>{t('modal.keyTakeaways')}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {learnings.map((l, i) => (
                                <div key={i} style={{ padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 4, border: '1px solid var(--border-soft)', display: 'flex', gap: 8 }}>
                                    <span className="mono" style={{ color: 'var(--accent)', fontSize: 11, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                                    <span style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{l}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
