import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
    return (
        <>
            <section className="hero">
                {/* z-index 1 — background image */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1,
                    background: '#0d0d14',
                }}>
                    <Image
                        src="/images/hero-cross.png"
                        alt="Heart and cross"
                        fill
                        priority
                        style={{ objectFit: 'contain', objectPosition: 'center 30%' }}
                    />
                </div>

                {/* z-index 2 — gradient overlay: transparent at top, dark at bottom so text is readable */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 2,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.82) 75%, rgba(0,0,0,0.92) 100%)',
                }} />

                {/* z-index 3 — text content anchored to bottom of hero */}
                <div className="container" style={{ position: 'relative', zIndex: 3, width: '100%' }}>
                    <div className="hero__centered">
                        <h1 className="hero__headline">
                            Prepare Your Heart.<br />
                            Align Your Life.<br />
                            Find God-Centered Love.
                        </h1>

                        <p className="hero__subheadline">
                            A faith-based platform helping Christian singles grow spiritually and in every
                            area of life — so you&apos;re ready for meaningful, no-games relationships.
                        </p>

                        <div className="hero__actions">
                            <Link href="/register" className="btn btn--primary btn--lg">
                                Get Started Free
                            </Link>
                            <Link href="/framework" className="btn btn--outline-white btn--lg">
                                Explore the Six Pillars
                            </Link>
                        </div>

                        <p className="hero__trust-line">
                            100% Faith-Based &bull; Built on Biblical Principles &bull; No Swiping, No Games
                        </p>
                    </div>
                </div>
            </section>

            {/* Credit line */}
            <div className="hero__credit-bar">
                <p className="hero__credit">
                    Created by Thomas Marks, author of the Relationship Fitness framework
                </p>
            </div>

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
