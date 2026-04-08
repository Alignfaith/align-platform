import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The Six Pillars Framework | ALIGN',
  description: 'A deep dive into the Six Pillars of Relationship Fitness — Spiritual, Mental, Physical, Financial, Appearance, and Intimacy.',
  openGraph: {
    title: 'The Six Pillars of Relationship Fitness',
    description: 'Six domains of personal development that form the foundation of relational health.',
    url: 'https://alignfaith.com/framework',
  },
}

const APP_URL = 'https://app.alignfaith.com'
const BOOK_URL = 'https://a.co/d/00YpCAUt'

const pillars = [
  {
    number: '01', name: 'Spiritual Fitness', color: '#c0182a', bg: '#FEF2F2', border: '#FECACA',
    tagline: 'Faith as your foundation, not your facade.',
    description: 'Spiritual fitness is about how your faith shows up in your daily life, decisions, and relationships. It\'s not about perfection or performance — it\'s about consistency, direction, and being genuinely surrendered to God.',
    questions: [
      'Is my relationship with God personal and active, not just institutional?',
      'Does my faith govern my decision-making, including in relationships?',
      'Am I part of a faith community that holds me accountable?',
      'How do I handle seasons of spiritual dryness or doubt?',
    ],
    scripture: '"Trust in the LORD with all your heart and lean not on your own understanding." — Proverbs 3:5',
  },
  {
    number: '02', name: 'Mental Fitness', color: '#7c3aed', bg: '#F5F3FF', border: '#DDD6FE',
    tagline: 'The mind you bring shapes the relationship you build.',
    description: 'Mental fitness covers how you think, how you process emotions, how you take responsibility, and how you respond under pressure. This is about developing the emotional intelligence and psychological health to be a present, mature partner.',
    questions: [
      'Do I take responsibility for my emotions, or do I blame others for how I feel?',
      'Have I done the work to address past trauma, unhealthy patterns, or unresolved wounds?',
      'How do I handle conflict — do I fight, freeze, or work through it?',
      'Am I coachable? Can I receive feedback without becoming defensive?',
    ],
    scripture: '"Do not conform to the pattern of this world, but be transformed by the renewing of your mind." — Romans 12:2',
  },
  {
    number: '03', name: 'Physical Fitness', color: '#0369a1', bg: '#F0F9FF', border: '#BAE6FD',
    tagline: 'Stewardship of the body is a spiritual discipline.',
    description: 'Physical fitness is about how you care for your body through movement, nutrition, rest, and daily habits. This is not about appearance standards — it\'s about honoring the body God gave you and having the energy to show up fully.',
    questions: [
      'Am I actively stewarding my physical health through regular movement?',
      'Do I get adequate rest and maintain sustainable daily routines?',
      'Are there physical health issues I\'ve been avoiding that I need to address?',
      'Does my level of physical vitality reflect the care I want to model to a partner?',
    ],
    scripture: '"Do you not know that your bodies are temples of the Holy Spirit?" — 1 Corinthians 6:19',
  },
  {
    number: '04', name: 'Financial Fitness', color: '#15803d', bg: '#F0FDF4', border: '#BBF7D0',
    tagline: 'How you handle money reveals what you truly value.',
    description: 'Financial fitness is about wisdom, discipline, and generosity with your resources. Shared finances are one of the leading sources of relational conflict. Preparing financially before entering a relationship is an act of love toward your future partner.',
    questions: [
      'Do I have a budget and live within my means?',
      'Am I working toward financial stability, or running from financial responsibility?',
      'Do I give generously? Does my spending reflect my values?',
      'Have I been honest with myself about debt, spending habits, and financial goals?',
    ],
    scripture: '"For which of you, desiring to build a tower, does not first sit down and count the cost?" — Luke 14:28',
  },
  {
    number: '05', name: 'Appearance Fitness', color: '#b45309', bg: '#FFFBEB', border: '#FDE68A',
    tagline: 'Presenting yourself with intention honors both you and others.',
    description: 'Appearance fitness is about how you carry and present yourself — with dignity, intentionality, and confidence. This is not about vanity or meeting a beauty standard. It\'s about taking care of your presentation as a form of self-respect.',
    questions: [
      'Do I invest appropriate care in how I present myself in public and in relationship?',
      'Am I comfortable in my own skin, or do I carry unresolved insecurity into relationships?',
      'Do I dress and carry myself in a way that reflects the values I claim to hold?',
      'Am I honest about how my appearance habits may affect others?',
    ],
    scripture: '"Man looks at the outward appearance, but the LORD looks at the heart." — 1 Samuel 16:7',
  },
  {
    number: '06', name: 'Intimacy Fitness', color: '#be185d', bg: '#FDF2F8', border: '#FBCFE8',
    tagline: 'True intimacy is built before it is experienced.',
    description: 'Intimacy fitness is about how you approach emotional and physical closeness — your boundaries, your expectations, your history, and your readiness for covenant-level connection. This pillar requires the most honesty and often the most healing.',
    questions: [
      'Have I set clear emotional and physical boundaries that I am committed to holding?',
      'Have I addressed past sexual or relational wounds with appropriate help?',
      'Do I understand the difference between emotional intimacy and romantic feeling?',
      'Am I prepared for the vulnerability that covenant relationship requires?',
    ],
    scripture: '"Above all else, guard your heart, for everything you do flows from it." — Proverbs 4:23',
  },
]

