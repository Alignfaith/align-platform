'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import StatusBadge from '@/components/admin/StatusBadge'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

interface UserDetail {
  id: string
  email: string
  role: string
  status: string
  tier: string
  createdAt: string
  lastActiveAt: string
  adminNotes: string | null
  profile: {
    firstName: string
    lastName: string
    displayName: string | null
    dateOfBirth: string
    gender: string
    city: string
    state: string
    bio: string | null
    aboutMe: string | null
    seekingGender: string
    relationshipGoal: string
    isComplete: boolean
    isVerified: boolean
    isActive: boolean
    photos: { id: string; url: string; isPrimary: boolean; isApproved: boolean }[]
    pillarScores: { pillar: string; selfScore: number }[]
    pillarResponses: { questionId: string; pillar: string; value: number }[]
    growthPosts: { id: string; pillar: string; content: string; createdAt: string }[]
    reflections: { questionId: number; answer: string }[]
  } | null
  sentMatches: { id: string; status: string; receiverId: string; createdAt: string }[]
  receivedMatches: { id: string; status: string; senderId: string; createdAt: string }[]
  adminActionsReceived: { id: string; action: string; reason: string | null; createdAt: string; admin: { email: string } }[]
  reportsReceived: { id: string; reason: string; category: string; status: string; createdAt: string }[]
  reportsSubmitted: { id: string; reason: string; category: string; status: string; createdAt: string }[]
  appeals: { id: string; reason: string; status: string; createdAt: string }[]
}

type ActionType = 'USER_SUSPENDED' | 'USER_BANNED' | 'USER_WARNED' | 'USER_UNSUSPENDED' | 'USER_UNBANNED' | 'PROFILE_VERIFIED' | 'PROFILE_FLAGGED' | 'PROFILE_DEACTIVATED'

