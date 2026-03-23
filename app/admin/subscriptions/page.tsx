'use client'

import { useEffect, useState, useCallback } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable, { Column } from '@/components/admin/DataTable'
import PaginationControls from '@/components/admin/PaginationControls'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

interface Tier {
  id: string
  name: string
  userCount: number
  price: string
  features: string
}

interface PromoCode {
  id: string
  code: string
  description: string | null
  discountType: string
  discountValue: number
  maxUses: number | null
  usageCount: number
  validFrom: string
  validUntil: string | null
  isActive: boolean
  createdAt: string
}

export default function SubscriptionsPage() {
  const [tab, setTab] = useState<'tiers' | 'promos'>('tiers')
  const [tiers, setTiers] = useState<Tier[]>([])
  const [promos, setPromos] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [promoPage, setPromoPage] = useState(1)
  const [promoTotal, setPromoTotal] = useState(0)
  const [promoTotalPages, setPromoTotalPages] = useState(1)
  const [showPromoForm, setShowPromoForm] = useState(false)
  const [promoForm, setPromoForm] = useState({ code: '', description: '', discountType: 'percentage', discountValue: '', maxUses: '' })
  const [saving, setSaving] = useState(false)
  const [editingTier, setEditingTier] = useState<string | null>(null)
  const [tierForm, setTierForm] = useState({ price: '', features: '' })
  const [deleteTarget, setDeleteTarget] = useState<PromoCode | null>(null)

  const fetchTiers = async () => {
    try {
      const res = await fetch('/api/admin/subscriptions/tiers')
      const data = await res.json()
      setTiers(data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchPromos = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/subscriptions/promos?page=${promoPage}`)
      const data = await res.json()
      setPromos(data.items)
      setPromoTotal(data.totalItems)
      setPromoTotalPages(data.totalPages)
    } catch (err) {
      console.error(err)
    }
  }, [promoPage])

  useEffect(() => {
    Promise.all([fetchTiers(), fetchPromos()]).finally(() => setLoading(false))
  }, [fetchPromos])

  const saveTier = async (tierId: string) => {
    setSaving(true)
    try {
      await fetch('/api/admin/subscriptions/tiers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId, price: tierForm.price, features: tierForm.features }),
      })
      setEditingTier(null)
      await fetchTiers()
    } finally {
      setSaving(false)
    }
  }

  const createPromo = async () => {
    setSaving(true)
    try {
      await fetch('/api/admin/subscriptions/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoForm.code,
          description: promoForm.description || undefined,
          discountType: promoForm.discountType,
          discountValue: parseFloat(promoForm.discountValue),
          maxUses: promoForm.maxUses ? parseInt(promoForm.maxUses) : undefined,
        }),
      })
      setPromoForm({ code: '', description: '', discountType: 'percentage', discountValue: '', maxUses: '' })
      setShowPromoForm(false)
      await fetchPromos()
    } finally {
      setSaving(false)
    }
  }

  const togglePromo = async (id: string, isActive: boolean) => {
    await fetch('/api/admin/subscriptions/promos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isActive: !isActive }),
    })
    await fetchPromos()
  }

  const deletePromo = async () => {
    if (!deleteTarget) return
    await fetch(`/api/admin/subscriptions/promos?id=${deleteTarget.id}`, { method: 'DELETE' })
    setDeleteTarget(null)
    await fetchPromos()
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: 'var(--space-2) var(--space-4)',
    fontSize: 'var(--text-sm)',
    fontWeight: active ? 'var(--font-semibold)' : 'var(--font-normal)',
    color: active ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
    backgroundColor: active ? 'var(--color-bg-elevated)' : 'transparent',
    border: active ? '1px solid var(--color-border-subtle)' : '1px solid transparent',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
  })

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: 'var(--space-2) var(--space-3)',
    fontSize: 'var(--text-sm)',
    backgroundColor: 'var(--color-bg-tertiary)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text-primary)',
    outline: 'none',
    fontFamily: 'var(--font-body)',
  }

  const promoColumns: Column<PromoCode>[] = [
    {
      key: 'code', label: 'Code',
      render: (p) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-semibold)' }}>{p.code}</span>,
    },
    {
      key: 'discountType', label: 'Discount',
      render: (p) => (
        <span>
          {p.discountType === 'percentage' ? `${p.discountValue}%` : p.discountType === 'fixed' ? `$${p.discountValue}` : `${p.discountValue} days`}
        </span>
      ),
    },
    {
      key: 'usageCount', label: 'Usage',
      render: (p) => <span>{p.usageCount}{p.maxUses ? ` / ${p.maxUses}` : ''}</span>,
    },
    {
      key: 'isActive', label: 'Status',
      render: (p) => (
        <span style={{ color: p.isActive ? 'var(--color-success)' : 'var(--color-text-tertiary)' }}>
          {p.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions', label: '', width: '140px',
      render: (p) => (
        <div style={{ display: 'flex', gap: 'var(--space-1)' }} onClick={(ev) => ev.stopPropagation()}>
          <button onClick={() => togglePromo(p.id, p.isActive)} style={{ padding: '2px 8px', fontSize: 'var(--text-xs)', backgroundColor: 'transparent', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
            {p.isActive ? 'Disable' : 'Enable'}
          </button>
          <button onClick={() => setDeleteTarget(p)} style={{ padding: '2px 8px', fontSize: 'var(--text-xs)', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--color-error)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
            Delete
          </button>
        </div>
      ),
    },
  ]

  if (loading) return <div style={{ color: 'var(--color-text-tertiary)', padding: 'var(--space-8)' }}>Loading...</div>

  return (
    <>
      <AdminPageHeader title="Subscriptions" breadcrumbs={[{ label: 'Subscriptions' }]} />

      <div style={{ display: 'flex', gap: 'var(--space-1)', marginBottom: 'var(--space-6)' }}>
        <button style={tabStyle(tab === 'tiers')} onClick={() => setTab('tiers')}>Tiers</button>
        <button style={tabStyle(tab === 'promos')} onClick={() => setTab('promos')}>Promo Codes ({promoTotal})</button>
      </div>

      {tab === 'tiers' && (
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          {tiers.map((tier) => (
            <div
              key={tier.id}
              style={{
                flex: '1 1 280px',
                maxWidth: '360px',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--color-text-primary)' }}>{tier.name}</h3>
                <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary)' }}>${tier.price}</span>
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
                <strong>{tier.userCount}</strong> users
              </div>
              {editingTier === tier.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <input value={tierForm.price} onChange={(e) => setTierForm({ ...tierForm, price: e.target.value })} placeholder="Price" style={inputStyle} />
                  <textarea value={tierForm.features} onChange={(e) => setTierForm({ ...tierForm, features: e.target.value })} placeholder="Features (comma separated)" rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button onClick={() => saveTier(tier.id)} disabled={saving} style={{ padding: 'var(--space-1) var(--space-3)', fontSize: 'var(--text-xs)', backgroundColor: 'var(--color-primary)', color: 'var(--color-white)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => setEditingTier(null)} style={{ padding: 'var(--space-1) var(--space-3)', fontSize: 'var(--text-xs)', backgroundColor: 'transparent', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-3)' }}>
                    {tier.features}
                  </p>
                  <button
                    onClick={() => { setEditingTier(tier.id); setTierForm({ price: tier.price, features: tier.features }) }}
                    style={{ padding: 'var(--space-1) var(--space-3)', fontSize: 'var(--text-xs)', backgroundColor: 'transparent', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'promos' && (
        <>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <button
              onClick={() => setShowPromoForm(!showPromoForm)}
              style={{ padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', backgroundColor: 'var(--color-primary)', color: 'var(--color-white)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
            >
              {showPromoForm ? 'Cancel' : 'New Promo Code'}
            </button>
          </div>

          {showPromoForm && (
            <div style={{ backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <input placeholder="Code (e.g. FAITH20)" value={promoForm.code} onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value })} style={inputStyle} />
                <input placeholder="Description (optional)" value={promoForm.description} onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })} style={inputStyle} />
                <select value={promoForm.discountType} onChange={(e) => setPromoForm({ ...promoForm, discountType: e.target.value })} style={inputStyle}>
                  <option value="percentage">Percentage Off</option>
                  <option value="fixed">Fixed Amount Off</option>
                  <option value="trial_extension">Trial Extension (days)</option>
                </select>
                <input placeholder="Value" type="number" value={promoForm.discountValue} onChange={(e) => setPromoForm({ ...promoForm, discountValue: e.target.value })} style={inputStyle} />
                <input placeholder="Max Uses (optional)" type="number" value={promoForm.maxUses} onChange={(e) => setPromoForm({ ...promoForm, maxUses: e.target.value })} style={inputStyle} />
              </div>
              <button
                onClick={createPromo}
                disabled={saving || !promoForm.code || !promoForm.discountValue}
                style={{ marginTop: 'var(--space-3)', padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', backgroundColor: 'var(--color-primary)', color: 'var(--color-white)', border: 'none', borderRadius: 'var(--radius-md)', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving || !promoForm.code || !promoForm.discountValue ? 0.5 : 1 }}
              >
                {saving ? 'Creating...' : 'Create Promo Code'}
              </button>
            </div>
          )}

          <DataTable<PromoCode>
            columns={promoColumns}
            data={promos}
            keyField="id"
            emptyMessage="No promo codes"
          />
          <PaginationControls page={promoPage} totalPages={promoTotalPages} totalItems={promoTotal} onPageChange={setPromoPage} />
        </>
      )}

      {deleteTarget && (
        <ConfirmDialog
          open={true}
          title="Delete Promo Code"
          message={`Delete promo code "${deleteTarget.code}"? This cannot be undone.`}
          confirmLabel="Delete"
          confirmVariant="danger"
          onConfirm={deletePromo}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  )
}
