import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SixPillars from '@/components/SixPillars'
import Link from 'next/link'
import { ArrowRight, Target, Compass, Shield, Heart, Zap } from 'lucide-react'

const frameworkPrinciples = [
    {
        icon: Target,
        title: 'Preparation Before Pursuit',
        description: 'Before you pursue anyone else, you must first pursue becoming the person worth pursuing. This is the foundation of Relationship Fitness.',
    },
    {
        icon: Shield,
        title: 'Faith as Foundation',
        description: 'Your relationship with God must come first. A Christ centered foundation provides the stability that every lasting relationship requires.',
    },
    {
        icon: Compass,
        title: 'Intentional Growth',
        description: 'Growth does not happen by accident. The Six Pillars provide a framework for intentional development in every area of life.',
    },
    {
        icon: Heart,
        title: 'Character Over Chemistry',
        description: 'Chemistry fades. Character endures. Building character ensures you can sustain a relationship when feelings fluctuate.',
    },
    {
        icon: Zap,
        title: 'Discipline Creates Freedom',
        description: 'Self-discipline in the six pillar areas creates the freedom to love without dysfunction, insecurity, or codependency.',
    },
]

export default function FrameworkPage() {
    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                {/* Hero */}
                <section className="section section--primary">
                    <div className="container text-center">
                        <h1 style={{ marginBottom: 'var(--space-4)' }}>The Relationship Fitness Framework</h1>
                        <p style={{
                            fontSize: 'var(--text-xl)',
                            opacity: 0.9,
                            maxWidth: '700px',
                            margin: '0 auto',
                        }}>
                            A Christ centered framework for personal preparation and relational readiness,
                            built on the six pillars that every strong partnership requires.
                        </p>
                    </div>
                </section>

                {/* Origin */}
                <section className="section section--cream">
                    <div className="container">
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 'var(--space-12)',
                            alignItems: 'center',
                        }}>
                            <div>
                                <h2 style={{ marginBottom: 'var(--space-4)' }}>
                                    Where It Began
                                </h2>
                                <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-slate)', marginBottom: 'var(--space-4)' }}>
                                    The Relationship Fitness framework was developed by Thomas Marks through years of
                                    personal growth, faith, leadership, and real-world experience.
                                </p>
                                <p style={{ color: 'var(--color-slate)', marginBottom: 'var(--space-4)' }}>
                                    After observing countless relationships fail—not from lack of love, but from lack
                                    of preparation—Thomas identified six core areas that determine relationship success.
                                </p>
                                <p style={{ color: 'var(--color-slate)' }}>
                                    These Six Pillars became the foundation of the Relationship Fitness book and the
                                    entire Align platform experience.
                                </p>
                            </div>

                            <div style={{
                                borderRadius: 'var(--radius-2xl)',
                                overflow: 'hidden',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.20)',
                                lineHeight: 0,
                            }}>
                                <img
                                    src="/images/book-cover.png"
                                    alt="Relationship Fitness book cover"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        display: 'block',
                                        borderRadius: 'var(--radius-2xl)',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Principles */}
                <section className="section section--white">
                    <div className="container">
                        <div className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
                            <h2 style={{ marginBottom: 'var(--space-4)' }}>Core Principles</h2>
                            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-slate)', maxWidth: '600px', margin: '0 auto' }}>
                                These truths guide the Relationship Fitness framework and everything we do at Align.
                            </p>
                        </div>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: 'var(--space-6)',
                        }}>
                            {frameworkPrinciples.map((principle) => (
                                <div key={principle.title} className="card" style={{ flex: '0 1 calc(33.333% - 16px)', minWidth: '280px' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 'var(--space-4)',
                                    }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: 'var(--radius-full)',
                                            backgroundColor: 'var(--color-blush)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            <principle.icon size={24} color="var(--color-primary)" />
                                        </div>
                                        <div>
                                            <h4 style={{ marginBottom: 'var(--space-2)' }}>{principle.title}</h4>
                                            <p style={{ color: 'var(--color-slate)', marginBottom: 0, fontSize: 'var(--text-sm)' }}>
                                                {principle.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Six Pillars */}
                <SixPillars />

                {/* How Pillars Work */}
                <section className="section section--white">
                    <div className="container">
                        <div className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
                            <h2 style={{ marginBottom: 'var(--space-4)' }}>How The Pillars Work on Align</h2>
                            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-slate)', maxWidth: '560px', margin: '0 auto' }}>
                                The Six Pillars power every part of the platform — from your own growth to how you connect with others.
                            </p>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                            gap: 'var(--space-8)',
                        }}>
                            {[
                                {
                                    icon: Target,
                                    number: '01',
                                    title: 'For Preparation',
                                    description: 'Use the pillars to assess where you are and where you need to grow. Even free members can engage with pillar-based self-reflection privately.',
                                },
                                {
                                    icon: Compass,
                                    number: '02',
                                    title: 'For Discernment',
                                    description: 'When viewing other members (paid tiers), you see their pillar engagement — not photos or bios. Discern alignment based on values and growth.',
                                },
                                {
                                    icon: Heart,
                                    number: '03',
                                    title: 'For Alignment',
                                    description: 'The pillars are not used for scoring or ranking. They exist to help you find alignment with someone who shares your commitment to growth and faith.',
                                },
                            ].map((item) => (
                                <div key={item.title} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    padding: 'var(--space-8)',
                                    borderRadius: 'var(--radius-xl)',
                                    border: '1px solid var(--color-border-subtle)',
                                    background: 'var(--color-bg-secondary)',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        marginBottom: 'var(--space-6)',
                                    }}>
                                        <div style={{
                                            width: '52px',
                                            height: '52px',
                                            borderRadius: 'var(--radius-lg)',
                                            background: 'rgba(225, 29, 72, 0.1)',
                                            border: '1px solid rgba(225, 29, 72, 0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <item.icon size={24} color="#E11D48" />
                                        </div>
                                        <span style={{
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: 'var(--text-3xl)',
                                            fontWeight: 'var(--font-extrabold)',
                                            color: 'rgba(225, 29, 72, 0.15)',
                                            lineHeight: 1,
                                        }}>
                                            {item.number}
                                        </span>
                                    </div>
                                    <h3 style={{
                                        fontSize: 'var(--text-xl)',
                                        fontWeight: 'var(--font-bold)',
                                        color: 'var(--color-text-primary)',
                                        marginBottom: 'var(--space-3)',
                                    }}>
                                        {item.title}
                                    </h3>
                                    <p style={{
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--color-text-secondary)',
                                        lineHeight: 'var(--leading-relaxed)',
                                        margin: 0,
                                    }}>
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="section section--primary">
                    <div className="container text-center">
                        <h2 style={{ marginBottom: 'var(--space-4)' }}>Experience the Framework</h2>
                        <p style={{ fontSize: 'var(--text-lg)', opacity: 0.9, marginBottom: 'var(--space-6)', maxWidth: '600px', margin: '0 auto var(--space-6)' }}>
                            Join Align and begin your journey of intentional preparation.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                            <Link href="/register" className="btn btn--white btn--lg">
                                Get Started Free
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
