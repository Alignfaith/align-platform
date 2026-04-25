'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { PILLARS, pillarDisplayScore } from '@/lib/pillar-questions'
import type { PillarKey } from '@/lib/pillar-questions'
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react'

const PILLAR_COLORS: Record<PillarKey, string> = {
    SPIRITUAL: '#c0182a',
    FINANCIAL: '#F59E0B',
    PHYSICAL: '#10B981',
    MENTAL: '#3B82F6',
    APPEARANCE: '#8B5CF6',
    INTIMACY: '#EC4899',
}

type Answers = Record<string, number>

// ── Summary bar chart ─────────────────────────────────────────────────────────
function SummaryChart({ answers }: { answers: Answers }) {
    const scores = PILLARS.map((p) => {
        const qs = p.questions.map((q) => ({ value: answers[q.id] ?? 3 }))
        return { pillar: p, score: pillarDisplayScore(qs) }
    })

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {scores.map(({ pillar, score }) => (
                <div key={pillar.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: 'var(--text-sm)' }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{pillar.name}</span>
                        <span style={{ fontWeight: 700, color: PILLAR_COLORS[pillar.key] }}>{score}%</span>
                    </div>
                    <div style={{ height: '10px', borderRadius: '5px', background: 'var(--color-border-subtle)', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${score}%`,
                            background: PILLAR_COLORS[pillar.key],
                            borderRadius: '5px',
                            transition: 'width 0.6s ease',
                        }} />
                    </div>
                </div>
            ))}
        </div>
    )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AssessmentPage() {
    return (
        <Suspense fallback={null}>
            <AssessmentPageInner />
        </Suspense>
    )
}

function AssessmentPageInner() {
    const { data: session, status, update } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const isOnboarding = searchParams.get('onboarding') === '1'

    const totalQuestions = PILLARS.reduce((sum, p) => sum + p.questions.length, 0)
    const [step, setStep] = useState(0) // 0–5 = pillars, 6 = summary
    const [answers, setAnswers] = useState<Answers>({})
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')
    const [draftLoaded, setDraftLoaded] = useState(false)
    const [draftRestored, setDraftRestored] = useState(false)

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login')
    }, [status, router])

    // Restore draft — DB is source of truth, localStorage is fallback
    useEffect(() => {
        if (!session?.user?.id) return
        const lsKey = `align_assessment_draft_${session.user.id}`

        function restoreFromLocalStorage() {
            try {
                const saved = localStorage.getItem(lsKey)
                if (saved) {
                    const parsed = JSON.parse(saved)
                    if (parsed?.answers && typeof parsed.answers === 'object' && Object.keys(parsed.answers).length > 0) {
                        setAnswers(parsed.answers)
                        setDraftRestored(true)
                    }
                    if (typeof parsed?.step === 'number') setStep(parsed.step)
                }
            } catch {}
        }

        fetch('/api/draft/load')
            .then(r => r.json())
            .then(data => {
                const draft = data?.draftData?.assessment
                if (draft?.answers && typeof draft.answers === 'object' && Object.keys(draft.answers).length > 0) {
                    setAnswers(draft.answers)
                    if (typeof draft.step === 'number') setStep(draft.step)
                    setDraftRestored(true)
                } else {
                    restoreFromLocalStorage()
                }
            })
            .catch(restoreFromLocalStorage)
            .finally(() => setDraftLoaded(true))
    }, [session?.user?.id])

    // Save draft to localStorage on every change
    useEffect(() => {
        if (!session?.user?.id || !draftLoaded) return
        try {
            const key = `align_assessment_draft_${session.user.id}`
            if (Object.keys(answers).length > 0) {
                localStorage.setItem(key, JSON.stringify({ answers, step }))
            }
        } catch {}
    }, [answers, step, session?.user?.id, draftLoaded])

    if (status === 'loading' || !session) {
        return (
            <>
                <Header />
                <main style={{ paddingTop: 'var(--header-height)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Loading…</p>
                </main>
            </>
        )
    }

    const currentPillar = PILLARS[step]
    const totalPillars = PILLARS.length
    const isSummary = step === totalPillars

    // Check all questions on the current pillar are answered
    const currentAnswered = currentPillar
        ? currentPillar.questions.every((q) => answers[q.id] !== undefined)
        : true

    const allAnswered = PILLARS.every((p) => p.questions.every((q) => answers[q.id] !== undefined))

    function setAnswer(questionId: string, value: number) {
        setAnswers((prev) => ({ ...prev, [questionId]: value }))
    }

    function handleNextPillar() {
        if (!currentAnswered) return
        const nextStep = step + 1
        fetch('/api/draft/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: 'assessment', data: { answers, step: nextStep } }),
        }).catch(() => {})
        setStep(nextStep)
    }

    async function handleSubmit() {
        if (!allAnswered) return
        setSubmitting(true)
        setError('')
        try {
            const responses = Object.entries(answers).map(([questionId, value]) => {
                const pillar = PILLARS.find(p => p.questions.some(q => q.id === questionId))?.key
                return { questionId, pillar, value }
            })
            const res = await fetch('/api/assessment/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ responses }),
            })
            if (!res.ok) throw new Error(await res.text())
            // Clear drafts (server + local)
            fetch('/api/draft/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'assessment', data: null }),
            }).catch(() => {})
            try { localStorage.removeItem(`align_assessment_draft_${session?.user?.id}`) } catch {}
            // Refresh JWT so profileComplete = true is reflected immediately
            await update({ profileComplete: true })
            setSubmitted(true)
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    // ── Success screen ────────────────────────────────────────────────────────
    if (submitted) {
        return (
            <>
                <Header />
                <main style={{ paddingTop: 'var(--header-height)', minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
                    <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-16) var(--space-6)', textAlign: 'center' }}>
                        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-6)' }}>
                            <CheckCircle size={40} color="#10B981" />
                        </div>
                        <h1 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
                            {isOnboarding ? 'You\'re All Set!' : 'Assessment Complete'}
                        </h1>
                        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
                            {isOnboarding
                                ? 'Your Six Pillar scores have been saved. Your profile is complete — welcome to ALIGN.'
                                : 'Your Six Pillar results have been saved. You can retake the assessment any time to track your growth.'}
                        </p>
                        <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', marginBottom: 'var(--space-8)' }}>
                            <SummaryChart answers={answers} />
                        </div>
                        <Link href="/dashboard" className="btn btn--primary btn--lg">
                            {isOnboarding ? 'Go to My Dashboard' : 'Back to Dashboard'}
                        </Link>
                    </div>
                </main>
            </>
        )
    }

    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)', minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
                <div style={{ maxWidth: '720px', margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>

                    {/* Back link — hidden during onboarding */}
                    {!isOnboarding && (
                        <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', textDecoration: 'none', marginBottom: 'var(--space-6)' }}>
                            <ChevronLeft size={16} /> Back to Dashboard
                        </Link>
                    )}

                    {/* Onboarding context header */}
                    {isOnboarding && (
                        <div style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-3) var(--space-4)', background: 'rgba(225,29,72,0.06)', border: '1px solid rgba(225,29,72,0.15)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                            <strong style={{ color: 'var(--color-primary)' }}>Step 3 of 3</strong> — Six Pillar Assessment
                        </div>
                    )}

                    {/* Draft restored notice */}
                    {draftRestored && (
                        <div style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: '#10B981', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Your progress has been restored.</span>
                            <button
                                onClick={() => { setDraftRestored(false); setAnswers({}); setStep(0); try { localStorage.removeItem(`align_assessment_draft_${session?.user?.id}`) } catch {} }}
                                style={{ fontSize: '11px', padding: '2px 10px', borderRadius: '99px', border: '1px solid rgba(16,185,129,0.3)', background: 'transparent', color: '#10B981', cursor: 'pointer', fontWeight: 600, marginLeft: 'var(--space-3)' }}
                            >
                                Start over
                            </button>
                        </div>
                    )}

                    {/* Progress bar */}
                    <div style={{ marginBottom: 'var(--space-8)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                                {isSummary ? 'Summary' : `Pillar ${step + 1} of ${totalPillars}`}
                            </span>
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                                {isSummary ? `${totalQuestions} / ${totalQuestions} answered` : `${Object.keys(answers).length} / ${totalQuestions} answered`}
                            </span>
                        </div>
                        <div style={{ height: '6px', borderRadius: '3px', background: 'var(--color-border-subtle)', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%',
                                width: `${isSummary ? 100 : ((step) / totalPillars) * 100}%`,
                                background: 'var(--color-primary)',
                                borderRadius: '3px',
                                transition: 'width 0.3s ease',
                            }} />
                        </div>
                        {/* Pillar step indicators */}
                        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)', flexWrap: 'wrap' }}>
                            {PILLARS.map((p, i) => {
                                const done = PILLARS[i].questions.every((q) => answers[q.id] !== undefined)
                                const active = i === step
                                return (
                                    <span key={p.key} style={{
                                        fontSize: '11px',
                                        padding: '3px 10px',
                                        borderRadius: '99px',
                                        fontWeight: active ? 700 : 500,
                                        background: active ? PILLAR_COLORS[p.key] : done ? 'rgba(16,185,129,0.15)' : 'var(--color-bg-elevated)',
                                        color: active ? '#fff' : done ? '#10B981' : 'var(--color-text-tertiary)',
                                        border: active ? 'none' : '1px solid var(--color-border-subtle)',
                                        transition: 'all 0.2s',
                                    }}>
                                        {done && !active ? '✓ ' : ''}{p.name}
                                    </span>
                                )
                            })}
                        </div>
                    </div>

                    {/* ── Pillar screen ─────────────────────────────────────── */}
                    {!isSummary && (
                        <div>
                            {/* Pillar header */}
                            <div style={{ marginBottom: 'var(--space-6)' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', padding: '4px 14px', borderRadius: '99px', background: `${PILLAR_COLORS[currentPillar.key]}18`, border: `1px solid ${PILLAR_COLORS[currentPillar.key]}40`, marginBottom: 'var(--space-3)' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: PILLAR_COLORS[currentPillar.key], display: 'inline-block' }} />
                                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: PILLAR_COLORS[currentPillar.key], textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                        {currentPillar.name}
                                    </span>
                                </div>
                                <h2 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>{currentPillar.name}</h2>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                                    {currentPillar.description}
                                </p>
                                <div style={{ background: 'rgba(225,29,72,0.06)', border: '1px solid rgba(225,29,72,0.15)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                                    Choose the option that best describes where you are <strong>today</strong>, not where you want to be.
                                </div>
                            </div>

                            {/* Questions */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                                {currentPillar.questions.map((q, qi) => (
                                    <div key={q.id} style={{ background: 'var(--color-bg-elevated)', border: `1px solid ${answers[q.id] ? PILLAR_COLORS[currentPillar.key] + '50' : 'var(--color-border-subtle)'}`, borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', transition: 'border-color 0.2s' }}>
                                        <label style={{ display: 'block', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                                            <span style={{ color: PILLAR_COLORS[currentPillar.key], marginRight: '8px', fontWeight: 700 }}>{qi + 1}.</span>
                                            {q.text}
                                        </label>
                                        <select
                                            value={answers[q.id] ?? ''}
                                            onChange={(e) => setAnswer(q.id, parseInt(e.target.value))}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                borderRadius: 'var(--radius-md)',
                                                border: `1px solid ${answers[q.id] ? PILLAR_COLORS[currentPillar.key] + '80' : 'var(--color-border-subtle)'}`,
                                                background: 'var(--color-bg-primary)',
                                                color: answers[q.id] ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                                                fontSize: 'var(--text-sm)',
                                                cursor: 'pointer',
                                                outline: 'none',
                                                appearance: 'auto',
                                            }}
                                        >
                                            <option value="" disabled>Select the option that best describes you…</option>
                                            {q.options.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.value}. {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>

                            {/* Navigation */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-8)' }}>
                                {step > 0 ? (
                                    <button onClick={() => setStep(step - 1)} className="btn btn--secondary">
                                        <ChevronLeft size={16} /> Previous Pillar
                                    </button>
                                ) : <div />}
                                <button
                                    onClick={handleNextPillar}
                                    disabled={!currentAnswered}
                                    className="btn btn--primary"
                                    style={{ opacity: currentAnswered ? 1 : 0.45, cursor: currentAnswered ? 'pointer' : 'not-allowed' }}
                                >
                                    {step === totalPillars - 1 ? 'Review Summary' : 'Next Pillar'} <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Summary screen ────────────────────────────────────── */}
                    {isSummary && (
                        <div>
                            <div style={{ marginBottom: 'var(--space-6)' }}>
                                <h2 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Your Assessment Summary</h2>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                                    Review your scores before submitting. Higher % = stronger alignment in that area.
                                </p>
                            </div>

                            <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', marginBottom: 'var(--space-6)' }}>
                                <SummaryChart answers={answers} />
                            </div>

                            {/* Per-pillar answer review */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                                {PILLARS.map((p, i) => (
                                    <details key={p.key} style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                                        <summary style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4) var(--space-5)', cursor: 'pointer', listStyle: 'none', fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: PILLAR_COLORS[p.key], display: 'inline-block', flexShrink: 0 }} />
                                                {p.name}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                <span style={{ fontWeight: 700, color: PILLAR_COLORS[p.key] }}>
                                                    {pillarDisplayScore(p.questions.map((q) => ({ value: answers[q.id] ?? 3 })))}%
                                                </span>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); setStep(i) }}
                                                    style={{ fontSize: '11px', padding: '2px 10px', borderRadius: '99px', border: '1px solid var(--color-border-subtle)', background: 'transparent', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}
                                                >
                                                    Edit
                                                </button>
                                            </span>
                                        </summary>
                                        <div style={{ padding: 'var(--space-4) var(--space-5)', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                            {p.questions.map((q) => {
                                                const val = answers[q.id]
                                                const opt = q.options.find((o) => o.value === val)
                                                return (
                                                    <div key={q.id} style={{ fontSize: 'var(--text-sm)' }}>
                                                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2px' }}>{q.text}</p>
                                                        <p style={{ color: 'var(--color-text-primary)', fontWeight: 600, margin: 0 }}>
                                                            {val}. {opt?.label}
                                                        </p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </details>
                                ))}
                            </div>

                            {error && (
                                <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', background: 'rgba(239,68,68,0.08)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                                    {error}
                                </p>
                            )}

                            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'space-between' }}>
                                <button onClick={() => setStep(totalPillars - 1)} className="btn btn--secondary">
                                    <ChevronLeft size={16} /> Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting || !allAnswered}
                                    className="btn btn--primary btn--lg"
                                    style={{ opacity: submitting ? 0.7 : 1 }}
                                >
                                    {submitting ? 'Saving…' : 'Save My Results'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}
