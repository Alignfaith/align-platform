'use client'

export interface FilterOption {
  label: string
  value: string
}

export interface FilterConfig {
  key: string
  label: string
  options: FilterOption[]
}

interface FilterBarProps {
  filters: FilterConfig[]
  values: Record<string, string>
  onChange: (key: string, value: string) => void
  onClear: () => void
}

export default function FilterBar({ filters, values, onChange, onClear }: FilterBarProps) {
  const hasFilters = Object.values(values).some((v) => v !== '')

  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-3)',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      {filters.map((filter) => (
        <select
          key={filter.key}
          value={values[filter.key] ?? ''}
          onChange={(e) => onChange(filter.key, e.target.value)}
          style={{
            padding: 'var(--space-1) var(--space-3)',
            fontSize: 'var(--text-sm)',
            backgroundColor: 'var(--color-bg-tertiary)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: values[filter.key] ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="">{filter.label}</option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
      {hasFilters && (
        <button
          onClick={onClear}
          style={{
            padding: 'var(--space-1) var(--space-3)',
            fontSize: 'var(--text-xs)',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--color-primary)',
            cursor: 'pointer',
            fontWeight: 'var(--font-medium)',
          }}
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