export default function FrameworkPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: '#ffffff', padding: '96px 24px 80px', textAlign: 'center', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ color: '#c0182a', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
            The Framework
          </p>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontFamily: 'var(--font-heading)',
            fontWeight: 800, color: '#111827', lineHeight: 1.1,
            letterSpacing: '-0.02em', marginBottom: '20px',
          }}>
            Six Pillars of Relationship Fitness
          </h1>
          <p style={{ color: '#6B7280', fontSize: '1.1rem', lineHeight: 1.75 }}>
            These are not six things to find in a partner. They are six areas of your own life that must be worked on — honestly and continuously — before you are truly ready for covenant love.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section style={{ backgroundColor: '#F9FAFB', padding: '80px 24px' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {pillars.map((p) => (
            <div key={p.number} style={{
              backgroundColor: '#ffffff',
              border: `1px solid ${p.border}`,
              borderLeft: `4px solid ${p.color}`,
              borderRadius: '16px',
              padding: '36px',
              boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 800, color: p.color,
                  letterSpacing: '0.1em', backgroundColor: p.bg,
                  padding: '4px 10px', borderRadius: '6px', flexShrink: 0, marginTop: '4px',
                }}>
                  {p.number}
                </span>
                <div>
                  <h2 style={{ color: '#111827', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', marginBottom: '4px' }}>
                    {p.name}
                  </h2>
                  <p style={{ color: p.color, fontSize: '0.9rem', fontWeight: 600, fontStyle: 'italic' }}>{p.tagline}</p>
                </div>
              </div>

              <p style={{ color: '#374151', lineHeight: 1.8, fontSize: '0.975rem', marginBottom: '24px' }}>{p.description}</p>

              <div style={{ marginBottom: '24px' }}>
                <p style={{ color: '#111827', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Self-Assessment Questions
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {p.questions.map((q, i) => (
                    <li key={i} style={{ display: 'flex', gap: '10px', color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      <span style={{ color: p.color, flexShrink: 0, marginTop: '2px', fontWeight: 700 }}>›</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ backgroundColor: p.bg, border: `1px solid ${p.border}`, borderRadius: '10px', padding: '14px 18px' }}>
                <p style={{ color: '#374151', fontSize: '0.875rem', lineHeight: 1.6, fontStyle: 'italic' }}>{p.scripture}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#ffffff', padding: '80px 24px', textAlign: 'center', borderTop: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
            Go deeper with the book
          </h2>
          <p style={{ color: '#6B7280', lineHeight: 1.7, marginBottom: '28px' }}>
            Each pillar is explored in full depth in <em>Relationship Fitness</em> — with scripture, stories, and practical exercises.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" style={{
              backgroundColor: '#c0182a', color: '#fff', padding: '12px 28px',
              borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none',
            }}>Get the Book on Amazon</a>
            <a href={`${APP_URL}/register`} style={{
              backgroundColor: '#ffffff', border: '1px solid #D1D5DB',
              color: '#374151', padding: '12px 28px', borderRadius: '8px',
              fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none',
            }}>Take the Assessment</a>
          </div>
        </div>
      </section>
    </>
  )
}