export default function AdminUserDetailPage() {
  const params = useParams()
  const userId = params.id as string
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [notesSaving, setNotesSaving] = useState(false)
  const [dialog, setDialog] = useState<{ action: ActionType; title: string; message: string; variant: 'danger' | 'primary' } | null>(null)

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`)
      const data = await res.json()
      setUser(data)
      setNotes(data.adminNotes || '')
    } catch (err) {
      console.error('Failed to load user:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUser() }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

  const executeAction = async (action: ActionType, reason?: string) => {
    try {
      await fetch(`/api/admin/users/${userId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason: reason || 'Admin action' }),
      })
      await fetchUser()
    } catch (err) {
      console.error('Action failed:', err)
    }
    setDialog(null)
  }

  const saveNotes = async () => {
    setNotesSaving(true)
    try {
      await fetch(`/api/admin/users/${userId}/notes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
    } catch (err) {
      console.error('Failed to save notes:', err)
    } finally {
      setNotesSaving(false)
    }
  }

  if (loading) return <div style={{ color: 'var(--color-text-tertiary)', padding: 'var(--space-8)' }}>Loading...</div>
  if (!user) return <div style={{ color: 'var(--color-error)', padding: 'var(--space-8)' }}>User not found</div>

  const p = user.profile

  const sectionStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-4) var(--space-5)',
    marginBottom: 'var(--space-4)',
  }

  const sectionTitle: React.CSSProperties = {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-semibold)',
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--space-3)',
    textTransform: 'uppercase',
    letterSpacing: 'var(--tracking-wider)',
  }

  const fieldStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 'var(--space-1) 0',
    fontSize: 'var(--text-sm)',
    borderBottom: '1px solid var(--color-border-subtle)',
  }

  const actionBtnStyle = (variant: 'danger' | 'warning' | 'success' | 'neutral'): React.CSSProperties => {
    const colors = {
      danger: { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', border: 'rgba(239, 68, 68, 0.3)' },
      warning: { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)', border: 'rgba(245, 158, 11, 0.3)' },
      success: { bg: 'rgba(34, 197, 94, 0.1)', color: 'var(--color-success)', border: 'rgba(34, 197, 94, 0.3)' },
      neutral: { bg: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)', border: 'var(--color-border-subtle)' },
    }
    const c = colors[variant]
    return {
      padding: 'var(--space-2) var(--space-3)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--font-semibold)',
      backgroundColor: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      width: '100%',
      textAlign: 'center',
    }
  }

  return (
    <>
      <AdminPageHeader
        title={p ? `${p.firstName} ${p.lastName}` : user.email}
        breadcrumbs={[{ label: 'Users', href: '/admin/users' }, { label: p ? `${p.firstName} ${p.lastName}` : user.email }]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 'var(--space-4)' }}>
        {/* Main Content */}
        <div>
          {/* Header Card */}
          <div style={sectionStyle}>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-3)', flexWrap: 'wrap' }}>
              <StatusBadge label={user.status} />
              <StatusBadge label={user.tier} />
              <StatusBadge label={user.role} />
              {p?.isVerified && <StatusBadge label="VERIFIED" variant="success" />}
              {p && !p.isComplete && <StatusBadge label="INCOMPLETE" variant="warning" />}
            </div>
            <div style={fieldStyle}><span style={{ color: 'var(--color-text-tertiary)' }}>Email</span><span style={{ color: 'var(--color-text-primary)' }}>{user.email}</span></div>
            <div style={fieldStyle}><span style={{ color: 'var(--color-text-tertiary)' }}>Joined</span><span style={{ color: 'var(--color-text-primary)' }}>{new Date(user.createdAt).toLocaleDateString()}</span></div>
            <div style={fieldStyle}><span style={{ color: 'var(--color-text-tertiary)' }}>Last Active</span><span style={{ color: 'var(--color-text-primary)' }}>{new Date(user.lastActiveAt).toLocaleString()}</span></div>
            {p && (
              <>
                <div style={fieldStyle}><span style={{ color: 'var(--color-text-tertiary)' }}>Location</span><span style={{ color: 'var(--color-text-primary)' }}>{p.city}, {p.state}</span></div>
                <div style={fieldStyle}><span style={{ color: 'var(--color-text-tertiary)' }}>Gender</span><span style={{ color: 'var(--color-text-primary)' }}>{p.gender}</span></div>
                <div style={fieldStyle}><span style={{ color: 'var(--color-text-tertiary)' }}>Seeking</span><span style={{ color: 'var(--color-text-primary)' }}>{p.seekingGender}</span></div>
                <div style={fieldStyle}><span style={{ color: 'var(--color-text-tertiary)' }}>Goal</span><span style={{ color: 'var(--color-text-primary)' }}>{p.relationshipGoal}</span></div>
              </>
            )}
          </div>

          {/* Bio */}
          {p?.bio && (
            <div style={sectionStyle}>
              <h3 style={sectionTitle}>Bio</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>{p.bio}</p>
            </div>
          )}

          {/* Six Pillars */}
          {p && p.pillarScores.length > 0 && (
            <div style={sectionStyle}>
              <h3 style={sectionTitle}>Six Pillars Assessment</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
                {p.pillarScores.map((ps) => (
                  <div key={ps.pillar} style={{ textAlign: 'center', padding: 'var(--space-2)' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>
                      {ps.pillar}
                    </div>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-text-primary)' }}>
                      {ps.selfScore}
                    </div>
                    <div
                      style={{
                        height: '4px',
                        borderRadius: '2px',
                        backgroundColor: 'var(--color-bg-tertiary)',
                        marginTop: 'var(--space-1)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.max(0, 100 - (ps.selfScore - 1) * 25)}%`,
                          backgroundColor: 'var(--color-primary)',
                          borderRadius: '2px',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photos */}
          {p && p.photos.length > 0 && (
            <div style={sectionStyle}>
              <h3 style={sectionTitle}>Photos ({p.photos.length})</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 'var(--space-2)' }}>
                {p.photos.map((photo) => (
                  <div key={photo.id} style={{ position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt=""
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-md)',
                        border: photo.isApproved ? '2px solid var(--color-success)' : '2px solid var(--color-warning)',
                      }}
                    />
                    <div style={{ position: 'absolute', top: '4px', right: '4px' }}>
                      <StatusBadge label={photo.isApproved ? 'APPROVED' : 'PENDING'} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Match History */}
          <div style={sectionStyle}>
            <h3 style={sectionTitle}>Match History ({user.sentMatches.length + user.receivedMatches.length})</h3>
            <div style={{ maxHeight: '200px', overflow: 'auto' }}>
              {[...user.sentMatches.map(m => ({ ...m, direction: 'sent' as const })), ...user.receivedMatches.map(m => ({ ...m, direction: 'received' as const }))]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 20)
                .map((match) => (
                  <div key={match.id} style={fieldStyle}>
                    <span style={{ color: 'var(--color-text-tertiary)' }}>{match.direction}</span>
                    <StatusBadge label={match.status} />
                    <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>
                      {new Date(match.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              {user.sentMatches.length === 0 && user.receivedMatches.length === 0 && (
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>No matches</div>
              )}
            </div>
          </div>

          {/* Admin Action History */}
          {user.adminActionsReceived.length > 0 && (
            <div style={sectionStyle}>
              <h3 style={sectionTitle}>Admin History</h3>
              {user.adminActionsReceived.map((a) => (
                <div key={a.id} style={{ ...fieldStyle, flexDirection: 'column', gap: 'var(--space-1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <StatusBadge label={a.action} />
                    <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>{new Date(a.createdAt).toLocaleString()}</span>
                  </div>
                  {a.reason && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{a.reason}</div>}
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>by {a.admin.email}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Sidebar */}
        <div>
          {/* Actions */}
          <div style={sectionStyle}>
            <h3 style={sectionTitle}>Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {user.status === 'ACTIVE' && (
                <>
                  <button style={actionBtnStyle('warning')} onClick={() => setDialog({ action: 'USER_WARNED', title: 'Warn User', message: 'Send a warning to this user.', variant: 'primary' })}>
                    Warn User
                  </button>
                  <button style={actionBtnStyle('warning')} onClick={() => setDialog({ action: 'USER_SUSPENDED', title: 'Suspend User', message: 'Temporarily suspend this user. They will not be able to use the platform.', variant: 'danger' })}>
                    Suspend User
                  </button>
                  <button style={actionBtnStyle('danger')} onClick={() => setDialog({ action: 'USER_BANNED', title: 'Ban User', message: 'Permanently ban this user. This action can be reversed.', variant: 'danger' })}>
                    Ban User
                  </button>
                </>
              )}
              {user.status === 'SUSPENDED' && (
                <button style={actionBtnStyle('success')} onClick={() => setDialog({ action: 'USER_UNSUSPENDED', title: 'Lift Suspension', message: 'Remove the suspension from this user.', variant: 'primary' })}>
                  Lift Suspension
                </button>
              )}
              {user.status === 'BANNED' && (
                <button style={actionBtnStyle('success')} onClick={() => setDialog({ action: 'USER_UNBANNED', title: 'Unban User', message: 'Remove the ban from this user.', variant: 'primary' })}>
                  Unban User
                </button>
              )}
              {p && !p.isVerified && (
                <button style={actionBtnStyle('success')} onClick={() => executeAction('PROFILE_VERIFIED')}>
                  Verify Profile
                </button>
              )}
              {p?.isActive && (
                <button style={actionBtnStyle('neutral')} onClick={() => setDialog({ action: 'PROFILE_DEACTIVATED', title: 'Deactivate Profile', message: 'Hide this profile from discovery.', variant: 'danger' })}>
                  Deactivate Profile
                </button>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          <div style={sectionStyle}>
            <h3 style={sectionTitle}>Admin Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              style={{
                width: '100%',
                padding: 'var(--space-2)',
                fontSize: 'var(--text-sm)',
                backgroundColor: 'var(--color-bg-tertiary)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                resize: 'vertical',
                fontFamily: 'var(--font-body)',
                outline: 'none',
              }}
            />
            <button
              onClick={saveNotes}
              disabled={notesSaving}
              style={{
                marginTop: 'var(--space-2)',
                padding: 'var(--space-1) var(--space-3)',
                fontSize: 'var(--text-xs)',
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-white)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: 'var(--font-semibold)',
                opacity: notesSaving ? 0.5 : 1,
              }}
            >
              {notesSaving ? 'Saving...' : 'Save Notes'}
            </button>
          </div>

          {/* Reports Against */}
          {user.reportsReceived.length > 0 && (
            <div style={sectionStyle}>
              <h3 style={sectionTitle}>Reports Against ({user.reportsReceived.length})</h3>
              {user.reportsReceived.map((r) => (
                <div key={r.id} style={{ ...fieldStyle, flexDirection: 'column', gap: '2px' }}>
                  <StatusBadge label={r.category} />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{r.reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {dialog && (
        <ConfirmDialog
          open={true}
          title={dialog.title}
          message={dialog.message}
          confirmLabel={dialog.title}
          confirmVariant={dialog.variant}
          requireReason
          onConfirm={(reason) => executeAction(dialog.action, reason)}
          onCancel={() => setDialog(null)}
        />
      )}
    </>
  )
}
