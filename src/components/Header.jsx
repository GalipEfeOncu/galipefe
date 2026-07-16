import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Header({ theme, toggleTheme }) {
    const location = useLocation();
    const { lang, toggleLang, t } = useLanguage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const headerRef = useRef(null);

    const navItems = [
        { to: '/', label: t('nav.about') },
        { to: '/projects', label: t('nav.projects') },
        { to: '/contact', label: t('nav.contact') },
    ];

    useEffect(() => {
        if (!isMobileMenuOpen) return undefined;

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') setIsMobileMenuOpen(false);
        };
        const closeOnOutsideClick = (event) => {
            if (!headerRef.current?.contains(event.target)) setIsMobileMenuOpen(false);
        };

        document.addEventListener('keydown', closeOnEscape);
        document.addEventListener('pointerdown', closeOnOutsideClick);
        return () => {
            document.removeEventListener('keydown', closeOnEscape);
            document.removeEventListener('pointerdown', closeOnOutsideClick);
        };
    }, [isMobileMenuOpen]);

    return (
        <header ref={headerRef} style={{ position: 'fixed', top: 12, left: 0, right: 0, zIndex: 100, padding: '0 16px' }}>
            <div className="dock-wrapper">
                <div className="dock-container">
                    
                    {/* Left Group: Logo */}
                    <div className="dock-group-left">
                        <Link to="/" className="dock-logo" onClick={() => setIsMobileMenuOpen(false)}>
                            <div className="dock-logo-box">G</div>
                            galipefe
                        </Link>
                    </div>

                    {/* Center Group: Desktop Navigation */}
                    <nav className="dock-nav" aria-label={t('header.primaryNavigation')}>
                        {navItems.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                aria-current={location.pathname === to ? 'page' : undefined}
                                className={`dock-nav-link ${location.pathname === to ? 'active' : ''}`}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Group: Action Controls */}
                    <div className="dock-group-right">
                        {/* Language Switch Button */}
                        <button
                            onClick={toggleLang}
                            className="dock-btn"
                            aria-label={lang === 'en' ? t('header.switchToTurkish') : t('header.switchToEnglish')}
                        >
                            <span style={{ 
                                width: 6, 
                                height: 6, 
                                borderRadius: '50%', 
                                background: 'var(--accent)', 
                                display: 'inline-block'
                            }} />
                            {lang.toUpperCase()}
                        </button>

                        <div className="dock-separator" />

                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="dock-btn"
                            title={theme === 'dark' ? t('header.switchToLight') : t('header.switchToDark')}
                            aria-label={theme === 'dark' ? t('header.switchToLight') : t('header.switchToDark')}
                        >
                            {theme === 'dark' ? '◑' : '◐'}
                        </button>

                        {/* Mobile Menu Toggle Button (Controlled via CSS display queries) */}
                        <button
                            className="dock-mobile-toggle dock-btn"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label={t('header.toggleNavigation')}
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-navigation"
                        >
                            {isMobileMenuOpen ? '✕' : '☰'}
                        </button>
                    </div>

                    {/* Mobile Navigation Dropdown */}
                    {isMobileMenuOpen && (
                        <nav
                            id="mobile-navigation"
                            aria-label={t('header.mobileNavigation')}
                            className="dock-mobile-dropdown"
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 6,
                                right: 6,
                                marginTop: 8,
                                background: 'var(--panel)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--r-md)',
                                padding: 6,
                                boxShadow: 'var(--shadow-lg)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 4,
                                zIndex: 110,
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)'
                            }}
                        >
                            {navItems.map(({ to, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    aria-current={location.pathname === to ? 'page' : undefined}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`dock-nav-link ${location.pathname === to ? 'active' : ''}`}
                                    style={{ 
                                        width: '100%', 
                                        display: 'block', 
                                        textAlign: 'left', 
                                        padding: '10px 16px',
                                        background: location.pathname === to ? 'var(--card-hover)' : 'transparent'
                                    }}
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    )}

                </div>
            </div>
        </header>
    );
}
