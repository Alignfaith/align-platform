import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ALIGN | Grow Before You Go · The Ultimate Christian Relationship Platform',
  description: 'ALIGN is the ultimate Christian relationship platform. Grow across the Six Pillars of Relationship Fitness before you start looking for love.',
  openGraph: {
    title: 'ALIGN | Grow Before You Go',
    description: 'The Ultimate Christian Relationship Platform. Grow before you go.',
    url: 'https://alignfaith.com',
    siteName: 'ALIGN',
    type: 'website',
  },
}

const APP_URL = 'https://app.alignfaith.com'
const BOOK_URL = 'https://a.co/d/09qpJCAh'

const pillars = [
  { icon: '✦', name: 'Spiritual', color: '#c0182a', bg: '#FEF2F2', desc: 'How your faith shows up in daily life, decisions, and relationships.' },
  { icon: '◈', name: 'Mental', color: '#7c3aed', bg: '#F5F3FF', desc: 'How you think, respond, and handle pressure with clarity and humility.' },
  { icon: '⊕', name: 'Physical', color: '#0369a1', bg: '#F0F9FF', desc: 'How you steward your body through movement, health, and daily habits.' },
  { icon: '◆', name: 'Financial', color: '#15803d', bg: '#F0FDF4', desc: 'How you handle money, plan wisely, and live with generosity.' },
  { icon: '⊙', name: 'Appearance', color: '#b45309', bg: '#FFFBEB', desc: 'How you present yourself with intention, dignity, and confidence.' },
  { icon: '♡', name: 'Intimacy', color: '#be185d', bg: '#FDF2F8', desc: 'How you approach emotional and physical boundaries in relationship.' },
]

const testimonials = [
  { quote: "ALIGN helped me realize I wasn't ready for the relationship I was asking God for. Working through the pillars changed everything.", name: 'Marcus T.' },
  { quote: "This isn't another dating app. It's a platform that actually helped me grow before trying to connect with someone.", name: 'Jasmine R.' },
  { quote: "The framework is grounded in scripture and practical wisdom. I've recommended it to everyone in my small group.", name: 'David O.' },
]

const steps = [
  {
    num: '01',
    title: 'Request an Invite',
    desc: 'ALIGN is invitation only. Contact us to request access and we will review your request personally.',
  },
  {
    num: '02',
    title: 'Complete Your Assessment',
    desc: 'Work through the Six Pillars self-assessment to get an honest picture of where you stand and where you need to grow.',
  },
  {
    num: '03',
    title: 'Grow, Then Connect',
    desc: 'Build your profile, engage the framework, and connect with others who are serious about preparation before partnership.',
  },
]

