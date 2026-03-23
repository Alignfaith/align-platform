'use client'

import Link from 'next/link'

interface Breadcrumb {
  label: string
  href?: string
}

interface AdminPageHeaderProps {
  title: string
  breadcrumbs?: Breadcrumb[]
  actions?: React.ReactNode
}

export default function AdminPageHeader({ title, breadcrumbs, actions }: AdminPageHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 'var(--space-6)',
      }}
    >
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            style={{
              display: 'flex',
              gap: 'var(--space-1)',
              marginBottom: 'var(--space-2)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-tertiary)',
            }}
          >
            <Link href="/admin" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>
              Admin
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} style={{ display: 'flex', gap: 'var(--space-1)' }}>
                <span>/</span>
                {crumb.href ? (
                  <Link href={crumb.href} style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span style={{ color: 'var(--color-text-secondary)' }}>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-text-primary)',
          }}
        >
          {title}
        </h1>
      </div>
      {actions && <div style={{ display: 'flex', gap: 'var(--space-2)' }}>{actions}</div>}
    </div>
  )
}
