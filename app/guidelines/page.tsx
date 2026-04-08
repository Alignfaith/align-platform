import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Shield, Heart, Users, Camera, MessageSquare, AlertTriangle } from 'lucide-react'

const guidelines = [
    {
        icon: Heart,
        title: 'Faith-Forward Engagement',
        rules: [
            'Engage with genuine respect for Christian values',
            'Support others in their growth journey',
            'Approach connections with prayer and discernment',
            'Honor God in all interactions',
        ],
    },
    {
        icon: Users,
        title: 'Respectful Communication',
        rules: [
            'Treat all members with dignity and kindness',
            'No harassment, bullying, or hateful language',
            'Keep conversations appropriate and edifying',
            'Respect boundaries when someone is not interested',
        ],
    },
    {
        icon: Camera,
        title: 'Photo Standards',
        rules: [
            'No bikini or swimsuit photos',
            'No shirtless or topless photos',
            'No sexually suggestive images',
            'Photos must be accurate and recent (within 2 years)',
            'No photos with alcohol, drugs, or inappropriate content',
        ],
    },
    {
        icon: MessageSquare,
        title: 'Messaging Conduct',
        rules: [
            'No sexually explicit messages or requests',
            'No solicitation of money or financial information',
            'No spam or promotional content',
            'Report suspicious or concerning messages immediately',
        ],
    },
    {
        icon: Shield,
        title: 'Authenticity Requirements',
        rules: [
            'Use your real name and identity',
            'Be honest in your profile and reflections',
            'Accurately represent your pillar engagement',
            'No fake accounts or impersonation',
            'Disclose important information honestly (divorced, children, etc.)',
        ],
    },
    {
        icon: AlertTriangle,
        title: 'Prohibited Behavior',
        rules: [
            'No married or separated individuals seeking relationships',
            'No scamming, catfishing, or deceptive behavior',
            'No promotion of other platforms or services',
            'No requests for in-person meetings before establishing trust',
            'No sharing of other members\' information without consent',
        ],
    },
]

export default function GuidelinesPage() {
    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                {/* Hero */}
                <section className="section section--primary">
                    <div className="container text-center">
                        <h1 style={{ marginBottom: 'var(--space-4)' }}>Community Guidelines</h1>
                        <p style={{ fontSize: 'var(--text-xl)', opacity: 0.9, maxWidth: '700px', margin: '0 auto' }}>
                            ALIGN is a sacred space for intentional, faith based connection. These guidelines
                            protect our community and ensure a positive experience for everyone.
                        </p>
                    </div>
                </section>

                {/* Core Values */}
                <section className="section section--cream">
                    <div className="container">
                        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: 'var(--space-12)' }}>
                            <h2 style={{ marginBottom: 'var(--space-4)' }}>Our Core Values</h2>
                            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-slate)' }}>
                                Every member of ALIGN commits to uphold these values:
                            </p>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, 1fr)',
                            gap: 'var(--space-4)',
                            maxWidth: '900px',
                            margin: '0 auto',
                        }}>
                            {[
                                'Preparation comes before connection',
                                'Faith is foundational',
                                'Character matters more than appearance',
                                'Everyone sees the same experience',
                                'Growth matters more than transactions',
                            ].map((value, index) => (
                                <div key={index} style={{
                                    backgroundColor: 'var(--color-white)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: 'var(--space-4)',
                                    textAlign: 'center',
                                    boxShadow: 'var(--shadow-sm)',
                                }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: 'var(--radius-full)',
                                        backgroundColor: 'var(--color-primary)',
                                        color: 'var(--color-white)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto var(--space-3)',
                                        fontWeight: 700,
                                        fontSize: 'var(--text-sm)',
                                    }}>
                                        {index + 1}
                                    </div>
                                    <p style={{ fontSize: 'var(--text-sm)', marginBottom: 0, fontWeight: 500 }}>
                                        {value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Guidelines */}
                <section className="section section--white">
                    <div className="container">
                        <h2 className="text-center" style={{ marginBottom: 'var(--space-10)' }}>
                            Community Standards
                        </h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                            gap: 'var(--space-6)',
                        }}>
                            {guidelines.map((section) => (
                                <div key={section.title} className="card">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: 'var(--radius-full)',
                                            backgroundColor: 'var(--color-blush)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <section.icon size={24} color="var(--color-primary)" />
                                        </div>
                                        <h3 style={{ marginBottom: 0, fontSize: 'var(--text-xl)' }}>{section.title}</h3>
                                    </div>
                                    <ul style={{
                                        paddingLeft: 'var(--space-6)',
                                        color: 'var(--color-slate)',
                                        fontSize: 'var(--text-sm)',
                                    }}>
                                        {section.rules.map((rule, index) => (
                                            <li key={index} style={{ marginBottom: 'var(--space-2)' }}>{rule}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Enforcement */}
                <section className="section section--blush">
                    <div className="container">
                        <div style={{
                            maxWidth: '800px',
                            margin: '0 auto',
                            backgroundColor: 'var(--color-white)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--space-10)',
                            boxShadow: 'var(--shadow-md)',
                        }}>
                            <h2 style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                                Enforcement Policy
                            </h2>
                            <p style={{ marginBottom: 'var(--space-4)' }}>
                                <strong>Participation in ALIGN is a privilege, not a right.</strong>
                            </p>
                            <p style={{ color: 'var(--color-slate)', marginBottom: 'var(--space-4)' }}>
                                We take violations of our Community Guidelines seriously. Depending on the severity
                                of the violation, consequences may include:
                            </p>
                            <ul style={{ marginBottom: 'var(--space-6)' }}>
                                <li>Warning and education</li>
                                <li>Temporary suspension</li>
                                <li>Permanent removal from the platform</li>
                            </ul>

                            <div style={{
                                backgroundColor: 'var(--color-blush)',
                                borderRadius: 'var(--radius-lg)',
                                padding: 'var(--space-6)',
                                borderLeft: '4px solid var(--color-primary)',
                            }}>
                                <h4 style={{ marginBottom: 'var(--space-2)' }}>Important Notice</h4>
                                <p style={{ marginBottom: 0, color: 'var(--color-charcoal)' }}>
                                    If you are removed for violating Community Guidelines:
                                </p>
                                <ul style={{ marginBottom: 0, marginTop: 'var(--space-2)' }}>
                                    <li>Access will be terminated immediately</li>
                                    <li>Any paid membership fees are <strong>non-refundable</strong></li>
                                    <li>You may not create a new account</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Report */}
                <section className="section section--cream">
                    <div className="container text-center">
                        <h2 style={{ marginBottom: 'var(--space-4)' }}>Report a Concern</h2>
                        <p style={{ color: 'var(--color-slate)', marginBottom: 'var(--space-6)', maxWidth: '600px', margin: '0 auto var(--space-6)' }}>
                            If you witness or experience behavior that violates these guidelines, please report it
                            immediately. Your reports help us maintain a safe community.
                        </p>
                        <Link href="/contact" className="btn btn--primary btn--lg">
                            Contact Support
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
