'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react'

export default function RegisterClient() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    hasReadBook: false,
    understandsFramework: false,
    agreesToGuidelines: false,
    agreesToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (!form.hasReadBook || !form.understandsFramework || !form.agreesToGuidelines || !form.agreesToTerms) {
      setError('Please check all boxes before creating your account')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          hasReadBook: form.hasReadBook,
          understandsFramework: form.understandsFramework,
          agreesToGuidelines: form.agreesToGuidelines,
          agreesToTerms: form.agreesToTerms,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.')
      } else {
        router.push('/login?registered=true')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const agreements = [
    {
      field: 'hasReadBook',
      label: (
        <>I have read or am familiar with <em>Relationship Fitness</em> by Thomas Marks</>
      ),
    },
    {
      field: 'understandsFramework',
      label: 'I understand the Six Pillars of Relationship Fitness framework',
    },
    {
      field: 'agreesToGuidelines',
      label: (
        <><Link href="/guidelines" style={{ color: 'var(--color-primary)' }}>Community Guidelines</Link> — I agree to conduct myself with integrity on this platform</>
      ),
    },
    {
      field: 'agreesToTerms',
      label: (
        <><Link href="/terms" style={{ color: 'var(--color-primary)' }}>Terms of Service</Link> — I agree to the Terms of Service</>
      ),
    },
  ]

  return (
    <>
      <Header />
      <main style={{ paddingTop: 'var(--header-height)' }}>
        <section className="section section--cream" style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
          <div className="container">
            <div style={{ maxWidth: '540px', margin: '0 auto' }}>

              <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                <h1 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-4xl)',
                  color: 'var(--color-primary)',
                  marginBottom: 'var(--space-2)',
                }}>
                  Create Your Account
                </h1>
                <p style={{ color: 'var(--color-slate)' }}>
                  Tier 1 access is free until 11/11/2026. No credit card required.
                </p>
              </div>

              {error && (
                <div style={{
                  backgroundColor: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                  marginBottom: 'var(--space-6)',
                  color: '#EF4444',
                  fontSize: 'var(--text-sm)',
                }}>
                  {error}
                </div>
              )}

              <div className="card">
                <form onSubmit={handleSubmit}>
                  {/* Name row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={form.firstName}
                        onChange={e => { update('firstName', e.target.value); setError(null) }}
                        placeholder="Thomas"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={form.lastName}
                        onChange={e => { update('lastName', e.target.value); setError(null) }}
                        placeholder="Marks"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={form.email}
                      onChange={e => { update('email', e.target.value); setError(null) }}
                      placeholder="you@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-input"
                        style={{ paddingRight: '44px' }}
                        value={form.password}
                        onChange={e => { update('password', e.target.value); setError(null) }}
                        placeholder="At least 8 characters"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        style={{
                          position: 'absolute', right: '12px', top: '50%',
                          transform: 'translateY(-50%)', background: 'none',
                          border: 'none', cursor: 'pointer',
                          color: 'var(--color-slate)', padding: '4px', display: 'flex',
                        }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={form.confirmPassword}
                      onChange={e => { update('confirmPassword', e.target.value); setError(null) }}
                      placeholder="Re-enter your password"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Agreements */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-3)',
                    marginBottom: 'var(--space-6)',
                    padding: 'var(--space-4)',
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-subtle)',
                  }}>
                    {agreements.map(({ field, label }) => (
                      <label key={field} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={form[field as keyof typeof form] as boolean}
                          onChange={e => update(field, e.target.checked)}
                          style={{ marginTop: '3px', accentColor: 'var(--color-primary)', flexShrink: 0, width: '16px', height: '16px' }}
                          disabled={isLoading}
                        />
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="btn btn--primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    disabled={isLoading}
                  >
                    {isLoading
                      ? <><Loader2 size={18} className="animate-spin" /> Creating account...</>
                      : <>Create Account <ArrowRight size={18} /></>
                    }
                  </button>
                </form>
              </div>

              <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', color: 'var(--color-slate)', fontSize: 'var(--text-sm)' }}>
                Already have an account?{' '}
                <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign in</Link>
              </p>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
