'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

interface MediaItem {
  id: string
  sourceType: 'growth-post' | 'alignment-story' | 'profile-photo' | 'matching-application'
  imageUrl: string
  authorName: string | null
  authorEmail: string
  pillar: string | null
  createdAt: string
}

interface MediaStats {
  total: number
  thisWeek: number
  bySource: Record<string, number>
}

const SOURCE_LABELS: Record<string, string> = {
  'growth-post': 'Growth Post',
  'alignment-story': 'Alignment Story',
  'profile-photo': 'Profile Photo',
  'matching-application': 'Matching Application',
}

const SOURCE_COLORS: Record<string, string> = {
  'growth-post': 'var(--color-primary)',
  'alignment-story': '#7c3aed',
  'profile-photo': '#0284c7',
  'matching-application': '#b45309',
}

const PILLAR_LABELS: Record<string, string> = {
  SPIRITUAL: 'Spiritual',
  MENTAL: 'Mental',
  PHYSICAL: 'Physical',
  FINANCIAL: 'Financial',
  APPEARANCE: 'Appearance',
  INTIMACY: 'Intimacy',
}

function isSupabaseUrl(url: string) {
  return url.includes('supabase.co')
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [stats, setStats] = useState<MediaStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('all')
  const [period, setPeriod] = useState('all')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set())

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/media?stats=1')
      if (res.ok) setStats(await res.json())
    } catch {
      // non-blocking
    }
  }, [])

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ source, period })
      if (search) params.set('search', search)
      const res = await fetch(`/api/admin/media?${params}`)
      if (res.ok) {
        const data = await res.json()
        setItems(data.items ?? [])
      }
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [source, period, search])

  useEffect(() => { fetchStats() }, [fetchStats])
  useEffect(() => { fetchItems() }, [fetchItems])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
  }

  const handleImgError = (id: string) => {
    setImgErrors(prev => new Set(prev).add(id))
  }

  return (
    <div>
      <AdminPageHeader title="Media Gallery" />

      {/* Stats */}
      {stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <StatCard label="Total Photos" value={stats.total} />
          <StatCard label="This Week" value={stats.thisWeek} />
          {Object.entries(stats.bySource).map(([label, count]) => (
            <StatCard key={label} label={label} value={count} />
          ))}
        </div>
      )}

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-6)',
          alignItems: 'flex-end',
        }}
      >
        <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-medium)' }}>Source</span>
          <select
            value={source}
            onChange={e => setSource(e.target.value)}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              backgroundColor: 'var(--color-bg-primary)',
              color: 'var(--color-text-primary)',
            }}
          >
            <option value="all">All Sources</option>
            <option value="growth-post">Growth Posts</option>
            <option value="alignment-story">Alignment Stories</option>
            <option value="profile-photo">Profile Photos</option>
            <option value="matching-application">Matching Applications</option>
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-medium)' }}>Date Range</span>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              backgroundColor: 'var(--color-bg-primary)',
              color: 'var(--color-text-primary)',
            }}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="all">All time</option>
          </select>
        </label>

        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-medium)' }}>Author</span>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <input
              type="text"
              placeholder="Search name or email…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                backgroundColor: 'var(--color-bg-primary)',
                color: 'var(--color-text-primary)',
                width: '220px',
              }}
            />
            <button
              type="submit"
              className="btn btn--primary btn--sm"
            >
              Search
            </button>
            {search && (
              <button
                type="button"
                className="btn btn--outline-primary btn--sm"
                onClick={() => { setSearch(''); setSearchInput('') }}
              >
                Clear
              </button>
            )}
          </div>
        </form>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'flex-end' }}>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            {loading ? 'Loading…' : `${items.length} photo${items.length !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--color-text-secondary)' }}>
          Loading photos…
        </div>
      ) : items.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--space-16)',
            color: 'var(--color-text-secondary)',
            border: '2px dashed var(--color-border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>🖼️</div>
          <p style={{ margin: 0, fontWeight: 'var(--font-medium)' }}>No photos uploaded yet.</p>
          {(source !== 'all' || period !== 'all' || search) && (
            <p style={{ margin: 'var(--space-2) 0 0', fontSize: 'var(--text-sm)' }}>
              Try adjusting your filters.
            </p>
          )}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          {items.map(item => (
            <MediaCard
              key={item.id}
              item={item}
              expanded={expandedId === item.id}
              onToggleExpand={() => setExpandedId(expandedId === item.id ? null : item.id)}
              hasError={imgErrors.has(item.id)}
              onImgError={() => handleImgError(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        padding: 'var(--space-4)',
        backgroundColor: 'var(--color-bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-subtle)',
      }}
    >
      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-text-primary)' }}>
        {value}
      </div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
        {label}
      </div>
    </div>
  )
}

function MediaCard({
  item,
  expanded,
  onToggleExpand,
  hasError,
  onImgError,
}: {
  item: MediaItem
  expanded: boolean
  onToggleExpand: () => void
  hasError: boolean
  onImgError: () => void
}) {
  const isSupabase = isSupabaseUrl(item.imageUrl)

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-subtle)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', backgroundColor: 'var(--color-bg-tertiary)' }}>
        {hasError ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-2)',
              color: 'var(--color-text-tertiary)',
              fontSize: 'var(--text-sm)',
            }}
          >
            <span style={{ fontSize: '2rem' }}>⚠️</span>
            Failed to load
          </div>
        ) : (
          <Image
            src={item.imageUrl}
            alt={`Photo by ${item.authorName ?? item.authorEmail}`}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            style={{ objectFit: 'cover' }}
            onError={onImgError}
            unoptimized={!isSupabase}
          />
        )}

        {/* External link overlay */}
        <a
          href={item.imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Open full-size image"
          style={{
            position: 'absolute',
            top: 'var(--space-2)',
            right: 'var(--space-2)',
            backgroundColor: 'rgba(0,0,0,0.55)',
            color: '#fff',
            borderRadius: 'var(--radius-sm)',
            padding: '3px 6px',
            fontSize: '0.75rem',
            textDecoration: 'none',
            lineHeight: 1,
          }}
        >
          ↗
        </a>

        {/* Storage indicator */}
        <span
          title={item.imageUrl}
          style={{
            position: 'absolute',
            bottom: 'var(--space-2)',
            left: 'var(--space-2)',
            backgroundColor: isSupabase ? 'rgba(22, 163, 74, 0.85)' : 'rgba(185, 28, 28, 0.85)',
            color: '#fff',
            borderRadius: 'var(--radius-sm)',
            padding: '2px 6px',
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
          }}
        >
          {isSupabase ? 'Supabase ✓' : 'External ⚠'}
        </span>
      </div>

      {/* Metadata */}
      <div style={{ padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              padding: '2px 7px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: `${SOURCE_COLORS[item.sourceType]}22`,
              color: SOURCE_COLORS[item.sourceType],
              border: `1px solid ${SOURCE_COLORS[item.sourceType]}44`,
            }}
          >
            {SOURCE_LABELS[item.sourceType]}
          </span>
          {item.pillar && (
            <span
              style={{
                fontSize: '0.65rem',
                padding: '2px 7px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-bg-tertiary)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              {PILLAR_LABELS[item.pillar] ?? item.pillar}
            </span>
          )}
        </div>

        <div>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--color-text-primary)' }}>
            {item.authorName ?? '—'}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            {item.authorEmail}
          </div>
        </div>

        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
          {formatDate(item.createdAt)}
        </div>

        {/* URL reveal */}
        <button
          onClick={onToggleExpand}
          style={{
            marginTop: 'auto',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-tertiary)',
            textAlign: 'left',
            padding: 0,
          }}
        >
          {expanded ? '▲ Hide URL' : '▼ Show URL'}
        </button>

        {expanded && (
          <div
            style={{
              fontSize: '0.65rem',
              wordBreak: 'break-all',
              color: isSupabase ? 'var(--color-success, #16a34a)' : 'var(--color-error)',
              backgroundColor: 'var(--color-bg-tertiary)',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'monospace',
              lineHeight: 1.5,
            }}
          >
            {item.imageUrl}
          </div>
        )}
      </div>
    </div>
  )
}
