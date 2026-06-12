import { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

const About = lazy(() => import('./components/About'));
const Projects = lazy(() => import('./components/Projects'));
const Contact = lazy(() => import('./components/Contact'));
const Modal = lazy(() => import('./components/Modal'));
const Admin = lazy(() => import('./components/Admin'));

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
    const tickingRef = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!tickingRef.current) {
                tickingRef.current = true;
                requestAnimationFrame(() => {
                    const shouldShow = window.scrollY > 400;
                    setShowScrollTop(prev => prev !== shouldShow ? shouldShow : prev);
                    tickingRef.current = false;
                });
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
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
                <Suspense fallback={null}>
                    <Routes>
                        <Route path="/" element={<About />} />
                        <Route path="/projects" element={<Projects onOpenModal={setSelectedProject} />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/admin" element={<Admin />} />
                    </Routes>
                </Suspense>
            </main>
            <Footer />
            {selectedProject && (
                <Suspense fallback={null}>
                    <Modal project={selectedProject} onClose={() => setSelectedProject(null)} />
                </Suspense>
            )}
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
                    opacity: showScrollTop ? 1 : 0,
                    pointerEvents: showScrollTop ? 'auto' : 'none',
                    transform: showScrollTop ? 'translateY(0)' : 'translateY(8px)',
                }}
            >
                ↑
            </button>
        </>
    );
}

export default App;
