'use client'

interface MetricCardProps {
  label: string
  value: number | string
  change?: string // e.g. "+12%" or "-3"
  changeType?: 'positive' | 'negative' | 'neutral'
  href?: string
}

export default function MetricCard({ label, value, change, changeType = 'neutral', href }: MetricCardProps) {
  const changeColor = changeType === 'positive'
    ? 'var(--color-success)'
    : changeType === 'negative'
      ? 'var(--color-error)'
      : 'var(--color-text-tertiary)'

  const content = (
    <div
      style={{
        backgroundColor: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4) var(--space-5)',
        cursor: href ? 'pointer' : 'default',
        transition: 'border-color var(--transition-fast)',
      }}
      onMouseEnter={(e) => {
        if (href) (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-default)'
      }}
      onMouseLeave={(e) => {
        if (href) (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-subtle)'
      }}
    >
      <div
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-tertiary)',
          marginBottom: 'var(--space-1)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-wider)',
          fontWeight: 'var(--font-medium)',
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
        <span
          style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--font-bold)',
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-primary)',
          }}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {change && (
          <span style={{ fontSize: 'var(--text-xs)', color: changeColor, fontWeight: 'var(--font-medium)' }}>
            {change}
          </span>
        )}
      </div>
    </div>
  )

  if (href) {
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    return <a href={href} style={{ textDecoration: 'none' }}>{content}</a>
  }

  return content
}
