import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CONTACTS, SOCIALS } from '../data/profile';

const FORMSPREE_FORM_ID = 'xlgknokn';

export default function Contact() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState({ submitted: false, error: false, loading: false });

    useEffect(() => {
        document.title = `${t('contact.title')} | Galip Efe Öncü`;
    }, [t]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ submitted: false, error: false, loading: true });

        if (!FORMSPREE_FORM_ID) {
            setTimeout(() => {
                setStatus({ submitted: true, error: false, loading: false });
                setFormData({ name: '', email: '', message: '' });
            }, 1000);
            return;
        }

        try {
            const response = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setStatus({ submitted: true, error: false, loading: false });
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus({ submitted: false, error: true, loading: false });
            }
        } catch {
            setStatus({ submitted: false, error: true, loading: false });
        }
    };

    return (
        <div className="page contact-page-container container">
            {/* Header */}
            <div className="page-header">
                <h1 className="page-title">{t('contact.heading')}</h1>
                <p className="page-subtitle">{t('contact.subtitle')}</p>
            </div>

            {/* Horizontal Status Bar */}
            <div className="contact-status-bar">
                <div className="contact-status-badge">
                    <span className="contact-pulse-dot" />
                    <span className="contact-status-text">
                        {t('contact.availabilityStatus')}
                    </span>
                    <span className="contact-status-divider">•</span>
                    <span className="contact-status-types">
                        {t('contact.availabilityTypes')}
                    </span>
                </div>
                <div className="contact-status-meta">
                    <span className="contact-meta-response">
                        {t('contact.responseLabel')}: {t('contact.responseVal')}
                    </span>
                    <span className="contact-status-divider">•</span>
                    <span className="contact-meta-timezone">
                        {t('contact.timezoneVal')}
                    </span>
                </div>
            </div>

            {/* Full-Width Directory Links */}
            <div className="contact-directory">
                {CONTACTS.map((c) => (
                    <a
                        key={c.name}
                        href={c.url}
                        target={c.url.startsWith('mailto') ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                        className="contact-directory-row"
                    >
                        <span className="contact-directory-name">{c.name}</span>
                        <span className="contact-directory-value">{c.value}</span>
                        <span className="contact-directory-arrow">→</span>
                    </a>
                ))}
            </div>

            {/* Centered Modern Form */}
            <div className="contact-form-section">
                <h2 className="contact-form-heading">{t('contact.formTitle')}</h2>
                <p className="contact-form-info">
                    {FORMSPREE_FORM_ID ? t('contact.formInfoLive') : t('contact.formInfoDemo')}
                </p>

                {status.submitted ? (
                    <div className="contact-form-success">
                        <span className="contact-success-icon">✓</span>
                        <p className="contact-success-text">{t('contact.formSuccess')}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="contact-form-grid">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">{t('contact.formName')}</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="form-input"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    disabled={status.loading}
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">{t('contact.formEmail')}</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="form-input"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    disabled={status.loading}
                                    placeholder="e.g. john@example.com"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="message" className="form-label">{t('contact.formMessage')}</label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                className="form-input"
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                disabled={status.loading}
                                placeholder="Write your message here..."
                            />
                        </div>
                        {status.error && (
                            <div className="contact-form-error">
                                {t('contact.formError')}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="btn primary contact-submit-btn"
                            disabled={status.loading}
                        >
                            {status.loading ? t('contact.formSubmitting') : t('contact.formSubmit')}
                        </button>
                    </form>
                )}
            </div>

            {/* Personal Socials Footer */}
            <div className="contact-socials-row">
                <span className="contact-socials-label">{t('contact.elsewhere')}:</span>
                <div className="contact-socials-links">
                    {SOCIALS.map(s => (
                        <a
                            key={s.name}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-social-inline-link"
                        >
                            {s.name}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
