'use client'

import { useEffect, useState, useCallback } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable, { Column } from '@/components/admin/DataTable'
import PaginationControls from '@/components/admin/PaginationControls'
import StatusBadge from '@/components/admin/StatusBadge'
import FilterBar, { FilterConfig } from '@/components/admin/FilterBar'

interface AuditEntry {
  id: string
  action: string
  reason: string
  metadata: Record<string, unknown> | null
  isReverted: boolean
  createdAt: string
  admin: {
    email: string
    profile: { firstName: string | null; lastName: string | null } | null
  }
  target: {
    email: string
    profile: { firstName: string | null; lastName: string | null } | null
  }
}

const ACTION_FILTERS: FilterConfig[] = [
  {
    key: 'action',
    label: 'Action',
    options: [
      { value: 'USER_SUSPENDED', label: 'Suspended' },
      { value: 'USER_BANNED', label: 'Banned' },
      { value: 'USER_WARNED', label: 'Warned' },
      { value: 'USER_UNSUSPENDED', label: 'Unsuspended' },
      { value: 'USER_UNBANNED', label: 'Unbanned' },
      { value: 'PHOTO_APPROVED', label: 'Photo Approved' },
      { value: 'PHOTO_REJECTED', label: 'Photo Rejected' },
      { value: 'TIER_CHANGED', label: 'Tier Changed' },
      { value: 'PROFILE_VERIFIED', label: 'Profile Verified' },
      { value: 'PROFILE_FLAGGED', label: 'Profile Flagged' },
      { value: 'PROFILE_DEACTIVATED', label: 'Profile Deactivated' },
    ],
  },
]

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [actionFilter, setActionFilter] = useState('')

  const fetchEntries = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(page) })
      if (actionFilter) params.set('action', actionFilter)
      const res = await fetch(`/api/admin/audit-log?${params}`)
      const data = await res.json()
      setEntries(data.items)
      setTotal(data.totalItems)
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, actionFilter])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  const formatName = (entry: { email: string; profile: { firstName: string | null; lastName: string | null } | null }) => {
    if (entry.profile?.firstName) return `${entry.profile.firstName} ${entry.profile.lastName ?? ''}`.trim()
    return entry.email
  }

  const columns: Column<AuditEntry>[] = [
    {
      key: 'createdAt', label: 'Time', width: '160px',
      render: (e) => (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
          {new Date(e.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'admin', label: 'Admin',
      render: (e) => <span style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>{formatName(e.admin)}</span>,
    },
    {
      key: 'action', label: 'Action',
      render: (e) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <StatusBadge label={e.action} />
          {e.isReverted && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-warning, #f59e0b)', fontStyle: 'italic' }}>reverted</span>}
        </div>
      ),
    },
    {
      key: 'target', label: 'Target',
      render: (e) => <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>{formatName(e.target)}</span>,
    },
    {
      key: 'reason', label: 'Reason',
      render: (e) => (
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {e.reason}
        </div>
      ),
    },
  ]

  return (
    <>
      <AdminPageHeader title="Audit Log" breadcrumbs={[{ label: 'Audit Log' }]} />

      <div style={{ marginBottom: 'var(--space-4)' }}>
        <FilterBar
          filters={ACTION_FILTERS}
          values={{ action: actionFilter }}
          onChange={(key, val) => { if (key === 'action') { setActionFilter(val); setPage(1) } }}
          onClear={() => { setActionFilter(''); setPage(1) }}
        />
      </div>

      {loading ? (
        <div style={{ color: 'var(--color-text-tertiary)' }}>Loading...</div>
      ) : (
        <>
          <DataTable<AuditEntry> columns={columns} data={entries} keyField="id" emptyMessage="No audit log entries" />
          <PaginationControls page={page} totalPages={totalPages} totalItems={total} onPageChange={setPage} />
        </>
      )}
    </>
  )
}
