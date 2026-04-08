'use client'

import { useEffect, useState, useCallback } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable, { Column } from '@/components/admin/DataTable'
import PaginationControls from '@/components/admin/PaginationControls'
import FilterBar, { FilterConfig } from '@/components/admin/FilterBar'

interface Interview {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string | null
  scheduledAt: string | null
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  notes: string | null
  createdAt: string
}

type InterviewForm = {
  clientName: string
  clientEmail: string
  clientPhone: string
  scheduledAt: string
  notes: string
}

const EMPTY_FORM: InterviewForm = { clientName: '', clientEmail: '', clientPhone: '', scheduledAt: '', notes: '' }

const STATUS_FILTERS: FilterConfig[] = [{
  key: 'status', label: 'Status',
  options: [
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'NO_SHOW', label: 'No Show' },
    { value: 'ALL', label: 'All' },
  ],
}]

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  SCHEDULED:  { bg: 'rgba(59,130,246,0.12)',  color: '#2563eb' },
  COMPLETED:  { bg: 'rgba(34,197,94,0.12)',   color: '#16a34a' },
  CANCELLED:  { bg: 'rgba(239,68,68,0.12)',   color: '#dc2626' },
  NO_SHOW:    { bg: 'rgba(234,179,8,0.12)',   color: '#ca8a04' },
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: 'var(--space-2) var(--space-3)', background: 'var(--color-bg-elevated)',
  border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)',
  color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', boxSizing: 'border-box', fontFamily: 'inherit',
}

export default function MatchingInterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selected, setSelected] = useState<Interview | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<InterviewForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const fetchInterviews = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(page), status: statusFilter })
      const res = await fetch(`/api/admin/matching-interviews?${params}`)
      const data = await res.json()
      setInterviews(data.items ?? [])
      setTotalItems(data.totalItems ?? 0)
      setTotalPages(data.totalPages ?? 1)
    } catch (err) {
      console.error(err)
    }
  }, [page, statusFilter])

  useEffect(() => {
    fetchInterviews().finally(() => setLoading(false))
  }, [fetchInterviews])

  const openEdit = (interview: Interview) => {
    setSelected(interview)
    setForm({
      clientName: interview.clientName,
      clientEmail: interview.clientEmail,
      clientPhone: interview.clientPhone ?? '',
      scheduledAt: interview.scheduledAt ? new Date(interview.scheduledAt).toISOString().slice(0, 16) : '',
      notes: interview.notes ?? '',
    })
    setFormError('')
  }

  const handleSave = async (isNew: boolean) => {
    setFormError('')
    if (!form.clientName.trim() || !form.clientEmail.trim()) {
      setFormError('Name and email are required')
      return
    }
    setSaving(true)
    try {
      const method = isNew ? 'POST' : 'PATCH'
      const body = isNew ? form : { id: selected!.id, ...form }
      const res = await fetch('/api/admin/matching-interviews', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const d = await res.json()
        setFormError(d.error || 'Save failed')
        return
      }
      setShowForm(false)
      setSelected(null)
      setForm(EMPTY_FORM)
      await fetchInterviews()
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    await fetch('/api/admin/matching-interviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: status as Interview['status'] } : null)
    await fetchInterviews()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this interview record?')) return
    await fetch(`/api/admin/matching-interviews?id=${id}`, { method: 'DELETE' })
    setSelected(null)
    await fetchInterviews()
  }

  const statusBadge = (status: Interview['status']) => {
    const s = STATUS_STYLE[status] ?? STATUS_STYLE.SCHEDULED
    return <span style={{ fontSize: 'var(--text-xs)', padding: '2px 8px', backgroundColor: s.bg, color: s.color, borderRadius: 'var(--radius-sm)', fontWeight: 'var(--font-semibold)' }}>{status.replace('_', ' ')}</span>
  }

  const columns: Column<Interview>[] = [
    {
      key: 'clientName', label: 'Client',
      render: i => (
        <div>
          <div style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>{i.clientName}</div>
          <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>{i.clientEmail}{i.clientPhone ? ` · ${i.clientPhone}` : ''}</div>
        </div>
      ),
    },
    {
      key: 'scheduledAt', label: 'Scheduled',
      render: i => i.scheduledAt
        ? <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{new Date(i.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
        : <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Not set</span>,
    },
    { key: 'status', label: 'Status', render: i => statusBadge(i.status) },
    {
      key: 'notes', label: 'Notes',
      render: i => i.notes
        ? <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{i.notes}</span>
        : <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>—</span>,
    },
  ]

  const modal = (isNew: boolean) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}
      onClick={e => { if (e.target === e.currentTarget) { setShowForm(false); setSelected(null) } }}>
      <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', fontSize: 'var(--text-xl)' }}>
            {isNew ? 'Schedule Interview' : 'Edit Interview'}
          </h2>
          <button onClick={() => { setShowForm(false); setSelected(null) }} style={{ background: 'none', border: 'none', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontSize: 'var(--text-lg)' }}>✕</button>
        </div>

        {formError && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-error)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>{formError}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Client Name *</label>
              <input style={inputStyle} value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))} placeholder="Full name" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Phone</label>
              <input style={inputStyle} value={form.clientPhone} onChange={e => setForm(f => ({ ...f, clientPhone: e.target.value }))} placeholder="(555) 000-0000" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email *</label>
            <input style={inputStyle} type="email" value={form.clientEmail} onChange={e => setForm(f => ({ ...f, clientEmail: e.target.value }))} placeholder="client@email.com" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Scheduled Date & Time</label>
            <input style={inputStyle} type="datetime-local" value={form.scheduledAt} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} />
          </div>
          {!isNew && (
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</label>
              <select style={inputStyle} value={selected?.status} onChange={e => handleStatusChange(selected!.id, e.target.value)}>
                {['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
          )}
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Notes</label>
            <textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties} rows={4} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Interview notes, preferences, observations…" />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'space-between', paddingTop: 'var(--space-2)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button onClick={() => handleSave(isNew)} disabled={saving}
                style={{ padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button onClick={() => { setShowForm(false); setSelected(null) }}
                style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
            {!isNew && (
              <button onClick={() => handleDelete(selected!.id)}
                style={{ padding: 'var(--space-2) var(--space-4)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-error)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <AdminPageHeader
        title="Client Interviews"
        breadcrumbs={[{ label: 'Professional Matching' }, { label: 'Interviews' }]}
        actions={
          <button onClick={() => { setForm(EMPTY_FORM); setFormError(''); setShowForm(true) }}
            style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', cursor: 'pointer' }}>
            + Schedule Interview
          </button>
        }
      />

      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', alignItems: 'center' }}>
        <FilterBar
          filters={STATUS_FILTERS}
          values={{ status: statusFilter }}
          onChange={(key, val) => { if (key === 'status') { setStatusFilter(val); setPage(1) } }}
          onClear={() => { setStatusFilter('ALL'); setPage(1) }}
        />
        <span style={{ marginLeft: 'auto', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>{totalItems} total</span>
      </div>

      {loading ? (
        <div style={{ color: 'var(--color-text-tertiary)', padding: 'var(--space-8)' }}>Loading…</div>
      ) : (
        <>
          <DataTable<Interview> columns={columns} data={interviews} keyField="id" emptyMessage="No interviews scheduled" onRowClick={openEdit} />
          <PaginationControls page={page} totalPages={totalPages} totalItems={totalItems} onPageChange={setPage} />
        </>
      )}

      {showForm && modal(true)}
      {selected && !showForm && modal(false)}
    </>
  )
}
