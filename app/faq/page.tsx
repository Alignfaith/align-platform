'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
    {
        category: 'About Align',
        questions: [
            {
                q: 'What is Align?',
                a: 'Align is a Christian-based relationship platform built on the Relationship Fitness framework. Unlike traditional dating apps, Align focuses on personal preparation and character development before connection. All interaction is based on the Six Pillars system—not swiping or profile photos.',
            },
            {
                q: 'How is Align different from other dating apps?',
                a: 'Align is not a swipe app and not profile-based. Photos are not shown initially—they unlock only after mutual interest and intentional conversation. Everyone sees the same experience regardless of gender. The focus is on growth, faith, and readiness, not transactions.',
            },
            {
                q: 'What is the Relationship Fitness framework?',
                a: 'Relationship Fitness is a framework developed by Thomas Marks, based on his book of the same name. It identifies Six Pillars essential for healthy relationships: Spiritual, Mental, Physical, Financial, Appearance, and Intimacy Fitness. These pillars guide preparation and discernment on Align.',
            },
        ],
    },
    {
        category: 'Membership & Pricing',
        questions: [
            {
                q: 'Is Align free to join?',
                a: 'Yes! Joining Align is completely free. Free members can create an account, complete onboarding, answer reflection questions, and engage with the Six Pillars privately for self-growth. However, viewing and connecting with other members requires a paid tier.',
            },
            {
                q: 'What are the paid membership tiers?',
                a: 'Tier 1 (Preparation Engagement) is $34.99/month ($29.99 with 6-month commitment) and allows viewing members, limited connections, and messaging. Tier 2 (Connection Plus) is $44.99/month ($39.99 with 6-month commitment) and includes priority placement, advanced filters, and access to events.',
            },
            {
                q: 'Can I cancel my membership?',
                a: 'Yes, you can cancel your paid membership at any time. Your access will continue until the end of your current billing period. Note that if you are removed for violating community guidelines, no refund will be provided.',
            },
        ],
    },
    {
        category: 'The Six Pillars',
        questions: [
            {
                q: 'What are the Six Pillars?',
                a: 'The Six Pillars are: Spiritual Fitness (faith foundation), Mental Fitness (emotional intelligence), Physical Fitness (body stewardship), Financial Fitness (resource wisdom), Appearance Fitness (intentional presentation), and Intimacy Fitness (healthy boundaries and preparation for covenant).',
            },
            {
                q: 'How are the pillars used on Align?',
                a: 'The pillars are used for three purposes: Preparation (self-assessment and growth), Discernment (understanding potential matches based on their pillar engagement), and Alignment (finding someone whose growth journey aligns with yours). They are NOT used for scoring or ranking.',
            },
            {
                q: 'Do I need to be perfect in all pillars?',
                a: 'Absolutely not. The pillars are about growth, not perfection. Align values people who are actively working on themselves and committed to becoming better. Honest self-reflection and genuine effort matter more than having it all together.',
            },
        ],
    },
    {
        category: 'Photos & Privacy',
        questions: [
            {
                q: 'Why aren\'t photos shown initially?',
                a: 'We believe character matters more than appearance. By hiding photos initially, members connect based on values, faith, and pillar alignment first. This creates more meaningful connections and reduces superficial swiping behavior.',
            },
            {
                q: 'When are photos unlocked?',
                a: 'Photos are unlocked in Stage Two, after mutual interest has been established and intentional conversation has taken place. This ensures both parties have connected on a deeper level before appearance becomes a factor.',
            },
            {
                q: 'What photo standards does Align enforce?',
                a: 'Align prohibits bikini/swimsuit photos, shirtless/topless photos, and any sexually suggestive images. We maintain a modest, respectful environment. Violations result in immediate removal from the platform.',
            },
        ],
    },
    {
        category: 'Registration & The Book',
        questions: [
            {
                q: 'What are the required reflection questions?',
                a: 'All members must complete three reflections: (1) What does preparation before pursuit mean to you? (2) Which pillar do you most need to grow in and why? (3) How does your faith influence your approach to relationships? These help us understand your readiness and commitment.',
            },
            {
                q: 'Do I need to read the Relationship Fitness book?',
                a: 'While owning and reading the book is encouraged, it is not strictly required. However, you must confirm that you understand the Relationship Fitness framework and are committed to its principles. The book provides the deepest understanding of the Six Pillars.',
            },
            {
                q: 'Where can I get the book?',
                a: 'The Relationship Fitness book by Thomas Marks is available on Amazon. You can find it by searching "Relationship Fitness Thomas Marks" or visiting our Book page for a direct link.',
            },
        ],
    },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div style={{
            borderBottom: '1px solid var(--color-rose)',
        }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: 'var(--space-4) 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 600,
                    color: 'var(--color-charcoal)',
                }}
            >
                <span>{question}</span>
                {isOpen ? <ChevronUp size={20} color="var(--color-primary)" /> : <ChevronDown size={20} color="var(--color-slate)" />}
            </button>
            {isOpen && (
                <div style={{
                    paddingBottom: 'var(--space-4)',
                    color: 'var(--color-slate)',
                    lineHeight: 'var(--leading-relaxed)',
                }}>
                    {answer}
                </div>
            )}
        </div>
    )
}

export default function FAQPage() {
    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                {/* Hero */}
                <section className="section section--primary">
                    <div className="container text-center">
                        <h1 style={{ marginBottom: 'var(--space-4)' }}>Frequently Asked Questions</h1>
                        <p style={{ fontSize: 'var(--text-xl)', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
                            Everything you need to know about Align and the Relationship Fitness framework.
                        </p>
                    </div>
                </section>

                {/* FAQs */}
                <section className="section section--cream">
                    <div className="container">
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            {faqs.map((category) => (
                                <div key={category.category} style={{ marginBottom: 'var(--space-10)' }}>
                                    <h2 style={{
                                        fontSize: 'var(--text-2xl)',
                                        color: 'var(--color-primary)',
                                        marginBottom: 'var(--space-4)',
                                    }}>
                                        {category.category}
                                    </h2>
                                    <div style={{
                                        backgroundColor: 'var(--color-white)',
                                        borderRadius: 'var(--radius-xl)',
                                        padding: '0 var(--space-6)',
                                        boxShadow: 'var(--shadow-sm)',
                                    }}>
                                        {category.questions.map((faq, index) => (
                                            <FAQItem key={index} question={faq.q} answer={faq.a} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Still have questions */}
                <section className="section section--white">
                    <div className="container text-center">
                        <h2 style={{ marginBottom: 'var(--space-4)' }}>Still Have Questions?</h2>
                        <p style={{ color: 'var(--color-slate)', marginBottom: 'var(--space-6)', maxWidth: '500px', margin: '0 auto var(--space-6)' }}>
                            We're here to help. Reach out to our support team and we'll get back to you as soon as possible.
                        </p>
                        <Link href="/contact" className="btn btn--primary btn--lg">
                            Contact Us
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
