'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
  'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
]

const perks = [
  {
    icon: '✦',
    title: 'Founding Member Status',
    desc: 'Your name permanently recognized as a founding member of the ALIGN community.',
  },
  {
    icon: '📖',
    title: 'Free Copy of Relationship Fitness',
    desc: 'Receive a complimentary copy of the book by Thomas Marks that inspired this platform.',
  },
  {
    icon: '🎁',
    title: '3 Months Free Access',
    desc: 'Full platform access at no charge for your first three months — no credit card required.',
  },
  {
    icon: '🔑',
    title: 'Priority Access Before Public Launch',
    desc: 'Be among the first inside the platform before it opens to the general public.',
  },
]

export default function FounderPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', gender: '', zip: '', city: '', state: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [zipError, setZipError] = useState('')
  const [zipLoading, setZipLoading] = useState(false)

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleZipChange = async (zip: string) => {
    update('zip', zip)
    setZipError('')
    if (zip.length !== 5 || !/^\d{5}$/.test(zip)) return
    setZipLoading(true)
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`)
      if (!res.ok) {
        setZipError('ZIP code not found.')
        setForm(prev => ({ ...prev, city: '', state: '' }))
        return
      }
      const data = await res.json()
      const place = data.places?.[0]
      if (place) {
        setForm(prev => ({
          ...prev,
          city: place['place name'] || '',
          state: place['state'] || '',
        }))
      }
    } catch {
      setZipError('Could not look up ZIP code.')
      setForm(prev => ({ ...prev, city: '', state: '' }))
    } finally {
      setZipLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/founder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <>
      <Header />
      <main style={{ paddingTop: 'var(--header-height)' }}>

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section style={{
          background: 'linear-gradient(135deg, #c0182a 0%, #7a0f1a 100%)',
          padding: '80px 24px 72px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Subtle radial glow */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '100px',
              padding: '5px 16px',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}>
              Limited Availability
            </div>

            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.25rem, 5.5vw, 3.75rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              marginBottom: '20px',
              textShadow: '0 2px 20px rgba(0,0,0,0.2)',
            }}>
              Become a Founding Member
            </h1>

            <p style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
              lineHeight: 1.75,
              maxWidth: '540px',
              margin: '0 auto 32px',
            }}>
              We are hand-selecting a small group of founding members to help launch ALIGN.
              If you are serious about your faith and your preparation for relationship, this is for you.
            </p>

            <p style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.95)',
              lineHeight: 1.55,
              maxWidth: '560px',
              margin: '0 auto',
              borderTop: '1px solid rgba(255,255,255,0.2)',
              paddingTop: '28px',
            }}>
              &ldquo;At ALIGN, we align before we match. That is not just a saying — it is how we operate.&rdquo;
            </p>
          </div>
        </section>

        {/* ── Perks ─────────────────────────────────────────────── */}
        <section style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '72px 24px', borderBottom: '1px solid var(--color-border-subtle)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <p style={{
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: 'var(--color-primary)',
                marginBottom: '12px',
              }}>
                What You Get
              </p>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                lineHeight: 1.2,
              }}>
                Founding member perks
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}>
              {perks.map((p) => (
                <div key={p.title} style={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                  borderTop: '3px solid var(--color-primary)',
                  borderRadius: '14px',
                  padding: '28px',
                }}>
                  <div style={{
                    fontSize: '1.4rem',
                    marginBottom: '14px',
                    lineHeight: 1,
                  }}>
                    {p.icon}
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'var(--color-text-primary)',
                    marginBottom: '8px',
                  }}>
                    {p.title}
                  </h3>
                  <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.875rem',
                    lineHeight: 1.7,
                    margin: 0,
                  }}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Application Form ──────────────────────────────────── */}
        <section style={{ backgroundColor: 'var(--color-bg-primary)', padding: '80px 24px' }}>
          <div style={{ maxWidth: '560px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <p style={{
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: 'var(--color-primary)',
                marginBottom: '12px',
              }}>
                Apply Now
              </p>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                lineHeight: 1.2,
                marginBottom: '12px',
              }}>
                Submit your application
              </h2>
              <p style={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.9rem',
                lineHeight: 1.7,
              }}>
                Founding member spots are limited. We review every application personally.
              </p>
            </div>

            {status === 'success' ? (
              <div style={{
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid rgba(192,24,42,0.3)',
                borderRadius: '16px',
                padding: '52px 36px',
                textAlign: 'center',
              }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  backgroundColor: 'rgba(192,24,42,0.12)',
                  border: '1px solid rgba(192,24,42,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '1.5rem',
                }}>
                  ✓
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text-primary)',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  marginBottom: '12px',
                }}>
                  Application received
                </h3>
                <p style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.9rem',
                  lineHeight: 1.75,
                  marginBottom: '28px',
                }}>
                  Thank you for applying. We review every application personally and will
                  be in touch soon.
                </p>
                <Link href="/" style={{
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                }}>
                  ← Back to home
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: '16px',
                  padding: '36px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                {/* Name */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    required
                    disabled={status === 'loading'}
                  />
                </div>

                {/* Email */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    required
                    disabled={status === 'loading'}
                  />
                </div>

                {/* Phone */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="(555) 000-0000"
                    value={form.phone}
                    onChange={e => update('phone', e.target.value)}
                    required
                    disabled={status === 'loading'}
                  />
                </div>

                {/* Gender */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Gender</label>
                  <select
                    className="form-input"
                    value={form.gender}
                    onChange={e => update('gender', e.target.value)}
                    required
                    disabled={status === 'loading'}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                {/* ZIP Code */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">ZIP Code</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="5-digit ZIP"
                      value={form.zip}
                      onChange={e => handleZipChange(e.target.value.replace(/\D/g, '').slice(0, 5))}
                      maxLength={5}
                      inputMode="numeric"
                      disabled={status === 'loading'}
                      style={zipLoading ? { paddingRight: '36px' } : undefined}
                    />
                    {zipLoading && (
                      <span style={{
                        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                        color: 'var(--color-text-tertiary)', fontSize: '0.75rem',
                      }}>…</span>
                    )}
                  </div>
                  {zipError && (
                    <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--color-error)' }}>
                      {zipError}
                    </p>
                  )}
                </div>

                {/* City + State */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Your city"
                      value={form.city}
                      onChange={e => update('city', e.target.value)}
                      required
                      disabled={status === 'loading'}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">State</label>
                    <select
                      className="form-input"
                      value={form.state}
                      onChange={e => update('state', e.target.value)}
                      required
                      disabled={status === 'loading'}
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="">Select state</option>
                      {US_STATES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Error */}
                {status === 'error' && (
                  <div style={{
                    backgroundColor: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: '#f87171',
                    fontSize: '0.875rem',
                  }}>
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={status === 'loading'}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
                >
                  {status === 'loading' ? 'Submitting…' : 'Submit Application →'}
                </button>

                <p style={{
                  color: 'var(--color-text-tertiary)',
                  fontSize: '0.75rem',
                  textAlign: 'center',
                  margin: 0,
                  lineHeight: 1.6,
                }}>
                  By applying you agree to our{' '}
                  <Link href="/p/terms-of-service" style={{ color: 'var(--color-primary)' }}>Terms</Link>
                  {' '}and{' '}
                  <Link href="/p/privacy-policy" style={{ color: 'var(--color-primary)' }}>Privacy Policy</Link>.
                </p>
              </form>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
