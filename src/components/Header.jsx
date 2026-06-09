import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Header({ theme, toggleTheme }) {
    const location = useLocation();
    const { lang, toggleLang, t } = useLanguage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { to: '/', label: t('nav.about') },
        { to: '/projects', label: t('nav.projects') },
        { to: '/contact', label: t('nav.contact') },
    ];

    return (
        <div style={{ position: 'sticky', top: 8, zIndex: 50, padding: '8px 0 10px' }}>
            <div className="dock-wrapper" style={{ padding: '0 48px', display: 'grid', placeItems: 'center' }}>
                <div style={{ position: 'relative', display: 'flex', gap: 4, padding: 5, background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 14, boxShadow: '0 6px 24px rgba(0,0,0,.28)', backdropFilter: 'blur(8px)' }}>
                    <Link
                        to="/"
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: 12, textDecoration: 'none' }}
                    >
                        <div style={{ width: 18, height: 18, background: 'var(--accent)', borderRadius: 4, color: '#0a1414', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 11 }}>G</div>
                        galipefe
                    </Link>

                    <div className="dock-nav-separator" style={{ width: 1, background: 'var(--border)', margin: '4px 4px' }} />

                    <nav className="dock-nav" style={{ display: 'flex', gap: 2 }}>
                        {navItems.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                style={{
                                    padding: '6px 18px',
                                    borderRadius: 10,
                                    color: location.pathname === to ? 'var(--text)' : 'var(--muted)',
                                    fontSize: 13,
                                    background: location.pathname === to ? 'var(--card)' : 'transparent',
                                    transition: 'all .15s',
                                    textDecoration: 'none',
                                    display: 'block',
                                }}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    <button
                        className="dock-mobile-toggle"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle navigation menu"
                        style={{
                            padding: '6px 12px',
                            borderRadius: 10,
                            color: 'var(--text-2)',
                            fontFamily: 'var(--mono)',
                            fontSize: 14,
                            cursor: 'pointer',
                            background: 'transparent',
                            border: 'none',
                        }}
                    >
                        {isMobileMenuOpen ? '✕' : '☰'}
                    </button>

                    <div className="dock-nav-separator" style={{ width: 1, background: 'var(--border)', margin: '4px 4px' }} />

                    <button
                        onClick={toggleLang}
                        style={{ padding: '6px 12px', borderRadius: 10, color: 'var(--text-2)', fontFamily: 'var(--mono)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'transparent', border: 'none' }}
                        aria-label={lang === 'en' ? 'Switch language to Turkish' : 'Switch language to English'}
                    >
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
                        {lang.toUpperCase()}
                    </button>

                    <button
                        onClick={toggleTheme}
                        style={{ padding: '6px 12px', borderRadius: 10, color: 'var(--text-2)', fontFamily: 'var(--mono)', fontSize: 11, cursor: 'pointer', background: 'transparent', border: 'none' }}
                        title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
                        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {theme === 'dark' ? '◑' : '◐'}
                    </button>

                    {isMobileMenuOpen && (
                        <div
                            className="dock-mobile-dropdown"
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                marginTop: 8,
                                background: 'var(--panel)',
                                border: '1px solid var(--border)',
                                borderRadius: 12,
                                padding: 6,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                zIndex: 100
                            }}
                        >
                            {navItems.map(({ to, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    style={{
                                        padding: '10px 16px',
                                        borderRadius: 8,
                                        color: location.pathname === to ? 'var(--text)' : 'var(--muted)',
                                        background: location.pathname === to ? 'var(--card)' : 'transparent',
                                        fontSize: 13,
                                        textDecoration: 'none',
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
