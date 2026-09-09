import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import useSEO from '../hooks/useSEO';
import TypingGame from './TypingGame';

export default function TypingTest() {
    const { t } = useLanguage();

    useSEO({ titleKey: 'typingGame.pageTitle', descriptionKey: 'seo.typingTestDesc', noIndex: true });

    return (
        <div className="page typing-test-page container">
            <div className="typing-test-heading">
                <div>
                    <span className="typing-test-eyebrow">{t('typingGame.easterEgg')}</span>
                    <h1 className="page-title">{t('typingGame.pageTitle')}</h1>
                    <p className="page-subtitle">{t('typingGame.pageSubtitle')}</p>
                </div>
                <Link className="typing-test-profile-link" to="/">← {t('typingGame.backToProfile')}</Link>
            </div>
            <div className="typing-test-panel"><TypingGame /></div>
        </div>
    );
}
