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
    const [theme, setTheme] = useState(() => localStorage.getItem('site_theme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('site_theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

    return (
        <>
            <ScrollToTop />
            <Header theme={theme} toggleTheme={toggleTheme} />
            <main style={{ padding: '24px 48px 80px' }}>
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
        </>
    );
}

export default App;
