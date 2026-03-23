'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import StatusBadge from '@/components/admin/StatusBadge'
import SearchInput from '@/components/admin/SearchInput'
import PaginationControls from '@/components/admin/PaginationControls'

interface CmsPage {
  id: string
  slug: string
  title: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  updatedAt: string
  createdAt: string
  publishedAt: string | null
}

export default function AdminPagesPage() {
  const router = useRouter()
  const [pages, setPages] = useState<CmsPage[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchPages = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '25' })
      if (search) params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)
      const res = await fetch(`/api/admin/pages?${params}`)
      const data = await res.json()
      setPages(data.items)
      setTotalPages(data.totalPages)
      setTotalItems(data.totalItems)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => { fetchPages() }, [fetchPages])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete page "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/pages?id=${id}`, { method: 'DELETE' })
      await fetchPages()
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(null)
    }
  }

  const selectStyle: React.CSSProperties = {
    padding: 'var(--space-2) var(--space-3)',
    fontSize: 'var(--text-sm)',
    backgroundColor: 'var(--color-bg-tertiary)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text-primary)',
    outline: 'none',
    fontFamily: 'var(--font-body)',
  }

  return (
    <>
      <AdminPageHeader
        title="CMS Pages"
        breadcrumbs={[{ label: 'Pages' }]}
        actions={
          <button
            onClick={() => router.push('/admin/pages/new')}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
            }}
          >
            New Page
          </button>
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        <SearchInput
          value={search}
          onChange={(val) => { setSearch(val); setPage(1) }}
          placeholder="Search pages..."
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          style={selectStyle}
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ color: 'var(--color-text-tertiary)', padding: 'var(--space-8)', textAlign: 'center' }}>Loading...</div>
      ) : pages.length === 0 ? (
        <div style={{
          padding: 'var(--space-8)',
          textAlign: 'center',
          color: 'var(--color-text-tertiary)',
          backgroundColor: 'var(--color-bg-elevated)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-subtle)',
        }}>
          No pages found. Create your first page to get started.
        </div>
      ) : (
        <div style={{
          backgroundColor: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                {['Title', 'Slug', 'Status', 'Updated', 'Actions'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: 'var(--space-3) var(--space-4)',
                      textAlign: 'left',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--color-text-tertiary)',
                      textTransform: 'uppercase',
                      letterSpacing: 'var(--tracking-wide)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: '1px solid var(--color-border-subtle)',
                    cursor: 'pointer',
                    transition: 'background var(--transition-fast)',
                  }}
                  onClick={() => router.push(`/admin/pages/${p.id}`)}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>
                    {p.title}
                  </td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    /{p.slug}
                  </td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                    <StatusBadge label={p.status} />
                  </td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/admin/pages/${p.id}`) }}
                        style={{
                          padding: 'var(--space-1) var(--space-3)',
                          fontSize: 'var(--text-xs)',
                          backgroundColor: 'transparent',
                          border: '1px solid var(--color-border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--color-text-secondary)',
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                      {p.status === 'PUBLISHED' && (
                        <a
                          href={`/p/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            padding: 'var(--space-1) var(--space-3)',
                            fontSize: 'var(--text-xs)',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--color-border-subtle)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                        >
                          View
                        </a>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(p.id, p.title) }}
                        disabled={deleting === p.id}
                        style={{
                          padding: 'var(--space-1) var(--space-3)',
                          fontSize: 'var(--text-xs)',
                          backgroundColor: 'transparent',
                          border: '1px solid var(--color-error)',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--color-error)',
                          cursor: deleting === p.id ? 'not-allowed' : 'pointer',
                          opacity: deleting === p.id ? 0.5 : 1,
                        }}
                      >
                        {deleting === p.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div style={{ padding: 'var(--space-3) var(--space-4)', borderTop: '1px solid var(--color-border-subtle)' }}>
              <PaginationControls page={page} totalPages={totalPages} totalItems={totalItems} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}
    </>
  )
}
