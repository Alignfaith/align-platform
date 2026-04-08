import Link from 'next/link'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__inner">
                    <div className="footer__brand">
                        <div className="footer__logo">ALIGN</div>
                        <p className="footer__tagline">Preparation comes before connection.</p>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                            A Christian-based relationship platform built on the Relationship Fitness framework by Thomas Marks.
                        </p>
                    </div>

                    <div>
                        <h4 className="footer__section-title">Platform</h4>
                        <ul className="footer__links">
                            <li><Link href="/p/about" className="footer__link">About</Link></li>
                            <li><Link href="/p/the-framework" className="footer__link">The Framework</Link></li>
                            <li><Link href="/pricing" className="footer__link">Membership</Link></li>
                            <li><Link href="/register" className="footer__link">Get Started</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="footer__section-title">Resources</h4>
                        <ul className="footer__links">
                            <li><Link href="/book" className="footer__link">The Book</Link></li>
                            <li><Link href="/pillars" className="footer__link">Six Pillars</Link></li>
                            <li><Link href="/p/faq" className="footer__link">FAQ</Link></li>
                            <li><Link href="/contact" className="footer__link">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="footer__section-title">Legal</h4>
                        <ul className="footer__links">
                            <li><Link href="/p/terms-of-service" className="footer__link">Terms of Service</Link></li>
                            <li><Link href="/p/privacy-policy" className="footer__link">Privacy Policy</Link></li>
                            <li><Link href="/p/community-guidelines" className="footer__link">Community Guidelines</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p>&copy; {currentYear} ALIGN. All rights reserved.</p>
                    <p style={{ marginTop: '0.5rem' }}>
                        Built on the Relationship Fitness framework.
                    </p>
                </div>

            </div>
        </footer>
    )
}
