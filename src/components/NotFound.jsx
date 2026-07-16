import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import useSEO from '../hooks/useSEO';

export default function NotFound() {
    const { t } = useLanguage();

    useSEO({ fullTitleKey: 'seo.notFoundTitle', descriptionKey: 'seo.notFoundDesc', noIndex: true });

    return (
        <div className="page not-found-page container">
            <span className="not-found-code" aria-hidden="true">404</span>
            <h1 className="page-title">{t('notFound.title')}</h1>
            <p className="page-subtitle">{t('notFound.description')}</p>
            <Link to="/" className="btn primary">{t('notFound.backHome')} →</Link>
        </div>
    );
}
