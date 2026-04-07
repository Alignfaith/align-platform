'use client'

import { useEffect, useState, useCallback } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable, { Column } from '@/components/admin/DataTable'
import PaginationControls from '@/components/admin/PaginationControls'
import FilterBar, { FilterConfig } from '@/components/admin/FilterBar'

interface AlignmentStory {
  id: string
  displayName: string
  photoUrl: string | null
  story: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  rejectionReason: string | null
  createdAt: string
  reviewedAt: string | null
  user: { email: string }
}

const STATUS_FILTERS: FilterConfig[] = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'PENDING', label: 'Pending' },
      { value: 'APPROVED', label: 'Approved' },
      { value: 'REJECTED', label: 'Rejected' },
      { value: 'ALL', label: 'All' },
    ],
  },
]

export default function AlignmentStoriesAdminPage() {
  const [stories, setStories] = useState<AlignmentStory[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [selectedStory, setSelectedStory] = useState<AlignmentStory | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [processing, setProcessing] = useState(false)
  const [actionError, setActionError] = useState('')

  const fetchStories = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(page), status: statusFilter })
      const res = await fetch(`/api/admin/alignment-stories?${params}`)
      const data = await res.json()
      setStories(data.items)
      setTotalItems(data.totalItems)
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error(err)
    }
  }, [page, statusFilter])

  useEffect(() => {
    fetchStories().finally(() => setLoading(false))
  }, [fetchStories])

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessing(true)
    setActionError('')
    try {
      const res = await fetch('/api/admin/alignment-stories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, rejectionReason: action === 'reject' ? rejectReason : undefined }),
      })
      if (!res.ok) {
        const d = await res.json()
        setActionError(d.error || 'Action failed')
        return
      }
      setSelectedStory(null)
      setRejectReason('')
      await fetchStories()
    } finally {
      setProcessing(false)
    }
  }

  const statusBadge = (status: AlignmentStory['status']) => {
    const styles: Record<string, { bg: string; color: string }> = {
      PENDING:  { bg: 'rgba(234,179,8,0.1)',  color: '#ca8a04' },
      APPROVED: { bg: 'rgba(34,197,94,0.1)',  color: '#16a34a' },
      REJECTED: { bg: 'rgba(239,68,68,0.1)',  color: 'var(--color-error)' },
    }
    const s = styles[status] || styles.PENDING
    return (
      <span style={{ fontSize: 'var(--text-xs)', padding: '2px 8px', backgroundColor: s.bg, color: s.color, borderRadius: 'var(--radius-sm)', border: `1px solid ${s.bg}`, fontWeight: 'var(--font-semibold)' }}>
        {status}
      </span>
    )
  }

  const columns: Column<AlignmentStory>[] = [
    {
      key: 'displayName', label: 'Submitter',
      render: (s) => (
        <div>
          <div style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>{s.displayName}</div>
          <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>{s.user.email}</div>
        </div>
      ),
    },
    {
      key: 'story', label: 'Story Preview',
      render: (s) => (
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', maxWidth: '380px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {s.story}
        </div>
      ),
    },
    {
      key: 'photoUrl', label: 'Photo',
      render: (s) => s.photoUrl
        ? <img src={s.photoUrl} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)' }} />
        : <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>None</span>,
    },
    {
      key: 'status', label: 'Status',
      render: (s) => statusBadge(s.status),
    },
    {
      key: 'createdAt', label: 'Submitted',
      render: (s) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{new Date(s.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: 'actions', label: '', width: '120px',
      render: (s) => (
        <button
          onClick={e => { e.stopPropagation(); setSelectedStory(s); setRejectReason(''); setActionError('') }}
          style={{ padding: '2px 10px', fontSize: 'var(--text-xs)', backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
        >
          Review
        </button>
      ),
    },
  ]

  return (
    <>
      <AdminPageHeader title="Alignment Stories" breadcrumbs={[{ label: 'Alignment Stories' }]} />

      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', alignItems: 'center' }}>
        <FilterBar
          filters={STATUS_FILTERS}
          values={{ status: statusFilter }}
          onChange={(key, val) => { if (key === 'status') { setStatusFilter(val); setPage(1) } }}
          onClear={() => { setStatusFilter('PENDING'); setPage(1) }}
        />
        <span style={{ marginLeft: 'auto', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>{totalItems} total</span>
      </div>

      {loading ? (
        <div style={{ color: 'var(--color-text-tertiary)', padding: 'var(--space-8)' }}>Loading…</div>
      ) : (
        <>
          <DataTable<AlignmentStory>
            columns={columns}
            data={stories}
            keyField="id"
            emptyMessage="No stories"
            onRowClick={s => { setSelectedStory(s); setRejectReason(''); setActionError('') }}
          />
          <PaginationControls page={page} totalPages={totalPages} totalItems={totalItems} onPageChange={setPage} />
        </>
      )}

      {/* Review modal */}
      {selectedStory && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}
          onClick={e => { if (e.target === e.currentTarget) setSelectedStory(null) }}
        >
          <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
              <div>
                <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', fontSize: 'var(--text-xl)' }}>Review Story</h2>
                <p style={{ margin: 0, color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>{selectedStory.user.email}</p>
              </div>
              <button onClick={() => setSelectedStory(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontSize: 'var(--text-lg)' }}>✕</button>
            </div>

            {selectedStory.photoUrl && (
              <img src={selectedStory.photoUrl} alt="" style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', border: '1px solid var(--color-border-subtle)' }} />
            )}

            <div style={{ marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Display Name</span>
              <p style={{ margin: '4px 0 0', color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)' }}>{selectedStory.displayName}</p>
            </div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Story</span>
              <p style={{ margin: '4px 0 0', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{selectedStory.story}</p>
            </div>

            <div style={{ marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</span>
              <div style={{ marginTop: '4px' }}>{statusBadge(selectedStory.status)}</div>
            </div>

            {actionError && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-error)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                {actionError}
              </div>
            )}

            {selectedStory.status === 'PENDING' && (
              <>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>
                    Rejection reason <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 'normal' }}>(optional, visible to member)</span>
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    rows={3}
                    placeholder="Why is this story being rejected?"
                    style={{ width: '100%', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <button
                    onClick={() => handleAction(selectedStory.id, 'approve')}
                    disabled={processing}
                    style={{ flex: 1, padding: 'var(--space-3)', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', color: '#16a34a', borderRadius: 'var(--radius-md)', cursor: processing ? 'not-allowed' : 'pointer', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleAction(selectedStory.id, 'reject')}
                    disabled={processing}
                    style={{ flex: 1, padding: 'var(--space-3)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-error)', borderRadius: 'var(--radius-md)', cursor: processing ? 'not-allowed' : 'pointer', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}
                  >
                    ✕ Reject
                  </button>
                </div>
              </>
            )}

            {selectedStory.status !== 'PENDING' && (
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                {selectedStory.status === 'REJECTED' && (
                  <button
                    onClick={() => handleAction(selectedStory.id, 'approve')}
                    disabled={processing}
                    style={{ flex: 1, padding: 'var(--space-3)', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', color: '#16a34a', borderRadius: 'var(--radius-md)', cursor: processing ? 'not-allowed' : 'pointer', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}
                  >
                    ✓ Approve
                  </button>
                )}
                {selectedStory.status === 'APPROVED' && (
                  <button
                    onClick={() => handleAction(selectedStory.id, 'reject')}
                    disabled={processing}
                    style={{ flex: 1, padding: 'var(--space-3)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-error)', borderRadius: 'var(--radius-md)', cursor: processing ? 'not-allowed' : 'pointer', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}
                  >
                    Unpublish
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
