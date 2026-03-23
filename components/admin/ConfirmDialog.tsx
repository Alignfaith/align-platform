'use client'

import { useState } from 'react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  confirmVariant?: 'danger' | 'primary'
  requireReason?: boolean
  onConfirm: (reason?: string) => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  confirmVariant = 'primary',
  requireReason = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [reason, setReason] = useState('')

  if (!open) return null

  const confirmBg = confirmVariant === 'danger' ? 'var(--color-error)' : 'var(--color-primary)'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
          maxWidth: '440px',
          width: '90%',
          boxShadow: 'var(--shadow-xl)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-2)',
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
          {message}
        </p>

        {requireReason && (
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason (required)"
            rows={3}
            style={{
              width: '100%',
              padding: 'var(--space-2) var(--space-3)',
              fontSize: 'var(--text-sm)',
              backgroundColor: 'var(--color-bg-tertiary)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-primary)',
              resize: 'vertical',
              marginBottom: 'var(--space-4)',
              outline: 'none',
              fontFamily: 'var(--font-body)',
            }}
          />
        )}

        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              fontSize: 'var(--text-sm)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'transparent',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(requireReason ? reason : undefined)
              setReason('')
            }}
            disabled={requireReason && !reason.trim()}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              fontSize: 'var(--text-sm)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              backgroundColor: confirmBg,
              color: 'var(--color-white)',
              cursor: requireReason && !reason.trim() ? 'not-allowed' : 'pointer',
              opacity: requireReason && !reason.trim() ? 0.5 : 1,
              fontWeight: 'var(--font-semibold)',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
