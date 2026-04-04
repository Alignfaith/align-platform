import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
    return (
        <>
            <section className="hero">
                {/* Background image with heavy dark overlay */}
                <div className="hero__background">
                    <Image
                        src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1920&q=80"
                        alt="Couple holding hands"
                        fill
                        priority
                        style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
                    />
                    <div className="hero__overlay" />
                </div>

                <div className="container" style={{ position: 'relative', zIndex: 3 }}>
                    <div className="hero__centered">
                        <h1 className="hero__headline">
                            Prepare Before<br />You Pursue
                        </h1>

                        <p className="hero__subheadline">
                            Align is a faith-centered community built on the Six Pillars of Relationship Fitness.
                            We equip you to become the person you&apos;re looking for — before you find them.
                        </p>

                        <div className="hero__actions">
                            <Link href="/register" className="btn btn--primary btn--lg">
                                Get Started
                            </Link>
                            <Link href="/framework" className="btn btn--outline-white btn--lg">
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats bar — own section with solid dark background */}
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
