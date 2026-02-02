export default function Contact() {
    return (
        <section className="container section" id="contact">
            <h2 className="section-title">Connect & Skills</h2>

            <div className="contact-section">
                <div className="contact-info">
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-color)' }}>Get in Touch</h3>
                    <div className="contact-links">
                        <a href="https://github.com/GalipEfeOncu?tab=repositories" target="_blank" rel="noopener noreferrer" className="social-link">
                            <span>GitHub</span>
                            <span>@GalipEfeOncu</span>
                        </a>
                        <a href="https://www.linkedin.com/in/galiponcu/" target="_blank" rel="noopener noreferrer" className="social-link">
                            <span>LinkedIn</span>
                            <span>/in/galiponcu</span>
                        </a>
                        <a href="mailto:galipefe75@gmail.com" className="social-link">
                            <span>Email</span>
                            <span>galipefe75@gmail.com</span>
                        </a>
                    </div>
                </div>

                <div className="skills-info">
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-color)' }}>Technical Toolkit</h3>
                    <div className="skills-grid">
                        {['C#', 'Java', 'Unity 2D/3D', '.NET Framework', 'WinForms', 'MSSQL', 'REST APIs', 'Git', 'Game Design'].map(skill => (
                            <span key={skill} className="skill-pill">{skill}</span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
