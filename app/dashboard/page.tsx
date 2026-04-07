'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { User, Heart, MessageCircle, Settings, Crown, Users, Shield, BookOpen, BarChart2 } from 'lucide-react'
import Link from 'next/link'

import ReflectionEngine from '@/components/ReflectionEngine'
import { PILLARS, pillarDisplayScore } from '@/lib/pillar-questions'
import type { PillarKey } from '@/lib/pillar-questions'

const PILLAR_COLORS: Record<PillarKey, string> = {
    SPIRITUAL: '#c0182a',
    FINANCIAL: '#F59E0B',
    PHYSICAL: '#10B981',
    MENTAL: '#3B82F6',
    APPEARANCE: '#8B5CF6',
    INTIMACY: '#EC4899',
}

interface AssessmentSummary {
    completedAt: string
    responses: { pillar: string; value: number }[]
}

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [latestAssessment, setLatestAssessment] = useState<AssessmentSummary | null | undefined>(undefined)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    useEffect(() => {
        if (status === 'authenticated') {
            fetch('/api/assessment')
                .then((r) => r.json())
                .then((d) => setLatestAssessment(d.history?.[0] ?? null))
                .catch(() => setLatestAssessment(null))
        }
    }, [status])

    if (status === 'loading') {
        return (
            <>
                <Header />
                <main style={{ paddingTop: 'var(--header-height)' }}>
                    <section className="section section--cream" style={{ minHeight: 'calc(100vh - var(--header-height))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p>Loading...</p>
                    </section>
                </main>
            </>
        )
    }

    if (!session) {
        return null
    }

    const isAdmin = session.user.role === 'ADMIN'
    const profileComplete = session.user.profileComplete

    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                <section className="section section--cream" style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
                    <div className="container">
                        {/* Welcome Header */}
                        <div style={{ marginBottom: 'var(--space-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <h1 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: 'var(--text-4xl)',
                                    color: 'var(--color-primary)',
                                    marginBottom: 'var(--space-2)',
                                }}>
                                    Dashboard
                                </h1>
                                <p style={{ color: 'var(--color-slate)', marginBottom: 0 }}>
                                    Your Relational Fitness Training Ground
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ color: 'var(--color-primary)', fontWeight: 600, marginBottom: 0 }}>
                                    {session.user.name || session.user.email}
                                </p>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-slate)', marginBottom: 0 }}>
                                    Readiness Score: <strong style={{ color: 'var(--color-accent)' }}>74</strong>
                                </p>
                            </div>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
                            gap: 'var(--space-8)',
                            alignItems: 'start'
                        }}>
                            {/* Left Column: Growth & Reflections */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                                {/* Profile Incomplete Alert */}
                                {!profileComplete && (
                                    <div style={{
                                        backgroundColor: 'var(--color-blush)',
                                        border: '2px solid var(--color-primary)',
                                        borderRadius: 'var(--radius-lg)',
                                        padding: 'var(--space-6)',
                                    }}>
                                        <h3 style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                                            Complete Your Profile
                                        </h3>
                                        <p style={{ color: 'var(--color-charcoal)', marginBottom: 'var(--space-4)' }}>
                                            Finish setting up your profile to start discovering matches.
                                        </p>
                                        <Link href="/profile/setup" className="btn btn--primary">
                                            Complete Profile
                                        </Link>
                                    </div>
                                )}

                                {/* Reflection Engine */}
                                <ReflectionEngine />

                            </div>

                            {/* Right Column: Status & Navigation */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                                {/* Tier Status */}
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: 'var(--space-6)',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                        <Crown size={24} color="var(--color-accent)" />
                                        <h3 style={{ marginBottom: 0 }}>
                                            {session.user.tier === 'FREE' && 'Free Member'}
                                            {session.user.tier === 'TIER_1' && 'Tier 1 Member'}
                                            {session.user.tier === 'TIER_2' && 'Tier 2 Member'}
                                        </h3>
                                    </div>
                                    {session.user.tier === 'FREE' && (
                                        <p style={{ color: 'var(--color-slate)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                                            Free members are welcome to grow privately. Upgrade to unlock community features and discovery.
                                        </p>
                                    )}
                                    <Link href="/pricing" className="btn btn--secondary btn--sm" style={{ width: '100%' }}>
                                        {session.user.tier === 'FREE' ? 'Upgrade Training' : 'Manage Subscription'}
                                    </Link>
                                </div>

                                {/* Six Pillar Assessment */}
                                <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                        <BarChart2 size={22} color="var(--color-primary)" />
                                        <h3 style={{ marginBottom: 0, fontSize: 'var(--text-base)' }}>Six Pillar Assessment</h3>
                                    </div>

                                    {latestAssessment === undefined && (
                                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 'var(--space-4)' }}>Loading…</p>
                                    )}

                                    {latestAssessment === null && (
                                        <>
                                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 'var(--space-4)' }}>
                                                You haven't completed your Six Pillar assessment yet. It takes about 5 minutes.
                                            </p>
                                            <Link href="/dashboard/assessment" className="btn btn--primary btn--sm" style={{ width: '100%', textAlign: 'center' }}>
                                                Take the Assessment
                                            </Link>
                                        </>
                                    )}

                                    {latestAssessment && (() => {
                                        const date = new Date(latestAssessment.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                        return (
                                            <>
                                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-slate)', marginBottom: 'var(--space-4)' }}>
                                                    Last taken: {date}
                                                </p>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: 'var(--space-4)' }}>
                                                    {PILLARS.map((p) => {
                                                        const rs = latestAssessment.responses.filter((r) => r.pillar === p.key)
                                                        const score = rs.length ? pillarDisplayScore(rs) : 0
                                                        return (
                                                            <div key={p.key}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', fontSize: '11px' }}>
                                                                    <span style={{ color: 'var(--color-charcoal)' }}>{p.name}</span>
                                                                    <span style={{ fontWeight: 700, color: PILLAR_COLORS[p.key] }}>{score}%</span>
                                                                </div>
                                                                <div style={{ height: '5px', borderRadius: '3px', background: '#f0f0f0', overflow: 'hidden' }}>
                                                                    <div style={{ height: '100%', width: `${score}%`, background: PILLAR_COLORS[p.key], borderRadius: '3px' }} />
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <Link href="/dashboard/assessment" className="btn btn--primary btn--sm" style={{ width: '100%', textAlign: 'center' }}>
                                                    Retake Assessment
                                                </Link>
                                            </>
                                        )
                                    })()}
                                </div>

                                {/* Book Download */}
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: 'var(--space-6)',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                                        <BookOpen size={22} color="var(--color-primary)" />
                                        <h3 style={{ marginBottom: 0, fontSize: 'var(--text-base)' }}>Relationship Fitness</h3>
                                    </div>
                                    {session.user.tier === 'FREE' ? (
                                        <>
                                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 'var(--space-4)' }}>
                                                Upgrade to get a free copy of <em>Relationship Fitness</em> by Thomas Marks.
                                            </p>
                                            <Link href="/pricing" className="btn btn--primary btn--sm" style={{ width: '100%', textAlign: 'center' }}>
                                                Upgrade to Get the Book
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 'var(--space-4)' }}>
                                                Your free copy is included with your membership.
                                            </p>
                                            <Link
                                                href="/dashboard/book"
                                                className="btn btn--primary btn--sm"
                                                style={{ width: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                            >
                                                <BookOpen size={15} />
                                                Read the Book
                                            </Link>
                                        </>
                                    )}
                                </div>

                                {/* Quick Links */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    {/* My Profile */}
                                    <Link href="/profile/edit" style={{ textDecoration: 'none' }}>
                                        <div className="card" style={{ padding: 'var(--space-4)', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--color-rose-light)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                <User size={20} color="var(--color-primary)" />
                                                <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>My Profile</span>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Phased Discovery (Matches) */}
                                    <Link href="/matches" style={{ textDecoration: 'none' }}>
                                        <div className="card" style={{ padding: 'var(--space-4)', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--color-rose-light)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                <Heart size={20} color="var(--color-primary)" />
                                                <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>Phased Discovery</span>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Messages */}
                                    <Link href="/messages" style={{ textDecoration: 'none' }}>
                                        <div className="card" style={{ padding: 'var(--space-4)', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--color-rose-light)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                <MessageCircle size={20} color="var(--color-primary)" />
                                                <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>Conversations</span>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Six Pillars Assessment */}
                                    <Link href="/dashboard/assessment" style={{ textDecoration: 'none' }}>
                                        <div className="card" style={{ padding: 'var(--space-4)', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--color-rose-light)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                <BarChart2 size={20} color="var(--color-primary)" />
                                                <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>Six Pillars Assessment</span>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Settings */}
                                    <Link href="/settings" style={{ textDecoration: 'none' }}>
                                        <div className="card" style={{ padding: 'var(--space-4)', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--color-rose-light)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                <Settings size={20} color="var(--color-primary)" />
                                                <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>Settings</span>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Admin Panel */}
                                    {isAdmin && (
                                        <Link href="/admin" style={{ textDecoration: 'none' }}>
                                            <div className="card" style={{ padding: 'var(--space-4)', cursor: 'pointer', transition: 'all 0.2s', border: '2px solid var(--color-primary)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                    <Shield size={20} color="var(--color-primary)" />
                                                    <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Admin Panel</span>
                                                </div>
                                            </div>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
