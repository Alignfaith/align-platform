'use client'

import { useState, useEffect, useRef } from 'react'

interface Props {
  onClose: () => void
}

export default function MatchingInquiryModal({ onClose }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Submission failed. Please try again.')
        return
      }
      setSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#111827',
    background: '#fff',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'inherit',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '6px',
  }

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '520px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#9ca3af', lineHeight: 1 }}
          aria-label="Close"
        >
          ✕
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
            <h2 style={{ fontFamily: 'Georgia, serif', color: '#111827', marginBottom: '12px', fontSize: '24px' }}>
              Inquiry Received
            </h2>
            <p style={{ color: '#6b7280', lineHeight: 1.6, marginBottom: '24px' }}>
              Thank you for reaching out. We&apos;ll review your inquiry and get back to you within 1–2 business days.
            </p>
            <button
              onClick={onClose}
              style={{ padding: '10px 28px', background: '#B91C1C', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', color: '#111827', margin: '0 0 8px', fontSize: '24px' }}>
                Inquire About Matching
              </h2>
              <p style={{ color: '#6b7280', margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
                Tell us a little about yourself and what you&apos;re looking for. We&apos;ll be in touch personally.
              </p>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '20px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Name <span style={{ color: '#B91C1C' }}>*</span></label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="Your full name"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Email <span style={{ color: '#B91C1C' }}>*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Message <span style={{ color: '#B91C1C' }}>*</span>
                  <span style={{ color: '#9ca3af', fontWeight: 400, marginLeft: '6px' }}>({message.length}/1000)</span>
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  minLength={20}
                  maxLength={1000}
                  rows={5}
                  placeholder="Tell us about yourself, what you're looking for in a partner, and any questions you have about our matching service..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '12px',
                  background: submitting ? '#d1d5db' : '#B91C1C',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  marginTop: '4px',
                  letterSpacing: '0.02em',
                }}
              >
                {submitting ? 'Sending…' : 'Send Inquiry'}
              </button>

              <p style={{ color: '#9ca3af', fontSize: '12px', textAlign: 'center', margin: 0 }}>
                We typically respond within 1–2 business days.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
