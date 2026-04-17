'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ArrowLeft, ArrowRight, Check, MapPin, Loader2, Globe } from 'lucide-react'
import { US_STATES, COUNTRIES } from '@/lib/location-data'
import CityAutocomplete from '@/components/CityAutocomplete'

const TOTAL_STEPS = 3

export default function ProfileSetupPage() {
    const { data: session, status, update } = useSession()
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [draftLoaded, setDraftLoaded] = useState(false)
    const [draftRestored, setDraftRestored] = useState(false)

    const [formData, setFormData] = useState({
        dobMonth: '',
        dobDay: '',
        dobYear: '',
        gender: '',
        seekingGender: '',
        country: 'United States',
        state: '',
        city: '',
        bio: '',
        relationshipGoal: 'SERIOUS_DATING',
    })

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    // Restore draft from localStorage once session is available
    useEffect(() => {
        if (!session?.user?.id) return
        try {
            const key = `align_profile_setup_draft_${session.user.id}`
            const saved = localStorage.getItem(key)
            if (saved) {
                const parsed = JSON.parse(saved)
                if (parsed?.formData && typeof parsed.formData === 'object') {
                    setFormData(prev => ({ ...prev, ...parsed.formData }))
                    setDraftRestored(true)
                }
                if (typeof parsed?.currentStep === 'number') {
                    setCurrentStep(parsed.currentStep)
                }
            }
        } catch {}
        setDraftLoaded(true)
    }, [session?.user?.id])

    // Save draft to localStorage on every change
    useEffect(() => {
        if (!session?.user?.id || !draftLoaded) return
        try {
            const key = `align_profile_setup_draft_${session.user.id}`
            localStorage.setItem(key, JSON.stringify({ formData, currentStep }))
        } catch {}
    }, [formData, currentStep, session?.user?.id, draftLoaded])

    const updateFormData = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        setError(null)
    }

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                if (!formData.dobMonth || !formData.dobDay || !formData.dobYear) { setError('Date of birth is required'); return false }
                const dob = new Date(parseInt(formData.dobYear), parseInt(formData.dobMonth) - 1, parseInt(formData.dobDay))
                const today = new Date()
                let age = today.getFullYear() - dob.getFullYear()
                const m = today.getMonth() - dob.getMonth()
                if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
                if (age < 18) { setError('You must be 18 or older'); return false }
                if (!formData.gender) { setError('Please select your gender'); return false }
                return true
            case 2:
                if (!formData.state.trim()) { setError('State / Province is required'); return false }
                if (!formData.city.trim()) { setError('City is required'); return false }
                return true
            case 3:
                if (!formData.seekingGender) { setError('Please select who you are looking for'); return false }
                if (!formData.relationshipGoal) { setError('Please select your relationship goal'); return false }
                return true
            default:
                return true
        }
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
            const response = await fetch('/api/profile/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dateOfBirth: `${formData.dobYear}-${formData.dobMonth.padStart(2, '0')}-${formData.dobDay.padStart(2, '0')}`,
                    gender: formData.gender,
                    seekingGender: formData.seekingGender,
                    country: formData.country,
                    city: formData.city.trim(),
                    state: formData.state.trim(),
                    bio: formData.bio.trim(),
                    relationshipGoal: formData.relationshipGoal,
                }),
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error || 'Failed to save profile')

            // Clear draft now that profile is saved server-side
            try { localStorage.removeItem(`align_profile_setup_draft_${session?.user?.id}`) } catch {}

            await update({ profileSetup: true })

            // Send user to the Six Pillar Assessment as the next required onboarding step
            router.push('/dashboard/assessment?onboarding=1')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save profile')
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

    if (!session) return null

    const stepNames = ['About You', 'Your Location', 'Your Preferences']

    const isUS = formData.country === 'United States'

    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                <section className="section section--cream" style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
                    <div className="container">
                        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                            <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                                    Complete Your Profile
                                </h1>
                                <p style={{ color: 'var(--color-slate)' }}>
                                    Step 2 of 3 in your ALIGN onboarding
                                </p>
                            </div>

                            {/* Draft restored notice */}
                            {draftRestored && (
                                <div style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: '#10B981', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>Your progress has been restored.</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDraftRestored(false)
                                            setCurrentStep(1)
                                            setFormData({ dobMonth: '', dobDay: '', dobYear: '', gender: '', seekingGender: '', country: 'United States', state: '', city: '', bio: '', relationshipGoal: 'SERIOUS_DATING' })
                                            try { localStorage.removeItem(`align_profile_setup_draft_${session?.user?.id}`) } catch {}
                                        }}
                                        style={{ fontSize: '11px', padding: '2px 10px', borderRadius: '99px', border: '1px solid rgba(16,185,129,0.3)', background: 'transparent', color: '#10B981', cursor: 'pointer', fontWeight: 600, marginLeft: 'var(--space-3)' }}
                                    >
                                        Start over
                                    </button>
                                </div>
                            )}

                            {/* Progress Bar */}
                            <div style={{ marginBottom: 'var(--space-6)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)' }}>
                                        Step {currentStep} of {TOTAL_STEPS}
                                    </span>
                                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)' }}>
                                        {stepNames[currentStep - 1]}
                                    </span>
                                </div>
                                <div style={{ height: '8px', backgroundColor: 'var(--color-rose)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${(currentStep / TOTAL_STEPS) * 100}%`,
                                        backgroundColor: 'var(--color-primary)',
                                        borderRadius: 'var(--radius-full)',
                                        transition: 'width 0.3s ease',
                                    }} />
                                </div>
                            </div>

                            <div className="card" style={{ marginTop: 'var(--space-4)' }}>
                                <form onSubmit={handleSubmit}>
                                    {error && (
                                        <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #F87171', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', marginBottom: 'var(--space-6)', color: '#B91C1C' }}>
                                            {error}
                                        </div>
                                    )}

                                    {/* Step 1: About You */}
                                    {currentStep === 1 && (
                                        <div>
                                            <h2 style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>About You</h2>

                                            <div className="form-group">
                                                <label className="form-label">Date of Birth</label>
                                                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                                    <select
                                                        className="form-input"
                                                        value={formData.dobMonth}
                                                        onChange={(e) => updateFormData('dobMonth', e.target.value)}
                                                        disabled={isLoading}
                                                        style={{ flex: 2 }}
                                                    >
                                                        <option value="">Month</option>
                                                        {['January','February','March','April','May','June','July','August','September','October','November','December'].map((m, i) => (
                                                            <option key={m} value={String(i + 1)}>{m}</option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        className="form-input"
                                                        value={formData.dobDay}
                                                        onChange={(e) => updateFormData('dobDay', e.target.value)}
                                                        disabled={isLoading}
                                                        style={{ flex: 1 }}
                                                    >
                                                        <option value="">Day</option>
                                                        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                                            <option key={d} value={String(d)}>{d}</option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        className="form-input"
                                                        value={formData.dobYear}
                                                        onChange={(e) => updateFormData('dobYear', e.target.value)}
                                                        disabled={isLoading}
                                                        style={{ flex: 2 }}
                                                    >
                                                        <option value="">Year</option>
                                                        {Array.from({ length: 2006 - 1940 + 1 }, (_, i) => 2006 - i).map(y => (
                                                            <option key={y} value={String(y)}>{y}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <p className="form-hint">You must be 18 or older</p>
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">I am a</label>
                                                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                                                    {['MALE', 'FEMALE'].map(g => (
                                                        <label key={g} style={{
                                                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            padding: 'var(--space-4)', borderRadius: 'var(--radius-md)',
                                                            border: `2px solid ${formData.gender === g ? 'var(--color-primary)' : 'var(--color-rose)'}`,
                                                            backgroundColor: formData.gender === g ? 'var(--color-blush)' : 'transparent',
                                                            cursor: 'pointer', transition: 'all 0.2s',
                                                        }}>
                                                            <input type="radio" name="gender" value={g} checked={formData.gender === g}
                                                                onChange={(e) => updateFormData('gender', e.target.value)} style={{ display: 'none' }} />
                                                            {g === 'MALE' ? 'Man' : 'Woman'}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Location */}
                                    {currentStep === 2 && (
                                        <div>
                                            <h2 style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>Your Location</h2>

                                            <div className="form-group">
                                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Globe size={14} /> Country
                                                </label>
                                                <select
                                                    className="form-input"
                                                    value={formData.country}
                                                    onChange={(e) => { updateFormData('country', e.target.value); updateFormData('state', ''); updateFormData('city', '') }}
                                                    disabled={isLoading}
                                                >
                                                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <MapPin size={14} /> {isUS ? 'State' : 'State / Province'}
                                                </label>
                                                {isUS ? (
                                                    <select
                                                        className="form-input"
                                                        value={formData.state}
                                                        onChange={(e) => { updateFormData('state', e.target.value); updateFormData('city', '') }}
                                                        required disabled={isLoading}
                                                    >
                                                        <option value="">Select a state</option>
                                                        {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                ) : (
                                                    <input type="text" className="form-input" value={formData.state}
                                                        onChange={(e) => updateFormData('state', e.target.value)}
                                                        placeholder="State / Province" disabled={isLoading} />
                                                )}
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">City</label>
                                                <CityAutocomplete
                                                    value={formData.city}
                                                    onChange={(city) => updateFormData('city', city)}
                                                    state={isUS ? formData.state : ''}
                                                    placeholder={isUS && !formData.state ? 'Select a state first' : 'Enter your city'}
                                                    disabled={isLoading}
                                                    required
                                                />
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

                                    {/* Step 3: Preferences */}
                                    {currentStep === 3 && (
                                        <div>
                                            <h2 style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>Your Preferences</h2>

                                            <div className="form-group">
                                                <label className="form-label">I am looking for a</label>
                                                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                                                    {['MALE', 'FEMALE'].map(g => (
                                                        <label key={g} style={{
                                                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            padding: 'var(--space-4)', borderRadius: 'var(--radius-md)',
                                                            border: `2px solid ${formData.seekingGender === g ? 'var(--color-primary)' : 'var(--color-rose)'}`,
                                                            backgroundColor: formData.seekingGender === g ? 'var(--color-blush)' : 'transparent',
                                                            cursor: 'pointer',
                                                        }}>
                                                            <input type="radio" name="seekingGender" value={g} checked={formData.seekingGender === g}
                                                                onChange={(e) => updateFormData('seekingGender', e.target.value)} style={{ display: 'none' }} />
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
                                                    required disabled={isLoading}
                                                >
                                                    <option value="MARRIAGE">Marriage</option>
                                                    <option value="SERIOUS_DATING">Serious Dating</option>
                                                    <option value="DISCERNING">Still Discerning</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    {/* Navigation */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-8)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-rose)' }}>
                                        {currentStep > 1 ? (
                                            <button type="button" onClick={prevStep} className="btn btn--secondary" disabled={isLoading}>
                                                <ArrowLeft size={18} /> Back
                                            </button>
                                        ) : <div />}

                                        {currentStep < TOTAL_STEPS ? (
                                            <button type="button" onClick={nextStep} className="btn btn--primary">
                                                Continue <ArrowRight size={18} />
                                            </button>
                                        ) : (
                                            <button type="submit" className="btn btn--primary" disabled={isLoading}>
                                                {isLoading ? (
                                                    <><Loader2 size={18} className="animate-spin" /> Saving...</>
                                                ) : (
                                                    <> Continue to Assessment <ArrowRight size={18} /></>
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
