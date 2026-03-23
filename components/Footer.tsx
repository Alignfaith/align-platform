import Link from 'next/link'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__inner">
                    <div className="footer__brand">
                        <div className="footer__logo">Align</div>
                        <p className="footer__tagline">Preparation comes before connection.</p>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                            A Christian-based relationship platform built on the Relationship Fitness framework by Thomas Marks.
                        </p>
                    </div>

                    <div>
                        <h4 className="footer__section-title">Platform</h4>
                        <ul className="footer__links">
                            <li><Link href="/about" className="footer__link">About</Link></li>
                            <li><Link href="/framework" className="footer__link">The Framework</Link></li>
                            <li><Link href="/pricing" className="footer__link">Membership</Link></li>
                            <li><Link href="/register" className="footer__link">Get Started</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="footer__section-title">Resources</h4>
                        <ul className="footer__links">
                            <li><Link href="/book" className="footer__link">The Book</Link></li>
                            <li><Link href="/pillars" className="footer__link">Six Pillars</Link></li>
                            <li><Link href="/faq" className="footer__link">FAQ</Link></li>
                            <li><Link href="/contact" className="footer__link">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="footer__section-title">Legal</h4>
                        <ul className="footer__links">
                            <li><Link href="/terms" className="footer__link">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="footer__link">Privacy Policy</Link></li>
                            <li><Link href="/guidelines" className="footer__link">Community Guidelines</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p>&copy; {currentYear} Align. All rights reserved.</p>
                    <p style={{ marginTop: '0.5rem' }}>
                        Built on the Relationship Fitness framework.
                    </p>
                </div>

                {/* StricklandAI Badge */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: 'var(--space-6)',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    marginTop: 'var(--space-6)'
                }}>
                    <a
                        href="https://stricklandai.com?ref=badge"
                        target="_blank"
                        rel="noopener"
                        id="strickland-badge"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.95) 100%)',
                            border: '1px solid rgba(251,191,36,0.3)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            textDecoration: 'none',
                            fontFamily: 'system-ui,-apple-system,sans-serif',
                            fontSize: '12px',
                            color: '#fff',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                    >
                        <span style={{ fontSize: '14px' }}>⚡</span>
                        <span>Optimized by <strong style={{ color: '#fbbf24' }}>Strickland</strong></span>
                    </a>
                </div>
            </div>
        </footer>
    )
}
