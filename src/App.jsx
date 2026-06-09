import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Modal from './components/Modal';

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
}

function App() {
    const [selectedProject, setSelectedProject] = useState(null);
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('site_theme');
        const validThemes = ['dark', 'light'];
        if (saved && validThemes.includes(saved)) return saved;

        // Dynamic fallback based on prefers-color-scheme
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('site_theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <ScrollToTop />
            <Header theme={theme} toggleTheme={toggleTheme} />
            <main>
                <Routes>
                    <Route path="/" element={<About />} />
                    <Route path="/projects" element={<Projects onOpenModal={setSelectedProject} />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </main>
            <Footer />
            {selectedProject && (
                <Modal project={selectedProject} onClose={() => setSelectedProject(null)} />
            )}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="scroll-to-top"
                    aria-label="Scroll to top"
                    style={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'var(--panel)',
                        border: '1px solid var(--border)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        color: 'var(--accent)',
                        fontSize: 18,
                        cursor: 'pointer',
                        display: 'grid',
                        placeItems: 'center',
                        zIndex: 90,
                        transition: 'all 0.2s',
                    }}
                >
                    ↑
                </button>
            )}
        </>
    );
}

export default App;
