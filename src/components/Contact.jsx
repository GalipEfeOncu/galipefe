import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { CONTACTS, SOCIALS } from '../data/profile';

// Replace with your Formspree Form ID to enable live submissions (e.g. 'mqkvwzqv')
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
            // Simulated submission delay for demo purposes
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
        <div className="page">
            {/* Header */}
            <div className="contact-header">
                <h1 className="contact-heading">{t('contact.heading')}</h1>
                <p className="contact-subtitle">{t('contact.subtitle')}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                {/* Availability status */}
                <div>
                    <div className="contact-availability">
                        <span className="contact-avail-dot" />
                        <div>
                            <div className="contact-avail-status">{t('contact.availabilityStatus')}</div>
                            <div className="contact-avail-types">{t('contact.availabilityTypes')}</div>
                        </div>
                    </div>
                    <div className="contact-avail-meta">
                        <div className="contact-avail-meta-item">
                            <span className="contact-avail-meta-label">{t('contact.responseLabel')}</span>
                            <span>{t('contact.responseVal')}</span>
                        </div>
                        <div className="contact-avail-meta-item">
                            <span className="contact-avail-meta-label">{t('contact.timezoneLabel')}</span>
                            <span>{t('contact.timezoneVal')}</span>
                        </div>
                        <div className="contact-avail-meta-item">
                            <span className="contact-avail-meta-label">{t('about.facts.languages')}</span>
                            <span>{t('about.facts.languagesVal')}</span>
                        </div>
                        <div className="contact-avail-meta-item">
                            <span className="contact-avail-meta-label">{t('contact.preferredLabel')}</span>
                            <a href="mailto:galipefe75@gmail.com" className="accent">galipefe75@gmail.com</a>
                        </div>
                    </div>
                </div>

                <hr className="section-divider" />

                {/* Reach me here */}
                <div>
                    <div className="section-label">{t('contact.primaryChannels')}</div>
                    <div>
                        {CONTACTS.map(c => (
                            <a
                                key={c.name}
                                href={c.url}
                                target={c.url.startsWith('mailto') ? '_self' : '_blank'}
                                rel="noopener noreferrer"
                                className="contact-channel-link"
                            >
                                <div className="contact-channel-icon">
                                    {c.icon}
                                </div>
                                <div className="contact-channel-info">
                                    <div className="contact-channel-name">{c.name}</div>
                                    <div className="contact-channel-value">{c.value}</div>
                                    <div className="contact-channel-desc">{t(c.descKey)}</div>
                                </div>
                                <span className="contact-channel-arrow">→</span>
                            </a>
                        ))}
                    </div>
                </div>

                <hr className="section-divider" />

                {/* Elsewhere */}
                <div>
                    <div className="section-label">{t('contact.elsewherePanel')}</div>
                    <div className="contact-socials-grid">
                        {SOCIALS.map(s => (
                            <a
                                key={s.name}
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-social-link"
                            >
                                <div className="contact-social-name">{s.name}</div>
                                <div className="contact-social-value">{s.value}</div>
                            </a>
                        ))}
                    </div>
                </div>

                <hr className="section-divider" />

                {/* Send a Message */}
                <div>
                    <div className="section-label">{t('contact.formTitle')}</div>
                    {status.submitted ? (
                        <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--good)' }}>
                            <div style={{ fontSize: 24, marginBottom: 8 }}>✓</div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{t('contact.formSuccess')}</div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
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
                                />
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
                                />
                            </div>
                            {status.error && (
                                <div style={{ color: 'var(--bad)', fontSize: 13, marginBottom: 12 }}>
                                    {t('contact.formError')}
                                </div>
                            )}
                            <button
                                type="submit"
                                className="btn primary"
                                style={{ width: '100%', justifyContent: 'center' }}
                                disabled={status.loading}
                            >
                                {status.loading ? t('contact.formSubmitting') : t('contact.formSubmit')}
                            </button>
                            <div style={{ marginTop: 10, textAlign: 'center', fontSize: 11, color: 'var(--muted)' }}>
                                {FORMSPREE_FORM_ID ? t('contact.formInfoLive') : t('contact.formInfoDemo')}
                            </div>
                        </form>
                    )}
                </div>

                <hr className="section-divider" />

                {/* What I'm into */}
                <div>
                    <div className="section-label">{t('contact.whatImInto')}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[1, 2, 3].map(n => (
                            <div key={n} className="contact-interest-row">
                                <span className="contact-interest-num">0{n}</span>
                                <span>{t(`contact.interest${n}`)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <hr className="section-divider" />

                {/* CTA banner */}
                <div className="contact-cta-banner">
                    <div style={{ flex: 1 }}>
                        <div className="contact-cta-title">{t('contact.projectCTA')}</div>
                        <div className="contact-cta-desc">{t('contact.projectCTADesc')}</div>
                    </div>
                    <Link to="/projects" className="btn primary">{t('contact.viewProjects')}</Link>
                </div>
            </div>
        </div>
    );
}
