'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable, { Column } from '@/components/admin/DataTable'
import SearchInput from '@/components/admin/SearchInput'
import FilterBar, { FilterConfig } from '@/components/admin/FilterBar'
import PaginationControls from '@/components/admin/PaginationControls'
import StatusBadge from '@/components/admin/StatusBadge'

interface UserRow {
  id: string
  email: string
  role: string
  status: string
  tier: string
  createdAt: string
  lastActiveAt: string
  profile: {
    firstName: string
    lastName: string
    displayName: string | null
    gender: string
    isComplete: boolean
    isVerified: boolean
    isActive: boolean
    photos: { url: string }[]
  } | null
}

const filters: FilterConfig[] = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { label: 'Active', value: 'ACTIVE' },
      { label: 'Suspended', value: 'SUSPENDED' },
      { label: 'Banned', value: 'BANNED' },
      { label: 'Deactivated', value: 'DEACTIVATED' },
    ],
  },
  {
    key: 'tier',
    label: 'Tier',
    options: [
      { label: 'Free', value: 'FREE' },
      { label: 'Tier 1', value: 'TIER_1' },
      { label: 'Tier 2', value: 'TIER_2' },
    ],
  },
  {
    key: 'gender',
    label: 'Gender',
    options: [
      { label: 'Male', value: 'MALE' },
      { label: 'Female', value: 'FEMALE' },
    ],
  },
  {
    key: 'profileComplete',
    label: 'Profile',
    options: [
      { label: 'Complete', value: 'true' },
      { label: 'Incomplete', value: 'false' },
    ],
  },
]

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [search, setSearch] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '25' })
    if (search) params.set('q', search)
    Object.entries(filterValues).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })

    try {
      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json()
      setUsers(data.items)
      setTotalPages(data.totalPages)
      setTotalItems(data.totalItems)
    } catch (err) {
      console.error('Failed to load users:', err)
    } finally {
      setLoading(false)
    }
  }, [page, search, filterValues])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h`
    return `${Math.floor(hours / 24)}d`
  }

  const columns: Column<UserRow>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (user) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-bg-tertiary)',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {user.profile?.photos?.[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.profile.photos[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>
          <div>
            <div style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>
              {user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : '—'}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (user) => <StatusBadge label={user.status} />,
    },
    {
      key: 'tier',
      label: 'Tier',
      render: (user) => <StatusBadge label={user.tier} />,
    },
    {
      key: 'role',
      label: 'Role',
      render: (user) => <StatusBadge label={user.role} />,
    },
    {
      key: 'profileComplete',
      label: 'Profile',
      render: (user) => (
        <span style={{ color: user.profile?.isComplete ? 'var(--color-success)' : 'var(--color-text-tertiary)' }}>
          {user.profile?.isComplete ? 'Complete' : 'Incomplete'}
        </span>
      ),
    },
    {
      key: 'lastActiveAt',
      label: 'Last Active',
      sortable: true,
      render: (user) => (
        <span style={{ color: 'var(--color-text-tertiary)' }}>{timeAgo(user.lastActiveAt)}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      sortable: true,
      render: (user) => (
        <span style={{ color: 'var(--color-text-tertiary)' }}>
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ]

  return (
    <>
      <AdminPageHeader title="Users" breadcrumbs={[{ label: 'Users' }]} />

      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search by name or email..." />
        <FilterBar
          filters={filters}
          values={filterValues}
          onChange={(k, v) => { setFilterValues(prev => ({ ...prev, [k]: v })); setPage(1) }}
          onClear={() => { setFilterValues({}); setPage(1) }}
        />
      </div>

      <DataTable<UserRow>
        columns={columns}
        data={users}
        keyField="id"
        loading={loading}
        onRowClick={(user) => router.push(`/admin/users/${user.id}`)}
        emptyMessage="No users found"
      />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
      />
    </>
  )
}
