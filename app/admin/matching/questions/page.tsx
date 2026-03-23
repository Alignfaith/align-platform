'use client'

import { useEffect, useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import FilterBar, { FilterConfig } from '@/components/admin/FilterBar'

interface Question {
  id: string
  pillar: string
  pillarName: string
  label: string
  originalLabel: string
  hasOverride: boolean
  options: { value: number; label: string }[]
  answerCount: number
}

const PILLAR_FILTERS: FilterConfig[] = [
  {
    key: 'pillar',
    label: 'Pillar',
    options: [
      { value: 'SPIRITUAL', label: 'Spiritual' },
      { value: 'MENTAL', label: 'Mental' },
      { value: 'PHYSICAL', label: 'Physical' },
      { value: 'FINANCIAL', label: 'Financial' },
      { value: 'APPEARANCE', label: 'Appearance' },
      { value: 'INTIMACY', label: 'Intimacy' },
    ],
  },
]

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [pillarFilter, setPillarFilter] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/admin/matching/questions')
      const data = await res.json()
      setQuestions(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchQuestions() }, [])

  const saveLabel = async (questionId: string) => {
    setSaving(true)
    try {
      await fetch('/api/admin/matching/questions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, label: editLabel }),
      })
      setEditingId(null)
      await fetchQuestions()
    } finally {
      setSaving(false)
    }
  }

  const resetLabel = async (questionId: string, originalLabel: string) => {
    setSaving(true)
    try {
      await fetch('/api/admin/matching/questions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, label: originalLabel }),
      })
      await fetchQuestions()
    } finally {
      setSaving(false)
    }
  }

  const filtered = pillarFilter ? questions.filter((q) => q.pillar === pillarFilter) : questions

  // Group by pillar
  const grouped: Record<string, Question[]> = {}
  filtered.forEach((q) => {
    if (!grouped[q.pillarName]) grouped[q.pillarName] = []
    grouped[q.pillarName].push(q)
  })

  if (loading) return <div style={{ color: 'var(--color-text-tertiary)', padding: 'var(--space-8)' }}>Loading...</div>

  return (
    <>
      <AdminPageHeader
        title="Question Management"
        breadcrumbs={[{ label: 'Matching', href: '/admin/matching' }, { label: 'Questions' }]}
      />

      <div style={{ marginBottom: 'var(--space-4)' }}>
        <FilterBar
          filters={PILLAR_FILTERS}
          values={{ pillar: pillarFilter }}
          onChange={(key, val) => { if (key === 'pillar') setPillarFilter(val) }}
          onClear={() => setPillarFilter('')}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {Object.entries(grouped).map(([pillarName, qs]) => (
          <div key={pillarName}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
              {pillarName}
            </h3>
            <div style={{ backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              {qs.map((q, i) => (
                <div
                  key={q.id}
                  style={{
                    padding: 'var(--space-3) var(--space-5)',
                    borderBottom: i < qs.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                    <div style={{ flex: 1 }}>
                      {editingId === q.id ? (
                        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                          <input
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            style={{
                              flex: 1,
                              padding: 'var(--space-1) var(--space-2)',
                              fontSize: 'var(--text-sm)',
                              backgroundColor: 'var(--color-bg-tertiary)',
                              border: '1px solid var(--color-border-subtle)',
                              borderRadius: 'var(--radius-md)',
                              color: 'var(--color-text-primary)',
                              outline: 'none',
                              fontFamily: 'var(--font-body)',
                            }}
                          />
                          <button
                            onClick={() => saveLabel(q.id)}
                            disabled={saving}
                            style={{ padding: '4px 12px', fontSize: 'var(--text-xs)', backgroundColor: 'var(--color-primary)', color: 'var(--color-white)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            style={{ padding: '4px 12px', fontSize: 'var(--text-xs)', backgroundColor: 'transparent', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                          {q.label}
                          {q.hasOverride && (
                            <span style={{ marginLeft: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-warning, #f59e0b)', fontStyle: 'italic' }}>
                              (modified)
                            </span>
                          )}
                        </div>
                      )}
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                        {q.id} &middot; {q.answerCount} responses
                      </div>
                    </div>
                    {editingId !== q.id && (
                      <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                        <button
                          onClick={() => { setEditingId(q.id); setEditLabel(q.label) }}
                          style={{ padding: '2px 8px', fontSize: 'var(--text-xs)', backgroundColor: 'transparent', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
                        >
                          Edit Label
                        </button>
                        {q.hasOverride && (
                          <button
                            onClick={() => resetLabel(q.id, q.originalLabel)}
                            disabled={saving}
                            style={{ padding: '2px 8px', fontSize: 'var(--text-xs)', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--color-error)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
