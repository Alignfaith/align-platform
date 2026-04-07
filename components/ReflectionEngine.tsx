'use client'

import { useRef, useState } from 'react'
import {
    Church, Brain, Dumbbell, Wallet, Sparkles, Heart,
    Send, Image as ImageIcon, Loader2, CheckCircle2, X
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

async function resizeImageToJpeg(file: File, maxPx = 800): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new window.Image()
        const objectUrl = URL.createObjectURL(file)
        img.onload = () => {
            URL.revokeObjectURL(objectUrl)
            let { width, height } = img
            if (width > maxPx || height > maxPx) {
                if (width >= height) {
                    height = Math.round((height * maxPx) / width)
                    width = maxPx
                } else {
                    width = Math.round((width * maxPx) / height)
                    height = maxPx
                }
            }
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')
            if (!ctx) { reject(new Error('Canvas not supported')); return }
            ctx.drawImage(img, 0, 0, width, height)
            canvas.toBlob(
                (blob) => {
                    if (blob) resolve(blob)
                    else reject(new Error('Failed to convert image'))
                },
                'image/jpeg',
                0.82
            )
        }
        img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Failed to load image')) }
        img.src = objectUrl
    })
}

export default function ReflectionEngine() {
    const [selectedPillar, setSelectedPillar] = useState<PillarType>('SPIRITUAL')
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [uploadingPhoto, setUploadingPhoto] = useState(false)
    const [photoError, setPhotoError] = useState<string | null>(null)

    const photoInputRef = useRef<HTMLInputElement>(null)

    const currentQ = PILLAR_QUESTIONS[selectedPillar]

    const handlePillarChange = (pillarId: PillarType) => {
        setSelectedPillar(pillarId)
        setContent('')
        setError(null)
    }

    const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        e.target.value = ''

        setPhotoError(null)
        setUploadingPhoto(true)

        try {
            const blob = await resizeImageToJpeg(file)
            setImagePreview(URL.createObjectURL(blob))
            const fd = new FormData()
            fd.append('photo', blob, 'photo.jpg')
            const res = await fetch('/api/growth-posts/photo', { method: 'POST', body: fd })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Upload failed')
            setImageUrl(data.url)
        } catch (err) {
            setPhotoError(err instanceof Error ? err.message : 'Upload failed')
            setImagePreview(null)
        } finally {
            setUploadingPhoto(false)
        }
    }

    const handleRemovePhoto = () => {
        setImageUrl(null)
        setImagePreview(null)
        setPhotoError(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content) {
            setError('Please select an option before posting')
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const response = await fetch('/api/growth-posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pillar: selectedPillar, content, imageUrl: imageUrl || '' })
            })

            if (!response.ok) throw new Error('Failed to post reflection')

            setSuccess(true)
            setContent('')
            setImageUrl(null)
            setImagePreview(null)
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

                {error && <p style={{ color: '#B91C1C', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>{error}</p>}

                {/* Photo preview */}
                {imagePreview && (
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: 'var(--space-4)' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imagePreview}
                            alt="Proof of growth"
                            style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: 'var(--radius-md)', objectFit: 'cover', display: 'block' }}
                        />
                        <button
                            type="button"
                            onClick={handleRemovePhoto}
                            style={{
                                position: 'absolute', top: '-8px', right: '-8px',
                                background: '#B91C1C', color: 'white', border: 'none',
                                borderRadius: '50%', width: '20px', height: '20px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', padding: 0,
                            }}
                        >
                            <X size={12} />
                        </button>
                    </div>
                )}

                {photoError && <p style={{ color: '#B91C1C', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>{photoError}</p>}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handlePhotoSelect}
                        />
                        <button
                            type="button"
                            className="btn btn--glass btn--sm"
                            style={{ padding: 'var(--space-2) var(--space-4)' }}
                            onClick={() => photoInputRef.current?.click()}
                            disabled={uploadingPhoto}
                        >
                            {uploadingPhoto ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                            {uploadingPhoto ? 'Uploading…' : imageUrl ? 'Change Photo' : 'Add Proof of Growth Photo'}
                        </button>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-1)', marginBottom: 0 }}>
                            Share a photo that shows your growth in action this week.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className={`btn ${success ? 'btn--success' : 'btn--primary'}`}
                        disabled={isSubmitting || !content}
                        style={{ minWidth: '140px' }}
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
