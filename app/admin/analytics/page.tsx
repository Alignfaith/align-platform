'use client'

import { useEffect, useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import MetricCard from '@/components/admin/MetricCard'

type Tab = 'engagement' | 'matching' | 'safety' | 'growth'
type Period = '7d' | '30d' | '90d' | 'all'

export default function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>('engagement')
  const [period, setPeriod] = useState<Period>('30d')
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/analytics?tab=${tab}&period=${period}`)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [tab, period])

  const tabs: { key: Tab; label: string }[] = [
    { key: 'engagement', label: 'Engagement' },
    { key: 'matching', label: 'Matching' },
    { key: 'safety', label: 'Safety' },
    { key: 'growth', label: 'Growth' },
  ]

  const periods: { key: Period; label: string }[] = [
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '90d', label: '90 Days' },
    { key: 'all', label: 'All Time' },
  ]

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: 'var(--space-2) var(--space-4)',
    fontSize: 'var(--text-sm)',
    fontWeight: active ? 'var(--font-semibold)' : 'var(--font-normal)',
    color: active ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
    backgroundColor: active ? 'var(--color-bg-elevated)' : 'transparent',
    border: active ? '1px solid var(--color-border-subtle)' : '1px solid transparent',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
  })

  const periodStyle = (active: boolean): React.CSSProperties => ({
    padding: 'var(--space-1) var(--space-3)',
    fontSize: 'var(--text-xs)',
    fontWeight: active ? 'var(--font-semibold)' : 'var(--font-normal)',
    color: active ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderBottom: active ? '2px solid var(--color-primary)' : '2px solid transparent',
  })

  const barStyle = (value: number, max: number, color: string): React.CSSProperties => ({
    height: '24px',
    width: `${max > 0 ? (value / max) * 100 : 0}%`,
    minWidth: value > 0 ? '4px' : '0',
    backgroundColor: color,
    borderRadius: 'var(--radius-sm)',
    transition: 'width var(--transition-normal)',
  })

  return (
    <>
      <AdminPageHeader title="Analytics" breadcrumbs={[{ label: 'Analytics' }]} />

      {/* Tab + Period selectors */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
          {tabs.map((t) => (
            <button key={t.key} style={tabStyle(tab === t.key)} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
          {periods.map((p) => (
            <button key={p.key} style={periodStyle(period === p.key)} onClick={() => setPeriod(p.key)}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ color: 'var(--color-text-tertiary)', padding: 'var(--space-8)' }}>Loading analytics...</div>
      ) : !data ? (
        <div style={{ color: 'var(--color-error)' }}>Failed to load</div>
      ) : (
        <>
          {/* Engagement Tab */}
          {tab === 'engagement' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
              <MetricCard label="DAU" value={data.dau as number} />
              <MetricCard label="WAU" value={data.wau as number} />
              <MetricCard label="MAU" value={data.mau as number} />
              <MetricCard label="DAU/MAU Ratio" value={`${data.dauMauRatio}%`} />
              <MetricCard label="Total Users" value={data.totalUsers as number} />
              <MetricCard label="New Signups" value={data.newSignups as number} />
              <MetricCard label="Profile Completion" value={`${data.profileCompletionRate}%`} />
            </div>
          )}

          {/* Matching Tab */}
          {tab === 'matching' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <MetricCard label="Total Matches" value={data.totalMatches as number} />
                <MetricCard label="Match Rate" value={`${data.matchRate}%`} />
                <MetricCard label="Matched" value={data.matchedCount as number} />
                <MetricCard label="Declined" value={data.declinedCount as number} />
                <MetricCard label="Conversations" value={data.conversationCount as number} />
                <MetricCard label="Match→Convo" value={`${data.matchToConvoRate}%`} />
                <MetricCard label="Matches (period)" value={data.matchesPeriod as number} />
              </div>

              {/* Pillar Score Distribution */}
              {(data.pillarScores as { pillar: string; avgScore: number; count: number }[])?.length > 0 && (
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-5)',
                  }}
                >
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>
                    Average Pillar Scores
                  </h3>
                  {(data.pillarScores as { pillar: string; avgScore: number; count: number }[]).map((ps) => (
                    <div key={ps.pillar} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                      <span style={{ width: '100px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{ps.pillar}</span>
                      <div style={{ flex: 1, backgroundColor: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                        <div style={barStyle(ps.avgScore, 5, 'var(--color-primary)')} />
                      </div>
                      <span style={{ width: '40px', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', textAlign: 'right' }}>{ps.avgScore}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Safety Tab */}
          {tab === 'safety' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
              <MetricCard label="Reports (period)" value={data.totalReports as number} />
              <MetricCard label="Resolved" value={data.resolvedReports as number} />
              <MetricCard label="Open" value={data.openReports as number} />
              <MetricCard label="Resolution Rate" value={`${data.resolutionRate}%`} />
              <MetricCard label="Bans (period)" value={data.banCount as number} />
              <MetricCard label="Active Suspensions" value={data.suspensionCount as number} />
              <MetricCard label="Appeals (period)" value={data.appealCount as number} />
              <MetricCard label="Appeal Success" value={`${data.appealSuccessRate}%`} />
            </div>
          )}

          {/* Growth Tab */}
          {tab === 'growth' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <MetricCard label="Growth Posts" value={data.growthPostsCount as number} />
                <MetricCard label="Reflections" value={data.reflectionCount as number} />
                <MetricCard label="Reflection Rate" value={`${data.reflectionCompletionRate}%`} />
              </div>

              {(data.postsPerPillar as { pillar: string; count: number }[])?.length > 0 && (
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-5)',
                  }}
                >
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>
                    Posts per Pillar
                  </h3>
                  {(data.postsPerPillar as { pillar: string; count: number }[]).map((pp) => {
                    const maxCount = Math.max(...(data.postsPerPillar as { pillar: string; count: number }[]).map((p) => p.count))
                    return (
                      <div key={pp.pillar} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                        <span style={{ width: '100px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{pp.pillar}</span>
                        <div style={{ flex: 1, backgroundColor: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                          <div style={barStyle(pp.count, maxCount, 'var(--color-accent)')} />
                        </div>
                        <span style={{ width: '40px', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', textAlign: 'right' }}>{pp.count}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}
