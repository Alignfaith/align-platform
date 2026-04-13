'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import MetricCard from '@/components/admin/MetricCard'
import StatusBadge from '@/components/admin/StatusBadge'

interface DashboardData {
  stats: {
    totalUsers: number
    activeToday: number
    newThisWeek: number
    tierFree: number
    tierOne: number
    tierTwo: number
    paidMembers: number
    pendingPhotos: number
    openReports: number
    pendingAppeals: number
    activeMatches: number
    waitlistSize: number
    unreadFeedback: number
    pendingFounders: number
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

const cardStyle = {
  backgroundColor: 'var(--color-bg-elevated)',
  border: '1px solid var(--color-border-subtle)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-4) var(--space-5)',
}

const sectionHeadingStyle = {
  fontFamily: 'var(--font-heading)',
  fontSize: 'var(--text-sm)',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
  marginBottom: 'var(--space-3)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
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
    return <div style={{ padding: 'var(--space-8)', color: 'var(--color-text-tertiary)' }}>Loading dashboard...</div>
  }

  if (!data) {
    return <div style={{ padding: 'var(--space-8)', color: 'var(--color-error)' }}>Failed to load dashboard data.</div>
  }

  const { stats, recentActions, alerts } = data

  const formatName = (user: { email: string; profile: { firstName: string; lastName: string } | null }) =>
    user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user.email

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const tierPct = (n: number) => stats.totalUsers > 0 ? Math.round((n / stats.totalUsers) * 100) : 0

  return (
    <>
      <AdminPageHeader title="Dashboard" />

      {/* ── Primary stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <MetricCard label="Total Users" value={stats.totalUsers} />
        <MetricCard label="New This Week" value={stats.newThisWeek} />
        <MetricCard label="Paid Members" value={stats.paidMembers} />
        <MetricCard label="Active Today" value={stats.activeToday} />
        <MetricCard label="Open Reports" value={stats.openReports} href="/admin/moderation/reports" />
        <MetricCard label="Pending Photos" value={stats.pendingPhotos} href="/admin/moderation/photos" />
        <MetricCard label="Pending Appeals" value={stats.pendingAppeals} />
        <MetricCard label="Active Matches" value={stats.activeMatches} />
        <MetricCard label="Pending Founders" value={stats.pendingFounders} href="/admin/founder-applications" />
      </div>

      {/* ── Tier breakdown + Alerts + Activity ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>

        {/* Tier breakdown */}
        <div style={cardStyle}>
          <h2 style={sectionHeadingStyle}>Members by Tier</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[
              { label: 'Free', count: stats.tierFree, color: 'var(--color-text-tertiary)' },
              { label: 'Tier 1', count: stats.tierOne, color: '#3B82F6' },
              { label: 'Tier 2', count: stats.tierTwo, color: '#c0182a' },
            ].map(({ label, count, color }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {count} <span style={{ fontWeight: 400, color: 'var(--color-text-tertiary)' }}>({tierPct(count)}%)</span>
                  </span>
                </div>
                <div style={{ height: '6px', borderRadius: '3px', background: 'var(--color-border-subtle)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${tierPct(count)}%`, background: color, borderRadius: '3px', transition: 'width 0.4s ease' }} />
                </div>
              </div>
            ))}
          </div>
          <Link href="/admin/users" style={{ display: 'block', marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
            View all users →
          </Link>
        </div>

        {/* Alerts */}
        <div style={cardStyle}>
          <h2 style={sectionHeadingStyle}>Alerts</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {alerts.stalePhotos > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239,68,68,0.08)', fontSize: 'var(--text-sm)', color: 'var(--color-error)' }}>
                <span>{alerts.stalePhotos} photo(s) pending &gt;24h</span>
                <a href="/admin/moderation/photos" style={{ color: 'var(--color-error)', fontWeight: 600 }}>Review</a>
              </div>
            )}
            {alerts.highSeverityReports > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245,158,11,0.08)', fontSize: 'var(--text-sm)', color: 'var(--color-warning)' }}>
                <span>{alerts.highSeverityReports} high-severity report(s)</span>
                <a href="/admin/moderation/reports" style={{ color: 'var(--color-warning)', fontWeight: 600 }}>Review</a>
              </div>
            )}
            {alerts.stalePhotos === 0 && alerts.highSeverityReports === 0 && (
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', padding: 'var(--space-2)' }}>No active alerts</div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ ...cardStyle, maxHeight: '280px', overflow: 'auto' }}>
          <h2 style={sectionHeadingStyle}>Recent Activity</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {recentActions.length === 0 ? (
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', padding: 'var(--space-2)' }}>No recent activity</div>
            ) : (
              recentActions.map((action) => (
                <div key={action.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border-subtle)', fontSize: 'var(--text-sm)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', minWidth: 0 }}>
                    <StatusBadge label={action.action} />
                    <span style={{ color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {formatName(action.target)}
                    </span>
                  </div>
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)', whiteSpace: 'nowrap', marginLeft: 'var(--space-2)' }}>
                    {timeAgo(action.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Quick links to Users table ── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <h2 style={{ ...sectionHeadingStyle, marginBottom: 0 }}>Quick Access</h2>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          {[
            { label: 'All Users', href: '/admin/users' },
            { label: 'Free Members', href: '/admin/users?tier=FREE' },
            { label: 'Tier 1 Members', href: '/admin/users?tier=TIER_1' },
            { label: 'Tier 2 Members', href: '/admin/users?tier=TIER_2' },
            { label: 'Photo Moderation', href: '/admin/moderation/photos' },
            { label: 'Reports', href: '/admin/moderation/reports' },
            { label: 'Verifications', href: '/admin/verifications' },
            { label: 'Audit Log', href: '/admin/audit-log' },
          ].map(({ label, href }) => (
            <Link key={href} href={href} style={{ padding: '6px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', textDecoration: 'none', background: 'var(--color-bg-secondary)', fontWeight: 500 }}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
