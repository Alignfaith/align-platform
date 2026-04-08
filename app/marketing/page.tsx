import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Align | Faith-Centered Relationships',
  description: 'A Christian platform for men and women who are serious about preparing for lasting love. Built on the Six Pillars of Relationship Fitness.',
  openGraph: {
    title: 'Align | Faith-Centered Relationships',
    description: 'Preparation before connection. Built on the Six Pillars of Relationship Fitness.',
    url: 'https://alignfaith.com',
    siteName: 'Align',
    type: 'website',
  },
}

const APP_URL = 'https://app.alignfaith.com'
const BOOK_URL = 'https://a.co/d/00YpCAUt'

const pillars = [
  { icon: '✦', name: 'Spiritual', color: '#c0182a', bg: '#FEF2F2', desc: 'How your faith shows up in daily life, decisions, and relationships.' },
  { icon: '◈', name: 'Mental', color: '#7c3aed', bg: '#F5F3FF', desc: 'How you think, respond, and handle pressure with clarity and humility.' },
  { icon: '⊕', name: 'Physical', color: '#0369a1', bg: '#F0F9FF', desc: 'How you steward your body through movement, health, and daily habits.' },
  { icon: '◆', name: 'Financial', color: '#15803d', bg: '#F0FDF4', desc: 'How you handle money, plan wisely, and live with generosity.' },
  { icon: '⊙', name: 'Appearance', color: '#b45309', bg: '#FFFBEB', desc: 'How you present yourself with intention, dignity, and confidence.' },
  { icon: '♡', name: 'Intimacy', color: '#be185d', bg: '#FDF2F8', desc: 'How you approach emotional and physical boundaries in relationship.' },
]

const testimonials = [
  { quote: "Align helped me realize I wasn't ready for the relationship I was asking God for. Working through the pillars changed everything.", name: 'Marcus T.' },
  { quote: "This isn't another dating app. It's a platform that actually helped me grow before trying to connect with someone.", name: 'Jasmine R.' },
  { quote: "The framework is grounded in scripture and practical wisdom. I've recommended it to everyone in my small group.", name: 'David O.' },
]

export default function MarketingHome() {
  return (
    <>
      {/* Hero — dark with image, lightened overlay */}
      <section style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#1a0408',
      }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image
            src="/images/hero-cross.png"
            alt=""
            fill
            style={{ objectFit: 'cover', opacity: 0.55 }}
            priority
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(10,4,6,0.45) 0%, rgba(10,4,6,0.35) 60%, rgba(10,4,6,0.7) 100%)',
          }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '80px 24px', maxWidth: '760px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '100px',
            padding: '6px 16px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '28px',
          }}>
            Faith · Preparation · Connection
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '24px',
            textShadow: '0 2px 20px rgba(0,0,0,0.4)',
          }}>
            Prepare yourself for<br />
            <span style={{ color: '#f87171' }}>the love you desire</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.75,
            marginBottom: '40px',
            maxWidth: '560px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            Align is a faith-centered platform for Christians who believe preparation comes before connection. Built on the Six Pillars of Relationship Fitness.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`${APP_URL}/register`} style={{
              backgroundColor: '#c0182a',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(192,24,42,0.4)',
            }}>
              Join the Platform — Free
            </a>
            <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.35)',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}>
              Get the Book
            </a>
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
          background: 'linear-gradient(to bottom, transparent, #ffffff)',
          zIndex: 2,
        }} />
      </section>

      {/* Six Pillars */}
      <section style={{ backgroundColor: '#ffffff', padding: '96px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ color: '#c0182a', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
              The Framework
            </p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
              Six Pillars of Relationship Fitness
            </h2>
            <p style={{ color: '#6B7280', fontSize: '1.05rem', maxWidth: '540px', margin: '0 auto', lineHeight: 1.7 }}>
              Before connecting with someone else, you must know where you stand in six critical areas of your own life.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {pillars.map((p) => (
              <div key={p.name} style={{
                backgroundColor: '#ffffff',
                border: '1px solid #E5E7EB',
                borderRadius: '14px',
                padding: '28px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '10px',
                  backgroundColor: p.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', color: p.color, marginBottom: '16px',
                }}>
                  {p.icon}
                </div>
                <h3 style={{ color: '#111827', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '8px' }}>
                  {p.name} Fitness
                </h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.65 }}>{p.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/framework" style={{
              color: '#c0182a', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}>
              Explore the full framework →
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section style={{ backgroundColor: '#F9FAFB', padding: '96px 24px', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
              What members are saying
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {testimonials.map((t) => (
              <div key={t.name} style={{
                backgroundColor: '#ffffff',
                border: '1px solid #E5E7EB',
                borderRadius: '14px',
                padding: '28px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '14px' }}>
                  {[...Array(5)].map((_, i) => <span key={i} style={{ color: '#f59e0b', fontSize: '0.9rem' }}>★</span>)}
                </div>
                <p style={{ color: '#374151', fontSize: '0.975rem', lineHeight: 1.75, marginBottom: '20px' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p style={{ color: '#6B7280', fontWeight: 600, fontSize: '0.875rem' }}>— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Banner */}
      <section style={{ backgroundColor: '#ffffff', padding: '96px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '48px',
            alignItems: 'center',
            backgroundColor: '#FFF7F7',
            border: '1px solid #FECACA',
            borderRadius: '20px',
            padding: '48px',
          }}>
            <div>
              <Image
                src="/images/book-cover.png"
                alt="Relationship Fitness by Thomas Marks"
                width={160}
                height={220}
                style={{ borderRadius: '8px', boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }}
              />
            </div>
            <div>
              <p style={{ color: '#c0182a', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
                The Book
              </p>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#111827', marginBottom: '12px', lineHeight: 1.2 }}>
                Relationship Fitness
              </h2>
              <p style={{ color: '#374151', lineHeight: 1.75, fontSize: '0.95rem', marginBottom: '28px' }}>
                The book that started it all. Thomas Marks walks you through each pillar with scripture, practical exercises, and honest self-assessment tools to prepare you for the relationship God has for you.
              </p>
              <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" style={{
                backgroundColor: '#c0182a', color: '#fff', padding: '12px 28px',
                borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none',
                display: 'inline-block',
              }}>
                Get it on Amazon →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #c0182a 0%, #7a0f1a 100%)',
        padding: '96px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#fff', marginBottom: '16px', lineHeight: 1.15 }}>
            Start your preparation today
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '36px' }}>
            Create your free account, take the Six Pillars assessment, and begin the work that leads to the love you desire.
          </p>
          <a href={`${APP_URL}/register`} style={{
            backgroundColor: '#fff', color: '#c0182a', padding: '14px 36px',
            borderRadius: '10px', fontSize: '1rem', fontWeight: 700, textDecoration: 'none',
            display: 'inline-block', boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          }}>
            Create Free Account
          </a>
        </div>
      </section>
    </>
  )
}
