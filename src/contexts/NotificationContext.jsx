// src\contexts\NotificationContext.jsx
/**
 * Notification Context
 * إدارة حالة الإشعارات والرسائل (Toast/Snackbar)
 */

import { createContext, useContext, useState, useCallback } from 'react'
import { nanoid } from 'nanoid'

// ═══════════════════════════════════════════════════════════
// Context Creation
// ═══════════════════════════════════════════════════════════

const NotificationContext = createContext(null)

// ═══════════════════════════════════════════════════════════
// Provider Component
// ═══════════════════════════════════════════════════════════

export function NotificationProvider({ children }) {
    // State: Array of notifications
    const [notifications, setNotifications] = useState([])

    // ─────────────────────────────────────────────────────────
    // Remove Notification
    // ─────────────────────────────────────────────────────────

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }, [])

    // ─────────────────────────────────────────────────────────
    // Add Notification
    // ─────────────────────────────────────────────────────────

    const addNotification = useCallback((notification) => {
        const id = nanoid()
        // Ensure message is always a string to avoid circular reference errors
        const message = notification?.message
            ? (typeof notification.message === 'string' ? notification.message : String(notification.message))
            : ''
        
        const newNotification = {
            id,
            type: 'info', // default type
            duration: 5000, // default duration (5 seconds)
            ...notification,
            message, // Override with safe string
        }

        setNotifications(prev => [...prev, newNotification])

        // Auto remove after duration
        if (newNotification.duration > 0) {
            setTimeout(() => {
                removeNotification(id)
            }, newNotification.duration)
        }

        return id
    }, [removeNotification])

    // ─────────────────────────────────────────────────────────
    // Clear All Notifications
    // ─────────────────────────────────────────────────────────

    const clearAll = useCallback(() => {
        setNotifications([])
    }, [])

    // ─────────────────────────────────────────────────────────
    // Shorthand Methods
    // ─────────────────────────────────────────────────────────

    const success = useCallback((message, options = {}) => {
        return addNotification({
            type: 'success',
            message,
            ...options,
        })
    }, [addNotification])

    const error = useCallback((message, options = {}) => {
        return addNotification({
            type: 'error',
            message,
            duration: 7000, // Errors stay longer
            ...options,
        })
    }, [addNotification])

    const warning = useCallback((message, options = {}) => {
        return addNotification({
            type: 'warning',
            message,
            ...options,
        })
    }, [addNotification])

    const info = useCallback((message, options = {}) => {
        return addNotification({
            type: 'info',
            message,
            ...options,
        })
    }, [addNotification])

    // ─────────────────────────────────────────────────────────
    // Context Value
    // ─────────────────────────────────────────────────────────

    const value = {
        notifications,
        addNotification,
        removeNotification,
        clearAll,
        success,
        error,
        warning,
        info,
    }

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    )
}

// ═══════════════════════════════════════════════════════════
// Hook
// ═══════════════════════════════════════════════════════════

export function useNotification() {
    const context = useContext(NotificationContext)

    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider')
    }

    return context
}

export default NotificationContext
