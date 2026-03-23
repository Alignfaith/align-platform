'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import MetricCard from '@/components/admin/MetricCard'

export default function ModerationOverview() {
  const [stats, setStats] = useState({ pendingPhotos: 0, openReports: 0 })

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((data) => setStats({ pendingPhotos: data.stats.pendingPhotos, openReports: data.stats.openReports }))
      .catch(console.error)
  }, [])

  return (
    <>
      <AdminPageHeader title="Moderation" breadcrumbs={[{ label: 'Moderation' }]} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
        }}
      >
        <MetricCard label="Pending Photos" value={stats.pendingPhotos} href="/admin/moderation/photos" />
        <MetricCard label="Open Reports" value={stats.openReports} href="/admin/moderation/reports" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <Link
          href="/admin/moderation/photos"
          style={{
            display: 'block',
            padding: 'var(--space-6)',
            backgroundColor: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-lg)',
            textDecoration: 'none',
            transition: 'border-color var(--transition-fast)',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
            Photo Queue
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            Review and approve/reject user-uploaded photos.
          </p>
        </Link>

        <Link
          href="/admin/moderation/reports"
          style={{
            display: 'block',
            padding: 'var(--space-6)',
            backgroundColor: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-lg)',
            textDecoration: 'none',
            transition: 'border-color var(--transition-fast)',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
            Report Queue
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            Review user reports sorted by severity.
          </p>
        </Link>
      </div>
    </>
  )
}
