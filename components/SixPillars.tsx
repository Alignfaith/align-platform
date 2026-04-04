import { Church, Brain, Dumbbell, Wallet, Sparkles, Heart } from 'lucide-react'

const pillars = [
    {
        icon: Church,
        title: 'Spiritual Fitness',
        description: 'How your faith shows up in your daily life, decisions, and relationships.',
        color: '#E11D48',
    },
    {
        icon: Brain,
        title: 'Mental Fitness',
        description: 'How you think, respond, and handle life\'s pressures with humility and self-control.',
        color: '#3B82F6',
    },
    {
        icon: Wallet,
        title: 'Financial Fitness',
        description: 'How you manage money, build stability, and practice stewardship in your life.',
        color: '#F59E0B',
    },
    {
        icon: Dumbbell,
        title: 'Physical Fitness',
        description: 'How you care for your body through movement, health, and consistent daily habits.',
        color: '#10B981',
    },
    {
        icon: Sparkles,
        title: 'Appearance Fitness',
        description: 'How you present yourself and honor God through intentional self-care.',
        color: '#8B5CF6',
    },
    {
        icon: Heart,
        title: 'Intimacy Fitness',
        description: 'How you approach closeness, trust, and emotional connection with intention.',
        color: '#EC4899',
    },
]

export default function SixPillars() {
    return (
        <section style={{
            background: 'var(--color-bg-primary)',
            padding: 'var(--space-24) 0',
        }}>
            <div className="container">
                <div className="text-center" style={{ marginBottom: 'var(--space-16)' }}>
                    <p style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--color-primary)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: 'var(--space-3)',
                    }}>
                        The Framework
                    </p>
                    <h2 style={{
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--space-4)',
                    }}>
                        The Six Pillars
                    </h2>
                    <p style={{
                        fontSize: 'var(--text-lg)',
                        color: 'var(--color-text-secondary)',
                        maxWidth: '560px',
                        margin: '0 auto',
                        lineHeight: 'var(--leading-relaxed)',
                    }}>
                        Align measures readiness across six areas of life — because lasting relationships
                        are built on more than attraction.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 'var(--space-6)',
                }}>
                    {pillars.map((pillar) => (
                        <div
                            key={pillar.title}
                            style={{
                                padding: 'var(--space-8)',
                                borderRadius: 'var(--radius-xl)',
                                background: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border-subtle)',
                                transition: 'border-color 200ms ease, transform 200ms ease',
                            }}
                        >
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: 'var(--radius-lg)',
                                background: `${pillar.color}18`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 'var(--space-5)',
                            }}>
                                <pillar.icon size={22} color={pillar.color} />
                            </div>
                            <h3 style={{
                                fontSize: 'var(--text-lg)',
                                fontWeight: 'var(--font-bold)',
                                color: 'var(--color-text-primary)',
                                marginBottom: 'var(--space-2)',
                            }}>
                                {pillar.title}
                            </h3>
                            <p style={{
                                fontSize: 'var(--text-sm)',
                                color: 'var(--color-text-secondary)',
                                lineHeight: 'var(--leading-relaxed)',
                                margin: 0,
                            }}>
                                {pillar.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
