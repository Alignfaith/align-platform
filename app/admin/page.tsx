'use client'

import { useEffect, useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import MetricCard from '@/components/admin/MetricCard'
import StatusBadge from '@/components/admin/StatusBadge'

interface DashboardData {
  stats: {
    totalUsers: number
    activeToday: number
    pendingPhotos: number
    openReports: number
    pendingAppeals: number
    activeMatches: number
    waitlistSize: number
    unreadFeedback: number
  }
  recentActions: {
    id: string
    action: string
    reason: string | null
    createdAt: string
    target: {
      email: string
      profile: { firstName: string; lastName: string } | null
    }
    admin: {
      email: string
      profile: { firstName: string; lastName: string } | null
    }
  }[]
  alerts: {
    stalePhotos: number
    highSeverityReports: number
  }
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-8)', color: 'var(--color-text-tertiary)' }}>Loading dashboard...</div>
    )
  }

  if (!data) {
    return (
      <div style={{ padding: 'var(--space-8)', color: 'var(--color-error)' }}>Failed to load dashboard data.</div>
    )
  }

  const { stats, recentActions, alerts } = data

  const formatName = (user: { email: string; profile: { firstName: string; lastName: string } | null }) =>
    user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user.email

  const formatActionLabel = (action: string) =>
    action.replace(/_/g, ' ').toLowerCase().replace(/^./, (c) => c.toUpperCase())

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <>
      <AdminPageHeader title="Dashboard" />

      {/* Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
        }}
      >
        <MetricCard label="Total Users" value={stats.totalUsers} />
        <MetricCard label="Active Today" value={stats.activeToday} />
        <MetricCard label="Pending Photos" value={stats.pendingPhotos} href="/admin/moderation/photos" />
        <MetricCard label="Open Reports" value={stats.openReports} href="/admin/moderation/reports" />
        <MetricCard label="Pending Appeals" value={stats.pendingAppeals} />
        <MetricCard label="Active Matches" value={stats.activeMatches} />
        <MetricCard label="Waitlist" value={stats.waitlistSize} href="/admin/settings" />
        <MetricCard label="Unread Feedback" value={stats.unreadFeedback} />
      </div>

      {/* Alerts + Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        {/* Alerts */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4) var(--space-5)',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-3)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wider)',
            }}
          >
            Alerts
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {alerts.stalePhotos > 0 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-error)',
                }}
              >
                <span>{alerts.stalePhotos} photo(s) pending &gt; 24h</span>
                <a href="/admin/moderation/photos" style={{ color: 'var(--color-error)', fontWeight: 'var(--font-semibold)' }}>
                  Review
                </a>
              </div>
            )}
            {alerts.highSeverityReports > 0 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-warning)',
                }}
              >
                <span>{alerts.highSeverityReports} high-severity report(s)</span>
                <a href="/admin/moderation/reports" style={{ color: 'var(--color-warning)', fontWeight: 'var(--font-semibold)' }}>
                  Review
                </a>
              </div>
            )}
            {alerts.stalePhotos === 0 && alerts.highSeverityReports === 0 && (
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', padding: 'var(--space-2)' }}>
                No active alerts
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4) var(--space-5)',
            maxHeight: '400px',
            overflow: 'auto',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-3)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wider)',
            }}
          >
            Recent Activity
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {recentActions.length === 0 ? (
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', padding: 'var(--space-2)' }}>
                No recent activity
              </div>
            ) : (
              recentActions.map((action) => (
                <div
                  key={action.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--space-2) 0',
                    borderBottom: '1px solid var(--color-border-subtle)',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                    <StatusBadge label={action.action} />
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      {formatName(action.admin)} → {formatName(action.target)}
                    </span>
                  </div>
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)', whiteSpace: 'nowrap' }}>
                    {timeAgo(action.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
