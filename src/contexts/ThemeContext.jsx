// src\contexts\ThemeContext.jsx
/**
 * Theme Context
 * إدارة حالة الثيم (Light/Dark Mode)
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { STORAGE_KEYS } from '@/config/constants'
import { getStorageItem, setStorageItem } from '@/utils/helpers'

// ═══════════════════════════════════════════════════════════
// Context Creation
// ═══════════════════════════════════════════════════════════

const ThemeContext = createContext(null)

// ═══════════════════════════════════════════════════════════
// Provider Component
// ═══════════════════════════════════════════════════════════

export function ThemeProvider({ children }) {
    // State
    const [theme, setTheme] = useState('light')

    // ─────────────────────────────────────────────────────────
    // Apply theme to document
    // ─────────────────────────────────────────────────────────

    const applyTheme = useCallback((newTheme) => {
        const root = document.documentElement

        if (newTheme === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
    }, [])

    // ─────────────────────────────────────────────────────────
    // Initialize theme from storage or system preference
    // ─────────────────────────────────────────────────────────

    useEffect(() => {
        const initTheme = () => {
            // Check storage first
            const storedTheme = getStorageItem(STORAGE_KEYS.THEME)

            if (storedTheme) {
                setTheme(storedTheme)
                applyTheme(storedTheme)
                return
            }

            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            const systemTheme = prefersDark ? 'dark' : 'light'

            setTheme(systemTheme)
            applyTheme(systemTheme)
        }

        initTheme()
    }, [applyTheme])

    // ─────────────────────────────────────────────────────────
    // Toggle theme
    // ─────────────────────────────────────────────────────────

    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        applyTheme(newTheme)
        setStorageItem(STORAGE_KEYS.THEME, newTheme)
    }, [theme])

    // ─────────────────────────────────────────────────────────
    // Set specific theme
    // ─────────────────────────────────────────────────────────

    const setThemeMode = useCallback((newTheme) => {
        if (newTheme !== 'light' && newTheme !== 'dark') {
            // Invalid theme - use default
            return
        }

        setTheme(newTheme)
        applyTheme(newTheme)
        setStorageItem(STORAGE_KEYS.THEME, newTheme)
    }, [applyTheme])

    // ─────────────────────────────────────────────────────────
    // Context Value
    // ─────────────────────────────────────────────────────────

    const value = {
        theme,
        isDark: theme === 'dark',
        isLight: theme === 'light',
        toggleTheme,
        setTheme: setThemeMode,
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

// ═══════════════════════════════════════════════════════════
// Hook
// ═══════════════════════════════════════════════════════════

export function useTheme() {
    const context = useContext(ThemeContext)

    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }

    return context
}

export default ThemeContext
