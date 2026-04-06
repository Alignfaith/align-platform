'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import { BookOpen, Lock } from 'lucide-react'

export default function BookPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    if (status === 'loading') {
        return (
            <>
                <Header />
                <main style={{ paddingTop: 'var(--header-height)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
                </main>
            </>
        )
    }

    if (!session) return null

    const isPaid = session.user.tier === 'TIER_1' || session.user.tier === 'TIER_2'

    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)', minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)' }}>
                {isPaid ? (
                    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--header-height))' }}>
                        {/* Top bar */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            padding: 'var(--space-3) var(--space-6)',
                            borderBottom: '1px solid var(--color-border-subtle)',
                            backgroundColor: 'var(--color-bg-elevated)',
                            flexShrink: 0,
                        }}>
                            <BookOpen size={18} color="var(--color-primary)" />
                            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>
                                Relationship Fitness — Thomas Marks
                            </span>
                            <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                                Member exclusive
                            </span>
                            <Link href="/dashboard" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
                                ← Back to Dashboard
                            </Link>
                        </div>

                        {/* PDF viewer — right-click and selection disabled */}
                        <div
                            style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
                            onContextMenu={(e) => e.preventDefault()}
                        >
                            <iframe
                                src="/api/book#toolbar=0&navpanes=0&scrollbar=1"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    display: 'block',
                                }}
                                title="Relationship Fitness by Thomas Marks"
                                sandbox="allow-same-origin allow-scripts"
                            />
                            {/* Transparent overlay blocks right-click on the iframe itself */}
                            <div
                                style={{ position: 'absolute', inset: 0, zIndex: 1 }}
                                onContextMenu={(e) => e.preventDefault()}
                            />
                        </div>
                    </div>
                ) : (
                    /* Upgrade gate for free members */
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - var(--header-height))', padding: 'var(--space-8)' }}>
                        <div style={{
                            maxWidth: '480px',
                            textAlign: 'center',
                            backgroundColor: 'var(--color-bg-elevated)',
                            border: '1px solid var(--color-border-subtle)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--space-12)',
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: 'rgba(225,29,72,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto var(--space-6)',
                            }}>
                                <Lock size={28} color="#E11D48" />
                            </div>
                            <h2 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-primary)' }}>
                                Member Exclusive
                            </h2>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-8)' }}>
                                Upgrade to Tier 1 or Tier 2 to read <em>Relationship Fitness</em> by Thomas Marks for free — included with your membership.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                <Link href="/pricing" className="btn btn--primary btn--lg" style={{ width: '100%', textAlign: 'center' }}>
                                    Upgrade My Membership
                                </Link>
                                <Link href="/dashboard" className="btn btn--secondary" style={{ width: '100%', textAlign: 'center' }}>
                                    Back to Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    )
}
