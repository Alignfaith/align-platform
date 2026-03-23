'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Mail, ArrowRight, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // In Phase 2, this would send a reset email
        setSubmitted(true)
    }

    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                <section className="section section--cream wave-pattern" style={{
                    minHeight: 'calc(100vh - var(--header-height))',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <div className="container">
                        <div style={{ maxWidth: '450px', margin: '0 auto' }}>
                            <div className="card">
                                {submitted ? (
                                    <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                                        <CheckCircle size={64} color="var(--color-success)" style={{ marginBottom: 'var(--space-4)' }} />
                                        <h2 style={{ marginBottom: 'var(--space-2)' }}>Check Your Email</h2>
                                        <p style={{ color: 'var(--color-slate)', marginBottom: 'var(--space-6)' }}>
                                            If an account exists for <strong>{email}</strong>, you'll receive a password reset link shortly.
                                        </p>
                                        <Link href="/login" className="btn btn--primary">
                                            Return to Sign In
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                                            <h1 style={{
                                                fontFamily: 'var(--font-heading)',
                                                fontSize: 'var(--text-4xl)',
                                                color: 'var(--color-primary)',
                                                marginBottom: 'var(--space-2)',
                                            }}>
                                                Reset Password
                                            </h1>
                                            <p style={{ color: 'var(--color-slate)' }}>
                                                Enter your email and we'll send you a reset link.
                                            </p>
                                        </div>

                                        <form onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <label className="form-label">Email Address</label>
                                                <div style={{ position: 'relative' }}>
                                                    <Mail
                                                        size={18}
                                                        style={{
                                                            position: 'absolute',
                                                            left: '12px',
                                                            top: '50%',
                                                            transform: 'translateY(-50%)',
                                                            color: 'var(--color-slate)',
                                                        }}
                                                    />
                                                    <input
                                                        type="email"
                                                        className="form-input"
                                                        style={{ paddingLeft: '40px' }}
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        placeholder="you@example.com"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn--primary"
                                                style={{ width: '100%', marginTop: 'var(--space-4)' }}
                                            >
                                                Send Reset Link
                                                <ArrowRight size={18} />
                                            </button>
                                        </form>

                                        <div style={{
                                            marginTop: 'var(--space-8)',
                                            paddingTop: 'var(--space-6)',
                                            borderTop: '1px solid var(--color-rose)',
                                            textAlign: 'center',
                                        }}>
                                            <p style={{ color: 'var(--color-slate)', marginBottom: 0 }}>
                                                Remember your password?{' '}
                                                <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                                                    Sign In
                                                </Link>
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
