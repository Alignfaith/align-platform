'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ArrowLeft, ArrowRight, Check, BookOpen, Users, FileText, Shield, Loader2, Eye, EyeOff } from 'lucide-react'

const steps = [
    { id: 1, name: 'Account', icon: Users },
    { id: 2, name: 'Reflections', icon: FileText },
    { id: 3, name: 'Framework', icon: BookOpen },
    { id: 4, name: 'Agreement', icon: Shield },
]

const registrationQuestions = [
    {
        id: 1,
        pillar: 'SPIRITUAL',
        questionId: 'spiritual_friends_faith',
        question: 'My closest friends would describe my faith as:',
        options: [
            'Deeply rooted. It shows in everything I do',
            'Active and growing. I am consistent and intentional',
            'Present but inconsistent. I have room to grow',
            'Developing. I am still finding my foundation',
            'Not a current priority in my life',
        ],
    },
    {
        id: 2,
        pillar: 'MENTAL',
        questionId: 'mental_friends_emotional_maturity',
        question: 'My closest friends would describe my emotional maturity as:',
        options: [
            'Grounded and self-aware. I handle hard things well',
            'Mostly mature. I manage well with occasional struggles',
            'Growing. I am better than I used to be',
            'Inconsistent. I am still working through some things',
            'A work in progress. This is an area I need to develop',
        ],
    },
    {
        id: 3,
        pillar: 'PHYSICAL',
        questionId: 'physical_friends_fitness',
        question: 'My closest friends would describe my current physical fitness as:',
        options: [
            'Disciplined and consistent. I take it seriously',
            'Active and intentional. I make it a priority',
            'Somewhat active. I could be more consistent',
            'Inconsistent. I go through phases',
            'Not a current focus in my life',
        ],
    },
    {
        id: 4,
        pillar: 'FINANCIAL',
        questionId: 'financial_friends_money',
        question: 'My closest friends would describe how I handle money as:',
        options: [
            'Responsible and intentional. I have a plan',
            'Generally disciplined. I make mostly good decisions',
            'Getting better. I am more aware than I used to be',
            'Inconsistent. I struggle with financial discipline',
            'A work in progress. This is an area I need to develop',
        ],
    },
    {
        id: 5,
        pillar: 'APPEARANCE',
        questionId: 'appearance_friends_presentation',
        question: 'My closest friends would describe how I present and carry myself as:',
        options: [
            'Polished and intentional. I always show up well',
            'Put together. I take pride in how I present myself',
            'Casual but clean. I am aware but relaxed',
            'Comfortable focused. I prioritize comfort',
            'Inconsistent. It depends on the day',
        ],
    },
    {
        id: 6,
        pillar: 'INTIMACY',
        questionId: 'intimacy_friends_boundaries',
        question: 'My closest friends would describe my approach to relationships and boundaries as:',
        options: [
            'Intentional and mature. I move with purpose and clarity',
            'Thoughtful. I value emotional safety and trust',
            'Still developing. I am learning what healthy looks like',
            'Inconsistent. I have patterns I am working through',
            'A work in progress. This is an area I need to grow in',
        ],
    },
]

