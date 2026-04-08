'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface FeedbackEntry {
    id: string
    name: string | null
    email: string | null
    subject: string
    message: string
    category: string | null
    isRead: boolean
    createdAt: string
}

export default function FeedbackLogPage() {
    const [feedback, setFeedback] = useState<FeedbackEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'unread'>('all')

    useEffect(() => {
        fetchFeedback()
    }, [filter])

    const fetchFeedback = async () => {
        setLoading(true)
        try {
            const url = filter === 'unread' ? '/api/feedback?unread=true' : '/api/feedback'
            const res = await fetch(url)
            if (res.ok) {
                const data = await res.json()
                setFeedback(data.feedback)
            }
        } catch {
            // Silent fail
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        })
    }

    const getCategoryColor = (category: string | null) => {
        switch (category) {
            case 'bug': return '#ef4444'
            case 'feature': return '#3b82f6'
            case 'design': return '#8b5cf6'
            default: return '#6b7280'
        }
    }

    return (
        <div className="feedback-page">
            <div className="feedback-container" style={{ maxWidth: '800px' }}>
                <div className="feedback-header">
                    <h1>Feedback Log</h1>
                    <p>All submitted feedback</p>
                </div>

                <div className="feedback-tabs">
                    <button
                        className={`feedback-tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({feedback.length})
                    </button>
                    <button
                        className={`feedback-tab ${filter === 'unread' ? 'active' : ''}`}
                        onClick={() => setFilter('unread')}
                    >
                        Unread
                    </button>
                </div>

                <div className="feedback-history">
                    {loading ? (
                        <p className="feedback-history-loading">Loading...</p>
                    ) : feedback.length === 0 ? (
                        <p className="feedback-history-empty">No feedback yet.</p>
                    ) : (
                        <div className="feedback-history-list">
                            {feedback.map((entry) => (
                                <div key={entry.id} className="feedback-history-item">
                                    <div className="feedback-history-header">
                                        <span
                                            className="feedback-history-category"
                                            style={{ backgroundColor: getCategoryColor(entry.category) }}
                                        >
                                            {entry.category || 'general'}
                                        </span>
                                        <span className="feedback-history-date">
                                            {formatDate(entry.createdAt)}
                                        </span>
                                    </div>
                                    <h3 className="feedback-history-subject">{entry.subject}</h3>
                                    <p className="feedback-history-message">{entry.message}</p>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '0.5rem' }}>
                                        From: {entry.name || 'Anonymous'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="feedback-footer">
                    <Link href="/">← Back to ALIGN</Link>
                </div>
            </div>
        </div>
    )
}
