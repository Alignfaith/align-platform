'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { User, Heart, MessageCircle, Settings, Crown, Users, Shield, BookOpen, BarChart2, Church, Brain, Dumbbell, Wallet, Sparkles, Clock, Copy } from 'lucide-react'
import Link from 'next/link'

import ReflectionEngine from '@/components/ReflectionEngine'

function SubscriptionSuccessBanner() {
    const searchParams = useSearchParams()
    if (searchParams.get('subscription') !== 'success') return null
    return (
        <div style={{
            backgroundColor: '#f0fdf4',
            border: '2px solid #16a34a',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4) var(--space-6)',
            marginBottom: 'var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
        }}>
            <span style={{ fontSize: '20px' }}>🎉</span>
            <div>
                <strong style={{ color: '#15803d' }}>Welcome to your membership!</strong>
                <p style={{ color: '#166534', fontSize: 'var(--text-sm)', marginBottom: 0 }}>
                    Your subscription is now active. Your tier will update shortly — refresh the page if it hasn't updated yet.
                </p>
            </div>
        </div>
    )
}

const SHARE_TEXT = "I'm using ALIGN — a faith-centered relationship readiness platform built on the Six Pillars. Tier 1 membership is free until 11/11/26. Join here: https://app.alignfaith.com/register"

