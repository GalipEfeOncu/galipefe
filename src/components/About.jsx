import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { SKILLS } from '../data/profile';
import { projects as staticProjects } from '../data/projects';
import TypingGame from './TypingGame';
import useSEO from '../hooks/useSEO';

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

export default function About() {
    const { t } = useLanguage();
    const age = computeAge();
    const detailsSectionRef = useRef(null);
    const [projectCount, setProjectCount] = useState(staticProjects.length);

    useEffect(() => {
        let active = true;
        let idleId;
        let timeoutId;

        async function fetchCount() {
            const { projectService } = await import('../services/projectService');
            const data = await projectService.getProjects();
            if (active && data && data.length > 0) {
                setProjectCount(data.length);
            }
        }
        if ('requestIdleCallback' in window) {
            idleId = window.requestIdleCallback(fetchCount, { timeout: 2500 });
        } else {
            timeoutId = window.setTimeout(fetchCount, 800);
        }

        return () => {
            active = false;
            if (idleId) window.cancelIdleCallback(idleId);
            if (timeoutId) window.clearTimeout(timeoutId);
        };
    }, []);

    useSEO({ fullTitleKey: 'seo.aboutTitle', descriptionKey: 'seo.aboutDesc' });

    const handleScrollDown = () => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        detailsSectionRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    };

    const interests = [
        { icon: '🎮', label: t('hero.interests.gaming') },
        { icon: '🚶', label: t('hero.interests.walking') },
        { icon: '📚', label: t('hero.interests.reading') },
        { icon: '💪', label: t('hero.interests.fitness') },
    ];

    return (
        <div className="about-page">
            
            {/* 1. 100vh Hero Landing Section (Snap Start) */}
            <section className="hero-section scroll-section">
                <div className="container">
                    <div className="hero-grid">
                        
                        {/* Hero Left Info Panel */}
                        <div className="hero-left">
                            <div className="hero-avatar-wrap">
                                <img
                                    src={`${base}assets/images/pp.webp`}
                                    alt="Galip Efe Öncü"
                                    className="hero-avatar"
                                    width={90}
                                    height={90}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        const ph = document.createElement('div');
                                        ph.className = 'avatar-placeholder';
                                        ph.style.cssText = 'width:90px;height:90px;font-size:11px;border-radius:20px;';
                                        ph.textContent = 'profile.webp';
                                        e.target.parentNode.insertBefore(ph, e.target);
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <span className="hero-intro">{t('hero.welcome')}</span>
                                <h1 className="hero-title-main">Galip Efe Öncü</h1>
                                <h2 className="hero-role">{t('hero.role')}</h2>
                            </div>

                            <p className="hero-desc-text">
                                {t('hero.desc')}
                            </p>

                            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                                <button onClick={handleScrollDown} className="btn primary">
                                    {t('about.title')} ↓
                                </button>
                                <Link to="/projects" className="btn ghost">
                                    {t('about.cta.projectsTitle')} →
                                </Link>
                            </div>
                        </div>

                        {/* Hero Right Typing Mini Game */}
                        <div className="hero-right">
                            <TypingGame />
                        </div>

                    </div>
                </div>

                {/* Animated Mouse indicator */}
                <button
                    type="button"
                    className="scroll-indicator"
                    onClick={handleScrollDown}
                    aria-label={t('about.scrollToDetails')}
                >
                    <span>{t('about.title').toLowerCase()}</span>
                    <div className="scroll-indicator-mouse">
                        <div className="scroll-indicator-wheel" />
                    </div>
                </button>
            </section>

            {/* 2. Detailed Profile Section (Snap Start) */}
            <section ref={detailsSectionRef} className="about-details scroll-section section-padding">
                <div className="container">
                    <div className="about-grid-flow">
                        
                        {/* 3 Facts Cards Grid */}
                        <div className="about-metadata-grid">
                            <div className="metadata-card">
                                <span className="metadata-card-label">{t('about.kvLocation')}</span>
                                <span className="metadata-card-value">{t('about.facts.locationVal')}</span>
                            </div>
                            <div className="metadata-card">
                                <span className="metadata-card-label">{t('about.kvEdu')}</span>
                                <span className="metadata-card-value">{t('about.facts.universityVal')}</span>
                            </div>
                            <div className="metadata-card">
                                <span className="metadata-card-label">{t('about.kvLang')}</span>
                                <span className="metadata-card-value">{t('about.facts.languagesVal')}</span>
                            </div>
                        </div>

                        {/* Biography / Story (quote placed directly below description) */}
                        <div className="about-biography">
                            <div>
                                <h3 className="about-bio-heading">{t('about.title')}</h3>
                            </div>
                            <div className="about-bio-text">
                                <p>{formatSafeHTML(t('about.bio1').replace('{age}', age))}</p>
                                <p>{formatSafeHTML(t('about.bio2'))}</p>
                                <p>{formatSafeHTML(t('about.bio3'))}</p>
                            </div>
                        </div>

                        {/* Skills / Expertise */}
                        <div className="skills-section">
                            <div>
                                <h3 className="about-bio-heading">{t('about.stackPanel')}</h3>
                            </div>
                            <div className="skills-categories">
                                {SKILLS.map(cat => (
                                    <div key={cat.titleKey} className="skills-category-box">
                                        <span className="skills-category-title">{t(cat.titleKey)}</span>
                                        <div className="skills-tags-wrap">
                                            {cat.items.map(s => (
                                                <span key={s} className="tag">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hobbies / Interests */}
                        <div className="interests-section">
                            <div>
                                <h3 className="about-bio-heading">{t('about.interestsPanel')}</h3>
                            </div>
                            <div className="interests-grid">
                                {interests.map(i => (
                                    <div key={i.label} className="interest-card">
                                        <span className="interest-icon">{i.icon}</span>
                                        <span className="interest-name">{i.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA buttons */}
                        <div className="home-cta-links">
                            <Link to="/projects" className="cta-banner-link">
                                <div className="cta-banner-content">
                                    <span className="cta-banner-title">{t('about.cta.projectsTitle')}</span>
                                    <span className="cta-banner-desc">
                                        {t('about.cta.projectsCount').replace('{count}', projectCount)}
                                    </span>
                                </div>
                                <span className="cta-banner-arrow">→</span>
                            </Link>
                            <Link to="/contact" className="cta-banner-link">
                                <div className="cta-banner-content">
                                    <span className="cta-banner-title">{t('about.cta.contactTitle')}</span>
                                    <span className="cta-banner-desc">
                                        {t('about.cta.contactChannels')}
                                    </span>
                                </div>
                                <span className="cta-banner-arrow">→</span>
                            </Link>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
