import Image from 'next/image'
import {
    Church,
    Brain,
    Dumbbell,
    Wallet,
    Sparkles,
    Heart
} from 'lucide-react'

// Descriptions from SOURCE_OF_TRUTH.md
const pillars = [
    {
        icon: Church,
        title: 'Spiritual Fitness',
        weight: '30%',
        description: 'How your faith shows up in your daily life, decisions, and relationships. This is about belief, practice, community, and direction, not perfection.',
        image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&q=80',
    },
    {
        icon: Brain,
        title: 'Mental Fitness',
        weight: '20%',
        description: 'How you think, respond, take responsibility, and handle life\'s pressures. This is about perspective, humility, and self-control, not diagnoses.',
        image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&q=80',
    },
    {
        icon: Heart,
        title: 'Intimacy Fitness',
        weight: '20%',
        description: 'How you approach closeness, boundaries, trust, and emotional connection. This is about intention and maturity, not sexual experience or speed.',
        image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80',
    },
    {
        icon: Wallet,
        title: 'Financial Fitness',
        weight: '15%',
        description: 'How you manage money, responsibility, and stability in your life. This is about stewardship and habits, not income or net worth.',
        image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80',
    },
    {
        icon: Dumbbell,
        title: 'Physical Fitness',
        weight: '10%',
        description: 'How you care for your body through movement, health, and daily habits. This is about consistency and effort, not appearance or athleticism.',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
    },
    {
        icon: Sparkles,
        title: 'Appearance Fitness',
        weight: '5%',
        description: 'How you present yourself and the effort you put into showing up well. This is about self-respect and awareness, not fashion or vanity.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    },
]

export default function SixPillars() {
    return (
        <section id="pillars" className="section section--cream">
            <div className="container">
                <div className="text-center" style={{ marginBottom: 'var(--space-16)' }}>
                    <div className="section-badge">
                        <Sparkles size={14} />
                        <span>The Framework</span>
                    </div>
                    <h2 className="section-title">The Six Pillars</h2>
                    <p className="section-subtitle">
                        Align uses the Six Pillars to measure <strong>alignment</strong> between you and potential matches. 
                        Not all areas of life matter equally in a long-term relationship—some differences are preferences, others are foundational.
                    </p>
                </div>

                <div className="pillars-grid">
                    {pillars.map((pillar) => (
                        <div key={pillar.title} className="pillar-card">
                            <div className="pillar-card__image">
                                <Image
                                    src={pillar.image}
                                    alt={pillar.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                                <div className="pillar-card__image-overlay" />
                            </div>
                            <div className="pillar-card__content">
                                <div className="pillar-card__icon">
                                    <pillar.icon size={24} />
                                </div>
                                <h3 className="pillar-card__title">{pillar.title}</h3>
                                <p className="pillar-card__description">{pillar.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
