import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const { lang, toggleLang, t } = useLanguage();

    const navItems = [
        { to: '/', label: t('nav.about') },
        { to: '/projects', label: t('nav.projects') },
        { to: '/contact', label: t('nav.contact') },
    ];

    return (
        <header className="header">
            <div className="container header-content">
                <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
                    <span className="logo-dot"></span>
                    Galip Efe Öncü
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={toggleLang}
                        style={{
                            background: 'transparent', border: '1px solid var(--border-color)',
                            color: 'var(--text-color)', cursor: 'pointer', padding: '0.4rem 0.8rem',
                            borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold'
                        }}
                    >
                        {lang === 'en' ? 'TR 🔄' : 'EN 🔄'}
                    </button>

                    <button
                        className="menu-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </div>

                <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    {navItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={location.pathname === item.to ? 'nav-active' : ''}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
