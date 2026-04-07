'use client'

import { useEffect, useState, useCallback } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable, { Column } from '@/components/admin/DataTable'
import PaginationControls from '@/components/admin/PaginationControls'
import SearchInput from '@/components/admin/SearchInput'
import FilterBar, { FilterConfig } from '@/components/admin/FilterBar'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

interface GrowthPost {
  id: string
  pillar: string
  content: string
  imageUrl: string | null
  createdAt: string
  profile: {
    firstName: string | null
    lastName: string | null
    user: { email: string }
  }
}


const PILLAR_FILTERS: FilterConfig[] = [
  {
    key: 'pillar',
    label: 'Pillar',
    options: [
      { value: 'SPIRITUAL', label: 'Spiritual' },
      { value: 'MENTAL', label: 'Mental' },
      { value: 'PHYSICAL', label: 'Physical' },
      { value: 'FINANCIAL', label: 'Financial' },
      { value: 'APPEARANCE', label: 'Appearance' },
      { value: 'INTIMACY', label: 'Intimacy' },
    ],
  },
]

export default function CommunityPage() {
  const [posts, setPosts] = useState<GrowthPost[]>([])
  const [loading, setLoading] = useState(true)

  const [postPage, setPostPage] = useState(1)
  const [postTotal, setPostTotal] = useState(0)
  const [postTotalPages, setPostTotalPages] = useState(1)
  const [postSearch, setPostSearch] = useState('')
  const [postPillar, setPostPillar] = useState('')

  const [removeTarget, setRemoveTarget] = useState<GrowthPost | null>(null)

  const fetchPosts = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(postPage) })
      if (postSearch) params.set('search', postSearch)
      if (postPillar) params.set('pillar', postPillar)
      const res = await fetch(`/api/admin/community/growth-posts?${params}`)
      const data = await res.json()
      setPosts(data.items)
      setPostTotal(data.totalItems)
      setPostTotalPages(data.totalPages)
    } catch (err) {
      console.error(err)
    }
  }, [postPage, postSearch, postPillar])

  useEffect(() => {
    fetchPosts().finally(() => setLoading(false))
  }, [fetchPosts])

  const removePost = async () => {
    if (!removeTarget) return
    await fetch('/api/admin/community/growth-posts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: removeTarget.id, action: 'remove' }),
    })
    setRemoveTarget(null)
    await fetchPosts()
  }

  const postColumns: Column<GrowthPost>[] = [
    {
      key: 'profile', label: 'Author',
      render: (p) => (
        <div>
          <div style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>{p.profile.firstName ?? ''} {p.profile.lastName ?? ''}</div>
          <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>{p.profile.user.email}</div>
        </div>
      ),
    },
    {
      key: 'pillar', label: 'Pillar',
      render: (p) => (
        <span style={{ fontSize: 'var(--text-xs)', padding: '2px 8px', backgroundColor: 'rgba(139,92,246,0.1)', color: 'var(--color-primary-light, #a78bfa)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(139,92,246,0.3)' }}>
          {p.pillar}
        </span>
      ),
    },
    {
      key: 'content', label: 'Content',
      render: (p) => (
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {p.content}
        </div>
      ),
    },
    {
      key: 'createdAt', label: 'Date',
      render: (p) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{new Date(p.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: 'actions', label: '', width: '80px',
      render: (p) => (
        <button onClick={(ev) => { ev.stopPropagation(); setRemoveTarget(p) }} style={{ padding: '2px 8px', fontSize: 'var(--text-xs)', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--color-error)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
          Remove
        </button>
      ),
    },
  ]


  if (loading) return <div style={{ color: 'var(--color-text-tertiary)', padding: 'var(--space-8)' }}>Loading...</div>

  return (
    <>
      <AdminPageHeader title="User Activity" breadcrumbs={[{ label: 'User Activity' }]} />

      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', alignItems: 'center' }}>
        <SearchInput value={postSearch} onChange={(v) => { setPostSearch(v); setPostPage(1) }} placeholder="Search weekly reflections..." />
        <FilterBar
          filters={PILLAR_FILTERS}
          values={{ pillar: postPillar }}
          onChange={(key, val) => { if (key === 'pillar') { setPostPillar(val); setPostPage(1) } }}
          onClear={() => { setPostPillar(''); setPostPage(1) }}
        />
      </div>
      <DataTable<GrowthPost> columns={postColumns} data={posts} keyField="id" emptyMessage="No weekly reflections" />
      <PaginationControls page={postPage} totalPages={postTotalPages} totalItems={postTotal} onPageChange={setPostPage} />

      {removeTarget && (
        <ConfirmDialog
          open={true}
          title="Remove Growth Post"
          message={`Remove this growth post by ${removeTarget.profile.firstName ?? removeTarget.profile.user.email}? This cannot be undone.`}
          confirmLabel="Remove"
          confirmVariant="danger"
          onConfirm={removePost}
          onCancel={() => setRemoveTarget(null)}
        />
      )}
    </>
  )
}
