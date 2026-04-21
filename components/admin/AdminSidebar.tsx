'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
}

interface AdminSidebarProps {
  pendingPhotos?: number
  openReports?: number
  pendingAppeals?: number
  pendingFounders?: number
}

export default function AdminSidebar({ pendingPhotos = 0, openReports = 0, pendingAppeals = 0, pendingFounders = 0 }: AdminSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin', icon: '⊞' },
    { label: 'Users', href: '/admin/users', icon: '⊕' },
    { label: 'Moderation', href: '/admin/moderation', icon: '⊘', badge: pendingPhotos + openReports },
    { label: 'Matching', href: '/admin/matching', icon: '⊛' },
    { label: 'Analytics', href: '/admin/analytics', icon: '⊡' },
    { label: 'Subscriptions', href: '/admin/subscriptions', icon: '⊜' },
    { label: 'Pages', href: '/admin/pages', icon: '⊠' },
    { label: 'Communications', href: '/admin/communications', icon: '⊙' },
    { label: 'Community', href: '/admin/community', icon: '⊚' },
    { label: 'Media', href: '/admin/media', icon: '⊟' },
    { label: 'Stories', href: '/admin/alignment-stories', icon: '⊕' },
    { label: 'Professional', href: '/admin/professional', icon: '◈' },
    { label: 'Founders', href: '/admin/founder-applications', icon: '✦', badge: pendingFounders },
    { label: 'Settings', href: '/admin/settings', icon: '⊗' },
    { label: 'Audit Log', href: '/admin/audit-log', icon: '⊟' },
  ]

  if (pendingAppeals > 0) {
    const settingsItem = navItems.find(n => n.label === 'Settings')
    if (settingsItem) settingsItem.badge = pendingAppeals
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside
      style={{
        width: collapsed ? '64px' : '240px',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-secondary)',
        borderRight: '1px solid var(--color-border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width var(--transition-normal)',
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 'var(--space-4)',
          borderBottom: '1px solid var(--color-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '56px',
        }}
      >
        {!collapsed && (
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 'var(--font-bold)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-primary)',
              letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase',
            }}
          >
            Admin
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            fontSize: 'var(--text-lg)',
            padding: 'var(--space-1)',
          }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '»' : '«'}
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: collapsed ? 'var(--space-2) var(--space-3)' : 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              fontSize: 'var(--text-sm)',
              fontWeight: isActive(item.href) ? 'var(--font-semibold)' : 'var(--font-normal)',
              color: isActive(item.href) ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              backgroundColor: isActive(item.href) ? 'var(--color-bg-elevated)' : 'transparent',
              transition: 'all var(--transition-fast)',
              justifyContent: collapsed ? 'center' : 'flex-start',
              position: 'relative',
            }}
          >
            <span style={{ fontSize: 'var(--text-lg)', width: '20px', textAlign: 'center' }}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
            {item.badge && item.badge > 0 && (
              <span
                style={{
                  position: collapsed ? 'absolute' : 'static',
                  top: collapsed ? '2px' : undefined,
                  right: collapsed ? '2px' : undefined,
                  marginLeft: collapsed ? 0 : 'auto',
                  backgroundColor: 'var(--color-error)',
                  color: 'var(--color-white)',
                  fontSize: '0.65rem',
                  fontWeight: 'var(--font-bold)',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  minWidth: '18px',
                  textAlign: 'center',
                }}
              >
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Back to site link */}
      <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--color-border-subtle)' }}>
        <Link
          href="/dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            color: 'var(--color-text-tertiary)',
            textDecoration: 'none',
            fontSize: 'var(--text-xs)',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        >
          {!collapsed && '← Back to Site'}
          {collapsed && '←'}
        </Link>
      </div>
    </aside>
  )
}
