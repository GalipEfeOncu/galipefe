import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer style={{ borderTop: '1px solid var(--border-soft)', padding: '20px 24px', textAlign: 'center', color: 'var(--dim)', fontFamily: 'var(--mono)', fontSize: 11 }}>
            © {new Date().getFullYear()} Galip Efe Öncü · {t('footer.builtWith')}
        </footer>
    );
}
