'use client'

import { useState, useRef } from 'react'
import {
    Church, Brain, Dumbbell, Wallet, Sparkles, Heart,
    Send, Loader2, CheckCircle2, ImageIcon, X,
} from 'lucide-react'

import { PillarType } from '@/lib/pillars'

const PILLARS = [
    { id: 'SPIRITUAL',  name: 'Spiritual',  icon: Church,    color: '#4F46E5' },
    { id: 'MENTAL',     name: 'Mental',     icon: Brain,     color: '#0891B2' },
    { id: 'PHYSICAL',   name: 'Physical',   icon: Dumbbell,  color: '#059669' },
    { id: 'FINANCIAL',  name: 'Financial',  icon: Wallet,    color: '#CA8A04' },
    { id: 'APPEARANCE', name: 'Appearance', icon: Sparkles,  color: '#D946EF' },
    { id: 'INTIMACY',   name: 'Intimacy',   icon: Heart,     color: '#c0182a' },
]

const PILLAR_QUESTIONS: Record<string, { question: string; options: string[] }> = {
    SPIRITUAL: {
        question: 'My spiritual disciplines this week were best described as:',
        options: [
            'Consistent. I prayed, read, and worshipped daily',
            'Good. I was consistent most days',
            'Okay. I engaged a few times this week',
            'Inconsistent. I struggled to stay disciplined',
            'Absent. This is an area I need to work on',
        ],
    },
    MENTAL: {
        question: 'My self-awareness and emotional health this week was:',
        options: [
            'Strong. I stayed grounded and processed well',
            'Good. I handled challenges with mostly clarity',
            'Average. I had some moments of struggle',
            'Difficult. I reacted more than I wanted to',
            'Hard. This was a tough week emotionally',
        ],
    },
    PHYSICAL: {
        question: 'My physical routine this week was:',
        options: [
            'On point. I followed my routine consistently',
            'Good. I was active most days',
            'Average. I moved some but not intentionally',
            'Off. I skipped more than I should have',
            'Absent. I did not prioritize my body this week',
        ],
    },
    FINANCIAL: {
        question: 'My financial discipline this week was:',
        options: [
            'Strong. I stuck to my plan and budget',
            'Good. I was mostly disciplined',
            'Average. I had some wins and some slips',
            'Weak. I made choices I regret',
            'Avoided. I did not focus on finances this week',
        ],
    },
    APPEARANCE: {
        question: 'How I showed up in the world this week:',
        options: [
            'Intentional. I was polished and put together daily',
            'Good. I showed up well most days',
            'Average. Some days were better than others',
            'Inconsistent. I let it slide more than usual',
            'Not a focus. I did not prioritize this area',
        ],
    },
    INTIMACY: {
        question: 'My boundaries and emotional intentions this week were:',
        options: [
            'Clear and consistent. I stayed aligned with my values',
            'Good. I was mostly intentional',
            'Average. I had some moments I could improve',
            'Inconsistent. I struggled in this area',
            'Off track. This is an area I need to reset in',
        ],
    },
}


