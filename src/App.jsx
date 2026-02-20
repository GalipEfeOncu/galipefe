import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Modal from './components/Modal';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [selectedProject, setSelectedProject] = useState(null);

  const openModal = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={
          <main>
            <Hero />
            <About />
          </main>
        } />
        <Route path="/projects" element={
          <main>
            <Projects onOpenModal={openModal} />
          </main>
        } />
        <Route path="/contact" element={
          <main>
            <Contact />
          </main>
        } />
      </Routes>
      <Footer />
      {selectedProject && (
        <Modal project={selectedProject} onClose={closeModal} />
      )}
    </>
  );
}

export default App;