function ShareButton() {
    const [copied, setCopied] = useState(false)

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(SHARE_TEXT)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {}
    }

    return (
        <button
            onClick={handleShare}
            className="btn btn--secondary btn--sm"
            style={{ marginTop: 'var(--space-2)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
            <Copy size={14} />
            {copied ? 'Copied!' : 'Invite a Friend'}
        </button>
    )
}

function ManageSubscriptionButton() {
    const [loading, setLoading] = useState(false)
    const handleClick = async () => {
        setLoading(true)
        const res = await fetch('/api/stripe/portal', { method: 'POST' })
        const data = await res.json()
        if (data.url) window.location.href = data.url
        else setLoading(false)
    }
    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className="btn btn--secondary btn--sm"
            style={{ width: '100%', textAlign: 'center', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
        >
            {loading ? 'Loading...' : 'Manage Subscription'}
        </button>
    )
}
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

const PILLAR_ICONS: Record<string, React.ElementType> = {
    SPIRITUAL: Church,
    MENTAL: Brain,
    PHYSICAL: Dumbbell,
    FINANCIAL: Wallet,
    APPEARANCE: Sparkles,
    INTIMACY: Heart,
}

const PILLAR_LABELS: Record<string, string> = {
    SPIRITUAL: 'Spiritual',
    MENTAL: 'Mental',
    PHYSICAL: 'Physical',
    FINANCIAL: 'Financial',
    APPEARANCE: 'Appearance',
    INTIMACY: 'Intimacy',
}

interface GrowthPost {
    id: string
    pillar: string
    content: string
    imageUrl?: string | null
    createdAt: string
}

interface AssessmentSummary {
    completedAt: string
    responses: { pillar: string; value: number }[]
}

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [latestAssessment, setLatestAssessment] = useState<AssessmentSummary | null | undefined>(undefined)
    const [reflections, setReflections] = useState<GrowthPost[] | null>(null)
    const [showAllReflections, setShowAllReflections] = useState(false)

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
            fetch('/api/growth-posts?limit=11')
                .then((r) => r.json())
                .then((d) => setReflections(d.posts ?? []))
                .catch(() => setReflections([]))
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
                                <ShareButton />
                            </div>
                        </div>

                        {/* Subscription Success Banner */}
                        <Suspense fallback={null}>
                            <SubscriptionSuccessBanner />
                        </Suspense>

                        {/* Profile Incomplete Alert */}
                        {!profileComplete && (
                            <div style={{
                                backgroundColor: 'var(--color-blush)',
                                border: '2px solid var(--color-primary)',
                                borderRadius: 'var(--radius-lg)',
                                padding: 'var(--space-6)',
                                marginBottom: 'var(--space-6)',
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

                        {/* Weekly Reflections — full width */}
                        <div style={{ marginBottom: 'var(--space-8)' }}>
                            <ReflectionEngine />
                        </div>

                        {/* Reflection History */}
                        <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <Clock size={20} color="var(--color-primary)" />
                                    <h3 style={{ marginBottom: 0, fontSize: 'var(--text-base)' }}>My Reflections</h3>
                                </div>
                                {reflections && reflections.length > 10 && !showAllReflections && (
                                    <button
                                        onClick={() => setShowAllReflections(true)}
                                        style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                                    >
                                        View All
                                    </button>
                                )}
                            </div>

                            {/* Loading */}
                            {reflections === null && (
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>Loading…</p>
                            )}

                            {/* Empty state */}
                            {reflections !== null && reflections.length === 0 && (
                                <div style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)' }}>
                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 0 }}>
                                        Your reflection history will appear here after your first post. Start with any pillar above.
                                    </p>
                                </div>
                            )}

                            {/* Timeline */}
                            {reflections !== null && reflections.length > 0 && (() => {
                                const visible = showAllReflections ? reflections : reflections.slice(0, 10)
                                return (
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        {visible.map((post, i) => {
                                            const Icon = PILLAR_ICONS[post.pillar] ?? Clock
                                            const color = PILLAR_COLORS[post.pillar as PillarKey] ?? 'var(--color-primary)'
                                            const date = new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                            const isLast = i === visible.length - 1
                                            return (
                                                <div key={post.id} style={{ display: 'flex', gap: 'var(--space-4)', paddingBottom: isLast ? 0 : 'var(--space-4)' }}>
                                                    {/* Icon + line */}
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                                                        <div style={{
                                                            width: '36px', height: '36px', borderRadius: '50%',
                                                            backgroundColor: `${color}18`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            flexShrink: 0,
                                                        }}>
                                                            <Icon size={16} color={color} />
                                                        </div>
                                                        {!isLast && (
                                                            <div style={{ flex: 1, width: '1px', backgroundColor: 'var(--color-border-subtle)', marginTop: '4px' }} />
                                                        )}
                                                    </div>
                                                    {/* Content */}
                                                    <div style={{ flex: 1, paddingTop: '6px', paddingBottom: isLast ? 0 : 'var(--space-1)' }}>
                                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                                                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color }}>
                                                                {PILLAR_LABELS[post.pillar] ?? post.pillar}
                                                            </span>
                                                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{date}</span>
                                                        </div>
                                                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 0, lineHeight: 1.5 }}>
                                                            {post.content}
                                                        </p>
                                                        {post.imageUrl && (
                                                            <img
                                                                src={post.imageUrl}
                                                                alt="Reflection photo"
                                                                style={{
                                                                    display: 'block',
                                                                    marginTop: 'var(--space-3)',
                                                                    maxWidth: '100%',
                                                                    maxHeight: '400px',
                                                                    borderRadius: 'var(--radius-md)',
                                                                    objectFit: 'cover',
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })()}
                        </div>

                        {/* Cards row: Tier | Assessment | Book */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                            gap: 'var(--space-6)',
                            marginBottom: 'var(--space-6)',
                            alignItems: 'start',
                        }}>
                            {/* Tier Status */}
                            <div className="card" style={{ padding: 'var(--space-6)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                    <Crown size={22} color="var(--color-accent)" />
                                    <h3 style={{ marginBottom: 0, fontSize: 'var(--text-base)' }}>
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
                                {session.user.tier === 'FREE' ? (
                                    <Link href="/pricing" className="btn btn--secondary btn--sm" style={{ width: '100%', textAlign: 'center' }}>
                                        Upgrade Training
                                    </Link>
                                ) : (
                                    <ManageSubscriptionButton />
                                )}
                            </div>

                            {/* Six Pillar Assessment */}
                            <div className="card" style={{ padding: 'var(--space-6)' }}>
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

                            {/* Book */}
                            <div className="card" style={{ padding: 'var(--space-6)' }}>
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
                        </div>

                        {/* Quick Links — horizontal grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${isAdmin ? 6 : 5}, minmax(0, 1fr))`,
                            gap: 'var(--space-3)',
                        }}>
                            <Link href="/profile/edit" style={{ textDecoration: 'none' }}>
                                <div className="card" style={{ padding: 'var(--space-4)', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--color-rose-light)', textAlign: 'center' }}>
                                    <User size={20} color="var(--color-primary)" style={{ margin: '0 auto var(--space-2)' }} />
                                    <span style={{ fontWeight: 600, color: 'var(--color-charcoal)', fontSize: 'var(--text-sm)' }}>My Profile</span>
                                </div>
                            </Link>
                            <Link href="/matches" style={{ textDecoration: 'none' }}>
                                <div className="card" style={{ padding: 'var(--space-4)', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--color-rose-light)', textAlign: 'center' }}>
                                    <Heart size={20} color="var(--color-primary)" style={{ margin: '0 auto var(--space-2)' }} />
                                    <span style={{ fontWeight: 600, color: 'var(--color-charcoal)', fontSize: 'var(--text-sm)' }}>Phased Discovery</span>
                                </div>
                            </Link>
                            <Link href="/messages" style={{ textDecoration: 'none' }}>
                                <div className="card" style={{ padding: 'var(--space-4)', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--color-rose-light)', textAlign: 'center' }}>
                                    <MessageCircle size={20} color="var(--color-primary)" style={{ margin: '0 auto var(--space-2)' }} />
                                    <span style={{ fontWeight: 600, color: 'var(--color-charcoal)', fontSize: 'var(--text-sm)' }}>Conversations</span>
                                </div>
                            </Link>
                            <Link href="/dashboard/assessment" style={{ textDecoration: 'none' }}>
                                <div className="card" style={{ padding: 'var(--space-4)', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--color-rose-light)', textAlign: 'center' }}>
                                    <BarChart2 size={20} color="var(--color-primary)" style={{ margin: '0 auto var(--space-2)' }} />
                                    <span style={{ fontWeight: 600, color: 'var(--color-charcoal)', fontSize: 'var(--text-sm)' }}>Assessment</span>
                                </div>
                            </Link>
                            <Link href="/settings" style={{ textDecoration: 'none' }}>
                                <div className="card" style={{ padding: 'var(--space-4)', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--color-rose-light)', textAlign: 'center' }}>
                                    <Settings size={20} color="var(--color-primary)" style={{ margin: '0 auto var(--space-2)' }} />
                                    <span style={{ fontWeight: 600, color: 'var(--color-charcoal)', fontSize: 'var(--text-sm)' }}>Settings</span>
                                </div>
                            </Link>
                            {isAdmin && (
                                <Link href="/admin" style={{ textDecoration: 'none' }}>
                                    <div className="card" style={{ padding: 'var(--space-4)', cursor: 'pointer', transition: 'all 0.2s', border: '2px solid var(--color-primary)', textAlign: 'center' }}>
                                        <Shield size={20} color="var(--color-primary)" style={{ margin: '0 auto var(--space-2)' }} />
                                        <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>Admin Panel</span>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
