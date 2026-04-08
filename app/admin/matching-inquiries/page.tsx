'use client'

import { useEffect, useState, useCallback } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable, { Column } from '@/components/admin/DataTable'
import PaginationControls from '@/components/admin/PaginationControls'
import FilterBar, { FilterConfig } from '@/components/admin/FilterBar'

interface Inquiry {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED'
  createdAt: string
}

const STATUS_FILTERS: FilterConfig[] = [{
  key: 'status', label: 'Status',
  options: [
    { value: 'NEW', label: 'New' },
    { value: 'READ', label: 'Read' },
    { value: 'REPLIED', label: 'Replied' },
    { value: 'ARCHIVED', label: 'Archived' },
    { value: 'ALL', label: 'All' },
  ],
}]

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  NEW:      { bg: 'rgba(59,130,246,0.12)', color: '#2563eb' },
  READ:     { bg: 'rgba(107,114,128,0.12)', color: '#6b7280' },
  REPLIED:  { bg: 'rgba(34,197,94,0.12)',  color: '#16a34a' },
  ARCHIVED: { bg: 'rgba(156,163,175,0.12)', color: '#9ca3af' },
}

export default function MatchingInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('NEW')
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [updating, setUpdating] = useState(false)

  const fetchInquiries = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(page), status: statusFilter })
      const res = await fetch(`/api/admin/inquiries?${params}`)
      const data = await res.json()
      setInquiries(data.items ?? [])
      setTotalItems(data.totalItems ?? 0)
      setTotalPages(data.totalPages ?? 1)
    } catch (err) {
      console.error(err)
    }
  }, [page, statusFilter])

  useEffect(() => {
    fetchInquiries().finally(() => setLoading(false))
  }, [fetchInquiries])

  const updateStatus = async (id: string, status: string) => {
    setUpdating(true)
    try {
      await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: status as Inquiry['status'] } : null)
      await fetchInquiries()
    } finally {
      setUpdating(false)
    }
  }

  const openInquiry = (inquiry: Inquiry) => {
    setSelected(inquiry)
    if (inquiry.status === 'NEW') updateStatus(inquiry.id, 'READ')
  }

  const statusBadge = (status: Inquiry['status']) => {
    const s = STATUS_STYLE[status] ?? STATUS_STYLE.READ
    return (
      <span style={{ fontSize: 'var(--text-xs)', padding: '2px 8px', backgroundColor: s.bg, color: s.color, borderRadius: 'var(--radius-sm)', fontWeight: 'var(--font-semibold)' }}>
        {status}
      </span>
    )
  }

  const columns: Column<Inquiry>[] = [
    {
      key: 'name', label: 'From',
      render: i => (
        <div>
          <div style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontWeight: i.status === 'NEW' ? 'var(--font-semibold)' : 'var(--font-normal)' }}>{i.name}</div>
          <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>{i.email}{i.phone ? ` · ${i.phone}` : ''}</div>
        </div>
      ),
    },
    {
      key: 'message', label: 'Message',
      render: i => (
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', maxWidth: '420px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {i.message}
        </div>
      ),
    },
    { key: 'status', label: 'Status', render: i => statusBadge(i.status) },
    {
      key: 'createdAt', label: 'Received',
      render: i => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{new Date(i.createdAt).toLocaleDateString()}</span>,
    },
  ]

  return (
    <>
      <AdminPageHeader
        title="Matching Inquiries"
        breadcrumbs={[{ label: 'Professional Matching' }, { label: 'Inquiries' }]}
      />

      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', alignItems: 'center' }}>
        <FilterBar
          filters={STATUS_FILTERS}
          values={{ status: statusFilter }}
          onChange={(key, val) => { if (key === 'status') { setStatusFilter(val); setPage(1) } }}
          onClear={() => { setStatusFilter('NEW'); setPage(1) }}
        />
        <span style={{ marginLeft: 'auto', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>{totalItems} total</span>
      </div>

      {loading ? (
        <div style={{ color: 'var(--color-text-tertiary)', padding: 'var(--space-8)' }}>Loading…</div>
      ) : (
        <>
          <DataTable<Inquiry> columns={columns} data={inquiries} keyField="id" emptyMessage="No inquiries yet" onRowClick={openInquiry} />
          <PaginationControls page={page} totalPages={totalPages} totalItems={totalItems} onPageChange={setPage} />
        </>
      )}

      {selected && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}
        >
          <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-5)' }}>
              <div>
                <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', fontSize: 'var(--text-xl)' }}>{selected.name}</h2>
                <div style={{ marginTop: 'var(--space-1)', display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
                  <a href={`mailto:${selected.email}`} style={{ color: 'var(--color-primary)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>{selected.email}</a>
                  {selected.phone && <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>{selected.phone}</span>}
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontSize: 'var(--text-lg)' }}>✕</button>
            </div>

            <div style={{ marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Received</span>
              <p style={{ margin: '4px 0 0', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>{new Date(selected.createdAt).toLocaleString()}</p>
            </div>

            <div style={{ marginBottom: 'var(--space-5)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Message</span>
              <p style={{ margin: '4px 0 0', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{selected.message}</p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <a
                href={`mailto:${selected.email}?subject=Re: Professional Matching Service Inquiry`}
                onClick={() => updateStatus(selected.id, 'REPLIED')}
                style={{ flex: 1, minWidth: '120px', padding: 'var(--space-2) var(--space-4)', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#16a34a', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', textDecoration: 'none', textAlign: 'center' }}
              >
                Reply via Email
              </a>
              {selected.status !== 'ARCHIVED' && (
                <button onClick={() => { updateStatus(selected.id, 'ARCHIVED'); setSelected(null) }} disabled={updating}
                  style={{ padding: 'var(--space-2) var(--space-4)', background: 'rgba(107,114,128,0.1)', border: '1px solid rgba(107,114,128,0.2)', color: 'var(--color-text-tertiary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', cursor: updating ? 'not-allowed' : 'pointer' }}>
                  Archive
                </button>
              )}
              {(['NEW', 'READ'] as const).includes(selected.status as 'NEW' | 'READ') && (
                <button onClick={() => updateStatus(selected.id, 'REPLIED')} disabled={updating}
                  style={{ padding: 'var(--space-2) var(--space-4)', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#3b82f6', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', cursor: updating ? 'not-allowed' : 'pointer' }}>
                  Mark Replied
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
