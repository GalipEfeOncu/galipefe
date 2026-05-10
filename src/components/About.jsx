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
        <section className="container section" id="about">
            {/* Hero — centered vertical */}
            <div className="hero-centered">
                <div className="hero-profile-image">
                    <img
                        src={`${base}assets/images/pp.png`}
                        alt="Galip Efe Öncü"
                        className="about-image"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.classList.add('about-image-placeholder');
                        }}
                    />
                </div>
                <h1 className="hero-profile-name">Galip Efe Öncü</h1>
                <span className="about-role">{t('hero.role')}</span>
                <div className="status-badge">
                    <span className="status-dot"></span>
                    {t('hero.status')}
                </div>
                <p className="hero-profile-desc">{t('hero.desc')}</p>
                <div className="about-interests">
                    {interests.map((item) => (
                        <span key={item.label} className="about-interest-chip">
                            <span>{item.icon}</span>
                            {item.label}
                        </span>
                    ))}
                </div>
                <blockquote className="about-quote">
                    <p>{t('hero.quote')}</p>
                </blockquote>
            </div>

            {/* Bio & Details */}
            <div className="about-details">
                <div className="about-bio">
                    <h2 className="section-title">{t('about.title')}</h2>
                    <p dangerouslySetInnerHTML={{ __html: t('about.bio1').replace('{age}', age) }}></p>
                    <p dangerouslySetInnerHTML={{ __html: t('about.bio2') }}></p>
                    <p dangerouslySetInnerHTML={{ __html: t('about.bio3') }}></p>
                </div>

                {/* Quick Facts */}
                <div className="about-facts">
                    <div className="about-fact-item">
                        <span className="about-fact-icon">📍</span>
                        <div>
                            <span className="about-fact-label">{t('about.facts.location')}</span>
                            <span className="about-fact-value">{t('about.facts.locationVal')}</span>
                        </div>
                    </div>
                    <div className="about-fact-item">
                        <span className="about-fact-icon">🎓</span>
                        <div>
                            <span className="about-fact-label">{t('about.facts.university')}</span>
                            <span className="about-fact-value">{t('about.facts.universityVal')}</span>
                        </div>
                    </div>
                    <div className="about-fact-item">
                        <span className="about-fact-icon">🌍</span>
                        <div>
                            <span className="about-fact-label">{t('about.facts.languages')}</span>
                            <span className="about-fact-value">{t('about.facts.languagesVal')}</span>
                        </div>
                    </div>
                    <div className="about-fact-item">
                        <span className="about-fact-icon">🎯</span>
                        <div>
                            <span className="about-fact-label">{t('about.facts.game')}</span>
                            <span className="about-fact-value">{t('about.facts.gameVal')}</span>
                        </div>
                    </div>
                </div>
            </div>



            {/* CTA Cards */}
            <div className="about-cta-section">
                <Link to="/projects" className="about-cta-card">
                    <div className="about-cta-icon">🚀</div>
                    <div className="about-cta-content">
                        <h3>{t('about.cta.projectsTitle')}</h3>
                        <p>{t('about.cta.projectsDesc')}</p>
                    </div>
                    <span className="about-cta-arrow">→</span>
                </Link>
                <Link to="/contact" className="about-cta-card">
                    <div className="about-cta-icon">💬</div>
                    <div className="about-cta-content">
                        <h3>{t('about.cta.contactTitle')}</h3>
                        <p>{t('about.cta.contactDesc')}</p>
                    </div>
                    <span className="about-cta-arrow">→</span>
                </Link>
            </div>
        </section>
    );
}
