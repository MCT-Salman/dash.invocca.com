/**
 * useMediaQuery Hook
 * Hook للتحقق من Media Queries
 */

import { useState, useEffect } from 'react'

/**
 * Check if media query matches
 * @param {string} query - Media query string
 * @returns {boolean} True if matches
 */
export function useMediaQuery(query) {
    const [matches, setMatches] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches
        }
        return false
    })

    useEffect(() => {
        if (typeof window === 'undefined') return

        const mediaQuery = window.matchMedia(query)

        // Update state
        setMatches(mediaQuery.matches)

        // Listen for changes
        const handler = (event) => setMatches(event.matches)

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handler)
            return () => mediaQuery.removeEventListener('change', handler)
        } else {
            // Fallback for older browsers
            mediaQuery.addListener(handler)
            return () => mediaQuery.removeListener(handler)
        }
    }, [query])

    return matches
}

// Predefined breakpoint hooks
export function useIsMobile() {
    return useMediaQuery('(max-width: 640px)')
}

export function useIsTablet() {
    return useMediaQuery('(min-width: 641px) and (max-width: 1024px)')
}

export function useIsDesktop() {
    return useMediaQuery('(min-width: 1025px)')
}

export function useIsSmallScreen() {
    return useMediaQuery('(max-width: 768px)')
}

export function useIsLargeScreen() {
    return useMediaQuery('(min-width: 1280px)')
}
