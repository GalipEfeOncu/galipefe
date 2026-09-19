import { useState, useEffect, lazy, Suspense, useRef, useCallback, useSyncExternalStore } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { useLanguage } from './context/LanguageContext';

const About = lazy(() => import('./components/About'));
const Projects = lazy(() => import('./components/Projects'));
const Contact = lazy(() => import('./components/Contact'));
const TypingTest = lazy(() => import('./components/TypingTest'));
const Modal = lazy(() => import('./components/Modal'));
const Admin = lazy(() => import('./components/Admin'));
const NotFound = lazy(() => import('./components/NotFound'));
const ProjectDetail = lazy(() => import('./components/ProjectDetail'));

let themeWithoutStorage = null;

function getPreferredTheme() {
    if (typeof window === 'undefined') return 'dark';

    try {
        const saved = window.localStorage.getItem('site_theme');
        if (saved === 'dark' || saved === 'light') return saved;
    } catch {
        if (themeWithoutStorage) return themeWithoutStorage;
    }

    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function subscribeToTheme(onChange) {
    window.addEventListener('storage', onChange);
    window.addEventListener('portfolio-theme-change', onChange);
    const media = window.matchMedia('(prefers-color-scheme: light)');
    media.addEventListener('change', onChange);
    return () => {
        window.removeEventListener('storage', onChange);
        window.removeEventListener('portfolio-theme-change', onChange);
        media.removeEventListener('change', onChange);
    };
}

function saveTheme(nextTheme) {
    try {
        window.localStorage.setItem('site_theme', nextTheme);
        themeWithoutStorage = null;
    } catch {
        themeWithoutStorage = nextTheme;
    }
    document.documentElement.setAttribute('data-theme', nextTheme);
    window.dispatchEvent(new Event('portfolio-theme-change'));
}

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
    useEffect(() => {
        window.scrollTo(0, 0);
        const frame = window.requestAnimationFrame(() => {
            document.getElementById('main-content')?.focus({ preventScroll: true });
        });
        return () => window.cancelAnimationFrame(frame);
    }, [pathname]);
    return null;
}

function App({ prerenderData }) {
    const { t } = useLanguage();
    const [selectedProject, setSelectedProject] = useState(null);
    const theme = useSyncExternalStore(subscribeToTheme, getPreferredTheme, () => 'dark');

    useEffect(() => {
        if (getPreferredTheme() === theme) document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => saveTheme(theme === 'dark' ? 'light' : 'dark');

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
            <a
                href="#main-content"
                className="skip-link"
                onClick={(e) => {
                    e.preventDefault();
                    const main = document.getElementById('main-content');
                    if (main) { main.focus(); main.scrollIntoView(); }
                }}
            >{t('app.skipToContent')}</a>
            <Header theme={theme} toggleTheme={toggleTheme} />
            <main id="main-content" tabIndex="-1">
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<About initialAge={prerenderData?.age} />} />
                        <Route path="/projects" element={<Projects initialProjects={prerenderData?.projects} onOpenModal={setSelectedProject} />} />
                        <Route path="/projects/:slug" element={<ProjectDetail initialProject={prerenderData?.project} />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/typing-test" element={<TypingTest />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </main>
            <Footer year={prerenderData?.year} />
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
