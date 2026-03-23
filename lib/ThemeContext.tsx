'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
    mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'rooted-theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('dark')
    const [mounted, setMounted] = useState(false)

    // Initialize theme from localStorage or system preference
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY) as Theme | null

        if (stored) {
            setThemeState(stored)
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setThemeState(prefersDark ? 'dark' : 'light')
        }

        setMounted(true)
    }, [])

    // Apply theme to document
    useEffect(() => {
        if (!mounted) return

        const root = document.documentElement
        root.setAttribute('data-theme', theme)

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, theme)
    }, [theme, mounted])

    // Listen for system preference changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleChange = (e: MediaQueryListEvent) => {
            // Only update if user hasn't explicitly set a preference
            if (!localStorage.getItem(STORAGE_KEY)) {
                setThemeState(e.matches ? 'dark' : 'light')
            }
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    const toggleTheme = () => {
        setThemeState(prev => prev === 'dark' ? 'light' : 'dark')
    }

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, mounted }}>
            <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
                {children}
            </div>
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
