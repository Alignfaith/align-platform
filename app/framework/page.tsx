import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Sun, Brain, Activity, TrendingUp, Sparkles, Heart, BookOpen, ArrowRight } from 'lucide-react'

const pillars = [
    {
        icon: Sun,
        name: 'Spiritual Fitness',
        description: 'How your faith shows up in your daily life, decisions, and relationships. This is about belief, practice, community, and direction — not perfection.',
    },
    {
        icon: Brain,
        name: 'Mental Fitness',
        description: 'How you think, respond, take responsibility, and handle life\'s pressures. This is about perspective, humility, and self-control — not diagnoses.',
    },
    {
        icon: Activity,
        name: 'Physical Fitness',
        description: 'How you care for your body through movement, health, and daily habits. This is about consistency and effort — not appearance or athleticism.',
    },
    {
        icon: TrendingUp,
        name: 'Financial Fitness',
        description: 'How you manage money, responsibility, and stability in your life. This is about stewardship and habits — not income or net worth.',
    },
    {
        icon: Sparkles,
        name: 'Appearance Fitness',
        description: 'How you present yourself and the effort you put into showing up well. This is about self-respect and awareness — not fashion or vanity.',
    },
    {
        icon: Heart,
        name: 'Intimacy Fitness',
        description: 'How you approach closeness, boundaries, trust, and emotional connection. This is about intention and maturity — not sexual experience or speed.',
    },
]

