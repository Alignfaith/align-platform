'use client'

import { useEffect, useState, useCallback } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable, { Column } from '@/components/admin/DataTable'
import PaginationControls from '@/components/admin/PaginationControls'
import FilterBar, { FilterConfig } from '@/components/admin/FilterBar'

interface ServiceMatch {
  id: string
  client1Name: string
  client1Email: string
  client2Name: string
  client2Email: string
  matchedAt: string
  status: 'INTRODUCED' | 'DATING' | 'ENGAGED' | 'MARRIED' | 'DECLINED' | 'ARCHIVED'
  notes: string | null
  outcome: string | null
}

type MatchForm = {
  client1Name: string
  client1Email: string
  client2Name: string
  client2Email: string
  matchedAt: string
  notes: string
  outcome: string
}

const EMPTY_FORM: MatchForm = { client1Name: '', client1Email: '', client2Name: '', client2Email: '', matchedAt: '', notes: '', outcome: '' }

const STATUS_FILTERS: FilterConfig[] = [{
  key: 'status', label: 'Status',
  options: [
    { value: 'INTRODUCED', label: 'Introduced' },
    { value: 'DATING', label: 'Dating' },
    { value: 'ENGAGED', label: 'Engaged' },
    { value: 'MARRIED', label: 'Married' },
    { value: 'DECLINED', label: 'Declined' },
    { value: 'ARCHIVED', label: 'Archived' },
    { value: 'ALL', label: 'All' },
  ],
}]

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  INTRODUCED: { bg: 'rgba(59,130,246,0.12)',  color: '#2563eb' },
  DATING:     { bg: 'rgba(168,85,247,0.12)',  color: '#9333ea' },
  ENGAGED:    { bg: 'rgba(234,179,8,0.12)',   color: '#ca8a04' },
  MARRIED:    { bg: 'rgba(185,28,28,0.12)',   color: '#b91c1c' },
  DECLINED:   { bg: 'rgba(107,114,128,0.12)', color: '#6b7280' },
  ARCHIVED:   { bg: 'rgba(156,163,175,0.12)', color: '#9ca3af' },
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: 'var(--space-2) var(--space-3)', background: 'var(--color-bg-elevated)',
  border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)',
  color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', boxSizing: 'border-box', fontFamily: 'inherit',
}

