import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

            {/* Stacked Layout Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
                
                {/* 1. Availability Status Banner */}
                <div>
                    <div className="contact-availability">
                        <span className="contact-avail-dot" />
                        <div>
                            <div className="contact-avail-status">{t('contact.availabilityStatus')}</div>
                            <div className="contact-avail-types">{t('contact.availabilityTypes')}</div>
                        </div>
                    </div>

                    {/* Avail Meta Information List */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px', fontSize: 13, color: 'var(--text-2)', marginTop: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ color: 'var(--muted)' }}>{t('contact.responseLabel')}:</span>
                            <span>{t('contact.responseVal')}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ color: 'var(--muted)' }}>{t('contact.timezoneLabel')}:</span>
                            <span>{t('contact.timezoneVal')}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ color: 'var(--muted)' }}>{t('about.facts.languages')}:</span>
                            <span>{t('about.facts.languagesVal')}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ color: 'var(--muted)' }}>{t('contact.preferredLabel')}:</span>
                            <a href="mailto:galipefe75@gmail.com" style={{ color: 'var(--accent)', fontWeight: 500 }}>galipefe75@gmail.com</a>
                        </div>
                    </div>
                </div>

                <hr className="section-divider" />

                {/* 2. Primary Contact Channels */}
                <div>
                    <span className="section-label">{t('contact.primaryChannels')}</span>
                    <div className="contact-channels">
                        {CONTACTS.map(c => (
                            <a
                                key={c.name}
                                href={c.url}
                                target={c.url.startsWith('mailto') ? '_self' : '_blank'}
                                rel="noopener noreferrer"
                                className="contact-channel-card"
                            >
                                <div className="contact-channel-icon">
                                    {c.icon}
                                </div>
                                <div className="contact-channel-info">
                                    <span className="contact-channel-name">{c.name}</span>
                                    <span className="contact-channel-value">{c.value}</span>
                                    <span className="contact-channel-desc">{t(c.descKey)}</span>
                                </div>
                                <span className="contact-channel-arrow">→</span>
                            </a>
                        ))}
                    </div>
                </div>

                <hr className="section-divider" />

                {/* 3. Socials Elsewhere */}
                <div className="contact-socials-wrapper">
                    <span className="contact-socials-label">{t('contact.elsewherePanel')}</span>
                    <div className="contact-socials-grid">
                        {SOCIALS.map(s => (
                            <a
                                key={s.name}
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-social-card"
                            >
                                <span className="contact-social-name">{s.name}</span>
                                <span className="contact-social-value">{s.value}</span>
                            </a>
                        ))}
                    </div>
                </div>

                <hr className="section-divider" />

                {/* 4. Send a Message (Form Card) */}
                <div className="contact-form-container">
                    <h2 className="contact-form-title">{t('contact.formTitle')}</h2>
                    <p className="contact-form-subtitle">
                        {FORMSPREE_FORM_ID ? t('contact.formInfoLive') : t('contact.formInfoDemo')}
                    </p>

                    {status.submitted ? (
                        <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--good)' }}>
                            <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
                            <div style={{ fontSize: 15, fontWeight: 600 }}>{t('contact.formSuccess')}</div>
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
                                <div style={{ color: 'var(--bad)', fontSize: 13, marginBottom: 12 }}>
                                    {t('contact.formError')}
                                </div>
                            )}
                            <button
                                type="submit"
                                className="btn primary"
                                style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                                disabled={status.loading}
                            >
                                {status.loading ? t('contact.formSubmitting') : t('contact.formSubmit')}
                            </button>
                        </form>
                    )}
                </div>

                <hr className="section-divider" />

                {/* 5. Hobbies / What I'm Into List */}
                <div>
                    <span className="section-label">{t('contact.whatImInto')}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {[1, 2, 3].map(n => (
                            <div key={n} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14, color: 'var(--text-2)' }}>
                                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)', paddingTop: 3, fontWeight: 500 }}>0{n}</span>
                                <span>{t(`contact.interest${n}`)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 6. Projects Redirect Callout */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 16,
                    background: 'var(--accent-soft)',
                    border: '1px solid var(--accent-line)',
                    borderRadius: 'var(--r-md)',
                    padding: '24px 32px',
                    boxShadow: 'var(--shadow)'
                }}>
                    <div style={{ flex: 1, minWidth: 260 }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>{t('contact.projectCTA')}</div>
                        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{t('contact.projectCTADesc')}</div>
                    </div>
                    <Link to="/projects" className="btn primary">{t('contact.viewProjects')}</Link>
                </div>

            </div>
        </div>
    );
}
