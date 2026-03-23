'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
    User, MapPin, Camera, Save,
    ArrowLeft, Loader2, CheckCircle2,
    Shield, Briefcase, GraduationCap, Heart
} from 'lucide-react'
import Link from 'next/link'

export default function ProfileEditPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [isSaving, setIsSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        displayName: '',
        bio: '',
        city: '',
        state: '',
        profession: '',
        education: '',
        relationshipGoal: 'MARRIAGE',
    })

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
        // In a real app, fetch profile data here
        if (session) {
            setFormData(prev => ({
                ...prev,
                displayName: session.user.name || '',
            }))
        }
    }, [status, router, session])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setError(null)

        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1500))
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            setError('Failed to update profile. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    if (status === 'loading') {
        return <div style={{ padding: 'var(--space-20) 0', textAlign: 'center' }}>Loading your identity...</div>
    }

    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                <section className="section section--cream" style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
                    <div className="container">
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            {/* Header */}
                            <div style={{ marginBottom: 'var(--space-8)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                <Link href="/dashboard" className="btn btn--glass btn--sm" style={{ padding: 'var(--space-2)' }}>
                                    <ArrowLeft size={20} />
                                </Link>
                                <div>
                                    <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-primary)', marginBottom: 0 }}>
                                        Edit Your Profile
                                    </h1>
                                    <p style={{ color: 'var(--color-slate)', marginBottom: 0 }}>
                                        Let your community see your intentionality.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: 'var(--space-8)' }}>
                                {/* Left Side: Media & Quick Stats */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                                    <div className="card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
                                        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto var(--space-4)' }}>
                                            <div style={{
                                                width: '100%', height: '100%', borderRadius: '50%',
                                                backgroundColor: 'var(--color-blush)', border: '4px solid white',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                overflow: 'hidden', boxShadow: 'var(--shadow-md)'
                                            }}>
                                                <User size={64} color="var(--color-primary)" />
                                            </div>
                                            <button type="button" style={{
                                                position: 'absolute', bottom: 0, right: 0,
                                                width: '36px', height: '36px', borderRadius: '50%',
                                                backgroundColor: 'var(--color-primary)', color: 'white',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: '2px solid white', cursor: 'pointer'
                                            }}>
                                                <Camera size={18} />
                                            </button>
                                        </div>
                                        <h4 style={{ marginBottom: 'var(--space-1)' }}>Identity Image</h4>
                                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-slate)' }}>
                                            Must follow our dignity standards. No swimsuits or suggestive content.
                                        </p>
                                    </div>

                                    <div className="card" style={{ padding: 'var(--space-6)' }}>
                                        <h4 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <Shield size={18} color="var(--color-primary)" />
                                            Verified Status
                                        </h4>
                                        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-cream)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}>
                                            <p style={{ marginBottom: 'var(--space-2)', fontWeight: 600 }}>Human Proof</p>
                                            <p style={{ color: 'var(--color-slate)', marginBottom: 0 }}>
                                                You have not yet completed human verification. Tier 1 required.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Forms */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                                    <div className="card" style={{ padding: 'var(--space-6)' }}>
                                        <h3 style={{ marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-rose-light)', paddingBottom: 'var(--space-2)' }}>
                                            Basic Information
                                        </h3>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                            <div className="form-group">
                                                <label className="form-label">Display Name</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={formData.displayName}
                                                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                                    placeholder="e.g. John Nashville"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Relationship Goal</label>
                                                <select
                                                    className="form-input"
                                                    value={formData.relationshipGoal}
                                                    onChange={(e) => setFormData({ ...formData, relationshipGoal: e.target.value })}
                                                >
                                                    <option value="MARRIAGE">Marriage Minded</option>
                                                    <option value="SERIOUS_DATING">Intentional Dating</option>
                                                    <option value="DISCERNING">Focused Discernment</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                                            <div className="form-group">
                                                <label className="form-label">
                                                    <MapPin size={14} style={{ marginRight: '4px' }} /> City
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={formData.city}
                                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">State</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={formData.state}
                                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card" style={{ padding: 'var(--space-6)' }}>
                                        <h3 style={{ marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-rose-light)', paddingBottom: 'var(--space-2)' }}>
                                            Professional & Academic
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                            <div className="form-group">
                                                <label className="form-label">
                                                    <Briefcase size={14} style={{ marginRight: '4px' }} /> Profession
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={formData.profession}
                                                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                                                    placeholder="What do you do?"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">
                                                    <GraduationCap size={14} style={{ marginRight: '4px' }} /> Education
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={formData.education}
                                                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                                    placeholder="Highest level reached"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card" style={{ padding: 'var(--space-6)' }}>
                                        <h3 style={{ marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-rose-light)', paddingBottom: 'var(--space-2)' }}>
                                            About Your Journey
                                        </h3>
                                        <div className="form-group">
                                            <label className="form-label">Bio (The "Why" behind your growth)</label>
                                            <textarea
                                                className="form-input form-textarea"
                                                style={{ minHeight: '120px' }}
                                                value={formData.bio}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                placeholder="Share how God is working in your life and what you are preparing for..."
                                            ></textarea>
                                        </div>
                                    </div>

                                    {error && <p style={{ color: '#B91C1C', textAlign: 'center' }}>{error}</p>}

                                    <button
                                        type="submit"
                                        className={`btn ${success ? 'btn--success' : 'btn--primary'} btn--lg`}
                                        disabled={isSaving}
                                        style={{ width: '100%' }}
                                    >
                                        {isSaving ? <Loader2 size={24} className="animate-spin" /> :
                                            success ? <><CheckCircle2 size={24} /> Profile Saved</> :
                                                <><Save size={24} /> Save Profile Changes</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
