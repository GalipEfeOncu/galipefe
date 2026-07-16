import { useState, useEffect, lazy, Suspense, useRef, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { useLanguage } from './context/LanguageContext';

const About = lazy(() => import('./components/About'));
const Projects = lazy(() => import('./components/Projects'));
const Contact = lazy(() => import('./components/Contact'));
const Modal = lazy(() => import('./components/Modal'));
const Admin = lazy(() => import('./components/Admin'));
const NotFound = lazy(() => import('./components/NotFound'));

function PageLoader() {
    const { t } = useLanguage();
    return (
        <div className="page-loader" role="status" aria-live="polite">
            <span className="page-loader-spinner" aria-hidden="true" />
            <span>{t('app.loadingPage')}</span>
        </div>
    );
}

function ModalLoader() {
    const { t } = useLanguage();
    return (
        <div className="modal-overlay" role="status" aria-live="polite">
            <div className="modal-loading-card">
                <span className="page-loader-spinner" aria-hidden="true" />
                <span>{t('app.loadingProject')}</span>
            </div>
        </div>
    );
}

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
}

function App() {
    const { t } = useLanguage();
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

    const closeProject = useCallback(() => setSelectedProject(null), []);

    const scrollToTop = () => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    };

    return (
        <>
            <ScrollToTop />
            <a href="#main-content" className="skip-link">{t('app.skipToContent')}</a>
            <Header theme={theme} toggleTheme={toggleTheme} />
            <main id="main-content" tabIndex="-1">
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<About />} />
                        <Route path="/projects" element={<Projects onOpenModal={setSelectedProject} />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </main>
            <Footer />
            {selectedProject && (
                <Suspense fallback={<ModalLoader />}>
                    <Modal project={selectedProject} onClose={closeProject} />
                </Suspense>
            )}
            <button
                onClick={scrollToTop}
                className="scroll-to-top"
                aria-label={t('app.scrollToTop')}
                aria-hidden={!showScrollTop}
                tabIndex={showScrollTop ? 0 : -1}
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
