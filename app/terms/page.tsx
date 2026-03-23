import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsPage() {
    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                {/* Hero */}
                <section className="section section--primary">
                    <div className="container text-center">
                        <h1>Terms of Service</h1>
                        <p style={{ opacity: 0.9 }}>Last updated: December 2024</p>
                    </div>
                </section>

                {/* Content */}
                <section className="section section--cream">
                    <div className="container">
                        <div style={{
                            maxWidth: '800px',
                            margin: '0 auto',
                            backgroundColor: 'var(--color-white)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--space-10)',
                            boxShadow: 'var(--shadow-md)',
                        }}>
                            <h2>1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using Align ("the Platform"), you agree to be bound by these Terms of Service.
                                If you do not agree to these terms, you may not use the Platform.
                            </p>
                            <p>
                                Align is a Christian-based relationship platform built on the Relationship Fitness framework.
                                By using this Platform, you affirm your commitment to engage with the community in accordance
                                with our Christian values and community guidelines.
                            </p>

                            <h2>2. Eligibility</h2>
                            <p>
                                To use Align, you must:
                            </p>
                            <ul>
                                <li>Be at least 18 years of age</li>
                                <li>Be legally single (not married)</li>
                                <li>Agree to abide by our Community Guidelines</li>
                                <li>Complete the required registration reflections honestly</li>
                                <li>Understand and commit to the Relationship Fitness framework principles</li>
                            </ul>

                            <h2>3. Account Registration</h2>
                            <p>
                                When creating an account, you agree to provide accurate, current, and complete information.
                                You are responsible for maintaining the confidentiality of your account credentials and for
                                all activities under your account.
                            </p>

                            <h2>4. Membership Tiers</h2>
                            <p>
                                Align offers the following membership levels:
                            </p>
                            <ul>
                                <li><strong>Free Tier:</strong> Account creation, onboarding, reflection completion, and private pillar engagement</li>
                                <li><strong>Tier 1 (Preparation Engagement):</strong> Paid tier allowing member viewing and limited connections</li>
                                <li><strong>Tier 2 (Connection Plus):</strong> Premium tier with advanced features and priority support</li>
                            </ul>
                            <p>
                                Paid memberships are billed according to the selected plan (monthly or 6-month commitment).
                                Prices are subject to change with notice.
                            </p>

                            <h2>5. Code of Conduct</h2>
                            <p>
                                All members must:
                            </p>
                            <ul>
                                <li>Treat all members with respect and dignity</li>
                                <li>Engage honestly and authentically</li>
                                <li>Maintain appropriate boundaries in all communications</li>
                                <li>Report any concerning behavior to our support team</li>
                                <li>Refrain from harassment, discrimination, or abusive language</li>
                            </ul>

                            <h2>6. Photo Standards</h2>
                            <p>
                                The following types of photos are strictly prohibited:
                            </p>
                            <ul>
                                <li>Bikini or swimsuit photos</li>
                                <li>Shirtless or topless photos</li>
                                <li>Sexually suggestive images</li>
                                <li>Photos containing alcohol, drugs, or inappropriate content</li>
                            </ul>
                            <p>
                                Violation of photo standards will result in immediate removal from the Platform.
                            </p>

                            <h2>7. Enforcement and Removal</h2>
                            <p>
                                Align reserves the right to remove any member who violates these Terms of Service or
                                Community Guidelines. Participation in Align is a privilege, not a right.
                            </p>
                            <p>
                                If removed for policy violations:
                            </p>
                            <ul>
                                <li>Access will be terminated immediately</li>
                                <li>Any paid membership fees are non-refundable</li>
                                <li>You may not create a new account without permission</li>
                            </ul>

                            <h2>8. Intellectual Property</h2>
                            <p>
                                The Align platform, including all content, features, and functionality, is owned by
                                Align and is protected by copyright, trademark, and other intellectual property laws.
                            </p>
                            <p>
                                The Relationship Fitness framework and associated materials are the intellectual property
                                of Thomas Marks.
                            </p>

                            <h2>9. Disclaimer of Warranties</h2>
                            <p>
                                Align is provided "as is" without warranties of any kind. We do not guarantee that you
                                will find a relationship partner through our Platform. Success depends on individual
                                effort, growth, and God's timing.
                            </p>

                            <h2>10. Limitation of Liability</h2>
                            <p>
                                Align shall not be liable for any indirect, incidental, special, consequential, or
                                punitive damages arising from your use of the Platform.
                            </p>

                            <h2>11. Changes to Terms</h2>
                            <p>
                                We reserve the right to modify these Terms of Service at any time. Continued use of
                                the Platform after changes constitutes acceptance of the new terms.
                            </p>

                            <h2>12. Contact</h2>
                            <p>
                                For questions about these Terms of Service, please contact us at:
                                <strong> legal@rootedplatform.com</strong>
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
