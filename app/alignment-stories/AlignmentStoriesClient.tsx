'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Story {
  id: string
  displayName: string
  photoUrl: string | null
  story: string
  reviewedAt: string | null
}

function SubmitForm({ onSuccess }: { onSuccess: () => void }) {
  const [displayName, setDisplayName] = useState('')
  const [story, setStory] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(file)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('displayName', displayName)
      fd.append('story', story)
      if (photo) fd.append('photo', photo)

      const res = await fetch('/api/alignment-stories', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Submission failed')
        return
      }
      setSuccess(true)
      onSuccess()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-8)', background: 'rgba(185,28,28,0.06)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(185,28,28,0.2)' }}>
        <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>✓</div>
        <h3 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-lg)', fontFamily: 'var(--font-heading)' }}>Story Submitted</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Thank you for sharing. Your story will appear here once reviewed.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-error)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}>
          {error}
        </div>
      )}

      <div>
        <label style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>
          Display Name <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 'normal' }}>(e.g. "Sarah M." or first name only)</span>
        </label>
        <input
          type="text"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          required
          maxLength={60}
          placeholder="First name or initials"
          style={{ width: '100%', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', boxSizing: 'border-box' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>
          Your Story <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 'normal' }}>({story.length}/2000)</span>
        </label>
        <textarea
          value={story}
          onChange={e => setStory(e.target.value)}
          required
          minLength={50}
          maxLength={2000}
          rows={6}
          placeholder="Tell us how ALIGN helped you on your journey..."
          style={{ width: '100%', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>
          Photo <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 'normal' }}>(optional, max 10 MB)</span>
        </label>
        {preview ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img src={preview} alt="Preview" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }} />
            <button type="button" onClick={() => { setPhoto(null); setPreview(null); if (fileRef.current) fileRef.current.value = '' }}
              style={{ position: 'absolute', top: '-8px', right: '-8px', width: '24px', height: '24px', borderRadius: '50%', border: 'none', background: 'var(--color-error)', color: '#fff', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ✕
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()}
            style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--color-bg-elevated)', border: '1px dashed var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
            + Add photo
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
      </div>

      <button
        type="submit"
        disabled={submitting}
        style={{ padding: 'var(--space-3) var(--space-6)', background: submitting ? 'rgba(185,28,28,0.5)' : 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', cursor: submitting ? 'not-allowed' : 'pointer', alignSelf: 'flex-start' }}
      >
        {submitting ? 'Submitting…' : 'Submit Story'}
      </button>
    </form>
  )
}

export default function AlignmentStoriesClient() {
  const { data: session, status } = useSession()
  const [stories, setStories] = useState<Story[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const fetchStories = async (p = 1) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/alignment-stories?page=${p}`)
      const data = await res.json()
      setStories(data.stories ?? [])
      setTotal(data.total ?? 0)
      setTotalPages(data.totalPages ?? 1)
    } catch {
      setStories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStories(page)
  }, [page])

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border-subtle)', padding: 'var(--space-16) var(--space-8) var(--space-12)', textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: 'var(--space-3)', fontWeight: 'var(--font-semibold)' }}>Real People. Real Journeys.</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--color-text-primary)', margin: '0 0 var(--space-4)', lineHeight: 1.15 }}>
            Alignment Stories
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', maxWidth: '560px', margin: '0 auto var(--space-6)', lineHeight: 1.7 }}>
            Members share how faith-centered alignment transformed their relationships and lives.
          </p>

          {status === 'authenticated' ? (
            <button
              onClick={() => setShowForm(f => !f)}
              style={{ padding: 'var(--space-3) var(--space-6)', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', cursor: 'pointer' }}
            >
              {showForm ? 'Hide Form' : 'Share Your Story'}
            </button>
          ) : status === 'unauthenticated' ? (
            <a href="/login?redirect=/alignment-stories" style={{ display: 'inline-block', padding: 'var(--space-3) var(--space-6)', background: 'var(--color-primary)', color: '#fff', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', textDecoration: 'none' }}>
              Log in to Share Your Story
            </a>
          ) : null}
        </section>

        <div style={{ maxWidth: '960px', margin: '0 auto', padding: 'var(--space-10) var(--space-6)' }}>
          {/* Submission form */}
          {showForm && session && (
            <section style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', marginBottom: 'var(--space-10)' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', marginTop: 0 }}>Share Your Story</h2>
              <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-5)', marginTop: 0 }}>Stories are reviewed before publishing. Keep it authentic and encouraging.</p>
              <SubmitForm onSuccess={() => { setShowForm(false); fetchStories(1) }} />
            </section>
          )}

          {/* Stories grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--color-text-tertiary)' }}>Loading stories…</div>
          ) : stories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--color-text-tertiary)' }}>
              <p style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>No stories yet</p>
              <p style={{ fontSize: 'var(--text-sm)' }}>Be the first to share your alignment journey.</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
                {stories.map(s => (
                  <article key={s.id} style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {s.photoUrl && (
                      <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                        <img src={s.photoUrl} alt={s.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ padding: 'var(--space-5)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)', margin: '0 0 var(--space-3)' }}>
                        {s.displayName}
                      </h3>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7, margin: 0, flex: 1 }}>
                        {expanded === s.id ? s.story : s.story.length > 200 ? s.story.slice(0, 200) + '…' : s.story}
                      </p>
                      {s.story.length > 200 && (
                        <button
                          onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                          style={{ marginTop: 'var(--space-3)', background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 'var(--text-xs)', cursor: 'pointer', padding: 0, textAlign: 'left', fontWeight: 'var(--font-semibold)' }}
                        >
                          {expanded === s.id ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-10)' }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: page === 1 ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: 'var(--text-sm)' }}>
                    ← Prev
                  </button>
                  <span style={{ padding: 'var(--space-2) var(--space-3)', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', alignSelf: 'center' }}>
                    {page} / {totalPages}
                  </span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: page === totalPages ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: 'var(--text-sm)' }}>
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
