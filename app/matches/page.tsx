'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
    Users, Lock, ChevronRight, MapPin, Heart, AlertTriangle
} from 'lucide-react'
import Link from 'next/link'

interface MatchData {
    matchId: string
    receiverId: string
    status: string
    alignmentScore: number | null
    alignmentTier: string | null
    hardStopTriggered: boolean
    hardStopReason: string | null
    displayName: string
    age: number | null
    city: string | null
    state: string | null
    bio: string | null
    photoUrl: string | null
}

const TIER_COLORS: Record<string, string> = {
    Excellent: '#16a34a',
    Strong: '#2563eb',
    Moderate: '#d97706',
    Low: '#dc2626',
    Disqualified: '#6b7280',
}

export default function MatchesPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [matches, setMatches] = useState<MatchData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    useEffect(() => {
        if (status !== 'authenticated') return
        fetch('/api/matches')
            .then((r) => r.json())
            .then((data) => setMatches(data.matches ?? []))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [status])

    if (status === 'loading') {
        return (
            <>
                <Header />
                <main style={{ paddingTop: 'var(--header-height)' }}>
                    <div style={{ padding: 'var(--space-20) 0', textAlign: 'center' }}>
                        <p>Loading your matches...</p>
                    </div>
                </main>
            </>
        )
    }

    if (!session) return null

    const isFreeTier = session.user.tier === 'FREE'

    const activeMatches = matches.filter((m) => !m.hardStopTriggered)
    const disqualified = matches.filter((m) => m.hardStopTriggered)

    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                <section className="section section--cream" style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
                    <div className="container">
                        {/* Page Header */}
                        <div style={{ marginBottom: 'var(--space-8)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                <Users size={20} color="var(--color-primary)" />
                                <span style={{ textTransform: 'uppercase', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--color-primary)' }}>
                                    Your Matches
                                </span>
                            </div>
                            <h1 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'var(--text-4xl)',
                                color: 'var(--color-primary)',
                                marginBottom: 'var(--space-2)'
                            }}>
                                Alignment Matches
                            </h1>
                            <p style={{ color: 'var(--color-slate)', maxWidth: '600px' }}>
                                Members matched to you based on your Six Pillars assessment. Scores reflect how closely your values and character align.
                            </p>
                        </div>

                        {/* Tier Warning */}
                        {isFreeTier && (
                            <div style={{
                                backgroundColor: 'var(--color-primary)',
                                color: 'white',
                                padding: 'var(--space-6)',
                                borderRadius: 'var(--radius-lg)',
                                marginBottom: 'var(--space-8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Lock size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ color: 'white', marginBottom: 'var(--space-1)' }}>Matches Locked</h4>
                                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)', marginBottom: 0 }}>
                                            Upgrade to Tier 1 to view your alignment matches and connect with members.
                                        </p>
                                    </div>
                                </div>
                                <Link href="/pricing" className="btn btn--white btn--sm">
                                    Upgrade Plan
                                </Link>
                            </div>
                        )}

                        {/* Loading */}
                        {loading && (
                            <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--color-slate)' }}>
                                Calculating your matches...
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && matches.length === 0 && (
                            <div style={{
                                textAlign: 'center',
                                padding: 'var(--space-16)',
                                backgroundColor: 'white',
                                borderRadius: 'var(--radius-xl)',
                                border: '1px solid var(--color-rose-light)'
                            }}>
                                <Heart size={48} color="var(--color-primary)" style={{ marginBottom: 'var(--space-4)', opacity: 0.4 }} />
                                <h3 style={{ marginBottom: 'var(--space-2)' }}>No matches yet</h3>
                                <p style={{ color: 'var(--color-slate)', maxWidth: '400px', margin: '0 auto var(--space-6)' }}>
                                    Complete your Six Pillars assessment to be matched with other members.
                                </p>
                                <Link href="/assessment" className="btn btn--primary">
                                    Take Assessment
                                </Link>
                            </div>
                        )}

                        {/* Active Matches Grid */}
                        {!loading && activeMatches.length > 0 && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: 'var(--space-6)',
                                marginBottom: 'var(--space-10)',
                                opacity: isFreeTier ? 0.5 : 1,
                                pointerEvents: isFreeTier ? 'none' : 'auto',
                            }}>
                                {activeMatches.map((match) => (
                                    <div key={match.matchId} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                        {/* Photo */}
                                        <div style={{ height: '220px', position: 'relative', backgroundColor: 'var(--color-bg-elevated)' }}>
                                            {match.photoUrl ? (
                                                <img
                                                    src={match.photoUrl}
                                                    alt={match.displayName}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: '100%', height: '100%',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    backgroundColor: 'var(--color-bg-tertiary)',
                                                    color: 'var(--color-text-tertiary)',
                                                    fontSize: 'var(--text-4xl)',
                                                    fontWeight: 700,
                                                }}>
                                                    {match.displayName.charAt(0)}
                                                </div>
                                            )}
                                            {/* Score badge */}
                                            <div style={{
                                                position: 'absolute',
                                                top: 'var(--space-3)',
                                                right: 'var(--space-3)',
                                                backgroundColor: TIER_COLORS[match.alignmentTier ?? ''] ?? '#6b7280',
                                                color: 'white',
                                                padding: 'var(--space-1) var(--space-3)',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: 'var(--text-xs)',
                                                fontWeight: 700,
                                            }}>
                                                {match.alignmentScore != null ? `${match.alignmentScore}%` : '—'} · {match.alignmentTier}
                                            </div>
                                            {/* Name overlay */}
                                            <div style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)',
                                                padding: 'var(--space-4)',
                                            }}>
                                                <h3 style={{ color: 'white', margin: 0, fontSize: 'var(--text-lg)' }}>
                                                    {match.displayName}{match.age ? `, ${match.age}` : ''}
                                                </h3>
                                                {(match.city || match.state) && (
                                                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'var(--text-sm)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <MapPin size={13} />
                                                        {[match.city, match.state].filter(Boolean).join(', ')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div style={{ padding: 'var(--space-5)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            {match.bio && (
                                                <p style={{
                                                    fontSize: 'var(--text-sm)',
                                                    color: 'var(--color-slate)',
                                                    fontStyle: 'italic',
                                                    marginBottom: 'var(--space-4)',
                                                    overflow: 'hidden',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                } as React.CSSProperties}>
                                                    &ldquo;{match.bio}&rdquo;
                                                </p>
                                            )}
                                            <div style={{ marginTop: 'auto' }}>
                                                <button className="btn btn--primary btn--sm" style={{ width: '100%' }}>
                                                    View Profile <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Disqualified Matches (collapsed) */}
                        {!loading && disqualified.length > 0 && (
                            <div style={{
                                padding: 'var(--space-4)',
                                backgroundColor: 'white',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid #fee2e2',
                                marginBottom: 'var(--space-8)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: '#9ca3af' }}>
                                    <AlertTriangle size={16} />
                                    <span style={{ fontSize: 'var(--text-sm)' }}>
                                        {disqualified.length} member{disqualified.length > 1 ? 's' : ''} not shown — hard stop on a core question ({disqualified[0].hardStopReason ?? 'compatibility issue'})
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
