import { UserPlus, BookOpen, CreditCard, Users } from 'lucide-react'

const steps = [
    {
        icon: UserPlus,
        title: 'Join the Ecosystem',
        description: 'Create your profile and start your personal assessment. This is your first step into the training ground.',
    },
    {
        icon: BookOpen,
        title: 'Weekly Reflections',
        description: 'Post updates to your Six Pillars. Your "Readiness Score" grows as you document your journey.',
    },
    {
        icon: CreditCard,
        title: 'Choose Commitment',
        description: 'Select a tier to unlock community features. Free members focus solely on private personal growth.',
    },
    {
        icon: Users,
        title: 'Phased Discovery',
        description: 'Connections start with Pillar alignment. Photos and deep contact unlock as you grow in conversation.',
    },
]

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="section section--white">
            <div className="container">
                <div className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
                    <h2 style={{ marginBottom: 'var(--space-4)' }}>How Align Works</h2>
                    <p style={{
                        fontSize: 'var(--text-lg)',
                        color: 'var(--color-slate)',
                        maxWidth: '600px',
                        margin: '0 auto',
                    }}>
                        This is not a swipe app. All interaction is built around personal growth,
                        faith, and readiness before connection.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 'var(--space-8)',
                }}>
                    {steps.map((step, index) => (
                        <div
                            key={step.title}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                padding: 'var(--space-6)',
                            }}
                        >
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: 'var(--radius-full)',
                                background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.1) 0%, rgba(225, 29, 72, 0.05) 100%)',
                                border: '1px solid rgba(225, 29, 72, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 'var(--space-4)',
                                position: 'relative',
                            }}>
                                <step.icon size={32} color="#E11D48" />
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: 'var(--radius-full)',
                                    background: 'linear-gradient(135deg, #E11D48 0%, #F43F5E 50%, #BE123C 100%)',
                                    color: '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700',
                                    fontSize: 'var(--text-sm)',
                                }}>
                                    {index + 1}
                                </span>
                            </div>
                            <h3 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'var(--text-xl)',
                                marginBottom: 'var(--space-2)',
                            }}>
                                {step.title}
                            </h3>
                            <p style={{
                                color: 'var(--color-slate)',
                                fontSize: 'var(--text-sm)',
                                marginBottom: 0,
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
