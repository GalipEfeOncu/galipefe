import { Link } from 'react-router-dom';

export default function Contact() {
    const contactMethods = [
        {
            name: 'GitHub',
            value: '@GalipEfeOncu',
            url: 'https://github.com/GalipEfeOncu?tab=repositories',
            description: 'Check out my repositories and open-source work',
            icon: (
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
            ),
        },
        {
            name: 'LinkedIn',
            value: '/in/galiponcu',
            url: 'https://www.linkedin.com/in/galiponcu/',
            description: 'Connect with me professionally',
            icon: (
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            ),
        },
        {
            name: 'Email',
            value: 'galipefe75@gmail.com',
            url: 'mailto:galipefe75@gmail.com',
            description: 'Reach out directly via email',
            icon: (
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
            ),
        },
    ];

    const personalLinks = [
        {
            name: 'Steam',
            username: '/id/knover',
            url: 'https://steamcommunity.com/id/knover/',
            icon: (
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M11.979 0C5.678 0 .511 4.86.022 10.96l6.432 2.658a3.387 3.387 0 0 1 1.912-.59c.064 0 .128.003.19.008l2.862-4.148V8.86a4.53 4.53 0 0 1 4.53-4.53 4.53 4.53 0 0 1 4.531 4.53 4.53 4.53 0 0 1-4.53 4.53h-.106l-4.082 2.912c0 .049.003.098.003.148a3.39 3.39 0 0 1-3.39 3.39 3.396 3.396 0 0 1-3.345-2.838L.287 14.59A12.02 12.02 0 0 0 11.979 24c6.627 0 12-5.373 12-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61a2.544 2.544 0 0 0 4.707-.93 2.544 2.544 0 0 0-2.543-2.543c-.168 0-.333.017-.494.049l1.522.63a1.872 1.872 0 0 1-1.423 3.46l-.296-.056zm8.415-6.373a3.024 3.024 0 0 0 3.02-3.02 3.024 3.024 0 0 0-3.02-3.02 3.024 3.024 0 0 0-3.02 3.02 3.024 3.024 0 0 0 3.02 3.02zm-.004-5.284a2.27 2.27 0 0 1 2.267 2.264 2.27 2.27 0 0 1-2.267 2.267 2.27 2.27 0 0 1-2.265-2.267 2.27 2.27 0 0 1 2.265-2.264z" />
                </svg>
            ),
        },
        {
            name: 'Instagram',
            username: '@galipefe75',
            url: 'https://www.instagram.com/galipefe75/',
            icon: (
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
            ),
        },
        {
            name: 'Monkeytype',
            username: 'monkeytype',
            url: 'https://monkeytype.com/account',
            icon: (
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M20 5H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 12H4V7h16v10zM6 9h2v2H6V9zm0 4h2v2H6v-2zm4-4h2v2h-2V9zm0 4h8v2h-8v-2zm4-4h2v2h-2V9zm4 0h2v2h-2V9z" />
                </svg>
            ),
        },
    ];

    const skillCategories = [
        {
            title: 'Languages',
            icon: (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M8 3a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2H3v2h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2v-2H8v-5a2 2 0 0 0-1-1.73A2 2 0 0 0 8 10V5h2V3H8zm8 0a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1v2h-1a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2v-2h2v-5a2 2 0 0 1 1-1.73A2 2 0 0 1 16 10V5h-2V3h2z" />
                </svg>
            ),
            skills: ['C#', 'Java', 'JavaScript', 'SQL', 'HTML/CSS'],
        },
        {
            title: 'Frameworks & Tools',
            icon: (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
                </svg>
            ),
            skills: ['Unity 2D/3D', '.NET Framework', 'WinForms', 'React', 'Git'],
        },
        {
            title: 'Backend & Database',
            icon: (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 3C7 3 3 4.79 3 7v10c0 2.21 4 4 9 4s9-1.79 9-4V7c0-2.21-4-4-9-4zm0 2c4.42 0 7 1.49 7 2s-2.58 2-7 2-7-1.49-7-2 2.58-2 7-2zM5 15.36V13.11c1.33.76 3.54 1.33 6 1.45v2.05c-2.66-.12-4.88-.73-6-1.25zm14 0c-1.12.52-3.34 1.13-6 1.25v-2.05c2.46-.12 4.67-.69 6-1.45v2.25zM5 11.36V9.11c1.33.76 3.54 1.33 6 1.45v2.05c-2.66-.12-4.88-.73-6-1.25zm14 0c-1.12.52-3.34 1.13-6 1.25V10.56c2.46-.12 4.67-.69 6-1.45v2.25z" />
                </svg>
            ),
            skills: ['MSSQL', 'REST APIs', 'Entity Framework'],
        },
        {
            title: 'Game Development',
            icon: (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                </svg>
            ),
            skills: ['Game Design', 'Level Design', '2D/3D Physics', 'UI/UX for Games'],
        },
    ];

    return (
        <section className="container section" id="contact">
            {/* Page Header */}
            <div className="contact-header">
                <h1 className="contact-title">Let's Connect</h1>
                <p className="contact-subtitle">
                    Have a project idea, want to collaborate, or just want to say hi? Feel free to reach out through any of these channels.
                </p>
            </div>

            {/* Professional Contact Cards */}
            <div className="contact-cards">
                {contactMethods.map((method) => (
                    <a
                        key={method.name}
                        href={method.url}
                        target={method.url.startsWith('mailto') ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                        className="contact-card"
                    >
                        <div className="contact-card-icon">{method.icon}</div>
                        <div className="contact-card-info">
                            <h3 className="contact-card-name">{method.name}</h3>
                            <span className="contact-card-value">{method.value}</span>
                            <p className="contact-card-desc">{method.description}</p>
                        </div>
                        <span className="contact-card-arrow">→</span>
                    </a>
                ))}
            </div>

            {/* Personal Profiles */}
            <div className="personal-section">
                <h2 className="section-title">Find Me Elsewhere</h2>
                <div className="personal-links">
                    {personalLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="personal-link-card"
                        >
                            <span className="personal-link-icon">{link.icon}</span>
                            <div className="personal-link-info">
                                <span className="personal-link-name">{link.name}</span>
                                <span className="personal-link-user">{link.username}</span>
                            </div>
                            <span className="personal-link-arrow">→</span>
                        </a>
                    ))}
                </div>
            </div>

            {/* Skills Section */}
            <div className="skills-section">
                <h2 className="section-title">Technical Skills</h2>
                <div className="skills-categories">
                    {skillCategories.map((category) => (
                        <div key={category.title} className="skill-category">
                            <div className="skill-category-header">
                                <span className="skill-category-icon">{category.icon}</span>
                                <h3 className="skill-category-title">{category.title}</h3>
                            </div>
                            <div className="skill-category-items">
                                {category.skills.map((skill) => (
                                    <span key={skill} className="skill-pill">{skill}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="contact-cta">
                <div className="contact-cta-content">
                    <h2>Interested in working together?</h2>
                    <p>Check out my projects to see what I've been building, or drop me a message!</p>
                </div>
                <Link to="/projects" className="contact-cta-btn">
                    View Projects →
                </Link>
            </div>
        </section>
    );
}
