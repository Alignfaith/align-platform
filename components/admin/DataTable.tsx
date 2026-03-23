'use client'

import { useState } from 'react'

export interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyField: string
  loading?: boolean
  selectable?: boolean
  selectedIds?: Set<string>
  onSelectionChange?: (ids: Set<string>) => void
  onRowClick?: (item: T) => void
  emptyMessage?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  loading = false,
  selectable = false,
  selectedIds,
  onSelectionChange,
  onRowClick,
  emptyMessage = 'No data found',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        if (aVal == null) return 1
        if (bVal == null) return -1
        const cmp = String(aVal).localeCompare(String(bVal))
        return sortDir === 'asc' ? cmp : -cmp
      })
    : data

  const toggleAll = () => {
    if (!onSelectionChange) return
    if (selectedIds && selectedIds.size === data.length) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(data.map(d => String(d[keyField]))))
    }
  }

  const toggleOne = (id: string) => {
    if (!onSelectionChange || !selectedIds) return
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onSelectionChange(next)
  }

  const cellStyle: React.CSSProperties = {
    padding: 'var(--space-3) var(--space-4)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    borderBottom: '1px solid var(--color-border-subtle)',
    verticalAlign: 'middle',
  }

  const headerStyle: React.CSSProperties = {
    ...cellStyle,
    color: 'var(--color-text-tertiary)',
    fontSize: 'var(--text-xs)',
    fontWeight: 'var(--font-semibold)',
    textTransform: 'uppercase',
    letterSpacing: 'var(--tracking-wider)',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    backgroundColor: 'var(--color-bg-secondary)',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'auto',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {selectable && (
              <th style={{ ...headerStyle, width: '40px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={selectedIds ? selectedIds.size === data.length && data.length > 0 : false}
                  onChange={toggleAll}
                  style={{ cursor: 'pointer' }}
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  ...headerStyle,
                  width: col.width,
                  cursor: col.sortable ? 'pointer' : 'default',
                }}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                {col.label}
                {col.sortable && sortKey === col.key && (
                  <span style={{ marginLeft: '4px' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                style={{ ...cellStyle, textAlign: 'center', padding: 'var(--space-8)' }}
              >
                Loading...
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                style={{ ...cellStyle, textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-tertiary)' }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((item) => {
              const id = String(item[keyField])
              return (
                <tr
                  key={id}
                  style={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background-color var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-bg-tertiary)'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                  }}
                  onClick={() => onRowClick?.(item)}
                >
                  {selectable && (
                    <td style={{ ...cellStyle, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds?.has(id) ?? false}
                        onChange={() => toggleOne(id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} style={cellStyle}>
                      {col.render ? col.render(item) : String(item[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
