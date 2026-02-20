import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { to: '/', label: 'About' },
        { to: '/projects', label: 'Projects' },
        { to: '/contact', label: 'Contact' },
    ];

    return (
        <header className="header">
            <div className="container header-content">
                <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
                    <span className="logo-dot"></span>
                    Galip Efe Öncü
                </Link>

                <button
                    className="menu-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>

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
