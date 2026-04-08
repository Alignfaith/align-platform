'use client'

import { useEffect, useState, useCallback } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable, { Column } from '@/components/admin/DataTable'
import PaginationControls from '@/components/admin/PaginationControls'
import FilterBar, { FilterConfig } from '@/components/admin/FilterBar'

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%', padding: 'var(--space-2) var(--space-3)',
  background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)',
  borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)',
  fontSize: 'var(--text-sm)', boxSizing: 'border-box', fontFamily: 'inherit',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)',
  marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.06em',
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', fontSize: 'var(--text-xl)' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontSize: 'var(--text-lg)' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-error)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
      {message}
    </div>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Inquiry {
  id: string; name: string; email: string; phone: string | null
  message: string; status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED'; createdAt: string
}

interface Interview {
  id: string; clientName: string; clientEmail: string; clientPhone: string | null
  scheduledAt: string | null; status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  notes: string | null; createdAt: string
}

interface ServiceMatch {
  id: string; client1Name: string; client1Email: string; client2Name: string; client2Email: string
  matchedAt: string; status: 'INTRODUCED' | 'DATING' | 'ENGAGED' | 'MARRIED' | 'DECLINED' | 'ARCHIVED'
  notes: string | null; outcome: string | null
}

interface Question {
  id: string; text: string; category: string | null; isActive: boolean; createdAt: string
}

// ─── Status badge helper ──────────────────────────────────────────────────────

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  NEW:        { bg: 'rgba(59,130,246,0.12)',  color: '#2563eb' },
  READ:       { bg: 'rgba(107,114,128,0.12)', color: '#6b7280' },
  REPLIED:    { bg: 'rgba(34,197,94,0.12)',   color: '#16a34a' },
  ARCHIVED:   { bg: 'rgba(156,163,175,0.12)', color: '#9ca3af' },
  SCHEDULED:  { bg: 'rgba(59,130,246,0.12)',  color: '#2563eb' },
  COMPLETED:  { bg: 'rgba(34,197,94,0.12)',   color: '#16a34a' },
  CANCELLED:  { bg: 'rgba(239,68,68,0.12)',   color: '#dc2626' },
  NO_SHOW:    { bg: 'rgba(234,179,8,0.12)',   color: '#ca8a04' },
  INTRODUCED: { bg: 'rgba(59,130,246,0.12)',  color: '#2563eb' },
  DATING:     { bg: 'rgba(168,85,247,0.12)',  color: '#9333ea' },
  ENGAGED:    { bg: 'rgba(234,179,8,0.12)',   color: '#ca8a04' },
  MARRIED:    { bg: 'rgba(185,28,28,0.12)',   color: '#b91c1c' },
  DECLINED:   { bg: 'rgba(107,114,128,0.12)', color: '#6b7280' },
}

function StatusBadge({ status }: { status: string }) {
  const s = BADGE_COLORS[status] ?? { bg: 'rgba(107,114,128,0.12)', color: '#6b7280' }
  return (
    <span style={{ fontSize: 'var(--text-xs)', padding: '2px 8px', backgroundColor: s.bg, color: s.color, borderRadius: 'var(--radius-sm)', fontWeight: 'var(--font-semibold)' }}>
      {status.replace('_', ' ')}
    </span>
  )
}

// ─── Inquiries tab ────────────────────────────────────────────────────────────

