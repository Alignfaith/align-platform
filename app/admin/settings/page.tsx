'use client'

import { useEffect, useState, useCallback } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable, { Column } from '@/components/admin/DataTable'
import PaginationControls from '@/components/admin/PaginationControls'

interface FeatureFlag {
  id: string
  key: string
  value: boolean
  description: string | null
  updatedAt: string
}

interface WaitlistEntry {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  isApproved: boolean
  createdAt: string
}

const DEFAULT_FLAGS = [
  { key: 'matching_enabled', description: 'Enable/disable the matching system' },
  { key: 'growth_posts_enabled', description: 'Enable/disable growth post creation' },
  { key: 'messaging_enabled', description: 'Enable/disable user messaging' },
  { key: 'registration_open', description: 'Open/close new registrations' },
  { key: 'invite_only_mode', description: 'Require invite codes for registration' },
  { key: 'ai_moderation_enabled', description: 'Enable/disable AI content moderation' },
  { key: 'photo_upload_enabled', description: 'Enable/disable photo uploads' },
  { key: 'waitlist_mode', description: 'Redirect new signups to waitlist' },
]

export default function SettingsPage() {
  const [tab, setTab] = useState<'flags' | 'waitlist'>('flags')
  const [flags, setFlags] = useState<FeatureFlag[]>([])
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [wlPage, setWlPage] = useState(1)
  const [wlTotal, setWlTotal] = useState(0)
  const [wlTotalPages, setWlTotalPages] = useState(1)
  const [selectedWl, setSelectedWl] = useState<Set<string>>(new Set())

  const fetchFlags = async () => {
    try {
      const res = await fetch('/api/admin/settings/feature-flags')
      const data = await res.json()
      setFlags(data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchWaitlist = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/settings/waitlist?page=${wlPage}&status=pending`)
      const data = await res.json()
      setWaitlist(data.items)
      setWlTotal(data.totalItems)
      setWlTotalPages(data.totalPages)
    } catch (err) {
      console.error(err)
    }
  }, [wlPage])

  useEffect(() => {
    Promise.all([fetchFlags(), fetchWaitlist()]).finally(() => setLoading(false))
  }, [fetchWaitlist])

  const toggleFlag = async (key: string, currentValue: boolean) => {
    await fetch('/api/admin/settings/feature-flags', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: !currentValue }),
    })
    await fetchFlags()
  }

  const handleWaitlistAction = async (action: 'approve' | 'reject', ids?: string[]) => {
    const entryIds = ids || Array.from(selectedWl)
    if (entryIds.length === 0) return
    await fetch('/api/admin/settings/waitlist', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entryIds, action }),
    })
    setSelectedWl(new Set())
    await fetchWaitlist()
  }

  // Merge default flags with DB flags
  const mergedFlags = DEFAULT_FLAGS.map((df) => {
    const existing = flags.find((f) => f.key === df.key)
    return existing || { id: df.key, key: df.key, value: false, description: df.description, updatedAt: '' }
  })

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: 'var(--space-2) var(--space-4)',
    fontSize: 'var(--text-sm)',
    fontWeight: active ? 'var(--font-semibold)' : 'var(--font-normal)',
    color: active ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
    backgroundColor: active ? 'var(--color-bg-elevated)' : 'transparent',
    border: active ? '1px solid var(--color-border-subtle)' : '1px solid transparent',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
  })

  const waitlistColumns: Column<WaitlistEntry>[] = [
    { key: 'email', label: 'Email', render: (e) => <span style={{ color: 'var(--color-text-primary)' }}>{e.email}</span> },
    { key: 'firstName', label: 'Name', render: (e) => <span>{e.firstName ?? ''} {e.lastName ?? ''}</span> },
    { key: 'createdAt', label: 'Signed Up', render: (e) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{new Date(e.createdAt).toLocaleDateString()}</span> },
    {
      key: 'actions', label: '', width: '150px',
      render: (e) => (
        <div style={{ display: 'flex', gap: 'var(--space-1)' }} onClick={(ev) => ev.stopPropagation()}>
          <button onClick={() => handleWaitlistAction('approve', [e.id])} style={{ padding: '2px 8px', fontSize: 'var(--text-xs)', backgroundColor: 'rgba(34,197,94,0.1)', color: 'var(--color-success)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>Approve</button>
          <button onClick={() => handleWaitlistAction('reject', [e.id])} style={{ padding: '2px 8px', fontSize: 'var(--text-xs)', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--color-error)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>Reject</button>
        </div>
      ),
    },
  ]

  if (loading) return <div style={{ color: 'var(--color-text-tertiary)', padding: 'var(--space-8)' }}>Loading...</div>

  return (
    <>
      <AdminPageHeader title="Settings" breadcrumbs={[{ label: 'Settings' }]} />

      <div style={{ display: 'flex', gap: 'var(--space-1)', marginBottom: 'var(--space-6)' }}>
        <button style={tabStyle(tab === 'flags')} onClick={() => setTab('flags')}>Feature Flags</button>
        <button style={tabStyle(tab === 'waitlist')} onClick={() => setTab('waitlist')}>Waitlist ({wlTotal})</button>
      </div>

      {tab === 'flags' && (
        <div style={{ backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {mergedFlags.map((flag, i) => (
            <div
              key={flag.key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-3) var(--space-5)',
                borderBottom: i < mergedFlags.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
              }}
            >
              <div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-medium)' }}>
                  {flag.key}
                </div>
                {flag.description && (
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>
                    {flag.description}
                  </div>
                )}
              </div>
              <button
                onClick={() => toggleFlag(flag.key, flag.value)}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: flag.value ? 'var(--color-success)' : 'var(--color-gray-600)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background-color var(--transition-fast)',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-white)',
                    position: 'absolute',
                    top: '3px',
                    left: flag.value ? '23px' : '3px',
                    transition: 'left var(--transition-fast)',
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'waitlist' && (
        <>
          {selectedWl.size > 0 && (
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
              <button onClick={() => handleWaitlistAction('approve')} style={{ padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--text-sm)', backgroundColor: 'var(--color-success)', color: 'var(--color-white)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'var(--font-semibold)' }}>
                Approve ({selectedWl.size})
              </button>
              <button onClick={() => handleWaitlistAction('reject')} style={{ padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--text-sm)', backgroundColor: 'var(--color-error)', color: 'var(--color-white)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'var(--font-semibold)' }}>
                Reject ({selectedWl.size})
              </button>
            </div>
          )}
          <DataTable<WaitlistEntry>
            columns={waitlistColumns}
            data={waitlist}
            keyField="id"
            selectable
            selectedIds={selectedWl}
            onSelectionChange={setSelectedWl}
            emptyMessage="No pending waitlist entries"
          />
          <PaginationControls page={wlPage} totalPages={wlTotalPages} totalItems={wlTotal} onPageChange={setWlPage} />
        </>
      )}
    </>
  )
}