export default function RegisterPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        inviteCode: '',
        reflections: ['', '', '', '', '', ''],
        hasReadBook: false,
        understandsFramework: false,
        agreesToGuidelines: false,
        agreesToTerms: false,
    })

    const updateFormData = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        setError(null)
    }

    const updateReflection = (index: number, value: string) => {
        const newReflections = [...formData.reflections]
        newReflections[index] = value
        updateFormData('reflections', newReflections as unknown as string)
        setFormData(prev => ({ ...prev, reflections: newReflections }))
    }

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                if (!formData.firstName.trim()) {
                    setError('First name is required')
                    return false
                }
                if (!formData.lastName.trim()) {
                    setError('Last name is required')
                    return false
                }
                if (!formData.email.trim()) {
                    setError('Email is required')
                    return false
                }
                if (formData.password.length < 8) {
                    setError('Password must be at least 8 characters')
                    return false
                }
                if (!/[A-Z]/.test(formData.password)) {
                    setError('Password must contain an uppercase letter')
                    return false
                }
                if (!/[a-z]/.test(formData.password)) {
                    setError('Password must contain a lowercase letter')
                    return false
                }
                if (!/[0-9]/.test(formData.password)) {
                    setError('Password must contain a number')
                    return false
                }
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match')
                    return false
                }
                return true
            case 2:
                for (let i = 0; i < formData.reflections.length; i++) {
                    if (!formData.reflections[i]) {
                        setError(`Please answer question ${i + 1}`)
                        return false
                    }
                }
                return true
            case 3:
                if (!formData.understandsFramework) {
                    setError('Please confirm you understand the framework')
                    return false
                }
                return true
            case 4:
                if (!formData.agreesToGuidelines) {
                    setError('Please agree to the community guidelines')
                    return false
                }
                if (!formData.agreesToTerms) {
                    setError('Please agree to the terms and privacy policy')
                    return false
                }
                return true
            default:
                return true
        }
    }

    const nextStep = () => {
        if (validateStep(currentStep) && currentStep < 4) {
            setCurrentStep(currentStep + 1)
            setError(null)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
            setError(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateStep(currentStep)) return

        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email.toLowerCase().trim(),
                    password: formData.password,
                    firstName: formData.firstName.trim(),
                    lastName: formData.lastName.trim(),
                    pillarResponses: registrationQuestions.map((q, i) => ({
                        questionId: q.questionId,
                        pillar: q.pillar,
                        value: parseInt(formData.reflections[i]),
                    })),
                    hasReadBook: formData.hasReadBook,
                    understandsFramework: formData.understandsFramework,
                    agreesToGuidelines: formData.agreesToGuidelines,
                    agreesToTerms: formData.agreesToTerms,
                    inviteCode: formData.inviteCode.trim() || undefined,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed')
            }

            // Sign in and redirect to profile setup
            const signInResult = await signIn('credentials', {
                email: formData.email.toLowerCase().trim(),
                password: formData.password,
                redirect: false,
            })

            if (signInResult?.error) {
                // Registration succeeded but sign-in failed, redirect to login
                router.push('/login?registered=true')
            } else {
                // Redirect to profile setup
                router.push('/profile/setup')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                <section className="section section--cream" style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
                    <div className="container">
                        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                            {/* Progress Steps */}
                            <div className="progress-steps">
                                {steps.map((step) => (
                                    <div
                                        key={step.id}
                                        className={`progress-step ${currentStep > step.id ? 'progress-step--completed' :
                                                currentStep === step.id ? 'progress-step--active' :
                                                    'progress-step--pending'
                                            }`}
                                    >
                                        <div className="progress-step__circle">
                                            {currentStep > step.id ? <Check size={18} /> : step.id}
                                        </div>
                                        <span className="progress-step__label">{step.name}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Form Card */}
                            <div className="card" style={{ marginTop: 'var(--space-8)' }}>
                                <form onSubmit={handleSubmit}>
                                    {/* Error Message */}
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

                                    {/* Step 1: Account Info */}
                                    {currentStep === 1 && (
                                        <div>
                                            <h2 style={{ marginBottom: 'var(--space-2)', textAlign: 'center' }}>
                                                Create Your Account
                                            </h2>
                                            <p style={{
                                                textAlign: 'center',
                                                color: 'var(--color-slate)',
                                                marginBottom: 'var(--space-8)'
                                            }}>
                                                Join Align to find meaningful connection.
                                            </p>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                                <div className="form-group">
                                                    <label className="form-label">First Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={formData.firstName}
                                                        onChange={(e) => updateFormData('firstName', e.target.value)}
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Last Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={formData.lastName}
                                                        onChange={(e) => updateFormData('lastName', e.target.value)}
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Email Address</label>
                                                <input
                                                    type="email"
                                                    className="form-input"
                                                    value={formData.email}
                                                    onChange={(e) => updateFormData('email', e.target.value)}
                                                    required
                                                    disabled={isLoading}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Password</label>
                                                <div style={{ position: 'relative' }}>
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        className="form-input"
                                                        style={{ paddingRight: '44px' }}
                                                        value={formData.password}
                                                        onChange={(e) => updateFormData('password', e.target.value)}
                                                        required
                                                        minLength={8}
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
                                                <p className="form-hint">At least 8 characters with uppercase, lowercase, and number</p>
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Confirm Password</label>
                                                <div style={{ position: 'relative' }}>
                                                    <input
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        className="form-input"
                                                        style={{ paddingRight: '44px' }}
                                                        value={formData.confirmPassword}
                                                        onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(v => !v)}
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
                                                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                                    >
                                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">
                                                    Invite Code <span style={{ color: 'var(--color-slate)', fontWeight: 400 }}>(optional)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={formData.inviteCode}
                                                    onChange={(e) => updateFormData('inviteCode', e.target.value.toUpperCase())}
                                                    placeholder="Enter code if you have one"
                                                    disabled={isLoading}
                                                    style={{ textTransform: 'uppercase' }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Reflections */}
                                    {currentStep === 2 && (
                                        <div>
                                            <h2 style={{ marginBottom: 'var(--space-2)', textAlign: 'center' }}>
                                                Reflection Questions
                                            </h2>
                                            <p style={{
                                                textAlign: 'center',
                                                color: 'var(--color-slate)',
                                                marginBottom: 'var(--space-8)'
                                            }}>
                                                These questions help us understand where you are in your journey.
                                            </p>

                                            {registrationQuestions.map((q, index) => (
                                                <div key={q.id} className="form-group">
                                                    <label className="form-label">
                                                        {index + 1}. {q.question}
                                                    </label>
                                                    <select
                                                        className="form-input"
                                                        value={formData.reflections[index]}
                                                        onChange={(e) => updateReflection(index, e.target.value)}
                                                        required
                                                        disabled={isLoading}
                                                    >
                                                        <option value="">Select an answer...</option>
                                                        {q.options.map((option, optIdx) => (
                                                            <option key={optIdx} value={String(optIdx + 1)}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Step 3: Framework */}
                                    {currentStep === 3 && (
                                        <div>
                                            <h2 style={{ marginBottom: 'var(--space-2)', textAlign: 'center' }}>
                                                The Relationship Fitness Framework
                                            </h2>
                                            <p style={{
                                                textAlign: 'center',
                                                color: 'var(--color-slate)',
                                                marginBottom: 'var(--space-8)'
                                            }}>
                                                Align is built on the principles from Thomas Marks' book.
                                            </p>

                                            <div style={{
                                                backgroundColor: 'var(--color-blush)',
                                                borderRadius: 'var(--radius-lg)',
                                                padding: 'var(--space-6)',
                                                marginBottom: 'var(--space-6)',
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                                                    <BookOpen size={32} color="var(--color-primary)" />
                                                    <h4 style={{ marginBottom: 0 }}>
                                                        Relationship Fitness:<br />
                                                        <span style={{ fontWeight: 400, fontSize: 'var(--text-base)' }}>
                                                            Preparing yourself for the love you desire
                                                        </span>
                                                    </h4>
                                                </div>
                                                <p style={{ color: 'var(--color-slate)', fontSize: 'var(--text-sm)', marginBottom: 0 }}>
                                                    This book reveals the six pillars that every strong partnership is built on.
                                                    These pillars help you confront old patterns, develop discipline, understand
                                                    your identity in God, and create stability in the areas that matter most.
                                                </p>
                                            </div>

                                            <div style={{ marginBottom: 'var(--space-5)' }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: '12px',
                                                    padding: 'var(--space-3)',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: '2px solid var(--color-rose)',
                                                    backgroundColor: formData.hasReadBook ? 'var(--color-blush)' : 'transparent',
                                                    cursor: 'pointer',
                                                    boxSizing: 'border-box',
                                                    width: '100%',
                                                }} onClick={() => !isLoading && updateFormData('hasReadBook', !formData.hasReadBook)}>
                                                    <input
                                                        type="checkbox"
                                                        id="hasReadBook"
                                                        checked={formData.hasReadBook}
                                                        onChange={(e) => updateFormData('hasReadBook', e.target.checked)}
                                                        style={{ marginTop: '4px', flexShrink: 0, cursor: 'pointer' }}
                                                        disabled={isLoading}
                                                    />
                                                    <label htmlFor="hasReadBook" style={{ cursor: 'pointer', flex: 1, margin: 0, fontWeight: 'normal', fontSize: 'var(--text-sm)' }}>
                                                        I have read or am committed to reading the Relationship Fitness book to understand the framework.
                                                    </label>
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: 'var(--space-5)' }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: '12px',
                                                    padding: 'var(--space-3)',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: '2px solid var(--color-rose)',
                                                    backgroundColor: formData.understandsFramework ? 'var(--color-blush)' : 'transparent',
                                                    cursor: 'pointer',
                                                    boxSizing: 'border-box',
                                                    width: '100%',
                                                }} onClick={() => !isLoading && updateFormData('understandsFramework', !formData.understandsFramework)}>
                                                    <input
                                                        type="checkbox"
                                                        id="understandsFramework"
                                                        checked={formData.understandsFramework}
                                                        onChange={(e) => updateFormData('understandsFramework', e.target.checked)}
                                                        style={{ marginTop: '4px', flexShrink: 0, cursor: 'pointer' }}
                                                        disabled={isLoading}
                                                    />
                                                    <label htmlFor="understandsFramework" style={{ cursor: 'pointer', flex: 1, margin: 0, fontWeight: 'normal', fontSize: 'var(--text-sm)' }}>
                                                        I understand that Align is built on the Six Pillars framework and that preparation
                                                        comes before connection.
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 4: Agreement */}
                                    {currentStep === 4 && (
                                        <div>
                                            <h2 style={{ marginBottom: 'var(--space-2)', textAlign: 'center' }}>
                                                Community Agreement
                                            </h2>
                                            <p style={{
                                                textAlign: 'center',
                                                color: 'var(--color-slate)',
                                                marginBottom: 'var(--space-8)'
                                            }}>
                                                Please review and agree to our community standards.
                                            </p>

                                            <div style={{
                                                backgroundColor: 'var(--color-blush)',
                                                borderRadius: 'var(--radius-lg)',
                                                padding: 'var(--space-6)',
                                                marginBottom: 'var(--space-6)',
                                            }}>
                                                <h4 style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                                                    Community Standards
                                                </h4>
                                                <ul style={{
                                                    listStyle: 'disc',
                                                    paddingLeft: 'var(--space-6)',
                                                    color: 'var(--color-charcoal)',
                                                    fontSize: 'var(--text-sm)',
                                                }}>
                                                    <li style={{ marginBottom: 'var(--space-2)' }}>Men and women seek the exact same experience</li>
                                                    <li style={{ marginBottom: 'var(--space-2)' }}>Photos are not shown initially—they unlock after mutual interest</li>
                                                    <li style={{ marginBottom: 'var(--space-2)' }}>No bikini, swimsuit, shirtless, or suggestive photos</li>
                                                    <li style={{ marginBottom: 'var(--space-2)' }}>Participation is a privilege, not a right</li>
                                                    <li>Violation of guidelines results in removal without refund</li>
                                                </ul>
                                            </div>

                                            <div style={{ marginBottom: 'var(--space-5)' }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: '12px',
                                                    padding: 'var(--space-3)',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: '2px solid var(--color-rose)',
                                                    backgroundColor: formData.agreesToGuidelines ? 'var(--color-blush)' : 'transparent',
                                                    cursor: 'pointer',
                                                    boxSizing: 'border-box',
                                                    width: '100%',
                                                }} onClick={() => !isLoading && updateFormData('agreesToGuidelines', !formData.agreesToGuidelines)}>
                                                    <input
                                                        type="checkbox"
                                                        id="agreesToGuidelines"
                                                        checked={formData.agreesToGuidelines}
                                                        onChange={(e) => updateFormData('agreesToGuidelines', e.target.checked)}
                                                        style={{ marginTop: '4px', flexShrink: 0, cursor: 'pointer' }}
                                                        disabled={isLoading}
                                                    />
                                                    <label htmlFor="agreesToGuidelines" style={{ cursor: 'pointer', flex: 1, margin: 0, fontWeight: 'normal', fontSize: 'var(--text-sm)' }}>
                                                        I affirm my commitment to Christian values and agree to follow the community guidelines.
                                                    </label>
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: 'var(--space-5)' }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: '12px',
                                                    padding: 'var(--space-3)',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: '2px solid var(--color-rose)',
                                                    backgroundColor: formData.agreesToTerms ? 'var(--color-blush)' : 'transparent',
                                                    cursor: 'pointer',
                                                    boxSizing: 'border-box',
                                                    width: '100%',
                                                }} onClick={() => !isLoading && updateFormData('agreesToTerms', !formData.agreesToTerms)}>
                                                    <input
                                                        type="checkbox"
                                                        id="agreesToTerms"
                                                        checked={formData.agreesToTerms}
                                                        onChange={(e) => updateFormData('agreesToTerms', e.target.checked)}
                                                        style={{ marginTop: '4px', flexShrink: 0, cursor: 'pointer' }}
                                                        disabled={isLoading}
                                                    />
                                                    <label htmlFor="agreesToTerms" style={{ cursor: 'pointer', flex: 1, margin: 0, fontWeight: 'normal', fontSize: 'var(--text-sm)' }}>
                                                        I agree to the <Link href="/terms" style={{ color: 'var(--color-primary)' }}>Terms of Service</Link> and{' '}
                                                        <Link href="/privacy" style={{ color: 'var(--color-primary)' }}>Privacy Policy</Link>.
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Navigation Buttons */}
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

                                        {currentStep < 4 ? (
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                className="btn btn--primary"
                                                disabled={isLoading}
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
                                                        Creating Account...
                                                    </>
                                                ) : (
                                                    <>
                                                        Complete Registration
                                                        <Check size={18} />
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* Login Link */}
                            <p style={{
                                textAlign: 'center',
                                marginTop: 'var(--space-6)',
                                color: 'var(--color-slate)',
                            }}>
                                Already have an account?{' '}
                                <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
