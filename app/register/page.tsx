import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Lock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Join Align | By Invitation',
  description: 'Align is currently available by invitation only.',
}

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: 'var(--header-height)' }}>
        <section
          className="section section--cream"
          style={{ minHeight: 'calc(100vh - var(--header-height))', display: 'flex', alignItems: 'center' }}
        >
          <div className="container">
            <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>

              {/* Icon */}
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-glow)',
                border: '1px solid rgba(192,24,42,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-6)',
              }}>
                <Lock size={26} color="var(--color-primary)" />
              </div>

              {/* Eyebrow */}
              <p style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-bold)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                marginBottom: 'var(--space-3)',
              }}>
                Invitation Only
              </p>

              {/* Heading */}
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                marginBottom: 'var(--space-5)',
              }}>
                Registration is currently by invitation
              </h1>

              {/* Body */}
              <p style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--text-base)',
                lineHeight: 1.75,
                marginBottom: 'var(--space-8)',
              }}>
                Align is in a private beta and is accepting new members by invitation only.
                If you&apos;d like to request access, send us a message and we&apos;ll be in touch.
              </p>

              {/* CTA */}
              <a
                href="https://app.alignfaith.com/feedback"
                style={{
                  display: 'inline-block',
                  backgroundColor: 'var(--color-primary)',
                  color: '#fff',
                  padding: '13px 32px',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(192,24,42,0.35)',
                  marginBottom: 'var(--space-6)',
                }}
              >
                Request Access
              </a>

              {/* Login link */}
              <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
                Already have an account?{' '}
                <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                  Sign in
                </Link>
              </p>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
