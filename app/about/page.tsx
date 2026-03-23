import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SixPillars from '@/components/SixPillars'
import Link from 'next/link'
import { BookOpen, Heart, Users, Shield, ArrowRight } from 'lucide-react'

export default function AboutPage() {
    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                {/* Hero */}
                <section className="section section--primary">
                    <div className="container">
                        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                            <h1 style={{ marginBottom: 'var(--space-4)' }}>About Align</h1>
                            <p style={{
                                fontSize: 'var(--text-xl)',
                                opacity: 0.9,
                                fontStyle: 'italic',
                            }}>
                                Preparation comes before connection.
                            </p>
                        </div>
                    </div>
                </section>

                {/* What is Align */}
                <section className="section section--cream">
                    <div className="container">
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 'var(--space-12)',
                            alignItems: 'center',
                        }}>
                            <div>
                                <h2 style={{ marginBottom: 'var(--space-4)' }}>
                                    What is Align?
                                </h2>
                                <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-slate)', marginBottom: 'var(--space-4)' }}>
                                    Align is a Christian-based relationship platform for people who want to grow in
                                    faith, character, and readiness before engaging with others.
                                </p>
                                <p style={{ color: 'var(--color-slate)', marginBottom: 'var(--space-4)' }}>
                                    This is <strong>not</strong> a swipe app. This is <strong>not</strong> profile-based dating.
                                    All interaction is built around a Six Pillars system focused on personal growth.
                                </p>
                                <p style={{ color: 'var(--color-slate)' }}>
                                    Alignment matters more than appearance. Intention leads the way.
                                </p>
                            </div>

                            <div style={{
                                backgroundColor: 'var(--color-white)',
                                borderRadius: 'var(--radius-2xl)',
                                padding: 'var(--space-8)',
                                boxShadow: 'var(--shadow-lg)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                                    <BookOpen size={40} color="var(--color-primary)" />
                                    <div>
                                        <h4 style={{ marginBottom: 'var(--space-1)' }}>Built on the Framework</h4>
                                        <p style={{ color: 'var(--color-slate)', marginBottom: 0, fontSize: 'var(--text-sm)' }}>
                                            Relationship Fitness by Thomas Marks
                                        </p>
                                    </div>
                                </div>
                                <p style={{ color: 'var(--color-charcoal)', fontStyle: 'italic', marginBottom: 0 }}>
                                    "Most relationships do not fall apart because of a lack of love. They fall apart
                                    because people enter them unprepared for the weight, responsibility, and spiritual
                                    maturity that love requires."
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Book */}
                <section className="section section--white">
                    <div className="container">
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
                                <h2 style={{ marginBottom: 'var(--space-4)' }}>The Relationship Fitness Book</h2>
                                <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-slate)' }}>
                                    The foundation that makes Align possible.
                                </p>
                            </div>

                            <div style={{
                                backgroundColor: 'var(--color-blush)',
                                borderRadius: 'var(--radius-2xl)',
                                padding: 'var(--space-10)',
                            }}>
                                <h3 style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                                    Relationship Fitness: Preparing yourself for the love you desire
                                </h3>
                                <p style={{ marginBottom: 'var(--space-4)' }}>
                                    <strong>By Thomas Marks</strong> — A Practical Guide to Personal Discipline,
                                    Alignment, and Christ-Centered Growth
                                </p>
                                <p style={{ color: 'var(--color-slate)', marginBottom: 'var(--space-4)' }}>
                                    Relationship Fitness is a guide to strengthening the areas that shape every relationship.
                                    Through years of personal growth, faith, leadership, and real-world experience, Thomas Marks
                                    reveals the six pillars that every strong partnership is built on.
                                </p>
                                <p style={{ color: 'var(--color-slate)', marginBottom: 'var(--space-4)' }}>
                                    These pillars will help you confront old patterns, develop discipline, understand your
                                    identity in God, and create stability in the areas that matter most.
                                </p>
                                <p style={{ color: 'var(--color-charcoal)', fontWeight: 500, marginBottom: 'var(--space-6)' }}>
                                    This book is not about chasing a soulmate or hoping love magically works itself out.
                                    It is about becoming the kind of person who can sustain a healthy relationship with
                                    confidence, clarity, and purpose.
                                </p>
                                <Link href="/book" className="btn btn--primary">
                                    Learn More About the Book
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Six Pillars */}
                <SixPillars />

                {/* Why Different */}
                <section className="section section--white">
                    <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
                            <h2>Why Align is Different</h2>
                        </div>

                        <div className="grid grid--3">
                            <div className="card text-center">
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: 'var(--radius-full)',
                                    backgroundColor: 'var(--color-blush)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto var(--space-4)',
                                }}>
                                    <Heart size={28} color="var(--color-primary)" />
                                </div>
                                <h4>Character First</h4>
                                <p style={{ color: 'var(--color-slate)', marginBottom: 0 }}>
                                    Connect through values, pillars, and faith—not photos or superficial profiles.
                                </p>
                            </div>

                            <div className="card text-center">
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: 'var(--radius-full)',
                                    backgroundColor: 'var(--color-blush)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto var(--space-4)',
                                }}>
                                    <Users size={28} color="var(--color-primary)" />
                                </div>
                                <h4>Equal Experience</h4>
                                <p style={{ color: 'var(--color-slate)', marginBottom: 0 }}>
                                    Men and women see the exact same experience. Same standards. Same expectations.
                                </p>
                            </div>

                            <div className="card text-center">
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: 'var(--radius-full)',
                                    backgroundColor: 'var(--color-blush)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto var(--space-4)',
                                }}>
                                    <Shield size={28} color="var(--color-primary)" />
                                </div>
                                <h4>Protected Space</h4>
                                <p style={{ color: 'var(--color-slate)', marginBottom: 0 }}>
                                    Faith-forward community with enforced guidelines. Participation is a privilege.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="section section--primary">
                    <div className="container text-center">
                        <h2 style={{ marginBottom: 'var(--space-4)' }}>Ready to Be Aligned?</h2>
                        <p style={{ fontSize: 'var(--text-lg)', opacity: 0.9, marginBottom: 'var(--space-6)' }}>
                            If you are ready to break cycles, strengthen your foundation, and step into the
                            version of yourself God has called you to be—this is your path.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                            <Link href="/register" className="btn btn--white btn--lg">
                                Begin Your Journey
                            </Link>
                            <Link href="/pricing" className="btn btn--outline-white btn--lg">
                                View Membership
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
