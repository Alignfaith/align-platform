'use client'

import { useState } from 'react'
import {
    Church, Brain, Dumbbell, Wallet, Sparkles, Heart,
    Send, Image as ImageIcon, Loader2, CheckCircle2
} from 'lucide-react'

import { PILLARS_METADATA, PillarType } from '@/lib/pillars'

const PILLARS = [
    { id: 'SPIRITUAL', name: 'Spiritual', icon: Church, color: '#4F46E5' },
    { id: 'MENTAL', name: 'Mental', icon: Brain, color: '#0891B2' },
    { id: 'PHYSICAL', name: 'Physical', icon: Dumbbell, color: '#059669' },
    { id: 'FINANCIAL', name: 'Financial', icon: Wallet, color: '#CA8A04' },
    { id: 'APPEARANCE', name: 'Appearance', icon: Sparkles, color: '#D946EF' },
    { id: 'INTIMACY', name: 'Intimacy', icon: Heart, color: '#E11D48' },
]

export default function ReflectionEngine() {
    const [selectedPillar, setSelectedPillar] = useState<PillarType>('SPIRITUAL')
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (content.length < 10) {
            setError('Please share a bit more (min 10 characters)')
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const response = await fetch('/api/growth-posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pillar: selectedPillar,
                    content,
                })
            })

            if (!response.ok) throw new Error('Failed to post reflection')

            setSuccess(true)
            setContent('')
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Sparkles size={20} color="var(--color-primary)" />
                Post a Reflection
            </h3>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-6)'
            }}>
                {PILLARS.map((pillar) => (
                    <button
                        key={pillar.id}
                        type="button"
                        onClick={() => setSelectedPillar(pillar.id as PillarType)}
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
                    <textarea
                        className="form-input form-textarea"
                        placeholder={PILLARS_METADATA[selectedPillar].reflectionPrompt}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        disabled={isSubmitting}
                    />
                </div>

                {error && <p style={{ color: '#B91C1C', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>{error}</p>}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button type="button" className="btn btn--glass btn--sm" style={{ padding: 'var(--space-2) var(--space-4)' }}>
                        <ImageIcon size={16} />
                        Add Photo
                    </button>

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
