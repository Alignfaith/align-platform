import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { BookOpen, Star, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react'

const bookChapters = [
    'Understanding Your Starting Point',
    'Spiritual Fitness: Building Your Foundation in God',
    'Mental Fitness: Developing Emotional Intelligence',
    'Physical Fitness: Stewarding Your Body',
    'Financial Fitness: Wisdom with Resources',
    'Appearance Fitness: Presenting Your Best Self',
    'Intimacy Fitness: Preparing for Covenant',
    'Putting It All Together',
]

const testimonials = [
    {
        quote: "This book completely changed how I approach relationships. I finally understood that I needed to work on myself first.",
        author: "Marcus T.",
        location: "Atlanta, GA",
    },
    {
        quote: "Thomas breaks down complex relationship dynamics into practical, faith-based guidance anyone can follow.",
        author: "Sarah M.",
        location: "Dallas, TX",
    },
    {
        quote: "The Six Pillars framework gave me a clear path forward. I recommend this book to everyone I know.",
        author: "David W.",
        location: "Chicago, IL",
    },
]

export default function BookPage() {
    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                {/* Hero */}
                <section className="section section--primary">
                    <div className="container">
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 'var(--space-12)',
                            alignItems: 'center',
                        }}>
                            <div>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    padding: 'var(--space-2) var(--space-4)',
                                    borderRadius: 'var(--radius-full)',
                                    marginBottom: 'var(--space-4)',
                                    fontSize: 'var(--text-sm)',
                                }}>
                                    <BookOpen size={16} />
                                    The Foundation of Align
                                </div>
                                <h1 style={{ marginBottom: 'var(--space-2)' }}>Relationship Fitness</h1>
                                <p style={{
                                    fontSize: 'var(--text-xl)',
                                    fontStyle: 'italic',
                                    opacity: 0.95,
                                    marginBottom: 'var(--space-4)',
                                }}>
                                    Preparing yourself for the love you desire
                                </p>
                                <p style={{ opacity: 0.9, marginBottom: 'var(--space-6)' }}>
                                    By <strong>Thomas Marks</strong> — A Practical Guide to Personal Discipline,
                                    Alignment, and Christ-Centered Growth
                                </p>
                                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                                    <a
                                        href="https://www.amazon.com/dp/B0DRNQZZ5M"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn--white btn--lg"
                                    >
                                        Get on Amazon
                                        <ExternalLink size={18} />
                                    </a>
                                    <Link href="/register" className="btn btn--outline-white btn--lg">
                                        Join Align
                                    </Link>
                                </div>
                            </div>

                            <div style={{
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                borderRadius: 'var(--radius-2xl)',
                                padding: 'var(--space-8)',
                                textAlign: 'center',
                            }}>
                                <div style={{
                                    backgroundColor: 'var(--color-white)',
                                    borderRadius: 'var(--radius-xl)',
                                    padding: 'var(--space-6)',
                                    boxShadow: 'var(--shadow-xl)',
                                    display: 'inline-block',
                                }}>
                                    <BookOpen size={120} color="var(--color-primary)" />
                                    <p style={{
                                        color: 'var(--color-charcoal)',
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: 'var(--text-lg)',
                                        marginTop: 'var(--space-4)',
                                        marginBottom: 0,
                                    }}>
                                        Available Now
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About the Book */}
                <section className="section section--cream">
                    <div className="container">
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <h2 className="text-center" style={{ marginBottom: 'var(--space-8)' }}>
                                About the Book
                            </h2>

                            <p style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>
                                Most relationships do not fall apart because of a lack of love. They fall apart
                                because people enter them unprepared for the weight, responsibility, and spiritual
                                maturity that love requires.
                            </p>

                            <p style={{ color: 'var(--color-slate)', marginBottom: 'var(--space-4)' }}>
                                Attraction can bring two people together, but only character, healing, and
                                alignment can keep them together.
                            </p>

                            <p style={{ color: 'var(--color-slate)', marginBottom: 'var(--space-4)' }}>
                                <strong>Relationship Fitness</strong> is a guide to strengthening the areas that
                                shape every relationship. Through years of personal growth, faith, leadership, and
                                real-world experience, Thomas Marks reveals the six pillars that every strong
                                partnership is built on.
                            </p>

                            <p style={{ color: 'var(--color-slate)', marginBottom: 'var(--space-4)' }}>
                                These pillars will help you confront old patterns, develop discipline, understand
                                your identity in God, and create stability in the areas that matter most.
                            </p>

                            <div style={{
                                backgroundColor: 'var(--color-blush)',
                                borderRadius: 'var(--radius-lg)',
                                padding: 'var(--space-6)',
                                marginTop: 'var(--space-8)',
                            }}>
                                <p style={{
                                    fontStyle: 'italic',
                                    fontSize: 'var(--text-lg)',
                                    color: 'var(--color-charcoal)',
                                    marginBottom: 0,
                                }}>
                                    "This book is not about chasing a soulmate or hoping love magically works itself
                                    out. It is about becoming the kind of person who can sustain a healthy relationship
                                    with confidence, clarity, and purpose."
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Chapters */}
                <section className="section section--white">
                    <div className="container">
                        <h2 className="text-center" style={{ marginBottom: 'var(--space-8)' }}>
                            What You'll Learn
                        </h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: 'var(--space-4)',
                            maxWidth: '900px',
                            margin: '0 auto',
                        }}>
                            {bookChapters.map((chapter, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-3)',
                                        padding: 'var(--space-4)',
                                        backgroundColor: 'var(--color-cream)',
                                        borderRadius: 'var(--radius-lg)',
                                    }}
                                >
                                    <CheckCircle size={20} color="var(--color-primary)" />
                                    <span style={{ fontWeight: 500 }}>{chapter}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="section section--blush">
                    <div className="container">
                        <h2 className="text-center" style={{ marginBottom: 'var(--space-8)' }}>
                            What Readers Say
                        </h2>

                        <div className="grid grid--3">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="card">
                                    <div style={{ display: 'flex', gap: 'var(--space-1)', marginBottom: 'var(--space-4)' }}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} size={18} fill="var(--color-gold)" color="var(--color-gold)" />
                                        ))}
                                    </div>
                                    <p style={{
                                        fontStyle: 'italic',
                                        color: 'var(--color-charcoal)',
                                        marginBottom: 'var(--space-4)',
                                    }}>
                                        "{testimonial.quote}"
                                    </p>
                                    <p style={{
                                        fontWeight: 600,
                                        color: 'var(--color-primary)',
                                        marginBottom: 0,
                                        fontSize: 'var(--text-sm)',
                                    }}>
                                        — {testimonial.author}, {testimonial.location}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="section section--primary">
                    <div className="container text-center">
                        <h2 style={{ marginBottom: 'var(--space-4)' }}>Get Your Copy Today</h2>
                        <p style={{ fontSize: 'var(--text-lg)', opacity: 0.9, marginBottom: 'var(--space-6)', maxWidth: '600px', margin: '0 auto var(--space-6)' }}>
                            Start your journey to becoming relationship-ready.
                        </p>
                        <a
                            href="https://www.amazon.com/dp/B0DRNQZZ5M"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn--white btn--lg"
                        >
                            Buy on Amazon
                            <ExternalLink size={18} />
                        </a>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
