import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Sparkles, Heart } from 'lucide-react'

export default function Hero() {
    return (
        <section className="hero">
            {/* Background photo with overlay */}
            <div className="hero__background">
                <Image
                    src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1920&q=80"
                    alt="Young couple enjoying time together"
                    fill
                    priority
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
                <div className="hero__overlay" />
            </div>

            <div className="container">
                <div className="hero__grid">
                    {/* Left content */}
                    <div className="hero__content animate-fadeInUp">
                        <div className="hero__badge">
                            <Sparkles size={14} />
                            <span>Faith-Centered Dating</span>
                        </div>

                        <h1 className="hero__title hero__title--brand">
                            ALIGN
                        </h1>
                        <p className="hero__tagline">The Relational Fitness Ecosystem for intentional believers.</p>

                        <p className="hero__description">
                            Align is a <strong>Preparation-First</strong> community. We equip you to become the person you are looking for through our Six Pillar framework before you align with a partner.
                        </p>

                        <div className="hero__actions">
                            <Link href="/register" className="btn btn--primary btn--lg">
                                Join the Training Ground
                                <Heart size={18} />
                            </Link>
                            <Link href="/framework" className="btn btn--glass btn--lg">
                                Explore the Pillars
                            </Link>
                        </div>

                        <div className="hero__stats">
                            <div className="hero__stat">
                                <span className="hero__stat-number">6</span>
                                <span className="hero__stat-label">Pillars of Growth</span>
                            </div>
                            <div className="hero__stat">
                                <span className="hero__stat-number">100%</span>
                                <span className="hero__stat-label">Faith-Based</span>
                            </div>
                            <div className="hero__stat">
                                <span className="hero__stat-number">Real</span>
                                <span className="hero__stat-label">Connections</span>
                            </div>
                        </div>
                    </div>

                    {/* Right side - floating photo cards */}
                    <div className="hero__photos">
                        <div className="hero__photo-card hero__photo-card--1">
                            <Image
                                src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&q=80"
                                alt="Happy couple laughing together"
                                width={280}
                                height={350}
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className="hero__photo-card hero__photo-card--2">
                            <Image
                                src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&q=80"
                                alt="Couple walking together outdoors"
                                width={240}
                                height={300}
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className="hero__photo-card hero__photo-card--3">
                            <Image
                                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80"
                                alt="Confident young woman smiling"
                                width={200}
                                height={250}
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Wave decoration at bottom */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '120px',
                overflow: 'hidden',
                zIndex: 2,
            }}>
                <svg
                    viewBox="0 0 1440 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <path
                        d="M0,64L48,69.3C96,75,192,85,288,90.7C384,96,480,96,576,85.3C672,75,768,53,864,48C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                        fill="#111113"
                    />
                </svg>
            </div>
        </section>
    )
}
