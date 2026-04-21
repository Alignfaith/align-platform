'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'

type Theme = 'light'

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
    mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
    // Dark mode disabled — always force light theme
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'light')
        // Clear any stored dark preference from previous sessions
        localStorage.removeItem('align-theme')
    }, [])

    return (
        <ThemeContext.Provider value={{
            theme: 'light',
            toggleTheme: () => {},
            setTheme: () => {},
            mounted: true,
        }}>
            {children}
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
