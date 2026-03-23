'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ArrowLeft, ArrowRight, Check, BookOpen, Users, FileText, Shield, Loader2 } from 'lucide-react'

const steps = [
    { id: 1, name: 'Account', icon: Users },
    { id: 2, name: 'Reflections', icon: FileText },
    { id: 3, name: 'Framework', icon: BookOpen },
    { id: 4, name: 'Agreement', icon: Shield },
]

const reflectionQuestions = [
    {
        id: 1,
        question: 'What does preparation before pursuit mean to you in relationships?',
        placeholder: 'Share your thoughts on why preparation matters before entering a relationship...',
    },
    {
        id: 2,
        question: 'Which of the Six Pillars do you most need to grow in right now, and why?',
        placeholder: 'Consider: Spiritual, Mental, Physical, Financial, Appearance, or Intimacy Fitness...',
    },
    {
        id: 3,
        question: 'How does your faith, or willingness to grow in Christian faith, influence how you approach relationships?',
        placeholder: 'Share how your faith journey shapes your perspective on relationships...',
    },
]

export default function RegisterPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        inviteCode: '',
        reflections: ['', '', ''],
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
                    if (formData.reflections[i].length < 50) {
                        setError(`Reflection ${i + 1} must be at least 50 characters`)
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
                    reflections: formData.reflections,
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
                                                <input
                                                    type="password"
                                                    className="form-input"
                                                    value={formData.password}
                                                    onChange={(e) => updateFormData('password', e.target.value)}
                                                    required
                                                    minLength={8}
                                                    disabled={isLoading}
                                                />
                                                <p className="form-hint">At least 8 characters with uppercase, lowercase, and number</p>
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    className="form-input"
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                                                    required
                                                    disabled={isLoading}
                                                />
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
                                                These reflections help us understand your readiness and commitment.
                                            </p>

                                            {reflectionQuestions.map((q, index) => (
                                                <div key={q.id} className="form-group">
                                                    <label className="form-label">
                                                        {index + 1}. {q.question}
                                                    </label>
                                                    <textarea
                                                        className="form-input form-textarea"
                                                        placeholder={q.placeholder}
                                                        value={formData.reflections[index]}
                                                        onChange={(e) => updateReflection(index, e.target.value)}
                                                        required
                                                        minLength={50}
                                                        disabled={isLoading}
                                                    />
                                                    <p className="form-hint">
                                                        {formData.reflections[index].length}/50 characters minimum
                                                    </p>
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

                                            <div className="form-group">
                                                <label style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: 'var(--space-3)',
                                                    cursor: 'pointer',
                                                    padding: 'var(--space-3)',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: '2px solid var(--color-rose)',
                                                    backgroundColor: formData.hasReadBook ? 'var(--color-blush)' : 'transparent',
                                                }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.hasReadBook}
                                                        onChange={(e) => updateFormData('hasReadBook', e.target.checked)}
                                                        style={{ marginTop: '4px' }}
                                                        disabled={isLoading}
                                                    />
                                                    <span>
                                                        I have read or am committed to reading the Relationship Fitness book to understand the framework.
                                                    </span>
                                                </label>
                                            </div>

                                            <div className="form-group">
                                                <label style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: 'var(--space-3)',
                                                    cursor: 'pointer',
                                                    padding: 'var(--space-3)',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: '2px solid var(--color-rose)',
                                                    backgroundColor: formData.understandsFramework ? 'var(--color-blush)' : 'transparent',
                                                }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.understandsFramework}
                                                        onChange={(e) => updateFormData('understandsFramework', e.target.checked)}
                                                        style={{ marginTop: '4px' }}
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                    <span>
                                                        I understand that Align is built on the Six Pillars framework and that preparation
                                                        comes before connection.
                                                    </span>
                                                </label>
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
                                                    <li style={{ marginBottom: 'var(--space-2)' }}>Men and women see the exact same experience</li>
                                                    <li style={{ marginBottom: 'var(--space-2)' }}>Photos are not shown initially—they unlock after mutual interest</li>
                                                    <li style={{ marginBottom: 'var(--space-2)' }}>No bikini, swimsuit, shirtless, or suggestive photos</li>
                                                    <li style={{ marginBottom: 'var(--space-2)' }}>Participation is a privilege, not a right</li>
                                                    <li>Violation of guidelines results in removal without refund</li>
                                                </ul>
                                            </div>

                                            <div className="form-group">
                                                <label style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: 'var(--space-3)',
                                                    cursor: 'pointer',
                                                    padding: 'var(--space-3)',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: '2px solid var(--color-rose)',
                                                    backgroundColor: formData.agreesToGuidelines ? 'var(--color-blush)' : 'transparent',
                                                }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.agreesToGuidelines}
                                                        onChange={(e) => updateFormData('agreesToGuidelines', e.target.checked)}
                                                        style={{ marginTop: '4px' }}
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                    <span>
                                                        I affirm my commitment to Christian values and agree to follow the community guidelines.
                                                    </span>
                                                </label>
                                            </div>

                                            <div className="form-group">
                                                <label style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: 'var(--space-3)',
                                                    cursor: 'pointer',
                                                    padding: 'var(--space-3)',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: '2px solid var(--color-rose)',
                                                    backgroundColor: formData.agreesToTerms ? 'var(--color-blush)' : 'transparent',
                                                }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.agreesToTerms}
                                                        onChange={(e) => updateFormData('agreesToTerms', e.target.checked)}
                                                        style={{ marginTop: '4px' }}
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                    <span>
                                                        I agree to the <Link href="/terms" style={{ color: 'var(--color-primary)' }}>Terms of Service</Link> and{' '}
                                                        <Link href="/privacy" style={{ color: 'var(--color-primary)' }}>Privacy Policy</Link>.
                                                    </span>
                                                </label>
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
