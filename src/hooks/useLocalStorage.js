// src\hooks\useLocalStorage.js
/**
 * useLocalStorage Hook
 * Hook لإدارة LocalStorage بشكل reactive
 */

import { useState, useEffect, useCallback } from 'react'
import { getStorageItem, setStorageItem, removeStorageItem } from '@/utils/helpers'

/**
 * Use LocalStorage with React state
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value if key doesn't exist
 * @returns {[value, setValue, removeValue]} State value, setter, and remover
 */
export function useLocalStorage(key, initialValue) {
    // State to store our value
    const [storedValue, setStoredValue] = useState(() => {
        return getStorageItem(key, initialValue)
    })

    // Return a wrapped version of useState's setter function that
    // persists the new value to localStorage
    const setValue = useCallback((value) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value

            // Save state
            setStoredValue(valueToStore)

            // Save to local storage
            setStorageItem(key, valueToStore)
        } catch {
            // Error setting localStorage - silently fail
        }
    }, [key, storedValue])

    // Remove value from storage
    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue)
            removeStorageItem(key)
        } catch {
            // Error removing localStorage - silently fail
        }
    }, [key, initialValue])

    // Listen to storage changes from other tabs/windows
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(e.newValue))
                } catch {
                    setStoredValue(e.newValue)
                }
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [key])

    return [storedValue, setValue, removeValue]
}
