import { Link } from 'react-router-dom';

const base = import.meta.env.BASE_URL;

export default function About() {
    const birthDate = new Date(2006, 8, 2); // September 2, 2006
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }


    const interests = [
        { icon: '🎮', label: 'Gaming' },
        { icon: '🚶', label: 'Walking' },
        { icon: '📚', label: 'Reading' },
        { icon: '💪', label: 'Fitness' },
    ];

    return (
        <section className="container section" id="about">
            {/* Hero — centered vertical */}
            <div className="hero-centered">
                <div className="hero-profile-image">
                    <img
                        src={`${base}assets/images/pp.png`}
                        alt="Galip Efe Öncü"
                        className="about-image"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.classList.add('about-image-placeholder');
                        }}
                    />
                </div>
                <h1 className="hero-profile-name">Galip Efe Öncü</h1>
                <span className="about-role">Software Engineering Student</span>
                <div className="status-badge">
                    <span className="status-dot"></span>
                    Available for Work
                </div>
                <p className="hero-profile-desc">I build immersive digital experiences and useful tools. Passionate about game mechanics, clean architecture, and solving complex problems with code.</p>
                <div className="about-interests">
                    {interests.map((item) => (
                        <span key={item.label} className="about-interest-chip">
                            <span>{item.icon}</span>
                            {item.label}
                        </span>
                    ))}
                </div>
                <blockquote className="about-quote">
                    <p>"Whatever you do in this life, it's not legendary, unless your friends are there to see it."</p>
                </blockquote>
            </div>

            {/* Bio & Details */}
            <div className="about-details">
                <div className="about-bio">
                    <h2 className="section-title">About Me</h2>
                    <p>
                        I'm <strong>{age} years old</strong>, a Software Engineering student from <strong>Konya</strong>, Turkey.
                        Currently studying at <strong>Fırat University</strong> in Elazığ, where I'm a sophomore in the Department of Software Engineering.
                    </p>
                    <p>
                        Before university, I graduated from <strong>Adilkaraağaç Vocational and Technical High School</strong>,
                        IT department, which gave me a strong technical foundation early on.
                    </p>
                    <p>
                        I'm passionate about building immersive digital experiences — from action roguelikes in Unity to modern web apps with React.
                        When I'm not coding, you'll probably find me exploring open-world RPGs (The Witcher 3 is an all-time favorite ❤️),
                        going for walks, reading, or hitting the gym.
                    </p>
                </div>

                {/* Quick Facts */}
                <div className="about-facts">
                    <div className="about-fact-item">
                        <span className="about-fact-icon">📍</span>
                        <div>
                            <span className="about-fact-label">Location</span>
                            <span className="about-fact-value">Konya, Turkey</span>
                        </div>
                    </div>
                    <div className="about-fact-item">
                        <span className="about-fact-icon">🎓</span>
                        <div>
                            <span className="about-fact-label">University</span>
                            <span className="about-fact-value">Fırat University — Software Eng. (2nd year)</span>
                        </div>
                    </div>
                    <div className="about-fact-item">
                        <span className="about-fact-icon">🌍</span>
                        <div>
                            <span className="about-fact-label">Languages</span>
                            <span className="about-fact-value">Turkish (Native) · English (B2)</span>
                        </div>
                    </div>
                    <div className="about-fact-item">
                        <span className="about-fact-icon">🎯</span>
                        <div>
                            <span className="about-fact-label">Favorite Game</span>
                            <span className="about-fact-value">The Witcher 3: Wild Hunt</span>
                        </div>
                    </div>
                </div>
            </div>



            {/* CTA Cards */}
            <div className="about-cta-section">
                <Link to="/projects" className="about-cta-card">
                    <div className="about-cta-icon">🚀</div>
                    <div className="about-cta-content">
                        <h3>My Projects</h3>
                        <p>Check out what I've been building — games, apps, and more.</p>
                    </div>
                    <span className="about-cta-arrow">→</span>
                </Link>
                <Link to="/contact" className="about-cta-card">
                    <div className="about-cta-icon">💬</div>
                    <div className="about-cta-content">
                        <h3>Get in Touch</h3>
                        <p>Have a question or want to collaborate? Let's connect.</p>
                    </div>
                    <span className="about-cta-arrow">→</span>
                </Link>
            </div>
        </section>
    );
}
