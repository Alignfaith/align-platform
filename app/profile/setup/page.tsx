'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ArrowLeft, ArrowRight, Check, User, MapPin, Heart, Loader2, Church, Brain, Dumbbell, Wallet, Sparkles } from 'lucide-react'
import { PILLAR_CONFIGS, ASSESSMENT_INSTRUCTION, PillarType } from '@/lib/pillarQuestions'

const US_STATES = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
]

const PILLAR_ICONS: Record<PillarType, any> = {
    SPIRITUAL: Church,
    MENTAL: Brain,
    PHYSICAL: Dumbbell,
    FINANCIAL: Wallet,
    APPEARANCE: Sparkles,
    INTIMACY: Heart,
}

const PILLAR_COLORS: Record<PillarType, string> = {
    SPIRITUAL: '#4F46E5',
    MENTAL: '#0891B2',
    PHYSICAL: '#059669',
    FINANCIAL: '#CA8A04',
    APPEARANCE: '#D946EF',
    INTIMACY: '#E11D48',
}

// Step structure: About You, 6 Pillars, Location, Preferences = 9 steps
const TOTAL_STEPS = 9

export default function ProfileSetupPage() {
    const { data: session, status, update } = useSession()
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Basic info
    const [formData, setFormData] = useState({
        dateOfBirth: '',
        gender: '',
        seekingGender: '',
        city: '',
        state: '',
        bio: '',
        relationshipGoal: 'SERIOUS_DATING',
    })

    // Pillar responses: { questionId: value (1-5) }
    const [pillarResponses, setPillarResponses] = useState<Record<string, number>>({})

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    const updateFormData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        setError(null)
    }

    const updatePillarResponse = (questionId: string, value: number) => {
        setPillarResponses(prev => ({ ...prev, [questionId]: value }))
        setError(null)
    }

    // Get pillar config for current step (steps 2-7 are pillars)
    const getCurrentPillar = () => {
        if (currentStep >= 2 && currentStep <= 7) {
            return PILLAR_CONFIGS[currentStep - 2]
        }
        return null
    }

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1: // About You
                if (!formData.dateOfBirth) {
                    setError('Date of birth is required')
                    return false
                }
                const age = calculateAge(new Date(formData.dateOfBirth))
                if (age < 18) {
                    setError('You must be 18 or older')
                    return false
                }
                if (!formData.gender) {
                    setError('Please select your gender')
                    return false
                }
                return true
            case 2: case 3: case 4: case 5: case 6: case 7: // Pillar steps
                const pillar = PILLAR_CONFIGS[step - 2]
                const unanswered = pillar.questions.filter(q => !pillarResponses[q.id])
                if (unanswered.length > 0) {
                    setError(`Please answer all questions for ${pillar.name}`)
                    return false
                }
                return true
            case 8: // Location
                if (!formData.city.trim()) {
                    setError('City is required')
                    return false
                }
                if (!formData.state) {
                    setError('State is required')
                    return false
                }
                return true
            case 9: // Preferences
                if (!formData.seekingGender) {
                    setError('Please select who you are looking for')
                    return false
                }
                if (!formData.relationshipGoal) {
                    setError('Please select your relationship goal')
                    return false
                }
                return true
            default:
                return true
        }
    }

    const calculateAge = (birthDate: Date): number => {
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age
    }

    const nextStep = () => {
        if (validateStep(currentStep) && currentStep < TOTAL_STEPS) {
            setCurrentStep(currentStep + 1)
            setError(null)
            window.scrollTo(0, 0)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
            setError(null)
            window.scrollTo(0, 0)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateStep(currentStep)) return

        setIsLoading(true)
        setError(null)

        try {
            // Format pillar responses for API
            const formattedResponses = Object.entries(pillarResponses).map(([questionId, value]) => {
                // Find which pillar this question belongs to
                const pillar = PILLAR_CONFIGS.find(p => p.questions.some(q => q.id === questionId))
                return {
                    questionId,
                    pillar: pillar?.id,
                    value
                }
            })

            const response = await fetch('/api/profile/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dateOfBirth: formData.dateOfBirth,
                    gender: formData.gender,
                    seekingGender: formData.seekingGender,
                    city: formData.city.trim(),
                    state: formData.state,
                    bio: formData.bio.trim(),
                    relationshipGoal: formData.relationshipGoal,
                    pillarResponses: formattedResponses,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to complete profile')
            }

            // Update session to reflect profile completion
            await update({ profileComplete: true })

            // Redirect to dashboard
            router.push('/dashboard')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to complete profile')
        } finally {
            setIsLoading(false)
        }
    }

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

    const getStepName = (step: number): string => {
        if (step === 1) return 'About You'
        if (step >= 2 && step <= 7) return PILLAR_CONFIGS[step - 2].name
        if (step === 8) return 'Location'
        if (step === 9) return 'Preferences'
        return ''
    }

    const currentPillar = getCurrentPillar()
    const PillarIcon = currentPillar ? PILLAR_ICONS[currentPillar.id] : null
    const pillarColor = currentPillar ? PILLAR_COLORS[currentPillar.id] : '#4F46E5'

    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                <section className="section section--cream" style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
                    <div className="container">
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                                <h1 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: 'var(--text-4xl)',
                                    color: 'var(--color-primary)',
                                    marginBottom: 'var(--space-2)',
                                }}>
                                    Six Pillars Assessment
                                </h1>
                                <p style={{ color: 'var(--color-slate)' }}>
                                    {ASSESSMENT_INSTRUCTION}
                                </p>
                            </div>

                            {/* Progress Bar */}
                            <div style={{ marginBottom: 'var(--space-6)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)' }}>
                                        Step {currentStep} of {TOTAL_STEPS}
                                    </span>
                                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: pillarColor }}>
                                        {getStepName(currentStep)}
                                    </span>
                                </div>
                                <div style={{
                                    height: '8px',
                                    backgroundColor: 'var(--color-rose)',
                                    borderRadius: 'var(--radius-full)',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${(currentStep / TOTAL_STEPS) * 100}%`,
                                        backgroundColor: pillarColor,
                                        borderRadius: 'var(--radius-full)',
                                        transition: 'width 0.3s ease',
                                    }} />
                                </div>
                            </div>

                            <div className="card" style={{ marginTop: 'var(--space-4)' }}>
                                <form onSubmit={handleSubmit}>
                                    {error && (
                                        <div style={{
                                            backgroundColor: '#FEE2E2',
                                            border: '1px solid #F87171',
                                            borderRadius: 'var(--radius-md)',
                                            padding: 'var(--space-4)',
                                            marginBottom: 'var(--space-6)',
                                            color: '#B91C1C',
                                        }}>
                                            {error}
                                        </div>
                                    )}

                                    {/* Step 1: About You */}
                                    {currentStep === 1 && (
                                        <div>
                                            <h2 style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
                                                About You
                                            </h2>

                                            <div className="form-group">
                                                <label className="form-label">Date of Birth</label>
                                                <input
                                                    type="date"
                                                    className="form-input"
                                                    value={formData.dateOfBirth}
                                                    onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                                                    required
                                                    disabled={isLoading}
                                                />
                                                <p className="form-hint">You must be 18 or older</p>
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">I am a</label>
                                                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                                                    {['MALE', 'FEMALE'].map(g => (
                                                        <label key={g} style={{
                                                            flex: 1,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            padding: 'var(--space-4)',
                                                            borderRadius: 'var(--radius-md)',
                                                            border: `2px solid ${formData.gender === g ? 'var(--color-primary)' : 'var(--color-rose)'}`,
                                                            backgroundColor: formData.gender === g ? 'var(--color-blush)' : 'transparent',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                        }}>
                                                            <input
                                                                type="radio"
                                                                name="gender"
                                                                value={g}
                                                                checked={formData.gender === g}
                                                                onChange={(e) => updateFormData('gender', e.target.value)}
                                                                style={{ display: 'none' }}
                                                            />
                                                            {g === 'MALE' ? 'Man' : 'Woman'}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Steps 2-7: Pillar Assessments */}
                                    {currentPillar && PillarIcon && (
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                                                <div style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    borderRadius: 'var(--radius-lg)',
                                                    backgroundColor: `${pillarColor}15`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: pillarColor,
                                                }}>
                                                    <PillarIcon size={30} />
                                                </div>
                                                <div>
                                                    <h2 style={{ marginBottom: 'var(--space-1)' }}>{currentPillar.name}</h2>
                                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginBottom: 0 }}>
                                                        {currentPillar.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                                                {currentPillar.questions.map((question, qIndex) => (
                                                    <div key={question.id} style={{
                                                        padding: 'var(--space-4)',
                                                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                                        borderRadius: 'var(--radius-lg)',
                                                        border: pillarResponses[question.id] ? `2px solid ${pillarColor}` : '1px solid var(--color-rose-light)',
                                                    }}>
                                                        <p style={{
                                                            fontWeight: 600,
                                                            marginBottom: 'var(--space-3)',
                                                            color: 'var(--color-charcoal)',
                                                        }}>
                                                            {qIndex + 1}. {question.title}
                                                        </p>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                                            {question.options.map((option) => (
                                                                <label
                                                                    key={option.value}
                                                                    style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 'var(--space-3)',
                                                                        padding: 'var(--space-3)',
                                                                        borderRadius: 'var(--radius-md)',
                                                                        backgroundColor: pillarResponses[question.id] === option.value ? `${pillarColor}15` : 'transparent',
                                                                        border: pillarResponses[question.id] === option.value ? `1px solid ${pillarColor}` : '1px solid transparent',
                                                                        cursor: 'pointer',
                                                                        transition: 'all 0.2s',
                                                                    }}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        name={question.id}
                                                                        value={option.value}
                                                                        checked={pillarResponses[question.id] === option.value}
                                                                        onChange={() => updatePillarResponse(question.id, option.value)}
                                                                        style={{ accentColor: pillarColor }}
                                                                    />
                                                                    <span style={{
                                                                        fontSize: 'var(--text-sm)',
                                                                        color: pillarResponses[question.id] === option.value ? pillarColor : 'var(--color-charcoal)',
                                                                    }}>
                                                                        {option.label}
                                                                    </span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 8: Location */}
                                    {currentStep === 8 && (
                                        <div>
                                            <h2 style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
                                                Your Location
                                            </h2>

                                            <div className="form-group">
                                                <label className="form-label">City</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={formData.city}
                                                    onChange={(e) => updateFormData('city', e.target.value)}
                                                    placeholder="Enter your city"
                                                    required
                                                    disabled={isLoading}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">State</label>
                                                <select
                                                    className="form-input"
                                                    value={formData.state}
                                                    onChange={(e) => updateFormData('state', e.target.value)}
                                                    required
                                                    disabled={isLoading}
                                                >
                                                    <option value="">Select a state</option>
                                                    {US_STATES.map(state => (
                                                        <option key={state} value={state}>{state}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Bio (optional)</label>
                                                <textarea
                                                    className="form-input form-textarea"
                                                    value={formData.bio}
                                                    onChange={(e) => updateFormData('bio', e.target.value)}
                                                    placeholder="Tell others a bit about your faith journey..."
                                                    disabled={isLoading}
                                                    rows={4}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 9: Preferences */}
                                    {currentStep === 9 && (
                                        <div>
                                            <h2 style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
                                                Your Preferences
                                            </h2>

                                            <div className="form-group">
                                                <label className="form-label">I am looking for a</label>
                                                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                                                    {['MALE', 'FEMALE'].map(g => (
                                                        <label key={g} style={{
                                                            flex: 1,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            padding: 'var(--space-4)',
                                                            borderRadius: 'var(--radius-md)',
                                                            border: `2px solid ${formData.seekingGender === g ? 'var(--color-primary)' : 'var(--color-rose)'}`,
                                                            backgroundColor: formData.seekingGender === g ? 'var(--color-blush)' : 'transparent',
                                                            cursor: 'pointer',
                                                        }}>
                                                            <input
                                                                type="radio"
                                                                name="seekingGender"
                                                                value={g}
                                                                checked={formData.seekingGender === g}
                                                                onChange={(e) => updateFormData('seekingGender', e.target.value)}
                                                                style={{ display: 'none' }}
                                                            />
                                                            {g === 'MALE' ? 'Man' : 'Woman'}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">What are you looking for?</label>
                                                <select
                                                    className="form-input"
                                                    value={formData.relationshipGoal}
                                                    onChange={(e) => updateFormData('relationshipGoal', e.target.value)}
                                                    required
                                                    disabled={isLoading}
                                                >
                                                    <option value="MARRIAGE">Marriage</option>
                                                    <option value="SERIOUS_DATING">Serious Dating</option>
                                                    <option value="DISCERNING">Still Discerning</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    {/* Navigation */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginTop: 'var(--space-8)',
                                        paddingTop: 'var(--space-6)',
                                        borderTop: '1px solid var(--color-rose)',
                                    }}>
                                        {currentStep > 1 ? (
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="btn btn--secondary"
                                                disabled={isLoading}
                                            >
                                                <ArrowLeft size={18} />
                                                Back
                                            </button>
                                        ) : (
                                            <div />
                                        )}

                                        {currentStep < TOTAL_STEPS ? (
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                className="btn btn--primary"
                                            >
                                                Continue
                                                <ArrowRight size={18} />
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                className="btn btn--primary"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 size={18} className="animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        Complete Assessment
                                                        <Check size={18} />
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
