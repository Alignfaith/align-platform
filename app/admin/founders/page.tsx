'use client'

import { useEffect, useState, useCallback } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable, { Column } from '@/components/admin/DataTable'

type FounderStatus = 'PENDING' | 'APPROVED' | 'DENIED'

interface FounderApplication {
  id: string
  name: string
  email: string
  phone: string
  gender: string
  city: string
  state: string
  status: FounderStatus
  createdAt: string
}

const STATUS_STYLE: Record<FounderStatus, { bg: string; color: string }> = {
  PENDING:  { bg: 'rgba(245,158,11,0.12)',  color: '#d97706' },
  APPROVED: { bg: 'rgba(34,197,94,0.12)',   color: '#16a34a' },
  DENIED:   { bg: 'rgba(239,68,68,0.12)',   color: '#dc2626' },
}

export default function FoundersAdminPage() {
  const [applications, setApplications] = useState<FounderApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null) // id being acted on

  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/founders')
      const data = await res.json()
      setApplications(data.applications ?? [])
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    fetchApplications().finally(() => setLoading(false))
  }, [fetchApplications])

  const act = async (id: string, action: 'approve' | 'deny') => {
    setActing(id)
    try {
      await fetch(`/api/founder/${id}/${action}`, { method: 'POST' })
      await fetchApplications()
    } catch (err) {
      console.error(err)
    } finally {
      setActing(null)
    }
  }

  const counts = {
    pending:  applications.filter(a => a.status === 'PENDING').length,
    approved: applications.filter(a => a.status === 'APPROVED').length,
    denied:   applications.filter(a => a.status === 'DENIED').length,
  }

  const columns: Column<FounderApplication>[] = [
    {
      key: 'name', label: 'Applicant',
      render: a => (
        <div>
          <div style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>
            {a.name}
          </div>
          <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>
            {a.email}
          </div>
        </div>
      ),
    },
    {
      key: 'phone', label: 'Phone',
      render: a => (
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          {a.phone}
        </span>
      ),
    },
    {
      key: 'gender', label: 'Gender',
      render: a => (
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', textTransform: 'capitalize' }}>
          {a.gender}
        </span>
      ),
    },
    {
      key: 'location', label: 'Location',
      render: a => (
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          {a.city}, {a.state}
        </span>
      ),
    },
    {
      key: 'status', label: 'Status',
      render: a => {
        const s = STATUS_STYLE[a.status]
        return (
          <span style={{
            fontSize: 'var(--text-xs)', padding: '2px 8px',
            backgroundColor: s.bg, color: s.color,
            borderRadius: 'var(--radius-sm)', fontWeight: 'var(--font-semibold)',
          }}>
            {a.status}
          </span>
        )
      },
    },
    {
      key: 'createdAt', label: 'Applied',
      render: a => (
        <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>
          {new Date(a.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions', label: '',
      render: a => {
        if (a.status !== 'PENDING') return null
        const busy = acting === a.id
        return (
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              onClick={e => { e.stopPropagation(); act(a.id, 'approve') }}
              disabled={busy}
              style={{
                padding: '4px 14px',
                background: 'rgba(34,197,94,0.12)',
                border: '1px solid rgba(34,197,94,0.3)',
                color: '#16a34a',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-semibold)',
                cursor: busy ? 'not-allowed' : 'pointer',
                opacity: busy ? 0.5 : 1,
              }}
            >
              {busy ? '…' : 'Approve'}
            </button>
            <button
              onClick={e => { e.stopPropagation(); act(a.id, 'deny') }}
              disabled={busy}
              style={{
                padding: '4px 14px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: '#dc2626',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-semibold)',
                cursor: busy ? 'not-allowed' : 'pointer',
                opacity: busy ? 0.5 : 1,
              }}
            >
              {busy ? '…' : 'Deny'}
            </button>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <AdminPageHeader
        title="Founder Applications"
        breadcrumbs={[{ label: 'Founder Applications' }]}
      />

      {/* Summary stats */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        {([
          { label: 'Pending',  value: counts.pending,  ...STATUS_STYLE.PENDING },
          { label: 'Approved', value: counts.approved, ...STATUS_STYLE.APPROVED },
          { label: 'Denied',   value: counts.denied,   ...STATUS_STYLE.DENIED },
          { label: 'Total',    value: applications.length, bg: 'var(--color-bg-elevated)', color: 'var(--color-text-primary)' },
        ] as const).map(s => (
          <div key={s.label} style={{
            backgroundColor: s.bg,
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4) var(--space-5)',
            minWidth: '110px',
          }}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: s.color, lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-1)' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ color: 'var(--color-text-tertiary)', padding: 'var(--space-8)' }}>Loading…</div>
      ) : (
        <DataTable<FounderApplication>
          columns={columns}
          data={applications}
          keyField="id"
          emptyMessage="No founder applications yet"
        />
      )}
    </>
  )
}
