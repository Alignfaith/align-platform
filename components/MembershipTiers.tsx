import Link from 'next/link'
import Image from 'next/image'
import { Check, X, BookOpen, Gift } from 'lucide-react'

const tiers = [
    {
        name: 'Free',
        subtitle: 'Alignment & Preparation',
        price: '$0',
        period: 'forever',
        features: [
            { text: 'Create an account', included: true },
            { text: 'Complete onboarding', included: true },
            { text: 'Complete required reflections', included: true },
            { text: 'Access Six Pillars privately', included: true },
            { text: 'Understand the framework', included: true },
            { text: 'View other members', included: false },
            { text: 'Send connection requests', included: false },
            { text: 'Messaging', included: false },
        ],
        cta: 'Start Free',
        featured: false,
        includesBook: false,
    },
    {
        name: 'Tier 1',
        subtitle: 'Preparation Engagement',
        price: '$34.99',
        period: '/month',
        saveText: 'Or $29.99/mo with 6-month commitment',
        features: [
            { text: 'Everything in Free', included: true },
            { text: 'View other members through pillar system', included: true },
            { text: 'Limited daily connection requests', included: true },
            { text: 'Messaging after mutual interest', included: true },
            { text: 'Weekly pillar prompts & challenges', included: true },
            { text: 'Private pillar engagement', included: true },
            { text: 'Advanced filtering', included: false },
            { text: 'Priority visibility', included: false },
        ],
        cta: 'Choose Tier 1',
        featured: true,
        includesBook: true,
    },
    {
        name: 'Tier 2',
        subtitle: 'Connection Plus',
        price: '$44.99',
        period: '/month',
        saveText: 'Or $39.99/mo with 6-month commitment',
        features: [
            { text: 'Everything in Tier 1', included: true },
            { text: 'Priority placement in discovery', included: true },
            { text: 'Advanced pillar alignment filters', included: true },
            { text: 'Higher daily connection limits', included: true },
            { text: 'Enhanced messaging features', included: true },
            { text: 'Group teachings & live sessions', included: true },
            { text: 'Access to events (Phase Two)', included: true },
            { text: 'Priority support', included: true },
        ],
        cta: 'Choose Tier 2',
        featured: false,
        includesBook: true,
    },
]

export default function MembershipTiers() {
    return (
        <section className="section section--blush">
            <div className="container">
                <div className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
                    <h2 style={{ marginBottom: 'var(--space-4)' }}>Membership Levels</h2>
                    <p style={{
                        fontSize: 'var(--text-lg)',
                        color: 'var(--color-slate)',
                        maxWidth: '600px',
                        margin: '0 auto',
                    }}>
                        Joining is free and for alignment only. Engagement with others requires a paid tier.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: 'var(--space-6)',
                    alignItems: 'stretch',
                }}>
                    {tiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`tier-card ${tier.featured ? 'tier-card--featured' : ''}`}
                        >
                            <h3 className="tier-card__name">{tier.name}</h3>
                            <p className="tier-card__subtitle">{tier.subtitle}</p>

                            <div className="tier-card__price">
                                {tier.price}
                                <span className="tier-card__price-period">{tier.period}</span>
                            </div>

                            {tier.saveText && (
                                <p className="tier-card__save">{tier.saveText}</p>
                            )}

                            {/* Book Bonus for Paid Tiers */}
                            {tier.includesBook && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-3)',
                                    backgroundColor: tier.featured ? 'rgba(225, 29, 72, 0.15)' : 'rgba(225, 29, 72, 0.1)',
                                    border: '1px solid rgba(225, 29, 72, 0.2)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: 'var(--space-3)',
                                    marginBottom: 'var(--space-4)',
                                }}>
                                    <Gift size={20} color="#FB7185" />
                                    <span style={{
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 600,
                                        color: '#FB7185',
                                    }}>
                                        Includes FREE copy of the book!
                                    </span>
                                </div>
                            )}

                            <ul className="tier-card__features">
                                {tier.features.map((feature, index) => (
                                    <li
                                        key={index}
                                        className={`tier-card__feature ${!feature.included ? 'tier-card__feature--disabled' : ''}`}
                                    >
                                        <span className="tier-card__feature-icon">
                                            {feature.included ? <Check size={18} /> : <X size={18} />}
                                        </span>
                                        <span>{feature.text}</span>
                                    </li>
                                ))}
                                {/* Add book as feature for paid tiers */}
                                {tier.includesBook && (
                                    <li className="tier-card__feature" style={{
                                        fontWeight: 600,
                                        color: '#FB7185',
                                    }}>
                                        <span className="tier-card__feature-icon">
                                            <BookOpen size={18} />
                                        </span>
                                        <span>&quot;Relationship Fitness&quot; book included</span>
                                    </li>
                                )}
                            </ul>

                            <Link
                                href="/register"
                                className={`btn ${tier.featured ? 'btn--primary' : 'btn--secondary'}`}
                                style={{ width: '100%' }}
                            >
                                {tier.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
