'use client'

import { useEffect, useState, useCallback } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable, { Column } from '@/components/admin/DataTable'
import FilterBar, { FilterConfig } from '@/components/admin/FilterBar'
import PaginationControls from '@/components/admin/PaginationControls'
import StatusBadge from '@/components/admin/StatusBadge'

interface ReportRow {
  id: string
  reason: string
  details: string | null
  category: string
  status: string
  severity: number
  createdAt: string
  assignedTo: string | null
  reporter: {
    id: string
    email: string
    profile: { firstName: string; lastName: string } | null
  }
  reported: {
    id: string
    email: string
    status: string
    profile: { firstName: string; lastName: string } | null
  }
}

const filters: FilterConfig[] = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { label: 'Open', value: 'OPEN' },
      { label: 'In Review', value: 'IN_REVIEW' },
      { label: 'Resolved', value: 'RESOLVED' },
      { label: 'Dismissed', value: 'DISMISSED' },
      { label: 'Escalated', value: 'ESCALATED' },
    ],
  },
  {
    key: 'category',
    label: 'Category',
    options: [
      { label: 'Fake Profile', value: 'FAKE_PROFILE' },
      { label: 'Inappropriate Photo', value: 'INAPPROPRIATE_PHOTO' },
      { label: 'Inappropriate Message', value: 'INAPPROPRIATE_MESSAGE' },
      { label: 'Harassment', value: 'HARASSMENT' },
      { label: 'Spam', value: 'SPAM' },
      { label: 'Underage', value: 'UNDERAGE' },
    ],
  },
  {
    key: 'severity',
    label: 'Min Severity',
    options: [
      { label: '1+', value: '1' },
      { label: '2+ (High)', value: '2' },
      { label: '3 (Critical)', value: '3' },
    ],
  },
]

export default function ReportQueuePage() {
  const [reports, setReports] = useState<ReportRow[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})

  const fetchReports = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '25' })
    Object.entries(filterValues).forEach(([k, v]) => { if (v) params.set(k, v) })

    try {
      const res = await fetch(`/api/admin/moderation/reports?${params}`)
      const data = await res.json()
      setReports(data.items)
      setTotalPages(data.totalPages)
      setTotalItems(data.totalItems)
    } catch (err) {
      console.error('Failed to load reports:', err)
    } finally {
      setLoading(false)
    }
  }, [page, filterValues])

  useEffect(() => { fetchReports() }, [fetchReports])

  const updateReport = async (reportId: string, status: string, resolution?: string) => {
    try {
      await fetch('/api/admin/moderation/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status, resolution }),
      })
      await fetchReports()
    } catch (err) {
      console.error('Failed to update report:', err)
    }
  }

  const formatName = (user: { email: string; profile: { firstName: string; lastName: string } | null }) =>
    user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user.email

  const severityLabel = (s: number) => {
    switch (s) {
      case 3: return { label: 'CRITICAL', variant: 'error' as const }
      case 2: return { label: 'HIGH', variant: 'warning' as const }
      case 1: return { label: 'MEDIUM', variant: 'info' as const }
      default: return { label: 'LOW', variant: 'neutral' as const }
    }
  }

  const columns: Column<ReportRow>[] = [
    {
      key: 'severity',
      label: 'Severity',
      width: '90px',
      render: (r) => {
        const s = severityLabel(r.severity)
        return <StatusBadge label={s.label} variant={s.variant} />
      },
    },
    {
      key: 'category',
      label: 'Category',
      render: (r) => <StatusBadge label={r.category} />,
    },
    {
      key: 'reporter',
      label: 'Reporter',
      render: (r) => (
        <a href={`/admin/users/${r.reporter.id}`} style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>
          {formatName(r.reporter)}
        </a>
      ),
    },
    {
      key: 'reported',
      label: 'Reported User',
      render: (r) => (
        <a href={`/admin/users/${r.reported.id}`} style={{ color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
          {formatName(r.reported)}
        </a>
      ),
    },
    {
      key: 'reason',
      label: 'Reason',
      render: (r) => (
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
          {r.reason}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => <StatusBadge label={r.status} />,
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (r) => (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
          {new Date(r.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      width: '180px',
      render: (r) => {
        if (r.status === 'RESOLVED' || r.status === 'DISMISSED') return null
        return (
          <div style={{ display: 'flex', gap: 'var(--space-1)' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => updateReport(r.id, 'RESOLVED', 'Reviewed and resolved')}
              style={{
                padding: '2px 8px',
                fontSize: 'var(--text-xs)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                color: 'var(--color-success)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              Resolve
            </button>
            <button
              onClick={() => updateReport(r.id, 'DISMISSED', 'Dismissed')}
              style={{
                padding: '2px 8px',
                fontSize: 'var(--text-xs)',
                backgroundColor: 'rgba(161, 161, 170, 0.1)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              Dismiss
            </button>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <AdminPageHeader title="Report Queue" breadcrumbs={[{ label: 'Moderation', href: '/admin/moderation' }, { label: 'Reports' }]} />

      <div style={{ marginBottom: 'var(--space-4)' }}>
        <FilterBar
          filters={filters}
          values={filterValues}
          onChange={(k, v) => { setFilterValues(prev => ({ ...prev, [k]: v })); setPage(1) }}
          onClear={() => { setFilterValues({}); setPage(1) }}
        />
      </div>

      <DataTable<ReportRow>
        columns={columns}
        data={reports}
        keyField="id"
        loading={loading}
        emptyMessage="No reports found"
      />

      <PaginationControls page={page} totalPages={totalPages} totalItems={totalItems} onPageChange={setPage} />
    </>
  )
}
