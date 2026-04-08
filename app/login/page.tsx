'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Mail, Lock, ArrowRight, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showRegisteredMessage, setShowRegisteredMessage] = useState(false)

    useEffect(() => {
        if (searchParams.get('registered') === 'true') {
            setShowRegisteredMessage(true)
        }
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const result = await signIn('credentials', {
                email: email.toLowerCase().trim(),
                password,
                redirect: false,
            })

            if (result?.error) {
                setError('Invalid email or password')
            } else {
                // Check if password change is required
                const session = await getSession()
                if (session?.user?.mustChangePassword) {
                    router.push('/change-password')
                } else {
                    router.push('/dashboard')
                }
            }
        } catch {
            setError('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div style={{ maxWidth: '450px', margin: '0 auto' }}>
            <div className="card">
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                    <h1 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'var(--text-4xl)',
                        color: 'var(--color-primary)',
                        marginBottom: 'var(--space-2)',
                    }}>
                        Welcome Back
                    </h1>
                    <p style={{ color: 'var(--color-slate)' }}>
                        Sign in to continue your journey
                    </p>
                </div>

                {/* Success message after registration */}
                {showRegisteredMessage && (
                    <div style={{
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-4)',
                        marginBottom: 'var(--space-6)',
                        color: '#22C55E',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                    }}>
                        <CheckCircle size={20} />
                        <span>Registration successful! Please sign in.</span>
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-4)',
                        marginBottom: 'var(--space-6)',
                        color: '#EF4444',
                    }}>
                        {error}
                    </div>
                )}

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
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    setError(null)
                                }}
                                placeholder="you@example.com"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                            <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                            <Link
                                href="/forgot-password"
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--color-primary)',
                                }}
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock
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
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                style={{ paddingLeft: '40px', paddingRight: '44px' }}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setError(null)
                                }}
                                placeholder="••••••••"
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--color-slate)',
                                    padding: 0,
                                    display: 'flex',
                                }}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn--primary"
                        style={{ width: '100%', marginTop: 'var(--space-4)' }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Signing In...
                            </>
                        ) : (
                            <>
                                Sign In
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{
                    marginTop: 'var(--space-8)',
                    paddingTop: 'var(--space-6)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center',
                }}>
                    <p style={{ color: 'var(--color-slate)', marginBottom: 0 }}>
                        New to ALIGN?{' '}
                        <Link href="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

function LoginFormFallback() {
    return (
        <div style={{ maxWidth: '450px', margin: '0 auto' }}>
            <div className="card">
                <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                    <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                <section className="section section--cream" style={{
                    minHeight: 'calc(100vh - var(--header-height))',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <div className="container">
                        <Suspense fallback={<LoginFormFallback />}>
                            <LoginForm />
                        </Suspense>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
