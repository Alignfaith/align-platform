'use client'

import { useEffect, useState, useCallback } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import PaginationControls from '@/components/admin/PaginationControls'

interface PendingPhoto {
  id: string
  url: string
  createdAt: string
  profile: {
    firstName: string
    lastName: string
    userId: string
  }
}

export default function PhotoModerationPage() {
  const [photos, setPhotos] = useState<PendingPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [processing, setProcessing] = useState(false)

  const fetchPhotos = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/moderation/photos?page=${page}&limit=20`)
      const data = await res.json()
      setPhotos(data.items)
      setTotalPages(data.totalPages)
      setTotalItems(data.totalItems)
    } catch (err) {
      console.error('Failed to load photos:', err)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { fetchPhotos() }, [fetchPhotos])

  const handleAction = async (action: 'approve' | 'reject', photoIds: string[]) => {
    if (photoIds.length === 0) return
    setProcessing(true)
    try {
      await fetch('/api/admin/moderation/photos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoIds, action }),
      })
      setSelected(new Set())
      await fetchPhotos()
    } catch (err) {
      console.error('Action failed:', err)
    } finally {
      setProcessing(false)
    }
  }

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    if (selected.size === photos.length) setSelected(new Set())
    else setSelected(new Set(photos.map((p) => p.id)))
  }

  const bulkBtnStyle: React.CSSProperties = {
    padding: 'var(--space-2) var(--space-4)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-semibold)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: processing ? 'not-allowed' : 'pointer',
    opacity: processing ? 0.5 : 1,
  }

  return (
    <>
      <AdminPageHeader
        title="Photo Queue"
        breadcrumbs={[{ label: 'Moderation', href: '/admin/moderation' }, { label: 'Photos' }]}
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button onClick={selectAll} style={{ ...bulkBtnStyle, backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border-subtle)' }}>
              {selected.size === photos.length && photos.length > 0 ? 'Deselect All' : 'Select All'}
            </button>
            {selected.size > 0 && (
              <>
                <button
                  onClick={() => handleAction('approve', Array.from(selected))}
                  style={{ ...bulkBtnStyle, backgroundColor: 'var(--color-success)', color: 'var(--color-white)' }}
                  disabled={processing}
                >
                  Approve ({selected.size})
                </button>
                <button
                  onClick={() => handleAction('reject', Array.from(selected))}
                  style={{ ...bulkBtnStyle, backgroundColor: 'var(--color-error)', color: 'var(--color-white)' }}
                  disabled={processing}
                >
                  Reject ({selected.size})
                </button>
              </>
            )}
          </div>
        }
      />

      {loading ? (
        <div style={{ color: 'var(--color-text-tertiary)', padding: 'var(--space-8)' }}>Loading photos...</div>
      ) : photos.length === 0 ? (
        <div
          style={{
            padding: 'var(--space-12)',
            textAlign: 'center',
            color: 'var(--color-text-tertiary)',
            backgroundColor: 'var(--color-bg-elevated)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          No photos pending review
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          {photos.map((photo) => (
            <div
              key={photo.id}
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                border: `2px solid ${selected.has(photo.id) ? 'var(--color-primary)' : 'var(--color-border-subtle)'}`,
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'border-color var(--transition-fast)',
              }}
              onClick={() => toggleSelect(photo.id)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt=""
                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: 'var(--space-2) var(--space-3)' }}>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>
                  <a href={`/admin/users/${photo.profile.userId}`} style={{ color: 'var(--color-text-primary)', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
                    {photo.profile.firstName} {photo.profile.lastName}
                  </a>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                  {new Date(photo.createdAt).toLocaleDateString()}
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-1)', marginTop: 'var(--space-2)' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAction('approve', [photo.id]) }}
                    style={{
                      flex: 1,
                      padding: 'var(--space-1)',
                      fontSize: 'var(--text-xs)',
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      color: 'var(--color-success)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontWeight: 'var(--font-semibold)',
                    }}
                    disabled={processing}
                  >
                    Approve
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAction('reject', [photo.id]) }}
                    style={{
                      flex: 1,
                      padding: 'var(--space-1)',
                      fontSize: 'var(--text-xs)',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: 'var(--color-error)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontWeight: 'var(--font-semibold)',
                    }}
                    disabled={processing}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <PaginationControls page={page} totalPages={totalPages} totalItems={totalItems} onPageChange={setPage} />
    </>
  )
}
