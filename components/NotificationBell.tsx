'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'

interface Announcement {
  id: string
  title: string
  content: string
  createdAt: string
  isRead: boolean
}

export default function NotificationBell() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/announcements')
      .then((r) => r.ok ? r.json() : { announcements: [] })
      .then((d) => setAnnouncements(d.announcements ?? []))
      .catch(() => {})
  }, [])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unread = announcements.filter((a) => !a.isRead)

  const handleOpen = () => {
    const wasOpen = open
    setOpen(!open)
    // Mark unread as read when opening
    if (!wasOpen && unread.length > 0) {
      const ids = unread.map((a) => a.id)
      fetch('/api/announcements/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      }).then(() => {
        setAnnouncements((prev) => prev.map((a) => ({ ...a, isRead: true })))
      }).catch(() => {})
    }
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={handleOpen}
        aria-label="Notifications"
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px',
          borderRadius: '6px',
          color: 'var(--color-text-secondary)',
        }}
      >
        <Bell size={18} />
        {unread.length > 0 && (
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            minWidth: '16px',
            height: '16px',
            backgroundColor: '#B91C1C',
            color: 'white',
            fontSize: '10px',
            fontWeight: 700,
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            padding: '0 3px',
          }}>
            {unread.length > 9 ? '9+' : unread.length}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          width: '320px',
          backgroundColor: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          zIndex: 1000,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--color-border-subtle)',
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
          }}>
            Announcements
          </div>

          {announcements.length === 0 ? (
            <div style={{
              padding: '24px 16px',
              textAlign: 'center',
              fontSize: '13px',
              color: 'var(--color-text-tertiary)',
            }}>
              No new announcements
            </div>
          ) : (
            <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
              {announcements.map((a, i) => (
                <div
                  key={a.id}
                  style={{
                    padding: '12px 16px',
                    borderBottom: i < announcements.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                    backgroundColor: a.isRead ? 'transparent' : 'rgba(185, 28, 28, 0.04)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
                      {a.title}
                    </span>
                    {!a.isRead && (
                      <span style={{
                        flexShrink: 0,
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: '#B91C1C',
                        marginTop: '4px',
                      }} />
                    )}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px', lineHeight: 1.5 }}>
                    {a.content}
                  </p>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                    {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
