'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Category = 'bug' | 'feature' | 'design' | 'general'
type Tab = 'form' | 'history'

interface FeedbackEntry {
    id: string
    name: string | null
    subject: string
    message: string
    category: string | null
    createdAt: string
}

export default function FeedbackPage() {
    const [activeTab, setActiveTab] = useState<Tab>('form')
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        category: 'general' as Category,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    // History state
    const [history, setHistory] = useState<FeedbackEntry[]>([])
    const [historyLoading, setHistoryLoading] = useState(false)

    const fetchHistory = async () => {
        setHistoryLoading(true)
        try {
            const res = await fetch('/api/feedback')
            if (res.ok) {
                const data = await res.json()
                setHistory(data.feedback)
            }
        } catch {
            // Silent fail for history
        } finally {
            setHistoryLoading(false)
        }
    }

    useEffect(() => {
        if (activeTab === 'history') {
            fetchHistory()
        }
    }, [activeTab])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, name: 'Thomas' }),
            })

            if (!res.ok) {
                throw new Error('Failed to send message')
            }

            setSubmitted(true)
        } catch {
            setError('Failed to send message. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const sendAnother = () => {
        setSubmitted(false)
        setFormData({ subject: '', message: '', category: 'general' })
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
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
            <div className="feedback-container">
                <div className="feedback-header">
                    <h1>Hey Thomas!</h1>
                    <p>Drop me a message about Align - bugs, ideas, whatever you&apos;re thinking.</p>
                </div>

                <div className="feedback-tabs">
                    <button
                        className={`feedback-tab ${activeTab === 'form' ? 'active' : ''}`}
                        onClick={() => setActiveTab('form')}
                    >
                        New Feedback
                    </button>
                    <button
                        className={`feedback-tab ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        Previous
                    </button>
                </div>

                {activeTab === 'form' && (
                    <>
                        {submitted ? (
                            <div className="feedback-success">
                                <h2>Message Sent!</h2>
                                <p>Thanks Thomas! I&apos;ll check this out soon.</p>
                                <button onClick={sendAnother} className="btn btn--primary">
                                    Send Another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="feedback-form">
                                <div className="form-group">
                                    <label htmlFor="category">Type</label>
                                    <select
                                        id="category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                                    >
                                        <option value="general">General</option>
                                        <option value="bug">Bug</option>
                                        <option value="feature">Feature Idea</option>
                                        <option value="design">Design</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="What's this about?"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Tell me more..."
                                    />
                                </div>

                                {error && <div className="form-error">{error}</div>}

                                <button
                                    type="submit"
                                    className="btn btn--primary btn--lg"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </>
                )}

                {activeTab === 'history' && (
                    <div className="feedback-history">
                        {historyLoading ? (
                            <p className="feedback-history-loading">Loading...</p>
                        ) : history.length === 0 ? (
                            <p className="feedback-history-empty">No previous feedback yet.</p>
                        ) : (
                            <div className="feedback-history-list">
                                {history.map((entry) => (
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
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="feedback-footer">
                    <Link href="/">← Back to Align</Link>
                </div>
            </div>
        </div>
    )
}