export default function ReflectionEngine() {
    const [selectedPillar, setSelectedPillar] = useState<PillarType>('SPIRITUAL')
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Photo state
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const [photoUrl, setPhotoUrl] = useState<string | null>(null)
    const [uploadingPhoto, setUploadingPhoto] = useState(false)
    const [photoError, setPhotoError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const currentQ = PILLAR_QUESTIONS[selectedPillar]

    const handlePillarChange = (pillarId: PillarType) => {
        setSelectedPillar(pillarId)
        setContent('')
        setError(null)
    }

    const clearPhoto = () => {
        if (photoPreview) URL.revokeObjectURL(photoPreview)
        setPhotoPreview(null)
        setPhotoUrl(null)
        setPhotoError(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Client-side size check (server enforces authoritatively)
        if (file.size > 10 * 1024 * 1024) {
            setPhotoError('Photo must be under 10 MB')
            if (fileInputRef.current) fileInputRef.current.value = ''
            return
        }

        // Revoke previous preview before creating a new one
        if (photoPreview) URL.revokeObjectURL(photoPreview)
        setPhotoPreview(URL.createObjectURL(file))
        setPhotoUrl(null)
        setPhotoError(null)
        setUploadingPhoto(true)

        // Reset input so the same file can be re-selected after a clear
        if (fileInputRef.current) fileInputRef.current.value = ''

        try {
            const fd = new FormData()
            fd.append('photo', file)
            const res = await fetch('/api/growth-posts/photo', { method: 'POST', body: fd })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Upload failed')
            setPhotoUrl(data.url)
        } catch (e) {
            setPhotoError(e instanceof Error ? e.message : 'Photo upload failed. Please try again.')
            if (photoPreview) URL.revokeObjectURL(photoPreview)
            setPhotoPreview(null)
        } finally {
            setUploadingPhoto(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content) {
            setError('Please select an option before posting')
            return
        }
        // Block submit while photo is still uploading
        if (uploadingPhoto) return

        setIsSubmitting(true)
        setError(null)

        try {
            const response = await fetch('/api/growth-posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pillar: selectedPillar,
                    content,
                    ...(photoUrl ? { imageUrl: photoUrl } : {}),
                }),
            })

            if (!response.ok) throw new Error('Failed to post reflection')

            setSuccess(true)
            setContent('')
            clearPhoto()
            setTimeout(() => setSuccess(false), 3000)
        } catch {
            setError('Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Sparkles size={20} color="var(--color-primary)" />
                Weekly Reflections
            </h3>

            {/* Pillar selector */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-5)',
            }}>
                {PILLARS.map((pillar) => (
                    <button
                        key={pillar.id}
                        type="button"
                        onClick={() => handlePillarChange(pillar.id as PillarType)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 'var(--space-1)',
                            padding: 'var(--space-3)',
                            borderRadius: 'var(--radius-md)',
                            border: `2px solid ${selectedPillar === pillar.id ? pillar.color : 'var(--color-rose-light)'}`,
                            backgroundColor: selectedPillar === pillar.id ? `${pillar.color}10` : 'transparent',
                            color: selectedPillar === pillar.id ? pillar.color : 'var(--color-slate)',
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 600,
                        }}
                    >
                        <pillar.icon size={18} />
                        {pillar.name}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label style={{
                        display: 'block',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--space-2)',
                    }}>
                        {currentQ.question}
                    </label>
                    <select
                        className="form-input"
                        value={content}
                        onChange={(e) => { setContent(e.target.value); setError(null) }}
                        disabled={isSubmitting}
                    >
                        <option value="">Select the option that best describes this week…</option>
                        {currentQ.options.map((option, i) => (
                            <option key={i} value={option}>
                                {i + 1}. {option}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Photo attachment */}
                <div style={{ marginBottom: 'var(--space-4)' }}>
                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        disabled={isSubmitting || uploadingPhoto}
                    />

                    {/* "Add photo" trigger — shown when no photo is selected */}
                    {!photoPreview && !uploadingPhoto && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isSubmitting}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: 'var(--text-sm)',
                                color: 'var(--color-text-secondary)',
                                background: 'none',
                                border: '1px dashed var(--color-border-subtle)',
                                borderRadius: 'var(--radius-md)',
                                padding: '8px 14px',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                opacity: isSubmitting ? 0.5 : 1,
                            }}
                        >
                            <ImageIcon size={15} /> Add photo
                        </button>
                    )}

                    {/* Upload spinner */}
                    {uploadingPhoto && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', padding: '8px 0' }}>
                            <Loader2 size={15} className="animate-spin" /> Uploading photo…
                        </div>
                    )}

                    {/* Preview */}
                    {photoPreview && !uploadingPhoto && (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <img
                                src={photoPreview}
                                alt="Selected photo"
                                style={{
                                    display: 'block',
                                    maxWidth: '100%',
                                    maxHeight: '220px',
                                    borderRadius: 'var(--radius-md)',
                                    objectFit: 'cover',
                                    border: `1px solid ${photoUrl ? 'var(--color-border-subtle)' : '#F87171'}`,
                                }}
                            />
                            {/* Remove button */}
                            <button
                                type="button"
                                onClick={clearPhoto}
                                disabled={isSubmitting}
                                style={{
                                    position: 'absolute',
                                    top: '6px',
                                    right: '6px',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: 'rgba(0,0,0,0.55)',
                                    color: '#fff',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    padding: 0,
                                }}
                            >
                                <X size={13} />
                            </button>
                            {/* Upload-incomplete indicator */}
                            {!photoUrl && (
                                <p style={{ fontSize: '11px', color: '#B91C1C', marginTop: '4px', marginBottom: 0 }}>
                                    Upload did not complete — remove and try again
                                </p>
                            )}
                        </div>
                    )}

                    {/* Photo-specific error */}
                    {photoError && (
                        <p style={{ color: '#B91C1C', fontSize: 'var(--text-sm)', marginTop: '6px', marginBottom: 0 }}>
                            {photoError}
                        </p>
                    )}
                </div>

                {error && <p style={{ color: '#B91C1C', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>{error}</p>}

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        type="submit"
                        className={`btn ${success ? 'btn--success' : 'btn--primary'}`}
                        disabled={isSubmitting || uploadingPhoto || !content}
                        style={{ minWidth: '140px', opacity: (isSubmitting || uploadingPhoto || !content) ? 0.55 : 1 }}
                    >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> :
                            success ? <><CheckCircle2 size={18} /> Posted</> :
                                <><Send size={18} /> Post Reflection</>}
                    </button>
                </div>
            </form>
        </div>
    )
}
