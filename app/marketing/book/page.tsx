import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Relationship Fitness | Align',
  description: 'The book that started it all. Thomas Marks walks you through the Six Pillars of Relationship Fitness — preparing you for the love God has for you.',
  openGraph: {
    title: 'Relationship Fitness by Thomas Marks',
    description: 'Preparing yourself for the love you desire. Available on Amazon.',
    url: 'https://alignfaith.com/book',
  },
}

const BOOK_URL = 'https://a.co/d/00YpCAUt'
const APP_URL = 'https://app.alignfaith.com'

const chapters = [
  { num: 1, title: 'Understanding Your Starting Point', desc: 'An honest look at where you are — not where you wish you were.' },
  { num: 2, title: 'Spiritual Fitness: Building Your Foundation in God', desc: 'How to develop a personal, active faith that governs your relationships.' },
  { num: 3, title: 'Mental Fitness: Developing Emotional Intelligence', desc: 'Processing emotion, handling conflict, and breaking unhealthy patterns.' },
  { num: 4, title: 'Physical Fitness: Stewarding Your Body', desc: 'Why physical stewardship is a spiritual discipline — and how to practice it.' },
  { num: 5, title: 'Financial Fitness: Wisdom with Resources', desc: 'Building financial health before you need to share it with someone else.' },
  { num: 6, title: 'Appearance Fitness: Presenting Your Best Self', desc: 'Self-respect, intentionality, and confidence in how you show up.' },
  { num: 7, title: 'Intimacy Fitness: Preparing for Covenant', desc: 'Boundaries, healing, vulnerability, and what covenant really requires.' },
  { num: 8, title: 'Putting It All Together', desc: 'How the Six Pillars work as a system — and what readiness actually looks like.' },
]

const outcomes = [
  'A clear picture of where you are in all six areas of relationship fitness',
  'Practical exercises and honest self-assessment questions for each pillar',
  'Scripture-grounded perspective on what it means to be a ready partner',
  'A framework for evaluating compatibility beyond surface-level attraction',
  'The mindset shift required to stop searching for the right person and start becoming one',
]

const reviews = [
  { text: 'This is the book I wish someone had handed me before my first serious relationship. Every chapter hit close to home.', name: 'Marcus T.' },
  { text: 'Thomas writes with honesty and compassion. The self-assessment questions alone are worth the read.', name: 'Priya M.' },
  { text: 'I\'ve read a lot of Christian relationship books. This one is different because it starts with you, not your future spouse.', name: 'James O.' },
]

export default function BookPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: '#0A0A0B', padding: '80px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '56px',
          alignItems: 'center',
        }}>
          {/* Book image */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                inset: '-20px',
                background: 'radial-gradient(circle, rgba(192,24,42,0.2) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(20px)',
              }} />
              <Image
                src="/images/book-cover.png"
                alt="Relationship Fitness by Thomas Marks"
                width={240}
                height={330}
                style={{
                  borderRadius: '8px',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
                  position: 'relative',
                  zIndex: 1,
                }}
                priority
              />
            </div>
          </div>

          {/* Info */}
          <div>
            <p style={{ color: '#c0182a', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
              The Book
            </p>
            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              color: '#FAFAFA',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '12px',
            }}>
              Relationship Fitness
            </h1>
            <p style={{ color: '#71717A', fontSize: '1rem', marginBottom: '20px', fontStyle: 'italic' }}>
              Preparing yourself for the love you desire — by Thomas Marks
            </p>
            <p style={{ color: '#A1A1AA', lineHeight: 1.8, fontSize: '0.975rem', marginBottom: '32px' }}>
              Most Christians enter relationships hoping the right person will complete them. This book flips that model. Using the Six Pillars of Relationship Fitness, Thomas Marks walks you through an honest, scripture-grounded self-assessment to help you become the partner you want to attract.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href={BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#c0182a',
                  color: '#fff',
                  padding: '13px 28px',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                Buy on Amazon →
              </a>
              <a
                href={`${APP_URL}/register`}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#FAFAFA',
                  padding: '13px 28px',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Join the Platform
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What you'll learn */}
      <section style={{ backgroundColor: '#111113', padding: '80px 24px' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#FAFAFA', marginBottom: '12px' }}>
              What you&apos;ll walk away with
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px', margin: '0 auto' }}>
            {outcomes.map((o, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(192,24,42,0.15)',
                  border: '1px solid rgba(192,24,42,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                  fontSize: '0.7rem',
                  color: '#c0182a',
                  fontWeight: 700,
                }}>✓</div>
                <p style={{ color: '#A1A1AA', fontSize: '0.975rem', lineHeight: 1.65 }}>{o}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chapters */}
      <section style={{ backgroundColor: '#0A0A0B', padding: '80px 24px' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#FAFAFA' }}>
              Inside the book
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {chapters.map((c) => (
              <div key={c.num} style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr',
                gap: '16px',
                padding: '20px',
                borderRadius: '10px',
                backgroundColor: '#111113',
                border: '1px solid rgba(255,255,255,0.04)',
                marginBottom: '8px',
              }}>
                <span style={{ color: '#3f3f46', fontSize: '0.8rem', fontWeight: 700, paddingTop: '2px' }}>
                  {String(c.num).padStart(2, '0')}
                </span>
                <div>
                  <p style={{ color: '#FAFAFA', fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>{c.title}</p>
                  <p style={{ color: '#71717A', fontSize: '0.875rem', lineHeight: 1.55 }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section style={{ backgroundColor: '#111113', padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#FAFAFA' }}>Reader reviews</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {reviews.map((r) => (
              <div key={r.name} style={{
                backgroundColor: '#18181B',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '14px',
                padding: '28px',
              }}>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '14px' }}>
                  {[...Array(5)].map((_, i) => <span key={i} style={{ color: '#f59e0b', fontSize: '0.9rem' }}>★</span>)}
                </div>
                <p style={{ color: '#A1A1AA', fontSize: '0.9rem', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '16px' }}>
                  &ldquo;{r.text}&rdquo;
                </p>
                <p style={{ color: '#FAFAFA', fontWeight: 600, fontSize: '0.875rem' }}>— {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #c0182a 0%, #7a0f1a 100%)',
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
            Ready to do the work?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: '32px' }}>
            Get the book and start your preparation today.
          </p>
          <a
            href={BOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#fff',
              color: '#c0182a',
              padding: '14px 36px',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Get Relationship Fitness on Amazon
          </a>
        </div>
      </section>
    </>
  )
}
