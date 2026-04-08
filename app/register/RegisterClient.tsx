'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const BOOK_URL = 'https://a.co/d/00YpCAUt'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/waitlist', {
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

        {/* ── Hero ───────────────────────────────────────────────── */}
        <section style={{
          position: 'relative',
          minHeight: '52vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A0406',
          overflow: 'hidden',
        }}>
          {/* Background cross */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <Image
              src="/images/hero-cross.png"
              alt=""
              fill
              style={{ objectFit: 'cover', opacity: 0.45 }}
              priority
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(10,4,6,0.15) 0%, rgba(10,4,6,0.35) 50%, rgba(10,4,6,0.85) 100%)',
            }} />
          </div>

          {/* Hero content */}
          <div style={{
            position: 'relative', zIndex: 1,
            textAlign: 'center',
            padding: '80px 24px 64px',
            maxWidth: '680px',
            margin: '0 auto',
          }}>
            {/* Logo mark */}
            <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '14px',
                overflow: 'hidden', boxShadow: '0 0 32px rgba(192,24,42,0.4)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                <Image src="/images/logo.png" alt="ALIGN" width={56} height={56} />
              </div>
            </div>

            {/* Eyebrow */}
            <div style={{
              display: 'inline-block',
              backgroundColor: 'rgba(192,24,42,0.18)',
              border: '1px solid rgba(192,24,42,0.4)',
              borderRadius: '100px',
              padding: '5px 16px',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#f87171',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}>
              By Invitation Only
            </div>

            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 5.5vw, 3.5rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              marginBottom: '20px',
              textShadow: '0 2px 24px rgba(0,0,0,0.5)',
            }}>
              Preparation Comes<br />
              <span style={{ color: '#f87171' }}>Before Connection</span>
            </h1>

            <p style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
              lineHeight: 1.75,
              maxWidth: '520px',
              margin: '0 auto',
            }}>
              ALIGN is currently available by invitation only. We are carefully
              selecting our founding members.
            </p>
          </div>

          {/* Fade to bg */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '64px',
            background: 'linear-gradient(to bottom, transparent, var(--color-bg-primary))',
            zIndex: 2,
          }} />
        </section>

        {/* ── Request Form ───────────────────────────────────────── */}
        <section style={{ backgroundColor: 'var(--color-bg-primary)', padding: '80px 24px' }}>
          <div style={{ maxWidth: '520px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <p style={{
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: 'var(--color-primary)',
                marginBottom: '12px',
              }}>
                Request Access
              </p>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                lineHeight: 1.2,
                marginBottom: '12px',
              }}>
                Join the founding circle
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                Tell us a little about yourself and we&apos;ll reach out when your invitation is ready.
              </p>
            </div>

            {status === 'success' ? (
              /* ── Success state ── */
              <div style={{
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid rgba(192,24,42,0.3)',
                borderRadius: '16px',
                padding: '48px 36px',
                textAlign: 'center',
              }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  backgroundColor: 'rgba(192,24,42,0.15)',
                  border: '1px solid rgba(192,24,42,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '1.4rem',
                }}>
                  ✓
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text-primary)',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  marginBottom: '10px',
                }}>
                  You&apos;re on the list
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  Thank you for your interest in ALIGN. We&apos;ll be in touch when your
                  invitation is ready.
                </p>
              </div>
            ) : (
              /* ── Form ── */
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
                    placeholder="Your name"
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

                {/* Message */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Tell us about yourself{' '}
                    <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <textarea
                    className="form-input"
                    placeholder="Where are you in your faith journey? What brings you to ALIGN?"
                    value={form.message}
                    onChange={e => update('message', e.target.value)}
                    rows={4}
                    disabled={status === 'loading'}
                    style={{ resize: 'vertical', minHeight: '100px' }}
                  />
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
                  {status === 'loading' ? 'Submitting…' : 'Request an Invitation'}
                </button>
              </form>
            )}

            {/* Sign-in link */}
            <p style={{
              textAlign: 'center',
              marginTop: '24px',
              color: 'var(--color-text-tertiary)',
              fontSize: '0.875rem',
            }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                Sign in
              </Link>
            </p>
          </div>
        </section>

        {/* ── Book Banner ────────────────────────────────────────── */}
        <section style={{
          backgroundColor: 'var(--color-bg-secondary)',
          borderTop: '1px solid var(--color-border-subtle)',
          padding: '80px 24px',
        }}>
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '40px',
              alignItems: 'center',
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: '20px',
              padding: '40px',
            }}>
              {/* Book cover */}
              <div style={{ flexShrink: 0 }}>
                <Image
                  src="/images/book-cover.png"
                  alt="Relationship Fitness by Thomas Marks"
                  width={140}
                  height={195}
                  style={{
                    borderRadius: '8px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                  }}
                />
              </div>

              {/* Copy */}
              <div>
                <p style={{
                  fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: 'var(--color-primary)',
                  marginBottom: '10px',
                }}>
                  While You Wait
                </p>
                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.2,
                  marginBottom: '12px',
                }}>
                  Start your journey with<br />
                  <em style={{ fontStyle: 'normal', color: '#f87171' }}>Relationship Fitness</em>
                </h2>
                <p style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.9rem',
                  lineHeight: 1.75,
                  marginBottom: '24px',
                }}>
                  The book that inspired this platform. Thomas Marks walks you through each
                  of the Six Pillars with scripture, practical exercises, and honest
                  self-assessment tools — so you can begin the work of preparation right now,
                  before you ever log in.
                </p>
                <a
                  href={BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'var(--color-primary)',
                    color: '#fff',
                    padding: '11px 24px',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(192,24,42,0.35)',
                  }}
                >
                  Get the Book on Amazon →
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