export default function MarketingHome() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
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
            background: 'linear-gradient(to bottom, rgba(10,4,6,0.05) 0%, rgba(10,4,6,0.25) 50%, rgba(10,4,6,0.65) 100%)',
          }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '80px 24px 72px', maxWidth: '780px', margin: '0 auto' }}>
          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.75rem, 7vw, 5rem)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: '20px',
            textShadow: '0 2px 20px rgba(0,0,0,0.4)',
          }}>
            Grow Before You Go.
          </h1>

          {/* Subheadline */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: 'rgba(255,255,255,0.6)',
            fontWeight: 500,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}>
            The Ultimate Christian Relationship Platform
          </p>

          {/* Body */}
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
            color: 'rgba(255,255,255,0.82)',
            lineHeight: 1.75,
            marginBottom: '40px',
            maxWidth: '580px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            We believe the person you become determines the relationship you attract.
            Before you start looking for love, ALIGN helps you grow across the Six Pillars
            of Relationship Fitness.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Link href="/framework" style={{
              backgroundColor: '#c0182a',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(192,24,42,0.45)',
            }}>
              Explore the Six Pillars
            </Link>
          </div>

          {/* Trust line */}
          <p style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
            marginBottom: '10px',
          }}>
            100% Faith-Based · Built on Biblical Principles
          </p>

          {/* Book italic */}
          <p style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: '0.75rem',
            fontStyle: 'italic',
          }}>
            Based on the book <em>Relationship Fitness</em> by Thomas Marks
          </p>
        </div>

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
          background: 'linear-gradient(to bottom, transparent, #ffffff)',
          zIndex: 2,
        }} />
      </section>

      {/* ── Ticker Bar ────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: '#c0182a',
        overflow: 'hidden',
        padding: '12px 0',
        borderTop: '1px solid rgba(0,0,0,0.1)',
      }}>
        <style>{`
          @keyframes ticker {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .ticker-track {
            display: flex;
            white-space: nowrap;
            animation: ticker 28s linear infinite;
          }
        `}</style>
        <div className="ticker-track">
          {[...Array(6)].map((_, i) => (
            <span key={i} style={{
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '0 40px',
              flexShrink: 0,
            }}>
              Grow Before You Go&nbsp;&nbsp;·&nbsp;&nbsp;Faith-Based&nbsp;&nbsp;·&nbsp;&nbsp;Six Pillars of Relationship Fitness
            </span>
          ))}
        </div>
      </div>

      {/* ── Six Pillars ───────────────────────────────────────────── */}
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

      {/* ── Tagline ───────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F9FAFB', padding: '72px 24px', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
        <p style={{
          maxWidth: '760px',
          margin: '0 auto',
          textAlign: 'center',
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(1.35rem, 3vw, 2rem)',
          fontWeight: 800,
          color: '#c0182a',
          lineHeight: 1.45,
          letterSpacing: '-0.01em',
        }}>
          &ldquo;At ALIGN, we align before we match.&rdquo;
        </p>
      </section>

      {/* ── How It Works ──────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#ffffff', padding: '96px 24px', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ color: '#c0182a', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
              How It Works
            </p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
              Grow first. Connect after.
            </h2>
            <p style={{ color: '#6B7280', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
              ALIGN is not a swipe app. It is a preparation platform built for Christians who are serious about becoming the right person before finding one.
            </p>
          </div>

          {/* Steps */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {steps.map((s) => (
              <div key={s.num} style={{
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '14px',
                padding: '28px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}>
                <span style={{
                  display: 'inline-block',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#c0182a',
                  letterSpacing: '0.1em',
                  backgroundColor: '#FEF2F2',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                }}>
                  {s.num}
                </span>
                <h3 style={{ color: '#111827', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '10px' }}>
                  {s.title}
                </h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meet the Founder ──────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F9FAFB', padding: '96px 24px', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <p style={{ color: '#c0182a', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '48px', textAlign: 'center' }}>
            Meet the Founder
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '56px',
            alignItems: 'flex-start',
          }}
            className="marketing-founder-layout"
          >
            {/* Photo */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Image
                src="/images/thomas-marks.png"
                alt="Thomas Marks"
                width={220}
                height={275}
                style={{ objectFit: 'contain', objectPosition: 'top' }}
              />
            </div>

            {/* Bio */}
            <div>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                fontWeight: 800,
                color: '#111827',
                lineHeight: 1.1,
                margin: '0 0 8px',
              }}>
                Thomas Marks
              </h2>
              <p style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#c0182a',
                margin: '0 0 24px',
              }}>
                Founder &amp; Author
              </p>
              <p style={{
                color: '#374151',
                fontSize: '1rem',
                lineHeight: 1.8,
                margin: '0 0 32px',
                maxWidth: '520px',
              }}>
                Thomas Marks is the founder of ALIGN and the author of{' '}
                <em>Relationship Fitness</em>. Led by God to build a platform where
                Christians could grow together — not just read about growth alone —
                Thomas created ALIGN on the conviction that the person you become
                determines the relationship you attract.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" style={{
                  backgroundColor: '#c0182a', color: '#fff', padding: '11px 24px',
                  borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none',
                }}>
                  Get the Book
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Proof ──────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#ffffff', padding: '96px 24px', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
              What members are saying
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {testimonials.map((t) => (
              <div key={t.name} style={{
                backgroundColor: '#F9FAFB',
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

      {/* ── Book Banner ───────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#ffffff', padding: '96px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Book card */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '48px',
            alignItems: 'center',
            backgroundColor: '#FFF7F7',
            border: '1px solid #FECACA',
            borderRadius: '20px',
            padding: '48px',
          }}
            className="marketing-book-layout"
          >
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
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" style={{
                  backgroundColor: '#c0182a', color: '#fff', padding: '12px 24px',
                  borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none',
                  display: 'inline-block',
                }}>
                  Get it on Amazon →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #c0182a 0%, #7a0f1a 100%)',
        padding: '96px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#fff', marginBottom: '16px', lineHeight: 1.15 }}>
            Grow before you go.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '36px' }}>
            The person you become determines the relationship you attract.
          </p>
          <Link href="/framework" style={{
            backgroundColor: '#fff', color: '#c0182a', padding: '14px 36px',
            borderRadius: '10px', fontSize: '1rem', fontWeight: 700, textDecoration: 'none',
            display: 'inline-block', boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          }}>
            Explore the Six Pillars →
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) {
          .marketing-founder-layout {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
            text-align: center;
          }
          .marketing-founder-layout img {
            max-width: 220px;
            margin: 0 auto;
          }
          .marketing-founder-layout p {
            margin-left: auto;
            margin-right: auto;
          }
          .marketing-book-layout {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
            text-align: center;
            padding: 28px !important;
          }
        }
      `}</style>
    </>
  )
}
