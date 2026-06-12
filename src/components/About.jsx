import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { SKILLS } from '../data/profile';
import { projects } from '../data/projects';

const base = import.meta.env.BASE_URL;

function computeAge() {
    const birth = new Date(2006, 8, 2);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

function formatSafeHTML(text) {
    if (!text) return '';
    const parts = text.split(/(<strong>.*?<\/strong>)/g);
    return parts.map((part, index) => {
        if (part.startsWith('<strong>') && part.endsWith('</strong>')) {
            const innerText = part.replace(/<\/?strong>/g, '');
            return <strong key={index}>{innerText}</strong>;
        }
        return part;
    });
}

function Typewriter({ text, delay = 40 }) {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText('');
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(text.substring(0, i + 1));
                i++;
            } else {
                clearInterval(timer);
            }
        }, delay);
        return () => clearInterval(timer);
    }, [text, delay]);

    return (
        <span>
            {displayedText}
            <span className="typewriter-cursor" />
        </span>
    );
}

export default function About() {
    const { t } = useLanguage();
    const age = computeAge();

    useEffect(() => {
        document.title = `${t('about.title')} | Galip Efe Öncü`;
    }, [t]);

    const interests = [
        { icon: '🎮', label: t('hero.interests.gaming') },
        { icon: '🚶', label: t('hero.interests.walking') },
        { icon: '📚', label: t('hero.interests.reading') },
        { icon: '💪', label: t('hero.interests.fitness') },
    ];

    return (
        <div className="page">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

                {/* Hero: avatar + name + role + status */}
                <div>
                    <div className="about-hero">
                        <img
                            src={`${base}assets/images/pp.webp`}
                            alt="Galip Efe Öncü"
                            className="avatar"
                            width={80}
                            height={80}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                const ph = document.createElement('div');
                                ph.className = 'avatar-placeholder';
                                ph.style.cssText = 'width:80px;height:80px;font-size:11px;';
                                ph.textContent = 'profile.webp';
                                e.target.parentNode.insertBefore(ph, e.target);
                            }}
                        />
                        <div className="about-hero-info">
                            <div className="about-hero-name">Galip Efe Öncü</div>
                            <div className="about-hero-role mono">{t('hero.role')}</div>
                            <span className="pill accent">
                                <span className="led" />
                                {t('hero.status')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Meta info row */}
                <div className="about-meta">
                    <div className="about-meta-item">
                        <span className="about-meta-label">{t('about.kvLocation')}</span>
                        <span>{t('about.facts.locationVal')}</span>
                    </div>
                    <div className="about-meta-item">
                        <span className="about-meta-label">{t('about.kvEdu')}</span>
                        <span>{t('about.facts.universityVal')}</span>
                    </div>
                    <div className="about-meta-item">
                        <span className="about-meta-label">{t('about.kvLang')}</span>
                        <span>{t('about.facts.languagesVal')}</span>
                    </div>
                    <div className="about-meta-item">
                        <span className="about-meta-label">{t('about.kvFocus')}</span>
                        <span className="accent">{t('about.facts.gameVal')}</span>
                    </div>
                </div>

                {/* Heading with Typewriter */}
                <h1 className="about-heading"><Typewriter text={t('about.heading')} /></h1>

                {/* Bio paragraphs */}
                <div className="about-bio">
                    <p>{formatSafeHTML(t('about.bio1').replace('{age}', age))}</p>
                    <p>{formatSafeHTML(t('about.bio2'))}</p>
                    <p>{formatSafeHTML(t('about.bio3'))}</p>
                </div>

                {/* Interests */}
                <div className="section-block">
                    <div className="section-label">{t('about.interestsPanel')}</div>
                    <div className="about-interests-grid">
                        {interests.map(i => (
                            <div key={i.label} className="about-interest-chip">
                                <span>{i.icon}</span>
                                <span>{i.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stack */}
                <div className="section-block">
                    <div className="section-label">{t('about.stackPanel')}</div>
                    {SKILLS.map(cat => (
                        <div key={cat.title} className="about-stack-category">
                            <div className="about-stack-label">{cat.title.toUpperCase()}</div>
                            <div className="about-stack-tags">
                                {cat.items.map(s => <span key={s} className="tag">{s}</span>)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA grid */}
                <div className="about-cta-grid">
                    <Link to="/projects" className="cta-card">
                        <div>
                            <div className="about-cta-title">{t('about.cta.projectsTitle')}</div>
                            <div className="about-cta-desc mono">{t('about.cta.projectsCount').replace('{count}', projects.length)}</div>
                        </div>
                        <span className="about-cta-arrow">→</span>
                    </Link>
                    <Link to="/contact" className="cta-card">
                        <div>
                            <div className="about-cta-title">{t('about.cta.contactTitle')}</div>
                            <div className="about-cta-desc mono">{t('about.cta.contactChannels')}</div>
                        </div>
                        <span className="about-cta-arrow">→</span>
                    </Link>
                </div>

                {/* Quote */}
                <blockquote className="about-quote">
                    {t('hero.quote')}
                </blockquote>

            </div>
        </div>
    );
}
