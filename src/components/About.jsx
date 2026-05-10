import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { SKILLS } from '../data/profile';

const base = import.meta.env.BASE_URL;

function computeAge() {
    const birth = new Date(2006, 8, 2);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

export default function About() {
    const { t } = useLanguage();
    const age = computeAge();

    const interests = [
        { icon: '🎮', label: t('hero.interests.gaming') },
        { icon: '🚶', label: t('hero.interests.walking') },
        { icon: '📚', label: t('hero.interests.reading') },
        { icon: '💪', label: t('hero.interests.fitness') },
    ];

    return (
        <div className="page">
            <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 36, alignItems: 'start' }}>

                {/* Left: identity card */}
                <div className="about-identity" style={{ position: 'sticky', top: 96, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="panel">
                        <div className="panel-b" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10, padding: 28 }}>
                            <img
                                src={`${base}assets/images/pp.png`}
                                alt="Galip Efe Öncü"
                                className="avatar"
                                width={120}
                                height={120}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    const ph = document.createElement('div');
                                    ph.className = 'avatar-placeholder';
                                    ph.style.cssText = 'width:120px;height:120px;font-size:11px;';
                                    ph.textContent = 'profile.png';
                                    e.target.parentNode.insertBefore(ph, e.target);
                                }}
                            />
                            <div style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>Galip Efe Öncü</div>
                            <div className="mono muted" style={{ fontSize: 12 }}>{t('hero.role')}</div>
                            <span className="pill accent" style={{ marginTop: 4 }}>
                                <span className="led" />
                                {t('hero.status')}
                            </span>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border-soft)', padding: '14px 18px' }}>
                            <dl className="kv" style={{ fontSize: 12.5 }}>
                                <dt>{t('about.kvLocation')}</dt><dd>{t('about.facts.locationVal')}</dd>
                                <dt>{t('about.kvEdu')}</dt><dd>{t('about.facts.universityVal')}</dd>
                                <dt>{t('about.kvLang')}</dt><dd>{t('about.facts.languagesVal')}</dd>
                                <dt>{t('about.kvFocus')}</dt><dd className="accent">{t('about.facts.gameVal')}</dd>
                            </dl>
                        </div>
                    </div>

                    <blockquote style={{ margin: 0, padding: '14px 18px', borderLeft: '3px solid var(--accent)', background: 'var(--accent-soft)', color: 'var(--accent)', fontStyle: 'italic', fontSize: 15, borderRadius: '0 6px 6px 0' }}>
                        {t('hero.quote')}
                    </blockquote>
                </div>

                {/* Right: bio + interests + stack + CTA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div>
                        <div className="mono" style={{ color: 'var(--accent)', fontSize: 11, letterSpacing: '0.18em', marginBottom: 6 }}>~/about</div>
                        <h1 style={{ fontSize: 36, margin: 0, lineHeight: 1.1, fontWeight: 700 }}>{t('about.heading')}</h1>
                    </div>

                    <div style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-2)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t('about.bio1').replace('{age}', age) }} />
                        <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t('about.bio2') }} />
                        <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t('about.bio3') }} />
                    </div>

                    <div className="panel">
                        <div className="panel-h"><span className="dot" />{t('about.interestsPanel')}</div>
                        <div className="panel-b interests-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                            {interests.map(i => (
                                <div key={i.label} style={{ padding: '12px 14px', background: 'var(--bg-2)', borderRadius: 4, border: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ fontSize: 18 }}>{i.icon}</span>
                                    <span className="mono" style={{ fontSize: 12 }}>{i.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="panel">
                        <div className="panel-h"><span className="dot" />{t('about.stackPanel')}</div>
                        <div className="panel-b" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {SKILLS.map(cat => (
                                <div key={cat.title}>
                                    <div className="mono muted" style={{ fontSize: 10.5, letterSpacing: '0.14em', marginBottom: 6 }}>{cat.title.toUpperCase()}</div>
                                    <div className="row" style={{ gap: 5, flexWrap: 'wrap' }}>
                                        {cat.items.map(s => <span key={s} className="tag">{s}</span>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="cta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <Link to="/projects" className="cta-card">
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 600 }}>{t('about.cta.projectsTitle')}</div>
                                <div className="mono muted" style={{ fontSize: 11.5, marginTop: 2 }}>{t('about.cta.projectsCount')}</div>
                            </div>
                            <span style={{ color: 'var(--accent)', fontSize: 18, marginLeft: 'auto' }}>→</span>
                        </Link>
                        <Link to="/contact" className="cta-card">
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 600 }}>{t('about.cta.contactTitle')}</div>
                                <div className="mono muted" style={{ fontSize: 11.5, marginTop: 2 }}>{t('about.cta.contactChannels')}</div>
                            </div>
                            <span style={{ color: 'var(--accent)', fontSize: 18, marginLeft: 'auto' }}>→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
