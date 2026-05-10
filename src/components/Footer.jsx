export default function Footer() {
    return (
        <footer style={{ borderTop: '1px solid var(--border-soft)', padding: '20px 24px', textAlign: 'center', color: 'var(--dim)', fontFamily: 'var(--mono)', fontSize: 11 }}>
            © {new Date().getFullYear()} Galip Efe Öncü · built with React
        </footer>
    );
}
