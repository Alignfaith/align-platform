import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About | ALIGN',
  description: 'Thomas Marks built ALIGN after years of ministry, counseling, and a conviction that most Christians enter relationships unprepared. Learn the mission behind the platform.',
  openGraph: {
    title: 'About ALIGN',
    description: 'The story behind ALIGN — why preparation matters and what the Six Pillars framework is built to do.',
    url: 'https://alignfaith.com/about',
  },
}

const APP_URL = 'https://app.alignfaith.com'

const values = [
  { title: 'Preparation First', body: 'You cannot offer someone a version of yourself you have not yet become. We believe every person must do the inner work before pursuing connection.' },
  { title: 'Faith as Foundation', body: 'This platform is built for Christians who take their faith seriously — not as a checkbox, but as the governing principle of their entire life, including relationships.' },
  { title: 'Honest Self-Assessment', body: 'The Six Pillars framework is designed to reveal gaps, not just validate strengths. Growth requires honesty.' },
  { title: 'Community Over Algorithm', body: 'ALIGN is not a swipe app. Every match decision is rooted in alignment — shared values, readiness, and purpose.' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section style={{
        backgroundColor: '#ffffff',
        padding: '96px 24px 80px',
        textAlign: 'center',
        borderBottom: '1px solid #E5E7EB',
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <p style={{ color: '#c0182a', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Our Story
          </p>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            color: '#111827',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: '20px',
          }}>
            Built by someone who has seen what unpreparedness costs
          </h1>
          <p style={{ color: '#6B7280', fontSize: '1.1rem', lineHeight: 1.75 }}>
            ALIGN was born from years of ministry, coaching, and the recurring observation that most relationship pain is rooted in entering partnership before being ready.
          </p>
        </div>
      </section>

      {/* Thomas story */}
      <section style={{ backgroundColor: '#ffffff', padding: '80px 24px' }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '64px', alignItems: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '180px', height: '180px', borderRadius: '50%', overflow: 'hidden',
              border: '3px solid #FECACA', margin: '0 auto', backgroundColor: '#FEF2F2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Image src="/images/logo.png" alt="Thomas Marks" width={180} height={180} style={{ objectFit: 'cover' }} />
            </div>
            <p style={{ color: '#111827', fontWeight: 700, marginTop: '16px', fontSize: '1.1rem' }}>Thomas Marks</p>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Founder, Author, Coach</p>
          </div>

          <div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#111827', marginBottom: '20px', lineHeight: 1.25 }}>
              The conviction behind ALIGN
            </h2>
            <p style={{ color: '#374151', lineHeight: 1.8, marginBottom: '16px', fontSize: '0.975rem' }}>
              After years working with singles and couples in ministry and coaching contexts, Thomas Marks noticed a pattern: the people who struggled most in relationships weren&apos;t lacking in faith — they were lacking in preparation. They hadn&apos;t done the honest self-work required to be a healthy partner.
            </p>
            <p style={{ color: '#374151', lineHeight: 1.8, marginBottom: '16px', fontSize: '0.975rem' }}>
              That observation led to writing <em style={{ color: '#111827', fontWeight: 600 }}>Relationship Fitness</em> — a framework built on six domains of personal development that form the bedrock of relational health.
            </p>
            <p style={{ color: '#374151', lineHeight: 1.8, fontSize: '0.975rem' }}>
              ALIGN is the digital home of that framework — a platform where preparation is treated as the first step, not an afterthought.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section style={{ backgroundColor: '#FEF2F2', padding: '80px 24px', borderTop: '1px solid #FECACA', borderBottom: '1px solid #FECACA' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#c0182a', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Our Mission
          </p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#111827', marginBottom: '24px', lineHeight: 1.25 }}>
            To equip Christians to enter relationships whole — not hoping the relationship will make them whole.
          </h2>
          <p style={{ color: '#374151', lineHeight: 1.8, fontSize: '1rem' }}>
            The world tells you to find the right person. We believe you must first become the right person. ALIGN exists to help you do that work — honestly, systematically, and in community with others on the same journey.
          </p>
        </div>
      </section>

      {/* Values */}
      <section style={{ backgroundColor: '#ffffff', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#111827' }}>
              What we believe
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {values.map(v => (
              <div key={v.title} style={{
                backgroundColor: '#ffffff', border: '1px solid #E5E7EB',
                borderRadius: '14px', padding: '28px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#c0182a', marginBottom: '16px' }} />
                <h3 style={{ color: '#111827', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', marginBottom: '10px' }}>{v.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.7 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#F9FAFB', padding: '80px 24px', textAlign: 'center', borderTop: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
            Ready to begin?
          </h2>
          <p style={{ color: '#6B7280', lineHeight: 1.7, marginBottom: '28px' }}>
            Take the Six Pillars assessment and see exactly where you stand.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`${APP_URL}/register`} style={{
              backgroundColor: '#c0182a', color: '#fff', padding: '12px 28px',
              borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none',
            }}>Join Free</a>
            <Link href="/framework" style={{
              backgroundColor: '#ffffff', border: '1px solid #D1D5DB',
              color: '#374151', padding: '12px 28px', borderRadius: '8px',
              fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none',
            }}>Explore the Framework</Link>
          </div>
        </div>
      </section>
    </>
  )
}
