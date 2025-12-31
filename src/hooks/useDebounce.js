/**
 * useDebounce Hook
 * Hook لتأخير تحديث القيمة (Debouncing)
 */

import { useState, useEffect } from 'react'

/**
 * Debounce a value
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {*} Debounced value
 */
export function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        // Set up the timeout
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        // Clean up the timeout if value changes before delay
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}
