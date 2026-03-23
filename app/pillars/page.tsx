import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SixPillars from '@/components/SixPillars'
import Link from 'next/link'
import { ArrowRight, Church, Brain, Dumbbell, Wallet, Sparkles, Heart } from 'lucide-react'

const pillarDetails = [
    {
        icon: Church,
        name: 'Spiritual Fitness',
        color: '#C41E3A',
        description: 'Your relationship with God is the foundation of all other areas.',
        details: [
            'Consistent prayer and devotional life',
            'Active engagement with Scripture',
            'Church community involvement',
            'Understanding your identity in Christ',
            'Developing spiritual discernment',
            'Growing in faith and trust',
        ],
        questions: [
            'How consistent is my prayer life?',
            'Am I actively growing in my faith?',
            'Do I seek God\'s guidance in major decisions?',
        ],
    },
    {
        icon: Brain,
        name: 'Mental Fitness',
        color: '#3B82F6',
        description: 'Emotional intelligence and mental clarity are essential for healthy relationships.',
        details: [
            'Emotional awareness and regulation',
            'Healthy communication patterns',
            'Conflict resolution skills',
            'Mental health stewardship',
            'Continuous learning and growth mindset',
            'Breaking unhealthy thought patterns',
        ],
        questions: [
            'How do I handle stress and conflict?',
            'Am I self-aware about my emotional patterns?',
            'Have I addressed past trauma or wounds?',
        ],
    },
    {
        icon: Dumbbell,
        name: 'Physical Fitness',
        color: '#10B981',
        description: 'Stewarding your body honors God and prepares you for the demands of partnership.',
        details: [
            'Regular physical activity and exercise',
            'Healthy eating and nutrition habits',
            'Adequate rest and recovery',
            'Managing energy and vitality',
            'Discipline in physical habits',
            'Long-term health consciousness',
        ],
        questions: [
            'Am I taking care of my body as a temple?',
            'Do I have consistent healthy habits?',
            'Am I disciplined in physical self-care?',
        ],
    },
    {
        icon: Wallet,
        name: 'Financial Fitness',
        color: '#F59E0B',
        description: 'Financial wisdom and stewardship create stability for your future.',
        details: [
            'Budgeting and financial planning',
            'Debt management and elimination',
            'Savings and emergency preparedness',
            'Generosity and tithing',
            'Career development and income growth',
            'Understanding of biblical financial principles',
        ],
        questions: [
            'Am I living within my means?',
            'Do I have financial goals and a plan?',
            'Am I generous with my resources?',
        ],
    },
    {
        icon: Sparkles,
        name: 'Appearance Fitness',
        color: '#8B5CF6',
        description: 'How you present yourself reflects your inner growth and intentionality.',
        details: [
            'Personal grooming and hygiene',
            'Intentional wardrobe and style',
            'Confidence in presentation',
            'Appropriate modesty standards',
            'First impressions and professionalism',
            'Aligning outer presentation with inner values',
        ],
        questions: [
            'Does my appearance reflect who I am becoming?',
            'Am I presenting myself with intention?',
            'Do I maintain healthy standards of care?',
        ],
    },
    {
        icon: Heart,
        name: 'Intimacy Fitness',
        color: '#EC4899',
        description: 'Preparing for emotional and physical intimacy within covenant relationship.',
        details: [
            'Understanding healthy boundaries',
            'Sexual purity and God\'s design for intimacy',
            'Emotional vulnerability skills',
            'Past relationship healing',
            'Understanding covenant love',
            'Preparing for marriage-level commitment',
        ],
        questions: [
            'Do I have healthy boundaries in relationships?',
            'Have I addressed past relationship patterns?',
            'Am I preparing for covenant, not just dating?',
        ],
    },
]

export default function PillarsPage() {
    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                {/* Hero */}
                <section className="section section--primary">
                    <div className="container text-center">
                        <h1 style={{ marginBottom: 'var(--space-4)' }}>The Six Pillars</h1>
                        <p style={{ fontSize: 'var(--text-xl)', opacity: 0.9, maxWidth: '700px', margin: '0 auto' }}>
                            The foundation of Relationship Fitness. These six areas determine your readiness
                            for a healthy, lasting relationship.
                        </p>
                    </div>
                </section>

                {/* Overview */}
                <SixPillars />

                {/* Deep Dive */}
                <section className="section section--white">
                    <div className="container">
                        <h2 className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
                            Explore Each Pillar
                        </h2>

                        {pillarDetails.map((pillar, index) => (
                            <div
                                key={pillar.name}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: index % 2 === 0 ? '1fr 1.5fr' : '1.5fr 1fr',
                                    gap: 'var(--space-10)',
                                    alignItems: 'center',
                                    marginBottom: 'var(--space-16)',
                                    paddingBottom: 'var(--space-16)',
                                    borderBottom: index < pillarDetails.length - 1 ? '1px solid var(--color-rose)' : 'none',
                                }}
                            >
                                <div style={{ order: index % 2 === 0 ? 1 : 2 }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: 'var(--radius-full)',
                                        backgroundColor: `${pillar.color}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 'var(--space-4)',
                                    }}>
                                        <pillar.icon size={40} color={pillar.color} />
                                    </div>
                                    <h3 style={{ marginBottom: 'var(--space-2)' }}>{pillar.name}</h3>
                                    <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-slate)' }}>
                                        {pillar.description}
                                    </p>
                                </div>

                                <div style={{ order: index % 2 === 0 ? 2 : 1 }}>
                                    <div style={{
                                        backgroundColor: 'var(--color-cream)',
                                        borderRadius: 'var(--radius-xl)',
                                        padding: 'var(--space-6)',
                                        marginBottom: 'var(--space-4)',
                                    }}>
                                        <h4 style={{ marginBottom: 'var(--space-3)' }}>Key Areas</h4>
                                        <ul style={{
                                            listStyle: 'disc',
                                            paddingLeft: 'var(--space-6)',
                                            color: 'var(--color-slate)',
                                        }}>
                                            {pillar.details.map((detail, i) => (
                                                <li key={i} style={{ marginBottom: 'var(--space-1)' }}>{detail}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div style={{
                                        backgroundColor: 'var(--color-blush)',
                                        borderRadius: 'var(--radius-lg)',
                                        padding: 'var(--space-4)',
                                        borderLeft: `4px solid ${pillar.color}`,
                                    }}>
                                        <h5 style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                                            Self-Assessment Questions
                                        </h5>
                                        <ul style={{
                                            listStyle: 'none',
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--color-charcoal)',
                                        }}>
                                            {pillar.questions.map((q, i) => (
                                                <li key={i} style={{ marginBottom: 'var(--space-1)' }}>• {q}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="section section--primary">
                    <div className="container text-center">
                        <h2 style={{ marginBottom: 'var(--space-4)' }}>Start Your Pillar Journey</h2>
                        <p style={{ fontSize: 'var(--text-lg)', opacity: 0.9, marginBottom: 'var(--space-6)', maxWidth: '600px', margin: '0 auto var(--space-6)' }}>
                            Join Align and begin engaging with the Six Pillars—privately for self-growth,
                            or with other members to find alignment.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                            <Link href="/register" className="btn btn--white btn--lg">
                                Get Started Free
                                <ArrowRight size={18} />
                            </Link>
                            <Link href="/book" className="btn btn--outline-white btn--lg">
                                Learn More in the Book
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
