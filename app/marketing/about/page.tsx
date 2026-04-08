import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About | Align',
  description: 'Thomas Marks built Align after years of ministry, counseling, and a conviction that most Christians enter relationships unprepared. Learn the mission behind the platform.',
  openGraph: {
    title: 'About Align',
    description: 'The story behind Align — why preparation matters and what the Six Pillars framework is built to do.',
    url: 'https://alignfaith.com/about',
  },
}

const APP_URL = 'https://app.alignfaith.com'

const values = [
  { title: 'Preparation First', body: 'You cannot offer someone a version of yourself you have not yet become. We believe every person must do the inner work before pursuing connection.' },
  { title: 'Faith as Foundation', body: 'This platform is built for Christians who take their faith seriously — not as a checkbox, but as the governing principle of their entire life, including relationships.' },
  { title: 'Honest Self-Assessment', body: 'The Six Pillars framework is designed to reveal gaps, not just validate strengths. Growth requires honesty.' },
  { title: 'Community Over Algorithm', body: 'Align is not a swipe app. Every match decision is rooted in alignment — shared values, readiness, and purpose.' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section style={{
        backgroundColor: '#0A0A0B',
        padding: '96px 24px 80px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <p style={{ color: '#c0182a', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Our Story
          </p>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            color: '#FAFAFA',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '20px',
          }}>
            Built by someone who has seen what unpreparedness costs
          </h1>
          <p style={{ color: '#A1A1AA', fontSize: '1.1rem', lineHeight: 1.75 }}>
            Align was born from years of ministry, coaching, and the recurring observation that most relationship pain is rooted in entering partnership before being ready.
          </p>
        </div>
      </section>

      {/* Thomas story */}
      <section style={{ backgroundColor: '#0A0A0B', padding: '80px 24px' }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '64px',
          alignItems: 'center',
        }}>
          <div>
            <div style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid rgba(192,24,42,0.3)',
              margin: '0 auto',
              backgroundColor: '#18181B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Image
                src="/images/logo.png"
                alt="Thomas Marks"
                width={200}
                height={200}
                style={{ objectFit: 'cover' }}
              />
            </div>
            <p style={{ textAlign: 'center', color: '#FAFAFA', fontWeight: 700, marginTop: '16px', fontSize: '1.1rem' }}>Thomas Marks</p>
            <p style={{ textAlign: 'center', color: '#71717A', fontSize: '0.875rem' }}>Founder, Author, Coach</p>
          </div>

          <div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#FAFAFA', marginBottom: '20px', lineHeight: 1.25 }}>
              The conviction behind Align
            </h2>
            <p style={{ color: '#A1A1AA', lineHeight: 1.8, marginBottom: '16px', fontSize: '0.975rem' }}>
              After years working with singles and couples in ministry and coaching contexts, Thomas Marks noticed a pattern: the people who struggled most in relationships weren't lacking in faith — they were lacking in preparation. They hadn't done the honest self-work required to be a healthy partner.
            </p>
            <p style={{ color: '#A1A1AA', lineHeight: 1.8, marginBottom: '16px', fontSize: '0.975rem' }}>
              That observation led to writing <em style={{ color: '#FAFAFA' }}>Relationship Fitness</em> — a framework built on six domains of personal development that form the bedrock of relational health: Spiritual, Mental, Physical, Financial, Appearance, and Intimacy.
            </p>
            <p style={{ color: '#A1A1AA', lineHeight: 1.8, fontSize: '0.975rem' }}>
              Align is the digital home of that framework — a platform where preparation is treated as the first step, not an afterthought.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section style={{ backgroundColor: '#111113', padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#c0182a', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Our Mission
          </p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#FAFAFA', marginBottom: '24px', lineHeight: 1.2 }}>
            To equip Christians to enter relationships whole, not hoping the relationship will make them whole.
          </h2>
          <p style={{ color: '#A1A1AA', lineHeight: 1.8, fontSize: '1rem' }}>
            The world tells you to find the right person. We believe you must first become the right person. Align exists to help you do that work — honestly, systematically, and in community with others on the same journey.
          </p>
        </div>
      </section>

      {/* Values */}
      <section style={{ backgroundColor: '#0A0A0B', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#FAFAFA' }}>
              What we believe
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {values.map(v => (
              <div key={v.title} style={{
                backgroundColor: '#111113',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '14px',
                padding: '28px',
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#c0182a', marginBottom: '16px' }} />
                <h3 style={{ color: '#FAFAFA', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', marginBottom: '10px' }}>{v.title}</h3>
                <p style={{ color: '#71717A', fontSize: '0.9rem', lineHeight: 1.7 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#111113', padding: '80px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#FAFAFA', marginBottom: '16px' }}>
            Ready to begin?
          </h2>
          <p style={{ color: '#A1A1AA', lineHeight: 1.7, marginBottom: '28px' }}>
            Take the Six Pillars assessment and see exactly where you stand.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`${APP_URL}/register`} style={{
              backgroundColor: '#c0182a', color: '#fff', padding: '12px 28px',
              borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none',
            }}>
              Join Free
            </a>
            <Link href="/framework" style={{
              backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#FAFAFA', padding: '12px 28px', borderRadius: '8px', fontSize: '0.95rem',
              fontWeight: 600, textDecoration: 'none',
            }}>
              Explore the Framework
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
