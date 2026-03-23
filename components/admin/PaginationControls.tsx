'use client'

interface PaginationControlsProps {
  page: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
}

export default function PaginationControls({ page, totalPages, totalItems, onPageChange }: PaginationControlsProps) {
  if (totalPages <= 1) return null

  const buttonStyle: React.CSSProperties = {
    padding: 'var(--space-1) var(--space-3)',
    fontSize: 'var(--text-sm)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-bg-elevated)',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  }

  const disabledStyle: React.CSSProperties = {
    ...buttonStyle,
    opacity: 0.4,
    cursor: 'not-allowed',
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-3) 0',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-tertiary)',
      }}
    >
      <span>{totalItems.toLocaleString()} total</span>
      <div style={{ display: 'flex', gap: 'var(--space-1)', alignItems: 'center' }}>
        <button
          style={page <= 1 ? disabledStyle : buttonStyle}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Prev
        </button>
        <span style={{ padding: '0 var(--space-2)' }}>
          {page} / {totalPages}
        </span>
        <button
          style={page >= totalPages ? disabledStyle : buttonStyle}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
