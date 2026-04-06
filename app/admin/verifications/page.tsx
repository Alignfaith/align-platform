'use client'

import { useEffect, useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { CheckCircle, XCircle, Clock, User, Shield } from 'lucide-react'
import Image from 'next/image'

interface PendingPhoto {
  id: string
  firstName: string
  lastName: string
  identityPhotoUrl: string
  identityPhotoSubmittedAt: string | null
  userId: string
  user: { email: string }
}

interface PendingVerification {
  id: string
  firstName: string
  lastName: string
  humanVerificationPhotoUrl: string
  humanVerificationSubmittedAt: string | null
  userId: string
  user: { email: string }
}

interface VerificationData {
  pendingPhotos: PendingPhoto[]
  pendingVerifications: PendingVerification[]
}

export default function VerificationsPage() {
  const [data, setData] = useState<VerificationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    fetch('/api/admin/verifications')
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handlePhotoAction = async (profileId: string, action: 'approve' | 'reject') => {
    setActing(profileId)
    try {
      await fetch('/api/admin/verifications/photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, action }),
      })
      load()
    } finally {
      setActing(null)
    }
  }

  const handleHumanAction = async (profileId: string, action: 'approve' | 'reject') => {
    setActing(profileId + '_human')
    try {
      await fetch('/api/admin/verifications/human', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, action }),
      })
      load()
    } finally {
      setActing(null)
    }
  }

  const timeAgo = (dateStr: string | null) => {
    if (!dateStr) return 'unknown'
    const diff = Date.now() - new Date(dateStr).getTime()
    const hrs = Math.floor(diff / 3600000)
    if (hrs < 1) return 'less than 1h ago'
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  const cardStyle = {
    backgroundColor: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-4)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--space-3)',
  }

  const actionBtnBase = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    cursor: 'pointer',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
  }

  if (loading) {
    return <div style={{ padding: 'var(--space-8)', color: 'var(--color-text-tertiary)' }}>Loading...</div>
  }

  const pendingPhotos = data?.pendingPhotos ?? []
  const pendingVerifications = data?.pendingVerifications ?? []

  return (
    <>
      <AdminPageHeader title="Verifications" />

      {/* Identity Photos */}
      <section style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <User size={18} color="var(--color-primary)" />
          Identity Photos Pending Review
          {pendingPhotos.length > 0 && (
            <span style={{ backgroundColor: 'var(--color-error)', color: 'white', borderRadius: '999px', fontSize: '11px', padding: '1px 7px', fontWeight: 700 }}>
              {pendingPhotos.length}
            </span>
          )}
        </h2>

        {pendingPhotos.length === 0 ? (
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>No pending identity photos.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
            {pendingPhotos.map((p) => (
              <div key={p.id} style={cardStyle}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                  <Image src={p.identityPhotoUrl} alt="Identity photo" fill style={{ objectFit: 'cover' }} unoptimized />
                </div>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: '2px' }}>{p.firstName} {p.lastName}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 0 }}>{p.user.email}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} /> Submitted {timeAgo(p.identityPhotoSubmittedAt)}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button
                    onClick={() => handlePhotoAction(p.id, 'approve')}
                    disabled={acting === p.id}
                    style={{ ...actionBtnBase, backgroundColor: '#dcfce7', color: '#15803d', flex: 1 }}
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button
                    onClick={() => handlePhotoAction(p.id, 'reject')}
                    disabled={acting === p.id}
                    style={{ ...actionBtnBase, backgroundColor: '#fee2e2', color: '#b91c1c', flex: 1 }}
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Human Verifications */}
      <section>
        <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Shield size={18} color="var(--color-primary)" />
          Human Verification Selfies Pending Review
          {pendingVerifications.length > 0 && (
            <span style={{ backgroundColor: 'var(--color-error)', color: 'white', borderRadius: '999px', fontSize: '11px', padding: '1px 7px', fontWeight: 700 }}>
              {pendingVerifications.length}
            </span>
          )}
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
          Each photo should show a person holding a piece of paper with their username written on it.
        </p>

        {pendingVerifications.length === 0 ? (
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>No pending verifications.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
            {pendingVerifications.map((v) => (
              <div key={v.id} style={cardStyle}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                  <Image src={v.humanVerificationPhotoUrl} alt="Verification selfie" fill style={{ objectFit: 'cover' }} unoptimized />
                </div>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: '2px' }}>{v.firstName} {v.lastName}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: '2px' }}>{v.user.email}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>
                    Username: <strong>{v.firstName} {v.lastName}</strong>
                  </p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} /> Submitted {timeAgo(v.humanVerificationSubmittedAt)}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button
                    onClick={() => handleHumanAction(v.id, 'approve')}
                    disabled={acting === v.id + '_human'}
                    style={{ ...actionBtnBase, backgroundColor: '#dcfce7', color: '#15803d', flex: 1 }}
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button
                    onClick={() => handleHumanAction(v.id, 'reject')}
                    disabled={acting === v.id + '_human'}
                    style={{ ...actionBtnBase, backgroundColor: '#fee2e2', color: '#b91c1c', flex: 1 }}
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
