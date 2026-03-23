'use client'

import { useState, useEffect, useRef } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
}

export default function SearchInput({ value, onChange, placeholder = 'Search...', debounceMs = 300 }: SearchInputProps) {
  const [local, setLocal] = useState(value)
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setLocal(value)
  }, [value])

  const handleChange = (val: string) => {
    setLocal(val)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onChange(val), debounceMs)
  }

  return (
    <input
      type="text"
      value={local}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        maxWidth: '320px',
        padding: 'var(--space-2) var(--space-3)',
        fontSize: 'var(--text-sm)',
        backgroundColor: 'var(--color-bg-tertiary)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--color-text-primary)',
        outline: 'none',
        transition: 'border-color var(--transition-fast)',
      }}
      onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
      onBlur={(e) => (e.target.style.borderColor = 'var(--color-border-subtle)')}
    />
  )
}
