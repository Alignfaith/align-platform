'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { CITIES_BY_STATE } from '@/lib/location-data'

interface Props {
  value: string
  onChange: (city: string) => void
  state: string
  disabled?: boolean
  placeholder?: string
  required?: boolean
}

export default function CityAutocomplete({
  value,
  onChange,
  state,
  disabled = false,
  placeholder = 'Enter your city',
  required = false,
}: Props) {
  const [open, setOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [highlighted, setHighlighted] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const cityList: string[] = state ? (CITIES_BY_STATE[state] ?? []) : []

  const computeSuggestions = useCallback(
    (query: string) => {
      if (!query.trim() || cityList.length === 0) {
        setSuggestions([])
        return
      }
      const q = query.toLowerCase()
      const startsWith = cityList.filter((c) => c.toLowerCase().startsWith(q))
      const contains = cityList.filter(
        (c) => !c.toLowerCase().startsWith(q) && c.toLowerCase().includes(q)
      )
      setSuggestions([...startsWith, ...contains].slice(0, 10))
    },
    [cityList]
  )

  // Recompute suggestions when state changes
  useEffect(() => {
    computeSuggestions(value)
  }, [state, computeSuggestions, value])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    onChange(v)
    computeSuggestions(v)
    setHighlighted(-1)
    setOpen(true)
  }

  const selectCity = (city: string) => {
    onChange(city)
    setSuggestions([])
    setOpen(false)
    setHighlighted(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((h) => Math.min(h + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault()
      selectCity(suggestions[highlighted])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const showDropdown = open && suggestions.length > 0

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        className="form-input"
        value={value}
        onChange={handleInput}
        onFocus={() => {
          computeSuggestions(value)
          setOpen(true)
        }}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
      />
      {showDropdown && (
        <ul
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 50,
            backgroundColor: 'white',
            border: '1px solid var(--color-rose-light)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            maxHeight: '220px',
            overflowY: 'auto',
            margin: 0,
            padding: '4px 0',
            listStyle: 'none',
          }}
        >
          {suggestions.map((city, i) => (
            <li
              key={city}
              onMouseDown={(e) => {
                e.preventDefault()
                selectCity(city)
              }}
              style={{
                padding: '8px 14px',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-charcoal)',
                backgroundColor: i === highlighted ? 'var(--color-blush)' : 'transparent',
                transition: 'background-color 0.1s',
              }}
              onMouseEnter={() => setHighlighted(i)}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
