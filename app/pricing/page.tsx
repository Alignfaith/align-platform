import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MembershipTiers from '@/components/MembershipTiers'
import { Check, X, Shield, BookOpen, Gift, Truck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function PricingPage() {
    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                {/* Hero Section */}
                <section className="section section--primary">
                    <div className="container text-center">
                        <h1 style={{ marginBottom: 'var(--space-4)' }}>Membership</h1>
                        <p style={{
                            fontSize: 'var(--text-xl)',
                            maxWidth: '600px',
                            margin: '0 auto',
                            opacity: 0.9,
                        }}>
                            Joining is free. Engagement with others requires a paid tier.
                            Choose the level that fits your journey.
                        </p>
                    </div>
                </section>

                {/* Book Bonus Section */}
                <section className="section section--white">
                    <div className="container">
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: 'var(--space-8)',
                            alignItems: 'center',
                            maxWidth: '1000px',
                            margin: '0 auto',
                        }}>
                            {/* Book Image */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}>
                                <a
                                    href="https://www.amazon.com/s?k=Relationship+Fitness+Thomas+Marks"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ display: 'block' }}
                                    title="Get Relationship Fitness on Amazon"
                                >
                                    <div style={{
                                        position: 'relative',
                                        borderRadius: 'var(--radius-lg)',
                                        overflow: 'hidden',
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                        transform: 'perspective(1000px) rotateY(-5deg)',
                                        transition: 'transform 0.3s ease',
                                    }}>
                                        <Image
                                            src="/images/book-cover.jpg"
                                            alt="Relationship Fitness: Preparing yourself for the love you desire by Thomas Marks"
                                            width={350}
                                            height={450}
                                            style={{
                                                objectFit: 'cover',
                                                display: 'block',
                                            }}
                                            priority
                                        />
                                    </div>
                                </a>
                            </div>

                            {/* Book Info */}
                            <div>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'var(--color-white)',
                                    padding: 'var(--space-2) var(--space-4)',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 600,
                                    marginBottom: 'var(--space-4)',
                                }}>
                                    <Gift size={16} />
                                    INCLUDED WITH PAID MEMBERSHIP
                                </div>

                                <h2 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: 'var(--text-3xl)',
                                    color: 'var(--color-charcoal)',
                                    marginBottom: 'var(--space-2)',
                                }}>
                                    Relationship Fitness
                                </h2>
                                <p style={{
                                    fontSize: 'var(--text-xl)',
                                    color: 'var(--color-primary)',
                                    fontStyle: 'italic',
                                    marginBottom: 'var(--space-4)',
                                }}>
                                    Preparing yourself for the love you desire
                                </p>
                                <p style={{
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--color-slate)',
                                    marginBottom: 'var(--space-6)',
                                }}>
                                    By Thomas Marks
                                </p>

                                <p style={{
                                    color: 'var(--color-charcoal)',
                                    lineHeight: 1.8,
                                    marginBottom: 'var(--space-6)',
                                }}>
                                    This book is not about chasing a soulmate or hoping love magically works itself out.
                                    It is about becoming the kind of person who can sustain a healthy relationship with
                                    confidence, clarity, and purpose. Through years of personal growth, faith, leadership,
                                    and real-world experience, Thomas Marks reveals the six pillars that every strong
                                    partnership is built on.
                                </p>

                                <div style={{
                                    backgroundColor: 'var(--color-blush)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: 'var(--space-6)',
                                }}>
                                    <h4 style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-2)',
                                        marginBottom: 'var(--space-3)',
                                        color: 'var(--color-primary)',
                                    }}>
                                        <Truck size={20} />
                                        Free Shipping Included
                                    </h4>
                                    <p style={{
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--color-charcoal)',
                                        marginBottom: 0,
                                    }}>
                                        Every paid membership includes a physical copy of &quot;Relationship Fitness&quot;
                                        shipped directly to your door at no extra cost. Start your journey with the
                                        foundation that makes Align different.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tiers */}
                <MembershipTiers />

                {/* Comparison Table */}
                <section className="section section--white">
                    <div className="container">
                        <h2 className="text-center" style={{ marginBottom: 'var(--space-8)' }}>
                            Compare All Features
                        </h2>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                minWidth: '600px',
                            }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--color-rose)' }}>
                                        <th style={{
                                            textAlign: 'left',
                                            padding: 'var(--space-4)',
                                            fontFamily: 'var(--font-heading)',
                                        }}>
                                            Feature
                                        </th>
                                        <th style={{ padding: 'var(--space-4)', fontFamily: 'var(--font-heading)' }}>Free</th>
                                        <th style={{
                                            padding: 'var(--space-4)',
                                            fontFamily: 'var(--font-heading)',
                                            backgroundColor: 'var(--color-blush)',
                                        }}>
                                            Tier 1
                                        </th>
                                        <th style={{ padding: 'var(--space-4)', fontFamily: 'var(--font-heading)' }}>Tier 2</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { feature: 'Create account & onboarding', free: true, tier1: true, tier2: true },
                                        { feature: 'Complete reflections', free: true, tier1: true, tier2: true },
                                        { feature: 'Private pillar engagement', free: true, tier1: true, tier2: true },
                                        { feature: '"Relationship Fitness" book', free: false, tier1: true, tier2: true, highlight: true },
                                        { feature: 'View other members', free: false, tier1: true, tier2: true },
                                        { feature: 'Connection requests', free: false, tier1: 'Limited', tier2: 'Higher limits' },
                                        { feature: 'Messaging after mutual interest', free: false, tier1: true, tier2: true },
                                        { feature: 'Weekly growth prompts', free: false, tier1: true, tier2: true },
                                        { feature: 'Priority visibility', free: false, tier1: false, tier2: true },
                                        { feature: 'Advanced pillar filters', free: false, tier1: false, tier2: true },
                                        { feature: 'Group teachings & events', free: false, tier1: false, tier2: true },
                                        { feature: 'Priority support', free: false, tier1: false, tier2: true },
                                    ].map((row, index) => (
                                        <tr
                                            key={index}
                                            style={{
                                                borderBottom: '1px solid var(--color-rose)',
                                                backgroundColor: row.highlight ? 'var(--color-blush)' : 'transparent',
                                            }}
                                        >
                                            <td style={{
                                                padding: 'var(--space-4)',
                                                fontWeight: row.highlight ? 700 : 500,
                                                color: row.highlight ? 'var(--color-primary)' : 'inherit',
                                            }}>
                                                {row.highlight && <BookOpen size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />}
                                                {row.feature}
                                            </td>
                                            <td style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                                                {row.free === true ? <Check size={20} color="var(--color-success)" /> :
                                                    row.free === false ? <X size={20} color="var(--color-slate)" /> : row.free}
                                            </td>
                                            <td style={{
                                                padding: 'var(--space-4)',
                                                textAlign: 'center',
                                                backgroundColor: row.highlight ? 'var(--color-rose)' : 'var(--color-blush)',
                                            }}>
                                                {row.tier1 === true ? <Check size={20} color="var(--color-success)" /> :
                                                    row.tier1 === false ? <X size={20} color="var(--color-slate)" /> : row.tier1}
                                            </td>
                                            <td style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                                                {row.tier2 === true ? <Check size={20} color="var(--color-success)" /> :
                                                    row.tier2 === false ? <X size={20} color="var(--color-slate)" /> : row.tier2}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Refund Policy */}
                <section className="section section--cream">
                    <div className="container">
                        <div style={{
                            maxWidth: '700px',
                            margin: '0 auto',
                            backgroundColor: 'var(--color-white)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--space-8)',
                            boxShadow: 'var(--shadow-md)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                                <Shield size={32} color="var(--color-primary)" />
                                <h3 style={{ marginBottom: 0 }}>Enforcement & Refund Policy</h3>
                            </div>
                            <p style={{ color: 'var(--color-slate)', marginBottom: 'var(--space-4)' }}>
                                Violation of community guidelines results in removal. If removed:
                            </p>
                            <ul style={{
                                paddingLeft: 'var(--space-6)',
                                color: 'var(--color-charcoal)',
                            }}>
                                <li style={{ marginBottom: 'var(--space-2)' }}>Access is terminated immediately</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>Any paid fees are non-refundable</li>
                                <li>Participation is a privilege, not a right</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="section section--primary">
                    <div className="container text-center">
                        <h2 style={{ marginBottom: 'var(--space-4)' }}>Ready to Begin?</h2>
                        <p style={{
                            fontSize: 'var(--text-lg)',
                            opacity: 0.9,
                            marginBottom: 'var(--space-6)',
                        }}>
                            Start with our free tier and upgrade when you&apos;re ready.
                            Paid members receive a copy of &quot;Relationship Fitness&quot; shipped free!
                        </p>
                        <Link href="/register" className="btn btn--white btn--lg">
                            Create Your Free Account
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