function InquiriesTab() {
  const [items, setItems] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('NEW')
  const [selected, setSelected] = useState<Inquiry | null>(null)

  const fetch_ = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), status: statusFilter })
    const res = await fetch(`/api/admin/inquiries?${params}`)
    const d = await res.json()
    setItems(d.items ?? [])
    setTotalItems(d.totalItems ?? 0)
    setTotalPages(d.totalPages ?? 1)
  }, [page, statusFilter])

  useEffect(() => { fetch_().finally(() => setLoading(false)) }, [fetch_])

  const patchStatus = async (id: string, status: string) => {
    await fetch('/api/admin/inquiries', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    if (selected?.id === id) setSelected(p => p ? { ...p, status: status as Inquiry['status'] } : null)
    fetch_()
  }

  const openItem = (i: Inquiry) => { setSelected(i); if (i.status === 'NEW') patchStatus(i.id, 'READ') }

  const filters: FilterConfig[] = [{ key: 'status', label: 'Status', options: [
    { value: 'NEW', label: 'New' }, { value: 'READ', label: 'Read' },
    { value: 'REPLIED', label: 'Replied' }, { value: 'ARCHIVED', label: 'Archived' }, { value: 'ALL', label: 'All' },
  ] }]

  const columns: Column<Inquiry>[] = [
    { key: 'name', label: 'From', render: i => (
      <div>
        <div style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontWeight: i.status === 'NEW' ? 'var(--font-semibold)' : 'var(--font-normal)' }}>{i.name}</div>
        <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>{i.email}{i.phone ? ` · ${i.phone}` : ''}</div>
      </div>
    )},
    { key: 'message', label: 'Message', render: i => (
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', maxWidth: '420px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.message}</div>
    )},
    { key: 'status', label: 'Status', render: i => <StatusBadge status={i.status} /> },
    { key: 'createdAt', label: 'Received', render: i => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{new Date(i.createdAt).toLocaleDateString()}</span> },
  ]

  return (
    <>
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', alignItems: 'center' }}>
        <FilterBar filters={filters} values={{ status: statusFilter }} onChange={(k, v) => { if (k === 'status') { setStatusFilter(v); setPage(1) } }} onClear={() => { setStatusFilter('NEW'); setPage(1) }} />
        <span style={{ marginLeft: 'auto', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>{totalItems} total</span>
      </div>
      {loading ? <div style={{ color: 'var(--color-text-tertiary)', padding: 'var(--space-8)' }}>Loading…</div> : (
        <>
          <DataTable<Inquiry> columns={columns} data={items} keyField="id" emptyMessage="No inquiries yet" onRowClick={openItem} />
          <PaginationControls page={page} totalPages={totalPages} totalItems={totalItems} onPageChange={setPage} />
        </>
      )}
      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)}>
          <div style={{ marginBottom: 'var(--space-1)' }}>
            <a href={`mailto:${selected.email}`} style={{ color: 'var(--color-primary)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>{selected.email}</a>
            {selected.phone && <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginLeft: 'var(--space-3)' }}>{selected.phone}</span>}
          </div>
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)', margin: '0 0 var(--space-5)' }}>{new Date(selected.createdAt).toLocaleString()}</p>
          <p style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: 'var(--space-5)' }}>{selected.message}</p>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <a href={`mailto:${selected.email}?subject=Re: Professional Matching Service Inquiry`} onClick={() => patchStatus(selected.id, 'REPLIED')}
              style={{ flex: 1, minWidth: '120px', padding: 'var(--space-2) var(--space-4)', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#16a34a', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', textDecoration: 'none', textAlign: 'center' }}>
              Reply via Email
            </a>
            {selected.status !== 'ARCHIVED' && (
              <button onClick={() => { patchStatus(selected.id, 'ARCHIVED'); setSelected(null) }}
                style={{ padding: 'var(--space-2) var(--space-4)', background: 'rgba(107,114,128,0.1)', border: '1px solid rgba(107,114,128,0.2)', color: 'var(--color-text-tertiary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
                Archive
              </button>
            )}
            {(['NEW', 'READ'] as const).includes(selected.status as 'NEW' | 'READ') && (
              <button onClick={() => patchStatus(selected.id, 'REPLIED')}
                style={{ padding: 'var(--space-2) var(--space-4)', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#3b82f6', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
                Mark Replied
              </button>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}

// ─── Interviews tab ───────────────────────────────────────────────────────────

type InterviewForm = { clientName: string; clientEmail: string; clientPhone: string; scheduledAt: string; notes: string }
const EMPTY_INTERVIEW: InterviewForm = { clientName: '', clientEmail: '', clientPhone: '', scheduledAt: '', notes: '' }

function InterviewsTab() {
  const [items, setItems] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selected, setSelected] = useState<Interview | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState<InterviewForm>(EMPTY_INTERVIEW)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const fetch_ = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), status: statusFilter })
    const res = await fetch(`/api/admin/matching-interviews?${params}`)
    const d = await res.json()
    setItems(d.items ?? [])
    setTotalItems(d.totalItems ?? 0)
    setTotalPages(d.totalPages ?? 1)
  }, [page, statusFilter])

  useEffect(() => { fetch_().finally(() => setLoading(false)) }, [fetch_])

  const openEdit = (i: Interview) => {
    setSelected(i)
    setForm({ clientName: i.clientName, clientEmail: i.clientEmail, clientPhone: i.clientPhone ?? '', scheduledAt: i.scheduledAt ? new Date(i.scheduledAt).toISOString().slice(0, 16) : '', notes: i.notes ?? '' })
    setFormError('')
  }

  const save = async (isNew: boolean) => {
    if (!form.clientName.trim() || !form.clientEmail.trim()) { setFormError('Name and email are required'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/matching-interviews', {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isNew ? form : { id: selected!.id, ...form }),
      })
      if (!res.ok) { const d = await res.json(); setFormError(d.error || 'Save failed'); return }
      setShowNew(false); setSelected(null); setForm(EMPTY_INTERVIEW); fetch_()
    } finally { setSaving(false) }
  }

  const patchStatus = async (id: string, status: string) => {
    await fetch('/api/admin/matching-interviews', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    if (selected?.id === id) setSelected(p => p ? { ...p, status: status as Interview['status'] } : null)
    fetch_()
  }

  const del = async (id: string) => {
    if (!confirm('Delete this interview?')) return
    await fetch(`/api/admin/matching-interviews?id=${id}`, { method: 'DELETE' })
    setSelected(null); fetch_()
  }

  const filters: FilterConfig[] = [{ key: 'status', label: 'Status', options: [
    { value: 'SCHEDULED', label: 'Scheduled' }, { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' }, { value: 'NO_SHOW', label: 'No Show' }, { value: 'ALL', label: 'All' },
  ] }]

  const columns: Column<Interview>[] = [
    { key: 'clientName', label: 'Client', render: i => (
      <div>
        <div style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>{i.clientName}</div>
        <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>{i.clientEmail}{i.clientPhone ? ` · ${i.clientPhone}` : ''}</div>
      </div>
    )},
    { key: 'scheduledAt', label: 'Scheduled', render: i => i.scheduledAt
      ? <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{new Date(i.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
      : <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>Not set</span>
    },
    { key: 'status', label: 'Status', render: i => <StatusBadge status={i.status} /> },
    { key: 'notes', label: 'Notes', render: i => i.notes
      ? <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{i.notes}</span>
      : <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>—</span>
    },
  ]

  const FormFields = ({ isNew }: { isNew: boolean }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {formError && <ErrorBanner message={formError} />}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
        <div><label style={labelStyle}>Name *</label><input style={inputStyle} value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))} placeholder="Full name" /></div>
        <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={form.clientPhone} onChange={e => setForm(f => ({ ...f, clientPhone: e.target.value }))} placeholder="(555) 000-0000" /></div>
      </div>
      <div><label style={labelStyle}>Email *</label><input style={inputStyle} type="email" value={form.clientEmail} onChange={e => setForm(f => ({ ...f, clientEmail: e.target.value }))} placeholder="client@email.com" /></div>
      <div><label style={labelStyle}>Scheduled Date & Time</label><input style={inputStyle} type="datetime-local" value={form.scheduledAt} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} /></div>
      {!isNew && (
        <div>
          <label style={labelStyle}>Status</label>
          <select style={inputStyle} value={selected?.status} onChange={e => patchStatus(selected!.id, e.target.value)}>
            {['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </div>
      )}
      <div><label style={labelStyle}>Notes</label><textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties} rows={4} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Notes, observations…" /></div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button onClick={() => save(isNew)} disabled={saving} style={{ padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', cursor: saving ? 'not-allowed' : 'pointer' }}>{saving ? 'Saving…' : 'Save'}</button>
          <button onClick={() => { setShowNew(false); setSelected(null) }} style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>Cancel</button>
        </div>
        {!isNew && <button onClick={() => del(selected!.id)} style={{ padding: 'var(--space-2) var(--space-4)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-error)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>Delete</button>}
      </div>
    </div>
  )

  return (
    <>
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', alignItems: 'center' }}>
        <FilterBar filters={filters} values={{ status: statusFilter }} onChange={(k, v) => { if (k === 'status') { setStatusFilter(v); setPage(1) } }} onClear={() => { setStatusFilter('ALL'); setPage(1) }} />
        <button onClick={() => { setForm(EMPTY_INTERVIEW); setFormError(''); setShowNew(true) }} style={{ marginLeft: 'auto', padding: 'var(--space-2) var(--space-4)', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', cursor: 'pointer' }}>+ Schedule</button>
      </div>
      {loading ? <div style={{ color: 'var(--color-text-tertiary)', padding: 'var(--space-8)' }}>Loading…</div> : (
        <>
          <DataTable<Interview> columns={columns} data={items} keyField="id" emptyMessage="No interviews scheduled" onRowClick={openEdit} />
          <PaginationControls page={page} totalPages={totalPages} totalItems={totalItems} onPageChange={setPage} />
        </>
      )}
      {showNew && <Modal title="Schedule Interview" onClose={() => setShowNew(false)}><FormFields isNew={true} /></Modal>}
      {selected && !showNew && <Modal title="Edit Interview" onClose={() => setSelected(null)}><FormFields isNew={false} /></Modal>}
    </>
  )
}

// ─── Matches tab ──────────────────────────────────────────────────────────────

type MatchForm = { client1Name: string; client1Email: string; client2Name: string; client2Email: string; matchedAt: string; notes: string; outcome: string }
const EMPTY_MATCH: MatchForm = { client1Name: '', client1Email: '', client2Name: '', client2Email: '', matchedAt: '', notes: '', outcome: '' }

function MatchesTab() {
  const [items, setItems] = useState<ServiceMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selected, setSelected] = useState<ServiceMatch | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState<MatchForm>(EMPTY_MATCH)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const fetch_ = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), status: statusFilter })
    const res = await fetch(`/api/admin/matching-matches?${params}`)
    const d = await res.json()
    setItems(d.items ?? [])
    setTotalItems(d.totalItems ?? 0)
    setTotalPages(d.totalPages ?? 1)
  }, [page, statusFilter])

  useEffect(() => { fetch_().finally(() => setLoading(false)) }, [fetch_])

  const openEdit = (m: ServiceMatch) => {
    setSelected(m)
    setForm({ client1Name: m.client1Name, client1Email: m.client1Email, client2Name: m.client2Name, client2Email: m.client2Email, matchedAt: m.matchedAt ? new Date(m.matchedAt).toISOString().slice(0, 10) : '', notes: m.notes ?? '', outcome: m.outcome ?? '' })
    setFormError('')
  }

  const save = async (isNew: boolean) => {
    if (!form.client1Name.trim() || !form.client1Email.trim() || !form.client2Name.trim() || !form.client2Email.trim()) { setFormError('Both client names and emails are required'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/matching-matches', {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isNew ? form : { id: selected!.id, ...form }),
      })
      if (!res.ok) { const d = await res.json(); setFormError(d.error || 'Save failed'); return }
      setShowNew(false); setSelected(null); setForm(EMPTY_MATCH); fetch_()
    } finally { setSaving(false) }
  }

  const patchStatus = async (id: string, status: string) => {
    await fetch('/api/admin/matching-matches', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    if (selected?.id === id) setSelected(p => p ? { ...p, status: status as ServiceMatch['status'] } : null)
    fetch_()
  }

  const del = async (id: string) => {
    if (!confirm('Delete this match record?')) return
    await fetch(`/api/admin/matching-matches?id=${id}`, { method: 'DELETE' })
    setSelected(null); fetch_()
  }

  const filters: FilterConfig[] = [{ key: 'status', label: 'Status', options: [
    { value: 'INTRODUCED', label: 'Introduced' }, { value: 'DATING', label: 'Dating' },
    { value: 'ENGAGED', label: 'Engaged' }, { value: 'MARRIED', label: 'Married' },
    { value: 'DECLINED', label: 'Declined' }, { value: 'ARCHIVED', label: 'Archived' }, { value: 'ALL', label: 'All' },
  ] }]

  const columns: Column<ServiceMatch>[] = [
    { key: 'client1Name', label: 'Client 1', render: m => <div><div style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>{m.client1Name}</div><div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>{m.client1Email}</div></div> },
    { key: 'client2Name', label: 'Client 2', render: m => <div><div style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>{m.client2Name}</div><div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>{m.client2Email}</div></div> },
    { key: 'matchedAt', label: 'Matched', render: m => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{new Date(m.matchedAt).toLocaleDateString()}</span> },
    { key: 'status', label: 'Status', render: m => <StatusBadge status={m.status} /> },
    { key: 'outcome', label: 'Outcome', render: m => m.outcome ? <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{m.outcome}</span> : <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>—</span> },
  ]

  const CardBox = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
      <p style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 'var(--font-semibold)' }}>{label}</p>
      {children}
    </div>
  )

  const FormFields = ({ isNew }: { isNew: boolean }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {formError && <ErrorBanner message={formError} />}
      <CardBox label="Client 1">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <div><label style={labelStyle}>Name *</label><input style={inputStyle} value={form.client1Name} onChange={e => setForm(f => ({ ...f, client1Name: e.target.value }))} /></div>
          <div><label style={labelStyle}>Email *</label><input style={inputStyle} type="email" value={form.client1Email} onChange={e => setForm(f => ({ ...f, client1Email: e.target.value }))} /></div>
        </div>
      </CardBox>
      <CardBox label="Client 2">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <div><label style={labelStyle}>Name *</label><input style={inputStyle} value={form.client2Name} onChange={e => setForm(f => ({ ...f, client2Name: e.target.value }))} /></div>
          <div><label style={labelStyle}>Email *</label><input style={inputStyle} type="email" value={form.client2Email} onChange={e => setForm(f => ({ ...f, client2Email: e.target.value }))} /></div>
        </div>
      </CardBox>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
        <div><label style={labelStyle}>Match Date</label><input style={inputStyle} type="date" value={form.matchedAt} onChange={e => setForm(f => ({ ...f, matchedAt: e.target.value }))} /></div>
        {!isNew && (
          <div><label style={labelStyle}>Status</label>
            <select style={inputStyle} value={selected?.status} onChange={e => patchStatus(selected!.id, e.target.value)}>
              {['INTRODUCED', 'DATING', 'ENGAGED', 'MARRIED', 'DECLINED', 'ARCHIVED'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
      </div>
      <div><label style={labelStyle}>Internal Notes</label><textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties} rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
      <div><label style={labelStyle}>Outcome</label><textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties} rows={2} value={form.outcome} onChange={e => setForm(f => ({ ...f, outcome: e.target.value }))} /></div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button onClick={() => save(isNew)} disabled={saving} style={{ padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', cursor: saving ? 'not-allowed' : 'pointer' }}>{saving ? 'Saving…' : 'Save'}</button>
          <button onClick={() => { setShowNew(false); setSelected(null) }} style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>Cancel</button>
        </div>
        {!isNew && <button onClick={() => del(selected!.id)} style={{ padding: 'var(--space-2) var(--space-4)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-error)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>Delete</button>}
      </div>
    </div>
  )

  return (
    <>
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', alignItems: 'center' }}>
        <FilterBar filters={filters} values={{ status: statusFilter }} onChange={(k, v) => { if (k === 'status') { setStatusFilter(v); setPage(1) } }} onClear={() => { setStatusFilter('ALL'); setPage(1) }} />
        <button onClick={() => { setForm(EMPTY_MATCH); setFormError(''); setShowNew(true) }} style={{ marginLeft: 'auto', padding: 'var(--space-2) var(--space-4)', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', cursor: 'pointer' }}>+ Record Match</button>
      </div>
      {loading ? <div style={{ color: 'var(--color-text-tertiary)', padding: 'var(--space-8)' }}>Loading…</div> : (
        <>
          <DataTable<ServiceMatch> columns={columns} data={items} keyField="id" emptyMessage="No matches recorded" onRowClick={openEdit} />
          <PaginationControls page={page} totalPages={totalPages} totalItems={totalItems} onPageChange={setPage} />
        </>
      )}
      {showNew && <Modal title="Record Match" onClose={() => setShowNew(false)}><FormFields isNew={true} /></Modal>}
      {selected && !showNew && <Modal title="Edit Match" onClose={() => setSelected(null)}><FormFields isNew={false} /></Modal>}
    </>
  )
}

// ─── Questions tab ────────────────────────────────────────────────────────────

function QuestionsTab() {
  const [items, setItems] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [selected, setSelected] = useState<Question | null>(null)
  const [text, setText] = useState('')
  const [category, setCategory] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const fetch_ = useCallback(async () => {
    const res = await fetch('/api/admin/matching-questions')
    const d = await res.json()
    setItems(d.items ?? [])
  }, [])

  useEffect(() => { fetch_().finally(() => setLoading(false)) }, [fetch_])

  const openEdit = (q: Question) => { setSelected(q); setText(q.text); setCategory(q.category ?? ''); setFormError('') }

  const save = async (isNew: boolean) => {
    if (!text.trim()) { setFormError('Question text is required'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/matching-questions', {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isNew ? { text, category } : { id: selected!.id, text, category }),
      })
      if (!res.ok) { const d = await res.json(); setFormError(d.error || 'Save failed'); return }
      setShowNew(false); setSelected(null); setText(''); setCategory(''); fetch_()
    } finally { setSaving(false) }
  }

  const toggleActive = async (q: Question) => {
    await fetch('/api/admin/matching-questions', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: q.id, isActive: !q.isActive }) })
    fetch_()
  }

  const del = async (id: string) => {
    if (!confirm('Delete this question?')) return
    await fetch(`/api/admin/matching-questions?id=${id}`, { method: 'DELETE' })
    setSelected(null); fetch_()
  }

  // Group by category
  const grouped = items.reduce<Record<string, Question[]>>((acc, q) => {
    const key = q.category || 'Uncategorized'
    if (!acc[key]) acc[key] = []
    acc[key].push(q)
    return acc
  }, {})

  const FormFields = ({ isNew }: { isNew: boolean }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {formError && <ErrorBanner message={formError} />}
      <div>
        <label style={labelStyle}>Category <span style={{ textTransform: 'none', color: 'var(--color-text-tertiary)' }}>(optional — e.g. Faith, Lifestyle, Goals)</span></label>
        <input style={inputStyle} value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Faith" />
      </div>
      <div>
        <label style={labelStyle}>Question *</label>
        <textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties} rows={4} value={text} onChange={e => setText(e.target.value)} placeholder="Enter the interview question…" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button onClick={() => save(isNew)} disabled={saving} style={{ padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', cursor: saving ? 'not-allowed' : 'pointer' }}>{saving ? 'Saving…' : 'Save'}</button>
          <button onClick={() => { setShowNew(false); setSelected(null) }} style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>Cancel</button>
        </div>
        {!isNew && <button onClick={() => del(selected!.id)} style={{ padding: 'var(--space-2) var(--space-4)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-error)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>Delete</button>}
      </div>
    </div>
  )

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-4)' }}>
        <button onClick={() => { setText(''); setCategory(''); setFormError(''); setShowNew(true) }} style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', cursor: 'pointer' }}>+ Add Question</button>
      </div>

      {loading ? (
        <div style={{ color: 'var(--color-text-tertiary)', padding: 'var(--space-8)' }}>Loading…</div>
      ) : items.length === 0 ? (
        <div style={{ color: 'var(--color-text-tertiary)', padding: 'var(--space-8)', textAlign: 'center' }}>No questions yet. Add your first interview question.</div>
      ) : (
        Object.entries(grouped).sort(([a], [b]) => a === 'Uncategorized' ? 1 : b === 'Uncategorized' ? -1 : a.localeCompare(b)).map(([cat, qs]) => (
          <div key={cat} style={{ marginBottom: 'var(--space-6)' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-2)', fontWeight: 'var(--font-semibold)' }}>{cat}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {qs.map(q => (
                <div key={q.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', opacity: q.isActive ? 1 : 0.5 }}>
                  <p style={{ margin: 0, flex: 1, fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>{q.text}</p>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
                    <button onClick={() => toggleActive(q)} style={{ padding: '2px 10px', fontSize: 'var(--text-xs)', background: q.isActive ? 'rgba(34,197,94,0.1)' : 'rgba(107,114,128,0.1)', border: `1px solid ${q.isActive ? 'rgba(34,197,94,0.3)' : 'rgba(107,114,128,0.2)'}`, color: q.isActive ? '#16a34a' : '#6b7280', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                      {q.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button onClick={() => openEdit(q)} style={{ padding: '2px 10px', fontSize: 'var(--text-xs)', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#3b82f6', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {showNew && <Modal title="Add Question" onClose={() => setShowNew(false)}><FormFields isNew={true} /></Modal>}
      {selected && !showNew && <Modal title="Edit Question" onClose={() => setSelected(null)}><FormFields isNew={false} /></Modal>}
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = 'inquiries' | 'interviews' | 'matches' | 'questions'

const TABS: { id: Tab; label: string }[] = [
  { id: 'inquiries',  label: 'Inquiries' },
  { id: 'interviews', label: 'Interviews' },
  { id: 'matches',    label: 'Matches' },
  { id: 'questions',  label: 'Questions' },
]

export default function ProfessionalPage() {
  const [activeTab, setActiveTab] = useState<Tab>('inquiries')

  return (
    <>
      <AdminPageHeader title="Professional Matching" breadcrumbs={[{ label: 'Professional Matching' }]} />

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--color-border-subtle)', marginBottom: 'var(--space-5)' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: 'var(--space-3) var(--space-5)',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
              fontSize: 'var(--text-sm)',
              fontWeight: activeTab === tab.id ? 'var(--font-semibold)' : 'var(--font-normal)',
              cursor: 'pointer',
              marginBottom: '-1px',
              transition: 'all var(--transition-fast)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'inquiries'  && <InquiriesTab />}
      {activeTab === 'interviews' && <InterviewsTab />}
      {activeTab === 'matches'    && <MatchesTab />}
      {activeTab === 'questions'  && <QuestionsTab />}
    </>
  )
}
