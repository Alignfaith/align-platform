'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

interface CmsPageData {
  id?: string
  title: string
  slug: string
  content: string
  description: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  showHeader: boolean
  showFooter: boolean
}

interface CmsPageEditorProps {
  pageId?: string
}

export default function CmsPageEditor({ pageId }: CmsPageEditorProps) {
  const router = useRouter()
  const isNew = !pageId

  const [form, setForm] = useState<CmsPageData>({
    title: '',
    slug: '',
    content: '',
    description: '',
    status: 'DRAFT',
    showHeader: true,
    showFooter: true,
  })
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [autoSlug, setAutoSlug] = useState(true)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')

  useEffect(() => {
    if (!isNew && pageId) {
      fetch(`/api/admin/pages?search=`)
        .then((r) => r.json())
        .then((data) => {
          const found = data.items?.find((p: CmsPageData) => p.id === pageId)
          if (found) {
            setForm({
              title: found.title,
              slug: found.slug,
              content: found.content,
              description: found.description || '',
              status: found.status,
              showHeader: found.showHeader,
              showFooter: found.showFooter,
            })
            setAutoSlug(false)
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [isNew, pageId])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: autoSlug ? generateSlug(title) : prev.slug,
    }))
  }

  const handleSave = async (publishNow?: boolean) => {
    setError('')
    setSaving(true)

    const payload = {
      ...form,
      status: publishNow ? 'PUBLISHED' : form.status,
      description: form.description || null,
    }

    try {
      const res = await fetch('/api/admin/pages', {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isNew ? payload : { id: pageId, ...payload }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save page')
      }

      router.push('/admin/pages')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

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

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 'var(--text-xs)',
    fontWeight: 'var(--font-semibold)',
    color: 'var(--color-text-secondary)',
    marginBottom: 'var(--space-1)',
    textTransform: 'uppercase',
    letterSpacing: 'var(--tracking-wide)',
  }

  if (loading) {
    return <div style={{ color: 'var(--color-text-tertiary)', padding: 'var(--space-8)' }}>Loading...</div>
  }

  return (
    <>
      <AdminPageHeader
        title={isNew ? 'New Page' : 'Edit Page'}
        breadcrumbs={[
          { label: 'Pages', href: '/admin/pages' },
          { label: isNew ? 'New' : form.title || 'Edit' },
        ]}
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              onClick={() => router.push('/admin/pages')}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                fontSize: 'var(--text-sm)',
                backgroundColor: 'transparent',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => handleSave()}
              disabled={saving || !form.title || !form.slug || !form.content}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-semibold)',
                backgroundColor: 'transparent',
                border: '1px solid var(--color-primary)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                opacity: saving || !form.title || !form.slug || !form.content ? 0.5 : 1,
              }}
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving || !form.title || !form.slug || !form.content}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-semibold)',
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-white)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                opacity: saving || !form.title || !form.slug || !form.content ? 0.5 : 1,
              }}
            >
              {form.status === 'PUBLISHED' ? 'Update & Publish' : 'Publish'}
            </button>
          </div>
        }
      />

      {error && (
        <div style={{
          padding: 'var(--space-3) var(--space-4)',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          border: '1px solid var(--color-error)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-error)',
          fontSize: 'var(--text-sm)',
          marginBottom: 'var(--space-4)',
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--space-4)' }}>
        {/* Main Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Page title"
              style={{ ...inputStyle, fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}
            />
          </div>

          {/* Slug */}
          <div>
            <label style={labelStyle}>
              URL Slug
              {autoSlug && isNew && (
                <span style={{ fontWeight: 'var(--font-normal)', textTransform: 'none', marginLeft: 'var(--space-2)', color: 'var(--color-text-tertiary)' }}>
                  (auto-generated from title)
                </span>
              )}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>/p/</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setAutoSlug(false)
                  setForm((prev) => ({ ...prev, slug: e.target.value }))
                }}
                placeholder="page-slug"
                style={{ ...inputStyle, fontFamily: 'var(--font-mono)' }}
              />
            </div>
          </div>

          {/* Content Editor with Tabs */}
          <div>
            <div style={{ display: 'flex', gap: 'var(--space-1)', marginBottom: 'var(--space-2)' }}>
              {(['edit', 'preview'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: 'var(--space-1) var(--space-3)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: activeTab === tab ? 'var(--font-semibold)' : 'var(--font-normal)',
                    backgroundColor: activeTab === tab ? 'var(--color-bg-elevated)' : 'transparent',
                    border: activeTab === tab ? '1px solid var(--color-border-subtle)' : '1px solid transparent',
                    borderRadius: 'var(--radius-md)',
                    color: activeTab === tab ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {tab}
                </button>
              ))}
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginLeft: 'auto', alignSelf: 'center' }}>
                Supports HTML
              </span>
            </div>

            {activeTab === 'edit' ? (
              <textarea
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Write your page content here. HTML is supported."
                rows={24}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-sm)',
                  lineHeight: 'var(--leading-relaxed)',
                  minHeight: '400px',
                }}
              />
            ) : (
              <div
                style={{
                  ...inputStyle,
                  minHeight: '400px',
                  padding: 'var(--space-4) var(--space-5)',
                  backgroundColor: 'var(--color-bg-elevated)',
                  lineHeight: 'var(--leading-relaxed)',
                  overflow: 'auto',
                }}
                dangerouslySetInnerHTML={{ __html: form.content || '<p style="color: var(--color-text-tertiary)">Nothing to preview</p>' }}
              />
            )}
          </div>
        </div>

        {/* Sidebar Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Status */}
          <div style={{
            backgroundColor: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
          }}>
            <label style={labelStyle}>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as CmsPageData['status'] }))}
              style={inputStyle}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* SEO */}
          <div style={{
            backgroundColor: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
          }}>
            <label style={labelStyle}>Meta Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description for search engines..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Layout Options */}
          <div style={{
            backgroundColor: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
          }}>
            <label style={{ ...labelStyle, marginBottom: 'var(--space-3)' }}>Layout</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.showHeader}
                  onChange={(e) => setForm((prev) => ({ ...prev, showHeader: e.target.checked }))}
                />
                Show Header
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.showFooter}
                  onChange={(e) => setForm((prev) => ({ ...prev, showFooter: e.target.checked }))}
                />
                Show Footer
              </label>
            </div>
          </div>

          {/* Page URL Info */}
          {form.slug && (
            <div style={{
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
            }}>
              <label style={labelStyle}>Page URL</label>
              <div style={{
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-text-secondary)',
                wordBreak: 'break-all',
              }}>
                /p/{form.slug}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
