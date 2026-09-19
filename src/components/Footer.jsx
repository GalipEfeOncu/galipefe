import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { CONTACTS } from '../data/profile';

export default function Footer({ year }) {
    const { t } = useLanguage();
    const displayYear = year ?? new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="site-footer-inner">
                <span>© {displayYear} Galip Efe Öncü · {t('footer.builtWith')}</span>
                <nav aria-label={t('footer.links')} className="site-footer-links">
                    <Link to="/projects">{t('nav.projects')}</Link>
                    <Link to="/contact">{t('nav.contact')}</Link>
                    {CONTACTS.slice(0, 2).map(({ name, url }) => (
                        <a key={name} href={url} target="_blank" rel="noopener noreferrer">{name}</a>
                    ))}
                </nav>
            </div>
        </footer>
    );
}
