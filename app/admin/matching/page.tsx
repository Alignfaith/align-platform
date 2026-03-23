'use client'

import { useEffect, useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { PILLAR_CONFIGS, HARD_STOP_QUESTIONS, type PillarType } from '@/lib/pillarQuestions'

interface MatchingConfig {
  weights: Record<PillarType, number>
  hardStopQuestions: string[]
  thresholds: { excellent: number; strong: number; moderate: number; low: number }
}

export default function MatchingConfigPage() {
  const [config, setConfig] = useState<MatchingConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/matching/config')
      .then((r) => r.json())
      .then(setConfig)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const saveConfig = async () => {
    if (!config) return
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/admin/matching/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      if (res.ok) setSaved(true)
    } catch (err) {
      console.error('Failed to save config:', err)
    } finally {
      setSaving(false)
    }
  }

  const updateWeight = (pillar: PillarType, value: number) => {
    if (!config) return
    setConfig({ ...config, weights: { ...config.weights, [pillar]: value } })
    setSaved(false)
  }

  const updateThreshold = (key: keyof MatchingConfig['thresholds'], value: number) => {
    if (!config) return
    setConfig({ ...config, thresholds: { ...config.thresholds, [key]: value } })
    setSaved(false)
  }

  const toggleHardStop = (questionId: string) => {
    if (!config) return
    const hs = config.hardStopQuestions.includes(questionId)
      ? config.hardStopQuestions.filter((q) => q !== questionId)
      : [...config.hardStopQuestions, questionId]
    setConfig({ ...config, hardStopQuestions: hs })
    setSaved(false)
  }

  if (loading) return <div style={{ color: 'var(--color-text-tertiary)', padding: 'var(--space-8)' }}>Loading...</div>
  if (!config) return <div style={{ color: 'var(--color-error)', padding: 'var(--space-8)' }}>Failed to load config</div>

  const weightsTotal = Object.values(config.weights).reduce((s, v) => s + v, 0)
  const weightsValid = Math.abs(weightsTotal - 100) < 0.01

  const sectionStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-5)',
    marginBottom: 'var(--space-4)',
  }

  const sectionTitle: React.CSSProperties = {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-semibold)',
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--space-4)',
    textTransform: 'uppercase',
    letterSpacing: 'var(--tracking-wider)',
  }

  return (
    <>
      <AdminPageHeader
        title="Matching Engine"
        breadcrumbs={[{ label: 'Matching' }]}
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <a
              href="/admin/matching/questions"
              style={{
                padding: 'var(--space-2) var(--space-4)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                backgroundColor: 'transparent',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Manage Questions
            </a>
            <button
              onClick={saveConfig}
              disabled={saving || !weightsValid}
              style={{
                padding: 'var(--space-2) var(--space-5)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-semibold)',
                backgroundColor: saved ? 'var(--color-success)' : 'var(--color-primary)',
                color: 'var(--color-white)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: saving || !weightsValid ? 'not-allowed' : 'pointer',
                opacity: saving || !weightsValid ? 0.5 : 1,
              }}
            >
              {saving ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
            </button>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        {/* Pillar Weights */}
        <div style={sectionStyle}>
          <h3 style={sectionTitle}>Pillar Weights</h3>
          <div style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)', color: weightsValid ? 'var(--color-success)' : 'var(--color-error)' }}>
            Total: {weightsTotal}% {weightsValid ? '' : '(must equal 100%)'}
          </div>
          {PILLAR_CONFIGS.map((pillar) => (
            <div key={pillar.id} style={{ marginBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                <label style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{pillar.name}</label>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>
                  {config.weights[pillar.id]}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={config.weights[pillar.id]}
                onChange={(e) => updateWeight(pillar.id, parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-primary)' }}
              />
            </div>
          ))}
        </div>

        {/* Thresholds + Hard Stops */}
        <div>
          <div style={sectionStyle}>
            <h3 style={sectionTitle}>Alignment Thresholds</h3>
            {(['excellent', 'strong', 'moderate', 'low'] as const).map((tier) => (
              <div key={tier} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                <label style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>
                  {tier} (≥)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={config.thresholds[tier]}
                  onChange={(e) => updateThreshold(tier, parseInt(e.target.value) || 0)}
                  style={{
                    width: '80px',
                    padding: 'var(--space-1) var(--space-2)',
                    fontSize: 'var(--text-sm)',
                    backgroundColor: 'var(--color-bg-tertiary)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    textAlign: 'center',
                    outline: 'none',
                  }}
                />
              </div>
            ))}
          </div>

          <div style={sectionStyle}>
            <h3 style={sectionTitle}>Hard Stop Questions</h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-3)' }}>
              Maximum distance on these questions auto-disqualifies a match regardless of overall score.
            </p>
            {PILLAR_CONFIGS.flatMap((pillar) =>
              pillar.questions.map((q) => (
                <label
                  key={q.id}
                  style={{
                    display: 'flex',
                    gap: 'var(--space-2)',
                    alignItems: 'flex-start',
                    padding: 'var(--space-1) 0',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={config.hardStopQuestions.includes(q.id)}
                    onChange={() => toggleHardStop(q.id)}
                    style={{ marginTop: '3px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>
                    <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>[{pillar.name}]</span>{' '}
                    {q.title}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
