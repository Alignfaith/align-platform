import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                {/* Hero */}
                <section className="section section--primary">
                    <div className="container text-center">
                        <h1>Privacy Policy</h1>
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
                            <h2>1. Introduction</h2>
                            <p>
                                Align ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                                explains how we collect, use, disclose, and safeguard your information when you use our
                                platform.
                            </p>
                            <p>
                                By using Align, you consent to the data practices described in this policy.
                            </p>

                            <h2>2. Information We Collect</h2>

                            <h3>Personal Information</h3>
                            <p>We collect information you provide directly, including:</p>
                            <ul>
                                <li>Name and email address</li>
                                <li>Account credentials</li>
                                <li>Profile information and photos</li>
                                <li>Reflection question responses</li>
                                <li>Pillar engagement data</li>
                                <li>Communications with other members</li>
                                <li>Payment information (processed securely by third-party providers)</li>
                            </ul>

                            <h3>Automatically Collected Information</h3>
                            <p>We may automatically collect:</p>
                            <ul>
                                <li>Device information and identifiers</li>
                                <li>IP address and location data</li>
                                <li>Browser type and operating system</li>
                                <li>Usage patterns and preferences</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>

                            <h2>3. How We Use Your Information</h2>
                            <p>We use collected information to:</p>
                            <ul>
                                <li>Provide and maintain the Platform</li>
                                <li>Process your registration and manage your account</li>
                                <li>Facilitate connections between members based on pillar alignment</li>
                                <li>Process payments and subscriptions</li>
                                <li>Send important notifications and updates</li>
                                <li>Improve our services and user experience</li>
                                <li>Enforce our Terms of Service and Community Guidelines</li>
                                <li>Detect and prevent fraud or abuse</li>
                            </ul>

                            <h2>4. Information Sharing</h2>
                            <p>
                                We do not sell your personal information. We may share information with:
                            </p>
                            <ul>
                                <li><strong>Other Members:</strong> Your profile information and pillar engagement are visible to other paying members, subject to our staged photo reveal system</li>
                                <li><strong>Service Providers:</strong> Third-party vendors who help us operate the Platform (payment processing, hosting, analytics)</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                            </ul>

                            <h2>5. Photo Privacy</h2>
                            <p>
                                Align has a unique approach to photos:
                            </p>
                            <ul>
                                <li>Photos are not visible during initial discovery (Stage One)</li>
                                <li>Photos are only revealed after mutual interest and conversation (Stage Two)</li>
                                <li>All photos must comply with our modesty standards</li>
                                <li>Photos are stored securely and are not shared publicly</li>
                            </ul>

                            <h2>6. Data Security</h2>
                            <p>
                                We implement appropriate technical and organizational measures to protect your information,
                                including:
                            </p>
                            <ul>
                                <li>Encryption of data in transit and at rest</li>
                                <li>Secure server infrastructure</li>
                                <li>Regular security assessments</li>
                                <li>Access controls and authentication requirements</li>
                            </ul>
                            <p>
                                However, no method of transmission over the Internet is 100% secure. We cannot guarantee
                                absolute security.
                            </p>

                            <h2>7. Data Retention</h2>
                            <p>
                                We retain your information for as long as your account is active or as needed to provide
                                services. If you delete your account, we will delete or anonymize your information within
                                30 days, except where retention is required by law.
                            </p>

                            <h2>8. Your Rights</h2>
                            <p>Depending on your location, you may have the right to:</p>
                            <ul>
                                <li>Access your personal data</li>
                                <li>Correct inaccurate information</li>
                                <li>Request deletion of your data</li>
                                <li>Object to certain processing activities</li>
                                <li>Data portability</li>
                                <li>Withdraw consent</li>
                            </ul>
                            <p>
                                To exercise these rights, contact us at <strong>privacy@rootedplatform.com</strong>.
                            </p>

                            <h2>9. Cookies</h2>
                            <p>
                                We use cookies and similar technologies to enhance your experience, analyze usage, and
                                provide personalized features. You can control cookies through your browser settings.
                            </p>

                            <h2>10. Third-Party Links</h2>
                            <p>
                                Our Platform may contain links to third-party websites. We are not responsible for the
                                privacy practices of these external sites. We encourage you to review their privacy policies.
                            </p>

                            <h2>11. Children's Privacy</h2>
                            <p>
                                Align is not intended for individuals under 18 years of age. We do not knowingly collect
                                information from children. If we learn we have collected information from a child, we will
                                delete it promptly.
                            </p>

                            <h2>12. Changes to This Policy</h2>
                            <p>
                                We may update this Privacy Policy from time to time. We will notify you of significant
                                changes by posting the new policy on the Platform and updating the "Last updated" date.
                            </p>

                            <h2>13. Contact Us</h2>
                            <p>
                                For questions or concerns about this Privacy Policy, contact us at:
                            </p>
                            <ul>
                                <li>Email: <strong>privacy@rootedplatform.com</strong></li>
                                <li>Support: <strong>support@rootedplatform.com</strong></li>
                            </ul>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