export default function FrameworkPage() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
                .fw-hero {
                    background: linear-gradient(160deg, #c0182a 0%, #8b0e1d 100%);
                    padding: 80px 40px;
                    text-align: center;
                }
                .fw-eyebrow {
                    font-size: 11px;
                    font-weight: 500;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.6);
                    margin-bottom: 20px;
                }
                .fw-hero h1 {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(36px, 6vw, 56px);
                    font-weight: 700;
                    color: #fff;
                    line-height: 1.15;
                    margin-bottom: 16px;
                }
                .fw-hero h1 em { font-style: italic; color: rgba(255,255,255,0.82); }
                .fw-hero-sub {
                    font-size: 17px;
                    color: rgba(255,255,255,0.7);
                    font-weight: 300;
                    max-width: 480px;
                    margin: 0 auto;
                }
                .fw-section {
                    padding: 80px 40px;
                    max-width: 860px;
                    margin: 0 auto;
                }
                .fw-label {
                    font-size: 11px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #c0182a;
                    margin-bottom: 14px;
                    display: block;
                }
                .fw-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(26px, 4vw, 36px);
                    font-weight: 700;
                    line-height: 1.2;
                    color: #1a1512;
                    margin-bottom: 20px;
                }
                .fw-body {
                    font-size: 16px;
                    color: #4a3f35;
                    line-height: 1.8;
                    max-width: 560px;
                }
                .fw-pillar-list { margin-top: 48px; }
                .fw-pillar-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 24px;
                    padding: 28px 0;
                    border-bottom: 1px solid #e8e2d8;
                }
                .fw-pillar-item:first-child { border-top: 1px solid #e8e2d8; }
                .fw-pillar-icon {
                    width: 40px; height: 40px;
                    border-radius: 50%;
                    background: #fdf0f1;
                    border: 1px solid #f0c8cc;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    margin-top: 2px;
                }
                .fw-pillar-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 18px;
                    font-weight: 700;
                    color: #1a1512;
                    margin-bottom: 6px;
                }
                .fw-pillar-desc { font-size: 15px; color: #5c5047; line-height: 1.7; }
                .fw-divider { width: 100%; height: 1px; background: #e8e2d8; }
                .fw-book {
                    padding: 80px 40px;
                    max-width: 860px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 56px;
                    align-items: center;
                }
                @media (max-width: 680px) {
                    .fw-book { grid-template-columns: 1fr; }
                    .fw-book img { margin: 0 auto; }
                }
                .fw-book-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(24px, 3.5vw, 32px);
                    font-weight: 700;
                    color: #1a1512;
                    margin-bottom: 14px;
                }
                .fw-book-body { font-size: 15px; color: #5c5047; line-height: 1.75; margin-bottom: 28px; }
                .fw-amazon-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #c0182a;
                    color: #fff;
                    font-size: 14px;
                    font-weight: 500;
                    letter-spacing: 0.04em;
                    padding: 13px 28px;
                    border-radius: 100px;
                    text-decoration: none;
                }
                .fw-quote {
                    background: #f5f0e8;
                    padding: 72px 40px;
                    text-align: center;
                    border-top: 1px solid #e8e2d8;
                    border-bottom: 1px solid #e8e2d8;
                }
                .fw-quote-icon { display: flex; justify-content: center; margin-bottom: 28px; }
                .fw-quote-text {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(18px, 2.8vw, 23px);
                    font-style: italic;
                    color: #2a1f18;
                    max-width: 620px;
                    margin: 0 auto 24px;
                    line-height: 1.75;
                }
                .fw-quote-attr {
                    font-size: 12px;
                    color: #9a8878;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                }
                .fw-cta {
                    background: #c0182a;
                    padding: 72px 40px;
                    text-align: center;
                }
                .fw-cta-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(28px, 4vw, 42px);
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 14px;
                }
                .fw-cta-sub {
                    font-size: 16px;
                    color: rgba(255,255,255,0.72);
                    margin-bottom: 36px;
                    font-weight: 300;
                }
                .fw-cta-btn {
                    display: inline-block;
                    background: #fff;
                    color: #c0182a;
                    font-size: 14px;
                    font-weight: 500;
                    letter-spacing: 0.06em;
                    padding: 14px 36px;
                    border-radius: 100px;
                    text-decoration: none;
                }
            `}</style>

            <Header />

            <main style={{ paddingTop: 'var(--header-height)' }}>

                <div className="fw-hero">
                    <p className="fw-eyebrow">The Framework</p>
                    <h1>The foundation of<br /><em>everything.</em></h1>
                    <p className="fw-hero-sub">Six areas of your life. One framework for becoming ready. Every part of ALIGN is built on this.</p>
                </div>

                <div className="fw-section">
                    <span className="fw-label">What it is</span>
                    <h2 className="fw-title">Relationship Fitness is not<br />a theory. It is a standard.</h2>
                    <p className="fw-body">
                        Developed by Thomas Marks, the Relationship Fitness framework identifies the six core areas
                        that determine whether a person is truly prepared for the weight of a lasting relationship.
                        It is not about being perfect. It is about being intentional — growing in every area before
                        you pursue connection with someone else.
                    </p>
                    <p className="fw-body" style={{ marginTop: '16px' }}>
                        Every question, every reflection, and every connection on ALIGN is organized around these six pillars.
                    </p>

                    <div className="fw-pillar-list">
                        {pillars.map((pillar) => (
                            <div key={pillar.name} className="fw-pillar-item">
                                <div className="fw-pillar-icon">
                                    <pillar.icon size={18} color="#c0182a" />
                                </div>
                                <div>
                                    <p className="fw-pillar-name">{pillar.name}</p>
                                    <p className="fw-pillar-desc">{pillar.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="fw-divider" />

                <div className="fw-book">
                    <img
                        src="/images/book-cover.png"
                        alt="Relationship Fitness by Thomas Marks"
                        style={{ width: '100%', maxWidth: '280px', borderRadius: '8px', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}
                    />
                    <div>
                        <span className="fw-label">The Book</span>
                        <h2 className="fw-book-title">Relationship Fitness</h2>
                        <p className="fw-book-body">
                            The framework behind ALIGN began as a book. <em>Relationship Fitness</em> by Thomas Marks
                            lays out the complete Six Pillar system — a Christ-centered guide for men and women who
                            want to stop stumbling into relationships and start preparing for them with intention and faith.
                        </p>
                        <a
                            href="https://a.co/d/0cgkpmBw"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="fw-amazon-btn"
                        >
                            Get on Amazon
                            <ArrowRight size={16} />
                        </a>
                    </div>
                </div>

                <div className="fw-quote">
                    <div className="fw-quote-icon">
                        <BookOpen size={40} color="#c0182a" strokeWidth={1.5} />
                    </div>
                    <p className="fw-quote-text">
                        Most relationships do not fall apart because of a lack of love. They fall apart because
                        people enter them unprepared for the weight, responsibility, and spiritual maturity that love requires.
                    </p>
                    <p className="fw-quote-attr">Thomas Marks — Relationship Fitness</p>
                </div>

                <div className="fw-cta">
                    <h2 className="fw-cta-title">Begin your journey.</h2>
                    <p className="fw-cta-sub">Preparation comes before connection. Start growing today.</p>
                    <Link className="fw-cta-btn" href="/register">Create Your Account</Link>
                </div>

            </main>

            <Footer />
        </>
    )
}
