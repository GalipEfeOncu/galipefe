import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const navItems = [
    { to: '/', label: 'About' },
    { to: '/projects', label: 'Projects' },
    { to: '/contact', label: 'Contact' },
];

export default function Header({ theme, toggleTheme }) {
    const location = useLocation();
    const { lang, toggleLang } = useLanguage();

    return (
        <div style={{ position: 'sticky', top: 8, zIndex: 50, padding: '8px 0 10px' }}>
            <div className="dock-wrapper" style={{ padding: '0 48px', display: 'grid', placeItems: 'center' }}>
                <div style={{ display: 'flex', gap: 4, padding: 5, background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 14, boxShadow: '0 6px 24px rgba(0,0,0,.28)', backdropFilter: 'blur(8px)' }}>
                    <Link
                        to="/"
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: 12, textDecoration: 'none' }}
                    >
                        <div style={{ width: 18, height: 18, background: 'var(--accent)', borderRadius: 4, color: '#0a1414', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 11 }}>G</div>
                        galipefe
                    </Link>

                    <div style={{ width: 1, background: 'var(--border)', margin: '4px 4px' }} />

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

                    <div style={{ width: 1, background: 'var(--border)', margin: '4px 4px' }} />

                    <button
                        onClick={toggleLang}
                        style={{ padding: '6px 12px', borderRadius: 10, color: 'var(--text-2)', fontFamily: 'var(--mono)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'transparent', border: 'none' }}
                    >
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
                        {lang.toUpperCase()}
                    </button>

                    <button
                        onClick={toggleTheme}
                        style={{ padding: '6px 12px', borderRadius: 10, color: 'var(--text-2)', fontFamily: 'var(--mono)', fontSize: 11, cursor: 'pointer', background: 'transparent', border: 'none' }}
                        title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
                    >
                        {theme === 'dark' ? '◑' : '◐'}
                    </button>
                </div>
            </div>
        </div>
    );
}
