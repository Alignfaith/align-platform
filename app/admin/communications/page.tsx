'use client'

import { useEffect, useState, useCallback } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import StatusBadge from '@/components/admin/StatusBadge'

interface Announcement {
  id: string
  title: string
  content: string
  target: string
  isActive: boolean
  startsAt: string
  expiresAt: string | null
  createdAt: string
}

export default function CommunicationsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', target: 'ALL_USERS' })
  const [saving, setSaving] = useState(false)

  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/communications/announcements')
      const data = await res.json()
      setAnnouncements(data.items)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAnnouncements() }, [fetchAnnouncements])

  const createAnnouncement = async () => {
    setSaving(true)
    try {
      await fetch('/api/admin/communications/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setForm({ title: '', content: '', target: 'ALL_USERS' })
      setShowForm(false)
      await fetchAnnouncements()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch('/api/admin/communications/announcements', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isActive: !isActive }),
    })
    await fetchAnnouncements()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: 'var(--space-2) var(--space-3)',
    fontSize: 'var(--text-sm)',
    backgroundColor: 'var(--color-bg-tertiary)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text-primary)',
    outline: 'none',
    fontFamily: 'var(--font-body)',
  }

  return (
    <>
      <AdminPageHeader
        title="Communications"
        breadcrumbs={[{ label: 'Communications' }]}
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
            }}
          >
            {showForm ? 'Cancel' : 'New Announcement'}
          </button>
        }
      />

      {showForm && (
        <div style={{ backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
            <textarea placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
            <select value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} style={inputStyle}>
              <option value="ALL_USERS">All Users</option>
              <option value="FREE_TIER">Free Tier</option>
              <option value="TIER_1">Tier 1</option>
              <option value="TIER_2">Tier 2</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            <button
              onClick={createAnnouncement}
              disabled={saving || !form.title || !form.content}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-semibold)',
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-white)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving || !form.title || !form.content ? 0.5 : 1,
                alignSelf: 'flex-start',
              }}
            >
              {saving ? 'Creating...' : 'Create Announcement'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ color: 'var(--color-text-tertiary)' }}>Loading...</div>
      ) : announcements.length === 0 ? (
        <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-tertiary)', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
          No announcements yet
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {announcements.map((a) => (
            <div
              key={a.id}
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4) var(--space-5)',
                opacity: a.isActive ? 1 : 0.5,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-semibold)' }}>{a.title}</h3>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
                    <StatusBadge label={a.target} />
                    <StatusBadge label={a.isActive ? 'ACTIVE' : 'DEACTIVATED'} />
                  </div>
                </div>
                <button
                  onClick={() => toggleActive(a.id, a.isActive)}
                  style={{
                    padding: 'var(--space-1) var(--space-3)',
                    fontSize: 'var(--text-xs)',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {a.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
                {a.content}
              </p>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-2)' }}>
                Created {new Date(a.createdAt).toLocaleDateString()}
                {a.expiresAt && ` · Expires ${new Date(a.expiresAt).toLocaleDateString()}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
