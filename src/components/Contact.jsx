import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { CONTACTS, SOCIALS } from '../data/profile';

// Replace with your Formspree Form ID to enable live submissions (e.g. 'mqkvwzqv')
const FORMSPREE_FORM_ID = '';

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
            <div style={{ marginBottom: 24, textAlign: 'center' }}>
                <div className="mono" style={{ color: 'var(--accent)', fontSize: 11, letterSpacing: '0.18em', marginBottom: 6 }}>~/contact</div>
                <h1 style={{ fontSize: 34, margin: 0, fontWeight: 700 }}>{t('contact.heading')}</h1>
                <p className="muted" style={{ margin: '6px 0 0', fontSize: 14 }}>{t('contact.subtitle')}</p>
            </div>

            <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 18, alignItems: 'start' }}>

                {/* Left column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Primary channels */}
                    <div className="panel">
                        <div className="panel-h"><span className="dot" />{t('contact.primaryChannels')}</div>
                        <div>
                            {CONTACTS.map((c, i) => (
                                <a
                                    key={c.name}
                                    href={c.url}
                                    target={c.url.startsWith('mailto') ? '_self' : '_blank'}
                                    rel="noopener noreferrer"
                                    style={{ padding: '16px 18px', borderTop: i ? '1px solid var(--border-soft)' : 'none', display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', color: 'inherit' }}
                                >
                                    <div style={{ width: 38, height: 38, borderRadius: 6, background: 'var(--bg-2)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: 14, flexShrink: 0 }}>
                                        {c.icon}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 14.5, fontWeight: 600 }}>{c.name}</div>
                                        <div className="mono" style={{ fontSize: 12, color: 'var(--accent)' }}>{c.value}</div>
                                        <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{t(c.descKey)}</div>
                                    </div>
                                    <span className="mono" style={{ color: 'var(--muted)', fontSize: 14 }}>→</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Elsewhere */}
                    <div className="panel">
                        <div className="panel-h"><span className="dot" />{t('contact.elsewherePanel')}</div>
                        <div className="panel-b" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                            {SOCIALS.map(s => (
                                <a
                                    key={s.name}
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ padding: '12px 14px', background: 'var(--bg-2)', border: '1px solid var(--border-soft)', borderRadius: 4, textDecoration: 'none', color: 'inherit' }}
                                >
                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                                    <div className="mono muted" style={{ fontSize: 11, marginTop: 2 }}>{s.value}</div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="panel">
                        <div className="panel-h"><span className="dot" />{t('contact.formTitle')}</div>
                        <div className="panel-b">
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
                                </form>
                            )}
                        </div>
                    </div>

                    {/* CTA banner */}
                    <div className="panel" style={{ background: 'var(--accent-soft)', borderColor: 'var(--accent-line)' }}>
                        <div className="panel-b" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--accent)' }}>{t('contact.projectCTA')}</div>
                                <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{t('contact.projectCTADesc')}</div>
                            </div>
                            <Link to="/projects" className="btn primary">{t('contact.viewProjects')}</Link>
                        </div>
                    </div>
                </div>

                {/* Right column (sticky) */}
                <div className="contact-sticky" style={{ position: 'sticky', top: 96, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Availability */}
                    <div className="panel">
                        <div className="panel-h"><span className="dot" />{t('contact.availabilityPanel')}</div>
                        <div className="panel-b" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--accent-soft)', border: '1px solid var(--accent-line)', borderRadius: 6 }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--accent)' }}>{t('contact.availabilityStatus')}</div>
                                    <div className="mono muted" style={{ fontSize: 11, marginTop: 1 }}>{t('contact.availabilityTypes')}</div>
                                </div>
                            </div>
                            <dl className="kv" style={{ fontSize: 12.5 }}>
                                <dt>{t('contact.responseLabel')}</dt><dd>{t('contact.responseVal')}</dd>
                                <dt>{t('contact.timezoneLabel')}</dt><dd>{t('contact.timezoneVal')}</dd>
                                <dt>{t('about.facts.languages')}</dt><dd>{t('about.facts.languagesVal')}</dd>
                                <dt>{t('contact.preferredLabel')}</dt><dd className="accent">{t('contact.preferredVal')}</dd>
                            </dl>
                        </div>
                    </div>

                    {/* What I'm into */}
                    <div className="panel">
                        <div className="panel-h"><span className="dot" />{t('contact.whatImInto')}</div>
                        <div className="panel-b" style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, lineHeight: 1.55, color: 'var(--text-2)' }}>
                            {[1, 2, 3].map(n => (
                                <div key={n} className="row" style={{ alignItems: 'flex-start', gap: 10 }}>
                                    <span className="mono accent" style={{ fontSize: 11, paddingTop: 2 }}>0{n}</span>
                                    <span>{t(`contact.interest${n}`)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
