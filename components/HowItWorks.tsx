import { Layers, TrendingUp, Heart } from 'lucide-react'

const steps = [
    {
        icon: Layers,
        number: '01',
        title: 'Build Your Foundation',
        description: 'Complete the Six Pillar assessment to understand where you are spiritually, mentally, physically, financially, and relationally.',
    },
    {
        icon: TrendingUp,
        number: '02',
        title: 'Grow With Purpose',
        description: 'Access tools, reflections, and community resources designed to strengthen each pillar of your life before you pursue a relationship.',
    },
    {
        icon: Heart,
        number: '03',
        title: 'ALIGN With Someone Real',
        description: 'Get matched with someone who shares your values, faith, and direction — based on character and pillar alignment, not just photos.',
    },
]

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="section section--white">
            <div className="container">
                <div className="text-center" style={{ marginBottom: 'var(--space-16)' }}>
                    <h2 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-primary)' }}>
                        How ALIGN Works
                    </h2>
                    <p style={{
                        fontSize: 'var(--text-lg)',
                        color: 'var(--color-text-secondary)',
                        maxWidth: '560px',
                        margin: '0 auto',
                        lineHeight: 'var(--leading-relaxed)',
                    }}>
                        Every feature is built around growth, faith, and readiness.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: 'var(--space-8)',
                }}>
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                padding: 'var(--space-8)',
                                borderRadius: 'var(--radius-xl)',
                                border: '1px solid var(--color-border-subtle)',
                                background: 'var(--color-bg-secondary)',
                                transition: 'border-color 200ms ease',
                            }}
                        >
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
                                    background: 'rgba(192, 24, 42, 0.1)',
                                    border: '1px solid rgba(192, 24, 42, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <step.icon size={24} color="#c0182a" />
                                </div>
                                <span style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: 'var(--text-3xl)',
                                    fontWeight: 'var(--font-extrabold)',
                                    color: 'rgba(192, 24, 42, 0.15)',
                                    lineHeight: 1,
                                }}>
                                    {step.number}
                                </span>
                            </div>
                            <h3 style={{
                                fontSize: 'var(--text-xl)',
                                fontWeight: 'var(--font-bold)',
                                color: 'var(--color-text-primary)',
                                marginBottom: 'var(--space-3)',
                                lineHeight: 'var(--leading-snug)',
                            }}>
                                {step.title}
                            </h3>
                            <p style={{
                                fontSize: 'var(--text-sm)',
                                color: 'var(--color-text-secondary)',
                                lineHeight: 'var(--leading-relaxed)',
                                margin: 0,
                            }}>
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