export default function MatchingMatchesPage() {
  const [matches, setMatches] = useState<ServiceMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selected, setSelected] = useState<ServiceMatch | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<MatchForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const fetchMatches = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(page), status: statusFilter })
      const res = await fetch(`/api/admin/matching-matches?${params}`)
      const data = await res.json()
      setMatches(data.items ?? [])
      setTotalItems(data.totalItems ?? 0)
      setTotalPages(data.totalPages ?? 1)
    } catch (err) {
      console.error(err)
    }
  }, [page, statusFilter])

  useEffect(() => {
    fetchMatches().finally(() => setLoading(false))
  }, [fetchMatches])

  const openEdit = (match: ServiceMatch) => {
    setSelected(match)
    setForm({
      client1Name: match.client1Name,
      client1Email: match.client1Email,
      client2Name: match.client2Name,
      client2Email: match.client2Email,
      matchedAt: match.matchedAt ? new Date(match.matchedAt).toISOString().slice(0, 10) : '',
      notes: match.notes ?? '',
      outcome: match.outcome ?? '',
    })
    setFormError('')
  }

  const handleSave = async (isNew: boolean) => {
    setFormError('')
    if (!form.client1Name.trim() || !form.client1Email.trim() || !form.client2Name.trim() || !form.client2Email.trim()) {
      setFormError('Both client names and emails are required')
      return
    }
    setSaving(true)
    try {
      const method = isNew ? 'POST' : 'PATCH'
      const body = isNew ? form : { id: selected!.id, ...form }
      const res = await fetch('/api/admin/matching-matches', {
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
      await fetchMatches()
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    await fetch('/api/admin/matching-matches', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: status as ServiceMatch['status'] } : null)
    await fetchMatches()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this match record?')) return
    await fetch(`/api/admin/matching-matches?id=${id}`, { method: 'DELETE' })
    setSelected(null)
    await fetchMatches()
  }

  const statusBadge = (status: ServiceMatch['status']) => {
    const s = STATUS_STYLE[status] ?? STATUS_STYLE.INTRODUCED
    return <span style={{ fontSize: 'var(--text-xs)', padding: '2px 8px', backgroundColor: s.bg, color: s.color, borderRadius: 'var(--radius-sm)', fontWeight: 'var(--font-semibold)' }}>{status}</span>
  }

  const columns: Column<ServiceMatch>[] = [
    {
      key: 'client1Name', label: 'Client 1',
      render: m => (
        <div>
          <div style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>{m.client1Name}</div>
          <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>{m.client1Email}</div>
        </div>
      ),
    },
    {
      key: 'client2Name', label: 'Client 2',
      render: m => (
        <div>
          <div style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>{m.client2Name}</div>
          <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>{m.client2Email}</div>
        </div>
      ),
    },
    {
      key: 'matchedAt', label: 'Matched',
      render: m => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{new Date(m.matchedAt).toLocaleDateString()}</span>,
    },
    { key: 'status', label: 'Status', render: m => statusBadge(m.status) },
    {
      key: 'outcome', label: 'Outcome',
      render: m => m.outcome
        ? <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{m.outcome}</span>
        : <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>—</span>,
    },
  ]

  const modal = (isNew: boolean) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}
      onClick={e => { if (e.target === e.currentTarget) { setShowForm(false); setSelected(null) } }}>
      <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', fontSize: 'var(--text-xl)' }}>
            {isNew ? 'Record Match' : 'Edit Match'}
          </h2>
          <button onClick={() => { setShowForm(false); setSelected(null) }} style={{ background: 'none', border: 'none', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontSize: 'var(--text-lg)' }}>✕</button>
        </div>

        {formError && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-error)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>{formError}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Client 1 */}
          <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
            <p style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 'var(--font-semibold)' }}>Client 1</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>Name *</label>
                <input style={inputStyle} value={form.client1Name} onChange={e => setForm(f => ({ ...f, client1Name: e.target.value }))} placeholder="Full name" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>Email *</label>
                <input style={inputStyle} type="email" value={form.client1Email} onChange={e => setForm(f => ({ ...f, client1Email: e.target.value }))} placeholder="email@example.com" />
              </div>
            </div>
          </div>

          {/* Client 2 */}
          <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
            <p style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 'var(--font-semibold)' }}>Client 2</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>Name *</label>
                <input style={inputStyle} value={form.client2Name} onChange={e => setForm(f => ({ ...f, client2Name: e.target.value }))} placeholder="Full name" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>Email *</label>
                <input style={inputStyle} type="email" value={form.client2Email} onChange={e => setForm(f => ({ ...f, client2Email: e.target.value }))} placeholder="email@example.com" />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Match Date</label>
              <input style={inputStyle} type="date" value={form.matchedAt} onChange={e => setForm(f => ({ ...f, matchedAt: e.target.value }))} />
            </div>
            {!isNew && (
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</label>
                <select style={inputStyle} value={selected?.status} onChange={e => handleStatusChange(selected!.id, e.target.value)}>
                  {['INTRODUCED', 'DATING', 'ENGAGED', 'MARRIED', 'DECLINED', 'ARCHIVED'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Internal Notes</label>
            <textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties} rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Compatibility notes, observations…" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Outcome</label>
            <textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties} rows={2} value={form.outcome} onChange={e => setForm(f => ({ ...f, outcome: e.target.value }))} placeholder="How did this match progress?" />
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
        title="Completed Matches"
        breadcrumbs={[{ label: 'Professional Matching' }, { label: 'Matches' }]}
        actions={
          <button onClick={() => { setForm(EMPTY_FORM); setFormError(''); setShowForm(true) }}
            style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', cursor: 'pointer' }}>
            + Record Match
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
          <DataTable<ServiceMatch> columns={columns} data={matches} keyField="id" emptyMessage="No matches recorded yet" onRowClick={openEdit} />
          <PaginationControls page={page} totalPages={totalPages} totalItems={totalItems} onPageChange={setPage} />
        </>
      )}

      {showForm && modal(true)}
      {selected && !showForm && modal(false)}
    </>
  )
}
