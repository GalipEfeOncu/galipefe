import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import useSEO from '../hooks/useSEO';
import TypingGame from './TypingGame';

export default function TypingTest() {
    const { lang, t } = useLanguage();

    useSEO({ titleKey: 'typingGame.pageTitle', descriptionKey: 'seo.typingTestDesc', noIndex: true });

    return (
        <div className="page typing-test-page container">
            <div className="typing-test-utility">
                <span>{t('typingGame.easterEgg')}</span>
                <Link className="typing-test-profile-link" to="/">← {t('typingGame.backToProfile')}</Link>
            </div>
            <div className="typing-test-panel">
                <div className="typing-test-signal-burst" aria-hidden="true">
                    {Array.from({ length: 12 }, (_, index) => <span key={index} />)}
                </div>
                <TypingGame key={lang} />
            </div>
        </div>
    );
}
