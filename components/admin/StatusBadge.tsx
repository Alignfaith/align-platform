'use client'

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary'

interface StatusBadgeProps {
  label: string
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, { bg: string; color: string }> = {
  success: { bg: 'rgba(34, 197, 94, 0.15)', color: 'var(--color-success)' },
  warning: { bg: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-warning)' },
  error: { bg: 'rgba(239, 68, 68, 0.15)', color: 'var(--color-error)' },
  info: { bg: 'rgba(59, 130, 246, 0.15)', color: 'var(--color-info)' },
  neutral: { bg: 'rgba(161, 161, 170, 0.15)', color: 'var(--color-text-secondary)' },
  primary: { bg: 'var(--color-primary-glow)', color: 'var(--color-primary-light)' },
}

// Auto-map common status strings to badge variants
const statusVariantMap: Record<string, BadgeVariant> = {
  ACTIVE: 'success',
  MATCHED: 'success',
  APPROVED: 'success',
  RESOLVED: 'success',
  COMPLETE: 'success',
  COMPLETED: 'success',

  PENDING: 'warning',
  IN_REVIEW: 'warning',
  UNDER_REVIEW: 'warning',
  OPEN: 'warning',

  SUSPENDED: 'error',
  BANNED: 'error',
  DECLINED: 'error',
  DENIED: 'error',
  REJECTED: 'error',
  ESCALATED: 'error',

  DISMISSED: 'neutral',
  DEACTIVATED: 'neutral',
  EXPIRED: 'neutral',
  UNMATCHED: 'neutral',

  FREE: 'neutral',
  TIER_1: 'info',
  TIER_2: 'primary',

  ADMIN: 'primary',
  USER: 'neutral',
  MALE: 'info',
  FEMALE: 'primary',
}

export default function StatusBadge({ label, variant }: StatusBadgeProps) {
  const resolvedVariant = variant ?? statusVariantMap[label] ?? 'neutral'
  const style = variantStyles[resolvedVariant]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.7rem',
        fontWeight: 'var(--font-semibold)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        backgroundColor: style.bg,
        color: style.color,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}
