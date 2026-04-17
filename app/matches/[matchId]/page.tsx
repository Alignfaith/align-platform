'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ArrowLeft, MapPin, Lock, Briefcase, GraduationCap, Heart } from 'lucide-react'
import { PILLARS } from '@/lib/pillar-questions'

// ─── Types ───────────────────────────────────────────────────────────────────

interface PillarData {
    pillarScore: number
    contribution: number
    weight: number
    questionCount: number
}

interface PillarResponse {
    questionId: string
    pillar: string
    value: number
}

interface ProfilePhoto {
    url: string
    isPrimary: boolean
    order: number
}

interface MatchProfile {
    matchId: string
    status: string
    alignmentScore: number | null
    alignmentTier: string | null
    hardStopTriggered: boolean
    hardStopReason: string | null
    pillarBreakdown: Record<string, PillarData> | null
    profile: {
        displayName: string
        age: number | null
        city: string | null
        state: string | null
        bio: string | null
        aboutMe: string | null
        profession: string | null
        education: string | null
        relationshipGoal: string | null
        photos: ProfilePhoto[]
        pillarResponses: PillarResponse[]
    }
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TIER_COLORS: Record<string, string> = {
    Excellent: '#16a34a',
    Strong: '#2563eb',
    Moderate: '#d97706',
    Low: '#dc2626',
    'No Match': '#6b7280',
    Disqualified: '#6b7280',
}

const PILLAR_ORDER = [
    { key: 'SPIRITUAL', label: 'Spiritual' },
    { key: 'MENTAL', label: 'Mental' },
    { key: 'INTIMACY', label: 'Intimacy' },
    { key: 'FINANCIAL', label: 'Financial' },
    { key: 'PHYSICAL', label: 'Physical' },
    { key: 'APPEARANCE', label: 'Appearance' },
]

// Two highlight questions per pillar — the most revealing for compatibility
const HIGHLIGHT_QUESTIONS: Record<string, string[]> = {
    SPIRITUAL: ['spiritual_faith_centrality', 'spiritual_practice'],
    MENTAL: ['mental_accountability', 'mental_emotional_response'],
    INTIMACY: ['intimacy_pace', 'intimacy_meaning'],
    FINANCIAL: ['financial_stability', 'financial_discipline'],
    PHYSICAL: ['physical_activity', 'physical_health_care'],
    APPEARANCE: ['appearance_dress', 'appearance_grooming'],
}

const GOAL_LABELS: Record<string, string> = {
    MARRIAGE: 'Seeking Marriage',
    SERIOUS_DATING: 'Serious Dating',
    DISCERNING: 'Discerning',
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ProfilePillarBreakdown({ breakdown }: { breakdown: Record<string, PillarData> }) {
    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {PILLAR_ORDER.map(({ key, label }) => {
                    const data = breakdown[key]
                    if (!data) return null
                    const score = data.pillarScore
                    const weightPct = Math.round(data.weight * 100)
                    const barColor = score >= 70
                        ? 'var(--color-primary)'
                        : score >= 50
                        ? '#e57373'
                        : '#d1d5db'
                    return (
                        <div key={key}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                                marginBottom: '5px',
                            }}>
                                <div>
                                    <span style={{
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 600,
                                        color: 'var(--color-text-primary)',
                                    }}>
                                        {label}
                                    </span>
                                    <span style={{
                                        fontSize: '11px',
                                        color: 'var(--color-text-tertiary)',
                                        marginLeft: '6px',
                                    }}>
                                        {weightPct}% weight
                                    </span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 700,
                                        color: score >= 70 ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                    }}>
                                        {score}%
                                    </span>
                                    <span style={{
                                        fontSize: '11px',
                                        color: 'var(--color-text-tertiary)',
                                        marginLeft: '4px',
                                    }}>
                                        (+{data.contribution}pts)
                                    </span>
                                </div>
                            </div>
                            <div style={{
                                height: '6px',
                                backgroundColor: 'var(--color-border-subtle)',
                                borderRadius: '3px',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${score}%`,
                                    borderRadius: '3px',
                                    backgroundColor: barColor,
                                    transition: 'width 0.4s ease',
                                }} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function AssessmentHighlights({ pillarResponses }: { pillarResponses: PillarResponse[] }) {
    if (!pillarResponses.length) return null

    const responseMap = Object.fromEntries(
        pillarResponses.map((r) => [r.questionId, r.value])
    )

    const sections = PILLARS.map((pillar) => {
        const highlightIds = HIGHLIGHT_QUESTIONS[pillar.key] ?? []
        const questions = pillar.questions.filter((q) => highlightIds.includes(q.id))
        const answered = questions.map((q) => {
            const value = responseMap[q.id]
            if (value == null) return null
            const option = q.options.find((o) => o.value === value)
            return { question: q.text, answer: option?.label ?? '—' }
        }).filter(Boolean) as { question: string; answer: string }[]

        if (!answered.length) return null
        return { pillar, answered }
    }).filter(Boolean) as { pillar: typeof PILLARS[number]; answered: { question: string; answer: string }[] }[]

    if (!sections.length) return null

    return (
        <div>
            {sections.map(({ pillar, answered }) => (
                <div key={pillar.key} style={{ marginBottom: 'var(--space-6)' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        marginBottom: 'var(--space-3)',
                        paddingBottom: 'var(--space-2)',
                        borderBottom: '1px solid var(--color-border-subtle)',
                    }}>
                        <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: 'var(--color-primary)',
                        }}>
                            {pillar.name}
                        </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {answered.map(({ question, answer }, i) => (
                            <div
                                key={i}
                                style={{
                                    backgroundColor: 'var(--color-bg-secondary)',
                                    border: '1px solid var(--color-border-subtle)',
                                    borderLeft: '3px solid var(--color-primary)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: 'var(--space-3) var(--space-4)',
                                }}
                            >
                                <p style={{
                                    fontSize: '11px',
                                    color: 'var(--color-text-tertiary)',
                                    margin: '0 0 4px',
                                    fontStyle: 'italic',
                                }}>
                                    {question}
                                </p>
                                <p style={{
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--color-text-primary)',
                                    fontWeight: 500,
                                    margin: 0,
                                }}>
                                    {answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MatchProfilePage({ params }: { params: { matchId: string } }) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [data, setData] = useState<MatchProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    useEffect(() => {
        if (status !== 'authenticated') return
        fetch(`/api/matches/${params.matchId}`)
            .then(async (res) => {
                if (res.status === 403 || res.status === 401) {
                    router.push('/matches')
                    return
                }
                if (res.status === 404) {
                    setNotFound(true)
                    return
                }
                const json = await res.json()
                setData(json)
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false))
    }, [status, params.matchId, router])

    if (status === 'loading' || loading) {
        return (
            <>
                <Header />
                <main style={{ paddingTop: 'var(--header-height)' }}>
                    <div style={{ padding: 'var(--space-20) 0', textAlign: 'center', color: 'var(--color-slate)' }}>
                        Loading profile...
                    </div>
                </main>
            </>
        )
    }

    if (!session) return null

    // ─── Not Found ───────────────────────────────────────────────────────────
    if (notFound || !data) {
        return (
            <>
                <Header />
                <main style={{ paddingTop: 'var(--header-height)' }}>
                    <div style={{ maxWidth: '480px', margin: '80px auto', textAlign: 'center', padding: '0 var(--space-6)' }}>
                        <Heart size={48} color="var(--color-primary)" style={{ opacity: 0.3, marginBottom: 'var(--space-4)' }} />
                        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-2)' }}>
                            Match Not Found
                        </h2>
                        <p style={{ color: 'var(--color-slate)', marginBottom: 'var(--space-6)' }}>
                            This match no longer exists or you may not have permission to view it.
                        </p>
                        <Link href="/matches" className="btn btn--primary">
                            ← Back to Matches
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    const { profile, alignmentScore, alignmentTier, pillarBreakdown } = data
    const isFreeTier = session.user.tier === 'FREE'
    const tierColor = TIER_COLORS[alignmentTier ?? ''] ?? '#6b7280'
    const primaryPhoto = profile.photos.find((p) => p.isPrimary) ?? profile.photos[0] ?? null
    const otherPhotos = profile.photos.filter((p) => !p.isPrimary).slice(0, 4)
    const locationStr = [profile.city, profile.state].filter(Boolean).join(', ')

    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                <section className="section section--cream" style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
                    <div className="container" style={{ maxWidth: '720px' }}>

                        {/* Back link */}
                        <Link
                            href="/matches"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 'var(--space-1)',
                                color: 'var(--color-slate)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 500,
                                textDecoration: 'none',
                                marginBottom: 'var(--space-6)',
                                transition: 'color 0.15s',
                            }}
                        >
                            <ArrowLeft size={16} />
                            Back to Matches
                        </Link>

                        {/* ─── Hero Card ─────────────────────────────────────────────── */}
                        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 'var(--space-6)' }}>
                            {/* Photo */}
                            <div style={{ height: '360px', position: 'relative', backgroundColor: 'var(--color-bg-elevated)' }}>
                                {primaryPhoto ? (
                                    <img
                                        src={primaryPhoto.url}
                                        alt={profile.displayName}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '100%', height: '100%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        backgroundColor: 'var(--color-bg-tertiary)',
                                        fontSize: '5rem',
                                        fontWeight: 700,
                                        color: 'var(--color-text-tertiary)',
                                    }}>
                                        {profile.displayName.charAt(0)}
                                    </div>
                                )}

                                {/* Alignment badge */}
                                {alignmentTier && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 'var(--space-4)',
                                        right: 'var(--space-4)',
                                        backgroundColor: tierColor,
                                        color: 'white',
                                        padding: 'var(--space-2) var(--space-4)',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 700,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                                    }}>
                                        {alignmentScore != null ? `${alignmentScore}%` : '—'} · {alignmentTier}
                                    </div>
                                )}

                                {/* Name overlay */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)',
                                    padding: 'var(--space-8) var(--space-6) var(--space-5)',
                                }}>
                                    <h1 style={{
                                        fontFamily: 'var(--font-heading)',
                                        color: 'white',
                                        fontSize: 'var(--text-3xl)',
                                        fontWeight: 700,
                                        margin: '0 0 var(--space-1)',
                                        lineHeight: 1.1,
                                    }}>
                                        {profile.displayName}{profile.age ? `, ${profile.age}` : ''}
                                    </h1>
                                    {locationStr && (
                                        <p style={{
                                            color: 'rgba(255,255,255,0.85)',
                                            fontSize: 'var(--text-sm)',
                                            margin: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                        }}>
                                            <MapPin size={14} />
                                            {locationStr}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Additional photos strip */}
                            {otherPhotos.length > 0 && (
                                <div style={{
                                    display: 'flex',
                                    gap: 'var(--space-2)',
                                    padding: 'var(--space-3) var(--space-4)',
                                    borderBottom: '1px solid var(--color-border-subtle)',
                                    backgroundColor: 'var(--color-bg-elevated)',
                                }}>
                                    {otherPhotos.map((photo, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                width: '72px',
                                                height: '72px',
                                                borderRadius: 'var(--radius-md)',
                                                overflow: 'hidden',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <img
                                                src={photo.url}
                                                alt=""
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Quick info row */}
                            <div style={{
                                padding: 'var(--space-4) var(--space-6)',
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 'var(--space-2)',
                                alignItems: 'center',
                            }}>
                                {profile.relationshipGoal && (
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        backgroundColor: 'rgba(192,24,42,0.08)',
                                        color: 'var(--color-primary)',
                                        border: '1px solid rgba(192,24,42,0.2)',
                                        borderRadius: 'var(--radius-full)',
                                        padding: '4px 12px',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                    }}>
                                        <Heart size={12} />
                                        {GOAL_LABELS[profile.relationshipGoal] ?? profile.relationshipGoal}
                                    </span>
                                )}
                                {profile.profession && (
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        color: 'var(--color-text-secondary)',
                                        border: '1px solid var(--color-border-subtle)',
                                        borderRadius: 'var(--radius-full)',
                                        padding: '4px 12px',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                    }}>
                                        <Briefcase size={12} />
                                        {profile.profession}
                                    </span>
                                )}
                                {profile.education && (
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        color: 'var(--color-text-secondary)',
                                        border: '1px solid var(--color-border-subtle)',
                                        borderRadius: 'var(--radius-full)',
                                        padding: '4px 12px',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                    }}>
                                        <GraduationCap size={12} />
                                        {profile.education}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* ─── Bio ───────────────────────────────────────────────────── */}
                        {(profile.bio || profile.aboutMe) && (
                            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                                <h2 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: 'var(--text-lg)',
                                    color: 'var(--color-text-primary)',
                                    marginBottom: 'var(--space-4)',
                                }}>
                                    About {profile.displayName.split(' ')[0]}
                                </h2>
                                {profile.bio && (
                                    <p style={{
                                        color: 'var(--color-text-secondary)',
                                        lineHeight: 1.8,
                                        fontSize: 'var(--text-sm)',
                                        margin: profile.aboutMe ? '0 0 var(--space-4)' : 0,
                                    }}>
                                        {profile.bio}
                                    </p>
                                )}
                                {profile.aboutMe && (
                                    <p style={{
                                        color: 'var(--color-text-secondary)',
                                        lineHeight: 1.8,
                                        fontSize: 'var(--text-sm)',
                                        margin: 0,
                                    }}>
                                        {profile.aboutMe}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* ─── Alignment Section (gated for FREE) ────────────────────── */}
                        {isFreeTier ? (
                            <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: 'var(--space-6)' }}>
                                {/* Blurred preview */}
                                <div style={{ filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none' }}>
                                    <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                                        <div style={{ marginBottom: 'var(--space-4)' }}>
                                            <div style={{ height: '16px', width: '40%', backgroundColor: 'var(--color-border-subtle)', borderRadius: '4px', marginBottom: '8px' }} />
                                        </div>
                                        {[80, 65, 72, 55, 90, 60].map((w, i) => (
                                            <div key={i} style={{ marginBottom: '12px' }}>
                                                <div style={{ height: '12px', width: `${20 + i * 8}%`, backgroundColor: 'var(--color-border-subtle)', borderRadius: '4px', marginBottom: '5px' }} />
                                                <div style={{ height: '6px', backgroundColor: 'var(--color-border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${w}%`, borderRadius: '3px', backgroundColor: 'var(--color-primary)', opacity: 0.4 }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Upgrade overlay */}
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'rgba(255,255,255,0.88)',
                                    textAlign: 'center',
                                    padding: 'var(--space-6)',
                                    borderRadius: 'var(--radius-xl)',
                                }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '50%',
                                        backgroundColor: 'rgba(192,24,42,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginBottom: 'var(--space-4)',
                                    }}>
                                        <Lock size={22} color="var(--color-primary)" />
                                    </div>
                                    <h3 style={{
                                        fontFamily: 'var(--font-heading)',
                                        color: 'var(--color-text-primary)',
                                        marginBottom: 'var(--space-2)',
                                        fontSize: 'var(--text-xl)',
                                    }}>
                                        Upgrade to See Alignment
                                    </h3>
                                    <p style={{
                                        color: 'var(--color-slate)',
                                        fontSize: 'var(--text-sm)',
                                        marginBottom: 'var(--space-5)',
                                        maxWidth: '340px',
                                        lineHeight: 1.7,
                                    }}>
                                        Paid members see the full pillar breakdown and their assessment highlights — the deepest look at compatibility ALIGN offers.
                                    </p>
                                    <Link href="/pricing" className="btn btn--primary">
                                        Upgrade Plan
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Pillar Breakdown */}
                                {pillarBreakdown && (
                                    <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: 'var(--space-5)',
                                        }}>
                                            <div>
                                                <p style={{
                                                    fontSize: '10px',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.1em',
                                                    textTransform: 'uppercase',
                                                    color: 'var(--color-primary)',
                                                    margin: '0 0 4px',
                                                }}>
                                                    Six Pillars
                                                </p>
                                                <h2 style={{
                                                    fontFamily: 'var(--font-heading)',
                                                    fontSize: 'var(--text-lg)',
                                                    color: 'var(--color-text-primary)',
                                                    margin: 0,
                                                }}>
                                                    Alignment Breakdown
                                                </h2>
                                            </div>
                                            {alignmentScore != null && (
                                                <div style={{
                                                    textAlign: 'center',
                                                    backgroundColor: `${tierColor}15`,
                                                    border: `1px solid ${tierColor}40`,
                                                    borderRadius: 'var(--radius-lg)',
                                                    padding: 'var(--space-3) var(--space-4)',
                                                }}>
                                                    <div style={{
                                                        fontSize: 'var(--text-2xl)',
                                                        fontWeight: 800,
                                                        fontFamily: 'var(--font-heading)',
                                                        color: tierColor,
                                                        lineHeight: 1,
                                                    }}>
                                                        {alignmentScore}%
                                                    </div>
                                                    <div style={{
                                                        fontSize: '11px',
                                                        fontWeight: 600,
                                                        color: tierColor,
                                                        marginTop: '2px',
                                                    }}>
                                                        {alignmentTier}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <ProfilePillarBreakdown breakdown={pillarBreakdown} />
                                    </div>
                                )}

                                {/* Assessment Highlights */}
                                {profile.pillarResponses.length > 0 && (
                                    <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                                        <p style={{
                                            fontSize: '10px',
                                            fontWeight: 700,
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase',
                                            color: 'var(--color-primary)',
                                            margin: '0 0 4px',
                                        }}>
                                            Assessment Highlights
                                        </p>
                                        <h2 style={{
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: 'var(--text-lg)',
                                            color: 'var(--color-text-primary)',
                                            margin: '0 0 var(--space-5)',
                                        }}>
                                            Their Perspective
                                        </h2>
                                        <p style={{
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--color-slate)',
                                            marginBottom: 'var(--space-6)',
                                            lineHeight: 1.6,
                                        }}>
                                            How {profile.displayName.split(' ')[0]} answered key questions from each pillar of the Six Pillars assessment.
                                        </p>
                                        <AssessmentHighlights pillarResponses={profile.pillarResponses} />
                                    </div>
                                )}
                            </>
                        )}

                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
