// src\contexts\AuthContext.jsx
/**
 * Authentication Context
 * إدارة حالة المصادقة في التطبيق
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { STORAGE_KEYS, ROUTES, USER_ROLES } from '@/config/constants'
import { getStorageItem, setStorageItem, removeStorageItem } from '@/utils/helpers'
import * as authAPI from '@/api/auth'

// ═══════════════════════════════════════════════════════════
// Context Creation
// ═══════════════════════════════════════════════════════════

const AuthContext = createContext(null)

// ═══════════════════════════════════════════════════════════
// Provider Component
// ═══════════════════════════════════════════════════════════

export function AuthProvider({ children }) {
    const navigate = useNavigate()

    // State
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // ─────────────────────────────────────────────────────────
    // Initialize auth state from storage
    // ─────────────────────────────────────────────────────────

    useEffect(() => {
        const initAuth = () => {
            try {
                // Get token as raw string (not JSON.parse)
                const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
                // Get user as JSON object
                const storedUser = getStorageItem(STORAGE_KEYS.USER)

                if (storedToken && storedUser) {
                    setToken(storedToken)
                    setUser(storedUser)
                    setIsAuthenticated(true)
                }
            } catch {
                // Error initializing auth - silently fail
            } finally {
                setIsLoading(false)
            }
        }

        initAuth()
    }, [])

    // ─────────────────────────────────────────────────────────
    // Login
    // ─────────────────────────────────────────────────────────

    // ─────────────────────────────────────────────────────────
    // Helper: Navigate by Role
    // ─────────────────────────────────────────────────────────

    const navigateByRole = useCallback((role) => {
        switch (role) {
            case USER_ROLES.ADMIN:
                navigate(ROUTES.ADMIN.DASHBOARD)
                break
            case USER_ROLES.MANAGER:
                navigate(ROUTES.MANAGER.DASHBOARD)
                break
            case USER_ROLES.CLIENT:
                navigate(ROUTES.CLIENT.DASHBOARD)
                break
            case USER_ROLES.EMPLOYEE:
            case 'scanner': // Scanner role maps to employee routes
                navigate(ROUTES.EMPLOYEE.DASHBOARD)
                break
            default:
                navigate(ROUTES.HOME)
        }
    }, [navigate])

    const login = useCallback(async (phone, password) => {
        try {
            const data = await authAPI.login(phone, password)

            if (data?.data?.accessToken && data?.data?.user) {
                const { accessToken } = data.data
                const userData = data.data.user

                // Update state
                setToken(accessToken)
                setUser(userData)
                setIsAuthenticated(true)

                // Persist to storage
                // Store token as raw string (not JSON.stringify)
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
                // Store user as JSON string
                setStorageItem(STORAGE_KEYS.USER, userData)

                // Navigate based on role
                navigateByRole(userData.role)

                return { success: true, user: userData }
            }

            return { success: false, error: 'Invalid response from server' }
        } catch (error) {
            return {
                success: false,
                error: error.message || 'فشل تسجيل الدخول'
            }
        }
    }, [navigateByRole])

    // ─────────────────────────────────────────────────────────
    // Register
    // ─────────────────────────────────────────────────────────

    const register = useCallback(async (userData) => {
        try {
            const data = await authAPI.register(userData)

            if (data?.tokens?.accessToken && data?.user) {
                const { accessToken } = data.tokens
                const user = data.user

                // Update state
                setToken(accessToken)
                setUser(user)
                setIsAuthenticated(true)

                // Persist to storage
                // Store token as raw string (not JSON.stringify)
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
                // Store user as JSON string
                setStorageItem(STORAGE_KEYS.USER, user)

                // Navigate based on role
                navigateByRole(user.role)

                return { success: true, user }
            }

            return { success: false, error: 'Invalid response from server' }
        } catch (error) {
            return {
                success: false,
                error: error.message || 'فشل التسجيل'
            }
        }
    }, [navigateByRole])

    // ─────────────────────────────────────────────────────────
    // Logout
    // ─────────────────────────────────────────────────────────

    const logout = useCallback(async () => {
        try {
            await authAPI.logout()
        } catch {
            // Logout error - silently fail
        } finally {
            // Clear state
            setToken(null)
            setUser(null)
            setIsAuthenticated(false)

            // Clear storage
            removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN)
            removeStorageItem(STORAGE_KEYS.USER)

            // Navigate to login
            navigate(ROUTES.AUTH.LOGIN)
        }
    }, [navigate])

    // ─────────────────────────────────────────────────────────
    // Update Profile
    // ─────────────────────────────────────────────────────────

    const updateProfile = useCallback(async (updates) => {
        try {
            const data = await authAPI.updateProfile(updates)

            if (data?.user) {
                setUser(data.user)
                setStorageItem(STORAGE_KEYS.USER, data.user)
                return { success: true, user: data.user }
            }

            return { success: false, error: 'Invalid response from server' }
        } catch (error) {
            return {
                success: false,
                error: error.message || 'فشل تحديث الملف الشخصي'
            }
        }
    }, [])

    // ─────────────────────────────────────────────────────────
    // Refresh User Data
    // ─────────────────────────────────────────────────────────

    const refreshUser = useCallback(async () => {
        try {
            const data = await authAPI.getMe()

            if (data?.user) {
                setUser(data.user)
                setStorageItem(STORAGE_KEYS.USER, data.user)
                return { success: true, user: data.user }
            }

            return { success: false }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }, [])


    // ─────────────────────────────────────────────────────────
    // Helper: Check if user has role
    // ─────────────────────────────────────────────────────────

    const hasRole = useCallback((role) => {
        return user?.role === role
    }, [user])

    const isAdmin = useCallback(() => hasRole(USER_ROLES.ADMIN), [hasRole])
    const isManager = useCallback(() => hasRole(USER_ROLES.MANAGER), [hasRole])
    const isClient = useCallback(() => hasRole(USER_ROLES.CLIENT), [hasRole])
    const isEmployee = useCallback(() => {
        // Scanner is treated as employee
        return hasRole(USER_ROLES.EMPLOYEE) || hasRole(USER_ROLES.SCANNER)
    }, [hasRole])

    // ─────────────────────────────────────────────────────────
    // Context Value
    // ─────────────────────────────────────────────────────────

    const value = {
        // State
        user,
        token,
        isLoading,
        isAuthenticated,

        // Actions
        login,
        register,
        logout,
        updateProfile,
        refreshUser,

        // Helpers
        hasRole,
        isAdmin,
        isManager,
        isClient,
        isEmployee,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// ═══════════════════════════════════════════════════════════
// Hook
// ═══════════════════════════════════════════════════════════

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }

    return context
}

export default AuthContext
