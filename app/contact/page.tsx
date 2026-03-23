'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Mail, MessageSquare, Clock, Send, CheckCircle } from 'lucide-react'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    })
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // In production, this would send to an API
        setSubmitted(true)
    }

    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                {/* Hero */}
                <section className="section section--primary">
                    <div className="container text-center">
                        <h1 style={{ marginBottom: 'var(--space-4)' }}>Contact Us</h1>
                        <p style={{ fontSize: 'var(--text-xl)', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
                            Have questions or need support? We're here to help you on your journey.
                        </p>
                    </div>
                </section>

                {/* Contact Form */}
                <section className="section section--cream">
                    <div className="container">
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 'var(--space-12)',
                            maxWidth: '1000px',
                            margin: '0 auto',
                        }}>
                            {/* Info */}
                            <div>
                                <h2 style={{ marginBottom: 'var(--space-6)' }}>Get in Touch</h2>
                                <p style={{ color: 'var(--color-slate)', marginBottom: 'var(--space-8)' }}>
                                    Whether you have questions about membership, need technical support, or want
                                    to learn more about the Relationship Fitness framework, we're here for you.
                                </p>

                                <div style={{ marginBottom: 'var(--space-6)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: 'var(--radius-full)',
                                            backgroundColor: 'var(--color-blush)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <Mail size={24} color="var(--color-primary)" />
                                        </div>
                                        <div>
                                            <h4 style={{ marginBottom: 0 }}>Email Support</h4>
                                            <p style={{ color: 'var(--color-slate)', marginBottom: 0, fontSize: 'var(--text-sm)' }}>
                                                support@rootedplatform.com
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: 'var(--radius-full)',
                                            backgroundColor: 'var(--color-blush)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <MessageSquare size={24} color="var(--color-primary)" />
                                        </div>
                                        <div>
                                            <h4 style={{ marginBottom: 0 }}>General Inquiries</h4>
                                            <p style={{ color: 'var(--color-slate)', marginBottom: 0, fontSize: 'var(--text-sm)' }}>
                                                hello@rootedplatform.com
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: 'var(--radius-full)',
                                            backgroundColor: 'var(--color-blush)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <Clock size={24} color="var(--color-primary)" />
                                        </div>
                                        <div>
                                            <h4 style={{ marginBottom: 0 }}>Response Time</h4>
                                            <p style={{ color: 'var(--color-slate)', marginBottom: 0, fontSize: 'var(--text-sm)' }}>
                                                Within 24-48 hours
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="card">
                                {submitted ? (
                                    <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                                        <CheckCircle size={64} color="var(--color-success)" style={{ marginBottom: 'var(--space-4)' }} />
                                        <h3 style={{ marginBottom: 'var(--space-2)' }}>Message Sent!</h3>
                                        <p style={{ color: 'var(--color-slate)' }}>
                                            Thank you for reaching out. We'll get back to you within 24-48 hours.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label className="form-label">Your Name</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Email Address</label>
                                            <input
                                                type="email"
                                                className="form-input"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Subject</label>
                                            <select
                                                className="form-input"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                required
                                            >
                                                <option value="">Select a topic...</option>
                                                <option value="general">General Inquiry</option>
                                                <option value="membership">Membership Questions</option>
                                                <option value="technical">Technical Support</option>
                                                <option value="book">About the Book</option>
                                                <option value="feedback">Feedback</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Message</label>
                                            <textarea
                                                className="form-input form-textarea"
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                placeholder="How can we help you?"
                                                required
                                            />
                                        </div>

                                        <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>
                                            Send Message
                                            <Send size={18} />
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
