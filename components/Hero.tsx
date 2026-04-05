import Link from 'next/link'
import Image from 'next/image'
import { Check } from 'lucide-react'

const trustIndicators = [
    'Built on the Six Pillars',
    '100% Faith-Based',
    'No Swiping, No Games',
]

export default function Hero() {
    return (
        <>
            <section className="hero">
                {/* z-index 1 — background image */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1,
                    background: '#1a1a2e',
                }}>
                    <Image
                        src="/images/hero-cross.png"
                        alt="Cross"
                        fill
                        priority
                        style={{ objectFit: 'contain', objectPosition: 'center' }}
                    />
                </div>

                {/* z-index 2 — dark overlay sits directly on top of image */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 2,
                    background: 'rgba(0, 0, 0, 0.55)',
                }} />

                {/* z-index 3 — text content above overlay */}
                <div className="container" style={{ position: 'relative', zIndex: 3 }}>
                    <div className="hero__centered">
                        <p className="hero__eyebrow">
                            Faith-Centered Relationship Platform
                        </p>

                        <h1 className="hero__headline">
                            Prepare Before<br />You Pursue
                        </h1>

                        <p className="hero__subheadline">
                            Align is not a dating app. It&apos;s a faith-based platform that helps Christian singles
                            grow spiritually, mentally, and financially — so you become the person worth finding
                            before you start looking.
                        </p>

                        <div className="hero__trust">
                            {trustIndicators.map((label) => (
                                <div key={label} className="hero__trust-item">
                                    <Check size={14} strokeWidth={3} className="hero__trust-icon" />
                                    <span>{label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="hero__actions">
                            <Link href="/register" className="btn btn--primary btn--lg">
                                Get Started Free
                            </Link>
                            <a href="#how-it-works" className="btn btn--outline-white btn--lg">
                                See How It Works
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats bar — solid dark section below hero */}
            <div className="hero__stats-bar">
                <div className="container">
                    <div className="hero__stats">
                        <div className="hero__stat">
                            <span className="hero__stat-number">6</span>
                            <span className="hero__stat-label">Pillars of Growth</span>
                        </div>
                        <div className="hero__stat-divider" />
                        <div className="hero__stat">
                            <span className="hero__stat-number">100%</span>
                            <span className="hero__stat-label">Faith-Based</span>
                        </div>
                        <div className="hero__stat-divider" />
                        <div className="hero__stat">
                            <span className="hero__stat-number">Real</span>
                            <span className="hero__stat-label">Connections</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
